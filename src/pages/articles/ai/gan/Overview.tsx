import GANTrainingViz from './viz/GANTrainingViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GAN 핵심 아이디어</h2>
      <div className="not-prose mb-8"><GANTrainingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>GAN</strong>(Generative Adversarial Network) — 2014년 Ian Goodfellow가 제안한 생성 모델<br />
          두 신경망 &mdash; <strong>Generator(G)</strong>와 <strong>Discriminator(D)</strong> &mdash; 이 서로 경쟁하며 학습<br />
          <strong>적대적 학습(adversarial training)</strong> 패러다임이 핵심
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">위조 작가 vs 감별사</h3>
        <p>
          <strong>Generator(위조 작가)</strong> — 처음엔 형편없는 위작을 그리지만, 연습을 거듭하며 진품에 가까워짐<br />
          <strong>Discriminator(감별사)</strong> — 처음엔 구별 못하지만, 경험이 쌓이며 미세한 차이도 구별<br />
          위조 작가가 정교해질수록 감별사도 성장, 감별사가 정확해질수록 위조 작가도 성장 — <strong>적대적 공진화</strong>
        </p>
        <p>
          G — 랜덤 노이즈 z를 받아 가짜 데이터 생성<br />
          D — 입력이 진짜(1)인지 가짜(0)인지 판별<br />
          반복하면 G의 출력이 실제 데이터 분포 p<sub>data</sub>에 수렴
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">목적 함수</h3>
        <p>
          GAN의 원래 목적 함수 — <strong>min-max 게임</strong>으로 정의:
        </p>
        <pre className="text-sm">
{`min_G max_D  V(D,G) = E[log D(x)] + E[log(1 - D(G(z)))]`}
        </pre>
        <p>
          D는 V를 최대화 — 진짜에는 높은 확률, 가짜에는 낮은 확률 부여<br />
          G는 V를 최소화 — D가 가짜를 진짜로 착각하게 만듦<br />
          손실 함수 = <strong>Binary Cross-Entropy</strong> — 이진 분류(진짜/가짜) + CE의 빠른 수렴 특성<br />
          Nash 균형(양쪽 모두 전략을 바꿀 유인이 없는 상태)에서 D(x) = 0.5
        </p>
      </div>
    </section>
  );
}
