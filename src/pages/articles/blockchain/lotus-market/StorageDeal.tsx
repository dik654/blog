import DealDetailViz from './viz/DealDetailViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StorageDeal({ onCodeRef }: Props) {
  return (
    <section id="storage-deal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스토리지 딜 — HandleDealProposal() 내부</h2>
      <p className="text-sm text-muted-foreground mb-4">
        제안 검증 → 데이터 수신 → 봉인 → 온체인 PublishStorageDeals<br />
        콜래터럴이 데이터 보관의 경제적 인센티브
      </p>
      <div className="not-prose mb-8">
        <DealDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
