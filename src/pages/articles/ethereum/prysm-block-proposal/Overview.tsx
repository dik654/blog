import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ContextViz from "./viz/ContextViz";
import BlockProposalFlowViz from "./viz/BlockProposalFlowViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Block proposal은 duty부터 payload 조립과 서명까지 이어진다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 글은 먼저 한 슬롯의 질문부터 시작합니다. <strong>누가 어떤
          parent 위에 무엇을 조립하고, 어느 시점에 서명해야 하는가?</strong>
          제안자 duty 확인, fork-choice head, execution payload, consensus
          operation, post-state root를 하나의 제안 receipt로 연결한 뒤 Prysm
          코드로 내려갑니다.
        </p>
        <p className="leading-7">
          블록을 만드는 경로와 받은 블록을 검증하는 경로는 다릅니다. 이 글은
          전자를 소유하며, 후자는 <Link to="/blockchain/prysm-block-processing">블록 처리</Link>,
          head 선택은 <Link to="/blockchain/prysm-forkchoice">fork choice</Link>,
          서명 domain은 <Link to="/blockchain/prysm-bls">BLS</Link> 정본을
          재사용합니다.
        </p>

        {/* ── Block proposal 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Block Proposal — 7단계 흐름
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              1. Proposer 선정
            </div>
            <p className="text-sm">
              RANDAO 기반 결정적 선정 — validator는 자기 차례를 미리 알 수 있음.
              epoch 시작 시 계산.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              2. Duty Notification
            </div>
            <p className="text-sm">
              validator client가 beacon node API에서 duty를 받아{" "}
              <code>slot N</code>의 제안 역할을 예약한다. 전송 방식은 구현
              버전에 따라 달라질 수 있다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              3. Block 준비
            </div>
            <p className="text-sm">
              parent block 선택 (LMD-GHOST head), RANDAO reveal 생성, eth1 data
              조회, operations 수집.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              4. Block Body 조립
            </div>
            <p className="text-sm">
              attestations, slashings, deposits/requests, exits,{" "}
              <code>SyncAggregate</code>, execution payload, blob commitments 등
              현재 fork의 BeaconBlockBody 스키마와 operation limit에 맞춰
              구성한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              5. State Transition 시뮬레이션
            </div>
            <p className="text-sm">
              임시 state 계산 → <code>state_root</code> 결정.{" "}
              <code>block.StateRoot = computed_root</code>.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              6. BLS 서명
            </div>
            <p className="text-sm">
              proposer의 개인키로 block 서명 → <code>SignedBeaconBlock</code>{" "}
              생성.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              7. 전파
            </div>
            <p className="text-sm">
              <code>beacon_block</code> topic에 publish → peers에게 gossip 전파.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">
              Slot 타이밍
            </div>
            <ul className="text-sm space-y-1">
              <li>
                <strong>slot 시작 직후</strong> — head 선택, local/builder
                payload 결정, 블록 조립
              </li>
              <li>
                <strong>준비 즉시</strong> — post-state root 계산, 제안자 서명,
                block gossip
              </li>
              <li>
                <strong>attestation interval 전</strong> — 가능한 많은 검증자가
                블록을 관찰하도록 전파
              </li>
              <li>
                <strong>이후 구간</strong> — attestation과 aggregation이 설정된
                interval에 진행
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="text-xs font-semibold text-red-400 mb-2">
              실패 시나리오
            </div>
            <ul className="text-sm space-y-1">
              <li>
                제안 블록이 제때 전파되지 않음 →{" "}
                <strong>slot skip 또는 낮은 채택률</strong>
              </li>
              <li>
                네트워크 장애 → 다른 노드 못 받음 → <strong>orphaned</strong>
              </li>
              <li>
                제안자는 직접 slashing되는 것이 아니라{" "}
                <strong>proposal reward 기회를 놓침</strong>
              </li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Block proposal은 duty 확인, parent·payload 선택, consensus operation
          수집, state root 계산, 서명과 전파로 이어진다. 가능한 한 slot 초반에
          완료해야 하지만,
          구체 시간은 네트워크 slot 설정과 제안 경로(local execution 또는
          builder)에 따라 해석한다.
        </p>
      </div>
      <ContentBoundary article="prysm-block-proposal" />
      <div className="not-prose mt-6">
        <BlockProposalFlowViz />
      </div>
      <div id="paper-consensus-proposer-spec" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Consensus Specifications v1.6.1 — proposer duties"
          citeKey={1}
          href="https://github.com/ethereum/consensus-specs/blob/v1.6.1/specs/phase0/validator.md#block-proposal"
        >
          제안자 선택, parent 선택, RANDAO와 서명에 관한 protocol 사실의
          기준입니다. 수치와 함수는 v1.6.1 tag 및 활성 fork·network preset에
          한정되며, Prysm의 cache나 builder timeout을 규정하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-proposal-source" className="scroll-mt-24">
        <CitationBlock
          source="OffchainLabs/prysm — pinned proposal implementation"
          citeKey={2}
          type="code"
          href="https://github.com/OffchainLabs/prysm/tree/ea3fbe48b48170e7f7252fbc15e9591d462a0f87"
        >
          Prysm의 RPC·validator client·pool 조립 경계를 확인한 source
          snapshot입니다. 운영상 deadline·receipt·paired release gate는 이
          글의 hardening 제안이며 protocol이 자동으로 보장하는 성질이 아닙니다.
        </CitationBlock>
      </div>
    </section>
  );
}
