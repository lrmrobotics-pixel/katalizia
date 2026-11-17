import { ACCESSORIES, composeCat, EFFECT_FRAMES, kataLook, SPRITE_H, SPRITE_W } from '@/components/pet/catSprite';
import { buildKata3D } from '@/components/pet/kataModel3d';
import { applyTrick, isBlinking, kataPose, moodPose, TRICKS, unlockedTricks } from '@/core/pet/animation';
import { box, cone, ellipsoid, faceNormal, project, render, shade, torus, type Camera } from '@/core/render3d';
import { CAT_MOODS } from '@/core/pet/wellbeing';

const cam: Camera = { distance: 8, focal: 400, cx: 100, cy: 100 };

describe('motor 3D', () => {
  it('proyecta en perspectiva: más lejos = más cerca del centro', () => {
    const near = project([1, 0, 2], cam);
    const far = project([1, 0, -2], cam);
    expect(near[0] - 100).toBeGreaterThan(far[0] - 100);
    expect(project([0, 1, 0], cam)[1]).toBeLessThan(100); // Y del mundo hacia arriba = arriba en pantalla
  });

  it('las normales de las primitivas apuntan hacia fuera', () => {
    for (const mesh of [ellipsoid([0, 0, 0], [1, 2, 1], '#fff'), box([0, 0, 0], [1, 1, 1], '#fff'), cone([0, 0, 0], 1, [0, 2, 0], '#fff')]) {
      for (const f of mesh) {
        const c = f.v.reduce((a, p) => [a[0] + p[0] / f.v.length, a[1] + p[1] / f.v.length, a[2] + p[2] / f.v.length], [0, 0, 0]);
        const n = faceNormal(f.v);
        // El centro de todas las primitivas probadas está dentro del sólido, cerca del origen.
        expect(n[0] * c[0] + n[1] * (c[1] - (mesh.length === 7 ? 0.5 : 0)) + n[2] * c[2]).toBeGreaterThan(-1e-6);
      }
    }
  });

  it('elimina las caras traseras: una caja de frente muestra a lo sumo 3 caras', () => {
    expect(render(box([0, 0, 0], [1, 1, 1], '#ffffff'), cam).length).toBeLessThanOrEqual(3);
    expect(render(box([0, 0, 0], [1, 1, 1], '#ffffff'), cam).length).toBeGreaterThanOrEqual(1);
  });

  it('dibuja primero lo más lejano (algoritmo del pintor)', () => {
    const polys = render([...ellipsoid([0, 0, -2], [0.5, 0.5, 0.5], '#ff0000'), ...ellipsoid([0, 0, 2], [0.5, 0.5, 0.5], '#00ff00')], cam);
    for (let i = 1; i < polys.length; i++) expect(polys[i - 1].depth).toBeGreaterThanOrEqual(polys[i].depth);
  });

  it('la luz oscurece las caras que no la reciben', () => {
    expect(shade('#808080', 0.5)).toBe('#404040');
    expect(shade('#ffffff', 2)).toBe('#ffffff');
    const lit = render(ellipsoid([0, 0, 0], [1, 1, 1], '#ffffff', 12, 8), cam, { light: [0, 1, 0], bands: 0 });
    expect(new Set(lit.map((p) => p.fill)).size).toBeGreaterThan(3);
  });

  it('el toroide tiene seg × tubo caras', () => {
    expect(torus([0, 0, 0], 1, 0.2, [0, 0, 1], '#fff', 10, 3)).toHaveLength(30);
  });
});

describe('animación compartida de Kata', () => {
  it.each(CAT_MOODS)('ánimo %s da una pose válida en todo momento', (mood) => {
    for (let t = 0; t < 6; t += 0.37) {
      const p = moodPose(mood, t);
      expect(p.squash).toBeGreaterThan(0.85);
      expect(p.squash).toBeLessThan(1.1);
      expect(p.eyeL).toBeGreaterThanOrEqual(0);
      expect(p.jump).toBeGreaterThanOrEqual(0);
    }
  });

  it('cada ánimo se distingue en la cara o el cuerpo', () => {
    const sig = (m: (typeof CAT_MOODS)[number]) => {
      const p = moodPose(m, 0.4);
      return `${p.mouth}|${p.happyEyes}|${p.eyeL.toFixed(2)}|${p.eyeR.toFixed(2)}|${p.armR.toFixed(1)}|${p.headNod.toFixed(2)}`;
    };
    expect(new Set(CAT_MOODS.map(sig)).size).toBe(CAT_MOODS.length);
  });

  it('parpadea de vez en cuando, no siempre', () => {
    const samples = Array.from({ length: 400 }, (_, i) => isBlinking(i * 0.05));
    const ratio = samples.filter(Boolean).length / samples.length;
    expect(ratio).toBeGreaterThan(0.01);
    expect(ratio).toBeLessThan(0.1);
  });

  it('los trucos terminan y vuelven a la pose normal', () => {
    const during = kataPose('feliz', 10.8, { id: 'saltar', startedAt: 10 });
    const after = kataPose('feliz', 12, { id: 'saltar', startedAt: 10 });
    expect(during.jump).toBeGreaterThan(0.3);
    expect(after.jump).toBe(0);
    expect(applyTrick(moodPose('feliz', 0), 'girar', 0.5).yaw).toBeCloseTo(Math.PI);
  });

  it('los trucos se desbloquean por nivel y nunca se pierden', () => {
    expect(unlockedTricks(1).map((t) => t.id)).toEqual(['saludar']);
    expect(unlockedTricks(99)).toHaveLength(TRICKS.length);
  });
});

describe('apariencia y modelos de Kata', () => {
  it('kataLook combina los accesorios equipados', () => {
    const look = kataLook(['bata-clasica', 'gafas-doradas', 'birrete', 'matraz']);
    expect(look.coat).toBe('#F5F8FF');
    expect(look.glasses).toBe('#FACC15');
    expect(look.hat).toBe('birrete');
    expect(look.hand).toBe('matraz');
    expect(kataLook([]).hat).toBeNull();
  });

  it('todos los accesorios cambian el sprite pixel y el modelo 3D', () => {
    const pose = moodPose('feliz', 0);
    const base3d = buildKata3D(pose, kataLook([])).length;
    for (const acc of ACCESSORIES) {
      const dressed = buildKata3D(pose, kataLook([acc.id]));
      const changed3d = dressed.length !== base3d || JSON.stringify(dressed) !== JSON.stringify(buildKata3D(pose, kataLook([])));
      expect(changed3d).toBe(true);
      const plain = composeCat('feliz');
      const withAcc = composeCat('feliz', { accessories: [acc] });
      expect(JSON.stringify(withAcc)).not.toBe(JSON.stringify(plain));
    }
  });

  it('el modelo 3D es ligero para móviles', () => {
    const all = kataLook(ACCESSORIES.map((a) => a.id));
    const mesh = buildKata3D(moodPose('celebrando', 1), all);
    expect(mesh.length).toBeLessThan(900);
    const visible = render(mesh, cam);
    expect(visible.length).toBeLessThan(mesh.length);
  });

  it('los efectos pixel tienen el tamaño del sprite', () => {
    Object.values(EFFECT_FRAMES).flat().forEach((frame) => {
      expect(frame).toHaveLength(SPRITE_H);
      frame.forEach((r) => expect(r).toHaveLength(SPRITE_W));
    });
  });
});
