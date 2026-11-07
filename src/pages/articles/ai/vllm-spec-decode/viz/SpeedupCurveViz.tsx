import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #speedup-model — N(K)=Σαⁱ는 포화하고 C(K)=1+Kc는 곧게 늘어 S=N/C에 꼭대기가 생긴다.
 * α=.6,c=.05 최대 K=4 / α=.9,c=.05 K=1~8의 최대 K=8 / α=.8,K=5: c=.05 → 2.951424, c=.5 → 1.05408.
 */
interface Scene extends ShellScene {
  alpha: number;
  c: number;
  mark: number;
}

const SCENES: readonly Scene[] = [
  { label: "α=.6, c=.05", summary: "K=1~8의 최댓값은 K=4", alpha: 0.6, c: 0.05, mark: 4, note: "K를 하나 늘리면 비용은 언제나 c만큼 늘지만 얻는 확정 수는 αᴷ로 줄어듭니다. 그래서 S가 꺾입니다." },
  { label: "α=.9, c=.05", summary: "K=8에서 가장 큼", alpha: 0.9, c: 0.05, mark: 8, note: "K=8까지도 오릅니다. 다만 탐색한 범위의 최댓값이고 전체 정수 K의 최적을 뜻하지는 않습니다." },
  { label: "α=.8, c=.05", summary: "K=5 → 3.68928 ÷ 1.25 = 2.951424", alpha: 0.8, c: 0.05, mark: 5, note: "다음 장면과 비교할 기준입니다. 평균 확정 수 3.68928을 비용 1+5×.05=1.25로 나눕니다. 점은 꼭대기가 아니라 계산 예이고, 이 값에서 S는 K=8까지 계속 오릅니다." },
  { label: "α=.8, c=.5", summary: "K=5 → 3.68928 ÷ 3.5 ≈ 1.05408", alpha: 0.8, c: 0.5, mark: 5, note: "α>c라 K=1은 이득이지만 K=6부터 S가 1 아래입니다. α>c는 이득인 어떤 K가 존재할 조건이지 모든 K를 보장하지 않습니다. 점도 계산 예일 뿐 꼭대기는 K=2(S=1.22)입니다." },
  { label: "α=c=.5 (가정)", summary: "K=1에서 S=1 · 그 뒤로 1 아래", alpha: 0.5, c: 0.5, mark: 1, note: "α=c이면 K=1은 기준 모델과 같고, α≤c이면 어떤 양의 K도 1을 넘지 못합니다. 이 값은 경계를 보이려는 가정입니다." },
];

const KS = [1, 2, 3, 4, 5, 6, 7, 8];
const W = 360;
const H = 212;
const LEFT = 26;
const RIGHT = 10;
const TOP = 12;
const BOTTOM = 190;
const Y_MAX = 7;
const BLUE = "#2563eb";
const GREEN = "#059669";
const GRAY = "#64748b";
const RED = "#dc2626";

const xOf = (k: number) => LEFT + ((k - 1) / 7) * (W - LEFT - RIGHT);
const yOf = (value: number) => BOTTOM - (value / Y_MAX) * (BOTTOM - TOP);
const numerator = (alpha: number, k: number) => Array.from({ length: k + 1 }, (_, i) => alpha ** i).reduce<number>((sum, term) => sum + term, 0);
const cost = (k: number, c: number) => 1 + k * c;
const speedup = (alpha: number, k: number, c: number) => numerator(alpha, k) / cost(k, c);
const pathOf = (value: (k: number) => number) => KS.map((k, index) => `${index === 0 ? "M" : "L"}${xOf(k).toFixed(1)} ${yOf(value(k)).toFixed(1)}`).join(" ");

const LEGEND = [
  { name: "S(K) 시간 개선 비", color: BLUE, dash: undefined },
  { name: "N(K) 평균 확정 수", color: GREEN, dash: "5 3" },
  { name: "C(K) 전체 비용", color: GRAY, dash: "2 3" },
];

export default function SpeedupCurveViz() {
  return (
    <SceneShell
      eyebrow="단순 비용 모형"
      title="분자는 포화하고 분모는 곧게 늘어 K에 꼭대기가 생깁니다"
      description="가로축은 후보 깊이 K입니다. 검증 비용 1, 나머지 비용 0으로 둔 논문의 단순화이므로 실제 서버의 곡선이 아닙니다."
      ariaLabel="후보 깊이 K에 따른 평균 확정 수, 비용, 시간 개선 비"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const markValue = speedup(scene.alpha, scene.mark, scene.c);
        const markX = xOf(scene.mark);
        const nearRight = scene.mark >= 6;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[0, 2, 4, 6].map((tick) => (
                <g key={tick}>
                  <line x1={LEFT} x2={W - RIGHT} y1={yOf(tick)} y2={yOf(tick)} stroke="#94a3b8" strokeWidth={1} opacity={tick === 0 ? 1 : 0.25} />
                  <text x={LEFT - 6} y={yOf(tick) + 4} textAnchor="end" fontSize={11} fill={GRAY}>{tick}</text>
                </g>
              ))}
              <line x1={LEFT} x2={W - RIGHT} y1={yOf(1)} y2={yOf(1)} stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
              <text x={LEFT - 6} y={yOf(1) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={RED}>1</text>
              {KS.map((k) => (
                <text key={k} x={xOf(k)} y={BOTTOM + 16} textAnchor="middle" fontSize={11} fill={GRAY}>{k}</text>
              ))}
              <path d={pathOf((k) => cost(k, scene.c))} fill="none" stroke={GRAY} strokeWidth={1} strokeDasharray="2 3" />
              <path d={pathOf((k) => numerator(scene.alpha, k))} fill="none" stroke={GREEN} strokeWidth={1} strokeDasharray="5 3" />
              <path d={pathOf((k) => speedup(scene.alpha, k, scene.c))} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <line x1={markX} x2={markX} y1={yOf(markValue)} y2={TOP + 6} stroke={BLUE} strokeWidth={1} strokeDasharray="2 2" />
              <circle cx={markX} cy={yOf(markValue)} r={4} fill={BLUE} />
              <text
                x={nearRight ? markX - 6 : markX + 6}
                y={TOP + 12}
                textAnchor={nearRight ? "end" : "start"}
                fontSize={12}
                fontWeight={700}
                fill={BLUE}
              >
                K={scene.mark} · S={markValue.toFixed(3)}
              </text>
            </svg>
            <ul className="mx-auto mt-1 flex max-w-[600px] flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              {LEGEND.map((item) => (
                <li key={item.name} className="flex items-center gap-1.5">
                  <svg width="22" height="6" aria-hidden="true" className="shrink-0">
                    <line x1="0" x2="22" y1="3" y2="3" stroke={item.color} strokeWidth={1.25} strokeDasharray={item.dash} />
                  </svg>
                  {item.name}
                </li>
              ))}
              <li className="flex items-center gap-1.5">
                <svg width="22" height="6" aria-hidden="true" className="shrink-0">
                  <line x1="0" x2="22" y1="3" y2="3" stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
                </svg>
                S=1 손익 경계
              </li>
            </ul>
          </div>
        );
      }}
    />
  );
}
