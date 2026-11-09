/**
 * Mapa curricular de KATALIZIA: 12 mundos en cadena de prerrequisitos.
 * Los módulos/unidades con contenido se añaden en la Fase 3 (`modules` vacío = sin contenido aún).
 *
 * Referencia general del alcance: OpenStax Chemistry 2e y Biology 2e
 * (https://openstax.org), Lehninger Principles of Biochemistry (8.ª ed.) para el Mundo 10.
 */
import type { World } from '@/core/learning/types';

import { WORLD1_MODULES } from './world1';

interface WorldOutline extends World {
  topics: string[];
}

const w = (
  order: number,
  id: string,
  title: string,
  subtitle: string,
  color: string,
  topics: string[],
  requires: string[] = [],
): WorldOutline => ({ id, order, title, subtitle, color, topics, requires, objectives: [], modules: [] });

const BASE: WorldOutline[] = [
  w(1, 'm1-materia', 'Los fundamentos de la materia', 'Materia, energía y medida', '#22D3EE', [
    '¿Qué es la química?', 'Materia y energía', 'Propiedades físicas y químicas', 'Estados de la materia',
    'Cambios físicos y químicos', 'Sustancias puras y mezclas', 'Métodos de separación', 'Unidades y SI',
    'Notación científica', 'Conversión de unidades', 'Densidad',
  ]),
  w(2, 'm2-atomo', 'El universo atómico', 'Modelos atómicos y electrones', '#60A5FA', [
    'Modelos atómicos (Dalton a mecánico-cuántico)', 'Protones, neutrones y electrones', 'Número atómico y másico',
    'Isótopos', 'Iones', 'Configuración electrónica', 'Orbitales, niveles y subniveles',
  ], ['m1-materia']),
  w(3, 'm3-tabla', 'La tabla periódica', 'Grupos, períodos y tendencias', '#A78BFA', [
    'Organización', 'Grupos y períodos', 'Metales, no metales y metaloides', 'Familias químicas',
    'Electrones de valencia', 'Radio atómico', 'Electronegatividad', 'Energía de ionización', 'Afinidad electrónica',
  ], ['m2-atomo']),
  w(4, 'm4-enlaces', 'Enlaces y estructuras', 'Cómo se unen los átomos', '#F472B6', [
    'Enlace iónico, covalente y metálico', 'Polaridad', 'Estructuras de Lewis', 'Regla del octeto y excepciones',
    'Geometría molecular (VSEPR)', 'Fuerzas intermoleculares', 'Puentes de hidrógeno', 'Estructura y propiedades',
  ], ['m3-tabla']),
  w(5, 'm5-reacciones', 'Reacciones químicas', 'Ecuaciones y tipos de reacción', '#FB923C', [
    'Fórmulas y ecuaciones', 'Reactivos y productos', 'Balanceo', 'Conservación de la masa',
    'Síntesis, descomposición, desplazamiento', 'Combustión', 'Óxido-reducción',
  ], ['m4-enlaces']),
  w(6, 'm6-calculos', 'Matemáticas químicas', 'Mol y estequiometría', '#FACC15', [
    'Mol y número de Avogadro', 'Masa molar', 'Gramos ↔ moles', 'Relaciones molares', 'Estequiometría',
    'Reactivo limitante y en exceso', 'Rendimiento porcentual', 'Molaridad', 'Diluciones',
  ], ['m5-reacciones']),
  w(7, 'm7-acidos', 'Soluciones, ácidos y bases', 'pH y equilibrio ácido-base', '#4ADE80', [
    'Soluto, solvente y solubilidad', 'Concentraciones', 'Arrhenius, Brønsted-Lowry y Lewis', 'Escala de pH',
    'Neutralización', 'Amortiguadores', 'Equilibrio ácido-base',
  ], ['m6-calculos']),
  w(8, 'm8-energia', 'Energía y velocidad', 'Termoquímica, cinética y equilibrio', '#F87171', [
    'Entalpía', 'Entropía', 'Energía libre de Gibbs', 'Endotérmicas y exotérmicas', 'Velocidad de reacción',
    'Energía de activación', 'Catalizadores', 'Equilibrio químico', 'Le Châtelier',
  ], ['m7-acidos']),
  w(9, 'm9-organica', 'Química orgánica', 'El carbono y sus familias', '#2DD4BF', [
    'El carbono y sus enlaces', 'Alcanos, alquenos, alquinos', 'Alcoholes, aldehídos, cetonas',
    'Ácidos carboxílicos, ésteres, éteres', 'Aminas y amidas', 'Isomería', 'Nomenclatura', 'Reacciones básicas',
  ], ['m8-energia']),
  w(10, 'm10-bioquimica', 'Bioquímica', 'La química de la vida', '#E879F9', [
    'Agua', 'Carbohidratos', 'Lípidos', 'Aminoácidos y proteínas', 'Enzimas', 'ADN y ARN', 'ATP',
    'Metabolismo', 'Glucólisis', 'Ciclo de Krebs', 'Cadena de transporte de electrones',
  ], ['m9-organica']),
  w(11, 'm11-medicina', 'Química para Medicina', 'Del laboratorio al cuerpo humano', '#38BDF8', [
    'pH sanguíneo y amortiguadores', 'Electrolitos', 'Ósmosis y presión osmótica', 'Soluciones fisiológicas',
    'Enzimas y enfermedad', 'Metabolismo de fármacos', 'Farmacocinética y farmacodinámica básicas',
    'Química de pruebas diagnósticas',
  ], ['m10-bioquimica']),
  w(12, 'm12-preu', 'Laboratorio avanzado', 'Preparación universitaria', '#C084FC', [
    'Interpretación de resultados', 'Análisis de datos', 'Problemas integradores', 'Casos clínicos contextualizados',
    'Evaluaciones acumulativas',
  ], ['m11-medicina']),
];

/** Mundos con contenido real conectado. */
const CONTENT: Record<string, Pick<World, 'modules' | 'objectives'>> = {
  'm1-materia': {
    modules: WORLD1_MODULES,
    objectives: [
      'Distinguir materia, energía y tipos de cambio.',
      'Clasificar sustancias y elegir métodos de separación.',
      'Medir y convertir unidades con seguridad; calcular densidad.',
    ],
  },
};

export const WORLDS: WorldOutline[] = BASE.map((w) => ({ ...w, ...CONTENT[w.id] }));

export function findUnit(unitId: string) {
  for (const w of WORLDS)
    for (const m of w.modules)
      for (const u of m.units) if (u.id === unitId) return { world: w, module: m, unit: u };
  return null;
}
