import type { SourceRef } from '@/core/learning/types';

const ACCESSED = '2026-11-08';

export const OPENSTAX_CHEM = (section: string): SourceRef => ({
  title: 'Chemistry 2e',
  institution: 'OpenStax, Rice University',
  url: 'https://openstax.org/details/books/chemistry-2e',
  section,
  accessed: ACCESSED,
});

export const BIPM_SI: SourceRef = {
  title: 'The International System of Units (SI Brochure), 9.ª ed.',
  institution: 'Bureau International des Poids et Mesures',
  url: 'https://www.bipm.org/en/publications/si-brochure',
  accessed: ACCESSED,
};

export const IUPAC_GOLD = (term: string): SourceRef => ({
  title: `IUPAC Compendium of Chemical Terminology (Gold Book): ${term}`,
  institution: 'IUPAC',
  url: 'https://goldbook.iupac.org',
  accessed: ACCESSED,
});
