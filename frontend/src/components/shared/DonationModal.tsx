import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useContent, type Campaign } from "@/lib/admin/context";
import {
  getPaymentMethods,
  startDonation,
  type CheckoutSession,
  type PaymentGateway,
} from "@/lib/admin/inbox";

/* ------------------------------------------------------------------ *
 * Donation modal
 *
 * Collects the gift, then hands the donor to the payment gateway.
 *
 * IMPORTANT: card details are never entered here. The bank's own hosted
 * page takes them, which is what keeps this site out of PCI scope. We
 * only ever hold a reference to the payment.
 * ------------------------------------------------------------------ */

type Step = "form" | "method" | "offline" | "redirecting";

const presetAmounts: Record<string, number[]> = {
  NPR: [500, 1000, 5000, 10000],
  USD: [10, 25, 50, 100],
  EUR: [10, 25, 50, 100],
  GBP: [10, 25, 50, 100],
  AUD: [15, 35, 75, 150],
  CAD: [15, 35, 75, 150],
  INR: [500, 1000, 2500, 5000],
  JPY: [1000, 3000, 5000, 10000],
  SGD: [15, 35, 70, 140],
  AED: [50, 100, 250, 500],
};

const MIN_AMOUNT: Record<string, number> = { NPR: 50, JPY: 100, INR: 50 };

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: currency === "JPY" ? 0 : 0,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function DonationModal({
  open,
  onClose,
  campaign,
}: {
  open: boolean;
  onClose: () => void;
  campaign?: Campaign;
}) {
  const mounted = useMounted();
  const { campaigns } = useContent();

  const givable = useMemo(
    () => campaigns.filter((c) => c.published && c.acceptsDonations !== false),
    [campaigns],
  );

  const [step, setStep] = useState<Step>("form");
  const [slug, setSlug] = useState(campaign?.slug ?? givable[0]?.slug ?? "general-fund");
  const [currency, setCurrency] = useState("NPR");
  const [amount, setAmount] = useState<number | "">(1000);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [dedicateTo, setDedicateTo] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [recurring, setRecurring] = useState(false);

  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [currencies, setCurrencies] = useState<string[]>(["NPR"]);
  const [gateway, setGateway] = useState("");
  const [checkout, setCheckout] = useState<CheckoutSession | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const picked = campaign ?? givable.find((c) => c.slug === slug) ?? givable[0];

  /* Load the gateway list once the modal is first opened. */
  useEffect(() => {
    if (!open) return;
    let alive = true;
    getPaymentMethods()
      .then((m) => {
        if (!alive) return;
        setGateways(m.gateways);
        setCurrencies(m.supportedCurrencies);
        setGateway((g) => g || m.defaultGateway);
        setCurrency((c) => (m.supportedCurrencies.includes(c) ? c : m.baseCurrency));
      })
      .catch(() => {
        if (alive) setError("Could not load payment methods. Please refresh and try again.");
      });
    return () => {
      alive = false;
    };
  }, [open]);

  /* Lock scroll + close on ESC. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  /* Reset once the close animation has finished. */
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStep("form");
      setAmount(1000);
      setName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setMessage("");
      setDedicateTo("");
      setAnonymous(false);
      setRecurring(false);
      setCheckout(null);
      setError(null);
      setSubmitting(false);
      setCopied(false);
    }, 350);
    return () => clearTimeout(t);
  }, [open]);

  /* Keep the preset amount sensible when the currency changes. */
  useEffect(() => {
    const presets = presetAmounts[currency] ?? presetAmounts.NPR;
    setAmount((a) => (typeof a === "number" && presets.includes(a) ? a : presets[1]));
  }, [currency]);

  const min = MIN_AMOUNT[currency] ?? 1;
  const formValid =
    typeof amount === "number" &&
    amount >= min &&
    (anonymous || name.trim().length > 0) &&
    /.+@.+\..+/.test(email);

  const amountStr = typeof amount === "number" ? money(amount, currency) : "—";
  const activeGateway = gateways.find((g) => g.key === gateway);

  /** Create the donation, then either redirect or show transfer details. */
  const submit = async () => {
    if (!formValid || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const result = await startDonation({
        donor: anonymous ? "Anonymous" : name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.trim(),
        amount: amount as number,
        currency,
        campaignSlug: picked?.slug,
        gateway,
        anonymous,
        message: message.trim(),
        dedicateTo: dedicateTo.trim(),
        recurring,
        frequency: recurring ? "monthly" : "one-time",
      });

      setCheckout(result.checkout);

      if (result.checkout.kind === "offline" || !result.checkout.checkoutUrl) {
        setStep("offline");
        setSubmitting(false);
        return;
      }

      // Hand the browser to the bank's hosted page.
      setStep("redirecting");
      window.location.assign(result.checkout.checkoutUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (!mounted || !picked) return null;

  const totalLine = `${amountStr} to ${picked.title}${recurring ? " · monthly" : ""}`;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-ink/70 backdrop-blur-sm grid place-items-center p-4 sm:p-6"
          onClick={step === "redirecting" ? undefined : onClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl scrollbar-thin"
          >
            <Header step={step} campaign={picked} onClose={onClose} totalLine={totalLine} />

            <div className="p-6 sm:p-8">
              {error && (
                <div className="mb-5 rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {step === "form" && (
                <FormStep
                  campaignLocked={!!campaign}
                  campaigns={givable}
                  slug={picked.slug}
                  setSlug={setSlug}
                  currency={currency}
                  setCurrency={setCurrency}
                  currencies={currencies}
                  amount={amount}
                  setAmount={setAmount}
                  min={min}
                  tiers={picked.tiers}
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  country={country}
                  setCountry={setCountry}
                  message={message}
                  setMessage={setMessage}
                  dedicateTo={dedicateTo}
                  setDedicateTo={setDedicateTo}
                  anonymous={anonymous}
                  setAnonymous={setAnonymous}
                  recurring={recurring}
                  setRecurring={setRecurring}
                  picked={picked}
                  formValid={formValid}
                  onContinue={() => setStep("method")}
                />
              )}

              {step === "method" && (
                <MethodStep
                  gateways={gateways}
                  gateway={gateway}
                  setGateway={setGateway}
                  currency={currency}
                  amountStr={amountStr}
                  submitting={submitting}
                  onBack={() => setStep("form")}
                  onPay={submit}
                />
              )}

              {step === "offline" && checkout?.instructions && (
                <OfflineStep
                  instructions={checkout.instructions}
                  copied={copied}
                  setCopied={setCopied}
                  onClose={onClose}
                />
              )}

              {step === "redirecting" && (
                <RedirectingStep gatewayLabel={activeGateway?.label ?? "your bank"} url={checkout?.checkoutUrl} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ------------------------------ Header ------------------------------ */

function Header({
  step,
  campaign,
  onClose,
  totalLine,
}: {
  step: Step;
  campaign: Campaign;
  onClose: () => void;
  totalLine: string;
}) {
  const stepLabel: Record<Step, string> = {
    form: "1 of 2 · Your gift",
    method: "2 of 2 · Payment method",
    offline: "Transfer details",
    redirecting: "Taking you to your bank",
  };
  const heading: Record<Step, string> = {
    form: "Complete your donation",
    method: "Complete your donation",
    offline: "Almost there — one transfer to go",
    redirecting: "Redirecting…",
  };

  return (
    <div className="sticky top-0 z-10 px-6 sm:px-8 pt-6 pb-5 bg-white/95 backdrop-blur border-b border-border rounded-t-3xl">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            {stepLabel[step]}
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink mt-1">{heading[step]}</h2>
          <div className="text-xs text-text/60 mt-1 truncate">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full grid place-items-center text-[10px]"
                style={{ background: `${campaign.color}22`, color: campaign.color }}
              >
                {campaign.icon}
              </span>
              {totalLine}
            </span>
          </div>
        </div>
        {step !== "redirecting" && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 w-9 h-9 rounded-full bg-primary-pale grid place-items-center text-primary hover:bg-primary hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-1.5">
        {(["form", "pay"] as const).map((s, i) => {
          const active = (s === "form" && step === "form") || (s === "pay" && step !== "form");
          const done = (s === "form" && step !== "form") || (s === "pay" && (step === "offline" || step === "redirecting"));
          return (
            <div key={s} className="h-1 rounded-full overflow-hidden bg-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: done ? "100%" : active ? "60%" : "0%" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.04 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------- Step 1 — Gift --------------------------- */

function FormStep(props: {
  campaignLocked: boolean;
  campaigns: Campaign[];
  slug: string;
  setSlug: (s: string) => void;
  currency: string;
  setCurrency: (s: string) => void;
  currencies: string[];
  amount: number | "";
  setAmount: (n: number | "") => void;
  min: number;
  tiers: Campaign["tiers"];
  name: string;
  setName: (s: string) => void;
  email: string;
  setEmail: (s: string) => void;
  phone: string;
  setPhone: (s: string) => void;
  country: string;
  setCountry: (s: string) => void;
  message: string;
  setMessage: (s: string) => void;
  dedicateTo: string;
  setDedicateTo: (s: string) => void;
  anonymous: boolean;
  setAnonymous: (b: boolean) => void;
  recurring: boolean;
  setRecurring: (b: boolean) => void;
  picked: Campaign;
  formValid: boolean;
  onContinue: () => void;
}) {
  const {
    campaignLocked, campaigns, slug, setSlug, currency, setCurrency, currencies,
    amount, setAmount, min, tiers, name, setName, email, setEmail, phone, setPhone,
    country, setCountry, message, setMessage, dedicateTo, setDedicateTo,
    anonymous, setAnonymous, recurring, setRecurring, picked, formValid, onContinue,
  } = props;

  const presets = presetAmounts[currency] ?? presetAmounts.NPR;
  // Show what this gift buys, if the campaign publishes matching tiers.
  const matchedTier =
    typeof amount === "number" && currency === "NPR"
      ? [...tiers].sort((a, b) => b.amount - a.amount).find((t) => amount >= t.amount)
      : undefined;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (formValid) onContinue();
      }}
      className="space-y-6"
    >
      {!campaignLocked && (
        <Field label="Choose a campaign">
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary bg-white"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.icon} {c.title}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Amount">
        <div className="mb-3 flex gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Currency"
            className="rounded-2xl border border-border px-3 py-3 outline-none focus:border-primary bg-white font-mono-stat text-sm font-semibold"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <input
              type="number"
              min={min}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Custom amount"
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              className={`rounded-2xl px-3 py-3 font-mono-stat font-semibold border-2 transition-colors text-sm ${
                amount === a
                  ? "bg-primary text-white border-primary"
                  : "border-border text-text hover:border-primary/40"
              }`}
            >
              {money(a, currency)}
            </button>
          ))}
        </div>
        {matchedTier && (
          <p className="mt-2.5 text-xs text-green flex items-center gap-1.5">
            <span aria-hidden>✓</span> That funds: <strong>{matchedTier.impact}</strong>
          </p>
        )}
        {currency !== "NPR" && (
          <p className="mt-2 text-[11px] text-text/55">
            Charged in {currency}. We convert to Nepali Rupees at the bank's rate on the day.
          </p>
        )}
      </Field>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label={anonymous ? "Full name (hidden publicly)" : "Full name *"}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Asha Bhandari"
            disabled={anonymous}
          />
        </Field>
        <Field label="Email *">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Phone (optional)">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977 9800000000" />
        </Field>
        <Field label="Country (optional)">
          <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Nepal" />
        </Field>
      </div>
      <Field label="Dedicate this gift (optional)">
        <Input
          value={dedicateTo}
          onChange={(e) => setDedicateTo(e.target.value)}
          placeholder="In memory of… / In honour of…"
        />
      </Field>
      <Field label="A message to the team (optional)">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary resize-none"
          placeholder="Anything you'd like us to know — share why you're giving, or who this gift is for."
        />
      </Field>

      <div className="space-y-3">
        <Toggle
          checked={recurring}
          onChange={setRecurring}
          label={
            <>
              Make this a <strong className="text-ink">monthly</strong> gift — predictable funding helps us plan
            </>
          }
        />
        <Toggle
          checked={anonymous}
          onChange={setAnonymous}
          label={
            <>
              Give <strong className="text-ink">anonymously</strong> — your name stays off the public supporter wall
            </>
          }
        />
      </div>

      <button
        type="submit"
        disabled={!formValid}
        className={`w-full rounded-full py-4 text-base font-semibold shadow-[0_18px_40px_-12px_rgba(249,115,22,0.55)] transition-all ${
          formValid
            ? "bg-accent text-white hover:-translate-y-0.5"
            : "bg-border text-text/40 cursor-not-allowed shadow-none"
        }`}
      >
        Continue to payment →
      </button>
      <p className="text-[11px] text-center text-text/55">
        Giving to <strong className="text-ink">{picked.title}</strong>. You can still go back and edit.
      </p>
    </form>
  );
}

/* -------------------------- Step 2 — Method -------------------------- */

function MethodStep({
  gateways,
  gateway,
  setGateway,
  currency,
  amountStr,
  submitting,
  onBack,
  onPay,
}: {
  gateways: PaymentGateway[];
  gateway: string;
  setGateway: (k: string) => void;
  currency: string;
  amountStr: string;
  submitting: boolean;
  onBack: () => void;
  onPay: () => void;
}) {
  const usable = gateways.filter((g) => g.currencies.includes(currency));
  const chosen = usable.find((g) => g.key === gateway);

  // Fall back to the first usable gateway if the current pick can't take this currency.
  useEffect(() => {
    if (usable.length && !usable.some((g) => g.key === gateway)) setGateway(usable[0].key);
  }, [currency, usable, gateway, setGateway]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">How would you like to pay?</h3>
        <p className="text-sm text-text/65 mt-1">
          You&apos;ll finish on your bank&apos;s own secure page — we never see or store your card details.
        </p>
      </div>

      {usable.length === 0 ? (
        <div className="rounded-2xl border border-border bg-muted/40 p-5 text-sm text-text/70">
          No payment method currently accepts {currency}. Please go back and choose another currency.
        </div>
      ) : (
        <div className="space-y-2.5">
          {usable.map((g) => {
            const active = g.key === gateway;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setGateway(g.key)}
                className={`w-full flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  active ? "border-primary bg-primary-pale/30" : "border-border hover:border-primary/40"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                    active ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">{g.label}</span>
                    {g.kind === "redirect" && (
                      <span className="rounded-full bg-green-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green">
                        Instant
                      </span>
                    )}
                    {g.mode === "mock" && (
                      <span className="rounded-full bg-accent-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                        Test mode
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-sm text-text/65">{g.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-[11px] text-text/55">
        <span>🔒 SSL secured</span>
        <span>·</span>
        <span>📧 Receipt by email</span>
        <span>·</span>
        <span>🇳🇵 NGO-registered</span>
      </div>

      <button
        onClick={onPay}
        disabled={submitting || usable.length === 0}
        className={`w-full rounded-full py-4 text-base font-semibold transition-all ${
          submitting || usable.length === 0
            ? "bg-border text-text/40 cursor-not-allowed"
            : "bg-accent text-white hover:-translate-y-0.5 shadow-[0_18px_40px_-12px_rgba(249,115,22,0.55)]"
        }`}
      >
        {submitting
          ? "Opening secure payment…"
          : chosen?.kind === "offline"
            ? `Get transfer details for ${amountStr}`
            : `Pay ${amountStr} securely →`}
      </button>

      <div className="pt-2 border-t border-border flex justify-between">
        <button onClick={onBack} className="text-sm text-text/70 hover:text-primary transition-colors">
          ← Back
        </button>
        <div className="text-[11px] text-text/55 self-center">Encrypted end-to-end</div>
      </div>
    </div>
  );
}

/* ------------------------ Offline bank transfer ------------------------ */

function OfflineStep({
  instructions,
  copied,
  setCopied,
  onClose,
}: {
  instructions: NonNullable<CheckoutSession["instructions"]>;
  copied: boolean;
  setCopied: (b: boolean) => void;
  onClose: () => void;
}) {
  const rows: [string, string][] = [
    ["Account name", instructions.accountName],
    ["Bank", instructions.bankName],
    ["Account number", instructions.accountNumber],
    ["Branch", instructions.branch],
    ["SWIFT (international)", instructions.swift],
    ["Amount", money(instructions.amount, instructions.currency)],
    ["Your reference", instructions.reference],
  ];

  const copyAll = async () => {
    await navigator.clipboard.writeText(rows.map(([k, v]) => `${k}: ${v}`).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-accent/25 bg-accent-light/40 p-4 text-sm text-text/80">
        Your donation is recorded as <strong className="text-ink">pending</strong>. Quote the reference below
        when you transfer — we&apos;ll match it and email your receipt as soon as it lands.
      </div>

      <dl className="rounded-2xl bg-primary-pale/40 p-5 space-y-2.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-text/65">{k}</dt>
            <dd className={`text-right font-medium text-ink ${k === "Your reference" ? "font-mono-stat" : ""}`}>
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-sm text-text/70 leading-relaxed">{instructions.instructions}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={copyAll}
          className="flex-1 rounded-full border-2 border-primary/20 text-primary py-3 font-semibold hover:bg-primary-pale transition-colors"
        >
          {copied ? "Copied ✓" : "Copy transfer details"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 rounded-full bg-primary text-white py-3 font-semibold hover:-translate-y-0.5 transition-transform"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/* ---------------------------- Redirecting ---------------------------- */

function RedirectingStep({ gatewayLabel, url }: { gatewayLabel: string; url?: string }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-pale border-t-primary" />
      <h3 className="font-display text-xl font-semibold mt-6">Taking you to {gatewayLabel}…</h3>
      <p className="text-text/70 mt-2 text-sm max-w-sm mx-auto">
        Complete your payment on their secure page. We&apos;ll bring you straight back with your receipt.
      </p>
      {url && (
        <a href={url} className="mt-5 inline-block text-sm font-semibold text-primary underline">
          Not redirected? Continue manually →
        </a>
      )}
    </div>
  );
}

/* ------------------------------ Helpers ------------------------------ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold mb-2 text-text/65 uppercase tracking-wider">{label}</span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary transition-colors disabled:bg-muted/50 disabled:text-text/40 ${props.className ?? ""}`}
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-border"}`}
      >
        <motion.span
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
        />
      </button>
      <span className="text-sm text-text/80">{label}</span>
    </label>
  );
}
