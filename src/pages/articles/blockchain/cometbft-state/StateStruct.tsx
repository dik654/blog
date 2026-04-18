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
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">체인 & 블록 정보</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">Version</code> — block/app version</li>
              <li><code className="text-xs">ChainID string</code></li>
              <li><code className="text-xs">InitialHeight int64</code> — genesis height</li>
              <li><code className="text-xs">LastBlockHeight int64</code> — 마지막 commit 높이</li>
              <li><code className="text-xs">LastBlockID BlockID</code> — 그 block의 ID</li>
              <li><code className="text-xs">LastBlockTime time.Time</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Validator Sets (3-generation)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">LastValidators *ValidatorSet</code> — 이전 블록 검증용</li>
              <li><code className="text-xs">Validators *ValidatorSet</code> — 현재 블록 서명용</li>
              <li><code className="text-xs">NextValidators *ValidatorSet</code> — 다음 블록용</li>
              <li><code className="text-xs">LastHeightValidatorsChanged int64</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">Params & Merkle roots</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">ConsensusParams</code> — upgradeable</li>
              <li><code className="text-xs">LastHeightConsensusParamsChanged int64</code></li>
              <li><code className="text-xs">LastResultsHash []byte</code> — 이전 block results hash</li>
              <li><code className="text-xs">AppHash []byte</code> — current app state root</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">3-generation Validator 이유</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Block N의 LastCommit = Block N-1 validators 서명 → <code className="text-xs">LastValidators</code> 필요</p>
              <p><code className="text-xs">FinalizeBlock</code>이 validator 변경 반환 → <code className="text-xs">NextValidators</code> 업데이트</p>
              <p>변경은 +2 block 지연 적용 (safety margin)</p>
            </div>
          </div>
        </div>
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
