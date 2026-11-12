import SceneShell from "./SceneShell";

/**
 * 본문 대응: #asset-risk ExplainedFormula R = L × I와 "통제 후에는 잔여위험" 문단.
 * 퇴직 계정 악용 L=3, I=4 → 12. 통제 뒤 L=1로 재판정하면 1×4=4.
 * 같은 12(L=4, I=3)와 낮은 빈도·치명적 영향(L=1, I=5 → 5)은 설명용 가정.
 */
const LEVELS = [1, 2, 3, 4, 5] as const;
const IMPACT_ROWS = [5, 4, 3, 2, 1] as const;

type Mark = { l: number; i: number; tag: string; tone: "main" | "alt" | "ref" | "after" };

const SCENES = [
  {
    label: "고유위험 12",
    summary: "L 3 × I 4 = 12",
    note: "퇴직자 VPN 계정이 회수되지 않아 고객 DB가 조회되는 시나리오를 발생가능성 3, 업무 영향 4로 판정하면 우선순위 점수는 12입니다. 이 숫자는 위험의 물리량이 아니라 조직이 정의한 등급(ordinal)을 곱한 순서 후보입니다.",
    marks: [{ l: 3, i: 4, tag: "퇴직 계정", tone: "main" }] as Mark[],
  },
  {
    label: "같은 12, 다른 뜻",
    summary: "4 × 3 = 3 × 4",
    note: "발생가능성 4·영향 3인 다른 시나리오(가정)도 12가 됩니다. 점수는 같아도 발생가능성과 영향의 조합은 다른 칸이므로, 같은 점수의 의미와 수용 기준을 따로 검토합니다.",
    marks: [
      { l: 3, i: 4, tag: "퇴직 계정", tone: "main" },
      { l: 4, i: 3, tag: "다른 시나리오 (가정)", tone: "alt" },
    ] as Mark[],
  },
  {
    label: "통제 뒤 잔여위험",
    summary: "L 3 → 1, 1 × 4 = 4",
    note: "통제를 적용한 뒤 발생가능성을 1로 재판정하면 잔여위험은 4입니다. 영향 4는 그대로입니다. 이 이동은 실제 회수 표본, 접속 차단 test, 로그를 근거로 L을 다시 판정했을 때만 정당하며 숫자만 낮춰서는 안 됩니다.",
    marks: [
      { l: 3, i: 4, tag: "통제 전", tone: "ref" },
      { l: 1, i: 4, tag: "재판정 뒤", tone: "after" },
    ] as Mark[],
  },
  {
    label: "곱셈만으로 수용하지 않음",
    summary: "1 × 5 = 5여도 따로 검토",
    note: "낮은 빈도·치명적 영향인 시나리오(가정: L 1, I 5)는 점수가 5로 12보다 낮습니다. 그래도 이런 위험과 법정 필수조치, 연쇄위험은 단순 곱셈 임계값만으로 자동 수용하지 않습니다.",
    marks: [
      { l: 3, i: 4, tag: "퇴직 계정", tone: "ref" },
      { l: 1, i: 5, tag: "낮은 빈도·치명적 (가정)", tone: "alt" },
    ] as Mark[],
  },
] as const;

const TONE = {
  main: "border-2 border-primary bg-primary/[0.12] font-bold text-foreground",
  alt: "border-2 border-dashed border-amber-600 bg-amber-500/[0.08] font-semibold text-foreground",
  ref: "border-2 border-foreground/40 bg-muted/40 font-semibold text-foreground",
  after: "border-2 border-emerald-600 bg-emerald-500/[0.12] font-bold text-foreground",
} as const;

export default function RiskMatrixViz() {
  return (
    <SceneShell
      eyebrow="위험 등급표"
      title="같은 곱셈 점수도 등급표의 어느 칸인지 함께 봐야 합니다"
      description="가로는 발생가능성 등급 L, 세로는 업무 영향 등급 I이고 칸 안 숫자는 L × I입니다. 영향 등급도 1~5로 놓았습니다(가정). 점선 칸은 설명을 위해 가정한 시나리오입니다."
      ariaLabel="발생가능성과 영향 5 곱하기 5 등급표에서 위험 시나리오 위치 네 장면"
      scenes={SCENES}
      render={(active) => {
        const marks = SCENES[active].marks;
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 grid-cols-[1.75rem_repeat(5,minmax(0,1fr))] gap-1">
              {IMPACT_ROWS.map((impact) => (
                <div key={impact} className="contents">
                  <span className="flex items-center justify-center font-mono text-xs text-muted-foreground">I{impact}</span>
                  {LEVELS.map((l) => {
                    const mark = marks.find((m) => m.l === l && m.i === impact);
                    return (
                      <div
                        key={l}
                        className={`flex min-h-[3.25rem] min-w-0 flex-col items-center justify-center rounded-md px-1 text-center ${
                          mark ? TONE[mark.tone] : "border border-border/70 text-muted-foreground/70"
                        }`}
                      >
                        <span className="font-mono text-sm">{l * impact}</span>
                        {mark ? <span className="text-[10px] leading-3 sm:text-[11px]">{mark.tag}</span> : null}
                      </div>
                    );
                  })}
                </div>
              ))}
              <span />
              {LEVELS.map((l) => (
                <span key={l} className="text-center font-mono text-xs text-muted-foreground">
                  L{l}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">L 발생가능성 등급 · I 업무 영향 등급 · 등급 1과 2의 차이가 실제로 두 배라는 뜻은 아닙니다.</p>
          </div>
        );
      }}
    />
  );
}
