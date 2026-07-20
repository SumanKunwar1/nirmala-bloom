import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { donationCampaigns, type DonationCampaign } from "@/lib/constants";
import { submitDonation } from "@/lib/admin/inbox";

type Step = "form" | "method" | "card" | "esewa" | "khalti" | "bank" | "success";
type Method = "card" | "esewa" | "khalti" | "bank";

const amounts = [500, 1000, 5000, 10000];

const methodTiles: { id: Method; name: string; sub: string; color: string; bg: string }[] = [
  { id: "card", name: "Credit/Debit Card", sub: "Visa · Mastercard", color: "#1A56DB", bg: "#E0EAFE" },
  { id: "esewa", name: "eSewa Mobile Wallet", sub: "Pay via eSewa", color: "#60BB46", bg: "#E6F5E1" },
  { id: "khalti", name: "Khalti by IME", sub: "Mobile Wallet", color: "#5C2D91", bg: "#EEE5F7" },
  { id: "bank", name: "Bank Transfer", sub: "Direct deposit", color: "#7C5C3A", bg: "#F3EBDD" },
];

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
  campaign?: DonationCampaign;
}) {
  const mounted = useMounted();

  const [step, setStep] = useState<Step>("form");
  const [campaignId, setCampaignId] = useState<number>(campaign?.id ?? donationCampaigns[0].id);
  const [amount, setAmount] = useState<number | "">(1000);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [method, setMethod] = useState<Method>("card");

  // Card-step fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const picked = campaign ?? donationCampaigns.find((c) => c.id === campaignId) ?? donationCampaigns[0];

  const recordDonation = async () => {
    try {
      await submitDonation({
        donor: name.trim() || "Anonymous",
        email: email.trim(),
        amount: typeof amount === "number" ? amount : 0,
        campaignSlug: picked.slug,
        campaignTitle: picked.title,
        method,
        message: message.trim(),
      });
    } catch {
      /* demo flow — still show success even if the record fails */
    }
    setStep("success");
  };

  // Lock scroll + ESC + reset
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

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStep("form");
      setAmount(1000);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setRecurring(false);
      setMethod("card");
      setCardNumber("");
      setCardName("");
      setCardExpiry("");
      setCardCvv("");
    }, 350);
    return () => clearTimeout(t);
  }, [open]);

  const formValid =
    typeof amount === "number" && amount >= 50 && name.trim().length > 0 && /.+@.+/.test(email);
  const amountStr =
    typeof amount === "number" ? `Rs. ${amount.toLocaleString()}` : "Rs. ____";
  const totalLine = `${amountStr} to ${picked.title}${recurring ? " · monthly" : ""}`;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-ink/70 backdrop-blur-sm grid place-items-center p-4 sm:p-6"
          onClick={onClose}
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
              {step === "form" && (
                <FormStep
                  campaignLocked={!!campaign}
                  campaignId={campaignId}
                  setCampaignId={setCampaignId}
                  amount={amount}
                  setAmount={setAmount}
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  message={message}
                  setMessage={setMessage}
                  recurring={recurring}
                  setRecurring={setRecurring}
                  picked={picked}
                  formValid={formValid}
                  onContinue={() => setStep("method")}
                />
              )}

              {step === "method" && (
                <MethodStep
                  onSelect={(m) => {
                    setMethod(m);
                    setStep(m);
                  }}
                  onBack={() => setStep("form")}
                />
              )}

              {(step === "card" || step === "esewa" || step === "khalti" || step === "bank") && (
                <PaymentStep
                  method={method}
                  setMethod={(m) => {
                    setMethod(m);
                    setStep(m);
                  }}
                  amountStr={amountStr}
                  picked={picked}
                  cardNumber={cardNumber}
                  setCardNumber={setCardNumber}
                  cardName={cardName}
                  setCardName={setCardName}
                  cardExpiry={cardExpiry}
                  setCardExpiry={setCardExpiry}
                  cardCvv={cardCvv}
                  setCardCvv={setCardCvv}
                  saveCard={saveCard}
                  setSaveCard={setSaveCard}
                  onBack={() => setStep("method")}
                  onPay={recordDonation}
                />
              )}

              {step === "success" && <SuccessStep picked={picked} amountStr={amountStr} onClose={onClose} />}
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
  campaign: DonationCampaign;
  onClose: () => void;
  totalLine: string;
}) {
  const stepLabel: Record<Step, string> = {
    form: "1 of 3 · Your gift",
    method: "2 of 3 · Payment method",
    card: "3 of 3 · Card details",
    esewa: "3 of 3 · eSewa",
    khalti: "3 of 3 · Khalti",
    bank: "3 of 3 · Bank transfer",
    success: "Thank you",
  };

  return (
    <div
      className="sticky top-0 z-10 px-6 sm:px-8 pt-6 pb-5 bg-white/95 backdrop-blur border-b border-border rounded-t-3xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            {stepLabel[step]}
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink mt-1">
            {step === "success" ? "Your gift was received." : "Complete your donation"}
          </h2>
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
        <button
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 w-9 h-9 rounded-full bg-primary-pale grid place-items-center text-primary hover:bg-primary hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Step progress bar */}
      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {(["form", "method", "pay"] as const).map((s, i) => {
          const active =
            (s === "form" && step === "form") ||
            (s === "method" && step === "method") ||
            (s === "pay" && (step === "card" || step === "esewa" || step === "khalti" || step === "bank" || step === "success"));
          const done =
            (s === "form" && step !== "form") ||
            (s === "method" && step !== "form" && step !== "method") ||
            (s === "pay" && step === "success");
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

/* ------------------------------ Step 1 — Form ------------------------------ */

function FormStep(props: {
  campaignLocked: boolean;
  campaignId: number;
  setCampaignId: (n: number) => void;
  amount: number | "";
  setAmount: (n: number | "") => void;
  name: string;
  setName: (s: string) => void;
  email: string;
  setEmail: (s: string) => void;
  phone: string;
  setPhone: (s: string) => void;
  message: string;
  setMessage: (s: string) => void;
  recurring: boolean;
  setRecurring: (b: boolean) => void;
  picked: DonationCampaign;
  formValid: boolean;
  onContinue: () => void;
}) {
  const {
    campaignLocked,
    campaignId,
    setCampaignId,
    amount,
    setAmount,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    message,
    setMessage,
    recurring,
    setRecurring,
    picked,
    formValid,
    onContinue,
  } = props;

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
            value={campaignId}
            onChange={(e) => setCampaignId(Number(e.target.value))}
            className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary bg-white"
          >
            {donationCampaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.title}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Amount (NPR)">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {amounts.map((a) => (
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
              Rs. {a.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text/50 font-mono-stat text-sm">Rs.</span>
          <input
            type="number"
            min={50}
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Custom amount"
            className="w-full rounded-2xl border border-border pl-12 pr-4 py-3 outline-none focus:border-primary"
          />
        </div>
      </Field>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Full name *">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Asha Bhandari" />
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
      <Field label="Phone (optional)">
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+977 9800000000" />
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

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <button
          type="button"
          role="switch"
          aria-checked={recurring}
          onClick={() => setRecurring(!recurring)}
          className={`relative w-11 h-6 rounded-full transition-colors ${recurring ? "bg-primary" : "bg-border"}`}
        >
          <motion.span
            animate={{ x: recurring ? 22 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
          />
        </button>
        <span className="text-sm text-text/80">
          Make this a <strong className="text-ink">monthly</strong> gift — predictable funding helps us plan
        </span>
      </label>

      <button
        type="submit"
        disabled={!formValid}
        className={`w-full rounded-full py-4 text-base font-semibold shadow-[0_18px_40px_-12px_rgba(249,115,22,0.55)] transition-all ${
          formValid
            ? "bg-accent text-white hover:-translate-y-0.5"
            : "bg-border text-text/40 cursor-not-allowed shadow-none"
        }`}
      >
        Make my gift to {picked.title} →
      </button>
      <p className="text-[11px] text-center text-text/55">
        Step 2: choose how you'd like to pay. You can still go back and edit.
      </p>
    </form>
  );
}

/* ------------------------------ Step 2 — Method ------------------------------ */

function MethodStep({ onSelect, onBack }: { onSelect: (m: Method) => void; onBack: () => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">Select Payment Method</h3>
        <p className="text-sm text-text/65 mt-1">
          Choose how you&apos;d like to send your gift — all routes are encrypted and instant.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {methodTiles.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="group rounded-2xl border border-border bg-white p-4 text-center hover:border-primary/40 hover:soft-shadow transition-all"
          >
            <div
              className="w-14 h-14 mx-auto rounded-2xl grid place-items-center mb-3 transition-transform group-hover:scale-105"
              style={{ background: t.bg, color: t.color }}
            >
              <MethodIcon id={t.id} />
            </div>
            <div className="font-semibold text-ink text-sm leading-tight">{t.name}</div>
            <div className="text-[11px] text-text/55 mt-1">{t.sub}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-text/55 pt-2">
        <span>🔒 SSL secured</span>
        <span>·</span>
        <span>📧 Receipt by email</span>
        <span>·</span>
        <span>🇳🇵 NGO-registered</span>
      </div>

      <div className="pt-2 border-t border-border flex justify-between">
        <button onClick={onBack} className="text-sm text-text/70 hover:text-primary transition-colors">
          ← Back
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ Step 3 — Payment ------------------------------ */

function PaymentStep(props: {
  method: Method;
  setMethod: (m: Method) => void;
  amountStr: string;
  picked: DonationCampaign;
  cardNumber: string;
  setCardNumber: (s: string) => void;
  cardName: string;
  setCardName: (s: string) => void;
  cardExpiry: string;
  setCardExpiry: (s: string) => void;
  cardCvv: string;
  setCardCvv: (s: string) => void;
  saveCard: boolean;
  setSaveCard: (b: boolean) => void;
  onBack: () => void;
  onPay: () => void;
}) {
  const { method, setMethod, amountStr, onBack, onPay } = props;
  return (
    <div className="space-y-5">
      {/* Method tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-primary-pale/40 rounded-2xl">
        {methodTiles.map((t) => {
          const active = method === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setMethod(t.id)}
              className={`rounded-xl px-3 py-3 text-center transition-all ${
                active ? "bg-white shadow-md" : "hover:bg-white/60"
              }`}
            >
              <div
                className="w-8 h-8 mx-auto rounded-lg grid place-items-center mb-1.5"
                style={{ background: active ? t.bg : "#fff", color: t.color }}
              >
                <MethodIcon id={t.id} small />
              </div>
              <div className={`text-[11px] font-semibold leading-tight ${active ? "text-ink" : "text-text/65"}`}>
                {t.name}
              </div>
              <div className={`text-[10px] mt-0.5 ${active ? "text-text/60" : "text-text/45"}`}>
                {t.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
        {method === "card" && <CardForm {...props} />}
        {method === "esewa" && <RedirectInstructions provider="eSewa" />}
        {method === "khalti" && <RedirectInstructions provider="Khalti" />}
        {method === "bank" && <BankDetails />}
      </div>

      <button
        onClick={onPay}
        className="w-full bg-accent text-white rounded-full py-4 text-base font-semibold hover:-translate-y-0.5 transition-transform shadow-[0_18px_40px_-12px_rgba(249,115,22,0.55)]"
      >
        Pay {amountStr} now →
      </button>

      <div className="pt-2 border-t border-border flex justify-between">
        <button onClick={onBack} className="text-sm text-text/70 hover:text-primary transition-colors">
          ← Change method
        </button>
        <div className="text-[11px] text-text/55 self-center">🔒 Encrypted end-to-end</div>
      </div>
    </div>
  );
}

function CardForm(props: {
  cardNumber: string;
  setCardNumber: (s: string) => void;
  cardName: string;
  setCardName: (s: string) => void;
  cardExpiry: string;
  setCardExpiry: (s: string) => void;
  cardCvv: string;
  setCardCvv: (s: string) => void;
  saveCard: boolean;
  setSaveCard: (b: boolean) => void;
}) {
  const { cardNumber, setCardNumber, cardName, setCardName, cardExpiry, setCardExpiry, cardCvv, setCardCvv, saveCard, setSaveCard } = props;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-ink">New Credit/Debit Card</div>
        <div className="flex items-center gap-2 text-xs text-text/55">
          <Brand label="VISA" color="#1A1F71" />
          <Brand label="MC" color="#EB001B" />
          <Brand label="AmEx" color="#2671B8" />
        </div>
      </div>

      <Field label="Card number *">
        <Input
          inputMode="numeric"
          maxLength={19}
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
        />
      </Field>

      <Field label="Name on card *">
        <Input
          value={cardName}
          onChange={(e) => setCardName(e.target.value.toUpperCase())}
          placeholder="ASHA BHANDARI"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Expiry date *">
          <Input
            inputMode="numeric"
            maxLength={5}
            value={cardExpiry}
            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
          />
        </Field>
        <Field label="CVV *">
          <Input
            inputMode="numeric"
            maxLength={4}
            value={cardCvv}
            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
            placeholder="123"
          />
        </Field>
      </div>

      <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-accent"
        />
        <span className="text-xs text-text/70 leading-relaxed">
          <strong className="text-ink">Save card</strong> — we&apos;ll store this securely for one-tap giving next
          time. You can remove it any time from your account.
        </span>
      </label>
    </div>
  );
}

function RedirectInstructions({ provider }: { provider: "eSewa" | "Khalti" }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-text/75 leading-relaxed">
        You will be redirected to your <strong className="text-ink">{provider}</strong> account to complete your
        payment:
      </p>
      <ol className="space-y-3 text-sm text-text/80">
        {[
          `Login to your ${provider} account using your ${provider} ID and password.`,
          `Ensure your ${provider} account is active and has sufficient balance.`,
          "Enter the OTP (one-time password) sent to your registered mobile number.",
        ].map((line, i) => (
          <li key={i} className="flex gap-3">
            <span
              className="w-6 h-6 shrink-0 rounded-full grid place-items-center text-xs font-mono-stat font-bold bg-primary-pale text-primary"
            >
              {i + 1}
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-text/60 italic">
        ***Login with your {provider} mobile and PASSWORD (not MPIN)***
      </p>
    </div>
  );
}

function BankDetails() {
  const rows: [string, string][] = [
    ["Account Name", "Nirmala Foundation Nepal"],
    ["Bank", "Nepal Investment Mega Bank Ltd."],
    ["Account #", "0123-4567-8910-11"],
    ["Branch", "Kathmandu"],
    ["SWIFT (international)", "NIBLNPKT"],
    ["Reference", "Use your email as reference"],
  ];
  return (
    <div className="space-y-4">
      <p className="text-sm text-text/75 leading-relaxed">
        Use these details to transfer from any Nepali or international bank. Send a screenshot to{" "}
        <span className="text-primary font-medium">accounts@nirmalafoundation.org.np</span> once paid and
        we&apos;ll match it to your donation.
      </p>
      <dl className="rounded-2xl bg-primary-pale/40 p-5 space-y-2.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-text/65">{k}</dt>
            <dd className="font-medium text-ink text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------ Step 4 — Success ------------------------------ */

function SuccessStep({
  picked,
  amountStr,
  onClose,
}: {
  picked: DonationCampaign;
  amountStr: string;
  onClose: () => void;
}) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className="w-20 h-20 mx-auto rounded-full bg-green-light grid place-items-center"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2D7A4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </motion.div>
      <h3 className="font-display text-2xl font-semibold mt-5">Thank you, truly. 💜</h3>
      <p className="text-text/75 mt-2 max-w-md mx-auto">
        Your gift of <strong className="text-ink">{amountStr}</strong> to{" "}
        <strong className="text-ink">{picked.title}</strong> has been received. A receipt is on its way to your
        email.
      </p>
      <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onClose}
          className="bg-primary text-white rounded-full px-7 py-3 font-semibold hover:-translate-y-0.5 transition-transform"
        >
          Close
        </button>
        <button className="border-2 border-primary/20 text-primary rounded-full px-7 py-3 font-semibold hover:bg-primary-pale transition-colors">
          Share this campaign
        </button>
      </div>
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
      className={`w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-primary transition-colors ${props.className ?? ""}`}
    />
  );
}

function Brand({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded text-white"
      style={{ background: color }}
    >
      {label}
    </span>
  );
}

function MethodIcon({ id, small = false }: { id: Method; small?: boolean }) {
  const size = small ? 16 : 24;
  switch (id) {
    case "card":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case "esewa":
      return <span className="font-bold" style={{ fontSize: size * 0.85, lineHeight: 1 }}>e</span>;
    case "khalti":
      return <span className="font-bold" style={{ fontSize: size * 0.7, lineHeight: 1, letterSpacing: -0.5 }}>khalti</span>;
    case "bank":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10l9-7 9 7" />
          <path d="M5 10v10h14V10" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
  }
}

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
