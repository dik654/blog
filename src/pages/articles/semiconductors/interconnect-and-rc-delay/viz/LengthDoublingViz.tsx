import RcGrid from "./RcGrid";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #length — 같은 단면에서 길이만 두 배: 선 200→400 Ω, 100→200 fF(가정).
 * 기준 칸: 출력×시작 25, 출력×끝 25, 출력×입력 10, 선×끝 10, 선×입력 4 → 74 ps.
 * 두 배 칸: 50, 50, 10, 40, 8 → 158 ps.
 * 배수: 선×끝(=RwCw/2) ×4, 출력×선 용량·선×입력 ×2, 출력×입력 ×1.
 */
const FACTORS: readonly (readonly (number | null)[])[] = [
  [2, 2, 1],
  [null, 4, 2],
];

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

const colorOf = (factor: number | null) => (factor === 4 ? AMBER : factor === 2 ? BLUE : GRAY);

const SCENES = [
  { label: "기준 길이", summary: "200 Ω · 100 fF → 74 ps", doubled: false, note: "8절의 다섯 칸입니다. 선 저항과 끝 쪽 선 용량이 만나는 칸 10 ps가 배선 자체 항 RwCw/2(선 저항 × 선 용량의 절반)입니다." },
  { label: "길이 두 배", summary: "400 Ω · 200 fF → 158 ps", doubled: true, note: "같은 축척에서 선 저항 행은 두 배로 높아지고, 선 용량 두 열은 두 배로 넓어집니다. 출력 저항 행과 입력 열은 그대로입니다." },
  { label: "칸마다 다른 배수", summary: "×4는 한 칸뿐 · 합계 약 2.14배", doubled: true, note: "높이와 너비가 함께 두 배인 칸만 네 배(10→40)입니다. 한쪽만 늘어난 칸은 두 배(54→108), 출력×입력 칸은 그대로 10입니다. 40+108+10=158이라 전체는 네 배가 아닙니다." },
] as const;

export default function LengthDoublingViz() {
  return (
    <SceneShell
      eyebrow="길이를 두 배로"
      title="네 배가 되는 칸은 하나이고 전체는 158 ps입니다"
      description="행 높이는 저항, 열 너비는 용량, 칸 넓이는 시간입니다. 세 장면이 모두 같은 축척을 씁니다. 단면과 주변 구조가 같다는 가정에서 R과 C를 길이에 비례시켰습니다."
      note="색은 길이를 두 배로 했을 때의 배수입니다. 파랑 ×2, 주황 ×4, 회색 ×1. 값은 π 근사의 첫 모멘트이며 실제 전파 지연이 아닙니다."
      ariaLabel="배선 길이를 두 배로 할 때 칸별 지연 항의 배수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const k = scene.doubled ? 2 : 1;
        const rows = [
          { label: "출력 500 Ω", ohm: 500 },
          { label: `선 ${200 * k} Ω`, ohm: 200 * k },
        ];
        const cols = [
          { label: `시작 ${50 * k}`, ff: 50 * k },
          { label: `끝 ${50 * k}`, ff: 50 * k },
          { label: "입력 20", ff: 20 },
        ];
        return (
          <div className="w-full min-w-0 overflow-x-auto">
            <svg viewBox="0 0 420 232" className="mx-auto h-auto w-full min-w-[20rem] max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={86} y={14} fontSize={12} fill={GRAY}>열 이름의 단위는 fF</text>
              <RcGrid
                x0={86}
                y0={44}
                pxPerFf={1.3}
                pxPerOhm={0.14}
                rows={rows}
                cols={cols}
                cellText={(row, col) => {
                  const factor = FACTORS[row][col];
                  if (factor === null) return null;
                  if (active === 2) return `×${factor}`;
                  return `${(rows[row].ohm * cols[col].ff) / 1000}`;
                }}
                cellColor={(row, col) => colorOf(FACTORS[row][col])}
                overlay={({ xs, ys }) => (
                  <text x={xs[0]} y={ys[2] + 22} fontSize={14} fontWeight={700} fill={GRAY}>
                    {active === 0 ? "합계 74 ps" : active === 1 ? "합계 158 ps" : "40 + 108 + 10 = 158 ps"}
                  </text>
                )}
              />
            </svg>
          </div>
        );
      }}
    />
  );
}
