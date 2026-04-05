import EncoderViz from './viz/EncoderViz';

export default function Encoder() {
  return (
    <section id="encoder" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인코더: 문장을 벡터로 압축</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        단어별 LSTM 처리 → 마지막 (cs, hs)가 문장 전체를 압축한 컨텍스트 벡터.<br />
        cs = 장기 기억, hs = 단기 기억. 두 벡터가 문장의 모든 의미를 담는다.
      </p>
      <EncoderViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Encoder LSTM 상세 동작</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Encoder LSTM 처리 과정
//
// 입력: 토큰 시퀀스 x_1, x_2, ..., x_T
// 출력: 최종 context vector c = (c_T, h_T)
//
// Step 1: 토큰 임베딩
//   e_t = E[x_t]  # embedding lookup
//   E ∈ R^{vocab × d_emb}
//
// Step 2: LSTM 순차 처리
//   for t = 1 to T:
//     (c_t, h_t) = LSTM(e_t, (c_{t-1}, h_{t-1}))
//
//   여기서:
//     c_t: cell state (장기 기억)
//     h_t: hidden state (단기 기억, 출력)
//
// Step 3: 최종 context 추출
//   context = (c_T, h_T)
//   → 모든 입력 정보가 압축된 표현
//
// LSTM 내부 연산 (매 스텝):
//   f_t = σ(W_f · [h_{t-1}, e_t] + b_f)   # forget gate
//   i_t = σ(W_i · [h_{t-1}, e_t] + b_i)   # input gate
//   C̃_t = tanh(W_C · [h_{t-1}, e_t] + b_C) # candidate
//   c_t = f_t ⊙ c_{t-1} + i_t ⊙ C̃_t      # cell state
//   o_t = σ(W_o · [h_{t-1}, e_t] + b_o)   # output gate
//   h_t = o_t ⊙ tanh(c_t)                  # hidden state

// 4-layer deep LSTM (Sutskever 2014):
//   h_t^{(l)} = LSTM_l(h_t^{(l-1)}, h_{t-1}^{(l)})
//
//   각 층이 더 추상적 표현 학습
//   맨 위 층의 h_T가 최종 context
//
// 입력 역순화 효과:
//   "The cat sat" → "sat cat The"
//   - "The"와 "고양이"의 연결 거리 단축
//   - 기울기 흐름 개선
//   - BLEU +4.7 개선`}
        </pre>
        <p className="leading-7">
          요약 1: Encoder는 <strong>LSTM 순차 처리</strong>로 입력을 단일 context vector에 압축.<br />
          요약 2: <strong>(c_T, h_T) 쌍</strong>이 전체 문장 정보를 담음 — 장단기 기억 결합.<br />
          요약 3: <strong>입력 역순화</strong>가 초기 단어 간 거리를 단축 — 4.7 BLEU 개선.
        </p>
      </div>
    </section>
  );
}
