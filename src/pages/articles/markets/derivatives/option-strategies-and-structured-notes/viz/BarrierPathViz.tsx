import SceneShell from "./SceneShell";
import type { ShellScene } from "./SceneShell";

/**
 * 본문 대응: #case — 연 8 쿠폰 장벽형 채권, 장벽 70, 접촉 뒤 만기 60이면 원금 60 가능.
 * #picture·#names — 만기 가격만 보는 손익표는 장중 장벽 접촉을 놓칠 수 있고, 만기 종가가 같아도 접촉 여부가 다르면 지급이 달라질 수 있음.
 * 경로 모양과 종가 85는 설명용 가정. 접촉 뒤 종가 85일 때의 금액은 본문에 없어 적지 않습니다.
 */
const W = 360;
const H = 220;
const LEFT = 40;
const RIGHT = 312;
const TOP = 24;
const BOTTOM = 186;
const P_MIN = 50;
const P_MAX = 115;
const py = (p: number) => TOP + ((P_MAX - p) / (P_MAX - P_MIN)) * (BOTTOM - TOP);
const tx = (t: number) => LEFT + t * (RIGHT - LEFT);

type Path = readonly (readonly [number, number])[];
/** (시간 비율 0~1, 지수) — 모양은 가정. */
const PATH_A: Path = [[0, 100], [0.15, 94], [0.3, 97], [0.45, 84], [0.6, 80], [0.75, 88], [0.9, 83], [1, 85]];
const PATH_B: Path = [[0, 100], [0.15, 92], [0.3, 82], [0.42, 66], [0.55, 72], [0.7, 80], [0.85, 79], [1, 85]];
const PATH_C: Path = [[0, 100], [0.15, 90], [0.3, 78], [0.45, 68], [0.6, 72], [0.75, 64], [0.9, 62], [1, 60]];
const pts = (path: Path) => path.map(([t, p]) => `${tx(t)},${py(p)}`).join(" ");

interface PathScene extends ShellScene {
  show: readonly ("A" | "B" | "C")[];
  endsOnly: boolean;
}

const SCENES: readonly PathScene[] = [
  { label: "경로 A: 장벽을 건드리지 않음", summary: "종가 85 · 70 접촉 없음", show: ["A"], endsOnly: false, note: "지수가 내려가도 기간 내내 70 위에 머물렀습니다. 이 사례의 장벽 조건은 70 아래로 내려간 적이 있을 때 붙으므로 여기서는 발동하지 않습니다." },
  { label: "경로 B: 같은 종가, 다른 경로", summary: "종가 85 · 70 접촉 있음", show: ["A", "B"], endsOnly: false, note: "경로 B는 중간에 70 아래로 내려갔다가 A와 같은 85에서 끝났습니다. 만기 종가가 같아도 접촉 여부가 다르면 두 경로의 지급이 달라질 수 있습니다. 이때 금액은 상품 조건마다 달라 본문에 없습니다." },
  { label: "경로 C: 접촉 뒤 60에서 끝남", summary: "원금 100 → 60 가능", show: ["C"], endsOnly: false, note: "70 아래로 내려간 적이 있고 만기 60에서 끝나면 원금이 60으로 줄 수 있습니다. 연 8의 쿠폰은 공짜 이자가 아니라 투자자가 판 하락 옵션의 대가일 수 있습니다." },
  { label: "만기 가격만 본 손익표", summary: "A와 B가 같은 점으로 보임", show: ["A", "B"], endsOnly: true, note: "끝 점만 남기면 A와 B는 둘 다 85라서 구분되지 않습니다. 만기 가격만 보는 손익표로는 장중 장벽 접촉 조건을 놓칠 수 있는 이유입니다." },
];

const STYLE = {
  A: { color: "#2563eb", dash: undefined as string | undefined, name: "A" },
  B: { color: "#d97706", dash: "5 3" as string | undefined, name: "B" },
  C: { color: "#b91c1c", dash: undefined as string | undefined, name: "C" },
} as const;
const PATHS = { A: PATH_A, B: PATH_B, C: PATH_C } as const;

function touchPoint(path: Path) {
  return path.find(([, p]) => p < 70);
}

function BarrierChart({ scene }: { scene: number }) {
  const s = SCENES[scene];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
      <line x1={LEFT} x2={RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
      <line x1={LEFT} x2={LEFT} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
      {[60, 70, 85, 100].map((p) => (
        <text key={p} x={LEFT - 6} y={py(p) + 4} textAnchor="end" fontSize={10} fill={p === 70 ? "#b91c1c" : "#64748b"}>{p}</text>
      ))}
      <line x1={LEFT} x2={RIGHT} y1={py(70)} y2={py(70)} stroke="#b91c1c" strokeWidth={1} strokeDasharray="4 3" />
      <text x={LEFT + 4} y={py(70) - 5} fontSize={11} fill="#b91c1c">장벽 70</text>
      <line x1={LEFT} x2={RIGHT} y1={py(100)} y2={py(100)} stroke="#e2e8f0" strokeWidth={1} />
      <text x={LEFT + 4} y={py(100) - 6} fontSize={10} fill="#64748b">출발 100</text>
      <text x={LEFT} y={BOTTOM + 16} fontSize={10} fill="#64748b">발행</text>
      <text x={RIGHT} y={BOTTOM + 16} textAnchor="end" fontSize={10} fill="#64748b">만기 →</text>
      <text x={(LEFT + RIGHT) / 2} y={BOTTOM + 16} textAnchor="middle" fontSize={10} fill="#64748b">기간 중 (경로 모양은 가정)</text>
      {s.show.map((key) => {
        const path = PATHS[key];
        const style = STYLE[key];
        const end = path[path.length - 1];
        const touch = touchPoint(path);
        return (
          <g key={key}>
            {!s.endsOnly && <polyline points={pts(path)} fill="none" stroke={style.color} strokeWidth={1.25} strokeDasharray={style.dash} />}
            {!s.endsOnly && touch && (
              <g>
                <circle cx={tx(touch[0])} cy={py(touch[1])} r={5} fill="none" stroke="#b91c1c" strokeWidth={1.25} />
                <text x={tx(touch[0])} y={py(touch[1]) + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b91c1c">{`${style.name} 접촉`}</text>
              </g>
            )}
            <circle cx={tx(end[0])} cy={py(end[1])} r={4} fill={style.color} />
            <text x={tx(end[0]) + 8} y={py(end[1]) + (key === "B" ? 14 : key === "A" ? -6 : 4)} fontSize={11} fontWeight={700} fill={style.color}>{`${style.name} ${end[1]}`}</text>
          </g>
        );
      })}
      {s.endsOnly && <text x={(LEFT + RIGHT) / 2} y={py(100) + 26} textAnchor="middle" fontSize={11} fill="#64748b">경로를 지우면 접촉 기록도 사라집니다</text>}
    </svg>
  );
}

export default function BarrierPathViz() {
  return (
    <SceneShell
      eyebrow="장벽 조건"
      title="만기 종가가 같아도 중간에 70을 건드렸는지가 갈립니다"
      description="장벽은 기간 중 지수가 한 번이라도 건드렸는지를 보는 선입니다. 장벽 70과 만기 60은 본문 사례, 경로 모양과 종가 85는 설명용 가정입니다."
      ariaLabel="장벽 70을 건드린 경로와 건드리지 않은 경로의 비교"
      scenes={SCENES}
      render={(index) => <BarrierChart scene={index} />}
    />
  );
}
