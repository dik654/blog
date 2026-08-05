import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { GpuTopologyLab } from './llm-serving-control/viz/ServingControlLabs';

export default function K8sGPUFleetArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Desired와 allocatable은 다른 장부다</h2>
        <QuestionLead
          question="replicas: 8이라고 썼는데 왜 두 Pod는 Pending이고 실제 Ready는 다섯 개뿐일까?"
          answer={<>Deployment의 replica는 <strong>원하는 workload 수</strong>다. Scheduler가 요구 조건과 맞는 device를 할당하고, node의 driver·runtime·device advertisement가 정상이며, model warmup까지 끝나야 실제 serving capacity가 된다.</>}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>GPU Fleet의 핵심은 GPU 개수를 세는 일이 아니라 workload가 요구한 memory, isolation, topology와 software stack을 만족하는 device를 lease하는 일이다. 같은 80GB라도 NVLink domain, MIG profile, driver branch, node network와 local model cache가 다르면 같은 serving unit이 아니다.</p>
          <p>Kubernetes에는 두 가지 설명 축이 함께 존재한다. Device plugin은 <code>nvidia.com/gpu</code> 같은 extended resource를 정수 수량으로 광고한다. DRA core는 Kubernetes 1.34에서 GA가 되었고, DeviceClass, ResourceClaim과 ResourceSlice를 통해 attribute 기반 선택과 공유를 더 명시적으로 표현한다. 1.34에서는 GA feature gate를 끌 수 있었지만 1.35부터는 항상 활성화된다. DRA API가 stable이라는 사실과 현재 모든 cluster·vendor driver가 이를 사용한다는 주장은 다르다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Desired / allocatable', meaning: 'Controller가 원하는 수량과 node가 현재 pod에 줄 수 있다고 광고한 수량이다.', why: 'replica 8이 GPU 8개를 자동 생성하지 않는다.' },
          { term: 'Device plugin', meaning: 'Kubelet에 vendor device를 등록하고 extended resource로 노출하는 기존 경로다.', why: '많은 현재 GPU cluster의 실제 배치 계약이다.' },
          { term: 'DRA', meaning: '1.34에서 GA가 된 DeviceClass·ResourceClaim 기반 device allocation API다.', why: 'GPU 종류·attribute·sharing을 quantity보다 풍부하게 요구할 수 있다. 1.35부터 core feature는 항상 활성화된다.' },
          { term: 'GPU Operator', meaning: 'Driver, container toolkit, device plugin, feature discovery, DCGM과 MIG manager의 생명주기를 자동화한다.', why: 'node가 GPU를 가진 것과 container가 안정적으로 사용할 수 있는 것은 다르다.' },
        ]} />
      </section>

      <section id="allocation-lanes" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Device plugin과 DRA는 서로 다른 allocation lane이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Device plugin lane</strong>에서는 Pod가 GPU extended resource를 <code>limits</code>로 요청하고, node label·affinity와 taint toleration으로 후보 node를 좁힌다. GPU는 <code>limits</code>만 쓰면 request가 같은 값으로 간주된다. Request만 쓰거나 request와 limit를 다르게 쓰는 CPU식 overcommit 계약은 허용되지 않는다. Scheduler가 node를 고른 뒤 kubelet이 device plugin의 Allocate를 호출한다.</p>
          <p><strong>DRA lane</strong>에서는 vendor driver가 ResourceSlice로 device를 알리고, workload가 DeviceClass와 ResourceClaim으로 속성·공유 요구를 표현한다. Scheduler allocation 뒤 driver와 kubelet의 prepare를 거친다. DRA claim의 <code>allocated</code>는 device 선택 증거이지 현재 물리 health나 model warmup 완료 증거가 아니다.</p>
          <p>Label 일치와 toleration도 health proof가 아니다. Toleration은 해당 taint가 있는 node에 배치될 수 있게 할 뿐 배치를 보장하지 않으며, 배치 뒤 label이 바뀌어도 일부 affinity는 기존 Pod를 자동 퇴거시키지 않는다.</p>
        </div>
        <Misconception><code>Node Ready=True</code>, GPU label 일치, claim allocated를 이어 붙여도 “model endpoint가 정상”이라는 결론은 나오지 않는다. Node 일반 상태, device identity·health와 application readiness는 별도 장부다.</Misconception>
      </section>

      <section id="capacity-bound" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Serving capacity는 가장 작은 경계에서 멈춘다</h2>
        <M display>{String.raw`\begin{aligned}
\underbrace{R_{\mathrm{feasible}}}_{\text{배치 가능한 상한}}&\leq\underbrace{R_{\mathrm{desired}}}_{\text{원하는 복제본}}\\
\underbrace{R_{\mathrm{feasible}}}_{\text{배치 가능한 상한}}&\leq\underbrace{G_{\mathrm{free,policy}}/g_{\mathrm{pod}}}_{\text{정책을 통과한 장치 수용량}}\\
\underbrace{R_{\mathrm{feasible}}}_{\text{배치 가능한 상한}}&\leq\underbrace{Q_{\mathrm{tenant}}}_{\text{사용자별 할당 한도}}\\
\underbrace{R_{\mathrm{ready}}}_{\text{현재 준비 복제본}}&\leq\underbrace{R_{\mathrm{feasible}}}_{\text{배치 가능한 상한}}\\
\underbrace{R_{\mathrm{ready}}}_{\text{현재 준비 복제본}}&\leq\underbrace{R_{\mathrm{healthy}}}_{\text{현재 장치 건강 증거}}\\
\underbrace{R_{\mathrm{ready}}}_{\text{현재 준비 복제본}}&\leq\underbrace{R_{\mathrm{warm}}}_{\text{모델 준비 완료}}
\end{aligned}`}</M>
        <FormulaNote
          meaning="이 식은 Kubernetes scheduler 구현식이 아니라 상태를 섞지 않기 위한 triage 상한이다. 첫 줄은 device plugin이 광고한 allocatable에서 이미 사용 중인 수량과 SKU·profile·label·taint·topology 정책을 거른 scheduler-feasible 여유를 센다. 둘째 줄은 할당 뒤에도 현재 device health와 model warmup이 Ready를 더 줄일 수 있음을 보인다."
          symbols={[[String.raw`R_{\mathrm{desired}}=8`, 'Deployment가 원하는 replica'], [String.raw`G_{\mathrm{free,policy}}=6`, '광고 수량에서 사용 중 device와 배치 정책을 제외한 설명용 여유'], [String.raw`g_{\mathrm{pod}}=1`, 'replica 하나가 요구하는 GPU 수'], [String.raw`R_{\mathrm{ready}}=5`, '여섯 번째 replica가 warmup 중인 현재 fixture']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 fixture에서 scheduler-feasible 상한은 6이다. 여섯 번째 pod가 warmup 중이므로 현재 Ready는 5이고, 나머지 두 pod는 Pending이다. HPA가 desired를 12로 올려도 정책을 통과한 free device나 node 공급이 늘지 않으면 Pending만 늘어난다.</p>
          <p>Plugin이 unhealthy device를 새 allocation의 수량에서 제외해도 이미 그 GPU를 쓰는 Pod가 다른 device로 자동 이전된다는 뜻은 아니다. 그래서 advertised allocatable, scheduler-feasible free, allocated device id, current health와 Pod Ready를 시간축으로 따로 기록한다.</p>
        </div>
      </section>

      <section id="isolation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Full GPU, MIG와 time slicing은 같은 share가 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Full GPU</strong>는 한 workload가 device 전체를 요청하는 가장 단순한 계약이다. <strong>MIG</strong>는 지원 GPU를 정해진 profile의 instance로 나누며 hardware 수준 memory와 fault isolation을 제공한다. <strong>Time slicing</strong>은 여러 client가 같은 GPU 실행 시간을 나누지만 MIG와 같은 memory·fault isolation을 제공하지 않는다.</p>
          <p>따라서 “shared GPU 2개를 요청했다”는 표현만으로 compute 2배를 보장할 수 없다. NVIDIA 문서도 time-sliced resource의 수량을 독점 compute 비율이 아니라 access request로 이해하도록 경고한다. Training, latency-sensitive serving과 untrusted multi-tenant workload는 isolation 요구가 다르다.</p>
          <p>Time slicing 설정은 물리 GPU 수보다 큰 논리 allocatable 수를 광고할 수 있다. Capacity lease에는 resource name만 아니라 sharing strategy, time-slice replica 수, MIG strategy·profile과 실제 device identity를 남긴다. MIG geometry 변경 중에는 GPU Pod가 중단될 수 있으므로 <code>mig.config.state=success</code>, resource 재광고와 model warmup까지 확인한 뒤 capacity로 복귀시킨다.</p>
        </div>
        <Misconception>GPU Operator가 설치됐다는 사실은 model pod가 schedulable·Ready라는 뜻이 아니다. Operator operand health, device advertisement, claim allocation, node topology와 model warmup은 별도 증거다.</Misconception>
      </section>

      <section id="topology-scope" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 16 GPU라도 실행 그룹은 16개, 2개, 1개 또는 0개다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>독립 serving replica는 request 하나가 GPU 하나에서 끝나므로 16 GPU를 16 endpoint로 쓸 수 있다. Tensor Parallel 8은 같은 NVLink/NVSwitch domain의 여덟 GPU가 하나의 execution group이므로 두 그룹이다. Multi-node TP 16은 두 node의 GPU 수 합계만으로는 부족하고 RDMA NIC, secondary network, GPU-NIC locality, collective 통신과 모든 rank의 동시 시작 증거가 필요하다.</p>
          <p>Kubernetes Topology Manager는 node 내부 NUMA 정렬을 다루며 NVLink domain이나 node 간 RDMA fabric을 자동 증명하지 않는다. 이 글은 필요한 resource와 topology evidence를 scheduler 계약으로 넘기는 데서 멈춘다. RoCE QoS, NCCL algorithm과 collective tuning은 <a href="/lab/blog/gpu/gpu-hpc-from-scratch">GPU HPC 전체 경로</a>에서 이어 읽는다.</p>
        </div>
        <GpuTopologyLab />
      </section>

      <section id="fleet-recovery" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Drain은 repair가 아니라 안전한 수리 시작점이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>XID, driver 또는 MIG 상태 변경을 감지하면 <strong>cordon → PDB를 고려한 eviction·drain → 진단·reset·reconfigure → plugin 재등록과 allocatable 확인 → canary warmup → uncordon</strong> 순서로 닫힌 loop를 만든다.</p>
          <p>Drain이 끝났다고 GPU가 고쳐진 것은 아니다. 실제 device health, resource 재광고, runtime sample, model warmup과 release-labelled SLO를 통과해야 새 capacity lease를 gateway registry에 publish한다.</p>
        </div>
      </section>

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다음 글에 넘길 산출물: capacity lease</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Fleet가 넘기는 것은 “H100 6개”라는 숫자가 아니라 <strong>release id, Service·endpoint identity, device/claim identity, allocation lane, node와 topology scope, sharing mode, current health, Ready endpoint 수, observation timestamp·TTL, drain state, Pending reason과 scale ETA</strong>다.</p>
          <p>이것은 LiteLLM이 Kubernetes claim을 자동으로 읽는다는 뜻이 아니다. 별도 registry·adapter가 이 snapshot을 gateway deployment id와 연결해야 한다. <InternalLink slug="litellm-gateway">Gateway</InternalLink>는 fresh snapshot만 받아 현재 traffic을 어느 deployment에 얼마나 보낼지 결정한다.</p>
        </div>
        <CapabilityCheck items={[
          'Advertised allocatable, scheduler-feasible free, allocated identity, current device health와 Ready endpoint를 구분할 수 있다.',
          'Device-plugin extended resource와 DRA ResourceClaim의 allocation lane을 섞지 않고 설명할 수 있다.',
          'Full GPU, MIG와 time slicing의 resource identity·isolation·sharing 경계를 구분할 수 있다.',
          'NUMA, NVLink domain과 node 간 RDMA fabric이 서로 다른 topology 증거임을 설명할 수 있다.',
          '장애 node를 drain한 뒤 어떤 증거가 있어야 capacity로 복귀시키는지 말할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Kubernetes Device Plugins', href: 'https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/', note: 'Kubelet device registration과 extended resource 경계.' },
          { label: 'Kubernetes GPU scheduling', href: 'https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/', note: 'GPU extended resource의 request·limit 규칙과 node label 선택.' },
          { label: 'Kubernetes DRA', href: 'https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/', note: 'Stable ResourceClaim·DeviceClass·ResourceSlice 의미. Cluster와 vendor driver 지원은 별도 확인.' },
          { label: 'Kubernetes 1.34 DRA GA', href: 'https://kubernetes.io/blog/2025/09/01/kubernetes-v1-34-dra-updates/', note: 'DRA core가 1.34에서 GA가 되고 기본 활성화된 근거.' },
          { label: 'Kubernetes 1.35 release', href: 'https://kubernetes.io/blog/2025/12/17/kubernetes-v1-35-release/', note: '1.34에서는 끌 수 있던 DRA core가 1.35부터 항상 활성화된 버전 경계.' },
          { label: 'Kubernetes Topology Manager', href: 'https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/', note: 'Kubelet의 node-local NUMA alignment 범위. NVLink·RDMA fabric 증거와는 다르다.' },
          { label: 'Kubernetes node drain', href: 'https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/', note: 'Cordon·eviction과 PodDisruptionBudget을 고려한 maintenance 진입 절차.' },
          { label: 'NVIDIA GPU Operator', href: 'https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/', note: 'Driver, toolkit, device plugin, GFD, DCGM과 MIG manager 구성요소.' },
          { label: 'NVIDIA MIG', href: 'https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-operator-mig.html', note: '지원 GPU의 secure partition과 profile 운영 경계.' },
          { label: 'NVIDIA time slicing', href: 'https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-sharing.html', note: 'Time multiplexing과 MIG-equivalent isolation 부재.' },
          { label: 'NVIDIA GPUDirect RDMA', href: 'https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-operator-rdma.html', note: 'Multi-node GPU direct path에 필요한 network driver와 RDMA resource 경계.' },
        ]} />
      </section>
    </>
  );
}
