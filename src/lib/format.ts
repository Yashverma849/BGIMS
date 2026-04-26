/**
 * Display formatters. Centralised so currency, percentage and date rendering
 * stay consistent across pages (and tests stay simple).
 */

export const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const INR_SHORT = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatINR = (n: number): string => INR.format(n);
export const formatINRShort = (n: number): string => INR_SHORT.format(n);
export const formatNumber = (n: number): string => n.toLocaleString('en-IN');

const GST_RATE = 0.18;

export interface FeeBreakdown {
  base: number;
  gst: number;
  total: number;
  baseLabel: string;
  gstLabel: string;
  totalLabel: string;
}

export function feeBreakdown(base: number): FeeBreakdown {
  const gst = Math.round(base * GST_RATE);
  const total = base + gst;
  return {
    base,
    gst,
    total,
    baseLabel: formatINR(base),
    gstLabel: formatINR(gst),
    totalLabel: formatINR(total),
  };
}

export function formatDate(input: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  return d.toLocaleDateString('en-IN', opts ?? { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateShort(input: string | Date): string {
  return formatDate(input, { day: '2-digit', month: 'short' });
}
