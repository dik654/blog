import M from '@/components/ui/math';
import SchnorrViz from './viz/SchnorrViz';
import WhyParamsViz from './viz/WhyParamsViz';
import PohligHellmanViz from './viz/PohligHellmanViz';

export default function SchnorrProtocol() {
  return (
    <section id="schnorr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Schnorr 식별 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Sigma 프로토콜의 가장 단순한 구현 — 이산로그 문제(DLP) 기반.
          <br />
          Ed25519, Schnorr 서명의 이론적 기반.
        </p>
      </div>

      <h3 className="text-lg font-bold mb-4">왜 소수 p, 부분군 위수 q, 생성원 g?</h3>
      <div className="not-prose mb-8"><WhyParamsViz /></div>

      <h3 className="text-lg font-bold mb-4">Pohlig-Hellman 공격</h3>
      <div className="not-prose mb-8"><PohligHellmanViz /></div>

      <h3 className="text-lg font-bold mb-4">수치 예시 (p=23, q=11, x=3)</h3>
      <div className="not-prose"><SchnorrViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Schnorr Identification Protocol</h3>

        {/* Setup & Key Generation */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">Setup (1989)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-semibold mb-1">파라미터</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><M>p</M>: 큰 소수</li>
                <li><M>q</M>: <M>{'p{-}1'}</M>의 큰 소인수 (<M>{'|q| = 256'}</M> bits)</li>
                <li><M>g</M>: order <M>q</M>의 generator</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">키 생성</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><M>{'x \\leftarrow \\text{random} \\in [1, q{-}1]'}</M> (비밀키)</li>
                <li><M>{'y = g^x \\bmod p'}</M> (공개키)</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">증명: "나는 <M>{'\\log_g(y) = x'}</M>를 안다"</p>
            </div>
          </div>
        </div>

        {/* 3-move protocol */}
        <h4 className="text-lg font-semibold mt-5 mb-3">3-move Protocol</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">Round 1</span>
              <span className="text-sm font-semibold">Commitment</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><M>{'k \\leftarrow \\text{random} \\in [1, q{-}1]'}</M></li>
              <li><M>{'a = g^k \\bmod p'}</M></li>
              <li>Prover &rarr; Verifier: <M>a</M></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded font-semibold">Round 2</span>
              <span className="text-sm font-semibold">Challenge</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><M>{'e \\leftarrow \\text{random} \\in [1, 2^t]'}</M></li>
              <li><M>t</M> = 보안 파라미터</li>
              <li>Verifier &rarr; Prover: <M>e</M></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded font-semibold">Round 3</span>
              <span className="text-sm font-semibold">Response</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><M>{'z = k + e \\cdot x \\bmod q'}</M></li>
              <li>Prover &rarr; Verifier: <M>z</M></li>
            </ul>
          </div>
        </div>

        {/* Verification + 왜 동작하나 */}
        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Verification: <M>{'g^z \\stackrel{?}{\\equiv} a \\cdot y^e \\pmod{p}'}</M></div>
          <M display>{'\\underbrace{g^z}_{\\text{검증 좌변}} = g^{\\overbrace{k + e \\cdot x}^{\\text{z의 정의}}} = \\underbrace{g^k}_{\\text{= a}} \\cdot \\underbrace{(g^x)^e}_{\\text{= y}^e} = \\underbrace{a \\cdot y^e}_{\\text{검증 우변}} \\; \\checkmark'}</M>
          <p className="text-sm text-muted-foreground mt-2">g = 생성원, z = k + ex mod q (응답), k = 랜덤 논스, e = 챌린지, x = 비밀키, a = g^k (커밋먼트), y = g^x (공개키). 지수 법칙으로 좌변과 우변이 일치함을 확인.</p>
        </div>

        {/* 보안 분석 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">보안 분석</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Completeness</div>
            <p className="text-sm text-muted-foreground">정직한 Prover: <M>{'g^z = a \\cdot y^e'}</M> 항상 성립</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Special Soundness</div>
            <p className="text-sm text-muted-foreground mb-1">
              같은 <M>a</M>에 대해 <M>{'(e,z),(e\',z\')'}</M> 확보 시:
            </p>
            <M display>{'\\underbrace{x}_{\\text{비밀키}} = \\frac{\\overbrace{z - z\'}^{\\text{응답 차이}}}{\\underbrace{e - e\'}_{\\text{챌린지 차이}}} \\bmod \\underbrace{q}_{\\text{부분군 위수}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">z, z\' = 동일 커밋먼트 a에 대한 두 응답, e, e\' = 서로 다른 두 챌린지, q = 부분군 위수. 같은 a에 두 번 다른 챌린지로 응답하면 비밀키가 노출 -- 논스 재사용 금지의 근거.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">HVZK Simulator</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>1. <M>{"z'"}</M> &larr; random</li>
              <li>2. <M>{"e'"}</M> &larr; random</li>
              <li>3. <M>{"a' = g^{z'} \\cdot y^{-e'}"}</M></li>
              <li>&rarr; 실제 transcript와 동일 분포</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
