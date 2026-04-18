import ColorViz from './viz/ColorViz';

export default function Color() {
  return (
    <section id="color" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">색상 변환: Jitter, Normalize, CLAHE</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>색상 변환</strong> — 픽셀 위치는 고정하고 값(밝기, 색상)을 변형<br />
          조명 조건, 카메라 설정, 계절 변화에 따른 색상 차이에 강건한 모델을 만든다<br />
          기하학적 변환과 함께 사용하면 변형 조합이 기하급수적으로 증가
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">ColorJitter</h3>
        <p>
          밝기(brightness), 대비(contrast), 채도(saturation), 색조(hue) 4가지를 독립적으로 변형<br />
          각 파라미터에 변형 범위를 설정 — brightness=0.2이면 [0.8, 1.2] 범위에서 랜덤 스케일링<br />
          4가지가 독립적이므로 0.2 × 0.2 × 0.2 × 0.1 = 수천 가지 색상 조합 가능
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Normalization</h3>
        <p>
          증강이 아닌 <strong>전처리</strong>지만 파이프라인에서 필수 — 항상 마지막에 적용<br />
          사전학습 모델(ResNet, EfficientNet)은 ImageNet의 mean/std로 학습되었으므로,
          전이학습 시 동일한 통계를 사용해야 첫 레이어 입력 분포가 맞는다<br />
          mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225] — ImageNet RGB 채널별 통계
        </p>
      </div>

      <div className="not-prose my-8">
        <ColorViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CLAHE</h3>
        <p>
          <strong>CLAHE</strong>(Contrast Limited Adaptive Histogram Equalization) — 적응적 히스토그램 평활화<br />
          이미지를 8×8 타일로 나누고 각 타일의 히스토그램을 독립적으로 평활화<br />
          전역 평활화의 문제(밝은 영역 과포화)를 방지하면서 어두운 영역의 디테일을 살린다<br />
          clip_limit=2.0으로 과도한 히스토그램 증폭을 제한 — 의료 영상에서 특히 효과적
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Random Erasing</h3>
        <p>
          이미지의 랜덤 영역을 0(검정) 또는 랜덤 노이즈로 채운다<br />
          물체가 부분적으로 가려진(occluded) 상황을 시뮬레이션 — 모델이 물체의 전체가 아닌 부분 특징으로도 인식하도록 강제<br />
          p=0.5, scale=(0.02, 0.33), ratio=(0.3, 3.3)이 표준 설정
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 색상 증강 순서</p>
        <p className="text-sm">
          반드시 기하학적 변환 → 색상 변환 → Normalize 순서<br />
          Normalize 이후에 색상 변환을 적용하면 평균/분산이 맞지 않아 학습 불안정<br />
          Albumentations는 Compose 순서를 그대로 실행하므로 파이프라인 정의 시 주의
        </p>
      </div>
    </section>
  );
}
