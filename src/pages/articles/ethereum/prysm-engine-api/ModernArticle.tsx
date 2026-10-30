import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmEngineAPILocator, { PrysmEngineAPIMapReturn } from "./PrysmEngineAPILocator";
import PrysmEngineAPIFlowViz from "./viz/PrysmEngineAPIFlowViz";

const fixture = [
  ["PARENT", "E₀", "Execution client가 이미 아는 parent payload"],
  ["BUILD HANDLE", "P₁ · 8 bytes", "E₀ 위에서 시작한 build를 찾는 임시 ID"],
  ["PAYLOAD", "E₁", "Transaction 실행 결과와 block hash를 담은 payload"],
  ["BEACON BLOCK", "B₁", "Body에 E₁을 넣은 consensus block"],
] as const;

const statuses = [
  ["VALID", "실행 검증 완료", "Optimistic 표시를 해제할 수 있음"],
  ["SYNCING · ACCEPTED", "아직 확정하지 못함", "Optimistic 상태로 두고 후속 판정을 기다림"],
  ["INVALID", "실행 규칙 위반 또는 invalid ancestor", "latestValidHash 이후의 branch를 제거"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmEngineAPILocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">만든 payload와 선택한 head를 어떻게 같은 실행 기록으로 맞추는가</h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            Prysm은 어느 beacon block을 따를지 정하지만 transaction을 직접 실행하지 않습니다. Execution client는 payload를 실행할 수 있지만 validator vote로 canonical head를 정하지 않습니다. 두 프로그램은 무엇을 주고받아 한 payload를 만들고, 검증하고, head에 반영합니까?
          </p>
        </div>
        <PrysmEngineAPIFlowViz />
        <p className="text-lg leading-8">
          결론부터 말하면 Engine API는 두 판단을 하나로 합치지 않습니다. Prysm은 <strong>build 시작, build 결과 회수, payload 검증, execution head 반영</strong>을 서로 다른 호출과 상태로 이어 갑니다. 그래서 HTTP 응답을 받았다는 사실, payload가 VALID라는 사실, 그 payload가 canonical head라는 사실은 각각 따로 확인해야 합니다.
        </p>
        <p>
          앞 글의 <Link to="/cs/blockchain/prysm-beacon-api#overview">Beacon API</Link>는 외부 client가 Prysm의 consensus view를 읽는 입구였습니다. 이 글은 반대편 내부 경계인 Prysm과 execution client 사이만 다룹니다. Validator 서명·broadcast는 <Link to="/cs/blockchain/prysm-block-proposal#overview">block proposal</Link>이, consensus state transition은 <Link to="/cs/blockchain/prysm-block-processing#overview">block processing</Link>이 맡습니다.
        </p>
        <ContentBoundary article="prysm-engine-api" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">추적할 payload</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Engine API 설명용 payload 식별자">
          {fixture.map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          <code>E₀</code>·<code>P₁</code>·<code>E₁</code>·<code>B₁</code>은 설명용 이름입니다. 실제 <code>payloadId</code>는 8-byte opaque 값이고 execution payload의 block hash는 32 bytes입니다. 두 값은 길이뿐 아니라 생애와 의미도 다릅니다.
        </p>
      </section>

      <section id="owners" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">두 프로그램은 같은 상태를 쓰지 않는다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2" aria-label="Consensus client와 execution client의 상태 소유권">
          <div className="min-w-0 bg-background p-4 ring-2 ring-inset ring-primary">
            <span className="text-[9px] font-bold text-primary">PRYSM · CONSENSUS CLIENT</span>
            <strong className="mt-2 block text-sm">Beacon head·safe·finalized와 optimistic 표시</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Validator vote와 consensus rule로 B₁의 위치를 판단합니다.</p>
          </div>
          <div className="min-w-0 bg-background p-4">
            <span className="text-[9px] font-bold text-muted-foreground">EXECUTION CLIENT</span>
            <strong className="mt-2 block text-sm">Transaction 실행 결과·payload validity·execution chain view</strong>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">EVM 규칙으로 E₁을 계산하고 검증합니다.</p>
          </div>
        </div>
        <p>
          Engine API는 이 상태들을 대신 소유하는 세 번째 controller가 아닙니다. Prysm이 JSON-RPC caller이고 execution client가 server입니다. 호출은 한쪽의 판단에 필요한 입력과 다른 쪽의 결과를 전달하지만, consensus head 선택과 transaction execution의 권한을 합치지는 않습니다.
        </p>
      </section>

      <section id="forkchoice-updated" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Build를 시작한다</h2>
        <p>
          Proposal 준비 경로에서 Prysm은 <code>E₀</code>를 head로 둔 세 pointer와 다음 block의 조건을 보냅니다. 세 pointer는 현재 tip인 <code>headBlockHash</code>, 더 안정된 조상인 <code>safeBlockHash</code>, 되돌릴 수 없는 조상인 <code>finalizedBlockHash</code>입니다. Payload attributes에는 timestamp·randomness·fee recipient와 fork별 추가 field가 들어갑니다.
        </p>
        <div className="not-prose grid grid-cols-[1fr_auto_1fr] gap-px bg-border p-px" aria-label="forkchoiceUpdated build 요청과 응답">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">REQUEST</span><strong className="mt-2 block text-sm">FCU(E₀, safe, finalized, attrs)</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Canonical pointer 후보와 build 조건</p></div>
          <div className="flex items-center justify-center bg-background px-2 text-primary" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-4 ring-2 ring-inset ring-primary"><span className="text-[9px] font-bold text-primary">RESPONSE</span><strong className="mt-2 block text-sm">VALID + P₁</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">E₀를 받아들이고 build 시작</p></div>
        </div>
        <p>
          Execution APIs v1.0.0-beta.7은 fork-choice state를 먼저 적용하고, head가 VALID일 때만 attributes를 처리하도록 정합니다. Attributes가 잘못돼 build가 시작되지 않아도 앞에서 성공한 pointer update를 없던 일로 되돌린다고 규정하지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Proposal build 경로" onClick={() => sidebar.open("proposal-build", codeRefs["proposal-build"])} />
          <CodeViewButton label="FCU method·status" onClick={() => sidebar.open("engine-forkchoice", codeRefs["engine-forkchoice"])} />
        </div>
      </section>

      <section id="payload-retrieval" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Build 결과를 회수한다</h2>
        <p>
          <code>P₁</code>은 <code>E₀</code>와 attributes로 시작한 build를 execution client 안에서 다시 찾는 handle입니다. Prysm은 같은 ID를 <code>engine_getPayloadVn</code>에 보내고, 그 시점에 준비된 최신 payload <code>E₁</code>을 받습니다. Unknown·expired ID나 execution client 재시작 뒤에는 <code>-38001 Unknown payload</code>가 올 수 있습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="payloadId와 payload와 beacon block의 관계">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">P₁</span><strong className="mt-2 block text-sm">Build handle</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">8 bytes · process 내부 생애</p></div>
          <div className="min-w-0 bg-background p-4 ring-2 ring-inset ring-primary"><span className="text-[9px] font-bold text-primary">E₁</span><strong className="mt-2 block text-sm">Execution payload</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Transactions·roots·block hash</p></div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">B₁</span><strong className="mt-2 block text-sm">Beacon block</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Body가 E₁을 포함</p></div>
        </div>
        <p>
          Prysm v7.3.1은 slot의 epoch으로 getPayload V1부터 V6과 response protobuf type을 함께 고릅니다. Method suffix는 API 전체 버전이 아니므로 <code>newPayloadV4</code>와 <code>getPayloadV4</code>가 같은 parameter를 쓴다고 추측하면 안 됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="GetPayload version 선택" onClick={() => sidebar.open("engine-get-payload", codeRefs["engine-get-payload"])} />
        </div>
      </section>

      <section id="new-payload" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">받은 payload를 실행 검증한다</h2>
        <p>
          <code>B₁</code>을 처리하는 Prysm은 body에서 <code>E₁</code>을 꺼내 <code>engine_newPayloadVn</code>에 보냅니다. Deneb 이후에는 blob versioned hashes와 parent beacon block root가, Electra 이후에는 execution requests가 추가됩니다. Execution client는 transaction 실행뿐 아니라 이 fork 문맥과 payload block hash도 확인합니다.
        </p>
        <p>
          Prysm v7.3.1의 method 선택은 하나의 숫자 비교가 아닙니다. Concrete payload type이 V1·V2·V3을 가르고, Deneb payload에 execution requests가 있으면 V4를 사용합니다. Gloas payload는 V5로 갑니다. 지원하지 않는 data type을 더 낮은 version으로 조용히 보내지 않고 error로 끝냅니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="NewPayload method·status" onClick={() => sidebar.open("engine-new-payload", codeRefs["engine-new-payload"])} />
        </div>
      </section>

      <section id="status" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">세 결과가 서로 다른 다음 동작을 만든다</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">PayloadStatus</th><th className="p-3">지금 확인한 사실</th><th className="p-3">Prysm의 다음 상태</th></tr></thead>
            <tbody>{statuses.map(([status, meaning, next]) => <tr key={status} className="border-b border-border/70"><td className="p-3 font-mono text-xs font-bold text-primary">{status}</td><td className="p-3">{meaning}</td><td className="p-3 text-muted-foreground">{next}</td></tr>)}</tbody>
          </table>
        </div>
        <p>
          Prysm의 JSON-RPC client는 <code>VALID</code>이면 latest valid hash와 nil error를 돌려줍니다. <code>SYNCING</code>과 <code>ACCEPTED</code>는 같은 미완료 error로 바꾸고, block-processing 쪽은 <code>false, nil</code>을 반환해 optimistic 후보로 남깁니다. <code>INVALID</code>는 latest valid hash를 담은 <code>invalidBlock</code>으로 바뀝니다.
        </p>
        <p>
          <code>E₀ → E₁ → E₂</code> branch에서 <code>E₂</code>가 INVALID이고 latestValidHash가 <code>E₀</code>라면 <code>E₁</code>과 <code>E₂</code>를 valid로 계속 취급할 수 없습니다. Prysm은 fork-choice store에서 invalid root와 descendant를 찾고 연결된 block·state를 제거합니다. Null이나 zero hash의 fork별 의미를 임의 parent로 바꾸지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Optimistic·invalid 처리" onClick={() => sidebar.open("execution-status", codeRefs["execution-status"])} />
        </div>
      </section>

      <section id="canonical" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">VALID과 canonical head는 같은 말이 아니다</h2>
        <p>
          <code>newPayload(E₁)=VALID</code>은 E₁이 execution 규칙을 통과했다는 뜻입니다. 어느 valid branch를 따를지는 Prysm의 fork choice가 정합니다. B₁이 선택된 뒤 Prysm이 다시 <code>forkchoiceUpdated(head=E₁, safe, finalized)</code>를 보내야 execution client의 canonical chain view가 바뀝니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Payload validity와 canonicality와 finality 구분">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">VALIDITY</span><strong className="mt-2 block text-sm">E₁ 실행이 올바른가</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">newPayload의 PayloadStatus</p></div>
          <div className="min-w-0 bg-background p-4 ring-2 ring-inset ring-primary"><span className="text-[9px] font-bold text-primary">CANONICALITY</span><strong className="mt-2 block text-sm">E₁ branch를 head로 따르는가</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Fork choice 뒤 FCU head pointer</p></div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">FINALITY</span><strong className="mt-2 block text-sm">어디까지 되돌릴 수 없는가</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Finalized execution ancestor</p></div>
        </div>
        <p>
          Engine API 명세는 consensus client가 만든 fork-choice update 순서를 지키라고 요구합니다. 여러 consensus client가 한 execution client의 head를 동시에 쓰면 순서와 authority가 충돌합니다. 명세가 허용하는 many-to-one 형태는 한 writer만 <code>forkchoiceUpdated</code>와 build를 수행하고 나머지는 payload 삽입과 조회만 하는 구성입니다.
        </p>
      </section>

      <section id="versioning" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Version은 호출마다 따로 오른다</h2>
        <p>
          Execution APIs v1.0.0-beta.7은 parameter, response, behavior 또는 structure field가 바뀌면 해당 method나 structure의 suffix를 올립니다. 그래서 <code>newPayloadV5</code>, <code>forkchoiceUpdatedV4</code>, <code>getPayloadV6</code>처럼 숫자가 서로 다를 수 있습니다.
        </p>
        <p>
          <code>engine_exchangeCapabilities</code>는 두 client가 현재 지원하는 method 이름을 교환합니다. Prysm v7.3.1은 활성 fork에 필요한 목록을 보내고 execution client 응답에 빠진 method를 warning으로 남깁니다. 실제 호출 method는 payload·attributes·slot version을 보고 각 함수가 선택합니다. Capability 교환이 runtime dispatch를 대신하는 구조는 아닙니다.
        </p>
      </section>

      <section id="transport" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">JWT는 caller만 확인한다</h2>
        <p>
          Engine endpoint는 일반 JSON-RPC와 분리된 포트를 써야 하며 기본값은 8551입니다. HTTP 요청마다 256-bit shared secret으로 만든 HS256 JWT를 보내고, execution client는 필수 <code>iat</code>가 현재 시각에서 ±60초 안인지 확인하도록 권고됩니다.
        </p>
        <p>
          이 인증은 임의 browser나 인터넷 caller가 head를 바꾸는 요청을 보내지 못하게 하는 장치입니다. Network traffic을 암호화하거나 sniffing 뒤 replay를 막도록 설계되지 않았고, payload가 VALID라는 증명도 아닙니다. 관리 network 격리, secret file 권한과 시계 동기화는 별도 조건입니다.
        </p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">어디에서 멈췄는지 구분한다</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">관찰</th><th className="p-3">실패한 경계</th><th className="p-3">말할 수 없는 것</th></tr></thead>
            <tbody>
              {[
                ["401 또는 JWT 거절", "Caller authentication", "Payload validity"],
                ["JSON-RPC timeout", "Transport·deadline", "VALID·INVALID·SYNCING"],
                ["-38001 Unknown payload", "Build handle lifecycle", "E₁ 자체가 invalid인지"],
                ["SYNCING·ACCEPTED", "Execution validation 미완료", "Canonical head 확정"],
                ["INVALID + latestValidHash", "Execution branch", "Consensus finality 전체"],
                ["VALID", "Execution validity 통과", "Fork-choice 선택·finality"],
              ].map(([observation, boundary, notClaim]) => <tr key={observation} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{observation}</td><td className="p-3">{boundary}</td><td className="p-3 text-muted-foreground">{notClaim}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p>
          배포 조합을 고르는 실무 글에서는 같은 CL·EL·fork·payload tree로 method 지원, status, latestValidHash, pointer, payloadId, JWT와 restart 결과를 먼저 비교해야 합니다. 이 글은 그 실험을 수행하거나 제품을 선택하지 않습니다. 여기서 닫는 범위는 각 관찰값이 어느 상태의 근거인지까지입니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <a id="paper-prysm-engine-source" href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain" target="_blank" rel="noreferrer" className="min-w-0 bg-background p-4 hover:bg-muted/30">
            <span className="font-mono text-[10px] font-black text-primary">O · IMPLEMENTATION</span>
            <strong className="mt-2 block break-keep text-sm leading-6">OffchainLabs Prysm v7.3.1 · 96d418cd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Proposal의 payloadId cache·FCU·GetPayload, Engine JSON-RPC method 선택, NewPayload status와 invalid pruning을 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 이 release의 source behavior입니다. 다른 consensus client나 moving develop에 일반화하지 않습니다.</p>
          </a>
          <a id="paper-engine-api-spec" href="https://github.com/ethereum/execution-apis/tree/5aebdfdd45cadeb723be4bd45b4611b71c8b1c85/src/engine" target="_blank" rel="noreferrer" className="min-w-0 bg-background p-4 hover:bg-muted/30">
            <span className="font-mono text-[10px] font-black text-primary">O · STANDARD</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Ethereum Execution APIs v1.0.0-beta.7 · 5aebdfdd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">Independent method versioning, FCU ordering, PayloadStatus, payloadId, error code와 JWT authentication 계약을 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> Wire behavior의 정본입니다. Prysm의 package 구조·cache와 특정 execution client의 storage를 규정하지 않습니다.</p>
          </a>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li><code>P₁</code>과 <code>E₁</code>은 왜 같은 ID가 아닙니까? <strong>(답: P₁은 execution client 내부 build를 찾는 8-byte handle이고, E₁은 block hash와 실행 결과를 담은 payload입니다.)</strong></li>
          <li><code>newPayload(E₁)=VALID</code>인데도 E₁이 canonical head가 아닐 수 있는 이유는 무엇입니까? <strong>(답: VALID은 실행 규칙 판정이고, canonical branch는 Prysm의 fork choice와 이후 forkchoiceUpdated head pointer가 정합니다.)</strong></li>
          <li>HTTP 성공과 <code>SYNCING</code>을 왜 분리해 기록해야 합니까? <strong>(답: HTTP 성공은 응답을 받았다는 뜻이고 SYNCING은 필요한 실행 data가 없어 validity를 아직 확정하지 못했다는 protocol 상태입니다.)</strong></li>
        </ol>
      </section>

      <PrysmEngineAPIMapReturn />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: {
            id: "prysm",
            label: "Prysm v7.3.1 · Go",
            badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700",
          },
        }}
      />
    </article>
  );
}
