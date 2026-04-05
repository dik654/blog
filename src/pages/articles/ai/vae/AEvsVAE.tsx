import AEvsVAEViz from './viz/AEvsVAEViz';

export default function AEvsVAE() {
  return (
    <section id="ae-vs-vae" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AE vs VAE: 잠재 공간의 결정적 차이</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        AE: z = f(x) — 결정론적 점 하나. 잠재 공간에 빈 구멍 존재.<br />
        VAE: z ~ N(μ, σ²) — 확률 분포. 잠재 공간이 연속적으로 채워진다.
      </p>
      <AEvsVAEViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">결정론적 vs 확률적 매핑</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// AE (Autoencoder) — 결정론적 인코딩
//
//   x → Encoder → z (단일 점)
//   z → Decoder → x̂
//
//   같은 x가 항상 같은 z로 매핑
//   잠재 공간에 빈 구멍 존재 (학습 데이터 점들만)
//   z 공간에서 랜덤 샘플링 → 의미 없는 출력
//
// VAE (Variational AE) — 확률적 인코딩
//
//   x → Encoder → (μ(x), σ²(x))  # 분포 파라미터
//   z ~ N(μ, σ²)                   # 샘플링
//   z → Decoder → x̂
//
//   같은 x라도 매번 다른 z 샘플링
//   잠재 공간이 연속적으로 채워짐
//   z 공간에서 랜덤 샘플링 → 유의미한 출력
//
// 핵심 차이:
//   AE의 z: R^d 공간의 한 점
//   VAE의 z: R^d 공간의 확률 분포

// 잠재 공간 시각화 (2D 예시):
//
//   AE:                  VAE:
//   . .   .              ▒▓█▓▒
//     . .                 ▓██▓░
//   .  .  .                ▒███▒
//   (점들 사이 구멍)        (연속적 분포)
//
//   샘플링 결과:
//   AE 구멍 지점 → 쓰레기 이미지
//   VAE 임의 지점 → 유의미한 이미지`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">잠재 공간 연속성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MNIST 예시로 본 잠재 공간 차이
//
// AE 2D 잠재 공간:
//   - 각 숫자 클래스가 분리된 섬
//   - 섬 사이: 학습되지 않은 미지 영역
//   - 두 점 보간 시 중간에 깨진 이미지
//
// VAE 2D 잠재 공간:
//   - 모든 클래스가 원점 주위에 밀집
//   - N(0, I) prior로 정규화됨
//   - 부드러운 연속적 전환
//   - 0 → 6 보간: 0이 점차 6으로 변형

// Smooth Interpolation (보간):
//   z_mix = (1-t)·z_A + t·z_B,  t ∈ [0, 1]
//
//   VAE에서 가능한 이유:
//   - KL 제약이 z를 원점 근처로 모음
//   - 인코더가 겹치는 분포 출력 허용
//   - 디코더가 그 사이 영역도 학습

// 잠재 공간 산술 (Latent Arithmetic):
//   얼굴 예시:
//   z(여성+웃음) - z(여성) + z(남성) = z(남성+웃음)
//
//   VAE: 가능 (의미적 방향 학습됨)
//   AE: 불가능 (구조 없음)
//
// 이 연속성이 VAE의 가장 큰 실용적 가치`}
        </pre>
        <p className="leading-7">
          요약 1: AE는 <strong>결정론적 점</strong>, VAE는 <strong>확률 분포</strong> 매핑.<br />
          요약 2: VAE의 <strong>KL 정규화</strong>가 잠재 공간을 연속적으로 만듦.<br />
          요약 3: <strong>보간·산술</strong>이 VAE에서만 의미 있게 동작.
        </p>
      </div>
    </section>
  );
}
