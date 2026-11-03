import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { B300_SWITCHLESS_SOURCE_LINKS } from "@/content/b300-switchless-network";

export default function Addressing() {
  return (
    <section id="addressing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        케이블 원장에서 두 논리 링크의 주소를 함께 만듭니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Split 구성에서는 물리 케이블 하나가 두 400G 논리 링크를 만듭니다.
          따라서 “케이블 하나에 /30 하나”가 아니라 <strong>논리 링크 하나에
          /30 하나</strong>를 배정합니다. Network, 두 endpoint, broadcast가
          분리되어야 peer를 잘못 고른 GID도 진단할 수 있습니다. 주소는 수작업
          표와 shell 명령에 반복하지 않고 topology manifest에서 생성합니다.
        </p>
        <ExplainedFormula
          question="Node pair와 link 번호만으로 충돌하지 않는 /30 주소를 어떻게 만드는가?"
          idea={
            <p>
              작은 node 번호는 <span className="whitespace-nowrap">작은 번호(a)</span>로 둡니다.
              큰 node 번호는 <span className="whitespace-nowrap">큰 번호(b)</span>로 둡니다. 이 순서로 정렬하면 방향과 무관한 pair
              identity가 됩니다. 두 번호를 second octet에 넣고 link 번호를 third
              octet에 넣어 logical link마다 고유한 /30을 만듭니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            o_2 &= 100+10a+b \\
            \mathrm{net}(a,b,\ell) &= 10.o_2.\ell.0/30 \\
            h_a &= .1,\qquad h_b=.2
          \end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
            \underbrace{o_2}_{\text{node pair를 담는 둘째 octet}} &= \underbrace{100}_{\text{사설 주소 기준}}+\underbrace{10a+b}_{\text{정렬한 두 node 번호}} \\
            \underbrace{\mathrm{net}(a,b,\ell)}_{\text{논리 link의 subnet}} &= 10.\underbrace{o_2}_{\text{node pair}}.\underbrace{\ell}_{\text{link 번호}}.0/30 \\
            \underbrace{h_a}_{\text{작은 node의 host}} &= .1,\qquad \underbrace{h_b}_{\text{큰 node의 host}}=.2
          \end{aligned}`}
          operations={[
            { expression: String.raw`100+10a+b`, annotation: ["정렬한 두 node 번호를 둘째 octet 하나에 넣습니다."] },
            { expression: String.raw`10.o_2.\ell.0/30`, annotation: ["node pair와 논리 link 번호를 합쳐 /30 segment 하나를 만듭니다."] },
            { expression: String.raw`h_a=.1,\ h_b=.2`, annotation: ["작은 node에는 첫 host를, 큰 node에는 둘째 host를 줍니다."] },
          ]}
          terms={[
            { symbol: "a,b", name: "sorted node IDs", description: "a<b가 되도록 정렬한 1–8 범위의 두 server 번호입니다." },
            { symbol: "\\ell", name: "logical link index", description: "같은 물리 cable에서 split된 두 400G path를 구분하는 1 또는 2입니다." },
            { symbol: "o_2", name: "second octet", description: "Node pair identity를 사람이 읽을 수 있게 담는 IPv4 두 번째 octet입니다." },
            { symbol: "/30", name: "point-to-point prefix", description: "Network·두 host·broadcast의 네 주소를 갖는 subnet입니다." },
          ]}
          assumptions={[
            "Node ID는 1–8이고 a<b로 정렬하며 link index와 octet 범위를 validator가 검사합니다.",
            "물리 cable 하나가 두 logical link를 만들며 각 link에 서로 다른 /30을 줍니다.",
            "주소 규칙과 interface mapping은 같은 manifest revision에서 생성합니다.",
          ]}
          interpretation="Node 3↔7의 두 logical link는 10.137.1.0/30과 10.137.2.0/30입니다. Node 3은 .1, node 7은 .2를 사용하며 방향을 바꿔 입력해도 같은 두 subnet이 나와야 합니다."
        />
        <p className="leading-7">
          고정 사례에서 a=3, b=7이므로 둘째 octet은 100+30+7=137입니다.
          첫 logical link는 <code>10.137.1.0/30</code>, 둘째는
          <code>10.137.2.0/30</code>입니다. Node 3은 각 subnet의 .1, node 7은
          .2를 사용합니다. 이 규칙은 1–8번 node와 link index 1–2를 가정하므로
          validator가 범위를 제한해야 합니다.
        </p>
        <div
          data-viz="switchless-manifest-contract"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          {[
            ["물리 입력", "node pair · 양쪽 OSFP · cable serial", "중복 edge와 port 재사용을 거부"],
            ["논리 결합", "PF · netdev · RDMA device · link 1/2", "현재 host inventory와 일치하는지 확인"],
            ["주소 생성", "논리 link별 /30 · MTU · link-up 명령", "양 끝이 같은 prefix이고 host가 .1/.2인지 확인"],
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
          <code>{`# node3 logical link 1 — 실제 interface는 inventory에서 resolve
ip link set <netdev> up mtu 9000
ip addr flush dev <netdev>
ip addr add 10.137.1.1/30 dev <netdev>

# 검증: 양끝에 정확히 하나의 peer route만 있어야 함
ip -br addr show dev <netdev>
ping -I <netdev> 10.137.1.2`}</code>
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
