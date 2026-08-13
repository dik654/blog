import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import EthernetFabricViz from "./viz/EthernetFabricViz";

const layers = [
  {
    layer: "MAC rate",
    question: "port가 광고하는 10/25/50/100/200/400/800 Gb/s",
    caveat: "payload goodput과 동일하지 않음",
  },
  {
    layer: "lane·PHY·FEC",
    question: "lane 수·lane rate·encoding·필수 FEC 조합",
    caveat: "양 끝 설정이 다르면 link가 올라오지 않거나 error 증가",
  },
  {
    layer: "module·media",
    question: "DAC·AOC·optic, fiber type·reach·wavelength·polarity",
    caveat: "같은 cage 모양만으로 호환되지 않음",
  },
  {
    layer: "fabric",
    question: "breakout·LAG·ECMP·MTU·oversubscription·routing",
    caveat: "단일 link가 빨라도 uplink와 path가 막힐 수 있음",
  },
];

const media = [
  [
    "DAC",
    "짧은 rack 내부 copper",
    "길이·gauge·bend·switch/NIC support, passive/active 구분",
  ],
  [
    "AOC",
    "중거리의 일체형 optical cable",
    "끝단 module 교체 불가, 정확한 speed·breakout 조합",
  ],
  [
    "pluggable optic",
    "fiber와 transceiver를 분리",
    "wavelength·fiber·reach·connector·FEC·vendor qualification",
  ],
  [
    "breakout",
    "한 고속 port를 여러 저속 lane group으로 분할",
    "switch ASIC·port group·cable fanout·lane mapping",
  ],
];

export default function Ethernet() {
  return (
    <section id="ethernet" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Ethernet 링크와 leaf-spine fabric
      </h2>
      <div className="not-prose mb-8">
        <EthernetFabricViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="ethernet-link-contract" className="scroll-mt-24">
          <p className="leading-7">
          Ethernet 속도 이름은 배선 계약의 한 항목일 뿐이다. NIC와 switch가 같은
          MAC rate를 지원해도 lane·PHY·FEC·module·fiber가 맞지 않으면 연결할 수
          없고, 연결돼도 protocol overhead와 congestion 때문에 application
          goodput은 line rate보다 낮다. 따라서 port 이름만 비교하지 않고 양 끝의
          전체 compatibility chain을 확인한다.
          </p>
        </div>

        <div data-viz="ethernet-link-contract-ledger" className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
          <div className="hidden grid-cols-[0.8fr_1.35fr_1fr] gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>계층</span><span>확인할 계약</span><span>놓치기 쉬운 점</span>
          </div>
          <div className="divide-y divide-border/70">
            {layers.map((row) => (
              <article key={row.layer} className="grid min-w-0 gap-2 px-4 py-4 text-sm md:grid-cols-[0.8fr_1.35fr_1fr] md:gap-3">
                <strong>{row.layer}</strong>
                <p className="min-w-0 break-words leading-6">{row.question}</p>
                <p className="min-w-0 break-words leading-6 text-muted-foreground">{row.caveat}</p>
              </article>
            ))}
          </div>
        </div>

        <h3 id="fabric-oversubscription" className="scroll-mt-24 text-xl font-semibold mt-8 mb-3">
          leaf-spine의 실제 capacity
        </h3>
        <p className="leading-7">
          host-facing port의 합을 leaf uplink 합으로 나눈 oversubscription은
          출발점이고, 실제 결과는 동시에 통신하는 source·destination이 어느
          leaf에 있는지와 ECMP hash가 path를 얼마나 고르게 쓰는지에 달린다. 장애로
          uplink 하나가 빠졌을 때의 비율과 elephant·mice flow가 섞일 때의
          queue도 함께 계산한다. 또한
          필요하면 workload placement를 fabric topology에 맞춰 cross-leaf
          traffic 자체를 줄인다.
        </p>
        <ExplainedFormula
          question="Leaf에 host-facing bandwidth가 많아도 uplink가 부족한 상태를 어떻게 수치로 나타내는가?"
          idea={
            <p>
              동시에 fabric을 향할 수 있는 host port 용량의 합을 현재 살아 있는
              uplink 용량의 합으로 나눕니다. 정상 상태와 한 uplink가 빠진 실패
              상태를 따로 계산해야 장애 순간의 병목을 볼 수 있습니다.
            </p>
          }
          formula={String.raw`\rho_{\mathrm{os}}=\frac{\sum_i C_{\mathrm{host},i}}{\sum_{j\in A}C_{\mathrm{uplink},j}}`}
          terms={[
            { symbol: "C_{\\mathrm{host},i}", name: "host-facing capacity", description: "Leaf에 연결된 i번째 endpoint link의 단방향 line capacity입니다." },
            { symbol: "A", name: "active uplink set", description: "현재 실제로 forwarding할 수 있는 uplink들의 집합입니다." },
            { symbol: "C_{\\mathrm{uplink},j}", name: "uplink capacity", description: "j번째 활성 uplink의 단방향 capacity입니다." },
            { symbol: "\\rho_{\\mathrm{os}}", name: "oversubscription ratio", description: "1보다 크면 모든 host가 동시에 최대 속도로 fabric을 사용할 수 없습니다." },
          ]}
          assumptions={[
            "모든 capacity는 같은 방향·같은 bit/s 단위입니다.",
            "ECMP가 path를 완전히 균등하게 쓰는 이상적 aggregate를 먼저 계산합니다.",
            "실제 승인은 traffic matrix·hash imbalance·queue·failure state를 별도로 측정합니다.",
          ]}
          interpretation="ρ=2라면 최악의 동시 전송에서 host가 요구할 수 있는 용량이 uplink의 두 배입니다. 다만 실제 workload가 절반만 fabric을 향하면 곧바로 50% 성능이라는 뜻은 아닙니다."
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          cable BOM도 software BOM처럼 고정한다
        </h3>
        <div data-viz="ethernet-media-qualification-ledger" className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
          <div className="hidden grid-cols-[0.7fr_1fr_1.7fr] gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>매체</span><span>주요 역할</span><span>qualification</span>
          </div>
          <div className="divide-y divide-border/70">
            {media.map(([type, role, qualification]) => (
              <article key={type} className="grid min-w-0 gap-2 px-4 py-4 text-sm md:grid-cols-[0.7fr_1fr_1.7fr] md:gap-3">
                <strong>{type}</strong>
                <p className="min-w-0 break-words leading-6">{role}</p>
                <p className="min-w-0 break-words leading-6 text-muted-foreground">{qualification}</p>
              </article>
            ))}
          </div>
        </div>

        <p className="leading-7">
          가동 후에는 link up만 보지 않고 corrected/uncorrected FEC, CRC, symbol
          error, flap, drop, queue와 optical power를 기준선과 비교함. error가
          증가하면 cable·optic·port를 한 번에 바꾸지 말고 한 요소씩 교체해
          원인을 좁힌다.
        </p>

        <CitationBlock
          source="IEEE 802.3 — Completed Task Force Archive"
          citeKey={3}
          href="https://www.ieee802.org/3/archive.html"
        >
          10·25·40·50·100·200·400 Gb/s가 서로 다른 PHY·media amendment로
          발전했음을 보여 주어 speed와 물리 규격을 함께 확인해야 하는 근거를
          제공한다.
        </CitationBlock>
        <CitationBlock
          source="IEEE 802.3 — Active Ethernet Projects"
          citeKey={4}
          href="https://www.ieee802.org/3/index.html"
        >
          800 Gb/s와 1.6 Tb/s를 포함한 일부 차세대 규격이 진행 중인 project일 수
          있으므로 구매 시 표준 상태와 제품 지원을 별도로 확인해야 한다.
        </CitationBlock>
      </div>
    </section>
  );
}
