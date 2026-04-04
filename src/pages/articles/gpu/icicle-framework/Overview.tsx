import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const archCode = `// ICICLE 아키텍처 레이어
//
// [Application Layer]
//   gnark, Polygon zkEVM, Scroll prover, custom ZK app
//       |
// [Language Bindings]
//   Rust (icicle-rs)  |  Go (icicle-go)  |  Python
//       |
// [C API Layer]
//   icicle_msm()  icicle_ntt()  icicle_poseidon_hash()
//       |
// [Backend Dispatcher]
//   CUDA backend  |  CPU backend  |  (future: Metal, Vulkan)
//       |
// [CUDA Core (C++ Templates)]
//   msm_kernel<bn254_scalar, bn254_affine><<<grid, block>>>
//   ntt_kernel<bls12_381_scalar><<<grid, block>>>`;

const curveCode = `// 지원 커브 목록 (ICICLE v3)
//
// Pairing-friendly curves
//   BN254          -- Ethereum, gnark, Groth16
//   BLS12-381      -- Ethereum 2.0, Zcash, signature
//   BLS12-377      -- Aleo
//   BW6-761        -- BLS12-377의 cycle curve
//
// Non-pairing curves
//   Grumpkin        -- BN254의 cycle curve (Aztec)
//   Stark252 (baby) -- StarkNet Pedersen
//
// 연산별 지원
//   MSM       -- 모든 커브
//   NTT/INTT  -- 모든 스칼라 필드
//   Poseidon  -- 모든 필드
//   Polynomial ops -- 모든 필드`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ICICLE 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ICICLE</strong>은 Ingonyama가 개발한 오픈소스 GPU 가속 라이브러리다.<br />
          ZK 증명 시스템의 핵심 연산인 MSM, NTT, Poseidon 해시, 다항식 연산을 GPU에서 실행한다.
        </p>
        <p>
          C++ CUDA 코어 위에 C API를 두고, 그 위에 Rust/Go/Python 바인딩을 제공하는 구조다.
          gnark, Polygon zkEVM, Scroll 등 주요 ZK 프로젝트에서 사용 중이다.
        </p>
        <CodePanel title="ICICLE 아키텍처 레이어" code={archCode} annotations={[
          { lines: [3, 4], color: 'sky', note: '응용 계층: gnark, Polygon, Scroll' },
          { lines: [6, 8], color: 'emerald', note: '언어 바인딩: Rust, Go, Python' },
          { lines: [10, 14], color: 'amber', note: 'C API + 백엔드 디스패처' },
          { lines: [16, 18], color: 'violet', note: 'CUDA 코어: C++ 템플릿 커널' },
        ]} />
        <CitationBlock source="Ingonyama ICICLE GitHub" citeKey={1} type="code"
          href="https://github.com/ingonyama-zk/icicle">
          <p className="text-xs">
            ICICLE v3는 백엔드 디스패처를 도입하여 CUDA 외에 CPU 폴백을 지원한다.<br />
            동일한 API로 백엔드만 교체할 수 있어, 개발 시 CPU로 테스트하고 배포 시 GPU로 전환하는 워크플로가 가능하다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-8 mb-3">지원 커브 & 연산</h3>
        <p>
          BN254, BLS12-381 등 주요 pairing-friendly 커브와 Grumpkin 같은 cycle curve를 지원한다.<br />
          각 커브별로 MSM, NTT, Poseidon이 CUDA 템플릿으로 특수화되어 최적 성능을 낸다.
        </p>
        <CodePanel title="지원 커브 & 연산 목록" code={curveCode} annotations={[
          { lines: [3, 8], color: 'sky', note: 'Pairing-friendly 커브' },
          { lines: [10, 12], color: 'emerald', note: 'Non-pairing 커브' },
          { lines: [14, 17], color: 'amber', note: '연산별 지원 범위' },
        ]} />
      </div>
    </section>
  );
}
