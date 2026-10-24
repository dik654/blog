import { Link } from "react-router-dom";

const STRUCTURED_GENERATION_PATH = [
  {
    id: "formal",
    label: "언어",
    title: "기호 → 허용 문자열",
    href: "/cs/ai/grammar-constrained-generation",
    parentHref: "/cs/ai/llm-sampling-strategies#logits-to-probability",
    parentLabel: "Logit에서 다음 token을 고르는 과정",
    question: "출력 형식을 강제하려면 먼저 무엇을 허용된 문자열이라고 정의해야 할까요?",
    closure: "Alphabet·string·language와 production을 구분해야 생성 중 허용 후보를 계산할 기준이 생깁니다.",
  },
  {
    id: "stack",
    label: "기억",
    title: "CFG → PDA stack",
    href: "/cs/ai/cfg-pushdown-automata",
    parentHref: "/cs/ai/grammar-constrained-generation#derivation",
    parentLabel: "Production으로 문자열을 전개하는 규칙",
    question: "괄호가 몇 겹 열렸는지 상한 없이 기억하려면 finite state에 무엇을 더해야 할까요?",
    closure: "CFG는 재귀로 중첩을 표현하고 PDA는 열린 구조를 LIFO stack에 쌓아 입력을 따라갑니다.",
  },
  {
    id: "token-mask",
    label: "제약",
    title: "Grammar → token mask",
    href: "/cs/ai/grammar-tokenizer-decoding",
    parentHref: "/cs/ai/cfg-pushdown-automata#pda-stack",
    parentLabel: "현재 prefix를 기억하는 parser state와 stack",
    question: "문자 단위 grammar를 여러 byte가 묶인 model token의 허용 목록으로 어떻게 바꿀까요?",
    closure: "Grammar와 tokenizer를 함께 compile하고 sequence별 matcher state에서 token bitmask를 만들어 logit에 적용합니다.",
  },
  {
    id: "parser",
    label: "분석",
    title: "Source edit → syntax tree",
    href: "/cs/ai/incremental-parsing-tree-sitter",
    parentHref: "/cs/ai/cfg-pushdown-automata#implementation-boundary",
    parentLabel: "문법을 실행하는 parser state machine",
    question: "이미 존재하는 source 한 부분이 바뀌었을 때 전체를 다시 읽지 않고 tree를 어떻게 갱신할까요?",
    closure: "Tree-sitter는 edit 범위를 old tree에 반영한 뒤 바뀌지 않은 subtree를 재사용해 새 concrete syntax tree를 만듭니다.",
  },
  {
    id: "serving",
    label: "서빙",
    title: "Schema → 실행 승인",
    href: "/cs/ai/structured-generation-serving",
    parentHref: "/cs/ai/grammar-tokenizer-decoding#matcher-boundary",
    parentLabel: "Sequence별 matcher state와 token mask",
    question: "요청마다 schema와 prefix가 다를 때 무엇을 공유하고 무엇을 분리해야 할까요?",
    closure: "Compiled grammar는 정확한 identity로 공유하되 matcher state와 mask는 sequence별로 두고, syntax 뒤의 권한·사실성은 별도 validator가 검사합니다.",
  },
] as const;

export type StructuredGenerationNodeId =
  (typeof STRUCTURED_GENERATION_PATH)[number]["id"];

function StageLink({
  id,
  current,
  label,
  title,
  href,
}: {
  id: StructuredGenerationNodeId;
  current: StructuredGenerationNodeId;
  label: string;
  title: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      aria-current={id === current ? "step" : undefined}
      className={`flex min-h-9 flex-wrap items-baseline gap-x-2 border-l-2 py-1.5 pl-3 pr-2 ${
        id === current
          ? "border-primary text-foreground"
          : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
      }`}
    >
      <span className="text-[9px] font-bold text-primary">{label}</span>
      <strong className="break-keep text-[11px] leading-4">{title}</strong>
    </Link>
  );
}

export function StructuredGenerationLocator({
  current,
}: {
  current: StructuredGenerationNodeId;
}) {
  const node = STRUCTURED_GENERATION_PATH.find((candidate) => candidate.id === current)!;
  const currentIndex = STRUCTURED_GENERATION_PATH.findIndex(
    (candidate) => candidate.id === current,
  );

  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="구조화 생성 학습 지도에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai/transformer-architecture" className="hover:text-primary">
          Transformer
        </Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/llm-sampling-strategies" className="hover:text-primary">
          다음 token 선택
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">
          {node.label}
        </strong>
      </nav>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="min-w-0">
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">
            개념
          </span>
          <p className="mt-2 max-w-3xl break-keep text-sm font-bold leading-6 sm:text-base sm:leading-7">
            {node.question}
          </p>
          <p className="mt-1 max-w-3xl text-[11px] leading-5 text-muted-foreground sm:text-xs sm:leading-6">
            {node.closure}
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모</p>
          <Link
            to={node.parentHref}
            className="mt-0.5 block break-keep text-xs font-bold leading-5 hover:text-primary sm:text-sm sm:leading-6"
          >
            {node.parentLabel} ↗
          </Link>
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3" aria-label="구조화 생성의 두 구현 경로">
        <StageLink {...STRUCTURED_GENERATION_PATH[0]} current={current} />
        <div className="ml-3 border-l border-border pl-3">
          <StageLink {...STRUCTURED_GENERATION_PATH[1]} current={current} />
          <div className="mt-1 grid grid-cols-2 gap-2 sm:gap-4">
            <div>
              <p className="mb-1 pl-3 text-[9px] font-bold leading-4 text-muted-foreground">생성 후보 제한</p>
              <StageLink {...STRUCTURED_GENERATION_PATH[2]} current={current} />
              <StageLink {...STRUCTURED_GENERATION_PATH[4]} current={current} />
            </div>
            <div>
              <p className="mb-1 pl-3 text-[9px] font-bold leading-4 text-muted-foreground">작성 결과 분석</p>
              <StageLink {...STRUCTURED_GENERATION_PATH[3]} current={current} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-1 text-[11px] leading-4 sm:text-xs sm:leading-5">
        {currentIndex > 0 ? (
          <Link to={STRUCTURED_GENERATION_PATH[currentIndex - 1].href} className="border-b border-border py-2 hover:border-primary hover:text-primary">
            <span className="block text-[10px] text-muted-foreground">← 이전</span>
            <strong className="break-keep">{STRUCTURED_GENERATION_PATH[currentIndex - 1].title}</strong>
          </Link>
        ) : <span aria-hidden />}
        {currentIndex < STRUCTURED_GENERATION_PATH.length - 1 ? (
          <Link to={STRUCTURED_GENERATION_PATH[currentIndex + 1].href} className="border-b border-border py-2 text-right hover:border-primary hover:text-primary">
            <span className="block text-[10px] text-muted-foreground">다음 →</span>
            <strong className="break-keep">{STRUCTURED_GENERATION_PATH[currentIndex + 1].title}</strong>
          </Link>
        ) : <span aria-hidden />}
      </div>
    </aside>
  );
}

export function StructuredGenerationMapReturn({
  current,
}: {
  current: StructuredGenerationNodeId;
}) {
  const node = STRUCTURED_GENERATION_PATH.find((candidate) => candidate.id === current)!;
  const currentIndex = STRUCTURED_GENERATION_PATH.findIndex(
    (candidate) => candidate.id === current,
  );
  const next = STRUCTURED_GENERATION_PATH[currentIndex + 1];

  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 구조화 생성 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        {node.closure}
      </p>
      <Link
        to={next?.href ?? node.parentHref}
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        {next ? `${next.title}로 이어가기` : `${node.parentLabel}로 돌아가기`} →
      </Link>
    </aside>
  );
}
