import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { useContent } from "@/lib/admin/context";
import { getPaymentStatus, retryPayment, type PaymentStatus } from "@/lib/admin/inbox";

/* ------------------------------------------------------------------ *
 * Where the payment gateway sends the donor back to.
 *
 * The query string is only a hint — the page confirms the real outcome
 * against the API, and keeps polling briefly while a payment is still
 * settling (the bank's webhook can land a second or two after the
 * redirect does).
 * ------------------------------------------------------------------ */

type Search = {
  status?: string;
  reference?: string;
  receipt?: string;
  amount?: string;
  currency?: string;
  campaign?: string;
  reason?: string;
  cancelled?: string;
};

export const Route = createFileRoute("/donate/thank-you")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    status: search.status ? String(search.status) : undefined,
    reference: search.reference ? String(search.reference) : undefined,
    receipt: search.receipt ? String(search.receipt) : undefined,
    amount: search.amount ? String(search.amount) : undefined,
    currency: search.currency ? String(search.currency) : undefined,
    campaign: search.campaign ? String(search.campaign) : undefined,
    reason: search.reason ? String(search.reason) : undefined,
    cancelled: search.cancelled ? String(search.cancelled) : undefined,
  }),
  head: () => ({ meta: [{ title: "Thank you | Nirmala Foundation Nepal" }] }),
  component: ThankYouPage,
});

/** Poll while the payment is still in flight, then stop. */
const POLL_MS = 2500;
const MAX_POLLS = 8;

function ThankYouPage() {
  const search = useSearch({ from: "/donate/thank-you" });
  const { campaigns, settings } = useContent();

  const [payment, setPayment] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(!!search.reference);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const polls = useRef(0);

  const refresh = useCallback(async () => {
    if (!search.reference) return null;
    try {
      const p = await getPaymentStatus(search.reference);
      setPayment(p);
      setError(null);
      return p;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not look up this payment.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [search.reference]);

  useEffect(() => {
    if (!search.reference) {
      setLoading(false);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;

    const tick = async () => {
      const p = await refresh();
      if (!alive) return;
      const settling = !p || p.donationStatus === "pending";
      if (settling && polls.current < MAX_POLLS) {
        polls.current += 1;
        timer = setTimeout(tick, POLL_MS);
      }
    };
    tick();

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [refresh, search.reference]);

  const startRetry = async () => {
    if (!search.reference) return;
    setRetrying(true);
    try {
      const checkout = await retryPayment(search.reference);
      if (checkout.checkoutUrl) window.location.assign(checkout.checkoutUrl);
      else setRetrying(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not restart the payment.");
      setRetrying(false);
    }
  };

  // Trust the API when we have it; otherwise fall back to the query hint.
  const state = resolveState(payment, search);
  const campaign = campaigns.find(
    (c) => c.slug === (payment?.campaignSlug || search.campaign),
  );

  const amount =
    payment?.formattedAmount ??
    (search.amount ? formatMoney(Number(search.amount), search.currency || "NPR") : null);

  return (
    <>
      <ScrollToTop />
      <div className="relative min-h-screen grid place-items-center overflow-hidden py-28 px-6">
        <div className="absolute inset-0 aurora-soft" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-xl rounded-[2rem] border border-border bg-white p-8 sm:p-12 text-center soft-shadow-lg"
        >
          {loading ? (
            <Pending title="Confirming your payment…" text="This only takes a moment." />
          ) : state === "completed" ? (
            <Completed
              amount={amount}
              campaignTitle={payment?.campaignTitle || campaign?.title || "our work"}
              campaignColor={campaign?.color}
              receipt={payment?.receiptNo || search.receipt || ""}
              reference={payment?.reference || search.reference || ""}
              donor={payment?.donor}
              email={settings.siteName}
            />
          ) : state === "pending" ? (
            <Pending
              title="Your payment is still settling"
              text="Your bank has it — we're waiting for final confirmation. You'll get a receipt by email as soon as it clears, usually within a few minutes."
              reference={payment?.reference || search.reference}
              onRefresh={refresh}
            />
          ) : state === "cancelled" ? (
            <Failed
              icon="↩"
              tone="#6b7280"
              title="Payment cancelled"
              text="Nothing was charged. Your donation is still here if you'd like to finish it."
              reference={payment?.reference || search.reference}
              onRetry={search.reference ? startRetry : undefined}
              retrying={retrying}
            />
          ) : (
            <Failed
              icon="!"
              tone="#dc2626"
              title="That payment didn't go through"
              text={
                error ??
                "Your bank declined or interrupted the transaction. Nothing was charged — you're welcome to try again."
              }
              reference={payment?.reference || search.reference}
              onRetry={search.reference ? startRetry : undefined}
              retrying={retrying}
            />
          )}

          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/donate"
              className="rounded-full border-2 border-primary/20 px-7 py-3 font-semibold text-primary hover:bg-primary-pale transition-colors"
            >
              Back to campaigns
            </Link>
            <Link
              to="/"
              className="rounded-full bg-primary px-7 py-3 font-semibold text-white hover:-translate-y-0.5 transition-transform"
            >
              Return home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ------------------------------ States ------------------------------ */

function Completed({
  amount,
  campaignTitle,
  campaignColor,
  receipt,
  reference,
  donor,
}: {
  amount: string | null;
  campaignTitle: string;
  campaignColor?: string;
  receipt: string;
  reference: string;
  donor?: string;
  email?: string;
}) {
  return (
    <>
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-light"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2D7A4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </motion.div>

      <h1 className="font-display text-3xl font-semibold mt-6">
        Thank you{donor && donor !== "Anonymous" ? `, ${donor.split(" ")[0]}` : ""}. 💜
      </h1>
      <p className="mt-3 text-text/75 leading-relaxed">
        {amount && (
          <>
            Your gift of <strong className="text-ink">{amount}</strong> to{" "}
          </>
        )}
        <strong className="text-ink" style={campaignColor ? { color: campaignColor } : undefined}>
          {campaignTitle}
        </strong>{" "}
        has been received. A receipt is on its way to your inbox.
      </p>

      {(receipt || reference) && (
        <dl className="mt-7 rounded-2xl bg-primary-pale/40 p-5 space-y-2 text-sm text-left">
          {receipt && (
            <div className="flex justify-between gap-4">
              <dt className="text-text/65">Receipt no.</dt>
              <dd className="font-mono-stat font-semibold text-ink">{receipt}</dd>
            </div>
          )}
          {reference && (
            <div className="flex justify-between gap-4">
              <dt className="text-text/65">Reference</dt>
              <dd className="font-mono-stat text-ink">{reference}</dd>
            </div>
          )}
        </dl>
      )}

      <p className="mt-5 text-xs text-text/55">
        Keep your receipt number — quote it if you ever need to ask us about this gift.
      </p>
    </>
  );
}

function Pending({
  title,
  text,
  reference,
  onRefresh,
}: {
  title: string;
  text: string;
  reference?: string;
  onRefresh?: () => void;
}) {
  return (
    <>
      <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary-pale border-t-primary" />
      <h1 className="font-display text-2xl font-semibold mt-6">{title}</h1>
      <p className="mt-3 text-text/75 leading-relaxed">{text}</p>
      {reference && (
        <p className="mt-5 font-mono-stat text-sm text-text/60">
          Reference <span className="text-ink">{reference}</span>
        </p>
      )}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="mt-5 text-sm font-semibold text-primary underline underline-offset-4"
        >
          Check again
        </button>
      )}
    </>
  );
}

function Failed({
  icon,
  tone,
  title,
  text,
  reference,
  onRetry,
  retrying,
}: {
  icon: string;
  tone: string;
  title: string;
  text: string;
  reference?: string;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <>
      <div
        className="mx-auto grid h-20 w-20 place-items-center rounded-full text-3xl font-bold"
        style={{ background: `${tone}18`, color: tone }}
      >
        {icon}
      </div>
      <h1 className="font-display text-2xl font-semibold mt-6">{title}</h1>
      <p className="mt-3 text-text/75 leading-relaxed">{text}</p>
      {reference && (
        <p className="mt-5 font-mono-stat text-sm text-text/60">
          Reference <span className="text-ink">{reference}</span>
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={retrying}
          className={`mt-6 rounded-full px-7 py-3 font-semibold transition-all ${
            retrying
              ? "bg-border text-text/40 cursor-not-allowed"
              : "bg-accent text-white hover:-translate-y-0.5 shadow-[0_18px_40px_-12px_rgba(249,115,22,0.55)]"
          }`}
        >
          {retrying ? "Restarting…" : "Try the payment again →"}
        </button>
      )}
    </>
  );
}

/* ------------------------------ Helpers ------------------------------ */

type State = "completed" | "pending" | "cancelled" | "failed";

function resolveState(payment: PaymentStatus | null, search: Search): State {
  const raw = (payment?.donationStatus ?? search.status ?? "").toLowerCase();
  if (raw === "completed" || raw === "success") return "completed";
  if (raw === "pending" || raw === "initiated") return "pending";
  if (raw === "cancelled" || search.cancelled === "1") return "cancelled";
  return "failed";
}

function formatMoney(amount: number, currency: string) {
  if (!Number.isFinite(amount)) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}
