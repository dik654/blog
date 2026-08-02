import { CitationBlock } from '@/components/ui/citation';

const gpuScope = [
  ['hardware planning', 'GPU SKU, VRAM, interconnect, CPU/RAM ratio, network, storage locality', '모델 크기와 serving topology의 물리 한계를 정한다.'],
  ['node bootstrap', 'OS image, kernel, NVIDIA driver, container runtime, CUDA compatibility', '노드가 떠도 driver/runtime이 맞지 않으면 GPU 리소스가 등록되지 않는다.'],
  ['operator stack', 'GPU Operator, device plugin, GPU Feature Discovery, DCGM Exporter, MIG Manager', 'GPU 노드의 설치, 라벨링, 모니터링, partitioning을 자동화한다.'],
  ['scheduling policy', 'taints, tolerations, node affinity, topology spread, priority, quotas', '비싼 GPU를 어떤 workload가 언제 점유할 수 있는지 통제한다.'],
  ['autoscaling', 'Karpenter, Cluster Autoscaler, warm pool, consolidation, interruption handling', '대기열 흡수와 비용 회수 사이의 균형을 잡는다.'],
  ['serving integration', 'vLLM/TGI Pod shape, tensor parallel, model cache, readiness, gateway registration', 'GPU Fleet이 실제 LLM serving capacity로 전환되는 지점이다.'],
  ['security/governance', 'node isolation, image provenance, secret access, admin RBAC, quota', 'GPU 노드는 고가 자산이면서 model/key가 모이는 보안 경계다.'],
  ['cost operations', 'idle GPU, spot/preemptible, reserved capacity, per-team chargeback', 'GPU Fleet 운영 실패는 대부분 성능 문제보다 비용 문제로 먼저 드러난다.'],
];

const fleetLayers = [
  ['hardware', 'GPU SKU, VRAM, NVLink, PCIe, network bandwidth', '모델 크기와 tensor parallel 구성이 가능한지 결정'],
  ['node', 'driver, container runtime, device plugin, DCGM exporter', 'GPU가 K8s 리소스로 보이고 메트릭이 수집되는지 결정'],
  ['scheduler', 'taint, toleration, node selector, topology spread, priority', '비싼 GPU 노드를 누가 점유할 수 있는지 결정'],
  ['autoscaler', 'Karpenter NodePool, instance family, consolidation, limits', '대기열과 비용 사이의 균형을 결정'],
];

const capacityChecks = [
  ['VRAM', 'weights + KV cache + activation headroom', '70B FP16은 단일 80GB GPU에 안정적으로 넣기 어렵고 TP 또는 quantization 판단이 필요'],
  ['interconnect', 'tensor parallel 통신량', 'NVLink 없는 다중 GPU는 prefill/decoding latency가 급격히 흔들릴 수 있음'],
  ['bin packing', 'Pod당 GPU 수, MIG 여부, 일반 워크로드 격리', '4 GPU Pod가 8 GPU 노드에 1개만 들어가면 반쪽 GPU가 놀 수 있음'],
  ['scale latency', '이미지 pull, 모델 로딩, 노드 부팅', 'GPU node scale-out은 요청 폭주를 즉시 흡수하지 못하므로 buffer capacity가 필요'],
];

export default function GPUFleetDeepDive() {
  return (
    <>
      <h3 id="gpu-fleet-scope" className="text-xl font-semibold mt-8 mb-3">Kubernetes GPU Fleet의 전체 범위</h3>
      <p>
        Kubernetes GPU Fleet은 “GPU Pod를 스케줄링한다”보다 넓다. 하드웨어 선택부터 node bootstrap,
        GPU Operator, 스케줄러 정책, autoscaler, serving runtime, 보안, 비용 회수까지 하나의 운영면으로 묶인다.
      </p>
      <div className="grid gap-3 md:grid-cols-2 mt-4">
        {gpuScope.map(([area, detail, why]) => (
          <div key={area} className="rounded-lg border bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">{area}</p>
            <p className="text-sm font-semibold">{detail}</p>
            <p className="text-sm text-muted-foreground mt-2">{why}</p>
          </div>
        ))}
      </div>
      <CitationBlock source="Kubernetes Docs — Schedule GPUs" citeKey={7} type="paper"
        href="https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/">
        <p className="text-sm">
          Kubernetes는 GPU 관리를 device plugin 기반 custom schedulable resource로 다룬다.
          vendor driver와 device plugin이 설치되면 <code>nvidia.com/gpu</code> 같은 리소스를 Pod가 요청할 수 있다.
        </p>
      </CitationBlock>

      <h3 id="fleet-control-plane" className="text-xl font-semibold mt-8 mb-3">GPU Fleet 제어면</h3>
      <p>
        GPU Fleet 운영은 “GPU가 있는 노드를 늘린다”보다 넓다. 하드웨어 제약, 노드 준비 상태,
        스케줄러 정책, 오토스케일러 정책이 맞물려야 LLM Pod가 실제로 안정적인 throughput을 낸다.
      </p>
      <div className="grid gap-3 md:grid-cols-2 mt-4">
        {fleetLayers.map(([layer, parts, role]) => (
          <div key={layer} className="rounded-lg border bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">{layer}</p>
            <p className="text-sm font-semibold">{parts}</p>
            <p className="text-sm text-muted-foreground mt-2">{role}</p>
          </div>
        ))}
      </div>

      <h3 id="capacity-planning" className="text-xl font-semibold mt-8 mb-3">용량 산정 체크리스트</h3>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">축</th>
              <th className="p-3">확인할 값</th>
              <th className="p-3">왜 중요한가</th>
            </tr>
          </thead>
          <tbody>
            {capacityChecks.map(([axis, check, why]) => (
              <tr key={axis} className="border-t">
                <td className="p-3 font-semibold">{axis}</td>
                <td className="p-3 text-muted-foreground">{check}</td>
                <td className="p-3 text-muted-foreground">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 id="gpu-failure-modes" className="text-xl font-semibold mt-8 mb-3">운영 실패 패턴</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li><strong className="text-foreground">GPU는 남는데 Pod가 Pending:</strong> taint/toleration, node selector, Pod GPU 수, topology constraint를 먼저 본다.</li>
        <li><strong className="text-foreground">노드는 떴는데 GPU가 0개로 보임:</strong> driver, device plugin socket, container toolkit, MIG 설정 불일치를 확인한다.</li>
        <li><strong className="text-foreground">스케일아웃은 됐지만 latency가 유지됨:</strong> 모델 로딩 시간이 병목인지, 기존 queue가 이미 포화됐는지, gateway가 새 replica로 보내는지 본다.</li>
        <li><strong className="text-foreground">비용이 계속 샘:</strong> consolidation 조건, daemonset 때문에 empty로 판단되지 않는지, reserved warm pool 정책을 분리해서 본다.</li>
      </ul>

      <h3 id="operator-components" className="text-xl font-semibold mt-8 mb-3">GPU Operator 구성요소별 관점</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">device plugin</p>
          <p className="text-sm text-muted-foreground">
            kubelet에 GPU resource를 등록한다. Pod가 <code>nvidia.com/gpu</code>를 요청할 수 있게 만드는 핵심 경계다.
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">GPU Feature Discovery</p>
          <p className="text-sm text-muted-foreground">
            GPU SKU, memory, MIG profile 같은 node label을 붙여 scheduler가 정확한 노드를 고르게 한다.
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">DCGM Exporter</p>
          <p className="text-sm text-muted-foreground">
            utilization, memory, power, temperature, ECC, MIG device metric을 Prometheus로 노출한다.
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">MIG Manager</p>
          <p className="text-sm text-muted-foreground">
            A100/H100 계열에서 GPU를 여러 slice로 나누는 profile을 node label 기반으로 적용한다.
          </p>
        </div>
      </div>
      <CitationBlock source="NVIDIA GPU Operator Docs — MIG and DCGM" citeKey={8} type="paper"
        href="https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html">
        <p className="text-sm">
          NVIDIA GPU Operator는 device plugin, DCGM Exporter, GPU Feature Discovery, MIG Manager 같은 구성요소를 통해
          GPU 노드 준비와 telemetry 수집을 Kubernetes 안에서 자동화한다.
        </p>
      </CitationBlock>
    </>
  );
}
