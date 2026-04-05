import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import KeygenViz from './viz/KeygenViz';
import { codeRefs } from './codeRefs';

export default function DilithiumKeygen({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="dilithium-keygen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dilithium 키 생성 (Module-LWE)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CRYSTALS-Dilithium은 Module-LWE(Learning With Errors) 문제에 기반합니다.
          공개키 <code>t = A*s1 + s2</code>에서 비밀 벡터 s1, s2를 복원하는 것이
          격자 위의 최단 벡터 문제(SVP)로 환원되며, 양자 컴퓨터로도 효율적으로 풀 수 없습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('dilithium-keygen', codeRefs['dilithium-keygen'])} />
          <span className="text-[10px] text-muted-foreground self-center">keygen() 내부</span>
        </div>
        <h3>파라미터 (Dilithium2, NIST Level 2)</h3>
        <ul>
          <li><code>q = 8,380,417</code> — 소수 모듈러스</li>
          <li><code>n = 256</code> — 다항식 차수</li>
          <li><code>k = l = 4</code> — 행렬/벡터 차원</li>
          <li><code>eta = 2</code> — 비밀 벡터 범위 &#123;-2..2&#125;</li>
        </ul>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — ECDSA 키 크기: 공개키 33B, 비밀키 32B.
          Dilithium: 공개키 1312B, 비밀키 2528B. 40배 크지만 양자 내성이라는 근본적 보안 향상.
        </p>
      </div>
      <div className="mt-8"><KeygenViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Module-LWE 수학적 기초</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// LWE (Learning With Errors, Regev 2005)
// 문제: 주어진 (A, b) where b = A·s + e mod q, s 찾기
// - s: secret vector
// - e: small error
// - A: public random matrix

// Hardness assumption
// - SIS (Short Integer Solution) 문제와 동치
// - Lattice SVP에 reduction
// - Best quantum attack: 2^(0.292 · dim) time

// Module-LWE (MLWE)
// LWE의 변형: polynomial ring 사용
// R_q = Z_q[X] / (X^n + 1)
// Vector elements are polynomials
// - 더 효율적 (FFT 적용 가능)
// - 구조화된 보안 가정 (weaker than general LWE)

// Dilithium keygen 수식
// 1) seed 선택
// 2) A = expand(seed) ∈ R_q^{k×l}
// 3) s1 ∈ S_η^l, s2 ∈ S_η^k (short polynomials)
// 4) t = A·s1 + s2
// 5) (t_high, t_low) = power2round(t)
// Public key: (seed, t_high)
// Secret key: (seed, tr, s1, s2, t_low)

// NIST security levels
// Dilithium2: Level 2 (~AES-128 equivalent)
// Dilithium3: Level 3 (~AES-192)
// Dilithium5: Level 5 (~AES-256)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">키/서명 크기 트레이드오프</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">알고리즘</th>
                <th className="border border-border px-3 py-2 text-left">PK 크기</th>
                <th className="border border-border px-3 py-2 text-left">SK 크기</th>
                <th className="border border-border px-3 py-2 text-left">서명 크기</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">ECDSA secp256k1</td>
                <td className="border border-border px-3 py-2">33 B</td>
                <td className="border border-border px-3 py-2">32 B</td>
                <td className="border border-border px-3 py-2">65 B</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Ed25519</td>
                <td className="border border-border px-3 py-2">32 B</td>
                <td className="border border-border px-3 py-2">64 B</td>
                <td className="border border-border px-3 py-2">64 B</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">RSA-2048</td>
                <td className="border border-border px-3 py-2">256 B</td>
                <td className="border border-border px-3 py-2">256 B</td>
                <td className="border border-border px-3 py-2">256 B</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Dilithium2</strong></td>
                <td className="border border-border px-3 py-2">1,312 B</td>
                <td className="border border-border px-3 py-2">2,528 B</td>
                <td className="border border-border px-3 py-2">2,420 B</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Falcon-512</td>
                <td className="border border-border px-3 py-2">897 B</td>
                <td className="border border-border px-3 py-2">1,281 B</td>
                <td className="border border-border px-3 py-2">666 B</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">SPHINCS+</td>
                <td className="border border-border px-3 py-2">32 B</td>
                <td className="border border-border px-3 py-2">64 B</td>
                <td className="border border-border px-3 py-2">17 KB</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
