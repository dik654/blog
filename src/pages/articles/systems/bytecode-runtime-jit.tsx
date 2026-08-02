const bytecodeChoices = [
  ['Stack VM', 'operand 위치를 implicit stack으로 표현한다. instruction encoding이 작고 compiler가 단순하다.'],
  ['Register VM', 'operand register를 명시한다. instruction 수를 줄일 수 있지만 encoding과 allocator가 복잡해진다.'],
  ['Threaded dispatch', 'opcode switch 대신 handler 주소를 이용해 dispatch overhead를 줄인다. 구현 언어와 portability 제약이 있다.'],
  ['Inline cache', 'dynamic property/method lookup 결과를 call site에 cache한다. JIT 전 단계에서도 큰 효과가 있다.'],
];

const runtimeParts = [
  ['Frame', 'return address, local slots, operand stack base, closure/upvalue pointer를 담는다.'],
  ['Value representation', 'tagged pointer, NaN boxing, object header, immediate integer 같은 encoding을 선택한다.'],
  ['Object model', 'class/prototype, hidden class/shape, method table, property storage layout을 관리한다.'],
  ['GC', 'root set을 찾고 reachable object를 표시하며, unreachable object를 회수한다.'],
];

const jitTerms = [
  ['Profiling', 'type feedback, branch frequency, call target, object shape를 모은다.'],
  ['Guard', '최적화 가정이 여전히 맞는지 runtime check를 넣는다.'],
  ['Deoptimization', 'guard가 깨지면 optimized native frame을 interpreter/bytecode frame으로 복원한다.'],
  ['Tiering', 'baseline interpreter -> baseline JIT -> optimizing JIT처럼 비용과 성능을 단계화한다.'],
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

function Pipeline() {
  const steps = ['Source', 'AST', 'Bytecode', 'Interpreter', 'Profile', 'JIT Code', 'Deopt'];
  return (
    <div className="not-prose overflow-x-auto rounded-lg border border-border bg-muted/10 p-4">
      <div className="grid min-w-[980px] grid-cols-7 gap-2">
        {steps.map((step, index) => (
          <div key={step} className="relative rounded-md border border-border bg-background p-3 text-center">
            <div className="text-xs font-semibold text-muted-foreground">0{index + 1}</div>
            <div className="mt-1 text-sm font-bold">{step}</div>
            {index < steps.length - 1 && <div className="absolute -right-2 top-1/2 z-10 h-px w-4 bg-border" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BytecodeRuntimeJitArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Runtime은 언어가 기대하는 작은 machine이다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>언어 구현은 parser와 compiler만으로 끝나지 않는다. 실제 실행에는 frame, stack, heap, object layout, garbage collector, module loader, exception machinery, profiler, JIT compiler가 필요하다. runtime은 이 모든 것을 묶어 언어가 기대하는 실행 환경을 만든다.</p>
          <p>bytecode runtime은 source language와 physical CPU 사이에 가상의 instruction set을 둔다. interpreter는 이 instruction을 실행하고, profiler는 실행 중 정보를 모으며, JIT는 hot path를 native code로 바꾼다. 빠른 언어 엔진은 대개 이 세 층을 함께 가진다.</p>
        </div>
        <Pipeline />
      </section>

      <section id="bytecode" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Bytecode 설계: VM이 실행하기 좋은 instruction set</h2>
        <Grid rows={bytecodeChoices} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>bytecode는 너무 source에 가까우면 dispatch가 많아지고, 너무 machine에 가까우면 portability와 compiler 단순성을 잃는다. 좋은 bytecode는 high-level semantics를 적당히 보존하면서 VM loop가 빠르게 읽을 수 있어야 한다.</p>
          <p>stack VM은 `PUSH_CONST`, `LOAD_LOCAL`, `ADD`, `CALL`처럼 operand stack을 중심으로 움직인다. register VM은 `ADD r3, r1, r2`처럼 operand 위치를 명시한다. stack VM은 encoding이 작고 compiler가 쉽지만 instruction 수가 늘 수 있고, register VM은 fewer dispatch를 얻는 대신 bytecode compiler가 어려워진다.</p>
        </div>
      </section>

      <section id="frames" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Frame과 Stack: 함수 호출을 저장하는 방식</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>함수 호출은 새 frame을 만든다. frame은 local variables, operand stack 위치, return address, caller frame, closure environment를 담는다. recursion, exception, generator, async는 모두 frame의 생명주기와 representation을 바꾼다.</p>
          <p>closure는 frame을 더 어렵게 만든다. outer function이 반환된 뒤 inner function이 outer local을 참조하면 그 값은 stack frame과 함께 사라질 수 없다. runtime은 upvalue, cell, environment object 같은 구조로 captured variable을 heap에 보존한다.</p>
          <p>async/await는 call stack을 state machine으로 바꾼다. suspension point마다 local state를 저장하고, resume될 때 instruction pointer와 locals를 복원한다. 그래서 async runtime은 language semantics와 scheduler가 만나는 지점이다.</p>
        </div>
      </section>

      <section id="objects-gc" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Object와 GC: 값의 형태와 생명주기</h2>
        <Grid rows={runtimeParts} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>dynamic language runtime은 value representation이 성능을 좌우한다. integer를 heap object로 만들면 단순하지만 느리다. tagged pointer나 NaN boxing은 작은 값은 immediate로 담고 object는 pointer로 담는다. 이 선택은 arithmetic, property access, GC root scanning에 모두 영향을 준다.</p>
          <p>object model도 중요하다. JavaScript engine은 hidden class/shape를 사용해 동적 object의 property layout을 안정화하고 inline cache를 붙인다. Python은 dictionary 기반 object가 강하지만 attribute lookup cost를 줄이기 위해 여러 cache와 specialization을 쓴다.</p>
          <p>GC는 root set에서 시작해 reachable object를 찾는다. root는 stack frame, register, global, VM internal handle, JIT frame metadata에서 온다. generational GC는 짧게 사는 object가 많다는 가정으로 young generation을 자주 회수하고 old generation은 덜 건드린다.</p>
        </div>
      </section>

      <section id="dispatch" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Dispatch 최적화: interpreter loop의 비용 줄이기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>bytecode interpreter는 instruction마다 opcode를 읽고 handler로 분기한다. 이 dispatch overhead가 크면 실제 연산보다 loop 제어가 더 비싸진다. switch dispatch, direct threaded code, computed goto, superinstruction, quickening이 여기서 나온다.</p>
          <p>quickening은 처음에는 generic opcode를 쓰다가 runtime feedback을 보고 specialized opcode로 바꾸는 방식이다. 예를 들어 `ADD`가 계속 small integer끼리만 수행되면 `ADD_INT`로 바꿀 수 있다. 이 방식은 JIT 없이도 dynamic language의 hot path를 빠르게 만든다.</p>
          <p>inline cache는 property lookup과 method dispatch를 줄인다. call site에서 최근 receiver shape와 target method를 저장하고, 다음 실행에서 shape가 같으면 빠른 path를 탄다. shape가 달라지면 polymorphic cache나 generic lookup으로 fallback한다.</p>
        </div>
      </section>

      <section id="jit-deopt" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">JIT와 Deopt: 빠른 path와 돌아오는 path를 함께 설계하기</h2>
        <Grid rows={jitTerms} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>JIT는 runtime profiling을 compiler input으로 쓴다. interpreter가 type feedback과 branch frequency를 모으면, JIT는 “이 call site는 항상 같은 function을 부른다”, “이 object shape는 안정적이다”, “이 branch는 거의 true다” 같은 가정으로 native code를 만든다.</p>
          <p>가정은 깨질 수 있다. 그래서 optimized code에는 guard가 들어간다. guard가 실패하면 deoptimization이 일어난다. deopt는 native frame의 register와 stack 값을 interpreter가 이해하는 frame/local/operand stack 상태로 복원해야 한다. 이 복원 정보가 없으면 빠른 code에서 안전하게 돌아올 수 없다.</p>
          <p>tiering은 비용 관리다. 모든 code를 최고 수준으로 최적화하면 compile time과 memory가 커진다. 그래서 처음에는 interpreter나 baseline JIT로 빨리 시작하고, 충분히 hot해진 code만 optimizing JIT로 올린다. 좋은 runtime은 startup latency, peak throughput, memory, battery를 함께 조절한다.</p>
        </div>
      </section>
    </div>
  );
}
