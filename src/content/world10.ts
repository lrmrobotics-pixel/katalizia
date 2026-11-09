/** Mundo 10 — Bioquímica. Fuentes: OpenStax Biology 2e (cap. 3, 6, 7, 14) y Lehninger (8.ª ed.). */
import type { Module } from '@/core/learning/types';

import { match, mc, num, order, sc, unit } from './build';
import { LEHNINGER, OPENSTAX_BIO } from './sources';

const biomoleculas = unit({
  id: 'w10-u1-biomoleculas',
  title: 'Biomoléculas: carbohidratos, lípidos y proteínas',
  objectives: [
    'Clasificar carbohidratos y lípidos y reconocer su función.',
    'Describir aminoácidos, el enlace peptídico y cómo actúan las enzimas.',
  ],
  concepts: [
    { id: 'w10.carb_lip', name: 'Carbohidratos y lípidos', prerequisites: ['w9.grupos'] },
    { id: 'w10.proteinas', name: 'Proteínas y enzimas', prerequisites: ['w9.grupos', 'w8.cinetica'] },
  ],
  sources: [
    OPENSTAX_BIO('3.2 Carbohydrates; 3.3 Lipids; 3.4 Proteins; 6.5 Enzymes'),
    LEHNINGER('Cap. 3 Amino Acids, Peptides, and Proteins; cap. 6 Enzymes; cap. 7 Carbohydrates'),
  ],
  intro: [
    'La química de la que estás hecha',
    'Tu cuerpo es sobre todo agua, y lo demás son grandes moléculas construidas con piezas pequeñas: azúcares, ácidos grasos, aminoácidos y nucleótidos.',
  ],
  simple: [
    'La idea sencilla',
    'Los carbohidratos dan energía rápida y estructura. Los lípidos almacenan energía y forman membranas. Las proteínas, cadenas de aminoácidos, hacen casi todo el trabajo: transportan, defienden y, como enzimas, aceleran reacciones.',
  ],
  analogy: {
    text: 'Metáfora: una enzima es como una llave que solo entra en su cerradura (el sustrato).',
    limits: 'El sitio activo no es rígido: se ajusta al sustrato al unirse (modelo de ajuste inducido).',
  },
  everyday: [
    'En tu vida',
    'La intolerancia a la lactosa ocurre cuando falta suficiente lactasa, la enzima que rompe la lactosa en glucosa y galactosa. La fiebre muy alta es peligrosa en parte porque el calor puede desnaturalizar proteínas.',
  ],
  visual: [
    'Monómeros y polímeros',
    'Monosacárido (glucosa) → polisacárido (almidón, glucógeno, celulosa)\nGlicerol + 3 ácidos grasos → triglicérido\nAminoácido → polipéptido / proteína (enlace peptídico)\nNucleótido → ácido nucleico (ADN, ARN)',
  ],
  formal: [
    'Definiciones',
    'Monosacárido: azúcar simple (glucosa, fructosa, galactosa; C₆H₁₂O₆). Disacárido: dos unidos (sacarosa = glucosa + fructosa; lactosa = glucosa + galactosa). Polisacárido: muchos (almidón y glucógeno almacenan energía; la celulosa es estructural).\nTriglicérido: éster de glicerol con tres ácidos grasos. Saturado: sin dobles enlaces C=C; insaturado: con uno o más.\nFosfolípido: forma la bicapa de las membranas (cabeza polar, colas apolares).\nAminoácido: grupo amino, grupo carboxilo y cadena lateral (R) unidos a un carbono α. Hay 20 aminoácidos estándar codificados en el código genético.\nEnlace peptídico: amida entre el –COOH de un aminoácido y el –NH₂ del siguiente; se forma liberando H₂O (condensación).\nEnzima: catalizador biológico (casi siempre una proteína) que baja la energía de activación; es específica de su sustrato.',
  ],
  worked: [
    'Ejemplo resuelto: ¿cuántas moléculas de agua se liberan al formar un tripéptido?',
    'Cada enlace peptídico libera 1 H₂O.\nTres aminoácidos se unen con 2 enlaces peptídicos.\n→ 2 moléculas de agua.',
  ],
  guided: ['w10u1-q1', 'w10u1-q4'],
  independent: ['w10u1-q2', 'w10u1-q5'],
  quiz: ['w10u1-q3', 'w10u1-q6'],
  questions: [
    match(
      {
        id: 'w10u1-q1', concept: 'w10.carb_lip', kind: 'concept', diff: 2,
        prompt: 'Empareja cada molécula con su categoría.',
        hints: ['La sacarosa es el azúcar de mesa: dos azúcares simples unidos.'],
        explanation: 'Glucosa: monosacárido. Sacarosa: disacárido. Glucógeno: polisacárido. Triglicérido: lípido.',
      },
      [
        ['Glucosa', 'Monosacárido'],
        ['Sacarosa', 'Disacárido'],
        ['Glucógeno', 'Polisacárido'],
        ['Triglicérido', 'Lípido'],
      ],
    ),
    sc(
      {
        id: 'w10u1-q2', concept: 'w10.carb_lip', kind: 'application', diff: 2,
        prompt: 'Una grasa sólida a temperatura ambiente (como la mantequilla) suele tener sobre todo ácidos grasos…',
        hints: ['Las cadenas rectas se empaquetan mejor.'],
        explanation: 'Saturados: sin dobles enlaces, las cadenas son rectas y se empaquetan bien, así que el punto de fusión es más alto.',
      },
      [
        ['Saturados'],
        ['Insaturados', 'Los dobles enlaces cis doblan la cadena: suelen dar aceites líquidos.'],
        ['De glucosa', 'La glucosa es un carbohidrato, no un ácido graso.'],
      ],
    ),
    sc(
      {
        id: 'w10u1-q3', concept: 'w10.carb_lip', kind: 'retention', diff: 3,
        prompt: '¿Por qué los fosfolípidos forman bicapas en el agua?',
        hints: ['Tienen una parte polar y otra apolar.'],
        explanation: 'Sus cabezas polares interaccionan con el agua y sus colas apolares se esconden en el interior: así se forma la membrana.',
      },
      [
        ['Tienen una cabeza polar y colas apolares'],
        ['Son totalmente polares', 'Si fueran totalmente polares se disolverían sin formar bicapas.'],
        ['Son proteínas', 'Los fosfolípidos son lípidos.'],
      ],
    ),
    mc(
      {
        id: 'w10u1-q4', concept: 'w10.proteinas', kind: 'concept', diff: 2,
        prompt: 'Selecciona lo que es cierto sobre las enzimas.',
        hints: ['Recuerda qué hace un catalizador (Mundo 8).'],
        explanation: 'Bajan la energía de activación, son específicas y la mayoría son proteínas. No se consumen y no cambian ΔG de la reacción.',
      },
      [
        ['Bajan la energía de activación'],
        ['Son específicas de su sustrato'],
        ['La mayoría son proteínas'],
        ['Se consumen en la reacción', 'Como todo catalizador, se recuperan al final.'],
        ['Hacen espontánea una reacción con ΔG > 0', 'Una enzima no cambia ΔG; solo acelera.'],
      ],
    ),
    num(
      {
        id: 'w10u1-q5', concept: 'w10.proteinas', kind: 'application', diff: 3,
        prompt: '¿Cuántas moléculas de agua se liberan al formar un péptido de 10 aminoácidos?',
        hints: ['n aminoácidos se unen con n − 1 enlaces peptídicos.'],
        explanation: '10 − 1 = 9 enlaces peptídicos → 9 moléculas de H₂O.',
      },
      9, 'moléculas', 0,
    ),
    sc(
      {
        id: 'w10u1-q6', concept: 'w10.proteinas', kind: 'problem', diff: 3,
        prompt: 'La actividad de una enzima humana cae mucho a 60 °C. ¿Por qué?',
        hints: ['¿Qué le pasa a la forma de una proteína al calentarla mucho?'],
        explanation: 'El calor rompe interacciones que mantienen la forma tridimensional (desnaturalización) y el sitio activo deja de encajar con el sustrato.',
      },
      [
        ['La proteína se desnaturaliza y pierde la forma del sitio activo'],
        ['Las reacciones siempre son más lentas a mayor temperatura', 'Sin enzima, subir la temperatura acelera las reacciones.'],
        ['La enzima se transforma en un lípido', 'Desnaturalizarse no cambia el tipo de biomolécula.'],
      ],
    ),
  ],
});

const metabolismo = unit({
  id: 'w10-u2-metabolismo',
  title: 'Ácidos nucleicos, ATP y metabolismo',
  objectives: [
    'Describir la estructura del ADN y del ARN y el apareamiento de bases.',
    'Explicar el papel del ATP y la secuencia de la respiración celular.',
  ],
  concepts: [
    { id: 'w10.nucleicos', name: 'ADN y ARN', prerequisites: ['w4.intermol'] },
    { id: 'w10.metabolismo', name: 'ATP y respiración celular', prerequisites: ['w5.redox', 'w8.gibbs'] },
  ],
  sources: [
    OPENSTAX_BIO('3.5 Nucleic Acids; 6.4 ATP: Adenosine Triphosphate; 7.2 Glycolysis; 7.3 Oxidation of Pyruvate and the Citric Acid Cycle; 7.4 Oxidative Phosphorylation'),
    LEHNINGER('Cap. 8 Nucleotides and Nucleic Acids; cap. 14 Glycolysis; cap. 16 The Citric Acid Cycle; cap. 19 Oxidative Phosphorylation'),
  ],
  intro: [
    'Información y energía',
    'Cada célula guarda instrucciones (ADN) y necesita energía para seguirlas (ATP). Las dos cosas se explican con la química que ya conoces: puentes de hidrógeno y reacciones redox.',
  ],
  simple: [
    'La idea sencilla',
    'El ADN es una doble hélice; sus bases se emparejan A con T y G con C mediante puentes de hidrógeno. El ARN usa U en lugar de T. La célula oxida la glucosa paso a paso y guarda parte de la energía en ATP.',
  ],
  analogy: {
    text: 'Metáfora: el ATP es una batería recargable de la célula: se "descarga" a ADP al usarse y se "recarga" en la respiración.',
    limits: 'La energía no está "guardada en un enlace" que se rompe: es la energía libre global de la hidrólisis (ΔG°′ ≈ −30,5 kJ/mol) la que se aprovecha al acoplarla a otras reacciones.',
  },
  everyday: [
    'En tu vida',
    'Al hacer ejercicio intenso, tus músculos producen ATP más rápido por glucólisis anaeróbica. El cianuro es tan tóxico porque bloquea la cadena de transporte de electrones y detiene la producción de ATP.',
  ],
  visual: [
    'Respiración celular',
    'Glucólisis (citoplasma): glucosa → 2 piruvato, balance neto 2 ATP y 2 NADH\nOxidación del piruvato y ciclo de Krebs (matriz mitocondrial): CO₂, NADH, FADH₂\nCadena de transporte de electrones (membrana mitocondrial interna): O₂ → H₂O, se produce la mayor parte del ATP',
  ],
  formal: [
    'Definiciones',
    'Nucleótido: fosfato + azúcar (desoxirribosa en ADN, ribosa en ARN) + base nitrogenada.\nBases: ADN A, T, G, C; ARN A, U, G, C. Apareamiento: A–T (2 puentes de H), G–C (3 puentes de H).\nRegla de Chargaff (ADN de doble cadena): %A = %T y %G = %C.\nATP: adenosín trifosfato. ATP + H₂O → ADP + Pᵢ, ΔG°′ ≈ −30,5 kJ/mol.\nRespiración aeróbica (global): C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O. La glucosa se oxida y el O₂ se reduce; el O₂ es el aceptor final de electrones.',
  ],
  worked: [
    'Ejemplo resuelto: regla de Chargaff',
    'Un ADN tiene 30 % de A.\n%T = %A = 30 %. Quedan 100 − 60 = 40 % para G + C.\n%G = %C = 20 %.',
  ],
  guided: ['w10u2-q1', 'w10u2-q4'],
  independent: ['w10u2-q2', 'w10u2-q5'],
  quiz: ['w10u2-q3', 'w10u2-q6'],
  questions: [
    sc(
      {
        id: 'w10u2-q1', concept: 'w10.nucleicos', kind: 'concept', diff: 1,
        prompt: '¿Qué base del ARN sustituye a la timina (T) del ADN?',
        hints: ['Empieza por U.'],
        explanation: 'El uracilo (U), que se empareja con la adenina.',
      },
      [
        ['Uracilo'],
        ['Citosina', 'La citosina está en ADN y ARN; se empareja con G.'],
        ['Guanina', 'La guanina está en ambos y se empareja con C.'],
      ],
    ),
    num(
      {
        id: 'w10u2-q2', concept: 'w10.nucleicos', kind: 'application', diff: 3,
        prompt: 'Un ADN de doble cadena tiene 30 % de adenina. ¿Qué porcentaje de guanina tiene?',
        hints: ['%A = %T; el resto se reparte por igual entre G y C.'],
        explanation: 'A + T = 60 %; G + C = 40 %; G = 20 %.',
      },
      20, '%', 0,
    ),
    sc(
      {
        id: 'w10u2-q3', concept: 'w10.nucleicos', kind: 'problem', diff: 3,
        prompt: '¿Por qué un ADN rico en G–C necesita más temperatura para separar sus hebras?',
        hints: ['Cuenta los puentes de hidrógeno de cada par.'],
        explanation: 'G–C forma 3 puentes de hidrógeno y A–T solo 2: más pares G–C dan más interacciones que romper.',
      },
      [
        ['G–C forma 3 puentes de hidrógeno y A–T solo 2'],
        ['G y C son enlaces covalentes entre hebras', 'Las hebras se unen por puentes de hidrógeno, no covalentemente.'],
        ['G y C son más pesadas', 'La masa no es lo que decide la estabilidad del apareamiento.'],
      ],
    ),
    order(
      {
        id: 'w10u2-q4', concept: 'w10.metabolismo', kind: 'concept', diff: 2,
        prompt: 'Ordena las etapas de la respiración celular aeróbica.',
        hints: ['Empieza en el citoplasma y termina en la membrana mitocondrial interna.'],
        explanation: 'Glucólisis → oxidación del piruvato → ciclo de Krebs → cadena de transporte de electrones (fosforilación oxidativa).',
      },
      ['Glucólisis', 'Oxidación del piruvato', 'Ciclo de Krebs', 'Cadena de transporte de electrones'],
    ),
    match(
      {
        id: 'w10u2-q5', concept: 'w10.metabolismo', kind: 'application', diff: 3,
        prompt: '¿Dónde ocurre cada etapa en una célula eucariota?',
        hints: ['Solo la glucólisis ocurre fuera de la mitocondria.'],
        explanation: 'Glucólisis: citoplasma. Ciclo de Krebs: matriz mitocondrial. Cadena de transporte: membrana mitocondrial interna.',
      },
      [
        ['Glucólisis', 'Citoplasma'],
        ['Ciclo de Krebs', 'Matriz mitocondrial'],
        ['Cadena de transporte de electrones', 'Membrana mitocondrial interna'],
      ],
    ),
    sc(
      {
        id: 'w10u2-q6', concept: 'w10.metabolismo', kind: 'problem', diff: 4,
        prompt: 'En la respiración celular, ¿cuál es el aceptor final de electrones?',
        hints: ['Aparece como reactivo en C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O y se reduce a agua.'],
        explanation: 'El O₂: al final de la cadena de transporte acepta electrones y H⁺ y se reduce a H₂O.',
      },
      [
        ['El oxígeno (O₂)'],
        ['La glucosa', 'La glucosa es la que se oxida: cede electrones.'],
        ['El CO₂', 'El CO₂ es un producto oxidado; no acepta los electrones de la cadena.'],
        ['El ATP', 'El ATP es la moneda energética, no un aceptor de electrones.'],
      ],
    ),
  ],
});

export const WORLD10_MODULES: Module[] = [
  { id: 'w10-mod1', title: 'Las moléculas de la vida', units: [biomoleculas, metabolismo] },
];
