import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const limbCode = `// BN254 소수체 Fp: p = 21888242871839275222246405745257275088696311157297823662689037894645226208583
// 254비트 → uint64 4개(limb)로 표현
struct Fp256 {
    uint64_t limbs[4];  // limbs[0] = 최하위 64비트, limbs[3] = 최상위
};

// BLS12-381 소수체 Fp: 381비트 → uint64 6개
struct Fp384 {
    uint64_t limbs[6];
};

// 왜 multi-limb인가?
// GPU는 64비트 정수 연산까지만 네이티브 지원한다.
// 256비트 곱셈 = 4x4 = 16번의 uint64 곱셈 + 캐리 전파가 필요하다.`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 타원곡선을 GPU에서?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ZK 증명의 핵심 연산은 두 가지다.
          <strong>MSM</strong>(Multi-Scalar Multiplication)은 수백만 개의 타원곡선 점 덧셈이고,
          <strong>NTT</strong>(Number Theoretic Transform)는 수백만 번의 Fp 곱셈이다.<br />
          두 연산 모두 <strong>독립적인 반복</strong>이므로 GPU 병렬화에 적합하다.
        </p>

        <CitationBlock source="ec-gpu-gen -- Rust GPU EC library" citeKey={1} type="code"
          href="https://github.com/filecoin-project/ec-gpu-gen">
          <p className="italic">"GPU-accelerated elliptic curve and finite field operations, targeting BN254 and BLS12-381."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-8 mb-3">병목: 256비트 연산</h3>
        <p>
          GPU의 네이티브 정수 타입은 최대 <strong>uint64</strong>다.<br />
          BN254의 소수체는 254비트, BLS12-381은 381비트이므로 하나의 필드 원소를 uint64 4개 또는 6개로 쪼개야 한다.<br />
          이 <strong>multi-limb 표현</strong>이 모든 GPU 필드 연산의 출발점이다.
        </p>
        <CodePanel title="Multi-limb 필드 원소 표현 (CUDA C++)" code={limbCode}
          annotations={[
            { lines: [3, 5], color: 'sky', note: 'BN254: 4-limb (256비트)' },
            { lines: [8, 10], color: 'emerald', note: 'BLS12-381: 6-limb (384비트)' },
            { lines: [13, 15], color: 'amber', note: 'GPU는 64비트까지만 네이티브' },
          ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">GPU가 유리한 이유</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">연산</th>
                <th className="border border-border px-4 py-2 text-left">호출 횟수</th>
                <th className="border border-border px-4 py-2 text-left">독립성</th>
                <th className="border border-border px-4 py-2 text-left">GPU 가속비</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['MSM (2^20점)', '~100만 점 덧셈', '버킷 내 독립', '~50x'],
                ['NTT (2^24)', '~1600만 Fp 곱셈', '나비 연산 독립', '~30x'],
                ['Groth16 증명', 'MSM 3회 + NTT', '단계별 병렬', '~20x'],
              ].map(([op, count, indep, speedup]) => (
                <tr key={op}>
                  <td className="border border-border px-4 py-2 font-medium">{op}</td>
                  <td className="border border-border px-4 py-2">{count}</td>
                  <td className="border border-border px-4 py-2">{indep}</td>
                  <td className="border border-border px-4 py-2">{speedup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
