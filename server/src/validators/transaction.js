import { z } from "zod";

export const incomeCategories = ["Gaji", "Freelance", "Bisnis", "Investasi", "Hadiah", "Lainnya"];
export const expenseCategories = ["Makanan", "Transportasi", "Kebutuhan sehari-hari", "Pendidikan", "Tagihan", "Hiburan", "Kesehatan", "Belanja", "Lainnya"];

const base = z.object({
  title: z.string().trim().min(1).max(120),
  amount: z.coerce.number().finite().positive().max(999999999999),
  category: z.string().trim().min(1).max(60),
  paymentMethod: z.string().trim().min(1).max(40),
  transactionDate: z.coerce.date(),
  notes: z.string().trim().max(500).optional().or(z.literal(""))
});

export const transactionSchema = base.extend({
  type: z.enum(["INCOME", "EXPENSE"])
}).superRefine((value, ctx) => {
  const allowed = value.type === "INCOME" ? incomeCategories : expenseCategories;
  if (!allowed.includes(value.category)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["category"], message: "Kategori tidak valid" });
});

export const querySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().trim().max(60).optional(),
  search: z.string().trim().max(120).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  sortBy: z.enum(["transactionDate", "amount", "title"]).default("transactionDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});
