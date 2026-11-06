import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hybrid-depth — sparse top-5와 dense top-5의 합집합.
 * 5 + 5 = 10, 겹침 d1·d3 2개를 한 번만 세어 8개. 순서는 아직 없습니다.
 */
const SPARSE = ["d1", "d2", "d3", "d4", "d5"] as const;
const DENSE = ["d3", "d6", "d1", "d7", "d8"] as const;
const OVERLAP: readonly string[] = SPARSE.filter((doc) => (DENSE as readonly string[]).includes(doc));
const UNION = [...new Set<string>([...SPARSE, ...DENSE])].sort();

const SCENES = [
  { label: "두 목록을 그대로 놓으면", summary: `5 + 5 = ${SPARSE.length + DENSE.length}칸`, note: "희소 검색(BM25 같은 단어 일치)과 밀집 벡터 검색(의미 검색)을 각각 상위 5개까지 실행한 결과입니다." },
  { label: "같은 문서 찾기", summary: `겹침 ${OVERLAP.length}개`, note: "d1과 d3는 두 목록에 모두 있습니다. 문서 ID를 기준으로 비교하면 이 두 문서가 두 번 세어진 셈입니다." },
  { label: "중복을 지운 합집합", summary: `10 − ${OVERLAP.length} = ${UNION.length}개`, note: "겹친 문서를 한 번만 세어 후보가 8개가 됩니다. 칸의 나열은 ID 순서일 뿐이고 이 단계에는 아직 순위가 없습니다." },
] as const;

function Doc({ id, hot, muted = false }: { id: string; hot: boolean; muted?: boolean }) {
  return (
    <span className={`flex h-9 min-w-0 items-center justify-center rounded-md border font-mono text-xs font-semibold ${hot ? "border-amber-600 bg-amber-500/15 text-amber-800 dark:text-amber-300" : muted ? "border-dashed border-border text-muted-foreground/60" : "border-border bg-background text-foreground"}`}>
      {id}
    </span>
  );
}

function Row({ name, docs, hot }: { name: string; docs: readonly string[]; hot: boolean }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{name}</p>
      <div className="grid grid-cols-5 gap-1">
        {docs.map((doc) => (
          <Doc key={doc} id={doc} hot={hot && OVERLAP.includes(doc)} />
        ))}
      </div>
    </div>
  );
}

export default function UnionViz() {
  return (
    <SceneShell
      eyebrow="후보 합집합"
      title="두 검색의 상위 5개를 합치면 후보는 8개입니다"
      description="칸 하나가 문서 하나이고 두 목록은 예시입니다. 8개는 이 예의 값으로, 겹침 수에 따라 달라지며 10개를 넘지 않습니다."
      ariaLabel="sparse top-5와 dense top-5에서 겹치는 문서를 지워 합집합 8개를 만드는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <Row name="Sparse top-5" docs={SPARSE} hot={active >= 1} />
          <Row name="Dense top-5" docs={DENSE} hot={active >= 1} />
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">후보 합집합 · 순서 없음</p>
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-8">
              {UNION.map((doc) =>
                active === 2 ? (
                  <Doc key={doc} id={doc} hot={OVERLAP.includes(doc)} />
                ) : (
                  <Doc key={doc} id="·" hot={false} muted />
                ),
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}
