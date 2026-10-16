import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * IPv4 패킷이 지나는 netfilter 훅 다섯 개와 그 사이의 라우팅 결정 두 곳을 고정 지도로 그린다.
 * 한 mechanism: 들어온 패킷은 PRE_ROUTING → 라우팅 결정 → (LOCAL_IN → 소켓) 또는 (FORWARD → POST_ROUTING → 송신),
 * 이 호스트가 만든 패킷은 LOCAL_OUT → 라우팅 결정 → POST_ROUTING → 송신이다. 장면마다 켜지는 경로만 바뀐다.
 */
const BOX = { w: 92, h: 30 } as const;
const NODES = {
  rx: { x: 14, y: 84, label: "수신 장치", sub: "eth0 · veth", kind: "dev" },
  pre: { x: 118, y: 84, label: "PRE_ROUTING", sub: "hook 0 · DNAT", kind: "hook" },
  route1: { x: 222, y: 84, label: "라우팅 결정", sub: "fib_table_lookup", kind: "route" },
  localin: { x: 326, y: 30, label: "LOCAL_IN", sub: "hook 1 · filter", kind: "hook" },
  sock: { x: 430, y: 30, label: "소켓", sub: "프로세스", kind: "dev" },
  fwd: { x: 326, y: 84, label: "FORWARD", sub: "hook 2 · filter", kind: "hook" },
  post: { x: 326, y: 138, label: "POST_ROUTING", sub: "hook 4 · SNAT", kind: "hook" },
  tx: { x: 430, y: 138, label: "송신 장치", sub: "eth0 · veth", kind: "dev" },
  out: { x: 14, y: 138, label: "LOCAL_OUT", sub: "hook 3 · DNAT", kind: "hook" },
  route2: { x: 118, y: 138, label: "라우팅 결정", sub: "ip_route_output", kind: "route" },
  proc: { x: 14, y: 30, label: "프로세스", sub: "send()", kind: "dev" },
} as const;
type NodeKey = keyof typeof NODES;

const EDGES: readonly [NodeKey, NodeKey][] = [
  ["rx", "pre"],
  ["pre", "route1"],
  ["route1", "localin"],
  ["localin", "sock"],
  ["route1", "fwd"],
  ["fwd", "post"],
  ["post", "tx"],
  ["proc", "out"],
  ["out", "route2"],
  ["route2", "post"],
];

interface Scene {
  label: string;
  path: readonly NodeKey[];
  stat: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "다섯 훅과 두 결정",
    path: [],
    stat: "enum nf_inet_hooks 0~4",
    note: "netfilter 훅은 PRE_ROUTING(0)·LOCAL_IN(1)·FORWARD(2)·LOCAL_OUT(3)·POST_ROUTING(4) 다섯 자리뿐입니다. iptables의 nat·filter 같은 표와 nftables의 체인은 전부 이 다섯 자리 가운데 하나에 걸립니다. 라우팅 결정은 훅이 아니라 그 사이의 함수 호출입니다.",
  },
  {
    label: "이 호스트로 온 패킷",
    path: ["rx", "pre", "route1", "localin", "sock"],
    stat: "ip_rcv → ip_local_deliver",
    note: "ip_rcv가 PRE_ROUTING 훅을 지나 ip_rcv_finish에서 ip_route_input_noref로 목적지를 조회합니다. 결과가 '내 주소'면 dst_input이 ip_local_deliver를 불러 LOCAL_IN 훅을 지난 뒤 소켓에 넣습니다. DNAT는 PRE_ROUTING에서 목적지를 바꿔야 라우팅 결정이 바뀐 주소로 이뤄집니다.",
  },
  {
    label: "Pod에서 나가 노드를 지나는 패킷",
    path: ["rx", "pre", "route1", "fwd", "post", "tx"],
    stat: "ip_forward → ip_output",
    note: "veth로 들어온 Pod 패킷은 PRE_ROUTING 뒤 라우팅 결정에서 '다른 곳으로'가 되어 FORWARD 훅을 지나고, 나가기 직전 POST_ROUTING에서 SNAT(MASQUERADE)를 받아 eth0으로 나갑니다. kube-proxy의 Service DNAT는 이 경로의 PRE_ROUTING에 걸립니다.",
  },
  {
    label: "이 호스트가 만든 패킷",
    path: ["proc", "out", "route2", "post", "tx"],
    stat: "__ip_local_out → ip_output",
    note: "프로세스가 send()하면 ip_route_output으로 경로를 먼저 정한 뒤 __ip_local_out이 LOCAL_OUT 훅을, ip_output이 POST_ROUTING 훅을 지납니다. 노드 자신이 ClusterIP에 접속할 때의 DNAT가 LOCAL_OUT에 걸리는 이유가 이것입니다. 라우팅은 DNAT 뒤에 다시 확인됩니다.",
  },
];

export default function PacketHookPathViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const on = (k: NodeKey) => scene.path.length === 0 || scene.path.includes(k);
  const edgeOn = (a: NodeKey, b: NodeKey) => {
    if (scene.path.length === 0) return false;
    const i = scene.path.indexOf(a);
    return i >= 0 && scene.path[i + 1] === b;
  };
  const color = (kind: string) => (kind === "hook" ? "#2563eb" : kind === "route" ? "#b45309" : "#64748b");
  const center = (k: NodeKey) => ({ x: NODES[k].x + BOX.w / 2, y: NODES[k].y + BOX.h / 2 });

  return (
    <VizFrame
      eyebrow="netfilter hooks"
      title="패킷은 다섯 훅 가운데 세 개를 지나고, 어느 셋인지는 라우팅 결정이 고릅니다"
      description="파란 상자가 netfilter 훅, 주황 상자가 라우팅 결정, 회색이 장치와 소켓입니다. 켜진 경로가 이번 장면의 패킷이 지나는 길입니다."
      note="Linux v6.12 include/uapi/linux/netfilter.h의 enum과 net/ipv4/ip_input.c·ip_output.c의 NF_HOOK 호출 위치를 그대로 옮겼습니다. INGRESS 훅과 bridge 계층은 생략했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="netfilter 훅 다섯 개와 패킷 경로"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.stat}</span>
          </div>
          <svg viewBox="0 0 536 182" className="mt-3 h-auto w-full" role="img" aria-label={scene.label}>
            <defs>
              <marker id="pkt-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill="#94a3b8" />
              </marker>
              <marker id="pkt-arrow-on" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill="#2563eb" />
              </marker>
            </defs>
            {EDGES.map(([a, b]) => {
              const ca = center(a);
              const cb = center(b);
              const lit = edgeOn(a, b);
              const horizontal = Math.abs(ca.y - cb.y) < 1;
              const x1 = horizontal ? NODES[a].x + BOX.w : ca.x;
              const x2 = horizontal ? NODES[b].x : cb.x;
              const y1 = horizontal ? ca.y : ca.y < cb.y ? NODES[a].y + BOX.h : NODES[a].y;
              const y2 = horizontal ? cb.y : ca.y < cb.y ? NODES[b].y : NODES[b].y + BOX.h;
              const d = horizontal || Math.abs(ca.x - cb.x) < 1 ? `M${x1},${y1} L${x2},${y2}` : `M${x1},${y1} L${x1},${(y1 + y2) / 2} L${x2},${(y1 + y2) / 2} L${x2},${y2}`;
              return (
                <motion.path
                  key={`${a}-${b}`}
                  d={d}
                  fill="none"
                  initial={false}
                  animate={{ stroke: lit ? "#2563eb" : "#cbd5e1", strokeWidth: lit ? 2.25 : 1 }}
                  transition={{ duration: reduced ? 0 : 0.3 }}
                  markerEnd={lit ? "url(#pkt-arrow-on)" : "url(#pkt-arrow)"}
                />
              );
            })}
            {(Object.keys(NODES) as NodeKey[]).map((k) => {
              const n = NODES[k];
              const lit = on(k);
              const c = color(n.kind);
              return (
                <g key={k}>
                  <motion.rect
                    x={n.x}
                    y={n.y}
                    width={BOX.w}
                    height={BOX.h}
                    rx={5}
                    initial={false}
                    animate={{ fill: lit ? `${c}1f` : "rgba(0,0,0,0)", stroke: lit ? c : "#cbd5e1", opacity: lit ? 1 : 0.5 }}
                    transition={{ duration: reduced ? 0 : 0.3 }}
                    strokeWidth={lit ? 1.5 : 1}
                  />
                  <text x={n.x + BOX.w / 2} y={n.y + 12.5} textAnchor="middle" fontSize={9} fontWeight={800} fill={lit ? c : "#94a3b8"}>
                    {n.label}
                  </text>
                  <text x={n.x + BOX.w / 2} y={n.y + 24} textAnchor="middle" fontSize={7.5} className="fill-muted-foreground" opacity={lit ? 1 : 0.6}>
                    {n.sub}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-3 min-h-[11.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10rem] sm:min-h-[5.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
