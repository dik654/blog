import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import HolePunchViz from "./nat-traversal/viz/HolePunchDetailViz";
import ICEViz from "./nat-traversal/viz/ICEViz";
import NATTypesViz from "./nat-traversal/viz/NATTypesViz";
import STUNViz from "./nat-traversal/viz/STUNViz";
import TURNViz from "./nat-traversal/viz/TURNViz";

export default function NatTraversalArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          STUN·TURN·ICE는 네 단계를 차례로 밟는 도구가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>
              NAT traversal은 여러 주소 후보를 준비한 뒤 실제 packet 왕복으로
              통하는 pair를 고르는 과정입니다.
            </strong>{" "}
            STUN은 밖에서 보이는 주소를 관찰하고, TURN은 relay 주소를 빌려주며,
            ICE는 이 후보들을 교환·검사·선택합니다. Hole punching은 별도의
            마지막 프로토콜이 아니라 direct connectivity check가 양쪽 NAT에 통과
            상태를 만드는 현상입니다.
          </p>
          <p>
            왜 주소를 알기만 해서는 부족할까요? NAT가 답하는 질문이 둘이기
            때문입니다. <strong>Mapping</strong>은 내부 IP:port를 밖에서 어떤
            IP:port로 보이게 할지 정합니다. <strong>Filtering</strong>은 그 외부
            주소로 들어오는 packet 중 어느 remote IP:port를 받을지 정합니다.
            같은 mapping을 알아도 filtering이 막으면 direct path는 열리지
            않습니다.
          </p>
        </div>

        <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4">
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              Alice · NAT A 뒤
            </p>
            <p className="mt-2 font-mono text-xs leading-6 text-foreground/75">
              host 10.0.0.5:5000
              <br />
              srflx 203.0.113.5:40000
              <br />
              relay 192.0.2.44:55000
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              Bob · NAT B 뒤
            </p>
            <p className="mt-2 font-mono text-xs leading-6 text-foreground/75">
              host 192.168.1.10:6000
              <br />
              srflx 198.51.100.10:50000
              <br />
              relay 192.0.2.45:56000
            </p>
          </div>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글은 끝까지 이 한 통화 사례만 추적합니다. 주소는 문서용 대역이고,
            Alice와 Bob은 아직 서로의 identity를 인증하지 않았다고 둡니다. 경로
            탐색과 상대 인증·종단 암호화는 서로 다른 책임입니다.
          </p>
          <p>
            오래된 “full cone·symmetric NAT” 이름은 여러 behavior를 한 단어에
            묶어 오해를 만들기 쉽습니다. 여기서는 목적지에 따라 mapping이
            바뀌는지와 inbound source에 따라 filtering이 바뀌는지를 따로 봅니다.
          </p>
        </div>

        <div className="not-prose my-8">
          <NATTypesViz />
        </div>

        <CitationBlock
          source="RFC 4787 — UDP NAT Behavioral Requirements"
          citeKey={1}
          href="https://www.rfc-editor.org/rfc/rfc4787.html"
        >
          <div id="paper-nat-behavior" className="space-y-1 text-sm leading-6">
            <p>
              <strong>문제:</strong> NAT마다 UDP mapping·filtering 동작이 달라
              애플리케이션이 경로 성질을 예측하기 어렵습니다.
            </p>
            <p>
              <strong>기여:</strong> Endpoint-independent·address-dependent
              behavior를 mapping과 filtering으로 나눠 설명합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> UDP NAT behavior와 권고 사항에
              한정합니다.
            </p>
            <p>
              <strong>비보장:</strong> 모든 배포 NAT가 권고를 따르거나 한 번의
              관찰이 모든 목적지에서 반복된다고 보장하지 않습니다.
            </p>
          </div>
        </CitationBlock>
      </section>

      <section id="stun" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          STUN은 “상대에게 연결”하는 대신 “밖에서 본 내 주소”를 알려줍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice가 STUN server에 Binding request를 보내면 NAT A가 UDP source를{" "}
            <code>10.0.0.5:5000</code>에서 <code>203.0.113.5:40000</code>으로
            바꿉니다. Server는 자신이 본 source transport address를 success
            response의 <code>XOR-MAPPED-ADDRESS</code>에 넣습니다. Alice는
            96-bit transaction ID로 response를 원래 request와 맞춥니다.
          </p>
          <p>
            이름 그대로 이것은 <strong>server-reflexive candidate</strong>, 즉
            STUN server에 비친 주소입니다. XOR는 암호가 아니라 일부 middlebox가
            payload 속 IP를 잘못 고치는 문제를 피하기 위한 encoding입니다. 이
            값은 Bob에게도 같은 mapping이 생기는지, Bob의 packet이 들어올 수
            있는지, 응답한 상대가 진짜 Bob인지를 증명하지 않습니다.
          </p>
        </div>

        <div className="not-prose my-8">
          <STUNViz />
        </div>

        <CitationBlock
          source="RFC 8489 — Session Traversal Utilities for NAT"
          citeKey={2}
          href="https://www.rfc-editor.org/rfc/rfc8489.html"
        >
          <div id="paper-stun" className="space-y-1 text-sm leading-6">
            <p>
              <strong>문제:</strong> Endpoint가 NAT를 지난 뒤 자신에게 배정된
              reflexive transport address를 알아야 합니다.
            </p>
            <p>
              <strong>기여:</strong> STUN transaction과 XOR-MAPPED-ADDRESS 처리
              규칙을 표준화합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Binding request·response와 관측 주소
              의미에 한정합니다.
            </p>
            <p>
              <strong>비보장:</strong> STUN 단독은 NAT type 완전 판별, relay,
              peer identity, direct connectivity를 보장하지 않습니다.
            </p>
          </div>
        </CitationBlock>
      </section>

      <section id="turn" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          TURN은 direct path가 막혀도 남겨 둘 수 있는 relay 후보입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice는 인증된 Allocate transaction으로 TURN server의{" "}
            <code>192.0.2.44:55000</code>을 빌립니다. 이 allocation은 단순한
            주소 한 줄이 아니라 client–server 5-tuple, relay address,
            authentication state, permission, channel, 만료 시각을 가진
            server-side state입니다. 기본 allocation lifetime은 600초이며
            server가 response에 실제 값을 알려줍니다.
          </p>
          <p>
            Relay가 Bob traffic을 Alice에게 넘기려면 Bob의 IP에 permission이
            있어야 합니다. Permission은 port가 아니라 peer IP 단위이고
            lifetime은 300초입니다. Allocation은 data를 보냈다고 자동으로
            갱신되지 않으므로 만료 전에 Refresh가 필요합니다.
          </p>
          <p>
            TURN의 목적은 “항상 느리지만 확실한 마지막 단계”라는 문구보다
            구체적입니다. 직접 candidate가 실패할 때도 reachable candidate를
            제공하는 것입니다. 지연이 정확히 두 배라는 법칙은 없습니다.
            Client–relay–peer의 실제 topology, queue, transport와 relay
            bandwidth를 측정해야 합니다.
          </p>
        </div>

        <div className="not-prose my-8">
          <TURNViz />
        </div>

        <CitationBlock
          source="RFC 8656 — Traversal Using Relays around NAT"
          citeKey={3}
          href="https://www.rfc-editor.org/rfc/rfc8656.html"
        >
          <div id="paper-turn" className="space-y-1 text-sm leading-6">
            <p>
              <strong>문제:</strong> Direct candidate가 실패해도 peer 사이에
              reachable data path가 필요합니다.
            </p>
            <p>
              <strong>기여:</strong> Authenticated allocation, permission,
              channel, refresh와 expiry lifecycle을 규정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Relay transport address와 TURN server
              state에 한정합니다.
            </p>
            <p>
              <strong>비보장:</strong> 낮은 latency, 무제한 bandwidth,
              application 종단 identity·confidentiality를 보장하지 않습니다.
            </p>
          </div>
        </CitationBlock>
      </section>

      <section id="ice" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          ICE는 후보를 모으는 목록이 아니라 실제 왕복으로 경로를 고르는 상태
          기계입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice와 Bob은 host·server-reflexive·relay candidate와 ICE
            credential을 애플리케이션의 signaling channel로 교환합니다.
            Signaling 방식은 ICE가 정하지 않습니다. 두 agent는 local×remote
            pair를 만든 뒤 중복을 제거하고 priority로 정렬해 checklist를
            만듭니다.
          </p>
          <p>
            여기서 priority는 “성공할 확률”이나 “가장 빠른 경로”가 아니라 검사
            순서입니다. 각 scheduled pair에 STUN Binding request를 보내고
            success response와 transport address 대칭 조건을 확인해야 valid
            pair가 됩니다. Controlling agent가 valid pair를 nominate한 뒤에야
            selected pair가 data path가 됩니다.
          </p>
        </div>

        <ExplainedFormula
          question="ICE checklist에서 candidate pair의 검사 순서를 어떻게 정하는가?"
          idea="두 candidate 중 낮은 priority를 가장 큰 자리로 올려 약한 쪽을 먼저 비교하고, 높은 priority와 controlling role을 뒤의 tie-breaker로 붙입니다."
          formula={String.raw`P_{pair}=2^{32}\min(G,D)+2\max(G,D)+\mathbf{1}[G>D]`}
          annotatedFormula={String.raw`P_{pair}=\underbrace{2^{32}\min(G,D)}_{\text{낮은 candidate priority}}+\underbrace{2\max(G,D)}_{\text{높은 쪽 tie-break}}+\underbrace{\mathbf{1}[G>D]}_{\text{role tie-break}}`}
          operations={[
            {
              expression: String.raw`2^{32}\min(G,D)`,
              annotation: [
                "두 candidate 중 낮은 priority를 먼저 비교합니다",
                "둘 중 약한 쪽이 더 좋은 pair가 앞에 옵니다",
              ],
            },
            {
              expression: String.raw`2\max(G,D)`,
              annotation: ["낮은 값이 같으면 높은 값을 비교합니다"],
            },
            {
              expression: String.raw`\mathbf{1}[G>D]`,
              annotation: [
                "그래도 같으면 controlling 쪽을 1-bit로 구별합니다",
                "이 값은 connectivity 성공을 계산하지 않습니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "P_{pair}",
              name: "Pair priority",
              description: "Checklist 내림차순 정렬에 쓰는 무차원 정수",
            },
            {
              symbol: "G",
              name: "Controlling candidate priority",
              description: "Controlling agent가 제공한 candidate priority",
            },
            {
              symbol: "D",
              name: "Controlled candidate priority",
              description: "Controlled agent가 제공한 candidate priority",
            },
            {
              symbol: "2^{32}",
              name: "Position factor",
              description: "낮은 priority를 더 큰 정렬 자리로 옮기는 계수",
            },
            {
              symbol: "\\mathbf{1}[G>D]",
              name: "Role indicator",
              description: "G가 D보다 크면 1, 아니면 0",
            },
          ]}
          assumptions={[
            "G와 D는 RFC 8445 candidate priority 규칙으로 계산한 2^32 미만 정수입니다.",
            "Controlling·controlled role이 정해져 있어야 합니다.",
            "Priority는 검사 순서일 뿐 success probability·RTT가 아닙니다.",
          ]}
          interpretation="낮은 candidate priority가 큰 pair를 먼저 검사하고, 같으면 높은 priority와 role bit가 순서를 가릅니다. 실제 사용 여부는 수식이 아니라 connectivity check와 nomination이 결정합니다."
        />

        <div className="not-prose my-6 rounded-xl border border-border/70 bg-muted/20 p-4 text-sm leading-6">
          <p className="font-semibold">축소 숫자로 한 번 따라가기</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-foreground/75">
            <li>
              설명용으로 <code>G=100</code>, <code>D=80</code>을 둡니다.
            </li>
            <li>
              <code>min=80</code>, <code>max=100</code>, <code>G&gt;D</code>
              이므로 마지막 bit는 1입니다.
            </li>
            <li>
              첫 항은 <code>2³²×80 = 343,597,383,680</code>, 둘째 항은{" "}
              <code>2×100 = 200</code>입니다.
            </li>
            <li>
              합은 <code>343,597,383,881</code>입니다. G와 D만 뒤집으면 마지막
              bit가 0이 되어 정확히 1 작습니다.
            </li>
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">
            이 계산은 정렬 위치만 보여 줍니다. NAT를 통과했다는 증거는 뒤의 STUN
            connectivity check 결과입니다.
          </p>
        </div>

        <div className="not-prose my-8">
          <ICEViz />
        </div>

        <AlgorithmBlock
          title="ICE 한 바퀴: 후보 준비에서 selected pair까지"
          input={[
            "Alice host·srflx·relay candidates + ICE credential",
            "Bob host·srflx·relay candidates + ICE credential",
            "controlling·controlled role",
          ]}
          steps={[
            {
              code: "signal(peer, candidates, ice_credentials)",
              note: "애플리케이션 signaling으로 후보와 credential을 교환합니다.",
            },
            {
              code: "checklist = prune_and_sort(form_pairs(local, remote))",
              note: "가능한 local×remote pair를 만들고 중복을 제거한 뒤 priority 순으로 정렬합니다.",
            },
            {
              code: "result = stun_connectivity_check(next_scheduled_pair)",
              note: "정렬값을 믿고 선택하지 않고 실제 Binding transaction을 왕복시킵니다.",
            },
            {
              code: "if succeeded: valid_pairs.add(result.valid_pair)",
              note: "성공 response와 transport address 조건을 만족한 pair만 valid list에 넣습니다.",
            },
            {
              code: "if controlling: nominate(chosen_valid_pair)",
              note: "정책이 고른 valid pair를 상대에게 알려 selected pair로 확정합니다.",
            },
          ]}
          repeatUntil="각 component에 selected pair가 생기거나 checklist가 실패할 때까지 scheduled check를 반복합니다."
          output="selected_pair = direct srflx pair, 또는 direct 실패 시 relay pair"
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 후보가 모일 때까지 기다릴 필요도 없습니다. Trickle ICE는 새
            candidate를 찾는 즉시 상대에게 추가해 checks를 일찍 시작하게 합니다.
            바뀌는 것은 candidate 공급 시점이지, pair를 검사하고 nominate한다는
            기준은 아닙니다.
          </p>
          <p>
            Wi-Fi에서 mobile network로 바뀌면 기존 candidate가 사라질 수
            있습니다. ICE restart는 새 credential과 candidate로 checks를 다시
            수행하는 절차입니다. Restart가 application stream을 자동으로 무중단
            이전해 주는 것은 아닙니다. 그 책임은 ICE를 쓰는 상위 transport와
            application에 있습니다.
          </p>
        </div>

        <CitationBlock
          source="RFC 8445 — Interactive Connectivity Establishment"
          citeKey={4}
          href="https://www.rfc-editor.org/rfc/rfc8445.html"
        >
          <div id="paper-ice" className="space-y-1 text-sm leading-6">
            <p>
              <strong>문제:</strong> 여러 local·remote address 조합 중 실제
              양방향 data path를 골라야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Candidate checklist, paced STUN checks,
              valid pair, nomination과 restart를 정의합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Pair priority, connectivity check와
              nomination semantics에 한정합니다.
            </p>
            <p>
              <strong>비보장:</strong> 높은 priority나 STUN address 하나가
              direct connectivity·낮은 RTT를 보장하지 않습니다.
            </p>
          </div>
        </CitationBlock>

        <CitationBlock
          source="RFC 8838 — Trickle ICE"
          citeKey={5}
          href="https://www.rfc-editor.org/rfc/rfc8838.html"
        >
          <div id="paper-trickle-ice" className="space-y-1 text-sm leading-6">
            <p>
              <strong>문제:</strong> 모든 candidate 수집을 기다리면 첫
              connectivity check가 늦어집니다.
            </p>
            <p>
              <strong>기여:</strong> ICE가 실행 중인 동안 candidate를 점진적으로
              공급하는 절차를 정의합니다.
            </p>
            <p>
              <strong>비보장:</strong> Candidate를 일찍 보낸다고 direct path
              성공이나 고정된 연결 시간이 보장되지는 않습니다.
            </p>
          </div>
        </CitationBlock>
      </section>

      <section id="hole-punching" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Hole punching은 direct check가 NAT 양쪽에 통로를 만드는 모습입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice가 Bob의 <code>198.51.100.10:50000</code>으로 check를 보내면
            NAT A에 Bob 방향 state가 생깁니다. Bob도 Alice의{" "}
            <code>203.0.113.5:40000</code>으로 check를 보내면 NAT B에 Alice 방향
            state가 생깁니다. 두 방향의 STUN transaction이 성공할 때 direct
            candidate pair를 valid로 볼 수 있습니다.
          </p>
          <p>
            따라서 “정확히 동시에 보내야 한다”는 뜻은 아닙니다. ICE의
            ordinary·triggered check와 재전송이 두 방향의 state가 겹치는 시간을
            만듭니다. Destination-dependent mapping, strict filtering, stale
            candidate, packet loss, mapping expiry가 있으면 실패할 수 있으므로
            고정된 ±500ms 성공 법칙을 둘 수 없습니다.
          </p>
        </div>

        <div className="not-prose my-8">
          <HolePunchViz />
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>ICE와 DCUtR은 같은 생각을 쓰지만 같은 프로토콜은 아닙니다</h3>
          <p>
            ICE는 후보·credential·checklist·nomination을 정의합니다. Libp2p
            DCUtR은 이미 Circuit Relay로 연결된 peer들이 그 relay stream에서
            observed address를 교환하고 Connect·Sync와 측정한 relay RTT를 이용해
            비슷한 시점의 direct dial을 조정합니다. 성공하면 새 direct
            connection을 우선하고, 실패하면 기존 relay를 유지합니다.
          </p>
          <p>
            운영 검증도 “direct success rate” 하나로 끝내지 않습니다. Candidate
            pair별 실패 이유, 첫 연결 시간, relay bytes, restart 뒤 path 변경,
            mapping expiry, peer identity와 암호화의 동일성을 함께 기록해야
            합니다. 경로가 direct로 바뀌었다고 보안 경계까지 자동으로 같아지는
            것은 아닙니다.
          </p>
        </div>

        <CitationBlock
          source="libp2p Specification — Direct Connection Upgrade through Relay"
          citeKey={6}
          href="https://github.com/libp2p/specs/blob/master/relay/DCUtR.md"
        >
          <div id="paper-dcutr" className="space-y-1 text-sm leading-6">
            <p>
              <strong>문제:</strong> Relay로 이미 연결된 두 NAT peer를 가능한
              경우 direct path로 옮겨야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Connect·Sync, relay RTT 측정과 simultaneous
              TCP/QUIC direct dial을 규정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> DCUtR coordination과 direct connection
              upgrade에 한정합니다.
            </p>
            <p>
              <strong>비보장:</strong> 모든 NAT에서 성공, application
              authentication, relay-free liveness를 보장하지 않습니다.
            </p>
          </div>
        </CitationBlock>
      </section>
    </>
  );
}
