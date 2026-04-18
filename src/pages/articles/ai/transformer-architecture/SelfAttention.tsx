import M from '@/components/ui/math';
import AttentionDemo from '../components/AttentionDemo';
import AttentionFlowViz from './viz/AttentionFlowViz';
import SelfAttnImplDetailViz from './viz/SelfAttnImplDetailViz';

export default function SelfAttention() {
  return (
    <section id="self-attention">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Self-Attention 메커니즘</h2>
      <p className="leading-7 mb-4">
        Self-Attention — 입력 시퀀스의 각 토큰이 다른 모든 토큰과의 관계를 계산하는 메커니즘
      </p>
      <div className="rounded-lg border p-4 font-mono text-sm mb-6">
        Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>)V
      </div>
      <AttentionFlowViz />
      <ul className="mb-6 space-y-2 text-foreground/75">
        <li className="flex gap-2"><span className="text-foreground font-medium">Q (Query):</span> 현재 토큰이 찾고자 하는 정보</li>
        <li className="flex gap-2"><span className="text-foreground font-medium">K (Key):</span> 각 토큰이 제공하는 식별 정보</li>
        <li className="flex gap-2"><span className="text-foreground font-medium">V (Value):</span> 각 토큰이 실제로 전달하는 정보</li>
      </ul>
      <AttentionDemo />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Self-Attention 구현과 복잡도</h3>
        <p className="leading-7">
          W_Q, W_K, W_V 세 선형 레이어로 입력을 투영한 뒤,
          Q·K^T 내적으로 유사도 계산, √d_k 스케일링, softmax 정규화, V와 가중 합산의 4단계로 구현한다.
          시간 복잡도 O(n²·d)이지만 완전 병렬화 가능하여 n &lt; d일 때 RNN보다 유리하다.
        </p>
        <M display>{'\\underbrace{Q \\cdot K^\\top}_{O(n^2 \\cdot d)} \\xrightarrow{\\div \\sqrt{d_k}} \\underbrace{\\text{softmax}}_{O(n^2)} \\xrightarrow{\\times V} \\underbrace{\\text{output}}_{O(n^2 \\cdot d)}'}</M>
      </div>
      <div className="not-prose my-8"><SelfAttnImplDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Self-Attention은 <strong>행렬 연산 4단계</strong>로 구현 — 간결성이 강점.<br />
          요약 2: <strong>O(n²) 복잡도</strong>가 긴 시퀀스의 병목.<br />
          요약 3: Flash/Sparse Attention 등 <strong>최적화 기법</strong>이 활발히 연구됨.
        </p>
      </div>
    </section>
  );
}
