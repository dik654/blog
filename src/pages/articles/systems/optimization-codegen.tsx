const scalarOpts = [
  ['Constant folding', 'compile time에 알 수 있는 식을 미리 계산한다. overflow, NaN, language mode가 안전성을 결정한다.'],
  ['Dead code elimination', '관찰 가능한 효과가 없고 결과가 쓰이지 않는 instruction을 제거한다. side effect 모델이 필요하다.'],
  ['GVN / CSE', '같은 값을 계산하는 expression을 하나로 합친다. value numbering과 dominance가 근거다.'],
  ['Inlining', 'call overhead를 줄이고 caller context에서 최적화를 열지만 code size와 compile time을 키운다.'],
];

const loopOpts = [
  ['LICM', 'loop 안에서 변하지 않는 계산을 loop 밖으로 옮긴다. alias와 exception 가능성을 확인해야 한다.'],
  ['Induction variables', '반복마다 일정하게 변하는 값을 단순화한다. bounds check 제거와 vectorization의 기반이다.'],
  ['Unrolling', 'loop overhead를 줄이고 ILP를 늘리지만 instruction cache와 code size를 압박한다.'],
  ['Vectorization', '여러 iteration을 SIMD operation으로 묶는다. memory alignment와 dependency가 관건이다.'],
];

const backendRows = [
  ['Instruction selection', 'IR operation을 target instruction으로 고른다. pattern matching, legalization, target feature가 들어간다.'],
  ['Register allocation', '무한한 가상 register를 제한된 물리 register에 배치한다. spill은 stack memory access가 된다.'],
  ['Scheduling', 'pipeline hazard와 latency를 고려해 instruction 순서를 조정한다. out-of-order CPU라도 compiler scheduling이 의미 있다.'],
  ['Emission', 'machine code, relocation, symbol, debug info, object file section을 만든다. linker와 ABI 규칙을 따른다.'],
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

export default function OptimizationCodegenArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">최적화는 의미 보존 변환이다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>최적화는 코드를 “똑똑하게 바꾸기”가 아니다. 더 정확히는 관찰 가능한 의미를 보존하면서 더 싼 프로그램으로 바꾸는 일이다. 프로그램이 읽고 쓰는 memory, 발생시키는 exception, 수행하는 I/O, thread 사이의 ordering, floating-point corner case까지 모두 의미의 일부일 수 있다.</p>
          <p>그래서 compiler optimization은 공격적으로 보이지만 실제로는 보수적이다. compiler가 어떤 변환을 하지 않는다면 보통 몰라서가 아니라 증명할 수 없기 때문이다. alias가 있을 수 있고, pointer가 같은 object를 가리킬 수 있고, function call이 전역 상태를 바꿀 수 있으면 많은 최적화가 막힌다.</p>
        </div>
      </section>

      <section id="scalar" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Scalar Optimization: 값 하나의 흐름을 단순화하기</h2>
        <Grid rows={scalarOpts} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>scalar optimization은 보통 SSA 위에서 강하다. value가 어디서 정의되고 어디서 쓰이는지 명확하면 constant propagation, copy propagation, DCE가 자연스럽게 이어진다. `if false` branch 제거, `x + 0` 제거, 같은 계산 재사용 같은 기본 pass가 여기에 있다.</p>
          <p>하지만 사소해 보이는 변환도 언어 규칙에 묶인다. C의 signed overflow는 undefined behavior라 aggressive optimization의 근거가 되지만, Java나 JavaScript의 number semantics는 다르다. floating-point는 associativity가 깨질 수 있어 `a + (b + c)`를 `(a + b) + c`로 마음대로 바꾸면 안 된다.</p>
        </div>
      </section>

      <section id="loop" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Loop Optimization: 대부분의 시간이 반복문 안에 있다</h2>
        <Grid rows={loopOpts} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>loop는 최적화의 중심이다. 프로그램 시간의 큰 부분이 반복문에서 소비되기 때문이다. loop-invariant code motion은 반복마다 같은 값을 밖으로 빼고, induction variable simplification은 주소 계산과 bounds check를 줄이며, vectorization은 여러 iteration을 한 instruction으로 처리한다.</p>
          <p>loop 최적화의 적은 dependency다. 이번 iteration의 write가 다음 iteration의 read에 영향을 주면 순서를 바꾸기 어렵다. pointer aliasing, function call side effect, exception possibility도 loop transform을 막는다. high-level 언어에서는 bounds check와 dynamic dispatch가 추가 장벽이 된다.</p>
        </div>
      </section>

      <section id="alias-memory" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Alias와 Memory: 가장 어려운 최적화 경계</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>`*p = 1; x = *q`에서 `p`와 `q`가 같은 위치를 가리킬 수 있으면 두 instruction의 순서를 마음대로 바꿀 수 없다. alias analysis는 두 memory reference가 같은 object를 볼 수 있는지 추정한다. 정확하면 최적화가 열리고, 부정확하면 안전하게 포기해야 한다.</p>
          <p>memory는 SSA보다 어렵다. register value는 definition과 use가 분명하지만, memory는 주소 계산, pointer escape, call side effect, concurrency까지 얽힌다. 그래서 compiler는 memory SSA, mod/ref analysis, escape analysis, restrict/noalias annotation 같은 장치를 쓴다.</p>
          <p>concurrency가 들어오면 더 어렵다. atomic, volatile, memory fence, data race 규칙은 optimizer의 재배치를 제한한다. single-thread 의미로 안전한 변환이 multi-thread 관찰에서는 틀릴 수 있다.</p>
        </div>
      </section>

      <section id="backend" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">Backend: target machine의 제약으로 내려가기</h2>
        <Grid rows={backendRows} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>backend는 abstract operation을 target instruction으로 바꾼다. `add` 하나도 immediate form이 있는지, flag를 갱신하는지, vector register를 쓰는지, addressing mode가 memory operand를 허용하는지에 따라 선택이 달라진다.</p>
          <p>register allocation은 backend의 핵심 난제다. IR은 가상 register를 무한히 쓸 수 있지만 CPU register는 제한되어 있다. register가 부족하면 값을 stack에 spill해야 하고, spill load/store는 성능을 깎는다. 좋은 allocator는 liveness interval과 loop hotness를 고려해 중요한 값을 register에 남긴다.</p>
        </div>
      </section>

      <section id="abi" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">ABI와 Calling Convention: 내 코드가 다른 코드와 만나는 약속</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>codegen은 machine instruction만 만들면 끝이 아니다. 함수 인자를 어떤 register와 stack slot에 둘지, return value를 어디에 둘지, caller/callee 중 누가 register를 보존할지, stack alignment를 어떻게 맞출지, exception unwinding metadata를 어떻게 만들지 ABI가 정한다.</p>
          <p>ABI는 성능과 호환성의 경계다. Rust 함수가 C 함수를 호출하고, Python extension이 native library를 부르고, JIT code가 runtime helper를 호출할 수 있는 이유는 calling convention과 object file/linker 규칙을 공유하기 때문이다. compiler backend는 target ISA뿐 아니라 platform ABI까지 구현해야 한다.</p>
        </div>
      </section>
    </div>
  );
}
