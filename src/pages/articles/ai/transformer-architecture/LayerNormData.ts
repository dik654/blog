export const lnCode = `# Layer Normalization vs Batch Normalization
# LN: 각 토큰 독립적으로 d_model 차원에 걸쳐 정규화
# BN: 배치 내 같은 특징 차원에 걸쳐 정규화 (시퀀스에 부적합)

# Pre-LN (GPT-2, GPT-3, LLaMA)
class PreLNBlock(nn.Module):
    def forward(self, x):
        # 정규화 → 서브레이어 → 잔차 연결
        x = x + self.attn(self.ln1(x))   # 안정적 학습
        x = x + self.ffn(self.ln2(x))
        return x

# Post-LN (원본 Transformer)
class PostLNBlock(nn.Module):
    def forward(self, x):
        # 서브레이어 → 잔차 연결 → 정규화
        x = self.ln1(x + self.attn(x))   # 그래디언트 불안정
        x = self.ln2(x + self.ffn(x))
        return x

# Pre-LN 장점: warmup 불필요, 깊은 모델에서 안정`;

export const lnAnnotations = [
  { lines: [5, 11] as [number, number], color: 'sky' as const, note: 'Pre-LN: 안정적 학습 (GPT-2+)' },
  { lines: [13, 19] as [number, number], color: 'amber' as const, note: 'Post-LN: 원본 (warmup 필수)' },
];
