import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { DonationCampaignCard } from "@/components/shared/DonationCampaignCard";
import { donationCampaigns } from "@/lib/constants";

const amounts = [500, 1000, 5000, 10000];
const methods = [
  { id: "esewa", name: "eSewa", color: "#60BB46" },
  { id: "khalti", name: "Khalti", color: "#5C2D91" },
  { id: "connectips", name: "ConnectIPS", color: "#0066B3" },
  { id: "bank", name: "Bank Transfer", color: "#7C5C3A" },
];

export const Route = createFileRoute("/donate")({
  head: () => ({ meta: [
    { title: "Donate — Nirmala Foundation Nepal" },
    { name: "description", content: "Fund wheelchairs, sports equipment, education and health for Nepalis with disabilities." },
  ]}),
  component: DonatePage,
});

function DonatePage() {
  const [campaign, setCampaign] = useState(donationCampaigns[0].id);
  const [amount, setAmount] = useState<number | "">(1000);
  const [method, setMethod] = useState("esewa");
  const [bankOpen, setBankOpen] = useState(false);

  return (
    <>
      <PageHero title="Donate" subtitle="Every contribution funds dignity, mobility, and joy." breadcrumb="Donate" />

      <section className="py-20 mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="Active Campaigns" title="Where your donation goes" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donationCampaigns.map((c) => <DonationCampaignCard key={c.id} {...c} />)}
        </div>
      </section>

      <section className="py-20 bg-primary-pale/40">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading eyebrow="Make a Donation" title="Support our work" align="center" />
          <div className="rounded-3xl bg-white border border-border p-8 shadow-lg space-y-8">
            <div>
              <label className="block text-sm font-semibold mb-3">Choose a campaign</label>
              <select value={campaign} onChange={(e) => setCampaign(Number(e.target.value))}
                className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary bg-white">
                {donationCampaigns.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Amount (NPR)</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {amounts.map((a) => (
                  <button key={a} type="button" onClick={() => setAmount(a)}
                    className={`rounded-full px-5 py-2 font-mono-stat font-semibold border-2 ${amount === a ? "bg-primary text-white border-primary" : "border-border text-text"}`}>
                    Rs. {a.toLocaleString()}
                  </button>
                ))}
              </div>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Custom amount" className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:border-primary" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="Full name" className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary" />
              <input placeholder="Email" type="email" className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary" />
              <input placeholder="Phone (optional)" className="rounded-xl border border-border px-4 py-3 outline-none focus:border-primary sm:col-span-2" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3">Payment method</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {methods.map((m) => (
                  <button key={m.id} type="button" onClick={() => setMethod(m.id)}
                    className={`rounded-xl border-2 p-4 text-sm font-semibold transition-all ${method === m.id ? "border-primary bg-primary-pale" : "border-border"}`}>
                    <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ background: m.color }} />
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-accent text-white rounded-full py-4 text-lg font-semibold hover:scale-[1.01] transition-transform shadow-lg shadow-orange-200">
              Complete Donation
            </button>
            <p className="text-xs text-center text-text/60">Your information is safe. Receipt will be sent to your email.</p>

            <div className="border-t border-border pt-6">
              <button onClick={() => setBankOpen((o) => !o)} className="w-full text-left text-primary font-semibold">
                {bankOpen ? "▾" : "▸"} Bank Transfer Details
              </button>
              {bankOpen && (
                <div className="mt-4 text-sm text-text/80 bg-primary-pale/50 rounded-xl p-5 space-y-1">
                  <p><strong>Account Name:</strong> Nirmala Foundation Nepal</p>
                  <p><strong>Bank:</strong> Nepal Investment Mega Bank</p>
                  <p><strong>Account #:</strong> 0123-4567-8910-11</p>
                  <p><strong>SWIFT (international):</strong> NIBLNPKT</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="Thank you" title="Our generous donors" align="center" />
        <div className="flex flex-wrap justify-center gap-3">
          {["Anonymous Donor", "Ram Shrestha", "Sarah M.", "Bikash Thapa", "Kavita J.", "Anonymous Donor", "Aditi P.", "Suresh K.", "Anjali D.", "International Friend", "Hari B.", "Rina S."].map((d, i) => (
            <span key={i} className="bg-primary-pale text-primary rounded-full px-5 py-2 text-sm font-medium">{d}</span>
          ))}
        </div>
      </section>
    </>
  );
}
