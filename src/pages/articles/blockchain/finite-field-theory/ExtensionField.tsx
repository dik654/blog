import M from '@/components/ui/math';
import ExtFieldViz from './viz/ExtFieldViz';

export default function ExtensionField() {
  return (
    <section id="extension-field" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">확장체 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          기존 체에 기약 다항식의 근을 추가하여 더 큰 체 구성 — BN254 페어링에서 필수.
        </p>
      </div>
      <div className="not-prose"><ExtFieldViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">확장체 구성</h3>

        {/* 정의 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Extension Field 정의</div>
          <p className="text-sm text-muted-foreground">
            <M>{'K \\subset L'}</M> &mdash; 체 <M>K</M>에서 체 <M>L</M>로 확장. <M>{'[L:K]'}</M> = 확장 차수.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            구성: 기약 다항식 <M>{'f(x) \\in K[x]'}</M> 선택 &rarr; <M>{'L = K[x] / f(x)'}</M> (몫환)
          </p>
        </div>

        {/* 예시: F_p → F_p² */}
        <h4 className="text-lg font-semibold mt-5 mb-3">예시: <M>{'\\mathbb{F}_p \\to \\mathbb{F}_{p^2}'}</M></h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            <M>{'f(x) = x^2 + 1'}</M> (<M>{'p=3'}</M>에서 기약) &rarr; <M>{'\\mathbb{F}_9 = \\mathbb{F}_3[x]/(x^2+1)'}</M>
          </p>
          <p className="text-sm text-muted-foreground mb-3">원소: <M>{'a + bi'}</M> (여기서 <M>{'i^2 = -1'}</M>)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded bg-muted/50 p-3">
              <p className="text-sm font-semibold">덧셈</p>
              <M display>{'\\underbrace{(a+bi)}_{\\text{첫째 원소}} + \\underbrace{(c+di)}_{\\text{둘째 원소}} = \\underbrace{(a{+}c)}_{\\text{실수부 합}} + \\underbrace{(b{+}d)i}_{\\text{허수부 합}}'}</M>
              <p className="text-sm text-muted-foreground mt-2">a, b, c, d는 기저체 원소. 각 성분별로 독립적으로 더한다.</p>
            </div>
            <div className="rounded bg-muted/50 p-3">
              <p className="text-sm font-semibold">곱셈</p>
              <M display>{'\\underbrace{(a+bi)}_{\\text{첫째}} \\underbrace{(c+di)}_{\\text{둘째}} = \\underbrace{(ac{-}bd)}_{\\text{실수부}} + \\underbrace{(ad{+}bc)i}_{\\text{허수부}}'}</M>
              <p className="text-sm text-muted-foreground mt-2">i^2 = -1 관계를 적용해 전개. ac-bd가 실수부, ad+bc가 허수부 -- 복소수 곱셈과 동일한 구조.</p>
            </div>
          </div>
        </div>

        {/* Pairing-friendly curves */}
        <h4 className="text-lg font-semibold mt-5 mb-3">Pairing-friendly Curves</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">BN254 (Barreto-Naehrig)</div>
            <p className="text-xs text-muted-foreground mb-2">Base field: <M>{'\\mathbb{F}_p'}</M>, <M>{'p \\sim 2^{254}'}</M></p>
            <p className="text-xs font-mono text-muted-foreground mb-2">Tower: <M>{'\\mathbb{F}_p \\subset \\mathbb{F}_{p^2} \\subset \\mathbb{F}_{p^6} \\subset \\mathbb{F}_{p^{12}}'}</M></p>
            <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
              <div className="rounded bg-muted/50 p-1.5 text-center"><M>G_1</M>: 256 bit</div>
              <div className="rounded bg-muted/50 p-1.5 text-center"><M>G_2</M>: 512 bit</div>
              <div className="rounded bg-muted/50 p-1.5 text-center"><M>G_T</M>: 3072 bit</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Pairing: <M>{'e: G_1 \\times G_2 \\to G_T'}</M></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">BLS12-381</div>
            <p className="text-xs text-muted-foreground mb-2">더 안전, 더 효율적</p>
            <p className="text-xs text-muted-foreground">Curve: <M>{'E: y^2 = x^3 + 4'}</M></p>
            <p className="text-xs text-muted-foreground">Embedding degree: 12</p>
            <p className="text-xs text-muted-foreground"><M>{'\\mathbb{F}_{p^{12}} = \\mathbb{F}_{p^2} \\cdot \\mathbb{F}_{p^6}'}</M></p>
          </div>
        </div>

        {/* Frobenius */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Frobenius Endomorphism</div>
          <M display>{'\\underbrace{\\varphi}_{\\text{프로베니우스 사상}}: L \\to L, \\quad \\varphi(x) = \\underbrace{x^p}_{\\text{p제곱 사상}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">phi = Frobenius endomorphism, L = 확장체, p = 기저체의 특성(characteristic). 기저체 원소는 고정(x^p = x)하고 확장 원소만 변환하는 자기동형사상 -- 확장체의 갈루아 군을 생성하며, 페어링 연산과 효율적 지수 계산에 핵심.</p>
        </div>

        {/* 구현 최적화 + 라이브러리 */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">구현 최적화</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Tower extension 단계적 구성</li>
              <li>Sparse multiplication</li>
              <li>Efficient Frobenius</li>
              <li>Windowing for exponentiation</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">주요 라이브러리</div>
            <div className="grid grid-cols-2 gap-1">
              {[
                { name: 'arkworks-rs', lang: 'Rust' },
                { name: 'blst', lang: 'C/Rust' },
                { name: 'py_ecc', lang: 'Python' },
                { name: 'constantine', lang: 'Nim' },
              ].map(l => (
                <div key={l.name} className="rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                  <code>{l.name}</code> <span className="text-muted-foreground/60">({l.lang})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
