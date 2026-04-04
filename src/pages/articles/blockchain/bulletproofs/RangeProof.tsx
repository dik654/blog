import CodePanel from '@/components/ui/code-panel';
import RangeProofAggViz from '../components/RangeProofAggViz';
import { STRUCT_CODE, PROVE_CODE, AGG_CODE } from './RangeProofData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function RangeProof({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const _onCodeRef = onCodeRef;
  return (
    <section id="range-proof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '범위 증명 & 집계 (range_proof)'}</h2>
      <div className="not-prose mb-8"><RangeProofAggViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          범위 증명 — 비밀 값 v가 [0, 2^n) 범위에 있음을 증명<br />
          v의 n비트 분해에 내적 인수 증명 적용<br />
          m개 값 동시 증명하는 <strong>집계(aggregation)</strong>로 크기 절약 가능
        </p>
        {_onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => _onCodeRef('range-proof-struct', codeRefs['range-proof-struct'])} />
            <span className="text-[10px] text-muted-foreground self-center">mod.rs</span>
            <CodeViewButton onClick={() => _onCodeRef('dealer', codeRefs['dealer'])} />
            <span className="text-[10px] text-muted-foreground self-center">dealer.rs</span>
          </div>
        )}

        <h3>RangeProof 구조체</h3>
        <CodePanel
          title="RangeProof 구조체 (Rust)"
          code={STRUCT_CODE}
          annotations={[
            { lines: [4, 5], color: 'sky', note: '비트 커밋 (A, S)' },
            { lines: [8, 10], color: 'emerald', note: '다항식 계수 커밋 (T1, T2)' },
            { lines: [16, 16], color: 'violet', note: 'IPP 증명 (O(log n))' },
            { lines: [19, 20], color: 'amber', note: '증명 크기 계산' },
          ]}
        />

        <h3>prove_multiple 흐름 (MPC Dealer-Party 패턴)</h3>
        <CodePanel
          title="prove_multiple_with_rng 구현"
          code={PROVE_CODE}
          annotations={[
            { lines: [7, 8], color: 'sky', note: '딜러 초기화' },
            { lines: [10, 17], color: 'emerald', note: '비트 커밋 생성' },
            { lines: [19, 21], color: 'amber', note: '도전값 y, z 생성' },
            { lines: [33, 35], color: 'violet', note: 'IPP로 집계 증명' },
          ]}
        />

        <h3>집계 절약 효과</h3>
        <CodePanel
          title="집계 크기 비교 (n=64 비트)"
          code={AGG_CODE}
          annotations={[
            { lines: [5, 10], color: 'emerald', note: 'm 증가에 따른 크기 변화' },
            { lines: [11, 11], color: 'sky', note: 'm=16: 94% 절약' },
          ]}
        />
      </div>
    </section>
  );
}
