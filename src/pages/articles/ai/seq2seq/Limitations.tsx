import BottleneckViz from './viz/BottleneckViz';

export default function Limitations() {
  return (
    <section id="limitations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">한계와 발전</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        긴 문장을 같은 크기 벡터에 압축 → 정보 병목.<br />
        해결: Attention(Bahdanau 2015) → Self-Attention → Transformer → GPT/BERT.
      </p>
      <BottleneckViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Seq2Seq의 구조적 한계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 한계 1: 고정 차원 Bottleneck
//   - 모든 입력 정보가 c ∈ R^d (d=512 보통)에 압축
//   - 100단어 문장도, 10단어 문장도 같은 크기
//   - 긴 문장에서 정보 손실 심각
//
//   측정:
//     문장 길이  |  BLEU (Sutskever 2014)
//     < 10       |   22.9
//     10-20      |   29.0
//     20-30      |   28.6
//     30-40      |   26.3
//     > 40       |   20.5  ← 급락
//
// 한계 2: 장기 의존성
//   - 문장 앞부분이 c_T까지 전달되기 어려움
//   - LSTM도 완벽하지 않음 (~100 토큰 한계)
//   - 역순 입력은 임시방편
//
// 한계 3: 순차 처리
//   - Encoder/Decoder 모두 LSTM 기반
//   - 병렬화 불가 (시간축)
//   - GPU 활용률 저조
//
// 한계 4: 해석 불가
//   - 어떤 입력 단어가 어떤 출력에 영향?
//   - 내부 동작 블랙박스
//   - 디버깅 어려움

// 해결책 진화:
//
// 2015: Attention (Bahdanau, Luong)
//   - 모든 encoder hidden state 저장
//   - 디코더가 매 스텝 동적으로 선택
//   - Bottleneck 해소
//
// 2017: Transformer (Vaswani)
//   - Self-Attention으로 RNN 완전 대체
//   - 병렬 처리 가능
//   - Multi-head로 관계 다각화
//
// 2018: BERT, GPT
//   - 사전학습 + 파인튜닝
//   - 거대 모델 학습 가능
//
// 2020+: Foundation Models
//   - GPT-3, 4, LLaMA, Claude
//   - few-shot, zero-shot
//   - 범용 언어 이해/생성

// Seq2Seq의 유산:
//   - Encoder-Decoder 패러다임
//   - Autoregressive 생성
//   - Teacher forcing
//   - BLEU 평가 관행
//   - 현대 LLM의 모든 기반`}
        </pre>
        <p className="leading-7">
          요약 1: Seq2Seq의 <strong>4가지 한계</strong>(bottleneck·장기의존성·순차성·해석불가)가 Attention/Transformer 필요성 초래.<br />
          요약 2: <strong>Attention → Transformer → BERT/GPT</strong>의 진화가 모두 Seq2Seq 한계 극복의 산물.<br />
          요약 3: <strong>Encoder-Decoder 패러다임</strong>은 Seq2Seq의 영속적 유산.
        </p>
      </div>
    </section>
  );
}
