export type VariantKey = 'leaky' | 'prelu' | 'elu' | 'gelu' | 'swish' | 'swiglu';

export interface VariantDef {
  key: VariantKey;
  name: string;
  formula: string;
  color: string;
  fn: (x: number) => number;
}

const sig = (x: number) => 1 / (1 + Math.exp(-x));
const phi = (x: number) => 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)));

export const VARIANTS: VariantDef[] = [
  {
    key: 'leaky', name: 'Leaky ReLU',
    formula: 'max(0.01x, x)',
    color: '#3b82f6',
    fn: (x) => x > 0 ? x : 0.01 * x,
  },
  {
    key: 'prelu', name: 'PReLU (α=0.1)',
    formula: 'max(αx, x)',
    color: '#8b5cf6',
    fn: (x) => x > 0 ? x : 0.1 * x,
  },
  {
    key: 'elu', name: 'ELU (α=1)',
    formula: 'x>0: x, else: α(eˣ−1)',
    color: '#ef4444',
    fn: (x) => x > 0 ? x : Math.exp(x) - 1,
  },
  {
    key: 'gelu', name: 'GELU',
    formula: 'x·Φ(x)',
    color: '#10b981',
    fn: (x) => x * phi(x),
  },
  {
    key: 'swish', name: 'Swish',
    formula: 'x·σ(x)',
    color: '#f59e0b',
    fn: (x) => x * sig(x),
  },
  {
    key: 'swiglu', name: 'SwiGLU (gate)',
    formula: 'Swish(x)·x',
    color: '#ec4899',
    fn: (x) => x * sig(x) * x,
  },
];
