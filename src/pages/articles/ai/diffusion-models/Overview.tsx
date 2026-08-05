import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import GenerativeTimelineScene from './viz/GenerativeTimelineScene';
import DDPMMathScene from './viz/DDPMMathScene';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">생성 모델 계보와 Diffusion의 등장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="lead">
          생성 모델의 첫 질문은 단순하다. <strong>무작위 값에서 실제 데이터처럼 보이는 샘플을 어떻게 만들 것인가?</strong>
          어려운 점은 답을 한 번에 만들수록 생성 함수 하나가 데이터 분포 전체를 동시에 배워야 한다는 데 있다.
        </p>
        <p>
          VAE는 안정적으로 학습하지만 결과가 흐려질 수 있다. GAN은 선명하지만 생성자와 판별자의 균형이 깨지기 쉽고,
          일부 mode만 만드는 문제가 생긴다. Normalizing Flow는 정확한 likelihood를 계산하는 대신 가역 구조 제약을 받는다.
          서로 다른 방법처럼 보이지만 공통 부담은 random source <M>{'z'}</M>에서 image <M>{'x_0'}</M>로 가는 큰 변환을
          한 모델이 책임진다는 점이다.
        </p>
        <p>
          Diffusion은 문제를 바꾼다. 바로 이미지를 만들지 않고, 실제 이미지에 작은 noise를 여러 번 더해
          <M>{'x_0 \\to x_1 \\to \\cdots \\to x_T'}</M> 경로를 먼저 만든다. 그러면 생성은 이 경로를 거꾸로 따라가며
          매 단계에서 조금씩 noise를 제거하는 문제로 분해된다. 아래 장면은 이 전환이 왜 학습을 단순하게 만드는지 보여준다.
        </p>
      </div>

      <div className="not-prose my-8"><GenerativeTimelineScene /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          장면의 핵심은 모델 이름의 연도가 아니다. <strong>한 번의 어려운 변환을 여러 개의 작은 복원 문제로 나눈 것</strong>이
          Diffusion의 구조적 변화다. step <M>{'t'}</M>의 noise 크기 <M>{'\\beta_t'}</M>를 작게 잡으면 forward
          <M>{'q'}</M>는 단순 Gaussian 전이로 고정되고, 모델은 현재 <M>{'x_t'}</M>에서 제거할 noise 방향만 학습하면 된다.
          이를 구체적으로 구현한 것이 <strong>DDPM</strong>이다.
        </p>

        <CitationBlock source="Ho et al., NeurIPS 2020 — DDPM" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2006.11239">
          <p className="italic">
            "We show that diffusion models can generate samples matching the quality of GANs,
            while offering stable training and mode coverage."
          </p>
          <p className="mt-2 text-xs">
            DDPM은 image 품질을 높이면서도 adversarial 학습 없이 안정적인 objective를 제시했다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 아이디어</h3>
        <p>
          Forward는 <M>{'x_0 \\to x_1 \\to \\cdots \\to x_T'}</M>다.
          각 step은 직전 상태와 <M>{'\\beta_t'}</M>만 본다.
          마지막 <M>{'x_T'}</M>는 거의 <M>{'\\mathcal N(0,I)'}</M>다.
          Reverse는 <M>{'x_T'}</M>에서 시작해 <M>{'\\epsilon_\\theta(x_t,t)'}</M>로 noise 방향을 예측하고 한 step씩 뺀다.
          이 “직전 상태만 보는 step chain”이 Markov chain이라는 이름으로 정리된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Diffusion 모델의 수학적 기반</h3>
        <p>
          여기서 구분할 것은 두 가지다. Forward의 noise 규칙은 사람이 고정하고, reverse에서 noise를 예측하는
          <M>{'\\epsilon_\\theta'}</M>만 학습한다. 따라서 아래 식에서는 먼저 <M>{'x_t'}</M>를 어떻게 직접 만드는지,
          다음으로 그때 넣은 실제 noise <M>{'\\epsilon'}</M>를 어떻게 정답으로 쓰는지 따라가면 된다.
        </p>
      </div>

      <div className="not-prose my-8"><DDPMMathScene /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <M>{'\\beta_t'}</M>로 작은 Gaussian forward step을 고정한다.<br />
          요약 2: 학습은 실제 noise <M>{'\\epsilon'}</M>와 예측 noise <M>{'\\epsilon_\\theta'}</M>의 MSE로 귀결된다.<br />
          요약 3: 많은 작은 reverse step을 빠르게 줄이는 방향으로 DDIM, solver, flow matching이 이어진다.
        </p>
      </div>
    </section>
  );
}
