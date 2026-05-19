import type { Invoice, UserPlan } from "./types";
import { FREE_INVOICE_LIMIT } from "./constants";

const INVOICES_KEY = "invoiceforge_invoices";
const PLAN_KEY = "invoiceforge_plan";
const USAGE_KEY = "invoiceforge_usage";

type Usage = { month: string; count: number };

function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getUsage(): Usage {
  if (typeof window === "undefined") return { month: currentMonth(), count: 0 };
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { month: currentMonth(), count: 0 };
    const usage = JSON.parse(raw) as Usage;
    if (usage.month !== currentMonth()) return { month: currentMonth(), count: 0 };
    return usage;
  } catch {
    return { month: currentMonth(), count: 0 };
  }
}

function setUsage(usage: Usage): void {
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

export function getPlan(): UserPlan {
  if (typeof window === "undefined") return "free";
  return (localStorage.getItem(PLAN_KEY) as UserPlan) || "free";
}

export function setPlan(plan: UserPlan): void {
  localStorage.setItem(PLAN_KEY, plan);
}

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    return raw ? (JSON.parse(raw) as Invoice[]) : [];
  } catch {
    return [];
  }
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = getInvoices();
  const idx = invoices.findIndex((i) => i.id === invoice.id);
  if (idx >= 0) invoices[idx] = invoice;
  else invoices.unshift(invoice);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

export function deleteInvoice(id: string): void {
  const invoices = getInvoices().filter((i) => i.id !== id);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

export function getInvoice(id: string): Invoice | undefined {
  return getInvoices().find((i) => i.id === id);
}

export function canCreateInvoice(): { allowed: boolean; remaining: number; limit: number } {
  const plan = getPlan();
  if (plan === "pro") {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }
  const usage = getUsage();
  const remaining = Math.max(0, FREE_INVOICE_LIMIT - usage.count);
  return {
    allowed: remaining > 0,
    remaining,
    limit: FREE_INVOICE_LIMIT,
  };
}

export function recordInvoiceCreated(): void {
  const plan = getPlan();
  if (plan === "pro") return;
  const usage = getUsage();
  setUsage({ month: currentMonth(), count: usage.count + 1 });
}

export function invoiceTotals(invoice: Invoice) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const tax = subtotal * (invoice.taxRate / 100);
  const total = subtotal + tax;
  return { subtotal, tax, total };
}
