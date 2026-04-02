export const ROLE_VALUES = ["VIEWER", "ANALYST", "ADMIN"] as const;
export const STATUS_VALUES = ["ACTIVE", "INACTIVE"] as const;
export const RECORD_TYPE_VALUES = ["INCOME", "EXPENSE"] as const;

export type Role = typeof ROLE_VALUES[number];
export type Status = typeof STATUS_VALUES[number];
export type RecordType = typeof RECORD_TYPE_VALUES[number];
