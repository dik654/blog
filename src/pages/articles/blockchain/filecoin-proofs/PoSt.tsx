import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function PoSt({ title, onCodeRef }: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'PoSt — 시공간 저장 증명'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>PoSt</strong>(Proof of Spacetime) — 봉인된 섹터의 지속 저장 증명
          <br />
          <strong>WindowPoSt</strong>(24시간 주기, 모든 섹터) vs
          <strong> WinningPoSt</strong>(블록 생성 시, 당첨 섹터)
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('window-post', codeRefs['window-post'])} />
            <span className="text-[10px] text-muted-foreground self-center">window_post.rs</span>
            <CodeViewButton onClick={() => onCodeRef('fallback-vanilla', codeRefs['fallback-vanilla'])} />
            <span className="text-[10px] text-muted-foreground self-center">vanilla.rs</span>
          </div>
        )}
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} Poseidon 선택 이유</strong> — BLS12-381 스칼라체 위 연산
          <br />
          Groth16 회로 내 SHA256 대비 10배 이상 게이트 절약
        </p>
      </div>
    </section>
  );
}
