const passes = [
  ['Name resolution', 'identifier use를 declaration에 연결한다. shadowing, import alias, module boundary, overload 후보를 정리한다.'],
  ['Scope checking', 'block, function, class, module, pattern match가 만드는 이름의 생존 구간과 접근 가능 범위를 확정한다.'],
  ['Type checking', 'operation이 값의 타입 위에서 유효한지 검사한다. inference, generic constraint, subtyping, trait/interface resolution이 붙는다.'],
  ['Flow checking', 'definite assignment, return coverage, unreachable code, exhaustiveness, borrow/lifetime 같은 control-flow 성질을 계산한다.'],
];

const symbolRows = [
  ['Symbol', '프로그램 안의 선언된 이름. variable, function, type, module, field, label처럼 종류가 다르다.'],
  ['Scope', 'symbol을 찾을 수 있는 범위. lexical scope가 기본이지만 module, class, namespace, macro hygiene이 섞일 수 있다.'],
  ['Binding', 'identifier use가 어떤 symbol을 가리키는지 결정한 결과. 이후 pass는 문자열 이름보다 binding id를 사용한다.'],
  ['Environment', '해석기에서는 이름->값 map, 컴파일러에서는 이름->symbol/type/storage 정보로 나타난다.'],
];

const typeRows = [
  ['Local inference', '`let x = 1`에서 annotation 없이 `x: number`를 추론한다. 오류 위치가 초기화식인지 사용 위치인지 정해야 한다.'],
  ['Generic constraint', '`T: Clone` 또는 `T extends Foo` 같은 조건을 만족하는지 확인한다. method lookup과 연결된다.'],
  ['Subtyping', '값을 더 넓은 타입 위치에 넣을 수 있는지 판단한다. variance, nullable, union/intersection이 복잡도를 만든다.'],
  ['Effect / capability', '예외, async, unsafe, purity, ownership처럼 타입만으로 부족한 실행 효과를 별도 축으로 추적한다.'],
];

function Cards({ rows }: { rows: string[][] }) {
  return (
    <div className="not-prose grid gap-3 md:grid-cols-2">
      {rows.map(([title, body]) => (
        <div key={title} className="rounded-lg border border-border bg-muted/15 p-4">
          <div className="text-sm font-bold">{title}</div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
      ))}
    </div>
  );
}

function Table({ rows }: { rows: string[][] }) {
  return (
    <div className="not-prose overflow-x-auto rounded-lg border border-border">
      <div className="min-w-[760px]">
        {rows.map(([name, body]) => (
          <div key={name} className="grid grid-cols-[180px_1fr] border-b border-border text-sm last:border-b-0">
            <div className="bg-muted/25 p-3 font-semibold">{name}</div>
            <div className="border-l border-border p-3 text-muted-foreground">{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SemanticAnalysisArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">정적 의미 분석은 AST에 의미를 붙이는 단계다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>parser가 만든 AST는 문법적으로 맞다는 사실만 알려준다. `x + y`라는 node가 있어도 `x`가 어디서 선언됐는지, `+`가 어떤 overload를 뜻하는지, `y`가 초기화됐는지, 이 expression이 async context 안에서 허용되는지 알 수 없다. 정적 의미 분석은 이 빈칸을 채운다.</p>
          <p>이 단계가 끝나면 compiler는 더 이상 문자열 이름을 믿지 않는다. identifier는 symbol id에 연결되고, expression에는 type이 붙고, block에는 scope가 붙고, control-flow edge에는 definite assignment나 lifetime 같은 사실이 붙는다. 이후 IR lowering은 이 enriched AST를 입력으로 받는다.</p>
        </div>
        <Cards rows={passes} />
      </section>

      <section id="name-resolution" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Name Resolution: 이름을 선언에 연결하기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>이름 해석은 단순 map lookup이 아니다. 같은 이름이 inner block에서 outer declaration을 가릴 수 있고, module import가 별칭을 만들 수 있고, class member lookup은 receiver type을 필요로 할 수 있다. macro가 있는 언어는 hygiene 때문에 “보이는 텍스트 이름”과 “실제 binding”이 달라질 수 있다.</p>
          <p>좋은 구현은 name resolution 결과를 AST node에 직접 문자열로 덧붙이지 않는다. 보통 symbol table에 declaration record를 만들고, identifier use는 stable symbol id를 참조한다. 그래야 rename, jump-to-definition, incremental compilation, diagnostics가 같은 정보를 공유할 수 있다.</p>
        </div>
      </section>

      <section id="scope-symbols" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Scope와 Symbol Table: 이름의 생존 구간</h2>
        <Table rows={symbolRows} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>scope는 block 하나마다 생길 수도 있고, function, class, module, namespace마다 생길 수도 있다. 중요한 점은 scope가 단순 tree가 아닐 때도 많다는 것이다. import graph는 DAG에 가깝고, class inheritance는 parent chain을 만들며, trait/interface method lookup은 후보 집합을 만든다.</p>
          <p>closure가 등장하면 symbol table은 runtime representation과 연결된다. inner function이 outer variable을 capture하면 그 variable은 stack slot만으로 충분하지 않을 수 있다. 의미 분석은 이 값을 closure environment로 올릴지, by-value capture인지 by-reference capture인지 결정하는 근거를 제공한다.</p>
        </div>
      </section>

      <section id="type-checking" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Type Checking: operation이 값 위에서 유효한지 보기</h2>
        <Table rows={typeRows} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>type checker는 “이 값에 이 연산을 해도 되는가”를 묻는다. `a + b`에서 `+`가 integer add인지 string concat인지 user-defined operator인지 결정해야 한다. method call은 receiver type에서 method set을 찾고, generic 함수는 type argument를 추론하거나 constraint를 검사해야 한다.</p>
          <p>타입 시스템이 강해질수록 오류 메시지가 중요해진다. compiler는 내부적으로 constraint solving을 하더라도 사용자에게는 “여기서 기대한 타입은 A인데 실제 타입은 B이며, 이 기대는 저 함수 parameter에서 왔다”처럼 원인 chain을 보여줘야 한다. 좋은 type checker는 판정기이면서 설명기다.</p>
        </div>
      </section>

      <section id="flow-effects" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Control-flow와 Effect: 타입 밖의 의미 제약</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>모든 의미 제약이 type으로 끝나지는 않는다. <code>{'let x; if cond { x = 1 } print(x)'}</code>는 타입이 맞아도 <code>x</code>가 초기화됐는지 control-flow를 봐야 한다. <code>switch</code>가 모든 variant를 처리하는지, function의 모든 path가 return하는지, <code>break</code>가 loop 안에 있는지도 flow 문제다.</p>
          <p>Rust의 borrow checking, Swift의 definite initialization, TypeScript의 control-flow narrowing은 모두 AST만으로 부족하고 CFG에 가까운 정보를 필요로 한다. 이 단계에서 얻은 사실은 IR lowering 전에 오류를 내거나, lowering 방식 자체를 바꾼다.</p>
        </div>
      </section>

      <section id="diagnostics" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Diagnostics: compiler는 사용자를 가르치는 UI다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>의미 분석의 산출물은 pass/fail만이 아니다. 좋은 compiler는 잘못된 symbol 후보, 비슷한 이름, missing import, expected/actual type, lifetime origin, control-flow path를 설명한다. source span과 note, help, fix-it suggestion은 내부 분석 결과를 사용자에게 번역한 UI다.</p>
          <p>따라서 AST node에는 source location이 보존되어야 하고, symbol/type에는 declaration 위치가 연결되어야 하며, constraint solver는 왜 이 constraint가 생겼는지 provenance를 들고 있어야 한다. 오류 메시지는 나중에 붙이는 문자열이 아니라 compiler architecture의 일부다.</p>
        </div>
      </section>
    </div>
  );
}
