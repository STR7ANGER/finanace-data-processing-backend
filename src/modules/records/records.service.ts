import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/lib/db";
import { RecordType } from "../../shared/types/constants";

const ALLOWED_SORT_FIELDS = new Set(["date", "amount", "createdAt"]);

function parseSort(sortValue?: string) {
  if (!sortValue) return { date: "desc" as const };
  const direction = sortValue.startsWith("-") ? "desc" : "asc";
  const field = sortValue.replace(/^-/, "");
  if (!ALLOWED_SORT_FIELDS.has(field)) return { date: "desc" as const };
  return { [field]: direction } as any;
}

export function decimalToNumber(value: unknown) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (value instanceof Prisma.Decimal) return value.toNumber();
  return Number(value) || 0;
}

export async function listRecords(filters: {
  type?: RecordType;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  pageSize?: number;
  sort?: string;
}) {
  const {
    type,
    category,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 20,
    sort,
  } = filters;

  const where: any = {};
  if (type) where.type = type;
  if (category) where.category = category;
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = dateFrom;
    if (dateTo) where.date.lte = dateTo;
  }

  const [total, records] = await Promise.all([
    prisma.record.count({ where }),
    prisma.record.findMany({
      where,
      orderBy: parseSort(sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    data: records.map((record) => ({
      ...record,
      amount: decimalToNumber(record.amount),
    })),
    page,
    pageSize,
    total,
  };
}

export async function createRecord(payload: {
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  description?: string;
}, userId: string) {
  const created = await prisma.record.create({
    data: {
      amount: new Prisma.Decimal(payload.amount),
      type: payload.type,
      category: payload.category,
      date: payload.date,
      description: payload.description,
      createdById: userId,
    },
  });

  return {
    ...created,
    amount: decimalToNumber(created.amount),
  };
}

export async function updateRecord(recordId: string, payload: {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: Date;
  description?: string;
}) {
  const updated = await prisma.record.update({
    where: { id: recordId },
    data: {
      amount: payload.amount !== undefined ? new Prisma.Decimal(payload.amount) : undefined,
      type: payload.type,
      category: payload.category,
      date: payload.date,
      description: payload.description,
      updatedAt: new Date(),
    },
  });

  return {
    ...updated,
    amount: decimalToNumber(updated.amount),
  };
}

export async function deleteRecord(recordId: string) {
  return prisma.record.delete({ where: { id: recordId } });
}
