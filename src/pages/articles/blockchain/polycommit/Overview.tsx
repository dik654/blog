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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Polynomial Commitment Scheme (PCS)
//
// 목적: 다항식 p(x)에 대해:
//   1. 커밋: c = Commit(p)  # 다항식 요약
//   2. 공개: (x, y) + π     # y = p(x) 증명
//   3. 검증: Verify(c, x, y, π) → true/false
//
// 필요 속성:
//   - Binding: 같은 c로 두 다른 p 커밋 불가
//   - Hiding (옵션): c로부터 p 추출 불가
//   - Succinct: π 작음 (O(1) or O(log n))
//   - Extractable: π가 있으면 p 복원 가능
//
// 활용:
//   - zkSNARK / zkSTARK 핵심 빌딩 블록
//   - Vector commitments (배열 커밋)
//   - Accumulators
//   - Verifiable computation

// 사용 패턴 예시 (PLONK):
//   1. Prover: 증인 다항식 w(x) 생성
//   2. Commit: c_w = PC.Commit(w)
//   3. Challenge: random point ζ
//   4. Evaluate: y = w(ζ)
//   5. Proof: π = PC.Open(w, ζ, y)
//   6. Verifier: PC.Verify(c_w, ζ, y, π)

// 복잡도 비교:
//
// ┌─────────────┬──────────┬──────────┬──────────┐
// │  Scheme     │ Commit   │ Open     │ Verify   │
// ├─────────────┼──────────┼──────────┼──────────┤
// │ KZG10       │ O(n)·MSM │ O(n)     │ O(1)     │
// │ IPA         │ O(n)     │ O(n)·log │ O(log n) │
// │ FRI         │ O(n log n)│ O(log²)│ O(log²)  │
// │ Hyrax       │ O(n)     │ O(√n)    │ O(√n)    │
// │ Ligero      │ O(n log n)│ O(n)   │ O(√n)    │
// │ Bulletproofs│ O(n)     │ O(log n) │ O(log n) │
// └─────────────┴──────────┴──────────┴──────────┘

// Transparent vs Trusted Setup:
//   Trusted: KZG10, Marlin, Sonic (powers of τ 필요)
//   Transparent: IPA, FRI, Ligero, Hyrax`}
        </pre>
      </div>
    </section>
  );
}
