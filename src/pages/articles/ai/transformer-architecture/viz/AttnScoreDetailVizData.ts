import type { StepDef } from '@/components/ui/step-viz';

export const C = { q: '#6366f1', k: '#10b981', v: '#f59e0b', scale: '#ef4444', soft: '#3b82f6', muted: '#64748b' };

export const STEPS: StepDef[] = [
  {
    label: 'Step 1: Q·K^T — 유사도 행렬 계산',
    body: 'scores[i][j] = Q[i] · K[j] — 내적(dot product).\n3개 토큰, d_k=6일 때 → 3×3 행렬.\nscores[0][0] = 1.0·0.9+0.5·0.4+...+0.3·0.3 = 1.23.\nscores[0][1] = 0.68, scores[0][2] = 0.35.\n대각선이 크면 자기 참조(self-reference) 강함.\n전체 행렬로 모든 쌍의 유사도 한 번에 계산.',
  },
  {
    label: 'Step 2: √d_k 스케일링 — 기울기 소실 방지',
    body: '√d_k = √6 ≈ 2.449로 나누기.\nscaled = [[0.502, 0.278, 0.143], ...].\nd_k가 크면 내적 값 커짐 → softmax 포화.\nQ와 K 원소가 평균 0, 분산 1이면 내적 분산 = d_k.\n스케일링 후 분산 ≈ 1 → softmax 기울기 건강.\n이 스케일링 없으면 학습 초기 기울기 소실.',
  },
  {
    label: 'Step 3: Softmax — 행별 확률 분포',
    body: 'Row 0: softmax([0.502, 0.278, 0.143])\n= [0.412, 0.329, 0.259]. 합 = 1.0.\nRow 1: [0.325, 0.359, 0.316].\nRow 2: [0.293, 0.289, 0.418].\n각 행이 독립적인 확률 분포 → 주의(attention) 가중치.\n낮은 entropy = 특정 토큰에 집중. 높으면 분산.',
  },
  {
    label: 'Step 4: × V — 문맥 반영 출력',
    body: 'output[i] = Σ_j attn[i][j] × V[j].\n토큰 0: 0.412×V[0] + 0.329×V[1] + 0.259×V[2].\n자기 자신(0.412)에 가장 많이 주목.\n인접 토큰(0.329)에도 상당히 주목.\n결과: 각 토큰이 문맥 정보를 흡수한 벡터.\n출력 shape: (3, d_k=6) — 입력과 동일한 크기.',
  },
];
