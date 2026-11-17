import { seededRng } from '@/core/games';
import {
  bandOf,
  BIO_QUESTIONS,
  bioRound,
  indicatorSide,
  kitchenCorrect,
  makeKitchenRound,
  makePhRound,
  ORGAN_LABEL,
  PH_BANDS,
} from '@/core/games/extra';
import { molarMass } from '@/core/chemistry/formula';

describe('PH Master', () => {
  it('las bandas cubren 0–14 sin huecos', () => {
    expect(bandOf(0)).toBe(0);
    expect(bandOf(7)).toBe(2);
    expect(bandOf(14)).toBe(4);
    for (let i = 1; i < PH_BANDS.length; i++) expect(PH_BANDS[i].min).toBe(PH_BANDS[i - 1].max);
  });

  it('las rondas son coherentes con el cálculo y con el indicador', () => {
    const rand = seededRng(5);
    for (let i = 0; i < 200; i++) {
      const r = makePhRound(rand);
      if (r.type === 'band') {
        expect(r.answer).toBe(bandOf(r.ph));
        // HCl 0,01 M → pH 2 (banda 0–3)
        if (r.solute.id === 'HCl' && r.exp === -2) expect(r.ph).toBeCloseTo(2, 2);
      } else {
        // Lejos del viraje: el color es concluyente.
        expect(r.zone).not.toBe('viraje');
        expect(indicatorSide(r)).toBe(r.ph < r.indicator.from ? 'debajo' : 'encima');
      }
    }
  });
});

describe('Chemistry Kitchen', () => {
  it('cada dilución tiene solución en la rejilla de los controles', () => {
    const rand = seededRng(9);
    for (let i = 0; i < 100; i++) {
      const r = makeKitchenRound(rand);
      if (r.type !== 'dilucion') continue;
      let found = false;
      for (let v1 = 5; v1 <= 250 && !found; v1 += 5) for (let v2 = 50; v2 <= 1000 && !found; v2 += 50) found = kitchenCorrect(r, v1, v2);
      expect(found).toBe(true);
    }
  });

  it('pesar: m = M · V · masa molar, con ±2 %', () => {
    const r = { type: 'pesar' as const, formula: 'NaCl', name: 'cloruro de sodio', molarity: 0.5, volumeMl: 250, grams: 0.5 * 0.25 * molarMass('NaCl') };
    expect(r.grams).toBeCloseTo(7.305, 2);
    expect(kitchenCorrect(r, 7.3)).toBe(true);
    expect(kitchenCorrect(r, 7.6)).toBe(false);
  });

  it('rechaza volúmenes imposibles', () => {
    const r = { type: 'dilucion' as const, stock: 2, target: 1, maxV2: 1000 };
    expect(kitchenCorrect(r, 100, 50)).toBe(false);
    expect(kitchenCorrect(r, 100, 200)).toBe(true);
  });
});

describe('BioQuest', () => {
  it('cada pregunta apunta a un órgano del mapa y lleva fuente', () => {
    for (const q of BIO_QUESTIONS) {
      expect(ORGAN_LABEL[q.organ]).toBeDefined();
      expect(q.source).toMatch(/A&P 2e, \d+\.\d+/);
    }
    expect(new Set(BIO_QUESTIONS.map((q) => q.id)).size).toBe(BIO_QUESTIONS.length);
  });

  it('no repite preguntas hasta agotarlas', () => {
    const rand = seededRng(3);
    const done: string[] = [];
    for (let i = 0; i < BIO_QUESTIONS.length; i++) done.push(bioRound(rand, done).id);
    expect(new Set(done).size).toBe(BIO_QUESTIONS.length);
  });
});
