import AttentionDemo from '../components/AttentionDemo';
import AttentionFlowViz from './viz/AttentionFlowViz';

export default function SelfAttention() {
  return (
    <section id="self-attention">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Self-Attention 메커니즘</h2>
      <p className="leading-7 mb-4">
        Self-Attention — 입력 시퀀스의 각 토큰이 다른 모든 토큰과의 관계를 계산하는 메커니즘
      </p>
      <div className="rounded-lg border p-4 font-mono text-sm mb-6">
        Attention(Q, K, V) = softmax(QK<sup>T</sup> / √d<sub>k</sub>)V
      </div>
      <AttentionFlowViz />
      <ul className="mb-6 space-y-2 text-foreground/75">
        <li className="flex gap-2"><span className="text-foreground font-medium">Q (Query):</span> 현재 토큰이 찾고자 하는 정보</li>
        <li className="flex gap-2"><span className="text-foreground font-medium">K (Key):</span> 각 토큰이 제공하는 식별 정보</li>
        <li className="flex gap-2"><span className="text-foreground font-medium">V (Value):</span> 각 토큰이 실제로 전달하는 정보</li>
      </ul>
      <AttentionDemo />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Self-Attention 구현 코드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PyTorch 구현
import torch
import torch.nn as nn
import torch.nn.functional as F

class SelfAttention(nn.Module):
    def __init__(self, d_model, d_k):
        super().__init__()
        self.d_k = d_k
        self.W_Q = nn.Linear(d_model, d_k)
        self.W_K = nn.Linear(d_model, d_k)
        self.W_V = nn.Linear(d_model, d_k)

    def forward(self, x):
        # x: (batch, seq_len, d_model)
        Q = self.W_Q(x)  # (batch, seq_len, d_k)
        K = self.W_K(x)
        V = self.W_V(x)

        # Attention scores
        scores = Q @ K.transpose(-2, -1) / (self.d_k ** 0.5)
        # scores: (batch, seq_len, seq_len)

        # Softmax
        attn = F.softmax(scores, dim=-1)

        # Weighted sum
        output = attn @ V  # (batch, seq_len, d_k)
        return output

# 사용
attn = SelfAttention(d_model=512, d_k=64)
x = torch.randn(2, 10, 512)  # batch=2, seq=10, dim=512
out = attn(x)  # (2, 10, 64)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">복잡도 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Self-Attention 복잡도
//
// 시간 복잡도:
//   Q·K^T: O(n² · d)   ← 주 병목
//   softmax: O(n²)
//   ·V: O(n² · d)
//   Total: O(n² · d)
//
// 메모리 복잡도:
//   Attention matrix: O(n²)
//   → 긴 시퀀스에서 문제
//
// vs RNN:
//   RNN: O(n · d²), 순차 O(n)
//   Self-Attn: O(n² · d), 순차 O(1)
//
// 언제 Self-Attn이 이득?
//   n < d일 때 (대부분의 경우)
//
// 긴 시퀀스 문제:
//   - n=1024, d=512: n²·d = 5.3 × 10^8
//   - n=4096, d=512: n²·d = 8.6 × 10^9
//   - 메모리 O(n²)이 치명적
//
// 해결책:
//   - Sparse Attention (Longformer, BigBird)
//   - Linear Attention (Performer, Linformer)
//   - Flash Attention (메모리 최적화)
//   - Ring Attention (장문맥)

// Self-Attention의 장점:
//   1. O(1) path length (임의 거리 직접 연결)
//   2. 완전 병렬화
//   3. 해석 가능 (attention matrix)
//   4. 멀티모달 일관성`}
        </pre>
        <p className="leading-7">
          요약 1: Self-Attention은 <strong>~50줄</strong>로 구현 가능 — 간결성이 강점.<br />
          요약 2: <strong>O(n²) 복잡도</strong>가 긴 시퀀스의 병목.<br />
          요약 3: Flash/Sparse Attention 등 <strong>최적화 기법</strong>이 활발히 연구됨.
        </p>
      </div>
    </section>
  );
}
