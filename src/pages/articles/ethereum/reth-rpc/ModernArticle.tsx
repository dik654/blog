import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExecutionClientLocator from "../shared/ExecutionClientLocator";
import { rethRpcCodeRefs, RETH_RPC_PROJECT_META } from "./modernCodeRefs";
import { rethRpcV281Tree } from "./modernFileTree";
import RethRpcLocator, { RethRpcMapReturn } from "./RethRpcLocator";
import RethRpcBoundaryViz from "./viz/RethRpcBoundaryViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethRpcLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            같은 JSON-RPC인데도 지갑 요청과 합의 클라이언트 요청을 왜 서로 다른 입구로 받습니까?
          </h2>
        </div>
        <RethRpcBoundaryViz />
        <p className="text-lg leading-8">
          <Label>A</Label>JSON-RPC는 요청과 응답의 모양을 정할 뿐, 호출자의 권한이나 메서드의 의미까지 같게 만들지 않습니다. Reth v2.8.1은 공개 transport module과 JWT 인증 Engine module을 별도로 구성합니다. 공개 경로는 선택된 기록을 읽고 거래를 접수합니다. Engine 경로는 후보를 실행·검증하고 합의 클라이언트가 정한 forkchoice를 전달받습니다.
        </p>
        <p>
          이 글은 <Link to="/cs/blockchain/node-architecture#case">이더리움 노드 전체 지도의 A→B 10 ETH 송금</Link>을 그대로 사용합니다. 먼저 지갑이 A의 현재 잔액을 묻고, 이어서 합의 클라이언트가 같은 송금을 담은 후보를 검증해 달라고 요청합니다. 특정 배포의 방화벽, rate limit, SLO와 제품 선택은 다루지 않습니다.
        </p>
        <ContentBoundary article="reth-rpc" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">한 실행 클라이언트에 두 요청이 도착합니다</h2>
        <ExecutionClientLocator
          current="json-rpc"
          path={["json-rpc", "engine-api", "provider", "execution", "execution-store"]}
          question="잔액을 읽는 요청과 후보를 검증하는 요청은 어느 경계에서 갈라지고, 각각 어떤 상태까지 바꿀 수 있습니까?"
        />
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Reth RPC 설명에 사용할 공개 조회와 Engine 요청의 시작 상태">
          {[
            ["현재 canonical", "block 1,000", "A = 100 ETH · B = 0 ETH"],
            ["공개 요청", "eth_getBalance", "A · latest · id 17"],
            ["Engine 요청", "newPayloadV4", "A→B 10 ETH 후보 · id 42"],
            ["후보 실행 결과", "A = 89.999958", "아직 canonical 선택 전"],
          ].map(([title, value, note]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <strong className="text-xs">{title}</strong>
              <code className="mt-2 block break-all text-[11px] text-primary">{value}</code>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
        <p>
          숫자는 전체 지도와 경로를 맞추기 위한 설명용 값입니다. 공개 조회가 먼저 도착했을 때 후보 1,001은 아직 선택된 기록이 아니므로 <code>latest</code>는 block 1,000의 A 잔액 100 ETH를 가리킵니다. 반대로 Engine 요청은 후보 1,001이 실행 규칙에 맞는지를 묻습니다. 두 요청의 JSON 본문이 비슷해도 답할 질문이 다릅니다.
        </p>
      </section>

      <section id="public-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공개 listener는 켠 transport와 허용 module만 노출합니다</h2>
        <p>
          Reth의 공개 HTTP와 WebSocket server는 자동으로 모든 메서드를 외부에 내놓지 않습니다. <code>transport_rpc_module_config</code>는 HTTP와 WS가 켜졌는지 먼저 보고, 각 transport에 선택한 RPC module을 붙입니다. 별도 선택이 없으면 해당 transport의 standard module 집합을 사용합니다.
        </p>
        <p>
          Engine API는 같은 설정 함수에서조차 다른 객체로 만들어집니다. <code>auth_server_config</code>는 <code>auth_addr</code>와 <code>auth_port</code>, JWT secret을 받아 <code>AuthServerConfig</code>를 만듭니다. 그래서 공개 listener의 module 목록과 Engine listener의 인증 여부를 하나의 메서드 표로 합치지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("rpc-config", rethRpcCodeRefs["rpc-config"])} />
          <span className="text-xs text-muted-foreground">공개 transport 선택과 auth server 설정의 실제 분기</span>
        </div>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">경계</th><th className="px-3 py-3">주 호출자</th><th className="px-3 py-3">입장 조건</th><th className="px-3 py-3">상태 권한</th></tr></thead>
            <tbody>
              {[
                ["Public HTTP·WS", "지갑·애플리케이션", "listener 활성화 · module 선택", "canonical 조회 · 거래 접수 · simulation"],
                ["Authenticated Engine", "합의 클라이언트", "별도 listener · JWT", "payload 검증 · build 요청 · forkchoice 전달"],
              ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section id="public-read" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">eth_getBalance는 block view 하나를 고른 뒤 계정 상태를 읽습니다</h2>
        <p>
          공개 listener가 <code>eth_getBalance</code>를 Eth module로 전달하면 method handler는 주소와 선택적 <code>BlockId</code>를 받습니다. Handler 자체가 DB layout을 알지는 않습니다. <code>EthState::balance</code>에 읽기를 맡기고, 이 helper가 selector에 맞는 state provider를 고릅니다.
        </p>
        <p>
          이 사례의 selector는 <code>latest</code>입니다. <code>spawn_blocking_io_with_state</code>는 blocking I/O 작업 안에서 <code>latest_state()</code>를 한 번 얻고, 그 provider로 A의 account balance를 읽습니다. 후보 1,001을 검증하고 있다는 사실만으로 이 canonical read view가 바뀌지는 않습니다. 따라서 첫 응답은 A의 기존 잔액 100 ETH입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("eth-balance", rethRpcCodeRefs["eth-balance"])} />
          <CodeViewButton onClick={() => sidebar.open("state-view", rethRpcCodeRefs["state-view"])} />
          <span className="text-xs text-muted-foreground">Method handler → state view → account balance</span>
        </div>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="eth_getBalance가 응답을 만드는 네 단계">
          {[
            ["01", "요청 해석", "A · latest · id 17"],
            ["02", "View 선택", "canonical block 1,000"],
            ["03", "계정 읽기", "A.balance = 100 ETH"],
            ["04", "JSON 응답", "id 17 · result 100 ETH"],
          ].map(([number, title, body]) => (
            <div key={number} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{number}</span>
              <strong className="mt-1 block text-xs">{title}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          계정이 그 view에 없으면 Reth의 balance helper는 0을 반환합니다. 반면 block 자체가 없거나 historical state가 없어 읽지 못하면 provider error입니다. “계정이 없어서 0”과 “요청한 상태를 읽지 못함”을 같은 성공값으로 만들지 않는 이유입니다.
        </p>
      </section>

      <section id="engine-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Engine 요청은 JWT를 통과한 뒤에야 메서드를 해석합니다</h2>
        <p>
          합의 클라이언트의 <code>engine_newPayloadV4</code>는 공개 Eth module로 가지 않습니다. Auth server는 raw HTTP request에 <code>AuthHttpLayer</code>를 먼저 적용합니다. JWT 검증을 통과한 요청만 JSON-RPC parser와 auth RPC module에 도달합니다.
        </p>
        <p>
          JWT가 보장하는 범위도 제한됩니다. Execution APIs 규격은 Engine API를 기존 JSON-RPC와 독립된 port에 두고 HS256 JWT로 인증하도록 정합니다. 그러나 이 인증은 통신 내용을 암호화하지 않으며, network traffic을 읽을 수 있는 공격자의 replay까지 막는 장치도 아닙니다. 그래서 “JWT 있음”을 “인터넷에 안전하게 공개 가능”으로 읽으면 안 됩니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("auth-server", rethRpcCodeRefs["auth-server"])} />
          <span className="text-xs text-muted-foreground">JWT HTTP layer가 method dispatch보다 앞에 놓이는 실제 순서</span>
        </div>
      </section>

      <section id="engine-request" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">newPayloadV4는 후보를 검증하지만 head를 선택하지 않습니다</h2>
        <p>
          인증을 통과한 요청은 <code>EngineApiServer</code>의 V4 handler로 들어갑니다. Handler는 execution payload와 blob versioned hash, parent beacon block root, execution requests를 하나의 <code>ExecutionData</code>로 묶습니다. 그다음 validator가 활성 fork의 V4 field 계약을 확인합니다.
        </p>
        <p>
          형식과 fork version이 맞으면 <code>beacon_consensus.new_payload</code>가 후보를 consensus engine에 전달합니다. 부모 상태를 갖고 있고 실행 결과가 header commitment와 맞는 이 사례에서는 <code>VALID</code>를 반환합니다. 하지만 VALID는 후보의 실행 결과가 맞다는 뜻입니다. 후보를 현재 canonical head로 선택했다는 뜻은 아닙니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("engine-new-payload", rethRpcCodeRefs["engine-new-payload"])} />
          <span className="text-xs text-muted-foreground">V4 wire fields → version 검증 → PayloadStatus</span>
        </div>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[42rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">응답</th><th className="px-3 py-3">뜻</th><th className="px-3 py-3">아직 하지 않은 일</th></tr></thead>
            <tbody>
              {[
                ["VALID", "실행 결과가 유효함", "canonical head 선택"],
                ["INVALID", "실행 규칙이나 commitment를 위반함", "다른 후보까지 거절"],
                ["SYNCING", "판정할 부모·상태가 아직 부족함", "유효·무효 확정"],
              ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section id="canonical-handoff" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">후속 forkchoiceUpdated가 공개 조회의 latest를 바꿉니다</h2>
        <p>
          합의 클라이언트는 별도 <code>forkchoiceUpdated</code> 요청으로 head·safe·finalized hash를 전달합니다. Block 1,001이 head로 선택되고 Reth가 그 chain view를 반영한 뒤에야 공개 RPC의 <code>latest</code>가 새 canonical state를 가리킵니다.
        </p>
        <p>
          이제 지갑이 같은 <code>eth_getBalance(A, latest)</code>를 다시 보내면 public 경로는 A의 잔액 89.999958 ETH를 읽습니다. Engine API가 잔액 조회에 대신 답한 것도 아니고, 공개 RPC가 forkchoice를 정한 것도 아닙니다. 두 경로가 각자 맡은 상태를 바꾼 결과가 provider의 canonical view에서 만납니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="후보 검증에서 공개 잔액 변경까지의 상태 전이">
          {[
            ["newPayloadV4", "VALID", "실행 유효성 확인"],
            ["forkchoiceUpdated", "head = 1,001", "canonical 선택 반영"],
            ["eth_getBalance", "89.999958 ETH", "새 latest view 읽기"],
          ].map(([title, value, note], index) => (
            <div key={title} className="relative bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs">{title}</strong>
              <code className="mt-2 block break-all text-[11px] text-primary">{value}</code>
              <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground">{note}</p>
              {index < 2 ? <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-0.5 text-primary sm:block">→</span> : null}
            </div>
          ))}
        </div>
      </section>

      <section id="failure-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패는 발생한 경계에서 멈추고 서로 다른 증거를 남깁니다</h2>
        <p>
          잘못됐거나 시각 범위를 벗어난 JWT는 auth layer에서 막히므로 Engine handler가 실행되지 않습니다. JWT가 맞더라도 활성 fork와 맞지 않는 V4 field는 Engine validator가 거절합니다. 공개 listener로 <code>engine_newPayloadV4</code>를 보냈는데 그 module에 method가 등록되지 않았다면 JSON-RPC의 method-not-found 경계에서 끝납니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["JWT 거절", "Auth HTTP layer", "method 실행 전 종료"],
            ["Version·field 거절", "Engine validator", "candidate 실행 전 종료"],
            ["Public method 없음", "Transport module", "Engine 경로로 우회하지 않음"],
          ].map(([title, owner, result]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <strong className="text-xs">{title}</strong>
              <code className="mt-2 block break-all text-[11px] text-primary">{owner}</code>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{result}</span>
            </div>
          ))}
        </div>
        <p>
          이것은 운영자가 정할 방화벽 규칙이나 장애 대응 Runbook이 아니라 시스템이 가진 경계 자체의 실패 동작입니다. 어느 주소에 bind할지, 앞단 proxy에서 얼마나 제한할지, secret을 어떻게 회전할지는 별도 실무 글에서 대상 환경과 함께 결정해야 합니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Reth v2.8.1 구현과 고정한 Engine API 규격까지만 결론을 냅니다</h2>
        <CitationBlock source="Reth v2.8.1 · RPC builder와 Eth API" citeKey={1} href="https://github.com/paradigmxyz/reth/tree/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/rpc">
          <p><Label>O</Label>공개 transport module 선택, auth server 분리, <code>eth_getBalance</code> handler와 state provider 선택 경로를 확인했습니다.</p>
          <p><strong>범위:</strong> Commit <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>에 고정한 구현입니다. 다른 release의 module 집합이나 기본 설정까지 일반화하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Engine API" citeKey={2} href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/rpc/rpc-engine-api/src/engine_api.rs">
          <p><Label>O</Label><code>engine_newPayloadV4</code>가 wire fields를 조립하고 version-specific validation 뒤 consensus engine에 전달하는 경로를 확인했습니다.</p>
          <p><strong>범위:</strong> Handler와 내부 전달 경계의 근거이며, 실제 node의 지연이나 처리량 측정은 아닙니다.</p>
        </CitationBlock>
        <CitationBlock source="Ethereum Execution APIs · authentication과 Prague" citeKey={3} href="https://github.com/ethereum/execution-apis/tree/03911ffc053b8b806123f1fc237184b0092a485a/src/engine">
          <p><Label>O</Label>Engine API의 독립 port, JWT 인증 범위, V4 method와 payload status 계약을 확인했습니다.</p>
          <p><strong>범위:</strong> 이 규격은 Reth의 public module 구성이나 대상 환경의 network policy를 정하지 않습니다.</p>
        </CitationBlock>
        <p><Label>M</Label>대상 장비에서 RPC 지연, 동시 요청 수, request size, JWT 실패율과 Engine 처리량은 측정하지 않았습니다.</p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>두 요청이 모두 JSON-RPC인데도 같은 listener로 처리할 필요가 없는 이유는 무엇입니까? <strong>(답: JSON-RPC는 봉투 형식이고 호출자·허용 method·권한은 별도 경계이기 때문입니다.)</strong></li>
          <li>후보 1,001이 VALID인데 첫 eth_getBalance가 100 ETH를 반환하는 이유는 무엇입니까? <strong>(답: newPayload의 VALID는 실행 유효성이고, 아직 forkchoice로 canonical head가 바뀌지 않았기 때문입니다.)</strong></li>
          <li>JWT가 틀린 Engine 요청은 어디까지 도달합니까? <strong>(답: Auth HTTP layer에서 끝나며 JSON-RPC method handler까지 도달하지 않습니다.)</strong></li>
          <li>계정이 없는 경우의 잔액 0과 historical state가 없어 읽지 못한 경우는 왜 다릅니까? <strong>(답: 전자는 유효한 state view의 값이고, 후자는 요청한 view를 읽지 못한 오류이기 때문입니다.)</strong></li>
        </ol>
      </section>

      <RethRpcMapReturn />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={rethRpcCodeRefs}
        fileTrees={{ reth: rethRpcV281Tree }}
        projectMetas={RETH_RPC_PROJECT_META}
      />
    </article>
  );
}
