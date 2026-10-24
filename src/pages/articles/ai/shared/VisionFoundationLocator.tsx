import { Link } from "react-router-dom";

const VISION_PATH = [
  ["cnn", "지역 계산", "작은 창을 모든 위치에서 재사용", "/cs/ai/cnn"],
  ["equivariance", "이동", "입력이 옮겨질 때 출력 좌표를 추적", "/cs/ai/cnn-translation-equivariance"],
  ["receptive", "범위", "출력 하나가 읽는 원본 영역을 계산", "/cs/ai/cnn-receptive-fields"],
  ["depthwise", "분리", "공간 계산과 채널 혼합을 나눔", "/cs/ai/depthwise-separable-convolution"],
  ["resnet", "잔차", "입력을 보존하며 필요한 변화만 더함", "/cs/ai/resnet"],
  ["tasks", "출력", "분류·상자·마스크의 좌표 계약", "/cs/ai/vision-task-spatial-contracts"],
] as const;

type VisionId = (typeof VISION_PATH)[number][0];

export function VisionFoundationLocator({
  current,
  question,
  fixture,
  parentHref,
  parentLabel,
}: {
  current: VisionId;
  question: string;
  fixture: string;
  parentHref: string;
  parentLabel: string;
}) {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-5"
      aria-label="컴퓨터 비전 기초 지도에서 현재 글의 위치"
    >
      <nav
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground"
        aria-label="컴퓨터 비전 기초 글 위치"
      >
        {VISION_PATH.map(([id, label, , href], index) => (
          <span key={id} className="contents">
            {id === current ? (
              <strong className="text-foreground" aria-current="page">
                {label}
              </strong>
            ) : (
              <Link to={href} className="hover:text-primary">
                {label}
              </Link>
            )}
            {index < VISION_PATH.length - 1 ? <span aria-hidden>›</span> : null}
          </span>
        ))}
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념
          </span>
          <p className="mt-3 break-keep text-base font-bold leading-7">{question}</p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">{fixture}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모</p>
          <Link
            to={parentHref}
            className="mt-1 block text-sm font-bold leading-6 hover:text-primary"
          >
            {parentLabel} ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3 lg:grid-cols-6"
        aria-label="컴퓨터 비전 기초 경로"
      >
        {VISION_PATH.map(([id, label, description, href], index) => (
          <Link
            key={id}
            to={href}
            aria-current={id === current ? "step" : undefined}
            className={`min-w-0 bg-background px-2 py-3 ${id === current ? "text-primary" : "text-muted-foreground"}`}
          >
            <span className="font-mono text-[9px]">0{index + 1}</span>
            <strong className="mt-1 block break-keep text-xs">{label}</strong>
            <span className="mt-1 hidden text-[10px] leading-4 lg:block">
              {description}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function VisionMapReturn({
  title,
  detail,
  nextHref,
  nextLabel,
}: {
  title: string;
  detail: string;
  nextHref: string;
  nextLabel: string;
}) {
  return (
    <aside
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 컴퓨터 비전 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">
        컴퓨터 비전 지도에 되돌려 놓기
      </p>
      <p className="mt-2 break-keep text-base font-bold leading-7">{title}</p>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">{detail}</p>
      <Link
        to={nextHref}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {nextLabel} →
      </Link>
    </aside>
  );
}
