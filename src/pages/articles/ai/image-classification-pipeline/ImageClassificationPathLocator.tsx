import {
  IMAGE_CLASSIFICATION_LEARNING_NODES,
  getImageClassificationLearningNode,
  getImageClassificationTrackNodes,
  type ImageClassificationLearningNodeId,
  type ImageClassificationLearningTrack,
} from "@/content/image-classification-learning-tree";
import { Link } from "react-router-dom";

const TRACK_LABEL: Record<ImageClassificationLearningTrack, string> = {
  concept: "개념",
  practice: "실무",
  reference: "참고",
};

function NeighborLink({
  direction,
  node,
}: {
  direction: "previous" | "next";
  node:
    | ReturnType<typeof getImageClassificationLearningNode>
    | undefined;
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

export default function ImageClassificationPathLocator({
  current,
}: {
  current: ImageClassificationLearningNodeId;
}) {
  const node = getImageClassificationLearningNode(current);
  const track = getImageClassificationTrackNodes(node.track);
  const currentIndex = track.findIndex((candidate) => candidate.id === current);
  const previous = currentIndex > 0 ? track[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? track[currentIndex + 1] : undefined;

  return (
    <aside
      id="image-classification-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="이미지 분류 학습 지도에서 현재 글의 위치"
      data-image-classification-track={node.track}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">
          인공지능
        </Link>
        <span aria-hidden>›</span>
        <span>이미지 분류</span>
        <span aria-hidden>›</span>
        <span>{TRACK_LABEL[node.track]} 트랙</span>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {node.shortTitle}
        </strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
              {TRACK_LABEL[node.track]}
            </span>
            <span className="text-[11px] text-muted-foreground">
              현재 영역 · {node.shortTitle}
            </span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            {node.question}
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
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px lg:grid-cols-5"
        aria-label="이미지 분류를 데이터 경계에서 여러 관측 결합까지 따라가는 다섯 영역"
      >
        {IMAGE_CLASSIFICATION_LEARNING_NODES.map((candidate, index) => {
          const active = candidate.id === current;
          return (
            <Link
              key={candidate.id}
              to={candidate.href}
              aria-current={active ? "step" : undefined}
              className={`min-w-0 bg-background px-3 py-3 ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <span className="font-mono text-[9px] font-black text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-1 block break-keep text-xs leading-5">
                {candidate.shortTitle}
              </strong>
              <span className="mt-1 block break-keep text-[10px] leading-4">
                {candidate.mapLabel}
              </span>
            </Link>
          );
        })}
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

export function ImageClassificationMapReturn({
  current,
}: {
  current: ImageClassificationLearningNodeId;
}) {
  const node = getImageClassificationLearningNode(current);

  return (
    <aside
      id="image-classification-map-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 이미지 분류 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        부모 지도에 되돌려 놓기
      </p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {node.closure}
      </p>
      <Link
        to="/cs/ai/image-classification-pipeline#overview"
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        이미지 분류의 네 영역 다시 보기 ↗
      </Link>
    </aside>
  );
}
