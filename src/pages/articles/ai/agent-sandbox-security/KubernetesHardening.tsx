import { AGENT_SECURITY_SOURCES } from "@/content/agent-sandbox-security";
import { CitationBlock } from "@/components/ui/citation";

const podExample = `apiVersion: v1
kind: Pod
metadata:
  name: agent-worker
  namespace: ai-workloads
spec:
  automountServiceAccountToken: false
  runtimeClassName: gvisor
  containers:
    - name: worker
      image: agent-worker@sha256:...
      securityContext:
        runAsNonRoot: true
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
        seccompProfile:
          type: RuntimeDefault
      volumeMounts:
        - name: workspace
          mountPath: /workspace
  volumes:
    - name: workspace
      emptyDir:
        sizeLimit: 5Gi`;

export default function KubernetesHardening() {
  return (
    <section id="kubernetes" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        identity·pod policy·runtime을 한 배포에 묶는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <code>automountServiceAccountToken: false</code>는 기본 ServiceAccount
          token의 자동 주입을 막지만, 환경 변수·volume·tool credential까지
          지우지는 않는다. workload에 API 접근이 필요하면 전용 ServiceAccount와
          최소 Role을 주고, 필요 없으면 token과 권한을 함께 없앤다.
        </p>
        <p className="leading-7">
          Pod Security Standards의 Restricted profile은 host
          namespace·privileged container·hostPath를 제한하고, non-root·no
          privilege escalation·drop ALL capabilities·seccomp를 요구한다. 다만
          RuntimeDefault는 pod에 명시하거나 cluster의 seccomp default를 켜야
          한다. 필드가 없다고 언제나 자동 적용되는 것은 아니다.
        </p>
        <pre className="not-prose my-6 overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs leading-5">
          <code className="text-xs">{podExample}</code>
        </pre>
        <p className="leading-7">
          이 예시는 시작점이다. read-only root는 binary 저장과 영속화 면적을
          줄이지만 writable volume, interpreter, in-memory 실행까지 차단하지
          않는다.
          <code>emptyDir</code>에도 용량 제한과 session 수명 정책이 필요하다.
        </p>
        <h3 className="mt-8 mb-3 text-xl font-semibold">
          io_uring은 위협 모델과 호환성을 보고 결정한다
        </h3>
        <p className="leading-7">
          모든 AI workload에서 io_uring 세 syscall을 “무조건” 차단한다는 규칙은
          과도하다. 먼저 RuntimeDefault를 baseline으로 적용하고, 더 강한
          allowlist가 필요하면 audit·trace로 실제 syscall을 수집한 뒤 test한다.
          custom profile은 kernel·runtime·application upgrade 때 회귀 테스트해야
          한다.
        </p>
        <div id="paper-service-account" className="scroll-mt-24">
          <CitationBlock source={AGENT_SECURITY_SOURCES.serviceAccounts.label} citeKey={5} href={AGENT_SECURITY_SOURCES.serviceAccounts.href}>
            ServiceAccount는 workload identity이고 token 자동 mount 여부와 RBAC
            authorization은 서로 다른 설정이다. 자동 mount를 끄는 것만으로 다른
            credential source나 이미 부여된 Role이 사라지지는 않는다.
          </CitationBlock>
        </div>
        <div id="paper-pod-security-seccomp" className="scroll-mt-24">
          <CitationBlock source={`${AGENT_SECURITY_SOURCES.podSecurity.label} · ${AGENT_SECURITY_SOURCES.seccomp.label}`} citeKey={6} href={AGENT_SECURITY_SOURCES.podSecurity.href}>
            Restricted profile의 pod-level 요구와 RuntimeDefault/custom seccomp의
            syscall 정책을 함께 적용한다. PSS는 별도 guest kernel·egress
            allowlist·RBAC 최소 권한을 대신하지 않으며 custom profile은 실제
            workload trace와 upgrade regression test가 필요하다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
