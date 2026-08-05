import MemoryManagementViz from './viz/MemoryManagementViz';
import MemoryTypesViz from './viz/MemoryTypesViz';
import PageAllocViz from './viz/PageAllocViz';
import TzascDramLayoutViz from './viz/TzascDramLayoutViz';
import MemTypesEnumViz from './viz/MemTypesEnumViz';
import MmuPageTableViz from './viz/MmuPageTableViz';
import HeapAllocatorViz from './viz/HeapAllocatorViz';
import SharedMemoryFlowViz from './viz/SharedMemoryFlowViz';

export default function MemoryManagement() {
  return (
    <section id="memory-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 관리 &amp; 페이지 테이블 격리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">OP-TEE 메모리 격리</h3>
        <p>
          <strong>TZASC</strong>(TrustZone Address Space Controller)가 DRAM을 Secure/Normal 영역으로 분할<br />
          <strong>S-bit</strong>(Security bit): bus transaction에 전파되어 HW 레벨 접근 제어<br />
          <strong>TLB entry</strong>마다 NS 비트 포함 → 잘못된 world 접근 시 fault<br />
          <strong>다층 보호</strong>: MMU + ASLR + NX + stack canary + KASAN
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 분할 (TZASC 설정)</h3>
      </div>
      <div className="not-prose mb-6"><TzascDramLayoutViz /></div>
      <MemoryManagementViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 영역 분류 (core/mm/core_mmu.c)</h3>
      </div>
      <div className="not-prose mb-6"><MemoryTypesViz /></div>
      <div className="not-prose mb-6"><MemTypesEnumViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">MMU 페이지 테이블 (AArch64)</h3>
      </div>
      <div className="not-prose mb-6"><MmuPageTableViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">보안 페이지 할당자 & 캐시</h3>
      </div>
      <div className="not-prose mb-6"><PageAllocViz /></div>
      <div className="not-prose mb-6"><HeapAllocatorViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Shared Memory — 두 세계 간 통신</h3>
      </div>
      <div className="not-prose mb-6"><SharedMemoryFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: OP-TEE 메모리 보호의 현실적 제약</p>
          <p>
            <strong>TZASC 의존성</strong>:<br />
            - Secure memory 영역은 부팅 시 고정<br />
            - 런타임 동적 크기 조정 어려움<br />
            - Secure DRAM 크기 사전 계획 필수 (보통 16~64MB)
          </p>
          <p className="mt-2">
            <strong>Cache coherency 이슈</strong>:<br />
            - Secure/Non-secure 캐시 line 분리 됨 (동일 PA 두 엔트리)<br />
            - Shared memory 동기화 시 cache flush 필수<br />
            - Performance impact 주의
          </p>
          <p className="mt-2">
            <strong>Side channel 취약성</strong>:<br />
            - SGX/TDX와 달리 LLC 파티셔닝 부재 (일부 ARM)<br />
            - 캐시 timing 공격 가능<br />
            - TrustZone 자체 완화책 제한적
          </p>
        </div>

      </div>
    </section>
  );
}
