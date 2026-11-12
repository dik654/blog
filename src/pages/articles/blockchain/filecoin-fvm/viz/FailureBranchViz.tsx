import SceneShell from "./SceneShell";

/**
 * 본문 대응: #machine-flush 셋째 문단 — 실패가 어느 단계에서 나느냐에 따라
 * message 영수증으로 남는지, 호출자가 전체 실행 실패로 다뤄야 하는지가 갈린다.
 */
const STAGES = ["사전 검사", "Actor 호출", "ApplyRet·영수증", "다음 message", "flush()", "Sfinal"] as const;

type Outcome = "receipt" | "whole";
type Status = "pass" | "fail" | "missing" | "skip" | "made" | "may" | "open" | "none";

const STATUS_TEXT: Record<Status, string> = {
  pass: "통과",
  fail: "× 실패",
  missing: "× 못 만듦",
  skip: "호출 안 함",
  made: "생성",
  may: "만들 수 있음",
  open: "그리지 않음",
  none: "나오지 않음",
};

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  stages: readonly Status[];
  outcome: Outcome;
  result: string;
}[] = [
  {
    label: "사전 검사 실패",
    summary: "actor 호출 없이 조기 ApplyRet",
    note: "사전 검사에서 실패하면 actor를 부르지 않고 조기 ApplyRet을 만들 수 있습니다. 실패가 message 한 건의 결과로 기록되는 갈래입니다.",
    stages: ["fail", "skip", "may", "open", "open", "open"],
    outcome: "receipt",
    result: "조기 ApplyRet (만들 수 있음)",
  },
  {
    label: "Actor non-success exit",
    summary: "actor-call 변경을 되돌린 영수증",
    note: "Actor가 non-success exit code를 내면 actor-call transaction의 변경을 되돌리고, 그 결과가 영수증으로 남습니다. 이 경우도 message 한 건의 결과입니다.",
    stages: ["pass", "fail", "made", "open", "open", "open"],
    outcome: "receipt",
    result: "실패 exit code가 담긴 영수증",
  },
  {
    label: "ApplyRet을 못 만드는 오류",
    summary: "호출자가 전체 실행 실패로 다룸",
    note: "State I/O처럼 executor가 ApplyRet 자체를 만들지 못하는 오류에는 기록할 영수증이 없습니다. 호출자는 이를 전체 실행 실패로 다뤄야 합니다.",
    stages: ["open", "open", "missing", "open", "open", "open"],
    outcome: "whole",
    result: "영수증 없음 · 전체 실행 실패",
  },
  {
    label: "마지막 flush 실패",
    summary: "Sfinal 없음 · 전체 실행 실패",
    note: "모든 message의 영수증을 얻었더라도 마지막 flush가 실패하면 final state root가 나오지 않습니다. 호출자는 이 역시 전체 실행 실패로 다뤄야 합니다.",
    stages: ["pass", "pass", "made", "pass", "fail", "none"],
    outcome: "whole",
    result: "final state root 없음 · 전체 실행 실패",
  },
];

export default function FailureBranchViz() {
  return (
    <SceneShell
      eyebrow="실패가 난 자리에 따라 갈리는 결과"
      title="영수증으로 남는 실패와 전체 실행을 멈추는 실패는 다른 단계에서 납니다"
      description="한 줄이 한 Machine에서 message를 적용하고 flush하는 순서입니다. 빨간 칸이 실패했거나 결과를 만들지 못한 단계, 진한 테두리 칸이 결과가 만들어지는 단계, 점선 칸은 글이 그 경우를 말하지 않아 그리지 않은 단계입니다."
      note="단계 이름은 이 글이 따라간 reference executor(fvm@v4.8.4)의 경계입니다. 실패 뒤 호출자가 다음에 무엇을 하는지는 그리지 않았습니다."
      ariaLabel="FVM 실행 단계별 실패 위치와 결과 갈래"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const whole = scene.outcome === "whole";
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2">
              {STAGES.map((stage, index) => {
                const status = scene.stages[index];
                const tone =
                  status === "fail" || status === "missing"
                    ? "border-red-600 bg-red-500/10 font-bold text-red-700 dark:text-red-400"
                    : status === "made" || status === "may"
                      ? "border-primary bg-primary/5 font-semibold"
                      : status === "pass"
                        ? "border-border bg-background"
                        : "border-dashed border-border text-muted-foreground";
                return (
                  <li
                    key={stage}
                    className={`flex min-h-[4.25rem] min-w-0 flex-col items-center justify-center rounded-md border px-1 py-2 text-center text-xs leading-5 ${tone}`}
                  >
                    <span className="font-mono text-[11px]">{index + 1}</span>
                    <span className="break-keep">{stage}</span>
                    <span className="text-[11px]">{STATUS_TEXT[status]}</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs leading-5 sm:text-sm">
              <div className={`rounded-md border px-3 py-2 ${!whole ? "border-primary bg-primary/5" : "border-dashed border-border text-muted-foreground"}`}>
                <span className="block font-bold">message 결과로 남음</span>
                <span className="block">{!whole ? scene.result : "해당 없음"}</span>
              </div>
              <div className={`rounded-md border px-3 py-2 ${whole ? "border-red-600 bg-red-500/5" : "border-dashed border-border text-muted-foreground"}`}>
                <span className="block font-bold">전체 실행 실패로 다룸</span>
                <span className="block">{whole ? scene.result : "해당 없음"}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
