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
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3"><code>TimeoutParams</code> — ConsensusParams</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-sm text-center">
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium text-xs">Propose</p>
                <p className="text-xs text-muted-foreground font-mono">3s</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium text-xs">ProposeDelta</p>
                <p className="text-xs text-muted-foreground font-mono">500ms</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium text-xs">Vote</p>
                <p className="text-xs text-muted-foreground font-mono">1s</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium text-xs">VoteDelta</p>
                <p className="text-xs text-muted-foreground font-mono">500ms</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium text-xs">Commit</p>
                <p className="text-xs text-muted-foreground font-mono">1s</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Round R에서: <code>propose_timeout = Propose + R * ProposeDelta</code>, <code>vote_timeout = Vote + R * VoteDelta</code></p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">Timeout Chain</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. timeoutPropose</p>
                <p className="text-xs text-muted-foreground">R=0: 3s, R=1: 3.5s, R=2: 4s...</p>
                <p className="text-xs text-muted-foreground mt-1">Propose 없으면 발동 → <code>enterPrevote(nil)</code></p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. timeoutPrevote</p>
                <p className="text-xs text-muted-foreground">R=0: 1s, R=1: 1.5s...</p>
                <p className="text-xs text-muted-foreground mt-1">+2/3 any prevote but no majority → <code>enterPrecommit(nil)</code></p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. timeoutPrecommit</p>
                <p className="text-xs text-muted-foreground">R=0: 1s, R=1: 1.5s...</p>
                <p className="text-xs text-muted-foreground mt-1">+2/3 any precommit but no majority → <code>enterNewRound(R+1)</code></p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">4. timeoutCommit</p>
                <p className="text-xs text-muted-foreground">1s (고정)</p>
                <p className="text-xs text-muted-foreground mt-1">느린 validator 따라잡기 → <code>enterNewRound(H+1, 0)</code></p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">왜 linear backoff?</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-center text-muted-foreground">
              <div className="bg-background rounded px-2 py-1.5">round 실패 = 네트워크 문제 가능성</div>
              <div className="bg-background rounded px-2 py-1.5">점진적 대기 증가 → 안정화 기회</div>
              <div className="bg-background rounded px-2 py-1.5">메인넷 round 3 이하 99%</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>4단계 timeout</strong> 체인: Propose → Prevote → Precommit → Commit.<br />
          각 round마다 linear backoff (500ms 증가).<br />
          메인넷 round 3 이하 99% → timeout 설정 적절.
        </p>

        {/* ── WAL Replay ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">WAL Replay — Crash Recovery</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">쓰기 — <code>handleMsg</code> 전</p>
              <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                <div className="bg-background/50 rounded px-2 py-1">1. <code>cs.wal.Write(mi)</code> — 디스크에 기록</div>
                <div className="bg-background/50 rounded px-2 py-1">2. <code>cs.wal.FlushAndSync()</code> — fsync</div>
                <div className="bg-background/50 rounded px-2 py-1">3. 메시지 타입별 실제 처리</div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">읽기 — <code>catchupReplay</code> (시작 시)</p>
              <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                <div className="bg-background/50 rounded px-2 py-1">1. <code>SearchForEndHeight(csHeight)</code> — WAL 파일 열기</div>
                <div className="bg-background/50 rounded px-2 py-1">2. <code>NewWALDecoder</code> → 순차 디코딩</div>
                <div className="bg-background/50 rounded px-2 py-1">3. <code>readReplayMessage(msg)</code> — 새 메시지처럼 처리</div>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">Crash Recovery 시나리오</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. 정상 운영</p>
                <p className="text-xs text-muted-foreground">t=100s에 Precommit(blockA) 서명 + WAL 기록. fsync 완료</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. Crash</p>
                <p className="text-xs text-muted-foreground">전원, OS 크래시 등으로 노드 중단</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. 재시작</p>
                <p className="text-xs text-muted-foreground">WAL 읽음 → Precommit(blockA) 이미 서명했음 발견</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">4. 복구</p>
                <p className="text-xs text-muted-foreground">같은 블록에 같은 서명 재방송. 다른 블록 서명 → 거부</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">→ 이중 서명 방지 + consensus 복구</p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">WAL 파일 구조 & Size 관리</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="text-xs"><code>wal/WAL</code> (symlink) → <code>WAL.001</code></p>
                <p className="text-xs"><code>wal/WAL.001</code>, <code>WAL.002</code> (rotation)</p>
              </div>
              <div>
                <p className="text-xs">height 경과 시 rotation</p>
                <p className="text-xs">현재 height의 wal만 crash recovery에 필요</p>
              </div>
            </div>
          </div>
        </div>
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
