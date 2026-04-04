export const C = { sata: '#71717a', nvme: '#6366f1', sas: '#f59e0b', err: '#ef4444', ok: '#10b981' };

export const STEPS = [
  { label: 'SATA vs NVMe vs SAS: 큐 구조 + 대역폭 비교', body: 'SATA(1×32, 550MB/s) vs NVMe(64K×64K, 7GB/s) vs SAS(256×256, 12Gbps) — 큐 깊이가 핵심' },
  { label: 'SATA AHCI 병목: 1큐 × 32 커맨드 = 550 MB/s 한계', body: 'AHCI 레거시 프로토콜: 큐 1개, 커맨드 32개 → 동시 I/O 32개가 한계, NVMe 대비 1/125' },
  { label: 'SAS: 듀얼 포트 + JBOD 확장으로 수백 TB', body: 'SAS HBA → JBOD 엔클로저 연결, 듀얼 포트로 이중 경로(HA) 구성, 12Gbps × 2 = 24Gbps' },
  { label: '블록체인 노드: NVMe 필수, SATA 시 동기화 5~10배 증가', body: 'Reth: 랜덤 I/O 집중(상태 DB) / Lotus: 순차 쓰기 집중(봉인) — 둘 다 NVMe 필수' },
];
