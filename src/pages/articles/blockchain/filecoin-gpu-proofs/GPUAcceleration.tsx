export default function GPUAcceleration() {
  return (
    <section id="gpu-acceleration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GPU 가속 라이브러리 & 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">bellperson (GPU Groth16)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`bellperson = Filecoin의 GPU 가속 Groth16 구현
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
  FFI_USE_CUDA=1  빌드 시 CUDA 활성화 (권장)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Supranational sppark</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`sppark = 고성능 CUDA 기반 ZK 프리미티브 라이브러리
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
          → blst (BLS12-381 곡선 어셈블리)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Neptune (Poseidon 해시 GPU)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Neptune = Filecoin의 Poseidon 해시 구현 (GPU 가속)
(PC2의 Merkle Tree 구축에 사용)

Poseidon 해시:
  → ZK-friendly 해시 함수
  → SHA-256 대비 ZK 회로에서 ~10x 효율적
  → R1CS 제약 수: ~300 (SHA-256: ~25,000)

PC2에서의 역할:
  SDR 인코딩 결과 (11 레이어 × 32GB)
    → Column Hash: 각 위치의 11개 레이어 해시
    → Tree-R: Column Hash의 Merkle 트리 구축
    → Tree-C: 원본 데이터의 Merkle 트리
    → Tree-D: 딜 데이터의 Merkle 트리

GPU 가속 (Neptune):
  → 배치 Poseidon: 수백만 해시를 GPU에서 병렬 계산
  → Arity-8 Poseidon: 8개 입력의 해시 (Merkle 8-ary Tree)
  → GPU가 리프에서 루트까지 레벨별로 계산

  벤치마크 (RTX 2080Ti v1.0.0):
  → 4GiB 입력 → 8-ary Merkle Tree: 16초
  → CUDA/OpenCL이 Futhark 대비 ~2x 빠름

감사: ADBK Consulting, Starkad/Poseidon 논문 준수 확인

컴파일 시 Arity 지정 (CUDA 커널 생성):
  arity2, arity4, arity8, arity11, arity16 등
  → Arity 수 ↑ → 컴파일 시간 ↑
  EC_GPU_CUDA_NVCC_ARGS로 아키텍처 타겟 지정
  NEPTUNE_DEFAULT_GPU=<UUID> 사용 GPU 선택`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">rust-fil-proofs 통합</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`rust-fil-proofs = Filecoin 저장 증명 최상위 라이브러리

크레이트 구조:
  filecoin-proofs/
  ├── filecoin-proofs        # 최상위 API
  ├── storage-proofs-core    # 공통 (Merkle, 해시, 그래프)
  ├── storage-proofs-porep   # PoRep (SDR + Groth16)
  ├── storage-proofs-post    # PoSt (Window + Winning)
  └── filecoin-proofs-api    # FFI 바인딩 (Lotus Go → Rust)

GPU 활용 경로:

PC2 (Merkle Tree):
  storage-proofs-porep
    → generate_tree_c / generate_tree_r_last
    → Neptune (Poseidon GPU 해시)
    → GPU 배치 처리

C2 (Groth16 증명):
  storage-proofs-porep
    → StackedCompound::prove()
    → bellperson::groth16::create_random_proof_batch()
    → GPU MSM (sppark) + GPU NTT

WindowPoSt:
  storage-proofs-post
    → FallbackPoSt::prove()
    → bellperson::groth16 (GPU)
    → 매 24시간마다 전체 섹터 검증

WinningPoSt:
  storage-proofs-post
    → FallbackPoSt::prove() (단일 파티션)
    → 30초 이내 완료 필수 (블록 생성 데드라인)
    → GPU 없으면 타임아웃 위험`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">ec-gpu & SupraSeal</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`ec-gpu = GPU 유한체/타원곡선 산술 코드 생성기

역할:
  → 빌드 타임에 CUDA fatbin / OpenCL 소스 생성
  → 32-bit limbs (CUDA) / 32-64-bit limbs (OpenCL)
  → ec_gpu_gen::generate()로 커널 컴파일
  → bellperson (FFT/MSM) + Neptune (Poseidon) 양쪽에서 사용

Lotus → Rust GPU 전체 의존성:
  Lotus (Go) → filecoin-ffi (CGo)
    → rust-fil-proofs
      → bellperson → blstrs → blst (ASM)
      │            → ec-gpu-gen → rust-gpu-tools
      │            → sppark (CUDA 템플릿)
      → neptune   → ec-gpu-gen → rust-gpu-tools
      │            → blstrs
      → fil-blst  → blst

SupraSeal (고성능 통합 봉인):
  → PC1 + PC2 + C1 + C2를 단일 최적화 라이브러리로 통합
  → 레퍼런스 플랫폼:
    Threadripper PRO 5995WX (64코어) + RTX 4090
    512GB RAM, 16x Samsung 7.68TB U.2 NVMe
  → PC1: 최대 128 섹터 동시 병렬 처리
  → SPDK v22.09로 NVMe 직접 접근 (10-15M IOPS)
  → Ubuntu 22.04, CUDA 11.x+, F2FS 필수

아키텍처 베스트 프랙티스:
  → PC1 (CPU) 과 PC2/C2 (GPU)를 별도 머신에 분리
  → PC2, C1, C2를 같은 GPU 워커에 배치
  → PC1이 파이프라인 병목이 되도록 설계
  → 경험 법칙: PC1 워커 1대 당 PC2 워커 2대`}</code>
        </pre>
      </div>
    </section>
  );
}
