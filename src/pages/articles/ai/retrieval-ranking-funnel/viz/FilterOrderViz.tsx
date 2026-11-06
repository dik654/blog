import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retrieval — 권한 조건을 검색 뒤에 적용하면 허가 문서가 상위 k개 밖으로 밀릴 수 있습니다.
 * 문서 6개와 상위 3칸은 설명용 가정입니다. 뒤 거름: 3칸 중 허가 1개. 앞 거름: 3칸 모두 허가.
 */
const RANKED = ["금지 1", "금지 2", "허가 A", "금지 3", "허가 B", "허가 C"] as const;
const ALLOWED_FIRST = ["허가 A", "허가 B", "허가 C", "금지 1", "금지 2", "금지 3"] as const;
const TOP = 3;

const SCENES = [
  { label: "점수순으로 세우면", summary: "금지 3개 · 허가 3개", note: "문서 6개를 검색 점수 순서로 세운 예입니다(가정). 금지 문서는 이 요청자에게 권한이 없는 문서이고, 상위 3칸(가정)만 다음 단계로 넘어갑니다." },
  { label: "검색 뒤에 거르면", summary: "남는 후보 1개", note: "금지 문서 2개가 상위 칸을 차지한 뒤에 걸러집니다. 허가 B·C는 이미 상위 3개 밖으로 밀렸고, 금지 문서의 본문이나 점수가 뒤 단계에 노출될 위험도 생깁니다." },
  { label: "검색 앞에 거르면", summary: "남는 후보 3개", note: "범위를 먼저 정하면 금지 문서는 순위에 들어오지 않습니다. 같은 상위 3칸을 허가 문서 A·B·C가 채웁니다." },
] as const;

function DocCell({ rank, name, inTop, outOfScope }: { rank: number | null; name: string; inTop: boolean; outOfScope: boolean }) {
  const allowed = name.startsWith("허가");
  return (
    <div
      className={`min-w-0 rounded-lg border px-1 py-1.5 text-center text-xs leading-4 ${
        outOfScope
          ? "border-dashed border-border/60 text-muted-foreground/60 line-through"
          : allowed
            ? "border-primary bg-primary/10 font-semibold text-primary"
            : "border-red-600/70 text-red-700 dark:text-red-400"
      } ${inTop ? "outline outline-1 outline-offset-1 outline-foreground/60" : ""}`}
    >
      <span className="block font-mono text-[10px] text-muted-foreground">{rank === null ? "순위 없음" : `${rank}위`}</span>
      <span className="block">{name}</span>
    </div>
  );
}

export default function FilterOrderViz() {
  return (
    <SceneShell
      eyebrow="권한 조건의 위치"
      title="권한 조건을 언제 거느냐에 따라 남는 후보 수가 달라집니다"
      description="권한 조건은 이 요청자가 볼 수 있는 문서인지 가르는 규칙입니다. 테두리가 두 겹인 칸이 상위 3칸입니다."
      ariaLabel="권한 조건을 검색 뒤와 앞에 적용했을 때 상위 3칸의 변화"
      scenes={SCENES}
      render={(active) => {
        const order: readonly string[] = active === 2 ? ALLOWED_FIRST : RANKED;
        const survivors = active === 0 ? [] : order.slice(0, TOP).filter((name) => name.startsWith("허가"));
        return (
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">{active === 2 ? "허가 문서만으로 매긴 순위" : "전체 문서의 검색 순위"}</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {order.map((name, index) => {
                const outOfScope = active === 2 && name.startsWith("금지");
                return <DocCell key={name} rank={outOfScope ? null : index + 1} name={name} inTop={index < TOP && !outOfScope} outOfScope={outOfScope} />;
              })}
            </div>
            <p className="mb-2 mt-4 text-xs font-semibold text-muted-foreground">재정렬기로 넘어가는 후보</p>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((slot) => (
                <div
                  key={slot}
                  className={`rounded-lg border px-2 py-2 text-center text-xs font-semibold ${
                    survivors[slot] ? "border-primary bg-primary/10 text-primary" : "border-dashed border-border text-muted-foreground/70"
                  }`}
                >
                  {survivors[slot] ?? (active === 1 ? "걸러져 빈 칸" : "아직 없음")}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
