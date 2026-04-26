import { describe, it, expect } from 'vitest';
import {
  ApplicationSchema,
  EnquirySchema,
  LoginSchema,
  newApplicationId,
  newEnquiryId,
  newPaymentId,
} from '../../src/lib/schema';

describe('id generators', () => {
  it('generates a BGIMS-prefixed application id of expected shape', () => {
    expect(newApplicationId()).toMatch(/^BGIMS-[A-Z0-9]{6}$/);
  });
  it('generates an ENQ-prefixed enquiry id', () => {
    expect(newEnquiryId()).toMatch(/^ENQ-[A-Z0-9]+$/);
  });
  it('generates a Razorpay-style payment id', () => {
    const id = newPaymentId();
    expect(id.startsWith('pay_')).toBe(true);
    expect(id.length).toBeGreaterThanOrEqual(8);
  });
});

describe('EnquirySchema', () => {
  const valid = {
    id: 'ENQ-1',
    received: new Date().toISOString(),
    name: 'Aanya Iyer',
    email: 'aanya@example.com',
    phone: '+91 9819999999',
    programme: 'MMS',
    message: 'I would like the prospectus.',
  };

  it('accepts a well-formed enquiry', () => {
    expect(EnquirySchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an enquiry without an email', () => {
    const r = EnquirySchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(r.success).toBe(false);
  });

  it('defaults phone and programme when omitted', () => {
    const { name, email, message, id, received } = valid;
    const r = EnquirySchema.safeParse({ name, email, message, id, received });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.phone).toBe('');
      expect(r.data.programme).toBe('General enquiry');
    }
  });
});

describe('ApplicationSchema', () => {
  const valid = {
    id: 'BGIMS-ABC123',
    submittedAt: new Date().toISOString(),
    personal: {
      firstName: 'Karan',
      lastName: 'Kothari',
      email: 'karan@example.com',
      phone: '+91 9000000000',
      dob: '2000-01-01',
      gender: 'Male',
      address: 'Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pin: '400008',
    },
    academic: {
      x_board: 'CBSE',
      x_year: 2018,
      x_score: '92%',
      xii_board: 'CBSE',
      xii_year: 2020,
      xii_score: '90%',
    },
    programme: 'MBA-BF' as const,
    payMethod: 'upi' as const,
    amount: '₹1,770.00',
    payment: {
      id: 'pay_abcdef123456',
      method: 'upi' as const,
      amount: '₹1,770.00',
      capturedAt: new Date().toISOString(),
    },
  };

  it('accepts a well-formed application', () => {
    expect(ApplicationSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a non-6-digit pin', () => {
    const r = ApplicationSchema.safeParse({
      ...valid,
      personal: { ...valid.personal, pin: '12345' },
    });
    expect(r.success).toBe(false);
  });

  it('rejects an unknown programme id', () => {
    const r = ApplicationSchema.safeParse({ ...valid, programme: 'EMBA' as never });
    expect(r.success).toBe(false);
  });
});

describe('LoginSchema', () => {
  it('requires a valid email and a 6+ char password', () => {
    expect(LoginSchema.safeParse({ email: 'x@y.com', password: 'short' }).success).toBe(false);
    expect(LoginSchema.safeParse({ email: 'director@mmbgims.com', password: 'bgims2026' }).success).toBe(true);
  });
});
