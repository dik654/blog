import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function CheckpointSync({ onCodeRef: _ }: Props) {
  return (
    <section id="checkpoint-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인트 싱크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Checkpoint sync는 신뢰하는 source에서 recent finalized state와 연결된 block을 받아 bootstrap합니다. Genesis부터 모든 state transition을 replay하지 않아 과거 history 처리량을 줄이지만, 다운로드·SSZ validation·database initialization 시간은 state 크기, network와 storage에 따라 달라집니다.
        </p>

        {/* ── Checkpoint Sync 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          CheckpointSync 구현 흐름
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-1">
              CLI 플래그
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-foreground/70 font-mono">
              <span>
                --checkpoint-sync-url=https://&lt;trusted-provider&gt;
              </span>
              <span>
                --genesis-beacon-api-url=https://&lt;trusted-provider&gt;
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              <code>doCheckpointSync()</code> — 6단계 흐름
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">
                  1
                </span>
                <div className="text-foreground/80">
                  genesis 정보 다운로드 — <code>fetchGenesisState(url)</code>.{" "}
                  <code>genesis_validators_root</code>와 config 일치 검증
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">
                  2
                </span>
                <div className="text-foreground/80">
                  finalized state 다운로드 —{" "}
                  <code>GET /eth/v2/debug/beacon/states/finalized</code> →{" "}
                  <code>UnmarshalSSZ</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">
                  3
                </span>
                <div className="text-foreground/80">
                  block root 계산 —{" "}
                  <code>LatestBlockHeader.HashTreeRoot()</code>. 주의:{" "}
                  <code>state_root</code>를 먼저 채워야 함(ZERO_HASH 문제)
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">
                  4
                </span>
                <div className="text-foreground/80">
                  finalized block 다운로드 —{" "}
                  <code>GET /eth/v2/beacon/blocks/{"{blockRoot}"}</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">
                  5
                </span>
                <div className="text-foreground/80">
                  DB 초기화 — <code>SaveGenesisState</code> /{" "}
                  <code>SaveState</code> / <code>SaveBlock</code> /{" "}
                  <code>SetHead</code> / <code>SetFinalizedCheckpoint</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-cyan-500/50 pl-3">
                <span className="font-mono text-xs text-cyan-500 shrink-0">
                  6
                </span>
                <div className="text-foreground/80">
                  P2P 시작 후 tip까지 Regular Sync로 진전
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              전송: state 크기·대역폭
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              검증: SSZ·root·block 연결
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              저장: DB·디스크 성능
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              추격: checkpoint와 head 간격
            </div>
          </div>
        </div>
        <p>
          Finalized state와 matching block으로 database를 초기화한 뒤에는 range sync 또는 regular sync로 current head까지 따라갑니다. Checkpoint가 오래될수록 이후에 처리할 block range가 커지므로 source의 freshness와 local execution environment를 함께 봐야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">동작 과정</h3>
        <ul>
          <li>
            <strong>체크포인트 URL 설정</strong> —{" "}
            <code>--checkpoint-sync-url</code> 플래그로 지정
          </li>
          <li>
            <strong>Finalized State 다운로드</strong> —
            /eth/v2/debug/beacon/states/finalized
          </li>
          <li>
            <strong>Finalized Block 다운로드</strong> — 해당 상태의 블록도 함께
            받음
          </li>
          <li>
            <strong>DB 초기화</strong> — 다운로드한 상태·블록으로 DB를 설정
          </li>
        </ul>

        {/* ── 신뢰 소스 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          신뢰할 수 있는 체크포인트 소스
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              provider를 고르는 기준
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">네트워크</span> — genesis validators
                root와 chain config 일치
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">신선도</span> — 현재 WS period 안의
                finalized checkpoint
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">독립성</span> — 같은 backend를
                공유하지 않는 여러 출처
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">인증</span> — 운영 주체와 TLS
                endpoint를 별도 채널로 확인
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                신뢰 검증 절차
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>1. 여러 소스에서 같은 checkpoint 가져오기</p>
                <p>
                  2. <code>state_root</code> / <code>block_root</code> 비교
                </p>
                <p>3. 모두 일치하면 신뢰 / 불일치 → 다른 소스 시도</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">
                Weak Subjectivity Check
              </p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>
                  checkpoint의 나이를 현재 <code>WS_PERIOD</code> 계산과 비교
                </p>
                <p>기간은 활성 검증자 집합·churn·fork 규칙에 따라 변함</p>
                <p>오래되었거나 출처가 불명확한 checkpoint는 사용하지 않음</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              TLS 필수 (MITM 방지)
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              HTTPS + 검증된 CA
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              Self-hosted 가능
            </div>
          </div>
        </div>
        <p>
          Checkpoint URL은 root를 처음 신뢰하는 bootstrap boundary이므로 transport security만으로 충분하지 않습니다. 서로 독립적인 source와 community-published checkpoint를 비교하고, node가 weak-subjectivity period보다 오래 offline이었다면 별도의 trusted channel로 recent checkpoint root를 확보해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 Weak Subjectivity 보안</strong> — 체크포인트 싱크는 Weak
          subjectivity assumption 안에서 안전합니다. 이 기간보다 오래 offline이었던 node는 기존 local view만으로 conflicting long-range history를 구분할 수 없으므로 신뢰할 수 있는 별도 channel에서 recent checkpoint를 다시 받아야 합니다.
        </p>
      </div>
    </section>
  );
}
