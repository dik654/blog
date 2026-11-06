import type { Group } from "three";
import Scene3DCanvas, { type Scene3DLabel, type Three, type Vec3 } from "@/components/viz/Scene3DCanvas";
import SceneShell from "./SceneShell";
import { addArrow, addBall, addDashed, addLine, addRod } from "./threeParts";

/**
 * 본문 대응: #latent-representation 접은 설명의 셋째 문단 — 중간 폭 r이면 미분의 rank도 r 이하라 더 많은 독립 방향을 보존할 수 없다.
 * 위가 접선 방향 둘을 가진 곡면, 아래가 폭 r의 통로입니다. 곡면과 "가로 좌표만 남기는" 부호화는 설명용(가정)입니다.
 * 곡면이 공간에서 어느 방향으로 눌리는지가 답이라 3D입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const FAINT = "#94a3b8";
const LIFT = 1.15;
const BOTTOM = -1.9;
const surface = (u: number, v: number): Vec3 => [u, LIFT + 0.1 * (u * u - v * v), v];

const SCENES = [
  { label: "곡면의 두 방향", summary: "접선 방향 2개", note: "곡면 위 한 점에서 곡면을 따라 움직이는 방향을 접선 방향이라 부르며, 여기서는 서로 독립인 둘입니다. 데이터 모양이 이렇다면 복원은 두 방향을 다 지켜야 합니다." },
  { label: "폭 1로 줄이기", summary: "주황 방향 → 한 점", note: "폭 1에는 숫자 하나만 지나갑니다. 가로 좌표만 남기면 주황 방향으로 움직여도 값이 같아 그 방향의 움직임이 0이 됩니다." },
  { label: "폭 1에서 복원하기", summary: "복원은 곡선 하나뿐", note: "숫자 하나에서 되돌리면 곡선 한 줄만 얻습니다. 미분의 rank는 지나가는 독립 방향의 수인데, 폭이 1이면 어떤 매끄러운 부호화든 1 이하입니다." },
  { label: "폭 2로 넓히기", summary: "두 방향 모두 지남", note: "통로 폭이 2이면 rank의 장애가 사라져 두 방향이 모두 지날 수 있습니다. 폭이 맞는다고 그런 표현을 학습이 찾는다는 뜻은 아닙니다." },
] as const;

function build(THREE: Three, root: Group, active: number) {
  const span = 2.1;
  const lines = 6;
  const faded = active === 2 ? 0.28 : 0.6;
  for (let i = 0; i <= lines; i += 1) {
    const fixed = -span + (i / lines) * span * 2;
    const alongU: Vec3[] = [];
    const alongV: Vec3[] = [];
    for (let j = 0; j <= 24; j += 1) {
      const t = -span + (j / 24) * span * 2;
      alongU.push(surface(t, fixed));
      alongV.push(surface(fixed, t));
    }
    addLine(THREE, root, alongU, FAINT, faded);
    addLine(THREE, root, alongV, FAINT, faded);
  }

  const curve = (fn: (t: number) => Vec3, color: string) => {
    for (let j = 0; j < 24; j += 1) {
      const a = -span + (j / 24) * span * 2;
      const b = -span + ((j + 1) / 24) * span * 2;
      addRod(THREE, root, fn(a), fn(b), color, 0.03);
    }
  };

  if (active === 0 || active === 3) {
    addBall(THREE, root, surface(0, 0), RED, 0.1);
    addArrow(THREE, root, surface(0, 0), [1.7, LIFT, 0], BLUE, 0.045);
    addArrow(THREE, root, surface(0, 0), [0, LIFT, 1.7], AMBER, 0.045);
  }
  if (active === 1 || active === 2) addRod(THREE, root, [-span - 0.3, BOTTOM, 0], [span + 0.3, BOTTOM, 0], "#475569", 0.05);
  if (active === 1) {
    const u0 = 0.7;
    curve((t) => surface(u0, t), AMBER);
    [-span, -1, 0, 1, span].forEach((v) => addDashed(THREE, root, surface(u0, v), [u0, BOTTOM, 0], AMBER));
    addBall(THREE, root, [u0, BOTTOM, 0], RED, 0.13);
  }
  if (active === 2) curve((t) => surface(t, 0), BLUE);
  if (active === 3) {
    const half = span + 0.2;
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(half * 2, half * 2),
      new THREE.MeshBasicMaterial({ color: "#64748b", transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false }),
    );
    plate.rotation.x = -Math.PI / 2;
    plate.position.y = BOTTOM;
    root.add(plate);
    addLine(THREE, root, [[-half, BOTTOM, -half], [half, BOTTOM, -half], [half, BOTTOM, half], [-half, BOTTOM, half], [-half, BOTTOM, -half]], "#64748b", 0.8);
    addArrow(THREE, root, [0, BOTTOM, 0], [1.3, BOTTOM, 0], BLUE);
    addArrow(THREE, root, [0, BOTTOM, 0], [0, BOTTOM, 1.3], AMBER);
    addDashed(THREE, root, surface(0, 0), [0, BOTTOM, 0], "#64748b");
  }
  return {};
}

function labelsFor(active: number): readonly Scene3DLabel[] {
  if (active === 0) return [
    { text: "방향 1", at: [2.1, LIFT + 0.34, 0] },
    { text: "방향 2", at: [-0.2, LIFT - 0.5, 2], tone: "accent" },
  ];
  if (active === 1) return [
    { text: "폭 1의 통로", at: [-1.8, BOTTOM - 0.34, 0] },
    { text: "모두 같은 값", at: [2.9, BOTTOM - 0.15, 0], tone: "accent" },
  ];
  if (active === 2) return [
    { text: "복원되는 곡선", at: [1.4, LIFT + 0.75, 0], tone: "accent" },
    { text: "폭 1의 통로", at: [-1.6, BOTTOM - 0.34, 0] },
  ];
  return [
    { text: "폭 2의 통로", at: [-1.4, BOTTOM - 0.34, 1.4] },
    { text: "두 방향 모두", at: [1.4, BOTTOM + 0.4, 0.8], tone: "accent" },
  ];
}

function FlatFallback({ active }: { active: number }) {
  const narrow = active === 1 || active === 2;
  return (
    <svg viewBox="0 0 340 200" className="mx-auto h-full w-full max-w-[420px]" role="img" aria-label={SCENES[active].summary}>
      <rect x={110} y={14} width={120} height={70} fill="none" stroke={FAINT} strokeWidth={1} />
      <text x={102} y={54} textAnchor="end" fontSize={12} fill="#64748b">곡면</text>
      {active !== 2 && <line x1={170} y1={50} x2={214} y2={50} stroke={BLUE} strokeWidth={1.25} />}
      {active !== 2 && <line x1={170} y1={50} x2={170} y2={22} stroke={AMBER} strokeWidth={1.25} />}
      {active === 2 && <line x1={118} y1={50} x2={222} y2={50} stroke={BLUE} strokeWidth={1.25} />}
      {active === 0 && <text x={170} y={110} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">독립인 두 방향</text>}
      {narrow && (
        <g>
          <line x1={110} y1={150} x2={230} y2={150} stroke="#475569" strokeWidth={1.25} />
          <text x={102} y={154} textAnchor="end" fontSize={12} fill="#64748b">폭 1</text>
          {active === 1 && <line x1={170} y1={84} x2={170} y2={146} stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />}
          {active === 1 && <circle cx={170} cy={150} r={4} fill={RED} />}
          <text x={170} y={178} textAnchor="middle" fontSize={12} fill="#64748b">{active === 1 ? "주황 방향은 한 점으로 눌림" : "되돌려도 곡선 한 줄뿐"}</text>
        </g>
      )}
      {active === 3 && (
        <g>
          <rect x={110} y={116} width={120} height={60} fill="none" stroke="#475569" strokeWidth={1} />
          <text x={102} y={150} textAnchor="end" fontSize={12} fill="#64748b">폭 2</text>
          <line x1={170} y1={146} x2={214} y2={146} stroke={BLUE} strokeWidth={1.25} />
          <line x1={170} y1={146} x2={170} y2={124} stroke={AMBER} strokeWidth={1.25} />
          <text x={170} y={194} textAnchor="middle" fontSize={12} fill="#64748b">두 방향 모두 지남</text>
        </g>
      )}
    </svg>
  );
}

export default function TangentBottleneckViz() {
  return (
    <SceneShell
      eyebrow="3D · 곡면과 좁은 통로"
      title="폭이 방향의 수보다 좁으면 한 방향은 지나가지 못합니다"
      description="위가 데이터가 놓인 곡면, 아래가 중간 폭 r의 통로입니다."
      note="곡면과 부호화 규칙은 설명용 가정입니다. 유한 표본의 암기가 아니라 매끄러운 복원의 이야기입니다."
      ariaLabel="접선 방향 두 개를 가진 곡면이 폭 1과 폭 2의 통로를 지나는 모습"
      scenes={SCENES}
      render={(active) => (
        <div data-viz-live-only>
          <Scene3DCanvas
            build={(THREE, root) => build(THREE, root, active)}
            sceneKey={active}
            labels={labelsFor(active)}
            ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}
            fallback={<FlatFallback active={active} />}
            azimuth={-0.55}
            elevation={0.46}
            distance={9}
            className="h-[220px] sm:h-[340px]"
          />
        </div>
      )}
    />
  );
}
