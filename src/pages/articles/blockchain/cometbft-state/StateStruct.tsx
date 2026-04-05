import { codeRefs } from './codeRefs';
import StateStructViz from './viz/StateStructViz';
import type { CodeRef } from '@/components/code/types';

export default function StateStruct({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="state-struct" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">State 구조체 추적</h2>
      <div className="not-prose mb-8">
        <StateStructViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── State struct ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">State 구조체 — 12 필드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/state/state.go
type State struct {
    Version Version            // block/app version

    // 체인 정보
    ChainID        string
    InitialHeight  int64       // genesis height

    // 최근 블록 정보
    LastBlockHeight int64      // 마지막 commit된 block height
    LastBlockID     BlockID    // 그 block의 ID
    LastBlockTime   time.Time

    // Validator sets (3-generation)
    NextValidators      *ValidatorSet  // next block's validators
    Validators          *ValidatorSet  // current block's validators
    LastValidators      *ValidatorSet  // last block's validators
    LastHeightValidatorsChanged int64

    // Consensus params (upgradeable)
    ConsensusParams             types.ConsensusParams
    LastHeightConsensusParamsChanged int64

    // Merkle roots
    LastResultsHash []byte     // 이전 block results hash
    AppHash         []byte     // current app state root
}

// 3-generation validator set:
// 매 block마다 3개 ValidatorSet 유지
//
// 이유:
// Block N의 LastCommit은 Block N-1의 validators가 서명
// → LastValidators 필요 (verification)
//
// FinalizeBlock이 validator 변경 반환:
// → NextValidators 업데이트
// → 2 block 후 active (+2 delay for safety)
//
// 시점별:
// Block N:
//   - Block N-1 verification: LastValidators
//   - Block N signing: Validators
//   - Block N's commit verification: Validators
//   - NextValidators 미래용`}
        </pre>
        <p className="leading-7">
          State는 <strong>12 필드 consensus state snapshot</strong>.<br />
          3-generation validator sets 유지 (Last/Current/Next).<br />
          validator 변경은 +2 block 지연 적용 (safety margin).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 밸리데이터 3중 세트</strong> — 현재 블록의 LastCommit은 이전 밸리데이터가 서명.<br />
          NextValidators는 FinalizeBlock의 ValidatorUpdates를 반영, 2블록 후 적용.
        </p>
      </div>
    </section>
  );
}
