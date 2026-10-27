import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import RethEip1559Locator, {
  RethEip1559MapReturn,
} from "../reth-eip1559/RethEip1559Locator";
import { rethEip1559V281Tree } from "../reth-eip1559/fileTree";
import {
  RETH_EIP1559_PROJECT_META,
  rethEip1559CodeRefs,
} from "../reth-eip1559/modernCodeRefs";
import RethEip1559ValidationViz from "./viz/RethEip1559ValidationViz";

const LABEL = ({ children }: { children: React.ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">
    {children}
  </span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethEip1559Locator current="reth-eip1559-validation" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Reth·Alloy·ChainSpec 변경이 같은 가격과 정산을 만드는지 배포 전에 어떻게 확인합니까?
          </h2>
        </div>
        <RethEip1559ValidationViz />
        <p className="text-lg leading-8">
          <LABEL>A</LABEL>이 글은 새 release나 fee 계산 변경을 운영에 바로
          적용하라는 승인안이 아닙니다. 격리한 test node에서 같은 parent header와
          transaction corpus를 payload 작성, consensus 검증, TxPool 유지 경로에
          재생하고 exact wei·receipt·balance·rollback parity를 확인하는 실험
          계획입니다.
        </p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">계산에 참여하는 버전과 입력을 한 run ID에 고정합니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[50rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">영역</th><th className="px-3 py-3">고정할 값</th><th className="px-3 py-3">불일치하면 생기는 문제</th></tr></thead>
            <tbody>{[
              ["Reth", "v2.8.1 · d763342… · build features", "호출 경로와 fork validation 차이"],
              ["Alloy", "alloy-eips·consensus v2.5.0", "정수 계산·transaction trait 차이"],
              ["Chain", "genesis·ChainSpec digest·fork timestamp·E·D", "같은 parent에서 다른 next price"],
              ["Parent", "number·hash·timestamp·gas limit·used·base fee", "Oracle 입력이 달라짐"],
              ["Transaction", "raw bytes·type·caps·gas used fixture", "Eligibility와 accounting 비교 불가"],
              ["Runtime", "binary digest·platform·test seed·run ID", "결과 재현과 rollback 확인 불가"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p><LABEL>O</LABEL>Reth v2.8.1 tag가 가리키는 source commit은 <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>이며 Cargo.lock은 Alloy EIPs·Consensus v2.5.0을 고정합니다. 예전 합성 <code>reth-primitives-traits</code> snippet이나 moving main을 기준선으로 사용하지 않습니다.</p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정본과 계산자, 소비자를 구분합니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 owner</th><th className="px-3 py-3">검증에서 보는 소비자</th></tr></thead><tbody>{[
          ["활성 fork·E·D", "고정한 ChainSpec", "Reth EthChainSpec call site"],
          ["Candidate next base fee", "ChainSpec + Alloy calculation", "Payload builder·TxPool"],
          ["수신 block base fee", "Canonical header after consensus", "Header validator"],
          ["Effective tip", "Transaction caps + current header base fee", "TxPool ordering·execution accounting"],
          ["실제 gas·fee", "Execution receipt와 state transition", "Balance·beneficiary·burn oracle"],
          ["배포 상태", "ADR·GitOps/배포 파이프라인", "실험 collector는 read-only"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><LABEL>A</LABEL>Collector가 ChainSpec이나 header를 수정해서 결과를 맞추면 실험이 아닙니다. Candidate와 기준 구현은 같은 입력을 읽고 각각 결과를 내며, 비교기는 첫 차이와 입력 provenance만 기록합니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("chain-params", rethEip1559CodeRefs["chain-params"])} /><span className="text-xs text-muted-foreground">Parameter source</span><CodeViewButton onClick={() => sidebar.open("header-validation", rethEip1559CodeRefs["header-validation"])} /><span className="text-xs text-muted-foreground">Canonical acceptance gate</span></div>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력과 세 경로의 결과를 하나의 golden receipt로 묶습니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["입력", "parent hash·timestamp·limit·used·base"],
          ["Parameter", "fork id·elasticity·denominator"],
          ["결과", "next base·eligibility·tip·burn"],
          ["경로", "payload·validator·TxPool·receipt"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>A</LABEL>최종 숫자 하나만 저장하지 않습니다. 어느 ChainSpec과 fork가 계수를 냈는지, 어떤 경로가 값을 계산했는지, exact wei와 typed outcome이 무엇인지 남겨야 target 경계나 fork timestamp에서 처음 갈라진 지점을 찾을 수 있습니다.</p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정수·fork·경로 경계를 같은 순서로 재생합니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">{[
          ["01 · Target 경계", "gas used를 target−1, target, target+1로 바꿔 감소·유지·최소 증가 분기와 exact wei를 확인합니다."],
          ["02 · 변화폭 경계", "0 gas와 최대 2T gas, 작은 base fee 0·1·2와 큰 중간 곱에서 rounding·overflow·saturation을 대조합니다."],
          ["03 · Fork 경계", "London 직전과 activation block, 그다음 block에서 initial base fee와 parent-derived 값이 정확히 전환되는지 봅니다."],
          ["04 · Chain parameter", "Mainnet 2·8과 별도 custom E·D, 잘못된 0 parameter 방어를 분리해 expected behavior를 기록합니다."],
          ["05 · Transaction cap", "Max fee가 base fee보다 작음·같음·큼, priority cap이 남은 cap보다 작거나 큰 경우를 재생합니다."],
          ["06 · 세 경로 parity", "Payload EVM env, 수신 header validation, TxPool pending base fee가 같은 parent·timestamp에서 같은 u64를 내는지 비교합니다."],
          ["07 · Accounting", "Actual gas·refund를 고정하고 sender charge, beneficiary delta, burned amount와 receipt를 대조합니다."],
          ["08 · Restart·rollback", "Candidate를 중지하고 이전 binary·ChainSpec으로 되돌린 뒤 같은 fixture의 header·receipt parity가 복구되는지 확인합니다."],
        ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}</ol>
        <p><LABEL>?</LABEL>실제 workload의 transaction 조합, 허용 latency와 canary 범위는 대상 환경에서 정해야 합니다. 운영 validator나 public RPC에 fork·header corruption·process kill을 주입하지 않습니다.</p>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">1 wei라도 다르면 후보 배포를 중지하고 입력부터 보존합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">{[
          ["발견", "header·receipt mismatch"],
          ["중지", "candidate rollout"],
          ["보존", "parent·spec·trace"],
          ["복구", "binary·ChainSpec rollback"],
          ["재진입", "전체 fixture 재생"],
        ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>A</LABEL>잘못 계산한 candidate header를 canonical data로 취급하지 않습니다. Parent header와 ChainSpec digest, base/candidate trace를 보존하고 이전 binary와 spec으로 되돌립니다. 이미 생성했지만 아직 제안하지 않은 payload는 폐기하고, 수신 block은 이전 validator로 다시 판정합니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">합의·정산·복구가 같은 뒤에만 비용을 비교합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["합의", "exact next base fee·header outcome"],
          ["정산", "tip·sender·beneficiary·burn parity"],
          ["복구", "rollback·restart·fixture replay"],
          ["비용", "ns/op·CPU·allocation·payload wait"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>M</LABEL>현재 대상 장비와 실제 workload에서 얻은 성능·복구 측정값은 없습니다. Reth v2.8.1이나 Alloy v2.5.0이 이전 조합보다 빠르거나 안전하다는 결론도 아직 내리지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 전 상태는 proposed이며 exact parity가 채택의 선행 조건입니다</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6"><p><strong>Status:</strong> proposed</p><p className="mt-2"><strong>채택 조건:</strong> Fork·target·정수·transaction cap·accounting 경계에서 기준과 candidate의 header, typed outcome, receipt와 balance가 모두 같고 rollback 재생까지 통과해야 합니다.</p><p className="mt-2"><strong>기각 조건:</strong> 1 wei 차이, 서로 다른 실행 경로의 parameter drift, 잘못된 eligibility, burn·beneficiary 오정산 또는 안전한 rollback 부재가 한 번이라도 나타납니다.</p><p className="mt-2"><strong>다시 검토할 조건:</strong> Reth·Alloy release, ChainSpec, fork schedule, custom parameter, transaction type, EVM accounting 또는 배포 경로가 바뀝니다.</p></div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 기능과 아직 없는 현장 측정을 분리합니다</h2>
        <CitationBlock source="EIP-1559 specification" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-1559"><p><LABEL>O</LABEL>Base fee transition, type-2 cap과 burn semantics의 protocol oracle입니다.</p><p><b>범위:</b> Reth 배포 절차와 대상 장비의 성능을 증명하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · ChainSpec and consensus validation" citeKey={2} type="code" href="https://github.com/paradigmxyz/reth/tree/v2.8.1/crates/consensus"><p><LABEL>O</LABEL>Fork 전환, expected base fee와 header mismatch failure 경계를 확인했습니다.</p><p><LABEL>M</LABEL>대상 환경의 canary·rollback 시간과 실제 mismatch 분포는 아직 측정하지 않았습니다.</p></CitationBlock>
        <CitationBlock source="Alloy v2.5.0 · EIP-1559 implementation" citeKey={3} type="code" href="https://github.com/alloy-rs/alloy/tree/v2.5.0/crates/eips/src/eip1559"><p><LABEL>O</LABEL>정수 계산, parameter guard와 transaction tip 계약의 고정 구현입니다.</p><p><b>범위:</b> Upstream tests의 존재를 대상 환경의 cross-path parity로 확대하지 않습니다.</p></CitationBlock>
      </section>

      <RethEip1559MapReturn current="reth-eip1559-validation" />
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={rethEip1559CodeRefs} fileTrees={{ reth: rethEip1559V281Tree }} projectMetas={RETH_EIP1559_PROJECT_META} />
    </article>
  );
}
