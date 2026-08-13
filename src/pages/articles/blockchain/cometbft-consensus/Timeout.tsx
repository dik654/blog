import { codeRefs } from "./codeRefs";
import TimeoutViz from "./viz/TimeoutViz";
import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Timeout({ onCodeRef }: Props) {
  return (
    <section id="timeout" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">타임아웃 전략 & 크래시 복구</h2>
      <div className="not-prose mb-8">
        <TimeoutViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Timeout 체인 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">4단계 Timeout 체인</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              <code>TimeoutParams</code> — ConsensusParams
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-sm text-center">
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium text-xs">Propose</p>
                <p className="text-xs text-muted-foreground font-mono">
                  기본 설정값
                </p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium text-xs">ProposeDelta</p>
                <p className="text-xs text-muted-foreground font-mono">
                  라운드별 증가폭
                </p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium text-xs">Vote</p>
                <p className="text-xs text-muted-foreground font-mono">
                  기본 설정값
                </p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium text-xs">VoteDelta</p>
                <p className="text-xs text-muted-foreground font-mono">
                  라운드별 증가폭
                </p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium text-xs">Commit</p>
                <p className="text-xs text-muted-foreground font-mono">
                  설정값
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Round R에서:{" "}
              <code>propose_timeout = Propose + R * ProposeDelta</code>,{" "}
              <code>vote_timeout = Vote + R * VoteDelta</code>
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">Timeout Chain</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. timeoutPropose</p>
                <p className="text-xs text-muted-foreground">
                  기본값 + round × delta
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Propose 없으면 발동 → <code>enterPrevote(nil)</code>
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. timeoutPrevote</p>
                <p className="text-xs text-muted-foreground">
                  투표 timeout 설정값
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  +2/3 any prevote but no majority →{" "}
                  <code>enterPrecommit(nil)</code>
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. timeoutPrecommit</p>
                <p className="text-xs text-muted-foreground">
                  투표 timeout 설정값
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  +2/3 any precommit but no majority →{" "}
                  <code>enterNewRound(R+1)</code>
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">4. timeoutCommit</p>
                <p className="text-xs text-muted-foreground">
                  commit timeout 설정값
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  느린 validator 따라잡기 → <code>enterNewRound(H+1, 0)</code>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">왜 linear backoff?</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center text-muted-foreground">
              <div className="bg-background rounded px-2 py-1.5">
                round 실패 = 네트워크 문제 가능성
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                점진적 대기 증가 → 안정화 기회
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                실측 지연에 맞게 네트워크별 조정
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>4단계 timeout</strong> 체인: Propose → Prevote → Precommit →
          Commit으로 이어진다.
          propose와 vote timeout은 기본값에 round별 delta를 더해 느린 네트워크에
          더 많은 시간을 준다. 다만
          실제 수치는 protocol 상수가 아니라 노드 설정과 버전의 일부이므로, 운영
          환경의 지연·블록 크기·애플리케이션 응답 시간으로 검증해야 한다.
        </p>

        {/* ── WAL Replay ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          WAL Replay — Crash Recovery
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                쓰기 — <code>handleMsg</code> 전
              </p>
              <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                <div className="bg-background/50 rounded px-2 py-1">
                  1. <code>cs.wal.Write(mi)</code> — 디스크에 기록
                </div>
                <div className="bg-background/50 rounded px-2 py-1">
                  2. <code>cs.wal.FlushAndSync()</code> — fsync
                </div>
                <div className="bg-background/50 rounded px-2 py-1">
                  3. 메시지 타입별 실제 처리
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                읽기 — <code>catchupReplay</code> (시작 시)
              </p>
              <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                <div className="bg-background/50 rounded px-2 py-1">
                  1. <code>SearchForEndHeight(csHeight)</code> — WAL 파일 열기
                </div>
                <div className="bg-background/50 rounded px-2 py-1">
                  2. <code>NewWALDecoder</code> → 순차 디코딩
                </div>
                <div className="bg-background/50 rounded px-2 py-1">
                  3. <code>readReplayMessage(msg)</code> — 새 메시지처럼 처리
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              Crash Recovery 시나리오
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. 정상 운영</p>
                <p className="text-xs text-muted-foreground">
                  Precommit(blockA) 이벤트가 WAL과 서명 경계를 통과
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. Crash</p>
                <p className="text-xs text-muted-foreground">
                  전원, OS 크래시 등으로 노드 중단
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. 재시작</p>
                <p className="text-xs text-muted-foreground">
                  WAL로 이벤트를 replay해 중단 전 합의 상태 재구성
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">4. 복구</p>
                <p className="text-xs text-muted-foreground">
                  재구성한 상태에서 라운드 진행을 계속함
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              → consensus 이벤트 복구; 서명 안전성은 영속 signer state와 함께
              확보
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">
              WAL 파일 구조 & Size 관리
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="text-xs">
                  <code>wal/WAL</code> (symlink) → <code>WAL.001</code>
                </p>
                <p className="text-xs">
                  <code>wal/WAL.001</code>, <code>WAL.002</code> (rotation)
                </p>
              </div>
              <div>
                <p className="text-xs">height 경과 시 rotation</p>
                <p className="text-xs">
                  현재 height의 wal만 crash recovery에 필요
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          WAL은 consensus event를 처리하기 전에 기록해 replay 가능한 순서를
          남기므로 <strong>crash recovery의 핵심</strong>이다. 다만
          WAL 단독을 이중 서명 방지 장치로 보지 않고, 영속 signer state와 같은
          키를 중복 실행하지 않는 운영 구성을 함께 적용해야 한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 단계별 타임아웃 체인</strong> — 제안 미도착 →
          timeoutPropose → nil prevote로 진행한다.
          propose·vote 타임아웃은 설정된 delta로 라운드마다 늘어날 수 있고,
          commit 대기는 다음 height 진입을 조율한다.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 WAL 기반 크래시 복구</strong> — 합의 이벤트를 처리 전에
          기록해 replay 가능한 순서를 만든다.
          크래시 후에는 WAL로 합의 흐름을 복원하고, 서명 안전성은 별도의 영속
          서명 상태와 함께 지킨다.
        </p>
      </div>
    </section>
  );
}
