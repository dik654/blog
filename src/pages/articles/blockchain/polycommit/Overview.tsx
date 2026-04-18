import M from '@/components/ui/math';
import CodePanel from '@/components/ui/code-panel';
import SchemeCompareViz from './viz/SchemeCompareViz';
import {TRAIT_CODE, TRAIT_ANNOTATIONS, DIR_CODE, } from './OverviewData';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 스킴 비교'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>다항식 커밋먼트</strong>(Polynomial Commitment)는 유한체 위의 다항식에
          대해 커밋하고, 원하는 평가값을 암호학적 증명과 함께 공개하는 원시입니다.
          <code>arkworks-rs/poly-commit</code>은 6가지 주요 스킴을 통합 구현합니다.
        </p>
      </div>

      <SchemeCompareViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>PolynomialCommitment 트레이트</h3>
        <CodePanel title="공통 인터페이스" code={TRAIT_CODE}
          annotations={TRAIT_ANNOTATIONS} />

        <h3>프로젝트 구조</h3>
        <p>
          // poly-commit 디렉토리 구조<br />
          poly-commit/src/<br />
          lib.rs # PolynomialCommitment 트레이트 정의<br />
          data_structures.rs # LabeledPolynomial, LabeledCommitment<br />
          error.rs # 에러 타입 정의<br />
          kzg10/ # 원본 KZG10 구현 (페어링 기반)<br />
          marlin/ # Marlin PC (차수 제한 + 은닉)<br />
          sonic_pc/ # Sonic PC (AuroraLight 최적화)<br />
          ipa_pc/ # Inner Product Argument (투명 설정)<br />
          hyrax/ # Hyrax 다변수 PC<br />
          linear_codes/ # Ligero/Brakedown (해시 기반)<br />
          streaming_kzg/ # 스트리밍 KZG 구현
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Polynomial Commitment 개념</h3>

        {/* PCS 정의 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Polynomial Commitment Scheme (PCS)</div>
          <p className="text-sm text-muted-foreground mb-2">
            다항식 <M>{'p(x)'}</M>에 대해 세 단계로 동작한다.
          </p>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li><strong>Commit</strong> &mdash; <M>{'c = \\text{Commit}(p)'}</M> &nbsp;다항식 요약</li>
            <li><strong>Open</strong> &mdash; <M>{'(x, y, \\pi)'}</M> 공개 &nbsp;(<M>{'y = p(x)'}</M> 증명)</li>
            <li><strong>Verify</strong> &mdash; <M>{'\\text{Verify}(c, x, y, \\pi) \\to \\text{true/false}'}</M></li>
          </ol>
        </div>

        {/* 필요 속성 */}
        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-3">
            <div className="text-sm font-semibold mb-1">Binding</div>
            <p className="text-xs text-muted-foreground">같은 <M>c</M>로 두 다른 <M>p</M> 커밋 불가</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-sm font-semibold mb-1">Hiding</div>
            <p className="text-xs text-muted-foreground"><M>c</M>로부터 <M>p</M> 추출 불가 (옵션)</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-sm font-semibold mb-1">Succinct</div>
            <p className="text-xs text-muted-foreground"><M>{'\\pi'}</M> 크기 작음 &mdash; <M>{'O(1)'}</M> or <M>{'O(\\log n)'}</M></p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <div className="text-sm font-semibold mb-1">Extractable</div>
            <p className="text-xs text-muted-foreground"><M>{'\\pi'}</M>가 있으면 <M>p</M> 복원 가능</p>
          </div>
        </div>

        {/* 활용 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">활용 분야</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2 text-center">zkSNARK / zkSTARK</div>
            <div className="rounded bg-muted/50 p-2 text-center">Vector Commitments</div>
            <div className="rounded bg-muted/50 p-2 text-center">Accumulators</div>
            <div className="rounded bg-muted/50 p-2 text-center">Verifiable Computation</div>
          </div>
        </div>

        {/* PLONK 패턴 */}
        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">사용 패턴 예시 (PLONK)</div>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Prover: 증인 다항식 <M>{'w(x)'}</M> 생성</li>
            <li>Commit: <M>{'c_w = \\text{PC.Commit}(w)'}</M></li>
            <li>Challenge: 랜덤 포인트 <M>{'\\zeta'}</M></li>
            <li>Evaluate: <M>{'y = w(\\zeta)'}</M></li>
            <li>Proof: <M>{'\\pi = \\text{PC.Open}(w, \\zeta, y)'}</M></li>
            <li>Verifier: <M>{'\\text{PC.Verify}(c_w, \\zeta, y, \\pi)'}</M></li>
          </ol>
        </div>

        {/* 복잡도 비교 테이블 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4 overflow-x-auto">
          <div className="text-sm font-semibold mb-3">복잡도 비교</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 pr-4 font-medium">Scheme</th>
                <th className="pb-2 pr-4 font-medium">Commit</th>
                <th className="pb-2 pr-4 font-medium">Open</th>
                <th className="pb-2 font-medium">Verify</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-muted"><td className="py-1.5 pr-4">KZG10</td><td className="pr-4"><M>{'O(n)'}</M> MSM</td><td className="pr-4"><M>{'O(n)'}</M></td><td><M>{'O(1)'}</M></td></tr>
              <tr className="border-b border-muted"><td className="py-1.5 pr-4">IPA</td><td className="pr-4"><M>{'O(n)'}</M></td><td className="pr-4"><M>{'O(n \\log n)'}</M></td><td><M>{'O(\\log n)'}</M></td></tr>
              <tr className="border-b border-muted"><td className="py-1.5 pr-4">FRI</td><td className="pr-4"><M>{'O(n \\log n)'}</M></td><td className="pr-4"><M>{'O(\\log^2 n)'}</M></td><td><M>{'O(\\log^2 n)'}</M></td></tr>
              <tr className="border-b border-muted"><td className="py-1.5 pr-4">Hyrax</td><td className="pr-4"><M>{'O(n)'}</M></td><td className="pr-4"><M>{'O(\\sqrt{n})'}</M></td><td><M>{'O(\\sqrt{n})'}</M></td></tr>
              <tr className="border-b border-muted"><td className="py-1.5 pr-4">Ligero</td><td className="pr-4"><M>{'O(n \\log n)'}</M></td><td className="pr-4"><M>{'O(n)'}</M></td><td><M>{'O(\\sqrt{n})'}</M></td></tr>
              <tr><td className="py-1.5 pr-4">Bulletproofs</td><td className="pr-4"><M>{'O(n)'}</M></td><td className="pr-4"><M>{'O(\\log n)'}</M></td><td><M>{'O(\\log n)'}</M></td></tr>
            </tbody>
          </table>
        </div>

        {/* Trusted vs Transparent */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Trusted Setup 필요</div>
            <p className="text-sm text-muted-foreground">KZG10, Marlin, Sonic &mdash; powers of <M>{'\\tau'}</M> 필요</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Transparent (투명 설정)</div>
            <p className="text-sm text-muted-foreground">IPA, FRI, Ligero, Hyrax &mdash; trusted setup 불필요</p>
          </div>
        </div>
      </div>
    </section>
  );
}
