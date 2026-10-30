import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmBeaconAPILocator, { PrysmBeaconAPIMapReturn } from "./PrysmBeaconAPILocator";
import PrysmBeaconAPIFlowViz from "./viz/PrysmBeaconAPIFlowViz";

const requestFixture = [
  ["METHOD", "GET", "조회만 수행하는 HTTP method"],
  ["PATH", "/eth/v1/beacon/states/head/root", "현재 head state의 root 요청"],
  ["ACCEPT", "application/json", "이 endpoint가 지원하는 response 형식"],
  ["NODE VIEW", "head A · slot 105", "설명용 요청 시작 상태"],
] as const;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmBeaconAPILocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">state root 하나를 응답하려면 무엇을 몇 번 읽는가</h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            Client가 <code>GET /eth/v1/beacon/states/head/root</code>를 호출합니다. Prysm은 어느 HTTP route를 거쳐 root를 찾고, 왜 BeaconState를 다시 읽으며, 두 boolean은 어떤 root를 기준으로 계산할까요?
          </p>
        </div>
        <p>
          설명 시작 시점에 node가 canonical head로 보는 block을 <code>A</code>, 그 block이 선언한 post-state root를 <code>Sₐ</code>, block 자체의 root를 <code>Bₐ</code>라고 부르겠습니다. 세 표기는 이 글의 흐름만 추적하기 위한 설명용 이름입니다.
        </p>
        <PrysmBeaconAPIFlowViz />
        <p className="text-lg leading-8">
          결론부터 말하면 Prysm v7.3.1의 이 REST 요청은 gRPC gateway를 통과하지 않습니다. Go <code>ServeMux</code>에 직접 등록된 handler가 <strong>state root, BeaconState, optimistic mode를 차례로 조회</strong>하고, state에서 block root를 만들어 finality를 확인한 뒤 JSON으로 묶습니다.
        </p>
        <p>
          앞 글의 <Link to="/cs/blockchain/prysm-state-cache#overview">state generation</Link>은 root나 slot로 BeaconState를 찾을 때 내부에서 재사용될 수 있습니다. 이 글은 외부 HTTP 요청을 내부 조회로 연결하는 경로만 맡습니다. Validator duty와 서명, endpoint 공개 정책, 운영 SLO는 별도 글의 책임입니다.
        </p>
        <ContentBoundary article="prysm-beacon-api" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">입력</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Beacon API state root 요청의 설명용 입력">
          {requestFixture.map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{label}</span>
              <strong className="mt-1 block break-all text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          실제 root는 32-byte 값입니다. <code>head</code>는 고정 root가 아니라 “이 node가 지금 canonical head라고 보는 대상”을 뜻합니다.
        </p>
      </section>

      <section id="route" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">REST와 gRPC는 같은 입구가 아니다</h2>
        <p>
          <code>service.go</code>는 endpoint 목록의 method와 template를 조합해 <code>Router.HandleFunc</code>에 등록합니다. 바로 뒤에서는 Node·Health·BeaconChain·Validator gRPC service를 <code>grpc.Server</code>에 따로 등록합니다. 같은 process에 있다는 사실과 REST가 gRPC로 변환된다는 설명은 다릅니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr] sm:items-stretch" aria-label="Prysm REST와 gRPC 등록 경로 비교">
          <div className="min-w-0 bg-background p-4 ring-2 ring-inset ring-primary"><span className="text-[9px] font-bold text-primary">이 요청의 경로</span><strong className="mt-2 block text-sm">HTTP → Go ServeMux</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Endpoint handler가 JSON response를 직접 만듭니다.</p></div>
          <div className="hidden items-center bg-background px-3 text-muted-foreground sm:flex" aria-hidden>≠</div>
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">별도 surface</span><strong className="mt-2 block text-sm">gRPC → grpc.Server</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">Legacy·internal protobuf service가 별도로 등록됩니다.</p></div>
        </div>
        <p>
          State-root route는 <code>GET</code>만 받고 JSON Accept와 압축 인코딩 middleware를 사용합니다. Handler 밖에는 endpoint 이름별 요청 수와 처리 시간 계측이 있고, status가 400 이상이면 오류 counter도 증가합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="REST·gRPC 등록" onClick={() => sidebar.open("service-wiring", codeRefs["service-wiring"])} />
          <CodeViewButton label="Route와 계측" onClick={() => sidebar.open("rest-route", codeRefs["rest-route"])} />
        </div>
      </section>

      <section id="state-id" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">State ID를 실제 조회 대상으로 바꾼다</h2>
        <p>
          Beacon APIs v4.0.0의 <code>state_id</code>는 <code>head</code>·<code>genesis</code>·<code>finalized</code>·<code>justified</code>, decimal slot 또는 <code>0x</code>로 시작하는 state root를 받을 수 있습니다. 문자열 형식은 하나지만 lookup 경로는 같지 않습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="State ID 유형별 조회 의미">
          {[
            ["Symbolic", "head · genesis", "Node의 현재 view 또는 protocol 시작점"],
            ["Checkpoint", "finalized · justified", "Checkpoint epoch의 시작 state"],
            ["Explicit", "slot · state root", "숫자 slot 또는 32-byte state identity"],
          ].map(([kind, value, detail]) => (
            <div key={kind} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{kind}</span>
              <strong className="mt-2 block text-sm">{value}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          이 요청의 <code>head</code>는 <code>StateRoot()</code>에서 <code>HeadBlock()</code>으로, <code>State()</code>에서는 <code>HeadState()</code>로 해석됩니다. 같은 문자열이 같은 함수 한 번의 결과를 공유하는 구조가 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="State ID 해석" onClick={() => sidebar.open("state-id-resolution", codeRefs["state-id-resolution"])} />
        </div>
      </section>

      <section id="root" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">첫 조회는 BeaconState의 root다</h2>
        <p>
          Handler는 먼저 <code>Stater.StateRoot(ctx, "head")</code>를 호출합니다. <code>headStateRoot</code>는 현재 head block을 읽고 그 block header의 <code>state_root</code> field를 반환합니다. 이 값 <code>Sₐ</code>가 응답의 <code>data.root</code>가 됩니다.
        </p>
        <div className="not-prose grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-px bg-border p-px" aria-label="Head block에서 state root를 읽는 과정">
          <div className="min-w-0 bg-background p-3 text-center"><span className="text-[8px] text-muted-foreground">STATE ID</span><strong className="mt-1 block text-xs">head</strong></div>
          <div className="flex items-center justify-center bg-background text-primary" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-3 text-center"><span className="text-[8px] text-muted-foreground">HEAD BLOCK</span><strong className="mt-1 block text-xs">A</strong></div>
          <div className="flex items-center justify-center bg-background text-primary" aria-hidden>→</div>
          <div className="min-w-0 bg-background p-3 text-center ring-2 ring-inset ring-primary"><span className="text-[8px] text-primary">STATE ROOT</span><strong className="mt-1 block text-xs">Sₐ</strong></div>
        </div>
        <p>
          State root는 BeaconState SSZ tree의 HashTreeRoot입니다. Block root와 slot은 다른 identity입니다. API 명세도 <code>data.root</code>를 “HashTreeRoot of BeaconState object”로 정의합니다.
        </p>
      </section>

      <section id="state" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">두 번째 조회는 BeaconState object다</h2>
        <p>
          Root만 응답할 것처럼 보이지만 handler는 이어서 <code>Stater.State(ctx, "head")</code>를 호출합니다. 이유는 <code>finalized</code> field를 계산하려면 그 state를 만든 block의 root가 필요하기 때문입니다. <code>head</code> 경로는 <code>HeadState()</code>를 반환합니다.
        </p>
        <p>
          Slot·root 같은 explicit ID는 앞 글의 <Link to="/cs/blockchain/prysm-state-cache#lookup">state lookup과 replay</Link>로 이어질 수 있습니다. API handler가 cache와 DB를 직접 구현하는 것이 아니라 Stater가 그 책임을 감쌉니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Handler 호출 순서" onClick={() => sidebar.open("state-root-handler", codeRefs["state-root-handler"])} />
        </div>
      </section>

      <section id="metadata" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">두 boolean은 서로 다른 질문이다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2" aria-label="Execution optimistic과 finalized의 입력 비교">
          <div className="min-w-0 bg-background p-4"><span className="text-[9px] font-bold text-muted-foreground">execution_optimistic</span><strong className="mt-2 block text-sm">이 state의 execution payload가 아직 낙관 상태인가</strong><p className="mt-2 text-xs leading-5 text-muted-foreground"><code>head</code>이면 node의 현재 optimistic mode를 다시 조회합니다.</p></div>
          <div className="min-w-0 bg-background p-4 ring-2 ring-inset ring-primary"><span className="text-[9px] font-bold text-primary">finalized</span><strong className="mt-2 block text-sm">이 state를 만든 block이 finalized인가</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">State의 latest block header를 hash한 block root로 묻습니다.</p></div>
        </div>
        <p>
          <code>BlockRootFromState</code>는 latest block header의 <code>state_root</code>가 비어 있으면 현재 state의 HashTreeRoot로 보완한 뒤 header를 hash합니다. 따라서 응답의 <code>data.root</code>와 finality lookup의 key는 모두 32-byte root지만 같은 root가 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="Metadata 계산" onClick={() => sidebar.open("metadata", codeRefs.metadata)} />
        </div>
      </section>

      <section id="response" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">JSON으로 묶는다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="GetStateRoot JSON response field">
          {[
            ["data.root", "Sₐ", "BeaconState HashTreeRoot"],
            ["execution_optimistic", "false", "Execution validation 상태"],
            ["finalized", "false", "State를 만든 block의 finality"],
          ].map(([field, value, detail]) => (
            <div key={field} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{field}</span>
              <strong className="mt-2 block text-sm">{value}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Beacon APIs v4.0.0은 세 field를 모두 required로 정의합니다. 이 endpoint의 response content는 <code>application/json</code>입니다. “Beacon API가 SSZ도 쓸 수 있다”는 일반 사실을 이 endpoint의 SSZ 지원으로 확대하면 안 됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="OpenAPI 계약" onClick={() => sidebar.open("openapi-contract", codeRefs["openapi-contract"])} />
        </div>
      </section>

      <section id="consistency" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">head는 한 번만 고정되지 않는다</h2>
        <p>
          <strong>[A] 소스에서 확인한 검증 경계:</strong> handler는 <code>StateRoot(head)</code>, <code>State(head)</code>, <code>IsOptimistic(head)</code>를 별도로 호출하며 이들을 묶는 snapshot token을 전달하지 않습니다. 첫 호출 뒤 head가 A에서 B로 reorg되면 <code>data.root=Sₐ</code>인데 finality는 state B에서 만든 <code>Bᵦ</code>를 기준으로 계산될 가능성을 테스트해야 합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="요청 도중 head reorg가 발생하는 검증 시나리오">
          {[
            ["1", "StateRoot(head)", "A → Sₐ"],
            ["2", "Reorg", "A → B"],
            ["3", "State(head)", "B state"],
            ["4", "Response", "Sₐ + B metadata?"],
          ].map(([order, action, result]) => (
            <div key={order} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{order}</span>
              <strong className="mt-2 block text-sm">{action}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{result}</p>
            </div>
          ))}
        </div>
        <p>
          이 글은 혼합 응답을 실제로 재현했거나 운영 장애 빈도를 측정했다고 주장하지 않습니다. 확정된 사실은 호출들이 분리되어 있다는 것입니다. 검증하려면 각 호출 경계에서 head를 결정적으로 바꾸는 fixture와 response root·state-derived block root·metadata trace가 필요합니다.
        </p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패는 어느 status가 되는가</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-border"><th className="p-3">상황</th><th className="p-3">HTTP 결과</th><th className="p-3">멈추는 위치</th></tr></thead>
            <tbody>
              {[
                ["state_id가 비어 있음", "400 Bad Request", "Handler의 path 검사"],
                ["state ID 형식 해석 실패", "400 Bad Request", "Stater parse"],
                ["State root·state·slot coverage 없음", "404 Not Found", "Lookup error mapping"],
                ["State 조회 뒤 optimistic 판정 실패", "오류 응답 후 종료", "Metadata 계산 전"],
                ["Latest block header 또는 hash 실패", "500 Internal Server Error", "Finality 판정 전"],
                ["그 밖의 내부 lookup 오류", "500 Internal Server Error", "오류가 난 단계"],
              ].map(([situation, result, stop]) => <tr key={situation} className="border-b border-border/70"><td className="p-3 font-mono text-xs text-primary">{situation}</td><td className="p-3">{result}</td><td className="p-3 text-muted-foreground">{stop}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p>
          Handler는 한 단계라도 실패하면 JSON success response를 만들지 않습니다. 다만 앞 단계에서 읽은 값들을 transaction처럼 rollback하는 구조도 아닙니다. 모두 조회이므로 핵심은 side effect rollback이 아니라 어떤 view를 읽었는지 추적하는 일입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton label="오류 mapping" onClick={() => sidebar.open("error-mapping", codeRefs["error-mapping"])} />
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <a id="paper-prysm-rpc-source" href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain/rpc" target="_blank" rel="noreferrer" className="min-w-0 bg-background p-4 hover:bg-muted/30">
            <span className="font-mono text-[10px] font-black text-primary">O · Implementation</span>
            <strong className="mt-2 block break-keep text-sm leading-6">OffchainLabs Prysm v7.3.1 · 96d418cd</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">REST·gRPC registration, route middleware, GetStateRoot 호출 순서, state ID lookup과 metadata·오류 mapping을 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> 이 release의 source behavior입니다. Moving develop나 다른 consensus client에 일반화하지 않습니다.</p>
          </a>
          <a id="paper-beacon-api-spec" href="https://github.com/ethereum/beacon-APIs/tree/88fc9402c6a1821b6e9ae4e3b8ae0a22f1141203" target="_blank" rel="noreferrer" className="min-w-0 bg-background p-4 hover:bg-muted/30">
            <span className="font-mono text-[10px] font-black text-primary">O · Standard</span>
            <strong className="mt-2 block break-keep text-sm leading-6">Ethereum Beacon APIs v4.0.0 · 88fc9402</strong>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">State ID의 허용 형태, GetStateRoot의 JSON response field와 400·404·500 status 계약을 확인했습니다.</p>
            <p className="mt-2 break-keep text-xs leading-5"><strong>범위:</strong> Wire contract의 정본입니다. Prysm 내부 호출 순서나 snapshot 구현을 규정하지 않습니다.</p>
          </a>
        </div>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li>이 REST 요청이 gRPC server를 통과하지 않는 근거는 무엇입니까? <strong>(답: endpoint는 Router.HandleFunc에 직접 등록되고 gRPC service는 grpc.Server에 별도로 등록됩니다.)</strong></li>
          <li><code>StateRoot(head)</code>와 <code>State(head)</code>는 각각 어디서 읽습니까? <strong>(답: 전자는 HeadBlock의 state_root, 후자는 HeadState입니다.)</strong></li>
          <li><code>data.root</code>와 finality lookup의 root는 어떻게 다릅니까? <strong>(답: data.root는 BeaconState HashTreeRoot이고 finality는 그 state의 latest block header를 hash한 block root로 판정합니다.)</strong></li>
          <li>이 endpoint가 SSZ response를 반환한다고 말할 수 없는 이유는 무엇입니까? <strong>(답: 고정한 OpenAPI와 Prysm route 모두 response를 application/json으로만 정의하기 때문입니다.)</strong></li>
          <li>Reorg 경계를 왜 실제 장애가 아니라 검증 대상으로 표시했습니까? <strong>(답: 분리된 head 조회는 source에서 확인했지만 혼합 응답을 결정적으로 재현하거나 빈도를 측정하지 않았기 때문입니다.)</strong></li>
        </ol>
      </section>

      <PrysmBeaconAPIMapReturn />

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
