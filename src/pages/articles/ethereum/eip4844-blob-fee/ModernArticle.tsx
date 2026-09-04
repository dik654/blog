import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { BlobFeeFeedbackViz } from "../reth-eip4844/viz/ModernEip4844Viz";
import BlobFeeCurveChart from "./BlobFeeCurveChart";
import { codeRefs } from "./codeRefs";
import { eip4844BlobFeeTree } from "./fileTree";

const EIP_4844 = "https://eips.ethereum.org/EIPS/eip-4844";
const RETH_PROJECT_META = {
  reth: { id: "reth", label: "Reth · Rust", badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700" },
};

export default function ModernBlobFee() {
  const sidebar = useCodeSidebar();
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Blob 수요만 따로 가격에 되먹이기</p><h2 className="text-3xl font-bold tracking-tight">Blob fee는 execution gas와 분리된 수요 원장을 읽습니다</h2></header>
      <p className="text-lg leading-8 text-foreground/90"><strong>Blob gas</strong>는 blob data 사용량을 세는 단위입니다. EVM instruction의 execution gas와 이름은 비슷하지만 같은 장부가 아닙니다. Parent block이 남긴 excess와 이번 사용량을 target과 비교해 다음 block의 price state를 만듭니다.</p>
      <TermBreakdown title="Fee feedback의 세 입력과 한 출력" items={[
        { term: "Parent excess E", description: "이전 block까지 target을 넘긴 수요가 누적된 blob-gas state입니다." },
        { term: "Parent usage U", description: "이전 block이 실제로 소비한 blob gas입니다.", boundary: "Execution gasUsed와 더하지 않습니다." },
        { term: "Active target T", description: "Parent timestamp의 활성 fork parameter가 정한 block당 목표 blob gas입니다.", boundary: "한 숫자를 모든 fork에 고정하지 않습니다." },
        { term: "Next excess E′", description: "다음 block의 blob base fee가 읽을 새 수요 state입니다." },
      ]} />
      <BlobFeeFeedbackViz />
      <ContentBoundary article="eip4844-blob-fee" />
    </section>
    <section id="excess-update" className="space-y-6">
      <h2 className="text-2xl font-bold">더한 뒤 target을 빼고, 음수 debt는 버립니다</h2>
      <ExplainedFormula question="Parent excess 2, usage 5, target 3이면 왜 다음 excess가 4인가요?" idea={<p>먼저 기존 excess와 이번 사용량을 합쳐 pressure를 만들고 target capacity를 차감합니다. 남는 값이 음수면 0에서 멈춥니다.</p>} formula={String.raw`E_{n+1}=\max(0,E_n+U_n-T_n)`} annotatedFormula={String.raw`\begin{aligned}P_n&=\underbrace{E_n+U_n}_{\text{기존 초과분에 이번 blob 사용량을 더함}}\\R_n&=\underbrace{P_n-T_n}_{\text{이번 block이 흡수할 target capacity를 차감}}\\E_{n+1}&=\underbrace{\max(0,R_n)}_{\text{남는 pressure만 보존하고 음수 debt는 0으로 제한}}
\end{aligned}`} operations={[
        { expression: String.raw`E_n+U_n`, annotation: ["누적 excess와 현재 usage를 더해", "target 차감 전 pressure를 생성"] },
        { expression: String.raw`P_n-T_n`, annotation: ["활성 fork target을 빼서", "capacity 초과분을 계산"] },
        { expression: String.raw`\max(0,R_n)`, annotation: ["0과 residual 중 큰 값을 골라", "negative excess를 차단"] },
      ]} terms={[
        { symbol: String.raw`E_n`, name: "Parent excess", description: "Parent header의 excess blob gas입니다." },
        { symbol: String.raw`U_n`, name: "Parent usage", description: "Parent block의 blob gas used입니다." },
        { symbol: String.raw`T_n`, name: "Active target", description: "Parent timestamp에서 활성인 target blob gas입니다." },
      ]} assumptions={["E·U·T는 같은 blob-gas 단위입니다.", "Target은 활성 fork configuration에서 읽습니다.", "Arithmetic overflow와 fork transition을 consensus 규칙대로 처리합니다."]} interpretation="2+5−3=4입니다. 반대로 2+0−3=−1이면 max가 0을 골라 다음 excess는 0입니다." />
      <div className="not-prose flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => sidebar.open("calc-excess-blob-gas", codeRefs["calc-excess-blob-gas"])} />
        <span className="text-xs text-muted-foreground">calc_excess_blob_gas() — max(0, E+U−T)의 실제 구현</span>
      </div>
    </section>
    <section id="integer-fee" className="space-y-6">
      <h2 className="text-2xl font-bold">정수 fake-exponential은 client마다 같은 price를 만들기 위한 계산법입니다</h2>
      <p>
            다음 blob base fee는 excess가 커질수록 증가합니다. 규격은 consensus client가 서로 다른 floating-point rounding을 내지 않도록
            정수 항을 반복해 더하는 결정론적 근사를 사용합니다. 이것은 “가짜 가격”이라는 뜻이 아니라 exponential 형태를 integer arithmetic으로 재현한다는
            이름입니다.
          </p>
      <TermBreakdown title="Price 계산에서 구분할 것" items={[
        { term: "Consensus input", description: "Header에 기록된 excess와 fork parameter입니다." },
        { term: "Integer recurrence", description: "정해진 순서와 rounding으로 항을 더하는 계산입니다." },
        { term: "Blob base fee", description: "Blob gas 한 단위의 protocol minimum price입니다." },
        { term: "Rollup total cost", description: "Compression, execution, proving, posting을 모두 포함한 별도 비용입니다.", boundary: "Blob base fee 감소를 총비용의 같은 비율 감소로 읽지 않습니다." },
      ]} />
      <ExplainedFormula question="왜 나눗셈과 반복 곱을 써서 지수 함수를 흉내내나요?" idea={<p>
            부동소수점 없이 factor·e^(n/d) 모양을 만들려고 이전 항에 n/(d·i)를 곱해 다음 Taylor 항을 순서대로 만들고 전부 더한 뒤 마지막에 한 번만 d로
            나눕니다.
          </p>} formula={String.raw`P=\frac{1}{d}\sum_{i=0}^{k} a_i,\quad a_0=fd,\ a_i=a_{i-1}\cdot\frac{n}{d\,i}`} annotatedFormula={String.raw`\begin{aligned}a_0&=\underbrace{f\cdot d}_{\text{초기 누적자 — factor를 denom 배로 키워 정수 나눗셈 오차를 늦춤}}\\a_i&=\underbrace{a_{i-1}\cdot\frac{n}{d\,i}}_{\text{이전 항에 }n/(di)\text{를 곱해 다음 Taylor 항을 생성}}\\P&=\underbrace{\frac{1}{d}\sum_{i=0}^{k} a_i}_{\text{모든 항을 더한 뒤 }d\text{로 나눠 최종 price로 정규화}}
\end{aligned}`} operations={[
        { expression: String.raw`f\cdot d`, annotation: ["factor를 denom 배로 확대해", "정수 나눗셈에서 정밀도를 보존"] },
        { expression: String.raw`a_{i-1}\cdot\frac{n}{d\,i}`, annotation: ["이전 항에 n/(d·i)를 곱해", "다음 Taylor 항을 순서대로 생성"] },
        { expression: String.raw`\frac{1}{d}\sum_{i=0}^{k} a_i`, annotation: ["모든 항을 누적한 뒤 d로 나눠", "최종 price로 정규화"] },
      ]} terms={[
        { symbol: "f", name: "Factor", description: "MIN_BLOB_GASPRICE — excess가 0일 때의 최소 price입니다." },
        { symbol: "n", name: "Numerator", description: "이번 block의 excess blob gas입니다." },
        { symbol: "d", name: "Denominator", description: "BLOB_GASPRICE_UPDATE_FRACTION — price 증가 속도를 정하는 fork parameter입니다." },
      ]} assumptions={["항 a_i가 0으로 수렴하면(정수 나눗셈이 0을 반환) 반복을 멈춥니다.", "모든 연산은 정수 산술이며 부동소수점을 쓰지 않습니다."]} interpretation="n/d가 0에 가까우면 P는 f에 가깝습니다. n/d가 1, 2, 3으로 커지면 P는 각각 f의 e배, e²배, e³배로 뛰어오릅니다 — 아래 그래프가 이 모양을 보여줍니다." />
      <BlobFeeCurveChart />
      <div className="not-prose flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => sidebar.open("calc-blob-fee", codeRefs["calc-blob-fee"])} />
        <span className="text-xs text-muted-foreground">fake_exponential() — 정수 Taylor 근사의 실제 구현</span>
      </div>
    </section>
    <section id="paper-eip4844-fee" className="space-y-5"><h2 className="text-2xl font-bold">규범적 근거</h2><CitationBlock type="paper" citeKey={1} source="EIP-4844 blob gas update" href={EIP_4844}><p><strong>문제:</strong> Blob data demand를 execution gas와 독립적으로 target 주변에 유지해야 합니다.</p><p><strong>핵심 기여:</strong> Excess blob gas update와 integer fake-exponential minimum fee를 정의합니다.</p><p><strong>중요 가정:</strong> 활성 fork의 target, update fraction, integer width와 header fields를 사용합니다.</p><p><strong>근거 범위:</strong> Consensus-visible blob gas state와 minimum fee 계산입니다.</p><p><strong>일반화 금지:</strong> User priority policy, rollup compression ratio나 미래 fork parameter를 고정하지 않습니다.</p></CitationBlock></section>
    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ reth: eip4844BlobFeeTree }}
      projectMetas={RETH_PROJECT_META}
    />
  </article>;
}
