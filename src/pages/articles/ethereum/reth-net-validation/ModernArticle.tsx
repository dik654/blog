import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import RethNetworkLocator, { RethNetworkMapReturn } from "../reth-net/RethNetworkLocator";
import { rethNetworkV281Tree } from "../reth-net/fileTree";
import { RETH_NETWORK_PROJECT_META, rethNetworkCodeRefs } from "../reth-net/modernCodeRefs";
import RethNetworkValidationViz from "./viz/RethNetworkValidationViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethNetworkLocator current="reth-net-validation" />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">네트워크 변경이 같은 세션 결과를 내고 안전하게 되돌아오는지 어떻게 검증합니까?</h2>
        </div>
        <RethNetworkValidationViz />
        <p className="text-lg leading-8">
          <Label>A</Label>Base와 candidate에 같은 peer·capability·Status·message·fault 입력을 독립 재생합니다. Active session 결과와 종료 이유, slot·queue 정리, restart와 rollback이 같을 때만 성능을 비교합니다.
        </p>
        <p>
          출발점은 <Link to="/cs/blockchain/reth-net#identity">identity 결속</Link>, <Link to="/cs/blockchain/reth-net#capability">capability 선택</Link>, <Link to="/cs/blockchain/reth-net#status">Status 검사</Link>, <Link to="/cs/blockchain/reth-net#data-path">자료 교환</Link>과 <Link to="/cs/blockchain/reth-net#failure-boundaries">실패 정리</Link>입니다. 이 글은 그 메커니즘을 반복하지 않고 변경 채택에 필요한 증거를 정합니다.
        </p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 입력</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[54rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">고정 영역</th><th className="px-3 py-3">기록할 값</th><th className="px-3 py-3">빠지면 생기는 혼동</th></tr></thead>
            <tbody>{[
              ["Binary", "Reth tag·commit·digest·Cargo features", "구현과 protocol 지원 차이"],
              ["Network config", "peer limits·timeouts·queue·discv4/v5·bootnodes", "기본값과 실제 설정 차이"],
              ["Chain", "ChainSpec digest·genesis·Fork ID schedule", "Status compatibility 차이"],
              ["Candidate corpus", "node ID·endpoint·record·DNS answers", "발견 입력과 dial 순서 차이"],
              ["Handshake corpus", "ECIES key·Hello capabilities·Status bytes", "identity·version·chain 차이"],
              ["Runtime", "clock·random seed·fault schedule·OS·NIC", "timeout·순서·성능 차이"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          <Label>O</Label>기준 구현은 Reth v2.8.1 release commit <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>입니다. 공식 devp2p 규격 snapshot은 <code>2c19a28b</code>로 고정합니다. Main branch나 현재 문서의 protocol 번호를 이전 binary에 소급하지 않습니다.
        </p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">상태 소유권</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[52rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 writer</th><th className="px-3 py-3">검증기가 읽을 증거</th></tr></thead>
            <tbody>{[
              ["Candidate·dial 시도", "Discovery·Peers manager", "source·endpoint·attempt·outcome"],
              ["Authenticated identity", "ECIES stream", "remote public key·Hello ID"],
              ["공유 capability", "RLPx Hello 협상", "local·remote set·selected version"],
              ["ETH compatibility", "EthHandshake·ForkFilter", "genesis·version·chain·Fork ID outcome"],
              ["Pending·active slot", "SessionManager", "session ID·state transition·close reason"],
              ["자료 유효성", "ETH handler·TxPool·sync validator", "accepted·rejected object reason"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          Session collector는 이 상태들을 관측해 run receipt를 만들 뿐, active map이나 peer score를 고치면 안 됩니다. 같은 peer 상태를 기존 manager와 새 controller가 동시에 쓰도록 만들면 실험 자체가 다른 시스템이 됩니다.
        </p>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정상 기준선</h2>
        <p>
          정상 fixture는 개념 글의 capability 집합을 그대로 씁니다. 로컬 <code>{`{69,67,66}`}</code>과 상대 <code>{`{68,67,66}`}</code>은 <code>eth/67</code>을 고르고, 같은 genesis·chain·호환 Fork ID를 보낸 뒤 active session 하나를 만듭니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Handshake receipt", "authenticated ID · Hello ID · eth/67 · Status PASS"],
            ["Session receipt", "pending 1→0 · active 0→1 · reason none"],
            ["Message receipt", "announcement · request ID · response digest · validator outcome"],
          ].map(([title, value]) => <div key={title} className="min-w-0 bg-background p-4"><strong className="text-xs">{title}</strong><code className="mt-2 block break-words text-[10px] leading-5 text-primary">{value}</code></div>)}
        </div>
        <p>
          이 receipt는 Reth가 내장 형식으로 제공한다고 주장하는 자료가 아닙니다. <Label>A</Label>실험 harness가 기존 event·metric·log에서 같은 correlation ID로 묶어야 할 증거 묶음입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("session-test", rethNetworkCodeRefs["session-test"])} />
          <span className="text-xs text-muted-foreground">정상 version 선택 oracle</span>
          <CodeViewButton onClick={() => sidebar.open("status", rethNetworkCodeRefs.status)} />
          <span className="text-xs text-muted-foreground">Status outcome oracle</span>
        </div>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 순서</h2>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[58rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">경계</th><th className="px-3 py-3">한 번에 바꿀 입력</th><th className="px-3 py-3">기대 결과</th><th className="px-3 py-3">반드시 0이어야 할 잔류 상태</th></tr></thead>
            <tbody>{[
              ["Identity", "ECIES key와 다른 Hello ID", "UnexpectedHandshakeIdentity", "active session·extra protocol callback"],
              ["Capability", "겹치지 않는 eth version", "NoSharedCapabilities", "Status attempt·active slot"],
              ["Status", "무응답·wrong genesis·wrong chain·bad Fork ID", "timeout 또는 typed handshake error", "active session"],
              ["Frame", "oversized·malformed·unsolicited response", "Protocol breach·typed rejection", "accepted object·unbounded buffer"],
              ["Pressure", "slow consumer·announcement burst", "bounded queue 정책", "증가가 멈추지 않는 RSS·inflight"],
              ["Restart", "pending·active·inflight 구간에서 process 중단", "재시작 뒤 깨끗한 재연결", "유령 slot·중복 accepted object"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p>
          각 run은 한 경계만 바꿉니다. Discovery 알고리즘, handshake 구현, queue 설정과 NIC 조건을 한꺼번에 바꾸면 첫 divergence를 찾을 수 없습니다.
        </p>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실패 판정</h2>
        <p>
          Candidate가 연결을 더 빨리 끝내더라도 wrong genesis를 active로 올리거나 identity mismatch를 다른 peer의 평판에 기록하면 기각합니다. 오류율 하나보다 <strong>어느 상태에서 어떤 이유로 끝났고 무엇이 남았는지</strong>가 우선입니다.
        </p>
        <ul className="space-y-3 pl-5 text-sm leading-7">
          <li>Base와 candidate의 selected ETH version, Status outcome과 accepted message trace가 다르면 correctness 실패입니다.</li>
          <li>종료 뒤 pending·active count, inflight request, queue bytes와 timer가 기준선으로 돌아오지 않으면 cleanup 실패입니다.</li>
          <li>Local capacity·timeout을 remote protocol breach처럼 영구 ban에 반영하면 ownership 실패입니다.</li>
          <li>Collector가 없을 때만 통과하거나 source가 없는 합성 reason을 만들면 observability 실패입니다.</li>
        </ul>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">복구와 재진입</h2>
        <ol className="not-prose grid gap-3 text-sm leading-6 sm:grid-cols-4">
          {[
            ["1 · 격리", "Candidate listener와 outbound dial을 중지하고 증거를 보존합니다."],
            ["2 · Rollback", "Binary·features·network config·bootnodes를 기준선 digest로 되돌립니다."],
            ["3 · 재생", "정상·identity·capability·Status·pressure fixture를 모두 다시 실행합니다."],
            ["4 · 재진입", "Active·pending·accepted trace와 자원 counters가 기준선과 같을 때만 트래픽을 엽니다."],
          ].map(([title, body]) => <li key={title} className="border-l-2 border-primary/45 pl-3"><strong className="block text-xs">{title}</strong><span className="mt-2 block break-keep text-xs text-muted-foreground">{body}</span></li>)}
        </ol>
        <p>
          Process가 다시 떠 있다는 사실만으로 복구가 끝나지 않습니다. 같은 fixture가 active session을 만들고, 실패 fixture는 다시 거절되며, 이전 run의 slot과 buffer가 남지 않았다는 증거가 필요합니다.
        </p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">측정 순서</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1 · 정합성", "selected version·Status·accepted trace"],
            ["2 · 자원 경계", "pending·active·inflight·queue bytes·RSS"],
            ["3 · 복구", "restart·rollback·재진입 시간"],
            ["4 · 비용", "dial·handshake latency·CPU·memory·goodput"],
          ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-xs">{title}</strong><span className="mt-2 block break-keep text-[10px] leading-5 text-muted-foreground">{body}</span></div>)}
        </div>
        <p>
          <Label>M</Label>현재 대상 환경에서는 위 수치를 측정하지 않았습니다. 따라서 candidate가 더 빠르거나 더 적은 메모리를 쓴다고 말하지 않습니다.
        </p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">결정</h2>
        <p>
          현재 상태는 <strong>proposed</strong>입니다. Identity·capability·Status·자료 결과와 cleanup, restart, rollback parity를 모두 통과하고 그 뒤의 비용이 운영 목표를 만족할 때만 accepted로 바꿉니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2">
          <div className="bg-background p-4"><strong className="text-xs text-primary">채택 조건</strong><p className="mt-2 text-xs leading-6 text-muted-foreground">모든 fixture parity, bounded resource, rollback 재통과, 추적 가능한 reason과 운영자가 실행할 수 있는 runbook</p></div>
          <div className="bg-background p-4"><strong className="text-xs text-amber-700 dark:text-amber-300">결론을 뒤집는 조건</strong><p className="mt-2 text-xs leading-6 text-muted-foreground">잘못된 active 승격, identity 오귀속, unbounded queue, 잔류 slot, 안전한 rollback 부재 또는 유지보수할 수 없는 protocol fork</p></div>
        </div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 미측정값</h2>
        <CitationBlock source="Reth v2.8.1 · network session and eth-wire" citeKey={1} type="code" href="https://github.com/paradigmxyz/reth/tree/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/net">
          <p><Label>O</Label>Identity 결속, capability 교집합, Status 검사와 active session lifecycle의 기준 구현입니다.</p>
          <p><b>범위:</b> 대상 장비의 handshake latency, queue pressure와 restart 결과는 제공하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Ethereum devp2p specifications @ 2c19a28" citeKey={2} type="paper" href="https://github.com/ethereum/devp2p/tree/2c19a28b25c29487773ad6b07243e290fa8d65ec">
          <p><Label>O</Label>RLPx Hello·capability와 ETH Status·message semantics의 wire 기준입니다.</p>
          <p><b>범위:</b> Reth의 peer scoring·queue 크기·release default와 rollback 절차를 정하지 않습니다.</p>
        </CitationBlock>
        <p>
          <Label>?</Label>실제 운영 네트워크의 peer 분포, NAT·firewall 조건, packet loss, NIC·kernel, 공격 트래픽과 RTO는 아직 확인하지 않았습니다. 이 값이 없으므로 자동 채택이나 성능 우위를 결론 내리지 않습니다.
        </p>
      </section>

      <RethNetworkMapReturn current="reth-net-validation" />
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
