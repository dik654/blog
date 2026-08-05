import { CitationBlock } from '@/components/ui/citation';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import SelfAttnScene from './viz/SelfAttnScene';
import SelfAttnDetailScene from './viz/SelfAttnDetailScene';

export default function SelfAttention() {
  return (
    <section id="self-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Self-Attention & Multi-Head</h2>
      <div className="not-prose mb-8"><SelfAttnScene /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RNN은 이전 상태를 차례대로 넘기며 문맥을 만든다.
          더 직접적인 방법은 모든 토큰을 한 행렬 <M>{'X'}</M>로 놓고, 각 토큰이 같은 시퀀스의 다른 토큰을 한 번에 보게 하는 것.
          같은 <M>{'X'}</M>에서 찾는 표현, 비교되는 표현, 전달할 표현을 따로 만들면 이 직접 참조가 학습 가능해진다.
          이 구조에 붙은 이름이 self-attention.
        </p>

        <CitationBlock source="Vaswani et al., 2017 — Attention Is All You Need"
          citeKey={4} type="paper" href="https://arxiv.org/abs/1706.03762">
          <p className="italic">"Multi-head attention allows the model to jointly attend to information
          from different representation subspaces at different positions."</p>
        </CitationBlock>

        <h3 className="text-lg font-semibold mt-6 mb-3">Q, K, V 생성</h3>
        <M display>{'Q = X \\cdot \\underbrace{W_Q}_{d_{\\text{model}} \\times d_k}, \\quad K = X \\cdot \\underbrace{W_K}_{d_{\\text{model}} \\times d_k}, \\quad V = X \\cdot \\underbrace{W_V}_{d_{\\text{model}} \\times d_v}'}</M>
        <FormulaNote
          meaning="원본 X 하나를 그대로 비교와 전달에 모두 쓰면 역할이 섞인다. 세 투영은 같은 토큰을 질문하는 모습, 비교되는 모습, 전달하는 정보로 나눈다."
          symbols={[
            ['X', '입력 시퀀스 행렬. 각 행이 한 토큰 임베딩이다.'],
            ['W_Q, W_K, W_V', '같은 X에서 서로 다른 역할의 표현을 뽑는 학습 행렬이다.'],
            ['Q, K, V', 'Q는 찾는 쪽, K는 비교되는 쪽, V는 가중합으로 전달되는 쪽이다.'],
          ]}
        />

        <h3 className="text-lg font-semibold mt-6 mb-3">Scaled Dot-Product Attention</h3>
        <M display>{'\\text{Attention}(Q,K,V) = \\underbrace{\\text{softmax}\\!\\left(\\frac{Q K^\\top}{\\underbrace{\\sqrt{d_k}}_{\\text{스케일링}}}\\right)}_{\\text{주의 가중치}} \\cdot V'}</M>
        <FormulaNote
          meaning="QK^T는 모든 토큰 쌍을 비교한다. softmax는 각 토큰이 어느 위치를 볼지 분포로 만들고, V와의 곱은 그 분포대로 정보를 모은다."
          symbols={[
            ['QK^T', 'n개 토큰 사이의 n×n 점수표.'],
            ['softmax', 'raw 점수를 합 1 분포로 바꾼다. 그래야 V를 비율로 섞을 수 있다.'],
            ['·V', '선택 분포를 실제 전달 정보에 적용하는 가중합이다.'],
          ]}
        />

        <h3 className="text-lg font-semibold mt-6 mb-3">Multi-Head Attention</h3>
        <M display>{'\\text{MultiHead}(Q,K,V) = \\underbrace{\\text{Concat}(\\text{head}_1, \\ldots, \\text{head}_h)}_{\\text{모든 헤드 결과 이어붙이기}} \\cdot \\underbrace{W_O}_{d_{\\text{model}} \\times d_{\\text{model}}}'}</M>
        <FormulaNote
          meaning="한 head만 쓰면 한 score 공간에서 모든 관계를 처리해야 한다. 여러 head는 차원을 나눠 병렬로 보고, W_O가 그 결과를 다시 섞는다."
          symbols={[
            ['head_i', '한 부분공간에서 계산한 attention 출력.'],
            ['Concat', '여러 head 결과를 원래 폭으로 이어 붙이는 단계.'],
            ['W_O', 'head별 결과를 다음 layer가 쓰기 좋은 표현으로 다시 섞는 출력 투영.'],
          ]}
        />

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
          입력 <M>{'X'}</M>는 토큰 수 <M>{'n'}</M>과 모델 차원 <M>{'d_{model}'}</M>을 가진 행렬.
          BERT-base에서는 <M>{'d_{model}=768'}</M>, head 하나의 <M>{'d_k=64'}</M>.
          모든 토큰 쌍을 비교하므로 비용은 <M>{'O(n^2\\cdot d)'}</M>.
          대신 각 쌍 계산은 동시에 가능해 RNN의 순차 전달보다 병렬화가 쉽다.
        </p>
        <M display>{'\\text{Attention}(Q,K,V) = \\underbrace{\\text{softmax}\\!\\left(\\frac{\\overbrace{Q \\cdot K^\\top}^{\\text{유사도 행렬 (n×n)}}}{\\underbrace{\\sqrt{d_k}}_{\\text{스케일링}}}\\right)}_{\\text{주의 가중치 (확률 분포)}} \\cdot \\underbrace{V}_{\\text{값 (정보)}}'}</M>

        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Head의 역할</h3>
        <p>
          한 head는 <M>{'64'}</M>차원 폭에서 관계를 본다.
          12개 head를 두면 서로 다른 <M>{'W_Q,W_K,W_V'}</M>가 병렬로 학습된다.
          어떤 head는 주어-동사, 어떤 head는 직전 토큰, 어떤 head는 대명사-선행어 같은 패턴에 민감해질 수 있다.
          마지막 <M>{'W_O'}</M>가 이 결과를 다시 <M>{'768'}</M>차원으로 섞는다.
        </p>
        <M display>{'\\underbrace{\\text{head}_i}_{\\text{i번째 헤드}} = \\text{Attention}(\\underbrace{XW_i^Q}_{\\text{질의}},\\; \\underbrace{XW_i^K}_{\\text{키}},\\; \\underbrace{XW_i^V}_{\\text{값}})'}</M>
        <M display>{'\\text{MultiHead} = \\underbrace{\\text{Concat}(\\text{head}_0, \\ldots, \\text{head}_{11})}_{\\text{12개 헤드 결과 이어붙이기}} \\cdot \\underbrace{W_O}_{\\text{원래 차원으로 복원}}'}</M>
      </div>

      <div className="not-prose my-8"><SelfAttnDetailScene /></div>

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
