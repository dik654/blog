export const PHASES = [
  {
    id: 'pc1', label: 'PC1', name: 'Pre-Commit Phase 1',
    color: '#6366f1',
    time: '수 시간 (32GiB)',
    resource: 'CPU + RAM (512GB)',
    outputs: ['SDR 레이블 (11 레이어)', 'comm_d (원본 Merkle 루트)'],
    desc: 'SDR(Stacked DRG) 레이블링. 각 노드의 부모 37개를 SHA256으로 해시하여 11개 레이어 순차 생성. 병렬화 불가 (의존성 그래프).',
  },
  {
    id: 'pc2', label: 'PC2', name: 'Pre-Commit Phase 2',
    color: '#0ea5e9',
    time: '~20분 (32GiB, GPU)',
    resource: 'GPU (CUDA/OpenCL)',
    outputs: ['comm_r (복제본 루트)', 'comm_c (컬럼 해시 루트)'],
    desc: 'TreeR (복제본 Merkle), TreeC (컬럼 해시 Merkle) 생성. Poseidon 해시 기반 GPU 병렬 처리 가능.',
  },
  {
    id: 'c1', label: 'C1', name: 'Commit Phase 1',
    color: '#10b981',
    time: '수 분',
    resource: 'CPU',
    outputs: ['챌린지 샘플', 'Merkle 포함 증명 경로'],
    desc: '체인 seed로 챌린지 인덱스 결정. 각 챌린지에 대해 Merkle 경로 생성. Groth16 회로 입력 준비.',
  },
  {
    id: 'c2', label: 'C2', name: 'Commit Phase 2',
    color: '#f59e0b',
    time: '수 분 (GPU)',
    resource: 'GPU (필수)',
    outputs: ['Groth16 증명 (192 bytes)'],
    desc: '수억 게이트 규모 Groth16 SNARK 생성. GPU 없이는 사실상 불가능. 온체인 등록 가능한 최종 증명.',
  },
];
