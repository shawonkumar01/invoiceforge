"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Invoice, LineItem } from "@/lib/types";
import { CURRENCIES } from "@/lib/constants";
import { invoiceTotals } from "@/lib/storage";

type Props = {
  initial?: Invoice;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
};

function emptyItem(): LineItem {
  return { id: uuidv4(), description: "", quantity: 1, rate: 0 };
}

function defaultInvoice(): Invoice {
  const today = new Date().toISOString().slice(0, 10);
  const due = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  return {
    id: uuidv4(),
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    createdAt: today,
    dueDate: due,
    status: "draft",
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    toName: "",
    toEmail: "",
    toAddress: "",
    items: [emptyItem()],
    notes: "",
    taxRate: 0,
    currency: "USD",
  };
}

export function InvoiceForm({ initial, onSave, onCancel }: Props) {
  const [invoice, setInvoice] = useState<Invoice>(initial ?? defaultInvoice());

  const update = <K extends keyof Invoice>(key: K, value: Invoice[K]) => {
    setInvoice((prev) => ({ ...prev, [key]: value }));
  };

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  };

  const addItem = () => {
    setInvoice((prev) => ({ ...prev, items: [...prev.items, emptyItem()] }));
  };

  const removeItem = (id: string) => {
    if (invoice.items.length <= 1) return;
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const { subtotal, tax, total } = invoiceTotals(invoice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(invoice);
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Invoice #
          </label>
          <input
            className={inputClass}
            value={invoice.invoiceNumber}
            onChange={(e) => update("invoiceNumber", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Date
          </label>
          <input
            type="date"
            className={inputClass}
            value={invoice.createdAt}
            onChange={(e) => update("createdAt", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Due date
          </label>
          <input
            type="date"
            className={inputClass}
            value={invoice.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <fieldset className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <legend className="px-1 text-sm font-semibold text-indigo-600">From (you)</legend>
          <input
            className={inputClass}
            placeholder="Your name / business"
            value={invoice.fromName}
            onChange={(e) => update("fromName", e.target.value)}
            required
          />
          <input
            type="email"
            className={inputClass}
            placeholder="Email"
            value={invoice.fromEmail}
            onChange={(e) => update("fromEmail", e.target.value)}
            required
          />
          <textarea
            className={inputClass}
            rows={3}
            placeholder="Address"
            value={invoice.fromAddress}
            onChange={(e) => update("fromAddress", e.target.value)}
          />
        </fieldset>

        <fieldset className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <legend className="px-1 text-sm font-semibold text-indigo-600">Bill to</legend>
          <input
            className={inputClass}
            placeholder="Client name"
            value={invoice.toName}
            onChange={(e) => update("toName", e.target.value)}
            required
          />
          <input
            type="email"
            className={inputClass}
            placeholder="Client email"
            value={invoice.toEmail}
            onChange={(e) => update("toEmail", e.target.value)}
          />
          <textarea
            className={inputClass}
            rows={3}
            placeholder="Client address"
            value={invoice.toAddress}
            onChange={(e) => update("toAddress", e.target.value)}
          />
        </fieldset>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 dark:text-white">Line items</h3>
          <select
            className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={invoice.currency}
            onChange={(e) => update("currency", e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          {invoice.items.map((item) => (
            <div key={item.id} className="grid gap-2 sm:grid-cols-12">
              <input
                className={`${inputClass} sm:col-span-5`}
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
                required
              />
              <input
                type="number"
                min={1}
                className={`${inputClass} sm:col-span-2`}
                value={item.quantity}
                onChange={(e) =>
                  updateItem(item.id, { quantity: Number(e.target.value) })
                }
              />
              <input
                type="number"
                min={0}
                step={0.01}
                className={`${inputClass} sm:col-span-2`}
                value={item.rate}
                onChange={(e) =>
                  updateItem(item.id, { rate: Number(e.target.value) })
                }
              />
              <div className="flex items-center justify-between sm:col-span-3">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {(item.quantity * item.rate).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          + Add line item
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-32">
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Tax %
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            className={inputClass}
            value={invoice.taxRate}
            onChange={(e) => update("taxRate", Number(e.target.value))}
          />
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-zinc-500">Subtotal: {subtotal.toFixed(2)}</p>
          {invoice.taxRate > 0 && (
            <p className="text-sm text-zinc-500">Tax: {tax.toFixed(2)}</p>
          )}
          <p className="text-lg font-bold text-indigo-600">
            Total: {invoice.currency} {total.toFixed(2)}
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Notes
        </label>
        <textarea
          className={inputClass}
          rows={2}
          placeholder="Payment terms, bank details..."
          value={invoice.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Save invoice
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
