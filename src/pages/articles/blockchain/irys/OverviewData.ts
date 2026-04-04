export const DATA_FLOW_CODE = `클라이언트 → API 서버 → 체인 코어 → 액터 시스템
                                          ↓
                                    패킹 엔진 (CUDA)
                                          ↓
                              스토리지 (청킹 + Merkle)
                                          ↓
                                    VDF 합의 (체크포인트)`;

export const DATA_FLOW_ANNOTATIONS = [
  { lines: [1, 1] as [number, number], color: 'sky' as const, note: '데이터 수신 경로' },
  { lines: [3, 3] as [number, number], color: 'amber' as const, note: 'GPU 가속 패킹' },
  { lines: [7, 7] as [number, number], color: 'emerald' as const, note: 'VDF 합의 확정' },
];
