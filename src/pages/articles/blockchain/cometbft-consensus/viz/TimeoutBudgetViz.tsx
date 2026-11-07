import SceneShell from "./SceneShell";

/**
 * 본문 대응: #timeout — T_s(r)=T_{s,0}+rΔ_s. 칸 수는 모두 가정이다.
 * T0=2, Δ=1 → r=0..4에서 2,3,4,5,6칸. 안정된 delay 4.5칸이면 r=3(5칸)에서 처음 넘는다. 긴 base는 7칸.
 */
const BASE = 2;
const DELTA = 1;
const DELAY = 4.5;
const LONG_BASE = 7;
const MAX = 8;
const ROUNDS = [0, 1, 2, 3, 4];

const W = 360;
const H = 170;
const LEFT = 40;
const RIGHT = 12;
const TOP = 28;
const ROW = 27;
const x = (units: number) => LEFT + (units / MAX) * (W - LEFT - RIGHT);

interface Scene {
  label: string;
  summary: string;
  note: string;
  shown: number;
  long?: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "round 0", summary: "T = 2칸 (가정)", shown: 1, note: "칸 수는 설명용 가정이며 실제 값과 단위는 배포 설정에서 확인합니다. 점선은 GST(지연에 상한이 생기는 시점) 뒤의 안정된 delay입니다. 예산이 더 짧으면 정상 message도 늦었다고 보고 round가 바뀝니다." },
  { label: "round가 오르면", summary: "2 + r × 1", shown: 3, note: "Round가 하나 오를 때마다 delta(Δ, 여기서는 1칸)만큼 더 기다립니다. 3칸, 4칸은 아직 점선에 못 미칩니다." },
  { label: "점선을 넘는 round", summary: "T(3) = 5칸 > 4.5칸", shown: 5, note: "T가 안정된 delay보다 커지면 honest proposer와 vote가 같은 round에 모일 기회가 생깁니다. Timer가 block을 고르거나 Commit을 만들지는 않습니다." },
  { label: "처음부터 길게 잡으면", summary: "base 7칸 (가정)", shown: 1, long: true, note: "Timeout이 너무 길면 faulty proposer를 오래 기다립니다. 배포값을 고르려면 network delay와 round churn(round가 바뀌는 잦기)을 측정해야 합니다." },
];

export default function TimeoutBudgetViz() {
  return (
    <SceneShell
      eyebrow="round별 대기 예산"
      title="대기 예산이 늘어 결국 안정된 delay를 넘습니다"
      description="막대 길이가 한 step에서 기다리는 시간이고 눈금 한 칸이 설명용 단위입니다. Step마다 첫 대기 예산(base)과 round당 증가분(delta)을 따로 둡니다."
      ariaLabel="round가 오를수록 길어지는 timeout 막대와 안정된 delay 점선"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={x(DELAY)} y={14} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">안정된 delay 4.5칸 (가정)</text>
            {ROUNDS.map((round, index) => {
              const units = scene.long ? LONG_BASE + round * DELTA : BASE + round * DELTA;
              const visible = index < scene.shown;
              const y = TOP + index * ROW;
              const over = units > DELAY;
              return (
                <g key={round}>
                  <text x={LEFT - 6} y={y + 14} textAnchor="end" fontSize={12} opacity={visible ? 1 : 0.4} className="fill-muted-foreground">r={round}</text>
                  <rect x={LEFT} y={y} width={W - LEFT - RIGHT} height={20} fill="#94a3b8" opacity={0.12} rx={2} />
                  {visible && (
                    <rect x={LEFT} y={y} width={x(units) - LEFT} height={20} fill={over ? "#2563eb" : "#64748b"} rx={2} />
                  )}
                  {Array.from({ length: MAX - 1 }, (_, tick) => (
                    <line key={tick} x1={x(tick + 1)} x2={x(tick + 1)} y1={y} y2={y + 20} strokeWidth={1} className="stroke-background" />
                  ))}
                  {visible && <text x={LEFT + 6} y={y + 14} fontSize={12} fontWeight={700} fill="#ffffff">{units}칸</text>}
                </g>
              );
            })}
            <line x1={x(DELAY)} x2={x(DELAY)} y1={20} y2={H - 6} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
          </svg>
        );
      }}
    />
  );
}
