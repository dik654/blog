import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import BlsVerifyViz from './viz/BlsVerifyViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BlsVerify({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="bls-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          페어링 비교는 BLS 검증의 핵심이다.
          <br />
          <code>e(agg_pk, H(m)) == e(G, sig)</code> — 이 등식이 성립하면 서명이 유효하다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> 동일한 BLS 검증 로직을 사용한다.
          <br />
          Helios는 이것만으로 블록 유효성을 판단. Reth는 추가로 블록 실행도 수행.
        </p>
      </div>
      <div className="not-prose">
        <BlsVerifyViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-verify-bls', codeRefs['hl-verify-bls'])} />
          <span className="text-[10px] text-muted-foreground">verify.rs</span>
        </div>
      </div>
    </section>
  );
}
