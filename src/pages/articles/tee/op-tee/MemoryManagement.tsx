import MemoryManagementViz from './viz/MemoryManagementViz';
import MemoryTypesViz from './viz/MemoryTypesViz';
import PageAllocViz from './viz/PageAllocViz';

export default function MemoryManagement() {
  return (
    <section id="memory-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 관리 & 페이지 테이블 격리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          OP-TEE는 ARM TrustZone의 <strong>S-bit(Security bit)</strong>를 활용해
          Secure/Non-Secure 메모리를 물리적으로 격리합니다.<br />
          MMU(Memory Management Unit) 페이지 테이블로 가상 주소를 관리합니다.<br />
          ASLR, NX 비트, 스택 카나리 등 다층 보호를 적용합니다.
        </p>
      </div>

      <MemoryManagementViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>메모리 영역 분류 (core/mm/core_mmu.c)</h3>
      </div>
      <div className="not-prose mb-6"><MemoryTypesViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>보안 페이지 할당자 & 캐시</h3>
      </div>
      <div className="not-prose mb-6"><PageAllocViz /></div>
    </section>
  );
}
