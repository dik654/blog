const grammar = `value  → object | array | string | number | true | false | null
object → "{" members? "}"
array  → "[" values? "]"`;

export default function FormalLanguage() {
  return (
    <section id="formal-language" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        CFG와 PDA가 다시 등장하는 이유
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="formal-basics" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          Symbol에서 language까지
        </h3>
        <p className="leading-7">
          먼저 alphabet은 사용할 수 있는 symbol의 유한 집합이다. 예를 들어
          <code>{`{"[", "]", "0", "1"}`}</code>이 alphabet이면
          <code>[0]</code>은 그 symbol을 순서대로 이은 string이다. Formal
          language는 이런 모든 string이 아니라 규칙을 만족하는 string만 모은
          집합이다. Grammar는 start symbol과 terminal·nonterminal·production
          rule로 어떤 string이 그 집합에 들어오는지 생성한다. Terminal은 최종
          출력에 남는 문자이고, nonterminal은 <code>value</code>나
          <code>object</code>처럼 더 전개할 중간 이름이다.
        </p>
        <h3 id="cfg-pda" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          CFG와 PDA가 다시 등장하는 이유
        </h3>
        <p className="leading-7">
          유한 오토마톤은 유한한 상태만 기억한다. 반면 JSON object 안의 array
          안에 다시 object가 들어가는 것처럼 깊이가 정해지지 않은 중첩은 열린
          구조를 기억할 stack이 필요하다. 유한 상태 기계에 stack을 더한 계산
          모델이
          <strong> 푸시다운 오토마톤(PDA)</strong>이고, 인식할 수 있는 언어가
          context-free language와 연결된다.
        </p>

        <pre className="not-prose my-6 overflow-x-auto rounded-lg border bg-muted/20 p-5 text-sm leading-6">
          <code>{grammar}</code>
        </pre>

        <div data-viz="grammar-state-role-cards" className="not-prose my-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Grammar</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              어떤 terminal·nonterminal 조합이 유효한지 선언
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Parser state</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              지금까지 읽은 prefix와 열린 중첩을 추적
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Allowed continuation</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              현재 상태에서 이어질 수 있는 문자·token을 계산
            </p>
          </div>
        </div>

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          이론 모델과 실제 parser 구현은 같은 이름이 아니다
        </h3>
        <p className="leading-7">
          “중첩이 있으니 모든 엔진이 PDA 하나로 구현된다”고 단정하면 안 된다.
          실제 엔진은 LR 계열, Earley parser, automata와 cache를 조합할 수 있다.
          PDA는 왜 stack 성격의 상태가 필요한지 설명하는 계산 모델이고, 제품의
          자료구조와 최적화는 별도 설계다. XGrammar 2도 동적인 agent schema를
          위해 Earley 기반 mask cache와 세부 문법 재사용을 추가로 설명한다.
        </p>
        <p className="leading-7">
          괄호만 보면 stack의 동작은 단순하다. <code>(</code>를 읽으면 “나중에
          닫아야 할 괄호”를 push하고, <code>)</code>를 읽으면 pop한다. 빈 stack에서
          닫으려 하거나 입력이 끝났는데 stack이 남으면 잘못된 string이다. JSON은
          object·array뿐 아니라 string escape·number·comma 위치까지 함께 추적해야
          하므로 실제 parser state는 이 예보다 복잡하지만, 임의 깊이 중첩에
          유한한 상태 번호만으로는 부족하다는 핵심은 같다.
        </p>
      </div>
    </section>
  );
}
