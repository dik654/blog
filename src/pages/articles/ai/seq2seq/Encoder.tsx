import EncoderViz from './viz/EncoderViz';
import S2SEncoderViz from './viz/S2SEncoderViz';
import M from '@/components/ui/math';

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
        <S2SEncoderViz />
        <M display>{'c_t = \\underbrace{f_t \\odot c_{t-1}}_{\\text{기존 기억 보존}} + \\underbrace{i_t \\odot \\tilde{C}_t}_{\\text{새 정보 반영}}, \\quad h_t = o_t \\odot \\tanh(c_t)'}</M>
        <p className="leading-7">
          <M>{'f_t = \\sigma(W_f \\cdot [h_{t-1}, e_t] + b_f)'}</M> — forget gate: 기존 cell state 유지 비율<br />
          <M>{'i_t = \\sigma(W_i \\cdot [h_{t-1}, e_t] + b_i)'}</M> — input gate: 새 정보 반영 비율<br />
          cell state의 <strong>덧셈 경로</strong>가 gradient highway 역할 — 장기 의존성 학습 가능
        </p>
        <p className="leading-7">
          요약 1: Encoder는 <strong>LSTM 순차 처리</strong>로 입력을 단일 context vector에 압축.<br />
          요약 2: <strong>(c_T, h_T) 쌍</strong>이 전체 문장 정보를 담음 — 장단기 기억 결합.<br />
          요약 3: <strong>입력 역순화</strong>가 초기 단어 간 거리를 단축 — 4.7 BLEU 개선.
        </p>
      </div>
    </section>
  );
}
