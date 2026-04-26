/** Recruiters used on the home marquee and the placements mosaic.
 *  `prefix`/`em` form mirrors the editorial italics in the design. */

export const HOME_MARQUEE_RECRUITERS = [
  'Morgan Stanley',
  'HDFC Bank',
  'Kotak Mahindra',
  'ICICI Bank',
  'Axis Bank',
  'Tata Consultancy',
  'Bajaj Allianz',
  'Reliance Nippon',
  'Siemens',
  'ITC Maratha',
  'Lupin',
  'JM Financial',
  'Anand Rathi',
  'DCB Bank',
  'Niva Bupa',
  'Eureka Forbes',
  'Lenskart',
] as const;

export interface MosaicRecruiter {
  prefix: string;
  em: string;
}

export const MOSAIC_RECRUITERS: MosaicRecruiter[] = [
  { prefix: 'Morgan', em: 'Stanley' },
  { prefix: 'HDFC', em: 'Bank' },
  { prefix: 'Kotak', em: 'Mahindra' },
  { prefix: 'ICICI', em: 'Bank' },
  { prefix: 'Axis', em: 'Bank' },
  { prefix: 'DCB', em: 'Bank' },
  { prefix: 'Yes', em: 'Bank' },
  { prefix: 'JM', em: 'Financial' },
  { prefix: 'Anand', em: 'Rathi' },
  { prefix: 'Credit', em: 'Agricole' },
  { prefix: 'HDFC', em: 'AMC' },
  { prefix: 'Bajaj', em: 'Allianz' },
  { prefix: 'Reliance', em: 'Nippon' },
  { prefix: 'Niva', em: 'Bupa' },
  { prefix: 'Care', em: 'Health' },
  { prefix: 'TCS', em: 'Mumbai' },
  { prefix: 'Capgemini', em: 'India' },
  { prefix: 'Tata', em: 'Group' },
  { prefix: 'Siemens', em: 'India' },
  { prefix: 'ITC', em: 'Maratha' },
  { prefix: 'Eureka', em: 'Forbes' },
  { prefix: 'Lenskart', em: 'Pvt' },
  { prefix: 'Lupin', em: 'Pharma' },
  { prefix: 'Bisleri', em: 'India' },
  { prefix: 'American', em: 'Express' },
  { prefix: 'Bondbazaar', em: '·' },
  { prefix: 'Finolex', em: 'Cables' },
  { prefix: 'Stalwart', em: 'Mgmt' },
];
