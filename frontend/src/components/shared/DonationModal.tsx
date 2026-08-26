import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Check,
  Copy,
  CreditCard,
  Lock,
  Mail,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { useContent, type Campaign } from "@/lib/admin/context";
import { CardBrands } from "@/components/shared/CardBrands";
import { CURRENCIES, currencyInfo, formatMoney, guessCurrency } from "@/lib/currencies";
import {
  getPaymentMethods,
  startDonation,
  toPayOptions,
  type CheckoutSession,
  type PayOption,
  type PaymentMethods,
} from "@/lib/admin/inbox";

/* ------------------------------------------------------------------ *
 * Donation modal
 *
 * Two steps: the gift, then how to pay. Card details are NEVER entered
 * here — the bank's own hosted page collects them, which is what keeps
 * this site out of PCI scope. We only ever hold a payment reference.
 * ------------------------------------------------------------------ */

type Step = "gift" | "pay" | "offline" | "redirecting";

export function DonationModal({
  open,
  onClose,
  campaign,
}: {
  open: boolean;
  onClose: () => void;
  campaign?: Campaign;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { campaigns } = useContent();
  const givable = useMemo(
    () => campaigns.filter((c) => c.published && c.acceptsDonations !== false),
    [campaigns],
  );

  const [step, setStep] = useState<Step>("gift");
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
  const [showNote, setShowNote] = useState(false);

  const [methods, setMethods] = useState<PaymentMethods | null>(null);
  /** Selected row in the payment list, e.g. "globalime:card". */
  const [option, setOption] = useState("");
  const [checkout, setCheckout] = useState<CheckoutSession | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const picked = campaign ?? givable.find((c) => c.slug === slug) ?? givable[0];
  const info = currencyInfo(currency);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Load accepted currencies + gateways, then guess the donor's currency. */
  useEffect(() => {
    if (!open) return;
    let alive = true;
    getPaymentMethods()
      .then((m) => {
        if (!alive) return;
        setMethods(m);
        setCurrency((c) =>
          c !== "NPR" ? c : guessCurrency(m.supportedCurrencies, m.baseCurrency),
        );
      })
      .catch(
        () => alive && setError("Could not load payment options. Please refresh and try again."),
      );
    return () => {
      alive = false;
    };
  }, [open]);

  /* Keep the amount sensible when the currency changes. */
  const prevCurrency = useRef(currency);
  useEffect(() => {
    if (prevCurrency.current === currency) return;
    prevCurrency.current = currency;
    setAmount(currencyInfo(currency).presets[1]);
  }, [currency]);

  /* Scroll lock + Escape. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "redirecting") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, step]);

  /* Reset after the close animation. */
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStep("gift");
      setName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setMessage("");
      setDedicateTo("");
      setAnonymous(false);
      setRecurring(false);
      setShowNote(false);
      setCheckout(null);
      setError(null);
      setSubmitting(false);
      setTouched(false);
    }, 350);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const amountValid = typeof amount === "number" && amount >= info.min;
  const nameValid = anonymous || name.trim().length > 1;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formValid = amountValid && nameValid && emailValid;

  /** What the foundation actually receives, for a non-NPR gift. */
  const baseEquivalent =
    methods && currency !== methods.baseCurrency && typeof amount === "number"
      ? Math.round(amount * (methods.fxRates[currency] ?? 0))
      : null;

  const isForeign = !!methods && currency !== methods.baseCurrency;

  /**
   * Rows the donor can pick from, narrowed to this currency. A gift in a
   * foreign currency also hides Nepal-only instruments (mobile/internet
   * banking, wallets) — offering them would only lead to a failed payment.
   */
  const options = useMemo(() => {
    const all = toPayOptions(methods).filter((o) => o.currencies.includes(currency));
    return isForeign ? all.filter((o) => o.international) : all;
  }, [methods, currency, isForeign]);

  const active = options.find((o) => o.id === option);

  /* Default to card, and re-pick if the current choice stops being valid. */
  useEffect(() => {
    if (!options.length) return;
    if (options.some((o) => o.id === option)) return;
    const card = options.find((o) => o.instrument === "card") ?? options[0];
    setOption(card.id);
  }, [options, option]);

  const submit = async () => {
    if (!formValid || submitting || !picked || !active) return;
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
        campaignSlug: picked.slug,
        gateway: active.gateway,
        instrument: active.instrument,
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
      setStep("redirecting");
      window.location.assign(result.checkout.checkoutUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (!mounted || !picked) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-ink/75 p-0 backdrop-blur-md sm:p-6"
          onClick={step === "redirecting" ? undefined : onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Make a donation"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-3xl"
          >
            <Header step={step} campaign={picked} onClose={onClose} />

            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="px-6 py-6 sm:px-8">
                {error && (
                  <div className="mb-5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {step === "gift" && (
                  <GiftStep
                    campaignLocked={!!campaign}
                    campaigns={givable}
                    picked={picked}
                    slug={picked.slug}
                    setSlug={setSlug}
                    currency={currency}
                    setCurrency={setCurrency}
                    accepted={methods?.supportedCurrencies ?? ["NPR"]}
                    amount={amount}
                    setAmount={setAmount}
                    info={info}
                    baseEquivalent={baseEquivalent}
                    baseCurrency={methods?.baseCurrency ?? "NPR"}
                    fxRates={methods?.fxRates ?? {}}
                    recurring={recurring}
                    setRecurring={setRecurring}
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
                    showNote={showNote}
                    setShowNote={setShowNote}
                    anonymous={anonymous}
                    setAnonymous={setAnonymous}
                    touched={touched}
                    amountValid={amountValid}
                    nameValid={nameValid}
                    emailValid={emailValid}
                    formValid={formValid}
                    onContinue={() => {
                      setTouched(true);
                      if (formValid) setStep("pay");
                    }}
                  />
                )}

                {step === "pay" && (
                  <PayStep
                    picked={picked}
                    amount={typeof amount === "number" ? amount : 0}
                    currency={currency}
                    baseEquivalent={baseEquivalent}
                    baseCurrency={methods?.baseCurrency ?? "NPR"}
                    recurring={recurring}
                    options={options}
                    option={option}
                    setOption={setOption}
                    active={active}
                    isForeign={isForeign}
                    submitting={submitting}
                    onBack={() => setStep("gift")}
                    onPay={submit}
                  />
                )}

                {step === "offline" && checkout?.instructions && (
                  <OfflineStep instructions={checkout.instructions} onClose={onClose} />
                )}

                {step === "redirecting" && (
                  <RedirectingStep
                    label={active?.gatewayLabel ?? "your bank"}
                    url={checkout?.checkoutUrl}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ------------------------------- Header ------------------------------- */

function Header({
  step,
  campaign,
  onClose,
}: {
  step: Step;
  campaign: Campaign;
  onClose: () => void;
}) {
  const stepIndex = step === "gift" ? 0 : 1;
  const titles: Record<Step, string> = {
    gift: "Make a donation",
    pay: "Choose how to pay",
    offline: "Complete your transfer",
    redirecting: "Taking you to your bank",
  };

  return (
    <div className="shrink-0 border-b border-border bg-white px-6 pb-4 pt-6 sm:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold leading-tight text-ink">
            {titles[step]}
          </h2>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-text/65">
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px]"
              style={{ background: `${campaign.color}1F`, color: campaign.color }}
              aria-hidden
            >
              {campaign.icon}
            </span>
            <span className="truncate">{campaign.title}</span>
          </div>
        </div>
        {step !== "redirecting" && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-text/50 transition-colors hover:bg-muted hover:text-ink"
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        )}
      </div>

      {(step === "gift" || step === "pay") && (
        <div className="mt-5 flex items-center gap-3">
          {["Your gift", "Payment"].map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold transition-colors ${
                  i < stepIndex
                    ? "bg-green text-white"
                    : i === stepIndex
                      ? "bg-primary text-white"
                      : "bg-muted text-text/50"
                }`}
              >
                {i < stepIndex ? <Check style={{ width: 11, height: 11 }} /> : i + 1}
              </span>
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${
                  i <= stepIndex ? "text-ink" : "text-text/40"
                }`}
              >
                {label}
              </span>
              {i === 0 && (
                <span className="h-px flex-1 bg-border">
                  <span
                    className="block h-px bg-primary transition-all duration-500"
                    style={{ width: stepIndex > 0 ? "100%" : "0%" }}
                  />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Step 1 ------------------------------- */

type GiftProps = {
  campaignLocked: boolean;
  campaigns: Campaign[];
  picked: Campaign;
  slug: string;
  setSlug: (s: string) => void;
  currency: string;
  setCurrency: (s: string) => void;
  accepted: string[];
  amount: number | "";
  setAmount: (n: number | "") => void;
  info: ReturnType<typeof currencyInfo>;
  baseEquivalent: number | null;
  baseCurrency: string;
  fxRates: Record<string, number>;
  recurring: boolean;
  setRecurring: (b: boolean) => void;
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
  showNote: boolean;
  setShowNote: (b: boolean) => void;
  anonymous: boolean;
  setAnonymous: (b: boolean) => void;
  touched: boolean;
  amountValid: boolean;
  nameValid: boolean;
  emailValid: boolean;
  formValid: boolean;
  onContinue: () => void;
};

function GiftStep(p: GiftProps) {
  /**
   * Campaign tiers are authored in NPR. Convert them so an overseas donor is
   * told what their own money buys, instead of an unfamiliar rupee figure.
   */
  const impact = useMemo(() => {
    if (typeof p.amount !== "number" || !p.picked.tiers.length) return null;
    const rate = p.fxRates[p.currency] ?? 1;
    const inBase = p.amount * rate;
    return (
      [...p.picked.tiers].sort((a, b) => b.amount - a.amount).find((t) => inBase >= t.amount) ??
      null
    );
  }, [p.amount, p.currency, p.fxRates, p.picked.tiers]);

  return (
    <div className="space-y-7">
      {!p.campaignLocked && (
        <Field label="Where should it go?">
          <div className="relative">
            <select
              value={p.slug}
              onChange={(e) => p.setSlug(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-white px-4 py-3 pr-10 text-sm font-medium text-ink outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              {p.campaigns.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.icon} {c.title}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </Field>
      )}

      {/* Frequency */}
      <Field label="How often?">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-1">
          {[
            { key: false, label: "One-time" },
            { key: true, label: "Monthly" },
          ].map((o) => (
            <button
              key={String(o.key)}
              type="button"
              onClick={() => p.setRecurring(o.key)}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                p.recurring === o.key
                  ? "bg-white text-ink shadow-sm"
                  : "text-text/60 hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        {p.recurring && (
          <p className="mt-2 text-xs text-text/60">
            Charged monthly. You can stop any time by replying to your receipt.
          </p>
        )}
      </Field>

      {/* Amount + currency */}
      <Field label="Amount">
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={p.currency}
              onChange={(e) => p.setCurrency(e.target.value)}
              aria-label="Currency"
              className="h-full appearance-none rounded-xl border border-border bg-white py-3 pl-3 pr-8 text-sm font-semibold text-ink outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              {p.accepted.map((code) => {
                const c = CURRENCIES[code];
                return (
                  <option key={code} value={code}>
                    {c ? `${c.flag} ${code}` : code}
                  </option>
                );
              })}
            </select>
            <Chevron small />
          </div>

          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono-stat text-lg font-semibold text-text/45">
              {p.info.symbol}
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={p.info.min}
              step="any"
              value={p.amount}
              onChange={(e) => p.setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              aria-label={`Amount in ${p.currency}`}
              className={`w-full rounded-xl border bg-white py-3 pr-4 font-mono-stat text-lg font-bold text-ink outline-none transition-colors focus:ring-4 focus:ring-primary/10 ${
                p.touched && !p.amountValid
                  ? "border-destructive"
                  : "border-border focus:border-primary"
              }`}
              style={{ paddingLeft: `${Math.max(2.75, p.info.symbol.length * 0.65 + 2)}rem` }}
            />
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-4 gap-2">
          {p.info.presets.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => p.setAmount(a)}
              className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                p.amount === a
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border text-text hover:border-primary/40 hover:bg-primary-pale/40"
              }`}
            >
              {formatMoney(a, p.currency)}
            </button>
          ))}
        </div>

        {p.touched && !p.amountValid && (
          <p className="mt-2 text-xs font-medium text-destructive">
            Minimum donation is {formatMoney(p.info.min, p.currency)}.
          </p>
        )}

        {impact && (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-green-light/50 px-3.5 py-2.5">
            <Check style={{ width: 15, height: 15 }} className="mt-0.5 shrink-0 text-green" />
            <p className="text-sm text-text/80">
              That funds <strong className="text-ink">{impact.impact.toLowerCase()}</strong>.
            </p>
          </div>
        )}

        {p.baseEquivalent ? (
          <p className="mt-2 text-xs text-text/55">
            ≈ {formatMoney(p.baseEquivalent, p.baseCurrency)} received in Nepal · converted at your
            bank&apos;s rate on the day.
          </p>
        ) : null}
      </Field>

      {/* Donor */}
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={p.anonymous ? "Your name (kept private)" : "Full name"} required>
            <Input
              value={p.name}
              onChange={(e) => p.setName(e.target.value)}
              placeholder="Asha Bhandari"
              autoComplete="name"
              invalid={p.touched && !p.nameValid}
            />
          </Field>
          <Field label="Email" required hint="Your receipt goes here.">
            <Input
              type="email"
              value={p.email}
              onChange={(e) => p.setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              invalid={p.touched && !p.emailValid}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" hint="Optional">
            <Input
              value={p.phone}
              onChange={(e) => p.setPhone(e.target.value)}
              placeholder="+977 98…"
              autoComplete="tel"
            />
          </Field>
          <Field label="Country" hint="Optional">
            <Input
              value={p.country}
              onChange={(e) => p.setCountry(e.target.value)}
              placeholder="United Kingdom"
              autoComplete="country-name"
            />
          </Field>
        </div>
      </div>

      {/* Extras, folded away so the form stays short */}
      {!p.showNote ? (
        <button
          type="button"
          onClick={() => p.setShowNote(true)}
          className="text-sm font-semibold text-primary hover:text-accent"
        >
          + Add a message or dedication
        </button>
      ) : (
        <div className="space-y-4 rounded-xl border border-border bg-muted/25 p-4">
          <Field label="Dedicate this gift" hint="Optional">
            <Input
              value={p.dedicateTo}
              onChange={(e) => p.setDedicateTo(e.target.value)}
              placeholder="In memory of… / In honour of…"
            />
          </Field>
          <Field label="Message to the team" hint="Optional">
            <textarea
              value={p.message}
              onChange={(e) => p.setMessage(e.target.value)}
              rows={3}
              placeholder="Share why you're giving, if you'd like."
              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </Field>
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={p.anonymous}
          onChange={(e) => p.setAnonymous(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span className="text-sm text-text/75">
          Give anonymously — your name stays off the public supporter wall.
        </span>
      </label>

      <button
        type="button"
        onClick={p.onContinue}
        className={`w-full rounded-xl py-4 text-base font-semibold transition-all ${
          p.formValid
            ? "bg-accent text-white shadow-[0_14px_30px_-12px_rgba(217,115,43,0.8)] hover:-translate-y-0.5"
            : "bg-border text-text/45"
        }`}
      >
        Continue →
      </button>
    </div>
  );
}

/* ------------------------------ Step 2 ------------------------------- */

const INSTRUMENT_ICON = {
  card: CreditCard,
  phone: Smartphone,
  bank: Building2,
  wallet: Wallet,
} as const;

function PayStep({
  picked,
  amount,
  currency,
  baseEquivalent,
  baseCurrency,
  recurring,
  options,
  option,
  setOption,
  active,
  isForeign,
  submitting,
  onBack,
  onPay,
}: {
  picked: Campaign;
  amount: number;
  currency: string;
  baseEquivalent: number | null;
  baseCurrency: string;
  recurring: boolean;
  options: PayOption[];
  option: string;
  setOption: (id: string) => void;
  active?: PayOption;
  isForeign: boolean;
  submitting: boolean;
  onBack: () => void;
  onPay: () => void;
}) {
  const isCard = active?.instrument === "card";

  return (
    <div className="space-y-6">
      {/* Order summary */}
      <div className="rounded-2xl border border-border bg-muted/30 p-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-text/65">
            {recurring ? "Monthly donation" : "Your donation"}
          </span>
          <span className="font-mono-stat text-2xl font-bold text-ink">
            {formatMoney(amount, currency, { decimals: true })}
          </span>
        </div>
        <div className="mt-3 space-y-1.5 border-t border-border pt-3 text-sm">
          <Row label="Campaign" value={picked.title} />
          <Row label="Frequency" value={recurring ? "Monthly" : "One-time"} />
          {baseEquivalent ? (
            <Row
              label="Received in Nepal"
              value={`≈ ${formatMoney(baseEquivalent, baseCurrency)}`}
            />
          ) : null}
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold text-ink">Payment method</h3>
        <p className="mt-1 text-sm text-text/65">
          {isForeign
            ? `Paying from outside Nepal — card is the fastest way to give in ${currency}.`
            : "Choose how you would like to pay."}
        </p>
      </div>

      {options.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-5 text-sm text-text/70">
          No payment method currently accepts {currency}. Go back and choose another currency.
        </div>
      ) : (
        <div className="space-y-2.5">
          {options.map((o) => {
            const selected = o.id === option;
            const Icon = INSTRUMENT_ICON[o.icon] ?? CreditCard;
            const expands = o.instrument === "card" && selected;

            return (
              <div key={o.id}>
                <button
                  type="button"
                  onClick={() => setOption(o.id)}
                  aria-pressed={selected}
                  className={`w-full border-2 p-4 text-left transition-all ${
                    selected
                      ? "border-primary bg-primary-pale/25 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/30"
                  } ${expands ? "rounded-t-2xl" : "rounded-2xl"}`}
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                        selected ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>

                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${
                        selected ? "bg-primary text-white" : "bg-muted text-text/55"
                      }`}
                    >
                      <Icon style={{ width: 17, height: 17 }} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-ink">{o.label}</span>
                        {o.instrument === "card" && o.international && (
                          <Badge tone="green">Worldwide</Badge>
                        )}
                        {o.kind === "offline" && <Badge tone="slate">1&ndash;3 days</Badge>}
                        {o.mode === "mock" && <Badge tone="amber">Test mode</Badge>}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-text/65">
                        {o.description}
                      </span>
                      {o.brands.length > 0 && (
                        <span className="mt-2.5 block">
                          <CardBrands brands={o.brands} />
                        </span>
                      )}
                    </span>
                  </div>
                </button>

                {/* Card panel: says exactly where the details are entered. */}
                {expands && (
                  <div className="rounded-b-2xl border-2 border-t-0 border-primary bg-primary-pale/25 px-4 pb-4">
                    <div className="rounded-xl border border-primary/15 bg-white p-4">
                      <div className="flex items-start gap-3">
                        <Lock
                          style={{ width: 16, height: 16 }}
                          className="mt-0.5 shrink-0 text-green"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink">
                            Card details are entered on {o.gatewayLabel}&rsquo;s secure page
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-text/65">
                            We never see, handle or store your card number &mdash; that is what
                            keeps it safe. You go straight there and come back with your receipt.
                          </p>
                        </div>
                      </div>

                      <ol className="mt-3.5 space-y-2 border-t border-border pt-3.5">
                        {[
                          "Enter your card number, expiry and CVV on the bank page",
                          "Confirm with 3-D Secure if your bank asks",
                          "You are returned here with your receipt",
                        ].map((line, i) => (
                          <li key={line} className="flex items-start gap-2.5 text-xs text-text/70">
                            <span className="mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary-pale text-[9px] font-bold text-primary">
                              {i + 1}
                            </span>
                            {line}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Trust row */}
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/30 px-3 py-3 text-center">
        <Trust icon={Lock} label="256-bit SSL" />
        <Trust icon={Mail} label="Emailed receipt" />
        <Trust icon={ShieldCheck} label="Registered NGO" />
      </div>

      <div>
        <button
          type="button"
          onClick={onPay}
          disabled={submitting || options.length === 0}
          className={`w-full rounded-xl py-4 text-base font-semibold transition-all ${
            submitting || options.length === 0
              ? "bg-border text-text/45"
              : "bg-accent text-white shadow-[0_14px_30px_-12px_rgba(217,115,43,0.8)] hover:-translate-y-0.5"
          }`}
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Opening secure payment&hellip;
            </span>
          ) : active?.kind === "offline" ? (
            "Show transfer details"
          ) : (
            <span className="inline-flex items-center gap-2">
              <Lock style={{ width: 15, height: 15 }} />
              {isCard
                ? "Continue to secure card payment"
                : `Pay ${formatMoney(amount, currency, { decimals: true })}`}
            </span>
          )}
        </button>
        {isCard && !submitting && (
          <p className="mt-2 text-center text-xs text-text/55">
            You will not be charged until you confirm on {active?.gatewayLabel}&rsquo;s page.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm font-medium text-text/60 transition-colors hover:text-primary"
      >
        &larr; Back to your gift
      </button>
    </div>
  );
}

/* ------------------------------ Offline ------------------------------ */

function OfflineStep({
  instructions,
  onClose,
}: {
  instructions: NonNullable<CheckoutSession["instructions"]>;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const rows: [string, string][] = [
    ["Account name", instructions.accountName],
    ["Bank", instructions.bankName],
    ["Account number", instructions.accountNumber],
    ["Branch", instructions.branch],
    ["SWIFT / BIC", instructions.swift],
    ["Amount", formatMoney(instructions.amount, instructions.currency, { decimals: true })],
    ["Reference", instructions.reference],
  ];

  const copyAll = async () => {
    await navigator.clipboard.writeText(rows.map(([k, v]) => `${k}: ${v}`).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-accent/25 bg-accent-light/30 px-4 py-3 text-sm text-text/80">
        Your donation is recorded as <strong className="text-ink">pending</strong>. Quote the
        reference below when you transfer — we&apos;ll match it and email your receipt as soon as it
        arrives.
      </div>

      <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-sm text-text/60">{k}</dt>
            <dd
              className={`text-right text-sm font-semibold text-ink ${
                k === "Reference" || k === "Account number" ? "font-mono-stat" : ""
              }`}
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-sm leading-relaxed text-text/70">{instructions.instructions}</p>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button
          onClick={copyAll}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary/20 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-pale"
        >
          {copied ? (
            <>
              <Check style={{ width: 15, height: 15 }} /> Copied
            </>
          ) : (
            <>
              <Copy style={{ width: 15, height: 15 }} /> Copy details
            </>
          )}
        </button>
        <button
          onClick={onClose}
          className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Done
        </button>
      </div>
    </div>
  );
}

/* ---------------------------- Redirecting ---------------------------- */

function RedirectingStep({ label, url }: { label: string; url?: string }) {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto h-11 w-11 animate-spin rounded-full border-[3px] border-primary-pale border-t-primary" />
      <h3 className="mt-6 font-display text-xl font-semibold text-ink">Taking you to {label}…</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text/65">
        Finish your payment on their secure page. We&apos;ll bring you straight back with your
        receipt.
      </p>
      {url && (
        <a
          href={url}
          className="mt-5 inline-block text-sm font-semibold text-primary underline underline-offset-4"
        >
          Not redirected? Continue manually →
        </a>
      )}
    </div>
  );
}

/* ------------------------------ Bits ------------------------------ */

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-[13px] font-semibold text-ink">
          {label}
          {required && <span className="ml-0.5 text-accent">*</span>}
        </span>
        {hint && <span className="text-[11px] text-text/50">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Input({
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-text/35 focus:ring-4 focus:ring-primary/10 ${
        invalid ? "border-destructive" : "border-border focus:border-primary"
      }`}
    />
  );
}

function Chevron({ small }: { small?: boolean }) {
  return (
    <svg
      className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-text/40 ${small ? "right-2.5" : "right-4"}`}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "green" | "amber" | "slate";
  children: React.ReactNode;
}) {
  const cls = {
    green: "bg-green-light text-green",
    amber: "bg-accent-light text-accent",
    slate: "bg-muted text-text/60",
  }[tone];
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {children}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-text/60">{label}</span>
      <span className="truncate font-medium text-ink">{value}</span>
    </div>
  );
}

function Trust({ icon: Icon, label }: { icon: typeof Lock; label: string }) {
  return (
    <span className="flex flex-col items-center gap-1 text-[11px] font-medium text-text/60">
      <Icon style={{ width: 15, height: 15 }} className="text-primary/70" />
      {label}
    </span>
  );
}
