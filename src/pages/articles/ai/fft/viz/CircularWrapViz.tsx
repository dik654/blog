import SceneShell from "./SceneShell";

/**
 * 본문 대응: #convolution — x=[1,2,3,4], h=[1,−1] (가정).
 * 선형 [1,1,1,1,−4]. 길이 4 원형은 −4가 첫 칸으로 돌아와 [−3,1,1,1]. M≥5면 겹치지 않습니다.
 */
const PLUS = [1, 2, 3, 4, 0, 0, 0, 0];
const MINUS = [0, -1, -2, -3, -4, 0, 0, 0];
// 첫 장면은 길이 제한이 없는 선형 연산이라 M 경계를 그리지 않습니다. 나머지 장면은 모두 실제 계산 길이 M을 가집니다.
const SCENES: { label: string; summary: string; note: string; space: number; result: number[]; pick: number; wrap: boolean; showM?: boolean }[] = [
  { label: "선형 합성곱", summary: "[1, 1, 1, 1, −4]", space: 8, result: [1, 1, 1, 1, -4, 0, 0, 0], pick: 5, wrap: false, note: "현재 값에서 직전 값을 뺍니다. 입력 밖을 0으로 놓으면 뺄 값이 한 칸 뒤로 밀려 다섯째 칸에 필터의 꼬리 −4가 남습니다." },
  { label: "길이 4 DFT로 곱하면", summary: "[−3, 1, 1, 1]", space: 4, result: [-3, 1, 1, 1, 0, 0, 0, 0], pick: 4, wrap: true, showM: true, note: "칸이 넷뿐이라 꼬리 −4가 끝을 넘어 첫 칸으로 돌아와 1에 더해집니다. 원형 연산으로는 맞지만 원하는 선형 연산으로는 틀립니다." },
  { label: "M = 5", summary: "4+2−1 = 5칸이면 충분", space: 5, result: [1, 1, 1, 1, -4, 0, 0, 0], pick: 5, wrap: false, showM: true, note: "두 입력을 길이 5까지 0으로 채우면 선형 출력 전체가 들어가 꼬리가 돌아올 일이 없습니다. M ≥ Lx+Lh−1이 이 조건입니다." },
  { label: "M = 8로 계산", summary: "앞 5개 → 앞 4개", space: 8, result: [1, 1, 1, 1, -4, 0, 0, 0], pick: 5, wrap: false, showM: true, note: "실행에 빠른 길이를 골라 더 크게 채워도 됩니다. 앞 5개가 선형 출력이고, 인과적 길이 4 출력만 원하면 그다음에 앞 4개를 고릅니다. 먼저 길이 4 원형 연산을 해서는 같은 결과가 되지 않습니다." },
];

const SLOT = 38;
const X0 = 40;
const CELL = 31;
const ROWS = { plus: 40, minus: 84, result: 148 };
const signed = (value: number) => (value < 0 ? `−${Math.abs(value)}` : String(value));

export default function CircularWrapViz() {
  return (
    <SceneShell
      eyebrow="꼬리의 자리"
      title="칸이 모자라면 필터의 꼬리가 첫 칸으로 돌아옵니다"
      description="한 칸이 위치 하나입니다. 위 두 줄은 h=[1,−1](가정)의 두 항이 만드는 기여이고, 맨 아래가 합입니다. 세로 점선이 계산에 쓰는 길이 M의 끝입니다."
      ariaLabel="길이 4, 5, 8에서 합성곱 꼬리의 위치 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const wallX = X0 + scene.space * SLOT - 4;
        return (
          <svg viewBox="0 0 360 208" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((slot) => (
              <text key={slot} x={X0 + slot * SLOT + CELL / 2} y={30} textAnchor="middle" fontSize={10} fill="#64748b">{slot}</text>
            ))}
            {([["×1", PLUS, ROWS.plus], ["×(−1)", MINUS, ROWS.minus]] as const).map(([name, row, y]) => (
              <g key={name}>
                <text x={2} y={y + 18} fontSize={11} fontWeight={700} fill="#64748b">{name}</text>
                {row.map((value, slot) => (
                  <g key={slot} opacity={slot < scene.space || (scene.wrap && slot === 4) ? 1 : 0.2}>
                    <rect x={X0 + slot * SLOT} y={y} width={CELL} height={28} rx={4} fill="none" stroke={scene.wrap && slot === 4 && value !== 0 ? "#d97706" : "#94a3b8"} strokeWidth={1} strokeDasharray={scene.wrap && slot === 4 ? "3 3" : undefined} />
                    <text x={X0 + slot * SLOT + CELL / 2} y={y + 19} textAnchor="middle" fontSize={12} fontWeight={scene.wrap && slot === 4 && value !== 0 ? 700 : 400} fill={scene.wrap && slot === 4 && value !== 0 ? "#d97706" : "#64748b"}>{signed(value)}</text>
                  </g>
                ))}
              </g>
            ))}
            <text x={2} y={ROWS.result + 20} fontSize={11} fontWeight={700} fill="#2563eb">합</text>
            <line x1={2} x2={348} y1={ROWS.result - 16} y2={ROWS.result - 16} stroke="#94a3b8" strokeWidth={1} />
            {scene.result.map((value, slot) => {
              const inside = slot < scene.space;
              const keep = slot < scene.pick;
              return (
                <g key={slot} opacity={inside ? 1 : 0.2}>
                  <rect x={X0 + slot * SLOT} y={ROWS.result} width={CELL} height={30} rx={4} fill={inside && keep ? "#2563eb" : "none"} fillOpacity={inside && keep ? 0.12 : 0} stroke={scene.wrap && slot === 0 ? "#d97706" : inside && keep ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  {inside && <text x={X0 + slot * SLOT + CELL / 2} y={ROWS.result + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={scene.wrap && slot === 0 ? "#d97706" : keep ? "#2563eb" : "#64748b"}>{signed(value)}</text>}
                </g>
              );
            })}
            {scene.wrap && (
              <g>
                <path d={`M${X0 + 4 * SLOT + CELL / 2} ${ROWS.minus + 30} C ${X0 + 4 * SLOT + CELL / 2} 245, ${X0 + CELL / 2} 196, ${X0 + CELL / 2} 186`} fill="none" stroke="#d97706" strokeWidth={1.25} />
                <polygon points={`${X0 + CELL / 2},${ROWS.result + 31} ${X0 + CELL / 2 - 3.5},186 ${X0 + CELL / 2 + 3.5},186`} fill="#d97706" />
              </g>
            )}
            {scene.showM && <line x1={wallX} x2={wallX} y1={16} y2={ROWS.result + 34} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />}
            {scene.showM && <text x={wallX} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">M={scene.space}</text>}
          </svg>
        );
      }}
    />
  );
}
