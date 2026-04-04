import CEvsMSEViz from './viz/CEvsMSEViz';

export default function CEvsMSE({ title }: { title?: string }) {
  return (
    <section id="ce-vs-mse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'CE vs MSE'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        분류에서 CE가 MSE보다 선호되는 이유 — 예측이 크게 틀렸을 때 기울기 크기.<br />
        CE + softmax → 미분이 ŷ - y로 깔끔. MSE는 σ'(z) 추가로 4배+ 작음.
      </p>
      <CEvsMSEViz />
    </section>
  );
}
