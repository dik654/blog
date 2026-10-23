import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import VolumeStaircaseViz from "./kubernetes-pvc-pv-storageclass-csi/viz/VolumeStaircaseViz";
import NodeFailureVolumeClockViz from "./kubernetes-pvc-pv-storageclass-csi/viz/NodeFailureVolumeClockViz";
import { codeRefs } from "./kubernetes-pvc-pv-storageclass-csi/codeRefs";
import { kubernetesStorageTrees } from "./kubernetes-pvc-pv-storageclass-csi/fileTree";
import KubernetesSeriesLocator from "./kubernetes-shared/KubernetesSeriesLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function KubernetesPvcPvStorageClassCsiArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. PVC는 Bound인데 Pod는 왜 디스크를 기다리나요?</h2>
          <KubernetesSeriesLocator current="storage" path={["storage", "placement"]} question="PVC의 저장 요구는 어느 단계에서 실제 디스크와 Node의 mount로 바뀔까요?" />
          <div className={prose}>
            <p>
              (가정) 존 세 개짜리 클러스터에 PostgreSQL Pod 하나를 올립니다. 20Gi PVC를 만들자 몇 초 만에 Bound가 됐는데 Pod는 Pending에 멈췄고, 이벤트에는 "node(s) didn't match PersistentVolume's node affinity"가 남았습니다.</p>
            <p>그 문제를 고친 뒤 몇 주 지나 노드 하나가 죽었을 때는 새 Pod가 "Multi-Attach error"를 내며 10분 넘게 ContainerCreating에 머물렀습니다. 두 사건은 PVC를 디스크 자체로 보면 설명이 안 되고, PVC를 "조건을 적은 청구서"로 보면 한 줄로 설명됩니다.</p>
            <p>
              답을 먼저 적겠습니다. PVC는 용량·접근 모드·클래스를 적은 청구서이고, PV 컨트롤러가 그것을 실제 디스크를 가리키는 PV 하나와 1:1로 묶습니다. 묶인 디스크는 Pod가 배치된 노드에 붙어야(attach) 하고, 노드에서 한 번 마운트(stage)된 뒤 Pod마다 다시 마운트(publish)돼야 컨테이너가 파일을 씁니다. 계단마다 담당 컨트롤러가 다르고 각자 다른 이벤트를 남기므로, "PVC Bound"는 첫 계단이 끝났다는 뜻일 뿐입니다.
            </p>
            <p>
              이 글은 Kubernetes v1.37.1 원문과 CSI 명세로 그 계단을 하나씩 따라가고, 노드가 죽었을 때 디스크가 새 노드로 가기까지 왜 6분이 더 걸리는지 조건식까지 읽습니다. 디스크를 마운트하는 커널 쪽 바닥(VFS·mount·bind mount)은 <a href="/cs/cloud/linux-vfs-mount-page-cache-fsync#overview">파일이 디스크에 닿기까지</a>에서, 노드가 NotReady로 판정되는 50초와 toleration 300초는 <a href="/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview">Pod가 Node에 오르기까지</a>에서 다룹니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 청구서 하나가 디렉터리 하나가 되기까지 다섯 담당자가 바뀝니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 흐름은 다섯 칸입니다. 사용자가 PVC를 만들면 PV 컨트롤러가 맞는 PV를 찾거나 StorageClass로 새로 만들게 합니다. Pod가 노드에 배치되면 attach-detach 컨트롤러가 디스크를 그 노드에 붙입니다. 노드의 kubelet이 디스크를 한 번 포맷·마운트하고, Pod마다 그 마운트를 Pod의 디렉터리로 다시 묶습니다. 마지막으로 PVC가 지워지면 PV의 reclaimPolicy가 디스크를 지울지 남길지 정합니다.
            </p>
            <p>
              이 칸들은 세 프로세스에 흩어져 있습니다. PV 컨트롤러와 attach-detach 컨트롤러는 kube-controller-manager 안에 있고, 디스크를 실제로 만들고 붙이는 CSI 호출은 스토리지 벤더가 배포한 sidecar(external-provisioner, external-attacher)가 하며, 마운트는 각 노드의 kubelet이 노드 플러그인을 불러서 합니다.</p>
            <p>그래서 같은 "볼륨 문제"라도 증거가 남는 곳이 PVC 이벤트, VolumeAttachment 객체, Pod 이벤트, kubelet 로그로 갈립니다.</p>
            <p>
              이 글이 다루지 않는 것도 적어 둡니다. 어떤 스토리지(블록·파일·오브젝트)를 고를지는 <a href="/cs/cloud/cloud-storage-database-selection#overview">클라우드 저장소 선택</a>에 있고, 디스크가 꽉 찼을 때의 inode·예약 블록 회계는 <a href="/cs/cloud/linux-disk-full-inode-deleted-files#overview">디스크 풀 장애</a>에 있습니다. 여기서는 "PVC가 어떻게 컨테이너의 디렉터리가 되고 어디서 멈추는가"만 끝까지 봅니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 존 a에 만든 디스크는 존 c 노드의 Pod를 기다리게 합니다</h2>
          <div className={prose}>
            <p>
              (가정) 클러스터는 존 a·b·c에 노드가 두 대씩이고, StorageClass fast는 volumeBindingMode를 적지 않아 기본값 Immediate입니다. 20Gi RWO PVC를 만들자 PV 컨트롤러는 맞는 PV가 없음을 보고 바로 프로비저닝을 시작했고, external-provisioner는 Pod 정보가 없으니 임의의 존 a에 디스크를 만들었습니다. 몇 초 뒤 PV가 생기고 PVC는 Bound입니다.
            </p>
            <p>
              그다음 PostgreSQL Pod가 메모리 8Gi를 요청합니다. 존 a의 두 노드는 남은 메모리가 4Gi씩이라 걸러지고, 8Gi가 남은 노드는 존 c에만 있습니다. 그런데 이 PV의 nodeAffinity는 존 a라 존 c 노드도 걸러집니다.</p>
            <p>결과는 여섯 노드 전부 탈락이고 이벤트는 "0/6 nodes are available: 2 Insufficient memory, 4 node(s) didn't match PersistentVolume's node affinity"입니다. 디스크는 이미 만들어졌고 PVC는 Bound라 되돌릴 수도 없습니다.</p>
            <p>
              StorageClass를 WaitForFirstConsumer로 바꾸면 순서가 뒤집힙니다. PVC는 Pod가 생길 때까지 Pending으로 기다리고, 스케줄러가 메모리를 보고 존 c 노드를 먼저 고른 뒤 PVC에 그 노드를 적어 주면, 그제야 external-provisioner가 존 c에 디스크를 만듭니다. 묶이는 순서가 "디스크 → Pod"에서 "Pod → 디스크"로 바뀌는 것이 이 글의 첫 번째 메커니즘입니다.
            </p>
          </div>
          <div id="paper-sc-binding-mode" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Storage Classes · Volume binding mode (website main, 2026-10-17 확인)" citeKey={1} href="https://kubernetes.io/docs/concepts/storage/storage-classes/#volume-binding-mode">
              <q>When unset, Immediate mode is used by default.</q> 같은 절은 Immediate에서 토폴로지 제약이 있는 스토리지가 Pod의 스케줄 조건을 모른 채 만들어져 "This may result in unschedulable Pods"라고 적고, WaitForFirstConsumer를 쓸 때 Pod spec에 nodeName을 쓰면 스케줄러가 우회되어 PVC가 pending에 남는다고 경고합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="names" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 묶기는 두 포인터, 상태는 네 단계, 접근 모드는 노드 단위입니다</h2>
          <div className={prose}>
            <p>
              앞 절의 과정에 표준 이름을 붙입니다. 사용자가 만드는 청구서가 PersistentVolumeClaim(PVC)이고, 실제 디스크를 가리키는 클러스터 자원이 PersistentVolume(PV)입니다. 둘을 묶는 것을 바인딩이라 부르는데, 컨트롤러 설계 주석은 이것을 두 포인터로 정의합니다.</p>
            <p>PV.spec.claimRef가 PVC를 가리키고 PVC.spec.volumeName이 PV를 가리키며, 트랜잭션이 없는 API라 두 번에 나눠 저장합니다. 한쪽만 적으면 HA 컨트롤러 두 개가 같은 PV를 두 PVC에 묶어 데이터를 잃을 수 있어서입니다.</p>
            <p>
              PV의 phase는 네 가지입니다. Available은 아직 아무 PVC도 가리키지 않는 상태, Bound는 묶인 상태, Released는 PVC가 지워졌지만 디스크를 아직 정리하지 않은 상태, Failed는 자동 정리가 실패한 상태입니다. Released가 핵심인데, 데이터가 남아 있어 다른 PVC가 이 PV를 받을 수 없습니다.
            </p>
            <p>
              PV를 미리 만들어 두는 것이 정적 프로비저닝이고, 맞는 PV가 없을 때 StorageClass가 가리키는 provisioner로 새로 만드는 것이 동적 프로비저닝입니다. PVC가 storageClassName을 비우면 기본 클래스(주석 storageclass.kubernetes.io/is-default-class: "true")를 받고, 빈 문자열 ""로 명시하면 동적 프로비저닝을 끕니다.</p>
            <p>기본 클래스가 없는 클러스터에서 storageClassName 없이 PVC를 만들면 "no persistent volumes available for this claim and no storage class is set"으로 Pending에 남습니다.</p>
            <p>
              접근 모드는 흔히 오해하는 자리입니다. ReadWriteOnce(RWO)는 "노드 하나가 읽고 쓸 수 있다"는 뜻이라 같은 노드의 Pod 여러 개는 동시에 쓸 수 있고, Pod 하나로 제한하려면 v1.29에서 stable이 된 ReadWriteOncePod(RWOP)를 써야 합니다.</p>
            <p>그리고 문서가 못 박듯 접근 모드는 마운트 뒤의 쓰기 보호를 강제하지 않습니다. RWO·ROX·RWX는 PVC와 PV를 맞추는 조건이자 어느 노드에 붙일 수 있는지의 제약일 뿐이고, RWOP만 Pod 단위로 실제 제약을 겁니다.</p>
          </div>
          {code("pv-bind-design", "두 포인터와 두 단계 저장 (설계 주석)")}
          {code("pv-default-retain", "수동 PV의 기본 reclaimPolicy")}
          <div id="paper-access-modes" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Persistent Volumes · Access Modes (website main, 2026-10-17 확인)" citeKey={2} href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes">
              <q>ReadWriteOnce access mode still can allow multiple pods to access (read from or write to) that volume when the pods are running on the same node.</q> 같은 절은 ReadWriteOncePod를 v1.29 stable로 표시하고 CSI 볼륨과 csi-provisioner v3.0.0+, csi-attacher v3.3.0+가 필요하다고 적습니다. 접근 모드가 마운트 뒤 쓰기 보호를 강제하지 않는다는 주의도 같은 절에 있습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="wffc" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. WaitForFirstConsumer는 스케줄러가 PVC에 노드 이름을 적어 주는 약속입니다</h2>
          <div className={prose}>
            <p>
              3절에서 순서를 뒤집은 장치가 어떻게 동작하는지 봅니다. PV 컨트롤러는 묶이지 않은 PVC를 볼 때마다 StorageClass의 volumeBindingMode를 읽습니다. WaitForFirstConsumer이고 PVC에 아직 노드 이름이 없으면 Normal 이벤트 "waiting for first consumer to be created before binding"만 남기고 아무것도 만들지 않습니다. 이 Pending은 오류가 아니라 설계된 대기입니다.
            </p>
            <p>
              스케줄러 쪽에서는 volumebinding 플러그인이 일합니다. 필터 단계에서 노드마다 Pod의 모든 PVC를 검사해 이미 묶인 PV의 nodeAffinity가 맞는지, 묶이지 않은 PVC에 그 노드에서 쓸 수 있는 PV가 있는지, 저장 용량이 충분한지 봅니다.</p>
            <p>점수까지 매겨 노드를 고르면 Reserve 단계에서 동적 프로비저닝 대상 PVC에 주석 volume.kubernetes.io/selected-node = 노드 이름을 씁니다. external-provisioner는 이 주석을 보고 그 노드의 존에 디스크를 만들고, PV 컨트롤러는 그 PV를 PVC에 묶습니다.</p>
            <p>
              이 구조에서 nodeName 함정이 나옵니다. Pod spec에 spec.nodeName을 직접 적으면 스케줄러가 그 Pod를 아예 보지 않으므로 Reserve 단계도 없고 주석도 생기지 않습니다.</p>
            <p>PVC는 WaitForFirstConsumer 이벤트만 반복하며 영원히 Pending이고 Pod는 ContainerCreating에서 볼륨을 기다립니다. 특정 노드에 고정하고 싶으면 nodeSelector kubernetes.io/hostname을 써서 스케줄러를 통과시켜야 합니다.</p>
          </div>
          {code("pv-wffc-event", "WaitForFirstConsumer 이벤트 문구")}
          {code("sched-volume-reasons", "스케줄러가 노드를 거르는 네 가지 이유")}
          {code("sched-assume-selected-node", "selected-node 주석을 쓰는 곳")}
        </section>

        <section id="csi-path" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 디스크는 만들고, 붙이고, 노드에 한 번 마운트하고, Pod마다 다시 묶습니다</h2>
          <div className={prose}>
            <p>
              PVC가 Bound가 된 뒤의 세 계단은 CSI(Container Storage Interface) 명세가 정한 네 상태로 설명됩니다. CreateVolume으로 CREATED, ControllerPublishVolume으로 NODE_READY, NodeStageVolume으로 VOL_READY, NodePublishVolume으로 PUBLISHED입니다. 앞의 두 호출은 컨트롤러 플러그인이 받고 뒤의 두 호출은 각 노드에서 도는 노드 플러그인이 받습니다.
            </p>
            <p>
              Kubernetes는 이 호출을 직접 하지 않고 객체와 sidecar로 간접화합니다. PVC가 생기면 external-provisioner가 StorageClass의 parameters를 CreateVolumeRequest.parameters에 담아 CreateVolume을 부르고 PV 객체를 만듭니다.</p>
            <p>Pod가 노드에 묶이면 attach-detach 컨트롤러가 VolumeAttachment 객체를 만들고, external-attacher가 그 객체를 보고 ControllerPublishVolume을 불러 status.attached를 true로 바꿉니다. NFS처럼 붙인다는 개념이 없는 드라이버는 CSIDriver 객체에 attachRequired: false를 적어 이 계단을 통째로 건너뜁니다.</p>
            <p>
              노드에서는 kubelet이 두 번 마운트합니다. MountDevice가 NodeStageVolume을 불러 디스크를 포맷하고 노드 전역 staging 경로에 한 번 마운트하고, SetUpAt이 Pod마다 NodePublishVolume을 불러 그 staging 경로를 Pod의 volumes 디렉터리에 bind mount합니다.</p>
            <p>같은 노드에서 Pod 두 개가 같은 PV를 쓰면 stage는 한 번, publish는 두 번입니다. RWO가 Pod 단위가 아니라 노드 단위인 이유가 이 두 겹 구조에 있습니다. bind mount 자체가 커널에서 무엇인지는 <a href="/cs/cloud/linux-vfs-mount-page-cache-fsync#overview">VFS·mount 글</a>이 설명합니다.</p>
            <p>해제는 역순입니다. Pod가 사라지면 NodeUnpublish, 그 노드의 마지막 Pod가 사라지면 NodeUnstage, 그다음 ControllerUnpublish로 노드에서 떼고, PVC가 지워지고 reclaimPolicy가 Delete면 DeleteVolume입니다. 8절의 "6분"은 이 역순의 ControllerUnpublish 앞에서 기다리는 시간입니다.</p>
          </div>
          <VolumeStaircaseViz />
          {code("csi-spec-lifecycle", "CSI 명세 Figure 6")}
          {code("csi-attach-va", "VolumeAttachment를 만드는 Attach")}
          {code("csi-node-stage", "NodeStageVolume 호출 (MountDevice)")}
          {code("csi-node-publish", "NodePublishVolume 호출 (SetUpAt)")}
        </section>

        <section id="controller-source" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 원문은 PV를 찾고, 없으면 기다리거나 만들고, 찾으면 네 번 저장합니다</h2>
          <div className={prose}>
            <p>
              Kubernetes v1.37.1 pkg/controller/volume/persistentvolume/pv_controller.go의 syncUnboundClaim(332행부터)이 묶이지 않은 PVC를 처리하는 본체입니다.</p>
            <p>338행이 StorageClass에서 WaitForFirstConsumer 여부를 읽고, 344행이 이미 있는 Available PV 가운데 용량·접근 모드·클래스가 맞는 것을 찾습니다. 3절의 Immediate 사례는 여기서 PV를 못 찾아 아래로 내려갑니다.</p>
            <p>
              354~363행은 PVC에 storageClassName이 없으면 기본 클래스를 채우고 sync를 다시 시작합니다. 그다음 switch가 세 갈래입니다.</p>
            <p>366~370행은 WaitForFirstConsumer이고 노드 주석이 없으면 이벤트만 남기고, 371~380행은 클래스가 있으면 provisionClaim으로 비동기 프로비저닝을 시작하며, 381~382행은 둘 다 아니면 FailedBinding "no persistent volumes available for this claim and no storage class is set"을 남깁니다. 4절의 세 가지 Pending 이유가 이 세 줄입니다.</p>
            <p>
              PV를 찾았거나 만들어졌으면 1095행 bind가 네 번 저장합니다. PV.spec.claimRef(1105행), PV phase Bound(1111행), PVC.spec.volumeName과 bind-completed 주석(1117행), PVC phase Bound(1123행) 순입니다.</p>
            <p>어느 저장이 실패해도 함수는 돌아가고 다음 syncClaim이 남은 단계를 이어서 합니다. 4절의 "두 포인터"가 실제로는 네 번의 API 쓰기라는 점이 kubectl get pv와 get pvc의 STATUS가 몇 초 어긋나 보이는 이유입니다.</p>
            <p>PVC가 지워지면 syncVolume(563행)이 PV의 claimRef가 가리키는 PVC를 찾지 못하고, 672~681행에서 phase를 Released로 바꾼 뒤 682행 reclaimVolume을 부릅니다. reclaimVolume(1181행)은 Retain이면 로그 한 줄로 끝내고, Delete면 deleteVolumeOperation을 예약해 CSI DeleteVolume으로 실제 디스크를 지웁니다.</p>
          </div>
          {code("pv-sync-unbound", "syncUnboundClaim 원문")}
          {code("pv-bind", "bind의 네 번 저장")}
          {code("pv-released", "Released로 바꾸는 곳")}
          {code("pv-reclaim-policy", "reclaimVolume 세 갈래")}
          {code("sched-find-pod-volumes", "FindPodVolumes 네 가지 불리언")}
        </section>

        <section id="node-failure" data-teach-level="5" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 노드가 죽으면 디스크는 unhealthy 판정 뒤 6분을 더 기다려야 떨어집니다</h2>
          <div className={prose}>
            <p>
              1절의 두 번째 사건으로 갑니다. (가정) worker-a에서 PostgreSQL Pod가 돌던 중 kubelet이 멈췄습니다.</p>
            <p>50초 뒤 node lifecycle 컨트롤러가 Ready를 Unknown으로 바꾸고 unreachable taint를 달며, 모든 Pod가 기본으로 가진 toleration 300초가 지나면 Pod가 삭제되고 StatefulSet 컨트롤러가 worker-b에 새 Pod를 만듭니다. 이 시계는 <a href="/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview">Pod가 Node에 오르기까지</a>에 있습니다. 여기서는 그다음, 디스크가 따라오는 시계만 봅니다.</p>
            <p>
              attach-detach 컨트롤러는 desired state(어느 노드에 어떤 볼륨이 있어야 하나)와 actual state(실제로 어디에 붙어 있나)를 비교합니다. 새 Pod 때문에 desired는 worker-b인데 actual은 "worker-a에 attach, 아직 mount 중"입니다. MountedByNode는 노드가 자기 status에 보고하는 값인데 worker-a는 죽어서 마지막 보고가 그대로 남아 있습니다.</p>
            <p>컨트롤러는 마운트 중인 볼륨은 떼지 않으므로 detach를 건너뛰고, worker-b의 새 Pod에는 FailedAttachVolume "Multi-Attach error … Volume is already exclusively attached to one node, waiting on detach before it can be attached to another node"가 남습니다.</p>
            <p>
              이 교착을 푸는 것이 ReconcilerMaxWaitForUnmountDuration 6분입니다. 다만 조건이 하나 더 있습니다. 코드의 조건식은 forceDetach = !isHealthy && 6분 경과 && 기능 플래그 미차단이라, 노드가 Ready가 아니어야 합니다.</p>
            <p>건강한 노드에서 unmount가 끝나지 않으면 6분이 지나도 강제로 떼지 않습니다. "Multi-Attach는 6분 지나면 저절로 풀린다"는 반만 맞고, 노드가 살아 있는데 Pod가 둘인 경우(RWO PVC를 replicas 2 Deployment가 쓰는 경우)에는 영원히 풀리지 않습니다.</p>
            <p>아래 의사코드는 reconciler.go 165~300행의 detach 결정을 한 줄씩 펼친 것입니다. 각 줄의 설명에 worker-a 사례의 값을 적었습니다.</p>
          </div>
          <AlgorithmBlock
            title="attach-detach 컨트롤러가 볼륨 하나를 뗄지 정하는 순서 (100 ms마다)"
            input={[
              "attached = {volume: pv-pg, node: worker-a, MountedByNode: true (마지막 보고)}",
              "desired = {volume: pv-pg, node: worker-b} (새 Pod)",
              "maxWaitForUnmountDuration = 6 min, disableForceDetachOnTimeout = false",
              "worker-a Ready 조건 = Unknown",
            ]}
            steps={[
              { code: "if desired.has(volume, node): continue", note: "worker-a에는 더 이상 이 볼륨이 있어야 할 이유가 없으므로 아래로 내려갑니다." },
              { code: "elapsed = SetDetachRequestTime(volume, node)", note: "처음 보는 순간 detach 요청 시각을 기록합니다. 새 Pod가 생긴 t ≈ 350 s가 출발점입니다." },
              { code: "expired = elapsed > 6 min", note: "t ≈ 350 s + 360 s = 710 s가 돼야 참입니다. 그 전까지는 아래 줄에서 매번 건너뜁니다." },
              { code: "isHealthy = nodeReady(node)", note: "worker-a는 Unknown이라 false입니다. 건강한 노드였다면 true라 forceDetach는 영원히 false입니다." },
              { code: "forceDetach = !isHealthy && expired && !disableForceDetachOnTimeout", note: "세 조건 모두 참이 되는 t ≈ 710 s부터 true입니다." },
              { code: "if MountedByNode && !forceDetach && !hasOutOfServiceTaint: continue", note: "710 s 전에는 '아직 마운트 중'이라 건너뜁니다. 새 Pod는 그동안 Multi-Attach 경고를 봅니다. out-of-service taint가 있으면 이 줄을 바로 통과합니다." },
              { code: "verifySafeToDetach = !expired && !hasOutOfServiceTaint; DetachVolume(volume, verifySafeToDetach)", note: "강제 detach에서는 안전 확인을 생략하고 떼어 냅니다. 로그에 'maxWaitForUnmountDuration expired, force detaching'이 남습니다." },
            ]}
            repeatUntil="actual state에서 worker-a의 attach가 사라지면 다음 reconcile이 worker-b에 attach를 시작합니다."
            output="worker-b에 VolumeAttachment가 만들어지고 external-attacher가 붙인 뒤 kubelet이 NodeStage·NodePublish를 마치면 Pod가 Running입니다."
          />
          <CalculationWalkthrough
            title="노드 장애부터 새 Pod가 디스크를 쓰기까지"
            question="기본값만으로 PostgreSQL Pod가 다른 노드에서 디스크를 다시 쓰기까지 얼마나 걸릴까요?"
            scope="kube-controller-manager·kube-apiserver admission·attach-detach 컨트롤러의 v1.37.1 기본값을 더합니다. 스케줄·이미지 pull·드라이버의 attach 시간은 α로 둡니다. 실측이 아닙니다."
            steps={[
              { label: "NotReady 판정", expression: "NodeMonitorGracePeriod", result: "50 s", reason: "Lease 갱신이 끊긴 뒤 Ready를 Unknown으로 바꾸기까지입니다(v1.32부터 50 s)." },
              { label: "Pod 축출", expression: "50 + DefaultTolerationSeconds 300", result: "≈ 350 s", reason: "unreachable taint에 대한 기본 toleration이 끝나야 Pod가 삭제되고 새 Pod가 생깁니다." },
              { label: "detach 대기", expression: "350 + ReconcilerMaxWaitForUnmountDuration 360", result: "≈ 710 s", reason: "새 Pod가 desired state에 들어온 시각부터 6분이고, 노드가 unhealthy여야 이 시점에 강제 detach합니다." },
              { label: "다시 붙이기", expression: "710 + α", result: "≈ 12 min + α", reason: "worker-b에 attach, NodeStage, NodePublish가 끝나야 Pod가 Running입니다. α는 드라이버마다 다릅니다." },
            ]}
            conclusion="디스크를 쓰는 Pod는 노드 장애 뒤 기본값으로 약 12분을 기다립니다. 앞의 350초는 노드 생명주기 설정으로, 뒤의 6분은 out-of-service taint로만 줄일 수 있습니다."
            caveats={["StatefulSet Pod는 이름이 같은 Pod가 둘일 수 없어 노드가 Unknown인 동안 옛 Pod가 Terminating에 머물면 새 Pod 생성 자체가 더 늦어질 수 있습니다.", "건강한 노드에서 unmount가 끝나지 않는 경우(RWO를 Pod 둘이 쓰는 경우)는 이 계산에 들어가지 않고 영원히 기다립니다."]}
          />
          <NodeFailureVolumeClockViz />
          {code("adc-six-minutes", "6분 기본값과 주석")}
          {code("adc-force-detach", "forceDetach 조건식")}
          {code("adc-multi-attach", "Multi-Attach 이벤트 두 문구")}
        </section>

        <section id="reclaim-protection" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. PVC를 지워도 디스크가 남는지는 누가 PV를 만들었는지에 달렸습니다</h2>
          <div className={prose}>
            <p>
              같은 PV인데 기본값이 다른 자리가 있습니다. 관리자가 직접 만든 PV는 reclaimPolicy를 비우면 Retain이고(core/v1 defaults.go 328~330행), StorageClass가 동적으로 만든 PV는 클래스의 reclaimPolicy를 따르며 클래스에 적지 않으면 Delete입니다. 그래서 동적 프로비저닝 환경에서 PVC를 지우면 대개 디스크도 사라지고, 정적 PV를 쓰는 환경에서는 PV가 Released로 남습니다.
            </p>
            <p>
              Retain 뒤의 Released PV는 재사용할 수 없습니다. 문서가 적는 절차는 PV 객체 삭제(백엔드 디스크는 남음) → 데이터 정리 → 디스크 삭제이거나, 같은 디스크를 가리키는 새 PV를 다시 만드는 것입니다. 데이터를 지키려고 Retain을 골랐다면 "Released PV가 쌓이는 것"이 정상 상태이고, 이것을 지우는 운영 절차가 따로 필요합니다.
            </p>
            <p>
              삭제 쪽에는 보호 장치가 둘 있습니다. Pod가 쓰고 있는 PVC는 지워도 finalizer kubernetes.io/pvc-protection 때문에 Terminating에 머물다 마지막 Pod가 사라져야 실제로 지워지고, PVC가 묶인 PV도 kubernetes.io/pv-protection으로 같은 보호를 받습니다. "PVC가 Terminating에서 안 움직인다"는 kubectl describe pvc의 Used By에 Pod가 남아 있다는 뜻입니다.
            </p>
            <p>
              StatefulSet은 한 겹 더 있습니다. volumeClaimTemplates로 Pod마다 PVC를 만들지만 persistentVolumeClaimRetentionPolicy의 기본값은 whenDeleted: Retain, whenScaled: Retain이라 StatefulSet을 지우거나 줄여도 PVC는 남습니다.</p>
            <p>다시 늘리면 같은 이름의 PVC가 같은 데이터로 붙습니다. 이 기능(StatefulSetAutoDeletePVC)은 v1.32에서 stable이 됐고, 지우고 싶으면 whenDeleted: Delete를 명시해야 합니다.</p>
          </div>
          <div id="paper-retain" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Persistent Volumes · Reclaiming / Retain (website main, 2026-10-17 확인)" citeKey={3} href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/#retain">
              <q>But it is not yet available for another claim because the previous claimant's data remains on the volume.</q> 같은 절은 관리자가 PV를 지우고(외부 디스크는 남음) 데이터를 정리한 뒤 디스크를 지우거나 같은 디스크로 새 PV를 만들라고 적습니다. Storage Classes 문서는 클래스에 reclaimPolicy를 적지 않으면 Delete라고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 증상마다 볼 객체가 다르고, 고를 것은 바인딩 모드·접근 모드·reclaimPolicy입니다</h2>
          <div className={prose}>
            <p>
              진단은 계단 순서대로 합니다. PVC가 Pending이면 kubectl describe pvc의 이벤트가 WaitForFirstConsumer인지 FailedBinding인지 봅니다. 전자는 쓰는 Pod가 아직 스케줄되지 않은 것이고 후자는 기본 클래스가 없거나 이름이 틀린 것입니다.</p>
            <p>Pod가 Pending이고 이유가 "didn't match PersistentVolume's node affinity"면 PV의 nodeAffinity와 Pod의 배치 조건이 어긋난 것이라 Immediate로 만든 디스크의 존을 의심합니다.</p>
            <p>
              Pod가 ContainerCreating이면 두 갈래입니다. FailedAttachVolume에 Multi-Attach가 있으면 kubectl get volumeattachment로 옛 노드의 attach를 확인하고 그 노드가 Ready인지 봅니다.</p>
            <p>노드가 살아 있으면 RWO PVC를 Pod 둘이 쓰는 설계 문제이고, 죽었으면 6분을 기다리거나 out-of-service taint를 답니다. FailedMount에 MountVolume.MountDevice 또는 SetUp failed가 있으면 노드 플러그인 쪽이라 CSI 노드 Pod 로그와 kubelet 로그를 봅니다.</p>
            <p>
              설계에서 고를 것은 셋입니다. 존이 있는 클라우드 디스크라면 StorageClass를 WaitForFirstConsumer로 두어 디스크가 Pod를 따라가게 합니다. RWO 디스크를 쓰는 워크로드는 replicas 1의 StatefulSet로 두고, 여러 Pod가 같은 데이터를 써야 하면 RWX 파일 스토리지나 RWOP가 맞는지 다시 묻습니다.</p>
            <p>reclaimPolicy는 "PVC를 실수로 지웠을 때 데이터를 잃어도 되는가"로 정하고, Retain을 골랐다면 Released PV를 정리하는 절차를 함께 둡니다.</p>
            <p>이 글의 시간 수치는 v1.37.1 기본값의 합이며 실제 클러스터를 돌려 잰 것이 아닙니다. 드라이버의 attach·stage 시간, StatefulSet의 Pod 교체 시점, 클라우드 쪽 API 지연은 환경마다 다릅니다. Pod가 Running이 된 뒤 종료될 때 디스크와 연결이 어떤 순서로 정리되는지는 <a href="/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#overview">Pod 종료와 rollout</a>에서 이어집니다.</p>
          </div>
          <ContentBoundary article="kubernetes-pvc-pv-storageclass-csi" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>3절의 클러스터에서 StorageClass를 WaitForFirstConsumer로 바꾼 뒤 Pod spec에 spec.nodeName: worker-c1을 직접 적으면 PVC와 Pod는 각각 어떤 상태에 머무를까요? (답: 5절)</p>
            <p>8절에서 worker-a가 죽은 것이 아니라 살아 있고, 같은 RWO PVC를 쓰는 Deployment의 replicas를 2로 올려 두 번째 Pod가 worker-b에 갔다면 6분 뒤 무슨 일이 일어날까요? (답: 8절)</p>
            <p>관리자가 직접 만든 PV와 StorageClass가 만든 PV를 각각 reclaimPolicy 없이 두고 PVC를 지우면 두 PV의 phase와 백엔드 디스크는 어떻게 달라질까요? (답: 9절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={kubernetesStorageTrees}
        projectMetas={{
          kubernetes: { id: "kubernetes", label: "Kubernetes v1.37.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          "csi-spec": { id: "csi-spec", label: "CSI 명세 (master, 2026-10-17)", badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700" },
        }}
      />
    </>
  );
}
