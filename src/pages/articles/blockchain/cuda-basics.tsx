import Overview from './cuda-basics/Overview';
import MemoryModel from './cuda-basics/MemoryModel';
import BlockchainGPU from './cuda-basics/BlockchainGPU';

function References() {
  return (
    <section id="references" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">참고 자료 & 출처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>[CUDA 프로그래밍 가이드]</strong> NVIDIA CUDA C++ Programming Guide
            — 메모리 계층, Warp 실행 모델, SIMT 아키텍처
          </li>
          <li>
            <strong>[gECC]</strong> Tian et al., &quot;gECC: GPU-accelerated Elliptic Curve Cryptography&quot;
            — ECDSA 5.56x 가속, Montgomery 곱셈 최적화
          </li>
          <li>
            <strong>[RapidEC]</strong> SC 2022 — 개별+배치 ECDSA GPU 병렬화
          </li>
          <li>
            <strong>[ICICLE]</strong> github.com/ingonyama-research/icicle
            — ZK 가속 CUDA 라이브러리 (MSM, NTT, Poseidon)
          </li>
          <li>
            <strong>[GZKP]</strong> &quot;GPU-accelerated Zero-Knowledge Proofs&quot; — CPU 대비 최대 48.1x 가속 벤치마크
          </li>
          <li>
            <strong>[Pippenger]</strong> Pippenger, &quot;On the evaluation of powers and monomials&quot;, 1980
            — MSM 알고리즘 O(n/log n) 복잡도
          </li>
          <li>
            <strong>[cuda-samples]</strong> github.com/NVIDIA/cuda-samples — 블록체인 관련 예제 참조
          </li>
        </ul>
      </div>
    </section>
  );
}

export default function CUDABasicsArticle() {
  return (
    <>
      <Overview />
      <MemoryModel />
      <BlockchainGPU />
      <References />
    </>
  );
}
