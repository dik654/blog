import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
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
      </section>

      <section id="implementation-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          PDA는 이유를 설명하고, parser 구현은 더 많은 상태를 소유합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            JSON parser는 괄호 깊이뿐 아니라 string escape, number 형식, comma
            위치와 object key도 추적합니다. LR·Earley·specialized automata와
            cache를 조합할 수 있으므로 “CFG를 쓰면 구현은 단순 PDA 하나”라고
            결론내리지 않습니다. 다음 글에서는 이미 존재하는 source를 갱신하는
            incremental parser라는 별도 문제를 다룹니다.
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
