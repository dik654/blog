export const neptuneCode = `Neptune = Filecoin의 Poseidon 해시 구현 (GPU 가속)
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
  NEPTUNE_DEFAULT_GPU=<UUID> 사용 GPU 선택`;

export const rustFilProofsCode = `rust-fil-proofs = Filecoin 저장 증명 최상위 라이브러리

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
    → GPU 없으면 타임아웃 위험`;

export const ecGpuSupraSealCode = `ec-gpu = GPU 유한체/타원곡선 산술 코드 생성기

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
  → PC1: 64코어 × 4섹터/코어 = 최대 64 섹터 동시 병렬 처리
  → SPDK v22.09로 NVMe 직접 접근 (10-15M IOPS)
  → Ubuntu 22.04, CUDA 11.x+, F2FS 필수

아키텍처 베스트 프랙티스:
  → PC1 (CPU) 과 PC2/C2 (GPU)를 별도 머신에 분리
  → PC2, C1, C2를 같은 GPU 워커에 배치
  → PC1이 파이프라인 병목이 되도록 설계
  → 경험 법칙: PC1 워커 1대 당 PC2 워커 2대`;
