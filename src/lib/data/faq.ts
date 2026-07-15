/** FAQ page entries. */

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
