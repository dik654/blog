const tokenKinds = [
  ['Keyword', '`if`, `while`, `return`처럼 문법에서 특별한 역할을 하는 단어'],
  ['Identifier', '변수, 함수, 타입, 필드 이름처럼 사용자가 붙인 이름'],
  ['Literal', '숫자, 문자열, boolean, null처럼 소스에 직접 적힌 값'],
  ['Operator', '`+`, `==`, `&&`, `=`처럼 식과 문장을 결합하는 기호'],
  ['Delimiter', '괄호, 쉼표, 세미콜론처럼 구조를 끊는 기호'],
];

const parserChoices = [
  ['Recursive descent', 'grammar 구조를 함수 구조로 거의 그대로 옮긴다. 구현과 디버깅이 쉽고 작은 언어에 좋다.'],
  ['Pratt parser', 'expression precedence를 binding power로 처리한다. 연산자 많은 언어에서 간결하다.'],
  ['LR 계열', '많은 grammar를 table 기반으로 처리한다. 도구 생성기와 궁합이 좋지만 오류 메시지는 설계가 필요하다.'],
];

const astNodes = [
  ['Program', '파일 전체. import, declaration, statement list를 담는다.'],
  ['Declaration', 'function, class, variable, type alias처럼 이름을 도입한다.'],
  ['Statement', 'if, while, return, block처럼 control flow나 side effect를 만든다.'],
  ['Expression', 'literal, variable, call, binary, member access처럼 값을 만든다.'],
  ['Pattern / Binding', 'destructuring, parameter, match arm처럼 이름과 구조를 동시에 만든다.'],
];

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

export default function AstArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">AST는 소스코드를 분석 가능한 구조로 바꾼 결과다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>AST(Abstract Syntax Tree)는 “코드를 트리로 만든 것”보다 더 정확히 말해, 실행과 정적 분석에 필요한 문법 구조만 남긴 중간 표현이다. 괄호, 쉼표, 세미콜론 같은 표면 문법은 source location이나 formatter에는 필요하지만, 의미 분석에는 declaration, expression, statement, binding 같은 node가 더 중요하다.</p>
          <p>AST를 제대로 이해하려면 lexer, parser, parse tree와 구분해야 한다. lexer는 문자열을 token stream으로 자르고, parser는 token stream이 grammar를 만족하는지 확인하며, AST builder는 그 결과를 분석하기 좋은 node 구조로 압축한다.</p>
        </div>
      </section>

      <section id="lexing" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Lexing: 문자를 token으로 자르기</h2>
        <Table rows={tokenKinds} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>lexer의 핵심은 “어디서 끊을 것인가”다. `=`와 `==`, `/`와 comment, string interpolation, raw string, Unicode identifier 같은 규칙이 여기서 결정된다. whitespace를 버릴 수도 있고, Python처럼 indentation을 token으로 만들 수도 있다.</p>
          <p>token에는 종류뿐 아니라 source span이 붙어야 한다. 오류 메시지, formatter, source map, IDE jump-to-definition은 모두 “이 node가 원래 파일의 어디에서 왔는가”를 필요로 한다.</p>
        </div>
      </section>

      <section id="parsing" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Parsing: token stream이 grammar를 만족하는지 보기</h2>
        <Table rows={parserChoices} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>parser의 첫 장벽은 expression precedence다. `1 + 2 * 3`은 `+`보다 `*`가 먼저 묶여야 한다. 여기에 associativity까지 붙으면 `a - b - c`는 `(a - b) - c`이고, assignment는 보통 오른쪽 결합이다.</p>
          <p>두 번째 장벽은 오류 복구다. 컴파일러와 IDE는 첫 오류에서 멈추면 쓸모가 줄어든다. 세미콜론, 닫는 괄호, 다음 declaration 같은 synchronizing token까지 건너뛰고 가능한 많은 후속 오류를 보여줘야 한다.</p>
        </div>
      </section>

      <section id="ast-shape" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">AST node 설계: 문법보다 의미에 가깝게</h2>
        <Table rows={astNodes} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>parse tree는 grammar production을 거의 그대로 담지만 AST는 나중 단계가 필요한 정보만 남긴다. 예를 들어 괄호는 binary expression의 우선순위를 이미 tree 구조로 반영했으면 별도 node가 아닐 수 있다. 반대로 comment는 실행 의미가 없어도 formatter와 doc generator 때문에 보존할 수 있다.</p>
          <p>좋은 AST는 너무 높지도 낮지도 않다. `for`문을 그대로 둘지, `while`과 initializer/update로 낮출지는 이후 단계가 무엇을 해야 하는지에 따라 달라진다. linter와 formatter는 source와 가까운 AST가 좋고, optimizer는 control flow가 드러난 IR이 더 좋다.</p>
        </div>
      </section>

      <section id="next" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">다음 글 지도</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>AST 다음에는 두 방향이 있다. 정적 의미 분석과 IR로 내려가면 <a href="/lab/blog/systems/compiler-pipeline">컴파일러 파이프라인</a>이고, AST를 직접 실행하면 <a href="/lab/blog/systems/interpreter-vm">tree-walk interpreter</a>다.</p>
        </div>
      </section>
    </div>
  );
}
