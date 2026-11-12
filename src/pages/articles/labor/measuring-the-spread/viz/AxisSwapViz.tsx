import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cumulate-and-draw — 지금의 관례(가로 사람, 세로 몫)와 Lorenz 218쪽(가로 몫, 세로 사람).
 * 같은 점 (사람 %, 몫 %)의 두 좌표를 바꾸면 곡선이 대각선을 기준으로 뒤집혀 위쪽으로 휩니다.
 * 숫자는 Lorenz 214쪽 표를 가난한 쪽부터 쌓은 프로이센 값(BowAndAreaViz와 같음).
 */
const PRUSSIA = {
  1892: { people: [70.1, 96.1, 98.6, 99.3, 99.9, 100], income: [41.2, 71.2, 79.8, 84.0, 91.4, 100] },
  1901: { people: [60.5, 95.3, 98.3, 99.1, 99.8, 100], income: [31.7, 67.0, 76.3, 80.8, 88.9, 100] },
} as const;

const SCENES = [
  {
    label: "지금의 관례: 가로 사람, 세로 몫",
    summary: "곡선이 대각선 아래로 처짐",
    note: "가로에 사람의 누적 %, 세로에 몫의 누적 %를 둡니다. 1901년의 첫 점은 가로 60.5, 세로 31.7이라 대각선 아래에 찍힙니다. 본문의 앞 그림과 같은 배치입니다.",
  },
  {
    label: "Lorenz 218쪽: 가로 몫, 세로 사람",
    summary: "같은 점이 (31.7, 60.5)로",
    note: "같은 점의 두 숫자 자리만 바꿉니다. 가로 31.7, 세로 60.5가 되어 대각선 위에 찍힙니다. 모든 점이 대각선을 접는 선으로 삼아 뒤집히므로 곡선은 위쪽으로 휩니다.",
  },
  {
    label: "읽는 규칙은 그대로입니다",
    summary: "활이 더 휜 1901년이 더 쏠림",
    note: "어느 배치에서나 1901년 선이 1892년 선보다 대각선에서 더 멀리 떨어져 있습니다(사람 70% 근처에서 두 선이 거의 맞닿는 짧은 구간만 빼고). 휘는 방향만 바뀌고, 더 휠수록 더 쏠렸다는 규칙은 같습니다.",
  },
] as const;

const SIZE = 132;
const PANELS = [
  { x: 28, title: "지금의 관례", xLabel: "사람 %", yLabel: "몫 %", swap: false },
  { x: 206, title: "Lorenz 218쪽 배치", xLabel: "몫 %", yLabel: "사람 %", swap: true },
] as const;
const TOP = 26;
const Y92 = "#6366f1";
const Y01 = "#ef4444";
const EVEN = "#94a3b8";
const MUTED = "#64748b";

type Year = keyof typeof PRUSSIA;
const YEARS: readonly Year[] = [1892, 1901];

export default function AxisSwapViz() {
  return (
    <SceneShell
      eyebrow="축을 바꾸면"
      title="두 축을 바꾸면 같은 곡선이 대각선 위쪽으로 휩니다"
      description="왼쪽은 지금의 관례, 오른쪽은 Lorenz 218쪽처럼 두 축을 바꾼 배치입니다. 파랑은 프로이센 1892년, 빨강은 1901년, 회색 점선은 똑같이 나눈 경우입니다."
      note="프로이센 숫자는 Lorenz(1905) 214쪽 표를 가난한 쪽부터 쌓은 값입니다. 오른쪽은 그의 그림을 옮긴 것이 아니라 같은 점의 좌표를 바꿔 그린 것입니다."
      ariaLabel="같은 Lorenz 곡선을 두 가지 축 배치로 그린 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={SCENES[active].label + ": " + SCENES[active].summary}>
          {PANELS.map((panel, index) => {
            const on = active === 2 || active === index;
            const px = (v: number) => panel.x + (v / 100) * SIZE;
            const py = (v: number) => TOP + SIZE - (v / 100) * SIZE;
            const pt = (people: number, income: number) => (panel.swap ? [px(income), py(people)] : [px(people), py(income)]);
            const highlight = pt(60.5, 31.7);
            return (
              <g key={panel.title} opacity={on ? 1 : 0.3}>
                <text x={panel.x} y={14} fontSize={11} fontWeight={700} fill={MUTED}>
                  {panel.title}
                </text>
                <rect x={panel.x} y={TOP} width={SIZE} height={SIZE} fill="none" stroke={EVEN} strokeWidth={0.75} />
                <line x1={px(0)} y1={py(0)} x2={px(100)} y2={py(100)} stroke={EVEN} strokeWidth={1.25} strokeDasharray="4 3" />
                {YEARS.map((year) => {
                  const data = PRUSSIA[year];
                  const points = [pt(0, 0), ...data.people.map((p, i) => pt(p, data.income[i]))].map(([a, b]) => a + "," + b).join(" ");
                  return <polyline key={year} points={points} fill="none" stroke={year === 1892 ? Y92 : Y01} strokeWidth={1.25} opacity={active === 2 || year === 1901 ? 1 : 0.45} />;
                })}
                {active !== 2 && (
                  <g>
                    <circle cx={highlight[0]} cy={highlight[1]} r={3.5} fill={Y01} />
                    <text x={highlight[0] + 6} y={highlight[1] + (panel.swap ? 14 : 12)} fontSize={10} fontWeight={700} fill={Y01}>
                      {panel.swap ? "(31.7, 60.5)" : "(60.5, 31.7)"}
                    </text>
                  </g>
                )}
                <text x={panel.x + SIZE / 2} y={TOP + SIZE + 14} fontSize={10} fill={MUTED} textAnchor="middle">
                  가로 {panel.xLabel} · 세로 {panel.yLabel}
                </text>
              </g>
            );
          })}
          <text x={180} y={190} fontSize={10.5} fontWeight={700} fill={active === 2 ? Y01 : MUTED} textAnchor="middle">
            {active === 0 ? "대각선 아래로 처집니다" : active === 1 ? "대각선을 접는 선으로 뒤집혀 위로 휩니다" : "두 배치 모두 1901년이 대각선에서 더 멉니다"}
          </text>
        </svg>
      )}
    />
  );
}
