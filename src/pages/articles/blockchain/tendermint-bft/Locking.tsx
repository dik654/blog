import LockingViz from './viz/LockingViz';
import { CitationBlock } from '@/components/ui/citation';

export default function Locking() {
  return (
    <section id="locking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Polka 잠금 메커니즘</h2>
      <div className="not-prose mb-8"><LockingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Buchman — Tendermint 논문 §2.3" citeKey={2} type="paper">
          <p className="italic">
            "Once a validator sees a polka for block B, it locks on B and will only precommit B in future rounds until it sees a polka for a different block at a higher round."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">잠금 규칙</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">잠금 획득</p>
            <p className="text-sm">
              +2/3 Prevote(B) 수신(Polka) 시 블록 B에 잠금.<br />
              lockedRound = 현재 라운드, lockedValue = B
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">잠금 해제</p>
            <p className="text-sm">
              더 높은 라운드에서 다른 블록 B'에 대한 Polka 관찰 시.<br />
              lockedRound과 validRound 비교로 안전하게 전환
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Safety 보장</p>
            <p className="text-sm">
              잠긴 노드는 해당 블록만 Precommit 가능.<br />
              2/3 이상이 같은 블록에 잠기면 분기 불가능
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Liveness 보장</p>
            <p className="text-sm">
              잠금 해제가 가능하므로 교착 상태 없음.<br />
              GST 이후 정직 제안자가 잠긴 블록 재제안
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
