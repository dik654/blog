const irForms = [
  ['AST-like IR', '언어 구조를 많이 보존한다. 초기 lowering과 diagnostics에는 좋지만 최적화에는 높다.'],
  ['Three-address code', '각 instruction이 단순한 연산과 임시 값을 만든다. data-flow 분석이 쉬워진다.'],
  ['CFG IR', 'basic block과 jump edge를 명시한다. control-flow가 node/edge로 드러난다.'],
  ['SSA IR', '각 값이 한 번만 정의된다. use-def chain, dominance, optimization이 강해진다.'],
];

const loweringExamples = [
  ['for loop', 'initializer, condition, body, update, jump block으로 내려간다. break/continue target도 명시된다.'],
  ['short-circuit', '`a && b`는 단일 binary op가 아니라 조건부 branch로 내려간다. `b`는 필요할 때만 평가된다.'],
  ['pattern match', 'decision tree, tag test, binding extraction, exhaustiveness 정보로 바뀐다.'],
  ['try/finally', 'normal edge와 exceptional edge가 모두 finally block으로 합류해야 한다.'],
];

const dataflowRows = [
  ['Reaching definitions', '어떤 definition이 이 지점까지 도달할 수 있는지 계산한다.'],
  ['Liveness', '어떤 값이 이후에 다시 쓰이는지 계산한다. register allocation과 DCE의 근거다.'],
  ['Available expressions', '이미 계산된 expression을 재사용할 수 있는지 본다.'],
  ['Dominance', 'A block이 B block의 모든 path 앞에 반드시 오는지 본다. SSA construction의 핵심이다.'],
];

function Grid({ rows }: { rows: string[][] }) {
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

function Flow() {
  const steps = ['AST', 'HIR', 'CFG', 'SSA', 'Optimized IR', 'Machine IR'];
  return (
    <div className="not-prose overflow-x-auto rounded-lg border border-border bg-muted/10 p-4">
      <div className="grid min-w-[920px] grid-cols-6 gap-2">
        {steps.map((step, index) => (
          <div key={step} className="relative rounded-md border border-border bg-background p-4 text-center">
            <div className="text-xs font-semibold text-muted-foreground">0{index + 1}</div>
            <div className="mt-1 text-sm font-bold">{step}</div>
            {index < steps.length - 1 && <div className="absolute -right-2 top-1/2 z-10 h-px w-4 bg-border" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IrSsaArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">IR은 언어와 기계 사이의 작업 언어다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>AST는 사용자가 쓴 언어의 구조를 잘 보존한다. 하지만 compiler가 최적화하고 codegen하기에는 너무 높다. `for`, `match`, `try`, closure, generic 같은 표면 기능은 target machine과 거리가 멀다. IR(Intermediate Representation)은 이 간격을 줄이는 작업 언어다.</p>
          <p>좋은 IR은 두 가지를 동시에 만족해야 한다. 첫째, source semantics를 잃지 않을 만큼 높아야 한다. 둘째, 분석과 변환이 쉬울 만큼 낮아야 한다. 그래서 현대 compiler는 보통 하나의 IR만 쓰지 않고 HIR, MIR, LLVM IR, Machine IR처럼 여러 층을 둔다.</p>
        </div>
        <Flow />
      </section>

      <section id="lowering" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Lowering: 표면 문법을 작은 operation으로 낮추기</h2>
        <Grid rows={loweringExamples} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>lowering은 단순 변환이 아니라 의미 선택이다. `for x in iter`를 iterator protocol 호출로 낮출지, index loop로 낮출지, vectorized loop 후보로 남길지는 언어와 backend 목표에 따라 다르다. 너무 빨리 낮추면 diagnostics와 high-level optimization을 잃고, 너무 늦게 낮추면 backend가 복잡해진다.</p>
          <p>closure lowering은 특히 중요하다. capture된 variable을 environment object에 넣을지, stack에 남길지, by-value로 복사할지 정해야 한다. async lowering은 function body를 state machine으로 바꾼다. 이 지점부터 언어 기능은 runtime 자료구조가 된다.</p>
        </div>
      </section>

      <section id="cfg" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Control-flow Graph: 실행 경로를 node와 edge로 만들기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>CFG는 basic block을 node로, branch/jump/fallthrough를 edge로 표현한다. basic block은 중간에 control-flow가 갈라지지 않는 instruction sequence다. 조건문, loop, exception, early return은 모두 edge 구조로 드러난다.</p>
          <p>CFG가 생기면 “이 code가 실행될 수 있는가”, “이 값은 어떤 path에서 정의되는가”, “이 loop 안에서 변하지 않는 값은 무엇인가” 같은 질문을 할 수 있다. AST에서 숨겨져 있던 control-flow가 분석 가능한 그래프가 되는 순간이다.</p>
        </div>
      </section>

      <section id="ssa" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">SSA와 Phi: 값의 출처를 명확히 하기</h2>
        <Grid rows={irForms} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>SSA(Static Single Assignment)는 각 variable version이 한 번만 정의되도록 만든 표현이다. <code>x = 1; x = x + 1</code>은 <code>x1 = 1; x2 = x1 + 1</code>처럼 바뀐다. 그러면 use가 어떤 definition에서 왔는지 바로 알 수 있다.</p>
          <p>문제는 branch merge다. <code>{'if cond { x = 1 } else { x = 2 } print(x)'}</code>에서 마지막 <code>x</code>는 어느 값을 뜻하는가? SSA는 merge block에 phi node를 둔다. <code>x3 = phi(x1, x2)</code>는 predecessor edge에 따라 다른 값을 선택한다는 뜻이다.</p>
          <p>SSA는 최적화의 기반이다. constant propagation, dead code elimination, common subexpression elimination은 use-def chain이 명확할수록 쉬워진다. 하지만 memory, aliasing, side effect는 SSA를 어렵게 만든다. 그래서 memory SSA나 effect modeling이 필요해진다.</p>
        </div>
      </section>

      <section id="dataflow" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Data-flow Analysis: 그래프 위에서 사실을 고정점까지 전파하기</h2>
        <Grid rows={dataflowRows} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>data-flow analysis는 각 program point에서 참인 사실을 계산한다. block마다 in/out set을 두고 predecessor나 successor에서 정보를 합친 뒤, 더 이상 변하지 않을 때까지 반복한다. forward analysis와 backward analysis가 있고, may analysis와 must analysis가 있다.</p>
          <p>이론적으로는 lattice와 transfer function이지만, 구현에서는 bitset, sparse propagation, worklist, dominance tree 같은 자료구조 선택이 성능을 좌우한다. 큰 codebase에서 compiler latency를 줄이려면 분석 자체도 최적화 대상이다.</p>
        </div>
      </section>

      <section id="debug-info" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Debug Info: 낮춘 뒤에도 원래 코드를 설명해야 한다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>IR을 낮추고 최적화하면 source line과 machine instruction 사이의 관계가 흐려진다. inline, loop unroll, dead code elimination, register allocation을 거치면 변수는 register에 있다가 사라지고, 한 source line은 여러 block으로 흩어진다.</p>
          <p>그래도 debugger와 profiler는 사용자에게 source 기준으로 설명해야 한다. 그래서 compiler는 location, lexical scope, variable location, inline stack 같은 metadata를 IR과 함께 운반한다. 최적화 compiler의 좋은 debug experience는 우연이 아니라 별도 설계 결과다.</p>
        </div>
      </section>
    </div>
  );
}
