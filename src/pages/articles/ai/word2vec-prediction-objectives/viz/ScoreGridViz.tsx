import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 3절의 가정 표로 점수를 칸별로 계산합니다.
 * 평균 [0,1,1] → [0,1,1,3,1], cat 입력 [1,2,0] → [0,1,2,2,3]. 코드에서 곱을 다시 계산해 그대로 씁니다.
 */
const TARGET = [
  { word: "문장 끝", row: [0, 0, 0] },
  { word: "red", row: [1, 0, 1] },
  { word: "cat", row: [2, 0, 1] },
  { word: "saw", row: [0, 1, 2] },
  { word: "dog", row: [1, 1, 0] },
] as const;
const MEAN = [0, 1, 1] as const;
const CAT_INPUT = [1, 2, 0] as const;

const score = (input: readonly number[], row: readonly number[]) => row.reduce((sum, value, i) => sum + value * input[i], 0);

const SCENES = [
  { label: "입력 줄을 모읍니다", summary: "([0,1,1]+[0,1,1])÷2", note: "주변을 모으는 방식은 두 saw의 입력 줄을 더해 2로 나눕니다. 결과 [0,1,1]이 이번 입력입니다. 아직 후보와 비교하지 않았습니다." },
  { label: "후보 cat과 곱합니다", summary: "0×2 + 1×0 + 1×1 = 1", note: "입력과 cat의 예측 대상 줄을 같은 자리끼리 곱해 더합니다. 정답 cat의 점수는 1입니다. 입력은 saw의 줄에서 왔고 대상은 cat의 줄입니다." },
  { label: "다섯 후보 전부", summary: "[0, 1, 1, 3, 1]", note: "같은 입력을 나머지 후보와도 곱합니다. 가장 높은 점수는 saw의 3인데 관찰한 정답은 cat입니다. 점수는 표에서 계산되고 정답은 자료에서 옵니다." },
  { label: "반대 방향", summary: "[0, 1, 2, 2, 3]", note: "cat의 입력 줄 [1,2,0]으로 시작하면 정답 saw의 점수는 왼쪽과 오른쪽 질문에서 각각 2입니다. 가장 높은 후보는 dog의 3입니다. 두 방식 모두 지금의 가정한 표에서는 정답을 최고로 고르지 못합니다." },
] as const;

export default function ScoreGridViz() {
  return (
    <SceneShell
      eyebrow="같은 자리끼리 곱하기"
      title="입력 줄 하나로 다섯 후보의 점수를 계산합니다"
      description="왼쪽은 후보 단어와 그 예측 대상 줄이고, 가운데 식이 입력 줄과 같은 자리끼리 곱한 값입니다. 표의 수는 설명을 위해 고른 가정입니다."
      ariaLabel="입력 줄과 다섯 후보의 예측 대상 줄을 곱해 점수를 계산하는 장면"
      scenes={SCENES}
      render={(active) => {
        const input = active === 3 ? CAT_INPUT : MEAN;
        const answer = active === 3 ? "saw" : "cat";
        const top = active === 3 ? "dog" : "saw";
        return (
          <div className="min-w-0" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs sm:text-sm">
              {active === 3 ? (
                <span><span className="font-sans text-muted-foreground">cat 입력 줄 </span><b style={{ color: "#2563eb" }}>[1,2,0]</b></span>
              ) : (
                <>
                  <span className={active === 0 ? "" : "opacity-40"}>(saw [0,1,1] + saw [0,1,1]) ÷ 2 →</span>
                  <span><span className="font-sans text-muted-foreground">평균 </span><b style={{ color: "#2563eb" }}>[0,1,1]</b></span>
                </>
              )}
            </div>
            <div className="space-y-1">
              {TARGET.map(({ word, row }) => {
                const shown = active === 2 || active === 3 || (active === 1 && word === "cat");
                const isAnswer = shown && word === answer;
                const isTop = shown && active !== 1 && word === top;
                return (
                  <div key={word} className={`grid grid-cols-[3.25rem_3.75rem_minmax(0,1fr)_1.25rem_2.25rem] items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs sm:gap-3 sm:text-sm ${isAnswer ? "border-blue-600" : isTop ? "border-amber-600" : "border-border/60"} ${shown ? "" : "opacity-40"}`}>
                    <span className="font-semibold">{word}</span>
                    <span className="font-mono text-muted-foreground">[{row.join(",")}]</span>
                    <span className="min-w-0 whitespace-nowrap font-mono text-[11px] sm:text-sm">{shown ? row.map((v, i) => `${input[i]}×${v}`).join("+") : ""}</span>
                    <span className="text-right font-mono font-bold">{shown ? score(input, row) : ""}</span>
                    <span className="text-right font-bold" style={{ color: isAnswer ? "#2563eb" : "#d97706" }}>{isAnswer ? "정답" : isTop ? "최고" : ""}</span>
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
