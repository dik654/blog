import SceneShell from "./SceneShell";

/**
 * 본문 대응: #aggregates-hide — 다섯 사람이 받는 100.
 * 고른 쪽 20×5, 치우친 쪽 60·20·10·5·5. 총액 100, 평균 20은 같고 가운데(셋째)는 20 대 10.
 * 10까지 다 쓰고 그 위로 절반만 쓴다고 두면(본문의 예시 규칙) 고른 쪽 15×5=75, 치우친 쪽 35+15+10+5+5=70.
 */
const EVEN = [20, 20, 20, 20, 20] as const;
const SKEW = [60, 20, 10, 5, 5] as const;
const FULL_UNTIL = 10;
const ABOVE_SHARE = 0.5;

const spentOf = (income: number) =>
  Math.min(income, FULL_UNTIL) + Math.max(income - FULL_UNTIL, 0) * ABOVE_SHARE;
const sum = (values: readonly number[]) => values.reduce<number>((acc, v) => acc + v, 0);

const GROUPS = [
  { name: "고른 쪽", values: EVEN as readonly number[], x0: 22 },
  { name: "치우친 쪽", values: SKEW as readonly number[], x0: 202 },
] as const;

const W = 360;
const H = 214;
const BASE_Y = 152;
const MAX_H = 104;
const MAX_V = 60;
const BAR_W = 20;
const GAP = 7;
const MIDDLE = 2;

const INK = "#475569";
const MUTED = "#94a3b8";
const SPENT = "#2563eb";
const KEPT = "#cbd5e1";
const MARK = "#d97706";

const SCENES = [
  {
    label: "총액과 평균이 같습니다",
    summary: "둘 다 총액 100 · 평균 20",
    note: "막대 하나가 한 사람이 받는 금액입니다. 한쪽은 다섯이 20씩 받고 다른 쪽은 60, 20, 10, 5, 5를 받습니다. 더하면 둘 다 100이고 다섯으로 나누면 둘 다 20이라 합친 숫자로는 두 모양을 구분할 수 없습니다.",
  },
  {
    label: "가운데 사람은 절반입니다",
    summary: "가운데 20 대 10",
    note: "가운데 사람은 받은 금액 순서로 다섯을 세웠을 때 셋째 사람입니다. 고른 쪽은 20이고 치우친 쪽은 10입니다. 평균은 같은데 가운데 사람은 절반을 받습니다.",
  },
  {
    label: "10까지 다 쓰고 그 위로는 절반만 씁니다",
    summary: "본문의 예시 규칙(가정)",
    note: "소득이 낮을수록 받은 것을 더 많이 쓴다는 것을 이렇게 넣은 것이 본문의 예시입니다. 파란 부분이 다시 쓰이는 몫이고 옅은 부분이 남기는 몫입니다. 20을 받으면 10에 나머지 10의 절반을 더해 15를 쓰고, 60을 받으면 10에 50의 절반을 더해 35를 씁니다.",
  },
  {
    label: "같은 100에서 다시 쓰이는 것이 다릅니다",
    summary: "75 대 70",
    note: "고른 쪽은 15씩 다섯이라 75, 치우친 쪽은 35, 15, 10, 5, 5를 더해 70입니다. 총액이 같아도 다시 쓰이는 것이 다르니 앞 절의 도는 비율이 달라지고 불어나는 크기도 달라집니다. 합친 숫자 100에는 이 차이가 보이지 않습니다.",
  },
] as const;

export default function HiddenDistributionViz() {
  return (
    <SceneShell
      eyebrow="같은 총액, 다른 모양"
      title="총액 100이 어떻게 나뉘었는지가 다시 쓰이는 금액을 바꿉니다"
      description="다섯 사람이 받는 금액을 막대로 놓고, 본문의 예시 규칙으로 각자가 다시 쓰는 몫을 칠합니다. 금액과 규칙은 모두 본문의 설명용 숫자입니다."
      note="값과 이자율이 움직이지 않는다는 본문의 전제를 그대로 둔 계산입니다."
      ariaLabel="고른 분배와 치우친 분배에서 총액, 가운데 사람, 다시 쓰이는 금액 비교"
      scenes={SCENES}
      render={(active) => {
        const showSpent = active >= 2;
        const showMiddle = active === 1;
        const showTotalSpent = active === 3;
        const h = (v: number) => (v / MAX_V) * MAX_H;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[460px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            {GROUPS.map((group) => {
              const spentTotal = sum(group.values.map(spentOf));
              return (
                <g key={group.name}>
                  {group.values.map((value, i) => {
                    const x = group.x0 + i * (BAR_W + GAP);
                    const spent = spentOf(value);
                    const isMiddle = i === MIDDLE;
                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={BASE_Y - h(value)}
                          width={BAR_W}
                          height={h(value)}
                          rx={2}
                          fill={showSpent ? KEPT : "#94a3b8"}
                          stroke={showMiddle && isMiddle ? MARK : "none"}
                          strokeWidth={showMiddle && isMiddle ? 1.25 : 0}
                        />
                        {showSpent && (
                          <rect
                            x={x}
                            y={BASE_Y - h(spent)}
                            width={BAR_W}
                            height={h(spent)}
                            rx={2}
                            fill={SPENT}
                          />
                        )}
                        <text
                          x={x + BAR_W / 2}
                          y={BASE_Y - h(value) - 5}
                          textAnchor="middle"
                          fontSize={12.5}
                          fontWeight={700}
                          fill={showMiddle && isMiddle ? MARK : INK}
                        >
                          {value}
                        </text>
                        {showSpent && (
                          <text
                            x={x + BAR_W / 2}
                            y={BASE_Y + 14}
                            textAnchor="middle"
                            fontSize={12}
                            fontWeight={700}
                            fill={SPENT}
                          >
                            {spent}
                          </text>
                        )}
                        {showMiddle && isMiddle && (
                          <text
                            x={x + BAR_W / 2}
                            y={BASE_Y + 14}
                            textAnchor="middle"
                            fontSize={11.5}
                            fontWeight={700}
                            fill={MARK}
                          >
                            가운데
                          </text>
                        )}
                      </g>
                    );
                  })}
                  <text x={group.x0} y={BASE_Y + 34} fontSize={13} fontWeight={700} fill={INK}>
                    {group.name}
                  </text>
                  <text x={group.x0} y={BASE_Y + 52} fontSize={12} fill={showTotalSpent ? SPENT : MUTED} fontWeight={showTotalSpent ? 700 : 400}>
                    {showTotalSpent
                      ? `다시 쓰이는 합 ${spentTotal}`
                      : showSpent
                        ? "파랑 = 다시 쓰는 몫"
                        : `총액 ${sum(group.values)} · 평균 ${sum(group.values) / group.values.length}`}
                  </text>
                </g>
              );
            })}
            <line x1={12} x2={W - 12} y1={BASE_Y} y2={BASE_Y} stroke={MUTED} strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
