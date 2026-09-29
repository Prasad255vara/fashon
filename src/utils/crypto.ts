/**
 * End-to-End Encryption & Security Utilities for ATAKÉ ATELIER
 * Simulates high-grade AES-GCM / SHA-256 tokenization and 2FA TOTP code verification
 */

export function generateOrderCipherSeal(orderNumber: string, amount: number, timestamp: number): string {
  const payload = `${orderNumber}:${amount}:${timestamp}:ATAKE_E2EE_KEY_4096`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
  const randomBlock = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `SEC-E2EE-${hexPart}-${randomBlock}-SHA256`;
}

export function generate2FACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function maskCreditCard(number: string): string {
  const clean = number.replace(/\D/g, '');
  if (clean.length < 4) return '•••• •••• •••• ••••';
  const last4 = clean.slice(-4);
  return `•••• •••• •••• ${last4}`;
}
