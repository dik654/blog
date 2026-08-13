import CodePanel from "@/components/ui/code-panel";
import { CitationBlock } from "../../../../components/ui/citation";
import ByzantineDetectViz from "./viz/ByzantineDetectViz";
import {
  BFT_THRESHOLD_CODE,
  BFT_THRESHOLD_ANNOTATIONS,
} from "./ByzantineFaultData";
import type { CodeRef } from "@/components/code/types";

export default function ByzantineFault({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="byzantine-fault" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">비잔틴 장애 처리: 합의를 막는 vote와 처벌할 evidence를 구분한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 safety threshold는 validator 수가 아니라 voting power를 기준으로 합니다. Byzantine voting power가 3분의 1 미만이면 서로 충돌하는 두 block이 모두 3분의 2를 넘는 commit을 얻을 수 없습니다. 다만 node가 잘못된 vote를 무시하는 일과 validator stake를 실제로 처벌하는 일은 서로 다른 경로입니다.
        </p>
        <p>
          같은 height와 round에서 서로 다른 block에 서명하면 <code>DuplicateVoteEvidence</code>를 만들 수 있습니다. CometBFT는 서명과 유효 기간을 검증해 evidence pool에 보관하고 block에 포함하지만, slash fraction과 jail·tombstone 정책은 ABCI로 evidence를 받은 application이 결정합니다. 아래 흐름에서 consensus-level detection과 application-level punishment의 경계를 먼저 확인합니다.
        </p>
        <CitationBlock
          source="cometbft/evidence/pool.go"
          citeKey={6}
          type="code"
          href="https://github.com/cometbft/cometbft/blob/main/evidence/pool.go"
        >
          <div className="text-xs text-foreground/70 space-y-1">
            <p>
              <code>DuplicateVoteEvidence</code> — 같은 Height/Round에서 다른
              BlockID에 투표한 증거
            </p>
            <p>
              <code>VoteA *Vote</code> / <code>VoteB *Vote</code> — 충돌하는 두
              투표 (유효한 서명 필수) / <code>TotalVotingPower</code> — 전체
              투표력 / <code>ValidatorPower</code> — 해당 validator 투표력 /{" "}
              <code>Timestamp</code> — 증거 시간
            </p>
          </div>
        </CitationBlock>
      </div>
      <div className="not-prose my-8">
        <ByzantineDetectViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">
          비잔틴 탐지 → 슬래싱 흐름
        </h3>
        <ol>
          <li><strong>충돌 탐지:</strong> 같은 height·round·vote type인데 block ID가 다른 두 signed vote를 확인하면 conflicting-vote error와 <code>DuplicateVoteEvidence</code>를 만듭니다.</li>
          <li><strong>Evidence 검증:</strong> evidence pool은 두 signature, validator address와 voting power를 확인하고 consensus parameter가 허용한 max age 안에 있는지 검사합니다.</li>
          <li><strong>합의에 포함:</strong> proposer가 검증된 evidence를 block에 넣으면 모든 node가 같은 evidence를 실행 결과에 반영합니다.</li>
          <li><strong>Application 처벌:</strong> <code>FinalizeBlock</code>의 <code>Misbehavior[]</code>를 받은 application이 stake 감소, jail과 tombstone 같은 정책을 적용합니다.</li>
        </ol>
        <h3 className="text-xl font-semibold mt-6 mb-3">BFT 안전성 임계값</h3>
        <CodePanel
          title="2/3+ 투표 파워 & Safety vs Liveness"
          code={BFT_THRESHOLD_CODE}
          annotations={BFT_THRESHOLD_ANNOTATIONS}
        />

        {/* ── Slashing 실행 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Slashing Execution — Evidence to Stake Loss
        </h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">
              Evidence → Slashing 실행 흐름
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">1. 탐지</strong> — P2P로
                받은 두 vote 비교 → <code>DuplicateVoteEvidence</code> 생성
              </p>
              <p>
                <strong className="text-foreground">
                  2. EvidencePool 저장
                </strong>{" "}
                — <code>AddEvidence(ev)</code>: max_age 체크 (UnbondingPeriod
                이내) + 중복 체크 + 서명 검증
              </p>
              <p>
                <strong className="text-foreground">3. Gossip</strong> —
                Evidence reactor가 peers에게 방송, 다른 노드도 동일 evidence
                수집
              </p>
              <p>
                <strong className="text-foreground">4. Block 포함</strong> —{" "}
                <code>PrepareProposal</code>에서 pending evidence 추가 →{" "}
                <code>Block.Evidence</code>
              </p>
              <p>
                <strong className="text-foreground">5. ABCI 전달</strong> —{" "}
                <code>FinalizeBlock</code> → <code>Misbehavior[]</code>로 app에
                전달
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                <code>HandleDoubleSign</code> — Cosmos SDK slashing
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <code>Slash(consAddr, height, power, fraction)</code> — stake
                  차감 비율은 application parameter
                </p>
                <p>
                  <code>Tombstone(consAddr)</code> — 영구 제외
                </p>
                <p>
                  <code>Jail(consAddr)</code> — 다시 bond 해도 참여 불가
                </p>
                <p>delegator stake도 함께 slash (bond 당시 비율에 따라)</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                배포 체인에서 확인할 파라미터
              </p>
              <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <code className="text-xs">SlashFractionDoubleSign</code>
                <span>double-sign penalty</span>
                <code className="text-xs">SlashFractionDowntime</code>
                <span>downtime penalty</span>
                <code className="text-xs">SignedBlocksWindow</code>
                <span>uptime 평가 window</span>
                <code className="text-xs">MinSignedPerWindow</code>
                <span>최소 참여 기준</span>
                <code className="text-xs">DowntimeJailDuration</code>
                <span>jail duration</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                값은 on-chain governance와 application version에 따라 바뀌므로
                현재 chain state를 조회해야 합니다.
              </p>
            </div>
          </div>
        </div>
        <p>
          전체 lifecycle은 <strong>탐지 → pool 검증 → block 포함 → ABCI 전달 → application 처벌</strong> 순서입니다. CometBFT가 evidence의 합의 가능성을 보장하고 Cosmos SDK 같은 application이 경제적 penalty를 적용하므로, 운영자는 consensus parameter와 slashing module parameter를 각각 따로 확인해야 합니다. Delegator stake가 함께 줄어드는지와 정확한 비율 역시 해당 chain의 현재 규칙에 달려 있습니다.
        </p>
      </div>
    </section>
  );
}
