import CacheHierarchyViz from './viz/CacheHierarchyViz';
import PrimeProbeViz from './viz/PrimeProbeViz';
import EvictionSetViz from './viz/EvictionSetViz';
import FlushReloadViz from './viz/FlushReloadViz';
import AesTtableViz from './viz/AesTtableViz';

export default function Cache() {
  return (
    <section id="cache" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cache Timing 공격 (Prime+Probe)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">캐시 timing의 원리</h3>
        <p>
          <strong>캐시 hit vs miss</strong>: 수 사이클 vs 200+ 사이클 (메모리 접근)<br />
          <strong>측정 가능</strong>: RDTSCP로 나노초 단위 정확도<br />
          <strong>공격 표면</strong>: LLC(Last Level Cache)가 core 간 공유 → 다른 CPU에서 관측 가능<br />
          <strong>핵심 통찰</strong>: 비밀 데이터에 의존하는 lookup은 캐시 접근 패턴으로 leak
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cache 계층 구조</h3>
        <div className="not-prose mb-6"><CacheHierarchyViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Prime+Probe 3단계</h3>
        <div className="not-prose mb-6"><PrimeProbeViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Eviction Set 구성</h3>
        <div className="not-prose mb-6"><EvictionSetViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Flush+Reload (shared memory 공격)</h3>
        <div className="not-prose mb-6"><FlushReloadViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">AES T-table 공격 예</h3>
        <div className="not-prose mb-6"><AesTtableViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Cache-Allocation Technology (CAT)</p>
          <p>
            <strong>Intel CAT</strong>: LLC의 각 way를 프로세스에 할당<br />
            - 공격자와 victim이 다른 way 사용하도록<br />
            - 동적 파티셔닝 (MSR로 설정)
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            ✓ 하드웨어 지원 → 강력한 격리<br />
            ✓ 성능 영향 예측 가능<br />
            ✓ Noisy neighbor 문제도 완화
          </p>
          <p className="mt-2">
            <strong>한계</strong>:<br />
            ✗ SMT로 우회 가능 (같은 core 내부)<br />
            ✗ way 수 제한 (보통 16) → VM 수 제약<br />
            ✗ Intel only (AMD도 유사 기능 준비 중)<br />
            ✗ SGX enclave 레벨 세분화 어려움
          </p>
        </div>

      </div>
    </section>
  );
}
