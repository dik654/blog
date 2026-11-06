import CovCells from "./CovCells";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundaries — 같은 B=2 칸에서 섞인 항만 바뀐다.
 * 독립: 0 → (1)/4 = 1/4. 복사: 1/2 → 2/4 = 1/2. 비복원: −1/6 → (2/3)/4 = 1/6.
 * −1/6 = −σ²/(N−1) = −(1/2)/3, 본문 ProgressiveDetail의 유도와 여섯 쌍 직접 계산이 같은 값을 준다.
 */
const SCENES = [
  { label: "되돌려 새로 뽑기", summary: "(1/2 + 0 + 0 + 1/2) / 4 = 1/4", note: "두 선택이 서로 영향을 주지 않아 섞인 칸이 0입니다. 10절의 2×2 칸 그대로입니다.", off: "0", value: "1/4" },
  { label: "한 번을 복사", summary: "(1/2 × 4) / 4 = 1/2", note: "두 칸이 같은 값이라 섞인 칸도 원래 분산 1/2입니다. 중심은 그대로 2지만 흔들림은 줄지 않습니다.", off: "1/2", value: "1/2" },
  { label: "되돌리지 않기", summary: "(1/2 + 1/2 − 1/6 − 1/6) / 4 = 1/6", note: "네 편차의 합이 0으로 고정되어 있어 섞인 칸이 음수입니다. −1/6은 아래 접힌 설명에서 유도합니다. 결과 1/6은 여섯 쌍을 직접 센 값과 같습니다.", off: "−1/6", value: "1/6" },
] as const;

const BARS = [
  { name: "되돌리지 않기", width: 1 / 6, text: "1/6", index: 2 },
  { name: "되돌려 새로 뽑기", width: 1 / 4, text: "1/4", index: 0 },
  { name: "한 번을 복사", width: 1 / 2, text: "1/2", index: 1 },
] as const;

export default function CovCompareViz() {
  return (
    <SceneShell
      eyebrow="같은 칸, 다른 섞인 항"
      title="뽑는 방법은 대각선이 아니라 섞인 칸을 바꿉니다"
      description="B=2의 네 칸입니다. 대각선은 어느 경우든 분산 1/2이고, 왼쪽 아래와 오른쪽 위가 공분산(두 편차가 함께 움직이는 정도)입니다."
      ariaLabel="독립, 복사, 비복원 추출에서 2×2 칸의 섞인 항과 평균 분산"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-center">
            <CovCells size={2} diagonal="1/2" off={scene.off} mark />
            <div className="min-w-0 space-y-2">
              <p className="text-xs leading-5 text-muted-foreground sm:text-sm">평균의 분산 (같은 축척)</p>
              {BARS.map((bar) => {
                const on = bar.index === active;
                return (
                  <div key={bar.name} className="grid grid-cols-[6.5rem_minmax(0,1fr)_2rem] items-center gap-2 text-xs sm:text-sm">
                    <span className={on ? "font-bold" : "text-muted-foreground"}>{on ? "▶ " : ""}{bar.name}</span>
                    <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                      <div className="h-full rounded-sm" style={{ width: `${bar.width * 100 * 2 * 0.9}%`, backgroundColor: on ? "#2563eb" : "#94a3b8" }} />
                    </div>
                    <span className={`text-right font-mono ${on ? "font-bold" : ""}`}>{bar.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
