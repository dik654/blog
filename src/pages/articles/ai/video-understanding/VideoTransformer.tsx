import VideoTransformerViz from './viz/VideoTransformerViz';

export default function VideoTransformer() {
  return (
    <section id="video-transformer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">VideoMAE & TimeSformer</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CNN 계열의 한계 — 수용 영역(receptive field)이 지역적, 멀리 떨어진 프레임 간 관계를 직접 모델링하기 어려움<br />
          Transformer의 self-attention — 모든 토큰 쌍의 관계를 직접 계산, 전역 시공간 의존성 포착<br />
          문제: 비디오 토큰 수가 이미지보다 T배 많아 O(N^2) attention의 메모리 부담이 극심
        </p>
        <p>
          <strong>시공간 토큰화</strong> — 비디오를 t x P x P 크기의 <strong>튜블릿(tubelet)</strong>으로 분할<br />
          t = 시간 방향 패치 크기, P = 공간 방향 패치 크기<br />
          각 튜블릿을 선형 투영하여 하나의 토큰으로 변환 + 위치 임베딩(learnable)으로 시공간 좌표 인코딩
        </p>
      </div>
      <div className="not-prose my-8">
        <VideoTransformerViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ViViT: Video Vision Transformer</h3>
        <p>
          Arnab et al. (2021) — 4가지 변형 제안, 그 중 <strong>Factorised Encoder</strong>가 효율/정확도 균형 최적<br />
          공간 인코더: 각 프레임 내 패치 토큰에 대해 self-attention → 프레임별 CLS 토큰 추출<br />
          시간 인코더: 프레임 CLS 토큰들 사이에서 self-attention → 시간 관계 학습<br />
          계산량: O(T x N^2) + O(T^2) — 전체 O((TN)^2) 대비 크게 절감
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">TimeSformer: Divided Space-Time Attention</h3>
        <p>
          Bertasius et al. (2021) — 각 Transformer 블록 내에서 attention을 분리<br />
          <strong>Temporal attention 먼저</strong>: 같은 공간 위치의 서로 다른 프레임 토큰 간 attention<br />
          <strong>그 다음 Spatial attention</strong>: 같은 프레임 내 서로 다른 위치 토큰 간 attention<br />
          계산량: O(T x N^2 + N x T^2) — 공간과 시간을 독립적으로 계산하여 효율 확보
        </p>
        <p>
          ViViT vs TimeSformer — ViViT는 인코더 자체를 분리, TimeSformer는 attention 연산을 분리<br />
          TimeSformer가 구현이 단순하고 기존 ViT 코드에 쉽게 적용 가능
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">VideoMAE: 자기지도 사전학습</h3>
        <p>
          Tong et al. (2022) — MAE(Masked Autoencoder)를 비디오로 확장<br />
          핵심: 시공간 튜블릿의 <strong>90%를 랜덤 마스킹</strong> → 인코더는 나머지 10%만 처리<br />
          디코더가 마스킹된 튜블릿을 복원하도록 MSE 손실로 학습
        </p>
        <p>
          왜 90% 마스킹이 가능한가 — 비디오의 <strong>시간 중복성(temporal redundancy)</strong><br />
          인접 프레임이 거의 동일하므로 적은 정보로도 전체를 복원할 수 있음<br />
          이미지 MAE(75%)보다 높은 마스킹 비율이 가능하고, 오히려 높을수록 학습이 잘 됨
        </p>
        <p>
          실전 파이프라인: VideoMAE 사전학습(레이블 없이) → 타겟 데이터셋에 Fine-tune<br />
          적은 레이블 데이터로도 높은 성능 달성, 소규모 데이터셋에서 특히 효과적
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">어텐션 패턴 선택 가이드</h3>
        <p>
          <strong>Joint Space-Time</strong> — 가장 정확하지만 O((TN)^2)로 메모리 제한. 짧은 클립/적은 토큰에만 가능<br />
          <strong>Divided (TimeSformer)</strong> — 효율과 정확도의 균형점. 대부분의 실전 상황에 적합<br />
          <strong>Factorised (ViViT)</strong> — 가장 경량. 긴 영상이나 제한된 GPU에서 선택<br />
          2024 기준 주류: VideoMAE로 사전학습 → Divided Attention 구조로 Fine-tune
        </p>
      </div>
    </section>
  );
}
