import M from '@/components/ui/math';
import MultiHeadDemo from '../components/MultiHeadDemo';
import MultiHeadMergeViz from './viz/MultiHeadMergeViz';
import MultiHeadDetailViz from './viz/MultiHeadDetailViz';

export default function MultiHead() {
  return (
    <section id="multi-head">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Multi-Head Attention</h2>
      <p className="leading-7 mb-6">
        단일 Attention 대신 여러 개의 Attention Head를 병렬로 사용<br />
        서로 다른 관점에서 정보를 포착 — 각 Head는 독립적인 Q, K, V 가중치를 보유
      </p>
      <MultiHeadMergeViz />
      <MultiHeadDemo />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Head 수식과 구현</h3>
        <p className="leading-7">
          각 헤드는 독립 W_Q, W_K, W_V를 보유하며 d_k = d_model/h = 64차원에서 어텐션을 수행한다.
          8개 헤드의 결과를 Concat하고 W_O로 원래 차원(512)을 복원한다.
          view + transpose로 헤드를 분리하면 하나의 matmul로 8헤드를 병렬 처리할 수 있다.
        </p>
        <M display>{'\\text{MultiHead} = \\underbrace{\\text{Concat}(\\text{head}_0, \\ldots, \\text{head}_7)}_{8 \\times 64 = 512} \\cdot \\underbrace{W_O}_{(512, 512)}'}</M>
        <M display>{'\\text{head}_i = \\text{Attention}\\!\\left(X\\underbrace{W_Q^i}_{(512,64)},\\; XW_K^i,\\; XW_V^i\\right)'}</M>
      </div>
      <div className="not-prose my-8"><MultiHeadDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Multi-Head는 <strong>병렬 attention</strong>으로 다양한 관계 동시 학습.<br />
          요약 2: 총 파라미터 수는 <strong>single head와 동일</strong> — 차원 분할.<br />
          요약 3: 실무에서는 <strong>h=8~16</strong> 헤드가 표준.
        </p>
      </div>
    </section>
  );
}
