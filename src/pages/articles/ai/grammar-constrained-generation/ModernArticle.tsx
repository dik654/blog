import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
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

      <section id="grammar-constrained-decoding" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Grammar가 다음 token 후보를 미리 걸러내면 decoding을 제약합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Derivation은 완성된 string이 유효한지 사후에 판정하는 절차였습니다.
            같은 규칙을 생성 시점으로 가져오면, 모델이 다음 symbol을 고르기
            직전에 지금까지 만든 prefix에서 grammar가 허용하는 후보만 남기고
            나머지를 배제할 수 있습니다. 이렇게 decoding 자체를 grammar로
            제약하는 방식을 <strong>grammar-constrained decoding</strong>이라고
            부릅니다.
          </p>
          <p>
            예를 들어 array grammar에서 <code>[0</code>까지 만든 상태라면 다음
            symbol 후보는 <code>]</code>나 <code>,</code> 정도로 줄어듭니다.
            나머지 alphabet symbol은 나와도 language 밖으로 나가므로 처음부터
            후보에서 지웁니다. 여러 문서는 같은 절차를{" "}
            <strong>constrained sampling</strong>이라고도 부르는데, grammar가
            아니라 sampling 단계 관점에서 부르는 이름일 뿐 매 step 허용 집합을
            좁힌다는 대상은 같습니다.
          </p>
        </div>
        <TermBreakdown
          title="Post-hoc 판정과 decoding-time 제약의 차이"
          items={[
            {
              term: "Grammar-Constrained Decoding",
              description:
                "모델이 다음 symbol을 고르기 전에 grammar가 허용하는 후보만 남기는 decoding 방식입니다.",
              example:
                "[0 뒤에는 ]와 ,만 후보로 남고 나머지 alphabet symbol은 제거합니다.",
              boundary:
                "어떤 state에서 어떤 symbol이 허용되는지 계산하는 방법은 다음 글에서 다룹니다.",
            },
            {
              term: "Constrained Sampling",
              description:
                "Grammar-constrained decoding을 sampling 단계 관점에서 부르는 같은 절차의 다른 이름입니다.",
              boundary:
                "허용 집합 안에서 고른다는 뜻이지 남은 후보의 확률 순서를 바꾸지는 않습니다.",
            },
          ]}
        />
      </section>

      <section id="structured-decoding-taxonomy" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          무엇으로 허용 집합을 적느냐에 따라 structured decoding이 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Grammar-constrained decoding은 "무엇을 허용 규칙으로 쓰는가"에
            따라 다시 나뉩니다. 이 선택지 전체를{" "}
            <strong>structured decoding</strong>이라고 부르는데, 실제로 자주
            쓰이는 세 형식은 표현할 수 있는 구조의 깊이가 서로 다릅니다.
          </p>
          <p>
            Regex-constrained decoding은 정규표현식으로 규칙을 적고 유한
            상태만으로 판정할 수 있어 빠르지만, 여는 괄호와 닫는 괄호 개수를
            맞추는 임의 깊이 중첩은 표현하지 못합니다. CFG-constrained
            decoding은 production rule을 그대로 써서 이 중첩을 recursion으로
            표현하고, JSON schema decoding은 type·required·enum 같은 schema
            명세를 CFG 규칙으로 컴파일해 같은 방식으로 강제합니다.
          </p>
        </div>
        <TermBreakdown
          title="구조를 적는 세 형식과 표현 한계"
          items={[
            {
              term: "Structured Decoding",
              description:
                "Grammar 형식과 무관하게 decoding 시점에 구조를 강제하는 접근을 통칭하는 이름입니다.",
              boundary:
                "Prompt에만 형식을 적어 두는 것과 달리 decoder 자체의 후보를 제한한다는 뜻입니다.",
            },
            {
              term: "Regex-Constrained Decoding",
              description:
                "정규표현식으로 허용 문자열을 적고 finite automaton만으로 검사합니다.",
              example: "전화번호나 날짜처럼 고정 길이 패턴에 적합합니다.",
              boundary:
                "괄호 짝처럼 임의 깊이로 열고 닫는 구조는 표현할 수 없습니다.",
            },
            {
              term: "CFG-Constrained Decoding",
              description:
                "Production rule의 recursion으로 임의 깊이 중첩을 그대로 검사합니다.",
              boundary: "Regex보다 표현력은 크지만 state 계산 비용도 늘어납니다.",
            },
            {
              term: "JSON Schema Decoding",
              description:
                "JSON Schema의 type·required·enum 명세를 CFG 규칙으로 컴파일해 강제합니다.",
              boundary:
                "Schema를 통과해도 값이 사실인지, 권한이 있는지는 별도로 검사해야 합니다.",
            },
          ]}
        />
      </section>

      <section id="xgrammar" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          XGrammar는 이 검사를 vocabulary 규모에서 감당하게 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Grammar-constrained decoding을 그대로 구현하면 매 step마다
            vocabulary 전체 token을 하나씩 grammar에 넣어 봐야 합니다. 수만
            개 token을 매 step 검사하면 decoding이 눈에 띄게 느려지고,
            XGrammar는 이 비용을 줄이기 위해 나온 constrained decoding
            엔진입니다.
          </p>
          <p>
            Token 대부분은 지금 grammar state와 무관하게 항상 같은 결과를
            내는 context-independent token이어서 미리 계산해 둘 수 있고,
            state에 따라 결과가 달라지는 소수 token만 매 step 다시 검사합니다.
            CFG recursion이 만드는 반복되는 stack 상태도 매번 복제하지 않고
            재사용해 pushdown automaton 비용을 줄입니다.
          </p>
        </div>
        <div id="paper-xgrammar" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            source="XGrammar: Flexible and Efficient Structured Generation Engine for Large Language Models"
            citeKey={1}
            href="https://arxiv.org/abs/2411.15100"
          >
            Context-independent token을 미리 분류해 두고 소수의
            context-dependent token만 매 step 검사하며, CFG stack 상태를
            복제 대신 재사용해 constrained decoding overhead를 줄이는 구조를
            제시합니다. 논문이 보고한 조건과 benchmark 범위 안에서의
            결과이고, 모든 tokenizer·engine 조합에서 같은 배율을 보장한다는
            뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="next" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          이제 “무한히 깊은 중첩을 무엇으로 기억하나”를 묻습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            여기까지 언어의 재료·생성 규칙과 grammar가 decoding을 제약하는
            방식까지 봤습니다. 다음 글에서는 finite automaton이 어디서
            막히고, CFG의 recursion을 PDA stack이 어떻게 따라가는지 괄호
            하나씩 확인합니다.
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
