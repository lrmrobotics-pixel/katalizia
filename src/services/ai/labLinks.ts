/**
 * Modo Experimento del tutor: relaciona la pregunta con el módulo del laboratorio
 * donde se puede practicar ese concepto (búsqueda por palabras clave, sin IA).
 */
export type LabModule = 'atomos' | 'moleculas' | 'ph' | 'balanceo' | 'disoluciones' | 'energia' | 'masa';

const RULES: [RegExp, LabModule, string][] = [
  [/balance|ecuaci[oó]n|->|→|coeficiente|conservaci[oó]n/i, 'balanceo', 'Balancea la ecuación y mira el recuento de átomos.'],
  [/masa molar|g\/mol|gramos|mol\b|moles/i, 'masa', 'Calcula la masa molar y la composición porcentual.'],
  [/\bph\b|[aá]cid|base|b[aá]sic|indicador|neutraliz|amortigu/i, 'ph', 'Mide el pH con tres indicadores y compara ácidos fuertes y débiles.'],
  [/diluc|molaridad|concentraci[oó]n|disoluci[oó]n|soluci[oó]n/i, 'disoluciones', 'Diluye un concentrado y comprueba C₁V₁ = C₂V₂.'],
  [/velocidad|catalizador|activaci[oó]n|temperatura|cin[eé]tica|energ[ií]a/i, 'energia', 'Cambia la temperatura y la energía de activación.'],
  [/enlace|mol[eé]cula|lewis|covalente|i[oó]nico|valencia/i, 'moleculas', 'Construye la molécula enlazando átomos.'],
  [/[aá]tomo|prot[oó]n|neutr[oó]n|electr[oó]n|is[oó]topo|ion\b|iones|capa|configuraci[oó]n/i, 'atomos', 'Arma el átomo partícula a partícula.'],
];

export function labForText(text: string): { module: LabModule; why: string } | null {
  for (const [re, module, why] of RULES) if (re.test(text)) return { module, why };
  return null;
}
