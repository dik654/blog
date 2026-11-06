import { useCallback } from "react";
import type { Group } from "three";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import Scene3DCanvas, { type Scene3DLabel, type Three } from "@/components/viz/Scene3DCanvas";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #picture — 빛이 나아가는 축에 수직인 평면에서 방향을 맞추고 잰다.
 * 파동 한 줄 = 신호의 편광 방향. 고리의 두 막대 = 측정 방향 묶음(+ 또는 ×).
 * 깊이가 답의 일부라 3D로 그립니다. 진행 방향과 편광면이 수직이라는 점이 평면 그림에서는 보이지 않습니다.
 */
const SIGNAL = "#2563eb";
const FAINT = "#94a3b8";
const RING = "#64748b";
const WRONG = "#dc2626";

type Basis = "+" | "×";

interface Wave {
  from: number;
  to: number;
  angle: number;
  color?: string;
  /** 갈라진 결과를 위아래로 떼어 놓는 높이입니다. */
  offset?: number;
  opacity?: number;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  rings: readonly { x: number; basis: Basis }[];
  waves: readonly Wave[];
  labels: readonly Scene3DLabel[];
}

const SCENES: readonly Scene[] = [
  {
    label: "+로 재기",
    summary: "가로 → 값 0 확정",
    note: "가로로 준비한 신호를 +로 재면 고리의 가로 막대와 방향이 같습니다. 이상적인 장치에서는 언제나 값 0이 나옵니다.",
    rings: [{ x: 1, basis: "+" }],
    waves: [
      { from: -4.6, to: 1, angle: 0 },
      { from: 1, to: 4.6, angle: 0 },
    ],
    labels: [
      { text: "A: 가로 · 값 0", at: [-3.2, 1.25, 0] },
      { text: "B: + 측정", at: [1, 1.75, 0] },
      { text: "값 0 · 확률 1", at: [3.4, 1.25, 0], tone: "accent" },
    ],
  },
  {
    label: "×로 재기",
    summary: "가로 → 0 또는 1, 각각 1/2",
    note: "×의 두 막대와 45°씩 어긋나 값 0과 1이 절반씩 나옵니다. 잰 뒤의 신호는 측정한 방향으로 바뀝니다.",
    rings: [{ x: 1, basis: "×" }],
    waves: [
      { from: -4.6, to: 1, angle: 0 },
      { from: 1, to: 4.6, angle: 45, offset: 1.05 },
      { from: 1, to: 4.6, angle: 135, offset: -1.05 },
    ],
    labels: [
      { text: "A: 가로 · 값 0", at: [-3.2, 1.25, 0] },
      { text: "B: × 측정", at: [1, 1.75, 0] },
      { text: "값 0 · 1/2", at: [3.6, 2, 0], tone: "accent" },
      { text: "값 1 · 1/2", at: [3.6, -2, 0], tone: "accent" },
    ],
  },
  {
    label: "3번 기록",
    summary: "A 값 0 · B 값 1 → 제외",
    note: "표의 3번입니다. A는 +로 값 0을 보냈고 B는 ×로 재어 1을 적었습니다. A의 값을 전달하지 못하므로 버립니다.",
    rings: [{ x: 1, basis: "×" }],
    waves: [
      { from: -4.6, to: 1, angle: 0 },
      { from: 1, to: 4.6, angle: 45, offset: 1.05, color: FAINT, opacity: 0.45 },
      { from: 1, to: 4.6, angle: 135, offset: -1.05 },
    ],
    labels: [
      { text: "A: + · 값 0", at: [-3.2, 1.25, 0] },
      { text: "B: × 측정", at: [1, 1.75, 0] },
      { text: "이번 결과: 값 1", at: [3.5, -2, 0], tone: "accent" },
    ],
  },
  {
    label: "Eve가 가로채면",
    summary: "1/2 × 1/2 = 25% 오류",
    note: "Eve가 틀린 방향을 고를 확률 1/2에, 그 신호를 받은 B가 다른 값을 얻을 확률 1/2을 곱해 8절의 25%가 됩니다.",
    rings: [
      { x: -1.6, basis: "×" },
      { x: 2, basis: "+" },
    ],
    waves: [
      { from: -4.6, to: -1.6, angle: 0 },
      { from: -1.6, to: 2, angle: 45 },
      { from: 2, to: 4.8, angle: 0, offset: 1.05 },
      { from: 2, to: 4.8, angle: 90, offset: -1.05, color: WRONG },
    ],
    labels: [
      { text: "A: 가로 · 값 0", at: [-3.6, 1.25, 0] },
      { text: "Eve: ×", at: [-1.6, 1.75, 0] },
      { text: "B: +", at: [2, 1.75, 0] },
      { text: "값 0 · 맞음", at: [4, 2, 0], tone: "accent" },
      { text: "값 1 · 오류", at: [4, -2, 0], tone: "accent" },
    ],
  },
];

const SAMPLES = 96;
const AMPLITUDE = 0.62;
const TURNS_PER_UNIT = 0.9;

function buildScene(THREE: Three, root: Group, scene: Scene) {
  // 진행 축
  const axisPoints = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(5, 0, 0)];
  root.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(axisPoints),
      new THREE.LineBasicMaterial({ color: FAINT }),
    ),
  );

  scene.rings.forEach((ring) => {
    const group = new THREE.Group();
    group.position.x = ring.x;
    const circle = Array.from({ length: 65 }, (_, index) => {
      const t = (index / 64) * Math.PI * 2;
      return new THREE.Vector3(0, Math.sin(t) * 1.15, Math.cos(t) * 1.15);
    });
    group.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(circle),
        new THREE.LineBasicMaterial({ color: RING }),
      ),
    );
    const start = ring.basis === "+" ? 0 : 45;
    [start, start + 90].forEach((degrees) => {
      const r = (degrees * Math.PI) / 180;
      const bar = [
        new THREE.Vector3(0, -Math.sin(r) * 1.15, -Math.cos(r) * 1.15),
        new THREE.Vector3(0, Math.sin(r) * 1.15, Math.cos(r) * 1.15),
      ];
      group.add(
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(bar),
          new THREE.LineBasicMaterial({ color: RING }),
        ),
      );
    });
    root.add(group);
  });

  const waves = scene.waves.map((wave) => {
    const positions = new Float32Array((SAMPLES + 1) * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({
      color: wave.color ?? SIGNAL,
      transparent: wave.opacity !== undefined,
      opacity: wave.opacity ?? 1,
    });
    root.add(new THREE.Line(geometry, material));
    // 축과 파동 사이를 옅게 채워 신호가 어느 평면에서 흔들리는지 보이게 합니다.
    const sheetPositions = new Float32Array((SAMPLES + 1) * 6);
    const sheetIndex: number[] = [];
    for (let index = 0; index < SAMPLES; index += 1) {
      const a = index * 2;
      sheetIndex.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const sheetGeometry = new THREE.BufferGeometry();
    sheetGeometry.setAttribute("position", new THREE.BufferAttribute(sheetPositions, 3));
    sheetGeometry.setIndex(sheetIndex);
    root.add(
      new THREE.Mesh(
        sheetGeometry,
        new THREE.MeshBasicMaterial({
          color: wave.color ?? SIGNAL,
          transparent: true,
          opacity: 0.16 * (wave.opacity ?? 1),
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      ),
    );
    return { wave, positions, geometry, sheetPositions, sheetGeometry };
  });

  // 가로(0°)는 화면 깊이 축 z, 세로(90°)는 y로 둡니다.
  const place = (seconds: number) => {
    waves.forEach(({ wave, positions, geometry, sheetPositions, sheetGeometry }) => {
      const r = (wave.angle * Math.PI) / 180;
      const span = wave.to - wave.from;
      const offset = wave.offset ?? 0;
      for (let index = 0; index <= SAMPLES; index += 1) {
        const f = index / SAMPLES;
        const x = wave.from + span * f;
        const phase = (x * TURNS_PER_UNIT - seconds * 0.8) * Math.PI * 2;
        const value = Math.sin(phase) * AMPLITUDE;
        // 갈라지는 결과는 고리에서 시작해 점점 위아래로 벌어집니다.
        const centre = offset * Math.min(1, f * 1.8);
        const y = Math.sin(r) * value + centre;
        const z = Math.cos(r) * value;
        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = z;
        sheetPositions.set([x, centre, 0, x, y, z], index * 6);
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeBoundingSphere();
      sheetGeometry.attributes.position.needsUpdate = true;
      sheetGeometry.computeBoundingSphere();
    });
  };
  place(0);
  return { tick: place };
}

/** WebGL을 쓸 수 없을 때: 진행 방향에서 정면으로 본 평면 그림입니다. */
function EndOnFallback({ scene }: { scene: Scene }) {
  const ring = scene.rings[scene.rings.length - 1];
  const start = ring.basis === "+" ? 0 : 45;
  const bar = (degrees: number) => {
    const r = (degrees * Math.PI) / 180;
    return { x: Math.cos(r) * 70, y: Math.sin(r) * 70 };
  };
  const first = bar(start);
  const second = bar(start + 90);
  return (
    <svg viewBox="-100 -100 200 200" className="mx-auto h-full" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <circle r={70} fill="none" stroke={RING} strokeWidth={1} />
      <line x1={-first.x} y1={first.y} x2={first.x} y2={-first.y} stroke={RING} strokeWidth={1} />
      <line x1={-second.x} y1={second.y} x2={second.x} y2={-second.y} stroke={RING} strokeWidth={1} />
      <line x1={-52} y1={0} x2={52} y2={0} stroke={SIGNAL} strokeWidth={1.25} />
    </svg>
  );
}

export default function PolarizationMeasureViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const scene = SCENES[scenes.active];
  const build = useCallback((THREE: Three, root: Group) => buildScene(THREE, root, scene), [scene]);

  return (
    <VizFrame
      eyebrow="3D · 빛을 재는 순간"
      title="신호의 방향과 측정 방향이 어긋나면 결과가 갈립니다"
      description="파란 파동이 신호의 흔들리는 방향이고, 고리의 두 막대가 측정 방향 묶음입니다. 왼쪽에서 오른쪽으로 나아가며, 가로로 끌면 돌려 볼 수 있습니다."
      note="단일 광자와 이상적인 장치를 가정한 그림입니다. 파동의 크기와 빠르기는 실제 값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="가로 신호를 + 또는 ×로 잴 때의 결과와 Eve가 가로챌 때의 오류"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <div className="mt-3" data-viz-live-only>
          <Scene3DCanvas
            build={build}
            sceneKey={scenes.active}
            labels={scene.labels}
            ariaLabel={`${scene.label}: ${scene.summary}`}
            reducedMotion={scenes.reducedMotion}
            fallback={<EndOnFallback scene={scene} />}
          />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-3"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
