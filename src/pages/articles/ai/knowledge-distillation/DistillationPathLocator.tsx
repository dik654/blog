import { Link } from "react-router-dom";
import {
  DISTILLATION_LEARNING_NODES,
  getDistillationLearningNode,
  getDistillationLearningTrackNodes,
  type DistillationLearningNodeId,
  type DistillationLearningTrack,
} from "@/content/distillation-learning-tree";

const TRACK_LABEL: Record<DistillationLearningTrack, string> = {
  concept: "개념",
  practice: "실무",
  reference: "참고",
};

const REGION_ORDER = ["공유 출력", "문자열", "방문 상태", "세대"] as const;

export default function DistillationPathLocator({
  current,
}: {
  current: DistillationLearningNodeId;
}) {
  const node = getDistillationLearningNode(current);
  const track = getDistillationLearningTrackNodes(node.track);
  const currentIndex = track.findIndex((candidate) => candidate.id === current);
  const previous = currentIndex > 0 ? track[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? track[currentIndex + 1] : undefined;

  return (
    <aside
      id="distillation-family-map"
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="지식 증류 학습 지도에서 현재 글의 위치"
      data-distillation-track={node.track}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai?sub=ai-practical-compression" className="hover:text-primary">모델 경량화</Link>
        <span aria-hidden>›</span>
        <span>{TRACK_LABEL[node.track]} 트랙</span>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">{node.shortTitle}</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
              {TRACK_LABEL[node.track]}
            </span>
            <span className="text-[11px] text-muted-foreground">
              현재 영역 · {node.region} · {node.shortTitle}
            </span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            {node.question}
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link
            to={node.parentHref}
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            {node.parentLabel} ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
        aria-label="지식 증류의 네 전달 경로"
      >
        {REGION_ORDER.map((region) => {
          const candidate = DISTILLATION_LEARNING_NODES.find(
            (entry) => entry.region === region,
          );
          if (!candidate) return null;
          const active = candidate.id === current;
          return (
            <section key={region} className="bg-background p-3" aria-label={`${region} 영역`}>
              <p className="border-b border-border pb-2 text-[10px] font-black text-primary">
                {region}
              </p>
              <Link
                to={candidate.href}
                aria-current={active ? "step" : undefined}
                className={`mt-2 block min-h-16 border-l-2 px-3 py-2 ${
                  active
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                }`}
              >
                <span className="flex items-start justify-between gap-2">
                  <strong className="break-keep text-xs leading-5">{candidate.shortTitle}</strong>
                  <span className="shrink-0 text-[9px] font-bold text-primary/80">
                    {TRACK_LABEL[candidate.track]}
                  </span>
                </span>
                <span className="mt-1 block break-keep text-[10px] leading-4">
                  {candidate.mapLabel}
                </span>
              </Link>
            </section>
          );
        })}
      </div>

      <div
        className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-2"
        aria-label="같은 트랙의 이전 글과 다음 글"
      >
        {previous ? (
          <Link
            to={previous.href}
            className="border-b border-border py-2 text-xs leading-5 hover:border-primary hover:text-primary"
          >
            <span className="block text-[10px] text-muted-foreground">← 이전</span>
            <strong className="block break-keep">{previous.shortTitle}</strong>
          </Link>
        ) : <span aria-hidden="true" />}
        {next ? (
          <Link
            to={next.href}
            className="border-b border-border py-2 text-right text-xs leading-5 hover:border-primary hover:text-primary"
          >
            <span className="block text-[10px] text-muted-foreground">다음 →</span>
            <strong className="block break-keep">{next.shortTitle}</strong>
          </Link>
        ) : <span aria-hidden="true" />}
      </div>
    </aside>
  );
}

export function DistillationMapReturn({
  current,
}: {
  current: DistillationLearningNodeId;
}) {
  const node = getDistillationLearningNode(current);
  const track = getDistillationLearningTrackNodes(node.track);
  const currentIndex = track.findIndex((candidate) => candidate.id === current);
  const next = currentIndex >= 0 ? track[currentIndex + 1] : undefined;

  return (
    <aside
      id="return-map"
      className="not-prose my-8 scroll-mt-20 border-y border-border py-5"
      aria-label="확인한 사실을 지식 증류 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {node.closure}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link
          to={node.parentHref}
          className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
        >
          직속 부모: {node.parentLabel} ↗
        </Link>
        {next ? (
          <Link
            to={next.href}
            className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
          >
            다음: {next.shortTitle} ↗
          </Link>
        ) : (
          <Link
            to="/cs/ai/compression-pipeline#overview"
            className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
          >
            실무 적용: 경량화 파이프라인 ↗
          </Link>
        )}
      </div>
    </aside>
  );
}
