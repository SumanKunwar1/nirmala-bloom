import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { DonationModal } from "@/components/shared/DonationModal";
import type { Campaign } from "@/lib/admin/context";

type Variant = "primary" | "outline" | "white" | "dark";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_14px_30px_-14px_rgba(217,115,43,0.8)] hover:bg-[#C9661F] hover:-translate-y-px",
  outline: "border-[1.5px] border-ink/20 text-ink hover:bg-ink hover:text-white hover:border-ink",
  white: "bg-white text-ink hover:-translate-y-px",
  dark: "bg-ink text-white hover:bg-black",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  campaign?: Campaign;
  variant?: Variant;
  /** Pre-selected gift in NPR. */
  amount?: number;
  /** Open with monthly giving selected. */
  recurring?: boolean;
  children: ReactNode;
};

export function DonateButton({
  campaign,
  variant = "primary",
  amount,
  recurring,
  children,
  className = "",
  ...rest
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        {...rest}
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all ${variants[variant]} ${className}`}
      >
        {children}
      </button>
      <DonationModal
        open={open}
        onClose={() => setOpen(false)}
        campaign={campaign}
        initialAmount={amount}
        initialRecurring={recurring}
      />
    </>
  );
}
