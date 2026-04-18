import M from '@/components/ui/math';
import FiatShamirViz from './viz/FiatShamirViz';

export default function FiatShamir() {
  return (
    <section id="fiat-shamir" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fiat-Shamir 변환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Verifier의 랜덤 챌린지를 해시 H(a, stmt)로 대체 &mdash; 비대화형 증명.
          <br />
          모든 SNARK/STARK가 온체인 검증 가능한 이유.
        </p>
      </div>
      <div className="not-prose"><FiatShamirViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Fiat-Shamir Heuristic</h3>

        {/* 핵심 변환 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Fiat-Shamir Transform (1986)</div>
          <p className="text-sm text-muted-foreground mb-2">목표: Interactive &rarr; Non-interactive</p>
          <div className="flex items-center justify-center gap-4 my-3">
            <div className="rounded bg-muted/50 p-2 text-center text-sm">
              <p className="font-semibold">Interactive</p>
              <p className="text-xs text-muted-foreground"><M>{'e \\leftarrow V'}</M> (랜덤)</p>
            </div>
            <span className="text-muted-foreground text-lg">&rarr;</span>
            <div className="rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-500/30 p-2 text-center text-sm">
              <p className="font-semibold">Fiat-Shamir</p>
              <p className="text-xs text-muted-foreground"><M>{'e \\leftarrow H(a, \\text{stmt}, \\ldots)'}</M></p>
            </div>
          </div>
        </div>

        {/* Non-interactive 프로토콜 */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Prover</div>
            <div className="space-y-1">
              {[
                { s: '1', t: <><M>{'k \\leftarrow \\text{random}'}</M></> },
                { s: '2', t: <><M>{'a = g^k'}</M></> },
                { s: '3', t: <><M>{'e = H(g, y, a)'}</M> &larr; Verifier 역할 대체</> },
                { s: '4', t: <><M>{'z = k + e \\cdot x'}</M></> },
                { s: '5', t: <>출력: <M>{'(a, z)'}</M> 또는 <M>{'(e, z)'}</M></> },
              ].map(i => (
                <div key={i.s} className="flex gap-2 items-start text-sm text-muted-foreground">
                  <span className="text-xs font-mono bg-muted rounded px-1.5 py-0.5 shrink-0">{i.s}</span>
                  <span>{i.t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Verifier</div>
            <div className="space-y-1">
              <div className="flex gap-2 items-start text-sm text-muted-foreground">
                <span className="text-xs font-mono bg-muted rounded px-1.5 py-0.5 shrink-0">1</span>
                <span><M>{'e = H(g, y, a)'}</M></span>
              </div>
              <div className="flex gap-2 items-start text-sm text-muted-foreground">
                <span className="text-xs font-mono bg-muted rounded px-1.5 py-0.5 shrink-0">2</span>
                <span>Check: <M>{'g^z = a \\cdot y^e'}</M></span>
              </div>
            </div>
          </div>
        </div>

        {/* Random Oracle + 보안 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm font-semibold mb-2">Random Oracle Model</p>
          <p className="text-sm text-muted-foreground">
            해시 <M>H</M>를 random oracle로 가정 &mdash; 입력마다 독립 랜덤 출력. 실제 <M>H</M>와 차이 있을 수 있음.<br />
            보안 분석 (Pointcheval-Stern 1996): ZK 유지 + soundness 감소 negligible
          </p>
        </div>

        {/* 주의사항 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">주의사항</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Challenge Binding</div>
            <p className="text-sm text-muted-foreground">
              <M>e</M>는 statement + commitment + public params 모두 포함 필수 &mdash; 생략 시 공격 가능
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Frozen Heart</div>
            <p className="text-sm text-muted-foreground">
              Malleability 공격 &mdash; 해결: 도메인 분리 (domain separation)
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Weak FS</div>
            <p className="text-sm text-muted-foreground">
              <M>a</M>만 해싱하면 위험 &mdash; Strong FS: 모든 public data 포함 필수
            </p>
          </div>
        </div>

        {/* 실제 사용 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">실제 사용</h4>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'Schnorr 서명', desc: 'Interactive + FS = 현대 서명' },
            { name: 'SNARKs/STARKs', desc: '모든 ZK 시스템이 FS 사용 → 온체인 검증' },
            { name: 'Bulletproofs', desc: 'Multiple rounds를 FS로 압축' },
            { name: 'PLONK / Halo2', desc: '여러 interactive phase → non-interactive' },
          ].map(u => (
            <div key={u.name} className="rounded-lg border bg-card p-3">
              <p className="text-sm font-semibold">{u.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
