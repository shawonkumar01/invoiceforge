import { jsPDF } from "jspdf";
import type { Invoice } from "./types";
import { invoiceTotals } from "./storage";
import { APP_NAME } from "./constants";

export function downloadInvoicePdf(invoice: Invoice, isPro: boolean): void {
  const doc = new jsPDF();
  const { subtotal, tax, total } = invoiceTotals(invoice);
  const margin = 20;
  let y = margin;

  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229);
  doc.text("INVOICE", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`#${invoice.invoiceNumber}`, margin, y);
  doc.text(`Date: ${invoice.createdAt}`, 140, y);
  y += 6;
  doc.text(`Due: ${invoice.dueDate}`, 140, y);
  y += 14;

  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text("From:", margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(invoice.fromName, margin, y);
  y += 5;
  doc.text(invoice.fromEmail, margin, y);
  y += 5;
  invoice.fromAddress.split("\n").forEach((line) => {
    doc.text(line, margin, y);
    y += 5;
  });

  y += 4;
  doc.setFontSize(11);
  doc.text("Bill To:", 110, y - 28);
  doc.setFontSize(10);
  doc.text(invoice.toName, 110, y - 22);
  doc.text(invoice.toEmail, 110, y - 17);
  let toY = y - 12;
  invoice.toAddress.split("\n").forEach((line) => {
    doc.text(line, 110, toY);
    toY += 5;
  });

  y = Math.max(y, toY) + 10;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, 190, y);
  y += 8;

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Description", margin, y);
  doc.text("Qty", 120, y);
  doc.text("Rate", 140, y);
  doc.text("Amount", 170, y);
  y += 6;
  doc.line(margin, y, 190, y);
  y += 6;

  doc.setTextColor(30, 30, 30);
  invoice.items.forEach((item) => {
    const amount = item.quantity * item.rate;
    doc.text(item.description.slice(0, 40), margin, y);
    doc.text(String(item.quantity), 120, y);
    doc.text(`${invoice.currency} ${item.rate.toFixed(2)}`, 140, y);
    doc.text(`${invoice.currency} ${amount.toFixed(2)}`, 170, y);
    y += 7;
  });

  y += 6;
  doc.text(`Subtotal: ${invoice.currency} ${subtotal.toFixed(2)}`, 140, y);
  y += 6;
  if (invoice.taxRate > 0) {
    doc.text(`Tax (${invoice.taxRate}%): ${invoice.currency} ${tax.toFixed(2)}`, 140, y);
    y += 6;
  }
  doc.setFontSize(12);
  doc.setTextColor(79, 70, 229);
  doc.text(`Total: ${invoice.currency} ${total.toFixed(2)}`, 140, y);
  y += 12;

  if (invoice.notes) {
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text("Notes:", margin, y);
    y += 6;
    doc.text(invoice.notes.slice(0, 200), margin, y);
  }

  if (!isPro) {
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Created with ${APP_NAME} — upgrade to remove branding`, margin, 285);
  }

  doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
}
