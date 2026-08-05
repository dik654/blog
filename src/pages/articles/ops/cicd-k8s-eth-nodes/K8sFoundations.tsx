import ClusterArchViz from './viz/ClusterArchViz';
import StatefulSetViz from './viz/StatefulSetViz';
import HealthProbesViz from './viz/HealthProbesViz';

export default function K8sFoundations() {
  return (
    <section id="k8s-foundations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">B. 쿠버네티스 기초 — 면접 단골 개념</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          쿠버네티스 면접의 절반은 &quot;컨트롤 플레인 vs 데이터 플레인&quot;, &quot;핵심 객체 7 종&quot;, &quot;네트워크 모델&quot; 세 영역에서 나온다.
          <br />
          도구를 외우는 게 아니라 <strong>왜 이 추상화가 필요했나</strong>를 답할 수 있어야 깊이가 묻어난다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">B-1. 클러스터 아키텍처 — 두 영역의 분리</h3>
        <p className="leading-7 mb-4">
          모든 변경은 apiserver 만 통과하고, etcd 가 단일 진실. 워커는 watch loop 으로 자기 일을 한다.
        </p>
      </div>
      <ClusterArchViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">B-2. 핵심 객체 7 종 — 무엇을 추상화했나</h3>
        <ul className="leading-7">
          <li><strong>Pod</strong> — 같은 라이프사이클·네트워크 네임스페이스를 공유하는 1+ 컨테이너 묶음. K8s 의 최소 스케줄 단위. 직접 만들지 말고 Deployment/StatefulSet 가 만들게.</li>
          <li><strong>Deployment</strong> — stateless 워크로드. 무작위 Pod ID, 자유 교체, rolling update.</li>
          <li><strong>StatefulSet</strong> — stateful 워크로드. 안정 ID(<code>name-0/1/2</code>), 1:1 PVC 바인딩, 순서 시작.</li>
          <li><strong>Service</strong> — Pod 의 가상 endpoint. ClusterIP(클러스터 내부) · NodePort · LoadBalancer · ExternalName.</li>
          <li><strong>Ingress</strong> — L7 (HTTP) 라우팅. domain · path 별로 백엔드 Service 매핑. Nginx · Traefik · Istio Gateway 같은 컨트롤러가 실행.</li>
          <li><strong>ConfigMap · Secret</strong> — 코드와 설정 분리. Secret 은 base64 인코딩일 뿐 평문에 가까움 — 별도 암호화 필수.</li>
          <li><strong>Job · CronJob</strong> — 일회성 / 주기 배치 워크로드. 잡 실패 시 재시도 정책 명시.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">B-3. 네트워크 모델 — 모든 Pod 는 모든 Pod 와 통신 가능</h3>
        <ul className="leading-7">
          <li><strong>네트워크 가정</strong> — 모든 Pod 는 NAT 없이 다른 모든 Pod 와 통신 가능, 모든 노드는 모든 Pod 와 통신 가능. 이를 구현하는 게 CNI plugin.</li>
          <li><strong>Service 종류</strong> — <code>ClusterIP</code>(가상 IP, 내부) · <code>NodePort</code>(노드의 30000-32767 포트) · <code>LoadBalancer</code>(클라우드 LB 자동 프로비저닝) · <code>ExternalName</code>(DNS CNAME).</li>
          <li><strong>kube-proxy</strong> — Service 의 가상 IP 를 실제 Pod IP 로 라우팅. <code>iptables</code>(기본) 또는 <code>ipvs</code>(대규모용).</li>
          <li><strong>CoreDNS</strong> — <code>service-name.namespace.svc.cluster.local</code> 형태 DNS 응답. NodeLocal DNSCache 가 추가 캐시 layer.</li>
          <li><strong>NetworkPolicy</strong> — Pod 간 트래픽 화이트리스트. CNI 가 NetworkPolicy 지원해야 작동(Calico · Cilium 지원, 기본 kindnet 미지원).</li>
          <li><strong>Ingress vs Gateway API</strong> — Ingress 는 단순한 L7 라우팅, Gateway API 는 더 풍부한 모델(traffic split, header rewrite, mTLS). 새 클러스터는 Gateway API 권장.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">B-4. 스케줄링 — Pod 가 노드에 앉는 결정</h3>
        <ul className="leading-7">
          <li><strong>resource requests · limits</strong> — request 는 스케줄링 기준, limit 은 런타임 강제. CPU limit 은 throttle, Memory limit 초과는 OOMKill.</li>
          <li><strong>QoS Classes</strong> — Guaranteed (request=limit) → Burstable → BestEffort. 노드 메모리 부족 시 BestEffort 부터 evict.</li>
          <li><strong>nodeSelector · nodeAffinity</strong> — 라벨 기반 노드 선택. <code>node.kubernetes.io/instance-type=m5.large</code> 같은 표준 라벨.</li>
          <li><strong>taint · toleration</strong> — 노드가 거부, Pod 가 허용. GPU 노드 · CI 러너 격리 표준 패턴.</li>
          <li><strong>podAntiAffinity</strong> — 같은 라벨 Pod 가 같은 노드에 못 앉게. 검증자 다양성 강제에 핵심.</li>
          <li><strong>topologySpreadConstraints</strong> — zone · region 별 균등 분포. 한 zone 장애에 강함.</li>
          <li><strong>scheduling framework</strong> — 커스텀 plugin 으로 스케줄러 확장 가능. 비용 최적화(KEDA · Karpenter) 같은 고급 사례.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">B-5. 스토리지 — PV · PVC · StorageClass 삼각</h3>
        <ul className="leading-7">
          <li><strong>PV (PersistentVolume)</strong> — 클러스터 자원, 관리자가 미리 만들거나 동적 프로비저닝.</li>
          <li><strong>PVC (PersistentVolumeClaim)</strong> — 사용자가 요청, K8s 가 적당한 PV 매칭. <code>volumeClaimTemplates</code> 로 StatefulSet 자동 생성.</li>
          <li><strong>StorageClass</strong> — 동적 프로비저닝의 정책 (CSI driver, encryption, replication, IOPS).</li>
          <li><strong>access modes</strong> — <code>ReadWriteOnce</code>(한 노드에서만, 보통 EBS) · <code>ReadOnlyMany</code> · <code>ReadWriteMany</code>(NFS · FSx).</li>
          <li><strong>local-path vs CSI</strong> — local-path 는 노드의 디스크 직결(빠름, 노드 묶임), CSI 는 클라우드 볼륨(느림, 노드 독립).</li>
          <li><strong>volumeMode: Block</strong> — 파일시스템 없이 raw block 으로 마운트. 데이터베이스 · 검증자 처럼 자기 파일시스템 관리하는 경우.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">B-6. StatefulSet 시각화 — 안정 ID · PVC 1:1</h3>
        <p className="leading-7 mb-4">
          이더리움 검증자 fleet 같은 stateful 워크로드의 표준 패턴.
        </p>
      </div>
      <StatefulSetViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">B-7. 헬스 체크 — liveness · readiness · startup</h3>
        <ul className="leading-7">
          <li><strong>liveness</strong> — &quot;Pod 가 살아 있나&quot;. 실패 시 Pod 재시작. 가벼운 ping.</li>
          <li><strong>readiness</strong> — &quot;트래픽 받을 준비됐나&quot;. 실패 시 Service endpoint 에서 제외. 무거운 체크 OK (DB 연결 · sync 완료).</li>
          <li><strong>startup</strong> — &quot;시작 다 됐나&quot;. liveness/readiness 가 시작 동안 실패하지 않게 보호. 슬로우 시작 앱(검증자 sync) 필수.</li>
          <li><strong>흔한 실수</strong> — liveness 와 readiness 같은 endpoint 사용 → sync 도중 OOM-restart 폭주. 분리 필수.</li>
        </ul>
      </div>
      <HealthProbesViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">

        <h3 className="text-xl font-semibold mt-8 mb-3">B-8. 패키징 — Helm vs Kustomize vs raw YAML</h3>
        <ul className="leading-7">
          <li><strong>Helm</strong> — 템플릿 + 변수. chart 단위로 release 관리. 외부 차트 (postgres, redis) 가져다 쓰기 편함. values.yaml 이 복잡해지면 디버깅 지옥.</li>
          <li><strong>Kustomize</strong> — base + overlay 패턴. 변수 없이 YAML patch 로 환경별 차이만 표현. K8s 1.14+ 내장 (<code>kubectl apply -k</code>). GitOps 와 잘 맞음.</li>
          <li><strong>raw YAML</strong> — 단순한 앱이면 OK. 환경별 차이가 생기면 복사 → drift 위험.</li>
          <li><strong>jsonnet · cdk8s</strong> — 코드로 K8s 매니페스트 생성. 큰 조직의 표준화에 유리.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">B-9. 오토스케일링 — HPA · VPA · Karpenter</h3>
        <ul className="leading-7">
          <li><strong>HPA (HorizontalPodAutoscaler)</strong> — 메트릭 기반 replica 수 조절. CPU · memory 외에 custom metric (queue depth, RPS) 가능.</li>
          <li><strong>VPA (VerticalPodAutoscaler)</strong> — Pod 의 request/limit 조절. HPA 와 동시 사용 주의 (둘 다 CPU 기준이면 충돌).</li>
          <li><strong>Cluster Autoscaler</strong> — 노드 수 조절. unscheduled Pod 가 있으면 노드 추가.</li>
          <li><strong>Karpenter</strong> — Cluster Autoscaler 의 차세대. 더 빠른 스케일, 직접 EC2/spot 인스턴스 프로비저닝, bin-packing 최적화. AWS 우선이지만 Azure/GCP 지원 확대.</li>
          <li><strong>PDB (PodDisruptionBudget)</strong> — voluntary disruption (드레인 · 업그레이드) 시 동시 다운 가능 수 제한. <code>maxUnavailable: 1</code> 또는 <code>minAvailable: 80%</code>.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">B-10. 보안 — RBAC · PSA · NetworkPolicy 3 종</h3>
        <ul className="leading-7">
          <li><strong>RBAC</strong> — Role / ClusterRole + RoleBinding / ClusterRoleBinding. ServiceAccount 별 zero 부터 권한 쌓음.</li>
          <li><strong>Pod Security Admission</strong> — namespace 라벨로 <code>privileged</code> · <code>baseline</code> · <code>restricted</code> 강제. 옛 PodSecurityPolicy 대체.</li>
          <li><strong>NetworkPolicy</strong> — default-deny + 화이트리스트. Calico · Cilium 같이 지원 CNI 필수.</li>
          <li><strong>seccomp · AppArmor</strong> — 시스템 콜 화이트리스트. 컨테이너 탈출 난이도 ↑.</li>
          <li><strong>OPA Gatekeeper · Kyverno</strong> — Admission Controller 로 정책 강제. &quot;<code>privileged: true</code> 금지&quot;, &quot;라벨 필수&quot; 같은 룰.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">B-11. 옵저버빌리티 스택 — 4 골든 시그널</h3>
        <ul className="leading-7">
          <li><strong>4 골든 시그널</strong> — Latency · Traffic · Errors · Saturation. SRE 의 표준.</li>
          <li><strong>메트릭</strong> — Prometheus + Grafana. <code>/metrics</code> endpoint. 클러스터·노드·Pod 다층.</li>
          <li><strong>로그</strong> — Loki (Prometheus 친화) 또는 ELK. Pod 로그는 stdout 으로 → 컨테이너 런타임 → fluentd/vector 로 수집.</li>
          <li><strong>트레이스</strong> — Tempo · Jaeger · Honeycomb. OpenTelemetry SDK 로 코드 instrument.</li>
          <li><strong>k8s-specific</strong> — kube-state-metrics(객체 상태), node-exporter(노드 OS 메트릭), cAdvisor(컨테이너 메트릭).</li>
        </ul>
      </div>
    </section>
  );
}
