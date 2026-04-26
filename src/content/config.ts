import { defineCollection, z } from 'astro:content';

const facultyCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    initials: z.string().max(3),
    role: z.string(),
    department: z.string(),
    bio: z.string(),
    credentials: z.string().optional(),
    type: z.enum(['director', 'core', 'visiting', 'advisory']),
    portraitTone: z.enum(['maroon', 'teal', 'maroon-dark', 'maroon-deep', 'teal-mid']).optional(),
    quote: z.string().optional(),
    teaches: z.string().optional(),
    research: z.string().optional(),
    publications: z.string().optional(),
    education: z.string().optional(),
    order: z.number().default(100),
  }),
});

const programmesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.enum(['MBA-BF', 'MMS', 'BMS', 'PHD']),
    numeral: z.string(),
    eyebrow: z.string(),
    title: z.string(),
    titleEm: z.string().optional(),
    shortName: z.string(),
    duration: z.string(),
    type: z.string(),
    affiliation: z.string(),
    seats: z.number(),
    tuitionPerYear: z.number(),
    applicationFee: z.number(),
    blurb: z.string(),
    lead: z.string(),
    body: z.string(),
    eligibility: z.string(),
    intake: z.string(),
    tuitionLine: z.string(),
    specialisations: z.string().optional(),
    tags: z.array(z.string()),
    curriculum: z
      .array(
        z.object({
          label: z.string(),
          title: z.string(),
          body: z.string(),
        }),
      )
      .optional(),
    order: z.number().default(100),
  }),
});

const eventsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    category: z.enum(['academic', 'industry', 'cultural', 'civic', 'placement']),
    categoryLabel: z.string(),
    date: z.string(),
    excerpt: z.string(),
    featured: z.boolean().default(false),
    visualTone: z
      .enum(['ink', 'accent', 'teal', 'cream', 'ink-mid', 'maroon', 'brass'])
      .default('ink'),
    iconPath: z.string(),
    order: z.number().default(100),
  }),
});

const alumniCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    initials: z.string().max(3),
    programme: z.string(),
    cohort: z.string(),
    role: z.string(),
    company: z.string(),
    quote: z.string(),
    spotlight: z.boolean().default(false),
    spotlightBody: z.string().optional(),
    spotlightQuote: z.string().optional(),
    avatarTone: z.enum(['accent', 'teal', 'brass-maroon', 'ink', 'teal-ink']).optional(),
    order: z.number().default(100),
  }),
});

export const collections = {
  faculty: facultyCollection,
  programmes: programmesCollection,
  events: eventsCollection,
  alumni: alumniCollection,
};
