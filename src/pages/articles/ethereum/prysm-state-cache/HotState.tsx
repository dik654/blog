import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function HotState({ onCodeRef }: Props) {
  return (
    <section id="hot-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hot State 캐시</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Hot State는 최근 수 에폭(기본 2 에폭, ~12.8분)의 상태를 메모리에 유지한다.<br />
          Fork Choice, 어테스테이션 검증 등 빈번한 읽기에 즉시 응답한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('state-by-root', codeRefs['state-by-root'])} />
          <span className="text-[10px] text-muted-foreground self-center">StateByRoot() — 캐시 우선 조회</span>
        </div>

        {/* ── hotStateCache 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">hotStateCache 내부 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 hot state 캐시 (in-memory)
type hotStateCache struct {
    cache *lru.Cache   // LRU eviction
    lock  sync.RWMutex
}

// 구성:
// - Key: state_root (Bytes32)
// - Value: *BeaconState (in-memory pointer, COW 공유)
// - 용량: 32 entries (약 2 epoch worth)

// 동작:
func (c *hotStateCache) get(root [32]byte) (*BeaconState, bool) {
    c.lock.RLock()
    defer c.lock.RUnlock()
    if s, ok := c.cache.Get(root); ok {
        // Copy() 반환 → 호출자가 자유롭게 수정 가능
        return s.(*BeaconState).Copy(), true
    }
    return nil, false
}

func (c *hotStateCache) put(root [32]byte, state *BeaconState) {
    c.lock.Lock()
    defer c.lock.Unlock()
    c.cache.Add(root, state)
    // LRU가 자동으로 오래된 entry 제거
}

// 메모리 사용:
// 32 state × 250 MB × COW 공유 = 약 500 MB~1 GB
// (COW로 대부분 필드 공유, 실제 고유 데이터만 계산)

// 동기화:
// sync.RWMutex로 다중 reader + 단일 writer
// Fork choice는 RLock (다중 조회)
// 새 state 저장은 Lock (1회 쓰기)`}
        </pre>
        <p className="leading-7">
          hotStateCache는 <strong>LRU 기반 in-memory 캐시</strong>.<br />
          32 entry × COW 공유로 ~500MB 사용 (naive 8GB 대비 절감).<br />
          RWMutex로 fork choice의 다중 조회 최적화.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">캐시 관리</h3>
        <ul>
          <li><strong>Copy-on-Write</strong> — 캐시에서 반환 시 복사본을 제공해 원본 보호</li>
          <li><strong>에폭 전환 시 정리</strong> — Finalized 이전 에폭의 상태를 캐시에서 제거</li>
          <li><strong>메모리 제한</strong> — 최대 N개 상태만 유지 (LRU 퇴출)</li>
        </ul>

        {/* ── StateByRoot 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateByRoot — 계층적 조회 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`func (s *Service) StateByRoot(
    ctx context.Context,
    blockRoot [32]byte,
) (*BeaconState, error) {
    // Step 1: Hot cache 확인
    if state, ok := s.hotStateCache.get(blockRoot); ok {
        return state, nil  // ~μs
    }

    // Step 2: Epoch boundary cache (epoch-granularity)
    if state, ok := s.epochBoundaryStateCache.get(blockRoot); ok {
        s.hotStateCache.put(blockRoot, state)  // promote
        return state, nil  // ~수 μs
    }

    // Step 3: finalized state DB 확인
    if isFinalized(blockRoot) {
        state, err := s.loadFinalizedState(blockRoot)
        if err == nil {
            return state, nil  // ~50ms (DB read)
        }
    }

    // Step 4: Replay 경로
    // 가장 가까운 saved state 찾기
    slot, err := s.beaconDB.Slot(blockRoot)
    nearest := s.findNearestSavedState(slot)

    // 해당 state 로드
    base, err := s.loadStateFromDB(nearest.root)

    // Replay 수행
    blocks, err := s.loadBlocksBetween(nearest.slot, slot)
    finalState, err := ReplayBlocks(base, blocks, slot)

    // Cache에 저장
    s.hotStateCache.put(blockRoot, finalState)
    return finalState, nil  // 수백 ms ~ 수 초
}

// 성능 분포 (메인넷):
// 90%: ~μs (hot cache)
// 9%:  ~50ms (DB finalized)
// 1%:  수백 ms (replay)`}
        </pre>
        <p className="leading-7">
          <code>StateByRoot</code>가 <strong>4단계 fallback</strong>.<br />
          90%+ hot cache hit → 대부분 μs 수준 응답.<br />
          Replay는 drastic cases에서만 — 일상 운영에서 드물게 필요.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 90%+ 캐시 히트율</strong> — 대부분의 상태 조회는 최근 에폭에 집중.<br />
          Hot 캐시 덕분에 DB 접근 없이 완료.<br />
          메인넷 기준 캐시 히트율 90% 이상.
        </p>
      </div>
    </section>
  );
}
