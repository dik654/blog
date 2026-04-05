import { codeRefs } from './codeRefs';
import ValidateBlockViz from './viz/ValidateBlockViz';
import type { CodeRef } from '@/components/code/types';

export default function ValidateBlock({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="validate-block" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ValidateBlock 추적</h2>
      <div className="not-prose mb-8">
        <ValidateBlockViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── ValidateBlock 단계 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">ValidateBlock — 다단계 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/state/validation.go
func ValidateBlock(state State, block *types.Block) error {
    // 1. Basic validity
    if err := block.ValidateBasic(); err != nil {
        return err
    }

    // 2. Version check
    if block.Version.Block != state.Version.Consensus.Block {
        return ErrVersionMismatch
    }

    // 3. Chain ID check
    if block.ChainID != state.ChainID {
        return ErrChainIDMismatch
    }

    // 4. Height check
    if block.Height != state.LastBlockHeight + 1 {
        return ErrInvalidHeight
    }

    // 5. Time check
    if !block.Time.After(state.LastBlockTime) {
        return ErrInvalidTime
    }

    // 6. LastBlockID check
    if !block.LastBlockID.Equals(state.LastBlockID) {
        return ErrInvalidLastBlockID
    }

    // 7. Validator/Consensus/NextValidators hash check
    if !bytes.Equal(block.ValidatorsHash, state.Validators.Hash()) {
        return ErrInvalidValidatorsHash
    }
    if !bytes.Equal(block.NextValidatorsHash, state.NextValidators.Hash()) {
        return ErrInvalidNextValidatorsHash
    }
    if !bytes.Equal(block.ConsensusHash, state.ConsensusParams.Hash()) {
        return ErrInvalidConsensusHash
    }

    // 8. Last results hash (이전 block app results)
    if !bytes.Equal(block.LastResultsHash, state.LastResultsHash) {
        return ErrInvalidLastResultsHash
    }

    // 9. App hash (이전 block의 app state)
    if !bytes.Equal(block.AppHash, state.AppHash) {
        return ErrInvalidAppHash
    }

    // 10. Proposer validation
    if !state.Validators.HasAddress(block.ProposerAddress) {
        return ErrInvalidProposer
    }

    // 11. LastCommit 검증 (2/3+ signatures)
    if err := state.LastValidators.VerifyCommitLightTrusting(...); err != nil {
        return ErrInvalidCommit
    }

    // 12. Evidence 검증
    for _, ev := range block.Evidence.Evidence {
        if err := VerifyEvidence(state, ev); err != nil {
            return err
        }
    }

    return nil
}

// 12단계 검증 → 악의 블록 차단
// 가장 비싼 단계: VerifyCommitLightTrusting (서명 검증)
// 다른 단계는 모두 hash 비교 (fast)`}
        </pre>
        <p className="leading-7">
          ValidateBlock이 <strong>12단계 검증</strong>.<br />
          Hash 비교 11개 + 서명 검증 1개.<br />
          LastCommit 서명 검증이 가장 비싼 연산 (~수백 ms).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 VerifyCommitLightTrusting</strong> — 이전 밸리데이터 세트로 LastCommit 2/3+ 서명 검증.<br />
          위조 블록 차단의 핵심 — 서명 유효성으로 합의 통과를 증명.
        </p>
      </div>
    </section>
  );
}
