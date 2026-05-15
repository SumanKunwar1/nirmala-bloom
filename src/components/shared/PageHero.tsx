import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function PageHero({
  title,
  subtitle,
  breadcrumb,
}: {
  title: ReactNode;
  subtitle?: string;
  breadcrumb?: string;
}) {
  return (
    <section className="relative grain overflow-hidden" style={{
      background: "linear-gradient(135deg, #6B2FA0 0%, #9B5DD5 60%, #F97316 130%)",
      minHeight: "50vh",
    }}>
      <LotusDecor />
      <div className="relative mx-auto max-w-6xl px-6 pt-40 pb-20">
        {breadcrumb && (
          <div className="text-sm text-white/70 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{breadcrumb}</span>
          </div>
        )}
        <h1 className="text-5xl md:text-6xl font-display font-semibold text-white max-w-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 text-lg text-white/85 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}

export function LotusDecor() {
  return (
    <svg className="absolute -top-20 -right-20 w-[480px] h-[480px] opacity-20 pointer-events-none" viewBox="0 0 200 200" fill="none">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx="100" cy="60" rx="22" ry="50" fill="white"
          transform={`rotate(${deg} 100 100)`} />
      ))}
    </svg>
  );
}
