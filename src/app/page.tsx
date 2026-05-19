import Link from "next/link";

const features = [
  {
    title: "PDF in one click",
    desc: "Download polished invoices your clients will take seriously.",
  },
  {
    title: "No account required",
    desc: "Start instantly. Data stays in your browser until you need more.",
  },
  {
    title: "Multi-currency",
    desc: "USD, EUR, GBP, INR and more — bill clients anywhere.",
  },
  {
    title: "Freemium that scales",
    desc: "Free tier to try. Upgrade when your freelance business grows.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-indigo-50/80 to-white px-4 py-20 dark:border-zinc-800 dark:from-indigo-950/30 dark:to-zinc-950 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
            Zero setup · Free to start · Earn from day one
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
            Professional invoices for freelancers — in under 2 minutes
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            InvoiceForge helps you create, save, and export PDF invoices without
            expensive accounting software. Perfect for designers, developers,
            consultants, and side hustles.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/invoice/new"
              className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
            >
              Create free invoice
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-zinc-300 bg-white px-8 py-3.5 text-base font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              See pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            5 free invoices/month · No credit card
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-white">
          Why freelancers choose InvoiceForge
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-semibold text-zinc-900 dark:text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-16 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Ready to get paid faster?
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Join thousands of freelancers who ditched spreadsheets for simple,
            beautiful invoices.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            Open dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
