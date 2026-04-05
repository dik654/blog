import { codeRefs } from './codeRefs';
import TimeoutViz from './viz/TimeoutViz';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Timeout 파라미터 (ConsensusParams)
type TimeoutParams struct {
    Propose        time.Duration  // 3s
    ProposeDelta   time.Duration  // 500ms
    Vote           time.Duration  // 1s
    VoteDelta      time.Duration  // 500ms
    Commit         time.Duration  // 1s
}

// Round R에서의 timeout:
// propose_timeout = Propose + R * ProposeDelta
// prevote_timeout = Vote + R * VoteDelta
// precommit_timeout = Vote + R * VoteDelta
// commit_timeout = Commit

// Timeout chain:
// 1. timeoutPropose (R=0: 3s, R=1: 3.5s, R=2: 4s, ...)
//    - Propose 없으면 발동
//    - → enterPrevote(nil)
//
// 2. timeoutPrevote (R=0: 1s, R=1: 1.5s, ...)
//    - +2/3 Any prevote 있지만 majority 없을 때 발동
//    - → enterPrecommit(nil)
//
// 3. timeoutPrecommit (R=0: 1s, R=1: 1.5s, ...)
//    - +2/3 Any precommit 있지만 majority 없을 때 발동
//    - → enterNewRound(R+1)
//
// 4. timeoutCommit (1s)
//    - commit step 후 대기
//    - 느린 validator 따라잡기 기회
//    - → enterNewRound(H+1, 0)

// 왜 linear backoff?
// - round 실패 = 네트워크 문제 가능성
// - 점진적 대기 증가 → 안정화 기회
// - 과도한 round 방지 (현재 메인넷 round 3 이하 99%)

// 구현:
func (cs *State) scheduleTimeout(...) {
    cs.timeoutTicker.ScheduleTimeout(timeoutInfo{
        Duration: timeout,
        Height: height,
        Round: round,
        Step: step,
    })
}`}
        </pre>
        <p className="leading-7">
          <strong>4단계 timeout</strong> 체인: Propose → Prevote → Precommit → Commit.<br />
          각 round마다 linear backoff (500ms 증가).<br />
          메인넷 round 3 이하 99% → timeout 설정 적절.
        </p>

        {/* ── WAL Replay ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">WAL Replay — Crash Recovery</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// WAL (Write-Ahead Log) 복구 메커니즘

// 쓰기 (handleMsg 전):
func (cs *State) handleMsg(mi msgInfo) {
    cs.wal.Write(mi)    // 디스크에 fsync
    cs.wal.FlushAndSync()

    // 그 다음 실제 처리
    switch msg := mi.Msg.(type) {
    ...
    }
}

// 읽기 (시작 시):
func (cs *State) catchupReplay(csHeight int64) error {
    // 1. WAL 파일 열기
    walFile, _ := cs.wal.SearchForEndHeight(csHeight, nil)

    // 2. WAL 항목 순차 재생
    decoder := NewWALDecoder(walFile)
    for {
        msg, err := decoder.Decode()
        if err == io.EOF { break }

        // 마치 새 메시지처럼 처리
        cs.readReplayMessage(msg)
    }

    return nil
}

// Crash Recovery 시나리오:
// 1. 노드 t=100s에 Precommit(blockA) 서명 + WAL 기록
// 2. fsync 완료 (블록 WAL file에 안전하게 저장)
// 3. 노드 crash (전원, OS 크래시 등)
// 4. 재시작: WAL 읽음
// 5. Precommit(blockA)을 이미 서명했음 발견
// 6. 같은 블록에 같은 서명 재방송
// 7. 다른 블록 서명 시도 → 거부 (이미 Precommit 기록됨)
//
// → 이중 서명 방지 + consensus 복구

// WAL 파일 구조:
// wal/
//   ├── WAL (symlink to WAL.001)
//   ├── WAL.001
//   └── WAL.002  (rotation)

// Size 관리:
// - height 경과 시 rotation
// - 오래된 wal 파일 삭제 가능
// - 현재 height의 wal만 crash recovery에 필요`}
        </pre>
        <p className="leading-7">
          WAL이 <strong>crash recovery의 핵심</strong>.<br />
          매 consensus event를 fsync 후 처리 → crash 후 정확 복구.<br />
          이미 서명한 vote 재발견 → 이중 서명 원천 방지.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 단계별 타임아웃 체인</strong> — 제안 미도착 → timeoutPropose → nil prevote.<br />
          모든 타임아웃은 라운드마다 선형 증가(linear backoff) → 네트워크 안정화 대기.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 WAL 기반 크래시 복구</strong> — WriteSync로 자신의 투표를 디스크에 확정.<br />
          크래시 후 WAL 리플레이 → 마지막 합의 상태 복원, 이중 서명 위험 제거.
        </p>
      </div>
    </section>
  );
}
