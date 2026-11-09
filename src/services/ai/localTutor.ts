/**
 * Tutor local: NO es inteligencia artificial. Combina la base de conocimiento local,
 * las calculadoras de `core/chemistry` y un guion socrático fijo.
 */
import { balanceEquation, BalanceError } from '@/core/chemistry/balance';
import { FormulaError, molarMass, parseFormula } from '@/core/chemistry/formula';
import { getElementBySymbol } from '@/data/elements';

import { findEntry, KNOWLEDGE, type KnowledgeEntry } from './knowledge';
import type { ChatMessage, TutorContext, TutorProvider, TutorReply } from './types';

const DEFAULT_SUGGESTIONS = ['¿Qué es un mol?', 'Explícame el pH', 'Masa molar de H2SO4', 'Balancea H2 + O2 -> H2O'];

const say = (text: string, isAnalogy = false) => ({ role: 'tutor' as const, text, isAnalogy });

function lastTopic(history: ChatMessage[]): KnowledgeEntry | null {
  for (let i = history.length - 1; i >= 0; i--) {
    const e = findEntry(history[i].text);
    if (e) return e;
  }
  return null;
}

function molarMassReply(formula: string): TutorReply {
  try {
    const comp = parseFormula(formula);
    const lines = Object.entries(comp).map(([sym, n]) => {
      const m = getElementBySymbol(sym)!.mass;
      return `• ${sym}: ${n} × ${m} = ${(n * m).toFixed(3)} g/mol`;
    });
    return {
      messages: [
        say(`Vamos paso a paso con ${formula}. Multiplicamos la masa atómica de cada elemento por cuántos átomos hay:`),
        say(lines.join('\n')),
        say(`Sumando: M ≈ ${molarMass(formula).toFixed(2)} g/mol. ¿Te animas a calcular la de otra sustancia tú sola?`),
      ],
      suggestions: ['Masa molar de CO2', '¿Qué es un mol?'],
    };
  } catch (e) {
    const msg = e instanceof FormulaError ? e.message : 'No pude leer la fórmula';
    return {
      messages: [say(`${msg}. Recuerda: cada símbolo empieza con mayúscula (Na, Cl) y los números van después (H2O).`)],
      suggestions: ['Masa molar de H2O'],
    };
  }
}

function balanceReply(equation: string, reveal: boolean): TutorReply {
  try {
    const r = balanceEquation(equation);
    if (!reveal) {
      return {
        messages: [
          say('¡Buen reto! Antes de darte el resultado, inténtalo: cuenta los átomos de cada elemento a cada lado.'),
          say('Empieza por el elemento que aparece en menos sustancias, y deja el hidrógeno y el oxígeno para el final. Solo puedes cambiar coeficientes, nunca subíndices.'),
        ],
        suggestions: [`Ver solución: ${equation}`],
      };
    }
    return {
      messages: [say(`Ecuación balanceada: ${r.text}`), say('Comprueba: cuenta cada elemento a ambos lados. ¿Coinciden?')],
      suggestions: DEFAULT_SUGGESTIONS,
    };
  } catch (e) {
    return {
      messages: [say(e instanceof BalanceError || e instanceof FormulaError ? `${e.message}.` : 'No pude leer la ecuación.')],
      suggestions: ['Balancea CH4 + O2 -> CO2 + H2O'],
    };
  }
}

export class LocalTutor implements TutorProvider {
  readonly id = 'local';
  readonly isAI = false;

  async reply(history: ChatMessage[], input: string, ctx: TutorContext): Promise<TutorReply> {
    const text = input.trim();

    const mm = /masa molar (?:de(?:l)?\s+)?([A-Za-z0-9()[\]·.₀-₉]+)/i.exec(text);
    if (mm) return molarMassReply(mm[1]);

    const sol = /^ver soluci[oó]n:\s*(.+)$/i.exec(text);
    if (sol) return balanceReply(sol[1], true);
    const bal = /balanc\w*\s+(.+(?:->|→|=).+)/i.exec(text);
    if (bal) return balanceReply(bal[1], false);

    if (/no entiendo|no lo entiendo|otra vez|otro ejemplo|sigo sin/i.test(text)) {
      const topic = lastTopic(history);
      if (topic) {
        return {
          messages: [say('¡Tranquila, probemos de otra forma! Con un ejemplo concreto:'), say(topic.example), say(topic.guidingQuestion)],
          suggestions: ['Explicación formal', 'Modo chisme'],
        };
      }
    }

    const entry = findEntry(text) ?? (/(formal|chisme|sencill)/i.test(text) ? lastTopic(history) : null);
    if (!entry) {
      return {
        messages: [
          say(
            'Todavía no tengo ese tema en mi modo local (sin IA). Puedo ayudarte con: ' +
              KNOWLEDGE.slice(0, 8).map((k) => k.title.toLowerCase()).join(', ') +
              ` y ${KNOWLEDGE.length - 8} temas más (isótopos, enlaces, redox, pH, enzimas, ADN, ósmosis…)` +
              ', y calcular masas molares o balancear ecuaciones.',
          ),
        ],
        suggestions: DEFAULT_SUGGESTIONS,
      };
    }

    const style = /formal/i.test(text) ? 'formal' : /chisme/i.test(text) ? 'chisme' : ctx.style;
    const messages: TutorReply['messages'] = [];
    if (ctx.consecutiveFailures >= 2) {
      messages.push(say('Cambiemos de estrategia con un ejemplo:'), say(entry.example));
    } else if (style === 'chisme') {
      messages.push(say(`🔬 Metáfora: ${entry.analogy.text}`, true));
      messages.push(say(`Lo que de verdad pasa: ${entry.formal}`));
      messages.push(say(`Límite de la metáfora: ${entry.analogy.limits}`));
    } else if (style === 'formal') {
      messages.push(say(entry.formal));
    } else {
      messages.push(say(entry.simple));
    }
    messages.push(say(entry.guidingQuestion));
    return {
      messages,
      suggestions: [
        style !== 'formal' ? 'Explicación formal' : 'Explicación sencilla',
        style !== 'chisme' ? 'Modo chisme' : 'Otro ejemplo',
        'No entiendo',
      ],
    };
  }
}
