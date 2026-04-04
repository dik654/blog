import { CitationBlock } from '@/components/ui/citation';
import DiffusionProcessViz from './viz/DiffusionProcessViz';
import ForwardMathSection from './ForwardMathSection';

export default function ForwardReverse() {
  return (
    <section id="forward-reverse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Forward & Reverse Process</h2>
      <div className="not-prose mb-8"><DiffusionProcessViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Forward Process (노이즈 추가)</h3>
        <p>
          Forward process — 원본 이미지 x_0에 T 단계에 걸쳐 가우시안 노이즈를 점진적으로 추가<br />
          각 단계 t에서 <strong>q(x_t | x_(t-1))</strong>는 소량의 노이즈를 더하는 가우시안 전이<br />
          스케줄 beta_t가 노이즈 강도를 제어
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
            Reparameterization trick 덕분에 중간 단계를 거치지 않고
            원본에서 임의 시점 t의 노이즈 이미지를 직접 샘플링할 수 있습니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Reverse Process (디노이징)</h3>
        <p>
          Reverse process — x_T ~ N(0, I)에서 시작하여 단계별로 노이즈 제거<br />
          신경망 epsilon_theta가 각 시점에서 <strong>추가된 노이즈를 예측</strong>하고 이를 빼서 x_(t-1)을 복원<br />
          학습 목표: 단순한 <strong>MSE 손실</strong>(예측 노이즈와 실제 노이즈 간의 차이를 최소화)
        </p>
      </div>
    </section>
  );
}
