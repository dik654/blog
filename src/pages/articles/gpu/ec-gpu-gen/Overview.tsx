import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const problemCode = `// 문제: 커브마다 소수체가 다르다 → 커널도 달라야 한다
//
// BN254 Fp
//   p = 21888242871839275222246405745257275088696311157297823662689037894645226208583
//   limbs = 4 (256비트)
//   Montgomery R  = 2^256 mod p
//   Montgomery R2 = R * R mod p
//   inv = -p^{-1} mod 2^64
//
// BLS12-381 Fp
//   p = 0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f385...  (381비트)
//   limbs = 6 (384비트)
//   Montgomery R  = 2^384 mod p
//   Montgomery R2 = R * R mod p
//   inv = -p^{-1} mod 2^64
//
// → 같은 "Fp 곱셈" 로직이지만, 상수와 limb 수가 다르다.
// → 수작업으로 커브마다 커널을 작성하면 유지보수 불가능.
// → 해결책: 빌드 타임에 자동 생성 (ec-gpu-gen)`;

const flowCode = `// ec-gpu-gen 빌드 흐름
//
// [build.rs]  ← Cargo 빌드 스크립트
//     |
//     | 1. GpuField trait에서 커브 파라미터 추출
//     |    - 소수 p (limbs), R, R2, inv
//     |    - 커브 a, b 상수, 생성자 좌표
//     |
//     | 2. OpenCL/CUDA 템플릿에 파라미터 주입
//     |    - FIELD_add(), FIELD_sub(), FIELD_mul()
//     |    - POINT_add(), POINT_double(), POINT_mul()
//     |
//     | 3. 생성된 소스를 OUT_DIR에 기록
//     |
// [OUT_DIR/kernel.cl]  또는  [OUT_DIR/kernel.cu]
//     |
// [rust-gpu-tools]  → 런타임 컴파일 & GPU 실행`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ec-gpu-gen이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ec-gpu-gen</strong>은 Filecoin 프로젝트가 개발한 Rust 빌드 타임 코드 생성기다.<br />
          특정 타원곡선의 유한체/곡선 연산을 수행하는 <strong>CUDA 또는 OpenCL 커널 소스 코드</strong>를 자동으로 생성한다.
        </p>
        <p>
          bellperson(Groth16 프루버)과 Neptune(Poseidon 해시)이 이 도구로 GPU 커널을 얻는다.
        </p>
        <CodePanel title="문제: 커브마다 다른 파라미터" code={problemCode} annotations={[
          { lines: [3, 8], color: 'sky', note: 'BN254: 4-limb, 고유 Montgomery 상수' },
          { lines: [10, 16], color: 'emerald', note: 'BLS12-381: 6-limb, 다른 상수' },
          { lines: [18, 20], color: 'amber', note: '커브별 수작업 → 유지보수 불가' },
        ]} />

        <CitationBlock source="filecoin-project/ec-gpu-gen" citeKey={1} type="code"
          href="https://github.com/filecoin-project/ec-gpu-gen">
          <p className="italic text-xs">
            "CUDA/OpenCL code generator for elliptic curve and finite field operations,
            targeting curves used in zero-knowledge proof systems."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-8 mb-3">빌드 타임 코드 생성 흐름</h3>
        <p>
          Cargo의 <code>build.rs</code>에서 실행된다.
          <code>GpuField</code> 트레이트를 구현한 타입에서 소수, Montgomery 상수, 커브 파라미터를 추출한 뒤,
          템플릿에 주입하여 완성된 GPU 소스를 <code>OUT_DIR</code>에 기록한다.
        </p>
        <CodePanel title="ec-gpu-gen 빌드 흐름" code={flowCode} annotations={[
          { lines: [3, 9], color: 'sky', note: 'build.rs: 커브 파라미터 추출' },
          { lines: [11, 13], color: 'emerald', note: '템플릿에 파라미터 주입' },
          { lines: [15, 17], color: 'amber', note: '생성된 커널 → rust-gpu-tools로 실행' },
        ]} />
      </div>
    </section>
  );
}
