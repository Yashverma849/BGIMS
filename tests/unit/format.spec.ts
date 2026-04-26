import { describe, it, expect } from 'vitest';
import { formatINR, formatINRShort, formatNumber, feeBreakdown, formatDate } from '../../src/lib/format';

describe('format', () => {
  it('formats INR with two decimals', () => {
    expect(formatINR(1500)).toBe('₹1,500.00');
    expect(formatINR(2950)).toBe('₹2,950.00');
  });

  it('formats INR short with no decimals', () => {
    expect(formatINRShort(1770)).toBe('₹1,770');
  });

  it('formats numbers with the Indian thousands grouping', () => {
    expect(formatNumber(100000)).toBe('1,00,000');
    expect(formatNumber(2000)).toBe('2,000');
  });

  it('computes the fee breakdown with 18% GST and matching labels', () => {
    const { base, gst, total, baseLabel, gstLabel, totalLabel } = feeBreakdown(1500);
    expect(base).toBe(1500);
    expect(gst).toBe(270);
    expect(total).toBe(1770);
    expect(baseLabel).toBe('₹1,500.00');
    expect(gstLabel).toBe('₹270.00');
    expect(totalLabel).toBe('₹1,770.00');
  });

  it('rounds GST to the nearest rupee', () => {
    const { gst } = feeBreakdown(2500);
    expect(gst).toBe(450);
  });

  it('formats dates in en-IN', () => {
    expect(formatDate('2024-06-22')).toMatch(/22 Jun 2024/);
  });
});
