import GeometricViz from './viz/GeometricViz';

export default function Geometric() {
  return (
    <section id="geometric" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기하학적 변환: Flip, Rotate, Crop</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이미지 증강의 기본 — <strong>기하학적 변환</strong>(Geometric Transform)<br />
          픽셀 값은 그대로 두고 위치만 변경. 물체의 본질적 특징은 유지하면서 위치·크기·방향 불변성을 학습
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Flip (반전)</h3>
        <p>
          <strong>Horizontal Flip</strong>(좌우 반전) — 가장 널리 사용되는 증강. p=0.5로 설정하면 50% 확률로 적용<br />
          자연 이미지에서 "고양이의 왼쪽"과 "고양이의 오른쪽"은 동일한 의미<br />
          <strong>Vertical Flip</strong>(상하 반전) — 항공·위성 이미지에서 유용. 일반 사진에서는 비현실적
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Rotation (회전)</h3>
        <p>
          허용 각도 범위가 핵심 — 얼굴 인식은 ±15°, 자연 이미지는 ±30°, 항공 사진은 0~360°<br />
          각도가 너무 크면 가장자리에 빈 픽셀이 생긴다 — reflect(반사), constant(검정), wrap(반복) 중 선택<br />
          border_mode에 따라 모델이 학습하는 패턴이 달라지므로 검증 성능을 확인
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Crop & Resize</h3>
        <p>
          <strong>RandomResizedCrop</strong> — ImageNet 학습의 표준 증강<br />
          scale=(0.08, 1.0) 범위에서 랜덤 영역을 잘라내고 224×224로 복원<br />
          작은 crop은 확대(zoom-in) 효과, 큰 crop은 미세 이동(shift) 효과
        </p>
      </div>

      <div className="not-prose my-8">
        <GeometricViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Affine & Elastic</h3>
        <p>
          <strong>Affine Transform</strong> — translate, scale, rotate, shear를 하나의 2×3 행렬로 통합<br />
          개별 변환을 따로 적용하는 것보다 연산 효율이 높고, 변환 조합의 일관성을 보장<br />
          <strong>Elastic Deformation</strong> — 의료 영상에서 특히 유효한 비정형 왜곡<br />
          가우시안 필터로 부드러운 변위 필드를 생성, alpha와 sigma 두 파라미터로 강도를 제어
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: 증강 강도 판단법</p>
        <p className="text-sm">
          Train accuracy가 높은데 Val accuracy가 낮으면(갭 {'>'} 5%) → 증강 강도를 높일 시점<br />
          반대로 Train accuracy 자체가 낮으면 → 증강이 너무 강해서 학습이 어려운 상태.
          증강 확률(p)이나 범위를 줄여야 한다
        </p>
      </div>
    </section>
  );
}
