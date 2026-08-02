import WorkflowViz from './viz/K8sWorkflowViz';

export default function K8sWorkflow() {
  return (
    <section id="k8s-workflow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">표준 워크플로우 — Stateful 앱 배포 라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          K8s 에 새 stateful 앱 (DB · 검증자 · 큐) 을 배포하는 표준 절차.
          <br />
          순서를 거꾸로 하거나 단계를 빠뜨리면 운영 중 사고로 직결되는 영역.
        </p>
      </div>
      <WorkflowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">단계 1 — Manifest 작성 (StatefulSet 결정)</h3>
        <ul className="leading-7">
          <li><strong>StatefulSet vs Deployment</strong> — 인스턴스 정체성이 중요하면 StatefulSet (검증자 · DB · Kafka). 동등한 stateless 면 Deployment.</li>
          <li><code>volumeClaimTemplates</code> — replica 별 PVC 자동 생성. <code>storageClassName</code> 명시 (local-path · zone-aware CSI).</li>
          <li><code>podManagementPolicy: Parallel</code> — 독립 인스턴스면. 의존성 있으면 OrderedReady (기본).</li>
          <li>Helm chart 또는 Kustomize overlay 로 환경별 변수만 분리.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 2 — 자원 요청 + QoS</h3>
        <ul className="leading-7">
          <li><code>resources.requests</code> = 스케줄링 기준, <code>limits</code> = 런타임 강제. 메모리 limit 초과 = OOMKill.</li>
          <li>Stateful 앱은 보통 Guaranteed (request = limit) 권장 — 메모리 부족 시 evict 안 됨.</li>
          <li>실측 — 1주 운영 후 Prometheus 의 p99 사용량을 보고 limit 조정.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 3 — 헬스 체크 (liveness · readiness · startup 분리)</h3>
        <ul className="leading-7">
          <li><strong>startup probe</strong> — sync 가 오래 걸리는 앱 (검증자 · DB) 필수. <code>failureThreshold</code> 크게.</li>
          <li><strong>readiness</strong> — 트래픽 받을 준비. 무거운 체크 OK (DB 연결 · sync 완료).</li>
          <li><strong>liveness</strong> — 가벼운 ping. 무거운 체크 두면 sync 도중 OOM-restart 폭주.</li>
          <li>endpoint 분리 — <code>/healthz</code> vs <code>/ready</code> vs <code>/startup</code>.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 4 — 분산 정책 (Anti-affinity · Topology spread)</h3>
        <ul className="leading-7">
          <li><code>podAntiAffinity</code> requiredDuringScheduling — 같은 라벨 Pod 가 같은 노드에 못 앉게.</li>
          <li><code>topologySpreadConstraints</code> — zone 별 균등 분포 (<code>maxSkew: 1</code>).</li>
          <li>같은 클라이언트 종류면 노드 taint 로 격리 (<code>el-client=reth</code>).</li>
          <li>실 분포 검증 cron — <code>kubectl get pods -o wide</code> 주기 체크.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 5 — PodDisruptionBudget</h3>
        <ul className="leading-7">
          <li><code>maxUnavailable: 1</code> — 자율 maintenance (드레인 · 노드 업그레이드) 시 한 번에 한 개만 빠짐.</li>
          <li>또는 <code>minAvailable: 80%</code> — 최소 가용성 비율.</li>
          <li>없으면 노드 드레인이 모든 replica 동시 종료 가능 — 가용성 0.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 6 — Graceful shutdown</h3>
        <ul className="leading-7">
          <li><code>terminationGracePeriodSeconds: 600+</code> — DB / 검증자처럼 commit 시간 필요한 앱.</li>
          <li><code>preStop</code> hook — SIGTERM 보내고 DB flush 대기. 강제 SIGKILL 은 corrupt 1 위 원인.</li>
          <li>SIGTERM 핸들러를 앱 코드에 명시 (Go: signal.Notify, Node: process.on('SIGTERM')).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 7 — Service · Ingress · NetworkPolicy</h3>
        <ul className="leading-7">
          <li>Headless Service (<code>clusterIP: None</code>) — StatefulSet 의 안정 DNS (<code>pod-0.svc</code>) 위해 필수.</li>
          <li>일반 Service — 클라이언트 측 라운드 로빈.</li>
          <li>Ingress / Gateway API — 외부 노출. TLS termination 위치 결정.</li>
          <li><strong>NetworkPolicy default-deny</strong> 부터 시작 → 명시 화이트리스트. CNI (Calico/Cilium) 가 NetworkPolicy 지원해야 작동.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 8 — RBAC + ServiceAccount</h3>
        <ul className="leading-7">
          <li>ServiceAccount 별 zero 권한부터. K8s API 호출 필요한 앱만 Role 부여.</li>
          <li>cloud workload — IRSA (AWS) / Workload Identity (GCP) 로 클라우드 권한.</li>
          <li>cluster-admin 은 영구 사용자에 부여 금지 — 필요 시 임시 권한 부여 + 만료.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 9 — 옵저버빌리티 + 알람</h3>
        <ul className="leading-7">
          <li><code>/metrics</code> endpoint + Prometheus scrape (ServiceMonitor 객체).</li>
          <li>Grafana 대시보드 — 4 골든 시그널 + 앱별 SLI.</li>
          <li>알람 규칙 — Pod restart 폭증, OOMKill, ImagePullBackOff, NotReady 노드.</li>
          <li>로그 — stdout → Loki / ELK. 구조화 (JSON) 권장.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 10 — 백업 + 복구 절차</h3>
        <ul className="leading-7">
          <li>PVC 스냅샷 정책 — Velero 또는 CSI snapshot. 야간 + 주간 + 월간 retention.</li>
          <li>외부 백업 — 클러스터 손실 시나리오 대비. S3 / GCS 같은 클러스터 외부.</li>
          <li>복구 절차 문서화 + 분기 1 회 검증 — 처음 시도가 진짜 사고면 늦음.</li>
          <li>etcd 백업 — 컨트롤 플레인 자체 손실 대비.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 11 — Pod Security Admission</h3>
        <ul className="leading-7">
          <li>네임스페이스 라벨 — <code>pod-security.kubernetes.io/enforce: restricted</code>.</li>
          <li>privileged · hostPath · hostNetwork 자동 거부.</li>
          <li>seccomp / AppArmor 프로파일 — 기본 활성화. 컨테이너 탈출 난이도 ↑.</li>
        </ul>
      </div>
    </section>
  );
}
