import CreateBlockViz from './viz/CreateBlockViz';
import SealingPipelineViz from './viz/SealingPipelineViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function BlockCreation({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="block-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 생성 파이프라인</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p className="leading-7">
          VRF Sortition 당선 후 <strong>CreateBlock()으로 블록 조립</strong>.<br />
          Lookback 상태 → 워커 주소 조회 → BLS/Secpk 분류 → 서명 → FullBlock.<br />
          미세한 timing(~40s within epoch)으로 WinningPoSt 생성 필요.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">CreateBlock() 코드 추적</h3>
      <CreateBlockViz onOpenCode={openCode} />

      <h3 className="text-lg font-semibold mt-8 mb-3">Sealing 파이프라인 상세</h3>
      <SealingPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Mining Loop ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Mining Loop 전체 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Lotus miner mining loop (miner/miner.go):

func (m *Miner) mine(ctx context.Context) {
    for {
        // 1. 다음 epoch 대기
        base := m.GetBestMiningCandidate()
        now := time.Now()
        targetEpoch := base.TipSet.Height() + 1
        // wait until epoch end - safety margin

        // 2. Draw ticket
        ticket, err := m.computeTicket(ctx, base)
        // VRF(worker_key, randomness, epoch)

        // 3. Check election proof
        winner, err := gen.IsRoundWinner(ctx, base.TipSet,
            targetEpoch, m.Address, rand, ticket,
            mbi, m.api)
        if winner == nil {
            continue  // not elected
        }

        // 4. Generate WinningPoSt
        winningPoSt, err := m.GenerateWinningPoSt(ctx, ...)
        // tight deadline: ~40s

        // 5. Create block
        b, err := m.createBlock(ctx, base, ticket, winner,
            winningPoSt, ...)

        // 6. Submit block
        err = m.api.SyncSubmitBlock(ctx, b)

        // 7. Broadcast to peers
    }
}

// Timing:
// - epoch: 30s
// - ticket: VRF computation (few ms)
// - election check: ~1-5s (state lookup)
// - WinningPoSt: 20-40s (GPU accelerated)
// - block creation: 1-3s
// - submission: network dependent

// 목표: block propagation before next epoch
// buffer: ~5-10s per epoch`}
        </pre>
        <p className="leading-7">
          Mining loop: <strong>ticket → election → WinningPoSt → block → submit</strong>.<br />
          30s epoch 내 모든 단계 완료 필요.<br />
          WinningPoSt가 가장 tight (~40s allowed).
        </p>

        {/* ── CreateBlock 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CreateBlock() 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CreateBlock() 상세 (miner/miner.go):

func (m *Miner) createBlock(...) (*types.BlockMsg, error) {
    // 1. Get miner state (lookback)
    // lookback: 900 epochs 과거 상태 사용
    // 이유: chain finality consideration
    lbState := stateAtLookback(base, lookback)
    minerInfo := getMinerInfo(lbState, minerAddr)

    // 2. Get worker key
    workerAddr := minerInfo.Worker  // ID address
    workerKey := resolveKey(lbState, workerAddr)
    // BLS or Secp256k1

    // 3. Select messages from mempool
    msgs := m.api.MpoolSelect(ctx, base.TipSet.Key(),
        base.NullRounds)
    // ticket quality 기반 priority
    // gas limit 내에서 선택

    // 4. Separate BLS vs Secp
    blsMsgs := []*types.SignedMessage{}
    secpMsgs := []*types.SignedMessage{}
    for _, msg := range msgs {
        if msg.Signature.Type == BLS:
            blsMsgs = append(blsMsgs, msg)
        else:
            secpMsgs = append(secpMsgs, msg)
    }

    // 5. Aggregate BLS signatures (space saving)
    blsAgg := aggregate(blsMsgs)

    // 6. Create BlockHeader
    header := &types.BlockHeader{
        Miner: minerAddr,
        Height: height,
        Ticket: ticket,
        ElectionProof: electionProof,
        BeaconEntries: beacon,
        WinPoStProof: winningPoSt,
        Parents: base.TipSet.Cids(),
        ParentWeight: parentWeight,
        ParentStateRoot: stateRoot,
        ParentMessageReceipts: receipts,
        Messages: messagesCID,
        BLSAggregate: blsAgg,
        Timestamp: timestamp,
        BlockSig: nil,  // filled next
        ForkSignaling: 0,
    }

    // 7. Sign block header
    blockSig := sign(workerKey, header.SigningBytes())
    header.BlockSig = blockSig

    // 8. Return BlockMsg
    return &types.BlockMsg{
        Header: header,
        BlsMessages: blsMsgCids,
        SecpkMessages: secpMsgCids,
    }, nil
}

// Lookback 900 epochs (7.5h):
// - finality assumption
// - worker key 안정성
// - miner info consistent`}
        </pre>
        <p className="leading-7">
          CreateBlock: <strong>lookback state → messages → sig → BlockHeader</strong>.<br />
          BLS aggregation으로 space 절약.<br />
          900 epoch lookback = finality assumption.
        </p>

        {/* ── Sector Sealing Pipeline ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Sector Sealing Pipeline</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sector Sealing Pipeline (sector/fsm.go):

// Sector states:
// 1. Packing
//    - raw data collected
//    - CC or deal data
//    - ~32 GiB per sector
//
// 2. AddPiece
//    - deals 추가
//    - padding with zeros
//
// 3. PreCommit1 (PC1)
//    - Stacked DRG computation
//    - 11 layers
//    - CPU-intensive
//    - ~2-4 hours per sector
//
// 4. PreCommit2 (PC2)
//    - Merkle tree construction
//    - column commitments
//    - GPU acceleration
//    - ~30 min per sector
//
// 5. PreCommit submitted
//    - on-chain PreCommit message
//    - deposit FIL (initial pledge)
//    - wait for PreCommitDuration
//
// 6. WaitSeed
//    - on-chain randomness
//    - ~150 epochs wait (1.25h)
//
// 7. Commit1 (C1)
//    - VDF challenge
//    - leaf selection
//    - Merkle proofs
//    - <1 min
//
// 8. Commit2 (C2)
//    - SNARK proof generation
//    - Groth16 + GPU
//    - ~30-90 min
//    - proof ~200 bytes
//
// 9. ProveCommit submitted
//    - on-chain ProveCommit message
//    - sector activated!
//
// 10. Proving
//     - sector in active set
//     - WindowPoSt required
//     - ~540 days lifetime
//
// Total sealing time: ~3-6 hours per sector
// Parallel sectors: limited by CPU/GPU

// Hardware:
// - CPU: AMD EPYC 7B13 64C 흔함
// - GPU: NVIDIA A100 for SNARK
// - RAM: 512 GiB+
// - SSD: NVMe for caching
// - HDD: large capacity for sealed sectors

// Cost optimization:
// - CPU sharing across stages
// - GPU batching
// - sector batching (ProveCommit Aggregate)
// - worker specialization`}
        </pre>
        <p className="leading-7">
          Sealing pipeline: <strong>10 states, 3-6 hours per sector</strong>.<br />
          PC1 (CPU) → PC2 (GPU) → wait → C1 → C2 (GPU SNARK).<br />
          hardware: EPYC + A100 + 512GB RAM + NVMe.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "lookback" 900 epoch인가</strong> — finality assumption.<br />
          최근 900 epoch은 reorg 가능 (probabilistic finality).<br />
          lookback state 사용하면 worker key가 stable한 시점 보장.<br />
          F3 이후엔 lookback 단축 가능성.
        </p>
      </div>
    </section>
  );
}
