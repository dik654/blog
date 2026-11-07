import SceneShell from "./SceneShell";

/**
 * 본문 대응: #npv·#irr-compare — 초기 1억 원, 3년간 매년 4천만 원, 할인율 8%.
 * 현재가치 3,703.7 + 3,429.4 + 3,175.3 = 10,308.4, 여기서 1억을 빼면 약 308만 원.
 */
const FLOWS = [
  { year: 1, df: "0.9259", present: 4000 / 1.08 },
  { year: 2, df: "0.8573", present: 4000 / 1.08 ** 2 },
  { year: 3, df: "0.7938", present: 4000 / 1.08 ** 3 },
] as const;
const OUTLAY = 10000;
const K = 0.0122;
const BASE = 182;
const STACK_X = 50;
const OUT_X = 14;
const COL_W = 42;
const colX = (year: number) => 92 + year * 66;
const SEGMENT: readonly string[] = ["#16a34a", "#22a55b", "#4ab97a"];

const SCENES = [
  { label: "시점이 흩어져 있습니다", summary: "−1억 · +4천만 · +4천만 · +4천만", note: "숫자만 더하면 2천만 원 이익처럼 보이지만, 시점이 다른 금액은 단위가 달라 아직 더할 수 없습니다." },
  { label: "시점마다 계수를 곱합니다", summary: "할인율 8% · 0.9259, 0.8573, 0.7938", note: "할인계수는 그 시점의 1원이 오늘 얼마인지입니다. 멀수록 작아져 같은 4천만 원도 초록 부분이 줄어듭니다." },
  { label: "오늘로 옮겨 쌓습니다", summary: "3,704 + 3,429 + 3,175 = 10,308만 원", note: "이제 모두 오늘의 돈이라 더할 수 있습니다. 먼 해의 몫일수록 쌓이는 칸이 얇습니다." },
  { label: "나가는 돈과 맞댑니다", summary: "순현재가치 약 +308만 원", note: "0보다 크므로 같은 위험으로 8%를 기대할 수 있는 다른 곳보다 낫다는 판정입니다. 절대적인 좋고 나쁨이 아니라 8%와 견준 결과입니다." },
] as const;

export default function NpvLadderViz() {
  return (
    <SceneShell
      eyebrow="순현재가치"
      title="흩어진 돈을 오늘로 옮겨야 비로소 더할 수 있습니다"
      description="막대 높이는 금액에 비례하고 단위는 만 원입니다. 초기 1억 원을 넣고 3년간 매년 4천만 원이 들어오는 사업을 할인율 8%로 봅니다. 이 글의 비교표에 나오는 사례입니다."
      ariaLabel="1억 투자와 3년간 4천만 원 현금흐름의 순현재가치 계산"
      scenes={SCENES}
      render={(active) => {
        const moved = active >= 2;
        const stack = FLOWS.reduce<{ y: number; h: number }[]>((acc, flow) => {
          const top = acc.length ? acc[acc.length - 1].y : BASE;
          const h = flow.present * K;
          return [...acc, { y: top - h, h }];
        }, []);
        const stackTop = stack[stack.length - 1].y;
        const outlayTop = BASE - OUTLAY * K;
        return (
          <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={8} x2={352} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <text x={47} y={BASE + 16} textAnchor="middle" fontSize={12} fill="#64748b">오늘</text>
            <rect x={OUT_X} y={outlayTop} width={30} height={OUTLAY * K} rx={2} fill="#dc2626" fillOpacity={0.14} stroke="#dc2626" strokeWidth={1} />
            <text x={OUT_X + 15} y={outlayTop - 7} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">−10,000</text>

            {moved && stack.map((seg, index) => (
              <rect key={index} x={STACK_X} y={seg.y} width={30} height={seg.h} fill={SEGMENT[index]} fillOpacity={0.55} stroke="#16a34a" strokeWidth={1} />
            ))}
            {moved && (
              <text x={STACK_X + 36} y={stackTop + 8} fontSize={12} fontWeight={700} fill="#16a34a">+10,308</text>
            )}
            {active === 3 && (
              <g>
                <line x1={OUT_X} x2={STACK_X + 34} y1={outlayTop} y2={outlayTop} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
                <text x={STACK_X + 36} y={outlayTop + 22} fontSize={12} fontWeight={700} fill="#2563eb">남는 몫 +308</text>
              </g>
            )}

            {FLOWS.map((flow, index) => {
              const x = colX(flow.year);
              const full = 4000 * K;
              const inner = flow.present * K;
              const showInner = active >= 1;
              return (
                <g key={flow.year}>
                  <rect x={x} y={BASE - full} width={COL_W} height={full} rx={2} fill="#94a3b8" fillOpacity={0.14} stroke="#94a3b8" strokeWidth={1} />
                  {showInner && <rect x={x} y={BASE - inner} width={COL_W} height={inner} fill={SEGMENT[index]} fillOpacity={moved ? 0.25 : 0.55} />}
                  <text x={x + COL_W / 2} y={BASE - full - 6} textAnchor="middle" fontSize={11} fill="#64748b">+4,000</text>
                  {showInner && <text x={x + COL_W / 2} y={BASE - full - 20} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a">×{flow.df}</text>}
                  {showInner && <text x={x + COL_W / 2} y={BASE - inner / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#166534">{Math.round(flow.present).toLocaleString("en-US")}</text>}
                  <text x={x + COL_W / 2} y={BASE + 16} textAnchor="middle" fontSize={12} fill="#64748b">{flow.year}년 뒤</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
