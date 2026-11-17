/** Mundo 2 — El universo atómico. Fuente principal: OpenStax Chemistry 2e, cap. 2 y 6. */
import type { Module } from '@/core/learning/types';

import { mc, match, num, order, sc, unit } from './build';
import { CIAAW, OPENSTAX_CHEM } from './sources';

const particulas = unit({
  id: 'w2-u1-particulas',
  title: 'Protones, neutrones y electrones',
  objectives: [
    'Describir las tres partículas subatómicas y dónde están.',
    'Calcular protones, neutrones y electrones a partir de Z, A y la carga.',
    'Explicar qué son los isótopos y calcular una masa atómica promedio.',
  ],
  concepts: [
    { id: 'w2.particulas', name: 'Partículas subatómicas y números Z y A', prerequisites: [] },
    { id: 'w2.isotopos', name: 'Isótopos e iones', prerequisites: ['w2.particulas'] },
  ],
  sources: [OPENSTAX_CHEM('2.3 Atomic Structure and Symbolism'), CIAAW],
  intro: [
    '¿De qué está hecho un átomo?',
    'Todo lo que tocas está hecho de átomos tan pequeños que en el grosor de un cabello caben cientos de miles. Y aun así, cada átomo tiene partes.',
  ],
  simple: [
    'La idea sencilla',
    'En el centro hay un núcleo diminuto con protones (carga +) y neutrones (sin carga). Alrededor se mueven los electrones (carga −). El número de protones define qué elemento es: 6 protones = carbono, siempre.',
  ],
  analogy: {
    text: 'Metáfora: el núcleo es como una canica en el centro de un estadio y los electrones ocupan las gradas.',
    limits: 'Los electrones no giran en órbitas como planetas ni ocupan "asientos" fijos: se describen con probabilidades (orbitales).',
  },
  everyday: [
    'En tu vida',
    'El carbono-14 que se usa para fechar restos arqueológicos es carbono con 2 neutrones más que el carbono-12 común. En medicina, isótopos como el yodo-131 se usan en diagnóstico y tratamiento de la tiroides.',
  ],
  visual: [
    'Notación de un núclido',
    'ᴬ_Z X  →  A = número másico (protones + neutrones), Z = número atómico (protones).\nEjemplo: ¹²₆C tiene 6 protones y 12 − 6 = 6 neutrones.',
    'atom-explorer',
  ],
  formal: [
    'Definiciones',
    'Número atómico (Z): número de protones del núcleo; identifica al elemento.\nNúmero másico (A): protones + neutrones.\nNeutrones = A − Z.\nÁtomo neutro: electrones = protones.\nIon: átomo con carga neta; catión (+) perdió electrones, anión (−) ganó electrones. Electrones = Z − carga.\nIsótopos: átomos del mismo elemento (igual Z) con distinto número de neutrones (distinto A).\nMasa atómica promedio = Σ (masa del isótopo × abundancia fraccionaria).',
  ],
  worked: [
    'Ejemplo resuelto: ³⁷Cl⁻',
    'Z del cloro = 17 → 17 protones.\nNeutrones = 37 − 17 = 20.\nCarga −1 → ganó 1 electrón: 17 + 1 = 18 electrones.',
  ],
  guided: ['w2u1-q1', 'w2u1-q4'],
  independent: ['w2u1-q2', 'w2u1-q5'],
  quiz: ['w2u1-q3', 'w2u1-q6'],
  questions: [
    sc(
      {
        id: 'w2u1-q1', concept: 'w2.particulas', kind: 'concept', diff: 1,
        prompt: '¿Qué determina qué elemento es un átomo?',
        hints: ['Es el número que aparece en cada casilla de la tabla periódica.'],
        explanation: 'El número de protones (Z) identifica al elemento. Cambiar neutrones da isótopos; cambiar electrones da iones.',
      },
      [
        ['El número de protones'],
        ['El número de neutrones', 'Cambiar neutrones da otro isótopo del mismo elemento.'],
        ['El número de electrones', 'Cambiar electrones da un ion del mismo elemento.'],
        ['La masa del átomo', 'Isótopos del mismo elemento tienen masas distintas.'],
      ],
    ),
    num(
      {
        id: 'w2u1-q2', concept: 'w2.particulas', kind: 'application', diff: 2,
        prompt: '¿Cuántos neutrones tiene el carbono-14 (¹⁴₆C)?',
        hints: ['Neutrones = A − Z.'],
        explanation: 'A = 14, Z = 6 → 14 − 6 = 8 neutrones.',
      },
      8, 'neutrones', 0,
    ),
    num(
      {
        id: 'w2u1-q3', concept: 'w2.particulas', kind: 'problem', diff: 2,
        prompt: '¿Cuántos electrones tiene el ion Na⁺ (Z = 11)?',
        hints: ['Un catión +1 perdió un electrón.'],
        explanation: 'Electrones = Z − carga = 11 − 1 = 10.',
      },
      10, 'electrones', 0,
    ),
    sc(
      {
        id: 'w2u1-q4', concept: 'w2.isotopos', kind: 'concept', diff: 1,
        prompt: 'Dos isótopos del mismo elemento se diferencian en…',
        hints: ['Son el mismo elemento, así que algo debe mantenerse igual.'],
        explanation: 'Los isótopos tienen igual número de protones y distinto número de neutrones.',
      },
      [
        ['El número de neutrones'],
        ['El número de protones', 'Si cambian los protones, cambia el elemento.'],
        ['Sus propiedades químicas principales', 'La química depende sobre todo de los electrones, que son iguales en los átomos neutros.'],
      ],
    ),
    match(
      {
        id: 'w2u1-q5', concept: 'w2.isotopos', kind: 'application', diff: 2,
        prompt: 'Empareja cada especie con lo que la describe.',
        hints: ['Compara protones y electrones: ¿sobran, faltan o son iguales?'],
        explanation: 'Mg²⁺ perdió 2 e⁻ (catión); O²⁻ ganó 2 e⁻ (anión); ¹³C es un isótopo neutro del carbono.',
      },
      [
        ['Mg²⁺ (12 p, 10 e⁻)', 'Catión'],
        ['O²⁻ (8 p, 10 e⁻)', 'Anión'],
        ['¹³C (6 p, 7 n, 6 e⁻)', 'Isótopo neutro'],
      ],
    ),
    num(
      {
        id: 'w2u1-q6', concept: 'w2.isotopos', kind: 'problem', diff: 4,
        prompt: 'El cloro natural tiene 75,76 % de ³⁵Cl (34,969 u) y 24,24 % de ³⁷Cl (36,966 u). Calcula su masa atómica promedio.',
        hints: ['Convierte porcentajes a fracciones (75,76 % = 0,7576).', 'Suma masa × fracción de cada isótopo.'],
        explanation: '0,7576 × 34,969 + 0,2424 × 36,966 = 26,49 + 8,96 = 35,45 u, el valor de la tabla periódica.',
      },
      35.45, 'u', 0.002,
    ),
  ],
});

const electrones = unit({
  id: 'w2-u2-electrones',
  title: 'Modelos atómicos y configuración electrónica',
  objectives: [
    'Ordenar la evolución de los modelos atómicos y qué aportó cada uno.',
    'Escribir configuraciones electrónicas con el principio de Aufbau.',
  ],
  concepts: [
    { id: 'w2.modelos', name: 'Modelos atómicos', prerequisites: ['w2.particulas'] },
    { id: 'w2.configuracion', name: 'Configuración electrónica', prerequisites: ['w2.particulas'] },
  ],
  sources: [
    OPENSTAX_CHEM('2.2 Evolution of Atomic Theory; 6.3 Development of Quantum Theory; 6.4 Electronic Structure of Atoms'),
  ],
  intro: [
    'Un modelo que cambió cinco veces',
    'Nadie ha "visto" un electrón dando vueltas. Lo que sabemos del átomo viene de experimentos, y cada experimento nuevo obligó a corregir el modelo anterior.',
  ],
  simple: [
    'La idea sencilla',
    'Los electrones se organizan en niveles de energía (1, 2, 3…) y subniveles (s, p, d, f). Se llenan empezando por los de menor energía. Esa organización explica casi toda la química del elemento.',
  ],
  analogy: {
    text: 'Metáfora: un edificio donde los inquilinos (electrones) ocupan primero los pisos bajos, más baratos en energía.',
    limits: 'El orden real no es estrictamente "piso por piso": 4s se llena antes que 3d, y hay excepciones como Cr y Cu.',
  },
  everyday: [
    'En tu vida',
    'Los colores de los fuegos artificiales aparecen cuando electrones excitados bajan de nivel y emiten luz de una energía concreta: el estroncio da rojo y el cobre, azul verdoso.',
  ],
  visual: [
    'Orden de llenado (Aufbau)',
    '1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p → 6s → 4f → 5d → 6p…\nCapacidad: s = 2, p = 6, d = 10, f = 14 electrones. Un nivel n admite como máximo 2n² electrones.',
    'shells-explorer',
  ],
  formal: [
    'Definiciones',
    'Orbital: región donde es alta la probabilidad de encontrar un electrón; admite como máximo 2 electrones con espín opuesto (principio de exclusión de Pauli).\nPrincipio de Aufbau: los electrones ocupan primero los orbitales de menor energía.\nRegla de Hund: en orbitales de igual energía, los electrones se reparten de uno en uno antes de aparearse.\nConfiguración abreviada: se usa el gas noble anterior entre corchetes, p. ej. Na = [Ne] 3s¹.',
  ],
  worked: [
    'Ejemplo resuelto: oxígeno (Z = 8)',
    '8 electrones: 1s² (2) → 2s² (4) → 2p⁴ (8).\nConfiguración: 1s² 2s² 2p⁴. Nivel externo n = 2 con 2 + 4 = 6 electrones de valencia.',
  ],
  guided: ['w2u2-q1', 'w2u2-q4'],
  independent: ['w2u2-q2', 'w2u2-q5'],
  quiz: ['w2u2-q3', 'w2u2-q6'],
  questions: [
    order(
      {
        id: 'w2u2-q1', concept: 'w2.modelos', kind: 'concept', diff: 2,
        prompt: 'Ordena los modelos atómicos del más antiguo al más reciente.',
        hints: ['El modelo de esferas macizas es el primero; el de orbitales, el último.'],
        explanation: 'Dalton (1803, esferas) → Thomson (1897, electrones en una masa positiva) → Rutherford (1911, núcleo) → Bohr (1913, niveles) → mecánico-cuántico (Schrödinger, 1926, orbitales).',
      },
      ['Dalton', 'Thomson', 'Rutherford', 'Bohr', 'Mecánico-cuántico'],
    ),
    sc(
      {
        id: 'w2u2-q2', concept: 'w2.modelos', kind: 'application', diff: 3,
        prompt: 'En el experimento de la lámina de oro, casi todas las partículas alfa atravesaron la lámina y unas pocas rebotaron. ¿Qué concluyó Rutherford?',
        hints: ['Si casi todo atraviesa, ¿cómo es la mayor parte del átomo? ¿Qué hace rebotar a unas pocas?'],
        explanation: 'La mayor parte del átomo es espacio vacío y la carga positiva y casi toda la masa están en un núcleo diminuto y denso.',
      },
      [
        ['El átomo tiene un núcleo pequeño, denso y positivo'],
        ['Los electrones están en niveles de energía', 'Eso lo propuso Bohr después, a partir de los espectros.'],
        ['El átomo es una esfera maciza e indivisible', 'Esa era la idea de Dalton; el experimento la contradice.'],
      ],
    ),
    sc(
      {
        id: 'w2u2-q3', concept: 'w2.modelos', kind: 'retention', diff: 2,
        prompt: 'En el modelo actual, un orbital es…',
        hints: ['El modelo actual habla de probabilidades, no de trayectorias.'],
        explanation: 'Un orbital es una región del espacio donde es alta la probabilidad de encontrar al electrón, con hasta 2 electrones.',
      },
      [
        ['Una región donde es probable encontrar un electrón'],
        ['La trayectoria circular exacta de un electrón', 'Las órbitas fijas son del modelo de Bohr, superado.'],
        ['Una partícula del núcleo', 'Los orbitales describen electrones, no partículas nucleares.'],
      ],
    ),
    sc(
      {
        id: 'w2u2-q4', concept: 'w2.configuracion', kind: 'concept', diff: 2,
        prompt: '¿Cuál es la configuración electrónica del nitrógeno (Z = 7)?',
        hints: ['Llena 1s, luego 2s, luego 2p hasta sumar 7.'],
        explanation: '1s² 2s² 2p³ suma 2 + 2 + 3 = 7 electrones.',
      },
      [
        ['1s² 2s² 2p³'],
        ['1s² 2p⁵', 'Falta llenar 2s antes de 2p.'],
        ['1s² 2s² 2p⁴', 'Eso suma 8 electrones: es el oxígeno.'],
        ['1s² 2s⁵', 'Un subnivel s admite como máximo 2 electrones.'],
      ],
    ),
    num(
      {
        id: 'w2u2-q5', concept: 'w2.configuracion', kind: 'application', diff: 2,
        prompt: '¿Cuántos electrones caben como máximo en el nivel n = 3?',
        hints: ['Usa 2n².'],
        explanation: '2 × 3² = 18 (3s² + 3p⁶ + 3d¹⁰).',
      },
      18, 'electrones', 0,
    ),
    mc(
      {
        id: 'w2u2-q6', concept: 'w2.configuracion', kind: 'problem', diff: 3,
        prompt: 'Selecciona las afirmaciones correctas sobre el sodio (Na, Z = 11).',
        hints: ['Escribe la configuración completa: 1s² 2s² 2p⁶ …'],
        explanation: 'Na = 1s² 2s² 2p⁶ 3s¹ = [Ne] 3s¹: tiene 1 electrón de valencia en el nivel 3.',
      },
      [
        ['Su configuración abreviada es [Ne] 3s¹'],
        ['Tiene 1 electrón de valencia'],
        ['Su último electrón está en un orbital 3p', 'Tras 2p⁶ se llena 3s, antes que 3p.'],
        ['Tiene electrones en 4 niveles', 'Solo ocupa los niveles 1, 2 y 3.'],
      ],
    ),
  ],
});

export const WORLD2_MODULES: Module[] = [
  { id: 'w2-mod1', title: 'El átomo por dentro', units: [particulas, electrones] },
];
