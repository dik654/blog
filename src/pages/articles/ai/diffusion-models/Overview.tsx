import { CitationBlock } from '@/components/ui/citation';
import GenerativeTimelineViz from './viz/GenerativeTimelineViz';
import DDPMMathViz from './viz/DDPMMathViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">생성 모델 계보와 Diffusion의 등장</h2>
      <div className="not-prose mb-8"><GenerativeTimelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          생성 모델의 계보: <strong>GAN</strong>(2014, 적대적 학습) → <strong>VAE</strong>(잠재 공간 학습) → <strong>Normalizing Flow</strong>(역변환 가능한 분포 변환) → <strong>Diffusion Model</strong>
        </p>
        <p>
          DDPM(Denoising Diffusion Probabilistic Models) — 2020년 Ho et al. 제안<br />
          데이터에 <strong>점진적으로 노이즈를 추가</strong>한 뒤 이를 <strong>역으로 제거</strong>하는 과정을 학습<br />
          GAN과 달리 mode collapse(모드 붕괴, 다양성 상실) 없음 — 학습이 안정적
        </p>

        <CitationBlock source="Ho et al., NeurIPS 2020 — DDPM" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2006.11239">
          <p className="italic">
            "We show that diffusion models can generate samples matching the quality of GANs,
            while offering stable training and mode coverage."
          </p>
          <p className="mt-2 text-xs">
            DDPM은 이미지 생성 품질에서 GAN에 필적하면서도 학습 안정성과
            다양성 측면에서 우위를 보여, Diffusion 모델 시대를 열었습니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 아이디어</h3>
        <p>
          DDPM의 핵심 — <strong>마르코프 체인</strong>(Markov Chain, 현재 상태가 직전 상태에만 의존하는 확률 과정)을 통한 점진적 변환<br />
          Forward process: T 단계에 걸쳐 가우시안 노이즈 추가<br />
          Reverse process: 신경망이 각 단계의 노이즈를 예측하여 제거<br />
          최종적으로 순수 가우시안 노이즈에서 고품질 이미지 생성
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Diffusion 모델의 수학적 기반</h3>
        <div className="not-prose"><DDPMMathViz /></div>
        <p className="leading-7">
          요약 1: Diffusion은 <strong>점진적 denoising</strong>으로 이미지 생성 — GAN의 적대적 학습과 반대.<br />
          요약 2: <strong>Simple Loss (MSE)</strong>만으로 학습 — GAN 대비 훨씬 안정.<br />
          요약 3: 2022년 이후 <strong>생성 모델의 주류</strong> — Stable Diffusion·DALL-E·Sora 등.
        </p>
      </div>
    </section>
  );
}
