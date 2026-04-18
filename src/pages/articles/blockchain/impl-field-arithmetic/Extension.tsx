import M from '@/components/ui/math';
import ExtViz from './viz/ExtViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Extension({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="extension" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">확장체 Fp2 → Fp6 → Fp12</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          BN254 G2 점의 좌표는 Fp 하나로 표현 불가 — Fp2(이차 확장체)가 필요
          <br />
          Fp2 = a0 + a1*u (u^2 = -1) — 복소수와 동일한 구조
          <br />
          Fp6 = Fp2 위의 3차 확장, Fp12 = Fp6 위의 2차 확장
        </p>
        <p className="leading-7">
          타워 구조: Fp → Fp2 → Fp6 → Fp12 (2 x 3 x 2 = 12차)
          <br />
          모든 레벨에서 Karatsuba 트릭으로 곱셈 횟수를 절감
          <br />
          페어링(pairing) e(G1, G2)의 결과가 Fp12 원소
        </p>
      </div>
      <div className="not-prose mb-8">
        <ExtViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          역원 계산의 연쇄 위임: Fp12 → Fp6 → Fp2 → Fp
          <br />
          각 층에서 conjugate + norm으로 차원을 하나씩 내림
          <br />
          최종적으로 Fp의 Fermat 역원(a^(p-2))에 도달 — 복잡한 12차 역원이 소수체 역원으로 환원
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">확장체 타워 구현</h3>

        {/* BN254 Tower */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">BN254 타워 구조</span>
            <span className="text-xs text-muted-foreground ml-2">총 차원: 2 &times; 3 &times; 2 = 12 over Fp</span>
          </div>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <p className="font-semibold">Fp</p>
              <p className="text-xs text-muted-foreground">base prime field</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Fp2</p>
              <p className="text-xs text-muted-foreground"><M>{'\\mathbb{F}_p[u]/(u^2+1)'}</M></p>
              <p className="text-xs text-muted-foreground">degree 2</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Fp6</p>
              <p className="text-xs text-muted-foreground"><M>{'\\mathbb{F}_{p^2}[v]/(v^3-(u+9))'}</M></p>
              <p className="text-xs text-muted-foreground">degree 3</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">Fp12</p>
              <p className="text-xs text-muted-foreground"><M>{'\\mathbb{F}_{p^6}[w]/(w^2-v)'}</M></p>
              <p className="text-xs text-muted-foreground">degree 2</p>
            </div>
          </div>
        </div>

        {/* Fp2 */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Fp2 구현</span>
            <span className="text-xs text-muted-foreground ml-2"><code className="text-xs bg-muted px-1 rounded">struct Fp2 {'{'} c0: Fp, c1: Fp {'}'}</code> — c0 + c1&middot;u</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">덧셈 — 성분별</p>
              <M display>{'(a + bu) + (c + du) = (a+c) + (b+d)u'}</M>
              <p className="text-xs text-muted-foreground mt-2 mb-1">곱셈 — Karatsuba (4 &rarr; 3 Fp mults)</p>
              <M display>{'(a + bu)(c + du) = (ac - bd) + (ad + bc)u'}</M>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">제곱 — 2 Fp mults (최적)</p>
              <M display>{'(a + bu)^2 = (a+b)(a-b) + 2ab \\cdot u'}</M>
              <p className="text-xs text-muted-foreground mt-2 mb-1">역원 — 2 Fp mults + 1 Fp inverse</p>
              <M display>{'(a + bu)^{-1} = \\frac{a - bu}{a^2 + b^2}'}</M>
              <p className="text-xs text-muted-foreground mt-1">켤레(conjugate): <M>{'\\overline{a + bu} = a - bu'}</M></p>
            </div>
          </div>
        </div>

        {/* Fp6 */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Fp6 구현</span>
            <span className="text-xs text-muted-foreground ml-2"><code className="text-xs bg-muted px-1 rounded">struct Fp6 {'{'} c0: Fp2, c1: Fp2, c2: Fp2 {'}'}</code></span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">표현: <M>{'c_0 + c_1 v + c_2 v^2'}</M>, <M>{'v^3 = u + 9'}</M></p>
              <p className="text-xs text-muted-foreground mt-2 mb-1">곱셈 — Karatsuba-Toom (9 &rarr; 6 Fp2 mults)</p>
              <p className="text-xs"><M>{'c_0 c_0\\!\\prime'}</M>, <M>{'c_1 c_1\\!\\prime'}</M>, <M>{'c_2 c_2\\!\\prime'}</M> 각 1회</p>
              <p className="text-xs mt-1"><M>{'(c_0+c_1)(c_0\\!\\prime+c_1\\!\\prime)'}</M> 등 교차항 3회</p>
              <p className="text-xs mt-1">v 리덕션으로 결합</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">nonresidue (v) 곱셈 — 저비용</p>
              <p className="text-xs"><M>{'v(a + bv + cv^2) = c(u+9) + av + bv^2'}</M></p>
              <p className="text-xs text-muted-foreground mt-1">순열 + (u+9) 곱셈만</p>
              <p className="text-xs text-muted-foreground mt-3 mb-1">역원 — norm을 Fp2로 내림</p>
              <p className="text-xs">1 Fp2 inverse + 다수 곱셈</p>
            </div>
          </div>
        </div>

        {/* Fp12 */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Fp12 구현</span>
            <span className="text-xs text-muted-foreground ml-2"><code className="text-xs bg-muted px-1 rounded">struct Fp12 {'{'} c0: Fp6, c1: Fp6 {'}'}</code> — <M>{'c_0 + c_1 w'}</M>, <M>{'w^2 = v'}</M></span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">곱셈 — Karatsuba (4 &rarr; 3 Fp6 mults)</p>
              <p className="text-xs"><M>{'c_0 c_0\\!\\prime'}</M>, <M>{'c_1 c_1\\!\\prime'}</M></p>
              <p className="text-xs"><M>{'(c_0+c_1)(c_0\\!\\prime+c_1\\!\\prime)'}</M> - 위 두 결과</p>
              <p className="text-xs">v 스케일링으로 결합</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">제곱</p>
              <p className="text-xs">Cyclotomic squaring (GT용): 36 &rarr; <strong>9 Fp mults</strong></p>
              <p className="text-xs text-muted-foreground mt-2 mb-1">Frobenius: <M>{'x \\mapsto x^p'}</M></p>
              <p className="text-xs">사전 계산된 상수로 저비용 수행</p>
              <p className="text-xs text-muted-foreground">final exponentiation에 사용</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">역원 — 타워를 내려가며 norm</p>
              <p className="text-xs">Fp12 &rarr; Fp6 norm &rarr; Fp2 norm &rarr; Fp</p>
              <p className="text-xs mt-1"><M>{'\\text{inv}(a) = \\overline{a} / \\text{norm}(a)'}</M></p>
            </div>
          </div>
        </div>

        {/* Karatsuba savings */}
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">다단 Karatsuba 절감 효과</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Level 1 (Fp2)</p>
              <p>4 &rarr; <strong>3</strong> Fp mults</p>
              <p className="text-xs text-muted-foreground">25% 절감</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Level 2 (Fp6)</p>
              <p>9 &rarr; <strong>6</strong> Fp2 mults</p>
              <p className="text-xs text-muted-foreground">33% 절감</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Level 3 (Fp12)</p>
              <p>4 &rarr; <strong>3</strong> Fp6 mults</p>
              <p className="text-xs text-muted-foreground">25% 절감</p>
            </div>
          </div>
          <div className="px-5 pb-5">
            <p className="text-sm text-center">합산: <M>{'4 \\times 9 \\times 4 = 144'}</M> &rarr; <M>{'3 \\times 6 \\times 3 = 54'}</M> Fp mults — <strong>2.67배 가속</strong></p>
          </div>
        </div>

        {/* Pairing & Code Structure */}
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">페어링에서의 확장체 사용</p>
            <p className="text-sm"><M>{'e: G_1 \\times G_2 \\to \\mathbb{F}_{p^{12}}'}</M></p>
            <p className="text-xs text-muted-foreground mt-1"><M>{'G_1 \\in E(\\mathbb{F}_p)'}</M> — 좌표가 Fp</p>
            <p className="text-xs text-muted-foreground"><M>{'G_2 \\in E\\!\\prime(\\mathbb{F}_{p^2})'}</M> — 좌표가 Fp2 (twist)</p>
            <p className="text-xs text-muted-foreground">결과: Fp12 (GT 부분군)</p>
            <p className="text-xs text-muted-foreground mt-2">Miller loop: Fp12 곱&middot;제곱</p>
            <p className="text-xs text-muted-foreground">Final exp: Fp12 연산 + Frobenius</p>
          </div>
          <div className="bg-muted/50 rounded-xl border border-border overflow-hidden">
            <div className="bg-muted px-5 py-2 border-b border-border">
              <span className="text-sm font-semibold">코드 구조 & 성능</span>
            </div>
            <div className="p-5 text-sm">
              <p className="text-xs text-muted-foreground mb-1">파일 구조 — 각 상위 레벨이 하위에 위임</p>
              <p className="text-xs"><code className="text-xs bg-muted px-1 rounded">fp.rs</code> &rarr; <code className="text-xs bg-muted px-1 rounded">fp2.rs</code> &rarr; <code className="text-xs bg-muted px-1 rounded">fp6.rs</code> &rarr; <code className="text-xs bg-muted px-1 rounded">fp12.rs</code> &rarr; <code className="text-xs bg-muted px-1 rounded">pairing.rs</code></p>
              <p className="text-xs text-muted-foreground mt-3 mb-1">성능 (BN254, 싱글 스레드)</p>
              <div className="space-y-0.5">
                <div className="flex justify-between text-xs"><span>Fp mult</span><span>~18 ns</span></div>
                <div className="flex justify-between text-xs"><span>Fp2 mult</span><span>~60 ns (3 Fp mults + adds)</span></div>
                <div className="flex justify-between text-xs"><span>Fp6 mult</span><span>~400 ns (6 Fp2 mults)</span></div>
                <div className="flex justify-between text-xs"><span>Fp12 mult</span><span>~1500 ns (3 Fp6 mults)</span></div>
                <div className="flex justify-between text-xs"><span>Fp12 sq (cyclotomic)</span><span>~500 ns</span></div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">라이브러리: ark-bn254 (Rust), bn256 (Go), blst (C), py_ecc (Python)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
