import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { StructuredServingViz } from "../grammar-constrained-generation/viz/ModernGrammarViz";

export default function StructuredGenerationServingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="request-schema" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Serving에서는 요청마다 “어떤 구조를 허용하는가”가 달라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            고정 JSON 하나를 만드는 demo와 달리 agent serving은 요청마다 tool
            목록, parameter schema와 policy가 달라집니다. 따라서 compiled
            grammar의 cache와 sequence별 matcher state를 분리해 관리해야 합니다.
          </p>
        </div>
        <TermBreakdown
          title="한 request를 실행 승인까지 보내는 네 장부"
          items={[
            {
              term: "Request schema",
              description:
                "이번 요청에서 허용할 tool name과 parameter shape입니다.",
              example: "weather(city)와 search(query)만 허용합니다.",
            },
            {
              term: "Compile key",
              description:
                "Compiled grammar를 안전하게 재사용할 identity입니다.",
              example:
                "schema hash + tokenizer revision + engine revision을 묶습니다.",
              boundary:
                "Schema text hash 하나만 같다고 byte/token transition까지 같지는 않습니다.",
            },
            {
              term: "Matcher state",
              description:
                "각 sequence가 현재 prefix에서 어디까지 왔는지 저장합니다.",
              example: "A는 tool name을, B는 amount value를 생성 중입니다.",
              boundary:
                "같은 batch의 request끼리 공유하는 전역 state가 아닙니다.",
            },
            {
              term: "Semantic validator",
              description:
                "형식이 맞은 output이 실제 세계·권한·정책에도 맞는지 검사합니다.",
              example:
                "user ID 존재, 잔액, authorization과 금액 limit을 확인합니다.",
            },
          ]}
        />
        <StructuredServingViz />
        <ContentBoundary article="structured-generation-serving" />
      </section>

      <section id="dynamic-schema-cache" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Dynamic schema는 cache hit보다 cache identity가 먼저입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Request A의 weather/search union과 B의 payment/refund union은 전체
            grammar가 다릅니다. 공통 string·number rule을 재사용할 수는 있지만
            stale schema나 다른 tokenizer에서 만든 transition table을 재사용하면
            금지 token을 허용할 수 있습니다. 먼저 identity를 정확히 만들고,
            그다음 compile latency와 reuse granularity를 최적화합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Compiled grammar cache hit를 언제 안전하다고 판정하나요?"
          idea={
            <p>
              Schema뿐 아니라 token 해석과 compiler 동작을 바꾸는 revision이
              모두 같을 때만 같은 artifact를 재사용합니다.
            </p>
          }
          formula={String.raw`c_S=I[S=S_c],\;c_T=I[T=T_c],\;c_E=I[E=E_c],\;H=c_S\land c_T\land c_E`}
          annotatedFormula={String.raw`\begin{aligned}c_S&=\underbrace{\mathbf 1[S=S_c]}_{\text{schema 확인}}\\c_T&=\underbrace{\mathbf 1[T=T_c]}_{\text{tokenizer 확인}}\\c_E&=\underbrace{\mathbf 1[E=E_c]}_{\text{engine 확인}}\\H&=\underbrace{c_S\land c_T\land c_E}_{\text{셋 모두 같아야 hit}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`S=S_c\land T=T_c\land E=E_c`,
              annotation: [
                "세 identity를 AND로 묶어",
                "하나라도 다르면 reuse 차단",
              ],
            },
            {
              expression: String.raw`\mathbf 1[\mathrm{condition}]`,
              annotation: ["전체 조건을", "hit 1 또는 miss 0으로 판정"],
            },
          ]}
          terms={[
            {
              symbol: "S",
              name: "Schema identity",
              description:
                "현재 request의 normalized tool/schema identity입니다.",
            },
            {
              symbol: "T",
              name: "Tokenizer identity",
              description:
                "Vocabulary·added token·normalization을 포함한 tokenizer revision입니다.",
            },
            {
              symbol: "E",
              name: "Engine identity",
              description:
                "Grammar compiler와 matcher semantics를 결정하는 engine revision입니다.",
            },
            {
              symbol: "H",
              name: "Cache-hit decision",
              description:
                "안전하게 artifact를 재사용하면 1, 다시 compile하면 0입니다.",
            },
            {
              symbol: "c_S,c_T,c_E",
              name: "Identity checks",
              description:
                "Schema·tokenizer·engine identity가 각각 같으면 1인 세 boolean입니다.",
            },
          ]}
          assumptions={[
            "Identity는 collision-resistant canonical representation으로 계산합니다.",
            "Compiled artifact의 feature flags와 target device도 필요하면 engine identity에 포함합니다.",
            "Cache hit 뒤에도 matcher state는 sequence별로 새로 시작합니다.",
          ]}
          interpretation="Schema만 같고 tokenizer가 다르면 H=0입니다. 조금 느리더라도 다시 compile해야 잘못된 token index를 허용하지 않습니다."
        />
      </section>

      <section id="sequence-state" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Artifact는 공유해도 matcher state는 sequence마다 따로 갑니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Compiled grammar는 여러 request가 읽기 전용으로 공유할 수 있습니다.
            그러나 generated prefix가 다르면 allowed set도 다르므로 matcher
            state와 mask buffer는 sequence별 lifetime을 가집니다. Continuous
            batching에서는 sequence가 끝나거나 취소될 때 이 state를 회수하는
            경계도 필요합니다.
          </p>
        </div>
      </section>

      <section id="semantic-policy" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Parse 성공 뒤에 semantic validator와 policy가 시작됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>{`{"user_id":123,"amount":999999}`}</code>는 schema를 통과할
            수 있습니다. 그래도 user 123의 존재, 잔액, 결제 권한, fraud rule과
            승인 한도를 별도로 확인해야 합니다. Syntax-valid를 executable과
            동일시하지 않는 것이 마지막 release gate입니다.
          </p>
        </div>
        <div id="paper-xgrammar2" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            source="XGrammar 2 — Agentic Structured Generation"
            citeKey={1}
            href="https://arxiv.org/abs/2601.04426"
          >
            동적인 tool·tag schema에서 compilation과 mask reuse를 다루는
            연구입니다. 특정 engine과 workload의 결과가 모든 serving stack의
            고정 speedup이나 semantic safety를 보장하지는 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
