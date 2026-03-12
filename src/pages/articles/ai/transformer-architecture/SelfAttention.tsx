import AttentionDemo from '../components/AttentionDemo';

export default function SelfAttention() {
  return (
    <section id="self-attention">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Self-Attention 메커니즘</h2>
      <p className="text-muted-foreground leading-7 mb-4">
        Self-Attention은 입력 시퀀스의 각 토큰이 다른 모든 토큰과의 관계를 계산하는 메커니즘입니다.
      </p>
      <div className="rounded-lg border bg-muted/50 p-4 font-mono text-sm mb-6">
        Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>)V
      </div>
      <ul className="mb-6 space-y-2 text-muted-foreground">
        <li className="flex gap-2"><span className="text-foreground font-medium">Q (Query):</span> 현재 토큰이 찾고자 하는 정보</li>
        <li className="flex gap-2"><span className="text-foreground font-medium">K (Key):</span> 각 토큰이 제공하는 식별 정보</li>
        <li className="flex gap-2"><span className="text-foreground font-medium">V (Value):</span> 각 토큰이 실제로 전달하는 정보</li>
      </ul>
      <AttentionDemo />
    </section>
  );
}
