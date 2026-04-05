import MaskedAttentionViz from './viz/MaskedAttentionViz';

export default function MaskedAttention() {
  return (
    <section id="masked-attention" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">마스크 어텐션 (디코더)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          디코더는 <strong>자기회귀(autoregressive)</strong> 방식으로 동작한다<br />
          "나는 학생 ___" — 빈칸을 채울 때 미래 단어를 보면 안 된다<br />
          상삼각 영역에 -∞를 넣어 미래 토큰을 차단한다
        </p>
      </div>

      <MaskedAttentionViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>마스크 적용 원리</h3>
        <div className="rounded-lg border p-3 text-sm space-y-2 mb-4">
          <div><strong>1.</strong> 스케일된 어텐션 스코어 계산 (Q×K<sup>T</sup>/√d_k)</div>
          <div><strong>2.</strong> 상삼각(미래 위치)에 -∞ 대입</div>
          <div><strong>3.</strong> Softmax 적용 → e<sup>-∞</sup> = 0</div>
        </div>
        <p>
          결과: 각 토큰은 자신과 이전 토큰만 참조 가능<br />
          인코더의 Self-Attention에는 마스크가 없다 — 양방향 참조
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Causal Mask 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Causal (Lower-Triangular) Mask
//
// 4 토큰 시퀀스의 mask 예시:
//
//       t=0  t=1  t=2  t=3
//   t=0  0   -∞   -∞   -∞
//   t=1  0    0   -∞   -∞
//   t=2  0    0    0   -∞
//   t=3  0    0    0    0
//
// Softmax 적용 후:
//   exp(-∞) = 0 → 해당 위치 attention weight = 0
//
// PyTorch 구현:
seq_len = 4
mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1)
mask = mask.masked_fill(mask == 1, float('-inf'))
# mask:
# [[0, -inf, -inf, -inf],
#  [0,    0, -inf, -inf],
#  [0,    0,    0, -inf],
#  [0,    0,    0,    0]]

scores = Q @ K.transpose(-2, -1) / sqrt(d_k)
scores = scores + mask  # 미래 위치에 -inf 추가
attn = F.softmax(scores, dim=-1)

// 왜 Causal Masking?
//
// Decoder-only 모델 (GPT):
//   - 학습 목표: P(x_t | x_<t)
//   - 미래 토큰 보면 "cheating"
//   - Autoregressive 생성과 일관성
//
// Encoder-only 모델 (BERT):
//   - 학습 목표: P(x_masked | x_context)
//   - 양방향 문맥 필요
//   - Mask 불필요

// 학습 효율성:
//   - Causal mask로 teacher forcing 병렬화
//   - 전체 시퀀스 한 번에 학습
//   - GPT 계열의 사전학습 방식
//
// 생성 시:
//   - 한 번에 한 토큰 (autoregressive)
//   - KV cache로 이전 K, V 재사용
//   - 생성 속도 최적화`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Lower-triangular mask</strong>로 미래 토큰 참조 차단.<br />
          요약 2: GPT는 <strong>causal mask 필수</strong>, BERT는 불필요 (양방향).<br />
          요약 3: 학습 시 <strong>병렬화</strong>, 추론 시 <strong>autoregressive</strong>.
        </p>
      </div>
    </section>
  );
}
