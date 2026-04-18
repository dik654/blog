import AEvsVAEViz from './viz/AEvsVAEViz';
import DeterministicVsProbViz from './viz/DeterministicVsProbViz';

export default function AEvsVAE() {
  return (
    <section id="ae-vs-vae" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AE vs VAE: 잠재 공간의 결정적 차이</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        AE: z = f(x) — 결정론적 점 하나. 잠재 공간에 빈 구멍 존재.<br />
        VAE: z ~ N(μ, σ²) — 확률 분포. 잠재 공간이 연속적으로 채워진다.
      </p>
      <AEvsVAEViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">결정론적 vs 확률적 매핑</h3>
        <div className="not-prose"><DeterministicVsProbViz /></div>
        <p className="leading-7">
          요약 1: AE는 <strong>결정론적 점</strong>, VAE는 <strong>확률 분포</strong> 매핑.<br />
          요약 2: VAE의 <strong>KL 정규화</strong>가 잠재 공간을 연속적으로 만듦.<br />
          요약 3: <strong>보간·산술</strong>이 VAE에서만 의미 있게 동작.
        </p>
      </div>
    </section>
  );
}
