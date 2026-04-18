import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥페이크 탐지의 어려움</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          딥페이크(Deepfake) — 딥러닝으로 얼굴을 합성·조작하는 기술<br />
          GAN(2014)으로 시작, Diffusion Model(2020~)로 품질이 급격히 상승<br />
          사람이 봐도 구분할 수 없는 수준의 합성이 실시간으로 가능해졌다
        </p>
        <p>
          딥페이크의 3가지 유형 — 각각 탐지 난이도가 다르다<br />
          <strong>Face Swap</strong>: A의 얼굴을 B의 영상에 덮어씌움 (가장 흔함)<br />
          <strong>Face Reenactment</strong>: A의 표정·움직임으로 B의 얼굴을 조종<br />
          <strong>Entire Face Synthesis</strong>: 존재하지 않는 얼굴을 통째로 생성
        </p>
        <p>
          초기 딥페이크는 경계 블러, 색상 불일치, 부자연스러운 눈 깜빡임 등 명확한 아티팩트가 존재했다<br />
          최신 생성 모델은 이런 결함을 대부분 해결 — 4K 해상도에 시간적 일관성까지 확보<br />
          결국 모델이 사람보다 미세한 통계적 패턴(주파수 분포, 텍스처 일관성)을 잡아야 한다
        </p>
        <p>
          딥페이크 탐지 대회의 핵심 특성 — 학습 데이터가 주어지지 않는다<br />
          일반 비전 대회는 train/test 세트가 동일 도메인에서 제공되지만,
          딥페이크 대회는 test만 제공하고 조작 기법도 미공개<br />
          따라서 외부 데이터셋(FF++, DFDC, CelebDF 등) 구축과 자체 합성 데이터 생성이 필수 전략
        </p>
      </div>
      <div className="not-prose my-8">
        <OverviewViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: 생성 기술의 진화 속도가 탐지 기술을 앞서간다 — 끊임없는 업데이트 필수<br />
          요약 2: Face Swap이 가장 흔하지만, Full Synthesis가 가장 탐지하기 어렵다<br />
          요약 3: 외부 데이터 구축 + 다양한 조작 기법 커버가 대회 성패를 결정
        </p>
      </div>
    </section>
  );
}
