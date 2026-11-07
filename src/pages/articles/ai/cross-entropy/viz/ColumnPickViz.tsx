import SceneShell from "./SceneShell";

/**
 * 본문 대응: #implementation — 4×3 log_softmax 배열에서 정답 [0,0,1,2]의 열을 고른다.
 * 비용 ln4, ln4, ln4, ln2 (2,2,2,1 ln2), 누적 2,4,6,7 ln2, 관측 수 4로 나누면 7ln2/4 ≈ 1.213008 nat.
 */
const LOG_Q = ["−ln4", "−ln4", "−ln2"] as const;
const TARGETS = [0, 0, 1, 2] as const;
const RUNNING = ["2ln2", "4ln2", "6ln2", "7ln2"] as const;

const SCENES = [
  { label: "log_softmax 배열", summary: "4행 × 3열", note: "같은 z를 네 행에 반복한 입력에 class_dim=1 방향으로 log_softmax를 구합니다. softmax 확률에 로그를 취한 값이 행마다 세 열씩 있습니다." },
  { label: "정답 열 고르기", summary: "정답 [0, 0, 1, 2]", note: "정답 번호는 이 행에서 읽을 열입니다. 0, 1, 2가 각각 A, B, C 열입니다. 다른 열은 이 행의 비용에 쓰이지 않습니다." },
  { label: "빼서 더하기", summary: "ln4 + ln4 + ln4 + ln2 = 7ln2", note: "CPU NLL 265행이 정답 열을 읽고 273행이 그 로그값을 빼서 비용에 더합니다. 음수인 로그값을 빼므로 비용은 양수입니다." },
  { label: "관측 수로 나누기", summary: "7ln2 / 4 ≈ 1.213008 nat", note: "288–299행에서 유효 관측 수 4로 나눕니다. label_smoothing=0, 가중치 없음, 제외 정답 없음, mean을 가정한 손 계산이며 PyTorch를 실행한 결과는 아닙니다." },
] as const;

export default function ColumnPickViz() {
  return (
    <SceneShell
      eyebrow="4×3 배열"
      title="행마다 정답 열 하나만 읽어 비용을 더합니다"
      description="가로줄 하나가 관측 하나, 세로줄 하나가 글자 하나입니다. PyTorch v2.14.0 원문의 경로에 글의 가정 데이터를 손으로 대입했습니다."
      ariaLabel="4행 3열 배열에서 행마다 정답 열을 골라 비용을 누적하고 관측 수로 나누는 과정"
      scenes={SCENES}
      render={(active) => {
        const showPick = active >= 1;
        const showCost = active >= 2;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[2.5rem_repeat(3,minmax(0,1fr))_3.5rem] items-center gap-1.5 text-center text-sm">
              <span className="text-xs text-muted-foreground">정답</span>
              {["A", "B", "C"].map((letter) => (
                <span key={letter} className="text-xs font-bold text-muted-foreground">{letter}</span>
              ))}
              <span className="text-xs text-muted-foreground">누적</span>
              {TARGETS.map((target, row) => (
                <div key={row} className="contents">
                  <span className={`font-mono ${showPick ? "font-bold" : "text-muted-foreground/40"}`}>{target}</span>
                  {LOG_Q.map((value, column) => {
                    const picked = showPick && column === target;
                    return (
                      <span key={column} className={`rounded border py-2 font-mono text-xs sm:text-sm ${picked ? "border-primary bg-primary/15 font-bold" : showPick ? "border-border/50 text-muted-foreground/60" : "border-border bg-background"}`}>
                        {value}
                      </span>
                    );
                  })}
                  <span className={`font-mono text-xs sm:text-sm ${showCost ? "font-bold" : "text-transparent"}`}>{RUNNING[row]}</span>
                </div>
              ))}
            </div>
            <p className={`mt-3 text-center font-mono text-sm font-bold ${active === 3 ? "text-primary" : "text-transparent"}`}>7ln2 ÷ 4 ≈ 1.213008 nat</p>
          </div>
        );
      }}
    />
  );
}
