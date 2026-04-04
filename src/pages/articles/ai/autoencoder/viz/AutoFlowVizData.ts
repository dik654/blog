export const LAYERS = [
  { label: '입력', dim: 4, color: '#3b82f6' },
  { label: '인코더', dim: 3, color: '#6366f1' },
  { label: '잠재', dim: 2, color: '#f59e0b' },
  { label: '디코더', dim: 3, color: '#10b981' },
  { label: '출력', dim: 4, color: '#3b82f6' },
];

export const LABELS = {
  input: ['x₁', 'x₂', 'x₃', 'x₄'],
  latent: ['z₁', 'z₂'],
  output: ['x̂₁', 'x̂₂', 'x̂₃', 'x̂₄'],
};
