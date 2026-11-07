import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #black-box — 각 위치가 읽는 범위(자기 앞까지)는 두 방식에서 같고,
 * 앞 토큰이 언제 준비되는지만 다르다. 그래서 후보가 놓여 있으면 한 실행에 묶을 수 있다.
 */
const SCENES: readonly ShellScene[] = [
  { label: "평소 첫 실행", summary: "큰 모델 1회 · 점수 하나", note: "첫 실행은 앞 글만 읽어 첫 토큰의 점수를 냅니다. 둘째 점수에 필요한 토큰 1은 이 실행이 끝나야 생기므로 아직 계산할 수 없습니다." },
  { label: "평소 세 실행", summary: "큰 모델 3회", note: "첫 실행이 고른 토큰이 둘째 입력이 되고 둘째 결과가 셋째 입력이 됩니다. 뒤 줄이 앞 줄의 결과를 기다리므로 실행 세 번이 이어집니다." },
  { label: "후보를 놓은 실행", summary: "큰 모델 1회 · 점수 셋", note: "칠한 칸의 모양은 앞 장면과 같습니다. 달라진 점은 값싼 부품이 후보를 미리 놓아 기다릴 앞 실행이 없다는 것입니다. 후보가 모두 맞을 때 1회로 줄며, 이 한 번에는 더 많은 계산이 들어가므로 시간이 3분의 1이 된다는 뜻은 아닙니다." },
];

const COLUMNS = ["앞 글", "1번째", "2번째"];
const ROWS = [0, 1, 2];
const GRID = "grid-cols-[3.1rem_repeat(3,minmax(0,1fr))_3.6rem] sm:grid-cols-[4rem_repeat(3,minmax(0,1fr))_5rem]";

function cellText(scene: number, column: number) {
  if (column === 0) return "앞 글";
  return scene === 2 ? `후보 ${column}` : `토큰 ${column}`;
}

export default function BatchPositionsViz() {
  return (
    <SceneShell
      eyebrow="읽는 범위와 기다림"
      title="후보가 이미 놓여 있으면 뒤 위치가 앞 실행을 기다리지 않습니다"
      description="한 줄이 다음 토큰 점수 하나입니다. 칠한 칸은 그 점수를 낼 때 읽는 입력이고, 맨 오른쪽은 그 줄을 계산하는 큰 모델 실행입니다. 세 토큰을 만드는 가정입니다."
      ariaLabel="세 점수를 세 번 실행으로 만드는 경우와 후보를 놓고 한 번 실행으로 만드는 경우 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className={`grid ${GRID} items-center gap-1 text-center text-[11px] font-bold text-muted-foreground`}>
            <span className="text-left">점수</span>
            {COLUMNS.map((column) => <span key={column}>{column}</span>)}
            <span>실행</span>
          </div>
          <div className="mt-1 space-y-1.5">
            {ROWS.map((row) => {
              const done = active > 0 || row === 0;
              return (
                <div key={row} className={`grid ${GRID} items-center gap-1`}>
                  <span className="text-xs font-bold">점수 {row + 1}</span>
                  {[0, 1, 2].map((column) => {
                    const reads = done && column <= row;
                    return (
                      <span
                        key={column}
                        className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold transition-colors duration-300 motion-reduce:transition-none ${
                          reads
                            ? column === 0
                              ? "border-[#64748b] bg-[#64748b]/15"
                              : active === 2
                                ? "border-[#d97706] bg-[#d97706]/15"
                                : "border-[#2563eb] bg-[#2563eb]/15"
                            : "border-dashed border-border/60 text-transparent"
                        }`}
                      >
                        {reads ? cellText(active, column) : "·"}
                      </span>
                    );
                  })}
                  <span className={`text-center text-xs font-bold ${done ? "" : "text-muted-foreground"}`}>
                    {!done ? "대기" : active === 2 ? "같은 1회" : `${row + 1}회째`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
