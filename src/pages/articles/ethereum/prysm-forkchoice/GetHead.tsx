import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function GetHead({ onCodeRef }: Props) {
  return (
    <section id="get-head" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GetHead & 가중치 전파</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fc-head', codeRefs['fc-head'])} />
          <span className="text-[10px] text-muted-foreground self-center">computeHead()</span>
        </div>

        {/* ── GetHead 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">GetHead — tie-breaking + proposer boost</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">GetHead 알고리즘</div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>justified_checkpoint.Root</code>에서 시작 → <code>justifiedNode</code> 조회</li>
              <li><code>head.Children</code> 순회하며 최대 <code>Weight</code> 자식 선택</li>
              <li>동률 시 <code>bytes.Compare(child.Root, bestChild.Root)</code> → 사전순 작은 root 승리</li>
              <li>리프 도달 시 <code>head.Root</code> 반환</li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">시간 복잡도</div>
              <p className="text-sm"><strong>O(depth)</strong> with BestDescendant caching. 메인넷 depth ~15 → 수 us.</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">호출 시점</div>
              <ul className="text-sm space-y-1">
                <li>매 slot 시작 (attestation 대상 결정)</li>
                <li>RPC head 쿼리</li>
                <li>Engine API <code>forkchoiceUpdated</code></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          GetHead는 <strong>justified checkpoint에서 greedy descent</strong>.<br />
          최대 가중치 자식 선택 반복 → 리프에 도달하면 head.<br />
          동률 시 block_root 바이트 비교 → 결정론적 tie-break.
        </p>

        {/* ── Proposer Boost ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Proposer Boost — ex-ante reorg 방어</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="text-xs font-semibold text-red-400 mb-2">공격 시나리오 (without boost)</div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>slot N proposer가 블록 생성 (시간 내)</li>
              <li>공격자 (다음 proposer)가 다른 fork 생성</li>
              <li>자기 validator들에게 attestation 투표 유도</li>
              <li>공격자 fork가 더 무거워지면 reorg 성공</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">방어 메커니즘</div>
            <p className="text-sm">슬롯 시작 4초 내 수신 블록에 boost 부여. <code>applyProposerBoost(root, slot)</code> → <code>isInFirstHalfOfSlot()</code> 확인 후 <code>proposer_boost_root</code> 설정. <code>GetHead()</code> 시 해당 노드에 <code>computeBoostWeight()</code> = committee_weight * 40% 추가.</p>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">메인넷 수치</div>
            <div className="text-sm grid grid-cols-2 gap-2">
              <div>Epoch 당 ~1,000 committee validators</div>
              <div>committee_weight = <strong>32,000 ETH</strong></div>
              <div>boost = 32,000 * 0.4 = <strong>12,800 ETH</strong></div>
              <div>reorg 시 &gt; 12,800 ETH 추가 필요 → 경제적 불가</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Proposer Boost</strong>가 ex-ante reorg 공격 방어.<br />
          슬롯 첫 4초 내 수신 블록에 committee weight 40% 부여.<br />
          공격자가 reorg하려면 상당한 추가 stake 필요 → 경제적 방어.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Proposer Boost</strong> — 현재 슬롯 제안자의 블록에 위원회 가중치의 40%를 추가 부여.<br />
          ex-ante reorg 공격을 방어하기 위한 메커니즘.<br />
          동일 가중치 시 블록 루트 바이트 사전순 비교로 결정론적 결과 보장.
        </p>
      </div>
    </section>
  );
}
