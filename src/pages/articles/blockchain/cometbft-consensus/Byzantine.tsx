import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { CodeViewButton } from '@/components/code';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Byzantine({ onCodeRef }: Props) {
  return (
    <section id="byzantine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비잔틴 탐지 & 증거 수집</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('try-add-vote', codeRefs['try-add-vote'])} />
          <span className="text-[10px] text-muted-foreground self-center">tryAddVote() — 이중 투표 감지</span>
        </div>

        {/* ── Byzantine faults 종류 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Byzantine Faults — 6가지 공격 유형</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">Tendermint BFT가 방어하는 비잔틴 공격</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. Double Signing (이중 서명)</p>
                <p className="text-xs text-muted-foreground">같은 Height+Round+Type에 2개 다른 Vote. 가장 흔한 slashable offense</p>
                <p className="text-xs text-muted-foreground mt-1">Evidence: <code>DuplicateVoteEvidence</code></p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. Equivocation</p>
                <p className="text-xs text-muted-foreground">Proposer가 서로 다른 proposal 방송 — 여러 peer에게 다른 view</p>
                <p className="text-xs text-muted-foreground mt-1">Evidence: <code>ConflictingVotes</code></p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. Amnesia Attack (기억상실)</p>
                <p className="text-xs text-muted-foreground">이전 Lock 무시하고 새 block에 Prevote — BFT safety 위반 시도</p>
                <p className="text-xs text-muted-foreground mt-1">감지: 과거 Lock 기록과 현재 Prevote 비교</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">4. Light Client Attack</p>
                <p className="text-xs text-muted-foreground">light client에 falsified state 전달 — commit 없는 invalid block</p>
                <p className="text-xs text-muted-foreground mt-1">Evidence: <code>LightClientAttackEvidence</code></p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">5. Long Range Attack</p>
                <p className="text-xs text-muted-foreground">이미 unbonded validator의 옛 키로 재서명 — 과거 시점에 대체 체인 제시</p>
                <p className="text-xs text-muted-foreground mt-1">방어: weak subjectivity period</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">6. DDoS / Censorship</p>
                <p className="text-xs text-muted-foreground">validator 오프라인 유지 / TX 검열</p>
                <p className="text-xs text-muted-foreground mt-1">직접 slashing 불가 (liveness-only)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">탐지 지점</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><code>tryAddVote()</code> — double signing 즉시 감지</li>
                <li>light client — attack evidence 생성</li>
                <li>verification — block validation 시 체크</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Slashing 결과</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Stake 5% slash (double signing)</li>
                <li>Validator tombstone (영구 제외)</li>
                <li>Delegators 동반 slash</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>6가지 비잔틴 공격 유형</strong>이 알려짐.<br />
          Double Signing/Equivocation이 가장 흔함 → 강력 slash.<br />
          Long Range는 weak subjectivity로 방어.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 이중 투표 탐지</strong> — 같은 높이/라운드/타입에 다른 BlockID 투표 발견.<br />
          evpool.ReportConflictingVotes(voteA, voteB) → DuplicateVoteEvidence 생성.<br />
          다음 블록 제안에 포함하여 슬래싱 트리거.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 1/3 이하 비잔틴 보장</strong> — 정직 2/3+ 시 Lock 메커니즘이 분기 방지.<br />
          비잔틴 {'>'} 1/3 시 liveness 상실, safety는 유지.
        </p>
      </div>
    </section>
  );
}
