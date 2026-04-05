import ContextViz from './viz/ContextViz';
import SyncModesViz from './viz/SyncModesViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동기화 전략 비교</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 각 동기화 모드의 내부 동작과 모드 전환 로직을 코드 수준으로 추적한다.
        </p>

        {/* ── 3가지 동기화 모드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3가지 동기화 모드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 3 sync modes:

// 1. Initial Sync (=Full Sync)
// - genesis부터 block-by-block 재생
// - 소요: 수 일 (Phase0 이후 ~수 년 데이터)
// - 디스크 최대
// - 완전 신뢰 없음 (자체 검증)

// 2. Checkpoint Sync (=Snap Sync 변종)
// - trusted URL에서 finalized state 다운로드
// - 소요: 수 분
// - 신뢰 가정: checkpoint URL 정직
// - 일반 사용자 권장

// 3. Regular Sync (=Live Sync)
// - Initial/Checkpoint 완료 후 자동 전환
// - 실시간 gossip 블록 수신
// - 블록당 ~100ms 처리
// - validator 운영 모드

// 모드 전환:
// (Initial or Checkpoint) → Regular
// 완료 조건: head slot이 network tip에 도달

// 결정 로직:
func (s *Service) decideSyncMode() SyncMode {
    if s.checkpointURL != "" {
        return CheckpointSync  // URL 제공 시
    }
    if s.dbHead != 0 {
        return RegularSync  // 기존 DB 존재
    }
    return InitialSync  // genesis부터 시작
}

// 사용 권장:
// - Solo staker: Checkpoint Sync (빠른 시작)
// - Archive provider: Initial Sync (완전성)
// - Research/analysis: Initial Sync + archive
// - Running validator: Checkpoint + Regular`}
        </pre>
        <p className="leading-7">
          Prysm은 <strong>3가지 sync mode</strong> 지원.<br />
          Initial(완전) / Checkpoint(빠름) / Regular(실시간).<br />
          용도별 선택: staker는 Checkpoint, archive는 Initial.
        </p>
      </div>
      <div className="not-prose mt-6"><SyncModesViz /></div>
    </section>
  );
}
