import { motion } from "framer-motion";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "분석 결과",
  "posting list",
  "후보 집합",
  "BM25 입력",
  "순위 확정",
] as const;

const NOTES = [
  "검색어 q-18과 문서 세 개를 같은 analyzer로 처리했다고 가정합니다. 아래의 한국어 단어는 원문이 아니라 analyzer가 내놓은 token입니다.",
  "각 token에서 그 token을 가진 문서로 방향을 뒤집습니다. 충전 posting list에는 D1의 빈도 2와 D3의 빈도 1이 함께 저장됩니다.",
  "q-18의 충전·오류 posting list를 합치면 후보는 D1과 D3입니다. D2는 어느 목록에도 없어서 점수 계산 전에 빠집니다.",
  "후보마다 term frequency, 문서 길이, document frequency를 꺼냅니다. 두 query term은 문서 세 개 중 두 개에 있으므로 IDF가 모두 0.4700입니다.",
  "Lucene 10.5.2 식으로 계산하면 D1은 0.5539, D3은 0.3547입니다. D1은 더 짧고 충전이 두 번 나와 먼저 반환됩니다.",
] as const;

const DOCUMENTS = [
  { id: "D1", length: 3, tokens: ["충전", "충전", "오류"] },
  { id: "D2", length: 3, tokens: ["배터리", "교체", "안내"] },
  { id: "D3", length: 6, tokens: ["충전", "오류", "케이블", "어댑터", "점검", "절차"] },
] as const;

const POSTINGS = [
  { term: "충전", docs: ["D1 · tf 2", "D3 · tf 1"] },
  { term: "오류", docs: ["D1 · tf 1", "D3 · tf 1"] },
] as const;

const CANDIDATES = [
  { id: "D1", length: 3, termFrequency: "충전 2 · 오류 1", score: 0.5539 },
  { id: "D3", length: 6, termFrequency: "충전 1 · 오류 1", score: 0.3547 },
] as const;

function ReducedSceneList() {
  return (
    <ol className="mt-4 divide-y divide-border border-y border-border text-sm leading-6">
      {SCENES.map((label, index) => (
        <li key={label} className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
          <strong>{index + 1}. {label}</strong>
          <span className="text-muted-foreground">{NOTES[index]}</span>
        </li>
      ))}
    </ol>
  );
}

function FlowArrow({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex min-h-11 items-center justify-center gap-2 py-1 lg:flex-col lg:px-1 lg:py-0" aria-hidden="true">
      <span className={`h-px w-9 transition-colors lg:h-9 lg:w-px ${active ? "bg-primary" : "bg-border"}`} />
      <span className={`text-[9px] font-bold transition-colors ${active ? "text-primary" : "text-muted-foreground/55"}`}>{label}</span>
      <span className={`text-sm transition-colors ${active ? "text-primary" : "text-muted-foreground/40"}`}>→</span>
    </div>
  );
}

function MobileScene({ scene }: { scene: number }) {
  if (scene === 0) {
    return (
      <section className="border border-border p-3" aria-label="모바일 분석 결과">
        <p className="text-[10px] font-black text-muted-foreground">문서 → token</p>
        <div className="mt-3 space-y-2">
          {DOCUMENTS.map((doc) => (
            <div key={doc.id} className="border border-border p-2.5">
              <div className="flex items-center justify-between gap-2">
                <strong className="font-mono text-xs">{doc.id}</strong>
                <span className="text-[10px] text-muted-foreground">길이 {doc.length}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {doc.tokens.map((token, index) => (
                  <span key={`${doc.id}-mobile-${token}-${index}`} className="border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {token}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (scene === 1) {
    return (
      <section className="border border-border p-4" aria-label="모바일 posting list">
        <p className="text-[10px] font-black text-muted-foreground">term → posting list</p>
        <div className="mt-4 space-y-4">
          {POSTINGS.map((posting) => (
            <div key={posting.term} className="border-l-2 border-primary pl-3">
              <strong className="font-mono text-sm">{posting.term}</strong>
              <div className="mt-2 flex flex-wrap gap-2">
                {posting.docs.map((doc) => <span key={doc} className="border border-border px-2 py-1 font-mono text-xs">{doc}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (scene === 2) {
    return (
      <section className="border border-border p-4" aria-label="모바일 후보 집합">
        <p className="text-[10px] font-black text-muted-foreground">posting list 합집합</p>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
          <span className="border border-border px-2 py-3 font-mono text-xs">충전 · D1,D3</span>
          <span aria-hidden="true" className="text-primary">∪</span>
          <span className="border border-border px-2 py-3 font-mono text-xs">오류 · D1,D3</span>
        </div>
        <p className="mt-4 border-l-2 border-primary pl-3 text-base font-black">candidate = &#123;D1, D3&#125;</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">D2는 어느 posting list에도 없어 채점 전에 빠집니다.</p>
      </section>
    );
  }

  if (scene === 3) {
    return (
      <section className="border border-border p-4" aria-label="모바일 BM25 입력">
        <p className="text-[10px] font-black text-muted-foreground">두 후보에 넣을 통계</p>
        <div className="mt-4 grid grid-cols-2 gap-px bg-border p-px font-mono text-xs">
          {["N = 3", "avgdl = 4", "df(충전) = 2", "df(오류) = 2", "D1 · tf 2+1 · len 3", "D3 · tf 1+1 · len 6"].map((value) => (
            <span key={value} className="bg-background px-2 py-3">{value}</span>
          ))}
        </div>
        <p className="mt-4 font-mono text-xs font-bold text-primary">idf = ln(1 + 1.5 / 2.5) = 0.4700</p>
      </section>
    );
  }

  return (
    <section className="border border-border p-4" aria-label="모바일 BM25 순위">
      <p className="text-[10px] font-black text-muted-foreground">candidate → BM25 순위</p>
      <div className="mt-4 space-y-3">
        {CANDIDATES.map((candidate, index) => (
          <div key={candidate.id} className={`border p-3 ${index === 0 ? "border-primary bg-primary/[0.06]" : "border-border"}`}>
            <div className="flex items-center justify-between gap-2">
              <strong className="font-mono text-sm">{index + 1}위 · {candidate.id}</strong>
              <span className="font-mono text-base font-black text-primary">{candidate.score.toFixed(4)}</span>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">{candidate.termFrequency} · 길이 {candidate.length}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 border-l-2 border-primary pl-3 text-sm font-bold leading-6">D1은 D3보다 짧고 “충전”이 한 번 더 나와 먼저 반환됩니다.</p>
    </section>
  );
}

function QueryTrace({ scene }: { scene: number }) {
  return (
    <div className="min-w-0">
      <div className="grid gap-2 border-y border-border py-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-black text-primary">q-18</span>
          <strong className="break-keep text-sm">“충전 오류”</strong>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
          <span className="text-[10px] font-bold text-muted-foreground">analyzer 출력</span>
          {["충전", "오류"].map((term) => (
            <motion.span
              key={term}
              animate={{
                backgroundColor: scene >= 1 ? "hsl(var(--primary) / 0.10)" : "hsl(var(--muted) / 0.55)",
                borderColor: scene >= 1 ? "hsl(var(--primary) / 0.7)" : "hsl(var(--border))",
              }}
              transition={{ duration: 0.25 }}
              className="border px-2 py-1 font-mono text-xs font-bold"
            >
              {term}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="mt-5 lg:hidden">
        <MobileScene scene={scene} />
      </div>

      <div className="mt-5 hidden min-w-0 items-stretch gap-0 lg:grid lg:grid-cols-[minmax(0,1.05fr)_3.25rem_minmax(0,.9fr)_3.25rem_minmax(0,1fr)]">
        <section className="min-w-0 border border-border p-3" aria-label="분석된 문서">
          <p className="text-[10px] font-black text-muted-foreground">문서 → token</p>
          <div className="mt-3 space-y-2">
            {DOCUMENTS.map((doc) => {
              const candidate = doc.id !== "D2";
              return (
                <motion.div
                  key={doc.id}
                  animate={{
                    opacity: scene >= 2 && !candidate ? 0.38 : 1,
                    borderColor: scene >= 2 && candidate ? "hsl(var(--primary) / 0.55)" : "hsl(var(--border))",
                  }}
                  transition={{ duration: 0.25 }}
                  className="border p-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <strong className="font-mono text-xs">{doc.id}</strong>
                    <span className="text-[10px] text-muted-foreground">길이 {doc.length}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {doc.tokens.map((token, index) => {
                      const matched = token === "충전" || token === "오류";
                      return (
                        <span
                          key={`${doc.id}-${token}-${index}`}
                          className={`border px-1.5 py-0.5 font-mono text-[10px] ${scene >= 1 && matched ? "border-primary/60 bg-primary/[0.08] text-foreground" : "border-border text-muted-foreground"}`}
                        >
                          {token}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <FlowArrow active={scene >= 1} label="색인" />

        <section className="min-w-0 border border-border p-3" aria-label="query term의 posting list">
          <p className="text-[10px] font-black text-muted-foreground">term → posting list</p>
          <div className="mt-3 space-y-3">
            {POSTINGS.map((posting, postingIndex) => (
              <motion.div
                key={posting.term}
                animate={{
                  opacity: scene >= 1 ? 1 : 0.3,
                  borderColor: scene >= 2 ? "hsl(var(--primary) / 0.65)" : "hsl(var(--border))",
                }}
                transition={{ duration: 0.25, delay: postingIndex * 0.08 }}
                className="border-l-2 pl-3"
              >
                <strong className="font-mono text-xs">{posting.term}</strong>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {posting.docs.map((doc) => (
                    <span key={doc} className="border border-border bg-muted/20 px-2 py-1 font-mono text-[10px]">{doc}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p
            animate={{ opacity: scene >= 3 ? 1 : 0.3 }}
            className="mt-5 border-t border-border pt-3 font-mono text-[10px] leading-5 text-muted-foreground"
          >
            N=3 · avgdl=4<br />df(충전)=2 · df(오류)=2<br />idf=ln(1+1.5/2.5)=0.4700
          </motion.p>
        </section>

        <FlowArrow active={scene >= 2} label="합집합" />

        <section className="min-w-0 border border-border p-3" aria-label="후보와 BM25 점수">
          <p className="text-[10px] font-black text-muted-foreground">candidate → BM25 순위</p>
          <div className="mt-3 space-y-3">
            {CANDIDATES.map((candidate, index) => {
              const winner = scene >= 4 && index === 0;
              return (
                <motion.div
                  key={candidate.id}
                  animate={{
                    opacity: scene >= 2 ? 1 : 0.28,
                    borderColor: winner ? "hsl(var(--primary))" : "hsl(var(--border))",
                    backgroundColor: winner ? "hsl(var(--primary) / 0.07)" : "hsl(var(--background))",
                  }}
                  transition={{ duration: 0.3 }}
                  className="border p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <strong className="font-mono text-sm">{index + 1}위 · {candidate.id}</strong>
                    <span className={`font-mono text-sm font-black ${scene >= 4 ? "text-primary" : "text-muted-foreground/35"}`}>
                      {scene >= 4 ? candidate.score.toFixed(4) : "—"}
                    </span>
                  </div>
                  <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{candidate.termFrequency} · 길이 {candidate.length}</p>
                  <div className="mt-2 h-1.5 bg-muted/50" aria-hidden="true">
                    <motion.div
                      initial={false}
                      animate={{ width: scene >= 4 ? `${candidate.score * 100}%` : "0%" }}
                      transition={{ duration: 0.55, delay: index * 0.15 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <motion.p
            animate={{ opacity: scene >= 4 ? 1 : 0.28 }}
            className="mt-4 border-l-2 border-primary pl-3 text-xs font-bold leading-5"
          >
            D1은 짧고 “충전”이 두 번 나와 D3보다 앞섭니다.
          </motion.p>
        </section>
      </div>
    </div>
  );
}

export default function LexicalRetrievalBm25InvertedIndexViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6500, { loop: false, autoPlay: false });
  const scene = scenes.active;

  if (scenes.reducedMotion) {
    return (
      <VizFrame
        eyebrow="q-18 검색 추적"
        title="같은 단어를 가진 문서만 모아 BM25로 순서를 정합니다"
        description="분석된 token에서 posting list를 열고, 후보를 합친 뒤, 같은 통계로 두 문서의 점수를 계산합니다."
      >
        <ReducedSceneList />
      </VizFrame>
    );
  }

  return (
    <VizFrame
      eyebrow="q-18 검색 추적"
      title="같은 단어를 가진 문서만 모아 BM25로 순서를 정합니다"
      description="문서 세 개와 검색어 하나를 끝까지 고정했습니다. 장면을 직접 넘기거나 한 번 재생해 후보가 줄고 점수가 채워지는 순서를 따라가세요."
      note="설명용 가정 · analyzer 출력 3문서 · Lucene 10.5.2 BM25 기본값 k1=1.2, b=0.75"
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="q-18이 posting list를 거쳐 BM25 순위가 되는 다섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-live-only>
          <QueryTrace scene={scene} />
          <div className="mt-5 border-l-2 border-primary/50 pl-4" aria-live="polite">
            <p className="font-mono text-[10px] font-black text-primary">{String(scene + 1).padStart(2, "0")} / {SCENES.length}</p>
            <h4 className="mt-1 break-keep text-base font-black">{SCENES[scene]}</h4>
            <p className="mt-2 max-w-4xl break-keep text-sm leading-7 text-muted-foreground">{NOTES[scene]}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
