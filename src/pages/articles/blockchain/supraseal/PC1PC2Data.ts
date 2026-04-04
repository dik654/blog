export const PC1_CODE = `// PC1 최적화: 메모리-NVMe 하이브리드
// 기존: 1-2TB RAM → 최적화: 256GB + NVMe

// SHA-256 멀티버퍼 (SHA Extensions)
// 노드당: 20블록 x 64라운드 / 2 = 640회 sha256rnds2
// x4 구현: 4200 사이클로 4버퍼 처리 (2.4배 효율)

// 인터리브드 섹터 레이아웃
기존:  [섹터0 노드1-N] [섹터1 노드1-N] ...
최적화: [모든섹터 노드1] [모든섹터 노드2] ...
// 4KB 읽기 → 64개 섹터 동일 노드 획득 (100%)

// 멀티 디스크 (12x NVMe 스트라이핑)
64섹터 x 32GB x 11레이어 = 22TB
드라이브당 100만 IOPS x 12개 = 1200만 IOPS`;

export const PC2_CODE = `// PC2 최적화: GPU 가속 Poseidon 해시

// Tree C 생성 (컬럼 해시)
for (j = 0; j < NumLayers; j++) {
  for (k = 0; k < NumNodes; k++) {
    fr_t val = data[j * NumNodes * PARALLEL +
                    k * PARALLEL + i];
    tree_c_input[k * NumLayers + j] = val;
  }
}

// GPU 최적화 요소
// - CUDA 64개 스트림 → GPU 활용률 극대화
// - 공유 메모리: 스레드 블록 내 데이터 공유
// - 상수 메모리: Poseidon 라운드 상수 저장
// - SM 아키텍처: sm_70 / sm_80 지원`;
