import WorkflowViz from './viz/CicdWorkflowViz';

export default function CICDWorkflow() {
  return (
    <section id="cicd-workflow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">표준 워크플로우 — 신 서비스 배포 라인 셋업</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          새 서비스의 CI/CD 라인을 처음부터 끝까지 설계하는 표준 절차.
          <br />
          한 번 정착하면 다음 서비스는 같은 템플릿을 복사 — 의사결정 비용 0, 보안 수준 일관.
        </p>
      </div>
      <WorkflowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">단계 1 — Repo 부트스트랩</h3>
        <ul className="leading-7">
          <li>branch protection 설정 — main 에 직접 push 차단, required reviewer 1+, status check 통과 의무.</li>
          <li><code>.github/CODEOWNERS</code> 로 디렉토리별 reviewer 자동 지정.</li>
          <li><code>SECURITY.md</code> + private security advisory 활성화 (취약점 제보 채널).</li>
          <li>초기 라벨 셋업 — <code>safe-to-test</code>, <code>needs-review</code>, <code>breaking</code> 등.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 2 — CI 워크플로 작성</h3>
        <ul className="leading-7">
          <li><code>.github/workflows/ci.yml</code> — push + PR 트리거. <code>permissions:</code> 최상단에 명시 (default token scope 제거).</li>
          <li>외부 액션은 SHA 핀 (<code>uses: actions/checkout@b4ffde65...</code>). dependabot 으로 자동 갱신.</li>
          <li>job 분리 — lint · test · build · scan. matrix 로 OS/runtime 다중.</li>
          <li>cache — <code>actions/cache</code> 또는 turborepo / sccache. cache key 는 lock 파일 hash.</li>
          <li>concurrency — <code>group: ${'${{ github.ref }}'}</code> + <code>cancel-in-progress: true</code> 로 같은 branch 의 옛 빌드 자동 취소.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 3 — OIDC trust policy 셋업 (long-lived 시크릿 제거)</h3>
        <ul className="leading-7">
          <li>AWS — <code>OpenID Connect Provider</code> 등록 (<code>token.actions.githubusercontent.com</code>).</li>
          <li>IAM Role 생성, trust policy 에 정확한 ref 명시:
            <br />
            <code>{`"sub": "repo:owner/repo:ref:refs/heads/main"`}</code> 또는
            <br />
            <code>{`"sub": "repo:owner/repo:environment:production"`}</code></li>
          <li>워크플로에서 <code>permissions: id-token: write</code> + <code>aws-actions/configure-aws-credentials</code>.</li>
          <li>검증 — IAM Access Analyzer 로 &quot;누가 이 role 가정 가능한가&quot; audit. 와일드카드 trust 자동 경고.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 4 — 빌드 + 서명 + provenance</h3>
        <ul className="leading-7">
          <li>이미지 빌드 — <code>docker buildx</code> 멀티스테이지, distroless 베이스. 빌드 산출물에 환경변수 섞이지 않게 검증.</li>
          <li>SBOM — <code>anchore/syft-action</code> 으로 구성요소 목록 생성.</li>
          <li>CVE 스캔 — <code>aquasecurity/trivy-action</code>. CVSS 7+ 면 빌드 fail (또는 allowlist 명시).</li>
          <li>서명 — <code>sigstore/cosign-installer</code> + <code>cosign sign --yes ${'$IMAGE'}</code> (keyless OIDC).</li>
          <li>SLSA provenance — <code>slsa-framework/slsa-github-generator</code>. provenance.json 이 OCI 이미지에 attached.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 5 — 배포 게이트 (어드미션 + GitOps)</h3>
        <ul className="leading-7">
          <li>K8s 어드미션 — Kyverno policy: 우리 OIDC 신원으로 서명된 이미지만 허용. 미서명 거부.</li>
          <li>SLSA verifier — provenance 가 우리 워크플로 (정확한 ref) 에서 생성됐는지 검증.</li>
          <li>ArgoCD / Flux — git 의 manifest 와 클러스터 상태 reconcile. <code>syncPolicy.automated.prune: true</code> 로 drift 자동 정리.</li>
          <li>environment protection — production environment 는 manual approval, branch 제한 (main 만).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 6 — 카나리 + 자동 롤백</h3>
        <ul className="leading-7">
          <li>Argo Rollouts 또는 Flagger — canary 단계 (1% → 10% → 50% → 100%), 단계별 SLI 검증.</li>
          <li>SLI 기준 — error rate, p99 latency, custom (RPS, queue depth). Prometheus 쿼리로 정의.</li>
          <li>임계 초과 시 자동 롤백 — 옛 버전 ReplicaSet 으로 즉시 traffic shift.</li>
          <li>blue/green 옵션 — 즉시 rollback 우선이면 BG, 점진 검증이면 canary.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 7 — 옵저버빌리티 + 알람</h3>
        <ul className="leading-7">
          <li>4 골든 시그널 (latency · traffic · errors · saturation) — Prometheus + Grafana 대시보드.</li>
          <li>Trace — OpenTelemetry SDK + Tempo / Jaeger. 새 서비스의 span 이 기존 trace 에 이어지는지.</li>
          <li>로그 — stdout → 컨테이너 런타임 → Loki / ELK. 구조화 (JSON) 권장.</li>
          <li>알람 — PagerDuty / Opsgenie / Slack. SLO 위반 시. on-call 회전 셋업.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 8 — 운영 런북 + 게임데이</h3>
        <ul className="leading-7">
          <li>Runbook 문서화 — 흔한 알람 별 대응 절차 (e.g., &quot;503 폭증 → DB 연결 풀 확인 → ...&quot;).</li>
          <li>Postmortem 템플릿 — 5 why · 시간선 · 변경 사항 · 액션 아이템.</li>
          <li>Game day — 분기 1 회 모의 사고 (chaos engineering 도구 또는 수동). 런북이 작동하는지 검증.</li>
          <li>SLO 정의 + error budget — 신뢰성 vs 배포 속도의 협상 수단. budget 소진 시 신규 기능 freeze.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 9 — 시크릿 회전 + 키 관리</h3>
        <ul className="leading-7">
          <li>External Secrets Operator + Vault — 시크릿 자체 회전이 자동 이벤트.</li>
          <li>회전 주기 — DB 비밀번호 90일, API 키 30일, 워크로드 ID 의 단명 토큰 (자동).</li>
          <li>침해 의심 플레이북 — 5 분 무효화 → 15 분 새 시크릿 발급 → 30 분 새 시크릿 배포 + audit.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 10 — 정기 audit + 개선</h3>
        <ul className="leading-7">
          <li>월 1회 — IAM Access Analyzer, Kyverno policy 위반 리포트, dependabot PR 처리율.</li>
          <li>분기 1회 — branch protection / secret scanning / OIDC trust policy 전수 점검.</li>
          <li>연 1회 — 외부 보안 audit (penetration test, SBOM 검증). 인증 (SOC2, ISO27001) 갱신.</li>
        </ul>
      </div>
    </section>
  );
}
