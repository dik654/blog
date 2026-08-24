import {
  B300_SWITCHLESS_SOURCE_LINKS,
  SWITCHLESS_REQUIRED_ENV,
} from "@/content/b300-switchless-network";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function Nccl() {
  return (
    <section id="nccl" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        NCCL은 remote peer에 맞는 local GID를 골라야 한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          일반 switched fabric에서는 한 NIC의 routable GID를 고르면 여러 peer에
          닿는다. 여기서는 노드 쌍마다 독립 `/30`이므로 local preference만으로
          GID를 고르면 실제 cable의 반대편이 아닌 subnet을 선택해 QP 생성이
          실패할 수 있다.
        </p>
        <div id="peer-aware-gid-selection" className="scroll-mt-24">
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3 text-sm">
          {[
            "remote GID에서 IPv4 추출",
            "local GID table에서 같은 /30 검색",
            "sender·receiver가 해당 GID로 QP 생성",
          ].map((item, index) => (
            <div key={item} className="rounded-lg border bg-card p-4">
              <span className="text-xs font-bold text-primary">
                {index + 1}
              </span>
              <p className="mt-2">{item}</p>
            </div>
          ))}
        </div>
        </div>
        <p className="leading-7">
          공개 Sionic patch는 `NCCL_IB_SWITCHLESS=1`일 때 이 peer-aware 재선택을
          추가한다. 다만 patch의 기본 prefix는 `/16`이다. 같은 node pair에 여러
          `/30` direct link가 있으면 `/16`은 특정 cable을 구분하지 못하므로 이
          글의 주소 계약에서는 반드시 `/30`을 명시한다.
        </p>
        <ExplainedFormula
          question="Remote peer에 닿는 local RoCE v2 GID를 어떤 조건으로 고르는가?"
          idea={
            <p>
              Remote GID와 local GID에서 IPv4 주소를 복원한 뒤 RoCE version과
              /30 network prefix가 모두 같은 local entry만 후보로 남깁니다. 공개
              patch는 GID table을 순회해 첫 후보의 index를 사용합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            \mathcal N_{30}(x) &= \mathrm{net}_{30}(ip(x)) \\
            g\in\mathcal C(r)\quad &\Longleftrightarrow\quad v(g)=v(r)=2 \\
            &\land\ \mathcal N_{30}(g)=\mathcal N_{30}(r) \\
            g^* &= \operatorname{first}(\mathcal C(r))
          \end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
            \mathcal N_{30}(x) &= \underbrace{\mathrm{net}_{30}(ip(x))}_{\text{오른쪽 항으로 결과 계산}} \\
            g\in\mathcal C(r)\quad &\Longleftrightarrow\quad v(g)=\underbrace{v(r)=2}_{\text{matching candidates 계산}} \\
            &\land\ \mathcal N_{30}(g)=\underbrace{\mathcal N_{30}(r)}_{\text{판정 조건 결합}} \\
            g^* &= \operatorname{first}(\mathcal C(r))
          \end{aligned}`}
          operations={[
            { expression: String.raw`\mathrm{net}_{30}(ip(x))`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Remote GID와 local GID에서 IPv4 주소를","복원한 뒤 RoCE version과 /30 network","prefix가 모두 같은 local entry만 후보로"] },
            { expression: String.raw`v(r)=2`, annotation: ["matching candidates이(가) 식의 결과에","기여하는 방식을 계산합니다.","Remote GID와 local GID에서 IPv4 주소를","복원한 뒤 RoCE version과 /30 network"] },
            { expression: String.raw`\mathcal N_{30}(r)`, annotation: ["remote GID이(가) 식의 결과에 기여하는 방식을","계산합니다.","Remote GID와 local GID에서 IPv4 주소를","복원한 뒤 RoCE version과 /30 network"] },
          ]}
          terms={[
            { symbol: "r", name: "remote GID", description: "QP를 연결하려는 peer가 교환한 remote RoCE GID입니다." },
            { symbol: "g", name: "local GID entry", description: "현재 HCA port의 GID table에서 검사 중인 local entry입니다." },
            { symbol: "v(\\cdot)", name: "RoCE version", description: "이 구성에서 IPv4-mapped UDP/IP path인 RoCE v2인지 나타냅니다." },
            { symbol: "\\mathcal N_{30}(\\cdot)", name: "/30 network prefix", description: "GID에서 복원한 IPv4 주소에 /30 mask를 적용한 network identity입니다." },
            { symbol: "\\mathcal C(r)", name: "matching candidates", description: "Remote와 같은 /30에 속하는 local RoCE v2 GID 집합입니다." },
          ]}
          assumptions={[
            "Netdev IP가 GID table에 반영됐고 local·remote IPv4 byte order를 동일하게 해석합니다.",
            "각 direct cable에 고유한 /30을 배정해 matching candidate가 정확히 하나가 되게 합니다.",
            "Prefix 환경 변수와 topology manifest가 같은 revision을 사용합니다.",
          ]}
          interpretation="기본 /16을 쓰면 같은 node pair의 여러 cable이 같은 candidate 집합에 들어갈 수 있습니다. /30은 candidate를 cable 하나로 좁혀 first-match 구현이 의도한 path를 고르게 합니다."
        />
        <h3 id="nccl-rail-contract" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          GID 선택과 HCA·rail 선택은 서로 다른 단계다
        </h3>
        <div
          data-viz="switchless-nccl-env-ledger"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          <div className="hidden grid-cols-[15rem_5rem_1fr] gap-4 border-b bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>환경 변수</span><span>값</span><span>역할</span>
          </div>
          <div className="divide-y divide-border/70">
            {SWITCHLESS_REQUIRED_ENV.map(([name, value, role]) => (
              <article key={name} className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[15rem_5rem_1fr] md:gap-4">
                <div className="min-w-0"><span className="text-[11px] font-semibold text-muted-foreground md:hidden">환경 변수</span><p className="break-all font-mono text-sm font-semibold">{name}</p></div>
                <div><span className="text-[11px] font-semibold text-muted-foreground md:hidden">값</span><p className="font-mono text-sm">{value}</p></div>
                <div className="min-w-0"><span className="text-[11px] font-semibold text-muted-foreground md:hidden">역할</span><p className="break-words text-sm text-muted-foreground">{role}</p></div>
              </article>
            ))}
          </div>
        </div>
        <p className="leading-7">
          `NCCL_IB_HCA` allowlist에는 NCCL 문서가 권장하는 exact-match prefix
          `=`를 써서 `mlx5_1`이 `mlx5_10`까지 우연히 선택하지 않게 한다.
          `NCCL_CROSS_NIC=0`도 “연결되지 않은 NIC를 차단”하는 옵션이 아니라 같은
          ring/tree에서 rail을 유지하는 topology 선택이다.
        </p>
        <div id="paper-switchless-patch" className="scroll-mt-24">
          <CitationBlock source={B300_SWITCHLESS_SOURCE_LINKS.patch.label} citeKey={4} type="code" href={B300_SWITCHLESS_SOURCE_LINKS.patch.href}>
            Patch는 remote IPv4 subnet과 같은 local GID를 sender·receiver 양쪽에서
            다시 찾는다. 기본 prefix가 /16이고 허용 범위는 /8–/30이므로 이 글의
            /30 manifest와 함께 사용해야 한다. 이 코드는 특정 NCCL revision에
            대한 project patch이며 upstream NCCL의 일반 보장은 아니다.
          </CitationBlock>
        </div>
        <div id="paper-nccl-env" className="scroll-mt-24">
          <CitationBlock source={B300_SWITCHLESS_SOURCE_LINKS.nccl.label} citeKey={5} href={B300_SWITCHLESS_SOURCE_LINKS.nccl.href}>
            NCCL_IB_HCA는 prefix match를 사용하므로 `=` exact-match 형식을 쓸 수
            있고, NCCL_CROSS_NIC=0은 ring/tree에서 같은 NIC rail을 유지하려는
            정책이다. 둘은 peer-aware GID patch를 대신하지 않는다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
