import KernelSupportViz from './viz/KernelSupportViz';
import KVMIoctlViz from './viz/KVMIoctlViz';
import CCPSevDevViz from './viz/CCPSevDevViz';
import KVMSEVCreateViz from './viz/KVMSEVCreateViz';
import GuestMemEncryptViz from './viz/GuestMemEncryptViz';
import SevToolWorkflowViz from './viz/SevToolWorkflowViz';

export default function KernelSupport() {
  return (
    <section id="kernel-support" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">리눅스 커널 SEV 지원</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>KVM</strong> 모듈 + <strong>/dev/sev</strong> + <strong>CCP</strong>(Cryptographic Coprocessor) 드라이버<br />
          QEMU/libvirt가 ioctl 인터페이스로 SEV VM 생성·관리<br />
          <strong>Guest 커널</strong>도 SEV-aware 필요 — mem_encrypt, GHCB 등<br />
          <strong>성숙 시점</strong>: Linux 5.19(SNP guest), 6.5(SNP host production)
        </p>
      </div>

      <KernelSupportViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">CCP 드라이버 — ASP 통신</h3>
      </div>
      <div className="not-prose mb-4"><CCPSevDevViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">KVM SEV VM 생성</h3>
      </div>
      <div className="not-prose mb-4"><KVMSEVCreateViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Guest 커널 SEV 지원</h3>
      </div>
      <div className="not-prose mb-4"><GuestMemEncryptViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">KVM SEV ioctl 인터페이스</h3>
      </div>
      <KVMIoctlViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">AMD SEV Tool — 사용자 유틸리티</h3>
      </div>
      <div className="not-prose mb-4"><SevToolWorkflowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: SEV Linux 지원의 진화</p>
          <p>
            <strong>초기 지원 (2017 이전)</strong>:<br />
            - SEV 1.0만 지원<br />
            - 수동 패치 필요<br />
            - QEMU 별도 빌드
          </p>
          <p className="mt-2">
            <strong>메인라인 통합 (2019~2022)</strong>:<br />
            - Linux 5.11: SEV-ES 정식 통합<br />
            - Linux 5.19: SEV-SNP guest<br />
            - Linux 6.5: SEV-SNP host production
          </p>
          <p className="mt-2">
            <strong>현재(2024)</strong>:<br />
            - 주요 배포판 기본 지원 (Ubuntu 22.04+, RHEL 9+)<br />
            - Kubernetes Confidential Containers 통합<br />
            - SNP 기능이 default SEV 모드<br />
            - Nested virtualization 지원 개선
          </p>
        </div>

      </div>
    </section>
  );
}
