/** Mundo 8 — Energía y velocidad. Fuente principal: OpenStax Chemistry 2e, cap. 5, 12, 13 y 16. */
import type { Module } from '@/core/learning/types';

import { mc, num, sc, unit } from './build';
import { OPENSTAX_CHEM } from './sources';

const termo = unit({
  id: 'w8-u1-termo',
  title: 'Entalpía, entropía y energía libre',
  objectives: [
    'Distinguir procesos exotérmicos y endotérmicos por el signo de ΔH.',
    'Predecir el signo de ΔS en cambios sencillos.',
    'Usar ΔG = ΔH − TΔS para decidir si un proceso es espontáneo.',
  ],
  concepts: [
    { id: 'w8.entalpia', name: 'Entalpía: exotérmico y endotérmico', prerequisites: ['w5.tipos'] },
    { id: 'w8.gibbs', name: 'Entropía y energía libre de Gibbs', prerequisites: ['w5.tipos'] },
  ],
  sources: [OPENSTAX_CHEM('5.3 Enthalpy; 16.2 Entropy; 16.4 Free Energy')],
  intro: [
    '¿Por qué unas reacciones ocurren solas?',
    'El hierro se oxida solo, pero el óxido no vuelve a ser hierro por sí mismo. La termodinámica explica hacia dónde "quiere" ir una reacción.',
  ],
  simple: [
    'La idea sencilla',
    'Si una reacción libera calor, es exotérmica (ΔH < 0). Si lo absorbe, endotérmica (ΔH > 0). Pero el calor no basta: también cuenta el desorden (entropía). La energía libre de Gibbs combina las dos cosas y dice si el proceso es espontáneo.',
  ],
  analogy: {
    text: 'Metáfora: una habitación tiende a desordenarse sola (entropía) y una pelota tiende a rodar cuesta abajo (menor energía).',
    limits: 'La entropía no es "desorden" en sentido cotidiano: mide cuántas formas microscópicas hay de distribuir la energía.',
  },
  everyday: [
    'En tu vida',
    'Las compresas frías instantáneas usan nitrato de amonio disolviéndose en agua: un proceso endotérmico que es espontáneo porque aumenta mucho la entropía. Tu metabolismo acopla reacciones con ΔG < 0 (como la hidrólisis del ATP) a otras que por sí solas no ocurrirían.',
  ],
  visual: [
    'Signos de ΔG = ΔH − TΔS',
    'ΔH < 0 y ΔS > 0 → espontáneo siempre\nΔH > 0 y ΔS < 0 → nunca espontáneo\nΔH < 0 y ΔS < 0 → espontáneo a T baja\nΔH > 0 y ΔS > 0 → espontáneo a T alta',
  ],
  formal: [
    'Definiciones',
    'Entalpía (H): contenido de calor a presión constante. ΔH = H(productos) − H(reactivos).\nEntropía (S): medida de la dispersión de la energía; aumenta de sólido → líquido → gas y al aumentar el número de partículas de gas.\nEnergía libre de Gibbs: ΔG = ΔH − TΔS (T en kelvin).\nΔG < 0: espontáneo · ΔG = 0: equilibrio · ΔG > 0: no espontáneo (el inverso sí lo es).\n"Espontáneo" no significa "rápido": la velocidad la decide la cinética.',
  ],
  worked: [
    'Ejemplo resuelto',
    'ΔH = −100 kJ, ΔS = −0,200 kJ/K, T = 298 K.\nΔG = −100 − 298 × (−0,200) = −100 + 59,6 = −40,4 kJ.\nΔG < 0 → espontáneo a 298 K. (Cuidado: ΔS suele darse en J/K; pásalo a kJ/K antes.)',
  ],
  guided: ['w8u1-q1', 'w8u1-q4'],
  independent: ['w8u1-q2', 'w8u1-q5'],
  quiz: ['w8u1-q3', 'w8u1-q6'],
  questions: [
    sc(
      {
        id: 'w8u1-q1', concept: 'w8.entalpia', kind: 'concept', diff: 1,
        prompt: 'Una reacción con ΔH = −890 kJ/mol (combustión del metano) es…',
        hints: ['ΔH negativo: el sistema pierde calor hacia el entorno.'],
        explanation: 'Exotérmica: libera 890 kJ por mol de metano.',
      },
      [
        ['Exotérmica'],
        ['Endotérmica', 'Las endotérmicas tienen ΔH > 0.'],
        ['Ni una ni otra', 'Si ΔH ≠ 0 hay intercambio neto de calor.'],
      ],
    ),
    mc(
      {
        id: 'w8u1-q2', concept: 'w8.entalpia', kind: 'application', diff: 2,
        prompt: 'Selecciona los procesos ENDOTÉRMICOS.',
        hints: ['¿El proceso necesita recibir calor para ocurrir?'],
        explanation: 'Fundir hielo y evaporar agua absorben calor. Quemar madera y congelar agua liberan calor.',
      },
      [
        ['Fundir hielo'],
        ['Evaporar agua'],
        ['Quemar madera', 'La combustión libera calor: es exotérmica.'],
        ['Congelar agua', 'Al congelarse, el agua cede calor: es exotérmico.'],
      ],
    ),
    sc(
      {
        id: 'w8u1-q3', concept: 'w8.entalpia', kind: 'retention', diff: 2,
        prompt: 'Si sujetas un tubo donde ocurre una reacción y se enfría, la reacción es…',
        hints: ['Si el tubo se enfría, la reacción toma calor del entorno (tu mano).'],
        explanation: 'Endotérmica: absorbe calor del entorno, por eso notas frío.',
      },
      [
        ['Endotérmica'],
        ['Exotérmica', 'Una exotérmica calentaría el tubo.'],
      ],
    ),
    sc(
      {
        id: 'w8u1-q4', concept: 'w8.gibbs', kind: 'concept', diff: 2,
        prompt: 'En H₂O(l) → H₂O(g), el signo de ΔS es…',
        hints: ['¿Hay más formas de distribuir la energía en un gas o en un líquido?'],
        explanation: 'Positivo: el gas tiene mucha más libertad de movimiento que el líquido.',
      },
      [
        ['Positivo'],
        ['Negativo', 'Pasar a gas aumenta la entropía.'],
        ['Cero', 'Un cambio de estado cambia la entropía.'],
      ],
    ),
    num(
      {
        id: 'w8u1-q5', concept: 'w8.gibbs', kind: 'application', diff: 3,
        prompt: 'Calcula ΔG (kJ) si ΔH = −100 kJ, ΔS = −0,200 kJ/K y T = 298 K.',
        hints: ['ΔG = ΔH − TΔS.', '−TΔS = −298 × (−0,200) = +59,6.'],
        explanation: 'ΔG = −100 + 59,6 = −40,4 kJ (espontáneo).',
      },
      -40.4, 'kJ', 0.01,
    ),
    sc(
      {
        id: 'w8u1-q6', concept: 'w8.gibbs', kind: 'problem', diff: 4,
        prompt: 'Un proceso tiene ΔH > 0 y ΔS > 0. ¿Cuándo es espontáneo?',
        hints: ['Para que ΔG < 0, el término −TΔS debe superar a ΔH.'],
        explanation: 'A temperatura alta: −TΔS se hace más negativo al subir T y acaba superando a ΔH positivo. Ejemplo: fundir hielo por encima de 0 °C.',
      },
      [
        ['Solo a temperatura alta'],
        ['Siempre', 'Con ΔH > 0, a T baja ΔG es positivo.'],
        ['Nunca', 'A T suficientemente alta, −TΔS supera a ΔH.'],
        ['Solo a temperatura baja', 'A T baja domina ΔH (positivo) y ΔG > 0.'],
      ],
    ),
  ],
});

const cinetica = unit({
  id: 'w8-u2-cinetica',
  title: 'Velocidad de reacción y equilibrio',
  objectives: [
    'Explicar qué factores cambian la velocidad de una reacción.',
    'Describir el papel de la energía de activación y de los catalizadores.',
    'Predecir desplazamientos del equilibrio con el principio de Le Châtelier.',
  ],
  concepts: [
    { id: 'w8.cinetica', name: 'Velocidad, energía de activación y catalizadores', prerequisites: ['w8.entalpia'] },
    { id: 'w8.equilibrio', name: 'Equilibrio y Le Châtelier', prerequisites: ['w8.gibbs'] },
  ],
  sources: [OPENSTAX_CHEM('12.2 Factors Affecting Reaction Rates; 12.7 Catalysis; 13.1 Chemical Equilibria; 13.3 Shifting Equilibria')],
  intro: [
    'Rápido o lento, ida y vuelta',
    'Un diamante es termodinámicamente menos estable que el grafito, pero no se transforma en tu vida: la reacción es lentísima. Y muchas reacciones no terminan: llegan a un equilibrio.',
  ],
  simple: [
    'La idea sencilla',
    'Para reaccionar, las partículas deben chocar con suficiente energía (energía de activación). Más temperatura, más concentración o más superficie → más choques eficaces → más velocidad. Un catalizador abre un camino con menor energía de activación.',
  ],
  analogy: {
    text: 'Metáfora: la energía de activación es una colina entre dos valles; un catalizador es un túnel que la atraviesa más bajo.',
    limits: 'El túnel no cambia la altura de los valles: el catalizador no cambia ΔH ni la posición del equilibrio, solo lo rápido que se llega.',
  },
  everyday: [
    'En tu vida',
    'La nevera conserva los alimentos porque a menor temperatura las reacciones de descomposición son más lentas. Las enzimas de tu cuerpo son catalizadores biológicos: aceleran reacciones millones de veces a 37 °C.',
  ],
  visual: [
    'Principio de Le Châtelier',
    'Si perturbas un equilibrio, se desplaza para contrarrestar el cambio:\n+ reactivo → hacia productos · + producto → hacia reactivos\n+ presión (gases) → hacia menos moles de gas\n+ temperatura → en el sentido endotérmico',
  ],
  formal: [
    'Definiciones',
    'Velocidad de reacción: cambio de concentración por unidad de tiempo.\nEnergía de activación (Ea): energía mínima para que un choque produzca reacción.\nCatalizador: sustancia que aumenta la velocidad bajando Ea, sin consumirse; no cambia ΔH ni K.\nEquilibrio dinámico: las velocidades directa e inversa son iguales; las concentraciones dejan de cambiar.\nConstante de equilibrio para aA + bB ⇌ cC + dD: K = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ. K ≫ 1: predominan productos.',
  ],
  worked: [
    'Ejemplo resuelto: síntesis de amoníaco',
    'N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g), ΔH < 0.\nAumentar la presión: izquierda 4 moles de gas, derecha 2 → se desplaza a la derecha.\nAumentar la temperatura: favorece el sentido endotérmico (el inverso) → se desplaza a la izquierda.\nUn catalizador de hierro solo acelera la llegada al equilibrio.',
  ],
  guided: ['w8u2-q1', 'w8u2-q4'],
  independent: ['w8u2-q2', 'w8u2-q5'],
  quiz: ['w8u2-q3', 'w8u2-q6'],
  questions: [
    mc(
      {
        id: 'w8u2-q1', concept: 'w8.cinetica', kind: 'concept', diff: 2,
        prompt: '¿Qué cambios suelen AUMENTAR la velocidad de una reacción?',
        hints: ['Piensa en el número y la energía de los choques.'],
        explanation: 'Subir la temperatura, aumentar la concentración, triturar un sólido (más superficie) y añadir un catalizador aumentan la velocidad. Enfriar la reduce.',
      },
      [
        ['Aumentar la temperatura'],
        ['Aumentar la concentración de reactivos'],
        ['Triturar un reactivo sólido'],
        ['Enfriar la mezcla', 'Menos temperatura → menos choques con energía suficiente → más lenta.'],
      ],
    ),
    sc(
      {
        id: 'w8u2-q2', concept: 'w8.cinetica', kind: 'application', diff: 3,
        prompt: 'Un catalizador acelera una reacción porque…',
        hints: ['Piensa en la "colina" de energía.'],
        explanation: 'Ofrece un mecanismo alternativo con menor energía de activación. No cambia ΔH ni K y no se consume.',
      },
      [
        ['Baja la energía de activación'],
        ['Hace la reacción más exotérmica', 'Un catalizador no cambia ΔH.'],
        ['Se consume como un reactivo más', 'Se recupera al final; no se consume.'],
        ['Desplaza el equilibrio hacia productos', 'No cambia K: acelera por igual la reacción directa y la inversa.'],
      ],
    ),
    sc(
      {
        id: 'w8u2-q3', concept: 'w8.cinetica', kind: 'problem', diff: 3,
        prompt: '¿Por qué se conserva mejor la comida en la nevera?',
        hints: ['¿Qué pasa con la velocidad de las reacciones (y del crecimiento bacteriano) al bajar la temperatura?'],
        explanation: 'A menor temperatura hay menos choques con energía suficiente para superar Ea: las reacciones de descomposición van más lentas.',
      },
      [
        ['Las reacciones de descomposición se hacen más lentas'],
        ['El frío cambia el ΔH de las reacciones', 'El ΔH apenas cambia; lo que baja es la velocidad.'],
        ['El frío destruye todas las bacterias', 'El frío frena su actividad, pero no las elimina.'],
      ],
    ),
    sc(
      {
        id: 'w8u2-q4', concept: 'w8.equilibrio', kind: 'concept', diff: 2,
        prompt: 'En el equilibrio químico…',
        hints: ['El equilibrio es dinámico.'],
        explanation: 'Las reacciones directa e inversa siguen ocurriendo a la misma velocidad; por eso las concentraciones se mantienen constantes.',
      },
      [
        ['Las velocidades directa e inversa son iguales'],
        ['La reacción se detiene', 'El equilibrio es dinámico: ambas reacciones continúan.'],
        ['Las concentraciones de reactivos y productos son iguales', 'Son constantes, pero no tienen por qué ser iguales.'],
      ],
    ),
    sc(
      {
        id: 'w8u2-q5', concept: 'w8.equilibrio', kind: 'application', diff: 3,
        prompt: 'N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g) (ΔH < 0). Si aumentas la presión, el equilibrio se desplaza…',
        hints: ['Cuenta los moles de gas a cada lado.'],
        explanation: 'Hacia la derecha: 4 moles de gas → 2 moles; al aumentar la presión se favorece el lado con menos moles de gas.',
      },
      [
        ['Hacia los productos (NH₃)'],
        ['Hacia los reactivos', 'Los reactivos tienen más moles de gas (4 frente a 2).'],
        ['No se desplaza', 'Hay distinto número de moles de gas a cada lado, así que la presión sí influye.'],
      ],
    ),
    sc(
      {
        id: 'w8u2-q6', concept: 'w8.equilibrio', kind: 'problem', diff: 4,
        prompt: 'En la misma reacción exotérmica, ¿qué pasa al CALENTAR?',
        hints: ['Trata el calor como un "producto" de una reacción exotérmica.'],
        explanation: 'Se desplaza hacia los reactivos (sentido endotérmico) y la constante K disminuye.',
      },
      [
        ['Se desplaza hacia los reactivos'],
        ['Se desplaza hacia los productos', 'Calentar favorece el sentido endotérmico, que aquí es el inverso.'],
        ['Solo aumenta la velocidad, sin desplazarse', 'La temperatura sí cambia K y la posición del equilibrio.'],
      ],
    ),
  ],
});

export const WORLD8_MODULES: Module[] = [{ id: 'w8-mod1', title: 'Energía y tiempo', units: [termo, cinetica] }];
