import WanTrainingViz from './viz/WanTrainingViz';

export default function TrainingAndLimits() {
  return (
    <section id="training-limits" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">4단계: 학습 방법의 공개 범위와 한계</h2>
      <div className="not-prose mb-8"><WanTrainingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Wan 논문과 Wan2.2 저장소는 구조와 성능, 모델 변형, 실행 방법을 상당히 공개한다.
          Wan2.2 README는 Wan2.1 대비 더 많은 이미지와 비디오 데이터로 훈련했고, 미감 라벨이 포함된
          선별 데이터를 사용했다고 설명한다. 이는 어떤 방향으로 학습 품질을 높였는지 이해하는 데 충분하다.
        </p>
        <p>
          그러나 “완전히 공개된 학습 방법”은 아니다. 실제 원본 데이터셋, 필터링 기준의 전체 구현,
          데이터 혼합 비율, 최적화 스케줄, expert별 학습 phase, 실패 샘플 처리 규칙은 모두 완전 재현 수준으로 공개되어 있지 않다.
          따라서 글에서는 “논문/README가 밝힌 학습 방향”과 “비공개 세부 절차”를 분리해야 한다.
        </p>
        <p>
          공개 자료 기준으로 안전하게 말할 수 있는 것은 다음이다. Wan2.2는 더 큰 선별 이미지/비디오 데이터,
          미감과 움직임 관련 라벨링, VAE 기반 잠재 압축, DiT 노이즈 제거기, 그리고 노이즈 구간별 전문가 분리를 통해
          video generation 품질과 효율을 높인 공개 모델 계열이다.
        </p>
        <h3>학습 루프를 따라 읽는 방법</h3>
        <p>
          Wan2.2의 기본 학습 루프도 latent diffusion 관점에서 읽으면 된다. 먼저 비디오를 VAE latent로 압축한다.
          그 다음 시간 단계 <code>t</code>를 뽑아 latent에 노이즈를 섞고, DiT가 깨끗한 방향으로 되돌리는 예측을 하도록
          손실을 건다. 텍스트 조건은 T5류 encoder가 만든 embedding으로 들어가고, 이미지 조건이 있는 모델은 첫 프레임 또는
          visual condition이 latent/conditioning 경로에 추가된다.
        </p>
        <p>
          A14B 계열에서 어려운 부분은 MoE가 “토큰별 라우터”라기보다 “노이즈 구간별 전문가 분리”에 가깝다는 점이다.
          학습 중 초반 고노이즈 구간 샘플은 high-noise expert가 더 많이 보게 되고, 후반 저노이즈 구간 샘플은 low-noise expert가
          더 많이 보게 된다. 그래서 high-noise expert는 화면 배치, 장면 전환, 큰 움직임에 더 강하게 연결되고,
          low-noise expert는 질감, 조명, 가장자리, 작은 움직임 보정에 더 강하게 연결된다고 이해할 수 있다.
        </p>
        <h3>파인튜닝에서 실제로 봐야 하는 위험</h3>
        <ul>
          <li>스타일 LoRA가 low-noise expert에만 강하게 걸리면 질감은 바뀌지만 움직임 계획은 거의 그대로일 수 있다.</li>
          <li>동작 데이터를 학습할 때 high-noise expert를 충분히 건드리지 못하면 구도와 움직임 계획이 바뀌지 않을 수 있다.</li>
          <li>두 expert를 모두 크게 바꾸면 prompt 충실도와 기존 일반화 능력이 동시에 흔들릴 수 있다.</li>
          <li>TI2V-5B는 A14B와 목적이 다르므로, 같은 LoRA 설정을 그대로 옮기는 것은 안전한 가정이 아니다.</li>
        </ul>
        <h3>공개/비공개 경계를 정확히 쓰기</h3>
        <ul>
          <li>공개: 모델 라인업, inference 코드, weights, 실행 옵션, VAE 압축 설명, MoE expert 구간 설명.</li>
          <li>부분 공개: 데이터가 더 커졌고 미감/움직임 라벨을 썼다는 방향성.</li>
          <li>비공개: 원본 데이터셋, 필터링 코드 전체, 혼합 비율, 최적화 스케줄, expert별 phase 세부값.</li>
        </ul>
      </div>
    </section>
  );
}
