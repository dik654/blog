import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { TokenMaskViz } from "../grammar-constrained-generation/viz/ModernGrammarViz";

export default function GrammarTokenizerDecodingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="token-boundary" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Grammar의 다음 문자는 model의 다음 token과 다를 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Grammar가 문자 단위로 <code>4</code> 다음 <code>2</code>를 허용해도,
            tokenizer는 <code> 42{`}`}</code>를 하나의 token으로 가질 수
            있습니다. 그래서 decoder는 token의 첫 문자만 보는 대신 token 전체
            byte가 만드는 state transition을 검사해야 합니다.
          </p>
        </div>
        <TermBreakdown
          title="Mask를 만들기 전에 분리할 세 물체"
          items={[
            {
              term: "Grammar state s",
              description:
                "현재 prefix까지 소비한 뒤 이어서 허용되는 문법 위치입니다.",
              example: '{"age": 뒤에서 integer value를 기다립니다.',
            },
            {
              term: "Vocabulary token vᵢ",
              description:
                "Tokenizer vocabulary의 한 항목이며 여러 byte를 담을 수 있습니다.",
              example: "공백과 42와 닫는 괄호가 묶인 token도 가능합니다.",
              boundary:
                "Formal grammar symbol과 model token을 같은 단위로 두지 않습니다.",
            },
            {
              term: "Token bitmask",
              description:
                "각 vocabulary index가 현재 state에서 허용되는지 나타내는 0/1 배열입니다.",
              example: "[1,0,1,0]이면 0번과 2번 token만 sampling 후보입니다.",
            },
          ]}
        />
        <TokenMaskViz />
        <ContentBoundary article="grammar-tokenizer-decoding" />
      </section>

      <section id="tokenizer-compilation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Compilation은 grammar transition을 vocabulary 전체에 연결합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Compiler는 schema·EBNF·regex를 matcher가 실행할 구조로 만들고
            tokenizer metadata와 연결합니다. Token <code> 42{`}`}</code>를
            가정하면 space,
            <code>4</code>, <code>2</code>, 닫는 delimiter를 순서대로 소비했을
            때 모든 중간 state가 valid한지와 최종 state가 어디인지 계산합니다.
          </p>
          <p>
            Tokenizer revision, added token, byte fallback 또는 normalization이
            바뀌면 이 compilation 결과의 identity도 달라집니다.
          </p>
        </div>
      </section>

      <section id="token-mask" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          금지 logit을 −∞로 보내면 softmax 분자가 0이 됩니다
        </h2>
        <ExplainedFormula
          question="현재 grammar에서 금지된 token을 왜 절대로 뽑지 않게 되나요?"
          idea={
            <p>
              Matcher가 허용 index 집합을 만들고 집합 밖 logit을 −∞로 바꾼 뒤 남은 후보끼리 softmax를 다시 계산합니다.
            </p>
          }
          formula={String.raw`A(s)=\{i:\operatorname{valid}(s,v_i)\},\quad \ell'_i=\ell_i\;\text{or}\;-\infty,\quad p_i=e^{\ell'_i}/\sum_j e^{\ell'_j}`}
          annotatedFormula={String.raw`\begin{aligned}A(s)&=\underbrace{\{i:\operatorname{valid}(s,v_i)\}}_{\text{끝까지 유효한 token만 수집}}\\\ell'_i&=\begin{cases}\underbrace{\ell_i}_{\text{허용 점수는 유지}},&i\in A(s)\\\underbrace{-\infty}_{\text{금지 후보 제거}},&i\notin A(s)\end{cases}\\p_i&=\frac{\underbrace{e^{\ell'_i}}_{\text{점수를 양의 질량으로}}}{\underbrace{\sum_j e^{\ell'_j}}_{\text{남은 질량 합으로 나눔}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\{i:\operatorname{valid}(s,v_i)\}`,
              annotation: ["token 전체를 state에 넣어", "valid index만 모음"],
            },
            {
              expression: String.raw`\ell_i\mapsto-\infty`,
              annotation: [
                "금지 score의 exp를 0으로 만들어",
                "sampling 후보에서 제거",
              ],
            },
            {
              expression: String.raw`e^{\ell'_i}`,
              annotation: ["상대 logit을", "양의 probability mass로 변환"],
            },
            {
              expression: String.raw`\frac{e^{\ell'_i}}{\sum_j e^{\ell'_j}}`,
              annotation: ["남은 mass 합으로 나눠", "확률 합을 1로 정규화"],
            },
          ]}
          terms={[
            {
              symbol: "s",
              name: "Matcher state",
              description:
                "현재 generated prefix와 열린 grammar rule을 추적하는 요청별 상태입니다.",
            },
            {
              symbol: "v_i",
              name: "Vocabulary token",
              description:
                "Tokenizer vocabulary의 i번째 token이 담은 전체 byte sequence입니다.",
            },
            {
              symbol: "A(s)",
              name: "Allowed set",
              description:
                "State s에서 token 전체를 소비해도 valid prefix가 되는 index 집합입니다.",
            },
            {
              symbol: "\\ell_i",
              name: "Model logit",
              description:
                "Grammar mask 전에 model이 token i에 준 비정규화 점수입니다.",
            },
            {
              symbol: "p_i",
              name: "Masked probability",
              description:
                "허용 후보만 남겨 다시 정규화한 sampling 확률입니다.",
            },
          ]}
          assumptions={[
            "Grammar와 tokenizer byte semantics가 같은 revision으로 compile됐습니다.",
            "Mask는 top-k·top-p sampling보다 먼저 적용합니다.",
            "EOS·UTF-8·string escape와 empty allowed set을 matcher가 처리합니다.",
          ]}
          interpretation="금지 token은 e^(−∞)=0이므로 뽑히지 않습니다. 허용 후보의 상대 선호는 남지만, 선택한 숫자가 사실인지 또는 실행 권한이 있는지는 이 식이 보장하지 않습니다."
        />
        <p className="text-sm leading-7 text-muted-foreground">
          A(s)의 정의는 위 식으로 충분하지만 vocabulary가 수만~수십만 개인 현실에서는 매 decode step마다 모든 token을 grammar로 하나씩 다시 시뮬레이션하면
          너무 느립니다. 실제 구현(xgrammar·llguidance 등)은 token을 독립적으로 검사하지 않고 공유 prefix를 trie로 묶어 한 번에 가지치기합니다.
        </p>
        <AlgorithmBlock
          title="A(s) 계산 — vocabulary trie를 grammar와 함께 걷기"
          input={[
            "Matcher state s",
            "Vocabulary trie T (byte 단위로 공유 prefix를 묶은 tree)",
          ]}
          steps={[
            {
              code: "stack = [(T.root, s)], A = {}",
              note: "Trie root와 현재 grammar state의 쌍에서 DFS를 시작합니다.",
            },
            {
              code: "while stack: node, cur_s = stack.pop()",
              note: "매 token을 독립적으로 검사하지 않고, 이미 공유된 prefix는 한 번만 처리합니다.",
            },
            {
              code: "  if node.is_token_end: A.add(node.token_id)",
              note: "지금까지의 경로가 실제 vocabulary token 하나와 정확히 일치하면 허용 집합에 넣습니다.",
            },
            {
              code: "  for byte, child in node.children:",
              note: "현재 trie node에서 뻗어나가는 다음 byte들을 순회합니다.",
            },
            {
              code: "    if grammar.can_advance(cur_s, byte): stack.push((child, grammar.advance(cur_s, byte)))",
              note: "Grammar가 이 byte를 허용할 때만 그 subtree로 내려갑니다 — 허용되지 않으면 그 아래 모든 token을 한 번에 pruning합니다.",
            },
          ]}
          output="허용 index 집합 A(s)"
          repeatUntil="Stack이 빌 때까지 반복합니다(한 decode step당 한 번 계산)."
        />
        <p className="text-sm leading-7 text-muted-foreground">
          같은 grammar state s가 여러 request나 여러 step에서 반복되면(예:
          JSON의 <code>{`"`}</code> 다음처럼 흔한 state), 이미 계산한 A(s)를
          state별로 caching해 재사용하는 것이 실제 serving 구현의 핵심
          최적화입니다 — 다음 section의 caching·state 재사용과 이어집니다.
        </p>
      </section>

      <section id="matcher-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          선택한 token을 accept해야 다음 mask가 달라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sampler가 token을 고른 뒤 matcher가 그 token을 소비해 state를 갱신합니다. Batch를 공유해도 prefix가 다르면 state와 mask가
            달라집니다. Empty allowed set은 retry·fallback·request rejection 중 하나로 명시적으로 처리해야 합니다.
          </p>
        </div>
        <div
          id="paper-xgrammar-decoding"
          className="not-prose mt-8 scroll-mt-24"
        >
          <CitationBlock
            source="XGrammar — Constrained Decoding"
            citeKey={1}
            href="https://xgrammar.mlc.ai/docs/start/constrained_decoding.html"
          >
            Grammar compile, stateful matcher, token bitmask와 accept 흐름을
            설명하는 공식 문서입니다. Mask가 schema 밖의 사실성·권한·안전까지
            검증한다는 근거는 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
