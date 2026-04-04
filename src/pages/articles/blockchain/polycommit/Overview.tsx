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
    </section>
  );
}
