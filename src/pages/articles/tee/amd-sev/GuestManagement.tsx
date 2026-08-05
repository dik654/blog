import GuestManagementViz from './viz/GuestManagementViz';
import ASIDMappingViz from './viz/ASIDMappingViz';
import VMCreateSequenceViz from './viz/VMCreateSequenceViz';
import VMSAFieldsViz from './viz/VMSAFieldsViz';
import GHCBProtocolViz from './viz/GHCBProtocolViz';
import ASIDPoolViz from './viz/ASIDPoolViz';

export default function GuestManagement() {
  return (
    <section id="guest-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">게스트 VM 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ASID</strong>(Address Space Identifier) + <strong>VEK</strong>(VM Encryption Key) 쌍으로 VM 식별<br />
          각 게스트에 고유 ASID 배정 → 메모리 컨트롤러가 AES 키 선택<br />
          <strong>ASP</strong>가 키 생명주기 관리 — 생성·저장·파괴<br />
          <strong>Launch Sequence</strong>: START → UPDATE_DATA → MEASURE → FINISH
        </p>
      </div>

      <GuestManagementViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">VM 생성 시퀀스 (SEV)</h3>
      </div>
      <div className="not-prose mb-4"><VMCreateSequenceViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">VMSA — VM State Save Area (SEV-ES)</h3>
      </div>
      <div className="not-prose mb-4"><VMSAFieldsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">GHCB — Guest-Host Communication Block (SEV-ES)</h3>
      </div>
      <div className="not-prose mb-4"><GHCBProtocolViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ASID & 키 관리</h3>
      </div>
      <ASIDMappingViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ASID Pool 관리</h3>
      </div>
      <div className="not-prose mb-4"><ASIDPoolViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: ASID 한계가 의미하는 것</p>
          <p>
            <strong>ASID 수 제약</strong>:<br />
            - Genoa: 1006 SEV-ES ASIDs<br />
            - 이게 동시 실행 VM 최대 개수<br />
            - VM 한 대가 ASID 한 개 점유
          </p>
          <p className="mt-2">
            <strong>클라우드 용량 영향</strong>:<br />
            - 1 host = 최대 ~1000 SEV VMs<br />
            - 일반 KVM은 수천 개 VM 가능 (메모리·CPU 한계까지)<br />
            - SEV는 하드웨어 제약 더 빡빡
          </p>
          <p className="mt-2">
            <strong>실전 영향</strong>:<br />
            - 대형 클라우드는 ASID 추적 서비스 운영<br />
            - oversubscription 주의 필요<br />
            - 최신 세대일수록 ASID 많음 → 업그레이드 동기
          </p>
        </div>

      </div>
    </section>
  );
}
