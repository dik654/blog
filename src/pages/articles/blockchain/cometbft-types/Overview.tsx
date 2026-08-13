import ContextViz from "./viz/ContextViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">핵심 type은 block·vote·commit의 합의 증거를 보존한다</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CometBFT의 합의 메시지(블록 제안, 투표, 커밋)는 모두{" "}
          <code>types/</code> 패키지의 Go 구조체로 정의된다.
          이 아티클에서는 Block, Vote, ValidatorSet, Evidence의 내부
          필드와 핵심 함수를 코드 수준으로 추적한다.
        </p>

        {/* ── types 패키지 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          types 패키지 — 합의 메시지의 타입 계층
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              cometbft/types/ 패키지의 주요 역할
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">block.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Block, Header, Data, EvidenceData
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">block_meta.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  BlockMeta (블록 요약)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">part_set.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PartSet (블록 분할 전파)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">proposal.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Proposal (블록 제안)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">vote.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Vote (투표)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">vote_set.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  VoteSet (투표 집계)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">validator.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Validator (단일 검증자)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">validator_set.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ValidatorSet (검증자 목록)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">evidence.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Evidence (비잔틴 증거)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">canonical.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  CanonicalVote (서명 대상)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">genesis.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  GenesisDoc (제네시스 정보)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">params.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ConsensusParams
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">protobuf.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  protobuf 변환
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">합의 메시지 레이어</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. Block (블록 단위)</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li>Header — 메타데이터</li>
                  <li>Data — transactions</li>
                  <li>Evidence — 애플리케이션에 전달할 misbehavior 증거</li>
                  <li>LastCommit — 이전 블록 투표 집계</li>
                </ul>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. Proposal</p>
                <p className="text-xs text-muted-foreground">
                  리더가 만드는 블록 제안
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">
                  3. Vote (검증자 서명 투표)
                </p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li>Prevote — 블록 수용 여부</li>
                  <li>Precommit — 최종 커밋 투표</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Protobuf 직렬화</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>CometBFT — Protobuf 3</li>
                <li>Ethereum — SSZ</li>
                <li>Bitcoin — bespoke binary</li>
                <li>gRPC native 지원</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">왜 Protobuf?</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Tendermint Go 생태계 기본 선택</li>
                <li>Go codegen 도구 성숙</li>
                <li>ABCI 앱과 protobuf 공유</li>
                <li>스키마 evolution 지원</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>types</code> 패키지는{" "}
          <strong>합의 메시지 전체의 타입 경계</strong>를 정의한다.
          Block/Vote/Validator/Evidence 등의 런타임 타입과 protobuf wire 타입을
          변환하므로, canonical sign bytes와 네트워크 직렬화 규칙을 함께
          이해해야 한다.
        </p>

        {/* ── Tendermint BFT 메시지 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Tendermint BFT 메시지 흐름
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              1 Round of Consensus (3-phase commit) — Round R, Height H
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">Step 1: Propose</p>
                <p className="text-xs text-muted-foreground">
                  Proposer (round-robin) → 모든 validator
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <code>Proposal(block, block_parts)</code>
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">Step 2: Prevote</p>
                <p className="text-xs text-muted-foreground">
                  모든 validator → 모든 validator
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <code>Vote(Prevote, block_hash | nil)</code>
                </p>
                <p className="text-xs text-muted-foreground">
                  2/3+ 수집 → "polka"
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">Step 3: Precommit</p>
                <p className="text-xs text-muted-foreground">
                  모든 validator → 모든 validator
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <code>Vote(Precommit, block_hash | nil)</code>
                </p>
                <p className="text-xs text-muted-foreground">
                  2/3+ 수집 → "commit"
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">Step 4: Commit</p>
                <p className="text-xs text-muted-foreground">
                  NewRoundStep 시작
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  H += 1, R = 0
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">타이밍</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>propose timeout</div>
                <div className="text-right font-mono">기본값 + round delta</div>
                <div>prevote timeout</div>
                <div className="text-right font-mono">vote 설정값</div>
                <div>precommit timeout</div>
                <div className="text-right font-mono">vote 설정값</div>
                <div>commit timeout</div>
                <div className="text-right font-mono">commit 설정값</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Round 실패 → R += 1 → re-propose (네트워크 지연/장애 시 재시도)
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">최종성 보장</p>
              <p className="text-sm text-muted-foreground">
                +2/3 voting power의 Precommit commit을 수집하면 해당 height를
                결정
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                안전성은 비잔틴 voting power 1/3 미만과 신뢰 가정에 의존
              </p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Tendermint BFT는 <strong>3-phase commit</strong> —
          Propose/Prevote/Precommit으로 진행한다. 각 단계에서 필요한 voting
          power가 모이거나 timeout이 발생하면 다음 step 또는 round로 넘어간다.
          +2/3 voting power의 Precommit commit이 생기면 다음 height로 전진하며,
          가정을 유지하는 정상 프로토콜에서 다시 되돌리지 않는다.
        </p>
      </div>
    </section>
  );
}
