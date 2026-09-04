import { CitationBlock } from "../../../../components/ui/citation";
import { CodeViewButton } from "@/components/code";
import TendermintRoundViz from "./viz/TendermintRoundViz";
import { COMPARISON_TABLE } from "./ConsensusEngineData";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

const CELL = "border border-border px-4 py-2";

export default function ConsensusEngine({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="consensus-engine" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">합의 엔진: 한 height를 여러 round에 걸쳐 안전하게 확정하는 방법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT는 각 block height에서 proposer가 block을 내고 validator들이 <strong>Propose → Prevote → Precommit</strong> 순서로 합의하는 Tendermint BFT를 사용합니다. 같은 height에서 voting power의 3분의 2를 넘는 precommit을 모으면 block이 곧바로 확정되므로, 이후 더 긴 chain이 나타나 결과가 뒤집히는 확률적 finality와는 성격이 다릅니다.
        </p>
        <p>
          한 round가 끝까지 진행되지 못하면 같은 height를 유지한 채 proposer와 timeout을 바꿔 다음 round로 넘어갑니다. 이때 safety를 지키는 쪽은 lock
          규칙입니다. 이미 지지한 block을 함부로 바꾸지 못하게 막습니다. liveness는 점점 길어지는 timeout이 네트워크가 안정될 시간을 주면서 회복시킵니다. 아래 그림은 이
          두 장치가 어느 단계에서 작동하는지 먼저 보여줍니다.
        </p>
        <CitationBlock
          source='Buchman et al., "The latest gossip on BFT consensus", 2018'
          citeKey={1}
          type="paper"
          href="https://arxiv.org/abs/1807.04938"
        >
          <p className="italic">
            "Tendermint guarantees safety — no two correct processes decide
            differently — and liveness under partial synchrony"
          </p>
          <p className="mt-2 text-xs">
            Tendermint BFT 핵심 보장 — 부분 동기 모델에서 Safety(동일 높이에서
            서로 다른 블록 커밋 불가) + Liveness 모두 제공
          </p>
        </CitationBlock>
      </div>
      <div className="not-prose my-8">
        <TendermintRoundViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">
          라운드 기반 합의 흐름
        </h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("enter-propose", codeRefs["enter-propose"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            enterPropose()
          </span>
          <CodeViewButton
            onClick={() =>
              onCodeRef("enter-prevote", codeRefs["enter-prevote"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            defaultDoPrevote()
          </span>
          <CodeViewButton
            onClick={() =>
              onCodeRef("enter-precommit", codeRefs["enter-precommit"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            enterPrecommit()
          </span>
          <CodeViewButton
            onClick={() =>
              onCodeRef("finalize-commit", codeRefs["finalize-commit"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            enterCommit()
          </span>
        </div>
        <ol>
          <li><strong>Propose:</strong> height <em>H</em>와 round <em>R</em>에 맞춰 선정된 proposer가 block을 제안합니다. Round가 바뀌면 proposer도 함께 바뀌므로 한 validator의 장애가 height 전체를 멈추게 하지는 않습니다.</li>
          <li><strong>Prevote:</strong> validator는 proposal과 현재 lock을 확인해 <code>Prevote(block_hash)</code> 또는 <code>Prevote(nil)</code>을 보냅니다. 같은 block에 3분의 2를 넘는 prevote가 모인 상태를 polka라고 부릅니다.</li>
          <li><strong>Precommit:</strong> polka를 확인한 validator는 그 block을 lock하고 <code>Precommit(block_hash)</code>을 보냅니다. 3분의 2를 넘는 precommit이 모이면 commit하며, 유효한 polka를 만들지 못하면 nil에 투표하고 다음 round를 준비합니다.</li>
        </ol>
        <CitationBlock
          source="cometbft/consensus/state.go"
          citeKey={2}
          type="code"
          href="https://github.com/cometbft/cometbft/blob/main/consensus/state.go"
        >
          <p className="text-xs text-foreground/70">
            합의 상태 머신의 핵심 구조체 — <code>RoundState</code>가
            Height/Round/Step + LockedBlock + ValidBlock + Votes를 관리
          </p>
        </CitationBlock>
        {/* ── State Machine 전이 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          State Machine — 슬롯당 5 단계 전이
        </h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">
              <code>RoundStepType</code> — 8단계 상태
            </p>
            <div className="grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="font-mono text-xs">1</span>
              <code className="text-xs">NewHeight</code>
              <span>새 높이 시작 대기</span>
              <span className="font-mono text-xs">2</span>
              <code className="text-xs">NewRound</code>
              <span>새 라운드 시작</span>
              <span className="font-mono text-xs">3</span>
              <code className="text-xs">Propose</code>
              <span>proposer 블록 대기</span>
              <span className="font-mono text-xs">4</span>
              <code className="text-xs">Prevote</code>
              <span>2/3+ Prevote 수집</span>
              <span className="font-mono text-xs">5</span>
              <code className="text-xs">PrevoteWait</code>
              <span>polka 대기 timeout</span>
              <span className="font-mono text-xs">6</span>
              <code className="text-xs">Precommit</code>
              <span>2/3+ Precommit 수집</span>
              <span className="font-mono text-xs">7</span>
              <code className="text-xs">PrecommitWait</code>
              <span>commit 대기 timeout</span>
              <span className="font-mono text-xs">8</span>
              <code className="text-xs">Commit</code>
              <span>블록 finalize</span>
            </div>
            <div className="mt-3 grid gap-1 text-xs text-muted-foreground">
              <p><strong className="text-foreground">정상 경로:</strong> NewHeight → NewRound → Propose → Prevote → Precommit → Commit</p>
              <p><strong className="text-foreground">복구 경로:</strong> timeout이 발생하면 같은 height의 NewRound로 돌아갑니다.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                <code>enterPropose</code>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Proposer = 현재 round 선정 validator</li>
                <li>내가 proposer → 블록 생성 + 방송</li>
                <li>아니면 → proposer 블록 대기 (propose timeout)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                <code>enterPrevote</code>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>받은 proposal validation</li>
                <li>
                  유효 → <code>Prevote(block_hash)</code>
                </li>
                <li>
                  무효/타임아웃 → <code>Prevote(nil)</code>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                <code>enterPrecommit</code>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  +2/3 Prevote 확인 → <code>Precommit(block_hash)</code> + lock
                </li>
                <li>
                  +2/3 nil Prevote → <code>Precommit(nil)</code> + unlock
                </li>
                <li>
                  애매하면 → <code>Precommit(nil)</code>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                <code>enterCommit</code>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>+2/3 Precommit 확보 → block finalize</li>
                <li>
                  <code>PrevoteWait</code> timeout →{" "}
                  <code>enterPrecommit(nil)</code> 강제
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          구현에서는 이 세 투표 단계를 대기 상태까지 포함한 여덟 개의 <code>RoundStepType</code>으로 나눕니다. 각 상태에는 진입 조건과 timeout이 있으므로, proposal이나 vote가 부족해도 무기한 기다리지 않고 다음 round로 진행할 수 있습니다.
        </p>

        {/* ── Lock 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Lock 메커니즘 — Safety 보장의 핵심
        </h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">
              <code>State</code> 구조체 — Lock 관련 필드
            </p>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <code className="text-xs">LockedRound int32</code>
              <span>현재 lock된 round (-1 = unlock)</span>
              <code className="text-xs">LockedBlock *Block</code>
              <span>현재 lock된 block</span>
              <code className="text-xs">LockedBlockParts *PartSet</code>
              <span>lock된 block의 파트셋</span>
              <code className="text-xs">ValidRound int32</code>
              <span>가장 최근 valid block round</span>
              <code className="text-xs">ValidBlock *Block</code>
              <span>가장 최근 valid block</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">
              Lock 규칙 4가지
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">1. Polka 발견</strong> —
                +2/3 Prevote for block X → lock = block X →{" "}
                <code>Precommit(X)</code> 방송
              </p>
              <p>
                <strong className="text-foreground">2. Lock 유지</strong> —
                lock된 상태에서 다른 block에 Prevote 불가 (위반 = equivocation →
                slashing)
              </p>
              <p>
                <strong className="text-foreground">3. Unlock 조건</strong> — a)
                +2/3 nil Prevote 수집 b) 다른 block의 polka 발견 (higher round)
                c) polka round &gt; <code>LockedRound</code>
              </p>
              <p>
                <strong className="text-foreground">4. 새 round</strong> — Lock
                유지 (safety), 단 새 proposal이 <code>LockedBlock</code>이면
                Prevote 가능
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">
              Safety 증명
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Block X가 3분의 2를 넘는 <code>Precommit(X)</code>으로 확정되면 그 집합과 다른 3분의 2 집합은 반드시 3분의 1을 넘는 voting power에서 겹칩니다. 정직한 validator가 lock 규칙을 지키는 한 이 overlap은 경쟁 block Y에 다시 투표할 수 없으므로, Y가 같은 height에서 별도의 commit을 만드는 것을 막습니다. 규칙을 어긴 서명은 equivocation evidence로 남습니다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">
              Lock 예시
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Round 0</strong> — Proposer
                A가 block1 제안 → <code>Prevote(block1)</code> → polka →{" "}
                <code>lock(block1)</code>. commit 실패 (네트워크 장애)
              </p>
              <p>
                <strong className="text-foreground">Round 1</strong> — Proposer
                B가 block2 제안 → 나는 <code>locked(block1)</code> →{" "}
                <code>Prevote(nil)</code>. block2 polka 불가 → round 1 실패
              </p>
              <p>
                <strong className="text-foreground">Round 2</strong> — 다른
                validator들이 block2에 polka 달성 → 나도 unlock →{" "}
                <code>Prevote(block2)</code> → block2 finalize
              </p>
            </div>
          </div>
        </div>
        <p>
          lock을 단순한 구현 상태로 보면 안 됩니다. Tendermint safety의 핵심이 여기 있습니다. Validator는 더 높은 round에서 정당한 polka를 확인하기
          전까지 lock된 block과 충돌하는 block을 지지하지 않습니다. 이 제약이 같은 height에서 두 block이 동시에 확정되는 상황을 막습니다.
        </p>

        {/* ── Timeout 전략 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Timeout 전략 — Liveness 보장
        </h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2">
              <code>ConsensusParams</code> — 단계별 timeout
            </p>
            <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <code className="text-xs">TimeoutPropose</code>
              <span>3s (기본)</span>
              <code className="text-xs">TimeoutProposeDelta</code>
              <span>500ms</span>
              <code className="text-xs">TimeoutPrevote</code>
              <span>1s</span>
              <code className="text-xs">TimeoutPrevoteDelta</code>
              <span>500ms</span>
              <code className="text-xs">TimeoutPrecommit</code>
              <span>1s</span>
              <code className="text-xs">TimeoutPrecommitDelta</code>
              <span>500ms</span>
              <code className="text-xs">TimeoutCommit</code>
              <span>1s</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Round별 증가: R0 → propose 3s, R1 → 3.5s, R2 → 4s ... 네트워크
              상태에 적응
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                Round 실패 시나리오
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">
                    1. Proposer 오프라인
                  </strong>{" "}
                  — propose timeout → <code>Prevote(nil)</code> → round 실패
                </p>
                <p>
                  <strong className="text-foreground">
                    2. +2/3 Prevote 미달성
                  </strong>{" "}
                  — prevoteWait timeout → <code>Precommit(nil)</code> → round
                  실패
                </p>
                <p>
                  <strong className="text-foreground">
                    3. +2/3 Precommit 미달성
                  </strong>{" "}
                  — precommitWait timeout → NewRound
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                운영에서 볼 지표
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Round 0 commit 비율과 p95 round</p>
                <p>Propose·Prevote·Precommit step duration</p>
                <p>Peer별 vote 도착 지연과 timeout 원인</p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                특정 성공률을 복사하지 말고 노드 telemetry와 network incident를
                같은 시간축에서 비교합니다.
              </p>
            </div>
          </div>
        </div>
        <p>
          Timeout은 round가 올라갈수록 길어집니다. 짧은 일시 장애에는 빠르게 다음 proposer를 시도하고, 장애가 길어지면 validator들이 같은 proposal과 vote를 받을 수 있을 만큼 기다리는 방식입니다. 실제 round 분포는 validator와 network 상태에 따라 달라지므로 고정된 성공률을 전제로 삼기보다 <code>consensus_rounds</code>와 step duration을 직접 관찰해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          이더리움 Casper FFG와 비교
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>속성</th>
                <th className={`${CELL} text-left`}>Tendermint BFT</th>
                <th className={`${CELL} text-left`}>Casper FFG + LMD-GHOST</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((r) => (
                <tr key={r.attr}>
                  <td className={`${CELL} font-medium`}>{r.attr}</td>
                  <td className={CELL}>{r.tendermint}</td>
                  <td className={CELL}>{r.casper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
