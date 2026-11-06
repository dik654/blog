import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ranking-evaluation — top-5에서 1·2·4위가 정답, 정답 전체 4개.
 * Precision@5 = 3/5 = 0.6, Recall@5 = 3/4 = 0.75.
 */
const SLOTS = [true, true, false, true, false] as const;
const HITS = SLOTS.filter(Boolean).length;
const RELEVANT = ["1위 문서", "2위 문서", "4위 문서", "top-5 밖"] as const;
const precision = HITS / SLOTS.length;
const recall = HITS / RELEVANT.length;

const SCENES = [
  { label: "같은 결과 하나", summary: `top-5 안 정답 ${HITS}개`, note: "재정렬기의 상위 5개에서 1·2·4번째가 정답이고 3·5번째는 정답이 아닙니다. 정답은 전체 4개이고, 이 가운데 하나는 top-5 밖에 있습니다." },
  { label: "Precision@5", summary: `${HITS}/${SLOTS.length} = ${precision}`, note: "분모는 사용자가 보는 칸 5개입니다. 보이는 범위에 잡음이 얼마나 섞였는지를 묻습니다." },
  { label: "Recall@5", summary: `${HITS}/${RELEVANT.length} = ${recall}`, note: "분모는 정답 전체 4개입니다. 찾아야 할 정답 가운데 얼마나 찾았는지를 묻습니다." },
] as const;

export default function PrecisionRecallViz() {
  return (
    <SceneShell
      eyebrow="같은 결과, 두 분모"
      title="분자는 같은 3개인데 분모가 달라 두 값이 갈립니다"
      description="위 줄은 시스템이 내놓은 top-5, 아래 줄은 데이터에 있는 정답 전체입니다. '분모' 표시가 붙은 줄이 분모입니다."
      ariaLabel="같은 top-5 결과에서 Precision@5와 Recall@5를 계산하는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className={`min-w-0 rounded-lg border p-2 ${active === 1 ? "border-primary" : "border-border/60"}`}>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">top-5 출력 {active === 1 ? "· 분모 5" : ""}</p>
            <div className="grid grid-cols-5 gap-1">
              {SLOTS.map((hit, index) => (
                <span key={index} className={`rounded-md border px-1 py-1.5 text-center text-xs ${hit ? "border-primary bg-primary/10 font-bold text-primary" : "border-border bg-background text-muted-foreground"}`}>
                  <span className="block font-mono">{index + 1}위</span>
                  <span className="block">{hit ? "정답" : "아님"}</span>
                </span>
              ))}
            </div>
          </div>
          <div className={`min-w-0 rounded-lg border p-2 ${active === 2 ? "border-primary" : "border-border/60"}`}>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">정답 전체 {active === 2 ? "· 분모 4" : ""}</p>
            <div className="grid grid-cols-4 gap-1">
              {RELEVANT.map((name, index) => (
                <span key={name} className={`rounded-md border px-1 py-2 text-center text-xs ${index < HITS ? "border-primary bg-primary/10 font-bold text-primary" : "border-dashed border-red-600/70 text-red-700 dark:text-red-400"}`}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
}
