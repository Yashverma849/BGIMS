/**
 * Drizzle schema for the institute's primary database.
 *
 * Conventions:
 * - text ids (BGIMS-XXXXXX, ENQ-XXXX, etc.) so URLs and CSV exports stay
 *   stable across machines and migrations.
 * - JSON columns for the application + enquiry payloads — the public-facing
 *   schema lives in src/lib/schema.ts (zod) and is re-validated on read so
 *   any future shape change is caught loudly, not silently.
 * - audit_log captures every admin write so the institute can reconstruct
 *   "who changed this and when" without reaching for git blame.
 *
 * SQLite today (single-file deployment, zero infra), Postgres tomorrow
 * (one driver swap; column types and SQL stay the same).
 */

import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─────────── users ───────────
export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    /** Argon2id hash; never returned to clients. */
    passwordHash: text('password_hash').notNull(),
    role: text('role', { enum: ['Director', 'Staff'] }).notNull().default('Staff'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    lastLoginAt: integer('last_login_at', { mode: 'timestamp_ms' }),
    /** Soft-delete: filtered out of all reads. */
    deletedAt: integer('deleted_at', { mode: 'timestamp_ms' }),
  },
  (t) => ({
    emailIdx: index('users_email_idx').on(t.email),
  }),
);

// ─────────── applications ───────────
export const applications = sqliteTable(
  'applications',
  {
    /** BGIMS-XXXXXX — generated client-side, validated server-side. */
    id: text('id').primaryKey(),
    programme: text('programme', { enum: ['MBA-BF', 'MMS', 'BMS', 'PHD'] }).notNull(),
    status: text('status', {
      enum: ['submitted', 'shortlisted', 'interviewed', 'offered', 'rejected'],
    })
      .notNull()
      .default('submitted'),
    /** First/last/email duplicated out of payload for fast list queries. */
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    amountInPaise: integer('amount_in_paise').notNull(),
    payMethod: text('pay_method', { enum: ['upi', 'card', 'netbanking', 'wallet'] }).notNull(),
    paymentId: text('payment_id').notNull(),
    /** Full Application JSON (zod-validated on read). */
    payload: text('payload', { mode: 'json' }).notNull(),
    submittedAt: integer('submitted_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    programmeIdx: index('apps_programme_idx').on(t.programme),
    statusIdx: index('apps_status_idx').on(t.status),
    submittedIdx: index('apps_submitted_idx').on(t.submittedAt),
    emailIdx: index('apps_email_idx').on(t.email),
  }),
);

// ─────────── enquiries ───────────
export const enquiries = sqliteTable(
  'enquiries',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull().default(''),
    programme: text('programme').notNull().default('General enquiry'),
    message: text('message').notNull(),
    consent: integer('consent', { mode: 'boolean' }).notNull().default(false),
    /** Triage state for the admissions desk. */
    status: text('status', { enum: ['new', 'contacted', 'closed'] }).notNull().default('new'),
    receivedAt: integer('received_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => ({
    receivedIdx: index('enq_received_idx').on(t.receivedAt),
    statusIdx: index('enq_status_idx').on(t.status),
  }),
);

// ─────────── content drafts ───────────
export const contentDrafts = sqliteTable('content_drafts', {
  /** e.g. 'home_hero' — one draft per content surface. */
  key: text('key').primaryKey(),
  payload: text('payload', { mode: 'json' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedBy: integer('updated_by').references(() => users.id, { onDelete: 'set null' }),
});

// ─────────── audit log ───────────
export const auditLog = sqliteTable(
  'audit_log',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    actorId: integer('actor_id').references(() => users.id, { onDelete: 'set null' }),
    actorEmail: text('actor_email'),
    action: text('action').notNull(),
    targetType: text('target_type'),
    targetId: text('target_id'),
    ip: text('ip'),
    userAgent: text('user_agent'),
    metadata: text('metadata', { mode: 'json' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => ({
    actorIdx: index('audit_actor_idx').on(t.actorId),
    createdIdx: index('audit_created_idx').on(t.createdAt),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ApplicationRow = typeof applications.$inferSelect;
export type EnquiryRow = typeof enquiries.$inferSelect;
export type ContentDraftRow = typeof contentDrafts.$inferSelect;
export type AuditEntry = typeof auditLog.$inferSelect;
