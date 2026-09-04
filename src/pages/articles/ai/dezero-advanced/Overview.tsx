import type { CodeRef } from "@/components/code/types";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { codeRefs } from "./codeRefs";
import OverviewViz from "./viz/OverviewViz";

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">상태가 있는 레이어는 시간과 실행 모드까지 계약에 포함합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          일반적인 feed-forward layer는 현재 입력만으로 출력을 만들지만 RNN과 LSTM은 이전 시점의 상태도 함께 사용합니다. 그래서 forward 식만 구현해서는
          부족합니다. 시퀀스 시작 시 상태를 초기화하는 시점과 truncated BPTT에서 그래프를 끊는 경계까지 명시해야 합니다.
        </p>
        <p>
          이 글은 RNN과 LSTM의 상태 경로를 비교한 뒤 LayerNorm, dropout, embedding으로 범위를 넓힙니다. 서로 다른 기능처럼 보이지만 forward에서 만든
          정보나 실행 모드를 backward 및 다음 호출에 안전하게 전달해야 한다는 점은 모두 같습니다.
        </p>
        <p>
          고정 예제는 hidden dimension 1인 짧은 sequence입니다. 첫 chunk의 마지막 cell state를 다음 chunk로 넘기되 graph는 detach하고 독립
          sample이 시작되면 hidden·cell state를 모두 0으로 reset합니다. 같은 input을 train mode와 eval mode에서 실행해 dropout mask만
          달라지는지, checkpoint 뒤 RNG와 state가 같은지도 함께 검사합니다.
        </p>
      </div>
      <ContentBoundary article="dezero-advanced" />
      <div className="not-prose my-8"><OverviewViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          시퀀스 모델의 gradient 경로를 먼저 이해하고 LSTM cell을 구현한 다음 feature 축 정규화와 train/eval 분기를 추가합니다. 각 기능은 앞 글에서 만든
          파라미터 순회와 자동 미분 계약을 그대로 재사용하므로 세 글을 순서대로 읽으면 미니 프레임워크가 단계적으로 확장되는 구조가 드러납니다.
        </p>
        <p>
          Release에서는 분리한 네 gate와 fused projection의 forward·gradient를 같은 weight로 비교하고 batch·sequence 경계마다
          reset·carry·detach receipt를 남깁니다. Constant input LayerNorm, 반복 ID Embedding, dropout train/eval,
          checkpoint 직전·직후 RNG는 negative fixture로 고정합니다. shape와 finite 값, analytic/finite-difference gradient,
          continuous/resume 결과가 모두 허용 오차 안에 들어온 뒤에만 새 implementation을 채택합니다.
        </p>
      </div>

      <div id="paper-lstm" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Long Short-Term Memory</p>
        <CitationBlock source="Hochreiter & Schmidhuber — Long Short-Term Memory" citeKey={1} type="paper" href="https://doi.org/10.1162/neco.1997.9.8.1735">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> Recurrent gradient가 시간에 따라 사라지거나 불안정해져 긴 지연을 학습하기 어렵습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Memory cell과 multiplicative gate를 사용해 저장·노출되는 정보와 error flow를 제어하는 구조를 제안합니다.</p>
            <p><strong>전제·조건:</strong> 원 논문의 cell 구조, task와 당시 학습 조건에 귀속되며 현대 forget gate 변형과 완전히 같지는 않습니다.</p>
            <p><strong>근거 범위:</strong> Cell state와 gate로 장기 경로를 나누는 핵심 아이디어를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> LSTM이 모든 긴 sequence에서 vanishing gradient를 없애거나 Transformer보다 항상 낫다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div id="paper-layer-normalization" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Layer Normalization</p>
        <CitationBlock source="Ba, Kiros & Hinton — Layer Normalization" citeKey={2} type="paper" href="https://arxiv.org/abs/1607.06450">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> Batch statistic에 의존하지 않고 recurrent·small-batch model의 hidden activation scale을 안정화해야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Sample 안 hidden units의 mean·variance로 정규화하고 학습 가능한 gain·bias를 적용합니다.</p>
            <p><strong>전제·조건:</strong> 논문 architecture·axis 정의와 실험 조건이며 이후 framework의 normalized_shape API는 별도 확인이 필요합니다.</p>
            <p><strong>근거 범위:</strong> BatchNorm과 구분되는 sample-wise feature normalization의 출처입니다.</p>
            <p><strong>비주장:</strong> LayerNorm이 모든 layer 위치에서 안정성이나 성능을 자동으로 높인다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div id="paper-dropout" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Dropout</p>
        <CitationBlock source="Srivastava et al. — Dropout" citeKey={3} type="paper" href="https://jmlr.org/papers/v15/srivastava14a.html">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> Units가 training examples에 함께 적응하며 overfitting하는 현상을 줄여야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Training 중 units를 확률적으로 제거하고 test time에는 전체 network를 사용하는 regularization을 제안합니다.</p>
            <p><strong>전제·조건:</strong> 논문의 architecture·drop probability·dataset과 test-time approximation 조건입니다.</p>
            <p><strong>근거 범위:</strong> Train/eval mode와 mask 재사용·scaling을 분리해야 하는 이유를 설명합니다.</p>
            <p><strong>비주장:</strong> Dropout이 normalization·data augmentation을 대체하거나 모든 modern architecture에 필요하다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
