import CodePanel from '@/components/ui/code-panel';
import BCSFlowViz from './viz/BCSFlowViz';
import { BCS_CODE, HASH_CODE } from './BCSTransformData';

export default function BCSTransform() {
  return (
    <section id="bcs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BCS 변환</h2>
      <div className="not-prose mb-8">
        <BCSFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>BCS(Ben-Sasson, Chiesa, Spooner) 변환</strong>은
          공개 코인 IOP를 비상호작용 zkSNARK로 변환합니다.<br />
          Fiat-Shamir 변환의 확장으로,
          해시 함수와 머클 트리를 결합하여
          상호작용 없이 검증 가능한 증명을 생성합니다.
        </p>
        <h3>BCS 변환 과정</h3>
        <CodePanel title="BCS 변환 3단계" code={BCS_CODE}
          annotations={[
            { lines: [4, 8], color: 'sky', note: '머클 트리로 오라클 커밋' },
            { lines: [11, 13], color: 'emerald', note: '해시 체인으로 챌린지 생성' },
            { lines: [16, 18], color: 'amber', note: '쿼리 응답과 머클 증명' },
          ]} />
        <h3>해시 함수 & 머클 트리</h3>
        <CodePanel title="해시 및 머클 구현" code={HASH_CODE}
          annotations={[
            { lines: [2, 6], color: 'sky', note: 'Blake2b / SHA-3 / Poseidon' },
            { lines: [10, 12], color: 'emerald', note: '머클 트리 구조' },
            { lines: [15, 17], color: 'amber', note: '배치 해싱 & 증명 생성' },
          ]} />
      </div>
    </section>
  );
}
