import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import RethNetworkLocator, { RethNetworkMapReturn } from "./RethNetworkLocator";
import { rethNetworkV281Tree } from "./fileTree";
import { RETH_NETWORK_PROJECT_META, rethNetworkCodeRefs } from "./modernCodeRefs";
import RethPeerSessionViz from "./viz/RethPeerSessionViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethNetworkLocator current="reth-net" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">발견한 주소는 언제 거래와 블록을 주고받는 피어가 됩니까?</h2>
        </div>
        <RethPeerSessionViz />
        <p className="text-lg leading-8">
          <Label>A</Label>Reth는 endpoint를 얻은 뒤 ECIES가 증명한 identity, Hello의 공통 capability, ETH Status의 chain 호환성을 차례로 확인합니다. 이 검사를 모두 통과한 연결만 active session이 되어 ETH 메시지를 처리합니다.
        </p>
        <p>
          이 글은 <Link to="/cs/blockchain/node-architecture#deeper">이더리움 노드 지도의 실행 P2P</Link> 영역을 확대합니다. 버전·설정 변경을 채택할지 판단하는 절차는 <Link to="/cs/blockchain/reth-net-validation#overview">실무 검증 글</Link>로 분리합니다.
        </p>
      </section>

      <section id="fixture" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">연결 사례</h2>
        <p>
          설명할 연결은 로컬 Reth와 상대 노드 한 대 사이에서 시작합니다. 상대 endpoint는 문서용 주소 <code>203.0.113.20:30303</code>입니다. 로컬은 <code>eth/69·67·66</code>, 상대는 <code>eth/68·67·66</code>을 광고합니다. 두 노드가 같은 chain과 genesis, 호환되는 Fork ID를 쓴다는 부분은 흐름을 설명하기 위한 가정입니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["후보 endpoint", "203.0.113.20:30303", "아직 자료 권한 없음"],
            ["로컬 capability", "eth/69 · 67 · 66", "Reth test 입력"],
            ["상대 capability", "eth/68 · 67 · 66", "Reth test 입력"],
            ["공통 결과", "eth/67", "가장 높은 정확한 교집합"],
          ].map(([title, value, note]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <strong className="text-xs">{title}</strong>
              <code className="mt-2 block break-all text-[11px] text-primary">{value}</code>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
        <p>
          Capability 집합과 <code>eth/67</code> 결과는 Reth v2.8.1 통합 테스트에 있는 값입니다. Endpoint와 chain context는 실제 운영 측정값이나 특정 공개 노드를 뜻하지 않습니다.
        </p>
      </section>

      <section id="discovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">후보 주소</h2>
        <p>
          Bootnode, DNS 또는 활성화한 discovery 경로에서 연결을 시도할 endpoint를 찾습니다. 이 단계의 결과는 <strong>dial candidate</strong>입니다. 서명된 node record가 있더라도 현재 접속 가능성, 같은 chain 사용 여부와 이후 메시지의 유효성은 아직 모릅니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">확인한 사실</th><th className="px-3 py-3">아직 확인하지 않은 사실</th><th className="px-3 py-3">현재 상태</th></tr></thead>
            <tbody>
              <tr className="border-t border-border"><td className="px-3 py-3">Node ID와 endpoint 후보</td><td className="px-3 py-3">Reachability·Hello ID·공통 protocol·chain</td><td className="px-3 py-3 font-bold text-primary">candidate</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Reth v2.8.1에는 discv4와 discv5 관련 구현이 모두 있습니다. 이 글은 특정 variant가 항상 기본이라고 단정하지 않고, 실제로 켠 discovery 설정을 실무 검증의 version receipt에 남깁니다.
        </p>
      </section>

      <section id="identity" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">ECIES Identity</h2>
        <p>
          TCP 연결 뒤 ECIES handshake는 상대가 어떤 public key의 private key를 가졌는지 확인하고 암호화된 RLPx stream을 만듭니다. Reth는 여기서 얻은 <code>remote_id</code>를 세션의 기준 identity로 사용합니다.
        </p>
        <p>
          이어지는 Hello에도 node ID가 있지만, Hello가 다른 ID를 말해 세션 이름을 바꿀 수는 없습니다. 두 값이 다르면 Reth는 <code>UnexpectedHandshakeIdentity</code>로 연결을 끝내며 extra protocol에도 상대를 넘기지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("session-auth", rethNetworkCodeRefs["session-auth"])} />
          <span className="text-xs text-muted-foreground">ECIES identity와 Hello ID를 결속하는 실제 코드</span>
        </div>
      </section>

      <section id="capability" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Capability</h2>
        <p>
          Hello는 지원하는 subprotocol의 이름과 version을 보냅니다. Reth는 이름과 version이 모두 같은 항목만 교집합에 남기고, 같은 이름에서는 가장 높은 version을 고릅니다. Version 번호 사이를 자동으로 메우지 않습니다.
        </p>
        <div className="not-prose border-y border-border py-4">
          <ol className="grid gap-3 text-sm leading-6 sm:grid-cols-4">
            {[
              ["1 · 로컬", "{69, 67, 66}"],
              ["2 · 상대", "{68, 67, 66}"],
              ["3 · 교집합", "{67, 66}"],
              ["4 · 선택", "max = eth/67"],
            ].map(([title, value]) => (
              <li key={title} className="border-l-2 border-primary/45 pl-3"><strong className="block text-xs">{title}</strong><code className="mt-1 block text-xs text-primary">{value}</code></li>
            ))}
          </ol>
        </div>
        <p>
          교집합이 비면 <code>NoSharedCapabilities</code>로 끝납니다. <code>eth/67</code>을 골랐다고 세션이 active가 되는 것도 아닙니다. 이 선택은 다음 Status 메시지를 어떤 schema로 해석할지만 정합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("capability", rethNetworkCodeRefs.capability)} />
          <span className="text-xs text-muted-foreground">교집합과 이름별 최고 version 선택</span>
          <CodeViewButton onClick={() => sidebar.open("session-test", rethNetworkCodeRefs["session-test"])} />
          <span className="text-xs text-muted-foreground">같은 숫자를 쓰는 통합 테스트</span>
        </div>
      </section>

      <section id="status" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">ETH Status</h2>
        <p>
          Reth는 선택한 version으로 상대 Status를 decode한 뒤 genesis hash, protocol version, chain과 Fork ID를 local 값에 대조합니다. 응답이 없거나 메시지가 너무 크거나 decode가 실패해도 active session을 만들지 않습니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">Status 항목</th><th className="px-3 py-3">검사</th><th className="px-3 py-3">통과가 뜻하는 것</th><th className="px-3 py-3">뜻하지 않는 것</th></tr></thead>
            <tbody>{[
              ["version", "협상한 eth/67과 일치", "같은 wire schema", "이후 message가 유효함"],
              ["genesis·chain", "local 설정과 일치", "같은 chain identity 후보", "상대가 정직함"],
              ["Fork ID", "local fork filter 통과", "현재 일정과 설명 가능한 호환성", "받은 block이 유효함"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          이 검사는 상대의 head 자체를 검증하거나 block execution을 대신하지 않습니다. Status를 통과한 뒤에도 모든 block과 transaction은 각자의 validation 경로를 거쳐야 합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("status", rethNetworkCodeRefs.status)} />
          <span className="text-xs text-muted-foreground">Status 응답과 네 호환성 검사를 읽는 실제 코드</span>
        </div>
      </section>

      <section id="data-path" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Active Session</h2>
        <p>
          Status handshake가 성공하면 pending task는 <code>Established</code> event를 보냅니다. SessionManager는 같은 peer와 이미 연결됐는지, inbound slot이 남았는지 확인한 뒤 <code>ActiveSession</code>을 만들고 active map에 넣습니다. 그때부터 ETH 자료 경로가 열립니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">
          {[
            ["1", "거래 해시 알림"],
            ["2", "Known set 확인"],
            ["3", "모르는 hash 요청"],
            ["4", "Transaction bytes 응답"],
            ["5", "TxPool 별도 검증"],
          ].map(([index, body]) => <div key={index} className="min-w-0 bg-background p-3"><span className="font-mono text-[9px] font-black text-primary">{index}</span><strong className="mt-2 block break-keep text-xs leading-5">{body}</strong></div>)}
        </div>
        <p>
          Announcement는 새 자료의 존재를 알려 주는 bounded push입니다. 수신 노드는 이미 아는 hash를 거르고 필요한 bytes만 request/response로 가져옵니다. 응답을 받았다는 사실은 TxPool admission이나 block validity를 뜻하지 않습니다.
        </p>
        <p>
          Reth는 command channel, inflight request와 outgoing queue를 따로 관리합니다. 느린 peer가 소비하는 속도보다 메시지가 빨리 쌓이면 drop, timeout 또는 disconnect 같은 정책으로 자원을 제한해야 하며, 구체적인 숫자는 release와 설정에 귀속합니다.
        </p>
      </section>

      <section id="failure-boundaries" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 경계</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[52rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">실패</th><th className="px-3 py-3">마지막 상태</th><th className="px-3 py-3">권한</th><th className="px-3 py-3">필요한 정리</th></tr></thead>
            <tbody>{[
              ["TCP·ECIES 실패", "candidate 또는 pending", "ETH message 불가", "pending slot·socket 회수"],
              ["Hello ID 불일치", "authenticated transport", "extra protocol 불가", "UnexpectedHandshakeIdentity"],
              ["공통 capability 없음", "RLPx Hello 완료", "Status 시작 안 함", "pending session 제거"],
              ["Status 무응답·chain 불일치", "eth schema 선택", "active 승격 안 함", "timeout 또는 protocol breach"],
              ["Active 중 연결 종료", "active session", "자료 경로 닫힘", "active slot·inflight request 회수"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          모든 종료를 같은 “피어 실패”로 합치면 상대 protocol 위반과 로컬 용량 부족을 구분할 수 없습니다. 재시도, 평판과 영구 차단은 종료 이유와 관측 기간을 읽는 별도 정책이며, 시스템 자체의 공통 의무는 세션과 자원을 남기지 않는 것입니다.
        </p>
      </section>

      <section id="source" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">구현 근거</h2>
        <CitationBlock source="Reth v2.8.1 · session authentication" citeKey={1} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/net/network/src/session/mod.rs">
          <p><Label>O</Label>ECIES identity, Hello ID, mandatory ETH capability와 Status를 순서대로 확인한 뒤 <code>Established</code>를 만드는 구현입니다.</p>
          <p><b>범위:</b> 특정 peer limit·timeout·queue 크기나 대상 환경의 복구 결과를 보장하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Reth v2.8.1 · capability negotiation and tests" citeKey={2} type="code" href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/net/eth-wire/src/capability.rs">
          <p><Label>O</Label>정확한 name/version 교집합과 이름별 최고 version 선택을 확인한 고정 source입니다.</p>
          <p><b>범위:</b> <code>Eth72</code> enum이 존재해도 같은 릴리스의 <code>LATEST</code>와 기본 <code>ALL_VERSIONS</code>는 eth/71까지입니다. 실제 광고 목록을 별도로 확인해야 합니다.</p>
        </CitationBlock>
        <CitationBlock source="Ethereum devp2p · RLPx and eth specifications @ 2c19a28" citeKey={3} type="paper" href="https://github.com/ethereum/devp2p/tree/2c19a28b25c29487773ad6b07243e290fa8d65ec">
          <p><Label>O</Label>Hello·capability 협상과 Status, transaction announcement·request/response의 wire 의미를 확인한 공식 규격 snapshot입니다.</p>
          <p><b>범위:</b> Reth 내부 queue와 peer scoring, block·transaction validity를 정하지 않습니다.</p>
        </CitationBlock>
      </section>

      <section id="self-check" className="space-y-4 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 문제</h2>
        <ol className="space-y-3 pl-5 text-sm leading-7">
          <li>ECIES identity와 Hello ID를 따로 비교하는 이유는 무엇입니까? <b>(답: ECIES Identity)</b></li>
          <li><code>{`{69,67,66}`}</code>과 <code>{`{68,67,66}`}</code>에서 왜 eth/67을 고릅니까? <b>(답: Capability)</b></li>
          <li>Status를 통과해도 받은 거래와 블록을 다시 검증해야 하는 이유는 무엇입니까? <b>(답: ETH Status·Active Session)</b></li>
        </ol>
      </section>

      <RethNetworkMapReturn current="reth-net" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={rethNetworkCodeRefs}
        fileTrees={{ reth: rethNetworkV281Tree }}
        projectMetas={RETH_NETWORK_PROJECT_META}
      />
    </article>
  );
}
