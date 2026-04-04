import GossipBFTDetailViz from './viz/GossipBFTDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function GossipBFT({ onCodeRef }: Props) {
  return (
    <section id="gossipbft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GossiPBFT 프로토콜</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        5단계(QUALITY → CONVERGE → PREPARE → COMMIT → DECIDE) 순차 실행<br />
        각 단계에서 2/3+ 스토리지 파워 쿼럼을 확인
      </p>
      <div className="not-prose mb-8">
        <GossipBFTDetailViz onOpenCode={onCodeRef} />
      </div>
    </section>
  );
}
