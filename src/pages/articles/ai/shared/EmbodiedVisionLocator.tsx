import { Link } from "react-router-dom";

const EMBODIED_PATH = [
  ["tasks", "출력", "분류·상자·마스크의 좌표 계약", "/cs/ai/vision-task-spatial-contracts"],
  ["vlm", "의미", "이미지와 언어 표현을 연결", "/cs/ai/vision-language-model-architecture"],
  ["grounding", "연결", "문장과 실제 영역을 대응", "/cs/ai/multimodal-retrieval-and-visual-grounding"],
  ["sam3", "분할", "이름에 해당하는 모든 개체를 분리", "/cs/ai/sam3-promptable-concept-segmentation"],
  ["vla", "실행 경계", "의미를 좌표·행동·제어로 변환", "/cs/ai/vla-embodiment-gap"],
  ["action", "행동", "연속값·토큰·묶음으로 표현", "/cs/ai/robot-action-representations"],
  ["imitation", "학습", "시연을 정책으로 학습하고 범위를 확인", "/cs/ai/imitation-learning-and-policy-generalization"],
  ["navigation", "이동", "지시를 경로·기억·제어로 실행", "/cs/ai/vision-language-navigation"],
] as const;

type EmbodiedId = (typeof EMBODIED_PATH)[number][0];

export function EmbodiedVisionLocator({
  current,
  question,
  fixture,
  parentHref,
  parentLabel,
}: {
  current: EmbodiedId;
  question: string;
  fixture: string;
  parentHref: string;
  parentLabel: string;
}) {
  return (
    <aside className="not-prose mb-8 border-y border-border py-5" aria-label="시각 지능에서 로봇 행동까지의 지도">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground" aria-label="현재 글의 위치">
        {EMBODIED_PATH.map(([id, label, , href], index) => (
          <span key={id} className="contents">
            {id === current ? (
              <strong className="text-foreground" aria-current="page">{label}</strong>
            ) : (
              <Link to={href} className="hover:text-primary">{label}</Link>
            )}
            {index < EMBODIED_PATH.length - 1 ? <span aria-hidden>›</span> : null}
          </span>
        ))}
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">{question}</p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">{fixture}</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모</p>
          <Link to={parentHref} className="mt-1 block text-sm font-bold leading-6 hover:text-primary">
            {parentLabel} ↗
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4 lg:grid-cols-8" aria-label="시각 지능에서 로봇 행동까지의 학습 경로">
        {EMBODIED_PATH.map(([id, label, description, href], index) => (
          <Link
            key={id}
            to={href}
            aria-current={id === current ? "step" : undefined}
            className={`min-w-0 bg-background px-2 py-3 ${id === current ? "text-primary" : "text-muted-foreground"}`}
          >
            <span className="font-mono text-[9px]">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs">{label}</strong>
            <span className="mt-1 hidden text-[10px] leading-4 lg:block">{description}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function EmbodiedVisionMapReturn({
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
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 상위 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">상위 지도에 되돌려 놓기</p>
      <p className="mt-2 break-keep text-base font-bold leading-7">{title}</p>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">{detail}</p>
      <Link to={nextHref} className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
        {nextLabel} →
      </Link>
    </aside>
  );
}
