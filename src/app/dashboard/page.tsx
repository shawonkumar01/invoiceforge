"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  canCreateInvoice,
  deleteInvoice,
  getInvoices,
  getPlan,
  invoiceTotals,
} from "@/lib/storage";
import type { Invoice } from "@/lib/types";
import { FREE_INVOICE_LIMIT } from "@/lib/constants";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [usage, setUsage] = useState({ remaining: 5, limit: FREE_INVOICE_LIMIT });

  useEffect(() => {
    setInvoices(getInvoices());
    setPlan(getPlan());
    const check = canCreateInvoice();
    setUsage({
      remaining: check.remaining === Infinity ? 999 : check.remaining,
      limit: check.limit === Infinity ? 999 : check.limit,
    });
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    deleteInvoice(id);
    setInvoices(getInvoices());
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {plan === "pro" ? (
              <span className="text-emerald-600 font-medium">Pro plan — unlimited invoices</span>
            ) : (
              <>
                {usage.remaining} of {usage.limit} free invoices left this month
              </>
            )}
          </p>
        </div>
        <Link
          href="/invoice/new"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
          <p className="text-zinc-600 dark:text-zinc-400">No invoices yet.</p>
          <Link
            href="/invoice/new"
            className="mt-4 inline-block text-indigo-600 font-medium hover:text-indigo-500"
          >
            Create your first invoice →
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Client</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {invoices.map((inv) => {
                const { total } = invoiceTotals(inv);
                return (
                  <tr key={inv.id} className="bg-white dark:bg-zinc-950">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-zinc-600 dark:text-zinc-400">
                      {inv.toName}
                    </td>
                    <td className="px-4 py-3">
                      {inv.currency} {total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs capitalize dark:bg-zinc-800">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-3">
                      <Link
                        href={`/invoice/${inv.id}`}
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(inv.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {plan === "free" && usage.remaining <= 1 && (
        <div className="mt-8 rounded-xl bg-amber-50 border border-amber-200 p-4 dark:bg-amber-950/30 dark:border-amber-900">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Running low on free invoices?{" "}
            <Link href="/pricing" className="font-semibold underline">
              Upgrade to Pro
            </Link>{" "}
            for unlimited invoices and no PDF branding.
          </p>
        </div>
      )}
    </div>
  );
}
