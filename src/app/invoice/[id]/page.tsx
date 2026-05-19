"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { InvoiceForm } from "@/components/InvoiceForm";
import { downloadInvoicePdf } from "@/lib/pdf";
import {
  getInvoice,
  getPlan,
  invoiceTotals,
  saveInvoice,
} from "@/lib/storage";
import type { Invoice } from "@/lib/types";

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [editing, setEditing] = useState(false);
  const [plan, setPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    const inv = getInvoice(id);
    setInvoice(inv ?? null);
    setPlan(getPlan());
  }, [id]);

  if (!invoice) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-zinc-600">Invoice not found.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-indigo-600">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const { subtotal, tax, total } = invoiceTotals(invoice);

  const handleDownload = () => {
    downloadInvoicePdf(invoice, plan === "pro");
  };

  const handleStatus = (status: Invoice["status"]) => {
    const updated = { ...invoice, status };
    saveInvoice(updated);
    setInvoice(updated);
  };

  if (editing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Edit invoice</h1>
        <InvoiceForm
          initial={invoice}
          onSave={(inv) => {
            saveInvoice(inv);
            setInvoice(inv);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {invoice.invoiceNumber}
          </h1>
          <p className="text-sm text-zinc-500">
            {invoice.createdAt} · Due {invoice.dueDate}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-700"
          >
            Edit
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">From</p>
            <p className="mt-2 font-medium">{invoice.fromName}</p>
            <p className="text-sm text-zinc-600">{invoice.fromEmail}</p>
            <p className="text-sm text-zinc-600 whitespace-pre-line">{invoice.fromAddress}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-indigo-600">Bill to</p>
            <p className="mt-2 font-medium">{invoice.toName}</p>
            <p className="text-sm text-zinc-600">{invoice.toEmail}</p>
            <p className="text-sm text-zinc-600 whitespace-pre-line">{invoice.toAddress}</p>
          </div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500 dark:border-zinc-700">
              <th className="pb-2">Description</th>
              <th className="pb-2">Qty</th>
              <th className="pb-2">Rate</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-3">{item.description}</td>
                <td className="py-3">{item.quantity}</td>
                <td className="py-3">{item.rate.toFixed(2)}</td>
                <td className="py-3 text-right">
                  {(item.quantity * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-right text-sm">
          <p>Subtotal: {invoice.currency} {subtotal.toFixed(2)}</p>
          {invoice.taxRate > 0 && (
            <p>Tax ({invoice.taxRate}%): {invoice.currency} {tax.toFixed(2)}</p>
          )}
          <p className="mt-2 text-lg font-bold text-indigo-600">
            Total: {invoice.currency} {total.toFixed(2)}
          </p>
        </div>

        {invoice.notes && (
          <p className="mt-6 text-sm text-zinc-600 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            {invoice.notes}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm text-zinc-500">Mark as:</span>
        {(["draft", "sent", "paid"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleStatus(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
              invoice.status === s
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
            }`}
          >
            {s}
          </button>
        ))}
        <Link
          href="/dashboard"
          className="ml-auto text-sm text-indigo-600 hover:text-indigo-500"
        >
          ← Dashboard
        </Link>
      </div>
    </div>
  );
}
