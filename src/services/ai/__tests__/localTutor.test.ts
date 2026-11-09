import { findEntry } from '../knowledge';
import { LocalTutor } from '../localTutor';
import type { ChatMessage, TutorContext } from '../types';

const ctx: TutorContext = { style: 'sencilla', weakConcepts: [], consecutiveFailures: 0 };
const tutor = new LocalTutor();
const msg = (text: string, role: 'student' | 'tutor' = 'student'): ChatMessage => ({ id: text, role, text, at: 0 });
const all = (r: { messages: { text: string }[] }) => r.messages.map((m) => m.text).join('\n');

describe('tutor local', () => {
  it('se declara como no-IA', () => {
    expect(tutor.isAI).toBe(false);
  });

  it('encuentra temas sin depender de tildes', () => {
    expect(findEntry('¿qué es un mol?')?.id).toBe('mol');
    expect(findEntry('explicame el pH')?.id).toBe('ph');
    expect(findEntry('cuál es la masa molar')?.id).toBe('masa-molar');
    expect(findEntry('hola')).toBeNull();
  });

  it('explica y termina con una pregunta (no solo da la respuesta)', async () => {
    const r = await tutor.reply([], '¿Qué es un mol?', ctx);
    expect(r.messages.at(-1)!.text).toMatch(/\?$/);
  });

  it('modo chisme marca la metáfora y añade explicación formal y límites', async () => {
    const r = await tutor.reply([], 'Cuéntame del agua en modo chisme', ctx);
    expect(r.messages[0].isAnalogy).toBe(true);
    expect(all(r)).toMatch(/Lo que de verdad pasa/);
    expect(all(r)).toMatch(/Límite de la metáfora/);
  });

  it('calcula masa molar paso a paso', async () => {
    const r = await tutor.reply([], 'masa molar de H2SO4', ctx);
    expect(all(r)).toMatch(/98\.07/);
  });

  it('no revela el balanceo a la primera', async () => {
    const r = await tutor.reply([], 'balancea H2 + O2 -> H2O', ctx);
    expect(all(r)).not.toMatch(/2H2 \+ O2/);
    const s = await tutor.reply([], r.suggestions[0], ctx);
    expect(all(s)).toMatch(/2H2 \+ O2 → 2H2O/);
  });

  it('cambia de estrategia cuando no entiende', async () => {
    const r = await tutor.reply([msg('¿qué es la molaridad?')], 'no entiendo', ctx);
    expect(all(r)).toMatch(/otra forma/);
  });

  it('tras varios fallos usa un ejemplo concreto', async () => {
    const r = await tutor.reply([], 'pH', { ...ctx, consecutiveFailures: 2 });
    expect(all(r)).toMatch(/HCl/);
  });

  it('es honesto con temas que no conoce', async () => {
    const r = await tutor.reply([], 'háblame de la mecánica de fluidos', ctx);
    expect(all(r)).toMatch(/modo local \(sin IA\)/);
  });
});

describe('temas ampliados (Mundos 2–12)', () => {
  it.each([
    ['¿qué es un isótopo?', 'isotopos'],
    ['explícame la ósmosis', 'osmosis'],
    ['no entiendo la oxidación', 'redox'],
    ['¿cómo funciona un amortiguador?', 'amortiguador'],
    ['qué hace el ATP', 'atp'],
    ['háblame de Le Chatelier', 'equilibrio'],
  ])('%s → %s', (q, id) => {
    expect(findEntry(q)?.id).toBe(id);
  });
});
