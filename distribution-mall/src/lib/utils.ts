export function formatPrice(price: number, currency: string = "¥"): string {
  return `${currency}${price.toFixed(2)}`;
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD${timestamp}${random}`;
}

export function generateInviteCode(length: number = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export interface CommissionLevel {
  level: number;
  rate: number;
}

export function calculateCommission(
  orderAmount: number,
  levels: CommissionLevel[]
): { total: number; details: { level: number; amount: number }[] } {
  const details = levels.map(({ level, rate }) => ({
    level,
    amount: Number((orderAmount * rate).toFixed(2)),
  }));

  const total = Number(
    details.reduce((sum, d) => sum + d.amount, 0).toFixed(2)
  );

  return { total, details };
}

export function formatDate(
  date: Date | string | number,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return "";
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}
