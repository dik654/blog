import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison (8·9절 숫자). M=[[2,0],[1.8,2.4]], k₁=(1,0), 목표 v=(5,0), α=1.
 * k₁ 읽기 = 현재 읽기 S=(2,1.8) − 지운 양 + 쓴 양.
 *  erase 0·write 1      : 지움 (0,0),       씀 (5,0)   → (7,1.8)
 *  erase 1·write 1 (β=1): 지움 (2,1.8),     씀 (5,0)   → (5,0)
 *  scalar β=0.5         : 지움 (1,0.9),     씀 (2.5,0) → (3.5,0.9)
 *  GDN2 b=(.25,1) w=(.5,1): 지움 (0.5,0.45), 씀 (2.5,0) → (4,1.35)
 */
type Pt = readonly [number, number];
const START: Pt = [2, 1.8];
const TARGET: Pt = [5, 0];

const SCENES = [
  { label: "지우기 없이 쓰기", summary: "결과 (7, 1.8)", erase: [0, 0] as Pt, write: [5, 0] as Pt, note: "erase=0, write=1이면 (2,1.8)에서 아무것도 빼지 않고 (5,0)을 더해 (7,1.8)이 됩니다(8절)." },
  { label: "모두 지우고 쓰기 (β=1)", summary: "결과 (5, 0)", erase: [2, 1.8] as Pt, write: [5, 0] as Pt, note: "현재 읽기 (2,1.8)을 모두 빼서 원점으로 간 뒤 (5,0)을 씁니다. 결과가 목표 (5,0)과 같습니다." },
  { label: "scalar β=0.5", summary: "결과 (3.5, 0.9)", erase: [1, 0.9] as Pt, write: [2.5, 0] as Pt, note: "β 하나가 둘 다 절반으로 줄여 (1,0.9)를 빼고 (2.5,0)을 씁니다. 결과 (3.5,0.9)는 현재 읽기와 목표를 잇는 점선의 정가운데입니다." },
  { label: "GDN2: 지우기·쓰기 따로", summary: "결과 (4, 1.35)", erase: [0.5, 0.45] as Pt, write: [2.5, 0] as Pt, note: "k₁=(1,0)이라 erase b=(0.25,1)은 0.25만 작용해 (0.5,0.45)를 빼고, write w=(0.5,1)은 (2.5,0)을 씁니다. (4,1.35)는 점선 밖이며, 더 낫다는 보장은 아닙니다." },
] as const;

const X0 = 40;
const PX = 40; // x 1 = 40px
const Y0 = 176;
const PY = 64; // y 1 = 64px
const sx = (x: number) => X0 + x * PX;
const sy = (y: number) => Y0 - y * PY;

const C_ERASE = "#dc2626";
const C_WRITE = "#2563eb";

function Seg({ a, b, color, dashed }: { a: Pt; b: Pt; color: string; dashed?: boolean }) {
  const [x1, y1, x2, y2] = [sx(a[0]), sy(a[1]), sx(b[0]), sy(b[1])];
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 1) return null;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const h = 7;
  const pts = `${x2},${y2} ${x2 - h * ux + 3.5 * uy},${y2 - h * uy - 3.5 * ux} ${x2 - h * ux - 3.5 * uy},${y2 - h * uy + 3.5 * ux}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - h * ux} y2={y2 - h * uy} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={pts} fill={color} />
    </g>
  );
}

export default function GateOutcomePlaneViz() {
  return (
    <SceneShell
      eyebrow="지우는 양과 쓰는 양"
      title="지우기와 쓰기를 따로 줄이면 결과가 점선 밖으로 나갈 수 있습니다"
      description="평면의 한 점이 k₁로 읽은 두 숫자입니다(가로 = 첫 숫자, 세로 = 둘째 숫자). 빨간 화살표(지움)는 현재 읽기에서 지운 양, 파란 화살표(씀)는 새로 쓴 양입니다. 점선은 β 하나로 둘을 함께 줄일 때 결과가 놓이는 자리로, β=0이면 현재 읽기, β=1이면 목표입니다. 같은 M, 목표 (5,0), α=1인 본문 사례입니다."
      ariaLabel="erase와 write 설정에 따라 첫 key의 읽기가 평면 위 어디로 가는지 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const mid: Pt = [START[0] - s.erase[0], START[1] - s.erase[1]];
        const end: Pt = [mid[0] + s.write[0], mid[1] + s.write[1]];
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            <line x1={sx(0)} y1={sy(0)} x2={sx(7.6)} y2={sy(0)} stroke="#94a3b8" strokeWidth={1} />
            <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(2.2)} stroke="#94a3b8" strokeWidth={1} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((t) => (
              <text key={t} x={sx(t)} y={sy(0) + 14} textAnchor="middle" fontSize={11} fill="#64748b">{t}</text>
            ))}
            {[1, 2].map((t) => (
              <g key={t}>
                <line x1={sx(0) - 3} x2={sx(0)} y1={sy(t)} y2={sy(t)} stroke="#94a3b8" strokeWidth={1} />
                <text x={sx(0) - 6} y={sy(t) + 3} textAnchor="end" fontSize={11} fill="#64748b">{t}</text>
              </g>
            ))}
            <text x={sx(7.6)} y={sy(0) + 30} textAnchor="end" fontSize={11} fill="#64748b">읽기의 첫 숫자 →</text>
            <text x={sx(0) + 4} y={sy(2.2) + 4} fontSize={11} fill="#64748b">↑ 둘째 숫자</text>
            {/* 현재 읽기 → 목표 점선 */}
            <line x1={sx(START[0])} y1={sy(START[1])} x2={sx(TARGET[0])} y2={sy(TARGET[1])} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <Seg a={START} b={mid} color={C_ERASE} />
            <Seg a={mid} b={end} color={C_WRITE} />
            {s.erase[0] > 0 && (
              <text x={sx((START[0] + mid[0]) / 2) - 10} y={sy((START[1] + mid[1]) / 2) - 2} textAnchor="end" fontSize={11} fontWeight={700} fill={C_ERASE}>지움</text>
            )}
            <text x={sx((mid[0] + end[0]) / 2)} y={sy(mid[1]) - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={C_WRITE}>씀</text>
            <circle cx={sx(START[0])} cy={sy(START[1])} r={4.5} fill="#64748b" />
            <text x={sx(START[0]) - 6} y={sy(START[1]) - 9} textAnchor="middle" fontSize={12} fill="#64748b">현재 (2,1.8)</text>
            <rect x={sx(TARGET[0]) - 5} y={sy(TARGET[1]) - 5} width={10} height={10} fill="none" stroke="#16a34a" strokeWidth={1.25} />
            <text x={sx(TARGET[0]) - 9} y={sy(TARGET[1]) - 9} textAnchor="end" fontSize={12} fill="#16a34a">목표</text>
            <circle cx={sx(end[0])} cy={sy(end[1])} r={5} fill="none" stroke={C_WRITE} strokeWidth={1.25} />
            <circle cx={sx(end[0])} cy={sy(end[1])} r={2} fill={C_WRITE} />
            <text
              x={Math.min(sx(end[0]) + 8, 352)}
              y={sy(end[1]) - 10}
              textAnchor={end[0] > 6 ? "end" : "start"}
              fontSize={13}
              fontWeight={700}
              fill={C_WRITE}
            >
              {`결과 (${end[0]},${Math.round(end[1] * 100) / 100})`}
            </text>
          </svg>
        );
      }}
    />
  );
}
