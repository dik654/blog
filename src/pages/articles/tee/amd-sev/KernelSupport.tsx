import KernelSupportViz from './viz/KernelSupportViz';
import KVMIoctlViz from './viz/KVMIoctlViz';

export default function KernelSupport() {
  return (
    <section id="kernel-support" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">리눅스 커널 SEV 지원</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          리눅스 커널은 <strong>KVM 모듈</strong>, <strong>/dev/sev 디바이스</strong>,
          <strong>CCP 드라이버</strong>로 SEV 기능을 사용자 공간에 노출합니다.<br />
          QEMU와 LibVirt가 이 인터페이스로 SEV 게스트 VM을 생성하고 관리합니다.
        </p>
      </div>

      <KernelSupportViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>KVM SEV ioctl 인터페이스</h3>
      </div>
      <KVMIoctlViz />
    </section>
  );
}
