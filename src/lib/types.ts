export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  rate: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  dueDate: string;
  status: "draft" | "sent" | "paid";
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  toName: string;
  toEmail: string;
  toAddress: string;
  items: LineItem[];
  notes: string;
  taxRate: number;
  currency: string;
};

export type UserPlan = "free" | "pro";
