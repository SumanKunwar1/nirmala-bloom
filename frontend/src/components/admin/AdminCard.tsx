import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";

/** Standard bordered content card used across admin pages. */
export function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 soft-shadow md:p-6">
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="font-display text-base font-semibold text-ink">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-text/60">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-6 text-center text-sm text-text/55">
      {text}
    </div>
  );
}

export function RemoveBtn({ onClick, label = "Remove" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-text/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 style={{ width: 16, height: 16 }} />
    </button>
  );
}

/** Small tab bar used at the top of multi-section admin pages. */
export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string; icon?: typeof Trash2; count?: number }[];
  active: T;
  onChange: (t: T) => void;
}) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 soft-shadow">
      {tabs.map((t) => {
        const Icon = t.icon;
        const on = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
              on ? "bg-primary text-white" : "text-text/65 hover:bg-muted"
            }`}
          >
            {Icon && <Icon style={{ width: 16, height: 16 }} />}
            {t.label}
            {typeof t.count === "number" && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                  on ? "bg-white/20 text-white" : "bg-muted text-text/60"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
