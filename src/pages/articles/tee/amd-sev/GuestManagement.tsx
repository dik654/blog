import GuestManagementViz from './viz/GuestManagementViz';
import ASIDMappingViz from './viz/ASIDMappingViz';

export default function GuestManagement() {
  return (
    <section id="guest-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">게스트 VM 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          게스트 VM 관리의 핵심은 <strong>ASID(Address Space Identifier)</strong>와
          <strong>VEK(VM Encryption Key)</strong>입니다.<br />
          각 게스트에 고유 ASID를 배정하여 메모리 컨트롤러가 올바른 키를 선택합니다.<br />
          PSP(Platform Security Processor)가 키의 전체 생명주기를 관리합니다.
        </p>
      </div>

      <GuestManagementViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>ASID & 키 관리</h3>
      </div>
      <ASIDMappingViz />
    </section>
  );
}
