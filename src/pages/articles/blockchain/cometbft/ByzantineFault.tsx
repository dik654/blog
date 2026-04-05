import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import ByzantineDetectViz from './viz/ByzantineDetectViz';
import {EVIDENCE_CODE, BFT_THRESHOLD_CODE, BFT_THRESHOLD_ANNOTATIONS} from './ByzantineFaultData';
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
          <pre className="text-xs overflow-x-auto"><code>{`type DuplicateVoteEvidence struct {
    VoteA *Vote  // 첫 번째 투표
    VoteB *Vote  // 충돌하는 두 번째 투표
    TotalVotingPower int64
    ValidatorPower   int64
    Timestamp        time.Time
}`}</code></pre>
          <p className="mt-2 text-xs text-foreground/70">같은 Height/Round에서 다른 BlockID에 투표한 증거 — 두 투표 모두 유효한 서명 필수</p>
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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Evidence → Slashing 실행 흐름 (Cosmos SDK)

// 1. Evidence 탐지 (CometBFT)
// P2P로 받은 두 vote 비교
// DuplicateVoteEvidence 생성

// 2. EvidencePool 저장
// EvidencePool.AddEvidence(ev)
// - max_age 체크 (UnbondingPeriod 이내)
// - 중복 체크
// - 서명 검증

// 3. Gossip
// Evidence reactor가 peers에게 방송
// 다른 노드도 동일 evidence 수집

// 4. Block 포함 (다음 proposer)
// PrepareProposal에서 pending evidence 추가
// Block.Evidence = [...evidences]

// 5. FinalizeBlock → ABCI app에 전달
// app.FinalizeBlock(RequestFinalizeBlock{
//     Misbehavior: []abci.Misbehavior{ev1, ev2, ...}
// })

// 6. Cosmos SDK slashing module (app 측)
func (k Keeper) HandleDoubleSign(
    ctx sdk.Context,
    ev abci.Misbehavior,
) {
    consAddr := sdk.ConsAddress(ev.Validator.Address)
    validator := k.stakingKeeper.ValidatorByConsAddr(ctx, consAddr)

    // slash 실행
    k.stakingKeeper.Slash(
        ctx,
        consAddr,
        ev.Height,
        ev.Validator.Power,
        k.SlashFractionDoubleSign(ctx),  // 5% by default
    )

    // tombstone (영구 제외)
    k.Tombstone(ctx, consAddr)

    // jail (다시 bond 해도 참여 불가)
    k.stakingKeeper.Jail(ctx, consAddr)

    // delegator stake도 함께 slash
    // (제안: bond 당시 stake 비율에 따라)
}

// Slashing 파라미터 (Cosmos Hub):
// - SlashFractionDoubleSign: 5% (0.05)
// - SlashFractionDowntime: 0.01% (0.0001)
// - SignedBlocksWindow: 10,000 blocks
// - MinSignedPerWindow: 50%
// - DowntimeJailDuration: 10 minutes

// 효과:
// - stake 5% 손실 (validator + delegators 모두)
// - validator tombstone (재참여 불가)
// - 수십억원 경제적 손실 (대형 validator의 경우)`}
        </pre>
        <p className="leading-7">
          Evidence lifecycle: <strong>탐지 → pool → block 포함 → ABCI → slashing</strong>.<br />
          Cosmos SDK slashing module이 5% stake 차감 + tombstone.<br />
          delegator도 함께 slash → validator 선택 책임.
        </p>
      </div>
    </section>
  );
}
