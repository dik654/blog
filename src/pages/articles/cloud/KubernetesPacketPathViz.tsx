import { useState } from "react";

type PathKey = "service" | "same-node" | "vxlan" | "egress";

interface PacketStep {
  title: string;
  address: string;
  detail: string;
  evidence: string;
}

const paths: Record<
  PathKey,
  {
    label: string;
    summary: string;
    steps: readonly PacketStep[];
    packet: string;
  }
> = {
  service: {
    label: "Service 선택",
    summary: "애플리케이션이 VIP로 연결하지만, 실제 연결의 목적지는 선택된 backend Pod IP로 바뀝니다.",
    packet: "10.244.1.12:43120 → 10.96.20.15:8080  ⇒  10.244.1.12:43120 → 10.244.2.34:8080",
    steps: [
      { title: "client socket", address: "10.96.20.15:8080", detail: "프로세스는 Service 주소로 connect합니다.", evidence: "ss -tnp" },
      { title: "backend 선택", address: "EndpointSlice", detail: "Ready endpoint 중 10.244.2.34가 선택됩니다.", evidence: "kubectl get endpointslice" },
      { title: "목적지 변환", address: "DNAT 또는 socket rewrite", detail: "데이터 플레인이 VIP를 실제 Pod IP로 바꿉니다.", evidence: "nft / iptables / cilium service" },
      { title: "Pod route", address: "10.244.2.34", detail: "이제 CNI가 만든 경로로 목적지 노드를 찾습니다.", evidence: "ip route get 10.244.2.34" },
    ],
  },
  "same-node": {
    label: "같은 노드",
    summary: "두 Pod가 같은 노드에 있으면 패킷은 물리 NIC를 거치지 않고 host routing과 두 veth를 지납니다.",
    packet: "client eth0 → host cali… → Linux route/policy → host cali… → server eth0",
    steps: [
      { title: "client Pod", address: "10.244.1.12", detail: "Pod의 기본 경로가 host 쪽 veth로 패킷을 보냅니다.", evidence: "ip route" },
      { title: "host veth", address: "cali…", detail: "veth 반대쪽에서 host network stack으로 들어옵니다.", evidence: "ip -d link" },
      { title: "route·policy", address: "host kernel", detail: "목적지 Pod route와 ingress/egress policy를 판정합니다.", evidence: "ip route / nft / bpftool" },
      { title: "server Pod", address: "10.244.1.21", detail: "다른 veth를 지나 server socket에 도착합니다.", evidence: "tcpdump -ni any" },
    ],
  },
  vxlan: {
    label: "다른 노드·VXLAN",
    summary: "Pod 패킷을 버리지 않고 바깥 UDP/IP 헤더로 감싸 underlay가 아는 node IP 사이로 운반합니다.",
    packet: "inner 10.244.1.12 → 10.244.2.34  |  outer 192.0.2.11:4789 → 192.0.2.12:4789",
    steps: [
      { title: "node A route", address: "10.244.2.34 via vxlan.calico", detail: "목적지 Pod CIDR가 원격 node B에 있음을 확인합니다.", evidence: "ip route get 10.244.2.34" },
      { title: "encapsulation", address: "UDP 4789", detail: "원래 Pod 패킷 앞에 VXLAN·UDP·IP 헤더를 붙입니다.", evidence: "ip -d link show vxlan.calico" },
      { title: "underlay", address: "192.0.2.11 → 192.0.2.12", detail: "물리망은 node IP만 보고 패킷을 운반합니다.", evidence: "tcpdump -ni eth0 udp port 4789" },
      { title: "decapsulation", address: "node B", detail: "바깥 헤더를 벗기고 원래 목적지 Pod route를 다시 봅니다.", evidence: "tcpdump -ni vxlan.calico" },
      { title: "server Pod", address: "10.244.2.34:8080", detail: "host veth를 지나 server socket에 도착합니다.", evidence: "tcpdump -ni any host 10.244.2.34" },
    ],
  },
  egress: {
    label: "Pod → 외부",
    summary: "설정된 pool 밖으로 나갈 때만 source를 node IP로 바꾸며, 응답은 conntrack 상태를 따라 원래 Pod로 돌아옵니다.",
    packet: "10.244.1.12:43120 → 203.0.113.80:443  ⇒  192.0.2.11:51842 → 203.0.113.80:443",
    steps: [
      { title: "client Pod", address: "10.244.1.12:43120", detail: "외부 서버로 TCP 연결을 시작합니다.", evidence: "ss -tnp" },
      { title: "pool 판정", address: "destination outside pools", detail: "natOutgoing 조건에 해당하는지 판정합니다.", evidence: "calicoctl get ippool -o yaml" },
      { title: "source 변환", address: "192.0.2.11:51842", detail: "외부망이 응답할 수 있는 node 주소와 포트로 바꿉니다.", evidence: "nft / iptables nat" },
      { title: "상태 기록", address: "conntrack", detail: "응답의 역변환에 쓸 원래 5-tuple 관계를 기억합니다.", evidence: "conntrack -L" },
      { title: "return", address: "10.244.1.12:43120", detail: "응답의 목적지를 원래 Pod socket으로 복원합니다.", evidence: "tcpdump -ni any" },
    ],
  },
};

export default function KubernetesPacketPathViz() {
  const [selected, setSelected] = useState<PathKey>("vxlan");
  const path = paths[selected];

  return (
    <figure
      data-viz="kubernetes-packet-path"
      className="not-prose my-8 min-w-0 overflow-hidden rounded-2xl border border-border bg-background"
    >
      <figcaption className="border-b border-border p-4 sm:p-5">
        <p className="text-xs font-bold text-primary">한 패킷을 실제 주소로 추적</p>
        <p className="mt-1 text-lg font-semibold text-foreground">경로를 바꾸면 주소와 관측 지점도 바뀝니다</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{path.summary}</p>
      </figcaption>

      <div className="flex gap-2 overflow-x-auto border-b border-border p-3" role="tablist" aria-label="패킷 경로 선택">
        {(Object.keys(paths) as PathKey[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={selected === key}
            onClick={() => setSelected(key)}
            className={`min-h-11 shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              selected === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {paths[key].label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        <div className="overflow-x-auto rounded-lg border border-border bg-muted/10 p-3 font-mono text-xs leading-6 text-foreground sm:text-sm">
          {path.packet}
        </div>
        <ol className="mt-4 grid gap-3 lg:grid-cols-5">
          {path.steps.map((step, index) => (
            <li key={`${selected}-${step.title}`} className="min-w-0 rounded-xl border border-border p-4">
              <p className="text-xs font-bold text-primary">{index + 1}</p>
              <p className="mt-1 font-semibold text-foreground">{step.title}</p>
              <p className="mt-2 break-words font-mono text-xs leading-5 text-foreground">{step.address}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.detail}</p>
              <p className="mt-3 break-words border-t border-border pt-3 font-mono text-[11px] leading-5 text-muted-foreground">
                관측: {step.evidence}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

