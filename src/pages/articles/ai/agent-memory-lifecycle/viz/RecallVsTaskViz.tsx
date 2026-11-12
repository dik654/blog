import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-action-evaluation — 가정 사례. 사실 100개 중 90개 회상(90%),
 * 그 기억이 필요한 후속 업무 20개 중 8개 성공(40%). 실패 12개를 다섯 원인으로 나눠 본다.
 * 본문이 원인별 개수를 주지 않으므로 칸을 원인에 배정하지 않는다.
 */
const FACTS = 100;
const RECALLED = 90;
const TASKS = 20;
const DONE = 8;
const FAILED = TASKS - DONE;
const CAUSES = ["저장 누락", "검색 실패", "오래된 사실", "적용 오류", "도구 실행 오류"] as const;

const SCENES = [
  {
    label: "회상 평가",
    summary: `${RECALLED} / ${FACTS} = ${(RECALLED * 100) / FACTS}%`,
    note: "분모는 지난 사실 100개입니다. 그중 90개를 맞혔으니 회상 정확도는 90%입니다.",
  },
  {
    label: "업무 평가",
    summary: `${DONE} / ${TASKS} = ${(DONE * 100) / TASKS}%`,
    note: "분모가 그 기억을 써야 하는 후속 업무 20개로 바뀝니다. 8개만 끝냈으니 업무 성공률은 40%입니다. 분모가 다른 두 숫자라 하나의 정확도로 합칠 수 없습니다.",
  },
  {
    label: "실패 12개 나누기",
    summary: `${TASKS} − ${DONE} = ${FAILED}개 → 다섯 원인`,
    note: "실패한 12개 업무를 다섯 원인으로 나눠 봅니다. 사실을 context에 넣어 주어도 행동이 틀리면 검색량만 늘려서는 해결되지 않습니다. 원인별 개수는 본문이 정하지 않아 칸을 배정하지 않았습니다.",
  },
] as const;

function Cell({ on, tone }: { on: boolean; tone: "recall" | "task" | "fail" }) {
  const filled = tone === "recall" ? "border-blue-600 bg-blue-500/45" : "border-emerald-600 bg-emerald-500/45";
  const cls = tone === "fail" ? "border-red-600 border-dashed bg-transparent" : on ? filled : "border-slate-400/60 bg-transparent";
  return <span className={`block aspect-square rounded-[2px] border ${cls}`} />;
}

export default function RecallVsTaskViz() {
  return (
    <SceneShell
      eyebrow="회상과 행동"
      title="회상 90%와 업무 성공 40%는 분모가 다른 숫자입니다"
      description="칸 하나가 사실 한 개 또는 업무 한 개입니다. 본문의 가정 사례(사실 100개 중 90개 회상, 업무 20개 중 8개 성공)이며 논문의 점수가 아닙니다."
      ariaLabel="회상 정확도 90퍼센트와 업무 성공률 40퍼센트의 분모 차이와 실패 원인"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className={`min-w-0 ${active === 0 ? "" : "opacity-45"}`}>
            <p className="text-xs font-semibold">지난 사실 100개 <span className="font-normal text-muted-foreground">· 채운 칸 = 맞힌 회상</span></p>
            <div className="mt-2 grid gap-[3px]" style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }} aria-hidden="true">
              {Array.from({ length: FACTS }, (_, i) => (
                <Cell key={i} on={i < RECALLED} tone="recall" />
              ))}
            </div>
          </div>
          <div className={`min-w-0 ${active === 0 ? "opacity-45" : ""}`}>
            <p className="text-xs font-semibold">후속 업무 20개 <span className="font-normal text-muted-foreground">· 채운 칸 = 끝낸 업무</span></p>
            <div className="mt-2 grid max-w-[16rem] gap-1" style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }} aria-hidden="true">
              {Array.from({ length: TASKS }, (_, i) => (
                <Cell key={i} on={i < DONE} tone={active === 2 && i >= DONE ? "fail" : "task"} />
              ))}
            </div>
            <div className={`mt-3 ${active === 2 ? "" : "invisible"}`}>
              <p className="text-xs text-red-700 dark:text-red-400">빨간 점선 12칸을 나눠 볼 원인</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {CAUSES.map((cause) => (
                  <li key={cause} className="rounded border border-border px-1.5 py-0.5 text-xs">{cause}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    />
  );
}
