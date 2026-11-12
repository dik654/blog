import SceneShell from "./SceneShell";

/**
 * 본문 대응: #health-and-drain — "한 대를 뺄 때 남은 서버가 그 몫을 받을 수 있어야 한다".
 * 서버 4대(가정), 빠진 몫이 남은 3대에 고르게 나뉜다(가정), 100%를 처리 한계로 둔다(가정).
 * 50% → 200/3 = 66.7%, 80% → 320/3 = 106.7%, 경계 75% → 300/3 = 100%.
 */
const SERVERS = 4;
const REMAINING = SERVERS - 1;

const SCENES = [
  {
    label: "평소 50%",
    summary: "4대 × 50% → 3대 × 66.7%",
    usual: 50,
    note: "한 대를 빼면 그 몫이 남은 세 대로 나뉩니다. 합계 200을 3으로 나누면 대당 약 66.7%라 한계 100% 아래에 머뭅니다.",
  },
  {
    label: "평소 80%",
    summary: "4대 × 80% → 3대 × 106.7%",
    usual: 80,
    note: "같은 계산에서 합계 320을 3으로 나누면 대당 약 106.7%입니다. 빼는 순간 남은 서버가 한계를 넘고, 본문이 말하는 연쇄적인 아픔이 여기서 시작됩니다.",
  },
  {
    label: "경계",
    summary: "4대라면 평소 75%까지",
    usual: 75,
    note: "합계 300을 3으로 나누면 정확히 100%입니다. 4대라는 가정에서는 평소 사용률이 3/4 = 75% 이하일 때만 한 대를 빼도 남은 서버가 한계를 넘지 않습니다. 대수가 바뀌면 이 경계도 바뀝니다.",
  },
] as const;

const W = 360;
const H = 196;
const BASE_Y = 150;
const PX_PER_PCT = 1.0;
const LIMIT_Y = BASE_Y - 100 * PX_PER_PCT;
const BAR_W = 28;
const GAP = 10;
const GROUP_W = SERVERS * BAR_W + (SERVERS - 1) * GAP;
const LEFT_X = 20;
const RIGHT_X = W - 20 - GROUP_W;
const OK = "#2563eb";
const OVER = "#dc2626";
const MUTED = "#64748b";
const LINE = "#94a3b8";

const fmt = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

function Bar({ x, value }: { x: number; value: number }) {
  const under = Math.min(value, 100) * PX_PER_PCT;
  const over = Math.max(value - 100, 0) * PX_PER_PCT;
  return (
    <g>
      <rect x={x} y={LIMIT_Y} width={BAR_W} height={100 * PX_PER_PCT} fill="none" stroke={LINE} strokeWidth={1} />
      <rect x={x} y={BASE_Y - under} width={BAR_W} height={under} fill={OK} opacity={0.75} />
      {over > 0 && <rect x={x} y={LIMIT_Y - over} width={BAR_W} height={over} fill={OVER} />}
      <text
        x={x + BAR_W / 2}
        y={BASE_Y - under - over - 5}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={over > 0 ? OVER : OK}
      >
        {fmt(value)}%
      </text>
    </g>
  );
}

export default function HeadroomViz() {
  return (
    <SceneShell
      eyebrow="빼기 전후의 사용률"
      title="한 대를 빼면 그 몫이 남은 서버의 사용률에 그대로 얹힙니다"
      description="막대 하나가 서버 한 대이고 테두리 높이가 처리 한계 100%입니다. 서버 4대, 빠진 몫이 남은 서버에 고르게 나뉜다는 조건, 평소 사용률 값은 모두 설명을 위한 가정입니다."
      ariaLabel="서버 네 대 중 한 대를 뺄 때 평소 사용률에 따라 남은 서버의 사용률이 한계를 넘는지 비교"
      scenes={SCENES}
      render={(active) => {
        const usual = SCENES[active].usual;
        const total = usual * SERVERS;
        const after = total / REMAINING;
        const afterOver = after > 100;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[560px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            <text x={LEFT_X} y={14} fontSize={12} fontWeight={700} fill={MUTED}>
              빼기 전 · 4대
            </text>
            <text x={RIGHT_X} y={14} fontSize={12} fontWeight={700} fill={MUTED}>
              한 대를 뺀 뒤 · 3대
            </text>
            <line x1={LEFT_X - 6} x2={W - 14} y1={LIMIT_Y} y2={LIMIT_Y} stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
            <text x={W / 2} y={LIMIT_Y - 4} textAnchor="middle" fontSize={10} fill={MUTED}>
              한계
            </text>
            {Array.from({ length: SERVERS }, (_, i) => (
              <g key={`b-${i}`}>
                <Bar x={LEFT_X + i * (BAR_W + GAP)} value={usual} />
                <text x={LEFT_X + i * (BAR_W + GAP) + BAR_W / 2} y={BASE_Y + 15} textAnchor="middle" fontSize={11} fill={MUTED}>
                  S{i + 1}
                </text>
              </g>
            ))}
            {Array.from({ length: SERVERS }, (_, i) => {
              const x = RIGHT_X + i * (BAR_W + GAP);
              const removed = i === SERVERS - 1;
              return (
                <g key={`a-${i}`}>
                  {removed ? (
                    <>
                      <rect x={x} y={LIMIT_Y} width={BAR_W} height={100 * PX_PER_PCT} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="3 3" />
                      <text x={x + BAR_W / 2} y={LIMIT_Y + 54} textAnchor="middle" fontSize={11} fill={MUTED}>
                        빠짐
                      </text>
                    </>
                  ) : (
                    <Bar x={x} value={after} />
                  )}
                  <text x={x + BAR_W / 2} y={BASE_Y + 15} textAnchor="middle" fontSize={11} fill={MUTED}>
                    S{i + 1}
                  </text>
                </g>
              );
            })}
            <line x1={LEFT_X - 6} x2={W - 14} y1={BASE_Y} y2={BASE_Y} stroke={LINE} strokeWidth={1} />
            <text x={LEFT_X} y={H - 10} fontSize={12} fill={MUTED}>
              합계 {total} = 4 × {usual}
            </text>
            <text x={W - 8} y={H - 10} textAnchor="end" fontSize={12} fontWeight={700} fill={afterOver ? OVER : OK}>
              {total} ÷ 3 = {fmt(after)}%{afterOver ? " · 한계 초과" : ""}
            </text>
          </svg>
        );
      }}
    />
  );
}
