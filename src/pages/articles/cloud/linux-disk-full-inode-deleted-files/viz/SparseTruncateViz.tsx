import SceneShell from "./SceneShell";

/**
 * 본문 대응: #diagnose — /proc/PID/fd/FD를 0으로 잘라도 fd의 쓰기 위치는 그대로다.
 * 트랙은 파일 위치이고 30GiB 눈금 뒤에도 칸을 남겼다. 원래 위치에 쓴 조각은 30GiB 앞이 아니라 뒤에 놓인다.
 * 세모는 fd의 다음 쓰기 위치이며, 쓰고 나면 쓴 조각의 끝으로 옮겨 간다.
 * 새로 쓴 조각의 길이는 본문이 정하지 않았으므로 눈금에 비례하지 않는 표시다.
 */
type Part = "full" | "hole" | "none";

const MARK_30 = 88;
const PIECE = 8;

const STATES: readonly { part: Part; piece: "none" | "start" | "end"; pointer: number; size: string; blocks: string }[] = [
  { part: "full", piece: "none", pointer: MARK_30, size: "30GiB", blocks: "30GiB" },
  { part: "none", piece: "none", pointer: MARK_30, size: "0", blocks: "0" },
  { part: "hole", piece: "end", pointer: MARK_30 + PIECE, size: "다시 30GiB + 쓴 만큼", blocks: "새로 쓴 만큼만" },
  { part: "none", piece: "start", pointer: PIECE, size: "새로 쓴 만큼", blocks: "새로 쓴 만큼" },
];

const SCENES = [
  { label: "자르기 전", summary: "크기 30GiB · 블록 30GiB", note: "fd 7은 파일 끝인 30GiB 지점에서 다음 쓰기를 기다립니다. 자르려는 파일입니다." },
  { label: "0 byte로 자름", summary: "크기 0 · 쓰기 위치 30GiB", note: "/proc/812/fd/7을 열어 크기를 0으로 자르면 블록은 돌아옵니다. 그러나 프로세스가 쥔 fd의 쓰기 위치는 잘린 것과 무관하게 30GiB에 남습니다." },
  { label: "O_APPEND 없이 다음 쓰기", summary: "ls 30GiB · du 쓴 만큼", note: "(가정) 다음 쓰기가 원래 위치인 30GiB 지점에 떨어지면 앞부분은 블록이 없는 구멍이 됩니다. 이런 파일이 sparse 파일입니다. ls에 보이는 크기는 다시 30GiB지만 실제 블록은 적어서 du와 du --apparent-size가 다른 값을 보입니다." },
  { label: "O_APPEND로 열었다면", summary: "크기·블록 모두 쓴 만큼", note: "O_APPEND는 쓸 때마다 파일 끝으로 가서 쓰게 하는 열기 옵션입니다. 잘린 파일의 끝은 0이므로 앞에서부터 다시 쌓이고 구멍이 생기지 않습니다." },
];

export default function SparseTruncateViz() {
  return (
    <SceneShell
      eyebrow="자른 뒤의 다음 쓰기"
      title="파일을 잘라도 fd의 쓰기 위치는 30GiB에 남을 수 있습니다"
      description="트랙이 파일 안의 위치이고, 세모가 fd의 다음 쓰기 위치입니다. 칠한 칸은 실제 블록이 있는 곳, 점선은 블록이 없는 곳입니다."
      note="새로 쓴 조각의 길이는 정해진 값이 아니라 표시용이며 눈금에 비례하지 않습니다."
      ariaLabel="파일을 잘랐을 때 쓰기 위치와 sparse 파일이 생기는 과정"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <div className="min-w-0">
            <div className="relative h-5">
              <span className="absolute top-0 -translate-x-1/2 text-xs leading-5" style={{ left: `${state.pointer}%`, color: "#dc2626" }} aria-hidden>▼</span>
            </div>
            <div className="relative h-10 overflow-hidden rounded-sm border border-border bg-background">
              <div className="absolute inset-y-0 w-px" style={{ left: `${MARK_30}%`, backgroundColor: "#64748b" }} />
              {state.part === "full" ? <div className="absolute inset-y-0 left-0" style={{ width: `${MARK_30}%`, backgroundColor: "#2563eb" }} /> : null}
              {state.part === "hole" ? (
                <div className="absolute inset-y-1 left-1 flex items-center justify-center rounded-sm border border-dashed text-xs text-muted-foreground" style={{ width: `calc(${MARK_30}% - 0.5rem)`, borderColor: "#64748b" }}>
                  구멍 · 블록 없음
                </div>
              ) : null}
              {state.piece === "end" ? <div className="absolute inset-y-0" style={{ left: `${MARK_30}%`, width: `${PIECE}%`, backgroundColor: "#2563eb" }} /> : null}
              {state.piece === "start" ? <div className="absolute inset-y-0 left-0" style={{ width: `${PIECE}%`, backgroundColor: "#2563eb" }} /> : null}
              {state.part === "none" && state.piece === "none" ? <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">파일 내용 없음</span> : null}
            </div>
            <div className="relative mt-1 h-4 font-mono text-[11px] text-muted-foreground">
              <span className="absolute left-0">0</span>
              <span className="absolute -translate-x-1/2" style={{ left: `${MARK_30}%` }}>30GiB</span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="min-w-0">
                <dt className="text-muted-foreground">ls · du --apparent-size</dt>
                <dd className="mt-0.5 font-mono font-bold">{state.size}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-muted-foreground">du · 실제 블록</dt>
                <dd className="mt-0.5 font-mono font-bold">{state.blocks}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
