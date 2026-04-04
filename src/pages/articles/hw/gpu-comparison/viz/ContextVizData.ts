export const C = { consumer: '#6366f1', dc: '#f59e0b', err: '#ef4444', ok: '#10b981', hw: '#71717a' };

export const STEPS = [
  {
    label: 'ZK 연산 GPU 스펙 비교: 코어 수 + 대역폭 + VRAM',
    body: 'MSM = 메모리 대역폭 병목, NTT = CUDA 코어 수, 봉인 C2 = VRAM 10GB+ 필수',
  },
  {
    label: '컨슈머 vs 데이터센터: 가격 대비 성능 차이',
    body: 'RTX 4090($1600, 24GB) vs A100($10000, 80GB) vs H100($25000, 80GB) — 가성비 vs 안정성 트레이드오프',
  },
  {
    label: '워크로드별 핵심 지표가 다르다',
    body: 'MSM: GB/s당 성능, NTT: FP32 TFLOPS, PoSt: TDP당 해시율 — 한 가지 지표로 판단 불가',
  },
  {
    label: '서버 랙 주의: 오픈에어 쿨링은 서버 부적합',
    body: 'RTX 4090 오픈에어(3슬롯) → 서버 랙 전후 에어플로 불일치, A100/H100 블로워 또는 수냉 필수',
  },
];
