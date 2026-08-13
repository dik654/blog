import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { B300_SWITCHLESS_SOURCE_LINKS } from "@/content/b300-switchless-network";

export default function Addressing() {
  return (
    <section id="addressing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        cables.txt를 주소·interface 설정의 단일 원천으로
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          switchless에서는 각 cable이 하나의 L3 segment다. 링크마다 `/30`을
          배정하면 network, 두 endpoint, broadcast가 명확하고 peer를 잘못 고른
          GID도 쉽게 진단할 수 있다. 주소는 수작업 표와 shell 명령에 중복하지
          않고 topology manifest에서 생성한다.
        </p>
        <ExplainedFormula
          question="Node pair와 link 번호만으로 충돌하지 않는 /30 주소를 어떻게 만드는가?"
          idea={
            <p>
              작은 node 번호를 a, 큰 번호를 b로 정렬하면 방향과 무관한 pair
              identity가 됩니다. 두 번호를 second octet에 넣고 link 번호를 third
              octet에 넣어 cable마다 고유한 /30을 만듭니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            o_2 &= 100+10a+b \\
            \mathrm{net}(a,b,\ell) &= 10.o_2.\ell.0/30 \\
            h_a &= .1,\qquad h_b=.2
          \end{aligned}`}
          terms={[
            { symbol: "a,b", name: "sorted node IDs", description: "a<b가 되도록 정렬한 1–8 범위의 두 server 번호입니다." },
            { symbol: "\\ell", name: "link index", description: "같은 node pair 사이에서 cable을 구분하는 1부터 시작하는 번호입니다." },
            { symbol: "o_2", name: "second octet", description: "Node pair identity를 사람이 읽을 수 있게 담는 IPv4 두 번째 octet입니다." },
            { symbol: "/30", name: "point-to-point prefix", description: "Network·두 host·broadcast의 네 주소를 갖는 subnet입니다." },
          ]}
          assumptions={[
            "Node ID는 1–8이고 a<b로 정렬하며 link index와 octet 범위를 validator가 검사합니다.",
            "각 cable은 하나의 독립 L3 segment이고 같은 /30을 두 cable에 재사용하지 않습니다.",
            "주소 규칙과 interface mapping은 같은 manifest revision에서 생성합니다.",
          ]}
          interpretation="Server 1↔2의 첫 cable은 10.112.1.0/30이 되고, server 1은 .1, server 2는 .2를 사용합니다. 방향을 바꿔 입력해도 같은 subnet이 나와야 합니다."
        />
        <p className="leading-7">
          예를 들어 server 1↔2의 첫 링크는 `10.112.1.0/30`, endpoint는 `.1`과
          `.2`다. server 2↔3의 세 번째 링크는 `10.123.3.0/30`이다. 이 규칙은
          1–8번 노드를 가정하므로 범위를 validator에서 제한한다.
        </p>
        <div
          data-viz="switchless-manifest-contract"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          {[
            ["입력", "node pair · physical OSFP · cable/link index", "중복 edge와 port 재사용을 거부"],
            ["inventory 결합", "PCI BDF · netdev · RDMA device", "현재 host inventory와 일치하는지 확인"],
            ["생성", "/30 endpoint · MTU · link-up 명령", "양 끝이 같은 prefix이고 host가 .1/.2인지 확인"],
            ["검증", "route · ping · RDMA pair test", "각 interface가 정확히 한 direct peer에만 닿는지 확인"],
          ].map(([stage, artifact, check]) => (
            <article key={stage} className="grid min-w-0 gap-3 border-b border-border/70 px-4 py-4 last:border-b-0 md:grid-cols-[7rem_1fr_1.2fr] md:gap-4">
              <strong className="text-sm">{stage}</strong>
              <p className="break-words text-sm">{artifact}</p>
              <p className="break-words text-sm text-muted-foreground">{check}</p>
            </article>
          ))}
        </div>
        <pre className="overflow-x-auto text-xs">
          <code>{`# 생성된 명령의 형태 — 실제 interface는 inventory에서 resolve
ip link set <netdev> up mtu 9000
ip addr flush dev <netdev>
ip addr add 10.112.1.1/30 dev <netdev>

# 검증: 양끝에 정확히 하나의 peer route만 있어야 함
ip -br addr show dev <netdev>
ping -I <netdev> 10.112.1.2`}</code>
        </pre>
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm leading-6">
          `ip addr flush`는 기존 주소를 제거한다. 관리망이 아닌 대상 compute
          interface를 PCI/netdev inventory로 확인하고, console과 rollback plan이
          있는 상태에서만 적용한다.
        </p>
        <div id="paper-switchless-project" className="scroll-mt-24">
          <CitationBlock
            source={B300_SWITCHLESS_SOURCE_LINKS.project.label}
            citeKey={3}
            type="code"
            href={B300_SWITCHLESS_SOURCE_LINKS.project.href}
          >
            공개 저장소는 cable manifest에서 node별 설정을 생성하는 구현과
            프로젝트 topology를 제공한다. 주소 규칙은 이 배포를 재현하는
            convention이며 일반 RoCE 표준이나 모든 조직에 필요한 고정 schema는
            아니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
