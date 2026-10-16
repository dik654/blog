import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import PacketHookPathViz from "./linux-network-interface-route-netfilter-dns/viz/PacketHookPathViz";
import DnsSearchNdotsViz from "./linux-network-interface-route-netfilter-dns/viz/DnsSearchNdotsViz";
import { codeRefs } from "./linux-network-interface-route-netfilter-dns/codeRefs";
import { linuxNetworkTrees } from "./linux-network-interface-route-netfilter-dns/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function LinuxNetworkInterfaceRouteNetfilterDnsArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. Pod 안의 curl은 왜 외부 이름 하나에 DNS를 여덟 번 묻나요?</h2>
          <div className={prose}>
            <p>
              (가정) 네임스페이스 test의 Pod에서 curl https://api.example.com을 실행하면 가끔 첫 바이트까지 5초가 걸립니다. 패킷을 잡아 보니 연결 전에 DNS 질의가 여덟 개 나가고 그중 여섯 개는 NXDOMAIN입니다.</p>
            <p>같은 노드의 dmesg에는 "nf_conntrack: table full, dropping packet"이 찍혀 있으며, 어떤 Pod는 자기 Service IP로 보낸 요청의 응답을 못 받습니다. 세 증상은 패킷이 프로세스에 닿기까지 지나는 계층이 서로 다릅니다.</p>
            <p>
              답을 먼저 적겠습니다. 패킷은 인터페이스에서 들어와 라우팅 결정을 거치고 netfilter 훅 다섯 자리 가운데 세 개를 지나 소켓에 닿습니다. conntrack은 그 훅에 붙어 연결마다 항목 하나를 유지하며, 표가 가득 차면 새 연결의 첫 패킷을 버립니다.</p>
            <p>그 앞 단계인 이름 풀기는 resolv.conf의 search와 ndots 규칙을 따르는데, Kubernetes가 ndots를 5로 두기 때문에 점이 둘뿐인 외부 이름은 search 세 개를 붙여 먼저 묻고 그 다음에야 그대로 묻습니다. 이름마다 A·AAAA 두 질의이니 4 × 2 = 8입니다.</p>
            <p>
              이 글은 <a href="/cs/cloud/kubernetes-network-packet-path#overview">Kubernetes 패킷 경로</a>가 kube-proxy 규칙과 CNI를 설명할 때 전제로 삼는 리눅스 쪽 바닥입니다. TCP 소켓 상태와 TIME_WAIT는 <a href="/cs/cloud/linux-tcp-time-wait-ports-backlog#overview">TCP 글</a>에, 컨테이너가 자기만의 네트워크 세계를 갖는 namespace는 <a href="/cs/cloud/linux-containers-cgroup-namespace#namespaces">컨테이너 글 8절</a>에 있습니다. 근거는 Linux v6.12, glibc 2.40, Kubernetes v1.37.1, CNI plugins v1.6.2 원문입니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 이름은 주소로, 주소는 경로로 바뀌고, 패킷은 훅을 지나 소켓에 닿습니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 요청 하나는 두 평면을 지납니다. 이름 평면에서는 프로세스가 /etc/resolv.conf를 읽어 nameserver에 질의하고 IP 주소를 얻습니다. 데이터 평면에서는 그 주소로 보낸 패킷이 Pod의 eth0(veth 한쪽)을 나와 호스트의 veth 짝에서 수신된 뒤 bridge 또는 호스트 라우팅을 거쳐 노드 밖으로 나갑니다. 돌아오는 패킷은 반대 순서로 Pod 안 소켓에 닿습니다.
            </p>
            <p>
              데이터 평면 안에서 커널이 하는 결정은 둘뿐입니다. 라우팅 결정은 "이 목적지로 가려면 어느 장치로, 어느 다음 홉으로"를 표에서 찾는 일이며, netfilter는 그 결정 앞뒤의 정해진 다섯 자리에서 규칙을 적용해 패킷을 통과·변경·폐기하는 일입니다. kube-proxy의 Service DNAT, NetworkPolicy, MASQUERADE가 모두 이 다섯 자리의 규칙이며 conntrack도 이 자리에 붙은 커널 모듈입니다.
            </p>
            <p>
              이 글이 다루는 것은 두 평면의 리눅스 쪽 장치입니다. 어떤 CNI가 어떤 터널을 쓰는지, Service가 EndpointSlice를 어떻게 고르는지는 <a href="/cs/cloud/kubernetes-network-packet-path#service-path">Kubernetes 패킷 경로</a>에 둡니다. 여기서는 veth와 bridge, 라우팅 표, 훅, conntrack, resolver가 패킷 하나와 이름 하나를 어떻게 다루는지만 봅니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. ndots:5에서 api.example.com은 8번, 끝점을 붙이면 2번 묻습니다</h2>
          <div className={prose}>
            <p>
              (가정) kubelet이 test 네임스페이스 Pod에 써 준 resolv.conf는 세 줄입니다.</p>
            <p>nameserver 10.96.0.10, search test.svc.cluster.local svc.cluster.local cluster.local, options ndots:5. 프로세스가 api.example.com을 풀어 달라고 하면 glibc는 먼저 이름의 점을 셉니다. 둘입니다. ndots 5보다 적고 끝에 점도 없으므로 search 목록을 순서대로 붙여 묻습니다.</p>
            <p>
              첫 질의는 api.example.com.test.svc.cluster.local입니다. CoreDNS는 cluster.local 영역의 권한 서버라 바로 NXDOMAIN을 돌려줍니다.</p>
            <p>둘째 api.example.com.svc.cluster.local, 셋째 api.example.com.cluster.local도 같습니다. 넷째가 되어서야 api.example.com을 그대로 물어 답을 받습니다. 이름마다 A와 AAAA를 함께 보내므로 질의는 4 × 2 = 8개이며 그중 6개는 실패가 예정된 질의입니다.</p>
            <p>
              이름 끝에 점을 붙여 api.example.com.이라고 적으면 '절대 이름'이라는 표시라 search를 건너뛰고 2개로 끝납니다. 같은 네임스페이스의 Service를 data라고 부르면 첫 search 항목을 붙인 data.test.svc.cluster.local이 바로 응답하므로 역시 2개입니다. ndots:5는 이 짧은 이름을 위해 큰 값으로 잡혀 있어 그 대가를 외부 이름이 치릅니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="외부 이름 하나가 질의 8개가 되는 과정"
            question="search 3개·ndots:5인 Pod에서 api.example.com은 DNS 질의를 몇 개 보내고, 왜 그 수가 되나요?"
            scope="glibc 2.40 resolver, A·AAAA 동시 질의, CoreDNS가 cluster.local의 권한 서버, 호스트 search 도메인 없음, 첫 응답이 캐시에 없다고 가정합니다."
            steps={[
              { label: "점 세기", expression: "api.example.com → 2", result: "2 < 5", reason: "__res_context_search는 dots >= ndots 또는 끝에 점이 있을 때만 그대로 먼저 묻습니다. 둘 다 아닙니다." },
              { label: "search 1", expression: "+ test.svc.cluster.local", result: "NXDOMAIN × 2", reason: "A·AAAA 두 질의. cluster.local 권한 서버가 즉시 '없음'을 답합니다." },
              { label: "search 2", expression: "+ svc.cluster.local", result: "NXDOMAIN × 2", reason: "같은 이유로 두 질의 더." },
              { label: "search 3", expression: "+ cluster.local", result: "NXDOMAIN × 2", reason: "세 항목을 다 쓰면 for 루프가 끝납니다." },
              { label: "그대로", expression: "api.example.com", result: "응답 × 2", reason: "tried_as_is가 아직 0이라 마지막으로 절대 이름을 묻습니다. 여기서 A 또는 AAAA 응답을 받습니다." },
              { label: "합계", expression: "(3 + 1) × 2", result: "8 질의", reason: "6개는 실패가 예정된 질의입니다. UDP 하나라도 유실되면 재시도 timeout(기본 5초)만큼 기다립니다." },
            ]}
            conclusion="ndots:5는 같은 네임스페이스의 Service 이름을 한 번에 맞히기 위한 값이고, 외부 이름에는 세 번의 헛질의를 만듭니다. 끝에 점을 붙이거나 dnsConfig로 ndots를 낮추면 8이 2가 됩니다."
            caveats={["호스트의 resolv.conf에 search 도메인이 있으면 kubelet이 뒤에 이어 붙여 질의가 더 늘어납니다. Zalando 사후 보고서가 말한 '10 질의'가 이 경우입니다.", "musl(Alpine)은 search 처리와 병렬 질의 방식이 glibc와 달라 숫자가 바뀝니다. 이 글은 glibc만 셉니다."]}
          />
          <DnsSearchNdotsViz />
        </section>

        <section id="names" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 장치, 표, 훅, 장부, search 목록에 표준 이름을 붙입니다</h2>
          <div className={prose}>
            <p>
              2절의 장치들에 이름을 붙입니다. 패킷이 드나드는 커널 객체는 네트워크 인터페이스(net_device)이며, 물리 NIC뿐 아니라 가상 장치도 같은 종류입니다.</p>
            <p>veth는 두 장치가 한 쌍으로 묶여 한쪽에 보낸 프레임이 전선 없이 다른 쪽에서 수신되는 가상 장치라서 두 끝을 서로 다른 network namespace에 두면 Pod와 호스트를 잇는 관이 됩니다. bridge는 여러 장치를 포트로 묶어 MAC 주소로 프레임을 전달하는 소프트웨어 스위치이며, 플란넬·kubenet 계열 CNI의 cni0가 이것입니다.</p>
            <p>
              라우팅 결정은 두 단계입니다. 먼저 정책 규칙 목록(ip rule)을 우선순위 순으로 훑어 맞는 규칙이 가리키는 표를 고릅니다. 기본 규칙은 0 → local 표, 32766 → main 표, 32767 → default 표입니다. 그 다음 고른 표(ip route)에서 목적지와 가장 길게 일치하는 prefix의 경로를 찾습니다. 이것이 longest prefix match이고 커널은 LC-trie라는 자료 구조로 구현합니다.
            </p>
            <p>
              netfilter는 IP 계층의 정해진 다섯 자리(PRE_ROUTING, LOCAL_IN, FORWARD, LOCAL_OUT, POST_ROUTING)에서 등록된 함수를 차례로 부르는 훅 체계입니다. iptables와 그 후속인 nftables는 이 훅에 규칙 표를 거는 사용자 공간 도구이며 conntrack은 같은 훅에 붙어 5-tuple(출발·목적지 주소와 포트, 프로토콜)마다 연결 항목을 두는 모듈입니다.</p>
            <p>NAT는 conntrack 항목에 변환 정보를 기록해 두고 양방향 패킷을 고쳐 쓰는 일입니다. 이름 평면의 search 목록과 ndots는 resolv.conf(5)의 옵션이며 3절이 그 정의입니다.</p>
          </div>
          {code("nf-hooks-enum", "netfilter 훅 enum")}
          {code("fib-rules-default", "ip rule 기본 세 줄")}
          {code("resolv-conf-ndots", "resolv.conf(5) · ndots")}
          <div id="paper-resolv-conf" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Linux man-pages · resolv.conf(5) · ndots (git master, 2026-10-17 확인)" citeKey={1} href="https://man7.org/linux/man-pages/man5/resolv.conf.5.html">
              <q>The default for n is 1, meaning that if there are any dots in a name, the name will be tried first as an absolute name</q> 이어서 값은 15로 조용히 제한된다고 적습니다. Kubernetes 문서의 Pod resolv.conf 예시는 search 세 항목과 options ndots:5를 보여 줍니다.
            </CitationBlock>
          </div>
        </section>

        <section id="veth-bridge" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. veth는 짝에게 건네고, bridge는 MAC 표를 보고 한 포트에만 건넵니다</h2>
          <div className={prose}>
            <p>
              Pod가 만들어질 때 CNI bridge 플러그인은 Pod의 network namespace 안에서 veth 쌍을 만들고 한쪽(eth0)은 그 안에 두고 다른 쪽은 호스트 namespace로 옮긴 뒤 cni0 bridge의 포트로 붙입니다. 이때 hairpin 모드도 설정합니다.</p>
            <p>hairpin이 꺼져 있으면 bridge는 프레임이 들어온 포트로는 되돌려 보내지 않으므로, Pod가 자기 Service IP로 보낸 패킷이 DNAT 뒤 자기 자신에게 돌아와야 할 때 버려집니다. 1절의 '자기 Service 응답 없음'이 이 설정입니다.</p>
            <p>
              Pod 안 프로세스가 패킷을 보내면 eth0의 송신 함수 veth_xmit가 불립니다. 이 함수는 전선에 쓰는 대신 짝 장치를 찾아 그 장치의 수신 경로(netif_rx)에 프레임을 넣습니다. 그래서 호스트에서는 veth 짝에서 프레임이 '들어온' 것으로 보이며 통계도 Pod 쪽은 tx, 호스트 쪽은 rx에 쌓입니다. 짝이 삭제됐으면 그 자리에서 버립니다.
            </p>
            <p>
              호스트 쪽 veth가 bridge 포트이므로 프레임은 br_handle_frame → br_handle_frame_finish로 갑니다. 목적지 MAC을 FDB에서 찾아 같은 노드의 다른 Pod 포트면 그 포트로만 전달하고(IP 계층을 거치지 않음), 표에 없으면 모든 포트에 뿌리며, bridge 자신의 MAC이면 호스트 IP 계층으로 올립니다.</p>
            <p>다른 노드로 가는 패킷은 Pod의 기본 게이트웨이가 cni0 주소라 세 번째 길을 타며, 그 뒤부터는 6절의 호스트 라우팅입니다. Calico처럼 bridge 없이 호스트 라우팅만 쓰는 CNI에서는 이 절이 통째로 빠지고 veth 짝에서 바로 6절로 갑니다.</p>
          </div>
          {code("cni-bridge-veth", "CNI bridge · setupVeth")}
          {code("veth-xmit", "veth_xmit")}
          {code("bridge-forward", "br_handle_frame_finish")}
        </section>

        <section id="routing" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 라우팅 결정은 규칙 목록으로 표를 고르고, 표에서 가장 긴 prefix를 고릅니다</h2>
          <div className={prose}>
            <p>
              (가정) 노드의 main 표에 세 경로가 있습니다. 10.244.1.0/24 dev cni0(이 노드의 Pod), 10.244.0.0/16 dev tunl0(다른 노드의 Pod, 터널), default via 10.0.0.1 dev eth0. 목적지 10.244.1.9는 세 경로에 모두 맞지만 /24가 가장 길어 cni0로 갑니다.</p>
            <p>10.244.3.5는 /16이 가장 길어 터널로, 8.8.8.8은 /0만 맞아 eth0으로 갑니다. 이 '가장 긴 것'이 longest prefix match입니다.</p>
            <p>
              커널은 이 결정을 두 번 합니다. 들어온 패킷은 PRE_ROUTING 훅을 지난 뒤 ip_rcv_finish에서 ip_route_input_noref로, 이 호스트가 만든 패킷은 send() 안에서 ip_route_output으로 결정합니다. 둘 다 __fib_lookup → fib_rules_lookup으로 들어가 규칙을 우선순위 순으로 본 뒤 맞는 규칙의 표에서 fib_table_lookup을 부릅니다.</p>
            <p>기본 규칙은 local 표(내 주소·broadcast) → main 표 → default 표 순이며, 운영자가 ip rule add로 끼운 규칙이 그 사이에 섭니다. <a href="/cs/cloud/linux-systemd-boot-change-incidents#rule-case">systemd 글의 ip rule 7줄 사례</a>가 이 목록이 바뀌어 트래픽이 사라진 장애입니다.</p>
            <p>
              fib_table_lookup은 목적지 주소 32비트를 키로 LC-trie를 내려갑니다. 키의 비트를 따라 내려가다 더 내려갈 자식이 없거나 prefix가 맞지 않으면 부모로 되돌아가(backtrace) 더 짧은 prefix의 리프를 봅니다. 리프에 닿으면 그 안의 후보(fib_alias)들을 prefix 길이·DSCP·scope·죽은 next hop 순으로 걸러 하나를 돌려줍니다. 아래 의사코드는 10.244.1.9 하나를 이 순서로 통과시킨 것입니다.
            </p>
          </div>
          <AlgorithmBlock
            title="목적지 10.244.1.9가 cni0로 결정되는 순서"
            input={["flowi4: daddr 10.244.1.9, saddr 10.244.1.7, iif veth-a, tos 0", "ip rule: 0 local · 32766 main · 32767 default", "main 표: 10.244.1.0/24 dev cni0 · 10.244.0.0/16 dev tunl0 · 0.0.0.0/0 via 10.0.0.1 dev eth0"]}
            steps={[
              { code: "for rule in rules (by priority): if fib4_rule_match(rule, fl): tbl = rule.table; break", note: "규칙 0은 모든 패킷에 맞아 local 표를 봅니다. 10.244.1.9는 내 주소가 아니라 local 표에서 못 찾고(-EAGAIN) 다음 규칙으로 갑니다." },
              { code: "rule 32766 → main 표: fib_table_lookup(main, key = 0x0AF40109)", note: "10.244.1.9 = 0x0AF40109. 이 키로 트라이를 내려갑니다." },
              { code: "Step 1: n = root; while n is tnode: index = get_cindex(key, n); if index >= 1<<n.bits: break; n = child(n, index)", note: "루트 아래 10.244.0.0/16 노드, 그 아래 10.244.1.0/24 리프까지 키 비트가 맞아 내려갑니다." },
              { code: "found: for fa in leaf.aliases: if (key ^ leaf.key) >= 1 << fa.slen: continue; if fa.scope < fl.scope: continue; return fa", note: "리프의 alias는 /24 하나. 상위 24비트가 같으므로 통과하고, scope도 맞아 이 경로를 돌려줍니다. dev cni0, next hop 없음(직접 연결)." },
              { code: "if no leaf matched: backtrace → parent → shorter prefix (10.244.0.0/16 → 0.0.0.0/0)", note: "10.244.3.5였다면 /24 리프에서 세 번째 바이트가 달라 backtrace하고 /16 노드에서 tunl0을 얻습니다. 8.8.8.8은 루트까지 올라가 /0을 얻습니다." },
              { code: "dst = rt_dst_alloc(dev cni0); skb->dst = dst; dst_input → ip_forward", note: "결정 결과가 skb에 붙습니다. 내 주소가 아니므로 ip_forward가 FORWARD 훅으로 보냅니다." },
            ]}
            repeatUntil="패킷마다 반복하지만 같은 (출발·목적지·tos·장치) 조합은 라우팅 캐시(dst 캐시)로 재사용됩니다."
            output="ip route get 10.244.1.9가 보여 주는 한 줄: 10.244.1.9 dev cni0 src 10.244.1.1. 표에 맞는 것이 하나도 없으면 -ENETUNREACH이고 송신자는 Network is unreachable을 받습니다."
          />
          {code("fib-lookup-entry", "__fib_lookup · 규칙 → 표")}
          {code("fib-rule-match", "fib4_rule_match")}
          {code("fib-trie-lookup", "fib_table_lookup · Step 1·2")}
          {code("fib-trie-leaf", "리프 후보 거르기")}
          {code("ip-route-input", "수신 패킷의 라우팅 결정")}
        </section>

        <section id="netfilter-hooks" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 패킷 하나는 다섯 훅 가운데 세 개를 지나고, 어느 셋인지는 라우팅 결정이 정합니다</h2>
          <div className={prose}>
            <p>
              netfilter 훅은 enum nf_inet_hooks의 다섯 값입니다. 수신 패킷은 ip_rcv에서 PRE_ROUTING(0)을 지난 뒤, 6절의 라우팅 결정이 '내 주소'면 ip_local_deliver에서 LOCAL_IN(1)을 지나 소켓으로, '다른 곳'이면 ip_forward에서 FORWARD(2)를 지나 ip_output의 POST_ROUTING(4)으로 갑니다.</p>
            <p>이 호스트가 만든 패킷은 __ip_local_out에서 LOCAL_OUT(3), ip_output에서 POST_ROUTING(4)을 지납니다. 어느 패킷도 다섯을 다 지나지는 않습니다.</p>
            <p>
              자리마다 할 수 있는 일이 다릅니다. 목적지를 바꾸는 DNAT는 라우팅 결정보다 앞에 있어야 바뀐 주소로 경로가 정해지므로 PRE_ROUTING(들어온 패킷)과 LOCAL_OUT(내가 만든 패킷)에 있습니다. kube-proxy의 Service 규칙이 두 자리에 모두 걸리는 이유입니다. 출발지를 바꾸는 SNAT·MASQUERADE는 경로가 정해진 뒤 나가기 직전인 POST_ROUTING에 있습니다.</p>
            <p>필터링(NetworkPolicy, 방화벽)은 LOCAL_IN·FORWARD·LOCAL_OUT에 있습니다. 1절의 Pod 패킷은 veth → PRE_ROUTING(DNAT로 Service IP가 Pod IP로 바뀜) → 라우팅 → FORWARD → POST_ROUTING(MASQUERADE) → eth0 순서입니다.</p>
            <p>
              iptables는 이 훅에 nat·filter·mangle 표의 체인을 거는 도구이며 nftables는 같은 훅에 사용자가 정의한 체인을 거는 후속 API입니다.</p>
            <p>Kubernetes v1.37 문서는 kube-proxy 기본 모드가 아직 iptables이지만 미래 판에서 nftables로 바뀔 것이라 적으며, nftables 모드는 커널 5.13 이상이 필요하며 수만 개 Service 규모에서 처리 속도 차이가 드러난다고 설명합니다. 두 모드 모두 규칙이 걸리는 자리는 이 다섯 훅으로 같습니다.</p>
          </div>
          <PacketHookPathViz />
          {code("ip-rcv", "ip_rcv · PRE_ROUTING")}
          {code("ip-local-deliver", "ip_local_deliver · LOCAL_IN")}
          {code("ip-local-out", "__ip_local_out · LOCAL_OUT")}
          {code("ip-output", "ip_output · POST_ROUTING")}
          <div id="paper-kube-proxy-modes" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Virtual IPs and Service Proxies (2026-10-17 확인)" citeKey={2} href="https://kubernetes.io/docs/reference/networking/virtual-ips/">
              <q>a future version of Kubernetes will change the default to nftables</q> 같은 문서는 nftables 모드가 커널 5.13 이상을 요구하고, 백엔드가 업그레이드 중 바뀌지 않도록 kube-proxy 설정에 모드를 명시하라고 권합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="conntrack" data-teach-level="5" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. conntrack은 연결마다 항목 하나를 두며, 상한을 넘으면 새 연결의 첫 패킷을 버립니다</h2>
          <div className={prose}>
            <p>
              NAT가 양방향으로 동작하려면 "이 응답은 어느 변환의 응답인가"를 기억해야 합니다. 그 기억이 conntrack 표입니다.</p>
            <p>훅 함수 nf_conntrack_in은 패킷에서 5-tuple을 뽑아 siphash로 버킷을 찾은 뒤, 항목이 있으면 상태(NEW·ESTABLISHED·RELATED)를 패킷에 붙이며, 없으면 init_conntrack으로 새 항목을 만듭니다. 항목은 original과 reply 두 방향 tuple로 표에 두 번 들어가므로 응답 패킷도 같은 항목을 찾습니다.</p>
            <p>
              표의 크기는 두 값으로 정해집니다. nf_conntrack_buckets는 해시 버킷 수이고 기본값은 메모리 ÷ 16384를 1024~262144로 자른 값입니다. nf_conntrack_max는 항목 수 상한이고 기본값은 버킷 수와 같습니다.</p>
            <p>새 항목을 만들 때 상한을 넘으면 같은 버킷에서 오래된 항목을 하나 지워 보고(early_drop), 그것도 안 되면 -ENOMEM과 함께 dmesg에 "nf_conntrack: table full, dropping packet"을 남기며 그 패킷을 버립니다. 기존 연결은 멀쩡하고 새 연결의 첫 SYN만 사라지므로 증상은 '가끔 연결이 안 됨'입니다.</p>
            <p>
              항목은 프로토콜 상태별 timeout이 지나야 사라집니다. TCP ESTABLISHED는 기본 432,000초(5일), TIME_WAIT는 120초입니다. 상대가 FIN 없이 사라진 연결의 항목은 5일 동안 자리를 차지합니다.</p>
            <p>아래 계산은 16 GiB 노드에서 그런 연결이 초당 100개씩 쌓일 때 표가 몇 분 만에 차는지를 셉니다. TIME_WAIT가 소켓 쪽에서 포트를 묶는 문제와 conntrack의 NAT 장부가 다른 표라는 점은 <a href="/cs/cloud/linux-tcp-time-wait-ports-backlog#conntrack">TCP 글의 conntrack 절</a>에 있습니다.</p>
          </div>
          <CalculationWalkthrough
            title="16 GiB 노드의 conntrack 표가 차는 시간"
            question="기본 설정의 16 GiB 노드에서 FIN 없이 끊기는 연결이 초당 100개 생기면 table full까지 얼마나 걸릴까요?"
            scope="Linux v6.12 기본값(buckets = RAM ÷ 16384, 1024~262144로 제한, max = buckets, tcp_timeout_established 432,000초). (가정) 다른 연결은 없고 early_drop으로 지울 만료 항목도 없습니다."
            steps={[
              { label: "버킷 계산값", expression: "17,179,869,184 ÷ 16,384", result: "1,048,576", reason: "16 GiB를 byte로 쓴 뒤 16384로 나눕니다." },
              { label: "상한 적용", expression: "min(1,048,576, 262,144)", result: "262,144 버킷", reason: "4 GiB를 넘는 노드는 모두 262,144입니다. 메모리를 더 꽂아도 기본값은 늘지 않습니다." },
              { label: "nf_conntrack_max", expression: "= buckets", result: "262,144 항목", reason: "기본 상한은 버킷 수와 같습니다. 항목이 두 방향으로 두 번 들어가므로 가득 차면 체인 평균 길이는 2입니다." },
              { label: "항목 수명", expression: "ESTABLISHED timeout", result: "432,000초", reason: "FIN·RST 없이 사라진 연결은 5일간 ESTABLISHED로 남습니다." },
              { label: "차는 시간", expression: "262,144 ÷ 100/s", result: "2,621초 ≈ 44분", reason: "초당 100개가 쌓이고 5일간 하나도 빠지지 않으니 44분 뒤 새 연결의 첫 패킷이 버려지기 시작합니다." },
              { label: "정상 종료였다면", expression: "100/s × 120초", result: "12,000 항목", reason: "FIN으로 닫힌 연결은 TIME_WAIT 120초 뒤 사라져 정상 상태에서는 12,000개 안팎에 머뭅니다. 문제는 양이 아니라 수명입니다." },
            ]}
            conclusion="table full은 트래픽이 많아서가 아니라 사라지지 않는 항목 때문에 오는 경우가 많습니다. conntrack -S의 drop·early_drop과 nf_conntrack_count를 함께 보고, 상한을 올리기 전에 어느 상태의 항목이 쌓이는지(conntrack -L | awk)부터 셉니다."
            caveats={["gc 워커가 95% 이상 찼을 때 만료 항목을 미리 지우므로 실제로는 조금 더 버팁니다.", "kube-proxy는 노드마다 nf_conntrack_max를 max(CPU 수 × 32768, 131072)로 올리고 tcp_timeout_established를 커널 기본의 1/5인 24시간으로 낮춥니다(v1.37.1 pkg/proxy 기본값). 그래서 kube-proxy가 도는 노드는 이 계산보다 오래 버티고, 기본값이 그대로인 노드는 kube-proxy 설정부터 확인합니다."]}
          />
          {code("conntrack-in", "nf_conntrack_in")}
          {code("conntrack-resolve", "resolve_normal_ct")}
          {code("conntrack-table-full", "table full, dropping packet")}
          {code("conntrack-hash", "버킷 수·상한 변수와 해시")}
          {code("conntrack-sysctl", "nf_conntrack_buckets 기본값")}
          {code("conntrack-max-doc", "nf_conntrack_max · timeout_established")}
          <div id="paper-conntrack-sysctl" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Linux v6.12 Documentation/networking/nf_conntrack-sysctl.rst" citeKey={3} href="https://raw.githubusercontent.com/torvalds/linux/v6.12/Documentation/networking/nf_conntrack-sysctl.rst">
              <q>the default size is calculated by dividing total memory by 16384 to determine the number of buckets</q> 이어서 버킷은 1024 미만도 262144 초과도 되지 않으며, nf_conntrack_max는 기본으로 버킷 수와 같고 항목은 두 방향으로 두 번 들어간다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="resolver-trace" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. glibc는 점을 센 뒤 search 목록을 돌고, kubelet이 ndots:5를 써 줍니다</h2>
          <div className={prose}>
            <p>
              3절의 8 질의를 glibc 2.40 resolv/res_query.c에서 따라갑니다. __res_context_search(345행)는 이름의 점을 세어 dots에, 끝의 점을 trailing_dot에 둡니다. 384행이 첫 분기입니다.</p>
            <p>dots &gt;= statp-&gt;ndots || trailing_dot이면 __res_context_querydomain(name, NULL)로 그대로 먼저 물으며, 답이 오면 끝입니다. api.example.com은 dots 2라 이 분기를 지나칩니다.</p>
            <p>
              414–423행이 search 루프입니다. 점이 없거나(RES_DEFNAMES), 점이 있지만 끝점이 없으면(RES_DNSRCH) __resolv_context_search_list에서 항목을 하나씩 꺼내 __res_context_querydomain(name, dname)을 부릅니다.</p>
            <p>항목마다 질의 한 벌이고, 응답이 오면 거기서 끝납니다. 세 항목이 모두 NXDOMAIN이면 루프가 끝나고 508–511행에서 tried_as_is가 0이므로 마지막으로 절대 이름을 묻습니다. 여기서 4번째 벌이 나갑니다.</p>
            <p>
              search 목록과 ndots를 쓴 쪽은 kubelet입니다.</p>
            <p>pkg/kubelet/network/dns/dns.go의 GetPodDNS는 정책이 ClusterFirst면 nameserver를 클러스터 DNS로 바꿉니다.</p>
            <p>그다음 generateSearchesForDNSClusterFirst가 만든 &lt;namespace&gt;.svc.cluster.local · svc.cluster.local · cluster.local 세 항목을 호스트 search 앞에 붙이며, options를 defaultDNSOptions = ["ndots:5"]로 둡니다.</p>
            <p>2019년 Zalando의 클러스터 전체 DNS 장애 보고서는 이 ndots:5가 외부 이름 조회를 여러 배로 늘렸으며, 그 부하가 100Mi 한도의 CoreDNS를 OOMKill로 몰아 회복 불가 상태를 만들었다고 적습니다. 그 사건의 OOM 쪽은 <a href="/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview">Kubernetes SRE 글</a>에서 다시 봅니다.</p>
          </div>
          {code("res-search", "__res_context_search · 점 세기와 search 루프")}
          {code("res-search-tail", "마지막 절대 이름 질의")}
          {code("kubelet-dns", "kubelet GetPodDNS")}
          {code("kubelet-dns-search", "search 세 항목의 출처")}
          <div id="paper-zalando-dns" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Zalando · Postmortem: Total DNS outage in Kubernetes cluster (2019-01-07)" citeKey={4} href="https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md">
              <q>10 DNS queries for every single DNS lookup</q> 보고서는 ndots:5와 호스트 search 도메인의 조합이 외부 이름 조회를 이만큼 늘렸고, Node.js 기본 resolver에 캐시가 없어 요청 급증이 그대로 DNS 질의 급증이 됐다고 적습니다. 근인은 CoreDNS의 memory limit 100Mi였고 2000Mi로 올린 뒤 회복했습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="kernel-source" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 원문 한 벌로 Pod 패킷 하나를 끝까지 따라갑니다</h2>
          <div className={prose}>
            <p>
              1절의 Pod가 api.example.com에 보내는 첫 SYN을 원문 순서로 놓습니다.</p>
            <p>Pod 안에서 connect()가 ip_route_output으로 기본 게이트웨이(cni0 주소)를 얻은 뒤, __ip_local_out(ip_output.c 101행)이 LOCAL_OUT 훅을 지나 ip_output(427행)의 POST_ROUTING을 거쳐 eth0(veth)의 veth_xmit(veth.c 344행)에 닿습니다. veth_xmit는 짝인 호스트 쪽 장치의 netif_rx에 프레임을 넣습니다.</p>
            <p>
              호스트에서는 bridge 포트이므로 br_handle_frame(br_input.c 325행) → br_handle_frame_finish(76행)가 목적지 MAC(cni0)을 FDB에서 찾아 BR_FDB_LOCAL이라 br_pass_frame_up으로 IP 계층에 올립니다.</p>
            <p>ip_rcv(ip_input.c 560행)가 PRE_ROUTING 훅을 부르며, 여기서 nf_conntrack_in(nf_conntrack_core.c 2003행)이 tuple을 만들어 표를 찾고 없으면 init_conntrack(1655행 근처)으로 항목을 만들며, 상한을 넘으면 1668행의 경고와 함께 버립니다.</p>
            <p>통과하면 ip_rcv_finish(435행)의 ip_route_input_noref가 __fib_lookup(fib_rules.c 82행) → fib_table_lookup(fib_trie.c 1445행)으로 default 경로를 얻고 dst_input이 ip_forward를 부릅니다.</p>
            <p>
              ip_forward는 FORWARD 훅을 지나 ip_output으로 넘기며, POST_ROUTING에서 MASQUERADE 규칙이 conntrack 항목에 변환을 기록하며 출발 주소를 노드 IP로 바꿉니다.</p>
            <p>응답은 eth0으로 들어와 PRE_ROUTING에서 conntrack이 reply 방향 tuple로 같은 항목을 찾아 목적지를 Pod IP로 되돌린 뒤, 라우팅 결정이 10.244.1.0/24 dev cni0를 골라 bridge → veth 짝 → Pod의 eth0 → 소켓에 닿습니다. 아래 버튼이 이 순서의 원문입니다.</p>
          </div>
          {code("ip-local-out", "① __ip_local_out")}
          {code("veth-xmit", "② veth_xmit → 짝")}
          {code("bridge-forward", "③ bridge FDB 조회")}
          {code("ip-rcv", "④ ip_rcv · PRE_ROUTING")}
          {code("conntrack-in", "⑤ nf_conntrack_in")}
          {code("fib-trie-lookup", "⑥ fib_table_lookup")}
          {code("ip-output", "⑦ ip_output · POST_ROUTING")}
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 볼 것은 경로, 규칙, conntrack, search이고 고칠 곳은 이름과 규칙과 상한입니다</h2>
          <div className={prose}>
            <p>
              진단은 계층 순서대로 합니다. ip -br link와 ip -br addr로 veth 짝과 bridge 포트가 살아 있는지, bridge fdb show로 Pod MAC이 학습돼 있는지, ip route get &lt;목적지&gt;로 6절의 결정이 어느 장치·next hop을 고르는지 봅니다.</p>
            <p>ip rule로 main 표 앞에 끼어든 규칙이 없는지 확인한 뒤, nft list ruleset 또는 iptables-save로 다섯 훅에 걸린 DNAT·MASQUERADE·필터 규칙을 읽습니다.</p>
            <p>conntrack -S의 drop·early_drop·insert_failed와 /proc/sys/net/netfilter/nf_conntrack_count 대 nf_conntrack_max가 8절입니다. 이름 평면은 Pod 안에서 cat /etc/resolv.conf와 dig +search +showsearch로 실제 질의 순서를 봅니다.</p>
            <p>
              고치기는 증상에 따라 갈립니다. 외부 이름의 헛질의는 코드에서 FQDN에 끝점을 붙이거나(api.example.com.), Pod dnsConfig.options로 ndots를 2 안팎으로 낮추거나, 노드 로컬 DNS 캐시를 두어 CoreDNS까지 가는 질의를 줄입니다.</p>
            <p>셋 중 어느 것도 Service 짧은 이름을 깨지 않도록 cluster.local 이름은 FQDN으로 바꿔 두는 것이 안전합니다. conntrack table full은 상한을 올리기 전에 어느 상태의 항목이 쌓이는지 세고, 수명 문제면 timeout이나 애플리케이션의 종료 처리를 고칩니다. hairpin은 CNI 설정 hairpinMode: true로 켭니다.</p>
            <p>
              이 글의 수치는 커널 기본값과 glibc 코드의 분기를 가정한 resolv.conf와 라우팅 표에 적용해 손으로 센 것이며 실제 노드에서 잰 값이 아닙니다. CNI와 배포판에 따라 bridge 유무, nftables·iptables 백엔드, 기본 ndots가 다릅니다.</p>
            <p>이 바닥 위에서 Service가 EndpointSlice의 어느 Pod로 DNAT되고 readiness가 그 목록을 어떻게 바꾸는지는 <a href="/cs/cloud/kubernetes-network-packet-path#service-path">Kubernetes 패킷 경로</a>에, Pod 종료 때 endpoint 제거와 SIGTERM이 동시에 시작되어 생기는 경주는 <a href="/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#overview">롤아웃과 종료 글</a>에 있습니다.</p>
          </div>
          <ContentBoundary article="linux-network-interface-route-netfilter-dns" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>Pod dnsConfig로 ndots를 2로 낮추면 3절의 api.example.com은 질의 몇 개가 되고, 같은 네임스페이스의 data는 몇 개가 될까요? (답: 3절)</p>
            <p>6절의 표에 10.244.1.9/32 via 10.244.1.1 dev tunl0 한 줄을 더하면 10.244.1.9는 어디로 가고, 10.244.1.8은 어디로 갈까요? (답: 6절)</p>
            <p>노드 자신(호스트 프로세스)이 ClusterIP에 접속할 때 kube-proxy의 DNAT 규칙은 다섯 훅 가운데 어디에 걸려야 하고, 왜 PRE_ROUTING으로는 안 되나요? (답: 7절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={linuxNetworkTrees}
        projectMetas={{
          linux: { id: "linux", label: "Linux v6.12 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          glibc: { id: "glibc", label: "glibc 2.40 원문", badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700" },
          kubernetes: { id: "kubernetes", label: "Kubernetes v1.37.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          "cni-plugins": { id: "cni-plugins", label: "CNI plugins v1.6.2 원문", badgeClass: "bg-amber-500/10 border-amber-500 text-amber-700" },
          "man-pages": { id: "man-pages", label: "Linux man-pages 원문", badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700" },
        }}
      />
    </>
  );
}
