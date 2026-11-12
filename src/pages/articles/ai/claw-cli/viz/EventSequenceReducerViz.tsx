import CliSceneShell from "./CliSceneShell";

/**
 * 본문 대응: #rendering 의 결정적 reducer 식.
 * seq(e) ≤ seq(S) 이면 duplicate로 무시, seq(e) > seq(S)+1 이면 gap을 복구한 뒤 적용한다.
 * 도착 순서(가정): #1 → #2 → #2 재전송 → #4 → replay로 받은 #3.
 * seq(S): 1 → 2 → 2 → 2 → 4. 적용 순서는 #1, #2, #3, #4.
 */
const ARRIVALS = [
  { seq: 1, event: "TextDelta", payload: "“테스트를 실행합니다”" },
  { seq: 2, event: "ToolStarted", payload: "tool call A" },
  { seq: 2, event: "ToolStarted", payload: "같은 event 재전송" },
  { seq: 4, event: "ToolFinished", payload: "tool call A" },
  { seq: 3, event: "ToolProgress", payload: "replay로 다시 받음" },
] as const;

type Verdict = "적용" | "무시" | "보류" | "";

const SCENES = [
  {
    label: "#1이 도착합니다",
    summary: "seq(S) 0 → 1",
    note: "아직 아무것도 적용하지 않은 state의 번호는 0입니다. #1은 바로 다음 번호이므로 reducer가 적용하고, text buffer에 첫 문장이 들어갑니다.",
    verdicts: ["적용", "", "", "", ""] as Verdict[],
    stateSeq: 0,
    nextSeq: 1,
    tool: "없음",
  },
  {
    label: "#2가 도착합니다",
    summary: "seq(S) 1 → 2",
    note: "#2도 바로 다음 번호입니다. ToolStarted를 적용해 tool call A의 진행 항목을 만듭니다.",
    verdicts: ["적용", "적용", "", "", ""] as Verdict[],
    stateSeq: 1,
    nextSeq: 2,
    tool: "A · 실행 중",
  },
  {
    label: "#2가 한 번 더 도착합니다",
    summary: "2 ≤ 2 → duplicate",
    note: "재전송된 #2의 번호는 이미 적용한 값 이하입니다. duplicate로 무시하므로 tool 항목이 두 개로 늘지 않고 state도 그대로입니다.",
    verdicts: ["적용", "적용", "무시", "", ""] as Verdict[],
    stateSeq: 2,
    nextSeq: 2,
    tool: "A · 실행 중",
  },
  {
    label: "#3을 건너뛰고 #4가 도착합니다",
    summary: "4 ≠ 2 + 1 → gap",
    note: "바로 다음 번호는 3인데 4가 왔습니다. #4를 바로 적용하지 않고 보류합니다. 빠진 #3 자리를 빈 text로 메우지도 않습니다.",
    verdicts: ["적용", "적용", "무시", "보류", ""] as Verdict[],
    stateSeq: 2,
    nextSeq: 2,
    tool: "A · 실행 중",
  },
  {
    label: "Replay로 #3을 받아 순서대로 적용합니다",
    summary: "#3 → #4 · seq(S) 4",
    note: "보존된 replay 범위에서 #3을 다시 받아 먼저 적용하고, 보류했던 #4를 이어서 적용합니다. 같은 event들을 같은 순서로 넣었으므로 누가 다시 돌려도 같은 화면 state가 나옵니다.",
    verdicts: ["적용", "적용", "무시", "적용", "적용"] as Verdict[],
    stateSeq: 2,
    nextSeq: 4,
    tool: "A · 완료",
  },
] as const;

const VERDICT_STYLE: Record<Verdict, string> = {
  적용: "border-[#16a34a] text-[#15803d] dark:text-[#4ade80]",
  무시: "border-[#94a3b8] text-[#64748b]",
  보류: "border-[#d97706] text-[#b45309] dark:text-[#fbbf24]",
  "": "border-transparent text-transparent",
};

export default function EventSequenceReducerViz() {
  return (
    <CliSceneShell
      eyebrow="Deterministic reducer"
      title="번호가 겹치거나 빠진 event를 reducer가 처리하는 순서"
      description="도착한 event 목록과, reducer가 그 event를 적용해 만든 화면 state를 나란히 봅니다. seq(S)는 state에 마지막으로 적용한 event 번호입니다. event 내용과 도착 순서는 설명용 가정입니다."
      note="이 순서 규칙은 화면을 재현하는 계약입니다. network 전달이 exactly-once가 되거나 tool side effect가 되돌려진다는 뜻은 아닙니다."
      ariaLabel="event sequence 번호에 따라 적용, duplicate 무시, gap 보류를 보여주는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:gap-5">
            <div className="min-w-0">
              <p className="mb-2 text-[11px] font-bold text-muted-foreground">도착한 event</p>
              <ol className="space-y-1">
                {ARRIVALS.map((arrival, index) => {
                  const shown = index <= active;
                  const verdict = scene.verdicts[index];
                  return (
                    <li
                      key={index}
                      className={`grid min-h-[2.25rem] grid-cols-[2rem_minmax(0,1fr)_3rem] items-center gap-2 rounded-md border px-2 py-0.5 text-xs ${
                        shown ? (index === active ? "border-primary bg-primary/[0.06]" : "border-border") : "border-dashed border-border/40"
                      }`}
                    >
                      <span className={`font-mono font-bold ${shown ? "" : "invisible"}`}>#{arrival.seq}</span>
                      <span className={`min-w-0 leading-4 ${shown ? "" : "invisible"}`}>
                        <code className="break-all text-[11px] sm:mr-2">{arrival.event}</code>
                        <span className="block break-keep text-[10px] text-muted-foreground sm:inline">{arrival.payload}</span>
                      </span>
                      <span className={`rounded border px-1 py-0.5 text-center text-[10px] font-bold ${VERDICT_STYLE[verdict]}`}>{verdict || "·"}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="min-w-0 space-y-2 text-xs">
              <p className="text-[11px] font-bold text-muted-foreground">이 장면이 끝난 뒤의 화면 state S</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border px-2 py-2">
                  <span className="block text-[10px] text-muted-foreground">적용 전 seq(S)</span>
                  <strong className="font-mono text-lg">{scene.stateSeq}</strong>
                </div>
                <div className="rounded-md border border-primary px-2 py-2">
                  <span className="block text-[10px] text-muted-foreground">장면 끝 seq(S)</span>
                  <strong className="font-mono text-lg text-primary">{scene.nextSeq}</strong>
                </div>
              </div>
              <div className="rounded-md border border-border px-2 py-2">
                <span className="block text-[10px] text-muted-foreground">text buffer</span>
                <span className="break-keep">테스트를 실행합니다</span>
              </div>
              <div className="rounded-md border border-border px-2 py-2">
                <span className="block text-[10px] text-muted-foreground">tool call 상태</span>
                <span className="font-semibold">{scene.tool}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
