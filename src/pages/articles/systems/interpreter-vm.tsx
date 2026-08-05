const executionModels = [
  ['Tree-walk interpreter', 'AST node를 직접 재귀적으로 평가한다. 구현은 명확하지만 node dispatch와 object allocation 비용이 크다.'],
  ['Bytecode VM', 'AST를 instruction stream으로 낮춘 뒤 VM loop가 실행한다. stack VM과 register VM으로 나뉜다.'],
  ['JIT runtime', '실행 중 profile을 보고 hot path를 native code로 컴파일한다. guard와 deoptimization이 핵심이다.'],
];

const runtimePieces = [
  ['Environment', '이름을 값 또는 storage location에 연결한다. lexical scope와 closure가 여기에 걸린다.'],
  ['Call frame', '함수 호출마다 return address, local slot, operand stack 위치를 관리한다.'],
  ['Object model', '값, object layout, method dispatch, prototype/class 관계를 표현한다.'],
  ['Garbage collection', '도달 가능한 heap object를 추적하고 나머지를 회수한다. pause와 barrier 비용이 붙는다.'],
];

const vmInstructions = [
  ['PUSH_CONST', '상수 pool에서 값을 operand stack에 올린다.'],
  ['LOAD_LOCAL / STORE_LOCAL', '현재 frame의 local slot을 읽고 쓴다.'],
  ['ADD / CALL', 'operand stack의 값을 소비해 새 값을 만들거나 새 frame을 만든다.'],
  ['JUMP / JUMP_IF_FALSE', 'instruction pointer를 바꿔 control flow를 만든다.'],
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

export default function InterpreterVmArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">인터프리터는 표현을 읽어 실행 상태를 바꾼다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>인터프리터는 “한 줄씩 실행”이 아니다. AST나 bytecode 같은 표현을 읽고 environment, stack, heap, instruction pointer 같은 실행 상태를 바꾸는 runtime이다. 컴파일러가 표현을 낮추는 쪽이라면, 인터프리터는 그 표현을 실제 상태 변화로 해석하는 쪽이다.</p>
          <p>작은 언어를 구현할 때는 tree-walk interpreter로 시작하는 것이 좋다. 하지만 성능과 제어를 얻으려면 bytecode VM으로 내려가고, 더 나아가면 JIT와 profiling runtime이 붙는다. 이 글은 실행 모델의 지도이고, bytecode/runtime/JIT 세부는 별도 글로 나눠 읽는다.</p>
        </div>
        <Grid rows={executionModels} />
      </section>

      <section id="tree-walk" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Tree-walk: AST를 직접 걷는 가장 단순한 실행기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>binary expression node를 만나면 왼쪽과 오른쪽을 평가하고 연산한다. variable node를 만나면 environment에서 값을 찾는다. block은 새 scope를 만들고, function call은 새 call frame과 parameter binding을 만든다.</p>
          <p>장점은 구현이 투명하다는 것이다. AST node와 evaluator 함수가 거의 일대일로 대응한다. 단점은 AST node dispatch가 잦고, source-level 구조가 실행에 너무 많이 남아 있어 CPU cache와 branch prediction에 불리하다는 점이다.</p>
        </div>
      </section>

      <section id="bytecode" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Bytecode VM: 언어가 원하는 추상 machine 만들기</h2>
        <Grid rows={vmInstructions} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>bytecode VM은 AST를 더 조밀한 instruction stream으로 낮춘다. stack VM은 instruction이 operand 위치를 많이 생략할 수 있어 단순하고, register VM은 operand를 명시해 instruction 수를 줄일 수 있다.</p>
          <p>VM loop는 보통 instruction pointer를 읽고, opcode에 따라 handler로 dispatch하고, operand stack과 frame을 수정한다. 이 단순한 loop 위에 function call, closure, exception, generator, async 같은 언어 기능이 하나씩 올라간다.</p>
          <p>bytecode instruction 설계, frame, object model, dispatch, JIT는 <a href="/lab/blog/systems/bytecode-runtime-jit">Bytecode Runtime과 JIT</a>에서 더 깊게 다룬다.</p>
        </div>
      </section>

      <section id="runtime" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Runtime 구성 요소: 실행기는 작은 운영체제에 가깝다</h2>
        <Grid rows={runtimePieces} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>closure는 local variable lifetime을 바꾼다. 함수가 반환된 뒤에도 inner function이 outer variable을 참조할 수 있으면 그 값은 stack frame과 함께 사라지면 안 된다. 그래서 upvalue, cell object, heap-allocated environment 같은 표현이 필요하다.</p>
          <p>exception은 단순 jump가 아니다. call frame을 되감고, finally/defer/destructor를 실행하고, language boundary를 넘을 때 representation을 바꿔야 한다. GC는 object lifetime을 자동화하지만 pause time, write barrier, root scanning이라는 비용을 만든다.</p>
        </div>
      </section>

      <section id="jit" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">JIT: 실행 중 관찰을 compiler 입력으로 쓰기</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>JIT는 interpreter가 실행 중 모은 정보를 이용한다. 어떤 call target이 자주 나오는지, 어떤 type 조합이 반복되는지, 어떤 branch가 거의 항상 참인지 관찰한 뒤 hot path를 native code로 만든다.</p>
          <p>핵심은 guard와 deoptimization이다. “이 값은 계속 number일 것이다” 같은 가정이 맞으면 빠른 코드를 쓰고, 깨지면 안전한 bytecode/interpreter 상태로 돌아간다. 그래서 JIT는 빠른 path와 돌아오는 path를 함께 설계해야 한다.</p>
          <p>자세한 내용은 <a href="/lab/blog/systems/bytecode-runtime-jit">Bytecode Runtime과 JIT</a>에서 이어진다.</p>
        </div>
      </section>
    </div>
  );
}
