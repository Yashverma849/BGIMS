/**
 * Single source of truth for institute-wide constants used across the site —
 * brand info, contact details, nav structure, statutory accreditations.
 * Editing here updates header/footer/JSON-LD/SEO simultaneously.
 */

export const site = {
  name: 'MM BGIMS',
  fullName: "Maratha Mandir's Babasaheb Gawde Institute of Management Studies",
  tagline: 'Where Heritage Meets Tomorrow’s Leaders',
  description:
    "Maratha Mandir's Babasaheb Gawde Institute of Management Studies — Mumbai's distinguished management school crafting principled leaders since 2002.",
  established: 2002,
  city: 'Mumbai',
  url: 'https://mmbgims.com',
  address: {
    line1: 'Maratha Mandir Annexe',
    line2: 'Dr. A. B. Nair Road, Mumbai Central',
    line3: 'Mumbai 400 008 · Maharashtra',
  },
  phones: {
    primary: { display: '+91 96195 10513', tel: '+919619510513' },
    placements: { display: '+91 22 2300 0000', tel: '+912223000000' },
    office: { display: '+91 22 2300 0001', tel: '+912223000001' },
  },
  emails: {
    admissions: 'admissions@mmbgims.com',
    placements: 'placements@mmbgims.com',
    alumni: 'alumni@mmbgims.com',
    office: 'office@mmbgims.com',
  },
  accreditations: [
    'Affiliated to the University of Mumbai',
    'Approved by AICTE, New Delhi',
    'Accredited NAAC B++',
    'Choice Code 311310210',
    'Member · AIMS',
    '2,000+ Alumni Worldwide',
    '23 Years of Excellence',
  ],
  navMain: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/programs', label: 'Programs' },
    { href: '/placements', label: 'Placements' },
    { href: '/faculty', label: 'Faculty' },
    { href: '/contact', label: 'Contact' },
  ],
  footer: {
    programs: [
      { href: '/programs', label: 'MBA · Banking & Finance' },
      { href: '/programs', label: 'MMS' },
      { href: '/programs', label: 'BMS' },
      { href: '/programs', label: 'Ph.D. Programme' },
    ],
    institute: [
      { href: '/about', label: 'About' },
      { href: '/faculty', label: 'Faculty' },
      { href: '/placements', label: 'Placements' },
      { href: '/events', label: 'Events & News' },
      { href: '/alumni', label: 'Alumni' },
      { href: '/admissions', label: 'Admissions' },
      { href: '/contact', label: 'Contact' },
      { href: '/apply', label: 'Apply' },
      { href: '/admin/login', label: 'CMS Login' },
    ],
    legal: [
      { href: '#', label: 'Privacy' },
      { href: '#', label: 'Terms' },
      { href: '#', label: 'Mandatory Disclosure' },
      { href: '#', label: 'Grievance' },
    ],
  },
  social: {
    twitter: 'https://twitter.com/mmbgims',
    linkedin: 'https://www.linkedin.com/school/mmbgims',
  },
} as const;

export type SiteConfig = typeof site;
