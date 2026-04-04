import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import KZGCommitViz from './viz/KZGCommitViz';
import KZGFlowViz from './viz/KZGFlowViz';
import { FACTOR_CODE, SRS_CODE, COMMIT_OPEN_CODE, BATCH_CODE } from './KZGData';
import { codeRefs } from './codeRefs';

export default function KZG({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="kzg" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KZG 다항식 Commitment</h2>
      <div className="not-prose mb-8"><KZGCommitViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">KZG 흐름 시퀀스</h3>
      </div>
      <div className="not-prose mb-8"><KZGFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('kzg-srs', codeRefs['kzg-srs'])} />
          <span className="text-[10px] text-muted-foreground self-center">SRS 구조체</span>
          <CodeViewButton onClick={() => onCodeRef('kzg-commit', codeRefs['kzg-commit'])} />
          <span className="text-[10px] text-muted-foreground self-center">commit() + open()</span>
          <CodeViewButton onClick={() => onCodeRef('kzg-verify', codeRefs['kzg-verify'])} />
          <span className="text-[10px] text-muted-foreground self-center">verify() 페어링</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 KZG가 필요한가?</h3>
        <p>Groth16은 <strong>회로별 trusted setup</strong>이 필요하다.
        <br />
          회로가 바뀌면 setup을 처음부터 다시 해야 한다.
        <br />
          KZG(Kate-Zaverucha-Goldberg)는 <strong>universal setup</strong>으로 이 문제를 해결한다.
        <br />
          비밀 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">τ</code> 하나로 모든 다항식에 재사용할 수 있다.</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Commitment 크기: G1 1개 = 64 bytes</li>
          <li>Opening proof: G1 1개 = 64 bytes</li>
          <li>검증 시간: O(1) - 페어링 2회</li>
          <li>Setup: 1회 (universal), 파라미터 τ 1개</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심: 다항식 인수정리 (Factor Theorem)</h3>
        <CodePanel
          title="다항식 인수정리 기반 증명"
          code={FACTOR_CODE}
          annotations={[
            { lines: [1, 1], color: 'sky', note: '인수정리 핵심 동치' },
            { lines: [4, 7], color: 'emerald', note: '증명자-검증자 흐름' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">SRS (Structured Reference String)</h3>
        <p>비밀 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">τ</code>를 직접 노출하지 않고, 타원곡선 위의 점으로 인코딩한다.</p>
        <CodePanel title="SRS 구성" code={SRS_CODE} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Commit / Open / Verify</h3>
        <CodePanel
          title="KZG Commit / Open / Verify"
          code={COMMIT_OPEN_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 'Commit: MSM 연산' },
            { lines: [4, 7], color: 'emerald', note: 'Open: 다항식 나눗셈' },
            { lines: [9, 12], color: 'violet', note: 'Verify: 페어링 검증' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Batch Opening</h3>
        <p>여러 다항식을 같은 점 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">z</code>에서 한 번에 열 수 있다. 검증자가 랜덤 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">ν</code>를 선택하여 선형 결합한다.</p>
        <CodePanel
          title="Batch Opening"
          code={BATCH_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: '다항식 선형 결합' },
            { lines: [6, 8], color: 'emerald', note: 'commitment 선형 결합으로 단일 검증' },
          ]}
        />
      </div>
    </section>
  );
}
