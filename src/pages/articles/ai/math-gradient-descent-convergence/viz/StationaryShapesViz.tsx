import type { Group } from "three";
import Scene3DCanvas, { type Scene3DLabel, type Three } from "@/components/viz/Scene3DCanvas";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stopping-boundary — x², −x², x²−y²는 모두 원점에서 기울기 0.
 * 앞의 두 함수는 입력이 하나라 평면 곡선으로 그립니다. 비스듬한 3D 시점에서는 빨간 점이 바닥이나 꼭대기로 보이지 않았습니다.
 * 셋째 함수만 두 입력의 곡면이라 3D이고, 낮은 시점으로 두 단면이 모두 원점에서 올라가고 내려가게 보입니다.
 */
const SCENES = [
  { label: "x²", summary: "기울기 0 · 주변보다 낮음", note: "입력이 하나인 함수입니다. 원점에서 어느 쪽으로 가도 값이 커지므로 주변보다 낮습니다." },
  { label: "−x²", summary: "기울기 0 · 주변보다 높음", note: "기울기는 똑같이 0이지만 어느 쪽으로 가도 값이 작아집니다. 원점이 주변보다 높습니다." },
  { label: "x²−y²", summary: "기울기 0 · 방향마다 다름", note: "x 방향으로 가면 커지고 y 방향으로 가면 작아집니다. 이런 곳을 안장점이라 합니다. 기울기 0만 보고는 앞의 두 경우와 구별되지 않습니다." },
] as const;

const SPAN = 3;
const HEIGHT = 1.6;
const AMBER = "#d97706";
const BLUE = "#2563eb";
const GRAY = "#94a3b8";
const RED = "#dc2626";

const SADDLE_LABELS: readonly Scene3DLabel[] = [
  { text: "x 방향: 올라감", at: [2.7, 2.05, 0] },
  { text: "y 방향: 내려감", at: [0, -2.05, 2.7] },
  { text: "기울기 0", at: [0, 0.62, 0], tone: "accent" },
];

function section(THREE: Three, root: Group, point: (s: number) => [number, number, number], color: string) {
  const curve = new THREE.CatmullRomCurve3(
    Array.from({ length: 41 }, (_, index) => {
      const [x, y, z] = point(-1 + index / 20);
      return new THREE.Vector3(x, y, z);
    }),
  );
  root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.035, 6, false), new THREE.MeshBasicMaterial({ color })));
}

function line(THREE: Three, root: Group, points: readonly (readonly [number, number, number])[], color: string, opacity = 1) {
  root.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points.map(([x, y, z]) => new THREE.Vector3(x, y, z))),
      new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }),
    ),
  );
}

function buildSaddle(THREE: Three, root: Group) {
  line(THREE, root, [[-SPAN, 0, 0], [SPAN, 0, 0]], GRAY);
  line(THREE, root, [[0, 0, -SPAN], [0, 0, SPAN]], GRAY);
  root.add(new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), new THREE.MeshBasicMaterial({ color: RED })));

  const size = 24;
  const positions: number[] = [];
  const index: number[] = [];
  const height = (u: number, v: number) => HEIGHT * (u * u - v * v);
  for (let i = 0; i <= size; i += 1) {
    for (let j = 0; j <= size; j += 1) {
      const u = -1 + (2 * i) / size;
      const v = -1 + (2 * j) / size;
      positions.push(u * SPAN, height(u, v), v * SPAN);
      if (i < size && j < size) {
        const a = i * (size + 1) + j;
        const b = a + size + 1;
        index.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const surface = new THREE.BufferGeometry();
  surface.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  surface.setIndex(index);
  root.add(new THREE.Mesh(surface, new THREE.MeshBasicMaterial({ color: "#64748b", transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })));

  for (let k = -3; k <= 3; k += 1) {
    if (k === 0) continue;
    const fixed = k / 3;
    const across = Array.from({ length: 25 }, (_, n) => {
      const u = -1 + n / 12;
      return [u * SPAN, height(u, fixed), fixed * SPAN] as const;
    });
    const along = Array.from({ length: 25 }, (_, n) => {
      const v = -1 + n / 12;
      return [fixed * SPAN, height(fixed, v), v * SPAN] as const;
    });
    line(THREE, root, across, "#64748b", 0.55);
    line(THREE, root, along, "#64748b", 0.55);
  }
  section(THREE, root, (s) => [s * SPAN, height(s, 0), 0], AMBER);
  section(THREE, root, (s) => [0, height(0, s), s * SPAN], BLUE);
  return {};
}

function Curve({ title, sign, color }: { title: string; sign: 1 | -1; color: string }) {
  const points = Array.from({ length: 41 }, (_, index) => {
    const s = -1 + index / 20;
    return `${50 + s * 42},${50 - sign * s * s * 34 + sign * 17}`;
  }).join(" ");
  return (
    <div className="min-w-0 flex-1 text-center">
      <svg viewBox="0 0 100 100" className="mx-auto h-[150px] w-full max-w-[200px] sm:h-[250px] sm:max-w-[300px]" aria-hidden>
        <line x1={6} x2={94} y1={50 + sign * 17} y2={50 + sign * 17} stroke={GRAY} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <polyline points={points} fill="none" stroke={color} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
        <circle cx={50} cy={50 + sign * 17} r={2.4} fill={RED} />
      </svg>
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
    </div>
  );
}

/** 입력이 하나인 함수의 곡선입니다. 가로선은 빨간 점에 닿는 기울기 0의 직선입니다. */
function FlatCurve({ active }: { active: number }) {
  const sign = active === 0 ? 1 : -1;
  const originY = sign === 1 ? 160 : 50;
  const points = Array.from({ length: 41 }, (_, index) => {
    const s = -1 + index / 20;
    return `${160 + s * 130},${originY - sign * s * s * 120}`;
  }).join(" ");
  return (
    <div className="flex h-[230px] items-center justify-center sm:h-[320px]">
      <svg viewBox="0 0 320 210" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
        <line x1={14} x2={306} y1={originY} y2={originY} stroke={GRAY} strokeWidth={1} />
        <polyline points={points} fill="none" stroke={BLUE} strokeWidth={1.25} />
        <circle cx={160} cy={originY} r={5} fill={RED} />
        <text x={312} y={originY + 4} fontSize={12} fill="#64748b">x</text>
        <text x={160} y={originY + sign * 20 + (sign === 1 ? 0 : 4)} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>기울기 0</text>
        <text x={160} y={sign === 1 ? 70 : 150} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>{sign === 1 ? "양쪽으로 가면 올라감" : "양쪽으로 가면 내려감"}</text>
      </svg>
    </div>
  );
}

/** WebGL을 쓸 수 없을 때: 원점을 지나는 두 단면을 나란히 놓아 같은 결론을 보입니다. */
function SectionsFallback() {
  return (
    <div role="img" aria-label={`${SCENES[2].label}: ${SCENES[2].summary}`} className="flex h-full items-center justify-center gap-3">
      <Curve title="x 방향 단면: 올라감" sign={1} color={AMBER} />
      <Curve title="y 방향 단면: 내려감" sign={-1} color={BLUE} />
    </div>
  );
}

function SaddleStage() {
  return (
    <div data-viz-live-only>
      <Scene3DCanvas
        build={buildSaddle}
        sceneKey="saddle"
        labels={SADDLE_LABELS}
        ariaLabel={`${SCENES[2].label}: ${SCENES[2].summary}`}
        azimuth={-0.5}
        elevation={0.24}
        distance={10.5}
        className="h-[230px] sm:h-[320px]"
        fallback={<SectionsFallback />}
      />
    </div>
  );
}

export default function StationaryShapesViz() {
  return (
    <SceneShell
      eyebrow="기울기가 0인 세 자리"
      title="기울기가 똑같이 0이어도 주변의 모양은 다릅니다"
      description="빨간 점이 원점이고 세로 방향이 함수값입니다. 세 함수 모두 원점에서 기울기가 0이며, 입력이 둘인 셋째 함수만 곡면으로 그립니다."
      ariaLabel="x제곱, 음의 x제곱, x제곱 빼기 y제곱의 원점 주변 모양"
      scenes={SCENES}
      render={(active) => (active < 2 ? <FlatCurve active={active} /> : <SaddleStage />)}
    />
  );
}
