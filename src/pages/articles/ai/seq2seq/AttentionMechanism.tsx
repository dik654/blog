import AttentionMechViz from './viz/AttentionMechViz';

export default function AttentionMechanism() {
  return (
    <section id="attention-mechanism" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어텐션 메커니즘 도입</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Seq2Seq 한계 복습</h3>
        <p>
          50단어, 100단어 문장도 <strong>같은 크기의 벡터 하나</strong>에 압축<br />
          앞부분 정보가 사라지고, 문장이 길수록 번역 품질이 급감<br />
          핵심 문제: 인코더의 중간 은닉 상태를 전부 버린다
        </p>

        <h3>해결: 은닉 상태를 전부 보관</h3>
        <p>
          Bahdanau et al. (2015) — 인코더의 h₁, h₂, h₃를 <strong>전부 저장</strong><br />
          디코더가 매 스텝마다 "어디를 볼지" 선택 — 동적 컨텍스트 벡터 생성<br />
          고정 벡터 병목을 완전히 해소
        </p>

        <h3>3가지 점수 계산법</h3>
        <p>
          <strong>Dot Product</strong> — sᵀh, 가장 단순<br />
          <strong>General</strong> — sᵀWh, 학습 가능한 가중치 행렬 W 추가<br />
          <strong>Additive (Bahdanau)</strong> — vᵀtanh(W₁s + W₂h), 비선형 결합
        </p>
      </div>
      <div className="not-prose my-8">
        <AttentionMechViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Attention 동작 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Attention-based Seq2Seq (Bahdanau 2015)
//
// Encoder (변경):
//   모든 hidden state 유지: H = (h_1, h_2, ..., h_T)
//   단순히 h_T만 쓰는 것이 아님
//
// Decoder (매 스텝):
//   s_{t-1}: 이전 디코더 상태
//   h_j: j번째 인코더 상태
//
//   Step 1: Alignment score
//     e_tj = score(s_{t-1}, h_j)  for j=1..T
//
//   Step 2: Attention weights
//     α_tj = exp(e_tj) / Σ_k exp(e_tk)
//
//   Step 3: Context vector (동적)
//     c_t = Σ_j α_tj · h_j
//
//   Step 4: Decoder update
//     s_t = LSTM(s_{t-1}, concat(y_{t-1}, c_t))
//     y_t = softmax(W · concat(s_t, c_t))
//
// 핵심 차이:
//   Seq2Seq: c = h_T (고정, 모든 스텝 공유)
//   Attention: c_t (매 스텝 다름, 입력 동적 재조합)

// 성능 개선 (Bahdanau 2015):
//   WMT'14 English→French
//   - Seq2Seq: BLEU 29.3 (baseline)
//   - + Attention: BLEU 36.2 (+6.9 point!)
//
//   긴 문장에서 특히 큰 개선
//   50단어 이상: +10 BLEU

// Alignment 해석:
//   α_tj 값이 출력 t와 입력 j의 "정렬도"
//   → attention heatmap으로 시각화
//   → 자동 학습된 word alignment

// 역사적 의의:
//   Bahdanau 2015 = "내가 그 논문을 보지 않았다면
//                    Transformer도 없었다" (Vaswani)
//   Attention의 탄생 → Transformer의 기반`}
        </pre>
        <p className="leading-7">
          요약 1: Attention의 핵심은 <strong>동적 context vector</strong> c_t — 매 스텝 다름.<br />
          요약 2: <strong>α_tj</strong>가 출력-입력 정렬을 자동 학습 — 해석 가능성 확보.<br />
          요약 3: Seq2Seq + Attention이 <strong>BLEU +7 point</strong> 개선 — 기계번역 혁명.
        </p>
      </div>
    </section>
  );
}
