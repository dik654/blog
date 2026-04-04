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
    </div>
  );
}
