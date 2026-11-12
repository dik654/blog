import SceneShell from "./SceneShell";

/**
 * 본문 대응: #failure-attribution — corpus → 후보 → 최종 문맥 → 답변 주장 순서로 검사하고
 * 처음 끊긴 검사의 갈림길이 수정 담당을 정한다.
 * 마지막 장면은 본문 TermBreakdown의 예(d-04가 corpus에는 있으나 후보 ID 목록에는 없음)이다.
 */
const CHECKS = [
  { ask: "필요 문서가 corpus에 있나?", exit: "ingestion failure" },
  { ask: "후보 집합에 들어왔나?", exit: "retrieval failure" },
  { ask: "최종 문맥에 남았나?", exit: "selection·ranking failure" },
  { ask: "답변 주장이 모두 지지되나?", exit: "generation failure" },
] as const;

type State = "pass" | "fail" | "wait";

const SCENES = [
  {
    label: "원문이 저장소에 있었는지부터 봅니다",
    summary: "q-732 · d-17·d-04 있음",
    states: ["pass", "wait", "wait", "wait"] as readonly State[],
    detail: ["d-17·d-04 모두 corpus에 있음", "", "", ""],
    note: "문서가 corpus에도 없었다면 앞단 ingestion failure로 갈라집니다. q-732는 두 문서가 있어 다음 검사로 갑니다.",
  },
  {
    label: "두 문서가 후보에 들어왔습니다",
    summary: "retrieval 통과",
    states: ["pass", "pass", "wait", "wait"] as readonly State[],
    detail: ["d-17·d-04 모두 corpus에 있음", "후보 ID에 d-17·d-04", "", ""],
    note: "후보 ID 목록에 두 문서가 있으므로 retrieval failure 갈림길로 가지 않습니다.",
  },
  {
    label: "최종 문맥에도 남았습니다",
    summary: "selection·ranking 통과",
    states: ["pass", "pass", "pass", "wait"] as readonly State[],
    detail: ["d-17·d-04 모두 corpus에 있음", "후보 ID에 d-17·d-04", "최종 문맥 [d-17, d-04]", ""],
    note: "두 문서가 최종 문맥까지 도착했으므로 선택·재정렬 단계에서 빠진 것도 아닙니다.",
  },
  {
    label: "답변에서 처음 미지지 주장이 생겼습니다",
    summary: "owner = generation",
    states: ["pass", "pass", "pass", "fail"] as readonly State[],
    detail: ["d-17·d-04 모두 corpus에 있음", "후보 ID에 d-17·d-04", "최종 문맥 [d-17, d-04]", "claim-3 미지지"],
    note: "근거가 문맥에 있는데 claim-3만 지지되지 않으므로 첫 실패는 generation입니다. 다만 낮은 judge 점수만으로 확정하지 않고 실제 문서·주장 ID를 확인합니다.",
  },
  {
    label: "기록이 다르면 같은 오답도 다른 곳에서 끊깁니다",
    summary: "본문의 다른 예 → retrieval",
    states: ["pass", "fail", "wait", "wait"] as readonly State[],
    detail: ["d-04가 corpus에는 있음", "후보 ID 목록에 d-04 없음", "", ""],
    note: "본문 예처럼 d-04가 corpus에는 있지만 후보에 없었다면 두 번째 검사에서 끊기고 retrieval failure가 담당입니다. 처음 끊긴 자리가 수정 담당을 정합니다.",
  },
] as const;

const STATE_TEXT: Record<State, string> = { pass: "예 → 다음", fail: "아니오", wait: "대기" };

export default function FirstFailureChainViz() {
  return (
    <SceneShell
      eyebrow="첫 실패 찾기"
      title="검사를 순서대로 지나다 처음 '아니오'가 나온 곳이 담당입니다"
      description="위에서부터 한 칸씩 검사합니다. 각 검사에서 '아니오'가 나오면 그 검사의 갈림길 failure로 귀속하고 멈춥니다."
      ariaLabel="corpus, 후보, 최종 문맥, 답변 주장 순서로 첫 실패를 찾는 갈림길"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <ol className="space-y-2">
            {CHECKS.map((check, index) => {
              const state = scene.states[index];
              const failed = state === "fail";
              return (
                <li key={check.ask} className="grid items-stretch gap-1 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-2">
                  <div
                    className={`min-w-0 rounded-lg border px-3 py-2 ${
                      failed ? "border-red-600" : state === "pass" ? "border-primary" : "border-dashed border-border"
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                      <span className="text-sm font-bold">
                        {index + 1}. {check.ask}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          failed ? "text-red-700 dark:text-red-400" : state === "pass" ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {STATE_TEXT[state]}
                      </span>
                    </div>
                    <p className="min-h-[1rem] font-mono text-[11px] leading-4 text-muted-foreground">{scene.detail[index]}</p>
                  </div>
                  <div
                    className={`flex min-w-0 items-center rounded-lg border px-2 py-1 text-[11px] leading-4 sm:py-2 ${
                      failed ? "border-red-600 font-bold text-red-700 dark:text-red-400" : "border-dashed border-border/60 text-muted-foreground/70"
                    }`}
                  >
                    <span className="break-words">
                      {failed ? "→ 담당: " : "아니오면 → "}
                      {check.exit}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        );
      }}
    />
  );
}
