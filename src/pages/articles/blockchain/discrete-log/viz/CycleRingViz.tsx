import SceneShell from "./SceneShell";

/**
 * 본문 대응: #parts, #why-parts — 17로 나눈 0 아닌 나머지 16개를 3을 곱할 때 방문하는 순서로 원 위에 놓는다.
 * g=3: 1,3,9,10,13,5,15,11,16,14,8,7,4,12,2,6 → 16번 뒤 1. x=21=16+5도 5에 도착.
 * g=4: 1→4→16→13→1 (원 위 0·12·8·4번 자리). 3은 이 순환에 없다.
 */
const RING: readonly number[] = [1, 3, 9, 10, 13, 5, 15, 11, 16, 14, 8, 7, 4, 12, 2, 6];
const FOUR_CYCLE: readonly number[] = [1, 4, 16, 13];

const SCENES = [
  { label: "3을 곱하면 한 칸씩", summary: "1→3→9→10→13→5", note: "3을 다섯 번 곱하면 다섯 칸을 지나 5에 섭니다. 원 위 숫자는 3을 곱할 때 방문하는 순서대로 놓았습니다." },
  { label: "16번 뒤 출발점", summary: "열여섯 번째 곱셈 → 1", note: "0 아닌 나머지 16개를 한 번씩 지난 뒤 1로 돌아옵니다. 그 뒤로는 같은 길을 다시 돕니다." },
  { label: "5번과 21번", summary: "21 = 16 + 5 → 같은 자리 5", note: "21번 곱하면 한 바퀴(16번)를 돈 뒤 다섯 칸을 더 갑니다. 공개된 5만으로는 5와 21을 구분하지 못하니, 찾는 것은 한 바퀴 안의 위치입니다." },
  { label: "4를 곱하면 네 칸만", summary: "1→4→16→13→1", note: "같은 17에서 4를 곱하면 주황 선으로 이은 네 자리만 돕니다(나머지 칸은 흐리게 표시). 반복 횟수를 아무리 크게 골라도 공개 결과는 이 네 가지 중 하나입니다." },
  { label: "도착할 수 없는 3", summary: "후보 4개 · 3은 순환 밖", note: "4를 곱하는 순환에서 마지막 값으로 3을 받았다면 그런 결과에는 도착할 수 없습니다. 그래서 공개 입력이 허용된 순환 안에 있는지 따로 검사합니다." },
] as const;

const CX = 170;
const CY = 150;
const R = 112;
const pos = (index: number) => {
  const angle = (index / 16) * 2 * Math.PI - Math.PI / 2;
  return { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
};
const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const WARN = "#dc2626";

export default function CycleRingViz() {
  return (
    <SceneShell
      eyebrow="한 바퀴 안의 위치"
      title="반복 횟수는 원을 도는 칸 수입니다"
      description="원 위 칸 하나가 17로 나눈 0 아닌 나머지 하나입니다. 1에서 출발해 정해진 수를 곱할 때마다 다음 값으로 옮겨 갑니다."
      ariaLabel="3을 곱하면 16칸을 모두 돌고, 4를 곱하면 1, 4, 16, 13의 네 칸만 도는 순환"
      scenes={SCENES}
      render={(active) => {
        const threeSteps = active === 0 ? 5 : active <= 2 ? 16 : 0;
        const marker = active === 0 || active === 2 ? 5 : active === 1 ? 0 : -1;
        const four = active >= 3;
        const fourIdx = FOUR_CYCLE.map((value) => RING.indexOf(value));
        const target = RING.indexOf(3);
        return (
          <svg viewBox="0 0 340 300" className="mx-auto h-auto w-full max-w-[300px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="2 4" />
            {Array.from({ length: threeSteps }, (_, step) => {
              const a = pos(step);
              const b = pos((step + 1) % 16);
              return <line key={`s${step}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ACCENT} strokeWidth={1.25} />;
            })}
            {four &&
              fourIdx.map((index, k) => {
                const a = pos(index);
                const b = pos(fourIdx[(k + 1) % 4]);
                return <line key={`f${k}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#d97706" strokeWidth={1.25} />;
              })}
            {RING.map((value, index) => {
              const p = pos(index);
              const onFour = fourIdx.includes(index);
              const isMarker = index === marker;
              const isTarget = active === 4 && index === target;
              const dim = four && !onFour && !isTarget;
              const stroke = isTarget ? WARN : isMarker ? ACCENT : four && onFour ? "#d97706" : MUTED;
              return (
                <g key={value} opacity={dim ? 0.35 : 1}>
                  <circle cx={p.x} cy={p.y} r={isMarker || isTarget ? 15 : 13} fill="#ffffff" stroke={stroke} strokeWidth={isMarker || isTarget || (four && onFour) ? 1.25 : 1} />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={12} fontWeight={isMarker || isTarget ? 700 : 500} fill={isTarget ? WARN : "#0f172a"}>
                    {value}
                  </text>
                </g>
              );
            })}
            {active === 4 && (
              <text x={pos(target).x + 20} y={pos(target).y - 14} fontSize={11} fontWeight={700} fill={WARN}>
                도착 불가
              </text>
            )}
            <text x={CX} y={CY - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">
              {four ? "4를 곱함" : "3을 곱함"}
            </text>
            <text x={CX} y={CY + 12} textAnchor="middle" fontSize={11} fill="#64748b">
              {active === 0 ? "곱셈 5번" : active === 1 ? "곱셈 16번" : active === 2 ? "곱셈 21번" : "네 칸 순환"}
            </text>
            <text x={CX} y={CY + 28} textAnchor="middle" fontSize={11} fill="#64748b">
              {active === 2 ? "16번 + 5번" : active <= 1 ? `현재 값 ${RING[marker]}` : "결과 후보 4개"}
            </text>
          </svg>
        );
      }}
    />
  );
}
