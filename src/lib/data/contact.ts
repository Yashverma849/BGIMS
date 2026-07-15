/** Contact page: desks, getting-here tips, alumni content. */

export interface ContactDesk {
  numeral: string;
  title: string;
  blurb: string;
  email: string;
  phoneDisplay: string;
  phoneTel: string;
  hours: string;
}

export const CONTACT_DESKS: ContactDesk[] = [
  {
    numeral: 'Desk · I',
    title: 'Admissions',
    blurb:
      'Application queries, prospectus requests, scholarship advice and campus visit slots.',
    email: 'admissions@mmbgims.com',
    phoneDisplay: '+91 96195 10513',
    phoneTel: '+919619510513',
    hours: 'Mon — Sat · 09:30 to 18:00 IST',
  },
  {
    numeral: 'Desk · II',
    title: 'Placements & Recruiting',
    blurb:
      'Recruiter relations, internship outreach and corporate partnerships. Placement Cell · Mr. Kiran Joshi.',
    email: 'placements@mmbgims.com',
    phoneDisplay: '+91 22 2300 0000',
    phoneTel: '+912223000000',
    hours: 'Mon — Fri · 10:00 to 17:30 IST',
  },
  {
    numeral: 'Desk · III',
    title: 'General & Media',
    blurb:
      'Alumni relations, press, faculty enquiries, research collaborations and student grievances.',
    email: 'office@mmbgims.com',
    phoneDisplay: '+91 22 2300 0001',
    phoneTel: '+912223000001',
    hours: 'Mon — Fri · 10:00 to 17:00 IST',
  },
];

export const GETTING_HERE = [
  { mode: 'Train', body: 'Mumbai Central WR / Mahalaxmi · 5 minutes walk' },
  { mode: 'Metro', body: 'Mumbai Central Metro (Line 3) · 4 minutes walk' },
  { mode: 'Bus', body: 'BEST routes 66, 70, 124 · alight at Maratha Mandir' },
  { mode: 'Taxi', body: '"Maratha Mandir Theatre" — every Mumbai cabbie knows it' },
];

export const ALUMNI_PERKS = [
  {
    title: 'Lifetime library access',
    body: 'Borrow up to four titles at a time from a 24,000-volume collection, including the Mukherjee economics archive.',
  },
  {
    title: 'Mentor a current student',
    body: 'The 1-to-1 alumni mentorship programme pairs you with a final-year student for six guided meetings over the academic year.',
  },
  {
    title: 'Career re-engagement',
    body: 'The placement office continues to support alumni for life — referrals, advanced-stage coaching, executive education slots.',
  },
  {
    title: 'Regional chapters',
    body: 'Fourteen active chapters — Mumbai, Pune, Bangalore, Hyderabad, Delhi, NYC, London, Singapore — with quarterly gatherings.',
  },
];

export const ALUMNI_GLOBE = [
  { count: 2000, suffix: '+', label: 'Total alumni since 2004' },
  { count: 42, suffix: '', label: 'Countries represented' },
  { count: 14, suffix: '', label: 'Active regional chapters' },
  { count: 68, suffix: '%', label: 'Engaged in mentorship' },
];
