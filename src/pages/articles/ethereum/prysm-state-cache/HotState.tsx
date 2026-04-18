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
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>hotStateCache</code> 구조</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span><code>cache *lru.Cache</code> — LRU eviction</span>
              <span><code>lock sync.RWMutex</code> — 다중 reader + 단일 writer</span>
              <span>Key: <code>state_root</code> (<code>[32]byte</code>)</span>
              <span>Value: <code>*BeaconState</code> (in-memory pointer, COW 공유)</span>
              <span>용량: 32 entries (약 2 epoch)</span>
              <span>메모리: ~500 MB ~ 1 GB (COW 공유)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2"><code>get(root)</code></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li><code>RLock()</code> 획득 (다중 reader 허용)</li>
                <li><code>cache.Get(root)</code> 조회</li>
                <li>hit 시 <code>state.Copy()</code> 반환 → 호출자가 자유롭게 수정 가능</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2"><code>put(root, state)</code></h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li><code>Lock()</code> 획득 (단일 writer)</li>
                <li><code>cache.Add(root, state)</code></li>
                <li>LRU가 자동으로 오래된 entry 제거</li>
              </ul>
            </div>
          </div>
        </div>
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
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>StateByRoot</code> — 4단계 fallback</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-green-500/10 border border-green-500/20 p-2">
                <span className="font-mono font-medium shrink-0 w-12 text-center">Step 1</span>
                <div><code>hotStateCache.get(blockRoot)</code> — Hot cache 확인 → <strong>~us</strong></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-green-500/5 border border-green-500/10 p-2">
                <span className="font-mono font-medium shrink-0 w-12 text-center">Step 2</span>
                <div><code>epochBoundaryStateCache.get(blockRoot)</code> — epoch boundary cache → hit 시 hot cache로 promote → <strong>~수 us</strong></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-blue-500/10 border border-blue-500/20 p-2">
                <span className="font-mono font-medium shrink-0 w-12 text-center">Step 3</span>
                <div><code>loadFinalizedState(blockRoot)</code> — finalized state DB 조회 → <strong>~50ms</strong></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-amber-500/10 border border-amber-500/20 p-2">
                <span className="font-mono font-medium shrink-0 w-12 text-center">Step 4</span>
                <div><code>findNearestSavedState</code> → <code>loadStateFromDB</code> → <code>ReplayBlocks</code> → cache 저장 → <strong>수백 ms ~ 수 초</strong></div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">성능 분포 (메인넷)</h4>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div><span className="text-green-500 font-medium">90%</span> — ~us (hot cache)</div>
              <div><span className="text-blue-500 font-medium">9%</span> — ~50ms (DB finalized)</div>
              <div><span className="text-amber-500 font-medium">1%</span> — 수백 ms (replay)</div>
            </div>
          </div>
        </div>
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
