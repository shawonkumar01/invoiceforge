"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InvoiceForm } from "@/components/InvoiceForm";
import {
  canCreateInvoice,
  recordInvoiceCreated,
  saveInvoice,
} from "@/lib/storage";
import type { Invoice } from "@/lib/types";
import Link from "next/link";

export default function NewInvoicePage() {
  const router = useRouter();
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const check = canCreateInvoice();
    setBlocked(!check.allowed);
  }, []);

  const handleSave = (invoice: Invoice) => {
    const check = canCreateInvoice();
    if (!check.allowed) {
      setBlocked(true);
      return;
    }
    saveInvoice(invoice);
    recordInvoiceCreated();
    router.push(`/invoice/${invoice.id}`);
  };

  if (blocked) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Monthly limit reached
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          You&apos;ve used all free invoices this month. Upgrade to Pro for unlimited
          invoices.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500"
        >
          Upgrade to Pro — $12/mo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">New invoice</h1>
      <p className="mt-1 mb-8 text-sm text-zinc-600 dark:text-zinc-400">
        Fill in details below and save to download PDF.
      </p>
      <InvoiceForm
        onSave={handleSave}
        onCancel={() => router.push("/dashboard")}
      />
    </div>
  );
}
