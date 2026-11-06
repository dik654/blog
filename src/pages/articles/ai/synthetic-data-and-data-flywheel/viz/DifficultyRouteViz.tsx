import SceneShell from "./SceneShell";

/**
 * 본문 대응: #difficulty-curriculum — 문제당 8개 후보, 정답 8·0·3개가 어디로 가는지.
 * 8/8=100%, 0/8=0%, 3/8=37.5%. curriculum 가중치의 크기는 글에 없어 그리지 않습니다.
 */
const PROBLEMS = [
  { name: "문제 A", passed: 8, dest: "이미 쉬움 → curriculum에서 제외" },
  { name: "문제 B", passed: 0, dest: "신호 없음 → curriculum에서 제외" },
  { name: "문제 C", passed: 3, dest: "중간 난이도 → curriculum sampling" },
] as const;

const SCENES = [
  { label: "후보 8개 중 몇 개가 맞았나", summary: "pass rate = 정답 수 / 8", note: "✓는 verifier 통과입니다. 통과 비율이 난이도를 재는 값이며, 낮을수록 지금 모델에게 어렵습니다.", shown: 0 },
  { label: "100%는 뺍니다", summary: "8/8 = 100% → 제외", note: "이미 쉬운 문제입니다. pass rate 0%·100%인 극단을 빼는 단계가 difficulty filtering입니다.", shown: 1 },
  { label: "0%도 뺍니다", summary: "0/8 = 0% → 제외", note: "학습에 쓸 근거가 없습니다. 다만 풀 수 없는 문제와 구분되지 않아 다음 seed pool에 남겨 두는 편이 안전합니다.", shown: 2 },
  { label: "남은 문제만 뽑힙니다", summary: "3/8 = 37.5% → 남음", note: "정답과 오답의 차이를 학습에 담을 수 있어 더 자주 뽑히게 가중치를 줍니다. 가중치 크기는 글에 없어 적지 않았습니다.", shown: 3 },
] as const;

export default function DifficultyRouteViz() {
  return (
    <SceneShell
      eyebrow="Difficulty filtering"
      title="같은 8개 채점이 문제마다 다른 길을 정합니다"
      description="문제당 후보 8개를 만든 글의 세 경우입니다. curriculum은 학습에 넣을 문제와 그 순서입니다."
      ariaLabel="pass rate 100, 0, 37.5퍼센트 문제가 curriculum에서 빠지거나 남는 과정"
      scenes={SCENES}
      render={(index) => (
        <div className="min-w-0 space-y-2">
          {PROBLEMS.map((problem, row) => {
            const decided = row < SCENES[index].shown;
            const current = row === SCENES[index].shown - 1;
            return (
              <div key={problem.name} className={`rounded-lg border px-3 py-1.5 ${current ? "border-primary bg-primary/10" : "border-border"}`}>
                <div className="flex items-baseline justify-between gap-2 text-xs sm:text-sm">
                  <span className="font-semibold">{problem.name}</span>
                  <span className="font-mono font-bold">{problem.passed}/8 = {(problem.passed / 8) * 100}%</span>
                </div>
                <div className="mt-1 grid grid-cols-8 gap-1" aria-hidden="true">
                  {Array.from({ length: 8 }, (_, cell) => {
                    const pass = cell < problem.passed;
                    return (
                      <span key={cell} className={`flex h-5 items-center justify-center rounded border text-xs ${pass ? "border-[#16a34a] text-[#16a34a]" : "border-dashed border-border text-muted-foreground"}`}>
                        {pass ? "✓" : "✕"}
                      </span>
                    );
                  })}
                </div>
                <p className={`mt-1 text-xs leading-4 ${decided ? "" : "invisible"}`}>{problem.dest}</p>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
