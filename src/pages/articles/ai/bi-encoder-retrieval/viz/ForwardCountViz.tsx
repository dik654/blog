import SceneShell from "./SceneShell";

/**
 * 본문 대응: #offline-index — 문서 10,000개(M)에서 query Q개를 처리할 때의 forward 횟수.
 * Cross-encoder: query마다 pair forward M번 → 10,000·Q.
 * Bi-encoder: generation마다 document forward M번(선불) + query마다 query forward 1번과 ANN 탐색 1번.
 * Query 개수와 generation 교체 시점은 그림을 위한 가정입니다.
 */
const M = 10000;
const MAX = 40000;

const SCENES = [
  {
    label: "query 1개",
    summary: "pair 10,000번 vs query 1번",
    q: 1,
    gens: 1,
    note: "Cross-encoder는 첫 query를 문서 10,000개와 하나씩 묶어 pair forward 10,000번을 합니다. Bi-encoder는 generation g를 만들 때 document forward 10,000번을 미리 끝냈고, 요청 때는 query forward 1번과 ANN 탐색만 합니다.",
  },
  {
    label: "query 3개",
    summary: "30,000번 vs 선불 10,000 + query 3번",
    q: 3,
    gens: 1,
    note: "Query가 셋이 되면 cross-encoder의 pair forward는 30,000번으로 늘어납니다. Bi-encoder의 document 계산은 같은 generation에서 재사용되므로 10,000번 그대로이고, online 쪽만 query 3개만큼 늘어납니다.",
  },
  {
    label: "새 generation",
    summary: "선불 20,000 + query 4번 vs 40,000번",
    q: 4,
    gens: 2,
    note: "Corpus·encoder·pooling·dtype 중 하나가 바뀌어 generation이 교체되면 document forward 10,000번을 다시 선불합니다(교체 시점은 가정). 그 뒤 네 번째 query에서 cross-encoder 누적은 40,000번입니다.",
  },
] as const;

function Row({ label, segments, total }: { label: string; segments: readonly { value: number; color: string; dashed?: boolean }[]; total: string }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs sm:text-sm">
        <span className="font-semibold">{label}</span>
        <span className="font-mono">{total}</span>
      </div>
      <div className="flex h-5 min-w-0 gap-px rounded-sm bg-muted/40">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${(seg.value / MAX) * 100}%`, minWidth: seg.value > 0 ? 3 : 0, backgroundColor: seg.color, opacity: seg.dashed ? 0.55 : 0.9 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ForwardCountViz() {
  return (
    <SceneShell
      eyebrow="query가 늘어날 때"
      title="Cross-encoder는 query마다 10,000번, bi-encoder는 문서 계산을 generation마다 한 번 선불합니다"
      description="Generation은 corpus·encoder·pooling·dtype가 함께 고정된 index 배포 세대입니다. 막대 길이는 forward 횟수입니다(최대 40,000). pair forward와 document forward는 한 번의 비용이 서로 다르므로 이 그림은 횟수만 셉니다. 문서 10,000개는 본문 예이고 query 개수는 가정입니다."
      ariaLabel="문서 10,000개에서 query 수에 따라 cross-encoder와 bi-encoder의 forward 횟수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const pairs = M * scene.q;
        return (
          <div className="min-w-0 space-y-4">
            <Row
              label="Cross-encoder · pair forward (online)"
              total={`${pairs.toLocaleString("en-US")}번`}
              segments={Array.from({ length: scene.q }, () => ({ value: M, color: "#d97706" }))}
            />
            <Row
              label="Bi-encoder · document forward (offline 선불)"
              total={`${(M * scene.gens).toLocaleString("en-US")}번 · generation ${scene.gens}개`}
              segments={Array.from({ length: scene.gens }, (_, i) => ({ value: M, color: "#64748b", dashed: i > 0 }))}
            />
            <Row
              label="Bi-encoder · query forward + ANN 탐색 (online)"
              total={`query ${scene.q}번 + 탐색 ${scene.q}번`}
              segments={Array.from({ length: scene.q }, () => ({ value: 1, color: "#2563eb" }))}
            />
            <p className="text-xs leading-5 text-muted-foreground">
              Bi-encoder가 대신 떠안는 것: index build와 memory, ANN이 후보를 놓칠 가능성. 두 방식의 ranking 품질이 같다고 가정하지 않습니다.
            </p>
          </div>
        );
      }}
    />
  );
}
