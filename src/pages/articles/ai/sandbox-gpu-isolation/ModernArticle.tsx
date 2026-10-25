import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import {
  SandboxBoundaryLocator,
  SandboxBoundaryMapReturn,
} from "../shared/SandboxBoundaryLocator";
import SandboxGpuIsolationViz from "./viz/SandboxGpuIsolationViz";

export default function SandboxGpuIsolationArticle() {
  return (
    <article id="overview" className="space-y-16">
      <SandboxBoundaryLocator current="gpu" />

      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="새 장치 경로"
          title="GPU를 열면 드라이버와 DMA 경계가 붙습니다"
        >
          GPU 0을 배정받은 같은 CUDA 프로세스를 두 실행 경로로 보냅니다. 장치
          요청을 누가 검사하고 GPU의 메모리 접근을 어디서 제한하는지 따라갑니다.
        </LessonHeader>
        <SandboxGpuIsolationViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글의 샌드박스에서 이미지 생성 작업이 GPU 0을 배정받았다고 하겠습니다.
            CUDA 프로세스가 <code>/dev/nvidia0</code>을 여는 순간 CPU 시스템 호출
            경계 밖에 GPU ioctl·드라이버·DMA 경로가 추가됩니다.
          </p>
          <p>
            gVisor의 nvproxy는 지원하는 ioctl을 해석하고 인자와 메모리를 옮긴 뒤
            호스트 NVIDIA 커널 드라이버로 전달합니다. Kata passthrough는 GPU를
            VFIO 장치로 분리해 VM에 연결하고 게스트 NVIDIA 드라이버가 사용하게
            합니다. IOMMU는 장치가 DMA로 접근할 수 있는 메모리 범위를 제한합니다.
          </p>
          <p>
            두 경로는 같은 “GPU 지원”이 아닙니다. 첫째는 호스트 드라이버 앞의 요청
            중개이고, 둘째는 게스트에 장치를 할당하는 경로입니다. 어느 쪽이든 GPU
            모델·드라이버 ABI·런타임·리셋·다중 GPU 연결을 한 조합으로 검증해야 합니다.
          </p>
        </div>
        <ContentBoundary article="sandbox-gpu-isolation" />
        <TermLesson
          name="GPU 장치 격리 경계"
          oneLine="GPU 작업이 호스트·게스트 드라이버, VMM, IOMMU, 장치 수명주기 중 무엇을 신뢰하는지 밝힌 실행 계약입니다."
          shape="CUDA 프로세스 → 장치 요청 경로 → 드라이버 → GPU 메모리·연산"
          example="CPU 호출을 gVisor에서 중개해도 CUDA ioctl이 nvproxy를 거쳐 호스트 NVIDIA 드라이버로 들어가는 경로는 별도로 남습니다."
          boundary="CPU 샌드박스 결과를 GPU 경로에 그대로 적용하거나 한 GPU 세대의 지원을 다른 세대에 확대해서는 안 됩니다."
        />
      </section>

      <section id="ioctl-proxy" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="호스트 드라이버 앞"
          title="nvproxy는 지원하는 ioctl만 중개합니다"
        >
          nvproxy가 만드는 경계와 여전히 남아 있는 호스트 드라이버 의존을 동시에
          봅니다.
        </LessonHeader>
        <TermLesson
          name="GPU ioctl 중개"
          oneLine="샌드박스가 GPU 장치 ioctl을 해석·검사·복사한 뒤 지원하는 요청만 호스트 드라이버로 전달하는 경계입니다."
          shape="CUDA 프로세스 → nvproxy 검사·복사 → 호스트 NVIDIA 드라이버"
          example="고정한 runsc 릴리스가 아는 드라이버 ABI와 ioctl은 중개하지만 모르는 명령이나 드라이버는 시작 또는 실행 중 거절될 수 있습니다."
          boundary="호스트 드라이버가 신뢰 경계에서 사라지는 것이 아니고, 공식 지원 목록 밖 조합의 안전·기능을 보장하지 않습니다."
        />
        <div id="paper-gvisor-gpu" className="scroll-mt-24">
          <CitationBlock
            source="gVisor release-20261019.0 — GPU Support"
            citeKey={1}
            href="https://github.com/google/gvisor/blob/release-20261019.0/g3doc/user_guide/gpu.md"
          >
            <EvidenceGrid
              problem="gVisor 안 CUDA 작업이 NVIDIA 장치 인터페이스를 제한적으로 사용하는 문제"
              contribution="nvproxy 구조와 지원 GPU·드라이버·capability·장치 파일·ioctl 범위"
              assumptions="gVisor release-20261019.0과 문서가 명시한 GPU·드라이버 조합"
              scope="ioctl 검사·중개와 남는 호스트 드라이버 경계"
              notClaim="임의의 신형 GPU나 모든 CUDA 기능이 지원되고 호스트 드라이버 취약점이 제거된다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          이 릴리스 문서는 공식 지원 GPU로 T4·A100·A10G·L4·H100을 적습니다.
          RTX A6000과 B300은 이 목록에 명시되어 있지 않습니다. 같은 아키텍처의 다른
          GPU가 동작할 수 있다는 설명은 공식 지원과 같지 않으므로, 실제 장비에서는
          <code>runsc nvproxy list-supported-drivers</code>와 별도 기능·금지 요청 검사가 필요합니다.
        </p>
      </section>

      <section id="vfio" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="VM에 장치 할당"
          title="VFIO와 IOMMU는 장치와 DMA 범위를 묶습니다"
        >
          중개와 passthrough를 같은 것으로 보지 않습니다. 드라이버가 어디에 있고
          장치의 메모리 접근을 누가 제한하는지 달라집니다.
        </LessonHeader>
        <TermLesson
          name="GPU VFIO 장치 할당"
          oneLine="호스트가 GPU를 VFIO 장치로 분리해 게스트 VM에 할당하고 IOMMU가 장치 DMA의 주소 변환과 접근 범위를 제한하는 방식입니다."
          shape="게스트 드라이버 → 가상 PCI → VMM·VFIO → IOMMU → GPU"
          example="Kata 게스트의 NVIDIA 드라이버가 할당된 GPU를 사용하고, 호스트의 device plugin·CDI·런타임이 장치 수명주기를 연결합니다."
          boundary="Passthrough는 장치 리셋·공유·다중 GPU fabric·중첩 가상화를 자동으로 해결하지 않습니다."
        />
        <div id="paper-linux-vfio" className="scroll-mt-24">
          <CitationBlock
            source="Linux kernel — VFIO"
            citeKey={2}
            href="https://docs.kernel.org/driver-api/vfio.html"
          >
            <EvidenceGrid
              problem="사용자 공간 드라이버나 VM에 장치를 직접 주면서 DMA가 다른 메모리를 침범할 수 있는 문제"
              contribution="IOMMU 그룹을 단위로 장치를 노출하고 DMA·인터럽트·I/O 영역을 다루는 VFIO 경로"
              assumptions="호스트의 IOMMU·VFIO 지원과 장치가 속한 실제 IOMMU 그룹"
              scope="장치 직접 할당과 DMA 격리의 커널 경계"
              notClaim="장치 자체의 결함·다기능 장치 내부 우회·리셋·공유 문제가 모두 해결된다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <div id="paper-kata-gpu" className="scroll-mt-24">
          <CitationBlock
            source="Kata Containers 4.3.1 — NVIDIA GPU passthrough"
            citeKey={3}
            href="https://github.com/kata-containers/kata-containers/blob/4.3.1/docs/use-cases/NVIDIA-GPU-passthrough-and-Kata-QEMU.md"
            type="code"
          >
            <EvidenceGrid
              problem="NVIDIA GPU를 Kata 게스트에 할당해 Kubernetes의 장치 배정과 연결하는 문제"
              contribution="Kubelet Pod Resources·CDI·VFIO BDF·QEMU cold-plug·게스트 드라이버 경로"
              assumptions="Kata 4.3.1, 문서의 QEMU NVIDIA GPU runtime class와 실제 하드웨어·IOMMU 구성"
              scope="물리 GPU passthrough와 호스트·게스트 장치 수명주기"
              notClaim="모든 VMM·GPU fabric·공유·리셋·클라우드에서 같은 격리를 보장한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="compatibility" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="한 조합의 근거"
          title="GPU 이름이 아니라 장치 경로 전체를 고정합니다"
        >
          GPU 이름이 같아도 드라이버·런타임·VMM·IOMMU·리셋 방식이 달라지면
          다른 경로입니다. 한 조합에서 확인한 결과만 그 조합의 근거로 씁니다.
        </LessonHeader>
        <TermLesson
          name="GPU 호환 조합의 검증 영수증"
          oneLine="GPU·드라이버·CUDA·샌드박스 런타임·VMM·IOMMU·topology와 금지 요청·리셋 결과를 한 묶음으로 남긴 근거입니다."
          shape="구성요소 버전 고정 → 기능 검사 → 격리·리셋 검사 → 결과 기록"
          example="H100과 특정 드라이버·runsc가 통과해도 A6000이나 B300과 다른 드라이버 조합은 별도로 확인합니다."
          boundary="공식 지원 목록과 실제 장비의 검증 결과는 서로 대신하지 않습니다."
        />
        <ExplainedFormula
          question="왜 GPU 지원 여부를 각 경계의 AND로 계산할까요?"
          idea="GPU가 보이더라도 드라이버 ABI·런타임 중개·IOMMU·리셋 중 하나가 실패하면 장치 수명주기가 완성되지 않기 때문입니다."
          formula={String.raw`R=G\land D\land S\land I\land X`}
          annotatedFormula={String.raw`\begin{aligned}G_D&=\underbrace{G\land D}_{\text{GPU와 driver ABI 조합 확인}}\\G_S&=\underbrace{S\land I}_{\text{sandbox 경로와 IOMMU 격리 확인}}\\R&=\underbrace{G_D\land G_S\land X}_{\text{reset·negative test까지 통과해야 release}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`G\land D`,
              annotation: [
                "GPU 모델과 드라이버를 함께 묶어",
                "지원 ABI 조합을 고정",
              ],
            },
            {
              expression: String.raw`S\land I`,
              annotation: [
                "샌드박스 경로와 IOMMU를 함께 확인해",
                "요청과 DMA 경계를 모두 검증",
              ],
            },
            {
              expression: String.raw`G_D\land G_S\land X`,
              annotation: [
                "기능·격리·리셋 조건을 AND로 묶어",
                "부분 지원을 완료로 오판하지 않음",
              ],
            },
          ]}
          terms={[
            {
              symbol: "G",
              name: "GPU 모델 조건",
              description: "검증 대상 GPU 모델·펌웨어 조합입니다.",
            },
            {
              symbol: "D",
              name: "드라이버 조건",
              description: "호스트 또는 게스트 드라이버 ABI가 맞으면 1입니다.",
            },
            {
              symbol: "S",
              name: "샌드박스 경로 조건",
              description: "nvproxy 또는 VFIO 경로가 지원되면 1입니다.",
            },
            {
              symbol: "I",
              name: "격리 조건",
              description: "IOMMU·VMM·ioctl 제한이 검증되면 1입니다.",
            },
            {
              symbol: "X",
              name: "수명주기 조건",
              description: "리셋·해제·금지 요청 검사가 통과하면 1입니다.",
            },
          ]}
          assumptions={[
            "모든 조건은 같은 노드 이미지와 구성요소 버전에서 확인합니다.",
            "다중 GPU·MIG·NVLink 같은 공유 경로는 별도 사례로 분리합니다.",
          ]}
          interpretation="GPU 탐지와 CUDA 예제가 통과해도 리셋 검사가 실패하면 R=0입니다. 그 조합은 검증 완료가 아니라 실험 상태로 남깁니다."
        />
      </section>

      <SandboxBoundaryMapReturn current="gpu" />
    </article>
  );
}
