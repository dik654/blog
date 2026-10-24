import {
  MULTIMODAL_LEARNING_NODES,
  getMultimodalLearningNode,
  type MultimodalLearningNodeId,
} from "@/content/multimodal-learning-tree";
import { Link } from "react-router-dom";

function NeighborLink({
  direction,
  node,
}: {
  direction: "previous" | "next";
  node: (typeof MULTIMODAL_LEARNING_NODES)[number] | undefined;
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

export default function MultimodalSeriesLocator({
  current,
}: {
  current: MultimodalLearningNodeId;
}) {
  const node = getMultimodalLearningNode(current);
  const currentIndex = MULTIMODAL_LEARNING_NODES.findIndex(
    (candidate) => candidate.id === current,
  );
  const previous =
    currentIndex > 0 ? MULTIMODAL_LEARNING_NODES[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0
      ? MULTIMODAL_LEARNING_NODES[currentIndex + 1]
      : undefined;

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="멀티모달 학습 지도에서 현재 글의 위치"
      data-multimodal-track="concept"
    >
      <nav
        aria-label="멀티모달 글 위치"
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground"
      >
        <Link to="/cs/ai/vision-transformer" className="hover:text-primary">
          시각 표현
        </Link>
        <span aria-hidden="true">›</span>
        <span>멀티모달</span>
        <span aria-hidden="true">›</span>
        <span>개념 트랙</span>
        <span aria-hidden="true">›</span>
        <strong className="text-foreground" aria-current="page">
          {node.shortTitle}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
        <div className="min-w-0">
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념
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
            직속 부모 지도
          </p>
          <Link
            to={node.parentHref}
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {node.parentLabel} ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-2"
        aria-label="같은 개념 트랙의 이전 글과 다음 글"
      >
        <NeighborLink direction="previous" node={previous} />
        <NeighborLink direction="next" node={next} />
      </div>
    </aside>
  );
}

export function MultimodalMapReturn({
  current,
}: {
  current: MultimodalLearningNodeId;
}) {
  const node = getMultimodalLearningNode(current);

  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="이 글에서 확인한 사실을 직속 부모 지도에 되돌려 놓기"
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
