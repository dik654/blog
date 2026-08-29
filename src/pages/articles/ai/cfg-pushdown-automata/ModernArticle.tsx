import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { PushdownStackViz } from "../grammar-constrained-generation/viz/ModernGrammarViz";

export default function CfgPushdownAutomataArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="finite-memory" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Finite state는 패턴을 기억하지만 무한한 깊이는 세지 못합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Finite automaton</strong>은 현재 상태를 유한한 후보 중
            하나로 보관합니다. 숫자 형식이나 고정 keyword에는 잘 맞지만, 열린
            괄호가 몇 겹인지 상한이 없는 입력을 정확히 구분하려면 별도 memory가
            필요합니다.
          </p>
        </div>
        <TermBreakdown
          title="중첩을 이해하는 데 필요한 세 물체"
          items={[
            {
              term: "Control state",
              description:
                "지금 어떤 규칙 위치에 있는지를 나타내는 유한한 번호입니다.",
              example: "숫자를 읽는 중, comma를 기다리는 중 같은 상태입니다.",
            },
            {
              term: "Recursive production",
              description:
                "Rule이 자기 자신을 다시 포함해 임의 깊이 구조를 표현합니다.",
              example: "value → array이고 array 안에 다시 value가 옵니다.",
              boundary:
                "Recursion은 문법의 표현이고 실제 runtime 자료구조와 동일한 말은 아닙니다.",
            },
            {
              term: "Stack",
              description:
                "나중에 역순으로 꺼낼 항목을 LIFO로 쌓는 memory입니다.",
              example: "여는 [를 push하고 대응하는 ]에서 pop합니다.",
              boundary:
                "실제 LR·Earley parser가 문자 그대로 이 단순 stack 하나만 쓴다는 뜻은 아닙니다.",
            },
          ]}
        />
        <PushdownStackViz />
        <ContentBoundary article="cfg-pushdown-automata" />
      </section>

      <section id="regular-cfg-hierarchy" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          정규언어는 finite automaton이 인식하는 만큼만 표현하고 CFG보다 좁습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>정규언어(regular language)</strong>는 finite automaton이
            정확히 인식할 수 있는 언어 class이고, 그 언어를 기술하는 표준
            표기가 <strong>regular expression</strong>입니다. 앞서 본 finite
            state의 한계, 즉 임의 깊이 중첩을 세지 못한다는 한계가 그대로
            정규언어의 표현 한계입니다.
          </p>
          <p>
            Chomsky hierarchy에서 정규언어는 CFG가 만드는 언어의 진부분집합
            한 단계 아래입니다. <code>a*b*</code> 같은 regular expression은
            유한 상태만으로 판정되지만, 짝을 맞춰야 하는 <code>(()())</code>
            같은 언어는 상한 없는 깊이를 세야 해 정규표현식으로 쓸 수 없고
            <code>S → ( S ) | ε</code> 같은 CFG 재귀가 필요합니다.
          </p>
        </div>
      </section>

      <section id="cfg-recursion" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          CFG는 한 nonterminal을 문맥과 무관하게 전개합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Context-free grammar</strong>에서는 production 왼쪽에 하나의
            nonterminal이 옵니다. <code>value → array</code>,
            <code>array → [ values ]</code>,{" "}
            <code>values → value , values</code>처럼 rule이 서로 되돌아오면
            깊이를 미리 고정하지 않고 nested array를 표현할 수 있습니다.
          </p>
        </div>
      </section>

      <section id="pda-stack" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          PDA는 control state에 stack을 붙여 열린 구조를 기억합니다
        </h2>
        <ExplainedFormula
          question="괄호 하나를 읽을 때 아직 닫아야 할 깊이를 왜 더하거나 빼나요?"
          idea={
            <p>
              여는 괄호는 미래에 닫아야 할 의무 하나를 만들고, 닫는 괄호는 가장
              최근 의무 하나를 해소합니다.
            </p>
          }
          formula={String.raw`d_t=d_{t-1}+1\;(x_t=\texttt{(}),\quad d_t=d_{t-1}-1\;(x_t=\texttt{)})`}
          annotatedFormula={String.raw`\begin{aligned}x_t=\texttt{(}:\quad d_t&=\underbrace{d_{t-1}}_{\text{기존 열린 수}}+\underbrace{1}_{\text{닫을 의무 추가}}\\x_t=\texttt{)}:\quad d_t&=\underbrace{d_{t-1}}_{\text{기존 열린 수}}-\underbrace{1}_{\text{최근 의무 해소}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`d_{t-1}+1`,
              annotation: ["여는 항목을 만나", "미해결 nesting 하나 추가"],
            },
            {
              expression: String.raw`d_{t-1}-1`,
              annotation: ["닫는 항목을 만나", "가장 최근 nesting 하나 해소"],
            },
          ]}
          terms={[
            {
              symbol: "d_t",
              name: "Open depth",
              description:
                "t번째 symbol까지 읽은 뒤 아직 닫히지 않은 괄호 수입니다.",
            },
            {
              symbol: "x_t",
              name: "Current symbol",
              description:
                "이번 step에서 parser가 소비하는 여는 또는 닫는 괄호입니다.",
            },
          ]}
          assumptions={[
            "한 종류의 괄호만 세는 최소 예입니다.",
            "닫기 전에 d_{t-1}>0이어야 합니다.",
            "입력이 끝났을 때 d_T=0이어야 accept합니다.",
          ]}
          interpretation="입력 (()())은 깊이가 0→1→2→1→2→1→0이 됩니다. 중간에 음수가 되거나 마지막에 양수로 남으면 잘못된 string입니다."
        />
        <p className="text-sm leading-7 text-muted-foreground">
          위 예는 괄호 깊이 하나만 세지만, 실제로 임의의 CFG를 PDA로 옮기는
          construction은 표준 절차가 있습니다 — stack에 정수 대신 grammar
          symbol 자체를 쌓습니다.
        </p>
        <AlgorithmBlock
          title="CFG → PDA construction (표준 절차)"
          input={[
            "CFG G (nonterminal마다 하나 이상의 production A → α)",
            "입력 문자열 w (terminal symbol의 나열)",
          ]}
          steps={[
            {
              code: "stack = [S]",
              note: "먼저 start symbol S 하나만 stack에 올립니다.",
            },
            {
              code: "while stack:",
              note: "Stack이 빌 때까지 top을 보고 아래 두 규칙 중 하나를 반복 적용합니다.",
            },
            {
              code: "  if top(stack) is nonterminal A: choose A → α, pop A, push reverse(α)",
              note: "A를 만들 수 있는 production 중 하나를 골라 A를 지우고, α를 왼쪽 symbol이 stack 맨 위에 오도록 뒤집어서 올립니다(예: array → [ values ]면 ], values, [ 순서로 push).",
            },
            {
              code: "  if top(stack) is terminal a: if next(w) == a: pop a, consume a from w; else reject",
              note: "Terminal이 top이면 input의 다음 글자와 정확히 같아야만 소비합니다 — 다르면 그 production 선택이 잘못된 것이라 실패합니다.",
            },
          ]}
          output="stack과 w가 동시에 비면 accept, 아니면 reject"
          repeatUntil="Stack이 비거나 더 이상 적용할 규칙이 없을 때까지 반복합니다."
        />
        <p className="text-sm leading-7 text-muted-foreground">
          Nonterminal 선택(어떤 production을 고를지)이 여러 개일 수 있어 이
          construction은 원래 비결정적(nondeterministic)입니다. 실제
          top-down parser는 다음 몇 토큰을 미리 보는 lookahead로 이 선택을
          결정적으로 좁히거나, 여러 선택지를 동시에 추적합니다 — 다음
          section의 grammar-constrained decoding이 이 확장에 해당합니다.
        </p>
      </section>

      <section id="lr-glr-parsing" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          LR parsing은 stack 하나로, GLR parsing은 여러 stack으로 PDA를
          구현합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            PDA는 다음 production을 어떻게 고를지 규정하지 않는 이론
            모델입니다. <strong>LR parsing</strong>은 몇 토큰의 lookahead와
            parsing table로 다음 action(shift 또는 reduce)을 결정적으로 골라
            stack을 하나만 유지합니다.
          </p>
          <p>
            문법이 모호해 같은 lookahead에서 다음 action이 둘 이상이면 LR
            table은 충돌합니다. <strong>GLR parsing</strong>은 이 지점에서
            바로 reject하는 대신 stack을 여러 개로 fork해 가능한 해석을 모두
            병렬로 진행하다가, 뒤의 입력과 모순되는 branch만 버립니다.
          </p>
          <p>
            예를 들어 충돌이 2개 나면 GLR은 stack을 2개로 늘려 각각
            shift·reduce를 이어가고, 몇 토큰 뒤 하나만 유효하게 남으면 그
            stack만 채택합니다. 여러 stack을 동시에 유지하는 만큼 LR보다
            메모리·시간 비용이 커서, 충돌이 드문 대부분의 프로그래밍 언어
            문법에는 LR 계열이 더 흔히 쓰입니다.
          </p>
        </div>
      </section>

      <section id="implementation-boundary" className="scroll-mt-20">
        <span id="parser-bridge" className="scroll-mt-20" />
        <h2 className="mb-5 text-2xl font-bold">
          PDA는 이유를 설명하고, parser 구현은 더 많은 상태를 소유합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            JSON parser는 괄호 깊이뿐 아니라 string escape, number 형식, comma
            위치와 object key도 추적합니다. LR·Earley·specialized automata와
            cache를 조합할 수 있으므로 “CFG를 쓰면 구현은 단순 PDA 하나”라고
            결론내리지 않습니다.
          </p>
          <p>
            LR·GLR 엔진이 현재 state·stack·전이 table을 들고 있는 부분을
            <strong>parser state machine</strong>이라 부릅니다. 다음 글의
            tree-sitter incremental parsing은 편집할 때마다 이 상태 기계를
            처음부터 다시 돌리지 않고, 바뀐 범위만 다시 parsing해
            <strong>incremental syntax tree</strong>를 갱신합니다.
          </p>
          <p>
            <a href="/ai/incremental-parsing-tree-sitter">
              Tree-sitter incremental parsing으로 이동 →
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
