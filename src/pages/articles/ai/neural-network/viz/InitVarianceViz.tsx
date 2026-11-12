import SceneShell from "./SceneShell";

/**
 * 본문 대응: #forward 끝 — (가정) 독립이고 분산 1인 입력 100개 × 분산 1 가중치 → 합의 분산 약 100.
 * 가중치 분산을 1/100로 두면 항마다 약 0.01 → 합의 분산 약 1.
 * 서로 독립인 항을 더하면 분산도 더해집니다. 항 하나의 분산이 약 1이 되려면 평균 0을 가정합니다.
 */
const N = 100;
const COLS = 10;
const CELL = 13;
const GX = 22;
const GY = 30;

const SCENES = [
  {
    label: "항 하나",
    summary: "입력 × 가중치 · 분산 약 1",
    note: "분산은 값이 평균에서 얼마나 넓게 흩어지는지를 재는 수입니다. (가정) 입력과 가중치가 서로 독립이고 평균 0, 분산 1이면 둘을 곱한 항 하나의 분산도 약 1입니다.",
  },
  {
    label: "100개를 더하면",
    summary: "1 × 100 = 약 100",
    note: "서로 독립인 항을 더하면 분산도 더해집니다. 칸 100개가 각자 약 1씩 보태 활성화 전 값의 분산은 약 100까지 커질 수 있습니다. 흩어지는 폭(표준편차)으로는 약 10배입니다.",
  },
  {
    label: "가중치 분산을 1/100로",
    summary: "0.01 × 100 = 약 1",
    note: "가중치 분산을 입력 수의 역수인 1/100 정도로 두면 항마다 약 0.01만 보탭니다. 100개를 더해도 출발 분산이 약 1로 맞춰집니다.",
  },
] as const;

const BAR_X = 210;
const BAR_W = 170;
const SCALE_MAX = 100;
const bw = (v: number) => (v / SCALE_MAX) * BAR_W;

const INK = "#475569";
const GRAY = "#94a3b8";
const RED = "#dc2626";
const BLUE = "#2563eb";

export default function InitVarianceViz() {
  return (
    <SceneShell
      eyebrow="초기화 크기"
      title="항 100개의 분산이 쌓여 활성화 전 값이 넓게 퍼집니다"
      description="칸 하나가 입력 하나와 가중치 하나를 곱한 항입니다. 오른쪽 막대는 그 100개 항을 더한 값의 분산입니다."
      note="입력 100개, 분산 1, 평균 0은 설명을 위한 가정입니다. 실제 층의 분산은 활성화 함수와 입력 분포에 따라 달라집니다."
      ariaLabel="입력 100개의 분산이 더해지는 모습과 가중치 분산 1/100의 효과"
      scenes={SCENES}
      render={(active) => {
        const perTerm = active === 2 ? 1 / N : 1;
        const filled = active === 0 ? 1 : N;
        const total = filled * perTerm;
        const color = active === 2 ? BLUE : RED;
        return (
          <svg
            viewBox="0 0 400 204"
            className="mx-auto h-auto w-full max-w-[560px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            <text x={GX} y={GY - 10} fontSize={13} fill={INK}>항 100개</text>
            <text x={GX} y={194} fontSize={13} fill={INK}>칸마다 분산 {active === 2 ? "약 0.01" : "약 1"}</text>
            {Array.from({ length: N }, (_, i) => {
              const on = i < filled;
              return (
                <rect
                  key={i}
                  x={GX + (i % COLS) * (CELL + 2)}
                  y={GY + Math.floor(i / COLS) * (CELL + 2)}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={on ? color : "none"}
                  fillOpacity={on ? (active === 2 ? 0.15 : 0.7) : 0}
                  stroke={on ? color : GRAY}
                  strokeWidth={1}
                />
              );
            })}

            <text x={BAR_X} y={GY - 10} fontSize={13} fill={INK}>합의 분산</text>
            <rect x={BAR_X} y={GY + 30} width={BAR_W} height={22} fill="none" stroke={GRAY} strokeWidth={1} />
            <rect x={BAR_X} y={GY + 30} width={Math.max(1.5, bw(total))} height={22} fill={color} fillOpacity={0.7} />
            <text x={BAR_X} y={GY + 66} fontSize={13} fill={INK}>0</text>
            <text x={BAR_X + BAR_W} y={GY + 66} textAnchor="end" fontSize={13} fill={INK}>100</text>
            <text x={BAR_X} y={GY + 92} fontSize={15} fontWeight={700} fill={color}>
              {active === 0 ? "약 1 (항 하나)" : active === 1 ? "약 100" : "약 1"}
            </text>
            <text x={BAR_X} y={GY + 112} fontSize={13} fill={INK}>
              {active === 0 ? "아직 하나만 셌습니다" : active === 1 ? "표준편차 약 10" : "표준편차 약 1"}
            </text>
            <text x={BAR_X} y={GY + 132} fontSize={13} fill={INK}>
              {active === 2 ? "가중치 분산 1/100" : "가중치 분산 1"}
            </text>
          </svg>
        );
      }}
    />
  );
}
