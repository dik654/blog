import { CitationBlock } from '@/components/ui/citation';
import VAEPipelineViz from './viz/VAEPipelineViz';
import ELBODerivationViz from './viz/ELBODerivationViz';
import ModelCompareViz from './viz/ModelCompareViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">VAE 개요: 확률적 생성 모델</h2>
      <div className="not-prose mb-8"><VAEPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-2xl">
        <p>
          VAE(Variational Autoencoder) — 입력 데이터를 <strong>확률 분포</strong>로 압축한 뒤,
          그 분포에서 샘플링하여 새로운 데이터를 생성하는 모델이다.
        </p>
        <p>
          치킨집 비유로 이해해 보자.
          양념치킨 소스의 배합 비율(간장 몇 %, 마늘 몇 %)을 알면
          기존 맛을 재현할 뿐 아니라 <strong>비율을 살짝 바꿔 새 양념</strong>도 만들 수 있다.<br />
          VAE의 잠재 공간이 바로 이 "배합 비율표"에 해당한다.
        </p>

        <CitationBlock source="Kingma & Welling, 2014 — Auto-Encoding Variational Bayes"
          citeKey={1} type="paper" href="https://arxiv.org/abs/1312.6114">
          <p className="italic">
            "We introduce a stochastic variational inference and learning algorithm
            that scales to large datasets and, under some mild differentiability
            conditions, even works in the intractable case."
          </p>
          <p className="mt-2 text-xs">
            VAE 원논문 — Reparameterization Trick으로 역전파 가능한 샘플링을 제안
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">이 글의 흐름</h3>
        <ol>
          <li>AE vs VAE — 잠재 공간의 근본적 차이</li>
          <li>인코더 — 입력을 μ, log σ²로 변환하는 숫자 계산</li>
          <li>Reparameterization Trick — 역전파를 가능하게 만드는 핵심</li>
          <li>디코더 — z를 원본 크기로 복원</li>
          <li>손실 함수 — 재구성 손실 + KL Divergence</li>
        </ol>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">VAE 변분 추론 수학적 배경</h3>
        <div className="not-prose"><ELBODerivationViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">AE vs VAE vs GAN 비교</h3>
        <div className="not-prose"><ModelCompareViz /></div>
        <p className="leading-7">
          요약 1: VAE는 <strong>변분 추론 + 신경망</strong> — log p(x) 대신 ELBO 최대화.<br />
          요약 2: <strong>ELBO = 재구성 - KL</strong> — 두 항의 균형이 핵심.<br />
          요약 3: Stable Diffusion의 <strong>latent space</strong>도 VAE가 제공 — 여전히 실용적 중요성.
        </p>
      </div>
    </section>
  );
}
