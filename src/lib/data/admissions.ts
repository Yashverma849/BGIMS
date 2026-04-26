/** Admissions page: process steps, eligibility per programme, fee table,
 *  important dates, scholarships. */

export interface ProcessStep {
  numeral: string;
  title: string;
  body: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    numeral: 'I',
    title: 'Enquire',
    body: 'Submit an enquiry or request the prospectus. An admissions counsellor responds within two working days with a detailed brochure and call slot.',
  },
  {
    numeral: 'II',
    title: 'Apply',
    body: 'Complete the online application with your academic record and statement of purpose. Application fee of ₹1,500 secures your candidate file.',
  },
  {
    numeral: 'III',
    title: 'Assess',
    body: 'We accept CAT, XAT, MAT, CMAT, ATMA, MAH-CET (MMS) and merit (BMS) scores. The institute does not conduct a separate entrance.',
  },
  {
    numeral: 'IV',
    title: 'Interview',
    body: 'Shortlisted candidates are invited for a Personal Interview & Group Discussion at our Mumbai Central campus. Conducted on campus, never delegated.',
  },
  {
    numeral: 'V',
    title: 'Welcome',
    body: 'An offer letter is issued within ten working days. Acceptance and the first instalment confirm your seat in the cohort.',
  },
];

export interface EligibilityCard {
  programmeNumeral: string;
  programmeName: string;
  rules: string[];
}

export const ELIGIBILITY: EligibilityCard[] = [
  {
    programmeNumeral: 'Programme I',
    programmeName: 'MBA · Banking & Finance',
    rules: [
      "Bachelor's degree, minimum 50% (45% for reserved categories)",
      'Valid CAT / XAT / CMAT / MAH-MBA-CET / ATMA / MAT score',
      'Personal Interview & Group Discussion',
      'Background in commerce, economics, finance, engineering or mathematics preferred',
    ],
  },
  {
    programmeNumeral: 'Programme II',
    programmeName: 'MMS — Master of Management Studies',
    rules: [
      "Bachelor's degree, minimum 50% (45% for reserved categories)",
      'MAH-MMS-CET score (DTE Maharashtra)',
      'Centralised Admission Process (CAP) by DTE; institute participates in CAP rounds',
      'Specialisation declared at end of Year 1',
    ],
  },
  {
    programmeNumeral: 'Programme III',
    programmeName: 'BMS — Bachelor of Management Studies',
    rules: [
      'HSC (12th) passed with minimum 45% from any recognised board',
      'University of Mumbai admission norms apply',
      'Merit-based selection; no separate entrance',
      'Three-year, six-semester programme',
    ],
  },
  {
    programmeNumeral: 'Programme IV',
    programmeName: 'Ph.D. — Doctoral Programme',
    rules: [
      "Master's degree, minimum 55% (50% for reserved categories)",
      'PET (Ph.D. Entrance Test) by University of Mumbai',
      'Research proposal & interview with the Doctoral Committee',
      'Eight fellowships available each cohort',
    ],
  },
];

export interface ImportantDate {
  monthLabel: string;
  title: string;
  body: string;
}

export const IMPORTANT_DATES: ImportantDate[] = [
  {
    monthLabel: 'November 2025',
    title: 'Applications open',
    body: 'Online portal opens for the 2026–27 cohort across all programmes.',
  },
  {
    monthLabel: '15 February 2026',
    title: 'Early decision deadline',
    body: 'Applicants applying by this date receive priority consideration and first-round interview slots.',
  },
  {
    monthLabel: '31 March 2026',
    title: 'Final application deadline',
    body: 'Last date to submit the application form along with relevant entrance test score.',
  },
  {
    monthLabel: 'April 2026',
    title: 'GD & Personal Interview',
    body: 'Conducted on campus across two weekends. Schedule communicated by email.',
  },
  {
    monthLabel: 'May 2026',
    title: 'Offer letters issued',
    body: 'Provisional admission letters dispatched. Confirmation against first instalment payment.',
  },
  {
    monthLabel: 'July 2026',
    title: 'Cohort begins',
    body: 'Inaugural week, induction lectures and Mumbai-walk for the new cohort.',
  },
];

export interface FeeColumn {
  programme: string;
  short: string;
}

export const FEE_COLUMNS: FeeColumn[] = [
  { programme: 'MBA · B&F', short: 'mba' },
  { programme: 'MMS', short: 'mms' },
  { programme: 'BMS', short: 'bms' },
  { programme: 'Ph.D.', short: 'phd' },
];

export interface FeeRow {
  component: string;
  values: [string, string, string, string];
  isTotal?: boolean;
}

export const FEE_ROWS: FeeRow[] = [
  {
    component: 'Tuition fee (per annum)',
    values: ['₹4,82,000', '₹2,84,000', '₹1,12,000', '₹85,000'],
  },
  {
    component: 'Library & lab',
    values: ['₹24,000', '₹18,000', '₹8,000', '₹12,000'],
  },
  {
    component: 'Examination fee',
    values: ['₹6,500', '₹6,500', '₹4,500', '₹8,000'],
  },
  {
    component: 'Refundable caution deposit',
    values: ['₹15,000', '₹15,000', '₹5,000', '₹10,000'],
  },
  {
    component: 'Year 1 total',
    values: ['₹5,27,500', '₹3,23,500', '₹1,29,500', '₹1,15,000'],
    isTotal: true,
  },
];

export interface Scholarship {
  title: string;
  body: string;
}

export const SCHOLARSHIPS: Scholarship[] = [
  {
    title: 'The Babasaheb Gawde Merit Award',
    body: 'Up to ₹2,00,000 awarded to the top three admits across MBA & MMS, basis academic and entrance scores.',
  },
  {
    title: 'Daughters of Mumbai Grant',
    body: '30% tuition waiver for women candidates demonstrating financial need; eight grants annually.',
  },
  {
    title: 'Industry Sponsored Seats',
    body: 'Partial funding from recruiter trust; recipients commit to two years of post-graduation employment with sponsor banks.',
  },
];
