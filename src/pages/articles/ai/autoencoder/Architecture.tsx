import AutoFlowViz from './viz/AutoFlowViz';
import AEArchViz from './viz/AEArchViz';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">구조 상세</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        인코더(n→k)로 차원 축소, 디코더(k→n)로 복원.<br />
        잠재 공간 크기가 핵심 — 너무 작으면 정보 손실, 너무 크면 단순 복사.
      </p>
      <AutoFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">인코더/디코더 구조 + Bottleneck 선택</h3>
      </div>
      <div className="not-prose mt-4 mb-6">
        <AEArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <strong>대칭 구조(인코더 ↔ 디코더)</strong>가 표준 — 복원 경로의 역함수 역할.<br />
          요약 2: <strong>Bottleneck 크기</strong>가 학습 성패 결정 — underfitting vs overcomplete 균형.<br />
          요약 3: 이미지는 CNN, 텍스트/시계열은 MLP/RNN/Transformer 인코더 사용.
        </p>
      </div>
    </section>
  );
}
