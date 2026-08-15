import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { FormalLanguageViz } from "./viz/ModernGrammarViz";

export default function GrammarConstrainedGenerationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="alphabet" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          문법을 배우기 전에, 문법이 다루는 물체부터 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Formal language</strong>는 어려운 규칙 이름부터 시작하지
            않습니다. 사용할 기호를 고르고, 기호를 순서대로 이어 한 문자열을
            만든 뒤, 그 문자열이 허용 집합에 들어가는지를 묻는 데서 시작합니다.
          </p>
        </div>
        <TermBreakdown
          title="한 줄씩 쌓는 formal language의 네 물체"
          items={[
            {
              term: "Symbol",
              description: "더 쪼개지 않고 하나로 취급하는 표시입니다.",
              example:
                "여는 괄호 [, 숫자 0, 닫는 괄호 ]를 각각 symbol로 둡니다.",
              boundary:
                "Model token이나 UTF-8 byte와 반드시 같은 단위는 아닙니다.",
            },
            {
              term: "Alphabet Σ",
              description:
                "이번 언어에서 사용할 수 있는 symbol의 유한 집합입니다.",
              example: "Σ={ [, ], 0, 1 }로 고정합니다.",
              boundary: "Alphabet은 순서가 있는 문장이 아니라 재료 목록입니다.",
            },
            {
              term: "String",
              description: "Alphabet의 symbol을 순서대로 이은 유한한 열입니다.",
              example:
                "[0]은 길이 3인 string이고, 빈 string ε도 따로 존재합니다.",
              boundary: "같은 symbol을 써도 순서가 달라지면 다른 string입니다.",
            },
            {
              term: "Language L",
              description: "판정 규칙을 통과한 string만 모은 집합입니다.",
              example:
                "[0]은 들어가고 ][는 제외되는 array language를 생각합니다.",
              boundary:
                "가능한 모든 string의 집합 Σ*와 특정 language L을 구분합니다.",
            },
          ]}
        />
        <FormalLanguageViz />
        <ContentBoundary article="grammar-constrained-generation" />
      </section>

      <section id="string-language" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Language는 문장 목록이 아니라 membership 질문입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Σ가 정해지면 Σ*는 그 symbol로 만들 수 있는 모든 유한 string입니다.
            우리가 원하는 language L은 그중 일부입니다. 따라서 parser의 첫
            질문은 “그럴듯한가?”가 아니라{" "}
            <strong>주어진 string이 L에 속하는가</strong>입니다.
          </p>
          <ul>
            <li>
              <code>[0]</code>: array 규칙에 맞으므로 accept합니다.
            </li>
            <li>
              <code>][</code>: 첫 symbol부터 닫으므로 reject합니다.
            </li>
            <li>
              <code>[01</code>: 끝까지 읽어도 열린 구조가 남아 reject합니다.
            </li>
          </ul>
        </div>
      </section>

      <section id="derivation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Production은 start symbol을 실제 string으로 전개합니다
        </h2>
        <TermBreakdown
          title="Grammar 안에서 역할이 다른 세 이름"
          items={[
            {
              term: "Terminal",
              description: "전개가 끝난 출력에 그대로 남는 symbol입니다.",
              example: "[, ], 0, 1이 terminal입니다.",
            },
            {
              term: "Nonterminal",
              description: "아직 다른 rule로 바뀌어야 하는 중간 이름입니다.",
              example: "value와 array를 nonterminal로 둡니다.",
            },
            {
              term: "Production",
              description:
                "한 nonterminal을 어떤 symbol 열로 바꿀지 정한 규칙입니다.",
              example: "array → [ value ]와 value → 0을 차례로 적용합니다.",
              boundary:
                "Rule을 적었다고 입력의 의미나 business policy가 맞아지지는 않습니다.",
            },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            예를 들어 <code>S ⇒ array ⇒ [ value ] ⇒ [ 0 ]</code>처럼 start
            symbol에서 terminal만 남을 때까지 rule을 적용한 순서가
            <strong> derivation</strong>입니다. 이 한 단계가 있어야
            CFG·parser·token mask가 무엇을 보존하려는지 뒤에서 이해할 수
            있습니다.
          </p>
        </div>
      </section>

      <section id="next" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          이제 “무한히 깊은 중첩을 무엇으로 기억하나”를 묻습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            여기까지는 언어의 재료와 생성 규칙만 정의했습니다. 다음 글에서는
            finite automaton이 어디서 막히고, CFG의 recursion을 PDA stack이
            어떻게 따라가는지 괄호 하나씩 확인합니다.
          </p>
          <p>
            <a href="/ai/cfg-pushdown-automata">
              CFG와 pushdown automata로 이동 →
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
