import OrchestrationSceneShell from "./OrchestrationSceneShell";

/**
 * 본문 대응: #team-lead-workers "취소는 worker process와 권한까지 전파한다".
 * 행 = 취소 때 회수해야 하는 다섯 자원(본문 열거 순서). 마지막 행 = 늦게 도착한 결과.
 * generation 번호 1·2는 설명용 라벨(가정)이다.
 */
type Res = "live" | "queued" | "left" | "gone";

const ROWS = ["queued job", "실행 중 worker", "child process", "임시 credential", "writable workspace"] as const;

const RES_TEXT: Record<Res, string> = {
  live: "실행 중",
  queued: "대기열에 있음",
  left: "남아 있음",
  gone: "회수됨",
};

const RES_CLASS: Record<Res, string> = {
  live: "border-primary text-primary",
  queued: "border-border text-muted-foreground",
  left: "border-red-600 text-red-700 dark:text-red-400",
  gone: "border-emerald-600 text-emerald-700 dark:text-emerald-400",
};

const SCENES = [
  {
    label: "취소 전",
    summary: "현재 generation 1 (가정)",
    gen: "1",
    states: ["queued", "live", "live", "live", "live"],
    late: null,
    note: "Worker 하나가 돌고 있고 다음 job 하나가 대기열에 있다고 둡니다(가정). Worker는 child process를 띄웠고 임시 credential과 쓰기 가능한 workspace를 받았습니다.",
  },
  {
    label: "queue만 비운 취소",
    summary: "대기열 1개 회수 · 4개 남음",
    gen: "2",
    states: ["gone", "left", "left", "left", "left"],
    late: null,
    note: "사용자가 목표를 바꿔 generation 2가 시작됐지만 queued job만 지웠습니다. 실행 중인 worker와 child process, 임시 credential, writable workspace는 그대로 남습니다. 본문이 “부족하다”고 한 상태입니다.",
  },
  {
    label: "끝까지 전파한 취소",
    summary: "다섯 자원 모두 회수",
    gen: "2",
    states: ["gone", "gone", "gone", "gone", "gone"],
    late: null,
    note: "취소를 worker와 child process, 임시 credential, writable workspace까지 전파해 함께 회수합니다.",
  },
  {
    label: "늦게 도착한 결과",
    summary: "generation 1 ≠ 현재 2 → 섞지 않음",
    gen: "2",
    states: ["gone", "gone", "gone", "gone", "gone"],
    late: "generation 1 표시가 붙은 결과가 뒤늦게 도착 → 현재 작업(generation 2)에 합치지 않음",
    note: "취소 전에 출발한 결과가 나중에 도착할 수 있습니다. 결과에 붙은 generation ID가 현재 것과 다르면 현재 작업에 섞지 않습니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  gen: string;
  states: readonly Res[];
  late: string | null;
  note: string;
}[];

export default function CancellationPropagationViz() {
  return (
    <OrchestrationSceneShell
      eyebrow="취소 전파"
      title="queue만 비운 취소와 끝까지 전파한 취소는 남는 자원이 다릅니다"
      description="한 줄이 취소 때 회수해야 하는 자원 하나입니다. Generation ID는 지금 유효한 작업 세대를 구분하는 번호이며, 여기서는 목표가 바뀔 때 1에서 2로 올린다고 둡니다(가정)."
      note="이 흐름은 본문이 제시하는 hardening 계약입니다. 고정 commit b71afdd…의 claw-analog agents runner가 durable cancellation을 구현했다는 뜻은 아닙니다."
      ariaLabel="취소 전후 queued job, worker, child process, 임시 credential, writable workspace의 회수 여부와 늦게 도착한 결과 처리"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        return (
          <div className="min-w-0 space-y-3">
            <p className="text-xs text-muted-foreground">
              현재 작업 generation: <span className="font-mono font-bold text-foreground">{scene.gen}</span>
            </p>
            <ul className="min-w-0 space-y-2">
              {ROWS.map((row, index) => {
                const state = (scene.states as readonly Res[])[index];
                return (
                  <li
                    key={row}
                    className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm"
                  >
                    <span className="min-w-0 font-semibold">{row}</span>
                    <span className={`rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${RES_CLASS[state]}`}>
                      {RES_TEXT[state]}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div
              className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${
                scene.late ? "border-dashed border-amber-600 bg-background" : "border-dashed border-border/50"
              }`}
            >
              <span className="block font-bold">늦게 도착한 결과</span>
              <span className={scene.late ? "" : "text-muted-foreground/60"}>{scene.late ?? "아직 없음"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
