export const C = { gpu: '#6366f1', cool: '#10b981', err: '#ef4444', rack: '#f59e0b', hw: '#71717a' };

export const STEPS = [
  { label: 'GPU 서버 전력: 2000~5000W, 전기료 = 운영비 60~70%', body: 'GPU 4장(4090): 1800W + CPU+시스템 500W = 2300W, GPU 8장: 4100W → 월 전기료 $200~600' },
  { label: '블로워 vs 오픈에어: 서버 랙 쿨링 호환성', body: '블로워(A100): 전→후 배기, 서버 랙 OK / 오픈에어(4090): 사방 확산, 서버 부적합(주변 과열)' },
  { label: '랙 크기별 GPU + 냉각 조합', body: '1U: 블로워만(저프로) / 2U: 듀얼 슬롯 / 4U: 풀사이즈 GPU / 수냉: AIO/커스텀 루프' },
  { label: 'TDP당 성능 = 장기 수익성 핵심 지표', body: '4090: 82.4 TFLOPS / 450W = 183 GFLOPS/W / H100: 989 TFLOPS / 700W = 1413 GFLOPS/W (FP16)' },
];
