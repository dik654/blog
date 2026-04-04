import CodePanel from '@/components/ui/code-panel';
import DataStructuresViz from './viz/DataStructuresViz';
import { PROVING_KEY_CODE, VERIFYING_KEY_CODE, PROOF_CODE } from './DataStructuresData';

export default function DataStructures() {
  return (
    <section id="data-structures" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터 구조 상세</h2>
      <div className="not-prose mb-8"><DataStructuresViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Groth16의 세 가지 핵심 데이터 구조는 <strong>ProvingKey</strong>, <strong>VerifyingKey</strong>,
          <strong> Proof</strong>입니다. 각 구조체의 필드가 증명/검증 과정에서 어떻게 사용되는지 이해하는 것이
          Groth16 구현의 핵심입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">ProvingKey 구조체</h3>
        <CodePanel
          title="ProvingKey — 11개 필드"
          code={PROVING_KEY_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 'VK 내장 + 기본 포인트' },
            { lines: [7, 9], color: 'emerald', note: 'a/b query 벡터 (MSM 입력)' },
            { lines: [10, 11], color: 'amber', note: 'h/l query (QAP + private)' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">VerifyingKey 구조체</h3>
        <CodePanel
          title="VerifyingKey — 5개 필드"
          code={VERIFYING_KEY_CODE}
          annotations={[
            { lines: [2, 5], color: 'emerald', note: '4개 커브 포인트 (페어링 입력)' },
            { lines: [6, 6], color: 'amber', note: 'IC 벡터 (공개 입력 검증)' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">Proof 구조체</h3>
        <CodePanel
          title="Proof — 256 bytes (BN254)"
          code={PROOF_CODE}
          annotations={[
            { lines: [2, 4], color: 'sky', note: 'G1×2 + G2×1 = 상수 크기' },
          ]}
        />
      </div>
    </section>
  );
}
