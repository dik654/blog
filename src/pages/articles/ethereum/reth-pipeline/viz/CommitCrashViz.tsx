import PipelineSceneShell from "./PipelineSceneShell";

/**
 * 본문 대응: #commit — output과 checkpoint를 같은 RW provider transaction에 넣고 commit합니다.
 * 왼쪽 = runner가 밟는 순서와 종료 지점. 오른쪽 = 재시작한 노드가 DB에서 보는 상태.
 * 숫자는 글의 가정(checkpoint 99, threshold 64 → 첫 batch 100..163)을 그대로 씁니다.
 * 마지막 장면은 글이 "기존 글의 설명"이라 부른 두 단계 모델로, 현재 runner의 정상 contract가 아닙니다.
 */

type RowState = "done" | "skip" | "fail";

interface Row {
  title: string;
  body: string;
  /** 이 단계가 끝나도 아직 외부에 공개되지 않은 쓰기인지 */
  hidden: boolean;
}

const CURRENT: readonly Row[] = [
  { title: "RW provider 열기", body: "아직 공개되지 않은 transaction", hidden: true },
  { title: "stage.execute", body: "100..163 output 작성", hidden: true },
  { title: "save_stage_checkpoint", body: "checkpoint 163 기록", hidden: true },
  { title: "provider.commit", body: "output·checkpoint 함께 공개", hidden: false },
  { title: "post_execute_commit", body: "commit 뒤 호출되는 hook", hidden: false },
];

const OLD: readonly Row[] = [
  { title: "stage.execute", body: "100..163 output 작성", hidden: true },
  { title: "output commit", body: "output 100..163 먼저 공개", hidden: false },
  { title: "checkpoint marker 쓰기", body: "checkpoint 163 나중에 기록", hidden: false },
  { title: "", body: "", hidden: false },
  { title: "", body: "", hidden: false },
];

interface Scene {
  label: string;
  summary: string;
  note: string;
  rows: readonly Row[];
  /** 이 행 뒤에서 process가 끝납니다. null이면 종료 없음 */
  crashAfter: number | null;
  failRow: number | null;
  checkpoint: 99 | 163;
  outputVisible: boolean;
  verdict: string;
  gap: boolean;
}

const SCENES: readonly Scene[] = [
  {
    label: "Output 작성 뒤 종료",
    summary: "재시작 → 100부터",
    note: "Output 100..163은 RW provider transaction 안에만 있습니다. Commit 전에 process가 끝나면 그 쓰기는 공개되지 않고, 영속된 checkpoint는 여전히 99라서 재시작한 stage는 100부터 다시 계산합니다.",
    rows: CURRENT,
    crashAfter: 1,
    failRow: null,
    checkpoint: 99,
    outputVisible: false,
    verdict: "output과 checkpoint가 같은 지점(99)",
    gap: false,
  },
  {
    label: "Checkpoint 저장 뒤 종료",
    summary: "재시작 → 여전히 100부터",
    note: "save_stage_checkpoint로 163을 기록했어도 같은 transaction이 commit되기 전입니다. Output과 checkpoint는 함께 공개되지 않으므로 재시작 상태는 앞 장면과 같습니다.",
    rows: CURRENT,
    crashAfter: 2,
    failRow: null,
    checkpoint: 99,
    outputVisible: false,
    verdict: "output과 checkpoint가 같은 지점(99)",
    gap: false,
  },
  {
    label: "Commit 직후 종료",
    summary: "재시작 → 164부터",
    note: "provider.commit이 끝나면 output 100..163과 checkpoint 163이 한 번에 영속화됩니다. 재시작한 stage는 checkpoint 163 다음인 164부터 이어 갑니다.",
    rows: CURRENT,
    crashAfter: 3,
    failRow: null,
    checkpoint: 163,
    outputVisible: true,
    verdict: "output과 checkpoint가 같은 지점(163)",
    gap: false,
  },
  {
    label: "Hook 실패",
    summary: "commit된 163은 그대로",
    note: "post_execute_commit은 commit 뒤에 호출됩니다. 이 hook을 durable checkpoint의 owner로 보지 않고, hook 성공 여부가 이미 commit된 transaction을 되돌린다고 해석하지도 않습니다.",
    rows: CURRENT,
    crashAfter: null,
    failRow: 4,
    checkpoint: 163,
    outputVisible: true,
    verdict: "commit된 output·checkpoint 163 유지",
    gap: false,
  },
  {
    label: "기존 글의 두 단계 설명",
    summary: "공개 틈: output만 앞섬",
    note: "Output을 먼저 commit하고 marker를 나중에 쓰는 모델이라면 둘 사이에 끝난 노드는 output 100..163을 보면서 checkpoint는 99로 읽습니다. 현재 runner는 둘을 한 transaction으로 묶으므로 정상 contract에서 이 틈을 전제로 설명하면 안 됩니다.",
    rows: OLD,
    crashAfter: 1,
    failRow: null,
    checkpoint: 99,
    outputVisible: true,
    verdict: "output은 163까지, checkpoint는 99",
    gap: true,
  },
];

const rowState = (scene: Scene, index: number): RowState => {
  if (scene.failRow === index) return "fail";
  if (scene.crashAfter === null) return "done";
  return index <= scene.crashAfter ? "done" : "skip";
};

/** 재시작 뒤 보이는 범위를 99..163 축에 그립니다. */
function RangeBar({ checkpoint, outputVisible, gap }: { checkpoint: number; outputVisible: boolean; gap: boolean }) {
  const L = 22;
  const R = 218;
  const x = (block: number) => L + ((block - 99) / (163 - 99)) * (R - L);
  const cpX = x(checkpoint);
  return (
    <svg viewBox="0 0 240 92" className="h-auto w-full max-w-[320px]" role="img" aria-label={`재시작 뒤 checkpoint ${checkpoint}, output 100..163 ${outputVisible ? "보임" : "보이지 않음"}`}>
      <text x={L} y={14} fontSize={10} fill="#64748b">output 100..163</text>
      <rect x={x(99.5)} y={20} width={x(163) - x(99.5)} height={16} rx={2} fill={outputVisible ? (gap ? "#d97706" : "#2563eb") : "none"} fillOpacity={outputVisible ? 0.85 : 0} stroke={outputVisible ? "none" : "#94a3b8"} strokeWidth={1} strokeDasharray="4 3" />
      {!outputVisible && <text x={(x(99.5) + x(163)) / 2} y={32} textAnchor="middle" fontSize={10} fill="#64748b">보이지 않음</text>}
      <line x1={L} x2={R} y1={50} y2={50} stroke="#94a3b8" strokeWidth={1} />
      <text x={L} y={66} textAnchor="middle" fontSize={10} fill="#64748b">99</text>
      <text x={R} y={66} textAnchor="end" fontSize={10} fill="#64748b">163</text>
      <path d={`M ${cpX} 44 l -6 -9 h 12 z`} fill={gap ? "#d97706" : "#0f766e"} />
      <text x={checkpoint === 99 ? cpX + 8 : cpX - 8} y={84} textAnchor={checkpoint === 99 ? "start" : "end"} fontSize={11} fontWeight={700} fill={gap ? "#b45309" : "#0f766e"}>
        checkpoint {checkpoint}
      </text>
    </svg>
  );
}

export default function CommitCrashViz() {
  return (
    <PipelineSceneShell
      eyebrow="종료 지점별 재시작 상태"
      title="Commit 전에 끝나면 99로, 뒤에 끝나면 163으로 돌아옵니다"
      description="왼쪽은 runner가 한 batch를 저장하는 순서와 process가 끝난 지점(✕)이고, 오른쪽은 재시작한 노드가 DB에서 읽는 상태입니다. Checkpoint 99·batch 100..163은 글의 설명용 가정입니다."
      note="Commit은 한 transaction의 쓰기를 한꺼번에 영속화하고 공개하는 단계입니다. 마지막 장면은 현재 runner가 아니라 글이 바로잡은 기존 설명을 그려 본 것입니다."
      ariaLabel="종료 지점에 따라 재시작한 stage가 읽는 checkpoint와 output 범위"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] sm:gap-6">
            <ol className="min-w-0 space-y-2" aria-label={scene.gap ? "기존 두 단계 설명의 순서" : "현재 runner의 저장 순서"}>
              {scene.rows.map((row, rowIndex) => {
                const state = rowState(scene, rowIndex);
                const empty = row.title === "";
                return (
                  <li key={rowIndex} className="relative min-w-0">
                    <div
                      className={`grid min-h-[2.5rem] grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-2 border px-2 py-1 ${
                        empty ? "invisible border-transparent" : state === "fail" ? "border-red-600/70" : state === "done" ? "border-border bg-background" : "border-dashed border-border/60"
                      }`}
                      aria-hidden={empty || undefined}
                    >
                      <span className="font-mono text-[10px] font-bold text-muted-foreground">{String(rowIndex + 1).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <strong className={`block break-all font-mono text-[11px] leading-4 ${state === "skip" ? "text-muted-foreground/60" : ""}`}>{row.title}</strong>
                        <span className={`block break-keep text-[11px] leading-4 ${state === "skip" ? "text-muted-foreground/50" : "text-muted-foreground"}`}>{row.body}</span>
                      </span>
                      <span className="text-right text-[10px] font-bold leading-4">
                        <span className={`block whitespace-nowrap ${state === "fail" ? "text-red-700 dark:text-red-400" : state === "skip" ? "text-muted-foreground/50" : row.hidden ? "text-muted-foreground" : "text-primary"}`}>
                          {state === "fail" ? "✕ hook 실패" : state === "skip" ? "실행 안 됨" : row.hidden ? "미공개" : "공개"}
                        </span>
                        <span className={`block whitespace-nowrap text-red-700 dark:text-red-400 ${scene.crashAfter === rowIndex ? "" : "invisible"}`} aria-hidden={scene.crashAfter !== rowIndex || undefined}>✕ 이 뒤 종료</span>
                      </span>
                    </div>
                    {scene.crashAfter === rowIndex && <span aria-hidden="true" className="absolute -bottom-[5px] left-0 right-0 h-px bg-red-600" />}
                  </li>
                );
              })}
            </ol>
            <div className="min-w-0 border-t border-border pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
              <p className="text-xs font-bold text-muted-foreground">재시작한 노드가 읽는 DB</p>
              <div className="mt-3"><RangeBar checkpoint={scene.checkpoint} outputVisible={scene.outputVisible} gap={scene.gap} /></div>
              <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-xs leading-5">
                <dt className="text-muted-foreground">다음 시작</dt>
                <dd className="font-mono font-bold">{scene.checkpoint + 1}</dd>
                <dt className="text-muted-foreground">판정</dt>
                <dd className={`break-keep font-bold ${scene.gap ? "text-amber-700 dark:text-amber-400" : "text-primary"}`}>{scene.verdict}</dd>
              </dl>
            </div>
          </div>
        );
      }}
    />
  );
}
