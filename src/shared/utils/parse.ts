export function numberFromString(val: unknown) {
  if (typeof val === "string" && val.trim() !== "") {
    const num = Number(val);
    return Number.isNaN(num) ? val : num;
  }
  return val;
}

export function dateFromString(val: unknown) {
  if (typeof val === "string") {
    const parsed = new Date(val);
    return Number.isNaN(parsed.getTime()) ? val : parsed;
  }
  return val;
}
