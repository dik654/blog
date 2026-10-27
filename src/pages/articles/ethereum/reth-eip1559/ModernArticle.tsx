import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import RethEip1559Locator, {
  RethEip1559MapReturn,
} from "./RethEip1559Locator";
import { rethEip1559V281Tree } from "./fileTree";
import {
  RETH_EIP1559_PROJECT_META,
  rethEip1559CodeRefs,
} from "./modernCodeRefs";
import RethEip1559FlowViz from "./viz/RethEip1559FlowViz";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethEip1559Locator current="reth-eip1559" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            지난 블록의 사용량은 어떻게 다음 블록의 가격이 되고, Alice의 수수료는 어디로 나뉩니까?
          </h2>
        </div>
        <RethEip1559FlowViz />
        <p className="text-lg leading-8">
          설명용 parent block의 gas limit은 30,000,000, gas used는
          18,000,000, base fee는 20 gwei입니다. Alice는 max fee 40 gwei와
          priority cap 3 gwei를 제시하고 실제로 25,000 gas를 사용합니다. 이
          숫자는 메커니즘을 끝까지 추적하기 위한 고정 예시이며 현재 네트워크나
          Reth 기본값을 뜻하지 않습니다.
        </p>
        <p>
          EIP-1559에는 서로 다른 두 계산이 있습니다. Block 가격인 base fee는
          parent header와 chain parameter만으로 결정됩니다. 개별 거래의
          effective tip과 실제 지불액은 그 base fee가 정해진 뒤 거래 cap과 actual
          gas used를 적용해 계산합니다. Mempool 혼잡도와 Alice의 max fee가 다음
          base fee 공식에 직접 들어가는 것은 아닙니다.
        </p>
      </section>

      <section id="base-fee" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Parent가 target보다 많이 썼으므로 다음 base fee가 20.5 gwei로 오릅니다
        </h2>
        <ExplainedFormula
          question="Gas limit 30M, used 18M, parent base fee 20 gwei이면 다음 base fee는 얼마입니까?"
          idea="Gas limit을 elasticity로 나눈 target과 parent 사용량을 비교합니다. Mainnet 예시에서는 편차 비율을 denominator 8로 완화하고 정수 wei 단위로 계산합니다."
          formula={String.raw`\begin{aligned}T&=L_p/E=15{,}000{,}000\\[2pt]\Delta&=\max\!\bigl(\lfloor\frac{B_p(U_p-T)}{T D}\rfloor,1\ \mathrm{wei}\bigr)\\&=0.5\ \mathrm{gwei}\\[2pt]B_n&=B_p+\Delta=20.5\ \mathrm{gwei}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}T&=\underbrace{L_p/E}_{\text{30M ÷ 2}}=15M\\[2pt]\Delta&=\max\!\bigl(\lfloor\underbrace{\frac{B_p(U_p-T)}{T D}}_{\text{20 gwei × 3M ÷ 15M ÷ 8}}\rfloor,1\ \mathrm{wei}\bigr)\\&=0.5\ \mathrm{gwei}\\[2pt]B_n&=\underbrace{B_p+\Delta}_{\text{다음 header 값}}=20.5\ \mathrm{gwei}\end{aligned}`}
          operations={[
            {
              expression: String.raw`L_p/E`,
              annotation: [
                "Parent gas limit 30M을 elasticity 2로 나눕니다.",
                "Target은 15M gas입니다.",
              ],
            },
            {
              expression: String.raw`(U_p-T)/T`,
              annotation: [
                "18M−15M은 3M입니다.",
                "Target보다 20% 많이 사용했습니다.",
              ],
            },
            {
              expression: String.raw`B_p(U_p-T)/(TD)`,
              annotation: [
                "20%를 denominator 8로 완화하면 2.5%입니다.",
                "20 gwei의 2.5%는 0.5 gwei입니다.",
              ],
            },
          ]}
          terms={[
            { symbol: "L_p", name: "Parent gas limit", description: "Parent header의 gas limit입니다." },
            { symbol: "U_p", name: "Parent gas used", description: "Parent가 실제 사용한 gas입니다." },
            { symbol: "E", name: "Elasticity", description: "Gas limit에서 target을 만드는 chain parameter입니다." },
            { symbol: "D", name: "Max change denominator", description: "Block 간 변화 속도를 제한하는 chain parameter입니다." },
            { symbol: "B_p,B_n", name: "Parent·next base fee", description: "각각 parent와 다음 block의 wei/gas 가격입니다." },
          ]}
          assumptions={[
            "Mainnet 예시의 elasticity 2와 denominator 8을 사용합니다.",
            "London 이후 parent에서 다음 block을 계산하는 정상 increase branch입니다.",
            "연산은 정수 wei 단위이며 중간 곱은 충분히 넓은 정수 범위에서 수행합니다.",
          ]}
          interpretation="Parent는 target보다 20% 붐볐고 변화율을 8로 완화하므로 base fee가 2.5% 오릅니다. 사용량이 target과 같으면 그대로이며, 미달이면 별도 감소 분기를 사용합니다. 증가분이 정수 버림으로 0이 될 때만 최소 1 wei를 더합니다."
        />
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[46rem] border-collapse text-left text-xs leading-5">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-3 py-3">Parent 사용량</th>
                <th className="px-3 py-3">분기</th>
                <th className="px-3 py-3">정수 규칙</th>
                <th className="px-3 py-3">다음 base fee</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Uₚ > T", "증가", "계산값과 1 wei 중 큰 값", "Bₚ + Δ"],
                ["Uₚ = T", "유지", "추가 연산 없음", "Bₚ"],
                ["Uₚ < T", "감소", "버림 뒤 saturating subtraction", "Bₚ − Δ"],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-border">
                  {row.map((cell) => (
                    <td key={cell} className="px-3 py-3">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Mainnet에서 gas used가 최대 2T일 때 비율상 상승폭은 12.5%이고,
          사용량이 0일 때 감소폭도 12.5%입니다. 다만 작은 base fee에서는 증가
          분기의 최소 1 wei 규칙 때문에 단순 백분율만으로 설명하면 안 됩니다.
          Custom chain은 2와 8이 아닌 값을 사용할 수 있으므로 실제 ChainSpec을
          확인해야 합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() =>
              sidebar.open(
                "base-fee-calculation",
                rethEip1559CodeRefs["base-fee-calculation"],
              )
            }
          />
          <span className="text-xs text-muted-foreground">
            alloy-eips v2.5.0 · 실제 increase/equal/decrease 분기
          </span>
        </div>
      </section>

      <section id="transaction-fee" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          거래 cap 안에서 tip을 정한 뒤 actual gas used로 burn과 수익을 나눕니다
        </h2>
        <ExplainedFormula
          question="Alice의 25,000 gas 사용분 가운데 얼마가 burn되고 얼마가 beneficiary에게 갑니까?"
          idea="Max fee는 총 per-gas 가격의 상한이고 priority cap은 tip의 상한입니다. Base fee를 감당한 뒤 남은 cap과 priority cap 중 작은 값을 effective tip으로 사용합니다."
          formula={String.raw`\begin{aligned}P_e&=\min(P_m,F_m-B)=3\ \mathrm{gwei/gas}\\C_b&=BU=512{,}500\ \mathrm{gwei}\\C_t&=P_eU=75{,}000\ \mathrm{gwei}\\C&=C_b+C_t=587{,}500\ \mathrm{gwei}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}P_e&=\underbrace{\min(P_m,F_m-B)}_{\text{min(3, 40−20.5)}}=3\\C_b&=\underbrace{BU}_{\text{base fee burn}}=512{,}500\\C_t&=\underbrace{P_eU}_{\text{beneficiary tip}}=75{,}000\\C&=\underbrace{C_b+C_t}_{\text{Alice의 execution fee}}=587{,}500\ \mathrm{gwei}\end{aligned}`}
          operations={[
            { expression: String.raw`F_m-B`, annotation: ["40−20.5=19.5 gwei/gas", "Base fee를 낸 뒤 남은 cap입니다."] },
            { expression: String.raw`\min(P_m,F_m-B)`, annotation: ["Priority cap 3과 남은 cap 19.5를 비교합니다.", "Effective tip은 3 gwei/gas입니다."] },
            { expression: String.raw`U(B+P_e)`, annotation: ["Actual gas used 25,000을 곱합니다.", "총 0.0005875 ETH입니다."] },
          ]}
          terms={[
            { symbol: "F_m", name: "Max fee", description: "Sender가 허용한 총 per-gas 가격 상한입니다." },
            { symbol: "P_m", name: "Priority cap", description: "Sender가 허용한 tip 상한입니다." },
            { symbol: "P_e", name: "Effective tip", description: "현재 base fee에서 실제 beneficiary에게 귀속되는 per-gas tip입니다." },
            { symbol: "U", name: "Actual gas used", description: "Receipt에서 확정되는 실제 사용량입니다." },
          ]}
          assumptions={[
            "Max fee 40 gwei가 current base fee 20.5 gwei 이상입니다.",
            "Blob fee와 value transfer는 이 execution-gas 예시에서 제외합니다.",
            "Tip은 후보 정렬의 한 입력일 뿐 block 포함을 보장하지 않습니다.",
          ]}
          interpretation="Alice는 max fee 40 gwei 전액을 내지 않습니다. 실제 per-gas 가격은 23.5 gwei이며, actual gas used 25,000에 곱한 587,500 gwei를 냅니다. 그중 512,500 gwei는 burn되고 75,000 gwei는 beneficiary 몫입니다."
        />
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Fₘ < B", "현재 block에서 실행 불가", "음수 tip을 만들지 않음"],
            ["Fₘ = B", "Effective tip 0 가능", "Base fee만 지불"],
            ["Fₘ > B", "min(Pₘ, Fₘ−B)", "두 cap을 모두 지킴"],
          ].map(([title, body, note]) => (
            <div key={title} className="bg-background p-4">
              <strong className="font-mono text-sm text-primary">{title}</strong>
              <p className="mt-2 text-xs leading-5">{body}</p>
              <p className="mt-2 text-[10px] leading-4 text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() =>
              sidebar.open("effective-tip", rethEip1559CodeRefs["effective-tip"])
            }
          />
          <span className="text-xs text-muted-foreground">
            alloy-consensus v2.5.0 · fee eligibility와 effective tip
          </span>
        </div>
      </section>

      <section id="implementation" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Reth가 계수를 고르고 Alloy가 계산하며 세 실행 경로가 같은 값을 소비합니다
        </h2>
        <div className="not-prose grid gap-px bg-border p-px text-sm leading-6 lg:grid-cols-5">
          {[
            ["ChainSpec", "Timestamp·fork에 맞는 elasticity와 denominator"],
            ["Alloy EIPs", "Parent header에서 next base fee 정수 계산"],
            ["Payload", "다음 block EVM 환경의 base fee"],
            ["Consensus", "수신 header와 expected base fee 비교"],
            ["TxPool", "다음 block fee eligibility 재분류"],
          ].map(([title, body], index) => (
            <div key={title} className="bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-2 block text-sm">{title}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          Reth v2.8.1은 base-fee 공식을 자체 합성 함수 하나에 복사하지 않습니다.
          <code>EthChainSpec</code>이 target timestamp의 parameter를 고르고 parent
          header의 Alloy helper를 호출합니다. Reth의 Cargo.lock은 이 release에서
          <code>alloy-eips</code>와 <code>alloy-consensus</code> v2.5.0을 고정합니다.
          따라서 Reth와 Alloy version을 함께 기록해야 같은 계산을 재현할 수 있습니다.
        </p>
        <p>
          이 값의 최종 정본은 canonical header입니다. Payload builder는 후보를
          만들고 consensus validator는 수신 header를 판정하며 TxPool은 로컬 거래
          분류에 사용합니다. 같은 helper를 호출한다고 세 구성요소가 같은 상태를
          소유하는 것은 아닙니다. 한 경로만 다른 parameter나 timestamp를 쓰면 후보
          작성, 검증, pool 분류가 서로 어긋날 수 있습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() => sidebar.open("chain-params", rethEip1559CodeRefs["chain-params"])}
          />
          <span className="text-xs text-muted-foreground">Reth ChainSpec→Alloy 경계</span>
          <CodeViewButton
            onClick={() =>
              sidebar.open("header-validation", rethEip1559CodeRefs["header-validation"])
            }
          />
          <span className="text-xs text-muted-foreground">London 전환과 header 검증</span>
          <CodeViewButton
            onClick={() =>
              sidebar.open("shared-consumers", rethEip1559CodeRefs["shared-consumers"])
            }
          />
          <span className="text-xs text-muted-foreground">Payload·TxPool 소비 지점</span>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          합의 규칙과 선택한 구현 snapshot을 구분합니다
        </h2>
        <div id="paper-eip1559-spec" className="scroll-mt-24">
          <CitationBlock
            source="EIP-1559 · Ethereum fee market change"
            citeKey={1}
            href="https://eips.ethereum.org/EIPS/eip-1559"
          >
            <p><b>확인한 범위:</b> Base fee header transition, type-2 transaction cap, burn과 beneficiary tip의 protocol semantics입니다.</p>
            <p><b>확대하지 않은 범위:</b> Reth crate 구조, TxPool ordering, wallet fee estimate나 custom chain parameter를 규정하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-reth-eip1559-source" className="scroll-mt-24 space-y-5">
          <CitationBlock
            source="Reth v2.8.1 · d763342fa185"
            citeKey={2}
            type="code"
            href="https://github.com/paradigmxyz/reth/releases/tag/v2.8.1"
          >
            <p><b>확인한 범위:</b> 이 글에서 고정한 Reth release, ChainSpec 호출과 header validation 소비 경계입니다.</p>
            <p><b>주의:</b> Moving main이나 다른 release의 crate 경로와 의존 version을 일반화하지 않습니다.</p>
          </CitationBlock>
          <CitationBlock
            source="Alloy v2.5.0 · EIP-1559 helpers and Transaction trait"
            citeKey={3}
            type="code"
            href="https://github.com/alloy-rs/alloy/tree/v2.5.0/crates/eips/src/eip1559"
          >
            <p><b>확인한 범위:</b> Reth v2.8.1 Cargo.lock이 고정한 base-fee 정수 계산과 effective-tip 계약입니다.</p>
            <p><b>주의:</b> 공식 구현의 존재는 대상 환경의 성능이나 변경 안전성을 증명하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section className="not-prose border-y border-border py-5" aria-labelledby="reth-eip1559-review">
        <p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p>
        <h2 id="reth-eip1559-review" className="mt-2 text-xl font-bold">
          Parent 사용량에서 Alice의 총 수수료까지 네 문장으로 설명해 보세요
        </h2>
        <ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-4">
          {[
            ["01 · Target", "30M limit에서 target은 왜 15M입니까?"],
            ["02 · Price", "18M 사용으로 왜 20.5 gwei가 됩니까?"],
            ["03 · Tip", "40·3·20.5에서 왜 tip은 3입니까?"],
            ["04 · Owner", "ChainSpec·Alloy·validator는 무엇을 각각 맡습니까?"],
          ].map(([title, body]) => (
            <li key={title} className="bg-background p-4">
              <strong className="block text-xs text-primary">{title}</strong>
              <span className="mt-2 block">{body}</span>
            </li>
          ))}
        </ol>
      </section>

      <RethEip1559MapReturn current="reth-eip1559" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={rethEip1559CodeRefs}
        fileTrees={{ reth: rethEip1559V281Tree }}
        projectMetas={RETH_EIP1559_PROJECT_META}
      />
    </article>
  );
}
