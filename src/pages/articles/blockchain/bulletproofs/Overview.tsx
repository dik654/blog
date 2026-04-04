import CodePanel from '@/components/ui/code-panel';
import PedersenCommitViz from '../components/PedersenCommitViz';
import BulletproofsArchViz from './viz/BulletproofsArchViz';
import { CRATE_CODE, GENERATORS_CODE } from './OverviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 핵심 구조'}</h2>
      <div className="not-prose mb-8">
        <PedersenCommitViz />
      </div>
      <div className="not-prose mb-8">
        <BulletproofsArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Bulletproofs</strong>(Bünz et al., 2017) — 투명 셋업(trusted setup 불필요) 영지식 증명 시스템<br />
          핵심 — <strong>내적 인수 증명(Inner Product Argument, IPA)</strong><br />
          범위 증명(Range Proof) 크기를 O(n) → O(log n)으로 축소
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('pedersen-gens', codeRefs['pedersen-gens'])} />
            <span className="text-[10px] text-muted-foreground self-center">generators.rs</span>
            <CodeViewButton onClick={() => onCodeRef('generators-chain', codeRefs['generators-chain'])} />
            <span className="text-[10px] text-muted-foreground self-center">GeneratorsChain</span>
          </div>
        )}

        <h3>크레이트 구조 (github.com/dalek-cryptography/bulletproofs)</h3>
        <CodePanel
          title="bulletproofs/src/ 디렉토리 구조"
          code={CRATE_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: '핵심 모듈 (기저점, IPA)' },
            { lines: [4, 8], color: 'emerald', note: '범위 증명 MPC 구조' },
            { lines: [12, 13], color: 'amber', note: 'Ristretto255 곡선 사용' },
          ]}
        />

        <h3>PedersenGens & BulletproofGens (generators.rs)</h3>
        <CodePanel
          title="generators.rs 구현"
          code={GENERATORS_CODE}
          annotations={[
            { lines: [3, 7], color: 'sky', note: 'Pedersen 커밋 구조체' },
            { lines: [9, 13], color: 'emerald', note: '멀티스칼라 곱셈으로 커밋' },
            { lines: [17, 22], color: 'amber', note: 'Bulletproof 기저점 쌍' },
            { lines: [25, 32], color: 'violet', note: 'SHAKE256으로 결정론적 생성' },
          ]}
        />
      </div>
    </section>
  );
}
