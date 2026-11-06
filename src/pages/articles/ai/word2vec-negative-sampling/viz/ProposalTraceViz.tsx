import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-policy — 추첨 횟수 6, 시작 상태 0. 정답 cat 뒤에 dog, saw, saw, saw, saw, cat.
 * 처음 두 조회의 원 번호는 0이라 다른 번호로 바뀌고 마지막 cat은 건너뛴다. 음수 갱신 5, 내적 6, 서로 다른 출력 줄 3.
 */
const SLOTS = [
  { word: "cat", kind: "정답", note: "" },
  { word: "dog", kind: "제안 1", note: "0→바꿈" },
  { word: "saw", kind: "제안 2", note: "0→바꿈" },
  { word: "saw", kind: "제안 3", note: "" },
  { word: "saw", kind: "제안 4", note: "" },
  { word: "saw", kind: "제안 5", note: "" },
  { word: "cat", kind: "제안 6", note: "건너뜀" },
] as const;

const SCENES = [
  { label: "정답 cat", summary: "내적 1", note: "한 쌍의 처리는 정답 cat의 양수 갱신으로 시작합니다.", upto: 1, dots: 1, neg: 0, lines: 1 },
  { label: "번호 0을 바꿈", summary: "제안 1·2: 원 번호 0", note: "처음 두 조회에서 표가 준 원 번호는 0이지만 코드는 다른 단어 번호로 바꿉니다. 표의 무게만으로 최종 비교 대상의 분포를 완전히 설명할 수 없습니다.", upto: 3, dots: 3, neg: 2, lines: 3 },
  { label: "saw가 네 번", summary: "출력 saw 4번 고침", note: "출력 saw는 네 번 등장하며 매번 즉시 바뀌고 다음 비교는 바뀐 줄을 읽습니다. 입력 saw는 한 쌍이 끝날 때까지 이전 값을 유지합니다. 첫 점수의 기여를 단순히 네 배 한 실행이 아닙니다.", upto: 6, dots: 6, neg: 5, lines: 3 },
  { label: "마지막 cat", summary: "continue · 재추첨 없음", note: "여섯째 제안은 정답과 번호가 같아 건너뜁니다. 반복 번호는 그대로 늘어나므로 채워 넣기 위한 재추첨이 없습니다. 원본이 확인하는 것은 이번 정답과 같은 번호인지뿐입니다.", upto: 7, dots: 6, neg: 5, lines: 3 },
] as const;

export default function ProposalTraceViz() {
  return (
    <SceneShell
      eyebrow="설정값 6의 실제 실행"
      title="제안 여섯 건이 음수 갱신 다섯 건이 됩니다"
      description="칸 하나가 원본 반복 한 번입니다. 지정한 시작 상태로 원본의 한 쌍 처리 블록을 실행한 관찰이며 전체 학습이 아닙니다."
      ariaLabel="정답 cat과 여섯 제안 dog, saw 네 번, cat의 처리 순서와 내적, 음수 갱신, 출력 줄 수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {SLOTS.map((slot, index) => {
                const reached = index < scene.upto;
                const skipped = index === 6 && reached;
                return (
                  <div
                    key={index}
                    className={`min-w-0 rounded border px-1 py-1.5 text-center ${
                      !reached ? "border-dashed border-border/60 text-muted-foreground/50" : skipped ? "border-dashed border-red-600" : index === 0 ? "border-[#16a34a] bg-[#16a34a]/10" : "border-primary bg-primary/10"
                    }`}
                  >
                    <span className="block text-[11px] text-muted-foreground">{slot.kind}</span>
                    <span className={`block text-sm font-bold ${skipped ? "line-through" : ""}`}>{slot.word}</span>
                    <span className={`block min-h-4 text-[11px] leading-4 ${skipped ? "font-semibold text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>{reached ? slot.note : ""}</span>
                  </div>
                );
              })}
            </div>
            <dl className="grid grid-cols-3 gap-2 text-center">
              {[["내적", scene.dots], ["음수 갱신", scene.neg], ["서로 다른 출력 줄", scene.lines]].map(([name, value]) => (
                <div key={name} className="rounded border border-border bg-background px-1 py-2">
                  <dt className="text-[11px] leading-4 text-muted-foreground">{name}</dt>
                  <dd className="font-mono text-lg font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        );
      }}
    />
  );
}
