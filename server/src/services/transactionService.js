import { prisma } from "../db.js";

const whereFrom = (query) => {
  const where = {};
  if (query.type) where.type = query.type;
  if (query.category) where.category = query.category;
  if (query.search) where.title = { contains: query.search };
  if (query.startDate || query.endDate) {
    where.transactionDate = {};
    if (query.startDate) where.transactionDate.gte = query.startDate;
    if (query.endDate) where.transactionDate.lte = query.endDate;
  }
  return where;
};

const serialize = (transaction) => ({ ...transaction, amount: Number(transaction.amount) });

export async function listTransactions(query) {
  const where = whereFrom(query);
  const [items, total, aggregate] = await Promise.all([
    prisma.transaction.findMany({
      where, skip: (query.page - 1) * query.limit, take: query.limit,
      orderBy: { [query.sortBy]: query.sortOrder }
    }),
    prisma.transaction.count({ where }),
    prisma.transaction.groupBy({ by: ["type"], where, _sum: { amount: true } })
  ]);
  return { items: items.map(serialize), total, page: query.page, limit: query.limit, totals: Object.fromEntries(aggregate.map((row) => [row.type, Number(row._sum.amount || 0)])) };
}

export async function createTransaction(data) {
  return serialize(await prisma.transaction.create({ data }));
}

export async function updateTransaction(id, data) {
  return serialize(await prisma.transaction.update({ where: { id }, data }));
}

export async function deleteTransaction(id) {
  await prisma.transaction.delete({ where: { id } });
}

export function dateRange(query) {
  return { transactionDate: { ...(query.startDate && { gte: query.startDate }), ...(query.endDate && { lte: query.endDate }) } };
}

export { serialize, whereFrom };
