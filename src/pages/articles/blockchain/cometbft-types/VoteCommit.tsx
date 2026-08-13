import VoteSetViz from "./viz/VoteSetViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function VoteCommit({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="vote-commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Vote · VoteSet · 2/3+ 판정</h2>
      <div className="not-prose mb-8">
        <VoteSetViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Vote 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Vote 구조 — 9 필드</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                <code>Vote</code> — cometbft/types/vote.go
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">Type</code>
                  <span className="text-xs text-muted-foreground">
                    <code>SignedMsgType</code> — Prevote(1) or Precommit(2)
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">Height</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int64</code> — 블록 높이
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">Round</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int32</code> — 현재 라운드
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">BlockID</code>
                  <span className="text-xs text-muted-foreground">
                    <code>BlockID</code> — 투표 대상 블록
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">Timestamp</code>
                  <span className="text-xs text-muted-foreground">
                    <code>time.Time</code> — 서명 시각
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">ValidatorAddress</code>
                  <span className="text-xs text-muted-foreground">
                    <code>Address</code> — 서명자 주소
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">ValidatorIndex</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int32</code> — ValidatorSet 내 인덱스
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">Signature</code>
                  <span className="text-xs text-muted-foreground">
                    <code>[]byte</code> — Ed25519 서명
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">Extension</code>
                  <span className="text-xs text-muted-foreground">
                    <code>[]byte</code> — ABCI 2.0+ vote extension
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <code className="text-xs">ExtensionSignature</code>
                  <span className="text-xs text-muted-foreground">
                    <code>[]byte</code> — extension 서명
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">
                  <code>CanonicalVote</code> (서명 대상)
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between border-b border-border/30 py-0.5">
                    <code className="text-xs">Type</code>
                    <span className="text-xs text-muted-foreground">
                      <code>SignedMsgType</code>
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 py-0.5">
                    <code className="text-xs">Height</code>
                    <span className="text-xs text-muted-foreground">
                      <code>int64</code>
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 py-0.5">
                    <code className="text-xs">Round</code>
                    <span className="text-xs text-muted-foreground">
                      <code>int64</code>
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 py-0.5">
                    <code className="text-xs">BlockID</code>
                    <span className="text-xs text-muted-foreground">
                      <code>*CanonicalBlockID</code>
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 py-0.5">
                    <code className="text-xs">Timestamp</code>
                    <span className="text-xs text-muted-foreground">
                      <code>time.Time</code>
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <code className="text-xs">ChainID</code>
                    <span className="text-xs text-muted-foreground">
                      <code>string</code>
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Vote 서명 흐름</p>
                <div className="grid grid-cols-4 gap-1 text-xs text-center text-muted-foreground">
                  <div className="bg-background rounded px-2 py-1.5">
                    1. CanonicalVote 생성
                  </div>
                  <div className="bg-background rounded px-2 py-1.5">
                    2. Protobuf encode
                  </div>
                  <div className="bg-background rounded px-2 py-1.5">
                    3. Ed25519 서명
                  </div>
                  <div className="bg-background rounded px-2 py-1.5">
                    4. 네트워크 방송
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Vote 타입</p>
              <div className="grid grid-cols-3 gap-2 text-sm text-center text-muted-foreground">
                <div className="bg-background rounded px-2 py-1.5">
                  <strong className="block text-foreground/80">Prevote</strong>
                  <span className="mt-1 block text-xs">block 지지 또는 nil</span>
                </div>
                <div className="bg-background rounded px-2 py-1.5">
                  <strong className="block text-foreground/80">Precommit</strong>
                  <span className="mt-1 block text-xs">lock 이후 commit vote</span>
                </div>
                <div className="bg-background rounded px-2 py-1.5">
                  <strong className="block text-foreground/80">Proposal</strong>
                  <span className="mt-1 block text-xs">proposer의 별도 signed message</span>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Timestamp 역할</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>네트워크 시간 동기화</li>
                <li>byzantine 탐지 (심한 drift)</li>
                <li>Nakamoto median 시간 계산</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          Vote는 height, round, vote type, block ID, timestamp와 validator identity를 담고 Ed25519 signature를 붙입니다. Sign bytes는 protobuf object를 그대로 쓰지 않고 <code>CanonicalVote</code> 형태로 정규화해 모든 implementation이 같은 byte sequence에 서명하도록 합니다. Proposal은 별도 signed message이며 consensus vote type은 prevote와 precommit 두 가지입니다.
        </p>

        {/* ── VoteSet 2/3+ 판정 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          VoteSet — 2/3+ 집계 & 판정
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                <code>VoteSet</code> — 특정 높이/라운드/타입의 Vote 집계
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">chainID</code>
                  <span className="text-xs text-muted-foreground">
                    <code>string</code>
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">height / round</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int64</code> / <code>int32</code>
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">signedMsgType</code>
                  <span className="text-xs text-muted-foreground">
                    <code>SignedMsgType</code>
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">votesBitArray</code>
                  <span className="text-xs text-muted-foreground">
                    <code>*bits.BitArray</code> — validator별 투표 여부
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">votes</code>
                  <span className="text-xs text-muted-foreground">
                    <code>[]*Vote</code> — index → Vote
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">sum</code>
                  <span className="text-xs text-muted-foreground">
                    <code>int64</code> — 집계된 voting power
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">maj23</code>
                  <span className="text-xs text-muted-foreground">
                    <code>*BlockID</code> — +2/3 달성 시
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/30 py-0.5">
                  <code className="text-xs">votesByBlock</code>
                  <span className="text-xs text-muted-foreground">
                    <code>map[string]*blockVotes</code>
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <code className="text-xs">peerMaj23s</code>
                  <span className="text-xs text-muted-foreground">
                    <code>map[P2PID]BlockID</code>
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">
                  <code>blockVotes</code>
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between border-b border-border/30 py-0.5">
                    <code className="text-xs">peerMaj23</code>
                    <span className="text-xs text-muted-foreground">
                      <code>bool</code>
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 py-0.5">
                    <code className="text-xs">bitArray</code>
                    <span className="text-xs text-muted-foreground">
                      <code>*bits.BitArray</code>
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/30 py-0.5">
                    <code className="text-xs">votes</code>
                    <span className="text-xs text-muted-foreground">
                      <code>[]*Vote</code>
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <code className="text-xs">sum</code>
                    <span className="text-xs text-muted-foreground">
                      <code>int64</code>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">
                  왜 blockKey별 분리 집계?
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>한 라운드에 여러 블록 투표 가능 (byzantine nodes)</li>
                  <li>각 블록별 sum 분리 → 정확한 2/3+ 판정</li>
                  <li>byzantine equivocation 즉시 감지</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              <code>AddVote()</code> — 3단계 동작
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">
                  1. 중복 체크 (equivocation 감지)
                </p>
                <p className="text-xs text-muted-foreground">
                  <code>votesBitArray.GetIndex(idx)</code> → 이미 투표 존재 +
                  BlockID 상이 → <code>ErrEquivocation</code> (slash 대상)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">
                  2. blockKey별 분리 집계
                </p>
                <p className="text-xs text-muted-foreground">
                  <code>votesByBlock[blockKey]</code>에 vote 추가 + sum +=
                  ValidatorPower
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. 2/3+ 판정</p>
                <p className="text-xs text-muted-foreground">
                  <code>sum * 3 {">"} totalPower * 2</code> →{" "}
                  <code>maj23 = &amp;vote.BlockID</code>
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>VoteSet</code>은 같은 round의 vote를 block key별로 분리해 voting power를 합산합니다. Byzantine validator가 서로 다른 block에 conflicting vote를 보낼 수 있으므로 단순한 전체 vote 수만 세면 안 됩니다. 한 block key가 3분의 2를 넘으면 <code>maj23</code>가 설정되고 prevote 단계에서는 polka, precommit 단계에서는 commit으로 진행할 근거가 됩니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>{"💡"} votesByBlock 맵을 쓰는 이유</strong> — 같은 라운드에서
          여러 block에 vote가 분산될 수 있기 때문입니다. Block key별 sum을 분리해야 정확한 3분의 2 threshold를 계산할 수 있고, 같은 validator index에서 다른 block ID의 vote가 들어오면 conflicting-vote evidence 후보도 식별할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
