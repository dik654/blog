import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import RethPayloadBuilderLocator, {
  RethPayloadBuilderMapReturn,
} from "./RethPayloadBuilderLocator";
import { rethPayloadBuilderV281Tree } from "./fileTree";
import {
  RETH_PAYLOAD_BUILDER_PROJECT_META,
  rethPayloadBuilderCodeRefs,
} from "./modernCodeRefs";
import RethPayloadBuilderFlowViz from "./viz/RethPayloadBuilderFlowViz";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethPayloadBuilderLocator current="reth-payload-builder" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            forkchoiceUpdated 한 건은 어떻게 payloadId가 되고, Reth는 그 ID로 어떤 block candidate를 돌려줍니까?
          </h2>
        </div>
        <RethPayloadBuilderFlowViz />
        <p className="text-lg leading-8">
          합의 클라이언트는 다음 block의 parent와 timestamp, fee recipient,
          prevRandao 같은 조건을 정합니다. Reth는 이 요청을 곧바로 canonical
          database에 쓰지 않습니다. 별도 payload job을 만들고 현재 txpool의
          거래를 임시 EVM state에서 실행하며, 더 나은 후보가 생기면 job 안의
          best payload만 바꿉니다.
        </p>
        <p>
          이 글은 Reth v2.8.1과 source commit
          <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>을 기준으로 합니다.
          기존 글이 가정하던 고정된 “pool generation snapshot”은 이 구현의
          contract가 아닙니다. 고정되는 것은 parent와 attributes로 만든 job
          identity이고, 거래 iterator는 build 시도마다 현재 pool에서 다시
          얻습니다.
        </p>
      </section>

      <section id="request" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Attributes가 유효할 때만 parent 위에 새 build를 시작합니다
        </h2>
        <div className="not-prose grid gap-px bg-border p-px text-sm leading-6 sm:grid-cols-3">
          {[
            ["Forkchoice state", "head · safe · finalized hash", "어느 chain 위에 만들지 정함"],
            ["Payload attributes", "timestamp · recipient · randao", "다음 block의 실행 조건"],
            ["Build resources", "cache · state-root task · lease", "job이 끝날 때까지 빌려 쓰는 자원"],
          ].map(([title, value, meaning]) => (
            <div key={title} className="bg-background p-4">
              <strong className="text-sm">{title}</strong>
              <code className="mt-2 block break-words text-[10px] text-primary">{value}</code>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{meaning}</p>
            </div>
          ))}
        </div>
        <p>
          Engine API layer는 먼저 method version과 활성 fork에 맞는 attributes인지
          확인합니다. Engine tree는 이어서 attributes timestamp가 head timestamp보다
          큰지 검사합니다. 이 두 번째 검사가 실패하면 forkchoice 갱신 자체를 되돌리는
          것이 아니라 새 payload build만 시작하지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("engine-handoff", rethPayloadBuilderCodeRefs["engine-handoff"])} />
          <span className="text-xs text-muted-foreground">검증 뒤에만 BuildNewPayload 전송</span>
        </div>
      </section>

      <section id="identity" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          PayloadId는 parent와 attributes를 가리키는 8-byte 조회 키입니다
        </h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">Hash 입력</th><th className="px-3 py-3">항상 포함</th><th className="px-3 py-3">Fork에 따라 포함</th><th className="px-3 py-3">포함하지 않음</th></tr></thead>
            <tbody><tr className="border-t border-border"><td className="px-3 py-3">SHA-256 앞 8 byte</td><td className="px-3 py-3">parent·timestamp·randao·recipient</td><td className="px-3 py-3">withdrawals·beacon root·slot·target gas</td><td className="px-3 py-3">txpool 내용·candidate value·canonical 여부</td></tr></tbody>
          </table>
        </div>
        <p>
          같은 parent와 같은 attributes라면 Reth의 이 함수는 같은 ID를 계산합니다.
          Service는 이미 같은 ID의 active job이 있으면 새 job을 하나 더 만들지
          않습니다. 그러나 이 ID는 block hash가 아니며, proposer가 후보를 채택했다는
          증거나 candidate가 canonical이 되었다는 표시도 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("payload-id", rethPayloadBuilderCodeRefs["payload-id"])} />
          <span className="text-xs text-muted-foreground">Reth v2.8.1의 실제 hash 입력</span>
        </div>
      </section>

      <section id="job" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Job은 parent·attributes·deadline을 보관하고 첫 build를 즉시 시작합니다
        </h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Config", "parent header · attributes · payloadId"],
            ["Lifecycle", "deadline · interval · cancellation"],
            ["Working state", "cached reads · execution cache · state-root handle"],
            ["Candidate", "Missing → Best 또는 Frozen"],
          ].map(([title, body]) => (
            <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>
          ))}
        </div>
        <p>
          Parent header가 없으면 job을 만들 수 없습니다. 생성에 성공하면 interval은
          즉시 첫 tick을 내고 첫 build task가 시작됩니다. Resource lease는 Engine이
          빌려 준 in-memory state와 state-root 작업이 detached task보다 먼저 사라지지
          않도록 수명을 연결합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("job-lifecycle", rethPayloadBuilderCodeRefs["job-lifecycle"])} />
          <span className="text-xs text-muted-foreground">BasicPayloadJob 생성과 첫 build</span>
        </div>
      </section>

      <section id="selection" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          각 build 시도는 현재 pool을 다시 읽고 세 종류의 공간을 따로 검사합니다
        </h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Execution gas", "현재까지 실제 사용량과 다음 거래의 gas limit"],
            ["Blob capacity", "활성 fork의 max blob count와 user limit"],
            ["Encoded size", "Osaka 이후 최대 RLP block size"],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}
        </div>
        <p>
          Pool ordering은 탐색 순서이지 포함 보장이 아닙니다. 거래가 남은 gas에
          들어가지 않으면 해당 거래와 dependent 거래를 iterator에서 제외합니다.
          Blob 거래는 sidecar가 실제 BlobStore에 있는지와 fork 전후 sidecar 형식도
          별도로 확인합니다. 서로 단위가 다른 execution gas, blob 수와 encoded
          byte를 한 점수로 합치지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("gas-selection", rethPayloadBuilderCodeRefs["gas-selection"])} />
          <span className="text-xs text-muted-foreground">Gas budget과 cancellation 경계</span>
        </div>
      </section>

      <section id="candidate" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          EVM 실행이 성공한 거래만 임시 block state와 후보 value를 바꿉니다
        </h2>
        <ExplainedFormula
          question="후보의 local value는 어떻게 계산합니까?"
          idea="거래가 실제로 사용한 gas에 현재 base fee를 제외한 effective tip을 곱하고, 실행에 성공한 거래들의 값을 더합니다."
          formula={String.raw`V(C)=\sum_{t\in C}\operatorname{tip}_{\mathrm{eff}}(t,B)\times g_{\mathrm{used}}(t)`}
          annotatedFormula={String.raw`V(C)=\sum_{t\in C}\underbrace{\operatorname{tip}_{\mathrm{eff}}(t,B)}_{\text{beneficiary 몫 / gas}}\times\underbrace{g_{\mathrm{used}}(t)}_{\text{실제 실행 gas}}`}
          operations={[
            { expression: String.raw`3\times21{,}000`, annotation: ["첫 거래 tip 3 gwei/gas", "실제 gas 21,000", "63,000 gwei"] },
            { expression: String.raw`2\times40{,}000`, annotation: ["둘째 거래 tip 2 gwei/gas", "실제 gas 40,000", "80,000 gwei"] },
            { expression: String.raw`4\times30{,}000`, annotation: ["Blob 거래 tip 4 gwei/gas", "실제 gas 30,000", "120,000 gwei"] },
          ]}
          terms={[
            { symbol: "C", name: "Candidate transactions", description: "Resource와 execution 검사를 통과해 임시 block에 들어간 거래 집합입니다." },
            { symbol: "B", name: "Base fee", description: "Next-block EVM 환경에 설정된 execution base fee입니다." },
            { symbol: "g_used", name: "Actual gas used", description: "Gas limit이 아니라 EVM 실행 결과에 기록된 실제 사용량입니다." },
          ]}
          assumptions={[
            "예시 거래 세 개의 actual gas 합은 91,000이고 block gas limit은 100,000입니다.",
            "Blob 거래의 blob-count와 sidecar 검사는 별도로 통과했다고 가정합니다.",
            "263,000 gwei는 설명용 local candidate value이며 현재 네트워크 수익 측정값이 아닙니다.",
          ]}
          interpretation="세 거래의 local value 합은 263,000 gwei입니다. Revert status가 있는 거래도 EVM 실행 자체가 유효하면 receipt와 gas 사용량을 가진 채 포함될 수 있습니다. 반대로 consensus-invalid 거래는 fee가 높아도 후보를 개선하지 못합니다."
        />
        <p>
          Candidate state는 canonical database와 분리됩니다. Builder가 누적하는 state
          diff, receipt, gas, sidecar와 state root는 아직 제안 전 임시 결과입니다.
          높은 value가 잘못된 root나 fork field를 상쇄하지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("execution-selection", rethPayloadBuilderCodeRefs["execution-selection"])} />
          <span className="text-xs text-muted-foreground">EVM 결과·typed failure·best 비교</span>
        </div>
      </section>

      <section id="resolve" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Interval마다 후보를 다시 만들고 getPayload가 현재 best를 resolve합니다
        </h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[50rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">Build outcome</th><th className="px-3 py-3">Job state 변화</th><th className="px-3 py-3">다음 동작</th></tr></thead>
            <tbody>{[
              ["Better", "Best를 새 payload로 교체", "다음 interval에도 개선 가능"],
              ["Aborted", "기존 Best 유지", "cached reads를 재사용하고 다음 tick 대기"],
              ["Freeze", "Frozen payload로 고정", "더 이상 build하지 않음"],
              ["Attempt error", "Best 유지", "실패 metric 뒤 다음 tick 재시도"],
              ["Deadline", "Job future 종료", "active registry에서 제거"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          중요한 점은 “한 job = 한 번의 pool snapshot”이 아니라는 것입니다.
          같은 parent와 attributes를 유지한 채 매 build 시도에서 현재 pool의 best
          iterator를 다시 얻습니다. 새 거래가 들어오면 다음 시도의 candidate가
          달라질 수 있고, value가 더 크면 Best를 교체합니다.
        </p>
        <p>
          getPayload는 먼저 ID에 연결된 timestamp와 API version을 검사합니다.
          Service에 ID가 없으면 UnknownPayload가 됩니다. Active job이 있으면 resolve
          정책에 따라 이미 만든 best, 진행 중 build 또는 empty payload fallback 중
          하나가 반환되고, 기본 Basic job은 resolve 뒤 active job에서 제거됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("job-poll", rethPayloadBuilderCodeRefs["job-poll"])} />
          <span className="text-xs text-muted-foreground">반복 build와 best 교체</span>
          <CodeViewButton onClick={() => sidebar.open("resolve", rethPayloadBuilderCodeRefs.resolve)} />
          <span className="text-xs text-muted-foreground">ID lookup과 resolve</span>
        </div>
      </section>

      <section id="failure-boundaries" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          실패는 요청·Job·거래·Resolve 네 경계에서 서로 다른 결과를 냅니다
        </h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Attributes", "INVALID_PAYLOAD_ATTRIBUTES", "Build 시작 안 함"],
            ["Parent", "MissingParentHeader", "Job 생성 실패"],
            ["Transaction", "skip 또는 attempt error", "기존 Best 보존 가능"],
            ["PayloadId", "UnknownPayload", "다른 최신 Job으로 대체 안 함"],
          ].map(([title, status, effect]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><code className="mt-2 block text-[10px] text-primary">{status}</code><p className="mt-2 text-xs leading-5 text-muted-foreground">{effect}</p></div>)}
        </div>
        <p>
          이 분리는 장애 원인을 찾을 때 중요합니다. getPayload에서 UnknownPayload를
          받았다고 transaction execution이 실패한 것은 아니고, 한 거래가 gas
          budget을 넘었다고 job 전체가 반드시 실패하는 것도 아닙니다. 반대로 내부
          provider 오류처럼 attempt를 끝내는 오류를 단순 transaction skip으로
          낮춰 처리해서도 안 됩니다.
        </p>
      </section>

      <section id="source" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">고정한 구현과 설명 범위를 분리합니다</h2>
        <CitationBlock source="Reth v2.8.1 · Payload Builder source" citeKey={1} type="code" href="https://github.com/paradigmxyz/reth/tree/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/payload">
          <p>Service, BasicPayloadJob, PayloadId와 resolve lifecycle을 확인한 고정 source입니다.</p>
          <p><b>범위:</b> Custom payload builder, 외부 MEV relay, proposer 선택이나 대상 환경의 build latency를 증명하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Ethereum local payload construction" citeKey={2} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/ethereum/payload/src/lib.rs">
          <p>현재 txpool iterator, gas·blob·size 검사, EVM execution, local value와 best 교체의 원본 구현입니다.</p>
          <p><b>범위:</b> 이 source의 정책을 모든 release와 모든 chain의 고정 동작으로 확대하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Ethereum Execution APIs · Engine API" citeKey={3} href="https://github.com/ethereum/execution-apis/tree/3d627c95a4d3510a8187dd02e0250ecb4331d27e/src/engine">
          <p>forkchoiceUpdated와 getPayload의 CL·EL 책임과 version별 schema를 확인하는 고정 specification snapshot입니다.</p>
          <p><b>범위:</b> Reth 내부 task scheduling과 txpool ordering은 이 specification이 정하지 않습니다.</p>
        </CitationBlock>
      </section>

      <RethPayloadBuilderMapReturn current="reth-payload-builder" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={rethPayloadBuilderCodeRefs}
        fileTrees={{ reth: rethPayloadBuilderV281Tree }}
        projectMetas={RETH_PAYLOAD_BUILDER_PROJECT_META}
      />
    </article>
  );
}
