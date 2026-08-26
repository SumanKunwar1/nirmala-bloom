/**
 * Small inline card-network marks for the donate form.
 *
 * Drawn as SVG rather than loaded from a CDN so they cost no request and
 * cannot be blocked. Which brands appear is driven by the gateway's
 * `cardBrands` config, so it always reflects what the acquirer settles.
 */

const H = 20;
const W = 30;

function Frame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <span
      title={title}
      aria-label={title}
      role="img"
      className="inline-grid place-items-center rounded border border-border bg-white"
      style={{ width: W + 6, height: H + 4 }}
    >
      {children}
    </span>
  );
}

function Visa() {
  return (
    <Frame title="Visa">
      <svg width={W} height={H} viewBox="0 0 60 20" aria-hidden>
        <text
          x="30"
          y="15"
          textAnchor="middle"
          fontFamily="Verdana, Geneva, sans-serif"
          fontSize="15"
          fontWeight="700"
          fontStyle="italic"
          fill="#1A1F71"
          letterSpacing="0.5"
        >
          VISA
        </text>
      </svg>
    </Frame>
  );
}

function Mastercard() {
  return (
    <Frame title="Mastercard">
      <svg width={W} height={H} viewBox="0 0 40 24" aria-hidden>
        <circle cx="15" cy="12" r="9" fill="#EB001B" />
        <circle cx="25" cy="12" r="9" fill="#F79E1B" />
        {/* Overlap reads as the interlocking-circles mark. */}
        <path d="M20 5.2a8.98 8.98 0 0 0 0 13.6 8.98 8.98 0 0 0 0-13.6Z" fill="#FF5F00" />
      </svg>
    </Frame>
  );
}

function Amex() {
  return (
    <Frame title="American Express">
      <svg width={W} height={H} viewBox="0 0 40 24" aria-hidden>
        <rect width="40" height="24" rx="3" fill="#2671B8" />
        <text
          x="20"
          y="15"
          textAnchor="middle"
          fontFamily="Verdana, Geneva, sans-serif"
          fontSize="8"
          fontWeight="700"
          fill="#fff"
          letterSpacing="0.3"
        >
          AMEX
        </text>
      </svg>
    </Frame>
  );
}

function UnionPay() {
  return (
    <Frame title="UnionPay">
      <svg width={W} height={H} viewBox="0 0 40 24" aria-hidden>
        <rect x="2" y="3" width="12" height="18" rx="2" fill="#E21836" />
        <rect x="14" y="3" width="12" height="18" rx="2" fill="#00447C" />
        <rect x="26" y="3" width="12" height="18" rx="2" fill="#007B84" />
      </svg>
    </Frame>
  );
}

function Discover() {
  return (
    <Frame title="Discover">
      <svg width={W} height={H} viewBox="0 0 40 24" aria-hidden>
        <rect width="40" height="24" rx="3" fill="#fff" />
        <circle cx="30" cy="12" r="7" fill="#F76E11" />
        <text
          x="15"
          y="15"
          textAnchor="middle"
          fontFamily="Verdana, Geneva, sans-serif"
          fontSize="6.5"
          fontWeight="700"
          fill="#231F20"
        >
          DISC
        </text>
      </svg>
    </Frame>
  );
}

const MARKS: Record<string, () => React.JSX.Element> = {
  visa: Visa,
  mastercard: Mastercard,
  amex: Amex,
  americanexpress: Amex,
  unionpay: UnionPay,
  discover: Discover,
};

export function CardBrands({ brands, className = "" }: { brands: string[]; className?: string }) {
  const marks = brands
    .map((b) => ({ key: b, Mark: MARKS[b.replace(/[^a-z]/gi, "").toLowerCase()] }))
    .filter((m): m is { key: string; Mark: () => React.JSX.Element } => Boolean(m.Mark));

  if (!marks.length) return null;

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      {marks.map(({ key, Mark }) => (
        <Mark key={key} />
      ))}
    </span>
  );
}
