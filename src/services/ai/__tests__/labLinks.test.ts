import { labForText } from '../labLinks';

describe('modo experimento', () => {
  it('relaciona preguntas con el módulo de laboratorio', () => {
    expect(labForText('Explícame el pH')?.module).toBe('ph');
    expect(labForText('Balancea H2 + O2 -> H2O')?.module).toBe('balanceo');
    expect(labForText('Masa molar de C6H12O6')?.module).toBe('masa');
    expect(labForText('¿Qué es un isótopo?')?.module).toBe('atomos');
    expect(labForText('¿Cómo funciona un catalizador?')?.module).toBe('energia');
    expect(labForText('enlace covalente')?.module).toBe('moleculas');
    expect(labForText('hola')).toBeNull();
  });
});
