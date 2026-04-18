import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import SelfAttnViz from './viz/SelfAttnViz';
import SelfAttnDetailViz from './viz/SelfAttnDetailViz';

export default function SelfAttention() {
  return (
    <section id="self-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Self-Attention & Multi-Head</h2>
      <div className="not-prose mb-8"><SelfAttnViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Self-Attention — 입력 시퀀스가 <strong>자기 자신에 대해</strong> 어텐션 수행<br />
          Q, K, V 모두 같은 입력 X에서 파생 → "Self"<br />
          Multi-Head — 여러 헤드가 <strong>서로 다른 표현 부분공간</strong>에서 병렬로 어텐션 학습, 더 풍부한 패턴 포착
        </p>

        <CitationBlock source="Vaswani et al., 2017 — Attention Is All You Need"
          citeKey={4} type="paper" href="https://arxiv.org/abs/1706.03762">
          <p className="italic">"Multi-head attention allows the model to jointly attend to information
          from different representation subspaces at different positions."</p>
        </CitationBlock>

        <h3 className="text-lg font-semibold mt-6 mb-3">Q, K, V 생성</h3>
        <M display>{'Q = X \\cdot \\underbrace{W_Q}_{d_{\\text{model}} \\times d_k}, \\quad K = X \\cdot \\underbrace{W_K}_{d_{\\text{model}} \\times d_k}, \\quad V = X \\cdot \\underbrace{W_V}_{d_{\\text{model}} \\times d_v}'}</M>

        <h3 className="text-lg font-semibold mt-6 mb-3">Scaled Dot-Product Attention</h3>
        <M display>{'\\text{Attention}(Q,K,V) = \\underbrace{\\text{softmax}\\!\\left(\\frac{Q K^\\top}{\\underbrace{\\sqrt{d_k}}_{\\text{스케일링}}}\\right)}_{\\text{주의 가중치}} \\cdot V'}</M>

        <h3 className="text-lg font-semibold mt-6 mb-3">Multi-Head Attention</h3>
        <M display>{'\\text{MultiHead}(Q,K,V) = \\underbrace{\\text{Concat}(\\text{head}_1, \\ldots, \\text{head}_h)}_{\\text{모든 헤드 결과 이어붙이기}} \\cdot \\underbrace{W_O}_{d_{\\text{model}} \\times d_{\\text{model}}}'}</M>

        <div className="grid grid-cols-2 gap-3 my-6 not-prose">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-4">
            <div className="font-semibold text-sky-700 dark:text-sky-300 mb-1">Q — Query (질의)</div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300"><strong>무엇을 찾을지</strong> 결정하는 벡터. 현재 토큰이 다른 토큰에게 "나와 관련 있어?"라고 묻는 역할.</p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
            <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">K — Key (키)</div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300"><strong>무엇과 비교할지</strong> 결정하는 벡터. 각 토큰이 자신의 특징을 내보내는 "라벨" — Q와 내적으로 유사도 측정.</p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
            <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">V — Value (값)</div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300"><strong>실제 전달할 정보</strong>. 유사도가 높은 토큰의 V가 큰 가중치로 합산되어 최종 출력 구성.</p>
          </div>
          <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/40 p-4">
            <div className="font-semibold text-violet-700 dark:text-violet-300 mb-1"><M>{'\\sqrt{d_k}'}</M> — 스케일링</div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300"><M>{'d_k'}</M>가 클수록 <M>{'QK^\\top'}</M> 내적값이 커져 softmax가 극단적 분포로 수렴. <M>{'\\sqrt{d_k}'}</M>로 나눠 기울기 소실 방지.</p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Self-Attention 상세 분석</h3>
        <p>
          입력 X에 세 가중치 행렬을 곱해 Q, K, V를 만든다 (BERT-base: d_model=768, d_k=64).
          같은 X에서 Q, K, V 모두 파생되므로 "Self" — 시퀀스 내부 관계를 학습한다.
          시간 복잡도 O(n²·d)이지만 완전 병렬화 가능하여 RNN의 O(n·d²) 순차 처리보다 n &lt; d일 때 유리하다.
        </p>
        <M display>{'\\text{Attention}(Q,K,V) = \\underbrace{\\text{softmax}\\!\\left(\\frac{\\overbrace{Q \\cdot K^\\top}^{\\text{유사도 행렬 (n×n)}}}{\\underbrace{\\sqrt{d_k}}_{\\text{스케일링}}}\\right)}_{\\text{주의 가중치 (확률 분포)}} \\cdot \\underbrace{V}_{\\text{값 (정보)}}'}</M>

        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Head의 역할</h3>
        <p>
          12개 헤드가 독립 W_Q, W_K, W_V로 서로 다른 표현 부분공간에서 병렬 어텐션 학습.
          구문 관계(주어-동사), 의미 관계(유의어), 위치 관계(직전 토큰), 공참조(대명사-선행어) 등 다양한 관계를 동시 포착한다.
          블록당 파라미터 약 236만 — 같은 크기에서 단일 헤드 대비 더 풍부한 표현.
        </p>
        <M display>{'\\underbrace{\\text{head}_i}_{\\text{i번째 헤드}} = \\text{Attention}(\\underbrace{XW_i^Q}_{\\text{질의}},\\; \\underbrace{XW_i^K}_{\\text{키}},\\; \\underbrace{XW_i^V}_{\\text{값}})'}</M>
        <M display>{'\\text{MultiHead} = \\underbrace{\\text{Concat}(\\text{head}_0, \\ldots, \\text{head}_{11})}_{\\text{12개 헤드 결과 이어붙이기}} \\cdot \\underbrace{W_O}_{\\text{원래 차원으로 복원}}'}</M>
      </div>

      <div className="not-prose my-8"><SelfAttnDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: Self-Attention은 <strong>Q=K=V</strong>가 같은 입력에서 파생 — 시퀀스 내부 관계 학습.<br />
          요약 2: Multi-Head로 <strong>다양한 관계 유형</strong> 동시 학습 — 구문·의미·위치 패턴 분리.<br />
          요약 3: O(n²) 복잡도가 장단점 — 완전 병렬화 가능하나 긴 시퀀스에 부담.
        </p>
      </div>
    </section>
  );
}
