import { useSyncExternalStore } from "react";
import { http } from "@/lib/api";

/* ------------------------------------------------------------------ *
 * Inbox data — contact submissions & donation records — backed by the
 * REST API. Admin pages read via the hooks; the public contact form and
 * donate flow write via addSubmission / submitDonation.
 * ------------------------------------------------------------------ */

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  replied?: boolean;
};

export type Donation = {
  id: string;
  donor: string;
  email: string;
  amount: number;
  campaignSlug: string;
  campaignTitle: string;
  method: string;
  createdAt: string;
  status: "completed" | "pending" | "refunded";
  anonymous: boolean;
  message?: string;
};

const EMPTY: unknown[] = [];

function createResource<T>(path: string) {
  const listeners = new Set<() => void>();
  let state: T[] = [];
  let loading = false;

  const emit = () => listeners.forEach((l) => l());

  const load = async () => {
    if (loading) return;
    loading = true;
    try {
      state = await http.get<T[]>(`/${path}?limit=500&sort=-createdAt`);
      emit();
    } catch (e) {
      console.error(`load ${path}`, e);
    } finally {
      loading = false;
    }
  };

  return {
    subscribe(l: () => void) {
      listeners.add(l);
      load(); // refresh on mount
      return () => {
        listeners.delete(l);
      };
    },
    snapshot: (): T[] => state,
    server: (): T[] => EMPTY as T[],
    get: (): T[] => state,
    set(next: T[]) {
      state = next;
      emit();
    },
    reload: load,
  };
}

const submissions = createResource<ContactSubmission>("submissions");
const donations = createResource<Donation>("donations");

/* ----------------------- submissions API ------------------------- */

export function useSubmissions() {
  return useSyncExternalStore(submissions.subscribe, submissions.snapshot, submissions.server);
}

/** PUBLIC — called by the contact form. */
export async function addSubmission(input: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  return http.post<{ id: string }>("/submissions", input, { auth: false });
}

export async function markSubmissionRead(id: string, read = true) {
  await http.patch(`/submissions/${id}/read`, { read });
  submissions.set(submissions.get().map((s) => (s.id === id ? { ...s, read } : s)));
}

export async function deleteSubmission(id: string) {
  await http.delete(`/submissions/${id}`);
  submissions.set(submissions.get().filter((s) => s.id !== id));
}

/* ------------------------- donations API ------------------------- */

export function useDonations() {
  return useSyncExternalStore(donations.subscribe, donations.snapshot, donations.server);
}

/** PUBLIC — called by the donate flow (recorded as pending). */
export async function submitDonation(input: {
  donor: string;
  email?: string;
  amount: number;
  campaignSlug?: string;
  campaignTitle?: string;
  method?: string;
  anonymous?: boolean;
  message?: string;
}) {
  return http.post<{ id: string }>("/donations", input, { auth: false });
}

/** Admin — add a record directly. */
export async function addDonation(input: Omit<Donation, "id" | "createdAt">) {
  const d = await http.post<Donation>("/donations/manual", input);
  donations.set([d, ...donations.get()]);
  return d;
}

export async function updateDonationStatus(id: string, status: Donation["status"]) {
  const d = await http.patch<Donation>(`/donations/${id}`, { status });
  donations.set(donations.get().map((x) => (x.id === id ? d : x)));
}

export async function deleteDonation(id: string) {
  await http.delete(`/donations/${id}`);
  donations.set(donations.get().filter((x) => x.id !== id));
}

/* ------------------------ newsletter API ------------------------- */

/** PUBLIC — subscribe an email to the newsletter. */
export async function subscribeNewsletter(email: string, source = "footer") {
  return http.post<{ id: string }>("/newsletter", { email, source }, { auth: false });
}

