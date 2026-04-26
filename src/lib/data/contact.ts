/** Contact page: desks, FAQ entries, getting-here tips. */

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

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: 'Do you accept walk-in enquiries on weekdays?',
    a: 'Yes. The admissions desk is open Monday to Saturday, 09:30 to 18:00 IST. Sundays are closed except during the application season (March–May), when we hold weekend campus tours by appointment.',
  },
  {
    q: 'Is hostel accommodation provided on campus?',
    a: 'The institute does not maintain its own hostel. We share a vetted list of paying-guest accommodations within walking distance, ranging from ₹15,000 to ₹35,000 per month depending on occupancy.',
  },
  {
    q: 'Can international students apply?',
    a: 'Yes, BGIMS welcomes international applicants for the MBA Banking & Finance and Ph.D. programmes. Equivalence is established through the Association of Indian Universities. Please write to admissions for a guided pathway.',
  },
  {
    q: 'Are there evening or part-time programmes?',
    a: 'The MBA, MMS and BMS are full-time, day-time programmes. The Ph.D. programme allows for part-time engagement subject to course-work attendance. We do not currently offer an executive evening MBA.',
  },
  {
    q: 'How are placements coordinated?',
    a: 'The Placement Cell, led by Mr. Kiran Joshi, manages corporate relations year-round. Final placements are conducted on campus in February–April; summer internships in October–November. Recruiters are listed on the home page.',
  },
  {
    q: 'Is the institute approved by AICTE / UGC?',
    a: 'Yes. BGIMS is approved by the All India Council for Technical Education (AICTE), affiliated to the University of Mumbai, and accredited by NAAC at B++ grade. The DTE Choice Code is 311310210.',
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
