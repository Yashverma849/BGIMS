/**
 * Shared zod schemas used by both the public client (form validation) and the
 * server API routes (request validation). Keeping the schemas in one place is
 * the seam that lets us evolve from mocked localStorage to real persistence
 * without divergence between client and server expectations.
 */

import { z } from 'zod';

export const ProgrammeIdSchema = z.enum(['MBA-BF', 'MMS', 'BMS', 'PHD']);
export type ProgrammeId = z.infer<typeof ProgrammeIdSchema>;

export const PaymentMethodSchema = z.enum(['upi', 'card', 'netbanking', 'wallet']);
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const ApplicationStatusSchema = z.enum([
  'submitted',
  'shortlisted',
  'interviewed',
  'offered',
  'rejected',
]);
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const ApplicationPersonalSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  dob: z.string().min(1),
  gender: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pin: z.string().regex(/^\d{6}$/, 'PIN must be 6 digits'),
});

export const ApplicationAcademicSchema = z.object({
  x_board: z.string().min(1),
  x_year: z.coerce.number().int().min(1950).max(2030),
  x_score: z.string().min(1),
  xii_board: z.string().min(1),
  xii_year: z.coerce.number().int().min(1950).max(2030),
  xii_score: z.string().min(1),
  ug_university: z.string().optional().default(''),
  ug_programme: z.string().optional().default(''),
  ug_score: z.string().optional().default(''),
  entrance_test: z.string().optional().default(''),
  entrance_year: z.union([z.coerce.number().int(), z.literal('')]).optional(),
  entrance_score: z.string().optional().default(''),
});

export const ApplicationSchema = z.object({
  id: z.string(),
  submittedAt: z.string(),
  personal: ApplicationPersonalSchema,
  academic: ApplicationAcademicSchema,
  programme: ProgrammeIdSchema,
  sop: z.string().max(4000).optional().default(''),
  ref_name: z.string().optional().default(''),
  ref_email: z.union([z.string().email(), z.literal('')]).optional(),
  payMethod: PaymentMethodSchema,
  amount: z.string(),
  status: ApplicationStatusSchema.default('submitted'),
  payment: z.object({
    id: z.string(),
    method: PaymentMethodSchema,
    amount: z.string(),
    capturedAt: z.string(),
  }),
});

export type Application = z.infer<typeof ApplicationSchema>;

export const EnquirySchema = z.object({
  id: z.string(),
  received: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().default(''),
  programme: z.string().optional().default('General enquiry'),
  message: z.string().min(1),
  consent: z.boolean().optional(),
});

export type Enquiry = z.infer<typeof EnquirySchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const SessionSchema = z.object({
  email: z.string().email(),
  signedInAt: z.string(),
  role: z.enum(['Director', 'Staff']),
});
export type Session = z.infer<typeof SessionSchema>;

export const ContentDraftSchema = z.object({
  eyebrow: z.string(),
  h1: z.string(),
  lede: z.string(),
});
export type ContentDraft = z.infer<typeof ContentDraftSchema>;

/** Generate a short opaque application id, identical shape to the legacy mock. */
export function newApplicationId(now = Date.now()): string {
  return 'BGIMS-' + now.toString(36).toUpperCase().slice(-6);
}

export function newPaymentId(): string {
  return 'pay_' + Math.random().toString(36).slice(2, 14);
}

export function newEnquiryId(now = Date.now()): string {
  return 'ENQ-' + now.toString(36).toUpperCase();
}
