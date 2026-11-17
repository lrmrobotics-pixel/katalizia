/** Mundo 5 — Reacciones químicas. Fuente principal: OpenStax Chemistry 2e, 4.1, 4.2 y 4.5. */
import type { Module } from '@/core/learning/types';

import { match, mc, num, sc, unit } from './build';
import { OPENSTAX_CHEM } from './sources';

const ecuaciones = unit({
  id: 'w5-u1-ecuaciones',
  title: 'Ecuaciones químicas y balanceo',
  objectives: [
    'Leer una ecuación química: reactivos, productos, estados y coeficientes.',
    'Aplicar la conservación de la masa.',
    'Balancear ecuaciones por tanteo.',
  ],
  concepts: [
    { id: 'w5.ecuaciones', name: 'Ecuaciones y conservación de la masa', prerequisites: ['w4.tipos'] },
    { id: 'w5.balanceo', name: 'Balanceo de ecuaciones', prerequisites: ['w4.tipos'] },
  ],
  sources: [OPENSTAX_CHEM('4.1 Writing and Balancing Chemical Equations')],
  intro: [
    'La receta de una reacción',
    'Una ecuación química dice qué entra, qué sale y en qué proporción. Pero en una reacción los átomos no se crean ni se destruyen: solo se reorganizan.',
  ],
  simple: [
    'La idea sencilla',
    'Reactivos → productos. Balancear es poner números delante de cada fórmula (coeficientes) para que haya el mismo número de átomos de cada elemento a los dos lados. Nunca cambies los subíndices: cambiarías la sustancia.',
  ],
  analogy: {
    text: 'Metáfora: armar figuras con bloques. Puedes desmontar y montar figuras nuevas, pero al final tienes los mismos bloques.',
    limits: 'En una reacción también cambia la energía (se libera o absorbe calor), algo que los bloques no muestran.',
  },
  everyday: [
    'En tu vida',
    'Cuando respiras, tus células hacen globalmente C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O. Cada átomo de carbono de la glucosa que oxidas sale de tu cuerpo en el CO₂ que exhalas.',
  ],
  visual: [
    'Partes de una ecuación',
    '2 H₂(g) + O₂(g) → 2 H₂O(l)\nCoeficientes: 2, 1, 2 · Subíndices: el 2 de H₂ · Estados: (s) sólido, (l) líquido, (g) gas, (aq) disuelto en agua.',
    'reaction-anim',
  ],
  formal: [
    'Definiciones',
    'Ley de conservación de la masa (Lavoisier): en un sistema cerrado, la masa total de los reactivos es igual a la de los productos.\nCoeficiente estequiométrico: número que multiplica a toda la fórmula; indica proporción en moles o moléculas.\nEcuación balanceada: igual número de átomos de cada elemento (y la misma carga total) a ambos lados, con los coeficientes enteros más pequeños posibles.',
  ],
  worked: [
    'Ejemplo resuelto: combustión del metano',
    'CH₄ + O₂ → CO₂ + H₂O\n1) C: 1 = 1 ✔.\n2) H: 4 a la izquierda → pon 2 H₂O.\n3) O: derecha 2 + 2 = 4 → pon 2 O₂.\nResultado: CH₄ + 2 O₂ → CO₂ + 2 H₂O.\nConsejo: deja para el final los elementos que aparecen solos (como O₂).',
  ],
  guided: ['w5u1-q1', 'w5u1-q4'],
  independent: ['w5u1-q2', 'w5u1-q5'],
  quiz: ['w5u1-q3', 'w5u1-q6'],
  questions: [
    num(
      {
        id: 'w5u1-q1', concept: 'w5.ecuaciones', kind: 'concept', diff: 1,
        prompt: 'En un recipiente cerrado reaccionan 12 g de reactivos por completo. ¿Cuántos gramos de productos se obtienen?',
        hints: ['Ley de conservación de la masa.'],
        explanation: 'En un sistema cerrado la masa se conserva: 12 g de reactivos dan 12 g de productos.',
      },
      12, 'g', 0,
    ),
    sc(
      {
        id: 'w5u1-q2', concept: 'w5.ecuaciones', kind: 'application', diff: 2,
        prompt: 'Al quemar una vela, la vela pierde masa. ¿Contradice esto la conservación de la masa?',
        hints: ['¿A dónde van los productos de la combustión (CO₂ y H₂O)?'],
        explanation: 'No: la vela no es un sistema cerrado. El CO₂ y el vapor de agua escapan al aire. Si se recogieran, la masa total se conservaría.',
      },
      [
        ['No, porque los productos gaseosos escapan al aire'],
        ['Sí, la masa se destruye al quemarse', 'La masa no se destruye: pasa a gases que no ves.'],
        ['Sí, porque la luz se lleva masa', 'La energía emitida no explica la pérdida de masa que mides en una balanza; son los gases que escapan.'],
      ],
    ),
    sc(
      {
        id: 'w5u1-q3', concept: 'w5.ecuaciones', kind: 'problem', diff: 2,
        prompt: 'En 2 H₂O, ¿cuántos átomos de hidrógeno hay?',
        hints: ['El coeficiente multiplica a toda la fórmula.'],
        explanation: '2 moléculas × 2 átomos de H = 4 átomos de H (y 2 de O).',
      },
      [
        ['4'],
        ['2', 'Olvidaste multiplicar por el coeficiente 2.'],
        ['3', 'Sumaste coeficiente y subíndice en vez de multiplicarlos.'],
      ],
    ),
    sc(
      {
        id: 'w5u1-q4', concept: 'w5.balanceo', kind: 'concept', diff: 2,
        prompt: 'Para balancear H₂ + O₂ → H₂O, ¿qué está PERMITIDO cambiar?',
        hints: ['Si cambias un subíndice, ¿sigue siendo agua?'],
        explanation: 'Solo los coeficientes. Escribir H₂O₂ cambiaría la sustancia (agua oxigenada). Resultado: 2 H₂ + O₂ → 2 H₂O.',
      },
      [
        ['Los coeficientes delante de cada fórmula'],
        ['Los subíndices (escribir H₂O₂)', 'H₂O₂ es otra sustancia: el peróxido de hidrógeno.'],
        ['Quitar el O₂ sobrante', 'No se pueden eliminar sustancias de la reacción.'],
      ],
    ),
    num(
      {
        id: 'w5u1-q5', concept: 'w5.balanceo', kind: 'application', diff: 3,
        prompt: 'Balancea: Al + O₂ → Al₂O₃. ¿Qué coeficiente lleva el O₂?',
        hints: ['El O necesita un múltiplo común de 2 y 3: 6.', 'Con 6 O: 3 O₂ y 2 Al₂O₃.'],
        explanation: '4 Al + 3 O₂ → 2 Al₂O₃. Comprueba: Al 4 = 4; O 6 = 6.',
      },
      3, undefined, 0,
    ),
    num(
      {
        id: 'w5u1-q6', concept: 'w5.balanceo', kind: 'problem', diff: 4,
        prompt: 'Balancea la respiración celular: C₆H₁₂O₆ + O₂ → CO₂ + H₂O. ¿Qué coeficiente lleva el O₂?',
        hints: ['Primero C (6 CO₂), luego H (6 H₂O), al final O.', 'O a la derecha: 6·2 + 6 = 18. La glucosa aporta 6.'],
        explanation: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O. O: 6 + 12 = 18 a la izquierda y 12 + 6 = 18 a la derecha.',
      },
      6, undefined, 0,
    ),
  ],
});

const tipos = unit({
  id: 'w5-u2-tipos',
  title: 'Tipos de reacción y óxido-reducción',
  objectives: [
    'Clasificar reacciones de síntesis, descomposición, desplazamiento y combustión.',
    'Asignar números de oxidación e identificar qué se oxida y qué se reduce.',
  ],
  concepts: [
    { id: 'w5.tipos', name: 'Tipos de reacción', prerequisites: ['w5.ecuaciones'] },
    { id: 'w5.redox', name: 'Óxido-reducción', prerequisites: ['w5.ecuaciones'] },
  ],
  sources: [OPENSTAX_CHEM('4.2 Classifying Chemical Reactions')],
  intro: [
    'Patrones que se repiten',
    'Hay millones de reacciones, pero muchas siguen unos pocos patrones. Y una de las más importantes para la vida, la óxido-reducción, es simplemente un intercambio de electrones.',
  ],
  simple: [
    'La idea sencilla',
    'Síntesis: A + B → AB. Descomposición: AB → A + B. Desplazamiento: un elemento ocupa el lugar de otro. Combustión: una sustancia reacciona con O₂ liberando energía. Redox: un átomo pierde electrones (se oxida) y otro los gana (se reduce).',
  ],
  analogy: {
    text: 'Regla mnemotécnica: "OIL RIG" → Oxidation Is Loss, Reduction Is Gain (de electrones).',
    limits: 'Es solo para recordar; en reacciones covalentes los electrones no siempre se transfieren por completo y por eso usamos números de oxidación.',
  },
  everyday: [
    'En tu vida',
    'El óxido del hierro es una oxidación lenta. Las baterías funcionan con reacciones redox. En tus mitocondrias, la cadena de transporte de electrones es una serie de reacciones redox que termina reduciendo O₂ a H₂O.',
  ],
  visual: [
    'Reglas de números de oxidación',
    'Elemento libre: 0 · Ion monoatómico: su carga · O: −2 (salvo peróxidos) · H: +1 con no metales · La suma en una molécula neutra es 0; en un ion, su carga.',
  ],
  formal: [
    'Definiciones',
    'Oxidación: pérdida de electrones (el número de oxidación sube).\nReducción: ganancia de electrones (el número de oxidación baja).\nAgente reductor: la especie que se oxida (cede electrones). Agente oxidante: la que se reduce.\nDesplazamiento simple: A + BC → AC + B. Doble desplazamiento: AB + CD → AD + CB (a menudo forma un precipitado, gas o agua).\nCombustión completa de un compuesto orgánico: produce CO₂ y H₂O.',
  ],
  worked: [
    'Ejemplo resuelto: Zn + CuSO₄ → ZnSO₄ + Cu',
    'Zn: 0 → +2 (pierde 2 e⁻) → se oxida; es el agente reductor.\nCu: +2 → 0 (gana 2 e⁻) → se reduce; Cu²⁺ es el agente oxidante.\nTipo: desplazamiento simple (el Zn ocupa el lugar del Cu).',
  ],
  guided: ['w5u2-q1', 'w5u2-q4'],
  independent: ['w5u2-q2', 'w5u2-q5'],
  quiz: ['w5u2-q3', 'w5u2-q6'],
  questions: [
    match(
      {
        id: 'w5u2-q1', concept: 'w5.tipos', kind: 'concept', diff: 2,
        prompt: 'Clasifica cada reacción.',
        hints: ['Fíjate en cuántas sustancias entran y salen, y si aparece O₂ con un combustible.'],
        explanation: 'Síntesis: 2Na + Cl₂ → 2NaCl. Descomposición: 2H₂O₂ → 2H₂O + O₂. Desplazamiento simple: Zn + 2HCl → ZnCl₂ + H₂. Doble desplazamiento: AgNO₃ + NaCl → AgCl + NaNO₃.',
      },
      [
        ['2 Na + Cl₂ → 2 NaCl', 'Síntesis'],
        ['2 H₂O₂ → 2 H₂O + O₂', 'Descomposición'],
        ['Zn + 2 HCl → ZnCl₂ + H₂', 'Desplazamiento simple'],
        ['AgNO₃ + NaCl → AgCl + NaNO₃', 'Doble desplazamiento'],
      ],
    ),
    mc(
      {
        id: 'w5u2-q2', concept: 'w5.tipos', kind: 'application', diff: 2,
        prompt: '¿Cuáles son productos de la combustión COMPLETA del propano (C₃H₈)?',
        hints: ['Un compuesto de C e H que arde con suficiente O₂.'],
        explanation: 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. El CO aparece en la combustión incompleta (falta de O₂).',
      },
      [
        ['CO₂'],
        ['H₂O'],
        ['CO', 'El monóxido de carbono se forma en la combustión incompleta, con poco oxígeno.'],
        ['H₂', 'El hidrógeno termina formando agua.'],
      ],
    ),
    sc(
      {
        id: 'w5u2-q3', concept: 'w5.tipos', kind: 'retention', diff: 2,
        prompt: 'CaCO₃(s) → CaO(s) + CO₂(g) al calentar. Es una reacción de…',
        hints: ['Una sola sustancia da varias.'],
        explanation: 'Descomposición: un compuesto se separa en sustancias más simples.',
      },
      [
        ['Descomposición'],
        ['Síntesis', 'En la síntesis varias sustancias forman una sola; aquí ocurre lo contrario.'],
        ['Combustión', 'No hay O₂ como reactivo.'],
      ],
    ),
    num(
      {
        id: 'w5u2-q4', concept: 'w5.redox', kind: 'concept', diff: 3,
        prompt: '¿Cuál es el número de oxidación del azufre en H₂SO₄?',
        hints: ['H = +1, O = −2; la suma debe ser 0.', '2(+1) + x + 4(−2) = 0.'],
        explanation: '2 + x − 8 = 0 → x = +6.',
      },
      6, undefined, 0,
    ),
    sc(
      {
        id: 'w5u2-q5', concept: 'w5.redox', kind: 'application', diff: 3,
        prompt: 'En Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂, ¿qué le pasa al hierro?',
        hints: ['Fe en Fe₂O₃: 2x + 3(−2) = 0. Fe como metal libre: 0.'],
        explanation: 'Fe pasa de +3 a 0: gana electrones, se reduce. El CO (C de +2 a +4) es el agente reductor.',
      },
      [
        ['Se reduce (de +3 a 0)'],
        ['Se oxida (de +3 a 0)', 'Bajar el número de oxidación es reducción, no oxidación.'],
        ['No cambia', 'Pasa de formar parte de un óxido (+3) a metal libre (0).'],
      ],
    ),
    sc(
      {
        id: 'w5u2-q6', concept: 'w5.redox', kind: 'problem', diff: 3,
        prompt: 'En una reacción redox, el agente oxidante es la especie que…',
        hints: ['El oxidante "provoca" la oxidación del otro quitándole electrones.'],
        explanation: 'El agente oxidante gana electrones: se reduce, y así oxida a la otra especie.',
      },
      [
        ['Gana electrones y se reduce'],
        ['Pierde electrones y se oxida', 'Esa es la definición del agente reductor.'],
        ['Siempre es el oxígeno', 'Muchos oxidantes no son O₂ (p. ej., Cu²⁺, Cl₂).'],
      ],
    ),
  ],
});

export const WORLD5_MODULES: Module[] = [{ id: 'w5-mod1', title: 'Ecuaciones y patrones', units: [ecuaciones, tipos] }];
