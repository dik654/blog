import { Link } from "react-router-dom";

const FOUNDATION_PATH = [
  ["tokenizer", "문자", "문자열을 model ID로 바꿈", "/cs/ai/tokenizer"],
  ["sequence", "순서", "state로 앞의 정보를 운반", "/cs/ai/rnn"],
  ["attention", "조회", "필요한 위치를 직접 읽음", "/cs/ai/attention-theory"],
  ["transformer", "변환", "token·feature 축을 번갈아 섞음", "/cs/ai/transformer-architecture"],
  ["bert", "이해", "입력 전체를 양방향으로 표현", "/cs/ai/bert"],
] as const;

const BERT_PATH = [
  ["bert", "가시성", "어느 token을 읽는가", "/cs/ai/bert"],
  ["packing", "입력", "네 tensor를 맞춤", "/cs/ai/bert-input-packing"],
  ["mlm", "복원", "가린 원 token을 맞힘", "/cs/ai/bert-mlm-corruption"],
  ["objective", "비교", "label 단위를 바꿈", "/cs/ai/bert-pretraining-objectives"],
  ["heads", "전이", "task 답의 축을 붙임", "/cs/ai/bert-task-heads"],
] as const;

type FoundationId = (typeof FOUNDATION_PATH)[number][0];
type BertId = (typeof BERT_PATH)[number][0];
type CurrentId = FoundationId | BertId;

function FoundationStep({
  id,
  label,
  description,
  href,
  current,
}: {
  id: FoundationId;
  label: string;
  description: string;
  href: string;
  current: CurrentId;
}) {
  const active = current === id || (id === "bert" && BERT_PATH.some(([step]) => step === current));
  return (
    <Link
      to={href}
      aria-current={active ? "step" : undefined}
      className={`min-w-0 bg-background px-2 py-3 ${active ? "text-primary" : "text-muted-foreground"}`}
    >
      <strong className="block break-keep text-xs">{label}</strong>
      <span className="mt-1 hidden text-[10px] leading-4 lg:block">{description}</span>
    </Link>
  );
}

export function NlpFoundationLocator({
  current,
  question,
  fixture,
  parentHref,
  parentLabel,
  secondaryHref,
  secondaryLabel,
}: {
  current: CurrentId;
  question: string;
  fixture: string;
  parentHref: string;
  parentLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  const inBertSeries = BERT_PATH.some(([id]) => id === current);
  return (
    <aside className="not-prose mb-8 border-y border-border py-5" aria-label="자연어 처리 학습 지도에서 현재 글의 위치">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground" aria-label="자연어 처리 글 위치">
        {FOUNDATION_PATH.map(([id, label, , href], index) => {
          const active = current === id || (id === "bert" && inBertSeries);
          return (
            <span key={id} className="contents">
              {active ? <strong className="text-foreground" aria-current="page">{label}</strong> : <Link to={href} className="hover:text-primary">{label}</Link>}
              {index < FOUNDATION_PATH.length - 1 ? <span aria-hidden>›</span> : null}
            </span>
          );
        })}
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
          {secondaryHref && secondaryLabel ? <Link to={secondaryHref} className="mt-2 block text-xs leading-5 text-muted-foreground hover:text-primary">{secondaryLabel} ↗</Link> : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-px bg-border p-px sm:grid-cols-5" aria-label="자연어 처리 기초 경로">
        {FOUNDATION_PATH.map(([id, label, description, href]) => (
          <FoundationStep key={id} id={id} label={label} description={description} href={href} current={current} />
        ))}
      </div>

      {inBertSeries ? (
        <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5" aria-label="BERT 세부 경로">
          {BERT_PATH.map(([id, label, description, href], index) => (
            <Link
              to={href}
              key={id}
              aria-current={id === current ? "step" : undefined}
              className={`min-w-0 bg-background px-2 py-3 ${id === current ? "text-primary" : "text-muted-foreground"}`}
            >
              <span className="font-mono text-[9px]">0{index + 1}</span>
              <strong className="mt-1 block break-keep text-xs">{label}</strong>
              <span className="mt-1 hidden text-[10px] leading-4 lg:block">{description}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

export function NlpMapReturn({
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
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 자연어 처리 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">자연어 처리 지도에 되돌려 놓기</p>
      <p className="mt-2 break-keep text-base font-bold leading-7">{title}</p>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">{detail}</p>
      <Link to={nextHref} className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">{nextLabel} →</Link>
    </aside>
  );
}
