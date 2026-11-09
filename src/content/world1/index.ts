import type { Module } from '@/core/learning/types';

import { UNIT_MATERIA } from './unit1-materia';
import { UNIT_MEZCLAS } from './unit2-mezclas';
import { UNIT_MEDIDA } from './unit3-medida';

export const WORLD1_MODULES: Module[] = [
  { id: 'w1-mod1', title: 'La materia', units: [UNIT_MATERIA, UNIT_MEZCLAS] },
  { id: 'w1-mod2', title: 'La medida', units: [UNIT_MEDIDA] },
];
