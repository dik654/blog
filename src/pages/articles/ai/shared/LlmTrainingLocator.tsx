import { Link } from "react-router-dom";

const TRAINING_PATH = [
  ["stages", "단계", "무엇이 어느 상태를 바꾸는지 분리", "/cs/ai/llm-training-stages"],
  ["data", "데이터", "원문을 학습 corpus로 변환", "/cs/ai/llm-dataset-engineering-and-cleaning"],
  ["sft", "시연", "원하는 응답 token을 직접 학습", "/cs/ai/supervised-fine-tuning"],
  ["rlhf", "선호", "비교 feedback을 점수와 update로 연결", "/cs/ai/rlhf"],
  ["rl", "강화학습", "reward를 token 선택의 gradient로 변환", "/cs/ai/rl-foundations-for-llm-post-training"],
  ["reward", "채점", "결과·과정·형식의 보상을 설계", "/cs/ai/reward-design-for-verifiable-rl"],
  ["dpo", "쌍 비교", "chosen·rejected의 log-ratio를 학습", "/cs/ai/dpo"],
  ["cai", "원칙", "판단 기준으로 critique와 선호를 생성", "/cs/ai/constitutional-ai"],
  ["orpo", "통합", "SFT와 preference를 한 단계에서 조합", "/cs/ai/orpo"],
  ["kto", "단일 반응", "좋아요·싫어요를 기준점과 비교", "/cs/ai/kto"],
  ["synthetic", "순환", "생성·검수·학습 결과를 다음 데이터로 환류", "/cs/ai/synthetic-data-and-data-flywheel"],
] as const;

type TrainingId = (typeof TRAINING_PATH)[number][0];

export function LlmTrainingLocator({
  current,
  question,
  fixture,
  parentHref,
  parentLabel,
}: {
  current: TrainingId;
  question: string;
  fixture: string;
  parentHref: string;
  parentLabel: string;
}) {
  return (
    <aside className="not-prose mb-8 border-y border-border py-5" aria-label="LLM 학습과 post-training 지도">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground" aria-label="현재 글의 위치">
        {TRAINING_PATH.map(([id, label, , href], index) => (
          <span key={id} className="contents">
            {id === current ? <strong className="text-foreground" aria-current="page">{label}</strong> : <Link to={href} className="hover:text-primary">{label}</Link>}
            {index < TRAINING_PATH.length - 1 ? <span aria-hidden>›</span> : null}
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
      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4 lg:grid-cols-6" aria-label="LLM 학습과 post-training 경로">
        {TRAINING_PATH.map(([id, label, description, href], index) => (
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

export function LlmTrainingMapReturn({ title, detail, nextHref, nextLabel }: { title: string; detail: string; nextHref: string; nextLabel: string }) {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 LLM 학습 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">LLM 학습 지도에 되돌려 놓기</p>
      <p className="mt-2 break-keep text-base font-bold leading-7">{title}</p>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">{detail}</p>
      <Link to={nextHref} className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">{nextLabel} →</Link>
    </aside>
  );
}
