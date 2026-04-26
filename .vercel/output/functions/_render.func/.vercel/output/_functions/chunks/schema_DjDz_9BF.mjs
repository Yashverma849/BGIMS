import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    /** Argon2id hash; never returned to clients. */
    passwordHash: text("password_hash").notNull(),
    role: text("role", { enum: ["Director", "Staff"] }).notNull().default("Staff"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
    lastLoginAt: integer("last_login_at", { mode: "timestamp_ms" }),
    /** Soft-delete: filtered out of all reads. */
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" })
  },
  (t) => ({
    emailIdx: index("users_email_idx").on(t.email)
  })
);
const applications = sqliteTable(
  "applications",
  {
    /** BGIMS-XXXXXX — generated client-side, validated server-side. */
    id: text("id").primaryKey(),
    programme: text("programme", { enum: ["MBA-BF", "MMS", "BMS", "PHD"] }).notNull(),
    status: text("status", {
      enum: ["submitted", "shortlisted", "interviewed", "offered", "rejected"]
    }).notNull().default("submitted"),
    /** First/last/email duplicated out of payload for fast list queries. */
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    amountInPaise: integer("amount_in_paise").notNull(),
    payMethod: text("pay_method", { enum: ["upi", "card", "netbanking", "wallet"] }).notNull(),
    paymentId: text("payment_id").notNull(),
    /** Full Application JSON (zod-validated on read). */
    payload: text("payload", { mode: "json" }).notNull(),
    submittedAt: integer("submitted_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`)
  },
  (t) => ({
    programmeIdx: index("apps_programme_idx").on(t.programme),
    statusIdx: index("apps_status_idx").on(t.status),
    submittedIdx: index("apps_submitted_idx").on(t.submittedAt),
    emailIdx: index("apps_email_idx").on(t.email)
  })
);
const enquiries = sqliteTable(
  "enquiries",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    programme: text("programme").notNull().default("General enquiry"),
    message: text("message").notNull(),
    consent: integer("consent", { mode: "boolean" }).notNull().default(false),
    /** Triage state for the admissions desk. */
    status: text("status", { enum: ["new", "contacted", "closed"] }).notNull().default("new"),
    receivedAt: integer("received_at", { mode: "timestamp_ms" }).notNull()
  },
  (t) => ({
    receivedIdx: index("enq_received_idx").on(t.receivedAt),
    statusIdx: index("enq_status_idx").on(t.status)
  })
);
const contentDrafts = sqliteTable("content_drafts", {
  /** e.g. 'home_hero' — one draft per content surface. */
  key: text("key").primaryKey(),
  payload: text("payload", { mode: "json" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`),
  updatedBy: integer("updated_by").references(() => users.id, { onDelete: "set null" })
});
const auditLog = sqliteTable(
  "audit_log",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    actorId: integer("actor_id").references(() => users.id, { onDelete: "set null" }),
    actorEmail: text("actor_email"),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    metadata: text("metadata", { mode: "json" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().default(sql`(unixepoch() * 1000)`)
  },
  (t) => ({
    actorIdx: index("audit_actor_idx").on(t.actorId),
    createdIdx: index("audit_created_idx").on(t.createdAt)
  })
);

const schema = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  applications,
  auditLog,
  contentDrafts,
  enquiries,
  users
}, Symbol.toStringTag, { value: 'Module' }));

const DEFAULT_LOCAL_FILE = "./.data/mmbgims.db";
let _warned = false;
function resolveUrl() {
  const raw = process.env.DATABASE_URL;
  const onServerless = process.env.VERCEL === "1" || !!process.env.VERCEL_ENV || !!process.env.NETLIFY;
  if (raw && (raw.startsWith("libsql://") || raw.startsWith("https://"))) {
    return { url: raw, kind: "remote" };
  }
  if (raw && raw.startsWith("file:")) {
    const path = raw.slice("file:".length);
    const absolute2 = resolve(process.cwd(), path);
    try {
      mkdirSync(dirname(absolute2), { recursive: true });
      return { url: `file:${absolute2}`, kind: "file" };
    } catch {
    }
  }
  if (onServerless) {
    if (!_warned) {
      console.warn(
        "[db] DATABASE_URL not set on serverless host — using in-memory libSQL. Data will NOT persist between requests/instances. Set DATABASE_URL=libsql://… and DATABASE_AUTH_TOKEN to point at a Turso DB."
      );
      _warned = true;
    }
    return { url: ":memory:", kind: "memory" };
  }
  const absolute = resolve(process.cwd(), DEFAULT_LOCAL_FILE);
  mkdirSync(dirname(absolute), { recursive: true });
  return { url: `file:${absolute}`, kind: "file" };
}
let _db = null;
let _client = null;
let _migrationsApplied = false;
function getDb() {
  if (_db) return _db;
  const { url, kind } = resolveUrl();
  _client = createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN
  });
  _db = drizzle(_client, { schema });
  if (!_migrationsApplied && (kind === "file" || kind === "memory")) {
    const migrationsFolder = resolve(fileURLToPath(new URL("./migrations", import.meta.url)));
    if (existsSync(migrationsFolder)) {
      void migrate(_db, { migrationsFolder }).then(() => {
        _migrationsApplied = true;
      }).catch((err) => {
        console.error("[db] auto-migrate failed", err);
      });
    }
  }
  return _db;
}

const ProgrammeIdSchema = z.enum(["MBA-BF", "MMS", "BMS", "PHD"]);
const PaymentMethodSchema = z.enum(["upi", "card", "netbanking", "wallet"]);
const ApplicationStatusSchema = z.enum([
  "submitted",
  "shortlisted",
  "interviewed",
  "offered",
  "rejected"
]);
const ApplicationPersonalSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  dob: z.string().min(1),
  gender: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pin: z.string().regex(/^\d{6}$/, "PIN must be 6 digits")
});
const ApplicationAcademicSchema = z.object({
  x_board: z.string().min(1),
  x_year: z.coerce.number().int().min(1950).max(2030),
  x_score: z.string().min(1),
  xii_board: z.string().min(1),
  xii_year: z.coerce.number().int().min(1950).max(2030),
  xii_score: z.string().min(1),
  ug_university: z.string().optional().default(""),
  ug_programme: z.string().optional().default(""),
  ug_score: z.string().optional().default(""),
  entrance_test: z.string().optional().default(""),
  entrance_year: z.union([z.coerce.number().int(), z.literal("")]).optional(),
  entrance_score: z.string().optional().default("")
});
const ApplicationSchema = z.object({
  id: z.string(),
  submittedAt: z.string(),
  personal: ApplicationPersonalSchema,
  academic: ApplicationAcademicSchema,
  programme: ProgrammeIdSchema,
  sop: z.string().max(4e3).optional().default(""),
  ref_name: z.string().optional().default(""),
  ref_email: z.union([z.string().email(), z.literal("")]).optional(),
  payMethod: PaymentMethodSchema,
  amount: z.string(),
  status: ApplicationStatusSchema.default("submitted"),
  payment: z.object({
    id: z.string(),
    method: PaymentMethodSchema,
    amount: z.string(),
    capturedAt: z.string()
  })
});
const EnquirySchema = z.object({
  id: z.string(),
  received: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  programme: z.string().optional().default("General enquiry"),
  message: z.string().min(1),
  consent: z.boolean().optional()
});
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
z.object({
  email: z.string().email(),
  signedInAt: z.string(),
  role: z.enum(["Director", "Staff"])
});
const ContentDraftSchema = z.object({
  eyebrow: z.string(),
  h1: z.string(),
  lede: z.string()
});
function newApplicationId(now = Date.now()) {
  return "BGIMS-" + now.toString(36).toUpperCase().slice(-6);
}
function newPaymentId() {
  return "pay_" + Math.random().toString(36).slice(2, 14);
}
function newEnquiryId(now = Date.now()) {
  return "ENQ-" + now.toString(36).toUpperCase();
}

export { ApplicationSchema as A, ContentDraftSchema as C, EnquirySchema as E, LoginSchema as L, ProgrammeIdSchema as P, applications as a, auditLog as b, contentDrafts as c, ApplicationStatusSchema as d, enquiries as e, newApplicationId as f, getDb as g, newEnquiryId as h, newPaymentId as n, users as u };
