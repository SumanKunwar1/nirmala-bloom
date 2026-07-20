import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { DonationModal } from "@/components/shared/DonationModal";
import type { DonationCampaign } from "@/lib/constants";

type Variant = "primary" | "outline" | "white";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_18px_40px_-12px_rgba(249,115,22,0.55)] hover:-translate-y-0.5",
  outline:
    "border-2 border-primary/20 text-primary hover:bg-primary-pale",
  white: "bg-white text-primary hover:-translate-y-0.5",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  campaign?: DonationCampaign;
  variant?: Variant;
  children: ReactNode;
};

export function DonateButton({ campaign, variant = "primary", children, className = "", ...rest }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        {...rest}
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all ${variants[variant]} ${className}`}
      >
        {children}
      </button>
      <DonationModal open={open} onClose={() => setOpen(false)} campaign={campaign} />
    </>
  );
}
