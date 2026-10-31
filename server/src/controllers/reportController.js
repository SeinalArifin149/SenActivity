import { prisma } from "../db.js";
import { querySchema } from "../validators/transaction.js";
import { serialize } from "../services/transactionService.js";

const getWhere = (query) => query.startDate || query.endDate ? { transactionDate: { ...(query.startDate && { gte: query.startDate }), ...(query.endDate && { lte: query.endDate }) } } : {};

export async function reportSummary(req, res) {
  const query = querySchema.pick({ startDate: true, endDate: true }).parse(req.query);
  const rows = await prisma.transaction.groupBy({ by: ["type"], where: getWhere(query), _sum: { amount: true }, _count: true });
  res.json(rows.map((row) => ({ type: row.type, amount: Number(row._sum.amount || 0), count: row._count })));
}
export async function reportCategories(req, res) {
  const query = querySchema.pick({ startDate: true, endDate: true }).parse(req.query);
  const rows = await prisma.transaction.groupBy({ by: ["category"], where: { ...getWhere(query), type: "EXPENSE" }, _sum: { amount: true } });
  res.json(rows.map((row) => ({ name: row.category, value: Number(row._sum.amount || 0) })));
}
export async function reportMonthly(req, res) {
  const query = querySchema.pick({ startDate: true, endDate: true }).parse(req.query);
  const rows = (await prisma.transaction.findMany({ where: getWhere(query), orderBy: { transactionDate: "asc" } })).map(serialize);
  const result = Object.values(rows.reduce((acc, item) => {
    const month = item.transactionDate.toISOString().slice(0, 7);
    acc[month] ??= { month, income: 0, expense: 0 };
    acc[month][item.type === "INCOME" ? "income" : "expense"] += item.amount;
    return acc;
  }, {}));
  res.json(result);
}
