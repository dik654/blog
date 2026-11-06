import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #veth-bridge — veth 쌍은 짝에게 건네고, cni0 bridge는 FDB(MAC → 포트 표)를 보고 세 갈래로 나눈다.
 * 같은 노드의 Pod면 그 포트로만, 표에 없으면 모든 포트로, bridge 자신의 MAC이면 호스트 IP 계층으로.
 * hairpin: DNAT 뒤 패킷이 들어온 포트로 되돌아가야 할 때 꺼져 있으면 버려진다. Pod 셋은 그림의 가정이다.
 */
interface Scene extends ShellScene {
  paths: readonly string[];
  blocked?: boolean;
  tag?: string;
}

const W = 360;
const POD_X: readonly number[] = [68, 180, 292];
const POD_NAME: readonly string[] = ["Pod A", "Pod B", "Pod C"];
const POD_TOP = 8;
const POD_H = 46;
const BAR_TOP = 116;
const BAR_H = 52;
const IP_TOP = 206;

const SCENES: readonly Scene[] = [
  { label: "veth 쌍", summary: "Pod tx → 호스트 rx", paths: ["M68,54 L68,114"], tag: "veth", note: "veth는 한쪽에 보낸 프레임이 전선 없이 짝에서 수신되는 가상 장치입니다. veth_xmit가 짝의 수신 경로에 프레임을 넣으므로 통계는 Pod 쪽 tx(보냄), 호스트 쪽 rx(받음)에 쌓입니다." },
  { label: "같은 노드의 다른 Pod", summary: "FDB 찾음 → 그 포트로만", paths: ["M68,54 L68,142 L180,142 L180,56"], note: "cni0 bridge는 MAC 주소로 프레임을 전달하는 소프트웨어 스위치입니다. 목적지 MAC을 FDB(MAC → 포트 표)에서 찾으면 그 포트로만 보내고 IP 계층을 거치지 않습니다." },
  { label: "표에 없는 MAC", summary: "FDB 없음 → 모든 포트로", paths: ["M68,54 L68,142 L292,142 L292,56", "M180,142 L180,56"], note: "목적지 MAC이 FDB에 없으면 모든 포트에 뿌립니다. 그림에서는 프레임이 들어온 A 쪽을 빼고 B와 C로 나갑니다." },
  { label: "bridge 자신의 MAC", summary: "호스트 IP 계층으로 올림", paths: ["M68,54 L68,142 L180,142 L180,204"], note: "다른 노드로 가는 패킷은 Pod의 기본 게이트웨이가 cni0 주소라 이 길을 탑니다. 호스트 IP 계층으로 올라간 뒤부터가 6절의 라우팅입니다." },
  { label: "hairpin 꺼짐", summary: "들어온 포트로 못 돌아감", paths: ["M60,54 L60,150 L172,150 L172,204", "M188,204 L188,158 L76,158 L76,120"], blocked: true, note: "자기 Service IP로 보낸 패킷이 DNAT(목적지 주소 바꾸기) 뒤 A 자신에게 돌아와야 할 때, bridge는 들어온 포트로 되돌려 보내지 않아 버립니다. 1절의 '자기 Service 응답 없음'입니다." },
  { label: "hairpin 켜짐", summary: "A로 돌아감", paths: ["M60,54 L60,150 L172,150 L172,204", "M188,204 L188,158 L76,158 L76,56"], note: "CNI bridge 플러그인이 veth를 붙일 때 hairpin 모드도 설정합니다. 켜져 있으면 들어온 포트로 되돌려 보낼 수 있어 A가 자기 Service의 응답을 받습니다." },
];

export default function VethBridgeViz() {
  return (
    <SceneShell
      eyebrow="veth · bridge"
      title="veth는 짝에게 건네고, bridge는 표를 보고 갈 곳을 고릅니다"
      description="Pod 하나에 veth 쌍 하나가 꽂힙니다. Pod를 셋으로 그린 것은 가정이며, 파란 선이 이번 장면의 프레임 경로입니다."
      ariaLabel="Pod와 cni0 bridge 사이의 프레임 전달 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} 250`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <marker id="veth-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill="#2563eb" />
              </marker>
            </defs>
            {POD_X.map((cx, index) => (
              <g key={cx}>
                <line x1={cx} x2={cx} y1={POD_TOP + POD_H} y2={BAR_TOP} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
                <rect x={cx - 48} y={POD_TOP} width={96} height={POD_H} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <text x={cx} y={POD_TOP + 19} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{POD_NAME[index]}</text>
                <text x={cx} y={POD_TOP + 36} textAnchor="middle" fontSize={12} fill="#64748b">eth0</text>
              </g>
            ))}
            <rect x={14} y={BAR_TOP} width={W - 28} height={BAR_H} rx={8} fill="none" stroke="#b45309" strokeWidth={1} />
            <text x={236} y={BAR_TOP + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">cni0 bridge</text>
            <rect x={110} y={IP_TOP} width={140} height={36} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={180} y={IP_TOP + 23} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">호스트 IP 계층</text>
            {scene.paths.map((d) => (
              <path key={d} d={d} fill="none" stroke="#2563eb" strokeWidth={1.25} markerEnd="url(#veth-arrow)" />
            ))}
            {scene.tag && (
              <>
                <text x={78} y={78} fontSize={12} fontWeight={700} fill="#2563eb">Pod 쪽 tx</text>
                <text x={78} y={106} fontSize={12} fontWeight={700} fill="#2563eb">호스트 쪽 rx</text>
              </>
            )}
            {scene.blocked && (
              <text x={92} y={106} fontSize={13} fontWeight={700} fill="#dc2626">✕ 버려짐</text>
            )}
          </svg>
        );
      }}
    />
  );
}
