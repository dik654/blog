import FaceExtractionViz from './viz/FaceExtractionViz';

export default function FaceExtraction() {
  return (
    <section id="face-extraction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">얼굴 검출 & 정렬</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          딥페이크 탐지의 첫 단계 — 이미지/영상에서 <strong>얼굴 영역만 정확히 추출</strong><br />
          전체 이미지를 모델에 넣으면 배경 노이즈가 압도적 — 얼굴 영역 크롭이 성능의 전제 조건
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">얼굴 검출기 3종 비교</h3>
        <p>
          <strong>MTCNN</strong>(Multi-Task Cascaded CNN) — 3단계 캐스케이드 구조<br />
          P-Net(12x12 후보 생성) → R-Net(24x24 정제) → O-Net(48x48 + 랜드마크)<br />
          작은 얼굴도 검출 가능, 속도와 정확도의 균형
        </p>
        <p>
          <strong>RetinaFace</strong> — FPN(Feature Pyramid Network) 기반 단일 패스 검출<br />
          5점 랜드마크를 동시에 예측, WiderFace 벤치마크 최고 정확도<br />
          GPU 환경에서 대회용으로 최적 — 속도보다 정확도 우선 시 선택
        </p>
        <p>
          <strong>MediaPipe Face Detection</strong> — Google의 모바일 최적화 검출기<br />
          BlazeFace 아키텍처, 실시간 처리 가능하지만 대회용으로는 정확도 부족
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">랜드마크 정렬 (Alignment)</h3>
        <p>
          5점 랜드마크(양쪽 눈, 코끝, 양쪽 입꼬리)로 얼굴 기울기 계산<br />
          <strong>Affine Transform</strong>: 기준 좌표(template)에 맞춰 회전 + 스케일 + 이동<br />
          정렬이 없으면 — 같은 사람이라도 촬영 각도에 따라 완전히 다른 피처가 추출된다<br />
          dlib의 shape_predictor_68_face_landmarks 또는 RetinaFace 내장 랜드마크 사용
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">크롭 + 리사이즈</h3>
        <p>
          얼굴 바운딩 박스에 <strong>마진 1.3배 확장</strong> — 턱, 이마, 귀를 포함<br />
          마진이 너무 작으면 경계 아티팩트가 잘리고, 너무 크면 배경 노이즈 증가<br />
          224x224(EfficientNet) 또는 299x299(XceptionNet) — 백본 입력 규격에 맞춰 리사이즈<br />
          비율 유지: 짧은 변 기준 리사이즈 후 center crop으로 왜곡 방지
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">비디오 프레임 샘플링</h3>
        <p>
          비디오는 수백~수천 프레임 — 전부 처리하면 시간과 메모리 낭비<br />
          <strong>균등 샘플링</strong>: 전체 N프레임에서 K개 등간격 추출 (K=16~32가 일반적)<br />
          <strong>품질 기반</strong>: 블러/가림이 없는 선명한 프레임 우선 선택<br />
          <strong>키프레임 기반</strong>: 장면 전환 근처 — 조작 경계가 드러나기 쉬운 지점<br />
          프레임별 예측 → 비디오 단위 집계(확률 평균 / 최대값 / 다수결 투표)
        </p>
      </div>
      <div className="not-prose my-8">
        <FaceExtractionViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: RetinaFace가 정확도 최고 — 대회 1순위 선택<br />
          요약 2: 랜드마크 정렬 없이는 피처 일관성을 확보할 수 없다<br />
          요약 3: 마진 1.3배 크롭 → 모델 입력 규격 리사이즈가 표준 파이프라인
        </p>
      </div>
    </section>
  );
}
