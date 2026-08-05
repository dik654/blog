const stages = [
  ['Semantic analysis', 'symbol table, scope, type, control-flow 제약을 검사한다. 문법은 맞지만 의미가 틀린 프로그램을 걸러낸다.'],
  ['Lowering', 'AST를 IR로 낮춘다. 언어 표면 기능을 더 단순한 operation과 control flow로 바꾼다.'],
  ['Optimization', '의미를 보존하면서 더 싼 계산으로 바꾼다. data-flow analysis가 근거가 된다.'],
  ['Backend', 'IR을 target instruction, register, stack frame, ABI 규칙에 맞춘다.'],
];

const analyses = [
  ['Name resolution', 'identifier를 declaration에 연결한다. shadowing, module import, namespace, overload 후보가 여기서 정리된다.'],
  ['Type checking', '값의 형태와 operation 가능성을 검사한다. inference, generics, trait/interface constraint가 붙을 수 있다.'],
  ['Definite assignment', '사용 전에 초기화됐는지, 모든 return path가 값을 내는지 같은 control-flow 성질을 본다.'],
  ['Escape analysis', '값이 stack frame 밖으로 살아남는지 판단한다. allocation 위치와 closure representation에 영향을 준다.'],
];

const optimizations = [
  ['Constant folding', '`2 * 3`을 compile time에 `6`으로 바꾼다.'],
  ['Dead code elimination', '결과가 관찰되지 않는 계산이나 도달 불가능한 block을 제거한다.'],
  ['Common subexpression', '같은 값을 반복 계산하지 않도록 재사용한다.'],
  ['Loop optimization', 'loop-invariant code motion, induction variable simplification, strength reduction으로 반복 비용을 줄인다.'],
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

export default function CompilerPipelineArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">컴파일러는 의미를 확정하고 표현을 낮춘다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>컴파일러는 단순 번역기가 아니다. parser가 만든 AST를 받아 이름과 타입을 확정하고, 언어 기능을 더 낮은 표현으로 바꾸고, 그 표현을 분석해 더 효율적인 형태로 바꾼 뒤, target machine이나 VM이 실행할 수 있는 code를 만든다. 이 글은 전체 지도이고, 자세한 내용은 의미 분석, IR/SSA, 최적화/코드 생성 글로 나눠 읽는다.</p>
          <p>핵심 질문은 “이 변환이 의미를 보존하는가”다. source 모양은 바뀌어도 관찰 가능한 결과가 같아야 한다. 그래서 컴파일러는 data structure보다 proof obligation에 가깝다. 각 pass는 무언가를 가정하고, 검사하고, 더 제한된 표현으로 넘긴다.</p>
        </div>
        <Cards rows={stages} />
      </section>

      <section id="semantics" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">정적 의미 분석: grammar 밖의 오류 잡기</h2>
        <Cards rows={analyses} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>`x = y + 1`은 문법적으로 맞아도 `y`가 선언되지 않았으면 틀렸다. `return`이 함수 밖에 있어도 문법만으로는 모를 수 있다. generic 함수 호출은 type argument를 추론해야 하고, method call은 receiver type에서 후보를 찾아야 한다.</p>
          <p>symbol table은 이 단계의 중심 자료구조다. scope가 중첩되면 같은 이름이 다른 declaration을 가리킬 수 있다. closure가 있으면 local variable이 stack frame보다 오래 살아야 할 수도 있다. 의미 분석은 runtime representation까지 영향을 준다.</p>
          <p>자세한 내용은 <a href="/lab/blog/systems/semantic-analysis">정적 의미 분석</a>에서 분리해 다룬다.</p>
        </div>
      </section>

      <section id="ir" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">IR, CFG, SSA: 최적화하기 좋은 표현</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>AST는 언어 구조를 보존하기 좋지만 최적화에는 너무 높다. `for`, `while`, `break`, `continue`, `try` 같은 문법 구조는 control flow를 숨긴다. IR은 source language와 target machine 사이에서 분석하기 쉬운 공용 표현이다.</p>
          <p>CFG(Control-Flow Graph)는 basic block을 node로, jump를 edge로 둔다. SSA(Static Single Assignment)는 각 값이 한 번만 정의되게 만들어 “이 값은 어디서 왔는가”를 분명하게 한다. phi node는 여러 predecessor에서 온 값을 하나로 합친다.</p>
          <p>IR을 잘 설계하면 frontend와 backend가 분리된다. Rust, C, Swift 같은 서로 다른 언어가 LLVM IR로 내려가고, LLVM backend가 x86, ARM, RISC-V 같은 target으로 내릴 수 있는 이유가 여기에 있다.</p>
          <p>자세한 내용은 <a href="/lab/blog/systems/ir-ssa">IR·CFG·SSA</a>에서 이어진다.</p>
        </div>
      </section>

      <section id="optimization" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">최적화: 더 싼 계산으로 바꾸되 같은 의미를 유지하기</h2>
        <Cards rows={optimizations} />
        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <p>최적화는 “빠르게 만들기”가 아니라 “관찰 가능한 의미를 보존하는 변환”이다. aliasing, overflow, floating-point NaN, memory ordering 같은 세부 규칙 때문에 단순해 보이는 변환도 틀릴 수 있다.</p>
          <p>backend에서는 instruction selection, register allocation, calling convention, stack layout이 붙는다. 여기서부터는 target ABI와 hardware 제약이 강해진다. 좋은 컴파일러는 high-level 의미와 low-level 제약 사이를 끊지 않고 추적한다.</p>
          <p>자세한 내용은 <a href="/lab/blog/systems/optimization-codegen">최적화와 코드 생성</a>에서 다룬다.</p>
        </div>
      </section>
    </div>
  );
}
