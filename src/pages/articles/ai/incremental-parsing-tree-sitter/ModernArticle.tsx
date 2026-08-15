import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import { IncrementalParserViz } from "../grammar-constrained-generation/viz/ModernGrammarViz";

export default function IncrementalParsingTreeSitterArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="source-tree" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Tree-sitter는 이미 존재하는 source를 tree로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Incremental parser</strong>의 입력은 language-model logits가
            아니라 source text와 선택적인 old syntax tree입니다. 출력은 다음
            token mask가 아니라 source의 구조를 담은 새 tree입니다.
          </p>
        </div>
        <TermBreakdown
          title="Edit 한 번을 처리하는 세 물체"
          items={[
            {
              term: "Source text",
              description: "사용자가 편집한 실제 문자·byte sequence입니다.",
              example: "const x = {a: 1}라는 파일입니다.",
            },
            {
              term: "Concrete syntax tree",
              description:
                "Identifier뿐 아니라 punctuation과 source range를 보존한 구조입니다.",
              example: "object node 아래 pair·key·number node가 연결됩니다.",
              boundary:
                "Compiler의 semantic AST나 symbol table과 같은 물체는 아닙니다.",
            },
            {
              term: "Edit range",
              description:
                "어느 byte 구간이 어떻게 이동·교체됐는지 나타냅니다.",
              example: "1을 10으로 바꿔 end byte가 하나 늘어납니다.",
              boundary:
                "Range를 잘못 전달하면 unchanged subtree reuse가 틀릴 수 있습니다.",
            },
          ]}
        />
        <IncrementalParserViz />
        <ContentBoundary article="incremental-parsing-tree-sitter" />
      </section>

      <section id="incremental-update" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          바뀌지 않은 subtree를 재사용해 feedback을 빠르게 갱신합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            전체 file을 매 keystroke마다 처음부터 해석하는 대신 old tree에 edit
            위치를 반영하고 다시 parse합니다. Parser는 영향을 받지 않은
            subtree를 재사용할 수 있어 highlighting·folding·navigation 같은
            editor feedback을 짧은 주기로 갱신합니다.
          </p>
        </div>
      </section>

      <section id="error-recovery" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          편집 중 깨진 source에서도 쓸 수 있는 tree가 필요합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            사용자가 <code>{`{"a":`}</code>까지만 입력한 순간 source는 완성되지
            않았습니다. Incremental editor parser는 즉시 전부 reject하기보다
            error node와 부분 tree를 제공해야 합니다. 반대로 constrained
            decoder는 이런 prefix에서 다음에 올 수 없는 token을 금지하는 것이
            목적입니다.
          </p>
        </div>
      </section>

      <section id="decoder-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Parser와 decoder matcher는 문법을 공유해도 입출력이 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ul>
            <li>
              <strong>Tree-sitter:</strong> source + old tree → updated concrete
              syntax tree
            </li>
            <li>
              <strong>Decoder matcher:</strong> generated prefix + vocabulary →
              allowed-token bitmask
            </li>
          </ul>
          <p>
            Code Mode에서는 decoder가 output의 외형을 제한하고, Tree-sitter나
            compiler가 완성된 program을 다시 분석하는 식으로 함께 쓸 수
            있습니다.
          </p>
        </div>
        <div id="paper-tree-sitter" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            source="Tree-sitter official documentation"
            citeKey={1}
            href="https://tree-sitter.github.io/tree-sitter/"
          >
            Incremental parsing과 concrete syntax tree를 설명하는 공식
            문서입니다. Source 분석 기능이 language-model sampling mask나
            semantic authorization을 대신한다는 근거는 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
