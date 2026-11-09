/** Fuentes compartidas por los mundos 2–12. */
import type { SourceRef } from '@/core/learning/types';

export { BIPM_SI, IUPAC_GOLD, OPENSTAX_CHEM } from './world1/sources';

const ACCESSED = '2026-11-09';

export const OPENSTAX_BIO = (section: string): SourceRef => ({
  title: 'Biology 2e',
  institution: 'OpenStax, Rice University',
  url: 'https://openstax.org/details/books/biology-2e',
  section,
  accessed: ACCESSED,
});

export const OPENSTAX_AP = (section: string): SourceRef => ({
  title: 'Anatomy and Physiology 2e',
  institution: 'OpenStax, Rice University',
  url: 'https://openstax.org/details/books/anatomy-and-physiology-2e',
  section,
  accessed: ACCESSED,
});

export const OPENSTAX_PHARM = (section: string): SourceRef => ({
  title: 'Pharmacology for Nurses',
  institution: 'OpenStax, Rice University',
  url: 'https://openstax.org/details/books/pharmacology',
  section,
  accessed: ACCESSED,
});

export const OPENSTAX_ORG = (section: string): SourceRef => ({
  title: 'Organic Chemistry',
  institution: 'OpenStax, Rice University',
  url: 'https://openstax.org/details/books/organic-chemistry',
  section,
  accessed: ACCESSED,
});

export const LEHNINGER = (section: string): SourceRef => ({
  title: 'Lehninger Principles of Biochemistry, 8.ª ed. (Nelson y Cox)',
  institution: 'W. H. Freeman / Macmillan',
  section,
});

export const CIAAW: SourceRef = {
  title: 'Standard Atomic Weights',
  institution: 'IUPAC Commission on Isotopic Abundances and Atomic Weights (CIAAW)',
  url: 'https://www.ciaaw.org/atomic-weights.htm',
  accessed: ACCESSED,
};
