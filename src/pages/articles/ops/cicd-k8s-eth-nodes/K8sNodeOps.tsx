export default function K8sNodeOps() {
  return (
    <section id="k8s-isolation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2. 쿠버네티스 & 노드 격리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GitHub 사고에서 가장 인상적인 부분은 패치 자체가 아니라, <strong>다른 제품 라인 코드를 같은 이미지에 굽지 말라</strong>는 후속 조치다.
          <br />
          쿠버네티스 운영의 절반은 컨테이너/이미지 위생, 나머지 절반은 격리 경계 설계다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-1. 이미지 미니마이제이션 — 깎을수록 안전하다</h3>
        <ul className="leading-7">
          <li><strong>멀티스테이지 빌드</strong> — 빌드 도구(컴파일러, npm)는 <code>builder</code> 단계에만 두고, 런타임 단계는 정적 바이너리 + libc 만 복사.</li>
          <li><strong>distroless / scratch</strong> — bash, sh, apk 가 없으면 RCE 후 후속 동작이 거의 다 실패한다. <code>kubectl exec</code> 도 안 된다는 뜻이라 디버깅 디자인은 사이드카 + ephemeral container 로.</li>
          <li><strong>SBOM + Trivy/Grype</strong> — 이미지 빌드 시 Software Bill of Materials 생성, CI 단계에서 취약점 스캔. 배포 게이트로 거는 게 핵심 — 스캔만 하고 그냥 배포하면 의미 없음.</li>
          <li><strong>이미지 서명/검증</strong> — <code>cosign sign</code> + Kubernetes 어드미션(Policy Controller, Kyverno, Connaisseur)에서 서명 검증. 미서명 이미지는 클러스터에 못 들어옴.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-2. 러너 격리 — CI/CD 가 클러스터를 점유하지 않게</h3>
        <p className="leading-7">
          GitHub Actions self-hosted 러너, GitLab Runner, Buildkite agent 가 K8s 위에서 도는 경우가 많다.
          <br />
          러너는 본질적으로 신뢰할 수 없는 코드를 실행하는 환경이라, 클러스터에서 가장 격리가 강해야 한다.
        </p>
        <ul className="leading-7">
          <li><strong>전용 노드 풀 + taint</strong> — <code>node-role=ci</code> taint, <code>tolerations</code> 로만 스케줄. 다른 워크로드가 같은 노드에 못 앉게.</li>
          <li><strong>샌드박스 런타임</strong> — gVisor(<code>runsc</code>) 또는 Kata Containers(microVM)로 런타임 분리. 일반 <code>runc</code> 는 커널 공유라 0-day 한 번에 클러스터 전체 위험.</li>
          <li><strong>네트워크 분리</strong> — NetworkPolicy 로 러너 → 클러스터 내부 서비스 차단. egress 만 인터넷 허용, 사내 시스템엔 명시적 화이트리스트.</li>
          <li><strong>일회성 러너</strong> — 한 잡당 새 Pod. <code>actions-runner-controller</code>, <code>karpenter</code> 로 잡 종료 시 노드까지 폐기. 잔존 상태가 다음 잡으로 누설되지 않게.</li>
          <li><strong>OIDC + 단명 토큰</strong> — 클라우드 권한은 GitHub OIDC trust policy 로 30 분 토큰 받아쓴다. long-lived AWS access key 를 시크릿으로 박는 시대는 끝.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-3. RBAC · NetworkPolicy · PSA — 최소권한 3 종</h3>
        <ul className="leading-7">
          <li><strong>RBAC</strong> — ServiceAccount 별 권한 분리. 기본은 zero. 클러스터-와이드 권한(<code>cluster-admin</code>)은 세 자리 숫자로 셀 수 있어야 함.</li>
          <li><strong>NetworkPolicy</strong> — default-deny ingress/egress 부터 시작. 허용은 명시적으로. CNI 가 NetworkPolicy 를 지원하는지(Calico, Cilium) 확인.</li>
          <li><strong>Pod Security Admission</strong> — 네임스페이스 라벨로 <code>restricted</code> 강제. <code>privileged</code>, <code>hostPath</code>, <code>hostNetwork</code> 는 자동 거부.</li>
          <li><strong>seccomp · AppArmor</strong> — 시스템 콜 화이트리스트. 디폴트 프로파일이라도 켜면 컨테이너 탈출 난이도가 뛴다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-4. 시크릿 관리 — etcd 평문은 해도 너무 한다</h3>
        <ul className="leading-7">
          <li><strong>etcd 암호화 at rest</strong> — KMS 백엔드(<code>kms</code> provider)로 envelope encryption. <code>aescbc</code> 만 켜는 건 키가 클러스터 안에 있어 침해 시 의미 약함.</li>
          <li><strong>외부 시크릿 매니저</strong> — Vault / AWS Secrets Manager / GCP Secret Manager 를 <code>External Secrets Operator</code> 로 동기화. 시크릿 회전이 운영 작업이 아니라 자동 이벤트가 됨.</li>
          <li><strong>SPIFFE/SPIRE</strong> — 워크로드 ID 를 단명 X.509 SVID 로 발급. 시크릿 자체를 없애는 방향(Workload Identity).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-5. 옵저버빌리티 — 비정상을 못 보면 못 막는다</h3>
        <p className="leading-7">
          GitHub 가 75 분 패치를 가능케 한 핵심은 &quot;안 가는 길에 카운터를 박아둔&quot; 텔레메트리였다.
          <br />
          K8s 운영도 마찬가지 — 평소엔 0 인 메트릭을 명시 노출하고, 1 이 되는 순간 페이지.
        </p>
        <ul className="leading-7">
          <li><strong>4 골든 시그널 + 이상 진입</strong> — latency, traffic, errors, saturation 위에 &quot;없어야 정상&quot; 카운터(예: pod 가 host network 모드로 뜬 횟수, deny-all NetworkPolicy 위반).</li>
          <li><strong>Falco / Tetragon</strong> — 커널 레벨 시스템 콜 감시. <code>shell in container</code>, <code>writable proc</code> 같은 이벤트 알람.</li>
          <li><strong>감사 로그</strong> — kube-apiserver audit log 를 SIEM 으로. <code>verb=create</code> on <code>RoleBinding</code>/<code>ClusterRoleBinding</code> 은 항상 사람 눈으로 검토.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-6. StatefulSet 과 노드형 워크로드 — 검증자 fleet 패턴</h3>
        <p className="leading-7">
          이더리움 노드, 데이터베이스, 검증자 같은 stateful 워크로드는 Deployment 가 아니라 StatefulSet 으로 띄운다.
          <br />
          핵심 차이는 셋 — 안정적 네트워크 ID(<code>pod-0</code>, <code>pod-1</code>), 순서 있는 시작/종료, PVC 의 1:1 영속 바인딩.
        </p>
        <ul className="leading-7">
          <li><strong>volumeClaimTemplates</strong> — 각 replica 별 PVC 자동 생성. 노드 교체 시 같은 PV 가 새 Pod 에 다시 마운트되어 sync 손실 없음. <code>storageClassName: local-path</code>(NVMe 직결) 또는 <code>topology-aware</code> CSI 로 같은 zone 에 락.</li>
          <li><strong>podManagementPolicy</strong> — 기본 <code>OrderedReady</code>는 0→1→2 순차. 검증자 fleet 처럼 독립 인스턴스면 <code>Parallel</code>로 바꿔 시작 시간 단축.</li>
          <li><strong>PodDisruptionBudget</strong> — 자율 maintenance(노드 드레인) 도중 동시 다운 가능한 수 제한. 검증자라면 <code>maxUnavailable: 1</code> 로 한 번에 한 개씩만 빠지게.</li>
          <li><strong>readiness 와 liveness 분리</strong> — <code>liveness</code> 는 프로세스 정지 감지(가벼운 ping), <code>readiness</code> 는 sync 완료 감지(<code>eth_syncing == false</code> 같은 무거운 체크). 둘을 섞으면 sync 도중 OOM-restart 폭주.</li>
          <li><strong>graceful shutdown</strong> — <code>terminationGracePeriodSeconds: 600</code> 같이 충분히 길게. preStop hook 으로 클라이언트에 <code>SIGTERM</code> 보내고 DB 커밋 대기. 강제 kill 은 corrupt DB 의 1 위 원인.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-7. Anti-affinity · topology spread — 클라이언트 다양성을 K8s 로 강제</h3>
        <p className="leading-7">
          이더리움 검증자에서 같은 클라이언트 4 인스턴스가 같은 노드에 떨어지면, 그 노드 다운 = 4 개 동시 슬래싱 위험.
          <br />
          <code>podAntiAffinity</code> 와 <code>topologySpreadConstraints</code> 로 물리·논리 분산을 스케줄러에 강제한다.
        </p>
        <ul className="leading-7">
          <li><strong>requiredDuringScheduling</strong> — 같은 라벨(<code>el-client: reth</code>) Pod 가 같은 노드에 못 앉게 hard rule. 충족 못 하면 Pending 으로 남음.</li>
          <li><strong>preferredDuringScheduling</strong> — soft rule. 분산 시도하되 못 해도 스케줄. 자원 부족한 작은 클러스터에 적합.</li>
          <li><strong>topologySpreadConstraints</strong> — zone/region 별 균등 분포. <code>maxSkew: 1</code>, <code>topologyKey: topology.kubernetes.io/zone</code>. 한 zone 장애 시 1/3 만 영향.</li>
          <li><strong>node taint 로 분리</strong> — Reth 노드와 Geth 노드를 taint 로 갈라 두 워크로드가 절대 같은 호스트에 안 뜨게.</li>
          <li><strong>실수 패턴</strong> — Pod label 만 보고 Node label 을 안 봐 같은 zone 에 모인 케이스. <code>kubectl get pods -o wide</code> 로 실 분포를 주기 검사하는 cron 필요.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-8. 영속 스토리지와 NVMe — 가장 비싼 사고가 가장 흔하다</h3>
        <p className="leading-7">
          이더리움 EL 의 디스크 IOPS 가 모자라면 attestation 마감을 못 맞춰 검증자 효율이 떨어진다.
          <br />
          K8s 의 디폴트 스토리지(EBS gp3, GCP pd-balanced) 는 NVMe 가 아니다. 명시적 결정 필요.
        </p>
        <ul className="leading-7">
          <li><strong>local-path provisioner</strong> — 노드의 NVMe 를 PV 로 노출. 빠르지만 노드 죽으면 데이터 손실 → re-sync 비용. Reth 같은 빠른 sync 클라이언트엔 OK, Prysm DB 처럼 재구축 어려운 건 NG.</li>
          <li><strong>NVMe RAID + 백업</strong> — RAID0 로 IOPS 더 짜고, 별도 NAS 에 야간 스냅샷. RAID1 은 IOPS 손해 + cost 2x 라 검증자엔 비효율.</li>
          <li><strong>EBS io2 / GCP pd-extreme</strong> — 가상 NVMe, IOPS 보장. 비용 ~5x 지만 zone 독립적이라 노드 교체 무손실. 비용 vs 신뢰성 trade.</li>
          <li><strong>디스크 가득 참 → 사일런트 파산</strong> — Geth 가 disk full 만나면 즉시 crash 가 아니라 합의 못 따라가다 inactivity leak. 알람 임계는 80% (90% 면 늦음). <code>df</code> 만 보지 말고 inode 도 별도 감시.</li>
          <li><strong>fsync 와 power loss</strong> — 컨슈머 SSD 는 PLP 없어 정전 시 commit 누락 → DB corrupt. 엔터프라이즈 NVMe(PM9A3, D7-P5510) 의 PLP 가 검증자엔 필수다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-9. 클러스터 업그레이드 — 컨트롤 플레인과 워커의 분리된 위험</h3>
        <p className="leading-7">
          K8s 업그레이드는 컨트롤 플레인(API server, etcd, scheduler)과 워커 노드(kubelet, kube-proxy, CNI)가 별개의 위험을 가진다.
          <br />
          한 번에 다 바꾸면 사고 시 원인 분리가 안 된다.
        </p>
        <ul className="leading-7">
          <li><strong>버전 스큐 정책</strong> — kubelet 은 API server 보다 최대 3 마이너 낮을 수 있음(1.30 vs 1.27). 그러나 같은 버전 권장. 업그레이드 순서: etcd → API server → controller manager → scheduler → kubelet → kube-proxy.</li>
          <li><strong>컨트롤 플레인 in-place vs blue/green</strong> — 매니지드 클러스터(EKS, GKE)는 in-place. 자가 운영이면 새 컨트롤 플레인 띄워 워커 이동 후 옛 것 폐기(blue/green).</li>
          <li><strong>워커 롤링</strong> — 노드 한 대씩 cordon → drain → 업그레이드 → uncordon. <code>kubectl drain --ignore-daemonsets --delete-emptydir-data</code>. PDB 위반 시 drain 멈추니 필수 PDB 를 먼저 점검.</li>
          <li><strong>etcd 백업은 업그레이드 직전 필수</strong> — <code>etcdctl snapshot save</code>. 복원 시점부터의 변경은 사라지므로 backup → 업그레이드 → 검증 → 운영 재개의 순.</li>
          <li><strong>업그레이드 후 회귀 패턴</strong> — CRD scheme 변경(예: <code>networking.k8s.io/v1beta1</code> 제거), CNI plugin 호환성, kubelet 의 garbage collection 정책 변화. 업그레이드 노트 정독 + 사전 stage 클러스터에서 테스트.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-10. etcd 운영 — 클러스터 두뇌의 백업과 복원</h3>
        <p className="leading-7">
          etcd 는 K8s 의 모든 객체 상태를 들고 있는 단일 진실 출처. 복구 가능한 백업 없이 etcd 손실 = 클러스터 처음부터.
        </p>
        <ul className="leading-7">
          <li><strong>주기 스냅샷</strong> — <code>etcdctl --endpoints=https://127.0.0.1:2379 snapshot save /backup/etcd-$(date +%F).db</code>. 매시간 + 매일 압축 보관. S3 같은 외부 저장.</li>
          <li><strong>defrag</strong> — etcd MVCC 데이터가 누적되면 디스크 사용량 폭주. 야간에 <code>etcdctl defrag</code> 자동화. <code>endpoint status</code> 로 db size 모니터링(8 GB 임계).</li>
          <li><strong>복원 절차</strong> — 모든 etcd 멤버 정지 → <code>etcdctl snapshot restore</code> → 새 cluster ID 로 재시작 → API server 가 새 etcd 를 가리키게 재기동. 단일 노드 etcd 면 빠르지만, 3 멤버 HA 면 모든 멤버 동시 복원 + 동일 snapshot 사용.</li>
          <li><strong>etcd 를 K8s 위에 두지 마라</strong> — etcd-operator 는 매력적이지만 자기 자신이 자기를 관리하는 순환. 컨트롤 플레인은 K8s 밖의 systemd 또는 매니지드 서비스로.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-11. 실전 사고 카탈로그</h3>
        <ul className="leading-7">
          <li><strong>runc CVE-2024-21626</strong> — 컨테이너에서 호스트 fd 누수로 탈출. 모든 컨테이너 런타임 패치 + 의심 노드 격리 + AppArmor 프로파일로 추가 봉쇄. K8s 운영자가 받는 첫 번째 0-day 교훈.</li>
          <li><strong>kubelet 인증서 만료</strong> — 1 년 후 노드가 NotReady 로 우수수 떨어짐. <code>kubeadm certs renew all</code> + 자동 회전 cron + <code>kubelet --rotate-certificates</code>. 사고 패턴: &quot;클러스터 1 년 안 건드렸더니 다 죽었네&quot;.</li>
          <li><strong>etcd defrag 잊음</strong> — db size 가 2 GB 넘으면 quota error → 모든 write 거부 → 새 Pod 스케줄 안 됨. 배경 cron 으로 매주 defrag.</li>
          <li><strong>NodeLocal DNSCache 죽음</strong> — DNS 풀이 실패가 모든 트래픽 timeout 으로 번짐. coreDNS 외에도 로컬 캐시 layer 모니터링 필수.</li>
          <li><strong>Karpenter 가 GPU 노드 삭제</strong> — TTL 기반 정리가 학습 중인 GPU job 의 노드를 회수. <code>do-not-disrupt</code> annotation + PDB 로 보호. 비용 자동화의 가장 흔한 함정.</li>
          <li><strong>cgroupv2 전환 후 OOMKill 폭증</strong> — Java/Node 앱이 cgroup 메모리 한계를 새로 인식 못 해 limits 도달. JVM <code>-XX:+UseContainerSupport</code> 확인, Node 는 <code>--max-old-space-size</code> 명시.</li>
        </ul>
      </div>
    </section>
  );
}
