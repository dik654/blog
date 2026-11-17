import SceneShell from "./SceneShell";

/**
 * 본문 대응: #recheck — BlockExecutor.Commit은 mempool write lock을 잡고 FlushAppConn → Commit(X41) 뒤
 * Update goroutine에 unlock 함수를 넘긴다. Update(41)·optional recheck가 끝나야 unlock되므로
 * 그동안 새 CheckTx와 reap은 기다린다.
 */
const ROWS = [
  { exec: "Lock()", update: "", waiting: "대기 시작" },
  { exec: "FlushAppConn", update: "", waiting: "대기" },
  { exec: "Commit → X41", update: "", waiting: "대기" },
  { exec: "goroutine 시작 · unlock 넘김", update: "unlock 받음", waiting: "대기" },
  { exec: "", update: "Update(41) · T1 제거", waiting: "대기" },
  { exec: "", update: "Recheck · T2를 X41로", waiting: "대기" },
  { exec: "", update: "unlockMempool()", waiting: "진행" },
] as const;

const LOCKED_UNTIL = 5;

const SCENES = [
  { label: "write lock", summary: "새 CheckTx·reap 차단", note: "BlockExecutor가 mempool write lock을 잡습니다. CheckTx와 reap은 이 lock과 충돌하는 read lock이 필요하므로 지금부터 기다립니다." },
  { label: "Flush", summary: "X40 기준 callback 마감", note: "이미 application에 보낸 CheckTx의 응답 callback을 모두 끝냅니다. lock 안에서 비우므로 이전 state(X40) 기준 admission이 Commit 뒤로 끼어들지 않습니다. 실패하면 lock을 풀고 error를 반환합니다." },
  { label: "Commit", summary: "application state X41", note: "Application이 B41을 반영한 X41을 영속화합니다. 이 단계가 실패해도 lock을 풀고 error를 반환합니다." },
  { label: "넘김", summary: "Commit 반환 · lock은 유지", note: "Commit 함수는 asyncUpdateMempool을 별도 goroutine으로 시작하고 반환합니다. 하지만 unlock 함수를 그 goroutine에 함께 넘기므로 lock은 아직 풀리지 않습니다." },
  { label: "Update", summary: "T1 pool 제거 · key는 cache", note: "새 pre/postCheck를 설치하고 B41에 들어간 T1을 active pool에서 지웁니다. Valid committed T1의 key는 cache에 남깁니다." },
  { label: "Recheck", summary: "남은 T2를 X41로 재검사", note: "Recheck 설정이 켜져 있으면 pool에 남은 T2를 CheckTxType_Recheck로 X41에서 다시 검사합니다. 이것도 lock 구간 안입니다." },
  { label: "unlock", summary: "대기하던 CheckTx·reap 진행", note: "Update goroutine이 끝나며 defer로 unlock합니다. 이제 기다리던 새 CheckTx와 reap이 X41 기준 pool을 봅니다." },
] as const;

export default function CommitLockViz() {
  return (
    <SceneShell
      eyebrow="Commit과 mempool 세대 전환"
      title="Write lock은 Commit 함수가 반환한 뒤에도 Update와 recheck가 끝날 때까지 이어집니다"
      description="위에서 아래로 시간이 흐릅니다. 왼쪽 띠가 write lock을 잡고 있는 구간이고, 세 열은 BlockExecutor, Update goroutine, 새로 들어오는 CheckTx·reap 요청입니다."
      ariaLabel="mempool write lock 아래에서 FlushAppConn, Commit, Update, Recheck가 차례로 끝난 뒤 unlock되는 순서"
      scenes={SCENES}
      render={(active) => (
        <div className="grid grid-cols-[1.25rem_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.8fr)] gap-px bg-border p-px text-[11px] leading-4 sm:text-xs sm:leading-5">
          <div className="bg-background" />
          <div className="bg-background p-1.5 text-center font-bold">BlockExecutor</div>
          <div className="bg-background p-1.5 text-center font-bold">Update goroutine</div>
          <div className="bg-background p-1.5 text-center font-bold break-keep">CheckTx · reap</div>
          {ROWS.map((row, index) => {
            const reached = index <= active;
            const current = index === active;
            const locked = index <= LOCKED_UNTIL;
            const cell = (text: string) =>
              text ? (
                <div className={`min-h-[2.5rem] rounded-sm border px-1.5 py-1 break-words sm:min-h-0 sm:py-0.5 ${current ? "border-primary font-bold text-primary" : "border-border"} ${reached ? "" : "opacity-30"}`}>{text}</div>
              ) : null;
            const waitingTone = row.waiting === "진행" ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400";
            return (
              <div key={index} className="contents">
                <div className="bg-background p-0.5">
                  <div className={`h-full w-full rounded-sm ${locked && reached ? "bg-amber-500/70" : locked ? "bg-amber-500/20" : ""}`} aria-hidden />
                </div>
                <div className="min-w-0 bg-background p-1 sm:p-0.5">{cell(row.exec)}</div>
                <div className="min-w-0 bg-background p-1 sm:p-0.5">{cell(row.update)}</div>
                <div className={`flex items-center justify-center bg-background p-1 text-center font-bold ${reached ? waitingTone : "text-muted-foreground/40"}`}>{row.waiting}</div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
