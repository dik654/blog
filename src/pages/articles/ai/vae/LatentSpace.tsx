import { CitationBlock } from '@/components/ui/citation';
import VAEArchViz from './viz/VAEArchViz';

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 2D 잠재 공간 시각화 (MNIST)
//
// VAE 학습 후 2D latent 공간 맵:
//
//        z_2
//         ↑
//    ┌────────────┐
//    │ 9 8 7      │
//    │  6 5 4     │
//    │   3 2 1    │
//    │    0       │
//    └────────────┘ → z_1
//
// 관찰:
//   - 숫자 클래스가 클러스터 형성
//   - 유사한 숫자(3-8, 4-9)는 인접
//   - 원점 부근에 밀집 (prior 영향)
//   - 경계 영역은 변형 형태

// 잠재 공간 산책 (Latent Walk):
//
// z_start = [1.5, 0.5]    # 시작 (숫자 "3")
// z_end   = [-0.5, -1.5]  # 끝 (숫자 "7")
//
// 10 단계 선형 보간:
//   for t in 0.0 to 1.0 step 0.1:
//     z = (1-t) * z_start + t * z_end
//     img = decoder(z)
//     save(img)
//
// 결과: 3 → 3 → 3 → 2 → 2 → ... → 7 → 7
//   부드러운 형태 변환
//   중간에 유효한 숫자 형태 유지

// 조건부 생성 (CVAE):
//   z | label → decoder
//   특정 숫자 생성 가능
//   예: z=N(0,I) 샘플 + label="7" → 7의 변형 생성

// 실무 응용:
//   1. 이상 탐지
//      reconstruction error 높은 샘플 = anomaly
//
//   2. 압축
//      고차원 데이터 → 저차원 latent
//      Stable Diffusion에서 8배 압축
//
//   3. 스타일 transfer
//      콘텐츠 latent + 스타일 latent 결합
//
//   4. 데이터 증강
//      latent perturbation → 유사 샘플 생성`}
        </pre>
        <p className="leading-7">
          요약 1: VAE 잠재 공간은 <strong>클래스 클러스터 + 원점 밀집</strong> 구조.<br />
          요약 2: <strong>latent walk</strong>로 부드러운 형태 변환 생성 가능.<br />
          요약 3: 이상 탐지·압축·스타일 전환 등 <strong>다양한 실무 응용</strong>.
        </p>
      </div>
    </section>
  );
}
