import MultiHeadDemo from '../components/MultiHeadDemo';
import MultiHeadMergeViz from './viz/MultiHeadMergeViz';

export default function MultiHead() {
  return (
    <section id="multi-head">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Multi-Head Attention</h2>
      <p className="leading-7 mb-6">
        단일 Attention 대신 여러 개의 Attention Head를 병렬로 사용<br />
        서로 다른 관점에서 정보를 포착 — 각 Head는 독립적인 Q, K, V 가중치를 보유
      </p>
      <MultiHeadMergeViz />
      <MultiHeadDemo />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Head 수식과 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Multi-Head Attention 수식
//
// head_i = Attention(Q W_Q^i, K W_K^i, V W_V^i)
// MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O
//
// 차원:
//   입력 d_model=512, h=8 (heads)
//   d_k = d_v = d_model / h = 64
//
// 파라미터:
//   W_Q^i, W_K^i: (d_model, d_k) = (512, 64) × 8 = 512×512
//   W_V^i: (d_model, d_v) = 512×512
//   W_O: (h·d_v, d_model) = (512, 512)
//   Total: 4 × 512² = 1.05M per block

// PyTorch 구현:
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model=512, num_heads=8):
        super().__init__()
        self.d_model = d_model
        self.h = num_heads
        self.d_k = d_model // num_heads

        self.W_Q = nn.Linear(d_model, d_model)
        self.W_K = nn.Linear(d_model, d_model)
        self.W_V = nn.Linear(d_model, d_model)
        self.W_O = nn.Linear(d_model, d_model)

    def forward(self, x):
        B, N, _ = x.shape  # batch, seq_len, d_model

        # Linear projections & reshape for heads
        Q = self.W_Q(x).view(B, N, self.h, self.d_k).transpose(1, 2)
        K = self.W_K(x).view(B, N, self.h, self.d_k).transpose(1, 2)
        V = self.W_V(x).view(B, N, self.h, self.d_k).transpose(1, 2)
        # shape: (B, h, N, d_k)

        # Attention per head
        scores = Q @ K.transpose(-2, -1) / (self.d_k ** 0.5)
        attn = F.softmax(scores, dim=-1)
        out = attn @ V  # (B, h, N, d_k)

        # Concatenate heads
        out = out.transpose(1, 2).contiguous().view(B, N, self.d_model)
        return self.W_O(out)

// 왜 여러 헤드?
//   - 다양한 관계 포착 (구문·의미·위치)
//   - 표현력 증가 (single head 768 vs 12×64)
//   - 노이즈 robustness
//   - 병렬 처리 유리`}
        </pre>
        <p className="leading-7">
          요약 1: Multi-Head는 <strong>병렬 attention</strong>으로 다양한 관계 동시 학습.<br />
          요약 2: 총 파라미터 수는 <strong>single head와 동일</strong> — 차원 분할.<br />
          요약 3: 실무에서는 <strong>h=8~16</strong> 헤드가 표준.
        </p>
      </div>
    </section>
  );
}
