import PlotMap from "./PlotMap";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 7절 둘째 문단 — 기술 언어는 어떤 관계가 틀렸는지 보여 주지만
 * 사라진 문서나 거짓 증언을 스스로 복원하지 않는다. 나무가 D에서 발견되는 상황은 가정입니다.
 */
type Check = { relation: string; mark: "ok" | "fail" | "ask" };

const SCENES: readonly { label: string; summary: string; note: string; current: boolean; checks: readonly Check[] }[] = [
  {
    label: "기록 시점의 판정",
    summary: "세 관계 모두 B에서 성립",
    note: "기록은 ‘P의 동쪽이면서 T를 포함하고 R 북쪽인 B 구획’입니다. 기록을 만든 그림 위에서는 세 관계가 모두 B를 가리킵니다.",
    current: false,
    checks: [
      { relation: "P의 동쪽", mark: "ok" },
      { relation: "T 포함", mark: "ok" },
      { relation: "R 북쪽", mark: "ok" },
    ],
  },
  {
    label: "현장과 대조 (가정)",
    summary: "어긋난 관계는 ‘T 포함’ 하나",
    note: "지금 현장에서 나무가 D에 있다고 가정합니다. 관계를 셋으로 나눠 두었기 때문에 B에 대해 ‘P 동쪽’과 ‘R 북쪽’은 그대로이고 ‘T 포함’만 틀렸다고 정확히 짚을 수 있습니다.",
    current: true,
    checks: [
      { relation: "P의 동쪽", mark: "ok" },
      { relation: "T 포함", mark: "fail" },
      { relation: "R 북쪽", mark: "ok" },
    ],
  },
  {
    label: "관계 문장이 답하지 않는 것",
    summary: "왜 어긋났는지는 증거 검사로",
    note: "나무가 옮겨졌는지, 기록자의 지각이나 증언이 잘못됐는지는 관계 문장만으로 정해지지 않습니다. 지도 작성 시점·표식 이동·기록자의 지각과 증언을 따로 검사해야 하며, 기술 언어가 사라진 문서나 거짓 증언을 스스로 복원하지는 않습니다.",
    current: true,
    checks: [
      { relation: "지도 작성 시점", mark: "ask" },
      { relation: "표식 이동", mark: "ask" },
      { relation: "기록자의 지각·증언", mark: "ask" },
    ],
  },
];

const MARK = {
  ok: { text: "성립", className: "text-emerald-700 dark:text-emerald-400" },
  fail: { text: "어긋남", className: "text-red-700 dark:text-red-400" },
  ask: { text: "따로 검사", className: "text-amber-700 dark:text-amber-400" },
} as const;

export default function MarkerMismatchViz() {
  return (
    <SceneShell
      eyebrow="언어 분석과 증거 검사"
      title="관계를 나눠 두면 무엇이 틀렸는지는 보이지만, 왜 틀렸는지는 따로 찾아야 합니다"
      description="3절의 네 구획 그림을 다시 씁니다. 배치와 ‘나무가 D에서 발견된다’는 상황은 설명을 위한 가정입니다."
      ariaLabel="기록의 세 관계를 현장과 대조해 어긋난 관계 하나를 찾고, 그 원인은 증거 검사로 넘기는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center">
            <PlotMap
              states={{ A: "out", B: "chosen", C: "out", D: "out" }}
              treeIn={scene.current ? "D" : "B"}
              ghostTreeIn={scene.current ? "B" : undefined}
              eastLine
              ariaLabel={`${scene.label}: ${scene.summary}`}
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-muted-foreground">{scene.checks[0].mark === "ask" ? "남는 질문" : "B 구획에 대한 관계"}</p>
              <ul className="mt-2 space-y-2">
                {scene.checks.map((check) => (
                  <li key={check.relation} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                    <span>{check.relation}</span>
                    <span className={`text-xs font-bold ${MARK[check.mark].className}`}>{MARK[check.mark].text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }}
    />
  );
}
