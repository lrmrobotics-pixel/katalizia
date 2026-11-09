/**
 * Mundo 11 — Química para Medicina. Contenido SOLO educativo: no es diagnóstico ni indicación de tratamiento.
 * Fuentes: OpenStax Anatomy and Physiology 2e (cap. 26), Pharmacology for Nurses (cap. 2), Chemistry 2e (11.4).
 */
import type { Module } from '@/core/learning/types';

import { match, num, order, sc, unit } from './build';
import { OPENSTAX_AP, OPENSTAX_CHEM, OPENSTAX_PHARM } from './sources';

const AVISO = 'Contenido educativo: no sirve para diagnosticar ni tratar a nadie.';

const liquidos = unit({
  id: 'w11-u1-liquidos',
  title: 'Ósmosis y electrolitos',
  objectives: [
    'Explicar la ósmosis y la tonicidad de las disoluciones.',
    'Calcular la osmolaridad aproximada de una disolución de NaCl.',
    'Reconocer los electrolitos principales de los líquidos intra y extracelular.',
  ],
  concepts: [
    { id: 'w11.osmosis', name: 'Ósmosis y tonicidad', prerequisites: ['w7.disoluciones'] },
    { id: 'w11.electrolitos', name: 'Electrolitos corporales', prerequisites: ['w2.isotopos'] },
  ],
  sources: [
    OPENSTAX_CHEM('11.4 Colligative Properties (osmosis and osmotic pressure)'),
    OPENSTAX_AP('26.1 Body Fluids and Fluid Compartments; 26.3 Electrolyte Balance'),
  ],
  intro: [
    'Por qué el suero es "fisiológico"',
    `Si se inyectara agua pura en una vena, los glóbulos rojos podrían hincharse y romperse. La química explica por qué se usa NaCl al 0,9 %. ${AVISO}`,
  ],
  simple: [
    'La idea sencilla',
    'Ósmosis: el agua atraviesa una membrana semipermeable desde donde hay menos partículas disueltas hacia donde hay más. Una disolución isotónica tiene la misma concentración de partículas que la célula, y el agua no entra ni sale en neto.',
  ],
  analogy: {
    text: 'Metáfora: el agua "se mueve para diluir" el lado más concentrado.',
    limits: 'El agua no tiene intención: el flujo neto se debe a diferencias de energía libre del agua a ambos lados de la membrana.',
  },
  everyday: [
    'En tu vida',
    'Al poner sal sobre una rodaja de pepino, el pepino suelta agua (medio hipertónico). Las frutas secas se hinchan en agua (medio hipotónico).',
  ],
  visual: [
    'Glóbulo rojo y tonicidad',
    'Hipotónico (menos partículas fuera): entra agua → la célula se hincha y puede romperse (hemólisis)\nIsotónico: sin flujo neto → forma normal\nHipertónico (más partículas fuera): sale agua → la célula se arruga (crenación)',
  ],
  formal: [
    'Definiciones',
    'Osmolaridad: moles de partículas disueltas por litro (osmol/L). Un soluto que se disocia aporta varias partículas: NaCl → Na⁺ + Cl⁻ (factor ideal i = 2); la glucosa no se disocia (i = 1).\nOsmolaridad ≈ i × M.\nLa osmolalidad del plasma ronda los 275–295 mOsm/kg.\nElectrolito: sustancia que en disolución forma iones y conduce la corriente.\nLíquido extracelular: catión principal Na⁺, anión principal Cl⁻ (y HCO₃⁻).\nLíquido intracelular: catión principal K⁺, aniones principales fosfatos y proteínas.',
  ],
  worked: [
    'Ejemplo resuelto: osmolaridad del suero al 0,9 %',
    '0,9 % m/v → 9 g de NaCl por litro.\nn = 9 g ÷ 58,44 g/mol = 0,154 mol/L.\nNaCl da 2 partículas → 2 × 0,154 = 0,308 osmol/L ≈ 308 mOsm/L (valor ideal; el real es algo menor porque la disociación no es perfecta).\nEs aproximadamente isotónico con el plasma.',
  ],
  guided: ['w11u1-q1', 'w11u1-q4'],
  independent: ['w11u1-q2', 'w11u1-q5'],
  quiz: ['w11u1-q3', 'w11u1-q6'],
  questions: [
    sc(
      {
        id: 'w11u1-q1', concept: 'w11.osmosis', kind: 'concept', diff: 2,
        prompt: 'Un glóbulo rojo se coloca en agua destilada. ¿Qué ocurre?',
        hints: ['El agua destilada no tiene solutos: es hipotónica respecto a la célula.'],
        explanation: 'Entra agua por ósmosis, la célula se hincha y puede romperse (hemólisis).',
      },
      [
        ['Entra agua y la célula se hincha'],
        ['Sale agua y la célula se arruga', 'Eso ocurre en un medio hipertónico.'],
        ['No pasa nada', 'Solo en un medio isotónico no hay flujo neto.'],
      ],
    ),
    num(
      {
        id: 'w11u1-q2', concept: 'w11.osmosis', kind: 'application', diff: 4,
        prompt: 'Calcula la osmolaridad ideal (mOsm/L) del suero fisiológico, NaCl 0,9 % m/v (M = 58,44 g/mol).',
        hints: ['9 g/L ÷ 58,44 g/mol = molaridad.', 'Multiplica por 2 partículas y por 1000 para pasar a mOsm/L.'],
        explanation: '9 ÷ 58,44 = 0,154 M; × 2 = 0,308 osmol/L = 308 mOsm/L.',
      },
      308, 'mOsm/L', 0.02,
    ),
    sc(
      {
        id: 'w11u1-q3', concept: 'w11.osmosis', kind: 'problem', diff: 3,
        prompt: '¿Qué disolución tiene MAYOR osmolaridad: glucosa 0,15 M o NaCl 0,15 M?',
        hints: ['¿Cuántas partículas da cada soluto al disolverse?'],
        explanation: 'NaCl 0,15 M (≈ 0,30 osmol/L), porque se disocia en 2 iones; la glucosa no se disocia (0,15 osmol/L).',
      },
      [
        ['NaCl 0,15 M'],
        ['Glucosa 0,15 M', 'La glucosa no se disocia: aporta una partícula por molécula.'],
        ['Las dos igual', 'Tienen igual molaridad, pero no igual número de partículas.'],
      ],
    ),
    match(
      {
        id: 'w11u1-q4', concept: 'w11.electrolitos', kind: 'concept', diff: 2,
        prompt: 'Empareja cada ion con dónde predomina o su papel principal.',
        hints: ['Na⁺ fuera, K⁺ dentro.'],
        explanation: 'Na⁺: catión principal extracelular. K⁺: catión principal intracelular. HCO₃⁻: amortiguador del pH sanguíneo. Ca²⁺: huesos, contracción muscular y coagulación.',
      },
      [
        ['Na⁺', 'Catión principal extracelular'],
        ['K⁺', 'Catión principal intracelular'],
        ['HCO₃⁻', 'Amortiguador del pH de la sangre'],
        ['Ca²⁺', 'Huesos, contracción muscular y coagulación'],
      ],
    ),
    sc(
      {
        id: 'w11u1-q5', concept: 'w11.electrolitos', kind: 'application', diff: 2,
        prompt: '¿Por qué una disolución de glucosa no es un electrolito y una de NaCl sí?',
        hints: ['¿Cuál forma iones en agua?'],
        explanation: 'El NaCl se disocia en Na⁺ y Cl⁻, que conducen la corriente. La glucosa se disuelve como moléculas sin carga.',
      },
      [
        ['El NaCl forma iones en agua y la glucosa no'],
        ['La glucosa no se disuelve en agua', 'La glucosa sí se disuelve; lo que no hace es formar iones.'],
        ['El NaCl es una molécula orgánica', 'El NaCl es un compuesto iónico inorgánico.'],
      ],
    ),
    sc(
      {
        id: 'w11u1-q6', concept: 'w11.electrolitos', kind: 'retention', diff: 3,
        prompt: 'La bomba de sodio-potasio mantiene…',
        hints: ['Saca 3 Na⁺ y mete 2 K⁺ usando ATP.'],
        explanation: 'Mucho Na⁺ fuera de la célula y mucho K⁺ dentro, gastando ATP (transporte activo).',
      },
      [
        ['Más Na⁺ fuera y más K⁺ dentro de la célula'],
        ['Más K⁺ fuera y más Na⁺ dentro', 'Es justo al revés.'],
        ['Iguales concentraciones dentro y fuera', 'Su función es mantener diferencias de concentración.'],
      ],
    ),
  ],
});

const sangreFarmacos = unit({
  id: 'w11-u2-sangre-farmacos',
  title: 'pH sanguíneo y farmacocinética básica',
  objectives: [
    'Explicar cómo el sistema bicarbonato amortigua el pH de la sangre.',
    'Describir las etapas ADME y calcular cantidades con la vida media.',
  ],
  concepts: [
    { id: 'w11.ph_sangre', name: 'pH sanguíneo y amortiguador bicarbonato', prerequisites: ['w7.buffers'] },
    { id: 'w11.farmacos', name: 'Farmacocinética básica', prerequisites: ['w8.cinetica'] },
  ],
  sources: [
    OPENSTAX_AP('26.4 Acid-Base Balance; 26.5 Disorders of Acid-Base Balance'),
    OPENSTAX_PHARM('2.2 Pharmacokinetics (absorption, distribution, metabolism, excretion)'),
  ],
  intro: [
    'La química dentro del cuerpo',
    `Respirar más rápido cambia el pH de tu sangre en minutos, y la vida media de un medicamento explica por qué algunos se toman cada 8 horas. ${AVISO}`,
  ],
  simple: [
    'La idea sencilla',
    'La sangre se mantiene cerca de pH 7,4 gracias a amortiguadores, sobre todo el par ácido carbónico/bicarbonato, conectado con el CO₂ que exhalas. Un fármaco se absorbe, se distribuye, se metaboliza (sobre todo en el hígado) y se excreta (sobre todo por el riñón).',
  ],
  analogy: {
    text: 'Metáfora: el pulmón y el riñón son dos "válvulas" del amortiguador: uno ajusta el CO₂ en minutos y el otro el bicarbonato en horas o días.',
    limits: 'Hay más amortiguadores (proteínas, hemoglobina, fosfatos) y la regulación real es mucho más compleja.',
  },
  everyday: [
    'En tu vida',
    'Respirar muy rápido por ansiedad (hiperventilar) elimina CO₂ y puede subir el pH de la sangre. Por eso a veces se siente hormigueo. Las indicaciones de cada medicamento las da siempre un profesional sanitario.',
  ],
  visual: [
    'El sistema bicarbonato',
    'CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻\nMás CO₂ → más H⁺ → baja el pH (acidemia)\nMenos CO₂ → menos H⁺ → sube el pH (alcalemia)',
  ],
  formal: [
    'Definiciones',
    'pH arterial normal: 7,35–7,45. Por debajo: acidemia; por encima: alcalemia (los procesos que las causan se llaman acidosis y alcalosis).\nCompensación respiratoria: cambiar la ventilación modifica el CO₂. Compensación renal: el riñón excreta H⁺ y reabsorbe o genera HCO₃⁻.\nFarmacocinética (lo que el cuerpo hace al fármaco): Absorción, Distribución, Metabolismo, Excreción (ADME).\nFarmacodinámica: lo que el fármaco hace al cuerpo (su efecto y mecanismo).\nVida media (t½): tiempo para que la concentración del fármaco baje a la mitad (cinética de primer orden). Tras n vidas medias queda (½)ⁿ.',
  ],
  worked: [
    'Ejemplo resuelto: vida media',
    'Un fármaco tiene t½ = 4 h y hay 100 mg en el cuerpo.\n12 h = 3 vidas medias.\n100 → 50 → 25 → 12,5 mg. Queda 100 × (½)³ = 12,5 mg.',
  ],
  guided: ['w11u2-q1', 'w11u2-q4'],
  independent: ['w11u2-q2', 'w11u2-q5'],
  quiz: ['w11u2-q3', 'w11u2-q6'],
  questions: [
    sc(
      {
        id: 'w11u2-q1', concept: 'w11.ph_sangre', kind: 'concept', diff: 2,
        prompt: 'Un pH arterial de 7,30 indica…',
        hints: ['El rango normal es 7,35–7,45.'],
        explanation: 'Acidemia: el pH está por debajo de 7,35 (aunque sigue siendo mayor que 7, la sangre está "más ácida de lo normal").',
      },
      [
        ['Acidemia (pH por debajo de lo normal)'],
        ['Alcalemia', 'La alcalemia es pH > 7,45.'],
        ['Normalidad, porque es mayor que 7', 'En sangre, el rango normal es 7,35–7,45, no "mayor que 7".'],
      ],
    ),
    sc(
      {
        id: 'w11u2-q2', concept: 'w11.ph_sangre', kind: 'application', diff: 3,
        prompt: 'Si una persona hiperventila (elimina mucho CO₂), ¿qué tiende a pasar con el pH sanguíneo?',
        hints: ['CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. Quita CO₂ y aplica Le Châtelier.'],
        explanation: 'Al bajar el CO₂, el equilibrio se desplaza a la izquierda, baja [H⁺] y sube el pH (alcalemia respiratoria).',
      },
      [
        ['Sube (se vuelve más alcalino)'],
        ['Baja (se vuelve más ácido)', 'Eso pasaría si se acumulara CO₂ (p. ej., hipoventilación).'],
        ['No cambia', 'El CO₂ está en equilibrio con el H⁺: al cambiar uno cambia el otro.'],
      ],
    ),
    num(
      {
        id: 'w11u2-q3', concept: 'w11.ph_sangre', kind: 'problem', diff: 4,
        prompt: 'Con pKa = 6,1 para el sistema bicarbonato y una relación [HCO₃⁻]/[H₂CO₃] = 20, calcula el pH (log 20 ≈ 1,30).',
        hints: ['pH = pKa + log([HCO₃⁻]/[H₂CO₃]).'],
        explanation: 'pH = 6,1 + log 20 = 6,1 + 1,30 = 7,40, el valor normal de la sangre.',
      },
      7.4, undefined, 0.005,
    ),
    order(
      {
        id: 'w11u2-q4', concept: 'w11.farmacos', kind: 'concept', diff: 2,
        prompt: 'Ordena las etapas de la farmacocinética (ADME).',
        hints: ['A-D-M-E.'],
        explanation: 'Absorción → Distribución → Metabolismo → Excreción.',
      },
      ['Absorción', 'Distribución', 'Metabolismo', 'Excreción'],
    ),
    num(
      {
        id: 'w11u2-q5', concept: 'w11.farmacos', kind: 'application', diff: 3,
        prompt: 'Un fármaco tiene t½ = 4 h. Si hay 100 mg en el cuerpo, ¿cuántos mg quedan a las 12 h (sin nuevas dosis)?',
        hints: ['12 h son 3 vidas medias.', '100 × (½)³.'],
        explanation: '100 → 50 → 25 → 12,5 mg.',
      },
      12.5, 'mg', 0.01,
    ),
    sc(
      {
        id: 'w11u2-q6', concept: 'w11.farmacos', kind: 'retention', diff: 2,
        prompt: '¿Qué órganos son los principales responsables del metabolismo y de la excreción de muchos fármacos, respectivamente?',
        hints: ['Uno es la "planta química" del cuerpo; el otro filtra la sangre y produce orina.'],
        explanation: 'El hígado (metabolismo) y los riñones (excreción).',
      },
      [
        ['Hígado y riñones'],
        ['Riñones e hígado', 'Es al revés: el hígado metaboliza y el riñón excreta.'],
        ['Pulmones y corazón', 'Los pulmones eliminan algunos gases, pero no son la vía principal de la mayoría de fármacos.'],
      ],
    ),
  ],
});

export const WORLD11_MODULES: Module[] = [
  { id: 'w11-mod1', title: 'La química del cuerpo', units: [liquidos, sangreFarmacos] },
];
