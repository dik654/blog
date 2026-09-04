import type { CodeRef } from "@/components/code/types";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { codeRefs } from "./codeRefs";
import OverviewViz from "./viz/OverviewViz";

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">자동 미분 다음에는 파라미터와 학습 상태를 관리해야 합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          앞 글의 자동 미분 엔진만으로도 개별 함수의 gradient는 구할 수 있습니다. 그러나 신경망을 학습하려면 모델에 속한 파라미터를 빠짐없이 찾고 예측과 loss를 계산한 뒤
          optimizer가 같은 파라미터를 반복해서 갱신하도록 공통 구조를 만듭니다.
        </p>
        <p>
          이 글에서는 <code>Layer</code>와 <code>Model</code>의 역할을 먼저 정한 뒤 Linear, activation, SGD·Adam, 전체 학습 루프 순서로 확장합니다. PyTorch API를 그대로 복제하기보다 각 상태가 어느 객체에 속해야 하는지와, 다음 단계가 이전 단계의 어떤 계약에 의존하는지를 중심으로 봅니다.
        </p>
        <p>
          고정 예제는 feature가 2개인 sample 4개를 3개 output으로 보내는 Linear layer입니다. <code>X</code> shape은 4×2, <code>W</code>는 2×3, <code>b</code>는 길이 3이며, forward 결과는 4×3입니다. 이 shape와 parameter 9개를 기준으로 초기화, backward, optimizer state와 checkpoint가 같은 parameter identity를 가리키는지 끝까지 확인합니다.
        </p>
      </div>
      <ContentBoundary article="dezero-nn" />
      <div className="not-prose my-8"><OverviewViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          구현을 따라갈 때는 매 단계마다 shape test와 수치 gradient check를 유지합니다. forward 값이 맞아도 broadcasting이나 gradient 누적이
          틀릴 수 있기 때문입니다. 이 기본 학습 루프가 안정적으로 동작한 다음에야 시퀀스 상태, normalization, dropout 같은 기능을 추가할 수 있습니다.
        </p>
        <p>
          Model의 parameter 탐색은 하위 Layer를 등록 순서대로 재귀 순회하되 같은 parameter identity를 두 번 update하지 않아야 합니다. 이름만 같은
          다른 tensor와 두 경로가 공유하는 같은 tensor를 구분하고 checkpoint에는 stable parameter ID와 shape, dtype, 순서를 manifest로
          남깁니다. 새 Layer를 추가한 뒤 전체 trainable parameter 수와 optimizer coverage가 함께 늘어나는지를 test하면 누락과 중복 등록이 일찍
          드러납니다.
        </p>
      </div>

      <div id="paper-xavier-initialization" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Xavier initialization</p>
        <CitationBlock source="Glorot & Bengio — Understanding the Difficulty of Training Deep Feedforward Neural Networks" citeKey={1} type="paper" href="https://proceedings.mlr.press/v9/glorot10a.html">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> 깊은 feed-forward network에서 sigmoid saturation과 층별 activation·gradient scale이 학습을 어렵게 만듭니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Forward와 backward signal variance를 함께 고려한 initialization scale과 실험 분석을 제시합니다.</p>
            <p><strong>전제·조건:</strong> 논문의 activation, architecture, dataset과 당시 optimization 조건에 귀속됩니다.</p>
            <p><strong>근거 범위:</strong> Fan-in·fan-out을 고려하는 초기화의 문제의식과 Xavier 계열 scale을 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 하나의 initialization이 모든 activation·normalization·residual architecture에서 최적이라는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div id="paper-adam" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Adam</p>
        <CitationBlock source="Kingma & Ba — Adam" citeKey={2} type="paper" href="https://arxiv.org/abs/1412.6980">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> Noisy·sparse gradient에서도 coordinate별 update scale을 적응적으로 정해야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Gradient의 1차·2차 raw moment EMA와 초기 bias correction을 결합한 update rule을 제안합니다.</p>
            <p><strong>전제·조건:</strong> 논문의 algorithm, hyperparameter와 convergence 분석·benchmark 범위입니다.</p>
            <p><strong>근거 범위:</strong> 이 글의 Adam state <code>m</code>·<code>v</code>·step과 bias correction 식의 출처입니다.</p>
            <p><strong>비주장:</strong> Adam이 모든 objective에서 SGD보다 일반화가 좋거나 default hyperparameter가 항상 안전하다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div id="paper-adamw" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · AdamW</p>
        <CitationBlock source="Loshchilov & Hutter — Decoupled Weight Decay Regularization" citeKey={3} type="paper" href="https://arxiv.org/abs/1711.05101">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> Adaptive gradient scaling 안에 L2 penalty를 넣으면 plain SGD의 weight decay와 같은 update가 되지 않습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Parameter shrinkage를 adaptive gradient transformation과 분리한 AdamW를 제안합니다.</p>
            <p><strong>전제·조건:</strong> 논문 optimizer 정의와 실험 recipe·search 범위에서 해석합니다.</p>
            <p><strong>근거 범위:</strong> Adam의 data gradient state와 weight decay를 별도 update로 구현해야 하는 경계를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 모든 parameter에 같은 decay를 적용해야 하거나 AdamW가 모든 regularization을 대체한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
