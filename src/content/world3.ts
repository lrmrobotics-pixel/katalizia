/** Mundo 3 — La tabla periódica. Fuente principal: OpenStax Chemistry 2e, 2.5, 6.5 y 7.2. */
import type { Module } from '@/core/learning/types';

import { match, mc, num, order, sc, unit } from './build';
import { OPENSTAX_CHEM } from './sources';

const organizacion = unit({
  id: 'w3-u1-organizacion',
  title: 'Grupos, períodos y familias',
  objectives: [
    'Leer grupo y período de un elemento y saber qué indican.',
    'Reconocer metales, no metales, metaloides y las familias principales.',
    'Deducir los electrones de valencia de los grupos principales.',
  ],
  concepts: [
    { id: 'w3.organizacion', name: 'Organización de la tabla', prerequisites: ['w2.configuracion'] },
    { id: 'w3.valencia', name: 'Electrones de valencia', prerequisites: ['w2.configuracion'] },
  ],
  sources: [OPENSTAX_CHEM('2.5 The Periodic Table; 6.4 Electronic Structure of Atoms')],
  intro: [
    'Un mapa con lógica',
    'La tabla periódica no es una lista para memorizar: está ordenada para que la posición de un elemento te diga cómo se comporta.',
  ],
  simple: [
    'La idea sencilla',
    'Las filas se llaman períodos y las columnas, grupos. Los elementos de un mismo grupo tienen el mismo número de electrones de valencia y por eso se parecen químicamente.',
  ],
  analogy: {
    text: 'Metáfora: un grupo es como una familia; sus miembros comparten "rasgos" (electrones de valencia) aunque tengan distinto tamaño.',
    limits: 'El parecido no es total: dentro de un grupo cambian el tamaño, la reactividad y a veces el tipo de enlace (p. ej., C frente a Pb en el grupo 14).',
  },
  everyday: [
    'En tu vida',
    'El sodio y el potasio (grupo 1) son electrolitos esenciales del cuerpo. El calcio y el magnesio (grupo 2) forman parte de huesos y enzimas. Los gases nobles (grupo 18) casi no reaccionan: por eso el argón protege los filamentos de algunas bombillas.',
  ],
  visual: [
    'Familias principales',
    'Grupo 1: metales alcalinos · Grupo 2: alcalinotérreos · Grupos 3–12: metales de transición · Grupo 17: halógenos · Grupo 18: gases nobles. Puedes explorarlas con colores en Explorar → Tabla periódica.',
  ],
  formal: [
    'Definiciones',
    'Período: fila; su número coincide con el nivel de energía más externo ocupado.\nGrupo: columna (1–18, numeración IUPAC).\nElectrones de valencia: electrones del nivel más externo. En los grupos principales: grupos 1–2 → 1–2 e⁻; grupos 13–18 → (grupo − 10) e⁻ (el helio es la excepción con 2).\nMetales: brillo, conducen calor y electricidad, tienden a perder electrones. No metales: tienden a ganar o compartir electrones. Metaloides (B, Si, Ge, As, Sb, Te): propiedades intermedias.',
  ],
  worked: [
    'Ejemplo resuelto: azufre (S)',
    'S está en el período 3 y el grupo 16.\nPeríodo 3 → su nivel externo es n = 3.\nGrupo 16 → 16 − 10 = 6 electrones de valencia (3s² 3p⁴).\nEs un no metal: tiende a ganar 2 electrones (S²⁻).',
  ],
  guided: ['w3u1-q1', 'w3u1-q4'],
  independent: ['w3u1-q2', 'w3u1-q5'],
  quiz: ['w3u1-q3', 'w3u1-q6'],
  questions: [
    match(
      {
        id: 'w3u1-q1', concept: 'w3.organizacion', kind: 'concept', diff: 1,
        prompt: 'Empareja cada grupo con su familia.',
        hints: ['El grupo 18 son gases que casi no reaccionan.'],
        explanation: 'Grupo 1: alcalinos; grupo 2: alcalinotérreos; grupo 17: halógenos; grupo 18: gases nobles.',
      },
      [
        ['Grupo 1', 'Metales alcalinos'],
        ['Grupo 2', 'Alcalinotérreos'],
        ['Grupo 17', 'Halógenos'],
        ['Grupo 18', 'Gases nobles'],
      ],
    ),
    mc(
      {
        id: 'w3u1-q2', concept: 'w3.organizacion', kind: 'application', diff: 2,
        prompt: 'Selecciona los NO metales.',
        hints: ['Los no metales están a la derecha de la tabla (además del hidrógeno).'],
        explanation: 'O, Cl y N son no metales. Fe y Ca son metales; Si es un metaloide.',
      },
      [
        ['Oxígeno (O)'],
        ['Hierro (Fe)', 'Es un metal de transición.'],
        ['Cloro (Cl)'],
        ['Silicio (Si)', 'Es un metaloide: propiedades intermedias.'],
        ['Nitrógeno (N)'],
        ['Calcio (Ca)', 'Es un metal alcalinotérreo.'],
      ],
    ),
    sc(
      {
        id: 'w3u1-q3', concept: 'w3.organizacion', kind: 'problem', diff: 2,
        prompt: 'Un elemento tiene configuración [Ne] 3s² 3p⁵. ¿En qué período y grupo está?',
        hints: ['El nivel externo indica el período; cuenta los electrones de valencia para el grupo.'],
        explanation: 'Nivel externo n = 3 → período 3. 2 + 5 = 7 electrones de valencia → grupo 17. Es el cloro.',
      },
      [
        ['Período 3, grupo 17'],
        ['Período 7, grupo 3', 'Intercambiaste período y grupo.'],
        ['Período 3, grupo 5', 'Contaste solo los electrones p; hay que sumar también los 3s².'],
        ['Período 2, grupo 17', 'Ne es el gas noble anterior; el nivel externo es el 3.'],
      ],
    ),
    num(
      {
        id: 'w3u1-q4', concept: 'w3.valencia', kind: 'concept', diff: 1,
        prompt: '¿Cuántos electrones de valencia tiene el oxígeno (grupo 16)?',
        hints: ['Para los grupos 13–18: grupo − 10.'],
        explanation: '16 − 10 = 6 electrones de valencia (2s² 2p⁴).',
      },
      6, 'electrones', 0,
    ),
    match(
      {
        id: 'w3u1-q5', concept: 'w3.valencia', kind: 'application', diff: 2,
        prompt: 'Empareja cada elemento con sus electrones de valencia.',
        hints: ['Localiza el grupo de cada uno.'],
        explanation: 'K (grupo 1): 1; Mg (grupo 2): 2; C (grupo 14): 4; Cl (grupo 17): 7.',
      },
      [
        ['K', '1'],
        ['Mg', '2'],
        ['C', '4'],
        ['Cl', '7'],
      ],
    ),
    sc(
      {
        id: 'w3u1-q6', concept: 'w3.valencia', kind: 'problem', diff: 3,
        prompt: '¿Por qué el litio, el sodio y el potasio reaccionan de forma parecida con el agua?',
        hints: ['¿Qué tienen en común los elementos de una misma columna?'],
        explanation: 'Los tres tienen 1 electrón de valencia (ns¹), que pierden con facilidad. La química depende mucho de los electrones de valencia.',
      },
      [
        ['Tienen el mismo número de electrones de valencia'],
        ['Tienen la misma masa', 'Sus masas son muy distintas (≈7, 23 y 39 u).'],
        ['Están en el mismo período', 'Están en el mismo grupo, no en el mismo período.'],
      ],
    ),
  ],
});

const tendencias = unit({
  id: 'w3-u2-tendencias',
  title: 'Tendencias periódicas',
  objectives: [
    'Predecir cómo cambia el radio atómico en grupos y períodos.',
    'Predecir la electronegatividad y la energía de ionización relativas.',
  ],
  concepts: [
    { id: 'w3.radio', name: 'Radio atómico', prerequisites: ['w3.organizacion'] },
    { id: 'w3.en_ie', name: 'Electronegatividad y energía de ionización', prerequisites: ['w3.organizacion'] },
  ],
  sources: [OPENSTAX_CHEM('6.5 Periodic Variations in Element Properties; 7.2 Covalent Bonding (electronegativity)')],
  intro: [
    'Predecir sin memorizar',
    'Con dos ideas (cuántos niveles tiene el átomo y cuánto atrae su núcleo) puedes predecir tamaños, reactividad y qué átomo "se queda" con los electrones en un enlace.',
  ],
  simple: [
    'La idea sencilla',
    'Bajando en un grupo, los átomos son más grandes porque tienen más niveles. Avanzando hacia la derecha en un período, son más pequeños porque el núcleo tiene más protones y atrae más fuerte a los electrones del mismo nivel.',
  ],
  analogy: {
    text: 'Metáfora: un imán (núcleo) que sujeta clips (electrones). Más imán sobre la misma distancia aprieta más; más capas de clips quedan más lejos y se sujetan peor.',
    limits: 'La atracción real es eléctrica y la reducen los electrones internos (apantallamiento); no es magnetismo.',
  },
  everyday: [
    'En tu vida',
    'El flúor, el elemento más electronegativo, forma enlaces muy estables: por eso el teflón resiste casi todo y el fluoruro se fija al esmalte dental.',
  ],
  visual: [
    'Las flechas de la tabla',
    'Radio atómico: aumenta ↓ en el grupo y ← en el período.\nElectronegatividad y energía de ionización: aumentan ↑ en el grupo y → en el período (gases nobles aparte en electronegatividad).',
  ],
  formal: [
    'Definiciones',
    'Radio atómico: mitad de la distancia entre núcleos de dos átomos iguales enlazados.\nEnergía de ionización (primera): energía necesaria para quitar un electrón a un átomo gaseoso aislado.\nElectronegatividad (escala de Pauling): capacidad de un átomo de atraer los electrones de un enlace. Valores: F 3,98; O 3,44; N 3,04; C 2,55; H 2,20; Na 0,93.\nCarga nuclear efectiva: carga que "siente" un electrón externo tras el apantallamiento de los internos; crece hacia la derecha del período.',
  ],
  worked: [
    'Ejemplo resuelto: ¿quién es más grande, Na o Cl?',
    'Los dos están en el período 3 (mismo nivel externo).\nCl tiene 17 protones frente a 11 del Na: mayor carga nuclear efectiva.\nCl atrae más a sus electrones → es más pequeño. Radio: Na > Cl.',
  ],
  guided: ['w3u2-q1', 'w3u2-q4'],
  independent: ['w3u2-q2', 'w3u2-q5'],
  quiz: ['w3u2-q3', 'w3u2-q6'],
  questions: [
    sc(
      {
        id: 'w3u2-q1', concept: 'w3.radio', kind: 'concept', diff: 1,
        prompt: 'Al bajar en un grupo, el radio atómico…',
        hints: ['Cada período nuevo añade un nivel de electrones.'],
        explanation: 'Aumenta, porque se añaden niveles de energía más alejados del núcleo.',
      },
      [
        ['Aumenta'],
        ['Disminuye', 'Más niveles ocupados hacen al átomo más grande, no más pequeño.'],
        ['No cambia', 'Cada período añade un nivel: el tamaño cambia.'],
      ],
    ),
    order(
      {
        id: 'w3u2-q2', concept: 'w3.radio', kind: 'application', diff: 2,
        prompt: 'Ordena de MAYOR a MENOR radio atómico (todos del período 3).',
        hints: ['En un período, el radio disminuye de izquierda a derecha.'],
        explanation: 'Na (grupo 1) > Mg (2) > Al (13) > Si (14): la carga nuclear efectiva crece hacia la derecha.',
      },
      ['Na', 'Mg', 'Al', 'Si'],
    ),
    sc(
      {
        id: 'w3u2-q3', concept: 'w3.radio', kind: 'problem', diff: 3,
        prompt: '¿Por qué el ion Na⁺ es más pequeño que el átomo de Na?',
        hints: ['Na⁺ perdió su único electrón 3s¹. ¿Qué nivel queda como el más externo?'],
        explanation: 'Al perder el electrón 3s¹, el nivel 3 queda vacío; el ion solo tiene 2 niveles y los mismos 11 protones atraen a menos electrones.',
      },
      [
        ['Perdió su nivel más externo y el núcleo atrae a menos electrones'],
        ['Perdió protones', 'Un ion cambia electrones, no protones.'],
        ['Ganó neutrones', 'Formar un ion no cambia los neutrones.'],
      ],
    ),
    order(
      {
        id: 'w3u2-q4', concept: 'w3.en_ie', kind: 'concept', diff: 2,
        prompt: 'Ordena de MAYOR a MENOR electronegatividad.',
        hints: ['En el período 2 la electronegatividad crece hacia la derecha.'],
        explanation: 'F (3,98) > O (3,44) > N (3,04) > C (2,55), según la escala de Pauling.',
      },
      ['F', 'O', 'N', 'C'],
    ),
    sc(
      {
        id: 'w3u2-q5', concept: 'w3.en_ie', kind: 'application', diff: 2,
        prompt: 'En el enlace O–H del agua, ¿hacia qué átomo se desplazan los electrones?',
        hints: ['Compara las electronegatividades: O 3,44 y H 2,20.'],
        explanation: 'Hacia el oxígeno, que es más electronegativo; por eso O queda con carga parcial δ− y H con δ+.',
      },
      [
        ['Hacia el oxígeno'],
        ['Hacia el hidrógeno', 'El hidrógeno es menos electronegativo (2,20 frente a 3,44).'],
        ['Se reparten por igual', 'Solo se reparten por igual entre átomos de igual electronegatividad.'],
      ],
    ),
    sc(
      {
        id: 'w3u2-q6', concept: 'w3.en_ie', kind: 'retention', diff: 3,
        prompt: '¿Cuál tiene la MAYOR primera energía de ionización?',
        hints: ['La energía de ionización aumenta hacia arriba y hacia la derecha; los gases nobles tienen capas completas.'],
        explanation: 'El neón: está arriba a la derecha y tiene su capa completa, así que quitarle un electrón cuesta mucha energía.',
      },
      [
        ['Ne'],
        ['Na', 'Está a la izquierda: pierde su electrón 3s¹ con facilidad.'],
        ['K', 'Está más abajo que Na: su electrón externo está aún más lejos.'],
        ['Mg', 'Está a la izquierda del período 3; su energía es mucho menor que la del Ne.'],
      ],
    ),
  ],
});

export const WORLD3_MODULES: Module[] = [
  { id: 'w3-mod1', title: 'Leer la tabla', units: [organizacion, tendencias] },
];
