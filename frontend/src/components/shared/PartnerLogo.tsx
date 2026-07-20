import { useState } from "react";

type LogoPartner = {
  name: string;
  color: string;
  logo?: string;
  logoDomain?: string;
  initials?: string;
};

const sizes = {
  sm: { box: "w-12 h-12", text: "text-sm" },
  md: { box: "w-16 h-16", text: "text-lg" },
  lg: { box: "w-24 h-24", text: "text-3xl" },
} as const;

/**
 * Renders a partner logo: an uploaded image if present, else a real org logo
 * (via Clearbit's CDN), gracefully falling back to a colored initials tile.
 */
export function PartnerLogo({
  partner,
  size = "md",
  variant = "plate",
}: {
  partner: LogoPartner;
  size?: keyof typeof sizes;
  /** "plate" — white card with logo. "tile" — colored gradient with initials. */
  variant?: "plate" | "tile";
}) {
  const [failed, setFailed] = useState(false);
  const dim = sizes[size];
  const src = partner.logo || (partner.logoDomain ? `https://logo.clearbit.com/${partner.logoDomain}` : "");
  const tryLogo = src && !failed;

  if (variant === "plate") {
    return (
      <div
        className={`${dim.box} rounded-2xl bg-white border border-border grid place-items-center overflow-hidden p-2 soft-shadow shrink-0`}
      >
        {tryLogo ? (
          <img
            src={src}
            alt={`${partner.name} logo`}
            loading="lazy"
            onError={() => setFailed(true)}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span
            className={`font-display font-bold ${dim.text} tracking-tight`}
            style={{ color: partner.color }}
          >
            {partner.initials ?? partner.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
    );
  }

  // Tile variant (gradient with initials)
  return (
    <div
      className={`${dim.box} rounded-2xl grid place-items-center text-white font-display font-bold shrink-0 relative overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${partner.color}, ${partner.color}CC 60%, #D9732B)`,
        boxShadow: `0 10px 30px -8px ${partner.color}55`,
      }}
      aria-hidden
    >
      <span className={`relative tracking-tight ${dim.text}`}>
        {partner.initials ?? partner.name.slice(0, 2).toUpperCase()}
      </span>
      <span className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-white/15" aria-hidden />
    </div>
  );
}
