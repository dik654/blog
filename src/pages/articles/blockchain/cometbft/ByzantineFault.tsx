import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import ByzantineDetectViz from './viz/ByzantineDetectViz';
import {BFT_THRESHOLD_CODE, BFT_THRESHOLD_ANNOTATIONS} from './ByzantineFaultData';
import type { CodeRef } from '@/components/code/types';

export default function ByzantineFault({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="byzantine-fault" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비잔틴 장애 처리</h2>
      <div className="not-prose mb-8"><ByzantineDetectViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT — <strong>f &lt; N/3</strong> 조건에서 안전성 보장<br />
          이중 서명(Double Voting), 에퀴보케이션(같은 라운드 다른 블록 투표) 등 비잔틴 행위 탐지<br />
          탐지 시 <strong>DuplicateVoteEvidence</strong> 생성 → EvidencePool 저장 → 다음 블록에 포함하여 슬래싱 실행
        </p>
        <CitationBlock source="cometbft/evidence/pool.go" citeKey={6} type="code" href="https://github.com/cometbft/cometbft/blob/main/evidence/pool.go">
          <div className="text-xs text-foreground/70 space-y-1">
            <p><code>DuplicateVoteEvidence</code> — 같은 Height/Round에서 다른 BlockID에 투표한 증거</p>
            <p><code>VoteA *Vote</code> / <code>VoteB *Vote</code> — 충돌하는 두 투표 (유효한 서명 필수) / <code>TotalVotingPower</code> — 전체 투표력 / <code>ValidatorPower</code> — 해당 validator 투표력 / <code>Timestamp</code> — 증거 시간</p>
          </div>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">비잔틴 탐지 → 슬래싱 흐름</h3>
        <p>
          비잔틴 장애 탐지 → 슬래싱 흐름<br />
          1. 이중 서명 탐지 (Double Voting)<br />
          같은 Height/Round에서 다른 블록에 투표<br />
          → ErrVoteConflictingVotes 발생<br />
          → DuplicateVoteEvidence 생성<br />
          2. 증거 수집 & 검증<br />
          EvidencePool에 증거 저장<br />
          MaxAge 이내의 증거만 유효<br />
          투표 서명 + 밸리데이터 주소 검증<br />
          3. 블록에 포함 & 슬래싱<br />
          제안자가 블록 Evidence 필드에 포함<br />
          FinalizeBlock → Misbehavior[] 전달
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">BFT 안전성 임계값</h3>
        <CodePanel title="2/3+ 투표 파워 & Safety vs Liveness" code={BFT_THRESHOLD_CODE} annotations={BFT_THRESHOLD_ANNOTATIONS} />

        {/* ── Slashing 실행 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slashing Execution — Evidence to Stake Loss</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">Evidence → Slashing 실행 흐름</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">1. 탐지</strong> — P2P로 받은 두 vote 비교 → <code>DuplicateVoteEvidence</code> 생성</p>
              <p><strong className="text-foreground">2. EvidencePool 저장</strong> — <code>AddEvidence(ev)</code>: max_age 체크 (UnbondingPeriod 이내) + 중복 체크 + 서명 검증</p>
              <p><strong className="text-foreground">3. Gossip</strong> — Evidence reactor가 peers에게 방송, 다른 노드도 동일 evidence 수집</p>
              <p><strong className="text-foreground">4. Block 포함</strong> — <code>PrepareProposal</code>에서 pending evidence 추가 → <code>Block.Evidence</code></p>
              <p><strong className="text-foreground">5. ABCI 전달</strong> — <code>FinalizeBlock</code> → <code>Misbehavior[]</code>로 app에 전달</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2"><code>HandleDoubleSign</code> — Cosmos SDK slashing</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><code>Slash(consAddr, height, power, fraction)</code> — stake 차감 (default 5%)</p>
                <p><code>Tombstone(consAddr)</code> — 영구 제외</p>
                <p><code>Jail(consAddr)</code> — 다시 bond 해도 참여 불가</p>
                <p>delegator stake도 함께 slash (bond 당시 비율에 따라)</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">Slashing 파라미터 (Cosmos Hub)</p>
              <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <code className="text-xs">SlashFractionDoubleSign</code><span>5% (0.05)</span>
                <code className="text-xs">SlashFractionDowntime</code><span>0.01% (0.0001)</span>
                <code className="text-xs">SignedBlocksWindow</code><span>10,000 blocks</span>
                <code className="text-xs">MinSignedPerWindow</code><span>50%</span>
                <code className="text-xs">DowntimeJailDuration</code><span>10 minutes</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">stake 5% 손실 + tombstone → 대형 validator는 수십억원 손실</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Evidence lifecycle: <strong>탐지 → pool → block 포함 → ABCI → slashing</strong>.<br />
          Cosmos SDK slashing module이 5% stake 차감 + tombstone.<br />
          delegator도 함께 slash → validator 선택 책임.
        </p>
      </div>
    </section>
  );
}
