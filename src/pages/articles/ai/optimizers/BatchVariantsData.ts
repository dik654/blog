import type { Annotation } from '@/components/ui/code-panel';

export const batchCode = `# y = wx 회귀, 5개 데이터, w=0.2, η=0.01, MSE 손실

data = [(1,2),(2,4),(3,6),(4,8),(5,10)]   # 정답: w=2
w, lr = 0.2, 0.01

# ── Batch GD: 전체 5개로 기울기 1번 ──
grad = sum(2*x*(w*x - y) for x,y in data) / 5   # = -39.6
w_batch = w - lr * grad                          # 0.2 - 0.01*(-39.6) = 0.596

# ── Stochastic GD: 1개씩 기울기 5번 ──
w_sgd = 0.2
for x, y in data:
    grad = 2 * x * (w_sgd * x - y)
    w_sgd = w_sgd - lr * grad
# w 변화: 0.2 → 0.236 → 0.353 → 0.650 → 1.243 → 2.243

# ── Mini-batch GD (size=2): 묶음 단위 ──
w_mb = 0.2
for batch in [data[:2], data[2:4], data[4:]]:
    grad = sum(2*x*(w_mb*x - y) for x,y in batch) / len(batch)
    w_mb = w_mb - lr * grad
# w 변화: 0.2 → 0.272 → 0.541 → 1.041`;

export const batchAnnotations: Annotation[] = [
  { lines: [7, 8], color: 'sky', note: 'Batch: 전체 평균 기울기 → 안정적' },
  { lines: [11, 14], color: 'emerald', note: 'SGD: 1개씩 → 빠르지만 노이즈' },
  { lines: [18, 21], color: 'amber', note: 'Mini-batch: 묶음 → 균형' },
];
