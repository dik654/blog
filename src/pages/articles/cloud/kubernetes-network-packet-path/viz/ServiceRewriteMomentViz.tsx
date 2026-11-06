import SceneShell from "./SceneShell";

/**
 * 본문 대응: #service-path — 결과 주소는 같아도 목적지가 바뀌는 순간이 구현에 따라 다르다.
 * 주소는 3절 사례입니다. 네 칸은 시간 순서이며 축척이 없습니다.
 */
const VIP = "10.96.20.15:8080";
const POD = "10.244.2.34:8080";

const SCENES = [
  {
    label: "packet 단계에서 변환",
    summary: "kube-proxy iptables·nftables",
    stops: [VIP, VIP, VIP, POD],
    changeAfter: 2,
    note: "기본 kube-proxy 경로에서는 packet의 목적지를 바꾸는 DNAT와 연결 상태를 기록하는 conntrack이 핵심입니다. 그래서 변환 전 구간에는 Service 주소를 단 packet이 있습니다.",
  },
  {
    label: "socket 단계에서 변환",
    summary: "eBPF 구현에서 가능한 경로",
    stops: [VIP, POD, POD, POD],
    changeAfter: 0,
    note: "eBPF 구현은 connect() 단계에서 socket 목적지를 먼저 바꿀 수도 있습니다. 결과 주소는 같아도 tcpdump에서 Service 주소가 보이는 위치가 달라질 수 있으므로 구현 mode부터 확인합니다.",
  },
] as const;

const STOP_NAMES = ["process가 연 주소", "socket의 목적지", "처음 만든 packet", "node 규칙을 지난 packet"] as const;

export default function ServiceRewriteMomentViz() {
  return (
    <SceneShell
      eyebrow="목적지가 바뀌는 순간"
      title="같은 Pod 주소에 닿아도 Service 주소가 사라지는 지점은 다를 수 있습니다"
      description="위에서 아래로 시간 순서입니다. 주황 칸은 Service 가상 주소, 파란 칸은 실제 Pod 주소입니다."
      ariaLabel="kube-proxy DNAT 경로와 eBPF socket 경로에서 목적지 주소가 바뀌는 단계 비교"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        return (
          <ol className="space-y-1">
            {STOP_NAMES.map((name, index) => {
              const value = item.stops[index];
              const isVip = value === VIP;
              return (
                <li key={name}>
                  <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,9.5rem)] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_12rem]">
                    <span className="text-xs leading-5 sm:text-sm">{name}</span>
                    <span
                      className={`rounded-md border px-2 py-1 text-center font-mono text-xs leading-5 ${
                        isVip ? "border-amber-600 text-amber-700 dark:text-amber-300" : "border-blue-600 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                  <p className={`py-0.5 text-right text-xs font-bold leading-5 text-primary ${index === item.changeAfter ? "" : "invisible"}`}>
                    ↓ 여기서 바뀝니다
                  </p>
                </li>
              );
            })}
          </ol>
        );
      }}
    />
  );
}
