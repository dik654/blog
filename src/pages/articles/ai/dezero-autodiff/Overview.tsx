import type { CodeRef } from "@/components/code/types";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { codeRefs } from "./codeRefs";
import VariableViz from "./viz/VariableViz";

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">자동 미분은 값과 계산 이력을 함께 다루는 문제입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          신경망의 미분식을 매번 손으로 전개하지 않으려면 순전파에서 어떤 연산이 어떤 값을 만들었는지 기록해야 합니다. 출력에서 이 기록을 거꾸로 따라가며 chain rule을 적용하는
          방식이 reverse-mode automatic differentiation이며 PyTorch의 동적 계산 그래프도 같은 큰 흐름을 따릅니다.
        </p>
        <p>
          이 글은 DeZero의 교육용 설계를 Rust로 옮겨 <code>Variable</code>, <code>Function</code>, 계산 그래프와 backward를 직접 구현합니다. 완성된 프레임워크 사용법을 설명하기보다, 값·gradient·연산 순서·소유권이 왜 함께 설계되어야 하는지를 확인하는 첫 번째 글입니다.
        </p>
        <p>
          끝까지 사용할 예제는 <code>y=x²+x²</code>, <code>x=3</code>입니다. Forward에서는 같은 <code>x</code>가 두 제곱 연산으로 갈라진 뒤 더해지고, backward에서는 두 경로가 보낸 gradient <code>2x</code>와 <code>2x</code>를 합쳐 12를 만들어야 합니다. 이 작은 예제 하나만으로 graph 기록, 역순 실행, gradient 누적과 중간값 수명을 모두 검사할 수 있습니다.
        </p>
      </div>
      <ContentBoundary article="dezero-autodiff" />
      <div className="not-prose my-8"><VariableViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          먼저 순전파에서 그래프를 만드는 과정을 보고, 이어서 gradient 누적과 고차 미분을 구현합니다. 마지막에는 <code>Rc</code>·<code>RefCell</code>·<code>Weak</code>이 이 다대다 그래프를 어떻게 안전하게 표현하는지 정리합니다. 다음 글인 신경망 레이어 구현은 여기서 만든 자동 미분 엔진을 그대로 사용합니다.
        </p>
      </div>

      <div id="paper-dezero-project" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">근거 읽기 · DeZero 원 프로젝트</p>
        <CitationBlock source="Deep Learning from Scratch 3 — DeZero" citeKey={1} type="code" href="https://github.com/oreilly-japan/deep-learning-from-scratch-3">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> 자동 미분과 신경망 기능을 black box API가 아니라 작은 단계로 직접 구현하며 이해해야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Variable·Function·define-by-run graph·backward·고차 미분을 한 단계씩 확장하는 교육용 reference를 제공합니다.</p>
            <p><strong>전제·조건:</strong> 원본은 Python·NumPy 중심이며 이 글의 Rust ownership 구조와 API는 별도 교육용 구현입니다.</p>
            <p><strong>근거 범위:</strong> 기능을 도입하는 순서와 DeZero 개념 계보를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 이 글의 Rust code가 원 프로젝트의 공식 port이거나 production framework와 같은 성능·안전성을 보장한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div id="paper-pytorch-autograd" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">근거 읽기 · PyTorch autograd mechanics</p>
        <CitationBlock source="PyTorch documentation — Autograd mechanics" citeKey={2} type="paper" href="https://docs.pytorch.org/docs/stable/notes/autograd.html">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> 실제 동적 자동미분에서 graph 재생성, saved tensor와 gradient mode가 어떻게 동작하는지 확인해야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Forward 중 기록되는 graph, backward용 저장값과 no-grad·inference mode의 현재 동작을 공식 문서로 설명합니다.</p>
            <p><strong>전제·조건:</strong> PyTorch의 현재 release와 tensor/version-counter 구현에 귀속되는 설명입니다.</p>
            <p><strong>근거 범위:</strong> 동적 graph와 gradient-recording mode의 일반적 production 경계를 비교하는 데 사용합니다.</p>
            <p><strong>비주장:</strong> PyTorch 내부 구조가 이 Rust 예제의 <code>Rc</code>·<code>RefCell</code> 설계와 같다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div id="paper-chainer-define-by-run" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Chainer와 define-by-run</p>
        <CitationBlock source="Tokui et al. — Chainer" citeKey={3} type="paper" href="https://arxiv.org/abs/1710.06789">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> Network 구조가 data와 control flow에 따라 달라지는 연구 code를 정적 graph만으로 다루기 어렵습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> 실행한 operation으로 graph를 만드는 define-by-run 방식과 연구 iteration을 지원하는 framework 설계를 제시합니다.</p>
            <p><strong>전제·조건:</strong> Chainer architecture와 논문 당시 benchmark·hardware·framework 비교 조건입니다.</p>
            <p><strong>근거 범위:</strong> 동적 계산 graph가 등장한 연구 맥락과 설계 의도를 설명합니다.</p>
            <p><strong>비주장:</strong> Define-by-run이 모든 workload에서 정적 graph보다 빠르거나 이 글의 구현이 Chainer와 동등하다는 결론은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
