import type { Group } from "three";
import Scene3DCanvas, { type Scene3DLabel, type Three, type Vec3 } from "@/components/viz/Scene3DCanvas";
import SceneShell from "./SceneShell";
import { addArrow, addDashed, addLine } from "./threeParts";

/**
 * 본문 대응: #probability 첫 문단 — 무작위 k차원 부분공간으로 직교 사영한 뒤 √(D/k)를 곱한다.
 * 평면 그림으로는 평면과 차이 벡터의 기울기가 보이지 않아 3D입니다. D=3, k=2와 세 평면은 설명용(가정)이며 무작위 추출 결과가 아닙니다.
 * 차이 벡터는 본문의 첫째·둘째 점 차이 (1,1,1,…)에서 세 칸만 쓴 (1,1,1)이라 제곱 길이 3입니다.
 * 평면의 법선과 벡터의 각 θ에 대해 그림자 제곱 = 3 sin²θ, 곱한 뒤 = 그림자 제곱 × 3/2. ε=0.2의 띠는 3×(1±0.2)입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const SCALE = 1.7;
const BAND = [2.4, 3.6] as const;

type V = readonly [number, number, number];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (a: V, b: V, s = 1): V => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const scale = (a: V, s: number): V => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V) => scale(a, 1 / Math.sqrt(dot(a, a)));

const VEC: V = [1, 1, 1];
const V_HAT = norm(VEC);
const W_HAT = norm([-1, -1, 2]);

interface Scene {
  label: string;
  summary: string;
  note: string;
  shadowSquared: number;
  showShadow: boolean;
  showScaled: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "차이와 평면", summary: "제곱 길이 3 · k=2", shadowSquared: 2, showShadow: false, showScaled: false, note: "파란 화살표가 두 점의 차이입니다. 이 화살표를 어느 평면에 떨어뜨리는지는 무작위로 정해집니다." },
  { label: "직각으로 떨어뜨리기", summary: "3 → 그림자 2", shadowSquared: 2, showShadow: true, showScaled: false, note: "평면에 직각으로 떨어뜨린 그림자는 제곱 길이가 줄어듭니다. 이 평면에서는 3이 정확히 2입니다." },
  { label: "√(D/k)를 곱하기", summary: "2 × 3/2 = 3 · 통과", shadowSquared: 2, showShadow: true, showScaled: true, note: "본문의 배율 √(D/k)는 여기서 √(3/2)입니다. 제곱 길이는 3/2배인 3이 되어 띠 2.4~3.6 안입니다." },
  { label: "거의 수직인 평면", summary: "0.2 → 0.3 · 실패", shadowSquared: 0.2, showShadow: true, showScaled: true, note: "평면이 차이 방향과 거의 수직이면 그림자가 작습니다. 같은 배율을 곱해도 0.3이라 띠 아래입니다." },
  { label: "나란한 평면", summary: "3 → 4.5 · 실패", shadowSquared: 3, showShadow: true, showScaled: true, note: "평면이 차이를 품으면 그림자가 줄지 않아 4.5로 띠 위입니다. 그래서 성공을 확률로 말합니다." },
];

function geometry(shadowSquared: number) {
  const sinSq = shadowSquared / 3;
  const sin = Math.sqrt(sinSq);
  const cos = Math.sqrt(1 - sinSq);
  const normal = add(scale(V_HAT, cos), W_HAT, sin);
  const shadow = add(VEC, normal, -dot(VEC, normal));
  const e1 = norm(shadow);
  const e2 = cross(normal, e1);
  return { normal, shadow, e1, e2 };
}

/** 기본 시점의 화면 오른쪽 방향으로 r, 위로 u만큼 옮긴 자리입니다. */
const nudge = (p: V, r: number, u: number): Vec3 => [p[0] + 0.707 * r, p[1] + u, p[2] + 0.707 * r];

function labelsFor(scene: Scene): readonly Scene3DLabel[] {
  const { shadow } = geometry(scene.shadowSquared);
  const offset = scale(VEC, -SCALE / 2);
  const place = (v: V) => add(offset, v, SCALE);
  // 나란한 평면에서는 두 화살표가 겹치므로 글자를 위아래로 떼어 놓습니다.
  const parallel = scene.shadowSquared === 3 && scene.showScaled;
  const out: Scene3DLabel[] = [{ text: "차이 · 제곱 3", at: parallel ? nudge(place(VEC), 0.5, -0.75) : nudge(place(VEC), 0.75, 0.32) }];
  if (scene.showShadow) {
    const value = scene.showScaled ? Math.round(scene.shadowSquared * 15) / 10 : scene.shadowSquared;
    const name = scene.showScaled ? "곱한 뒤" : "그림자";
    const anchor = place(scale(shadow, scene.showScaled ? Math.sqrt(1.5) : 1));
    out.push({ text: `${name} · 제곱 ${value}`, at: nudge(anchor, parallel ? -0.55 : -0.95, parallel ? 0.5 : 0.26), tone: "accent" });
  }
  return out;
}

function build(THREE: Three, root: Group, scene: Scene) {
  const { shadow, e1, e2 } = geometry(scene.shadowSquared);
  const offset = scale(VEC, -SCALE / 2);
  const at = (v: V): Vec3 => {
    const p = add(offset, v, SCALE);
    return [p[0], p[1], p[2]];
  };
  const corner = (a: number, b: number): V => add(scale(e1, a), e2, b);
  const corners = [corner(-0.4, -0.85), corner(2.3, -0.85), corner(2.3, 0.85), corner(-0.4, 0.85)].map(at);
  const geo = new THREE.BufferGeometry().setFromPoints(corners.map((point) => new THREE.Vector3(...point)));
  geo.setIndex([0, 1, 2, 0, 2, 3]);
  root.add(
    new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color: GRAY, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
    ),
  );
  addLine(THREE, root, [...corners, corners[0]], GRAY, 0.8);
  addArrow(THREE, root, at([0, 0, 0]), at(VEC), BLUE, 0.05);
  if (scene.showShadow) {
    addDashed(THREE, root, at(VEC), at(shadow), GRAY);
    if (!scene.showScaled) addArrow(THREE, root, at([0, 0, 0]), at(shadow), AMBER, 0.05);
  }
  if (scene.showScaled) {
    const inBand = scene.shadowSquared * 1.5 >= BAND[0] && scene.shadowSquared * 1.5 <= BAND[1];
    addArrow(THREE, root, at([0, 0, 0]), at(scale(shadow, Math.sqrt(1.5))), inBand ? AMBER : RED, 0.05);
  }
  return {};
}

/** WebGL을 쓸 수 없을 때: 평면을 모서리 쪽에서 본 그림입니다. 평면은 한 줄로 보입니다. */
function SideFallback({ scene }: { scene: Scene }) {
  const cosSq = scene.shadowSquared / 3;
  const angle = Math.acos(Math.sqrt(cosSq));
  const unit = 50;
  const length = Math.sqrt(3) * unit;
  const x0 = 70;
  const y0 = 160;
  const tipX = x0 + Math.cos(angle) * length;
  const tipY = y0 - Math.sin(angle) * length;
  const scaledX = x0 + Math.cos(angle) * length * Math.sqrt(1.5);
  const inBand = scene.shadowSquared * 1.5 >= BAND[0] && scene.shadowSquared * 1.5 <= BAND[1];
  return (
    <svg viewBox="0 0 340 200" className="mx-auto h-full w-full max-w-[420px]" role="img" aria-label={`평면을 모서리 쪽에서 본 그림: ${scene.summary}`}>
      <line x1={20} x2={320} y1={y0} y2={y0} stroke={GRAY} strokeWidth={1} />
      <text x={320} y={y0 + 18} textAnchor="end" fontSize={12} fill={GRAY}>모서리 쪽에서 본 평면</text>
      <line x1={x0} y1={y0} x2={tipX} y2={tipY} stroke={BLUE} strokeWidth={1.25} />
      <text x={tipX + 8} y={Math.max(tipY - 6, 16)} fontSize={12} fontWeight={700} fill={BLUE}>차이 · 제곱 3</text>
      {scene.showShadow && <line x1={tipX} y1={tipY} x2={tipX} y2={y0} stroke={GRAY} strokeWidth={1} strokeDasharray="3 3" />}
      {scene.showShadow && <line x1={x0} y1={y0 - 2} x2={scene.showScaled ? scaledX : tipX} y2={y0 - 2} stroke={scene.showScaled && !inBand ? RED : AMBER} strokeWidth={1.25} />}
      {scene.showShadow && (
        <text x={x0} y={y0 + 18} fontSize={12} fontWeight={700} fill={scene.showScaled && !inBand ? RED : AMBER}>
          {`${scene.showScaled ? "곱한 뒤" : "그림자"} · 제곱 ${scene.showScaled ? Math.round(scene.shadowSquared * 15) / 10 : scene.shadowSquared}`}
        </text>
      )}
    </svg>
  );
}

const GX = (value: number) => 16 + (value / 5) * 308;

function Gauge({ scene }: { scene: Scene }) {
  const after = scene.shadowSquared * 1.5;
  const pass = after >= BAND[0] && after <= BAND[1];
  return (
    <svg viewBox="0 0 340 62" className="mx-auto mt-2 h-auto w-full max-w-[560px]" role="img" aria-label="제곱 길이와 허용 띠 2.4에서 3.6">
      <rect x={GX(BAND[0])} y={10} width={GX(BAND[1]) - GX(BAND[0])} height={26} fill={AMBER} opacity={0.16} />
      <line x1={GX(0)} x2={GX(5)} y1={23} y2={23} stroke="#94a3b8" strokeWidth={1} />
      {[0, 1, 2, 3, 4, 5].map((tick) => (
        <g key={tick}>
          <line x1={GX(tick)} x2={GX(tick)} y1={19} y2={27} stroke="#94a3b8" strokeWidth={1} />
          <text x={GX(tick)} y={52} textAnchor="middle" fontSize={12} fill={GRAY}>{tick}</text>
        </g>
      ))}
      <text x={GX(BAND[0])} y={8} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>2.4</text>
      <text x={GX(BAND[1])} y={8} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>3.6</text>
      {!scene.showShadow && <circle cx={GX(3)} cy={23} r={5} fill={BLUE} />}
      {scene.showShadow && !scene.showScaled && <circle cx={GX(scene.shadowSquared)} cy={23} r={5} fill="var(--background)" stroke={AMBER} strokeWidth={1.25} />}
      {scene.showScaled && <circle cx={GX(after)} cy={23} r={5} fill={pass ? AMBER : RED} />}
    </svg>
  );
}

export default function RandomSubspaceViz() {
  return (
    <SceneShell
      eyebrow="3D · 무작위 부분공간"
      title="평면을 어떻게 뽑느냐에 따라 같은 배율로도 띠를 벗어납니다"
      description="뽑은 평면이 두 칸짜리 출력 공간입니다. 아래 눈금은 제곱 길이와 ε=0.2의 띠입니다."
      note="D=3, k=2와 세 평면은 설명용 가정입니다. 차이는 본문 두 점의 세 칸만 썼습니다."
      ariaLabel="차이 벡터를 평면에 사영하고 배율을 곱할 때의 제곱 길이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div>
            <div data-viz-live-only>
              <Scene3DCanvas
                build={(THREE, root) => build(THREE, root, scene)}
                sceneKey={active}
                labels={labelsFor(scene)}
                ariaLabel={`${scene.label}: ${scene.summary}`}
                fallback={<SideFallback scene={scene} />}
                azimuth={-0.785}
                elevation={0.45}
                distance={9}
                className="h-[190px] sm:h-[240px]"
              />
            </div>
            <Gauge scene={scene} />
          </div>
        );
      }}
    />
  );
}
