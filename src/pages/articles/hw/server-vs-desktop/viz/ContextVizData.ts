export const C = { server: '#6366f1', desktop: '#f59e0b', err: '#ef4444', ok: '#10b981', hw: '#71717a' };

export const STEPS = [
  { label: '설계 철학: 데스크톱(1인 가성비) vs 서버(24/7 안정성)', body: 'PCIe 레인, ECC, IPMI, 듀얼 소켓 → 같은 x86이지만 확장성과 안정성 설계가 완전히 다름' },
  { label: '데스크톱 부품의 서버 한계: ECC·PCIe·IPMI 부재', body: 'i9-14900K: 20 PCIe 5.0 레인, non-ECC, IPMI 없음 → GPU 2장 + NVMe 1개가 한계' },
  { label: 'EPYC vs Xeon: PCIe 레인 수와 확장성', body: 'EPYC 9654: 128 PCIe 5.0, 12채널 DDR5 / Xeon w9-3495X: 112 PCIe 5.0, 8채널 DDR5' },
  { label: 'Filecoin: GPU 4~8장 + NVMe 다수 = EPYC 필수', body: 'GPU 8장(x16): 128 PCIe 레인 + NVMe 4개(x4): 16 레인 = 최소 144 레인 → EPYC 또는 듀얼 Xeon' },
];
