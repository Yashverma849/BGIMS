/** Home page testimonial slider entries (3 voices, auto-rotating). */

export interface Testimonial {
  initials: string;
  body: string;
  bodyEm?: string; // word that gets the italic-accent treatment in the original
  cite: string;
  citeMeta: string;
}

export const HOME_TESTIMONIALS: Testimonial[] = [
  {
    initials: 'AP',
    body:
      'MM BGIMS gave a real boost to my career. I learnt management lessons that {{em}} my life to a greater extent. Encouraging faculty, innovative pedagogy — this is where I learned to make decisions, not just analyses.',
    bodyEm: 'transformed',
    cite: 'Abhinay Patil',
    citeMeta: 'Marketing Strategist, SaaSMAX Corp · USA · Class of 2018',
  },
  {
    initials: 'TS',
    body:
      'My MMS at MM BGIMS brought clarity of thought, knowledge, confidence — and the {{em}} to act. I was placed at the Bombay Stock Exchange, the dream company of many MBA aspirants.',
    bodyEm: 'conviction',
    cite: 'Tushar Shetty',
    citeMeta: 'Management Executive, BSE · Class of 2019',
  },
  {
    initials: 'KC',
    body:
      'Here, your voice is {{em}} and your opinion counts. Today I work in a global HR role at Capgemini — and every framework, every conversation I had at MM BGIMS, I find replicated in my work.',
    bodyEm: 'heard',
    cite: 'Kamika Chitre',
    citeMeta: 'HR Business Partner, Capgemini India · Class of 2020',
  },
];
