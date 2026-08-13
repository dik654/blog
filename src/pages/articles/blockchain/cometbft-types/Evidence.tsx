import EvidenceViz from "./viz/EvidenceViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Evidence({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="evidence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Evidence — 비잔틴 증거</h2>
      <div className="not-prose mb-8">
        <EvidenceViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Evidence 타입 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          Evidence 종류 — 2가지 비잔틴 행위
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">
              <code>Evidence</code> interface — cometbft/types/evidence.go
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-1 text-xs text-center text-muted-foreground">
              <div className="bg-background rounded px-2 py-1.5">
                <code>ABCI()</code>
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                <code>Bytes()</code>
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                <code>Hash()</code>
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                <code>Height()</code>
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                <code>String()</code>
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                <code>Time()</code>
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                <code>ValidateBasic()</code>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">
                1. DuplicateVoteEvidence (equivocation)
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                같은 (height, round, type)에 2개 다른 block 투표
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">VoteA</code>
                  <span className="text-xs text-muted-foreground">
                    <code>*Vote</code> — 첫 번째 투표
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">VoteB</code>
                  <span className="text-xs text-muted-foreground">
                    <code>*Vote</code> — 두 번째 투표
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">TotalVotingPower</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int64</code>
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">ValidatorPower</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int64</code>
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <code className="text-xs">Timestamp</code>
                  <span className="text-xs text-muted-foreground">
                    <code>time.Time</code>
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                검증: Height/Round/Type 동일 + Address 동일 + BlockID 상이 + 두
                Vote 서명 유효
              </p>
            </div>

            <div className="rounded-lg border border-orange-500/30 p-4">
              <p className="font-semibold text-sm text-orange-400 mb-2">
                2. LightClientAttackEvidence
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                light client 공격 (conflicting headers)
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">ConflictingBlock</code>
                  <span className="text-xs text-muted-foreground">
                    <code>*LightBlock</code> — 공격자 블록
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">CommonHeight</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int64</code> — 공통 조상 높이
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">ByzantineValidators</code>
                  <span className="text-xs text-muted-foreground">
                    <code>[]*Validator</code>
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">TotalVotingPower</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int64</code>
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <code className="text-xs">Timestamp</code>
                  <span className="text-xs text-muted-foreground">
                    <code>time.Time</code>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 mt-3 text-xs text-center text-muted-foreground">
                <div className="bg-background/50 rounded px-2 py-1">
                  Lunatic — 다른 state 기반
                </div>
                <div className="bg-background/50 rounded px-2 py-1">
                  Equivocation — conflicting 서명
                </div>
                <div className="bg-background/50 rounded px-2 py-1">
                  Amnesia — 이전 commit 무시
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">탐지 시점</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground/80">일반 노드</strong> —
                P2P로 받은 Vote 비교
              </div>
              <div>
                <strong className="text-foreground/80">Light client</strong> —
                2개 full node의 응답 비교
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          CometBFT가 구조화하는 핵심 evidence는{" "}
          <strong>DuplicateVoteEvidence와 LightClientAttackEvidence</strong>다.
          블록에 포함하면 모든 노드가 같은 misbehavior 입력을 검증·실행할 수
          있다. 그 입력을 slash·jail·기록 중 어떻게 처리할지는 ABCI
          애플리케이션이 결정한다.
        </p>

        {/* ── Evidence Pool & Slashing ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Evidence Lifecycle — 탐지 → 검증 → Block 포함 → ABCI
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              Evidence 생명주기 — 5단계
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. 탐지</p>
                <p className="text-xs text-muted-foreground">
                  <code>VoteSet.AddVote</code>에서 equivocation 감지 →{" "}
                  <code>DuplicateVoteEvidence</code> 생성 → EvidencePool 추가
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. Gossip</p>
                <p className="text-xs text-muted-foreground">
                  Evidence reactor가 peer와 유효한 pending evidence를 교환
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. Block 포함</p>
                <p className="text-xs text-muted-foreground">
                  제안자가 consensus parameter의 byte 한도 안에서 pending
                  evidence를 선택
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">4. Validation</p>
                <p className="text-xs text-muted-foreground">
                  <code>ValidateBlock</code>에서 Evidence 재검증 + 서명 체크.
                  유효하지 않으면 블록 거부
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">5. Application</p>
                <p className="text-xs text-muted-foreground">
                  ABCI <code>FinalizeBlock</code>에 misbehavior를 전달하면
                  애플리케이션이 결과를 결정
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">애플리케이션 정책 예</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>stake 감소나 jail</li>
                <li>tombstone 또는 validator 상태 변경</li>
                <li>단순 기록 또는 처벌 없음</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Evidence max age</p>
              <p className="text-sm text-muted-foreground">
                consensus parameter의 block age와 duration 두 조건으로 판단
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                이유: 검증 가능한 validator 이력과 저장 범위를 유한하게 유지
              </p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Evidence lifecycle:{" "}
          <strong>
            탐지 → 검증·gossip → byte 한도 내 block 포함 → ABCI 전달
          </strong>
          의 순서로 이동한다. 모든 CometBFT 노드는 같은 evidence 유효성을
          판단하지만 경제적 결과는 애플리케이션 규칙이며,
          만료는 체인의 consensus parameters에 따라 달라진다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{"💡"} Evidence가 Block에 포함되는 이유</strong> — 비잔틴
          행위의 입력을 합의된 순서에 넣으면 모든 노드가 동일한 시점에 ABCI
          애플리케이션으로 전달할 수 있다. 반면
          off-chain 신고 방식은 합의 없이 불일치가 발생할 수 있어 부적합하다.
        </p>
      </div>
    </section>
  );
}
