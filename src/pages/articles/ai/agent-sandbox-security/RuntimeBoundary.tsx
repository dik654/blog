import {
  AGENT_SECURITY_SOURCES,
  RUNTIME_BOUNDARIES,
} from "@/content/agent-sandbox-security";
import { CitationBlock } from "@/components/ui/citation";

export default function RuntimeBoundary() {
  return (
    <section id="runtime" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        seccomp는 runtime이 아니라 syscall 경계다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          네 선택지는 단일 보안 순위표가 아니다. runc는 host kernel을 공유하고,
          seccomp는 그 경로에서 허용할 syscall을 줄인다. gVisor는 Sentry가 Linux
          System API의 상당 부분을 userspace에서 처리해 host kernel 접촉면을
          줄이고, Kata는 pod를 guest kernel을 가진 경량 VM에 둔다.
        </p>
        <div data-viz="sandbox-runtime-boundary-cards" className="not-prose my-6 grid gap-3 lg:grid-cols-2">
          {RUNTIME_BOUNDARIES.map((item) => (
            <article
              key={item.runtime}
              className="rounded-lg border bg-card p-4"
            >
              <h3 className="text-sm font-bold">{item.runtime}</h3>
              <dl className="mt-3 space-y-2 text-xs leading-5">
                <div>
                  <dt className="font-semibold text-foreground/75">kernel</dt>
                  <dd className="text-muted-foreground">{item.kernel}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground/75">경계</dt>
                  <dd className="text-muted-foreground">{item.boundary}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground/75">강점</dt>
                  <dd className="text-muted-foreground">{item.strength}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground/75">
                    남는 조건
                  </dt>
                  <dd className="text-muted-foreground">{item.caveat}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
        <p className="leading-7">
          gVisor의 Gofer는 filesystem access를 Sentry와 분리하며 현재 문서는
          LISAFS 경로를 설명한다. Kata의 현재 virtualization 문서는 QEMU·Cloud
          Hypervisor·Firecracker·Dragonball을 구분한다. Firecracker는 VFIO와
          virtio-fs를 지원하지 않으며, VFIO가 QEMU만의 기능이라는 설명도 맞지
          않는다.
        </p>
        <div id="paper-gvisor-security" className="scroll-mt-24">
          <CitationBlock source={AGENT_SECURITY_SOURCES.gvisorSecurity.label} citeKey={1} href={AGENT_SECURITY_SOURCES.gvisorSecurity.href}>
            gVisor는 Sentry가 application kernel 역할을 맡고 host와의 interface를
            제한해 host kernel attack surface를 줄인다. 이는 별도 hardware VM
            경계나 모든 Linux syscall·device의 완전한 호환성을 뜻하지 않는다.
          </CitationBlock>
        </div>
        <div id="paper-kata-virtualization" className="scroll-mt-24">
          <CitationBlock source={AGENT_SECURITY_SOURCES.kataVirtualization.label} citeKey={2} href={AGENT_SECURITY_SOURCES.kataVirtualization.href}>
            Kata는 guest kernel과 VMM을 사용해 container workload를 VM 경계에
            둔다. 문서는 여러 hypervisor의 기능 차이를 설명하며, 하나의 VMM이
            모든 device·cloud·기동 조건에서 최선이라고 결론내리지 않는다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
