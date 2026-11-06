import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 계절풍이 떠날 수 있는 달을 정하고, 바람을 놓치면 몇 달을 기다립니다.
 * 위 칸 = 두 항구 사이의 바람과 배. 아래 칸 = 계절별로 배가 하는 일.
 * 계절을 둘로 줄이고 길이를 같게 그린 도식입니다. 몇 달인지는 글이 정하지 않았습니다.
 */
const SCENES = [
  { label: "바람이 한쪽으로 붑니다", summary: "이 계절에 출항", wind: 1, shipX: 200, sailing: 1, note: "계절풍은 배가 떠날 수 있는 달을 정합니다. 바람이 도착 항구 쪽으로 부는 동안 배가 떠납니다." },
  { label: "바람 방향이 바뀝니다", summary: "다음 계절에 귀환", wind: -1, shipX: 160, sailing: -1, note: "계절이 바뀌면 바람도 반대로 붑니다. 이번에는 이 바람을 이용해 돌아옵니다. 출항과 귀환의 시기가 함께 정해지는 셈입니다." },
  { label: "바람을 놓치면", summary: "출발 항구에서 대기", wind: -1, shipX: 88, sailing: 0, note: "한 방향의 바람을 놓치면 몇 달을 기다립니다. 지금 부는 바람은 반대 방향이라 그 방향의 바람이 다시 불 때까지입니다." },
  { label: "바람이 돌아오면 떠납니다", summary: "같은 배, 늦은 출항", wind: 1, shipX: 200, sailing: 1, note: "바람이 다시 돌아와야 떠납니다. 다만 바람을 안다고 안전한 항해까지 보장되는 것은 아닙니다." },
] as const;

const COLS = [46, 151, 256] as const;
const CELL_W = 102;

function Arrow({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g stroke={color} strokeWidth={1} fill="none">
      <line x1={x1} x2={x2} y1={y} y2={y} />
      <path d={`M${x2 - 6 * dir} ${y - 4}L${x2} ${y}L${x2 - 6 * dir} ${y + 4}`} />
    </g>
  );
}

function Cell({ col, y, text, on, tone = "#2563eb" }: { col: number; y: number; text: string; on: boolean; tone?: string }) {
  return (
    <g>
      <rect
        x={COLS[col]}
        y={y}
        width={CELL_W}
        height={28}
        rx={6}
        fill={on ? tone : "none"}
        fillOpacity={on ? 0.12 : 0}
        stroke={on ? tone : "#94a3b8"}
        strokeWidth={1}
        strokeDasharray={on ? undefined : "3 3"}
      />
      {on && (
        <text x={COLS[col] + CELL_W / 2} y={y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{text}</text>
      )}
    </g>
  );
}

export default function MonsoonWindowViz() {
  return (
    <SceneShell
      eyebrow="계절풍과 출항 시기"
      title="바람의 방향이 배가 떠날 달을 정합니다"
      description="계절풍은 계절에 따라 방향이 바뀌는 바람입니다. 계절을 둘로 줄이고 길이를 같게 그린 도식이며(가정), 몇 달인지와 실제 방위는 적지 않았습니다."
      ariaLabel="계절풍 방향에 따른 출항과 귀환, 바람을 놓친 배의 대기"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const windX = scene.wind === 1 ? [108, 158] : [158, 108];
        const missed = index >= 2;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[8, 290].map((x, i) => (
              <g key={x}>
                <rect x={x} y={24} width={62} height={50} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <text x={x + 31} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{i === 0 ? "출발" : "도착"}</text>
                <text x={x + 31} y={61} textAnchor="middle" fontSize={11} fill="currentColor">항구</text>
              </g>
            ))}
            <text x={180} y={10} textAnchor="middle" fontSize={11} fill="#64748b">바람 방향</text>
            {[0, 1].map((slot) => (
              <Arrow key={slot} x1={windX[0] + slot * 94} x2={windX[1] + slot * 94} y={22} color="#0891b2" />
            ))}
            <line x1={70} x2={290} y1={70} y2={70} stroke="#94a3b8" strokeWidth={1} />
            <g fill="#d97706" stroke="#d97706" strokeWidth={1}>
              <path d={`M${scene.shipX - 13} 58L${scene.shipX + 13} 58L${scene.shipX + 8} 68L${scene.shipX - 8} 68Z`} />
              <line x1={scene.shipX} x2={scene.shipX} y1={58} y2={36} />
              <path d={`M${scene.shipX} 37L${scene.shipX} 54L${scene.shipX + (scene.sailing === -1 ? -12 : 12)} 54Z`} fillOpacity={0.35} />
            </g>
            {scene.sailing !== 0 ? (
              <Arrow x1={scene.shipX + 20 * scene.sailing} x2={scene.shipX + 52 * scene.sailing} y={50} color="#d97706" />
            ) : (
              <text x={110} y={50} fontSize={11} fontWeight={700} fill="#b45309">같은 바람이 올 때까지 대기</text>
            )}

            {COLS.map((x, col) => (
              <text key={x} x={x + CELL_W / 2} y={102} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0891b2">
                {col === 0 ? "계절 1 · 바람 →" : col === 1 ? "계절 2 · 바람 ←" : "다시 계절 1 · →"}
              </text>
            ))}
            <text x={0} y={132} fontSize={11} fontWeight={700} fill="currentColor">제때</text>
            <Cell col={0} y={112} text="출항 →" on />
            <Cell col={1} y={112} text="귀환 ←" on={index >= 1} />
            <Cell col={2} y={112} text="" on={false} />
            <text x={0} y={170} fontSize={11} fontWeight={700} fill="currentColor">놓침</text>
            <Cell col={0} y={150} text="바람 놓침" on={missed} tone="#d97706" />
            <Cell col={1} y={150} text="대기" on={missed} tone="#d97706" />
            <Cell col={2} y={150} text="출항 →" on={index === 3} />
            <text x={180} y={204} textAnchor="middle" fontSize={11} fill="#64748b">칸 길이는 실제 기간이 아닙니다</text>
          </svg>
        );
      }}
    />
  );
}
