import M from '@/components/ui/math';
import WhySparseViz from './viz/WhySparseViz';

export default function WhySparse() {
  return (
    <section id="why-sparse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 희소한가: twist 구조</h2>
      <div className="not-prose mb-8"><WhySparseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          l(P)가 sparse한 이유는 G1 점 P와 G2 점 T의{' '}
          <strong>좌표 공간 차이</strong> 때문이다.<br />
          P의 좌표는 Fp(정수 1개), T의 좌표는 Fp2(a+bu 형태)다.
        </p>
        <p>
          degree-6 twist 구조 덕분에 접선 방정식{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            l(x,y) = yP + (-lambda*xP)*w + (lambda*xT - yT)*w*v
          </code>{' '}
          를 Fp12로 매핑하면, 특정 위치만 값이 채워진다.
        </p>
        <p>
          Fp 원소는 첫 번째 슬롯에만 들어간다. 나머지 11개는 0이다.<br />
          Fp2 원소는 특정 2개 슬롯에만 들어간다.<br />
          합치면 12개 중 <strong>3개 슬롯만 non-zero</strong>가 된다.
        </p>
        <p>
          twist의 degree가 6이라는 사실이 이 구조를 결정한다.<br />
          BN254처럼 embedding degree 12, twist degree 6인 곡선에서는
          항상 이 희소 패턴이 나타난다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Twist 구조와 Sparse 패턴</h3>

        {/* Setup */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Line Function이 Sparse한 이유</div>
          <p className="text-sm text-muted-foreground mb-2">
            <M>{'e(P, Q)'}</M> &mdash; <M>P</M> in <M>{'G_1'}</M> (over <M>{'\\mathbb{F}_p'}</M>), <M>Q</M> in <M>{'G_2'}</M> (over <M>{'\\mathbb{F}_{p^2}'}</M> via twist).
            Miller loop가 line function <M>l</M>을 누적:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">Doubling: <M>{'f = f^2 \\cdot l_{T,T}(P)'}</M></div>
            <div className="rounded bg-muted/50 p-2">Addition: <M>{'f = f \\cdot l_{T,Q}(P)'}</M></div>
          </div>
        </div>

        {/* Line function 구조 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Line Function 구조</div>
          <M display>{'l(x, y) = \\underbrace{y}_{\\text{평가점의 y좌표}} - \\underbrace{\\lambda}_{\\text{접선 기울기}} (\\underbrace{x - x_T}_{\\text{x 차이}}) - \\underbrace{y_T}_{\\text{접점의 y좌표}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>{'\\lambda'}</M>: 접선 또는 할선의 기울기. <M>{'(x_T, y_T)'}</M>: G2 위의 점 T의 좌표 (Fp2 원소)
          </p>
          <p className="text-sm text-muted-foreground mt-2 mb-2">
            Fp 점 <M>{'P = (x_P, y_P)'}</M>에서 평가하면:
          </p>
          <M display>{'l(P) = \\underbrace{y_P}_{\\text{Fp 원소 (슬롯 0)}} - \\underbrace{\\lambda \\cdot x_P}_{\\text{Fp 원소}} \\cdot u - \\underbrace{(\\lambda x_T - y_T)}_{\\text{Fp2 원소}} \\cdot uv'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>{'y_P, x_P'}</M>: G1 점의 좌표 (Fp). <M>{'\\lambda, x_T, y_T'}</M>: G2 점에서 유래 (Fp2). <M>u, v</M>: 확장체 기저 (<M>{'u^2=-1'}</M>, <M>{'v^3=u+1'}</M>)
          </p>
        </div>

        {/* Twist mapping */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">BN254 Sextic Twist &rarr; Fp12 매핑</div>
          <p className="text-sm text-muted-foreground mb-2">
            Fp12 basis: <M>{'\\{1, w, v, vw, v^2, v^2 w\\}'}</M> = 12개 Fp 계수.
            Line function은 이 중 <strong>3개 슬롯만</strong> non-zero.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">
              <span className="font-medium">D-twist:</span> slots 0, 3, 4 non-zero &rarr; <code>mul_by_034</code>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <span className="font-medium">M-twist:</span> slots 0, 1, 4 non-zero &rarr; <code>mul_by_014</code>
            </div>
          </div>
        </div>

        {/* 왜 정확히 3 슬롯? */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">왜 정확히 3 슬롯?</div>
          <p className="text-sm text-muted-foreground mb-2">
            Line function 구조 = <M>{'a + bw + cw^2'}</M> (degree-2 in <M>w</M>). 3개 Fp6 계수 &rarr; 각각 Fp2 (2 Fp) &rarr; 총 6 Fp.
          </p>
          <p className="text-sm text-muted-foreground">
            그러나 Fp 점 <M>P</M>에서 평가할 때 추가 구조로 일부 Fp2 성분이 소멸 &rarr; 최종 3개 Fp 계수만 non-zero.
          </p>
        </div>

        {/* Sparse mult 절감 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Sparse 곱셈 최적화</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">Standard Fp12 mult (Karatsuba): 18 Fp2 mults</div>
            <div className="rounded bg-muted/50 p-2">Sparse line mult: ~9 Fp mults (0인 항 건너뜀)</div>
          </div>
        </div>

        {/* Embedding degree vs twist degree */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Embedding Degree vs Twist Degree</div>
          <p className="text-sm text-muted-foreground mb-2">
            <M>k</M> = embedding degree, <M>d</M> = twist degree. <M>{'\\dim(G_2 / \\mathbb{F}_p) = k/d'}</M>. <M>d</M>가 클수록 line function이 더 sparse.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">BN254: <M>k=12, d=6</M> &rarr; <M>{'G_2'}</M> over <M>{'\\mathbb{F}_{p^2}'}</M></div>
            <div className="rounded bg-muted/50 p-2">BLS12-381: <M>k=12, d=6</M> &rarr; <M>{'G_2'}</M> over <M>{'\\mathbb{F}_{p^2}'}</M></div>
            <div className="rounded bg-muted/50 p-2">BLS24-315: <M>k=24, d=6</M> &rarr; <M>{'G_2'}</M> over <M>{'\\mathbb{F}_{p^4}'}</M></div>
          </div>
        </div>

        {/* 추가 최적화 + 구현 참조 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">추가 Sparse 최적화</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Sparse x Sparse</strong> &mdash; <code>mul_034_by_034</code>: 두 line function 곱. 더 많은 zero.</li>
              <li><strong>Cyclotomic squaring</strong> &mdash; GT subgroup 전용. Generic 대비 ~4x 빠름.</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">구현 참조</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>arkworks</strong> &mdash; <code>models/bn/pairing.rs</code></li>
              <li><strong>gnark</strong> &mdash; <code>sw_bn254/pairing2.go</code></li>
              <li><strong>blst</strong> &mdash; asm-level sparse line mult (최고 성능)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
