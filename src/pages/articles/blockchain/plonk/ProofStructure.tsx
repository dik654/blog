import CodePanel from '@/components/ui/code-panel';
import ProofStructureViz from './viz/ProofStructureViz';
import { COMMIT_POINTS_CODE, EVAL_VALUES_CODE, OPENING_PROOF_CODE, STRUCT_CODE } from './ProofStructureData';

export default function ProofStructure() {
  return (
    <section id="proof-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 데이터 구조</h2>
      <div className="not-prose mb-8"><ProofStructureViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">커밋먼트 포인트</h3>
        <p>증명에는 <strong>G1 점 9개</strong>가 포함된다. Round 1-3에서 생성되는 와이어, 순열, 몫 커밋먼트이다.</p>
        <CodePanel title="G1 커밋먼트 (7개)" code={COMMIT_POINTS_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 'Round 1: 와이어 3개' },
            { lines: [3, 3], color: 'emerald', note: 'Round 2: 순열 1개' },
            { lines: [4, 4], color: 'amber', note: 'Round 3: 몫 3개' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">평가값</h3>
        <p>Round 4에서 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ζ</code>와 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ζω</code>에서 평가한 스칼라 값들이다.</p>
        <CodePanel title="Fr 평가값 (6개)" code={EVAL_VALUES_CODE}
          annotations={[
            { lines: [1, 2], color: 'violet', note: '와이어 평가' },
            { lines: [3, 4], color: 'sky', note: '순열 + 시프트 평가' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">오프닝 증명</h3>
        <CodePanel title="오프닝 증명 + 총 크기" code={OPENING_PROOF_CODE}
          annotations={[
            { lines: [1, 3], color: 'rose', note: '2개 G1 점 — 배치 오프닝' },
            { lines: [5, 8], color: 'emerald', note: '총 768B 고정 크기' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Rust 구조체</h3>
        <CodePanel title="Proof 구조체" code={STRUCT_CODE}
          annotations={[
            { lines: [2, 7], color: 'sky', note: 'Round 1-3 커밋먼트' },
            { lines: [8, 14], color: 'violet', note: 'Round 4-5 값 + 오프닝' },
          ]} />
      </div>
    </section>
  );
}
