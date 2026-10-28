import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import RethPayloadBuilderLocator, {
  RethPayloadBuilderMapReturn,
} from "../reth-payload-builder/RethPayloadBuilderLocator";
import { rethPayloadBuilderV281Tree } from "../reth-payload-builder/fileTree";
import {
  RETH_PAYLOAD_BUILDER_PROJECT_META,
  rethPayloadBuilderCodeRefs,
} from "../reth-payload-builder/modernCodeRefs";
import RethPayloadBuilderValidationViz from "./viz/RethPayloadBuilderValidationViz";

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethPayloadBuilderLocator current="reth-payload-builder-validation" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Payload Builder 변경을 배포 전에 어떻게 검증합니까?
          </h2>
        </div>
        <RethPayloadBuilderValidationViz />
        <p className="text-lg leading-8">
          <Label>A</Label>이 글은 운영 validator에 새 binary를 바로 적용하는
          절차가 아닙니다. 격리한 test node에서 base와 candidate에 같은 parent,
          attributes, transaction corpus와 clock schedule을 넣고, 장애 하나씩만
          추가해 결과와 복구를 비교하는 실험 계획입니다.
        </p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">재현에 필요한 입력과 버전을 한 run ID에 묶습니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[52rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">고정 영역</th><th className="px-3 py-3">기록할 값</th><th className="px-3 py-3">빠지면 설명할 수 없는 차이</th></tr></thead>
            <tbody>{[
              ["Binary", "Reth tag·commit·features·digest", "Service·job·builder 구현 차이"],
              ["Chain", "genesis·ChainSpec digest·fork timestamp", "Attributes와 resource rule 차이"],
              ["Parent", "header·state snapshot·canonical hash", "EVM env와 state root 차이"],
              ["Attributes", "원문 JSON·method version·payloadId", "Job identity와 fork schema 차이"],
              ["Pool", "raw tx bytes·sidecar·arrival schedule", "Ordering·candidate value 차이"],
              ["Clock", "build interval·getPayload 시점·restart 시점", "Best·fallback·deadline 차이"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p><Label>O</Label>기준 구현은 Reth v2.8.1 commit <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>입니다. Moving main이나 예전 v1.x 합성 코드를 기준선으로 사용하지 않습니다.</p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">관찰자가 상태를 고치지 않도록 authoritative writer를 먼저 정합니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 writer</th><th className="px-3 py-3">검증기가 하는 일</th></tr></thead><tbody>{[
          ["Forkchoice·head", "Engine tree", "입력 hash와 결과 status 기록"],
          ["PayloadId→active job", "PayloadBuilderService", "lookup·duplicate·remove event 기록"],
          ["Best candidate", "BasicPayloadJob", "Better·Aborted·Freeze 전이 기록"],
          ["임시 state·receipt", "EthereumPayloadBuilder/EVM", "root·receipt·fees 비교"],
          ["Canonical block", "Consensus acceptance 뒤 chain state", "candidate를 임의로 canonical 처리하지 않음"],
          ["배포 상태", "ADR와 배포 파이프라인", "collector는 rollback을 직접 실행하지 않음"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><Label>A</Label>Base와 candidate가 같은 txpool이나 payload registry를 함께 수정하면 비교가 오염됩니다. 독립 process와 독립 data directory를 사용하고 fixture 공급자만 공유합니다.</p>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정상 경로의 결과를 payload bytes 하나가 아니라 상태 묶음으로 저장합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["Engine", "payload status · ID · typed error"],
          ["Job", "created · attempts · outcome · deadline"],
          ["Candidate", "tx order · block · roots · receipts · fees"],
          ["Resource", "gas · blobs · RLP bytes · build timing"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><Label>A</Label>Hash만 같다고 충분하지 않습니다. 실패한 build가 우연히 이전 best를 반환할 수 있으므로 attempt outcome, typed error와 fallback 여부도 함께 저장해야 합니다.</p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정상 입력에 한 경계씩만 바꾸어 첫 차이를 찾습니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">{[
          ["01 · Attributes", "Timestamp가 head와 같거나 작음, fork field 누락·과잉, method version mismatch에서 같은 rejection과 no-build를 확인합니다."],
          ["02 · Parent", "알 수 없는 parent hash와 state provider 오류에서 job 생성·attempt 오류를 구분합니다."],
          ["03 · Dependency", "같은 sender의 연속 nonce와 gap, nonce-too-low·insufficient balance에서 포함 순서와 descendant 처리를 비교합니다."],
          ["04 · Resource", "Gas limit 경계, max blob count±1, missing·wrong-fork sidecar, Osaka RLP size 경계를 재생합니다."],
          ["05 · Execution", "Success·revert·consensus-invalid·provider error에서 receipt, gas, skip 범위와 기존 best 보존을 비교합니다."],
          ["06 · Timing", "첫 build 전, pending 중, best 뒤 getPayload를 호출해 fallback과 resolve latency를 기록합니다."],
          ["07 · Identity", "같은 ID 중복 요청, unknown ID, resolve 뒤 재조회와 process restart 뒤 ID를 확인합니다."],
          ["08 · Recovery", "Candidate를 중지하고 이전 binary·config로 돌아가 전체 fixture와 baseline receipt가 복구되는지 확인합니다."],
        ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}</ol>
        <p><Label>?</Label>대상 환경의 실제 slot budget, 허용 p95·p99와 canary traffic 범위는 아직 정하지 않았습니다. 운영 mainnet node에서 process kill이나 잘못된 fork attributes를 주입하지 않습니다.</p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 결과를 하나의 “build 실패”로 합치지 않습니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["Rejected request", "ID 없음 · job 없음", "Attributes 수정 후 새 요청"],
          ["Skipped transaction", "Job과 best 유지", "다음 거래 또는 다음 attempt"],
          ["Failed attempt", "Error metric · 기존 best 유지 가능", "다음 interval 재시도"],
          ["Unknown ID", "다른 payload 반환 금지", "CL이 새 forkchoice 요청"],
        ].map(([title, state, recovery]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5">{state}</p><p className="mt-2 text-[10px] leading-4 text-muted-foreground">복구 · {recovery}</p></div>)}</div>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("job-poll", rethPayloadBuilderCodeRefs["job-poll"])} /><span className="text-xs text-muted-foreground">Outcome별 best 상태 전이</span><CodeViewButton onClick={() => sidebar.open("resolve", rethPayloadBuilderCodeRefs.resolve)} /><span className="text-xs text-muted-foreground">Unknown ID 경계</span></div>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">장애에서 재진입까지</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">{[
          ["발견", "첫 receipt 차이"], ["격리", "candidate traffic 0"], ["우회", "base endpoint 유지"], ["복구", "binary·config rollback"], ["재진입", "전체 fixture 재통과"],
        ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}</div>
        <p><Label>A</Label>Rollback은 binary만 내리는 작업이 아닙니다. Builder config, ChainSpec, feature set과 traffic route를 같은 baseline digest로 되돌리고, 재시작 뒤 이전 payloadId가 UnknownPayload인지 포함해 fixture를 다시 실행합니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">유효성과 복구가 같은 뒤에만 성능과 value를 비교합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["Correctness", "payload bytes · roots · receipts"],
          ["Lifecycle", "typed status · ID · fallback"],
          ["Recovery", "rollback time · replay parity"],
          ["Cost", "attempt CPU · memory · p95 resolve"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><Label>M</Label>현재 대상 장비와 실제 workload에서 측정한 build latency, payload value, CPU, memory, rollback 시간은 없습니다. Candidate가 더 빠르거나 수익성이 높다는 결론도 내리지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 전 상태는 proposed입니다</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6">
          <p><strong>Status:</strong> proposed</p>
          <p className="mt-2"><strong>채택 조건:</strong> 모든 정상·실패 fixture에서 payload, roots, receipts, typed status와 restart 결과가 기준선과 같고 rollback replay가 통과한 뒤, 미리 정한 slot budget과 resource ceiling을 충족합니다.</p>
          <p className="mt-2"><strong>기각 조건:</strong> Consensus-invalid 거래 포함, root·receipt 차이, unknown ID 대체 반환, deadline 뒤 partial state 노출, rollback 실패가 한 번이라도 나타납니다.</p>
          <p className="mt-2"><strong>다시 검토할 조건:</strong> Reth release, Engine API fork, ChainSpec, builder config, EVM, txpool ordering, state-root pipeline이나 운영 SLO가 바뀝니다.</p>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 구현과 아직 없는 현장 측정을 구분합니다</h2>
        <CitationBlock source="Reth v2.8.1 · Basic payload job and service" citeKey={1} type="code" href="https://github.com/paradigmxyz/reth/tree/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/payload"><p><Label>O</Label>Job 생성, repeated build, resolve와 Unknown ID 경계를 고정한 구현입니다.</p><p><b>범위:</b> 대상 장비에서의 latency와 rollback 성공을 증명하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Ethereum payload builder" citeKey={2} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/ethereum/payload/src/lib.rs"><p><Label>O</Label>거래 선택, EVM execution, fee 비교와 resource edge의 기준 source입니다.</p><p><Label>M</Label>Base와 candidate의 실제 paired result는 아직 측정하지 않았습니다.</p></CitationBlock>
        <CitationBlock source="Ethereum Execution APIs snapshot" citeKey={3} href="https://github.com/ethereum/execution-apis/tree/3d627c95a4d3510a8187dd02e0250ecb4331d27e/src/engine"><p><Label>O</Label>Versioned forkchoiceUpdated·getPayload의 외부 contract입니다.</p><p><b>범위:</b> 내부 Reth task와 운영 rollout 절차를 정하지 않습니다.</p></CitationBlock>
      </section>

      <RethPayloadBuilderMapReturn current="reth-payload-builder-validation" />
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={rethPayloadBuilderCodeRefs} fileTrees={{ reth: rethPayloadBuilderV281Tree }} projectMetas={RETH_PAYLOAD_BUILDER_PROJECT_META} />
    </article>
  );
}
