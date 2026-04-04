export const bellpersonCode = `bellperson = Filecoin의 GPU 가속 Groth16 구현
(bellman 포크, GPU 백엔드 추가)

핵심 GPU 가속 연산:

1. MSM (Multi-Scalar Multiplication):
   result = Σ(sᵢ × Gᵢ) for i = 1..n
   → Groth16 증명의 핵심 연산 (A, B, C 계산)
   → Pippenger 알고리즘 GPU 구현
   → n = 수백만 (32GB 섹터 회로 크기)

2. NTT/FFT (Number Theoretic Transform):
   → 다항식 곱셈 가속
   → Groth16의 H(x) 다항식 평가
   → Butterfly 연산 → GPU 병렬화 최적

GPU 백엔드:
  ┌──────────────────────────────────────────┐
  │ bellperson                                │
  │  ├── OpenCL 백엔드 (AMD/NVIDIA)          │
  │  │   → ec-gpu-gen 라이브러리              │
  │  │   → BLS12-381 곡선 최적화              │
  │  └── CUDA 백엔드 (NVIDIA)                │
  │      → sppark/blst 통합                   │
  │      → 더 높은 성능                        │
  └──────────────────────────────────────────┘

BLS12-381 백엔드:
  → blstrs (blst 기반 핸드튜닝 어셈블리)
  → bellperson의 유일한 곡선 백엔드

환경 변수:
  BELLMAN_NO_GPU=1       GPU 비활성화 (CPU 폴백)
  BELLMAN_GPU_FRAMEWORK=cuda|opencl  백엔드 선택
  BELLMAN_CPU_UTILIZATION=0.0-1.0    CPU/GPU 분배
  BELLMAN_GPUS_PER_LOCK=N  GPU 잠금 (0=비활성, 위험)
  BELLMAN_CUDA_NVCC_ARGS="..."  CUDA 아키텍처 타겟
  FIL_PROOFS_USE_GPU_COLUMN_BUILDER=1  PC2 GPU 사용
  FIL_PROOFS_USE_GPU_TREE_BUILDER=1    Tree GPU 사용
  FFI_USE_CUDA=1  빌드 시 CUDA 활성화 (권장)`;

export const ssparkCode = `sppark = 고성능 CUDA 기반 ZK 프리미티브 라이브러리
(Supranational 개발, Filecoin에 통합)

핵심 구현:

1. CUDA MSM:
   → Pippenger 알고리즘 CUDA 구현
   → BLS12-381 G1/G2 곡선 지원
   → Bucket accumulation → GPU 워프 단위 병렬화
   → 윈도우 크기 자동 최적화

2. CUDA NTT:
   → Cooley-Tukey butterfly GPU 구현
   → Shared Memory 활용 bank conflict 최소화
   → 대규모 다항식 (2^27+ 원소) 지원

성능 (BLS12-381):
  2^26 MSM on A10: ~2.8초 (13GB VRAM 사용)
  GPU MSM: CPU 대비 ~800x 지연 감소
  GPU NTT: CPU 대비 ~50x 가속, 3.1x 에너지 효율
  → NTT가 대규모 증명 시 런타임의 최대 91% 차지

지원 하드웨어:
  → NVIDIA Volta+ (V100, A100, RTX 20xx/30xx/40xx)
  → x86_64 Linux/Windows 주력
  → 제한적 AMD RDNA/CDNA 지원
  → Z-Prize MSM 대회 레퍼런스 구현

sppark 의존성 체인:
  rust-fil-proofs
    → bellperson (Groth16 증명)
      → ec-gpu / ec-gpu-gen (GPU 커널 코드 생성)
        → rust-gpu-tools (CUDA/OpenCL 디바이스 관리)
        → sppark (CUDA MSM/NTT 템플릿)
          → blst (BLS12-381 곡선 어셈블리)`;
