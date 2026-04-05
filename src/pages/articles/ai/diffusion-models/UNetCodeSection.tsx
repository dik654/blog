import CodePanel from '@/components/ui/code-panel';

const CODE = `class ResBlock(nn.Module):
    def __init__(self, ch, t_emb_dim):
        super().__init__()
        self.norm1 = nn.GroupNorm(8, ch)
        self.conv1 = nn.Conv2d(ch, ch, 3, padding=1)
        self.t_proj = nn.Linear(t_emb_dim, ch)  # 시간 임베딩 주입
        self.conv2 = nn.Conv2d(ch, ch, 3, padding=1)

    def forward(self, x, t_emb):
        h = self.conv1(F.silu(self.norm1(x)))
        h = h + self.t_proj(F.silu(t_emb))[:, :, None, None]
        h = self.conv2(F.silu(h))
        return x + h   # residual connection

class CrossAttention(nn.Module):
    def __init__(self, dim, context_dim):
        super().__init__()
        self.to_q = nn.Linear(dim, dim)
        self.to_k = nn.Linear(context_dim, dim)
        self.to_v = nn.Linear(context_dim, dim)

    def forward(self, x, context):
        q = self.to_q(x)         # image features → Query
        k = self.to_k(context)   # text embedding → Key
        v = self.to_v(context)   # text embedding → Value
        attn = (q @ k.T) / (dim ** 0.5)
        return F.softmax(attn, dim=-1) @ v`;

const ANNOTATIONS = [
  { lines: [6, 6] as [number, number], color: 'sky' as const, note: '시간 임베딩 프로젝션' },
  { lines: [11, 11] as [number, number], color: 'emerald' as const, note: 't_emb를 공간 차원에 브로드캐스트' },
  { lines: [23, 25] as [number, number], color: 'amber' as const, note: 'Cross-Attention QKV' },
];

export default function UNetCodeSection() {
  return (
    <div className="not-prose mt-4">
      <CodePanel title="ResBlock + CrossAttention 구현" code={CODE} annotations={ANNOTATIONS} />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Timestep Embedding 구현
def timestep_embedding(t, dim=128):
    """Sinusoidal timestep embedding (like positional encoding)"""
    half = dim // 2
    freqs = torch.exp(
        -math.log(10000) * torch.arange(half, dtype=torch.float32) / half
    )
    args = t[:, None].float() * freqs[None]
    embedding = torch.cat([torch.cos(args), torch.sin(args)], dim=-1)
    return embedding

# t: (B,) timestep
# emb: (B, dim) embedding

// TimeMLP:
class TimeEmbedding(nn.Module):
    def __init__(self, dim, time_dim):
        super().__init__()
        self.fc1 = nn.Linear(dim, time_dim)
        self.fc2 = nn.Linear(time_dim, time_dim)

    def forward(self, t):
        emb = timestep_embedding(t, self.fc1.in_features)
        emb = F.silu(self.fc1(emb))
        return self.fc2(emb)

// 각 ResBlock에 t_emb 주입:
//   h = conv1(x)
//   h = h + t_proj(t_emb)  # 시간 조건부
//   h = conv2(h)
//   return h + x  # residual`}
        </pre>
      </div>
    </div>
  );
}
