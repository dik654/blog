import SceneShell from "./ProvenanceSceneShell";

/**
 * 본문 대응: #fragment-shape — chunk text와 source URL을 별도 배열에 두면
 * reranking·dedup·serialization 과정에서 대응이 깨질 수 있고,
 * fragment ID와 source receipt를 같은 record로 두면 citation도 그 record에서 나온다.
 * fragment 셋과 reranker가 고른 순서는 설명용 가정이다.
 */
const FRAGMENTS: readonly { id: string; text: string; source: string }[] = [
  { id: "f1", text: "연차 규정 문장 (v6)", source: "policy://leave/section-4@v6" },
  { id: "f2", text: "연차 규정 문장 (v7)", source: "policy://leave/section-4@v7" },
  { id: "f3", text: "다른 문서 문장 (가정)", source: "doc://x (가정)" },
];

type Row = { text: string; source: string; ok: boolean };

const ALIGNED: readonly Row[] = FRAGMENTS.map((f) => ({ text: f.text, source: f.source, ok: true }));
const RERANK_ORDER: readonly number[] = [1, 2, 0];
const DRIFTED: readonly Row[] = RERANK_ORDER.map((from, index) => ({
  text: FRAGMENTS[from].text,
  source: FRAGMENTS[index].source,
  ok: from === index,
}));
const RECORDS: readonly Row[] = RERANK_ORDER.map((from) => ({ text: FRAGMENTS[from].text, source: FRAGMENTS[from].source, ok: true }));

const SCENES = [
  { label: "복사 직후", summary: "texts[i] ↔ urls[i]", rows: ALIGNED, note: "Chunk text를 texts 배열에, source URL을 urls 배열에 따로 담았습니다. 지금은 같은 번호끼리 짝이 맞지만, 그 짝을 묶어 두는 것은 배열 번호뿐입니다." },
  { label: "text만 재정렬", summary: "3칸 중 3칸 어긋남", rows: DRIFTED, note: "Reranker가 texts만 다시 정렬하고 urls는 그대로 두었다고 해 봅니다. 0번 칸의 v7 문장이 v6 주소로 인용됩니다. Dedup이 한쪽 배열에서만 칸을 지우거나 serialization이 한쪽 순서만 바꿔도 같은 방식으로 대응이 깨질 수 있습니다." },
  { label: "한 record로 이동", summary: "id·text·source가 함께", rows: RECORDS, note: "Fragment ID와 text와 source receipt를 한 record로 묶으면 reranking으로 순서가 바뀌어도 세 값이 함께 움직입니다. Citation은 그 record의 source와 revision에서 바로 만듭니다." },
] as const;

export default function ParallelArrayDriftViz() {
  return (
    <SceneShell
      eyebrow="Text와 source를 따로 두면"
      title="배열 번호로만 묶인 출처는 순서가 바뀌면 어긋날 수 있습니다"
      description="한 줄이 context에 들어갈 fragment 하나입니다. Fragment 셋과 reranker가 고른 순서는 설명을 위한 가정입니다."
      ariaLabel="text 배열과 URL 배열을 따로 둘 때 재정렬 후 출처가 어긋나는 과정과 한 record로 묶을 때의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const record = active === 2;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,1.2fr)_2.75rem] gap-x-2 border-b border-border pb-1 text-[10px] font-bold text-muted-foreground">
              <span>{record ? "id" : "번호"}</span>
              <span>{record ? "record.text" : "texts[i]"}</span>
              <span>{record ? "record.source" : "urls[i]"}</span>
              <span className="text-right">인용</span>
            </div>
            <div className="mt-1 space-y-1">
              {scene.rows.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,1.2fr)_2.75rem] items-center gap-x-2 rounded-lg border px-1 py-2 text-xs leading-5 ${row.ok ? "border-border bg-background" : "border-red-600 bg-red-600/10"}`}
                >
                  <span className="font-mono font-bold">{record ? FRAGMENTS[RERANK_ORDER[index]].id : index}</span>
                  <span className="min-w-0 break-keep font-semibold">{row.text}</span>
                  <span className="min-w-0 break-all font-mono text-[11px]">{row.source}</span>
                  <span className={`text-right font-bold ${row.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>{row.ok ? "맞음" : "어긋남"}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {record ? "순서: reranker 결과(가정) · 각 줄이 한 record" : active === 1 ? "texts 순서: reranker 결과(가정) · urls 순서: 그대로" : "순서: 검색 결과 그대로"}
            </p>
          </div>
        );
      }}
    />
  );
}
