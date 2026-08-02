import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import DiffusionProcessScene from './viz/DiffusionProcessScene';
import ForwardMathSection from './ForwardMathSection';
import ForwardReverseDetailScene from './viz/ForwardReverseDetailScene';

export default function ForwardReverse() {
  return (
    <section id="forward-reverse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Forward & Reverse Process</h2>
      <div className="not-prose mb-8"><DiffusionProcessScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Forward Process (노이즈 추가)</h3>
        <p>
          원본 <M>{'x_0'}</M> 에 noise 를 한 번에 크게 넣으면 중간 분포가 복잡하다.
          대신 step <M>{'t'}</M> 마다 작은 noise 크기 <M>{'\\beta_t'}</M> 를 정한다.
          그러면 <M>{'q(x_t\\mid x_{t-1})'}</M> 는 직전 이미지에 Gaussian noise 를 조금 더하는 단순 전이가 된다.
          <M>{'\\beta_t'}</M> 를 모은 경로가 noise schedule.
        </p>

        <ForwardMathSection />

        <CitationBlock source="Ho et al., NeurIPS 2020 — Section 2" citeKey={2} type="paper"
          href="https://arxiv.org/abs/2006.11239">
          <p className="italic">
            "A notable property of the forward process is that it admits sampling x_t at
            an arbitrary timestep t in closed form using the notation
            alpha_bar_t = prod(1 - beta_s)."
          </p>
          <p className="mt-2 text-xs">
            누적곱 <M>{'\\bar\\alpha_t'}</M> 덕분에 중간 step 을 실제로 모두 거치지 않고
            원본에서 임의 시점 <M>{'t'}</M> 의 noisy sample 을 직접 만들 수 있다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Reverse Process (디노이징)</h3>
        <p>
          추론은 <M>{'x_T\\sim\\mathcal N(0,I)'}</M> 에서 시작한다.
          신경망은 매 step 에서 <M>{'\\epsilon_\\theta(x_t,t)'}</M>, 즉 지금 섞인 noise 방향을 예측한다.
          샘플러는 그 방향을 빼서 <M>{'x_{t-1}'}</M> 를 만든다.
          학습 때 실제 <M>{'\\epsilon'}</M> 을 알고 있으므로 목표는 <M>{'\\|\\epsilon-\\epsilon_\\theta(x_t,t)\\|^2'}</M> 로 단순해진다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Forward / Reverse 수식 상세</h3>
        <div className="not-prose"><ForwardReverseDetailScene /></div>
        <p className="leading-7">
          요약 1: <M>{'\\bar\\alpha_t'}</M> 는 원본 신호가 남는 누적 비율이다.<br />
          요약 2: <M>{'x_t'}</M> 는 원본 항과 Gaussian noise 항의 선형 결합이라 학습 샘플을 바로 만들 수 있다.<br />
          요약 3: reverse sampler 는 <M>{'\\epsilon_\\theta'}</M> 를 이용해 한 step 씩 더 깨끗한 상태로 이동한다.
        </p>
      </div>
    </section>
  );
}
