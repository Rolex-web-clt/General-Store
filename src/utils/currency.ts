/**
 * Currency configuration and formatting utilities for Nepali Rupees (NPR).
 * In the Nepali market, currency is universally denoted as "Rs." or "रू" (NPR).
 */

export const CURRENCY_SYMBOL = 'Rs.';
export const CURRENCY_CODE = 'NPR';
export const CURRENCY_NAME = 'Nepali Rupees';
export const CURRENCY_NEPALI_SYMBOL = 'रू';

/**
 * Formats a monetary amount into standard Nepali Rupee notation.
 * e.g. 1450 -> "Rs. 1,450", 285.5 -> "Rs. 285.50", 0 -> "Rs. 0"
 */
export function formatPrice(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === '') {
    return `${CURRENCY_SYMBOL} 0`;
  }
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return `${CURRENCY_SYMBOL} 0`;
  }

  const isInteger = Number.isInteger(num);
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `${CURRENCY_SYMBOL} ${formatted}`;
}

/**
 * Returns clean short formatted price without decimal cents (rounded to nearest rupee)
 * e.g. 1450.25 -> "Rs. 1,450"
 */
export function formatPriceShort(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === '') {
    return `${CURRENCY_SYMBOL} 0`;
  }
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return `${CURRENCY_SYMBOL} 0`;
  }
  return `${CURRENCY_SYMBOL} ${Math.round(num).toLocaleString('en-IN')}`;
}
