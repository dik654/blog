export interface Variant {
  id: string;
  title: string;
  inputLabel: string;
  latentLabel: string;
  outputLabel: string;
  latentExtra?: string;
  color: string;
}

export const VARIANTS: Variant[] = [
  {
    id: 'denoise',
    title: 'Denoising AE',
    inputLabel: 'x + noise',
    latentLabel: 'z',
    outputLabel: 'x (깨끗)',
    color: '#3b82f6',
  },
  {
    id: 'sparse',
    title: 'Sparse AE',
    inputLabel: 'x',
    latentLabel: 'z (희소)',
    latentExtra: 'L1 제약',
    outputLabel: 'x̂',
    color: '#f59e0b',
  },
  {
    id: 'vae',
    title: 'VAE',
    inputLabel: 'x',
    latentLabel: 'μ, σ → z',
    latentExtra: 'KL 발산',
    outputLabel: 'x̂ (생성)',
    color: '#10b981',
  },
];
