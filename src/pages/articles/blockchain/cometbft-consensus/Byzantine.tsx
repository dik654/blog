import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import { CodeViewButton } from "@/components/code";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Byzantine({ onCodeRef }: Props) {
  return (
    <section id="byzantine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비잔틴 탐지 & 증거 수집</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("try-add-vote", codeRefs["try-add-vote"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            tryAddVote() — 이중 투표 감지
          </span>
        </div>

        {/* ── Byzantine faults 종류 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          관찰 가능한 오류와 evidence의 범위
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              모든 잘못된 행동이 동일한 evidence 타입이 되는 것은 아니다
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">
                  1. Double Signing (이중 서명)
                </p>
                <p className="text-xs text-muted-foreground">
                  같은 Height+Round+Type에 다른 BlockID를 서명한 경우
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Evidence: <code>DuplicateVoteEvidence</code>
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. Equivocation</p>
                <p className="text-xs text-muted-foreground">
                  Proposer가 서로 다른 proposal 방송 — 여러 peer에게 다른 view
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  제안의 일관성 오류는 vote evidence와 다른 처리 경계
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">
                  3. Amnesia Attack (기억상실)
                </p>
                <p className="text-xs text-muted-foreground">
                  이전 Lock 무시하고 새 block에 Prevote — BFT safety 위반 시도
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  lock/valid-round 규칙이 안전성을 지키며 독립 온체인 evidence
                  타입으로 일반화하지 않음
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">
                  4. Light Client Attack
                </p>
                <p className="text-xs text-muted-foreground">
                  light client에 falsified state 전달 — commit 없는 invalid
                  block
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Evidence: <code>LightClientAttackEvidence</code>
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">5. Long Range Attack</p>
                <p className="text-xs text-muted-foreground">
                  이미 unbonded validator의 옛 키로 재서명 — 과거 시점에 대체
                  체인 제시
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  방어: weak subjectivity period
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">6. DDoS / Censorship</p>
                <p className="text-xs text-muted-foreground">
                  validator 오프라인 유지 / TX 검열
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  투표 evidence로 증명할 수 없는 행동은 운영·애플리케이션 정책
                  영역
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">탐지 지점</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <code>tryAddVote()</code> — double signing 즉시 감지
                </li>
                <li>light client — attack evidence 생성</li>
                <li>verification — block validation 시 체크</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">경제적 결과의 책임</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>CometBFT는 유효한 evidence를 블록과 ABCI에 전달</li>
                <li>애플리케이션이 slash·jail·tombstone 여부와 수치를 결정</li>
                <li>위임자 영향도 애플리케이션 staking 모델에 따름</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          CometBFT evidence의 핵심은{" "}
          <strong>두 개의 충돌 vote를 독립적으로 검증할 수 있게 보존</strong>
          하는 것이다. 반면
          light-client attack evidence는 다른 신뢰 모델과 검증 규칙을 갖고,
          censorship·offline과 같은 행동을 같은 형식으로 증명하는 것은 아니다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 이중 투표 탐지</strong> — 같은 높이/라운드/타입에 다른
          BlockID를 가리키는 vote가 발견되면
          evpool.ReportConflictingVotes(voteA, voteB)가 DuplicateVoteEvidence를
          만든다. 이를
          evidence pool에 보관한 후 제안 블록에 포함하며, 애플리케이션은 ABCI로
          전달된 misbehavior에 대한 경제적 처리를 자신의 규칙으로 결정한다.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 1/3 경계</strong> — 비잔틴 voting power가 1/3 미만이고
          네트워크가 적절히 동기화되는 가정 아래 safety와 liveness를 증명한다.
          1/3 이상에서는 프로토콜이 safety나 liveness 중 어느 것도 일반적으로
          보장하지 않는다.
        </p>
      </div>
    </section>
  );
}
