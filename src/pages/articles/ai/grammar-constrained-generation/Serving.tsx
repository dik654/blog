const boundaries = [
  ["Prompt", "모델 분포가 원하는 구조와 의미를 미리 이해하도록 한다"],
  ["Grammar compiler", "schema·grammar를 tokenizer별 실행 상태로 바꾼다"],
  ["Matcher", "요청별 prefix 상태와 허용 token mask를 갱신한다"],
  ["Sampler", "mask 뒤의 logits에서 다음 token을 선택한다"],
  [
    "Validator / policy",
    "ID 존재 여부·권한·안전·business invariant를 검사한다",
  ],
] as const;

export default function Serving() {
  return (
    <section id="serving" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">서빙·에이전트 구현 경계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          structured generation은 decoder에 mask 하나를 붙이는 것으로 끝나지
          않는다. request마다 tool 목록과 schema가 달라질 수 있고, batch 안의
          sequence마다 parser state가 다르다. compile latency, tokenizer별
          cache, mask를 GPU sampling 경로에 적용하는 비용을 함께 관리해야 한다.
        </p>

        <div data-viz="structured-generation-serving-boundaries" className="not-prose my-6 space-y-2">
          {boundaries.map(([name, role], index) => (
            <div
              key={name}
              className="grid gap-1 rounded-lg border bg-card p-4 sm:grid-cols-[10rem_1fr]"
            >
              <div className="text-sm font-semibold">
                {index + 1}. {name}
              </div>
              <div className="text-xs leading-5 text-muted-foreground">
                {role}
              </div>
            </div>
          ))}
        </div>

        <h3 id="dynamic-schema-cache" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          동적 tool calling은 cache 단위를 바꾼다
        </h3>
        <p className="leading-7">
          고정 JSON 하나라면 compiled grammar 전체를 재사용하기 쉽다. 그러나
          agent request마다 허용 tool과 parameter schema가 달라지면 전체 문법
          cache hit가 떨어진다. XGrammar 2는 이 문제를 배경으로 tool·tag 단위
          구조 전환과 문법 하위 구조 재사용을 제안한다. 여기서 중요한 일반
          원리는 “항상 최신 엔진을 써야 한다”가 아니라,{" "}
          <strong>schema의 동적 범위와 cache 단위를 같이 설계해야 한다</strong>
          는 점이다.
        </p>
        <div id="paper-xgrammar2" className="scroll-mt-24">
          <CitationBlock source="XGrammar 2: Agentic Structured Generation" citeKey={3} href="https://arxiv.org/abs/2601.04426">
            요청마다 달라지는 tool/tag schema의 compile·mask 비용을 줄이기 위한
            dynamic structured-generation architecture와 cache reuse를 제안한다.
            논문의 engine·model·workload 결과가 모든 serving stack의 고정
            speedup을 뜻하지는 않는다.
          </CitationBlock>
        </div>

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          Code Mode와 결합할 때의 역할 분담
        </h3>
        <p className="leading-7">
          문법 제약은 program이 parse 가능한 외형을 갖게 한다. compiler와 type
          checker는 이름·type·control flow 오류를 찾고, sandbox는 권한과
          resource를 제한하며, verifier는 실행 결과를 판정한다. 각 층의 보장이
          겹치지 않도록 나누면 “문법이 맞으니 안전하다”는 잘못된 전제를 피할 수
          있다. 실제 program 실행 흐름은{" "}
          <a href="/ai/agent-code-mode">Code Mode 글</a>에서 이어진다.
        </p>
      </div>
    </section>
  );
}
import { CitationBlock } from "@/components/ui/citation";
