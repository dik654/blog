import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retrieval 후보 상한 식 — 정답 3개 중 후보가 2개만 담으면 뒤 단계가 완벽해도 최대 2개입니다.
 * 후보 6개와 최종 3개는 설명용 가정입니다.
 */
const BEFORE = ["x", "A", "x", "x", "B", "x"] as const;
const AFTER = ["A", "B", "x", "x", "x", "x"] as const;

const SCENES = [
  { label: "후보에 정답 2개만 들어옴", summary: "정답 3개 중 2개", note: "정답 문서 A·B·C 가운데 C는 첫 검색에서 빠졌습니다. 후보 안의 x는 정답이 아닌 문서입니다." },
  { label: "재정렬은 순서만 바꿈", summary: "A·B가 앞으로", note: "재정렬기는 받은 후보의 순서를 바꿉니다. 후보 밖의 C를 새로 찾아오지는 못합니다." },
  { label: "최종 결과의 상한", summary: "최대 2개", note: "최종 결과는 후보의 일부이므로 재정렬이 완벽해도 정답을 2개까지만 남깁니다. 그래서 후보 단계의 재현율(찾아야 할 정답 가운데 후보에 들어온 비율)과 재정렬 품질을 따로 봅니다." },
] as const;

function Chip({ name }: { name: string }) {
  const hit = name !== "x";
  return (
    <span className={`flex h-9 min-w-0 items-center justify-center rounded-md border text-sm font-bold ${hit ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground/70"}`}>
      {name}
    </span>
  );
}

export default function CandidateCeilingViz() {
  return (
    <SceneShell
      eyebrow="후보 상한"
      title="후보에 없는 정답은 뒤 단계로 갈 길이 없습니다"
      description="Rq는 질문에 답을 뒷받침하는 정답 문서 전체, Cq는 재정렬기에 넘어간 후보, Oq는 그 안에서 고른 최종 결과입니다. 후보 6개와 최종 3개는 가정입니다."
      ariaLabel="정답 세 개 중 후보에 두 개만 들어왔을 때 최종 결과의 상한"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_4.5rem] gap-3">
            <div className="min-w-0 rounded-lg border border-border bg-background p-2">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">후보 Cq · {active === 0 ? "받은 순서" : "재정렬한 순서"}</p>
              <div className="grid grid-cols-6 gap-1">
                {(active === 0 ? [...BEFORE] : [...AFTER]).map((name: string, index) => (
                  <Chip key={`${name}-${index}`} name={name} />
                ))}
              </div>
            </div>
            <div className="min-w-0 rounded-lg border border-dashed border-red-600/70 p-2">
              <p className="mb-2 text-xs font-semibold text-red-700 dark:text-red-400">후보 밖</p>
              <span className="flex h-9 items-center justify-center rounded-md border border-red-600/70 text-sm font-bold text-red-700 dark:text-red-400">C</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-background p-2">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">최종 결과 Oq · 3칸</p>
            <div className="grid grid-cols-3 gap-1">
              {[0, 1, 2].map((slot) =>
                active === 2 ? (
                  <Chip key={slot} name={AFTER[slot]} />
                ) : (
                  <span key={slot} className="flex h-9 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground/70">아직 없음</span>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}
