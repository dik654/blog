import SceneShell from "./SceneShell";

/**
 * 본문 대응: #coverage — 고친 분할 [1,2,3]·[4,5]와 설명용 예측값(가정).
 * 정답 [0,1,0,1,0], 양성 확률 [0.1,0.8,0.4,0.7,0.2]
 * 제곱 오차(단위 0.01) [1,4,16,9,4] → 합 34 → 행 평균 0.068
 * 묶음 1: 21/3 = 0.07, 묶음 2: 13/2 = 0.065, 단순 평균 0.0675.
 */
const ROWS = [
  { id: 1, fold: 1, y: 0, p: "0.1", sq: 1 },
  { id: 2, fold: 1, y: 1, p: "0.8", sq: 4 },
  { id: 3, fold: 1, y: 0, p: "0.4", sq: 16 },
  { id: 4, fold: 2, y: 1, p: "0.7", sq: 9 },
  { id: 5, fold: 2, y: 0, p: "0.2", sq: 4 },
] as const;

const MAX_SQ = 18;
const FOLD_COLOR: Record<number, string> = { 1: "#0284c7", 2: "#7c3aed" };

const SCENES = [
  { label: "고친 분할", summary: "횟수 [1,1,1,1,1]", note: "모델 1은 4·5번 행으로 학습해 1·2·3번을 예측하고, 모델 2는 1·2·3번으로 학습해 4·5번을 예측합니다. 어떤 행도 자기를 학습에 쓴 모델에게서 예측을 받지 않고, 모든 행이 정확히 한 번 예측을 받습니다. 아주 작은 설명용 분할입니다(가정)." },
  { label: "행마다 제곱 오차", summary: "(정답 − 양성 확률)²", note: "Brier score는 행마다 정답(0 또는 1)과 양성 확률의 차이를 제곱해 평균한 값입니다. 막대 길이가 각 행의 제곱 오차이며, 3번 행이 0.16으로 가장 큽니다. 확률은 실행한 모델 결과가 아니라 설명용 값입니다(가정)." },
  { label: "행 다섯 개의 평균", summary: "0.34 ÷ 5 = 0.068", note: "다섯 막대를 모두 더하면 0.34이고, 행 수 5로 나누면 Brier score 0.068입니다." },
  { label: "묶음 평균을 다시 평균하면", summary: "0.0675 ≠ 0.068", note: "묶음 1은 0.21 ÷ 3 = 0.07, 묶음 2는 0.13 ÷ 2 = 0.065입니다. 두 숫자를 그냥 평균하면 0.0675입니다. 행이 두 개뿐인 묶음 2가 행 세 개인 묶음 1과 같은 무게를 받아 전체 행 평균 0.068과 달라집니다." },
] as const;

function hundredths(value: number) {
  return (value / 100).toFixed(2);
}

export default function OofBrierViz() {
  return (
    <SceneShell
      eyebrow="OOF와 평균"
      title="같은 다섯 오차도 무엇을 평균하느냐에 따라 숫자가 바뀝니다"
      description="한 줄이 행 하나입니다. 색은 그 행을 평가한 묶음(파랑 1, 보라 2)입니다. 정답과 확률은 7절의 설명용 가정값입니다."
      ariaLabel="고친 분할에서 다섯 행의 제곱 오차와 행 평균 0.068, 묶음 평균의 평균 0.0675 비교"
      scenes={SCENES}
      render={(active) => {
        const showError = active >= 1;
        return (
          <div className="min-w-0 space-y-3">
            <div className="space-y-1.5">
              <div className="grid grid-cols-[3.75rem_4.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-[11px] text-muted-foreground">
                <span>행</span>
                <span>{active === 0 ? "학습한 행" : "정답 · 확률"}</span>
                <span>{active === 0 ? "예측한 모델" : "제곱 오차"}</span>
                <span className="text-right">{active === 0 ? "횟수" : "값"}</span>
              </div>
              {ROWS.map((row) => (
                <div key={row.id} className="grid h-8 grid-cols-[3.75rem_4.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
                  <span className="flex items-center gap-1">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono font-bold" style={{ borderColor: FOLD_COLOR[row.fold], color: FOLD_COLOR[row.fold] }}>{row.id}</span>
                    <span className="whitespace-nowrap text-[10px] leading-3" style={{ color: FOLD_COLOR[row.fold] }}>묶음{row.fold}</span>
                  </span>
                  <span className="font-mono text-muted-foreground">{active === 0 ? (row.fold === 1 ? "4·5" : "1·2·3") : `${row.y} · ${row.p}`}</span>
                  {active === 0 ? (
                    <span className="truncate text-xs">모델 {row.fold} (묶음 {row.fold})</span>
                  ) : (
                    <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                      <div className="h-full rounded-sm" style={{ width: `${(row.sq / MAX_SQ) * 100}%`, backgroundColor: FOLD_COLOR[row.fold] }} />
                    </div>
                  )}
                  <span className="text-right font-mono font-semibold">{active === 0 ? "1" : hundredths(row.sq)}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-2 text-xs sm:grid-cols-2 sm:text-sm">
              <div className={`rounded-lg border px-3 py-2 ${active === 2 ? "border-emerald-600 dark:border-emerald-400" : "border-border"}`}>
                <span className="block text-muted-foreground">행 평균 (Brier score)</span>
                <strong className={`font-mono ${active >= 2 ? "" : "text-muted-foreground/50"}`}>{active >= 2 ? "(0.01+0.04+0.16+0.09+0.04) ÷ 5 = 0.068" : showError ? "다음 장면에서 계산" : "오차 계산 전"}</strong>
              </div>
              <div className={`rounded-lg border px-3 py-2 ${active === 3 ? "border-amber-600 dark:border-amber-400" : "border-border"}`}>
                <span className="block text-muted-foreground">묶음 평균의 단순 평균</span>
                <strong className={`font-mono ${active === 3 ? "" : "text-muted-foreground/50"}`}>{active === 3 ? "(0.21÷3 + 0.13÷2) ÷ 2 = (0.07 + 0.065) ÷ 2 = 0.0675" : "아직 계산 전"}</strong>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
