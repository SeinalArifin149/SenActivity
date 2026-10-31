import { prisma } from "../db.js";
import { createTransaction, deleteTransaction, listTransactions, updateTransaction, serialize } from "../services/transactionService.js";
import { querySchema, transactionSchema } from "../validators/transaction.js";

export async function getTransactions(req, res) {
  res.json(await listTransactions(querySchema.parse(req.query)));
}
export async function postTransaction(req, res) {
  res.status(201).json({ data: await createTransaction(transactionSchema.parse(req.body)) });
}
export async function putTransaction(req, res) {
  res.json({ data: await updateTransaction(req.params.id, transactionSchema.parse(req.body)) });
}
export async function removeTransaction(req, res) {
  await deleteTransaction(req.params.id);
  res.status(204).end();
}

export async function dashboardSummary(req, res) {
  const query = querySchema.pick({ startDate: true, endDate: true }).parse(req.query);
  const rows = await prisma.transaction.groupBy({ by: ["type"], where: query.startDate || query.endDate ? { transactionDate: { ...(query.startDate && { gte: query.startDate }), ...(query.endDate && { lte: query.endDate }) } } : {}, _sum: { amount: true }, _count: true });
  const income = Number(rows.find((row) => row.type === "INCOME")?._sum.amount || 0);
  const expense = Number(rows.find((row) => row.type === "EXPENSE")?._sum.amount || 0);
  res.json({ income, expense, balance: income - expense, count: rows.reduce((sum, row) => sum + row._count, 0) });
}

export async function dashboardCharts(req, res) {
  const query = querySchema.pick({ startDate: true, endDate: true }).parse(req.query);
  const where = query.startDate || query.endDate ? { transactionDate: { ...(query.startDate && { gte: query.startDate }), ...(query.endDate && { lte: query.endDate }) } } : {};
  const transactions = (await prisma.transaction.findMany({ where, orderBy: { transactionDate: "asc" } })).map(serialize);
  const byDate = Object.values(transactions.reduce((acc, item) => {
    const key = item.transactionDate.toISOString().slice(0, 10);
    acc[key] ??= { date: key, income: 0, expense: 0 };
    acc[key][item.type === "INCOME" ? "income" : "expense"] += item.amount;
    return acc;
  }, {}));
  const categories = Object.values(transactions.filter((item) => item.type === "EXPENSE").reduce((acc, item) => {
    acc[item.category] = acc[item.category] || { name: item.category, value: 0 };
    acc[item.category].value += item.amount;
    return acc;
  }, {}));
  res.json({ trend: byDate, categories });
}
