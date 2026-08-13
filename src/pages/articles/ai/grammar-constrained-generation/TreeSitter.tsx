const rows = [
  [
    "입력",
    "이미 존재하는 source text",
    "지금까지 생성된 token prefix + logits",
  ],
  ["출력", "Concrete Syntax Tree", "다음 step의 허용 token bitmask"],
  ["주요 목표", "편집 중 빠른 재파싱·오류 복구", "유효한 구조만 sampling"],
  [
    "증분성",
    "이전 syntax tree의 바뀌지 않은 부분 재사용",
    "token마다 matcher state 갱신",
  ],
  [
    "대표 사용",
    "highlight·folding·navigation·분석",
    "JSON·tool call·DSL·Code Mode 출력",
  ],
] as const;

export default function TreeSitter() {
  return (
    <section id="tree-sitter" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Tree-sitter와 문법 제약 decoder는 무엇이 다른가
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Tree-sitter는 parser generator이자 incremental parsing library다.
          source file에서 concrete syntax tree를 만들고, edit가 생기면 이전
          tree를 이용해 바뀐 부분을 효율적으로 갱신한다. 오류가 있는 편집 중
          코드에서도 쓸 수 있는 tree를 돌려주는 것이 중요한 목표다.
        </p>

        <div data-viz="tree-sitter-decoder-ledger" className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
          <div className="hidden grid-cols-[7rem_1fr_1fr] gap-4 border-b bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>경계</span><span>Tree-sitter</span><span>문법 제약 decoder</span>
          </div>
          <div className="divide-y divide-border/70">
            {rows.map(([axis, treeSitter, decoder]) => (
              <article key={axis} className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[7rem_1fr_1fr] md:gap-4">
                <div><span className="text-[11px] font-semibold text-muted-foreground md:hidden">경계</span><p className="text-sm font-semibold">{axis}</p></div>
                <div className="min-w-0"><span className="text-[11px] font-semibold text-muted-foreground md:hidden">Tree-sitter</span><p className="break-words text-sm">{treeSitter}</p></div>
                <div className="min-w-0"><span className="text-[11px] font-semibold text-muted-foreground md:hidden">문법 제약 decoder</span><p className="break-words text-sm text-muted-foreground">{decoder}</p></div>
              </article>
            ))}
          </div>
        </div>

        <p className="leading-7">
          둘은 grammar와 parser state라는 뿌리를 공유하지만 교체 관계가 아니다.
          Tree-sitter는 생성된 코드를 분석하거나 editor feedback을 만드는 쪽에,
          XGrammar 같은 엔진은 생성 중 불가능한 token을 sampling 후보에서 지우는
          쪽에 놓인다. Code Mode에서는 decoder가 program의 외형을 제한하고,
          Tree-sitter·compiler·type checker가 완성된 program을 다시 분석하는
          식으로 함께 쓸 수 있다.
        </p>

        <div id="paper-tree-sitter" className="scroll-mt-24">
          <CitationBlock source="Tree-sitter official documentation" citeKey={1} href="https://tree-sitter.github.io/tree-sitter/">
            Tree-sitter는 concrete syntax tree와 incremental update·error-tolerant
            editing을 위한 parser system이다. LLM logits에 token mask를 적용하는
            decoder나 semantic type checker를 대신하지 않는다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
import { CitationBlock } from "@/components/ui/citation";
