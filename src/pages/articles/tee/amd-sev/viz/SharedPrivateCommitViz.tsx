import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-lifecycle — input copy → bounds/schema 검증 → protected computation → private commit → 최소 output copy.
 * SHARE: host-visible I/O bytes와 guest private bytes를 분리하고 exit protocol field를 untrusted input으로 검사한다.
 * 실패 표: Shared/private confusion → fail closed, RMP transition crash → page state receipt로 reconcile, 추측 재사용 금지.
 * crash 단계와 operation ID·page identity·generation·result digest 기록이 재시작 뒤 중복 commit·잘못된 page 재사용을 막는다.
 * op#7, page A, generation 3·4는 설명용 가정이다.
 */
const STEPS = ["입력 복사", "검증", "계산", "private commit", "출력 복사"] as const;
const AREA = ["shared → private", "private", "private", "private", "private → shared"] as const;

type Cell = "done" | "commit" | "deny" | "crash" | "idle" | "dup" | "skip";

type Scene = {
  label: string;
  summary: string;
  cells: readonly Cell[];
  ledger: string;
  commits: number;
  note: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "정상 순서",
    summary: "private commit 1회",
    cells: ["done", "done", "done", "commit", "done"],
    ledger: "op#7 · page A gen 3 · commit 완료 · result digest",
    commits: 1,
    note: "Host가 볼 수 있는 shared page의 입력을 먼저 private 쪽으로 복사하고, 복사본을 검사한 뒤 계산합니다. commit은 private page에 한 번 하고, 밖으로 내보낼 출력만 마지막에 shared page로 복사합니다.",
  },
  {
    label: "Exit protocol field가 이상함",
    summary: "검증에서 멈춤 · commit 0회",
    cells: ["done", "deny", "idle", "idle", "idle"],
    ledger: "op#7 · 검증 실패 · commit 없음",
    commits: 0,
    note: "Shared page에 놓인 exit protocol field는 hypervisor가 쓸 수 있는 값이므로 untrusted input입니다. 복사본의 bounds·schema가 맞지 않으면 계산과 commit에 들어가지 않습니다.",
  },
  {
    label: "Shared와 private를 혼동",
    summary: "buffer class mismatch → fail closed",
    cells: ["done", "deny", "idle", "idle", "idle"],
    ledger: "op#7 · buffer class mismatch · commit 없음",
    commits: 0,
    note: "I/O buffer가 기대한 class(shared인지 private인지)와 다르면 그대로 진행하지 않고 닫힌 쪽으로 실패합니다. Host-visible bytes가 private bytes로 섞이거나 그 반대가 되는 길을 막습니다.",
  },
  {
    label: "Commit 앞에서 crash",
    summary: "commit 0회",
    cells: ["done", "done", "crash", "idle", "idle"],
    ledger: "op#7 · page A gen 3 · 계산 중 멈춤",
    commits: 0,
    note: "Private commit 전에 멈췄으므로 이 실행이 바꾼 private state는 없습니다. 기록에는 어느 단계에서 멈췄는지가 남아 재시작 쪽이 처음부터 다시 해도 된다는 것을 압니다.",
  },
  {
    label: "Commit 뒤 crash · 기록 없이 재시도",
    summary: "commit 2회가 될 수 있음",
    cells: ["done", "done", "done", "dup", "done"],
    ledger: "기록 없음 · commit 여부를 알 수 없음",
    commits: 2,
    note: "Commit을 마친 뒤 출력 복사 중에 멈췄는데 기록이 없으면, 재시작 쪽은 commit이 됐는지 모릅니다. 실패를 일시 오류로 보고 처음부터 재시도하면 같은 작업이 두 번 commit될 수 있습니다.",
  },
  {
    label: "Commit 뒤 crash · 기록 확인",
    summary: "다시 commit하지 않음 · 1회 유지",
    cells: ["skip", "skip", "skip", "skip", "done"],
    ledger: "op#7 · page A gen 3 · commit 완료 · result digest 일치",
    commits: 1,
    note: "같은 상황이라도 operation ID와 result digest가 남아 있으면 op#7이 이미 commit됐음을 확인하고, 남은 출력 복사만 이어 갑니다. commit은 한 번으로 유지됩니다.",
  },
  {
    label: "RMP 전환 중 crash · generation이 바뀜",
    summary: "기록 gen 3 ≠ 현재 gen 4 → 재사용 안 함",
    cells: ["skip", "skip", "skip", "deny", "idle"],
    ledger: "op#7 · page A gen 3 기록 · 현재 page A gen 4",
    commits: 0,
    note: "Page state가 전환되는 도중 멈췄다가 돌아와 보니 page A의 generation이 기록과 다릅니다(가정한 3과 4). 같은 이름의 page라고 추측해 재사용하지 않고, page state receipt로 현재 상태를 맞춘(reconcile) 뒤 다음 단계를 정합니다.",
  },
];

const CELL: Record<Cell, { text: string; cls: string }> = {
  done: { text: "완료", cls: "border-border bg-background" },
  commit: { text: "commit 1", cls: "border-green-600/70 bg-green-50 text-green-800 dark:bg-green-950/40 dark:text-green-200" },
  deny: { text: "거부", cls: "border-red-600/70 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200" },
  crash: { text: "crash", cls: "border-amber-600/70 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200" },
  idle: { text: "실행 안 함", cls: "border-dashed border-border text-muted-foreground" },
  dup: { text: "commit 2", cls: "border-red-600/70 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200" },
  skip: { text: "기록으로 확인", cls: "border-dashed border-border text-muted-foreground" },
};

export default function SharedPrivateCommitViz() {
  return (
    <SceneShell
      eyebrow="Commit 순서"
      title="Shared page의 입력은 복사하고 검사한 뒤에만 private commit에 닿습니다"
      description="칸 하나가 한 단계이고, 아래 줄은 그 단계가 어느 page class에서 일어나는지입니다. Shared page는 host도 볼 수 있는 I/O용 page, private page는 guest만 쓰는 page입니다. generation은 같은 page의 state 전환을 구분하려고 붙이는 번호로 두며, op#7·page A·generation 숫자는 가정입니다."
      ariaLabel="SEV-SNP guest의 입력 복사, 검증, 계산, private commit, 출력 복사 순서와 crash 위치별 결과"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <ol className="grid min-w-0 grid-cols-5 gap-1 sm:gap-2">
              {STEPS.map((step, index) => {
                const cell = CELL[scene.cells[index]];
                return (
                  <li key={step} className="min-w-0">
                    <p className="h-9 break-keep text-center text-[11px] font-semibold leading-4 sm:text-xs">{step}</p>
                    <div className={`mt-1 flex h-12 items-center justify-center rounded-md border px-1 text-center text-[11px] font-bold leading-4 sm:text-xs ${cell.cls}`}>
                      {cell.text}
                    </div>
                    <p className="mt-1 h-8 break-keep text-center text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{AREA[index]}</p>
                  </li>
                );
              })}
            </ol>
            <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_9rem]">
              <div className="min-w-0 rounded-md border border-border px-3 py-2">
                <p className="text-[11px] font-bold tracking-wide text-primary">재시작 쪽이 읽는 기록</p>
                <p className="mt-1 break-words font-mono text-xs leading-5 sm:text-sm">{scene.ledger}</p>
              </div>
              <div className="min-w-0 rounded-md border border-border px-3 py-2">
                <p className="text-[11px] font-bold tracking-wide text-primary">이 작업의 private commit</p>
                <p className={`mt-1 font-mono text-lg font-bold ${scene.commits > 1 ? "text-red-700 dark:text-red-400" : ""}`}>{scene.commits}회</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
