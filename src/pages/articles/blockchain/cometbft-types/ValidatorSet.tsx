import ProposerViz from "./viz/ProposerViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function ValidatorSet({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="validator-set" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        ValidatorSet & 가중 라운드 로빈
      </h2>
      <div className="not-prose mb-8">
        <ProposerViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── ValidatorSet 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          ValidatorSet & Validator 구조체
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                <code>ValidatorSet</code> — cometbft/types/validator_set.go
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">Validators</code>
                  <span className="text-xs text-muted-foreground">
                    <code>[]*Validator</code> — sorted by address
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">Proposer</code>
                  <span className="text-xs text-muted-foreground">
                    <code>*Validator</code> — 현재 라운드 제안자
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <code className="text-xs">totalVotingPower</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int64</code> — 캐시된 합계
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                <code>Validator</code>
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">Address</code>
                  <span className="text-xs text-muted-foreground">
                    <code>Address</code> — Ed25519 pubkey hash (20 bytes)
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">PubKey</code>
                  <span className="text-xs text-muted-foreground">
                    <code>crypto.PubKey</code> — Ed25519 공개키
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">VotingPower</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int64</code> — 애플리케이션이 제공한 합의 가중치
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <code className="text-xs">ProposerPriority</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int64</code> — 라운드 로빈용 priority
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">속성</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>validator 세트와 변경은 ABCI 애플리케이션이 제공</li>
                <li>
                  VotingPower의 경제적 의미는 체인 설계에 따름; CometBFT는 정수
                  가중치로 사용
                </li>
                <li>ProposerPriority는 round마다 업데이트</li>
                <li>Validators는 Address 순 정렬 유지</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                합의 조건: 2/3+ VotingPower = "quorum" → 같은 블록에 Precommit →
                finalize
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                고정 수치를 피해야 하는 이유
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  validator 수와 voting power는 매 height의 애플리케이션 상태다.
                </p>
                <p>
                  운영 네트워크의 현재 stake·최대 개수·하한을 CometBFT 타입의
                  불변 속성으로 적으면 안 된다.
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          ValidatorSet은 <strong>weighted validators</strong>의 결정적
          스냅샷이다.
          각 validator의 VotingPower가 합의 가중치이며, 그 가중치를 stake에서
          어떻게 도출할지는 application의 책임이다. CometBFT는 이 snapshot에서
          2/3를 초과하는 voting power가 같은 block에 precommit했는지를 확인해
          commit을 구성한다.
        </p>

        {/* ── 가중 라운드 로빈 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          가중 라운드 로빈 — IncrementProposerPriority
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-1">
              <code>incrementProposerPriority()</code> — 결정적 가중 라운드 로빈
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              같은 validator set·priority·round를 본 모든 노드가 동일한
              proposer를 계산
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. Priority 증가</p>
                <p className="text-xs text-muted-foreground">
                  각 validator의 priority를 VotingPower만큼 증가
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. 최고 선정</p>
                <p className="text-xs text-muted-foreground">
                  <code>findHighestPriority()</code> — 가장 높은 priority 선택
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. Total 차감</p>
                <p className="text-xs text-muted-foreground">
                  선정자 priority -= TotalVotingPower (기회 양보)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">4. Proposer 설정</p>
                <p className="text-xs text-muted-foreground">
                  <code>vals.Proposer = mostest</code>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              동작 예시 — 4 validators, voting power [100, 80, 60, 40], total =
              280
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">Round 0</p>
                <p className="text-xs text-muted-foreground">
                  priorities [0,0,0,0] → +VP → [100,80,60,40]
                </p>
                <p className="text-xs text-muted-foreground">
                  select val0 (100) → -280
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  → [-180, 80, 60, 40]
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">Round 1</p>
                <p className="text-xs text-muted-foreground">
                  +VP → [-80, 160, 120, 80]
                </p>
                <p className="text-xs text-muted-foreground">
                  select val1 (160) → -280
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  → [-80, -120, 120, 80]
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">Round 2</p>
                <p className="text-xs text-muted-foreground">
                  +VP → [20, -40, 180, 120]
                </p>
                <p className="text-xs text-muted-foreground">
                  select val2 (180) → -280
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  → [20, -40, -100, 120]
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">특성</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center text-muted-foreground">
              <div className="bg-background rounded px-3 py-2">
                결정적 (모든 노드 동일 결과)
              </div>
              <div className="bg-background rounded px-3 py-2">
                stake 비례 기회
              </div>
              <div className="bg-background rounded px-3 py-2">
                장기적 공정성 (priority 축적)
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>IncrementProposerPriority</strong>가 가중 라운드 로빈의 핵심.
          매 round priority를 voting power만큼 늘리고 선정된 proposer에게서
          전체 power를 차감하기 때문에, 모든 노드가 같은 입력으로 같은 proposer를
          계산하면서 장기적으로 power 비율에 가까운 기회를 배분한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{"💡"} 가중 라운드 로빈</strong> — priority를 모든 노드가 같이
          갱신하므로 별도의 랜덤성 입력 없이 이번 round의 proposer를 동일하게
          선택한다. 다만
          랜덤성을 사용하는 다른 합의 프로토콜도 공유된 랜덤성을 검증해 동일한
          결과에 도달할 수 있으므로, 랜덤 추첨 자체가 BFT에 부적합하다고
          일반화하지 않는다.
        </p>
      </div>
    </section>
  );
}
