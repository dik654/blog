import PipelineViz from './viz/PipelineViz';

export default function Pipeline() {
  return (
    <section id="pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Albumentations 실전 파이프라인</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Albumentations</strong> — OpenCV 기반 고속 이미지 증강 라이브러리<br />
          torchvision.transforms보다 2~10배 빠르고, 이미지·바운딩박스·마스크·키포인트를 동시 변환<br />
          Kaggle 이미지 대회에서 사실상 표준
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Compose — 파이프라인 정의</h3>
        <p>
          <code>A.Compose([변환1, 변환2, ...])</code>로 변환을 순차 연결<br />
          각 변환에 p(확률)를 설정하여 매 이터레이션마다 다른 조합이 적용<br />
          <code>OneOf([변환A, 변환B], p=0.3)</code> — 그룹 내에서 하나만 랜덤 선택
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Train vs Test 파이프라인</h3>
        <p>
          <strong>Train</strong> — RandomResizedCrop → HFlip → ColorJitter → OneOf([Blur, Noise]) → Normalize<br />
          매번 다른 증강 조합이 적용되어 모델이 다양한 상황을 학습<br />
          <strong>Test</strong> — Resize(256) → CenterCrop(224) → Normalize<br />
          랜덤 요소 없이 결정적(deterministic) 변환만. 같은 이미지는 항상 같은 출력
        </p>
        <p>
          <strong>Normalize는 Train과 Test에서 반드시 동일한 파라미터</strong>를 사용<br />
          학습과 다른 mean/std를 쓰면 모델 입력 분포가 어긋나 성능이 급락한다
        </p>
      </div>

      <div className="not-prose my-8">
        <PipelineViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">TTA (Test Time Augmentation)</h3>
        <p>
          테스트 시에도 증강을 적용하여 성능을 끌어올리는 기법<br />
          하나의 테스트 이미지를 N번 증강(원본 + HFlip + 다중 Crop 등)하여 각각 예측<br />
          N개 예측의 평균(regression) 또는 다수결(classification)로 최종 결과 결정<br />
          대회에서 마지막 0.1~0.3% 성능 향상에 효과적. 추론 시간은 N배 증가
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">파이프라인 설계 체크리스트</h3>
        <ul>
          <li>기하학적 변환 → 색상 변환 → Normalize 순서 (Normalize는 항상 마지막)</li>
          <li>증강 강도는 점진적으로 — 약한 증강에서 시작, 오버피팅 보이면 강화</li>
          <li>Train과 Test의 Normalize 파라미터 일치 확인</li>
          <li>바운딩 박스/마스크 태스크에서는 좌표 동시 변환 확인</li>
          <li>TTA 적용 시 추론 시간 vs 성능 향상 트레이드오프 검토</li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 증강 디버깅</p>
        <p className="text-sm">
          증강된 이미지를 저장하고 눈으로 확인하는 것이 가장 확실한 디버깅 방법<br />
          <code>{'transformed = transform(image=img); plt.imshow(transformed["image"])'}</code><br />
          바운딩 박스가 이미지 밖으로 벗어나거나, 마스크가 이미지와 불일치하는 문제를 조기 발견
        </p>
      </div>
    </section>
  );
}
