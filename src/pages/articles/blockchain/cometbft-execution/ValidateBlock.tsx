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
        <p className="text-xs text-muted-foreground mb-3">cometbft/state/validation.go — <code>ValidateBlock(state, block)</code></p>

        <div className="not-prose mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">기본 검증 (1-6)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><span className="font-medium">1.</span> <code className="text-xs">ValidateBasic()</code> — 구조 유효성</li>
                <li><span className="font-medium">2.</span> Version 일치 확인</li>
                <li><span className="font-medium">3.</span> ChainID 일치 확인</li>
                <li><span className="font-medium">4.</span> Height = <code className="text-xs">LastBlockHeight + 1</code></li>
                <li><span className="font-medium">5.</span> Time &gt; LastBlockTime</li>
                <li><span className="font-medium">6.</span> LastBlockID 일치 확인</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Hash 검증 (7-9)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><span className="font-medium">7.</span> <code className="text-xs">ValidatorsHash</code> / <code className="text-xs">NextValidatorsHash</code> / <code className="text-xs">ConsensusHash</code></li>
                <li><span className="font-medium">8.</span> <code className="text-xs">LastResultsHash</code> — 이전 블록 app results</li>
                <li><span className="font-medium">9.</span> <code className="text-xs">AppHash</code> — 이전 블록 app state</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Proposer & Commit (10-11)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><span className="font-medium">10.</span> Proposer가 현재 validator set에 존재하는지</li>
                <li><span className="font-medium">11.</span> <code className="text-xs">VerifyCommitLightTrusting</code> — 2/3+ 서명 검증 (가장 비싼 연산)</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">Evidence 검증 (12)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><span className="font-medium">12.</span> <code className="text-xs">VerifyEvidence(state, ev)</code> — 악의 행위 증거 검증</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
                hash 비교 11개 (fast) + 서명 검증 1개 (~수백 ms)
              </p>
            </div>
          </div>
        </div>

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
