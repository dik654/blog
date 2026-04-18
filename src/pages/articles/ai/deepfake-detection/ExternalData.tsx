import ExternalDataViz from './viz/ExternalDataViz';

export default function ExternalData() {
  return (
    <section id="external-data" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">외부 데이터 구축 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          딥페이크 탐지 대회에서 학습 데이터가 주어지지 않는다면 — <strong>외부 데이터 구축이 성패를 결정</strong><br />
          공개 데이터셋 조합 + 자체 합성 데이터 생성이 핵심 전략
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3대 공개 데이터셋</h3>
        <p>
          <strong>FaceForensics++ (FF++)</strong> — 학술 연구의 표준 벤치마크<br />
          1,000개 원본 영상 x 5가지 조작 기법(Face2Face, FaceSwap, DeepFakes, NeuralTextures, FaceShifter)<br />
          압축 수준별(raw, c23, c40) 제공 — JPEG 압축 환경 대비 학습에 유용
        </p>
        <p>
          <strong>DFDC</strong>(DeepFake Detection Challenge, Facebook) — 대규모 데이터셋<br />
          10만 클립, 3,426명, 다양한 환경(조명, 포즈, 배경)<br />
          Kaggle 대회용으로 제작 — 실전 대회 환경에 가장 근접
        </p>
        <p>
          <strong>CelebDF-v2</strong> — 고품질 합성 전용 데이터셋<br />
          590개 원본 + 5,639개 합성 영상 — 개선된 합성 알고리즘 사용<br />
          기존 데이터셋보다 합성 품질이 높아 — 고난도 탐지 벤치마크로 활용
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">다양한 조작 기법 커버</h3>
        <p>
          학습 데이터가 특정 조작 기법에 편향되면 — 미지의 기법에 취약<br />
          Face2Face(표정 전이), FaceSwap(얼굴 교체), NeuralTextures(텍스처 합성),
          FaceShifter(고충실도 교체)... 기법마다 남기는 아티팩트가 다르다<br />
          전략: 조작 기법 x 데이터셋 매핑 테이블 작성 → 빈 셀을 자체 합성으로 채우기<br />
          최소 3~5가지 조작 기법을 커버해야 일반화 성능 확보
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">자체 합성 데이터 생성</h3>
        <p>
          공개 데이터셋만으로는 부족한 조작 기법이 있다 — 자체 합성으로 보완<br />
          <strong>SimSwap</strong>: 고품질 얼굴 교체, 표정 보존<br />
          <strong>DeepFaceLab</strong>: 커뮤니티 표준 도구, 다양한 파라미터 제어<br />
          <strong>FaceSwap</strong>: 오픈소스, 자동화 파이프라인 구축 가능
        </p>
        <p>
          핵심 주의점: 합성 품질이 테스트와 유사해야 효과가 있다<br />
          쉬운 합성(저품질)으로만 학습하면 — 고품질 딥페이크 앞에서 무력<br />
          합성 파라미터(해상도, 블렌딩 강도, 후처리)를 다양하게 설정하여 난이도 분포 확보
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">라벨 품질 관리</h3>
        <p>
          공개 데이터셋의 라벨 오류율 1~5% — 무시하면 모델 성능에 직접적 영향<br />
          검증: 모델 예측과 라벨이 불일치하는 샘플을 추출 → 수동 검수<br />
          <strong>Confident Learning</strong>(cleanlab 라이브러리) — 라벨 노이즈 자동 탐지<br />
          교차 검증 기반으로 "모델이 확신하지만 라벨이 다른" 샘플을 식별
        </p>
        <p>
          대응 전략 3가지<br />
          1. <strong>Label Smoothing</strong>: hard label(0/1) 대신 soft label(0.05/0.95) — 라벨 노이즈에 강건<br />
          2. <strong>노이즈 라벨 제거</strong>: cleanlab으로 탐지 후 해당 샘플 제거<br />
          3. <strong>MixUp 학습</strong>: 두 샘플의 이미지와 라벨을 보간 — 라벨 불확실성에 자연스럽게 대응
        </p>
      </div>
      <div className="not-prose my-8">
        <ExternalDataViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: FF++ + DFDC + CelebDF 조합이 기본 — 각각 커버하는 기법이 다르다<br />
          요약 2: 자체 합성 시 테스트 수준의 품질을 맞추는 것이 핵심<br />
          요약 3: cleanlab + label smoothing으로 라벨 노이즈 대응 — 1~5% 오류도 성능에 영향
        </p>
      </div>
    </section>
  );
}
