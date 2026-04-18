import CEvsMSEViz from './viz/CEvsMSEViz';
import CEvsMSEDetailViz from './viz/CEvsMSEDetailViz';

export default function CEvsMSE({ title }: { title?: string }) {
  return (
    <section id="ce-vs-mse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'CE vs MSE'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        분류에서 CE가 MSE보다 선호되는 이유 — 예측이 크게 틀렸을 때 기울기 크기.<br />
        CE + softmax → 미분이 ŷ - y로 깔끔. MSE는 σ'(z) 추가로 4배+ 작음.
      </p>
      <CEvsMSEViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">MSE vs CE 기울기 비교 · 포화 문제</h3>
        <CEvsMSEDetailViz />
        <p className="leading-7">
          요약 1: <strong>CE + Sigmoid/Softmax</strong> 조합이 분류의 표준 — 수학적 필연.<br />
          요약 2: MSE는 <strong>포화 영역</strong>에서 기울기 소실 — 학습 정체.<br />
          요약 3: CE의 단순한 <strong>(ŷ - y)</strong> 기울기가 빠른 수렴의 비결.
        </p>
      </div>
    </section>
  );
}
