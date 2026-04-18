import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function FinalizationPruning({ onCodeRef }: Props) {
  return (
    <section id="finalization-pruning" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Finalization & Prune</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('prune-finalized', codeRefs['prune-finalized'])} />
          <span className="text-[10px] text-muted-foreground self-center">Prune()</span>
        </div>

        {/* ── Prune 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fork Choice Tree Pruning — finalized 기반</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Prune 처리 흐름</div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>s.nodes[finalized]</code>로 finalized 노드 조회</li>
              <li><code>finalNode.Parent = nil</code> — 새 tree root 지정</li>
              <li>전체 <code>s.nodes</code> 순회 → <code>isDescendantOf(node, finalNode)</code> 아닌 노드 수집</li>
              <li>non-canonical branches 일괄 <code>delete(s.nodes, root)</code></li>
              <li><code>s.root = finalNode</code> — root 업데이트</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">isDescendantOf — 후손 확인</div>
            <p className="text-sm"><code>node</code>에서 <code>cur.Parent</code> 방향으로 순회 → <code>ancestor</code>와 일치하면 true. 포인터 기반이므로 O(depth).</p>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">Pruning 효과 & 빈도</div>
            <ul className="text-sm space-y-1">
              <li>fork choice tree 크기 유지 — finalized 이전 forks 완전 제거</li>
              <li>매 epoch 경계 (~6.4분)에 잠재적 finalization</li>
              <li>정상 운영 시 매 epoch ~64 nodes pruned — tree는 항상 "현재 + 미래" 영역만 유지</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          <strong>Prune</strong>이 finalized 이전 non-canonical 브랜치 제거.<br />
          finalized의 parent를 nil 설정 → 새 tree root 지정.<br />
          매 epoch ~64 nodes 정리 → tree 크기 안정.
        </p>

        {/* ── Finality의 불가역성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Finality의 경제적 불가역성</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Casper FFG 안전성 속성</div>
            <p className="text-sm">2개 conflicting finalized checkpoints 존재 시 → 전체 stake의 &ge; 1/3이 slashing 당함.</p>
            <p className="text-sm mt-1 text-muted-foreground">증명: 각각 &gt;2/3가 서명 → 합집합 &gt;4/3 → 중복 &gt;1/3이 양쪽 모두 서명 → slashable.</p>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="text-xs font-semibold text-red-400 mb-2">되돌리기 비용 (2025 기준)</div>
            <div className="text-sm grid grid-cols-2 gap-2">
              <div>Active validators: <strong>~1M</strong></div>
              <div>Active balance: <strong>~32M ETH</strong></div>
              <div>1/3 slashing 필요: <strong>~10.6M ETH</strong></div>
              <div>ETH @$3000 기준: <strong>~$32B 손실</strong></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">PoW 51% 공격</div>
              <p className="text-sm">hashrate 조달 (CAPEX + OPEX) → 수백 M$</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">PoS Casper 공격</div>
              <p className="text-sm">stake + slashing → <strong>$32B+</strong></p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">유일한 예외 & 결론</div>
            <p className="text-sm">예외: social consensus hard fork (2016 DAO fork) 같은 수동 개입 — 매우 드문 긴급 상황.</p>
            <p className="text-sm mt-1">finalized block은 신뢰 가능 → exchange/bridge의 출금 확정 기준점.</p>
          </div>
        </div>
        <p className="leading-7">
          <strong>Finality 되돌리기 = 1/3 슬래싱</strong> ~$32B 손실.<br />
          경제적으로 사실상 불가능 → finalized 사실상 immutable.<br />
          exchange/bridge의 출금 확정 기준점.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 트리 프루닝</strong> — finalized 체크포인트가 갱신되면 그 아래 모든 포크 노드 삭제.<br />
          finalized 노드의 parent를 nil로 설정 → 새로운 트리 루트.<br />
          뒤집으려면 전체 스테이킹의 1/3 이상을 슬래싱해야 하므로 사실상 불가능.
        </p>
      </div>
    </section>
  );
}
