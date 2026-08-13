import { AGENT_SECURITY_SOURCES } from "@/content/agent-sandbox-security";
import { CitationBlock } from "@/components/ui/citation";

export default function Gpu() {
  return (
    <section id="gpu" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        GPU를 붙이면 격리 경계에 device driver가 들어온다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          gVisor의 nvproxy는 지원하는 CUDA/NVIDIA ioctl을 선별해 host driver로
          전달한다. CPU system call 경로의 host kernel surface는 줄일 수 있지만,
          GPU driver 취약점까지 독립 guest driver로 가두는 구조는 아니다. 공식
          문서가 열거한 GPU·driver·capability 조합 안에서만 지원을 주장해야
          하며, B300 지원을 기존 H100 결과에서 자동으로 외삽하면 안 된다.
        </p>
        <p className="leading-7">
          Kata는 VFIO passthrough로 device를 guest에 넘길 수 있지만 VMM과 IOMMU,
          NVIDIA GPU Operator/device plugin, CDI, node topology가 맞아야 한다.
          현재 Kata 문서상 QEMU 외에도 Cloud Hypervisor와 Dragonball은 VFIO를
          지원하고, Firecracker는 passthrough를 지원하지 않는다. “GPU면 QEMU만
          가능” 같은 고정 규칙 대신 배포판이 지원하는 RuntimeClass와 lifecycle을
          검증한다.
        </p>
        <div data-viz="sandbox-gpu-boundary-cards" className="not-prose my-6 grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h3 className="text-sm font-bold">gVisor + nvproxy</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              빠른 session sandbox에 유리할 수 있지만 지원 matrix와 host GPU
              driver patching이 보안 경계의 일부다.
            </p>
          </article>
          <article className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <h3 className="text-sm font-bold">Kata + VFIO</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              guest kernel 경계 대신 device assignment·기동·밀도·운영 복잡도를
              지불한다.
            </p>
          </article>
        </div>
        <div id="paper-gvisor-gpu" className="scroll-mt-24">
          <CitationBlock source={AGENT_SECURITY_SOURCES.gvisorGpu.label} citeKey={7} href={AGENT_SECURITY_SOURCES.gvisorGpu.href}>
            nvproxy는 지원하는 NVIDIA device ioctl을 검사·중개한다. 공식 support
            matrix 밖 GPU·driver로 결과를 외삽할 수 없고 host driver가 신뢰
            경계에서 완전히 사라지는 것도 아니다.
          </CitationBlock>
        </div>
        <div id="paper-kata-gpu" className="scroll-mt-24">
          <CitationBlock source={AGENT_SECURITY_SOURCES.kataGpu.label} citeKey={8} href={AGENT_SECURITY_SOURCES.kataGpu.href}>
            Kata GPU passthrough는 VFIO·IOMMU·VMM·operator와 device lifecycle을
            함께 구성한다. 문서의 검증 조합은 임의 GPU fabric·multi-GPU
            topology·cloud nested virtualization의 자동 지원을 뜻하지 않는다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
