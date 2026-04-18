import LabelSmoothingViz from './viz/LabelSmoothingViz';

export default function LabelSmoothing() {
  return (
    <section id="label-smoothing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Label Smoothing & Mixup</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Label Smoothing</strong>(Szegedy et al., 2016) — 원-핫 라벨을 부드럽게 만들어 모델의 과신(overconfidence)을 방지<br />
          기존 hard label: 정답 클래스 = 1, 나머지 = 0<br />
          smooth label: 정답 클래스 = 1 − ε + ε/K, 나머지 = ε/K (K = 전체 클래스 수)
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 과신이 문제인가</h3>
        <p>
          Cross-entropy 손실은 모델이 정답에 확률 1.0을 부여하도록 유도<br />
          이를 위해 logit이 무한히 커져야 함 → 가중치가 극단적으로 커지는 부작용<br />
          결과: 모델의 출력 확률이 calibration(보정)되지 않음 — "95% 확신"이 실제로는 70% 정확도<br />
          Label Smoothing → logit이 유한한 값에서 안정 → 자연스러운 정규화 효과
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">ε 값 선택</h3>
        <p>
          ε = 0.1이 가장 보편적 — Inception v2, BERT, ViT 모두 이 값 사용<br />
          ε = 0.0 → hard label (비활성화). ε = 1/K → 균일 분포 (모든 클래스 동일 → 학습 불가)<br />
          지식 증류(Knowledge Distillation)와 유사한 면이 있음 — teacher의 soft output을 흉내내는 것
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Mixup: 샘플 간 선형 보간</h3>
        <p>
          <strong>Mixup</strong>(Zhang et al., 2018) — 두 훈련 샘플의 입력과 라벨을 선형으로 혼합<br />
          x̃ = λ·xᵢ + (1−λ)·xⱼ, ỹ = λ·yᵢ + (1−λ)·yⱼ<br />
          λ는 Beta(α, α) 분포에서 샘플링. α = 0.2~0.4가 일반적<br />
          효과: 클래스 간 결정경계가 선형으로 부드러워짐 → 라벨 노이즈에 강건
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">CutMix: 영역 교체</h3>
        <p>
          <strong>CutMix</strong>(Yun et al., 2019) — 이미지의 직사각형 영역을 다른 이미지로 교체<br />
          라벨은 잘라낸 영역의 면적 비율로 혼합: ỹ = λ·yᵢ + (1−λ)·yⱼ (λ = 잘라낸 비율)<br />
          Mixup은 전체를 블렌딩하여 이미지가 흐려지지만, CutMix는 지역(local) 정보를 보존<br />
          객체 탐지, 세분화(segmentation) 태스크에서 Mixup보다 효과적
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Manifold Mixup</h3>
        <p>
          <strong>Manifold Mixup</strong>(Verma et al., 2019) — 입력이 아니라 <strong>은닉층의 중간 표현</strong>을 혼합<br />
          무작위로 선택한 layer에서 혼합 → 다양한 추상화 수준에서 부드러운 결정경계 학습<br />
          입력 Mixup보다 더 강한 정규화 효과, 다만 구현이 약간 더 복잡
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">조합 전략</h3>
        <p>
          Label Smoothing + Mixup → 동시 적용 시 주의: 이미 부드러운 라벨에 추가 스무딩은 과도할 수 있음<br />
          CutMix + Mixup → 랜덤으로 하나를 선택하는 방식이 효과적 (동시 적용보다 번갈아 적용)<br />
          실전 조합 예: Label Smoothing 0.1 + CutMix(α=1.0) → ImageNet에서 Top-1 정확도 1~2% 개선
        </p>
      </div>
      <div className="not-prose my-8">
        <LabelSmoothingViz />
      </div>
    </section>
  );
}
