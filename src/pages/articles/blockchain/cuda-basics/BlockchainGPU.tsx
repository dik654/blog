import { CitationBlock } from '../../../../components/ui/citation';

export default function BlockchainGPU() {
  return (
    <section id="blockchain-gpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록체인 GPU 가속 실전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">MSM (Multi-Scalar Multiplication)</h3>
        <p>
          ZK 증명 생성에서 가장 연산량이 큰 부분은 MSM입니다.
          수백만 개의 타원곡선 점에 대한 스칼라 곱의 합을 계산합니다.
          이더리움의 precompile(BN254 pairing)에도 동일한 연산이 사용됩니다.
        </p>

        <CitationBlock source="Pippenger, 'On the evaluation of powers and monomials', 1980" citeKey={4} type="paper">
          <p className="italic text-foreground/80">"The Pippenger algorithm reduces multi-scalar multiplication from O(n) group operations to O(n / log n) by partitioning scalars into fixed-size windows and accumulating points into 2^w buckets per window."</p>
          <p className="mt-2 text-xs">Pippenger MSM 알고리즘은 스칼라를 w-bit 윈도우로 분할하고 각 윈도우의 점들을 독립된 버킷에 누적합니다. 버킷 내 합산은 완전 독립적이므로 GPU 병렬화에 이상적이며, ZK 증명(Groth16, PLONK)의 핵심 연산입니다.</p>
        </CitationBlock>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`MSM: result = Σ(sᵢ × Gᵢ) for i = 1..n

CPU 순차 처리:            GPU 병렬 처리 (Pippenger):
for i in 0..n:            // 1단계: 버킷 분류 (병렬)
  result += s[i] * G[i]  // 각 스레드가 스칼라를 윈도우별로 분류
                          bucketize<<<blocks, threads>>>(scalars, points, buckets);
시간: O(n × 곡선연산)
                          // 2단계: 버킷 내 합산 (병렬)
                          // 각 스레드가 하나의 버킷을 담당
                          reduce_buckets<<<blocks, threads>>>(buckets, partial);

                          // 3단계: 윈도우 결합 (순차)
                          // 윈도우별 결과를 2^w 씩 곱하며 합산
                          combine_windows(partial, result);

Pippenger 알고리즘:
  - n개 점을 2^w 개 "버킷"으로 분류
  - 각 버킷 내 합산은 독립 → GPU 병렬화
  - 시간: O(n/w + 2^w) — w 최적화로 O(n/log n)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">NTT (Number Theoretic Transform)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`NTT = 유한체 위의 FFT (ZK 증명의 다항식 연산에 필수)

PLONK/Groth16 증명 생성 시:
  - 다항식 곱셈: O(n²) → NTT로 O(n log n)
  - 다항식 평가: 대량의 점에서 동시 평가

GPU NTT (Butterfly 연산):

Stage 0:  [a₀ a₁ a₂ a₃ a₄ a₅ a₆ a₇]
           ×   ×   ×   ×
Stage 1:  [b₀ b₁ b₂ b₃ b₄ b₅ b₆ b₇]
             ×       ×
Stage 2:  [c₀ c₁ c₂ c₃ c₄ c₅ c₆ c₇]
                 ×
Stage 3:  [d₀ d₁ d₂ d₃ d₄ d₅ d₆ d₇]  ← 결과

각 × 는 butterfly 연산: (a+b, a-b) × twiddle factor
  → 각 stage에서 n/2 독립 연산 → GPU 병렬화 최적

CUDA 구현:
  - Stage별로 커널 호출 (log n 번)
  - Shared Memory에 중간 결과 저장
  - Bank conflict 최소화 위해 패딩 사용
  - NTT가 ZK 증명 생성 지연의 ~90% 차지`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">ECDSA 서명 검증 GPU 가속</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`배치 ECDSA 검증 (이더리움 트랜잭션 검증):

CPU (순차):
  for tx in block.transactions:
    verify_ecdsa(tx.signature)  # ~0.1ms per signature
  → 1000 tx = ~100ms

GPU (병렬):
  signatures, pubkeys, messages → GPU로 전송
  batch_verify<<<blocks, threads>>>(sigs, pubs, msgs)
  → 1000 tx = ~5ms (gECC 프레임워크: ~5.56x 가속)

주요 라이브러리:
  gECC: NVIDIA A100에서 ECDSA 5.56x 가속
    → Montgomery 곱셈 최적화, 배치 실행
  RapidEC (SC'22): 개별 + 배치 ECDSA 병렬화
    → CPU 대비 수십 배 가속
  ICICLE (Ingonyama): ZK 가속 전용 CUDA 라이브러리
    → MSM, NTT, Poseidon 해시 통합
  GZKP: 최대 48.1x CPU 대비 가속

핵심 도전:
  모듈러 산술 효율 → GPU의 IMAD (Integer Multiply-Add) 최소화
  → secp256k1 (이더리움/비트코인 곡선)에 특화된 최적화`}</code>
        </pre>

        <CitationBlock source="Tian et al., 'gECC: GPU-accelerated Elliptic Curve Cryptography'" citeKey={5} type="paper">
          <p className="italic text-foreground/80">"We present gECC, a GPU-accelerated framework for elliptic curve cryptography that achieves 5.56x speedup for ECDSA verification on NVIDIA A100 GPUs through optimized Montgomery multiplication and batched execution."</p>
          <p className="mt-2 text-xs">gECC는 Montgomery 곱셈을 GPU에 최적화하여 secp256k1 곡선의 ECDSA 검증을 대폭 가속합니다. 블록체인 노드에서 트랜잭션 서명 검증 병목을 해소하는 핵심 기술입니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">cuda-samples 주요 예제</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`cuda-samples/ 블록체인 관련 예제:

Samples/0_Introduction/
├── vectorAdd/          # 기초: 벡터 덧셈 (병렬 패턴 이해)
├── matrixMul/          # 행렬 곱셈 (공유 메모리 타일링)
└── simpleCallback/     # 비동기 실행 패턴

Samples/2_Concepts_and_Techniques/
├── reduction/          # 리덕션 (버킷 합산에 활용)
├── shfl_scan/          # Warp-level 프리미티브
└── threadFenceReduction/  # 메모리 펜스

Samples/4_CUDA_Libraries/
├── batchedLabelMarkersAndLabelCompressionNPP/
└── conjugateGradient/  # 반복 솔버 (선형 시스템)

블록체인 개발 시 필수 CUDA 개념:
  1. Warp (32 스레드 단위 실행) → SIMT 이해
  2. Shared Memory 타일링 → MSM 버킷 최적화
  3. Atomic 연산 → 병렬 리덕션
  4. Stream & Event → 비동기 증명 생성
  5. Multi-GPU → 대규모 MSM 분산`}</code>
        </pre>
      </div>
    </section>
  );
}
