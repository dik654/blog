export const ffnCode = `# FFN 기본 구조: FFN(x) = W2 * act(W1 * x + b1) + b2
class FeedForward(nn.Module):
    def __init__(self, d_model=512, d_ff=2048):
        self.w1 = nn.Linear(d_model, d_ff)   # 확장
        self.w2 = nn.Linear(d_ff, d_model)   # 복원
        self.dropout = nn.Dropout(0.1)

    def forward(self, x):
        return self.w2(self.dropout(F.gelu(self.w1(x))))

# SwiGLU (LLaMA, PaLM에서 사용)
class SwiGLUFFN(nn.Module):
    def __init__(self, d_model, d_ff):
        self.w1 = nn.Linear(d_model, d_ff, bias=False)
        self.w3 = nn.Linear(d_model, d_ff, bias=False) # gate
        self.w2 = nn.Linear(d_ff, d_model, bias=False)

    def forward(self, x):
        return self.w2(F.silu(self.w1(x)) * self.w3(x))`;

export const ffnAnnotations = [
  { lines: [2, 9] as [number, number], color: 'sky' as const, note: '표준 FFN (GELU 활성화)' },
  { lines: [11, 19] as [number, number], color: 'emerald' as const, note: 'SwiGLU: 게이트 메커니즘 추가' },
];
