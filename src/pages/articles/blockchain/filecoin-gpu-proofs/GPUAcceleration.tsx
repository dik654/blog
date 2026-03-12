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

환경 변수:
  BELLMAN_NO_GPU=1       GPU 비활성화 (CPU 폴백)
  BELLMAN_CUSTOM_GPU="..." 커스텀 GPU 지정
  FIL_PROOFS_USE_GPU_COLUMN_BUILDER=1  PC2 GPU 사용
  FIL_PROOFS_USE_GPU_TREE_BUILDER=1    Tree GPU 사용`}</code>
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

성능 비교 (BLS12-381, 2^20 포인트 MSM):
  CPU (8코어):     ~15초
  RTX 3090:        ~0.5초 (~30x 가속)
  A100:            ~0.3초 (~50x 가속)

sppark 의존성 체인:
  rust-fil-proofs
    → bellperson (Groth16 증명)
      → ec-gpu / ec-gpu-gen (GPU 타원곡선)
        → sppark (CUDA 커널)
          → blst (BLS12-381 곡선 구현)`}</code>
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

  CPU 대비 가속:
  → Column Hash 생성: ~5-10x
  → Merkle Tree 구축: ~8-15x`}</code>
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
      </div>
    </section>
  );
}
