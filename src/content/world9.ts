/** Mundo 9 — Química orgánica. Fuente principal: OpenStax Chemistry 2e, cap. 20; OpenStax Organic Chemistry. */
import type { Module } from '@/core/learning/types';

import { match, mc, num, sc, unit } from './build';
import { OPENSTAX_CHEM, OPENSTAX_ORG } from './sources';

const hidrocarburos = unit({
  id: 'w9-u1-hidrocarburos',
  title: 'El carbono y los hidrocarburos',
  objectives: [
    'Explicar por qué el carbono forma tantos compuestos.',
    'Distinguir alcanos, alquenos y alquinos y sus fórmulas generales.',
    'Nombrar hidrocarburos sencillos (1 a 6 carbonos).',
  ],
  concepts: [
    { id: 'w9.carbono', name: 'El carbono y los hidrocarburos', prerequisites: ['w4.vsepr'] },
    { id: 'w9.nomenclatura', name: 'Nomenclatura básica', prerequisites: ['w4.vsepr'] },
  ],
  sources: [OPENSTAX_CHEM('20.1 Hydrocarbons'), OPENSTAX_ORG('3.4 Naming Alkanes')],
  intro: [
    'Un átomo, millones de moléculas',
    'Se conocen decenas de millones de compuestos de carbono: desde el gas de la cocina hasta tu ADN. Todo empieza con un átomo que forma cuatro enlaces.',
  ],
  simple: [
    'La idea sencilla',
    'El carbono tiene 4 electrones de valencia y forma 4 enlaces. Puede unirse a otros carbonos formando cadenas y anillos. Los hidrocarburos solo tienen C e H: alcanos (solo enlaces simples), alquenos (un doble enlace C=C) y alquinos (un triple C≡C).',
  ],
  analogy: {
    text: 'Metáfora: el carbono es una pieza de construcción con 4 conectores; puedes encadenar piezas casi sin límite.',
    limits: 'Los enlaces tienen ángulos y longitudes concretos (109,5° en alcanos); no se doblan a voluntad como un juguete.',
  },
  everyday: [
    'En tu vida',
    'El gas natural es sobre todo metano (CH₄); el gas de los encendedores, butano (C₄H₁₀). El etileno (eteno, C₂H₄) es la hormona vegetal que hace madurar la fruta.',
  ],
  visual: [
    'Prefijos según el número de carbonos',
    '1 met- · 2 et- · 3 prop- · 4 but- · 5 pent- · 6 hex-\nTerminación: -ano (simple), -eno (doble), -ino (triple).\nAlcanos: CₙH₂ₙ₊₂ · Alquenos (1 doble enlace): CₙH₂ₙ · Alquinos (1 triple): CₙH₂ₙ₋₂',
  ],
  formal: [
    'Definiciones',
    'Hidrocarburo saturado (alcano): solo enlaces simples C–C; cada C con geometría tetraédrica.\nInsaturado: con enlaces dobles (alquenos, C=C, trigonal plano) o triples (alquinos, C≡C, lineal).\nNombre IUPAC de un alcano ramificado: cadena principal más larga + sustituyentes con el número del carbono donde están, numerando para dar los localizadores más bajos (p. ej., 2-metilpropano).',
  ],
  worked: [
    'Ejemplo resuelto: fórmula del pentano',
    'Pent- → 5 carbonos. Alcano → CₙH₂ₙ₊₂.\nH = 2 × 5 + 2 = 12 → C₅H₁₂.\nSi tuviera un doble enlace sería penteno: C₅H₁₀.',
  ],
  guided: ['w9u1-q1', 'w9u1-q4'],
  independent: ['w9u1-q2', 'w9u1-q5'],
  quiz: ['w9u1-q3', 'w9u1-q6'],
  questions: [
    sc(
      {
        id: 'w9u1-q1', concept: 'w9.carbono', kind: 'concept', diff: 1,
        prompt: '¿Cuántos enlaces covalentes forma normalmente el carbono?',
        hints: ['Tiene 4 electrones de valencia y busca el octeto.'],
        explanation: 'Cuatro: comparte sus 4 electrones de valencia para completar 8.',
      },
      [
        ['4'],
        ['2', 'Eso es típico del oxígeno.'],
        ['6', 'Superaría el octeto; el carbono no lo hace.'],
      ],
    ),
    num(
      {
        id: 'w9u1-q2', concept: 'w9.carbono', kind: 'application', diff: 2,
        prompt: '¿Cuántos átomos de H tiene el hexano (alcano de 6 carbonos)?',
        hints: ['CₙH₂ₙ₊₂.'],
        explanation: '2 × 6 + 2 = 14 → C₆H₁₄.',
      },
      14, 'átomos de H', 0,
    ),
    sc(
      {
        id: 'w9u1-q3', concept: 'w9.carbono', kind: 'problem', diff: 3,
        prompt: 'Un hidrocarburo tiene fórmula C₄H₈ y es de cadena abierta. ¿Qué es?',
        hints: ['Compara con CₙH₂ₙ₊₂ (alcano), CₙH₂ₙ (alqueno) y CₙH₂ₙ₋₂ (alquino).'],
        explanation: 'C₄H₈ cumple CₙH₂ₙ: es un alqueno (buteno), con un doble enlace.',
      },
      [
        ['Un alqueno'],
        ['Un alcano', 'El butano sería C₄H₁₀.'],
        ['Un alquino', 'El butino sería C₄H₆.'],
      ],
    ),
    match(
      {
        id: 'w9u1-q4', concept: 'w9.nomenclatura', kind: 'concept', diff: 1,
        prompt: 'Empareja cada nombre con su fórmula.',
        hints: ['met = 1, et = 2, prop = 3, but = 4.'],
        explanation: 'Metano CH₄; etano C₂H₆; propano C₃H₈; butano C₄H₁₀ (todos alcanos, CₙH₂ₙ₊₂).',
      },
      [
        ['Metano', 'CH₄'],
        ['Etano', 'C₂H₆'],
        ['Propano', 'C₃H₈'],
        ['Butano', 'C₄H₁₀'],
      ],
    ),
    sc(
      {
        id: 'w9u1-q5', concept: 'w9.nomenclatura', kind: 'application', diff: 2,
        prompt: '¿Cómo se llama CH≡CH?',
        hints: ['2 carbonos y un triple enlace.'],
        explanation: 'Etino (acetileno): et- (2 C) + -ino (triple enlace).',
      },
      [
        ['Etino'],
        ['Eteno', 'Eteno tiene un doble enlace: CH₂=CH₂.'],
        ['Etano', 'Etano solo tiene enlaces simples: CH₃–CH₃.'],
      ],
    ),
    sc(
      {
        id: 'w9u1-q6', concept: 'w9.nomenclatura', kind: 'retention', diff: 3,
        prompt: '¿Cuál es el nombre IUPAC de CH₃–CH(CH₃)–CH₃ (isobutano)?',
        hints: ['La cadena más larga tiene 3 carbonos y hay un metilo en el carbono central.'],
        explanation: '2-metilpropano: cadena principal de 3 C (propano) con un metilo en el C2.',
      },
      [
        ['2-metilpropano'],
        ['Butano', 'Butano es la cadena lineal de 4 C; aquí la cadena más larga tiene 3.'],
        ['1-metilpropano', 'Un metilo en el C1 alargaría la cadena: sería butano.'],
      ],
    ),
  ],
});

const grupos = unit({
  id: 'w9-u2-grupos',
  title: 'Grupos funcionales e isomería',
  objectives: [
    'Reconocer los grupos funcionales principales.',
    'Distinguir isómeros estructurales.',
  ],
  concepts: [
    { id: 'w9.grupos', name: 'Grupos funcionales', prerequisites: ['w9.carbono'] },
    { id: 'w9.isomeria', name: 'Isomería', prerequisites: ['w9.carbono'] },
  ],
  sources: [OPENSTAX_CHEM('20.2 Alcohols and Ethers; 20.3 Aldehydes, Ketones, Carboxylic Acids, and Esters; 20.4 Amines and Amides')],
  intro: [
    'La parte que reacciona',
    'El etanol se bebe, el metanol ciega y el ácido acético es vinagre. Lo que cambia su comportamiento es un pequeño grupo de átomos: el grupo funcional.',
  ],
  simple: [
    'La idea sencilla',
    'Un grupo funcional es un conjunto de átomos que da a la molécula sus propiedades químicas. Moléculas con el mismo grupo se comportan de forma parecida. Los isómeros tienen la misma fórmula molecular pero distinta estructura.',
  ],
  analogy: {
    text: 'Metáfora: el esqueleto de carbono es el mango de una herramienta y el grupo funcional, la punta (destornillador, martillo…).',
    limits: 'La cadena de carbono también influye (tamaño, solubilidad, forma); no es un mango "neutral".',
  },
  everyday: [
    'En tu vida',
    'Los aminoácidos tienen un grupo amino y un grupo carboxilo. Las grasas son ésteres. La acetona del quitaesmalte es una cetona.',
  ],
  visual: [
    'Grupos funcionales clave',
    'Alcohol R–OH · Éter R–O–R′ · Aldehído R–CHO · Cetona R–CO–R′ · Ácido carboxílico R–COOH · Éster R–COO–R′ · Amina R–NH₂ · Amida R–CONH₂',
  ],
  formal: [
    'Definiciones',
    'Grupo funcional: átomo o grupo de átomos que determina la reactividad característica de una familia de compuestos.\nIsómeros: compuestos con la misma fórmula molecular y distinta estructura.\nIsómeros estructurales (constitucionales): átomos conectados en distinto orden (butano y 2-metilpropano).\nEstereoisómeros: misma conectividad, distinta disposición en el espacio (cis/trans; enantiómeros, imágenes especulares no superponibles).',
  ],
  worked: [
    'Ejemplo resuelto: ¿qué grupo tiene el ácido acético?',
    'CH₃COOH → contiene –COOH (carbonilo C=O y –OH en el mismo carbono).\nEs un ácido carboxílico. Cede el H del –OH: CH₃COO⁻ + H⁺.\nNo es un alcohol: en el alcohol el –OH está en un carbono sin C=O.',
  ],
  guided: ['w9u2-q1', 'w9u2-q4'],
  independent: ['w9u2-q2', 'w9u2-q5'],
  quiz: ['w9u2-q3', 'w9u2-q6'],
  questions: [
    match(
      {
        id: 'w9u2-q1', concept: 'w9.grupos', kind: 'concept', diff: 2,
        prompt: 'Empareja cada molécula con su grupo funcional.',
        hints: ['Busca –OH, C=O entre dos carbonos, –COOH y –NH₂.'],
        explanation: 'CH₃CH₂OH: alcohol. CH₃COCH₃: cetona (acetona). CH₃COOH: ácido carboxílico. CH₃NH₂: amina.',
      },
      [
        ['CH₃CH₂OH', 'Alcohol'],
        ['CH₃COCH₃', 'Cetona'],
        ['CH₃COOH', 'Ácido carboxílico'],
        ['CH₃NH₂', 'Amina'],
      ],
    ),
    sc(
      {
        id: 'w9u2-q2', concept: 'w9.grupos', kind: 'application', diff: 3,
        prompt: 'Al reaccionar un ácido carboxílico con un alcohol (con pérdida de agua) se forma un…',
        hints: ['Es el grupo de los aromas de frutas y de las grasas.'],
        explanation: 'Un éster (R–COO–R′). Esta reacción se llama esterificación.',
      },
      [
        ['Éster'],
        ['Éter', 'Un éter es R–O–R′, sin C=O.'],
        ['Aldehído', 'El aldehído tiene –CHO; no se forma así.'],
        ['Amida', 'La amida se forma con una amina, no con un alcohol.'],
      ],
    ),
    mc(
      {
        id: 'w9u2-q3', concept: 'w9.grupos', kind: 'problem', diff: 3,
        prompt: 'La glicina es NH₂–CH₂–COOH. ¿Qué grupos funcionales tiene?',
        hints: ['Todos los aminoácidos comparten dos grupos.'],
        explanation: 'Grupo amino (–NH₂, amina) y grupo carboxilo (–COOH). No tiene éster ni cetona.',
      },
      [
        ['Amina (amino)'],
        ['Ácido carboxílico'],
        ['Éster', 'No hay un O entre dos carbonos unido a C=O.'],
        ['Cetona', 'El C=O forma parte del –COOH, no está entre dos carbonos.'],
      ],
    ),
    sc(
      {
        id: 'w9u2-q4', concept: 'w9.isomeria', kind: 'concept', diff: 2,
        prompt: 'Butano y 2-metilpropano (ambos C₄H₁₀) son…',
        hints: ['Misma fórmula, distinta conexión de los átomos.'],
        explanation: 'Isómeros estructurales: misma fórmula molecular, distinta cadena (lineal frente a ramificada).',
      },
      [
        ['Isómeros estructurales'],
        ['La misma molécula', 'Tienen distinta estructura y distintas propiedades (p. ej., puntos de ebullición).'],
        ['Isótopos', 'Isótopo se refiere a átomos con distinto número de neutrones.'],
      ],
    ),
    num(
      {
        id: 'w9u2-q5', concept: 'w9.isomeria', kind: 'application', diff: 4,
        prompt: '¿Cuántos isómeros estructurales tiene el pentano, C₅H₁₂?',
        hints: ['Cadena de 5; cadena de 4 con un metilo; cadena de 3 con dos metilos.'],
        explanation: 'Tres: pentano, 2-metilbutano y 2,2-dimetilpropano.',
      },
      3, 'isómeros', 0,
    ),
    sc(
      {
        id: 'w9u2-q6', concept: 'w9.isomeria', kind: 'retention', diff: 3,
        prompt: 'El etanol (CH₃CH₂OH) y el éter dimetílico (CH₃OCH₃) tienen la fórmula C₂H₆O. Son…',
        hints: ['¿Tienen el mismo grupo funcional?'],
        explanation: 'Isómeros estructurales de función: un alcohol y un éter con la misma fórmula molecular.',
      },
      [
        ['Isómeros estructurales (con distinto grupo funcional)'],
        ['Estereoisómeros', 'Los estereoisómeros tienen la misma conectividad; aquí la conectividad es distinta.'],
        ['La misma sustancia', 'Tienen propiedades muy distintas (78 °C frente a −24 °C de ebullición).'],
      ],
    ),
  ],
});

export const WORLD9_MODULES: Module[] = [{ id: 'w9-mod1', title: 'El mundo del carbono', units: [hidrocarburos, grupos] }];
