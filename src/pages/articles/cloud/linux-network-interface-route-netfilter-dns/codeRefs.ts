import type { CodeRef } from "@/components/code/types";
import vethC from "./codebase/linux/drivers/net/veth.c?raw";
import brInputC from "./codebase/linux/net/bridge/br_input.c?raw";
import fibTrieC from "./codebase/linux/net/ipv4/fib_trie.c?raw";
import fibRulesC from "./codebase/linux/net/ipv4/fib_rules.c?raw";
import netfilterH from "./codebase/linux/include/uapi/linux/netfilter.h?raw";
import ipInputC from "./codebase/linux/net/ipv4/ip_input.c?raw";
import ipOutputC from "./codebase/linux/net/ipv4/ip_output.c?raw";
import conntrackC from "./codebase/linux/net/netfilter/nf_conntrack_core.c?raw";
import conntrackSysctlRst from "./codebase/linux/Documentation/networking/nf_conntrack-sysctl.rst?raw";
import resQueryC from "./codebase/glibc/resolv/res_query.c?raw";
import dnsGo from "./codebase/kubernetes/pkg/kubelet/network/dns/dns.go?raw";
import bridgeGo from "./codebase/cni-plugins/plugins/main/bridge/bridge.go?raw";
import resolvConf5 from "./codebase/man-pages/man/man5/resolv.conf.5?raw";

export const codeRefs: Record<string, CodeRef> = {
  "veth-xmit": {
    path: "linux/drivers/net/veth.c",
    highlight: [344, 380],
    desc: "veth 한쪽에 보낸 프레임은 전선 없이 짝(peer)의 수신 함수로 바로 넘어갑니다. Pod 안 eth0에서 나간 패킷이 호스트 쪽 veth에서 '수신'되는 자리입니다.",
    annotations: [
      { lines: [355, 359], color: "sky", note: "priv->peer가 반대쪽 장치입니다. 짝이 없으면(한쪽이 삭제됨) 그 자리에서 버립니다." },
      { lines: [374, 379], color: "amber", note: "veth_forward_skb → __dev_forward_skb → netif_rx. 송신 통계는 이쪽, 수신 통계는 짝에 쌓입니다. 두 장치는 보통 서로 다른 network namespace에 있습니다." },
    ],
    code: vethC,
    lang: "c",
  },
  "bridge-forward": {
    path: "linux/net/bridge/br_input.c",
    highlight: [196, 222],
    desc: "bridge가 프레임을 받으면 목적지 MAC을 FDB(forwarding database)에서 찾아 그 포트로만 보내고, 모르면 모든 포트에 뿌립니다.",
    annotations: [
      { lines: [197, 199], color: "sky", note: "br_fdb_find_rcu(h_dest): 학습된 MAC → 포트 표. Pod MAC은 그 Pod의 호스트 쪽 veth 포트에 매핑돼 있습니다." },
      { lines: [205, 208], color: "amber", note: "BR_FDB_LOCAL이면 bridge 자신(cni0)의 주소라 br_pass_frame_up으로 호스트 IP 계층에 올립니다. Pod → 다른 노드 패킷이 호스트 라우팅으로 들어오는 길입니다." },
      { lines: [212, 215], color: "violet", note: "표에 있으면 br_forward로 한 포트에, 없으면 br_flood로 전부에. 같은 노드의 Pod끼리는 이 한 줄로 끝나고 IP 계층을 거치지 않습니다." },
    ],
    code: brInputC,
    lang: "c",
  },
  "fib-rules-default": {
    path: "linux/net/ipv4/fib_rules.c",
    highlight: [440, 452],
    desc: "ip rule의 기본 세 줄입니다. 우선순위 0은 local 표, 32766(0x7FFE)은 main 표, 32767은 default 표를 봅니다.",
    annotations: [
      { lines: [444, 450], color: "sky", note: "라우팅은 표 하나가 아니라 '규칙 목록 → 표' 두 단계입니다. ip rule add로 끼워 넣은 규칙이 main 표보다 먼저 맞으면 다른 표를 봅니다. systemd 글의 ip rule 7줄 사례가 이 자리입니다." },
    ],
    code: fibRulesC,
    lang: "c",
  },
  "fib-rule-match": {
    path: "linux/net/ipv4/fib_rules.c",
    highlight: [178, 205],
    desc: "정책 규칙 하나가 이 패킷에 맞는지 보는 함수입니다. 출발지·목적지·DSCP·프로토콜·포트 범위를 봅니다.",
    annotations: [
      { lines: [186, 188], color: "sky", note: "(saddr ^ r->src) & srcmask: 출발 주소가 규칙의 prefix 안에 있는지. 'from 10.244.1.0/24 lookup 100' 같은 source routing이 여기서 맞습니다." },
    ],
    code: fibRulesC,
    lang: "c",
  },
  "fib-lookup-entry": {
    path: "linux/net/ipv4/fib_rules.c",
    highlight: [82, 100],
    desc: "라우팅 결정의 입구입니다. fib_rules_lookup이 규칙을 우선순위 순으로 돌며 맞는 규칙의 표에서 fib_table_lookup을 부릅니다.",
    annotations: [{ lines: [94, 94], color: "sky", note: "규칙이 하나도 안 맞으면 -ENETUNREACH. 규칙 목록을 비우면 모든 패킷이 unreachable이 되는 이유입니다." }],
    code: fibRulesC,
    lang: "c",
  },
  "fib-trie-lookup": {
    path: "linux/net/ipv4/fib_trie.c",
    highlight: [1445, 1535],
    desc: "표 하나 안에서 가장 긴 prefix를 찾는 LC-trie 탐색입니다. 목적지 주소를 키로 삼아 내려가고(Step 1), 못 찾으면 거슬러 올라가며(backtrace) 더 짧은 prefix를 봅니다.",
    annotations: [
      { lines: [1452, 1452], color: "sky", note: "key = 목적지 주소 32비트. 라우팅 결정의 입력은 이 한 값과 출발 장치·tos·scope뿐입니다." },
      { lines: [1471, 1503], color: "amber", note: "Step 1: 키의 비트를 따라 트라이를 내려갑니다. 10.244.1.7은 10.244.1.0/24 리프까지, 8.8.8.8은 0.0.0.0/0만 맞아 루트 근처에서 멈춥니다." },
      { lines: [1509, 1531], color: "violet", note: "Step 2·backtrace: 내려간 자리에서 맞지 않으면 부모로 올라가 더 짧은 prefix를 찾습니다. '가장 긴 prefix 우선'은 이 되돌아가기의 결과입니다." },
    ],
    code: fibTrieC,
    lang: "c",
  },
  "fib-trie-leaf": {
    path: "linux/net/ipv4/fib_trie.c",
    highlight: [1569, 1600],
    desc: "찾은 리프의 경로 후보(fib_alias)를 돌며 prefix 길이·DSCP·scope·죽은 next hop을 걸러 하나를 고릅니다.",
    annotations: [
      { lines: [1579, 1582], color: "sky", note: "index >= 1 << slen이면 이 alias의 prefix 길이에서는 맞지 않습니다. 같은 리프에 /24와 /32가 함께 있으면 /32를 먼저 봅니다." },
      { lines: [1588, 1589], color: "amber", note: "fib_scope < flowi4_scope면 건너뜁니다. link scope 경로는 host scope 조회에 쓰이지 않습니다." },
    ],
    code: fibTrieC,
    lang: "c",
  },
  "nf-hooks-enum": {
    path: "linux/include/uapi/linux/netfilter.h",
    highlight: [42, 50],
    desc: "netfilter 훅 다섯 자리의 번호표입니다. iptables 체인 PREROUTING·INPUT·FORWARD·OUTPUT·POSTROUTING과 nftables 체인의 hook 이름이 이 enum에 대응합니다.",
    annotations: [
      { lines: [43, 47], color: "sky", note: "0 PRE_ROUTING, 1 LOCAL_IN, 2 FORWARD, 3 LOCAL_OUT, 4 POST_ROUTING. 패킷 하나는 이 가운데 세 개(수신 1·2·4 또는 3·4, 로컬 수신 0·1)를 지납니다." },
    ],
    code: netfilterH,
    lang: "c",
  },
  "ip-rcv": {
    path: "linux/net/ipv4/ip_input.c",
    highlight: [560, 572],
    desc: "IPv4 수신 입구입니다. 헤더 검사 뒤 NF_HOOK(PRE_ROUTING)을 지나야 ip_rcv_finish로 넘어갑니다.",
    annotations: [{ lines: [569, 571], color: "sky", note: "DNAT(kube-proxy의 Service 규칙 포함)는 이 훅에서 목적지를 바꿉니다. 그래야 다음 단계의 라우팅 결정이 바뀐 주소로 이뤄집니다." }],
    code: ipInputC,
    lang: "c",
  },
  "ip-route-input": {
    path: "linux/net/ipv4/ip_input.c",
    highlight: [360, 372],
    desc: "PRE_ROUTING을 지난 패킷이 라우팅 결정을 받는 자리입니다. 결과(dst)에 따라 '내게 온 것'이면 ip_local_deliver, 아니면 ip_forward가 dst_input으로 불립니다.",
    annotations: [{ lines: [365, 368], color: "sky", note: "ip_route_input_noref(daddr, saddr, tos, dev). 실패하면 drop. 이 호출 안에서 fib_rules_lookup → fib_table_lookup이 돕니다." }],
    code: ipInputC,
    lang: "c",
  },
  "ip-local-deliver": {
    path: "linux/net/ipv4/ip_input.c",
    highlight: [242, 256],
    desc: "라우팅 결정이 '내 주소'였을 때입니다. 조각을 모은 뒤 NF_HOOK(LOCAL_IN)을 지나 소켓으로 갑니다.",
    annotations: [{ lines: [254, 256], color: "sky", note: "iptables INPUT 체인·NetworkPolicy의 ingress 규칙이 걸리는 자리. 통과하면 ip_local_deliver_finish가 프로토콜(TCP·UDP) 핸들러에 넘깁니다." }],
    code: ipInputC,
    lang: "c",
  },
  "ip-local-out": {
    path: "linux/net/ipv4/ip_output.c",
    highlight: [101, 122],
    desc: "이 호스트가 만든 패킷의 첫 훅입니다. 길이·체크섬을 채운 뒤 nf_hook(LOCAL_OUT)을 지납니다.",
    annotations: [{ lines: [119, 121], color: "sky", note: "노드 자신이 ClusterIP로 접속할 때의 DNAT는 PRE_ROUTING이 아니라 이 LOCAL_OUT에 걸립니다. 패킷이 장치로 들어온 적이 없기 때문입니다." }],
    code: ipOutputC,
    lang: "c",
  },
  "ip-output": {
    path: "linux/net/ipv4/ip_output.c",
    highlight: [427, 436],
    desc: "송신 직전의 마지막 훅입니다. NF_HOOK_COND(POST_ROUTING)을 지나 ip_finish_output으로 갑니다.",
    annotations: [{ lines: [434, 436], color: "sky", note: "SNAT·MASQUERADE가 여기서 출발 주소를 바꿉니다. Pod IP가 노드 IP로 바뀌어 나가는 자리이고, 포워딩된 패킷과 로컬에서 만든 패킷이 여기서 합류합니다." }],
    code: ipOutputC,
    lang: "c",
  },
  "conntrack-in": {
    path: "linux/net/netfilter/nf_conntrack_core.c",
    highlight: [2003, 2075],
    desc: "conntrack 훅 함수입니다. 패킷에서 5-tuple을 뽑아 표를 찾고, 없으면 새 항목을 만들며, 프로토콜 상태 기계를 한 칸 진행시킵니다.",
    annotations: [
      { lines: [2041, 2048], color: "sky", note: "resolve_normal_ct가 음수를 돌려주면(표가 가득 참) 패킷을 NF_DROP합니다. 'table full, dropping packet'의 결과가 이 줄입니다." },
      { lines: [2057, 2075], color: "amber", note: "nf_conntrack_handle_packet이 TCP 상태를 진행시킵니다. 닫힌 연결을 다시 여는 SYN이면 -NF_REPEAT로 돌아가 새 항목을 만듭니다." },
    ],
    code: conntrackC,
    lang: "c",
  },
  "conntrack-resolve": {
    path: "linux/net/netfilter/nf_conntrack_core.c",
    highlight: [1852, 1915],
    desc: "tuple을 해시해 표를 찾고, 없으면 init_conntrack으로 만든 뒤 방향과 상태(NEW·ESTABLISHED·RELATED)를 패킷에 붙입니다.",
    annotations: [
      { lines: [1866, 1876], color: "sky", note: "hash_conntrack_raw(tuple, zone, net) → __nf_conntrack_find_get. 표는 양방향 tuple이 둘 다 들어 있어 응답 패킷도 같은 항목을 찾습니다." },
      { lines: [1886, 1893], color: "amber", note: "못 찾으면 init_conntrack. ERR_PTR(-ENOMEM)이면 호출자가 drop합니다." },
      { lines: [1897, 1910], color: "violet", note: "IPS_SEEN_REPLY가 있으면 ESTABLISHED, 아니면 NEW. iptables의 -m conntrack --ctstate가 읽는 값이 이 ctinfo입니다." },
    ],
    code: conntrackC,
    lang: "c",
  },
  "conntrack-table-full": {
    path: "linux/net/netfilter/nf_conntrack_core.c",
    highlight: [1655, 1672],
    desc: "새 항목을 만들 때 nf_conntrack_max를 넘으면 같은 해시 버킷에서 오래된 항목을 하나 지워 보고(early_drop), 그것도 안 되면 -ENOMEM과 함께 경고를 남깁니다.",
    annotations: [
      { lines: [1663, 1670], color: "rose", note: "net_warn_ratelimited(\"nf_conntrack: table full, dropping packet\"). dmesg의 이 줄이 보이면 새 연결의 첫 패킷이 버려지고 있는 것입니다. 기존 연결은 영향이 없습니다." },
    ],
    code: conntrackC,
    lang: "c",
  },
  "conntrack-hash": {
    path: "linux/net/netfilter/nf_conntrack_core.c",
    highlight: [202, 231],
    desc: "conntrack 표의 크기 변수와 tuple 해시 함수입니다. 버킷 수(htable_size)와 항목 상한(nf_conntrack_max)은 서로 다른 값입니다.",
    annotations: [
      { lines: [202, 206], color: "sky", note: "nf_conntrack_htable_size = 버킷 수, nf_conntrack_max = 항목 수 상한. 기본으로 둘이 같아 항목이 꽉 차면 체인 평균 길이가 2입니다(항목이 양방향으로 두 번 들어가므로)." },
      { lines: [216, 230], color: "amber", note: "siphash에 부팅마다 바뀌는 난수 키를 섞어 해시 충돌 공격을 막고, reciprocal_scale로 버킷 번호를 만듭니다." },
    ],
    code: conntrackC,
    lang: "c",
  },
  "conntrack-sysctl": {
    path: "linux/Documentation/networking/nf_conntrack-sysctl.rst",
    highlight: [17, 22],
    desc: "nf_conntrack_buckets 기본값: 전체 메모리 ÷ 16384, 최소 1024, 최대 262144.",
    annotations: [{ lines: [17, 22], color: "sky", note: "16 GiB 노드는 1,048,576이 계산되지만 262,144로 잘립니다. 메모리가 4 GiB를 넘으면 기본값은 늘 262,144입니다." }],
    code: conntrackSysctlRst,
    lang: "python",
  },
  "conntrack-max-doc": {
    path: "linux/Documentation/networking/nf_conntrack-sysctl.rst",
    highlight: [95, 101],
    desc: "nf_conntrack_max 기본값은 nf_conntrack_buckets와 같고, 항목은 original·reply 두 방향으로 두 번 들어갑니다.",
    annotations: [
      { lines: [95, 97], color: "sky", note: "기본 상한 = 버킷 수. 16 GiB 노드라면 262,144개 연결 뒤에 table full입니다." },
      { lines: [136, 137], color: "amber", note: "(아래) nf_conntrack_tcp_timeout_established 기본 432,000초 = 5일. 끊긴 연결의 항목이 5일 동안 자리를 차지할 수 있습니다." },
    ],
    code: conntrackSysctlRst,
    lang: "python",
  },
  "res-search": {
    path: "glibc/resolv/res_query.c",
    highlight: [376, 430],
    desc: "glibc 2.40의 search 확장 규칙입니다. 점 개수가 ndots 이상이거나 끝에 점이 있으면 그대로 먼저 묻고, 아니면 search 목록을 순서대로 붙여 묻습니다.",
    annotations: [
      { lines: [378, 384], color: "sky", note: "dots >= ndots || trailing_dot → 그대로 먼저. Pod의 ndots:5에서 api.example.com(점 2)은 이 조건을 통과하지 못합니다." },
      { lines: [409, 423], color: "amber", note: "점이 없거나(RES_DEFNAMES), 점이 있지만 끝점이 없으면(RES_DNSRCH) search 목록을 for로 돌며 __res_context_querydomain을 부릅니다. 항목마다 질의 한 벌입니다." },
    ],
    code: resQueryC,
    lang: "c",
  },
  "res-search-tail": {
    path: "glibc/resolv/res_query.c",
    highlight: [499, 516],
    desc: "search 목록을 다 돌고도 답이 없으면 마지막으로 이름 그대로 묻는 자리입니다. 8질의 가운데 마지막 2개가 여기서 나갑니다.",
    annotations: [{ lines: [508, 511], color: "sky", note: "dots가 있고 아직 그대로 묻지 않았으면(tried_as_is 아님) 마지막으로 절대 이름을 질의합니다." }],
    code: resQueryC,
    lang: "c",
  },
  "kubelet-dns": {
    path: "kubernetes/pkg/kubelet/network/dns/dns.go",
    highlight: [386, 420],
    desc: "kubelet이 Pod의 resolv.conf를 만드는 함수입니다. ClusterFirst 정책이면 nameserver를 클러스터 DNS 하나로 바꾸고 search 세 개를 앞에 붙이며 options를 ndots:5로 둡니다.",
    annotations: [
      { lines: [42, 45], color: "sky", note: "(위) defaultDNSOptions = [\"ndots:5\"]. 이 한 줄이 외부 이름 1회 조회를 8질의로 만듭니다." },
      { lines: [404, 415], color: "amber", note: "Servers를 클러스터 DNS로 교체하고 generateSearchesForDNSClusterFirst로 search를 만든 뒤 Options = ndots:5. 호스트의 search는 뒤에 이어 붙습니다." },
    ],
    code: dnsGo,
    lang: "go",
  },
  "kubelet-dns-search": {
    path: "kubernetes/pkg/kubelet/network/dns/dns.go",
    highlight: [165, 176],
    desc: "search 목록 세 항목의 출처입니다. <namespace>.svc.<clusterDomain>, svc.<clusterDomain>, <clusterDomain> 순서입니다.",
    annotations: [{ lines: [170, 174], color: "sky", note: "순서가 곧 질의 순서입니다. 같은 네임스페이스 Service가 첫 질의에 맞도록 가장 좁은 도메인이 먼저 옵니다." }],
    code: dnsGo,
    lang: "go",
  },
  "cni-bridge-veth": {
    path: "cni-plugins/plugins/main/bridge/bridge.go",
    highlight: [409, 445],
    desc: "CNI bridge 플러그인이 Pod의 network namespace 안에서 veth 쌍을 만들고, 호스트 쪽 끝을 bridge(cni0)에 꽂는 함수입니다.",
    annotations: [
      { lines: [409, 420], color: "sky", note: "netns.Do 안에서 ip.SetupVeth: 컨테이너 쪽 eth0과 호스트 쪽 veth를 만들고 호스트 쪽을 호스트 namespace로 옮깁니다." },
      { lines: [437, 444], color: "amber", note: "LinkSetMaster(hostVeth, br)로 bridge 포트가 되고, hairpin 모드를 설정합니다. hairpin이 꺼져 있으면 Pod가 자기 자신의 Service IP로 보낸 패킷이 되돌아오지 못합니다." },
    ],
    code: bridgeGo,
    lang: "go",
  },
  "resolv-conf-ndots": {
    path: "man-pages/man/man5/resolv.conf.5",
    highlight: [159, 174],
    desc: "ndots 옵션의 정의입니다. 기본값 1, 15로 조용히 제한됩니다.",
    annotations: [
      { lines: [161, 172], color: "sky", note: "'점이 n개 이상이면 search를 붙이기 전에 절대 이름으로 먼저 묻는다'. 기본 1이면 점이 하나라도 있는 이름은 그대로 먼저 묻습니다. Kubernetes는 이것을 5로 올립니다." },
      { lines: [174, 174], color: "amber", note: "15 초과는 조용히 15로 잘립니다. ndots:20을 써도 오류 없이 15로 동작합니다." },
    ],
    code: resolvConf5,
    lang: "python",
  },
};
