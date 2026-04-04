export const CUDA_CODE = `// CudaProver: GPU 가속 증명 생성
pub struct CudaProver {
    inner: CpuProver,         // 증명 외 로직은 CPU
    device: CudaDevice,       // GPU 디바이스 핸들
}

impl Prover for CudaProver {
    fn prove_shard(&self, pk: &ProvingKey, record: &ExecutionRecord)
        -> Result<ShardProof>
    {
        // GPU에서 수행하는 핵심 연산:
        // 1. NTT (Number Theoretic Transform)
        //    → 다항식 평가: O(n log n) → GPU 병렬화
        // 2. MSM (Multi-Scalar Multiplication)
        //    → 타원곡선 스칼라 곱: 대량 포인트 병렬 처리
        // 3. FRI Commitment
        //    → Merkle 트리 해시: 대량 리프 병렬 해시
        // 4. Poseidon2 해시
        //    → BabyBear 필드 해시: GPU 최적화 구현

        cuda_prove(self.device, pk, record)
    }
}`;

export const PERF = [
  { op: 'NTT (2^22)', cpu: '~800ms', gpu: '~15ms', speedup: '~53x' },
  { op: 'MSM (2^22)', cpu: '~2.5s', gpu: '~50ms', speedup: '~50x' },
  { op: 'Poseidon2 해시', cpu: '~300ms', gpu: '~5ms', speedup: '~60x' },
  { op: 'FRI 커밋', cpu: '~1.2s', gpu: '~25ms', speedup: '~48x' },
  { op: '전체 샤드 증명', cpu: '~15s', gpu: '~0.3s', speedup: '~50x' },
];

export const ENV_CODE = `# CUDA 프로버 사용 (환경 변수)
SP1_PROVER=cuda cargo run --release

# 또는 코드에서 직접 지정
let client = ProverClient::builder()
    .cuda()      // GPU 백엔드
    .build();

# GPU 요구사항:
# - NVIDIA GPU (Compute Capability 7.0+)
# - CUDA Toolkit 12.x
# - 최소 8GB VRAM (권장 24GB+)
# - 대형 프로그램: A100/H100 권장`;

export const cudaAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: 'CudaProver — CPU 로직 + GPU 디바이스' },
  { lines: [11, 20] as [number, number], color: 'emerald' as const, note: 'GPU 핵심 연산 4가지' },
  { lines: [22, 22] as [number, number], color: 'amber' as const, note: 'CUDA 커널 호출' },
];

export const envAnnotations = [
  { lines: [1, 2] as [number, number], color: 'sky' as const, note: '환경 변수로 CUDA 선택' },
  { lines: [4, 7] as [number, number], color: 'emerald' as const, note: '코드에서 직접 빌더 패턴' },
  { lines: [9, 13] as [number, number], color: 'amber' as const, note: 'GPU 하드웨어 요구사항' },
];
