import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box 둘째 문단, 자세한 설명은 #comparison 첫 문단.
 * 단일 축 법: 인종 차별 주장은 흑인 남성과, 성차별 주장은 백인 여성과 맞춰 본다.
 * 두 비교 어디에도 맞지 않으면 흑인 여성의 고유한 차별이 사라진다.
 */
type CellKey = "bm" | "bw" | "wm" | "ww";

const CELLS: readonly { key: CellKey; race: string; gender: string }[] = [
  { key: "bm", race: "흑인", gender: "남성" },
  { key: "bw", race: "흑인", gender: "여성" },
  { key: "wm", race: "백인", gender: "남성" },
  { key: "ww", race: "백인", gender: "여성" },
];

const SCENES = [
  {
    label: "두 분류의 교차점",
    summary: "흑인 × 여성",
    compare: null,
    lost: false,
    claim: "흑인 여성은 인종 축과 성별 축이 만나는 칸에 있습니다.",
    note: "단일 축이란 인종이면 인종, 성별이면 성별 한 가지 기준으로만 차별을 따지는 틀입니다. 이 그림은 9절이 설명하는 법의 문제를 두 축으로 놓은 것입니다.",
  },
  {
    label: "인종 차별을 주장하면",
    summary: "비교 대상: 흑인 남성",
    compare: "bm",
    lost: false,
    claim: "인종 차별을 증명하려면 흑인 남성과 같은 대우를 받았음을 보여야 했습니다.",
    note: "인종 축 하나로만 보면 흑인 집단의 대표 사례는 흑인 남성 칸이 됩니다.",
  },
  {
    label: "성차별을 주장하면",
    summary: "비교 대상: 백인 여성",
    compare: "ww",
    lost: false,
    claim: "성차별을 증명하려면 백인 여성과 같은 대우를 받았음을 보여야 했습니다.",
    note: "성별 축 하나로만 보면 여성 집단의 대표 사례는 백인 여성 칸이 됩니다.",
  },
  {
    label: "어느 쪽에도 맞지 않으면",
    summary: "고유한 차별이 사라짐",
    compare: null,
    lost: true,
    claim: "두 비교 어디에도 맞지 않으면 흑인 여성이 겪은 고유한 차별이 법과 통계에서 사라집니다.",
    note: "교차성은 이 누락을 비판하며 발전했습니다. 정체성을 하나씩 더한 점수가 아니라 단일 축이 놓친 칸을 찾는 분석 도구입니다.",
  },
] as const;

export default function SingleAxisViz() {
  return (
    <SceneShell
      eyebrow="단일 축의 누락"
      title="두 기준이 만나는 칸은 어느 비교에도 맞지 않을 수 있습니다"
      description="가로는 성별, 세로는 인종입니다. 칸은 집단이며 크기나 인원을 뜻하지 않습니다."
      ariaLabel="흑인 여성이 인종 차별에서는 흑인 남성과, 성차별에서는 백인 여성과 비교되어 고유한 차별이 사라지는 구조"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 text-sm">
              <span />
              <span className="text-center text-xs font-semibold text-muted-foreground">남성</span>
              <span className="text-center text-xs font-semibold text-muted-foreground">여성</span>
              {CELLS.map((cell, index) => {
                const target = cell.key === "bw";
                const compared = scene.compare === cell.key;
                const lost = target && scene.lost;
                const border = lost ? "#dc2626" : target ? "#7c3aed" : compared ? "#d97706" : "#cbd5e1";
                const status = lost ? "차별이 사라짐" : target ? "주장하는 사람" : compared ? "비교 기준" : " ";
                return (
                  <div key={cell.key} className="contents">
                    {index % 2 === 0 ? <span className="self-center text-xs font-semibold text-muted-foreground">{cell.race}</span> : null}
                    <div
                      className="flex h-20 min-w-0 flex-col items-center justify-center rounded-lg px-1 text-center transition-colors duration-300 motion-reduce:transition-none"
                      style={{ borderWidth: compared || target ? 1.25 : 1, borderStyle: lost ? "dashed" : "solid", borderColor: border }}
                    >
                      <span className="font-semibold">{cell.race} {cell.gender}</span>
                      <span className="mt-1 text-xs font-semibold" style={{ color: border === "#cbd5e1" ? "#94a3b8" : border }}>{status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="min-h-[3.5rem] rounded-md border border-border px-3 py-2 text-sm leading-6">{scene.claim}</p>
          </div>
        );
      }}
    />
  );
}
