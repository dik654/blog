import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 둘째 문단 — 주가가 변하면 같은 행사가 100이 같은 상대 위치가 아닐 수 있다.
 * 가정: 선도값 ≈ 주가로 두고, 다음 달 주가 110(가정). 비율 = 행사가 ÷ 선도값.
 * 오늘 90·100·110 → 0.9·1.0·1.1, 다음 달 90·100·110 → 90/110≈0.82, 100/110≈0.91, 110/110=1.0.
 * 변동성 값은 글에 없어 그리지 않습니다.
 */
const W = 360;
const H = 200;
const STRIKES: readonly number[] = [90, 100, 110];
const ROW_Y: readonly number[] = [62, 146];
const SPOTS: readonly number[] = [100, 110];
const xStrike = (strike: number) => 30 + (strike - 80) * 7;
const xRatio = (ratio: number) => 30 + (ratio - 0.75) * 700;

const SCENES = [
  {
    label: "오늘: 주가 100",
    summary: "행사가 100 = 비율 1.0",
    note: "선도값(만기에 주고받을 가격을 오늘 정한 값)이 주가와 같다고 가정하면, 행사가 90·100·110은 선도값 대비 0.9·1.0·1.1 자리입니다. 행사가 100이 중앙입니다.",
  },
  {
    label: "다음 달: 주가 110(가정)",
    summary: "행사가 100 = 비율 약 0.91",
    note: "주가가 110으로 오르면 같은 행사가 100 옵션은 100÷110≈0.91, 중앙보다 아래쪽 자리로 옮겨 갑니다. 이 옵션의 변동성이 달라졌다면 표면이 바뀐 것인지 같은 곡선 위에서 자리만 옮긴 것인지 행사가 좌표만으로는 가르기 어렵습니다.",
  },
  {
    label: "비율 좌표로 맞추기",
    summary: "1.0 = 오늘 100, 다음 달 110",
    note: "가로축을 선도값 대비 비율로 바꾸면 두 날의 중앙이 같은 세로선에 섭니다. 같은 자리끼리 비교해야 표면 변화와 단순 이동을 구분할 수 있습니다(4절). 델타로 좌표를 맞추는 방법도 있습니다.",
  },
] as const;

export default function MoneynessShiftViz() {
  return (
    <SceneShell
      eyebrow="좌표 맞추기"
      title="주가가 움직이면 같은 행사가 100이 다른 자리가 됩니다"
      description="위 줄은 오늘, 아래 줄은 다음 달입니다. 주가 110과 선도값≈주가는 설명을 위한 가정이며, 이 그림은 자리만 보이고 변동성 높이는 그리지 않습니다."
      ariaLabel="주가가 100에서 110으로 움직일 때 행사가 100의 선도값 대비 비율이 1.0에서 약 0.91로 바뀌는 모습"
      scenes={SCENES}
      render={(active) => {
        const ratioMode = active === 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={W / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">
              {ratioMode ? "가로축: 선도값 대비 비율" : "가로축: 행사가"}
            </text>
            {ratioMode &&
              [
                [28, ROW_Y[0] - 9],
                [ROW_Y[0] + 36, ROW_Y[1] - 9],
                [ROW_Y[1] + 36, 182],
              ].map(([y1, y2]) => <line key={y1} x1={xRatio(1)} x2={xRatio(1)} y1={y1} y2={y2} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />)}
            {ROW_Y.map((rowY, row) => {
              const spot = SPOTS[row];
              const shown = row === 0 || active >= 1;
              const pos = (strike: number) => (ratioMode ? xRatio(strike / spot) : xStrike(strike));
              return (
                <g key={rowY} opacity={shown ? 1 : 0.2}>
                  <text x={8} y={rowY - 22} fontSize={12} fontWeight={700} fill="#334155">{row === 0 ? "오늘 · 주가 100" : "다음 달 · 주가 110(가정)"}</text>
                  <line x1={24} x2={W - 12} y1={rowY} y2={rowY} stroke="#94a3b8" strokeWidth={1} />
                  {!ratioMode && (
                    <g>
                      <path d={`M ${xStrike(spot)} ${rowY - 14} l -5 -7 h 10 z`} fill="#16a34a" />
                      <text x={xStrike(spot) + 8} y={rowY - 13} fontSize={11} fill="#15803d">주가</text>
                    </g>
                  )}
                  {STRIKES.map((strike) => {
                    const ratio = strike / spot;
                    const focus = strike === 100;
                    return (
                      <g key={strike}>
                        <circle cx={pos(strike)} cy={rowY} r={focus ? 6 : 4} fill={focus ? "#dc2626" : "#64748b"} />
                        <text x={pos(strike)} y={rowY + 18} textAnchor="middle" fontSize={11} fontWeight={focus ? 700 : 400} fill={focus ? "#b91c1c" : "#64748b"}>{strike}</text>
                        <text x={pos(strike)} y={rowY + 32} textAnchor="middle" fontSize={10} fill="#64748b">{ratio === 1 ? "1.0" : ratio.toFixed(2)}</text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
            {ratioMode && <text x={xRatio(1) + 6} y={194} fontSize={11} fill="#1d4ed8">중앙(1.0)</text>}
          </svg>
        );
      }}
    />
  );
}
