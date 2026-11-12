import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ema — β=0.9에서 j단계 전 신호의 상대 가중치 0.9^j, 실제 계수 0.1×0.9^j.
 * j=10: 0.9^10 ≈ 0.348678, 0.1×0.9^10 ≈ 0.034868. 최근 10개만 남기는 창과 달리 j≥10도 0이 아니다.
 */
const AGES = Array.from({ length: 15 }, (_, j) => j);
const REL = AGES.map((j) => 0.9 ** j);

const SCENES = [
  { label: "상대 가중치", summary: "0.9¹⁰ ≈ 0.349", note: "한 단계 오래될 때마다 이번 신호 대비 몫에 0.9가 한 번 더 곱해집니다. 10단계 전 신호(파랑)는 이번 신호의 약 0.349배입니다." },
  { label: "정규화한 평균의 실제 계수", summary: "0.1 × 0.9¹⁰ ≈ 0.0349", note: "정규화한 EMA는 새 신호에 1−β=0.1을 곱하므로 모양은 같고 높이만 10분의 1입니다. 점선이 앞 장면의 상대 가중치입니다." },
  { label: "최근 10개 창과 비교", summary: "10단계 전 이후도 0이 아님", note: "최근 10개만 남기는 창은 점선 상자 밖의 기여를 버립니다. EMA에서는 10단계 전 이후 막대(파랑)도 계속 작아질 뿐 0이 되지 않습니다." },
] as const;

const W = 360;
const LEFT = 34;
const RIGHT = 346;
const BASE_Y = 150;
const TOP_Y = 30;
const SLOT = (RIGHT - LEFT) / AGES.length;
const BAR_W = SLOT - 6;
const bx = (j: number) => LEFT + j * SLOT + 3;
const h = (value: number) => value * (BASE_Y - TOP_Y);

export default function EmaWeightViz() {
  return (
    <SceneShell
      eyebrow="β = 0.9"
      title="과거 신호의 몫은 한 단계마다 0.9배로 줄 뿐 사라지지 않습니다"
      description="막대 하나가 j단계 전 신호의 몫입니다. 왼쪽 끝이 이번 신호(j=0)이고, 14단계 전까지만 그렸습니다. 세로축은 세 장면 모두 0부터 1입니다."
      ariaLabel="β=0.9에서 과거 신호의 상대 가중치와 실제 계수, 최근 10개 창과의 차이"
      scenes={SCENES}
      render={(active) => {
        const scale = active === 1 ? 0.1 : 1;
        return (
          <svg viewBox={`0 0 ${W} 196`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 0.5, 1].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={RIGHT} y1={BASE_Y - h(tick)} y2={BASE_Y - h(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={LEFT - 6} y={BASE_Y - h(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            {active === 2 && (
              <g>
                <rect x={LEFT + 1} y={TOP_Y - 14} width={SLOT * 10 - 2} height={BASE_Y - TOP_Y + 14} rx={4} fill="none" stroke="#475569" strokeWidth={1} strokeDasharray="4 3" />
                <text x={LEFT + 6} y={TOP_Y - 3} fontSize={10} fill="#475569">최근 10개 창이 남기는 범위</text>
              </g>
            )}
            {REL.map((value, j) => {
              const old = j >= 10;
              const focus = active === 2 ? old : j === 10;
              return (
                <g key={j}>
                  {active === 1 && <rect x={bx(j)} y={BASE_Y - h(value)} width={BAR_W} height={h(value)} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />}
                  <rect x={bx(j)} y={BASE_Y - h(value * scale)} width={BAR_W} height={h(value * scale)} rx={2} fill={focus ? "#2563eb" : "#94a3b8"} opacity={focus ? 0.95 : 0.7} />
                </g>
              );
            })}
            {active !== 2 && (
              <text x={bx(10) + BAR_W / 2} y={BASE_Y - h(REL[10] * scale) - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">
                {active === 1 ? "0.0349" : "0.349"}
              </text>
            )}
            <line x1={LEFT} x2={RIGHT} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 5, 10, 14].map((j) => (
              <text key={j} x={bx(j) + BAR_W / 2} y={BASE_Y + 15} textAnchor="middle" fontSize={10} fill="#64748b">{j}</text>
            ))}
            <text x={(LEFT + RIGHT) / 2} y={BASE_Y + 34} textAnchor="middle" fontSize={10} fill="#64748b">j단계 전 (왼쪽 0 = 이번 신호)</text>
          </svg>
        );
      }}
    />
  );
}
