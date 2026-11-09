/**
 * Mundo 12 — Laboratorio avanzado (preparación universitaria). Problemas integradores.
 * Casos contextualizados SOLO educativos. Fuentes: OpenStax Chemistry 2e (1.5, 3.3, 4.3) y A&P 2e.
 */
import type { Module } from '@/core/learning/types';

import { mc, num, sc, unit } from './build';
import { BIPM_SI, OPENSTAX_AP, OPENSTAX_CHEM } from './sources';

const datos = unit({
  id: 'w12-u1-datos',
  title: 'Análisis de datos y problemas integradores',
  objectives: [
    'Calcular media y error porcentual e interpretar cifras significativas.',
    'Resolver problemas de varios pasos que combinan mol, estequiometría y disoluciones.',
  ],
  concepts: [
    { id: 'w12.datos', name: 'Análisis de datos experimentales', prerequisites: ['w1.notacion'] },
    { id: 'w12.integrador', name: 'Problemas integradores', prerequisites: ['w6.estequiometria', 'w6.disoluciones'] },
  ],
  sources: [OPENSTAX_CHEM('1.5 Measurement Uncertainty, Accuracy, and Precision; 3.3 Molarity; 4.3 Reaction Stoichiometry'), BIPM_SI],
  intro: [
    'Pensar como en el laboratorio',
    'En la universidad los problemas no vienen separados por tema: combinan medida, mol, reacciones y disoluciones. Y todo resultado experimental tiene incertidumbre.',
  ],
  simple: [
    'La idea sencilla',
    'Repite las medidas y usa la media. Compara con el valor aceptado mediante el error porcentual. En problemas largos, escribe la ruta (gramos → moles → relación molar → lo que piden) antes de calcular.',
  ],
  analogy: {
    text: 'Metáfora: un problema integrador es un viaje con escalas; cada conversión es una escala y el mol es el aeropuerto central.',
    limits: 'No todo problema pasa por el mol (p. ej., una dilución C₁V₁ = C₂V₂), pero la mayoría sí.',
  },
  everyday: [
    'En tu vida',
    'En un laboratorio clínico cada análisis se calibra y se informa con sus unidades y su rango de referencia: interpretar un número exige saber cómo se midió.',
  ],
  visual: [
    'Exactitud y precisión',
    'Exactitud: cercanía al valor verdadero.\nPrecisión: cercanía de las medidas entre sí.\nPuedes ser precisa pero inexacta (todas las medidas juntas, lejos del valor real).',
  ],
  formal: [
    'Definiciones',
    'Media: suma de las medidas ÷ número de medidas.\nError porcentual = |valor medido − valor aceptado| ÷ valor aceptado × 100.\nCifras significativas: en multiplicación y división, el resultado lleva tantas cifras como el dato con menos; en suma y resta, tantos decimales como el dato con menos decimales.\nCeros a la izquierda (0,00520) no son significativos; los ceros finales tras la coma sí.',
  ],
  worked: [
    'Ejemplo resuelto: preparar una disolución',
    'Necesitas 250 mL de NaOH 0,100 M. M(NaOH) = 22,990 + 15,999 + 1,008 = 39,997 g/mol.\nn = 0,100 mol/L × 0,250 L = 0,0250 mol.\nm = 0,0250 × 39,997 = 1,00 g de NaOH, disueltos y completados hasta 250 mL.',
  ],
  guided: ['w12u1-q1', 'w12u1-q4'],
  independent: ['w12u1-q2', 'w12u1-q5'],
  quiz: ['w12u1-q3', 'w12u1-q6'],
  questions: [
    num(
      {
        id: 'w12u1-q1', concept: 'w12.datos', kind: 'concept', diff: 1,
        prompt: 'Tres medidas de masa: 2,0 g; 2,2 g; 2,1 g. ¿Cuál es la media?',
        hints: ['Suma y divide entre 3.'],
        explanation: '(2,0 + 2,2 + 2,1) ÷ 3 = 6,3 ÷ 3 = 2,1 g.',
      },
      2.1, 'g', 0.005,
    ),
    num(
      {
        id: 'w12u1-q2', concept: 'w12.datos', kind: 'application', diff: 2,
        prompt: 'Mides g = 9,6 m/s² y el valor aceptado es 9,81 m/s². ¿Cuál es el error porcentual?',
        hints: ['|9,6 − 9,81| ÷ 9,81 × 100.'],
        explanation: '0,21 ÷ 9,81 × 100 = 2,1 %.',
      },
      2.14, '%', 0.03,
    ),
    num(
      {
        id: 'w12u1-q3', concept: 'w12.datos', kind: 'retention', diff: 2,
        prompt: '¿Cuántas cifras significativas tiene 0,00520?',
        hints: ['Los ceros a la izquierda no cuentan; el cero final tras la coma sí.'],
        explanation: 'Tres: 5, 2 y el 0 final.',
      },
      3, 'cifras', 0,
    ),
    num(
      {
        id: 'w12u1-q4', concept: 'w12.integrador', kind: 'concept', diff: 3,
        prompt: '¿Cuántos gramos de NaOH (M = 39,997 g/mol) necesitas para preparar 250 mL de disolución 0,100 M?',
        hints: ['Moles = M × V (en litros).', 'Gramos = moles × masa molar.'],
        explanation: '0,100 × 0,250 = 0,0250 mol; × 39,997 = 1,00 g.',
      },
      1.0, 'g', 0.01,
    ),
    num(
      {
        id: 'w12u1-q5', concept: 'w12.integrador', kind: 'application', diff: 4,
        prompt: '¿Cuántos gramos de CO₂ se producen al quemar por completo 16,0 g de CH₄? (CH₄ + 2 O₂ → CO₂ + 2 H₂O; M(CH₄) = 16,043; M(CO₂) = 44,009 g/mol)',
        hints: ['16,0 g ÷ 16,043 = moles de CH₄.', 'Relación 1 : 1 con CO₂; multiplica por 44,009.'],
        explanation: 'n(CH₄) = 0,997 mol → n(CO₂) = 0,997 mol → 0,997 × 44,009 = 43,9 g.',
      },
      43.9, 'g', 0.01,
    ),
    num(
      {
        id: 'w12u1-q6', concept: 'w12.integrador', kind: 'problem', diff: 4,
        prompt: '¿Qué volumen (mL) de HCl 0,200 M neutraliza 0,400 g de NaOH (M = 39,997 g/mol)?',
        hints: ['Moles de NaOH = 0,400 ÷ 39,997.', 'HCl + NaOH es 1 : 1; V = n ÷ M.'],
        explanation: 'n = 0,0100 mol; V = 0,0100 ÷ 0,200 = 0,0500 L = 50,0 mL.',
      },
      50, 'mL', 0.01,
    ),
  ],
});

const casos = unit({
  id: 'w12-u2-casos',
  title: 'Casos contextualizados y repaso acumulativo',
  objectives: [
    'Convertir unidades de laboratorio clínico (mg/dL ↔ mmol/L).',
    'Integrar conceptos de varios mundos en un mismo razonamiento.',
  ],
  concepts: [
    { id: 'w12.casos', name: 'Química en contexto clínico', prerequisites: ['w11.osmosis', 'w11.ph_sangre'] },
    { id: 'w12.acumulativo', name: 'Repaso acumulativo', prerequisites: ['w10.metabolismo'] },
  ],
  sources: [OPENSTAX_AP('24.3 Carbohydrate Metabolism; 26.4 Acid-Base Balance'), OPENSTAX_CHEM('3.3 Molarity')],
  intro: [
    'Unir todas las piezas',
    'Ahora usarás lo aprendido en situaciones realistas, como las que verás en Medicina. Contenido educativo: no sirve para diagnosticar ni tratar a nadie.',
  ],
  simple: [
    'La idea sencilla',
    'Los informes clínicos usan unidades distintas según el país (mg/dL o mmol/L). Pasar de una a otra es una conversión de masa a moles que ya sabes hacer.',
  ],
  analogy: {
    text: 'Metáfora: cambiar mg/dL a mmol/L es como cambiar de moneda: el valor real no cambia, solo la forma de expresarlo.',
    limits: 'A diferencia de la moneda, el "tipo de cambio" depende de cada sustancia (su masa molar).',
  },
  everyday: [
    'En tu vida',
    'Una glucemia de 90 mg/dL en un informe es lo mismo que unos 5,0 mmol/L en otro. La cifra cambia; la cantidad de glucosa en la sangre es la misma.',
  ],
  visual: [
    'De mg/dL a mmol/L',
    'mg/dL × 10 → mg/L\nmg/L ÷ masa molar (g/mol) → mmol/L\nGlucosa: M = 180,16 g/mol → factor ≈ ÷ 18',
  ],
  formal: [
    'Definiciones',
    '1 dL = 0,1 L = 100 mL.\nmmol/L = (mg/dL × 10) ÷ M (g/mol).\nEn electrolitos monovalentes (Na⁺, K⁺, Cl⁻), mmol/L y mEq/L coinciden; para iones divalentes (Ca²⁺), mEq/L = 2 × mmol/L.\nLos rangos de referencia dependen del laboratorio y del método; aquí solo se usan para practicar conversiones.',
  ],
  worked: [
    'Ejemplo resuelto: glucosa 90 mg/dL',
    '90 mg/dL × 10 = 900 mg/L.\n900 mg/L ÷ 180,16 g/mol = 5,00 mmol/L.',
  ],
  guided: ['w12u2-q1', 'w12u2-q4'],
  independent: ['w12u2-q2', 'w12u2-q5'],
  quiz: ['w12u2-q3', 'w12u2-q6'],
  questions: [
    num(
      {
        id: 'w12u2-q1', concept: 'w12.casos', kind: 'concept', diff: 3,
        prompt: 'Convierte una glucemia de 90 mg/dL a mmol/L (M = 180,16 g/mol).',
        hints: ['mg/dL × 10 = mg/L.', 'Divide entre la masa molar.'],
        explanation: '900 mg/L ÷ 180,16 = 5,00 mmol/L.',
      },
      5.0, 'mmol/L', 0.01,
    ),
    num(
      {
        id: 'w12u2-q2', concept: 'w12.casos', kind: 'application', diff: 3,
        prompt: 'Un valor de calcio es 2,5 mmol/L. ¿Cuántos mEq/L son?',
        hints: ['El Ca²⁺ tiene carga 2.'],
        explanation: 'mEq/L = 2 × mmol/L = 5,0 mEq/L.',
      },
      5, 'mEq/L', 0.01,
    ),
    sc(
      {
        id: 'w12u2-q3', concept: 'w12.casos', kind: 'problem', diff: 4,
        prompt: 'En un caso de práctica, el CO₂ en sangre aumenta porque la persona respira poco. Según el sistema bicarbonato, ¿qué esperas del pH?',
        hints: ['CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻.'],
        explanation: 'Más CO₂ desplaza el equilibrio a la derecha, sube [H⁺] y baja el pH (tendencia a la acidemia respiratoria).',
      },
      [
        ['Que baje'],
        ['Que suba', 'Subiría si se eliminara CO₂ (hiperventilación).'],
        ['Que no cambie', 'El CO₂ está acoplado al H⁺ por el equilibrio del bicarbonato.'],
      ],
    ),
    mc(
      {
        id: 'w12u2-q4', concept: 'w12.acumulativo', kind: 'concept', diff: 3,
        prompt: 'Repaso acumulativo: selecciona las afirmaciones correctas.',
        hints: ['Recorre los mundos: enlaces, reacciones, energía y bioquímica.'],
        explanation: 'El agua forma puentes de hidrógeno; las enzimas bajan la energía de activación; en la respiración la glucosa se oxida. Un catalizador no cambia la constante de equilibrio.',
      },
      [
        ['El agua forma puentes de hidrógeno'],
        ['Las enzimas bajan la energía de activación'],
        ['En la respiración celular la glucosa se oxida'],
        ['Un catalizador aumenta la constante de equilibrio', 'Un catalizador acelera la reacción directa e inversa por igual: no cambia K.'],
      ],
    ),
    num(
      {
        id: 'w12u2-q5', concept: 'w12.acumulativo', kind: 'application', diff: 4,
        prompt: '¿Cuántos moles de O₂ se necesitan para oxidar por completo 0,50 mol de glucosa? (C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O)',
        hints: ['Relación glucosa : O₂ = 1 : 6.'],
        explanation: '0,50 × 6 = 3,0 mol de O₂.',
      },
      3, 'mol', 0.01,
    ),
    sc(
      {
        id: 'w12u2-q6', concept: 'w12.acumulativo', kind: 'retention', diff: 3,
        prompt: '¿Qué tienen en común el amortiguador acetato y el amortiguador bicarbonato?',
        hints: ['Recuerda la definición de amortiguador (Mundo 7).'],
        explanation: 'Ambos son un ácido débil con su base conjugada, y su pH se describe con Henderson-Hasselbalch.',
      },
      [
        ['Ambos combinan un ácido débil con su base conjugada'],
        ['Ambos son ácidos fuertes', 'Un ácido fuerte no forma un amortiguador útil.'],
        ['Ambos tienen pH 7', 'El pH de un amortiguador depende de su pKa y de la proporción de sus componentes.'],
      ],
    ),
  ],
});

export const WORLD12_MODULES: Module[] = [{ id: 'w12-mod1', title: 'Hacia la universidad', units: [datos, casos] }];
