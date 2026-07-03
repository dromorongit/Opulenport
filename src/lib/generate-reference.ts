export function generatePaymentReference(prefix: string): string {
  const timestamp = Date.now();
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < bytes.length; i++) {
    suffix += chars[bytes[i] % chars.length];
  }
  return `${prefix}-${timestamp}-${suffix}`;
}
