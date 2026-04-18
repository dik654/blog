import { CitationBlock } from '@/components/ui/citation';

export default function GPUOperator() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">NVIDIA GPU Operator</h3>
      <p>
        GPU Operator — 드라이버, 컨테이너 런타임, Device Plugin을 한 번에 배포하는 Operator<br />
        노드에 GPU가 추가되면 자동으로 드라이버 설치 → <code>nvidia.com/gpu</code> 리소스 등록
      </p>
      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        <div className="rounded-lg border-l-4 border-amber-500 bg-amber-500/5 p-4">
          <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Device Plugin 역할</p>
          <p className="text-sm text-muted-foreground">
            DaemonSet으로 모든 GPU 노드에 배포.<br />
            kubelet의 <code>/var/lib/kubelet/device-plugins</code> 소켓에 등록.<br />
            노드의 GPU를 K8s 리소스(<code>nvidia.com/gpu</code>)로 노출.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-500/5 p-4">
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">GPU 검출 & 리소스 등록</p>
          <p className="text-sm text-muted-foreground">
            Plugin이 NVML API로 GPU 장치 검출.<br />
            검출된 GPU 수를 kubelet에 보고 → 스케줄러가 할당 가능.<br />
            Pod의 <code>resources.limits</code>에서 GPU를 요청하면 자동 바인딩.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-sky-500 bg-sky-500/5 p-4">
          <p className="font-semibold text-sky-600 dark:text-sky-400 mb-1">Toleration & 격리</p>
          <p className="text-sm text-muted-foreground">
            GPU 노드에 <code>nvidia.com/gpu: NoSchedule</code> taint 적용.<br />
            Device Plugin은 해당 toleration 보유 → GPU 노드에만 배포.<br />
            일반 워크로드가 GPU 노드에 스케줄링되는 것을 방지.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-violet-500 bg-violet-500/5 p-4">
          <p className="font-semibold text-violet-600 dark:text-violet-400 mb-1">Operator 자동화 범위</p>
          <p className="text-sm text-muted-foreground">
            NVIDIA 드라이버 → Container Toolkit → Device Plugin.<br />
            GPU 노드 추가 시 전체 스택 자동 설치.<br />
            버전 관리, 업그레이드, 모니터링까지 통합 관리.
          </p>
        </div>
      </div>
      <CitationBlock source="NVIDIA GPU Operator Docs" citeKey={3} type="paper"
        href="https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html">
        <p className="italic">
          "The GPU Operator uses the operator framework to automate the management of all
          NVIDIA software components needed to provision GPU."
        </p>
      </CitationBlock>
    </>
  );
}
