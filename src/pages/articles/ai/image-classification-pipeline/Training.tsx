import TrainingStrategyViz from './viz/TrainingStrategyViz';

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습 전략: Progressive Resizing, TTA</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          백본을 골랐으면 다음은 <strong>어떻게 학습할 것인가</strong> — 같은 모델도 학습 전략에 따라 1~3% 차이<br />
          Progressive Resizing, 고급 증강, TTA, Pseudo-Labeling — 네 가지 핵심 기법
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Progressive Resizing</h3>
        <p>
          작은 해상도(224×224)로 시작해 점점 큰 해상도(384→512)로 이동하는 학습 전략<br />
          <strong>왜 효과적인가</strong>: 작은 이미지는 배치 크기를 크게 잡을 수 있어 초기 수렴이 빠르고,
          큰 이미지에서는 미세한 디테일(텍스처, 경계)을 추가 학습<br />
          해상도를 올릴 때마다 Learning Rate를 1/5로 줄이고, epoch 수도 절반으로 감소<br />
          총 학습 시간이 40% 절약되면서 최종 성능은 큰 해상도만 학습한 것과 동등 이상
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">데이터 증강: RandAugment, CutMix, MixUp</h3>
        <p>
          <strong>RandAugment</strong> — N개의 변환을 무작위 선택, 강도 M으로 적용 (Cubuk et al., 2020)<br />
          AutoAugment가 TPU 수천 시간의 탐색 비용을 요구한 반면, RandAugment는 N=2, M=9 두 파라미터만 튜닝<br />
          변환 풀: 회전, 전단(shear), 색조, 밝기, 대비, 포스터화(posterize) 등 14종
        </p>
        <p>
          <strong>CutMix</strong> — 이미지 A의 일부 영역을 이미지 B로 교체, 라벨도 면적 비율만큼 혼합 (Yun et al., 2019)<br />
          Cutout(일부 영역을 검정으로 가림)의 발전 — 가려진 영역에 정보를 채워넣어 효율적<br />
          <strong>MixUp</strong> — 두 이미지를 λ:(1-λ)로 픽셀 단위 블렌딩, 라벨도 동일 비율 (Zhang et al., 2018)<br />
          결정 경계(decision boundary)를 평활화하여 과적합 방지, calibration 개선
        </p>
        <p>
          세 기법을 조합하면 과적합 방지와 일반화 성능을 동시에 달성 — 특히 데이터가 적을수록 효과 극대화
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">TTA (Test Time Augmentation)</h3>
        <p>
          테스트 이미지 하나에 여러 증강을 적용 → 각각 모델 추론 → 예측 확률을 평균<br />
          <strong>기본 TTA</strong>: 원본 + 좌우반전 = 2×. 추론 시간 2배지만 거의 공짜로 0.3% 향상<br />
          <strong>강화 TTA</strong>: + 90°/180°/270° 회전 + 스케일(0.9×, 1.1×) = 8~10×. 0.5~1.0% 향상<br />
          주의: 위성 이미지처럼 방향 무관 데이터에선 회전 TTA가 유리하지만,
          텍스트·문서 이미지처럼 방향이 중요한 데이터에선 회전 TTA를 제외
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Pseudo-Labeling</h3>
        <p>
          <strong>Semi-Supervised Learning</strong>의 가장 실용적인 형태<br />
          1차 모델로 테스트(또는 unlabeled) 데이터에 예측 → 높은 신뢰도(P &gt; 0.95) 샘플만 가짜 라벨 부여<br />
          2차 학습: 원본 train + pseudo-labeled 데이터를 합쳐 재학습<br />
          효과: 실질적으로 데이터가 20~30% 증가하는 효과 — 대회에서 0.5~1.5% 향상 보고<br />
          <strong>위험</strong>: threshold가 낮으면 잘못된 라벨이 전파(confirmation bias). 0.95 이상 유지 권장
        </p>
      </div>
      <div className="not-prose my-8">
        <TrainingStrategyViz />
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">학습 전략 적용 순서</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          1) 기본 증강(RandomCrop + HorizontalFlip)으로 베이스라인 확보<br />
          2) RandAugment + CutMix 추가 — 과적합 감소 확인<br />
          3) Progressive Resizing 적용 — 학습 시간 절약 + 성능 유지<br />
          4) TTA(2×) — 제출 직전 적용. 시간 여유 있으면 8× 시도<br />
          5) Pseudo-Labeling — 대회 후반, unlabeled 데이터가 있을 때
        </p>
      </div>
    </section>
  );
}
