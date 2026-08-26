import { useSyncExternalStore } from "react";
import { http, getToken } from "@/lib/api";

/* ------------------------------------------------------------------ *
 * Inbox & fundraising data — contact submissions, donation records,
 * payment sessions and newsletter subscribers — backed by the REST API.
 *
 * Admin pages read via the hooks; public forms write via the exported
 * helpers (addSubmission / startDonation / subscribeNewsletter).
 * ------------------------------------------------------------------ */

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  read: boolean;
  replied: boolean;
  /** What was sent back, recorded by POST /submissions/:id/reply. */
  replyMessage: string;
  repliedAt: string | null;
};

export type DonationStatus = "pending" | "completed" | "failed" | "cancelled" | "refunded";

export type Donation = {
  id: string;
  donor: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  amount: number;
  currency: string;
  /** Amount converted to the reporting currency — what every total uses. */
  baseAmount: number;
  baseCurrency: string;
  fxRate: number;
  /** ObjectId of the linked campaign; the slug/title are denormalized above. */
  campaign: string | null;
  campaignSlug: string;
  campaignTitle: string;
  method: string;
  gateway: string;
  /** ObjectId of the latest payment attempt. */
  payment: string | null;
  reference: string;
  receiptNo: string;
  receiptSentAt: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  refundedAt: string | null;
  status: DonationStatus;
  anonymous: boolean;
  recurring: boolean;
  frequency: "one-time" | "monthly" | "quarterly" | "yearly";
  message: string;
  /** "In memory of…" / "In honour of…" */
  dedicateTo: string;
  /** Admin who confirmed an offline or unmatched payment. */
  verifiedBy: string | null;
  verifiedAt: string | null;
  /** Internal admin note, never shown publicly. */
  notes: string;
  /** Set on payments the gateway reported that we could not match. */
  source: "web" | "manual" | "gateway" | "import";
  needsReview: boolean;
  reviewNote: string;
};

export type Subscriber = {
  id: string;
  email: string;
  /** Optional — captured only where the sign-up form asks for it. */
  name: string;
  source: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
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
const subscribers = createResource<Subscriber>("newsletter");

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

/** Emails the sender and records the reply against the submission. */
export async function replyToSubmission(id: string, message: string) {
  const result = await http.post<{ sent?: boolean; skipped?: boolean }>(
    `/submissions/${id}/reply`,
    {
      message,
    },
  );
  submissions.set(
    submissions.get().map((s) => (s.id === id ? { ...s, replied: true, read: true } : s)),
  );
  return result;
}

export async function deleteSubmission(id: string) {
  await http.delete(`/submissions/${id}`);
  submissions.set(submissions.get().filter((s) => s.id !== id));
}

/* ------------------------- donations API ------------------------- */

export function useDonations() {
  return useSyncExternalStore(donations.subscribe, donations.snapshot, donations.server);
}

export const reloadDonations = donations.reload;

/** One selectable instrument on a gateway's hosted page. */
export type PaymentInstrument = {
  key: string;
  label: string;
  description: string;
  icon: "card" | "phone" | "bank" | "wallet";
  /** Card networks to display; empty for non-card instruments. */
  brands: string[];
  /** Usable by a donor paying from outside Nepal. */
  international: boolean;
};

export type PaymentGateway = {
  key: string;
  label: string;
  description: string;
  /** "redirect" sends the donor to the bank; "offline" shows transfer details. */
  kind: "redirect" | "offline";
  mode: string;
  currencies: string[];
  config: {
    merchantName?: string;
    international?: boolean;
    cardBrands?: string[];
    /** Present on redirect gateways — card first. */
    methods?: PaymentInstrument[];
    [k: string]: unknown;
  };
};

/**
 * A single row in the payment-method list.
 *
 * Gateways are flattened into their instruments so a donor picks
 * "Debit / Credit Card" directly, rather than a bank name that only implies
 * cards are accepted. Every card option still routes through its gateway.
 */
export type PayOption = {
  id: string;
  gateway: string;
  gatewayLabel: string;
  instrument?: string;
  label: string;
  description: string;
  icon: "card" | "phone" | "bank" | "wallet";
  brands: string[];
  kind: "redirect" | "offline";
  mode: string;
  currencies: string[];
  international: boolean;
};

/** Flatten the API's gateway list into the rows the donate form renders. */
export function toPayOptions(methods: PaymentMethods | null): PayOption[] {
  if (!methods) return [];

  return methods.gateways.flatMap<PayOption>((g): PayOption[] => {
    const instruments = g.config.methods ?? [];

    // Offline transfer (and any gateway without an instrument list) is one row.
    if (!instruments.length) {
      return [
        {
          id: g.key,
          gateway: g.key,
          gatewayLabel: g.label,
          label: g.label,
          description: g.description,
          icon: g.kind === "offline" ? ("bank" as const) : ("card" as const),
          brands: (g.config.cardBrands as string[]) ?? [],
          kind: g.kind,
          mode: g.mode,
          currencies: g.currencies,
          international: g.config.international !== false,
        },
      ];
    }

    return instruments.map((m) => ({
      id: `${g.key}:${m.key}`,
      gateway: g.key,
      gatewayLabel: g.label,
      instrument: m.key,
      label: m.label,
      description: m.description,
      icon: m.icon,
      brands: m.brands,
      kind: g.kind,
      mode: g.mode,
      currencies: g.currencies,
      international: m.international,
    }));
  });
}

export type PaymentMethods = {
  gateways: PaymentGateway[];
  defaultGateway: string;
  baseCurrency: string;
  supportedCurrencies: string[];
  fxRates: Record<string, number>;
};

/** PUBLIC — what the donate form should offer. Cached for the session. */
let methodsCache: Promise<PaymentMethods> | null = null;
export function getPaymentMethods() {
  if (!methodsCache) {
    methodsCache = http.get<PaymentMethods>("/payments/methods", { auth: false }).catch((e) => {
      methodsCache = null; // let a later attempt retry
      throw e;
    });
  }
  return methodsCache;
}

export type CheckoutSession = {
  gateway: string;
  gatewayLabel: string;
  kind: "redirect" | "offline";
  mode: string;
  reference: string;
  amount: number;
  currency: string;
  /** Which instrument the donor chose, echoed back. */
  instrument: string;
  /** Where to send the donor. Empty for offline transfers. */
  checkoutUrl: string;
  instructions: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branch: string;
    swift: string;
    instructions: string;
    reference: string;
    amount: number;
    currency: string;
  } | null;
  expiresAt: string;
  statusUrl: string;
};

export type StartDonationResult = {
  id: string;
  reference: string;
  status: DonationStatus;
  amount: number;
  currency: string;
  campaignSlug: string;
  campaignTitle: string;
  checkout: CheckoutSession;
};

/**
 * PUBLIC — start a donation.
 *
 * Records the (pending) donation and opens a payment session. For a redirect
 * gateway the caller should send the browser to `checkout.checkoutUrl`; for an
 * offline transfer, show `checkout.instructions`.
 */
export async function startDonation(input: {
  donor: string;
  email?: string;
  phone?: string;
  country?: string;
  amount: number;
  currency?: string;
  campaignSlug?: string;
  gateway?: string;
  instrument?: string;
  anonymous?: boolean;
  message?: string;
  dedicateTo?: string;
  recurring?: boolean;
  frequency?: string;
}) {
  return http.post<StartDonationResult>("/donations", input, { auth: false });
}

export type PaymentStatus = {
  reference: string;
  status: "initiated" | "pending" | "success" | "failed" | "cancelled" | "expired" | "refunded";
  donationStatus: DonationStatus;
  gateway: string;
  amount: number;
  currency: string;
  formattedAmount: string;
  campaignSlug: string;
  campaignTitle: string;
  donor: string;
  receiptNo: string;
  checkoutUrl: string;
  expiresAt: string;
  completedAt: string | null;
};

/** PUBLIC — poll a payment by its reference (used by the thank-you page). */
export async function getPaymentStatus(reference: string) {
  return http.get<PaymentStatus>(`/payments/${encodeURIComponent(reference)}/status`, {
    auth: false,
  });
}

/** PUBLIC — start a fresh attempt after a failed or cancelled payment. */
export async function retryPayment(reference: string, gateway?: string, instrument?: string) {
  return http.post<CheckoutSession>(
    `/payments/${encodeURIComponent(reference)}/retry`,
    { ...(gateway ? { gateway } : {}), ...(instrument ? { instrument } : {}) },
    { auth: false },
  );
}

/** Admin — record an offline gift directly. */
export async function addDonation(input: {
  donor: string;
  email?: string;
  amount: number;
  currency?: string;
  campaignSlug?: string;
  method?: string;
  status?: DonationStatus;
  anonymous?: boolean;
  message?: string;
}) {
  const d = await http.post<Donation>("/donations/manual", input);
  donations.set([d, ...donations.get()]);
  return d;
}

/** Admin — verify / refund / reopen. Routed so campaign totals stay in sync. */
export async function updateDonationStatus(id: string, status: DonationStatus) {
  const d = await http.patch<Donation>(`/donations/${id}/status`, { status });
  donations.set(donations.get().map((x) => (x.id === id ? d : x)));
  return d;
}

/** Admin — edit an unmatched gateway payment onto the right donor/campaign. */
export async function updateDonation(id: string, patch: Partial<Donation>) {
  const d = await http.patch<Donation>(`/donations/${id}`, patch);
  donations.set(donations.get().map((x) => (x.id === id ? d : x)));
  return d;
}

/** Admin — clear the review flag once an unmatched payment is attributed. */
export async function clearDonationReview(id: string, note = "") {
  return updateDonation(id, { needsReview: false, reviewNote: note });
}

export async function resendDonationReceipt(id: string) {
  return http.post<{ sent?: boolean; skipped?: boolean }>(`/donations/${id}/receipt`);
}

export async function deleteDonation(id: string) {
  await http.delete(`/donations/${id}`);
  donations.set(donations.get().filter((x) => x.id !== id));
}

export type DonationStats = {
  currency: string;
  raised: number;
  donors: number;
  count: number;
  average: number;
  pending: number;
  pendingCount: number;
  byCampaign: { slug: string; title: string; total: number; count: number }[];
  byGateway: { gateway: string; total: number; count: number }[];
  byCurrency: { currency: string; total: number; count: number }[];
  monthly: { month: string; total: number; count: number }[];
  recent: {
    donor: string;
    amount: number;
    currency: string;
    campaignTitle: string;
    date: string;
  }[];
};

export async function getDonationStats() {
  return http.get<DonationStats>("/donations/stats");
}

/** Admin — re-verify unfinished payments with the bank. */
export async function reconcilePayments() {
  const summary = await http.post<{
    checked: number;
    settled: number;
    stillPending: number;
    errors: number;
  }>("/payments/reconcile", {});
  await donations.reload();
  return summary;
}

/**
 * Admin — download the donations CSV.
 *
 * Goes through fetch rather than a plain link because the endpoint needs the
 * bearer token; the blob is handed to the browser as a file.
 */
export async function exportDonationsCsv(params: Record<string, string> = {}) {
  const base =
    (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000/api/v1";
  const qs = new URLSearchParams(params).toString();
  const token = getToken();

  const res = await fetch(`${base}/donations/export${qs ? `?${qs}` : ""}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Export failed (${res.status})`);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ------------------------ newsletter API ------------------------- */

export function useSubscribers() {
  return useSyncExternalStore(subscribers.subscribe, subscribers.snapshot, subscribers.server);
}

/** PUBLIC — subscribe an email to the newsletter. */
export async function subscribeNewsletter(email: string, source = "footer") {
  return http.post<{ id: string }>("/newsletter", { email, source }, { auth: false });
}

export async function deleteSubscriber(id: string) {
  await http.delete(`/newsletter/${id}`);
  subscribers.set(subscribers.get().filter((s) => s.id !== id));
}

export async function getNewsletterStats() {
  return http.get<{ total: number; active: number; unsubscribed: number }>("/newsletter/stats");
}

/** Copy every active subscriber address to the clipboard, comma separated. */
export async function copySubscriberEmails() {
  const list = subscribers
    .get()
    .filter((s) => s.active)
    .map((s) => s.email);
  await navigator.clipboard.writeText(list.join(", "));
  return list.length;
}
