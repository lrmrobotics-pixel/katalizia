/**
 * Base de conocimiento local del tutor (modo sin IA).
 * Fuente de definiciones: OpenStax Chemistry 2e (https://openstax.org/details/books/chemistry-2e),
 * secciones indicadas en `source`. Las analogías llevan sus límites explícitos.
 */

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  title: string;
  simple: string;
  formal: string;
  analogy: { text: string; limits: string };
  /** Pregunta para que la estudiante piense antes de recibir más. */
  guidingQuestion: string;
  /** Estrategia alternativa (ejemplo concreto) para cuando falla varias veces. */
  example: string;
  source: string;
}

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'mol',
    keywords: ['mol', 'moles', 'avogadro', 'cantidad de sustancia'],
    title: 'El mol',
    simple:
      'Un mol es una forma de contar partículas muy pequeñas en paquetes enormes: 1 mol son 6.022 × 10²³ partículas, igual que una docena son 12 cosas.',
    formal:
      'El mol es la unidad SI de cantidad de sustancia. Un mol contiene exactamente 6.02214076 × 10²³ entidades elementales (constante de Avogadro, Nₐ). Los moles se calculan como n = m / M, donde m es la masa en gramos y M la masa molar en g/mol.',
    analogy: {
      text: 'Imagina que el mol es la "docena gigante" de los químicos: nadie cuenta granos de arroz uno por uno, los pesa.',
      limits: 'La docena es un número pequeño y arbitrario; el mol está definido con un valor exacto y sirve para cualquier entidad (átomos, moléculas, iones).',
    },
    guidingQuestion: 'Para calcular moles necesitamos dos datos. ¿Cuáles crees que son?',
    example:
      'Probemos con agua: 36 g de H₂O. La masa molar del agua es 2(1.008) + 16.00 ≈ 18.02 g/mol. Entonces n = 36 / 18.02 ≈ 2.0 mol. ¿Ves qué dividimos entre qué?',
    source: 'OpenStax Chemistry 2e §3.1',
  },
  {
    id: 'masa-molar',
    keywords: ['masa molar', 'peso molecular', 'g/mol'],
    title: 'Masa molar',
    simple: 'La masa molar es lo que pesa un mol de una sustancia. Se obtiene sumando las masas atómicas de todos sus átomos.',
    formal:
      'La masa molar (M) es la masa de un mol de una sustancia, en g/mol. Numéricamente coincide con la masa fórmula en unidades de masa atómica (u). Se calcula sumando las masas atómicas de los elementos multiplicadas por su subíndice.',
    analogy: {
      text: 'Es como calcular el precio de una canasta: sumas el precio de cada producto por cuántas unidades llevas.',
      limits: 'Las masas atómicas son promedios ponderados de isótopos, no precios fijos elegidos por alguien.',
    },
    guidingQuestion: 'Si una molécula tiene 2 átomos de hidrógeno y 1 de oxígeno, ¿qué operación harías con sus masas atómicas?',
    example: 'CO₂: 1 carbono (12.01) + 2 oxígenos (2 × 16.00 = 32.00) = 44.01 g/mol.',
    source: 'OpenStax Chemistry 2e §3.1',
  },
  {
    id: 'molaridad',
    keywords: ['molaridad', 'concentracion molar', 'mol/l'],
    title: 'Molaridad',
    simple: 'La molaridad dice cuántos moles de soluto hay en cada litro de disolución.',
    formal: 'La molaridad (M) es la concentración expresada como moles de soluto por litro de disolución: M = n_soluto / V_disolución (L).',
    analogy: {
      text: 'Es como cuánta azúcar hay por cada litro de limonada: más azúcar en el mismo volumen, más concentrada.',
      limits: 'Se cuenta en moles, no en gramos, y el volumen es el de la disolución final, no el del agua añadida.',
    },
    guidingQuestion: 'Si tienes 0.5 mol de NaCl en 2 L de disolución, ¿qué harías para saber los moles por litro?',
    example: '1 mol de glucosa disuelto hasta tener 0.5 L: M = 1 / 0.5 = 2 mol/L.',
    source: 'OpenStax Chemistry 2e §3.3',
  },
  {
    id: 'densidad',
    keywords: ['densidad'],
    title: 'Densidad',
    simple: 'La densidad indica cuánta masa cabe en un volumen. Algo muy denso tiene mucha masa en poco espacio.',
    formal: 'La densidad (ρ) es la razón entre masa y volumen: ρ = m / V. En el SI se expresa en kg/m³; en química es habitual g/mL o g/cm³.',
    analogy: {
      text: 'Una mochila llena de libros y otra del mismo tamaño llena de almohadas: misma capacidad, distinta masa.',
      limits: 'La densidad es una propiedad intensiva de la sustancia y depende de la temperatura; la mochila es solo una imagen.',
    },
    guidingQuestion: 'Si duplicas la cantidad de agua, ¿crees que cambia su densidad? ¿Por qué?',
    example: '10 mL de un metal que pesan 79 g: ρ = 79 / 10 = 7.9 g/mL (valor cercano al del hierro).',
    source: 'OpenStax Chemistry 2e §1.4',
  },
  {
    id: 'ph',
    keywords: ['ph', 'acido', 'base', 'acidez', 'basico'],
    title: 'pH',
    simple: 'El pH mide qué tan ácida o básica es una disolución acuosa. A 25 °C, menos de 7 es ácida, 7 es neutra y más de 7 es básica.',
    formal: 'pH = −log[H₃O⁺]. Por ser logarítmico, una unidad de pH equivale a un factor 10 en la concentración de iones hidronio. A 25 °C, pH + pOH = 14.',
    analogy: {
      text: 'La escala de pH es como el volumen de un altavoz con pasos ×10: bajar 1 unidad multiplica por diez la "acidez".',
      limits: 'El pH no mide fuerza de un ácido, sino la concentración de H₃O⁺ en esa disolución concreta.',
    },
    guidingQuestion: 'Si una disolución pasa de pH 4 a pH 3, ¿cuántas veces aumentó la concentración de H₃O⁺?',
    example: 'HCl 0.01 M es un ácido fuerte: [H₃O⁺] = 0.01 = 10⁻² M, así que pH = 2.',
    source: 'OpenStax Chemistry 2e §14.2',
  },
  {
    id: 'configuracion',
    keywords: ['configuracion electronica', 'orbitales', 'aufbau', 'electrones'],
    title: 'Configuración electrónica',
    simple: 'La configuración electrónica es la "dirección" de cada electrón: en qué nivel y subnivel está.',
    formal:
      'Describe la distribución de electrones en orbitales atómicos. En el estado fundamental se llenan según el principio de Aufbau (orden 1s, 2s, 2p, 3s, 3p, 4s, 3d…), el principio de exclusión de Pauli y la regla de Hund. Hay excepciones, como Cr y Cu.',
    analogy: {
      text: 'Es como un edificio donde los inquilinos ocupan primero los pisos más baratos (de menor energía).',
      limits: 'Los electrones no son bolitas en pisos: un orbital describe una región de probabilidad, no una órbita fija.',
    },
    guidingQuestion: 'El sodio tiene 11 electrones. Si 1s admite 2, 2s admite 2 y 2p admite 6, ¿dónde queda el electrón número 11?',
    example: 'Oxígeno (8 e⁻): 1s² 2s² 2p⁴. Sumamos 2 + 2 + 4 = 8.',
    source: 'OpenStax Chemistry 2e §6.4',
  },
  {
    id: 'balanceo',
    keywords: ['balancear', 'balanceo', 'ecuacion', 'conservacion de la masa'],
    title: 'Balanceo de ecuaciones',
    simple: 'Balancear es asegurarse de que hay los mismos átomos de cada elemento antes y después de la reacción.',
    formal:
      'Por la ley de conservación de la masa, en una reacción química los átomos no se crean ni se destruyen. Se ajustan los coeficientes estequiométricos (nunca los subíndices) para que cada elemento tenga el mismo número de átomos en reactivos y productos.',
    analogy: {
      text: 'Es como una receta con piezas de construcción: puedes reorganizar las piezas, pero no aparecen ni desaparecen.',
      limits: 'En química además se conserva la carga, y los coeficientes representan proporciones en moles.',
    },
    guidingQuestion: 'En H₂ + O₂ → H₂O, ¿cuántos oxígenos hay a la izquierda y cuántos a la derecha?',
    example: 'H₂ + O₂ → H₂O: a la izquierda hay 2 O y a la derecha 1. Poniendo 2 delante del agua (2H₂O) quedan 2 O, pero ahora hay 4 H; entonces 2H₂. Resultado: 2H₂ + O₂ → 2H₂O.',
    source: 'OpenStax Chemistry 2e §4.1',
  },
  {
    id: 'enlace-agua',
    keywords: ['agua', 'h2o', 'enlace covalente', 'compartir electrones'],
    title: 'El agua y el enlace covalente',
    simple: 'En el agua, un oxígeno comparte electrones con dos hidrógenos. Eso es un enlace covalente.',
    formal:
      'La molécula de H₂O tiene dos enlaces covalentes polares O–H. El oxígeno, más electronegativo, atrae con más fuerza los electrones compartidos, generando cargas parciales (δ− en O, δ+ en H). Su geometría es angular (~104.5°) por los dos pares de electrones no enlazantes del oxígeno.',
    analogy: {
      text: 'Chisme científico: el oxígeno conoció a dos hidrógenos en el laboratorio y decidieron compartir electrones. ¡Formaron una relación química estable llamada agua!',
      limits: 'Es una metáfora: los átomos no deciden nada. Se enlazan porque el sistema enlazado tiene menor energía.',
    },
    guidingQuestion: '¿Por qué crees que la fórmula es H₂O y no HO? Pista: piensa cuántos electrones le faltan al oxígeno para completar su octeto.',
    example: 'El oxígeno tiene 6 electrones de valencia y necesita 2 más para el octeto; cada hidrógeno aporta 1 al compartir. Por eso se une a dos hidrógenos.',
    source: 'OpenStax Chemistry 2e §7.1, §7.6',
  },
];

const strip = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Devuelve la entrada con más coincidencias de palabras clave (o null). */
export function findEntry(text: string): KnowledgeEntry | null {
  const t = strip(text);
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;
  for (const e of KNOWLEDGE) {
    const score = e.keywords.reduce((s, k) => {
      const re = new RegExp(`(^|[^a-z0-9])${strip(k).replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}($|[^a-z0-9])`);
      return s + (re.test(t) ? k.length : 0);
    }, 0);
    if (score > bestScore) {
      best = e;
      bestScore = score;
    }
  }
  return best;
}
