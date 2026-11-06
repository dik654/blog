import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 대출 6% 안의 신용 1%는 기준 5%를 받는 교환으로 지워지지 않는다.
 * 같은 기준: 6 − 6 + 4 = 4. 기준 5·신용 1: 5 − 5 + 1 + 4 = 5.
 * 세로 눈금 1% = 22.
 */
const UNIT = 22;
const BASE_Y = 150;
const BLUE = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const GRAY = "#64748b";

interface Part {
  value: number;
  color: string;
  label: string;
  faded?: boolean;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  columns: readonly { title: string; sub: string; parts: readonly Part[] }[];
}

const SCENES: readonly Scene[] = [
  {
    label: "기준이 같을 때",
    summary: "6 − 6 + 4 = 4%",
    note: "3절의 가정입니다. 대출 6%가 전부 교환에서 받는 기준과 같으면 받은 6%가 낸 6%를 지우고 고정 4%만 남습니다.",
    columns: [
      { title: "은행에 냄", sub: "대출", parts: [{ value: 6, color: BLUE, label: "기준 6%", faded: true }] },
      { title: "교환에서 받음", sub: "변동", parts: [{ value: 6, color: GREEN, label: "기준 6%", faded: true }] },
      { title: "교환에서 냄", sub: "고정", parts: [{ value: 4, color: AMBER, label: "고정 4%" }] },
      { title: "남는 부담", sub: "합계 4%", parts: [{ value: 4, color: AMBER, label: "고정 4%" }] },
    ],
  },
  {
    label: "6% 안에 신용 1%가 있을 때",
    summary: "기준 5% + 신용 1%",
    note: "대출 6% 안에 회사의 신용 때문에 추가된 1%가 있다고 합시다. 교환 계약에서는 기준 5%만 받습니다. 받는 칸이 낸 칸보다 1%만큼 낮습니다.",
    columns: [
      { title: "은행에 냄", sub: "대출", parts: [{ value: 5, color: BLUE, label: "기준 5%" }, { value: 1, color: RED, label: "신용 1%" }] },
      { title: "교환에서 받음", sub: "변동", parts: [{ value: 5, color: GREEN, label: "기준 5%" }] },
      { title: "교환에서 냄", sub: "고정", parts: [{ value: 4, color: AMBER, label: "고정 4%" }] },
      { title: "남는 부담", sub: "아직 계산 전", parts: [] },
    ],
  },
  {
    label: "지워지는 것과 남는 것",
    summary: "4% + 1% = 5%",
    note: "기준 5%끼리만 지워집니다. 고정 4% 외에 1%가 남아 10억 원이면 5000만 원입니다. 똑같이 변하는 이자라고 부르는 것만으로 상쇄가 성립하지 않습니다.",
    columns: [
      { title: "은행에 냄", sub: "대출", parts: [{ value: 5, color: BLUE, label: "기준 5%", faded: true }, { value: 1, color: RED, label: "신용 1%" }] },
      { title: "교환에서 받음", sub: "변동", parts: [{ value: 5, color: GREEN, label: "기준 5%", faded: true }] },
      { title: "교환에서 냄", sub: "고정", parts: [{ value: 4, color: AMBER, label: "고정 4%" }] },
      { title: "남는 부담", sub: "합계 5%", parts: [{ value: 4, color: AMBER, label: "고정 4%" }, { value: 1, color: RED, label: "신용 1%" }] },
    ],
  },
];

const COL_W = 72;
const COL_GAP = 16;
const LEFT = 8;

export default function BasisResidualViz() {
  return (
    <SceneShell
      eyebrow="상쇄되는 부분"
      title="같은 기준끼리만 지워지고, 신용 때문에 붙은 1%는 남습니다"
      description="(가정) 막대의 높이가 이자율입니다. 옅게 칠하고 점선으로 두른 칸이 서로 지워지는 부분입니다."
      ariaLabel="대출 이자, 교환 수취, 고정 지급을 쌓아 남는 부담을 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <svg viewBox="0 0 360 186" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            <line x1={0} x2={360} y1={BASE_Y} y2={BASE_Y} stroke={GRAY} strokeWidth={1} />
            {s.columns.map((col, i) => {
              const x = LEFT + i * (COL_W + COL_GAP);
              const tops = col.parts.map((_, partIndex) => col.parts.slice(0, partIndex + 1).reduce<number>((sum, part) => sum + part.value, 0));
              return (
                <g key={col.title}>
                  {col.parts.map((part, partIndex) => {
                    const y = BASE_Y - tops[partIndex] * UNIT;
                    const h = part.value * UNIT;
                    return (
                      <g key={part.label}>
                        <rect x={x} y={y} width={COL_W} height={h} fill={part.color} opacity={part.faded ? 0.2 : 0.85} stroke={part.faded ? part.color : "none"} strokeWidth={1} strokeDasharray={part.faded ? "3 3" : undefined} />
                        <text x={x + COL_W / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={part.faded ? part.color : "#ffffff"}>
                          {part.label}
                        </text>
                      </g>
                    );
                  })}
                  <text x={x + COL_W / 2} y={BASE_Y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={GRAY}>
                    {col.title}
                  </text>
                  <text x={x + COL_W / 2} y={BASE_Y + 30} textAnchor="middle" fontSize={10} fill={GRAY}>
                    {col.sub}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
