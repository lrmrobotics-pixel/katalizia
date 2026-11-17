/** Mundo 4 — Enlaces y estructuras. Fuente principal: OpenStax Chemistry 2e, cap. 7, 8 y 10.1. */
import type { Module } from '@/core/learning/types';

import { match, mc, num, sc, unit } from './build';
import { OPENSTAX_CHEM } from './sources';

const tipos = unit({
  id: 'w4-u1-enlaces',
  title: 'Tipos de enlace y estructuras de Lewis',
  objectives: [
    'Distinguir enlace iónico, covalente (polar y apolar) y metálico.',
    'Contar electrones de valencia y dibujar estructuras de Lewis sencillas.',
  ],
  concepts: [
    { id: 'w4.tipos', name: 'Tipos de enlace', prerequisites: ['w3.en_ie'] },
    { id: 'w4.lewis', name: 'Estructuras de Lewis y octeto', prerequisites: ['w3.valencia'] },
  ],
  sources: [OPENSTAX_CHEM('7.1 Ionic Bonding; 7.2 Covalent Bonding; 7.3 Lewis Symbols and Structures')],
  intro: [
    '¿Por qué se unen los átomos?',
    'Casi ningún átomo vive solo. Al unirse, los átomos alcanzan una situación de menor energía, más estable. La forma en que comparten o ceden electrones decide si obtienes sal, agua o un cable de cobre.',
  ],
  simple: [
    'La idea sencilla',
    'Si un átomo cede electrones y otro los toma, se forman iones que se atraen: enlace iónico. Si los comparten, enlace covalente. En los metales, los electrones externos se mueven libremente entre muchos átomos: enlace metálico.',
  ],
  analogy: {
    text: 'Metáfora: el enlace covalente polar es una cuerda tirada por dos personas de distinta fuerza; la cuerda (los electrones) se desplaza hacia la más fuerte (más electronegativa).',
    limits: 'Los electrones no "se mueven hacia un lado" como un objeto: lo que cambia es la probabilidad de encontrarlos cerca de cada núcleo.',
  },
  everyday: [
    'En tu vida',
    'La sal de mesa (NaCl) es iónica: dura, con punto de fusión alto, y conduce electricidad disuelta. El azúcar es covalente: se disuelve pero no conduce. El cobre de los cables es metálico: conduce gracias a sus electrones móviles.',
  ],
  visual: [
    'Diferencia de electronegatividad (ΔEN)',
    'ΔEN ≈ 0 → covalente apolar (H–H, Cl–Cl)\nΔEN pequeña o media → covalente polar (H–Cl, O–H)\nΔEN grande (aprox. > 1,8) → mayormente iónico (Na–Cl, ΔEN = 2,23)\nOjo: el límite es una regla práctica, no una frontera exacta.',
    'bond-polarity',
  ],
  formal: [
    'Definiciones',
    'Enlace iónico: atracción electrostática entre cationes y aniones.\nEnlace covalente: par de electrones compartido entre dos átomos. Simple (1 par), doble (2) o triple (3).\nEnlace covalente polar: electrones compartidos de forma desigual, con cargas parciales δ+ y δ−.\nEnlace metálico: red de cationes rodeada de electrones deslocalizados.\nRegla del octeto: muchos átomos de los grupos principales tienden a rodearse de 8 electrones de valencia (H, 2). Excepciones: B (6 e⁻ en BF₃), elementos del período 3 en adelante pueden superar 8 (SF₆), y moléculas con número impar de electrones (NO).',
  ],
  worked: [
    'Ejemplo resuelto: Lewis del agua (H₂O)',
    '1) Electrones de valencia: O = 6, H = 1 × 2 → total 8.\n2) Átomo central: O. Une cada H con un enlace simple (usa 4 e⁻).\n3) Los 4 e⁻ restantes van al O como 2 pares solitarios.\n4) Comprueba: O tiene 8 e⁻ alrededor (octeto), cada H tiene 2.',
  ],
  guided: ['w4u1-q1', 'w4u1-q4'],
  independent: ['w4u1-q2', 'w4u1-q5'],
  quiz: ['w4u1-q3', 'w4u1-q6'],
  questions: [
    match(
      {
        id: 'w4u1-q1', concept: 'w4.tipos', kind: 'concept', diff: 1,
        prompt: 'Empareja cada sustancia con su tipo de enlace principal.',
        hints: ['Metal + no metal suele ser iónico; no metal + no metal, covalente; metal puro, metálico.'],
        explanation: 'NaCl: iónico (metal + no metal). H₂O: covalente polar. Cl₂: covalente apolar (átomos iguales). Cu: metálico.',
      },
      [
        ['NaCl', 'Iónico'],
        ['H₂O', 'Covalente polar'],
        ['Cl₂', 'Covalente apolar'],
        ['Cu', 'Metálico'],
      ],
    ),
    sc(
      {
        id: 'w4u1-q2', concept: 'w4.tipos', kind: 'application', diff: 2,
        prompt: 'Electronegatividades: K 0,82 y Br 2,96. El enlace en KBr es principalmente…',
        hints: ['Calcula ΔEN = 2,96 − 0,82.'],
        explanation: 'ΔEN = 2,14, grande: el enlace es principalmente iónico (K⁺ y Br⁻).',
      },
      [
        ['Iónico'],
        ['Covalente apolar', 'Eso requiere ΔEN ≈ 0.'],
        ['Metálico', 'El enlace metálico ocurre entre átomos de metales; el Br es un no metal.'],
      ],
    ),
    mc(
      {
        id: 'w4u1-q3', concept: 'w4.tipos', kind: 'problem', diff: 3,
        prompt: 'Un sólido funde a 801 °C, no conduce en estado sólido pero sí disuelto en agua. Selecciona lo que es coherente.',
        hints: ['¿Qué tipo de sustancia tiene iones fijos en el sólido y libres en disolución?'],
        explanation: 'Es un compuesto iónico (de hecho, 801 °C es el punto de fusión del NaCl): iones fijos en la red no conducen; disueltos, sí.',
      },
      [
        ['Es un compuesto iónico'],
        ['En disolución hay iones que se mueven'],
        ['Es un metal', 'Los metales conducen también en estado sólido.'],
        ['Es covalente molecular', 'Los sólidos moleculares suelen fundir a temperatura baja y no conducen disueltos.'],
      ],
    ),
    num(
      {
        id: 'w4u1-q4', concept: 'w4.lewis', kind: 'concept', diff: 2,
        prompt: '¿Cuántos electrones de valencia en total tiene la molécula de CO₂?',
        hints: ['C aporta 4; cada O aporta 6.'],
        explanation: '4 + 6 + 6 = 16 electrones de valencia.',
      },
      16, 'electrones', 0,
    ),
    sc(
      {
        id: 'w4u1-q5', concept: 'w4.lewis', kind: 'application', diff: 3,
        prompt: 'En la estructura de Lewis del CO₂ (O=C=O), ¿cuántos pares solitarios tiene cada oxígeno?',
        hints: ['Cada O participa en un doble enlace (4 e⁻). ¿Cuántos le faltan para el octeto?'],
        explanation: 'Cada O tiene 4 e⁻ en el doble enlace + 2 pares solitarios (4 e⁻) = 8. En total: 4 pares enlazantes + 4 solitarios = 16 e⁻.',
      },
      [
        ['2'],
        ['3', 'Con 3 pares solitarios y un doble enlace, el O tendría 10 e⁻: supera el octeto.'],
        ['0', 'Entonces el O solo tendría 4 e⁻ alrededor.'],
      ],
    ),
    sc(
      {
        id: 'w4u1-q6', concept: 'w4.lewis', kind: 'retention', diff: 3,
        prompt: '¿Cuál de estas moléculas es una excepción a la regla del octeto?',
        hints: ['El boro tiene solo 3 electrones de valencia.'],
        explanation: 'En BF₃ el boro queda con 6 electrones a su alrededor: octeto incompleto.',
      },
      [
        ['BF₃'],
        ['CH₄', 'C tiene 8 e⁻ (4 enlaces): cumple el octeto.'],
        ['NH₃', 'N tiene 3 enlaces y 1 par solitario: 8 e⁻.'],
        ['H₂O', 'O tiene 2 enlaces y 2 pares solitarios: 8 e⁻.'],
      ],
    ),
  ],
});

const forma = unit({
  id: 'w4-u2-forma',
  title: 'Geometría molecular y fuerzas intermoleculares',
  objectives: [
    'Predecir la geometría de moléculas sencillas con VSEPR.',
    'Decidir si una molécula es polar.',
    'Relacionar fuerzas intermoleculares con puntos de ebullición.',
  ],
  concepts: [
    { id: 'w4.vsepr', name: 'Geometría (VSEPR) y polaridad molecular', prerequisites: ['w4.lewis'] },
    { id: 'w4.intermol', name: 'Fuerzas intermoleculares', prerequisites: ['w4.tipos'] },
  ],
  sources: [OPENSTAX_CHEM('7.6 Molecular Structure and Polarity; 10.1 Intermolecular Forces')],
  intro: [
    'La forma importa',
    'El CO₂ y el H₂O tienen enlaces polares, pero uno es un gas que no se mezcla bien con el agua y el otro es el disolvente de la vida. La diferencia está en su forma.',
  ],
  simple: [
    'La idea sencilla',
    'Los pares de electrones alrededor de un átomo central se repelen y se colocan lo más lejos posible. Eso fija la forma de la molécula. Si la forma es simétrica, las polaridades de los enlaces se anulan.',
  ],
  analogy: {
    text: 'Metáfora: globos atados por el nudo. Dos globos se ponen en línea, tres en triángulo, cuatro en tetraedro.',
    limits: 'Los pares solitarios "empujan" más que los enlazantes y cierran los ángulos (H₂O: 104,5° y no 109,5°); los globos no muestran eso.',
  },
  everyday: [
    'En tu vida',
    'El hielo flota porque los puentes de hidrógeno ordenan las moléculas de agua en una red con huecos, menos densa que el agua líquida. Los puentes de hidrógeno también mantienen unidas las dos hebras del ADN.',
  ],
  visual: [
    'Geometrías básicas',
    '2 pares (CO₂): lineal, 180°\n3 pares (BF₃): trigonal plana, 120°\n4 pares sin solitarios (CH₄): tetraédrica, 109,5°\n4 pares, 1 solitario (NH₃): piramidal, ≈107°\n4 pares, 2 solitarios (H₂O): angular, ≈104,5°',
  ],
  formal: [
    'Definiciones',
    'VSEPR: la geometría minimiza la repulsión entre pares de electrones del átomo central.\nMolécula polar: tiene un momento dipolar neto (enlaces polares en una geometría no simétrica).\nFuerzas intermoleculares (de más débil a más fuerte, en general): dispersión de London (todas las moléculas) < dipolo-dipolo < puente de hidrógeno.\nPuente de hidrógeno: atracción entre un H unido a N, O o F y un par solitario de N, O o F de otra molécula.\nA mayores fuerzas intermoleculares, mayor punto de ebullición.',
  ],
  worked: [
    'Ejemplo resuelto: H₂O (100 °C) frente a H₂S (−60 °C)',
    'Las dos moléculas son angulares y de tamaño parecido.\nEl O es muy electronegativo: el agua forma puentes de hidrógeno. El S no.\nRomper los puentes de hidrógeno exige más energía → el agua hierve a una temperatura mucho mayor.',
  ],
  guided: ['w4u2-q1', 'w4u2-q4'],
  independent: ['w4u2-q2', 'w4u2-q5'],
  quiz: ['w4u2-q3', 'w4u2-q6'],
  questions: [
    match(
      {
        id: 'w4u2-q1', concept: 'w4.vsepr', kind: 'concept', diff: 2,
        prompt: 'Empareja cada molécula con su geometría.',
        hints: ['Cuenta pares enlazantes y solitarios del átomo central.'],
        explanation: 'CO₂ lineal; CH₄ tetraédrica; NH₃ piramidal (1 par solitario); H₂O angular (2 pares solitarios).',
      },
      [
        ['CO₂', 'Lineal'],
        ['CH₄', 'Tetraédrica'],
        ['NH₃', 'Piramidal trigonal'],
        ['H₂O', 'Angular'],
      ],
    ),
    sc(
      {
        id: 'w4u2-q2', concept: 'w4.vsepr', kind: 'application', diff: 3,
        prompt: 'El CO₂ tiene dos enlaces C=O polares. ¿La molécula es polar?',
        hints: ['Dibuja la forma: ¿los dos dipolos apuntan en direcciones opuestas?'],
        explanation: 'No. Es lineal y simétrica: los dos dipolos son iguales y opuestos y se anulan.',
      },
      [
        ['No, porque es lineal y los dipolos se anulan'],
        ['Sí, porque sus enlaces son polares', 'Enlaces polares no bastan: la geometría puede anular los dipolos.'],
        ['Sí, porque el oxígeno es más electronegativo', 'Es cierto para cada enlace, pero la simetría anula el efecto neto.'],
      ],
    ),
    sc(
      {
        id: 'w4u2-q3', concept: 'w4.vsepr', kind: 'problem', diff: 3,
        prompt: '¿Por qué el ángulo H–O–H del agua (≈104,5°) es menor que el de un tetraedro perfecto (109,5°)?',
        hints: ['El O tiene dos pares solitarios.'],
        explanation: 'Los pares solitarios ocupan más espacio y repelen más que los enlazantes, así que cierran el ángulo entre los enlaces O–H.',
      },
      [
        ['Los pares solitarios repelen más que los pares enlazantes'],
        ['Los hidrógenos se atraen entre sí', 'Los H tienen carga parcial δ+: se repelen, no se atraen.'],
        ['El agua es lineal', 'El agua es angular.'],
      ],
    ),
    mc(
      {
        id: 'w4u2-q4', concept: 'w4.intermol', kind: 'concept', diff: 2,
        prompt: '¿Qué sustancias pueden formar puentes de hidrógeno entre sus moléculas?',
        hints: ['Busca H unido directamente a N, O o F.'],
        explanation: 'H₂O, NH₃ y CH₃OH tienen H unido a O o N. En CH₄ el H está unido a C, y el H₂S no tiene N, O ni F.',
      },
      [
        ['H₂O'],
        ['NH₃'],
        ['CH₃OH (metanol)'],
        ['CH₄', 'El H está unido a C, que no es lo bastante electronegativo.'],
        ['H₂S', 'El S no es N, O ni F.'],
      ],
    ),
    sc(
      {
        id: 'w4u2-q5', concept: 'w4.intermol', kind: 'application', diff: 2,
        prompt: '¿Qué fuerza intermolecular actúa entre TODAS las moléculas, incluidas las apolares?',
        hints: ['Es la que explica que el nitrógeno pueda licuarse.'],
        explanation: 'Las fuerzas de dispersión de London, debidas a dipolos instantáneos, están en todas las moléculas.',
      },
      [
        ['Dispersión de London'],
        ['Puente de hidrógeno', 'Requiere H unido a N, O o F.'],
        ['Dipolo-dipolo', 'Solo entre moléculas polares.'],
        ['Enlace iónico', 'Es un enlace entre iones, no una fuerza intermolecular.'],
      ],
    ),
    sc(
      {
        id: 'w4u2-q6', concept: 'w4.intermol', kind: 'problem', diff: 3,
        prompt: 'El etanol (CH₃CH₂OH) hierve a 78 °C y el éter dimetílico (CH₃OCH₃), con la misma fórmula C₂H₆O, a −24 °C. ¿Por qué?',
        hints: ['¿Cuál de los dos tiene un H unido a O?'],
        explanation: 'El etanol tiene un grupo O–H y forma puentes de hidrógeno; el éter no tiene H unido a O. Más fuerzas intermoleculares → mayor punto de ebullición.',
      },
      [
        ['El etanol forma puentes de hidrógeno y el éter no'],
        ['El etanol tiene más masa', 'Tienen la misma fórmula y la misma masa molar.'],
        ['El éter es iónico', 'Ambos son covalentes moleculares.'],
      ],
    ),
  ],
});

export const WORLD4_MODULES: Module[] = [{ id: 'w4-mod1', title: 'Cómo se unen los átomos', units: [tipos, forma] }];
