import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 평가 묶음 [1,2,4]·[4,5]를 잘못 넣은 경우(가정).
 * 총 예측 수 3+2=5는 행 수 5와 같지만, 행별 등장 횟수는 [1,1,0,2,1]이다.
 */
const ROWS = [1, 2, 3, 4, 5] as const;
const FOLD_1: readonly number[] = [1, 2, 4];
const FOLD_2: readonly number[] = [4, 5];

const SCENES = [
  { label: "첫 평가 묶음 [1,2,4]", summary: "예측 3개", note: "첫 평가 묶음에 1·2·4번 행을 넣었습니다. 이 세 행이 예측을 하나씩 받습니다. 3번이 들어갈 자리에 4번을 잘못 넣은 상황입니다(가정)." },
  { label: "두 번째 묶음 [4,5]", summary: "예측 2개 · 4번 다시", note: "두 번째 묶음에 4·5번 행을 넣었습니다. 4번 행은 첫 묶음에 이어 한 번 더 예측을 받습니다." },
  { label: "총개수만 세면", summary: "3 + 2 = 5 = 행 5개", note: "예측 개수 5는 원래 행 수 5와 같습니다. 개수만 비교하면 아무 문제가 없어 보입니다." },
  { label: "행별로 세면", summary: "[1,1,0,2,1]", note: "행마다 몇 번 예측을 받았는지 세면 3번은 0번(누락), 4번은 2번(중복)입니다. 이 표로 두 오류를 각각 찾고, 지표 계산을 멈춥니다." },
] as const;

function Mark({ on, label }: { on: boolean; label: string }) {
  return (
    <div className={`flex h-9 items-center justify-center rounded-md border text-xs font-semibold ${on ? "border-sky-600 bg-sky-100 text-sky-800 dark:border-sky-400 dark:bg-sky-950/50 dark:text-sky-200" : "border-dashed border-border/50 text-muted-foreground/40"}`}>
      {on ? label : "·"}
    </div>
  );
}

export default function CoverageCountViz() {
  return (
    <SceneShell
      eyebrow="누락과 중복"
      title="예측 다섯 개가 행 다섯 개를 하나씩 덮었는지 셉니다"
      description="열 하나가 학습 자료의 행 하나입니다. 평가 묶음에 들어간 행은 그 묶음에서 예측을 하나 받습니다. 묶음 구성은 설명용 가정입니다."
      ariaLabel="평가 묶음 1,2,4와 4,5에서 행별 예측 횟수를 세어 3번 누락과 4번 중복을 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const showSecond = active >= 1;
        const counts = ROWS.map((row) => (FOLD_1.includes(row) ? 1 : 0) + (showSecond && FOLD_2.includes(row) ? 1 : 0));
        const total = counts.reduce<number>((sum, value) => sum + value, 0);
        const perRow = active === 3;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[4.5rem_repeat(5,minmax(0,1fr))] items-center gap-1.5 sm:gap-2">
              <span className="text-xs text-muted-foreground">행 ID</span>
              {ROWS.map((row) => (
                <span key={row} className="text-center font-mono text-sm font-bold">{row}</span>
              ))}
              <span className="text-xs text-muted-foreground">묶음 1</span>
              {ROWS.map((row) => (
                <Mark key={row} on={FOLD_1.includes(row)} label="예측" />
              ))}
              <span className="text-xs text-muted-foreground">묶음 2</span>
              {ROWS.map((row) => (
                <Mark key={row} on={showSecond && FOLD_2.includes(row)} label="예측" />
              ))}
              <span className="text-xs font-semibold">받은 횟수</span>
              {counts.map((count, index) => {
                const bad = perRow && count !== 1;
                return (
                  <div
                    key={ROWS[index]}
                    className={`flex h-12 flex-col items-center justify-center rounded-md border font-mono ${bad ? "border-red-600 bg-red-50 text-red-700 dark:border-red-400 dark:bg-red-950/40 dark:text-red-300" : perRow ? "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300" : "border-border"}`}
                  >
                    <span className="text-base font-bold">{count}</span>
                    <span className="text-[10px] leading-3">{perRow ? (count === 0 ? "누락" : count === 2 ? "중복" : "정상") : " "}</span>
                  </div>
                );
              })}
            </div>
            <div className="grid gap-2 text-xs sm:grid-cols-2 sm:text-sm">
              <div className={`rounded-lg border px-3 py-2 ${active === 2 ? "border-emerald-600 dark:border-emerald-400" : "border-border"}`}>
                <span className="block text-muted-foreground">총개수 검사: 예측 {total}개 vs 행 5개</span>
                <strong className={active >= 2 ? "" : "text-muted-foreground/50"}>{active >= 2 ? "같음 → 통과처럼 보임" : "아직 세는 중"}</strong>
              </div>
              <div className={`rounded-lg border px-3 py-2 ${perRow ? "border-red-600 dark:border-red-400" : "border-border"}`}>
                <span className="block text-muted-foreground">행별 검사: 모든 행이 정확히 1회?</span>
                <strong className={perRow ? "text-red-700 dark:text-red-300" : "text-muted-foreground/50"}>{perRow ? "3번 0회 · 4번 2회 → 중단" : "아직 확인 전"}</strong>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
