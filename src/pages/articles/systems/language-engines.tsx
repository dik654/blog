type StudyAxis = {
  label: string;
  body: string;
  examples: string;
};

type StudyCard = {
  title: string;
  from: string;
  body: string;
};

const axes: StudyAxis[] = [
  {
    label: '표현 계층',
    body: '언어 엔진은 같은 프로그램을 여러 표현으로 바꾼다. source text는 사람이 쓰기 좋고, token stream은 parser가 읽기 좋고, AST는 의미 분석이 다루기 좋고, IR/bytecode는 최적화와 실행기가 다루기 좋다.',
    examples: 'source -> token -> AST -> symbol/type table -> IR/CFG -> bytecode/native code',
  },
  {
    label: '분석 시점',
    body: '컴파일러와 인터프리터의 차이는 “분석을 하느냐”가 아니라 “언제, 얼마나, 어떤 표현까지 낮추느냐”다. CPython도 실행 전에 bytecode를 만들고, V8도 처음에는 interpreter로 돌다가 hot path를 JIT로 바꾼다.',
    examples: 'AOT / tree-walk / bytecode VM / baseline JIT / optimizing JIT',
  },
  {
    label: '책임 경계',
    body: 'parser는 문법을, semantic analyzer는 이름과 타입을, optimizer는 동등한 더 싼 계산을, backend는 target machine을, runtime은 heap·stack·GC·exception·module loading을 맡는다.',
    examples: 'frontend / middle-end / backend / runtime',
  },
];

const textbookCards: StudyCard[] = [
  {
    title: '컴파일러 교재의 큰 줄기',
    from: 'Dragon Book, Engineering a Compiler',
    body: '어휘 분석, 구문 분석, syntax-directed translation, semantic analysis, IR, data-flow analysis, optimization, instruction selection, register allocation, code generation으로 이어지는 “번역 파이프라인”을 중심에 둔다.',
  },
  {
    title: '인터프리터 구현서의 큰 줄기',
    from: 'Crafting Interpreters',
    body: 'scanner와 parser로 시작해 AST를 직접 평가하는 tree-walk interpreter를 만든 뒤, bytecode chunk, VM loop, value representation, closures, classes, garbage collection, optimization으로 내려간다.',
  },
  {
    title: '프로그래밍 언어 교재의 큰 줄기',
    from: 'Programming Language Pragmatics',
    body: '언어 구현만이 아니라 name, scope, binding, type, control flow, subroutine, storage management 같은 “언어 의미가 실행기에서 무엇을 요구하는가”를 같이 본다.',
  },
];

const pipeline = [
  ['Lexing', '문자열을 keyword, identifier, literal, operator, delimiter 같은 token으로 자른다. 이 단계는 정규 언어에 가깝고, whitespace와 comment 처리 정책도 여기서 정해진다.'],
  ['Parsing', 'token stream이 grammar를 만족하는지 확인하고 parse tree 또는 AST를 만든다. precedence, associativity, ambiguity를 어떻게 처리하는지가 핵심이다.'],
  ['AST', '괄호·세미콜론 같은 표면 문법을 걷어내고 선언, 호출, 연산, 블록, 조건, 반복 같은 의미 단위로 프로그램을 압축한다.'],
  ['Semantics', 'symbol table, scope, type, definite assignment, return path, access control처럼 grammar만으로는 알 수 없는 의미 제약을 검사한다.'],
  ['IR / CFG', 'AST를 최적화와 코드 생성에 적합한 낮은 표현으로 바꾼다. control-flow graph와 SSA는 “값이 어디서 정의되고 어디서 쓰이는가”를 드러낸다.'],
  ['Execution', 'IR을 native code로 만들거나 bytecode VM/JIT가 실행한다. 이때 stack frame, heap object, calling convention, GC, exception이 runtime 책임으로 붙는다.'],
];

const compare = [
  ['AST 도구', '실행하지 않고 코드 구조를 읽고 바꾸는 도구', 'linter, formatter, codemod, Babel, SWC', 'node kind, scope, source map, comment 보존'],
  ['컴파일러', '프로그램 표현을 더 낮은 표현으로 번역하고 정적 오류를 잡는 도구', 'C/Rust compiler, TypeScript compiler, LLVM pipeline', 'frontend/middle-end/backend, IR, target ABI'],
  ['인터프리터', '프로그램 표현을 실행 시점에 평가해 상태 변화를 만드는 실행기', 'tree-walk interpreter, bytecode VM loop', 'environment, operand stack, dispatch, object model'],
  ['JIT', '실행 중 profiling을 바탕으로 자주 도는 경로를 native code로 바꾸는 runtime compiler', 'V8, JVM HotSpot, PyPy', 'inline cache, deoptimization, tiering, guard'],
];

const practice = [
  ['1단계', '작은 expression grammar를 정하고 tokenizer와 recursive descent parser를 만든다. 목표는 `1 + 2 * 3`이 AST에서 왜 `+` 아래에 `*`를 자식으로 갖는지 확인하는 것이다.'],
  ['2단계', 'AST evaluator를 만든다. 숫자, 변수, block, if, while, function call을 추가하면서 environment와 scope가 왜 필요한지 확인한다.'],
  ['3단계', 'AST를 stack bytecode로 낮춘다. `PUSH_CONST`, `LOAD_LOCAL`, `ADD`, `JUMP_IF_FALSE`, `CALL` 같은 instruction이 생기면 interpreter loop의 비용과 단순성이 보인다.'],
  ['4단계', 'CFG와 간단한 최적화를 붙인다. constant folding, dead branch 제거, local value numbering 정도만 해도 IR이 AST보다 왜 유리한지 드러난다.'],
];

function InfoGrid({ items }: { items: StudyAxis[] }) {
  return (
    <div className="not-prose grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="text-sm font-semibold">{item.label}</div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
          <div className="mt-3 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground/80">{item.examples}</div>
        </div>
      ))}
    </div>
  );
}

function TextbookGrid() {
  return (
    <div className="not-prose grid gap-3 md:grid-cols-3">
      {textbookCards.map((card) => (
        <div key={card.title} className="rounded-lg border border-border bg-background p-4">
          <div className="text-sm font-bold">{card.title}</div>
          <div className="mt-1 text-xs font-medium text-primary">{card.from}</div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.body}</p>
        </div>
      ))}
    </div>
  );
}

function FlowViz() {
  return (
    <div className="not-prose overflow-x-auto rounded-lg border border-border bg-muted/10 p-4">
      <div className="grid min-w-[980px] grid-cols-6 gap-2">
        {pipeline.map(([label, body], index) => (
          <div key={label} className="relative rounded-md border border-border bg-background p-3">
            <div className="text-xs font-semibold text-muted-foreground">0{index + 1}</div>
            <div className="mt-1 text-sm font-bold">{label}</div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
            {index < pipeline.length - 1 && <div className="absolute -right-2 top-1/2 z-10 h-px w-4 bg-border" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareTable() {
  return (
    <div className="not-prose overflow-x-auto rounded-lg border border-border">
      <div className="min-w-[860px]">
        <div className="grid grid-cols-[140px_1.2fr_1fr_1fr] border-b border-border bg-muted/30 text-sm font-semibold">
          <div className="p-3">분류</div>
          <div className="border-l border-border p-3">무엇을 하는가</div>
          <div className="border-l border-border p-3">대표 예</div>
          <div className="border-l border-border p-3">읽을 때 볼 것</div>
        </div>
        {compare.map(([name, role, examples, focus]) => (
          <div key={name} className="grid grid-cols-[140px_1.2fr_1fr_1fr] border-b border-border text-sm last:border-b-0">
            <div className="p-3 font-semibold">{name}</div>
            <div className="border-l border-border p-3 text-muted-foreground">{role}</div>
            <div className="border-l border-border p-3 text-muted-foreground">{examples}</div>
            <div className="border-l border-border p-3 text-muted-foreground">{focus}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticeList() {
  return (
    <div className="not-prose grid gap-3 md:grid-cols-2">
      {practice.map(([title, body]) => (
        <div key={title} className="rounded-lg border border-border bg-muted/15 p-4">
          <div className="text-sm font-bold">{title}</div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
      ))}
    </div>
  );
}

const articleMap = [
  {
    href: '/lab/blog/systems/ast-parser',
    title: 'AST와 파서',
    body: '문자열이 token, parse tree, AST로 내려가는 과정. precedence, grammar, scope 진입 전 구조 보존 문제를 따로 본다.',
  },
  {
    href: '/lab/blog/systems/semantic-analysis',
    title: '정적 의미 분석',
    body: '이름, scope, symbol table, type checking, flow constraint, diagnostics를 별도 글로 본다.',
  },
  {
    href: '/lab/blog/systems/compiler-pipeline',
    title: '컴파일러 파이프라인 지도',
    body: '컴파일러 전체 흐름을 한 장으로 잡고, 자세한 내용은 의미 분석/IR/최적화 글로 나눠 읽는다.',
  },
  {
    href: '/lab/blog/systems/ir-ssa',
    title: 'IR·CFG·SSA',
    body: 'AST를 분석 가능한 basic block, control-flow graph, SSA, data-flow 분석 대상으로 낮춘다.',
  },
  {
    href: '/lab/blog/systems/optimization-codegen',
    title: '최적화와 코드 생성',
    body: '의미 보존 변환, alias/memory, loop optimization, backend, register allocation, ABI까지 분리한다.',
  },
  {
    href: '/lab/blog/systems/interpreter-vm',
    title: '인터프리터와 VM 지도',
    body: 'tree-walk, bytecode, runtime, JIT의 연결만 잡고 세부 runtime은 별도 글로 넘긴다.',
  },
  {
    href: '/lab/blog/systems/bytecode-runtime-jit',
    title: 'Bytecode Runtime과 JIT',
    body: 'VM instruction, frame, object model, GC, dispatch, inline cache, deopt, tiering을 깊게 본다.',
  },
];

function ArticleMap() {
  return (
    <div className="not-prose grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {articleMap.map((item) => (
        <a key={item.href} href={item.href} className="rounded-lg border border-border bg-background p-4 transition hover:border-primary/60 hover:bg-muted/20">
          <div className="text-sm font-bold">{item.title}</div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
        </a>
      ))}
    </div>
  );
}

export default function LanguageEnginesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">AST·컴파일러·인터프리터를 한 장으로 보기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>소스코드는 곧바로 실행되지 않는다. 먼저 문자열이 token이 되고, token이 tree가 되고, tree가 이름과 타입을 얻고, 더 낮은 중간 표현으로 내려간 뒤, bytecode VM이나 native machine이 실행할 수 있는 계획이 된다. AST, compiler, interpreter는 서로 경쟁하는 개념이 아니라 이 경로의 다른 층이다.</p>
          <p>그래서 “컴파일러는 번역기, 인터프리터는 한 줄씩 실행”이라는 설명은 입문용으로도 금방 부족해진다. TypeScript compiler는 JavaScript를 출력하지만 type checker이기도 하다. CPython은 source를 bytecode로 컴파일한 뒤 VM이 실행한다. V8은 interpreter와 여러 단계의 JIT compiler를 같이 쓴다. 분류 기준은 언어 이름이 아니라 표현 계층, 분석 시점, runtime 책임이어야 한다.</p>
        </div>
        <FlowViz />
      </section>

      <section id="split-map" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">이 글은 지도이고, 본문은 세 글로 나눈다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>AST, compiler, interpreter는 각각 한 편으로 끝낼 수 있는 주제가 아니다. 이 글은 세 영역의 경계와 연결만 잡는 허브로 둔다. 실제 학습은 아래 세 글로 분리해서 읽는 편이 맞다.</p>
        </div>
        <ArticleMap />
      </section>

      <section id="textbook-map" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">교재 목차에서 뽑은 학습 지도</h2>
        <TextbookGrid />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>컴파일러 교재는 보통 “앞단에서 의미를 확정하고, 중간 표현에서 최적화하고, 뒷단에서 기계 제약에 맞춘다”는 구조로 간다. 인터프리터 구현서는 “작은 언어를 직접 실행해 보며 runtime 구조를 하나씩 붙인다”는 구조가 강하다. 프로그래밍 언어 교재는 “언어 기능 하나가 scope, type, storage, control flow에 어떤 요구를 만드는가”를 넓게 본다.</p>
          <p>이 글은 세 관점을 섞는다. 먼저 컴파일러 교재처럼 단계별 이름을 잡고, 구현서처럼 실제로 무엇을 만들지 연결하고, 언어론 교재처럼 이름·타입·스코프·저장소의 의미를 놓치지 않는 방식이다.</p>
        </div>
      </section>

      <section id="taxonomy" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">분류 기준: 무엇을 입력으로 받아 무엇을 출력하는가</h2>
        <InfoGrid items={axes} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>언어 엔진을 읽을 때는 함수 이름보다 입출력을 먼저 봐야 한다. scanner는 문자열을 token stream으로 바꾼다. parser는 token stream을 tree로 바꾼다. semantic analyzer는 tree에 symbol과 type을 붙인다. compiler는 한 표현을 더 낮은 표현으로 바꾼다. interpreter는 표현을 읽어 environment, stack, heap 같은 실행 상태를 바꾼다.</p>
        </div>
        <div className="mt-6">
          <CompareTable />
        </div>
      </section>

      <section id="frontend" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Frontend: 문자열에서 AST까지</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>이 축은 별도 글로 분리했다. lexer, parser, parse tree, AST, source location, precedence, error recovery는 <a href="/lab/blog/systems/ast-parser">AST와 파서</a>에서 다룬다.</p>
        </div>
      </section>

      <section id="static-semantics" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">컴파일러: 의미를 확정하고 표현을 낮추기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>문법이 맞는 프로그램도 의미상 틀릴 수 있다. symbol table, type checking, IR, CFG, SSA, optimization, backend는 <a href="/lab/blog/systems/compiler-pipeline">컴파일러 파이프라인</a>에서 분리해 다룬다.</p>
        </div>
      </section>

      <section id="execution" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">인터프리터와 VM: 실행 중 상태를 바꾸기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>실행기는 AST나 bytecode를 읽어 environment, operand stack, heap, call frame을 바꾼다. tree-walk interpreter, bytecode VM, closure, object model, GC, JIT는 <a href="/lab/blog/systems/interpreter-vm">인터프리터와 VM</a>에서 따로 다룬다.</p>
        </div>
      </section>

      <section id="runtime" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">런타임: 언어가 기대하는 작은 운영체제</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>언어 엔진에서 runtime을 빼면 절반만 본 것이다. runtime은 함수 호출 stack, heap allocation, object layout, garbage collection, exception unwinding, module loading, reflection, coroutine scheduler 같은 실행 환경을 제공한다. 같은 source semantics도 runtime 설계에 따라 성능과 디버깅 경험이 크게 달라진다.</p>
          <p>GC는 reachable object를 추적해 더 이상 접근할 수 없는 heap object를 회수한다. reference counting은 즉시 회수가 쉽지만 cycle 처리가 필요하다. tracing GC는 cycle을 다룰 수 있지만 pause time과 write barrier 같은 비용이 생긴다. generational GC는 대부분의 object가 짧게 산다는 경험적 사실을 활용한다.</p>
          <p>exception도 단순한 jump가 아니다. stack frame을 되감고, finally/defer/destructor를 실행하고, language boundary를 넘을 때 representation을 바꿔야 한다. coroutine과 async runtime은 call stack을 heap에 저장된 state machine으로 바꾼다. “언어 기능”은 결국 runtime 자료구조로 구현된다.</p>
        </div>
      </section>

      <section id="practice" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">학습용 실습 순서</h2>
        <PracticeList />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>학습할 때 처음부터 LLVM이나 V8을 읽으면 거의 실패한다. 작은 언어를 하나 정하고, expression evaluator에서 bytecode VM까지 직접 내려가는 편이 훨씬 낫다. 그 다음 실제 엔진을 볼 때 scanner, parser, AST, IR, runtime이 어디에 있는지 대응시킬 수 있다.</p>
        </div>
      </section>

      <section id="roadmap" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">다음 글 지도</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>이 분류의 다음 글은 세 갈래로 쌓는 것이 좋다. 첫째, parser와 AST를 별도로 다뤄 “문법이 의미 tree가 되는 과정”을 본다. 둘째, compiler pipeline에서 IR, CFG, SSA, 최적화를 분리해 “어떤 변환이 안전한가”를 본다. 셋째, interpreter와 VM을 분리해 “실행 루프가 상태를 어떻게 바꾸는가”를 본다.</p>
        </div>
      </section>
    </div>
  );
}
