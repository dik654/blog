import ApplicationsViz from './viz/ApplicationsViz';

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활용 사례</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        이미지 노이즈 제거, 이상 탐지(복원 오차 급증), 데이터 압축, 흑백→컬러 복원.
      </p>
      <ApplicationsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">주요 활용 사례 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. 이미지 노이즈 제거 (Denoising)
//    - 입력: 노이즈 추가된 이미지 x + ε
//    - 목표: 원본 x 복원
//    - Denoising Autoencoder: 학습 시 일부러 노이즈 주입
//    - 의료 영상(CT, MRI), 저조도 사진 복원에 활용
//
//    구현:
//      x_noisy = x + 0.1 * torch.randn_like(x)
//      x_recon = model(x_noisy)
//      loss = MSE(x_recon, x)
//
// 2. 이상 탐지 (Anomaly Detection)
//    - 정상 데이터로만 학습
//    - 이상 데이터는 복원 오차 급증
//    - 임계값 초과 시 이상 신호
//
//    사용처:
//      - 제조 품질 검사 (불량품 검출)
//      - 네트워크 보안 (비정상 트래픽)
//      - 의료 진단 (희귀 질환)
//      - 신용카드 부정 사용
//
// 3. 데이터 압축 (Lossy Compression)
//    - 잠재 코드 z로 저장
//    - 디코더로 복원
//    - JPEG/H.264 대비 semantic 보존 강점
//    - Stable Diffusion의 VAE도 같은 원리
//
// 4. 결측치 보완 (Missing Data Imputation)
//    - 마스크된 입력 → 완전한 출력
//    - 시계열, 표 데이터, 이미지 인페인팅
//    - MAE (Masked Autoencoder): 75% 마스킹 학습
//
// 5. 추천 시스템
//    - 사용자×아이템 매트릭스 (sparse)
//    - AE로 잠재 factor 학습
//    - 평가 안 한 항목 예측
//    - Matrix Factorization의 비선형 확장`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">현대 AE 기반 모델들</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. Stable Diffusion의 VAE
//    - 512×512 이미지 → 64×64×4 latent
//    - Diffusion 연산을 latent space에서 실행
//    - 8배 메모리/계산 절감
//    - "Latent Diffusion Models" (Rombach 2022)
//
// 2. MAE (Masked Autoencoder, He 2022)
//    - ViT 기반 self-supervised pretraining
//    - 입력 패치 75% 마스킹
//    - 남은 25%에서 전체 복원 학습
//    - ImageNet에서 SOTA
//
// 3. VQ-VAE (van den Oord 2017)
//    - Discrete latent codes (codebook)
//    - 언어 모델처럼 이미지 생성 가능
//    - DALL-E, Parti의 백본
//
// 4. Beta-VAE (Higgins 2017)
//    - β·KL regularization
//    - 해석 가능한 latent factors
//    - Disentangled representation
//
// 5. BERT (MLM as denoising AE)
//    - 15% 토큰 마스킹 → 복원
//    - Transformer 기반 AE
//    - 언어 이해의 혁명

// 실무 팁:
//   - 복원 품질만 중요 → Vanilla AE
//   - 잠재 공간 구조 필요 → VAE
//   - 생성 태스크 → VAE, VQ-VAE, Diffusion
//   - 사전학습 → MAE, BERT-style
//   - 이상 탐지 → Denoising AE`}
        </pre>
        <p className="leading-7">
          요약 1: 오토인코더는 <strong>압축·복원·이상탐지</strong>의 범용 도구 — 라벨 없이 활용 가능.<br />
          요약 2: <strong>Stable Diffusion·MAE·BERT</strong> 등 현대 AI의 핵심 구조에 내장.<br />
          요약 3: 목적에 맞게 <strong>Vanilla/Denoising/VAE/VQ-VAE</strong> 중 선택.
        </p>
      </div>
    </section>
  );
}
