import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { AGENT_SECURITY_SOURCES } from "@/content/agent-sandbox-security";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { GpuIsolationViz } from "../sandbox-security-viz";

export default function SandboxGpuIsolationArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="device 통로"
          title="GPU를 붙이는 순간 CPU syscall 경계 밖에 driver·ioctl·DMA 경로가 추가된다"
        >
          GPU 지원 여부를 체크박스로 보지 않습니다. Process가 device를 여는
          순간부터 실제 GPU까지 누가 요청을 검사하고 memory access를 격리하는지
          그립니다.
        </LessonHeader>
        <TermLesson
          name="GPU device isolation boundary"
          oneLine="GPU workload가 host driver·guest driver·VMM·IOMMU·device lifecycle 중 어느 component를 신뢰하는지 명시한 sandbox 계약입니다."
          shape="CUDA process → device request path → driver → GPU memory/compute"
          example="CPU syscall이 gVisor에서 중개되어도 CUDA ioctl이 nvproxy를 거쳐 host NVIDIA driver로 들어가는 경로는 별도로 남습니다."
          boundary="CPU sandbox 결과를 GPU path에 그대로 외삽하거나 한 GPU 세대의 support를 다른 세대에 적용하면 안 됩니다."
        />
        <GpuIsolationViz />
      </section>

      <section id="ioctl-proxy" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="요청을 검사해서 전달"
          title="Ioctl proxy는 지원하는 GPU 명령만 검사해 host driver로 중개한다"
        >
          nvproxy가 만드는 경계와 여전히 남아 있는 host driver 의존을 동시에
          봅니다.
        </LessonHeader>
        <TermLesson
          name="GPU ioctl-proxy mediation"
          oneLine="Sandbox가 GPU device ioctl을 decode·validate·copy한 뒤 허용된 요청만 host driver로 전달하는 중개 경계입니다."
          shape="guest process → nvproxy allowlist/copy → host NVIDIA driver"
          example="문서가 지원하는 ioctl·driver·GPU 조합은 중개되지만 unknown command나 unsupported capability는 거절됩니다."
          boundary="Host driver가 trust boundary에서 사라지는 것이 아니고, support matrix 밖 조합의 안전·기능을 보장하지 않습니다."
        />
        <div id="paper-gvisor-gpu" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.gvisorGpu.label}
            citeKey={1}
            href={AGENT_SECURITY_SOURCES.gvisorGpu.href}
          >
            <EvidenceGrid
              problem="gVisor 안 CUDA workload가 NVIDIA device interface를 제한적으로 쓰는 문제"
              contribution="nvproxy architecture와 지원 GPU·driver·capability 범위를 문서화"
              assumptions="문서 support matrix의 runsc·GPU·driver·CUDA 조합"
              scope="Ioctl validation·mediation과 남는 host-driver boundary"
              notClaim="임의 신형 GPU나 모든 CUDA 기능이 지원되고 host driver vulnerability가 제거된다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="vfio" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="장치를 guest에 할당"
          title="VFIO는 device를 guest에 넘기고 IOMMU가 DMA 범위를 제한한다"
        >
          Proxy와 passthrough를 같은 것으로 보지 않습니다. Driver가 어디에 있고
          device memory access를 누가 제한하는지 달라집니다.
        </LessonHeader>
        <TermLesson
          name="GPU VFIO device assignment"
          oneLine="Host가 GPU를 VFIO device로 격리해 guest VM에 할당하고 IOMMU가 device DMA의 address translation·access 범위를 제한하는 배치 형태입니다."
          shape="guest driver → virtual PCI path → VMM/VFIO → IOMMU → GPU"
          example="Kata guest의 NVIDIA driver가 할당된 GPU를 사용하되 host operator·device plugin·CDI가 lifecycle을 조정합니다."
          boundary="Passthrough는 device reset·sharing·multi-GPU fabric·cloud nested virtualization을 자동 해결하지 않습니다."
        />
        <div id="paper-kata-gpu" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.kataGpu.label}
            citeKey={2}
            href={AGENT_SECURITY_SOURCES.kataGpu.href}
            type="code"
          >
            <EvidenceGrid
              problem="NVIDIA GPU를 Kata guest에 assign해 container orchestration과 연결하는 문제"
              contribution="IOMMU·VFIO·VMM·NVIDIA stack의 passthrough 구성 경로를 공개"
              assumptions="문서가 검증한 hardware·VMM·kernel·driver·operator configuration"
              scope="GPU assignment와 필요한 host/guest lifecycle component"
              notClaim="모든 VMM·GPU fabric·sharing·reset·cloud에서 같은 isolation을 보장한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="compatibility" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="지원표를 계약으로"
          title="GPU model 하나가 아니라 전체 device chain의 검증 조합을 고정한다"
        >
          GPU 이름만 같아도 driver·runtime·operator·VMM·reset 방식이 달라지면
          다른 배포입니다. 조합 하나를 generation으로 묶어 시험합니다.
        </LessonHeader>
        <TermLesson
          name="GPU compatibility · release receipt"
          oneLine="GPU·driver·CUDA·sandbox runtime·VMM/IOMMU·operator·topology 조합과 negative/reset test 결과를 한 배포 세대에 고정한 근거입니다."
          shape="component generation → functional tests → isolation/reset tests → release"
          example="H100+driver X+runsc Y가 통과해도 B300+driver Z는 별도 generation으로 다시 검증합니다."
          boundary="Vendor support list와 실제 cluster acceptance test는 서로 대신하지 않습니다."
        />
        <ExplainedFormula
          question="왜 GPU 지원 여부를 각 component gate의 AND로 계산할까요?"
          idea="GPU만 인식돼도 driver ABI·runtime mediation·IOMMU·reset 중 하나가 실패하면 안전한 session lifecycle이 완성되지 않기 때문입니다."
          formula={String.raw`R=G\land D\land S\land I\land X`}
          annotatedFormula={String.raw`\begin{aligned}G_D&=\underbrace{G\land D}_{\text{GPU와 driver ABI 조합 확인}}\\G_S&=\underbrace{S\land I}_{\text{sandbox 경로와 IOMMU 격리 확인}}\\R&=\underbrace{G_D\land G_S\land X}_{\text{reset·negative test까지 통과해야 release}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`G\land D`,
              annotation: [
                "GPU model과 driver를 함께 묶어",
                "지원 ABI 조합을 고정",
              ],
            },
            {
              expression: String.raw`S\land I`,
              annotation: [
                "sandbox path와 IOMMU를 함께 확인해",
                "control과 DMA 경계를 모두 검증",
              ],
            },
            {
              expression: String.raw`G_D\land G_S\land X`,
              annotation: [
                "기능·격리·reset gate를 AND로 묶어",
                "부분 지원을 release로 오판하지 않음",
              ],
            },
          ]}
          terms={[
            {
              symbol: "G",
              name: "GPU model gate",
              description: "검증 대상 GPU model·firmware 조합입니다.",
            },
            {
              symbol: "D",
              name: "Driver gate",
              description: "Host 또는 guest driver ABI가 맞으면 1입니다.",
            },
            {
              symbol: "S",
              name: "Sandbox path gate",
              description: "nvproxy 또는 VFIO path가 지원되면 1입니다.",
            },
            {
              symbol: "I",
              name: "Isolation gate",
              description: "IOMMU·VMM·ioctl enforcement가 검증되면 1입니다.",
            },
            {
              symbol: "X",
              name: "Lifecycle test gate",
              description: "Reset·destroy·negative test가 통과하면 1입니다.",
            },
          ]}
          assumptions={[
            "모든 gate는 같은 node image와 component revision에서 측정합니다.",
            "Multi-GPU·MIG·fabric sharing은 별도 fixture로 분리합니다.",
          ]}
          interpretation="GPU detection과 CUDA sample만 통과해도 reset test가 실패하면 R=0입니다. 그 조합은 운영 release가 아니라 실험 상태로 남깁니다."
        />
        <ConceptLadderViz
          title="GPU sandbox 경계의 학습 순서"
          description="Device path를 찾고 proxy와 assignment를 구분한 뒤 전체 generation을 승인합니다."
          steps={[
            { label: "Device", detail: "CPU 경계 밖 GPU path 식별" },
            { label: "Proxy", detail: "Ioctl을 검사해 host driver로 중개" },
            { label: "VFIO", detail: "Guest driver와 IOMMU로 device 할당" },
            { label: "Receipt", detail: "Driver·runtime·reset 조합 검증" },
          ]}
        />
        <ContentBoundary article="sandbox-gpu-isolation" />
      </section>
    </article>
  );
}
