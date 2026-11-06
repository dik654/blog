import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-selection, #source-inherit — 우선순위별 준비 목록을 위에서부터 보고 비어 있지 않은 첫 목록을 고른다.
 * 제어 3·센서 2·로그 1. 제어가 기다리면 목록 3이 비고, 센서가 뮤텍스를 요청하면 로그가 목록 2로 옮겨지고 센서는 잠든다.
 */
type Chip = { name: string; picked?: boolean; moved?: boolean };

const SCENES: readonly { label: string; summary: string; note: string; lists: readonly (readonly Chip[])[]; out: string }[] = [
  { label: "0 ms", summary: "목록 3 → 제어", out: "없음", lists: [[{ name: "제어", picked: true }], [{ name: "센서" }], [{ name: "로그" }]], note: "셋이 모두 준비됐습니다. 위에서부터 보면 첫 목록 3이 비어 있지 않으므로 제어를 고릅니다." },
  { label: "제어가 기다림", summary: "목록 3 빔 → 목록 2의 센서", out: "제어(다음 시각까지)", lists: [[], [{ name: "센서", picked: true }], [{ name: "로그" }]], note: "제어가 일을 끝내고 다음 시각까지 기다리면 준비 목록에서 빠집니다. 목록 3이 비었으니 다음 목록 2에서 센서를 고릅니다." },
  { label: "10절: 센서가 뮤텍스 요청", summary: "로그 우선순위 1 → 2", out: "제어(다음 시각까지)", lists: [[], [{ name: "센서" }, { name: "로그", moved: true }], []], note: "여기부터 10절의 경우입니다. 보유자 로그의 우선순위 1이 요청자 센서의 2보다 작아 로그를 2로 올리고 목록 2로 옮깁니다(13절)." },
  { label: "10절: 센서가 잠듦", summary: "목록 2의 로그", out: "제어, 센서(뮤텍스 대기)", lists: [[], [{ name: "로그", picked: true }], []], note: "잠든 센서는 준비 목록에 없습니다. 로그가 남은 2 ms를 일해 자원을 돌려줘야 센서가 다시 후보가 됩니다." },
];

export default function ReadyListsViz() {
  return (
    <SceneShell
      eyebrow="준비 목록"
      title="위에서부터 보다가 비어 있지 않은 첫 목록에서 고릅니다"
      description="칸 하나가 우선순위 하나의 준비 목록이고 숫자가 클수록 먼저입니다. 본문의 3·2·1을 한 코어의 일반 선택 경로에 넣은 그림이며 실제 보드의 측정이 아닙니다."
      ariaLabel="우선순위별 준비 목록과 커널이 고르는 작업"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2 text-sm">
            {scene.lists.map((chips, i) => (
              <div key={i} className="grid min-h-10 grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border px-3 py-1">
                <span className="text-xs font-bold text-muted-foreground">목록 {3 - i}</span>
                <div className="flex flex-wrap items-center gap-2">
                  {chips.length === 0 && <span className="text-xs text-muted-foreground">비어 있음</span>}
                  {chips.map((chip) => (
                    <span key={chip.name} className={`rounded-md border px-2 py-1 text-xs font-semibold ${chip.picked ? "border-primary bg-primary/10 text-primary" : chip.moved ? "border-dashed border-amber-600 text-amber-700 dark:text-amber-400" : "border-border"}`}>
                      {chip.name}{chip.picked ? " · 선택" : ""}{chip.moved ? " · 1에서 옮김" : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="grid min-h-10 grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2 rounded-lg border border-dashed border-border px-3 py-1">
              <span className="text-xs font-bold text-muted-foreground">목록 밖</span>
              <span className="text-xs">{scene.out}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
