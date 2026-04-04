export const trainCode = `# Transformer 학습 핵심 기법
# 1. LR Schedule: Linear Warmup + Cosine Decay
lr = d_model ** (-0.5) * min(step ** (-0.5), step * warmup ** (-1.5))

# 2. AdamW: 가중치 감쇠 분리
optimizer = AdamW(params, lr=3e-4, betas=(0.9, 0.95),
                  weight_decay=0.1, eps=1e-8)

# 3. Mixed Precision Training
scaler = GradScaler()
with autocast(dtype=torch.float16):
    loss = model(batch)                # FP16 forward
scaler.scale(loss).backward()          # FP32 grad 축적
scaler.step(optimizer)                 # 언더플로 체크 후 업데이트
scaler.update()                        # 스케일 조정

# 4. Gradient Clipping (폭발 방지)
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)`;

export const trainAnnotations = [
  { lines: [3, 3] as [number, number], color: 'sky' as const, note: '원본 논문의 LR 공식' },
  { lines: [5, 7] as [number, number], color: 'emerald' as const, note: 'AdamW 설정 (GPT-3 스타일)' },
  { lines: [9, 15] as [number, number], color: 'amber' as const, note: 'Mixed Precision 학습 루프' },
];
