import DiemBFTViz from './viz/DiemBFTViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function DiemBFT({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="diembft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DiemBFT v4 합의</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DiemBFT v4 — HotStuff 변형, 3-chain commit rule + 리더 평판 시스템<br />
          Round k 블록은 k+2에서 커밋. 장애 리더는 평판 점수에 따라 자동 교체
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('apt-diembft-pipeline', codeRefs['apt-diembft-pipeline'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              round_manager.rs
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('apt-leader-reputation', codeRefs['apt-leader-reputation'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              leader_reputation.rs
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <DiemBFTViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
