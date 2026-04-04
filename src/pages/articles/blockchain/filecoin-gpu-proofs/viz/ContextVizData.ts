export const C = { proof: '#6366f1', gpu: '#f59e0b', err: '#ef4444', ok: '#10b981', seal: '#8b5cf6' };

export const STEPS = [
  {
    label: 'PoRep + PoSt: Groth16 SNARK 증명 필수',
    body: 'PC1(SDR): CPU 순차 → PC2(Column Hash): GPU NTT → C2(Groth16): GPU MSM + FFT',
  },
  {
    label: 'C2 GPU 병목: MSM 2^27 + FFT 2^30 연산',
    body: 'bellperson: MSM 커널 + FFT 커널 병렬 실행, VRAM 최소 10GB (32GiB 섹터 기준)',
  },
  {
    label: 'bellperson + sppark: Rust GPU 가속 라이브러리',
    body: 'bellperson::gpu::msm() → sppark::msm_mont() → CUDA 커널 호출, Pippenger 윈도우 분할',
  },
  {
    label: 'GPU별 C2 시간: 4090 = 4분, A100 = 3분',
    body: 'RTX 4090(24GB, 1008 GB/s): C2 ~4분 / A100(80GB, 2039 GB/s): C2 ~3분 / WindowPoSt 30분 제한',
  },
];
