import { AGENT_SECURITY_SOURCES } from "@/content/agent-sandbox-security";
import { CitationBlock } from "@/components/ui/citation";

const defaultDeny = `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
  namespace: ai-workloads
spec:
  podSelector: {}
  policyTypes: [Egress]`;

const ciliumPolicy = `apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata:
  name: agent-egress
  namespace: ai-workloads
spec:
  endpointSelector:
    matchLabels:
      app: agent
  egress:
    # cluster DNS proxy rule: 질의 관찰을 위해 필요
    - toEndpoints:
        - matchLabels:
            k8s:io.kubernetes.pod.namespace: kube-system
            k8s:k8s-app: kube-dns
      toPorts:
        - ports:
            - port: "53"
              protocol: ANY
          rules:
            dns:
              - matchPattern: "*"
    # 실제 외부 허용 목록
    - toFQDNs:
        - matchName: api.example.com
      toPorts:
        - ports:
            - port: "443"
              protocol: TCP`;

export default function Egress() {
  return (
    <section id="egress" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        default-deny는 정책 객체가 아니라 실제 차단 결과여야 한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          표준 NetworkPolicy는 이를 집행하는 CNI가 있어야 효력이 생긴다. 정책은
          additive union이며 명시적 DENY 우선순위가 없다. 또한 표준이 보장하는
          중심 범위는 L3/L4이고, FQDN·HTTP method·flow log는 CNI별 확장
          영역이다.
          <code>hostNetwork</code>와 node 경로도 별도 검증해야 한다.
        </p>
        <pre className="not-prose my-6 overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs leading-5">
          <code className="text-xs">{defaultDeny}</code>
        </pre>
        <p className="leading-7">
          위 정책은 DNS도 함께 막는다. 다음 단계에서 cluster DNS와 꼭 필요한
          destination만 허용한다. “모든 443”을 열고 private CIDR만 제외하는
          구성은 임의 외부 유출을 막지 못하며, metadata 차단도 CNI·NAT·cloud
          구성에 따라 달라진다. 강한 경계가 필요하면 egress proxy/gateway와
          cloud metadata hardening을 함께 사용한다.
        </p>
        <pre className="not-prose my-6 overflow-x-auto rounded-lg border bg-muted/40 p-4 text-xs leading-5">
          <code className="text-xs">{ciliumPolicy}</code>
        </pre>
        <p className="leading-7">
          Cilium의 DNS rule에 있는 <code>matchPattern: &quot;*&quot;</code>는
          DNS 응답을 관찰·cache하기 위한 규칙이지 모든 외부 도메인을 허용하라는
          뜻이 아니다. 실제 destination allowlist는 별도의 <code>toFQDNs</code>
          에 둔다. 다만 임의의 DNS query 자체를 허용하면 query name을 이용한
          유출 가능성은 남으므로, 고위험 workload는 DNS proxy에서 질의 도메인도
          제한한다.
        </p>
        <div id="paper-network-policy" className="scroll-mt-24">
          <CitationBlock source={AGENT_SECURITY_SOURCES.networkPolicy.label} citeKey={3} href={AGENT_SECURITY_SOURCES.networkPolicy.href}>
            Kubernetes NetworkPolicy는 pod isolation과 additive allow rule의 L3/L4
            semantics를 정의하지만 CNI가 이를 지원·집행해야 한다. FQDN·explicit
            deny·flow log와 hostNetwork 동작을 표준이 모두 보장하지는 않는다.
          </CitationBlock>
        </div>
        <div id="paper-cilium-fqdn" className="scroll-mt-24">
          <CitationBlock source={AGENT_SECURITY_SOURCES.ciliumDns.label} citeKey={4} href={AGENT_SECURITY_SOURCES.ciliumDns.href}>
            Cilium은 DNS proxy가 관찰한 응답을 FQDN selector와 연결한다.
            DNS 관찰 rule과 실제 destination allowlist를 분리해야 하며 wildcard
            DNS query 허용이 data-exfiltration risk를 없애지는 않는다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
