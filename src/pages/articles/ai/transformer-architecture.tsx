export default function TransformerArchitecture() {
  return (
    <div className="space-y-12">
      <section id="overview">
        <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">개요</h2>
        <p className="text-muted-foreground leading-7">
          Transformer는 2017년 "Attention Is All You Need" 논문에서 제안된 아키텍처로,
          기존 RNN/LSTM 기반 시퀀스 모델의 한계를 극복했습니다.
          병렬 처리가 가능하고, 긴 시퀀스에서도 효과적으로 의존성을 포착합니다.
        </p>
      </section>

      <section id="self-attention">
        <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Self-Attention 메커니즘</h2>
        <p className="text-muted-foreground leading-7 mb-4">
          Self-Attention은 입력 시퀀스의 각 토큰이 다른 모든 토큰과의 관계를 계산하는 메커니즘입니다.
        </p>
        <div className="rounded-lg border bg-muted/50 p-4 font-mono text-sm">
          Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>)V
        </div>
        <ul className="mt-4 space-y-2 text-muted-foreground">
          <li className="flex gap-2"><span className="text-foreground font-medium">Q (Query):</span> 현재 토큰이 찾고자 하는 정보</li>
          <li className="flex gap-2"><span className="text-foreground font-medium">K (Key):</span> 각 토큰이 제공하는 식별 정보</li>
          <li className="flex gap-2"><span className="text-foreground font-medium">V (Value):</span> 각 토큰이 실제로 전달하는 정보</li>
        </ul>
      </section>

      <section id="multi-head">
        <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Multi-Head Attention</h2>
        <p className="text-muted-foreground leading-7">
          단일 Attention 대신 여러 개의 Attention Head를 병렬로 사용하여
          서로 다른 관점에서 정보를 포착합니다. 각 Head는 독립적인 Q, K, V 가중치를 가집니다.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['Head 1', 'Head 2', 'Head 3', 'Head N'].map((head) => (
            <div
              key={head}
              className="rounded-lg border bg-accent/50 p-3 text-center text-sm font-medium"
            >
              {head}
            </div>
          ))}
        </div>
      </section>

      <section id="positional-encoding">
        <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Positional Encoding</h2>
        <p className="text-muted-foreground leading-7">
          Transformer는 순서 정보가 없으므로, Positional Encoding을 통해
          토큰의 위치 정보를 주입합니다. 사인/코사인 함수를 사용하는 방식이 원래 논문의 방법입니다.
        </p>
        <div className="mt-4 rounded-lg border bg-muted/50 p-4 font-mono text-sm space-y-1">
          <div>PE(pos, 2i) = sin(pos / 10000<sup>2i/d</sup>)</div>
          <div>PE(pos, 2i+1) = cos(pos / 10000<sup>2i/d</sup>)</div>
        </div>
      </section>

      <section id="summary">
        <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">정리</h2>
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">1</span>
            <p className="text-muted-foreground text-sm">Self-Attention으로 시퀀스 내 모든 토큰 간 관계 계산</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">2</span>
            <p className="text-muted-foreground text-sm">Multi-Head로 다양한 관점의 정보 포착</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">3</span>
            <p className="text-muted-foreground text-sm">Positional Encoding으로 순서 정보 보존</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">4</span>
            <p className="text-muted-foreground text-sm">병렬 처리 가능 → 학습 속도 대폭 향상</p>
          </div>
        </div>
      </section>
    </div>
  );
}
