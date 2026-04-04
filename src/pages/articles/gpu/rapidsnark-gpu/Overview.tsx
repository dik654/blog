import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const archCode = `// rapidsnark 아키텍처
//
// [circom compiler]
//   circuit.circom → circuit.r1cs + circuit_js/
//       |
// [witness generator]
//   input.json + circuit.wasm → witness.wtns
//       |
// [rapidsnark prover]
//   witness.wtns + circuit.zkey → proof.json + public.json
//
// 내부 구조:
//   C++ core (ffiasm, GMP)
//     ├── BN128 필드 연산 (assembly 최적화)
//     ├── NTT / INTT (멀티스레드 FFT)
//     ├── MSM (Pippenger, GPU 오프로드 가능)
//     └── Groth16 prover 로직
//
// 빌드 타깃:
//   x86_64 서버    -- prover_server (최고 성능)
//   ARM (M1/M2)   -- prover (Neon SIMD)
//   WASM           -- 브라우저 / React Native
//   GPU            -- CUDA MSM 백엔드 (실험적)`;

const perfCode = `// snarkjs vs rapidsnark 성능 비교 (BN254, 2^20 제약)
//
// 프레임워크      증명 시간     메모리      언어
// ──────────    ─────────   ────────   ────
// snarkjs         ~120s      ~8GB      JavaScript
// rapidsnark       ~3s       ~2GB      C++ (x86 asm)
// rapidsnark+GPU   ~1.5s     ~2GB      C++ + CUDA
//
// rapidsnark은 snarkjs 대비 40~100x 빠르다.
// 핵심 차이: ffiasm 어셈블리 필드 연산 + 멀티스레드 NTT`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">rapidsnark 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>rapidsnark</strong>은 iden3(Polygon ID 팀)이 개발한 고성능 Groth16 증명자다.
          circom 컴파일러가 생성한 <code>.r1cs</code>와 <code>.wtns</code> 파일을 입력받아
          zk-SNARK 증명을 생성한다.
        </p>
        <p>
          snarkjs(JavaScript)와 동일한 Groth16 프로토콜을 구현하지만,
          C++ 코어와 x86 어셈블리 필드 연산으로 <strong>40~100배</strong> 빠르다.<br />
          Polygon ID, Worldcoin, Semaphore 등 circom 기반 프로젝트에서 프로덕션 증명자로 사용된다.
        </p>
        <CodePanel title="rapidsnark 아키텍처 & 빌드 타깃" code={archCode} annotations={[
          { lines: [3, 5], color: 'sky', note: 'circom 컴파일: .r1cs + witness 생성' },
          { lines: [7, 9], color: 'emerald', note: 'rapidsnark: .wtns + .zkey → proof' },
          { lines: [12, 17], color: 'amber', note: 'C++ 코어: ffiasm, NTT, MSM' },
          { lines: [19, 23], color: 'violet', note: '빌드 타깃: x86, ARM, WASM, GPU' },
        ]} />
        <CodePanel title="snarkjs vs rapidsnark 성능 비교" code={perfCode} annotations={[
          { lines: [4, 6], color: 'sky', note: 'snarkjs: JS 싱글스레드, 느림' },
          { lines: [4, 6], color: 'emerald', note: 'rapidsnark: C++ asm, 40~100x 빠름' },
          { lines: [8, 9], color: 'amber', note: '핵심: ffiasm + 멀티스레드 NTT' },
        ]} />
        <CitationBlock source="iden3/rapidsnark GitHub" citeKey={1} type="code"
          href="https://github.com/iden3/rapidsnark">
          <p className="text-xs">
            rapidsnark은 ffiasm이 생성한 x86-64 어셈블리로 BN128 필드 연산을 수행한다.<br />
            GMP 대비 4~5배 빠른 Montgomery 곱셈이 전체 성능 향상의 기반이다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
