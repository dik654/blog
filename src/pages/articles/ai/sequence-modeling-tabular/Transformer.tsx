import TransformerViz from './viz/TransformerViz';

export default function Transformer() {
  return (
    <section id="transformer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Transformer 기반 시퀀스 입력</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          집계 피처는 시퀀스를 압축하면서 <strong>세밀한 순서 정보를 일부 잃는다</strong>.
          "패스→패스→드리블→슛"과 "드리블→패스→슛→패스"는 n-gram 빈도가 같을 수 있지만,
          실제로는 전혀 다른 경기 흐름이다.
          Transformer는 시퀀스를 직접 처리하여 이런 미묘한 순서 패턴을 보존한다.
        </p>
        <p>
          핵심 아이디어: 각 이벤트를 하나의 <strong>토큰(token)</strong>으로 취급한다.
          NLP에서 단어가 토큰이듯, 이벤트 시퀀스에서 각 이벤트(패스, 슛 등)가 토큰이다.
          이벤트의 수치형·범주형 필드를 합쳐 d_model 차원 벡터로 인코딩하면,
          Transformer의 입력 형식과 동일해진다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Self-Attention으로 맥락 포착</h3>
        <p>
          Self-Attention의 동작 — 각 토큰이 Query(Q), Key(K), Value(V)로 분해되고,
          Q와 K의 내적으로 "어떤 토큰이 어떤 토큰과 관련 있는지" 어텐션 가중치를 계산한다.
          Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V.
        </p>
        <p>
          축구 패스 시퀀스에서 — "3번째 패스"의 Q가 "1번째 패스"의 K와 높은 점수를 받으면,
          두 패스가 같은 방향 빌드업 패턴의 일부라는 것을 모델이 학습한 것이다.
          Multi-Head Attention은 여러 개의 어텐션을 병렬로 계산하여
          방향·속도·선수 역할 등 서로 다른 관점의 관계를 동시에 포착한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">시퀀스 대표 벡터 추출: CLS vs 평균 풀링</h3>
        <p>
          Transformer의 출력은 (batch, seq_len, d_model) 형상이다.
          최종 예측을 위해 이 3D 텐서를 (batch, d_model) 2D로 줄여야 한다.
          두 가지 대표적 방법:
        </p>
        <ul>
          <li>
            <strong>[CLS] 토큰</strong> — BERT 스타일. 시퀀스 앞에 더미 토큰 [CLS]를 추가하고,
            Transformer 통과 후 [CLS] 위치의 히든 상태를 시퀀스 대표 벡터로 사용.
            [CLS]가 다른 모든 토큰을 어텐션으로 요약하므로 시퀀스 전체의 정보가 담긴다.
          </li>
          <li>
            <strong>평균 풀링(mean pooling)</strong> — 모든 토큰의 히든 상태를 평균.
            구현이 간단하고 안정적. 패딩 토큰은 마스크로 제외한다.
            이벤트 시퀀스에서는 CLS보다 평균 풀링이 더 안정적인 경우가 많다 — 시퀀스가 짧기 때문.
          </li>
        </ul>
      </div>

      <div className="not-prose my-8">
        <TransformerViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">축구 패스 예측 아키텍처</h3>
        <p>
          K리그 패스 좌표 예측의 전체 파이프라인:
        </p>
        <ul>
          <li>
            <strong>입력</strong>: 최근 K개 패스 이벤트, 각 이벤트 = (x, y, 선수ID, 이벤트타입, Δt)
          </li>
          <li>
            <strong>이벤트 인코딩</strong>: 수치형 Linear + 범주형 Embedding + 위치/시간 인코딩 → 합산
          </li>
          <li>
            <strong>Transformer</strong>: N개 레이어의 Multi-Head Self-Attention + FFN
          </li>
          <li>
            <strong>풀링</strong>: 평균 풀링 또는 [CLS] → (batch, d_model) 시퀀스 벡터
          </li>
          <li>
            <strong>MLP 헤드</strong>: Linear → ReLU → Linear → (next_x, next_y) 좌표 예측
          </li>
        </ul>
        <p>
          실전 하이퍼파라미터: d_model=64, n_heads=4, n_layers=2, max_len=15~20.
          이벤트 시퀀스는 NLP 문장보다 훨씬 짧으므로 작은 모델이면 충분하다.
          학습: AdamW 옵티마이저, lr=1e-4, MSE 손실.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">집계 + Transformer 결합</h3>
        <p>
          가장 강력한 전략은 <strong>두 접근을 결합</strong>하는 것이다.
          GBM용 집계 피처(통계, n-gram, 전환 확률)와 Transformer 시퀀스 벡터를 concat하여
          최종 모델에 입력한다. 집계 피처가 전체적인 통계를 제공하고,
          Transformer 벡터가 세밀한 순서 패턴을 보완하므로 앙상블 효과가 나타난다.
        </p>
        <p>
          Stacking 앙상블에서 — 1단계에서 GBM(집계 피처)과 Transformer(시퀀스)를 각각 학습하고,
          2단계 메타 모델이 두 예측을 결합하는 구조도 효과적이다.
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">주의: Transformer의 데이터 요구량</p>
        <p className="text-sm">
          Transformer는 Self-Attention이 시퀀스 길이의 제곱에 비례하는 연산량을 요구한다.
          이벤트 시퀀스가 짧아(10~20개) 연산량은 문제 없지만,
          <strong>학습 데이터가 수천 개 이하이면 과적합 위험이 크다</strong>.
          데이터가 적을 때는 집계 피처 + GBM이 더 안정적이고,
          데이터가 충분할 때(수만 개 이상) Transformer를 추가하는 것이 현실적 전략이다.
        </p>
      </div>
    </section>
  );
}
