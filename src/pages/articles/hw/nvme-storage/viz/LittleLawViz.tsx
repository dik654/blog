import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release-gate Little의 법칙 — N = λW, 32 = 128k IOPS × 250µs.
 * 1초 ÷ 250µs = 4,000번, 32 × 4,000 = 128,000. 마지막 장면은 완료율이 128k에서
 * 더 오르지 않는다는 가정 아래 64 ÷ 128,000 = 500µs.
 */
type Scene = { label: string; summary: string; note: string; inFlight: number };

const SCENES: readonly Scene[] = [
  { label: "평균 32개가 처리 중입니다", summary: "N = 32", inFlight: 32, note: "칸 하나가 제출됐지만 아직 완료되지 않은 I/O 하나입니다. 평균적으로 32개가 동시에 대기하거나 실행 중입니다." },
  { label: "하나는 평균 250µs 머뭅니다", summary: "250µs마다 32개 완료", inFlight: 32, note: "각 I/O가 제출부터 완료까지 평균 250µs 머물면, 250µs 동안 평균 32개가 빠져나가고 그만큼 새로 들어와 자리를 채웁니다." },
  { label: "1초로 늘려 셉니다", summary: "32 × 4,000 = 128,000 IOPS", inFlight: 32, note: "1초에는 250µs가 4,000번 들어갑니다. 32개씩 4,000번이면 초당 128,000개, 곧 약 128k IOPS입니다. 거꾸로 128k × 250µs = 32로 처음 숫자와 맞습니다." },
  { label: "줄만 64로 늘리면", summary: "64 ÷ 128,000 = 500µs", inFlight: 64, note: "Queue를 더 늘린다고 device의 처리 속도가 자동으로 늘지는 않습니다. 완료율이 128k IOPS에서 더 오르지 않는다면(가정) 늘어난 32개는 기다리기만 하고, 평균 체류 시간이 500µs로 두 배가 됩니다." },
];

const COLS = 16;
const ROWS = 4;

export default function LittleLawViz() {
  return (
    <SceneShell
      eyebrow="Queue depth와 latency"
      title="동시에 처리 중인 I/O 수를 머무는 시간으로 나누면 초당 완료 수가 나옵니다"
      description="IOPS는 초당 완료한 I/O 수, µs는 100만분의 1초입니다. 안정된 상태의 평균 관계이며 p99나 burst를 직접 예측하지 않습니다."
      ariaLabel="평균 in-flight I/O 32개, 평균 체류 250마이크로초, 초당 128,000 IOPS의 관계와 queue만 64로 늘렸을 때"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showRate = active >= 1;
        const showSecond = active === 2;
        return (
          <div className="min-w-0">
            <div className="mx-auto grid max-w-[480px] gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }} aria-hidden>
              {Array.from({ length: COLS * ROWS }, (_, i) => {
                const filled = i < scene.inFlight;
                const waiting = i >= 32 && filled;
                return (
                  <span
                    key={i}
                    className="aspect-square rounded-sm border"
                    style={{
                      backgroundColor: filled ? (waiting ? "#fde68a" : "#2563eb") : "transparent",
                      borderColor: filled ? (waiting ? "#d97706" : "#1d4ed8") : "#cbd5e1",
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: "#2563eb" }} />처음부터 처리 중이던 32개</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border align-middle" style={{ backgroundColor: "#fde68a", borderColor: "#d97706" }} />늘어난 32개 (완료율은 그대로)</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md border border-border bg-background px-1 py-2">
                <p className="text-xs text-muted-foreground">N 처리 중</p>
                <p className="font-mono text-sm font-bold">{scene.inFlight}</p>
              </div>
              <div className="rounded-md border border-border bg-background px-1 py-2">
                <p className="text-xs text-muted-foreground">W 머무는 시간</p>
                <p className="font-mono text-sm font-bold">{showRate ? (active === 3 ? "500µs" : "250µs") : "?"}</p>
              </div>
              <div className="rounded-md border border-border bg-background px-1 py-2">
                <p className="text-xs text-muted-foreground">λ 완료율</p>
                <p className="font-mono text-sm font-bold">{active >= 2 ? "128k/s" : showRate ? "32/250µs" : "?"}</p>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
              {showSecond ? "1s ÷ 250µs = 4,000 → 32 × 4,000 = 128,000" : active === 3 ? "W = N ÷ λ = 64 ÷ 128,000 = 500µs" : "N = λ × W"}
            </p>
          </div>
        );
      }}
    />
  );
}
