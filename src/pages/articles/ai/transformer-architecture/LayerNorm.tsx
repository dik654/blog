import CodePanel from '@/components/ui/code-panel';
import { lnCode, lnAnnotations } from './LayerNormData';
import LayerNormViz from './viz/LayerNormViz';

export default function LayerNorm() {
  return (
    <section id="layer-norm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Layer Normalization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Layer Normalization</strong> — 각 토큰의 특징 차원에 걸쳐 독립적으로 정규화<br />
          Batch Normalization과 달리 시퀀스 길이나 배치 크기에 무관하게 동작<br />
          트랜스포머의 어텐션 메커니즘과 잘 호환
        </p>
      </div>

      <LayerNormViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Pre-LN vs Post-LN</h3>
        <p>
          원본 Transformer는 Post-LN 사용<br />
          GPT-2 이후 대부분의 모델이 <strong>Pre-LN</strong>으로 전환<br />
          Pre-LN — 잔차 연결 전에 정규화하여 그래디언트 흐름이 안정적
        </p>
        <CodePanel title="Pre-LN vs Post-LN" code={lnCode} lang="python" annotations={lnAnnotations} />
      </div>
    </section>
  );
}
