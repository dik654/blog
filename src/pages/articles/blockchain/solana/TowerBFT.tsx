import TowerBFTViz from './viz/TowerBFTViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function TowerBFT({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="tower-bft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tower BFT 합의</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Tower BFT — PBFT 변형, PoH를 시계로 활용<br />
          핵심: 지수적 락아웃 — 투표할수록 포크 전환 비용 2배 증가
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sol-tower-vote', codeRefs['sol-tower-vote'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              vote_state.rs — process_vote
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <TowerBFTViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
