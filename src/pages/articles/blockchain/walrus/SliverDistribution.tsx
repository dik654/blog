import CodePanel from '@/components/ui/code-panel';
import {
  SLIVER_PAIR_CODE, SLIVER_PAIR_ANNOTATIONS,
  VERIFY_CODE, VERIFY_ANNOTATIONS,
} from './SliverDistributionData';

export default function SliverDistribution({ title }: { title?: string }) {
  return (
    <section id="sliver-distribution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '슬라이버 분배 & 검증'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          각 저장 노드는 블롭의 <strong>Primary + Secondary 슬라이버 쌍</strong>을
          보유합니다. Blake2b256 Merkle 트리로 슬라이버 무결성을 검증하고,
          2f+1개 노드의 서명으로 WriteCertificate를 생성합니다.
        </p>

        <h3>SliverPair 구조</h3>
        <CodePanel title="슬라이버 쌍 & 심볼 구조" code={SLIVER_PAIR_CODE}
          annotations={SLIVER_PAIR_ANNOTATIONS} />

        <h3>슬라이버 검증 & 배포</h3>
        <CodePanel title="Merkle 검증 + WriteCertificate + 에포크 할당" code={VERIFY_CODE}
          annotations={VERIFY_ANNOTATIONS} />
      </div>
    </section>
  );
}
