import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import type { ProjectMeta } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import RethEip4844Locator, {
  RethEip4844MapReturn,
} from "../reth-eip4844/RethEip4844Locator";
import BlobFeeCurveChart from "./BlobFeeCurveChart";
import BlobFeeTraceViz from "./BlobFeeTraceViz";
import { codeRefs } from "./codeRefs";
import { eip4844BlobFeeTree } from "./fileTree";

const PROJECT_META: Record<string, ProjectMeta> = {
  "go-ethereum": {
    id: "go-ethereum",
    label: "go-ethereum v1.17.10 · Go",
    badgeClass: "bg-sky-500/10 border-sky-500 text-sky-700",
  },
};

function CodeLink({ codeKey, label, open }: {
  codeKey: keyof typeof codeRefs;
  label: string;
  open: (key: string, ref: (typeof codeRefs)[string]) => void;
}) {
  return (
    <div className="not-prose flex flex-wrap items-center gap-2">
      <CodeViewButton onClick={() => open(codeKey, codeRefs[codeKey])} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function ModernBlobFee() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-20 space-y-5">
        <RethEip4844Locator current="eip4844-blob-fee" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            부모 블록의 Blob 사용량은 어떻게 자식 블록의 가격이 됩니까?
          </h2>
        </div>
        <p className="text-lg leading-8">
          부모 블록이 <strong>excess 2개분</strong>과 <strong>사용량 18개분</strong>을
          남겼다고 하겠습니다. 자식 블록 시각에는 BPO2가 활성화되어 있고 부모의 실행
          기본료는 1 Gwei입니다. 노드는 이 네 값을 읽어 자식 헤더의
          <code>excess_blob_gas</code>와 Blob 기본료를 계산합니다.
        </p>
        <BlobFeeTraceViz />
        <p>
          이 경로에서 가장 중요한 경계는 <strong>부모의 사용량이 부모 자신의 가격을
          바꾸지 않는다</strong>는 점입니다. 부모가 남긴 상태는 자식의 excess가 되고,
          자식의 기본료는 그 자식 헤더의 excess에서 계산됩니다. 자식이 실제로 사용한
          Blob 수는 다시 그다음 블록의 가격 상태에 반영됩니다.
        </p>
        <ContentBoundary article="eip4844-blob-fee" />
      </section>

      <section id="state-ledger" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">헤더에 남는 두 값</h2>
        <p>
          Blob 하나는 131,072 <strong>blob gas</strong>를 사용합니다. Blob gas는 EVM
          실행에 쓰는 execution gas와 이름만 비슷할 뿐 별도의 사용량 장부입니다. 이 글의
          “2개분”은 계산을 읽기 쉽게 줄인 표현이며 실제 헤더에는 262,144처럼 blob gas
          단위의 정수가 들어갑니다.
        </p>
        <TermBreakdown
          title="부모에서 자식으로 넘어가는 상태"
          items={[
            { term: "parent.excess_blob_gas", description: "이전 블록들에서 target을 넘겨 사용한 양을 가격 계산용으로 누적한 상태입니다.", boundary: "미처리 transaction 수나 저장 중인 Blob 파일 수가 아닙니다." },
            { term: "parent.blob_gas_used", description: "부모 블록 안의 Blob transaction이 실제로 사용한 blob gas 합계입니다.", boundary: "부모의 Blob 기본료가 아니라 자식 excess를 갱신하는 입력입니다." },
            { term: "child.excess_blob_gas", description: "부모의 두 값과 자식 시각에 적용되는 설정으로 다시 계산한 결과입니다.", boundary: "제작자가 임의로 정할 수 없으며 모든 검증 노드가 같은 값을 얻어야 합니다." },
            { term: "child Blob base fee", description: "자식 excess를 정수 fake-exponential에 넣어 얻는 1 blob gas당 기본료입니다.", boundary: "Rollup 서비스의 증명·압축·운영비를 합친 최종 고객 가격이 아닙니다." },
          ]}
        />
        <p>
          <strong>target</strong>은 장기적으로 맞추려는 사용량이고 <strong>max</strong>는
          한 블록이 넘을 수 없는 상한입니다. BPO2에서는 target이 14, max가 21이므로
          부모의 사용량 18은 target보다 많지만 상한 이내입니다. “target 초과”만으로 그
          블록이 무효가 되지는 않습니다.
        </p>
      </section>

      <section id="excess-update" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">다음 excess 계산</h2>
        <p>
          현재 메인넷 규칙은 먼저 <code>E+U&lt;T</code>인지 확인합니다. 작으면 자식
          excess는 0입니다. 그렇지 않으면 EIP-7918의 가격 조건을 검사합니다. 이 조건이
          참일 때는 target을 단순히 빼지 않고, max와 target의 차이만큼 사용량을 축소해
          이전 excess에 더합니다.
        </p>
        <ExplainedFormula
          question="부모 E=2·U=18에서 자식 excess가 왜 8개분입니까?"
          idea="부모 실행 기본료 1 Gwei에서는 reserve price가 nominal Blob 가격보다 크므로 EIP-7918 분기를 사용합니다."
          formula={String.raw`E_{child}=E_{parent}+\left\lfloor U_{parent}\frac{M-T}{M}\right\rfloor`}
          annotatedFormula={String.raw`E_{child}=\underbrace{2}_{\text{이전 excess}}+\underbrace{\left\lfloor18\frac{21-14}{21}\right\rfloor}_{\text{현재 사용량에서 더할 6}}=8`}
          operations={[
            { expression: "E+U=2+18=20", annotation: ["20은 target 14보다 크므로", "0을 반환하는 첫 분기는 지나갑니다."] },
            { expression: String.raw`8192\times 10^9 > 131072\times 1`, annotation: ["부모 실행 기본료로 만든 reserve가", "부모 excess의 nominal Blob 가격보다 큽니다."] },
            { expression: String.raw`2+\lfloor18\times7/21\rfloor=8`, annotation: ["사용량에서 6개분만 더해", "자식 excess 8개분을 얻습니다."] },
          ]}
          terms={[
            { symbol: "E", name: "parent excess", description: "가격 상태로 남아 있던 blob gas입니다." },
            { symbol: "U", name: "parent used", description: "부모 블록이 실제 사용한 blob gas입니다." },
            { symbol: "T", name: "target", description: "자식 시각의 BPO2 목표값 14입니다." },
            { symbol: "M", name: "max", description: "자식 시각의 BPO2 상한 21입니다." },
          ]}
          assumptions={[
            "계산은 실제로 2·18·14·21에 각각 131,072를 곱한 blob gas 단위에서 수행합니다.",
            "부모 실행 기본료 1 Gwei와 부모 excess 2개분을 사용해 EIP-7918 조건이 참인 fixture입니다.",
          ]}
          interpretation="옛 EIP-4844 식 E+U−T를 그대로 적용하면 6개분이지만, 현재 fixture는 EIP-7918 분기이므로 8개분입니다. 두 값은 대안 계산이 아니라 서로 다른 활성 규칙의 결과입니다."
        />
        <p>
          EIP-7918 조건이 거짓이면 원래 식 <code>max(0, E+U−T)</code>를 사용합니다.
          부모 실행 기본료를 1 wei로 둔 비교 fixture에서는 reserve 8,192 wei가 한 Blob의
          nominal 가격 131,072 wei보다 작으므로 이 경로가 선택되고 결과는 6개분입니다.
          실제 블록을 분석할 때는 부모 헤더의 실행 기본료와 excess를 함께 읽어야 합니다.
        </p>
        <CodeLink codeKey="calc-excess-blob-gas" label="Geth v1.17.10 · 자식 시각의 설정과 EIP-7918·기존 분기" open={sidebar.open} />
      </section>

      <section id="integer-fee" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">정수 기본료 계산</h2>
        <p>
          자식 excess 8개분은 1,048,576 blob gas입니다. 노드는 이 값을
          <code>fake_exponential(1, 1_048_576, 11_684_671)</code>에 넣습니다. 수학적인
          곡선은 <code>e^(excess/fraction)</code>에 가깝지만 합의 계산은 부동소수점이
          아니라 정수 곱셈과 나눗셈을 반복합니다.
        </p>
        <ExplainedFormula
          question="같은 입력에서 모든 노드가 같은 정수 가격을 얻으려면 어떻게 계산합니까?"
          idea="첫 항을 fraction만큼 키워 시작하고, 앞 항에서 다음 항을 만든 뒤 매 단계의 나머지를 버립니다."
          formula={String.raw`a_0=fd,\quad a_i=\left\lfloor\frac{a_{i-1}n}{d}\right\rfloor\div i,\quad P=\left\lfloor\frac{\sum_i a_i}{d}\right\rfloor`}
          annotatedFormula={String.raw`P=\underbrace{\left\lfloor\frac{a_0+a_1+\cdots}{d}\right\rfloor}_{\text{각 항과 마지막 나눗셈을 모두 정수로 계산}}`}
          operations={[
            { expression: "a₀ = 1 × 11,684,671", annotation: ["최소 가격 1에 update fraction을 곱해", "첫 누적 항을 만듭니다."] },
            { expression: "n = 8 × 131,072", annotation: ["자식 excess 8개분을", "실제 blob gas 단위로 넣습니다."] },
            { expression: "P = 1 wei / blob gas", annotation: ["정수 항을 0이 될 때까지 더해도", "아직 다음 정수 단계인 2에 도달하지 않습니다."] },
          ]}
          terms={[
            { symbol: "f", name: "최소 가격", description: "현재 규칙에서 1 wei/blob gas입니다." },
            { symbol: "n", name: "자식 excess", description: "1,048,576 blob gas입니다." },
            { symbol: "d", name: "update fraction", description: "BPO2 값 11,684,671입니다." },
            { symbol: "P", name: "Blob base fee", description: "자식 블록의 1 blob gas당 정수 기본료입니다." },
          ]}
          assumptions={["음수가 아닌 정수와 양수 fraction을 사용합니다.", "중간 나눗셈을 실수 계산 하나로 합치거나 마지막에만 반올림하지 않습니다."]}
          interpretation="이 fixture의 자식 기본료는 1 wei/blob gas이고 Blob 하나의 프로토콜 요금은 131,072 wei입니다. excess가 8개분으로 늘었지만 정수 가격은 아직 그대로입니다."
        />
        <BlobFeeCurveChart />
        <p>
          로컬에서 Geth와 같은 정수 반복을 실행해 BPO2의 경계를 확인했습니다. excess
          0~61개분은 1, 62개분부터 2, 98개분부터 3 wei/blob gas입니다. 이 경계는 현재
          fraction을 고정한 계산 결과이며, 향후 BPO가 fraction을 바꾸면 다시 계산해야 합니다.
        </p>
        <CodeLink codeKey="calc-blob-fee" label="Geth v1.17.10 · fakeExponential의 정수 항과 종료 조건" open={sidebar.open} />
      </section>

      <section id="schedule" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">설정은 업그레이드마다 달라집니다</h2>
        <p>
          EIP-4844 문서의 target 3·max 6은 Cancun 도입 시점의 값입니다. 현재 메인넷
          값을 설명할 때 그 숫자를 그대로 사용하면 안 됩니다. 자식 블록의 timestamp로
          활성 설정을 고르는 이유가 여기에 있습니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border py-4">
          <table className="w-full min-w-[42rem] text-left text-sm leading-6">
            <thead><tr className="border-b border-border text-xs text-muted-foreground"><th className="px-3 py-2">설정</th><th className="px-3 py-2">Target</th><th className="px-3 py-2">Max</th><th className="px-3 py-2">Update fraction</th><th className="px-3 py-2">이 글에서의 역할</th></tr></thead>
            <tbody>
              {[
                ["Cancun", "3", "6", "3,338,477", "초기 EIP-4844 역사값"],
                ["Prague", "6", "9", "5,007,716", "Pectra 이후 기준"],
                ["BPO1", "10", "15", "8,346,193", "첫 parameter-only 증가"],
                ["BPO2", "14", "21", "11,684,671", "현재 fixture와 메인넷 설정"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-border/70 last:border-b-0">
                  {row.map((cell, index) => <td key={cell} className={`px-3 py-2 ${index === 0 ? "font-bold text-primary" : ""}`}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          네트워크 업그레이드 Fusaka의 실행 계층 규칙인 Osaka에서 EIP-7918이 활성화됐습니다.
          이후 BPO1·BPO2가 Blob 매개변수를 올렸습니다. BPO는 target·max·fraction을 바꾸는
          업그레이드입니다. EIP-7918의 계산 의미와 BPO2의 숫자는 같은 항목이 아니므로
          출처도 따로 확인해야 합니다.
        </p>
      </section>

      <section id="source" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">실제 구현 경로</h2>
        <p>
          보존한 코드는 go-ethereum v1.17.10, commit
          <code>1df30b18d9ed35ee9d28ffd4648442c2204554ad</code>의
          <code>consensus/misc/eip4844/eip4844.go</code>입니다. 이 파일은 이전에 확인한
          commit의 파일과 SHA-256이 같지만, 최신 안정 릴리스 태그에서 다시 내려받아
          바이트 단위로 대조했습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px text-sm leading-6 sm:grid-cols-3">
          {[
            ["1 · CalcExcessBlobGas", "자식 timestamp로 설정을 고르고 부모 E·U를 읽습니다."],
            ["2 · CalcBlobFee", "자식 헤더의 excess와 같은 시각의 fraction으로 기본료를 계산합니다."],
            ["3 · VerifyEIP4844Header", "max·131,072 배수·재계산한 excess 일치를 검사합니다."],
          ].map(([title, description]) => <div key={title} className="bg-background p-4"><strong className="block text-primary">{title}</strong><span className="mt-2 block text-muted-foreground">{description}</span></div>)}
        </div>
        <CodeLink codeKey="verify-header" label="Geth v1.17.10 · Blob 사용량과 자식 excess 재검산" open={sidebar.open} />
        <p>
          이 글에서 직접 실행한 것은 보존한 함수와 같은 정수 recurrence의 fixture
          계산입니다. 전체 Geth node를 동기화하거나 실제 메인넷 블록을 재실행한 측정은
          아닙니다. 따라서 현재 수요나 가격 측정으로 넓히지 않습니다. 실제 수요 분석은
          <Link className="ml-1 underline underline-offset-4" to="/cs/blockchain/robinhood-chain-blob-demand#source">Blob 수요 측정 글</Link>
          에서 블록 데이터를 고정해 따로 다룹니다.
        </p>
      </section>

      <section id="failure-boundaries" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">잘못 읽으면 어디서 실패합니까?</h2>
        <TermBreakdown
          title="계산과 헤더 검증의 다섯 경계"
          items={[
            { term: "부모 시각으로 설정 선택", description: "업그레이드 첫 자식 블록에서 예전 target·max·fraction을 고를 수 있습니다.", boundary: "설정은 계산 대상인 자식 timestamp로 선택합니다." },
            { term: "Blob 개수와 blob gas 혼용", description: "2·18·14를 일부만 131,072배 하면 서로 다른 단위를 더하게 됩니다.", boundary: "실제 함수 입력은 모두 blob gas 단위의 정수입니다." },
            { term: "EIP-7918 분기 생략", description: "현재 fixture에서 8 대신 옛 식의 6을 자식 헤더에 적게 됩니다.", boundary: "검증 노드의 재계산 결과와 다르면 헤더가 거절됩니다." },
            { term: "실수 지수함수로 대체", description: "중간 정수 나눗셈과 overflow 처리 차이로 client마다 다른 가격이 나올 수 있습니다.", boundary: "정수 연산 순서와 충분한 정수 폭을 그대로 보존합니다." },
            { term: "기본료와 총 서비스 가격 혼동", description: "Blob 프로토콜 요금만으로 rollup의 증명·압축·실행·운영 원가를 계산할 수 없습니다.", boundary: "execution gas와 Blob gas는 별도 장부이며 사용자 상품 가격은 서비스 계층의 결정입니다." },
          ]}
        />
        <p>
          Blob transaction의 <code>max_fee_per_blob_gas</code>가 자식 기본료보다 낮으면
          해당 transaction을 유효하게 포함할 수 없습니다. 포함된 transaction의 Blob
          요금은 실행 전에 차감·소각되며 실행이 실패해도 환급되지 않습니다. 다만 이것은
          프로토콜 규칙이고, 서비스가 고객에게 크레딧을 환급하는 정책과는 별개입니다.
        </p>
        <ReviewPrompts questions={[
          "부모 E=2·U=18, BPO2 target 14에서 reserve-price 조건이 참일 때 자식 excess가 8인 이유를 설명하세요.",
          "자식 excess가 8개분으로 늘었는데 기본료가 여전히 1 wei/blob gas일 수 있는 이유를 설명하세요.",
          "자식 블록의 실제 Blob 사용량이 자식 자신의 기본료가 아니라 그다음 블록에 반영되는 경계를 설명하세요.",
        ]} />
      </section>

      <section id="paper-eip4844-fee" className="scroll-mt-20 space-y-5">
        <h2 className="break-keep text-2xl font-bold">근거 범위</h2>
        <CitationBlock citeKey={1} source="EIP-4844 · Blob transaction과 별도 fee market" href="https://eips.ethereum.org/EIPS/eip-4844">
          Blob gas 131,072 단위, 헤더의 <code>blob_gas_used</code>와 <code>excess_blob_gas</code>, 정수 <code>fake_exponential</code>, 요금 차감·소각 규칙을 확인했습니다. target 3·max 6은 Cancun 도입 시점의 역사값으로만 사용합니다.
        </CitationBlock>
        <CitationBlock citeKey={2} source="EIP-7918 · Blob base fee bounded by execution cost" href="https://eips.ethereum.org/EIPS/eip-7918">
          실행 기본료와 nominal Blob 가격을 비교하는 reserve-price 조건과 조건이 참일 때의 excess 갱신식을 확인했습니다. 실제 특정 블록에서 조건이 참이었다는 측정 근거로 사용하지 않습니다.
        </CitationBlock>
        <CitationBlock citeKey={3} source="EIP-8135 · BPO2 mainnet parameters" href="https://eips.ethereum.org/EIPS/eip-8135">
          BPO2 활성 시각 1767747671, target 14, max 21, update fraction 11,684,671을 확인했습니다. 향후 설정에도 같은 숫자가 유지된다는 뜻은 아닙니다.
        </CitationBlock>
        <CitationBlock type="code" citeKey={4} source="go-ethereum v1.17.10 · 1df30b18 · eip4844.go" href="https://github.com/ethereum/go-ethereum/blob/v1.17.10/consensus/misc/eip4844/eip4844.go">
          <p><b>확인한 범위:</b> 자식 timestamp의 설정 선택, EIP-7918·기존 excess 분기, 정수 가격 함수, 헤더 재검산입니다.</p>
          <p><b>고정 조건:</b> v1.17.10 release, BPO2 설정, 이 글의 2·18·14·21·1 Gwei fixture입니다.</p>
          <p><b>실행한 검산:</b> 동일 recurrence로 excess 8의 기본료 1과 정수 가격 경계 62→2, 98→3을 계산했습니다.</p>
          <p><b>확대하지 않은 범위:</b> 전체 node 동기화, 실제 메인넷 block replay, 현재 수요·가격 측정은 수행하지 않았습니다.</p>
        </CitationBlock>
        <RethEip4844MapReturn current="eip4844-blob-fee" />
      </section>

      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={{ "go-ethereum": eip4844BlobFeeTree }} projectMetas={PROJECT_META} />
    </article>
  );
}
