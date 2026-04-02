import { prisma } from "../../shared/lib/db";
import { decimalToNumber } from "../records/records.service";

export async function getTotals() {
  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME" },
    }),
    prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE" },
    }),
  ]);

  const totalIncome = decimalToNumber(incomeAgg._sum.amount);
  const totalExpenses = decimalToNumber(expenseAgg._sum.amount);
  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
  };
}

export async function getCategoryTotals(type?: string) {
  const rows = type
    ? await prisma.$queryRaw<any[]>`
        SELECT category, SUM(amount) AS total
        FROM "Record"
        WHERE type = ${type}
        GROUP BY category
        ORDER BY category ASC;
      `
    : await prisma.$queryRaw<any[]>`
        SELECT category, SUM(amount) AS total
        FROM "Record"
        GROUP BY category
        ORDER BY category ASC;
      `;

  return rows.map((item) => ({
    category: item.category,
    total: decimalToNumber(item.total),
  }));
}

export async function getTrends() {
  const rows = await prisma.$queryRaw<any[]>`
    SELECT
      to_char(date, 'YYYY-MM') AS month,
      SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expense
    FROM "Record"
    GROUP BY month
    ORDER BY month DESC;
  `;

  return rows.map((row) => {
    const income = decimalToNumber(row.income);
    const expense = decimalToNumber(row.expense);
    return {
      month: row.month as string,
      income,
      expense,
      net: income - expense,
    };
  });
}

export async function getRecent(limit = 10) {
  const records = await prisma.record.findMany({
    orderBy: { date: "desc" },
    take: limit,
  });

  return records.map((record) => ({
    ...record,
    amount: decimalToNumber(record.amount),
  }));
}
