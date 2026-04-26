/** About-page editorial: governing body, milestones, vision/mission/values,
 *  campus infrastructure cards. */

export interface GoverningBodyMember {
  initials: string;
  role: string;
  name: string;
  bio: string;
}

export const GOVERNING_BODY: GoverningBodyMember[] = [
  {
    initials: 'SG',
    role: 'President · Maratha Mandir',
    name: 'Shri. S. K. Gawde',
    bio: "A custodian of the Trust's seventy-five-year educational mission.",
  },
  {
    initials: 'PG',
    role: 'Chairman · Governing Body',
    name: 'Shri. Prafulla Gawde',
    bio: 'Industrialist; trustee since 1998. Steward of academic & strategic direction.',
  },
  {
    initials: 'VH',
    role: 'Director',
    name: 'Dr. Vidya Hattangadi',
    bio: 'Author, columnist, brand-strategy scholar. Director since 2014.',
  },
];

export interface Milestone {
  year: string;
  title: string;
  body: string;
}

export const MILESTONES: Milestone[] = [
  {
    year: '2002',
    title: 'Foundation',
    body: 'The Institute is established under the Maratha Mandir Trust at the historic Mumbai Central campus. Inaugural MMS cohort of forty.',
  },
  {
    year: '2008',
    title: 'First Accreditation',
    body: 'AICTE approval secured. The institute is granted full affiliation with the University of Mumbai.',
  },
  {
    year: '2014',
    title: 'MBA Banking & Finance',
    body: 'The flagship Banking & Finance MBA programme is launched, designed in consultation with senior practitioners from RBI and SBI.',
  },
  {
    year: '2018',
    title: 'Doctoral Programme',
    body: 'University of Mumbai grants Ph.D. recognition. First cohort of doctoral fellows is admitted.',
  },
  {
    year: '2022',
    title: 'NAAC B++',
    body: "National accreditation council confers B++ grade — placing the institute in the top tier of Mumbai's business schools.",
  },
  {
    year: '2025',
    title: 'Twenty-Third Cohort',
    body: "More than two thousand alumni now serve in the leadership of India's most consequential firms.",
  },
];

export interface Compass {
  numeral: string;
  title: 'Vision' | 'Mission' | 'Values';
  body: string;
}

export const COMPASS: Compass[] = [
  {
    numeral: 'i.',
    title: 'Vision',
    body: "To be among India's most respected business schools — not by size, but by the substance of our scholarship and the calibre of our alumni.",
  },
  {
    numeral: 'ii.',
    title: 'Mission',
    body: 'To deliver a management education that integrates analytical rigour, ethical seriousness, and a deep familiarity with the practice of Indian commerce.',
  },
  {
    numeral: 'iii.',
    title: 'Values',
    body: 'Curiosity. Humility. Industriousness. The conviction that good management is, at its root, a moral undertaking.',
  },
];

export interface CampusFeature {
  name: string;
  body: string;
}

export const CAMPUS_FEATURES: CampusFeature[] = [
  {
    name: 'The Library',
    body: 'Twenty-eight thousand volumes. Subscriptions to JSTOR, EBSCO, Bloomberg Terminal, and the Harvard Business Review archive — open to all students.',
  },
  {
    name: 'The Auditorium',
    body: 'Two-hundred-seat capacity, with a programme of guest lectures featuring sitting CEOs, Reserve Bank governors past, and visiting scholars from London and Singapore.',
  },
  {
    name: 'Bloomberg Lab',
    body: 'A dedicated finance & analytics lab with twelve Bloomberg terminals, Eikon, and Reuters subscriptions — used by both finance students and doctoral fellows.',
  },
  {
    name: 'Entrepreneurship Cell',
    body: 'A working incubator. Six student-led ventures since 2020, with seed funding partnerships through the Mumbai Angels network.',
  },
];
