import ContextViz from './viz/ContextViz';
import BlockProposalFlowViz from './viz/BlockProposalFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 제안 파이프라인</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 제안자 선정부터 블록 조립, 서명, 전파까지의 전체 파이프라인을 코드 수준으로 추적한다.
        </p>

        {/* ── Block proposal 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Block Proposal — 7단계 흐름</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">1. Proposer 선정</div>
            <p className="text-sm">RANDAO 기반 결정적 선정 — validator는 자기 차례를 미리 알 수 있음. epoch 시작 시 계산.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">2. Duty Notification</div>
            <p className="text-sm">beacon-chain → validator (gRPC). <code>slot N</code>에 블록 제안 필요 알림.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">3. Block 준비</div>
            <p className="text-sm">parent block 선택 (LMD-GHOST head), RANDAO reveal 생성, eth1 data 조회, operations 수집.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">4. Block Body 조립</div>
            <p className="text-sm"><code>Attestations</code> (max 128), slashings, deposits, voluntary_exits, <code>SyncAggregate</code> (Altair+), <code>ExecutionPayload</code> (Bellatrix+), <code>BlobKzgCommitments</code> (Deneb+).</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">5. State Transition 시뮬레이션</div>
            <p className="text-sm">임시 state 계산 → <code>state_root</code> 결정. <code>block.StateRoot = computed_root</code>.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">6. BLS 서명</div>
            <p className="text-sm">proposer의 개인키로 block 서명 → <code>SignedBeaconBlock</code> 생성.</p>
          </div>
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-muted-foreground mb-2">7. 전파</div>
            <p className="text-sm"><code>beacon_block</code> topic에 publish → peers에게 gossip 전파.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">Slot 타이밍 (12초)</div>
            <ul className="text-sm space-y-1">
              <li><strong>t=0~4s</strong> — block 조립 + 서명</li>
              <li><strong>t=4s</strong> — 블록 방송</li>
              <li><strong>t=4~8s</strong> — 네트워크 전파</li>
              <li><strong>t=8s</strong> — attestation 생성</li>
              <li><strong>t=12s</strong> — slot 종료</li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="text-xs font-semibold text-red-400 mb-2">실패 시나리오</div>
            <ul className="text-sm space-y-1">
              <li>4s 내 블록 생성 못 함 → <strong>slot skip</strong></li>
              <li>네트워크 장애 → 다른 노드 못 받음 → <strong>orphaned</strong></li>
              <li>validator penalty: <strong>missed proposal</strong></li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Block proposal은 <strong>7단계 파이프라인</strong>.<br />
          4초 내 조립+서명+전파 완료 필수.<br />
          실패 시 slot skip + validator 보상 손실.
        </p>
      </div>
      <div className="not-prose mt-6"><BlockProposalFlowViz /></div>
    </section>
  );
}
