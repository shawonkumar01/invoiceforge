"use client";

import Link from "next/link";
import { PRO_CHECKOUT_URL } from "@/lib/constants";
import { setPlan } from "@/lib/storage";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "5 invoices per month",
      "PDF export with small branding",
      "Multi-currency support",
      "Local storage (private)",
    ],
    cta: "Get started",
    href: "/invoice/new",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    features: [
      "Unlimited invoices",
      "No PDF branding",
      "Priority support (email)",
      "Early access to new features",
    ],
    cta: "Upgrade to Pro",
    href: PRO_CHECKOUT_URL,
    highlighted: true,
    external: true,
  },
];

export default function PricingPage() {
  const handleProDemo = () => {
    setPlan("pro");
    alert("Pro activated for this browser (demo). Connect Lemon Squeezy or Stripe for real payments.");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Simple pricing
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Start free. Upgrade when you land more clients.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 ${
              plan.highlighted
                ? "border-indigo-600 bg-indigo-50/50 shadow-xl dark:bg-indigo-950/20"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-zinc-500">{plan.period}</span>
            </p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="text-emerald-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {plan.external ? (
              <div className="mt-8 space-y-2">
                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-lg bg-indigo-600 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  {plan.cta}
                </a>
                <button
                  type="button"
                  onClick={handleProDemo}
                  className="w-full rounded-lg border border-zinc-300 py-2 text-xs text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700"
                >
                  Demo: unlock Pro locally
                </button>
              </div>
            ) : (
              <Link
                href={plan.href}
                className="mt-8 block w-full rounded-lg border border-zinc-300 py-3 text-center text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-xl bg-zinc-100 p-6 dark:bg-zinc-900">
        <h3 className="font-semibold text-zinc-900 dark:text-white">
          How to earn money (zero upfront cost)
        </h3>
        <ol className="mt-4 list-decimal list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            Deploy free on{" "}
            <a href="https://vercel.com" className="text-indigo-600 underline" target="_blank" rel="noreferrer">
              Vercel
            </a>{" "}
            via GitHub
          </li>
          <li>
            Create a product on{" "}
            <a href="https://lemonsqueezy.com" className="text-indigo-600 underline" target="_blank" rel="noreferrer">
              Lemon Squeezy
            </a>{" "}
            ($12/mo subscription) — no company needed for many countries
          </li>
          <li>
            Set <code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1 rounded">NEXT_PUBLIC_PRO_CHECKOUT_URL</code> in Vercel env
          </li>
          <li>
            Share on Reddit (r/freelance, r/webdev), Product Hunt, X, and freelance Facebook groups
          </li>
          <li>
            Target: 50 Pro users = ~$600/mo revenue (minus ~5% payment fees)
          </li>
        </ol>
      </div>
    </div>
  );
}
