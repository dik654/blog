import { Link } from "react-router-dom";
import {
  EMBEDDING_LEARNING_NODES,
  getEmbeddingLearningNode,
  getEmbeddingLearningTrackNodes,
  type EmbeddingLearningNodeId,
  type EmbeddingLearningTrack,
} from "@/content/embedding-learning-tree";

const TRACK_LABEL: Record<EmbeddingLearningTrack, string> = {
  concept: "개념",
  practice: "실무",
  reference: "참고",
};

export default function EmbeddingPathLocator({
  current,
}: {
  current: EmbeddingLearningNodeId;
}) {
  const node = getEmbeddingLearningNode(current);
  const track = getEmbeddingLearningTrackNodes(node.track);
  const currentIndex = track.findIndex((candidate) => candidate.id === current);
  const previous = currentIndex > 0 ? track[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? track[currentIndex + 1] : undefined;

  return (
    <aside
      id="embedding-family-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="임베딩 학습 지도에서 현재 글의 위치"
      data-embedding-track={node.track}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai?sub=ai-practical-embedding" className="hover:text-primary">도메인 임베딩·적응</Link>
        <span aria-hidden>›</span>
        <span>{TRACK_LABEL[node.track]} 트랙</span>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{node.shortTitle}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
              {TRACK_LABEL[node.track]}
            </span>
            <span className="text-[11px] text-muted-foreground">현재 영역 · {node.shortTitle}</span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">{node.question}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link to={node.parentHref} className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">
            {node.parentLabel} ↗
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3" aria-label="임베딩의 여섯 학습 영역">
        {EMBEDDING_LEARNING_NODES.map((candidate, index) => {
          const active = candidate.id === current;
          return (
            <Link
              key={candidate.id}
              to={candidate.href}
              aria-current={active ? "step" : undefined}
              className={`min-w-0 bg-background px-3 py-3 ${active ? "text-foreground" : "text-muted-foreground hover:text-primary"}`}
            >
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs leading-5">{candidate.shortTitle}</strong>
              <span className="mt-0.5 block text-[9px] font-bold text-primary/80">{TRACK_LABEL[candidate.track]}</span>
              <span className="mt-1 block break-keep text-[10px] leading-4">{candidate.mapLabel}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-2" aria-label="같은 트랙의 이전 글과 다음 글">
        {previous ? (
          <Link to={previous.href} className="border-b border-border py-2 text-xs leading-5 hover:border-primary hover:text-primary">
            <span className="block text-[10px] text-muted-foreground">← 이전</span>
            <strong className="block break-keep">{previous.shortTitle}</strong>
          </Link>
        ) : <span aria-hidden="true" />}
        {next ? (
          <Link to={next.href} className="border-b border-border py-2 text-right text-xs leading-5 hover:border-primary hover:text-primary">
            <span className="block text-[10px] text-muted-foreground">다음 →</span>
            <strong className="block break-keep">{next.shortTitle}</strong>
          </Link>
        ) : <span aria-hidden="true" />}
      </div>
    </aside>
  );
}

export function EmbeddingMapReturn({
  current,
}: {
  current: EmbeddingLearningNodeId;
}) {
  const node = getEmbeddingLearningNode(current);
  const track = getEmbeddingLearningTrackNodes(node.track);
  const currentIndex = track.findIndex((candidate) => candidate.id === current);
  const next = currentIndex >= 0 ? track[currentIndex + 1] : undefined;

  return (
    <aside id="return-map" className="not-prose my-8 scroll-mt-20 border-y border-border py-5" aria-label="확인한 사실을 임베딩 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">{node.closure}</p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link to={node.parentHref} className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
          직속 부모: {node.parentLabel} ↗
        </Link>
        {next ? (
          <Link to={next.href} className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
            다음: {next.shortTitle} ↗
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
