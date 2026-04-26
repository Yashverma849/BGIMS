/** Placements page data — KPIs, top placements, sector distribution,
 *  year-on-year cohort metrics. Edit here to update the placements page. */

export interface PlacementKpi {
  prefix?: string;
  count: number;
  suffix?: string;
  label: string;
  detail: string;
}

export const PLACEMENT_KPIS: PlacementKpi[] = [
  {
    count: 100,
    suffix: '%',
    label: 'Placement Assistance',
    detail: 'Every student supported through the full lifecycle — from CV first-draft to letter-of-intent.',
  },
  {
    prefix: '₹',
    count: 14,
    suffix: '.6L',
    label: 'Highest CTC · 2024',
    detail:
      'Class-of-2024 highest annual package, awarded to a Banking & Finance graduate at HDFC Asset Management.',
  },
  {
    prefix: '₹',
    count: 6,
    suffix: '.8L',
    label: 'Average CTC · 2024',
    detail: 'Cohort-wide average across all programmes, up 18% on the previous year.',
  },
  {
    count: 180,
    suffix: '+',
    label: 'Recruiting Partners',
    detail:
      'Institutional firms, consulting houses, banks, technology and pharma majors — many returning year on year.',
  },
];

export interface TopPlacement {
  name: string;
  programme: string;
  role: string;
  firm: string;
  ctcLabel: string;
  ctcNote?: string;
}

export const TOP_PLACEMENTS_2024: TopPlacement[] = [
  {
    name: 'Priya Deshmukh',
    programme: 'MBA · Banking & Finance · 2024',
    role: 'Asset Management Associate',
    firm: 'HDFC Asset Management Co.',
    ctcLabel: '₹14.6 LPA',
    ctcNote: 'cash + bonus',
  },
  {
    name: 'Arjun Iyer',
    programme: 'MMS · Finance · 2024',
    role: 'Investment Banking Analyst',
    firm: 'Credit Agricole CIB',
    ctcLabel: '₹13.2 LPA',
    ctcNote: 'incl. ESOPs',
  },
  {
    name: 'Riya Mehta',
    programme: 'MBA · Banking & Finance · 2024',
    role: 'Treasury Associate',
    firm: 'Kotak Mahindra Bank',
    ctcLabel: '₹11.8 LPA',
  },
  {
    name: 'Vivek Khanna',
    programme: 'MMS · Marketing · 2024',
    role: 'Brand Strategy Manager',
    firm: 'Bajaj Allianz Life',
    ctcLabel: '₹10.5 LPA',
  },
  {
    name: 'Sanya Kapoor',
    programme: 'MMS · Operations · 2024',
    role: 'Supply Chain Consultant',
    firm: 'Tata Consultancy Services',
    ctcLabel: '₹9.8 LPA',
  },
  {
    name: 'Karan Reddy',
    programme: 'MBA · Banking & Finance · 2024',
    role: 'Equity Research Associate',
    firm: 'JM Financial',
    ctcLabel: '₹9.5 LPA',
  },
  {
    name: 'Aarti Pillai',
    programme: 'MMS · HR · 2024',
    role: 'HR Business Partner',
    firm: 'Capgemini India',
    ctcLabel: '₹8.9 LPA',
  },
  {
    name: 'Devansh Patil',
    programme: 'MBA · Banking & Finance · 2024',
    role: 'Corporate Banking Officer',
    firm: 'ICICI Bank',
    ctcLabel: '₹8.6 LPA',
  },
];

export interface SectorShare {
  pct: number;
  label: string;
}

export const SECTOR_DISTRIBUTION_2024: SectorShare[] = [
  { pct: 38, label: 'Banking & Financial Services' },
  { pct: 21, label: 'Consulting & Advisory' },
  { pct: 14, label: 'FMCG & Marketing' },
  { pct: 11, label: 'Technology & SaaS' },
  { pct: 8, label: 'Insurance & Pension' },
  { pct: 5, label: 'Pharma & Healthcare' },
  { pct: 3, label: 'Family Enterprise' },
];

export interface CohortMetric {
  year: number;
  placed: number;
  averageLakhs: number;
  /** Percentage width of the bar relative to the strongest cohort (2024 = 100). */
  barWidthPct: number;
}

export const YEAR_ON_YEAR: CohortMetric[] = [
  { year: 2024, placed: 96, averageLakhs: 6.8, barWidthPct: 100 },
  { year: 2023, placed: 88, averageLakhs: 5.7, barWidthPct: 84 },
  { year: 2022, placed: 81, averageLakhs: 4.9, barWidthPct: 73 },
  { year: 2021, placed: 74, averageLakhs: 4.0, barWidthPct: 60 },
  { year: 2020, placed: 69, averageLakhs: 3.4, barWidthPct: 51 },
];
