import {
  getAutoencoderLearningNode,
  getAutoencoderTrackNodes,
  type AutoencoderLearningNodeId,
  type AutoencoderLearningTrack,
} from "@/content/autoencoder-learning-tree";
import { Link } from "react-router-dom";

const TRACK_LABEL: Record<AutoencoderLearningTrack, string> = {
  concept: "개념",
  practice: "실무",
};

function NeighborLink({
  direction,
  node,
}: {
  direction: "previous" | "next";
  node: ReturnType<typeof getAutoencoderLearningNode> | undefined;
}) {
  if (!node) return <span aria-hidden="true" />;

  return (
    <Link
      to={node.href}
      className={`min-w-0 border-b border-border py-2 text-xs leading-5 hover:border-primary hover:text-primary ${
        direction === "next" ? "text-right" : "text-left"
      }`}
    >
      <span className="block text-[10px] text-muted-foreground">
        {direction === "previous" ? "← 이전" : "다음 →"}
      </span>
      <strong className="block break-keep">{node.shortTitle}</strong>
    </Link>
  );
}

export default function AutoencoderSeriesLocator({
  current,
}: {
  current: AutoencoderLearningNodeId;
}) {
  const node = getAutoencoderLearningNode(current);
  const track = getAutoencoderTrackNodes(node.track);
  const currentIndex = track.findIndex((candidate) => candidate.id === current);
  const previous = currentIndex > 0 ? track[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? track[currentIndex + 1] : undefined;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Autoencoder 학습 지도에서 현재 글의 위치"
      data-autoencoder-track={node.track}
    >
      <nav
        aria-label="Autoencoder 글 위치"
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground"
      >
        <Link to="/cs/ai/deep-learning-overview" className="hover:text-primary">
          딥러닝
        </Link>
        <span aria-hidden="true">›</span>
        <Link to="/cs/ai/autoencoder#overview" className="hover:text-primary">
          Autoencoder
        </Link>
        <span aria-hidden="true">›</span>
        <span>{TRACK_LABEL[node.track]} 트랙</span>
        <span aria-hidden="true">›</span>
        <strong className="text-foreground" aria-current="page">
          {node.shortTitle}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
        <div className="min-w-0">
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            {TRACK_LABEL[node.track]}
          </span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7 text-foreground">
            {node.question}
          </p>
          <p className="mt-1 max-w-3xl text-xs leading-6 text-muted-foreground">
            {node.closure}
          </p>
        </div>

        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">
            {node.track === "concept" ? "직속 부모 지도" : "출발할 개념"}
          </p>
          {node.track === "concept" ? (
            <Link
              to={node.parentHref}
              className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
            >
              {node.parentLabel} ↗
            </Link>
          ) : (
            <ul className="mt-1 space-y-1">
              {node.conceptAnchors?.map((anchor) => (
                <li key={anchor.href}>
                  <Link
                    to={anchor.href}
                    className="break-keep text-xs font-semibold leading-5 hover:text-primary"
                  >
                    {anchor.label} ↗
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-2"
        aria-label={`같은 ${TRACK_LABEL[node.track]} 트랙의 이전 글과 다음 글`}
      >
        <NeighborLink direction="previous" node={previous} />
        <NeighborLink direction="next" node={next} />
      </div>
    </aside>
  );
}

export function AutoencoderMapReturn({
  current,
}: {
  current: Exclude<AutoencoderLearningNodeId, "autoencoder">;
}) {
  const node = getAutoencoderLearningNode(current);

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="이 글에서 확인한 사실을 Autoencoder 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 break-keep text-base font-bold leading-7 text-foreground">
        {node.closure}
      </p>
      <Link
        to={node.parentHref}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {node.parentLabel}로 돌아가기 <span className="ml-1" aria-hidden="true">↗</span>
      </Link>
    </aside>
  );
}
