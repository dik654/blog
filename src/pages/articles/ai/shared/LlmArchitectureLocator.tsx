import { Link } from "react-router-dom";

const ARCHITECTURE_PATH = [
  ["sampling", "출력", "분포에서 다음 token을 선택", "/cs/ai/llm-sampling-strategies"],
  ["yarn", "위치", "학습 범위 밖의 위치 회전을 조정", "/cs/ai/yarn-rope-extension"],
  ["mla", "압축", "token별 KV를 latent로 압축", "/cs/ai/multi-head-latent-attention-mechanics"],
  ["linear", "상태", "과거 기록을 고정 크기 상태로 변환", "/cs/ai/linear-attention-and-state-space-models"],
  ["fast", "쓰기", "읽은 값과 목표의 차이를 상태에 기록", "/cs/ai/fast-weight-memory-and-chunkwise-recurrence"],
  ["differential", "차분", "두 attention 분포의 공통 잡음을 제거", "/cs/ai/differential-attention"],
  ["sparse", "희소", "window·global·block 연결만 선택", "/cs/ai/sparse-windowed-attention-patterns"],
  ["residual", "전달", "층 사이 residual stream을 확장·혼합", "/cs/ai/hyper-connections-residual-streams"],
  ["moe", "전문가", "token마다 일부 expert만 활성화", "/cs/ai/mixture-of-experts"],
  ["routing", "균형", "token을 expert로 보내고 부하를 조절", "/cs/ai/moe-routing-and-load-balancing"],
] as const;

type ArchitectureId = (typeof ARCHITECTURE_PATH)[number][0];

export function LlmArchitectureLocator({
  current,
  question,
  fixture,
  parentHref,
  parentLabel,
}: {
  current: ArchitectureId;
  question: string;
  fixture: string;
  parentHref: string;
  parentLabel: string;
}) {
  return (
    <aside className="not-prose mb-8 border-y border-border py-5" aria-label="LLM 추론과 구조 지도">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground" aria-label="현재 글의 위치">
        {ARCHITECTURE_PATH.map(([id, label, , href], index) => (
          <span key={id} className="contents">
            {id === current ? <strong className="text-foreground" aria-current="page">{label}</strong> : <Link to={href} className="hover:text-primary">{label}</Link>}
            {index < ARCHITECTURE_PATH.length - 1 ? <span aria-hidden>›</span> : null}
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
          <Link to={parentHref} className="mt-1 block text-sm font-bold leading-6 hover:text-primary">{parentLabel} ↗</Link>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5" aria-label="LLM 추론과 구조 학습 경로">
        {ARCHITECTURE_PATH.map(([id, label, description, href], index) => (
          <Link key={id} to={href} aria-current={id === current ? "step" : undefined} className={`min-w-0 bg-background px-2 py-3 ${id === current ? "text-primary" : "text-muted-foreground"}`}>
            <span className="font-mono text-[9px]">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs">{label}</strong>
            <span className="mt-1 hidden text-[10px] leading-4 lg:block">{description}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function LlmArchitectureMapReturn({ title, detail, nextHref, nextLabel }: { title: string; detail: string; nextHref: string; nextLabel: string }) {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 LLM 추론과 구조 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">LLM 추론과 구조 지도에 되돌려 놓기</p>
      <p className="mt-2 break-keep text-base font-bold leading-7">{title}</p>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">{detail}</p>
      <Link to={nextHref} className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">{nextLabel} →</Link>
    </aside>
  );
}
