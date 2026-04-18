import { CitationBlock } from '@/components/ui/citation';
import VAEArchViz from './viz/VAEArchViz';
import LatentWalkViz from './viz/LatentWalkViz';

export default function LatentSpace() {
  return (
    <section id="latent-space" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">잠재 변수와 인코더-디코더 구조</h2>
      <div className="not-prose mb-8"><VAEArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">인코더 q(z|x)</h3>
        <p>
          인코더 네트워크 — 입력 x를 받아 잠재 분포의 파라미터 출력<br />
          <strong>평균 벡터 mu</strong>와 <strong>로그 분산 log(sigma^2)</strong><br />
          이 두 값이 가우시안 분포 N(mu, sigma^2)를 정의
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">디코더 p(x|z)</h3>
        <p>
          디코더 네트워크 — 잠재 변수 z를 받아 원본 입력과 같은 차원의 출력 생성<br />
          이미지의 경우 각 픽셀의 확률(베르누이) 또는 평균(가우시안)을 출력
        </p>

        <CitationBlock source="Doersch, 2016 — Tutorial on VAEs"
          citeKey={2} type="paper" href="https://arxiv.org/abs/1606.05908">
          <p className="italic">
            "The key idea behind the VAE is that we want to be able to sample from the
            latent space to generate new data points. This requires the latent space
            to be continuous and complete."
          </p>
          <p className="mt-2 text-xs">
            잠재 공간의 연속성과 완전성이 왜 중요한지 직관적으로 설명하는 튜토리얼
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">사전 분포 p(z)</h3>
        <p>
          VAE의 사전 분포 — <strong>표준 정규분포 N(0, I)</strong> 가정<br />
          KL Divergence 항이 인코더 출력 q(z|x)를 사전 분포에 가깝게 정규화<br />
          잠재 공간이 원점 주위에 고르게 분포하도록 유도
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">잠재 공간 시각화와 응용</h3>
        <div className="not-prose"><LatentWalkViz /></div>
        <p className="leading-7">
          요약 1: VAE 잠재 공간은 <strong>클래스 클러스터 + 원점 밀집</strong> 구조.<br />
          요약 2: <strong>latent walk</strong>로 부드러운 형태 변환 생성 가능.<br />
          요약 3: 이상 탐지·압축·스타일 전환 등 <strong>다양한 실무 응용</strong>.
        </p>
      </div>
    </section>
  );
}
