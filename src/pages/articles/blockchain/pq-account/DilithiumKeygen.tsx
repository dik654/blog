import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import M from '@/components/ui/math';
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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">LWE (Learning With Errors, Regev 2005)</p>
            <p className="text-sm text-muted-foreground mb-2">
              문제: 주어진 <M>{'(A, b)'}</M> where <M>{'b = A \\cdot s + e \\mod q'}</M>, <M>{'s'}</M> 찾기
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div><M>{'s'}</M>: secret vector</div>
              <div><M>{'e'}</M>: small error</div>
              <div><M>{'A'}</M>: public random matrix</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Hardness Assumption</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>SIS (Short Integer Solution) 문제와 동치</li>
              <li>Lattice SVP에 reduction</li>
              <li>Best quantum attack: <M>{'2^{0.292 \\cdot \\dim}'}</M> time</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">Module-LWE (MLWE)</p>
            <p className="text-sm text-muted-foreground mb-2">
              LWE의 변형: polynomial ring <M>{'R_q = \\mathbb{Z}_q[X]/(X^n + 1)'}</M> 사용
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Vector elements가 polynomials &mdash; 더 효율적 (FFT 적용 가능)</li>
              <li>구조화된 보안 가정 (weaker than general LWE)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Dilithium Keygen 수식</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>seed 선택</li>
              <li><M>{'A = \\text{expand}(\\text{seed}) \\in R_q^{k \\times l}'}</M></li>
              <li><M>{'s_1 \\in S_\\eta^l,\\; s_2 \\in S_\\eta^k'}</M> (short polynomials)</li>
              <li><M>{'t = A \\cdot s_1 + s_2'}</M></li>
              <li><M>{'(t_{\\text{high}}, t_{\\text{low}}) = \\text{power2round}(t)'}</M></li>
            </ol>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mt-3">
              <div><strong>Public key</strong>: (seed, <M>{'t_{\\text{high}}'}</M>)</div>
              <div><strong>Secret key</strong>: (seed, tr, <M>{'s_1, s_2, t_{\\text{low}}'}</M>)</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">NIST Security Levels</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">Dilithium2</p><p className="font-mono">Level 2 (~AES-128)</p></div>
              <div><p className="text-muted-foreground">Dilithium3</p><p className="font-mono">Level 3 (~AES-192)</p></div>
              <div><p className="text-muted-foreground">Dilithium5</p><p className="font-mono">Level 5 (~AES-256)</p></div>
            </div>
          </div>
        </div>

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
