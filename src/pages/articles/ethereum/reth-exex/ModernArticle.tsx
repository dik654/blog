import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExecutionClientLocator from "../shared/ExecutionClientLocator";
import { rethExExCodeRefs, RETH_EXEX_PROJECT_META } from "./modernCodeRefs";
import { rethExExV281Tree } from "./modernFileTree";
import RethExExLocator, { RethExExMapReturn } from "./RethExExLocator";
import RethExExFlowViz from "./viz/RethExExFlowViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethExExLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            Reth ExEx는 reorg를 어떻게 파생 상태에 반영합니까?
          </h2>
        </div>
        <RethExExFlowViz />
        <p className="text-lg leading-8">
          <Label>A</Label>ExEx는 Reth 프로세스 안에서 오래 실행되는 extension입니다. Node가 선택한 chain의 commit·reorg·revert를 notification으로 받아 검색 인덱스나 분석용 파생 상태를 갱신합니다. Node 실행 경로를 직접 고치는 대신 그 변화의 소비자로 붙는 구조입니다.
        </p>
        <p>
          그러나 notification이 ExEx channel에 들어간 순간과 파생 DB가 안전하게 바뀐 순간은 같지 않습니다. Reth v2.8.1은 channel send를 delivered로 봅니다. 그러므로 extension은 자신의 로컬 transaction과 처리 위치를 따로 책임지고, 그 결과가 확정된 뒤에만 <code>FinishedHeight</code>를 보내야 합니다.
        </p>
        <p>
          이 글은 <Link to="/cs/blockchain/reth-sync#live-sync">Reth 동기화 글에서 선택된 chain의 변화가 ExEx로 넘어오는 지점</Link>부터 시작합니다. 외부 webhook·bridge 전송, 대상 환경의 queue 임계값, 배포·롤백 계획은 별도 실무 문제이므로 여기서는 Reth 내부 계약과 파생 상태의 기본 경계만 다룹니다.
        </p>
        <ContentBoundary article="reth-exex" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">높이가 같아도 branch가 바뀌면 파생 행도 바뀌어야 합니다</h2>
        <ExecutionClientLocator
          current="execution-store"
          path={["engine-api", "execution", "provider", "execution-store"]}
          question="Canonical branch가 바뀐 뒤 node와 두 ExEx는 각각 어느 위치까지 책임집니까?"
        />
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Reth ExEx 설명에 사용할 reorg와 두 extension의 시작 상태">
          {[
            ["이전 canonical", "103 → 104 → 105", "old branch"],
            ["새 canonical", "103′ → 104′ → 105′", "공통 조상은 102"],
            ["Extension A", "head = old 105", "파생 인덱스가 old branch까지 반영됨"],
            ["Extension B", "head = 102", "새 구간을 아직 처리하지 않음"],
          ].map(([title, value, note]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <strong className="text-xs">{title}</strong>
              <code className="mt-2 block break-all text-[11px] text-primary">{value}</code>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
        <p>
          A가 높이 105만 저장했다면 old 105와 new 105′를 구분할 수 없습니다. 이 사례의 처리 위치는 항상 <code>(block number, block hash)</code>로 보겠습니다. Extension A는 old 103~105에서 만든 행을 지운 뒤 new 103′~105′의 행을 써야 합니다. Extension B는 102 다음부터 새 branch를 이어서 처리하면 됩니다.
        </p>
      </section>

      <section id="notification" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">ChainReorged는 old와 new 구간을 한 notification에 보존합니다</h2>
        <p>
          <code>ExExNotification</code>은 chain 변화의 모양을 세 variant로 구분합니다. 단순 연장은 <code>ChainCommitted {'{ new }'}</code>, 취소만 일어난 경우는 <code>ChainReverted {'{ old }'}</code>, branch 교체는 <code>ChainReorged {'{ old, new }'}</code>입니다. 이번 사례는 마지막 variant입니다.
        </p>
        <p>
          Consumer는 <code>reverted_chain()</code>으로 old 103~105를, <code>committed_chain()</code>으로 new 103′~105′를 얻습니다. 파생 상태가 block별 delta를 기록한다면 old는 tip에서 공통 조상 쪽으로 되돌리고, new는 공통 조상 다음 block부터 tip 쪽으로 적용합니다. Notification은 구간을 전달할 뿐 파생 DB의 rollback 순서를 대신 실행하지 않습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("exex-notification", rethExExCodeRefs["exex-notification"])} />
          <span className="text-xs text-muted-foreground">Commit·revert·reorg가 서로 다른 branch 정보를 담는 실제 enum</span>
        </div>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Committed", "new만 있음", "기존 tip 뒤에 순서대로 적용"],
            ["Reverted", "old만 있음", "old tip부터 반대 순서로 취소"],
            ["Reorged", "old + new", "old 취소 뒤 new 적용"],
          ].map(([title, payload, action]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <strong className="text-xs">{title}</strong>
              <code className="mt-2 block break-all text-[11px] text-primary">{payload}</code>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{action}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="manager-delivery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Manager의 delivered는 channel에 넣었다는 뜻입니다</h2>
        <p>
          ExEx manager는 node에서 notification을 받아 모든 extension에 fan-out합니다. 기본 manager buffer의 최대 크기는 1,024개이고, 각 ExEx 앞의 notification channel은 한 개만 담습니다. 두 queue는 역할이 다릅니다. 공용 buffer는 모든 ExEx가 차례로 받을 때까지 notification을 보존하고, 개별 channel은 특정 ExEx에 전달할 차례를 조절합니다.
        </p>
        <p>
          Reth의 context 주석은 notification이 channel로 전송되면 node가 이를 delivered로 본다고 명시합니다. 이것은 application-level acknowledgement가 아닙니다. Extension A가 channel에서 reorg를 받았더라도 파생 DB rollback·apply·commit은 아직 남아 있을 수 있습니다.
        </p>
        <p>
          Manager는 이미 끝낸 높이보다 낮은 단순 commit을 건너뛸 수 있지만, reorg와 revert는 <code>FinishedHeight</code> 아래에서 일어나더라도 항상 보냅니다. 과거 높이의 branch가 바뀌면 최신 파생 상태도 달라질 수 있기 때문입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("manager-delivery", rethExExCodeRefs["manager-delivery"])} />
          <span className="text-xs text-muted-foreground">Capacity-1 channel, delivered 경계, 모든 ExEx fan-out</span>
        </div>
      </section>

      <section id="durable-apply" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">파생 데이터와 ExExHead를 한 로컬 확정 단위로 묶어야 합니다</h2>
        <p>
          Reth의 <code>ExExHead</code>는 extension 내부 상태에 완전히 반영한 마지막 host block입니다. 이 값은 node가 자동으로 채워 주는 파생 DB checkpoint가 아닙니다. Extension이 자신의 저장소에 파생 행과 block identity를 함께 기록하고, 재시작 때 그 위치를 Reth의 with-head stream에 제시해야 합니다.
        </p>
        <p>
          이번 reorg에서 A의 안전한 순서는 old 105→103 rollback, head 102, new 103′→105′ apply, head 105′ commit입니다. 파생 행은 commit됐는데 head가 102에 남으면 같은 구간을 다시 적용할 수 있습니다.
        </p>
        <p>
          반대로 head만 105′로 전진하고 파생 행이 빠지면 재시작이 그 구간을 건너뜁니다. 따라서 두 변경을 같은 로컬 DB transaction에 묶는 것이 consumer가 지켜야 할 기본 계약입니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Extension A가 reorg를 로컬 DB에 적용하는 순서">
          {[
            ["01", "Old rollback", "105 → 104 → 103"],
            ["02", "공통 조상", "head = 102"],
            ["03", "New apply", "103′ → 104′ → 105′"],
            ["04", "Local commit", "rows + head 105′"],
          ].map(([number, title, body]) => (
            <div key={number} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{number}</span>
              <strong className="mt-1 block text-xs">{title}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          이 transaction은 extension의 로컬 저장소 범위입니다. Webhook이나 다른 데이터베이스 같은 외부 효과까지 Reth WAL과 하나의 transaction으로 묶어 주지는 않습니다. 그런 효과가 필요하면 stable event ID, outbox, receipt reconciliation 같은 별도 실무 설계가 필요합니다.
        </p>
      </section>

      <section id="finished-height" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">FinishedHeight는 처리 완료와 과거 block 불필요를 함께 선언합니다</h2>
        <p>
          Local commit을 마친 A는 <code>FinishedHeight(105, hash(105′))</code>를 보낼 수 있습니다. B는 102까지만 확정했으므로 <code>FinishedHeight(102, hash(102))</code>를 보냅니다. 이 event는 단순히 “notification을 읽었다”는 ack가 아닙니다. 해당 block까지 처리했고 앞으로 그보다 이른 block이 더 필요하지 않다는 선언입니다.
        </p>
        <p>
          그래서 reorg에서는 완료 높이가 내려갈 수 있습니다. Extension이 앞서 알린 위치보다 이른 branch 상태로 되돌아가야 한다면 낮아진 number와 그 branch의 hash를 다시 보낼 수 있습니다. Number만 단조 증가한다고 가정하면 이런 전환을 표현할 수 없습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("finished-height", rethExExCodeRefs["finished-height"])} />
          <span className="text-xs text-muted-foreground">Extension별 완료 위치와 manager가 계산하는 공통 높이</span>
        </div>
      </section>

      <section id="retention" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공통 완료 높이와 WAL 정리 경계는 같은 계산이 아닙니다</h2>
        <p>
          Manager가 watch channel에 공개하는 공통 <code>FinishedExExHeight</code>는 모든 ExEx number의 최솟값입니다. A가 105′, B가 102라면 공통 완료 높이는 102입니다. 아직 한 extension이라도 FinishedHeight를 보내지 않았다면 상태는 <code>NotReady</code>입니다.
        </p>
        <p>
          WAL 정리는 한 단계 더 엄격합니다. Manager는 각 ExEx의 finished hash가 canonical인지 provider에 묻습니다. 모두 canonical일 때만 extension 위치들과 consensus finalized header 가운데 number가 가장 낮은 곳을 boundary로 고릅니다.
        </p>
        <p>
          이 사례에서 finalized header가 104라면 <code>min(105, 102, 104) = 102</code>입니다. 따라서 “A가 105까지 끝냈으니 105 이전을 지운다”는 결론은 틀립니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">입력</th><th className="px-3 py-3">위치</th><th className="px-3 py-3">추가 조건</th></tr></thead>
            <tbody>
              {[
                ["Extension A", "105′", "hash(105′)가 canonical"],
                ["Extension B", "102", "hash(102)가 canonical"],
                ["Consensus finality", "104", "finalized header"],
                ["WAL boundary", "102", "모두 canonical인 뒤 number 최솟값"],
              ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section id="backpressure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">느린 ExEx는 자신의 channel에서 시작해 upstream까지 멈춥니다</h2>
        <p>
          B가 notification을 읽지 않으면 capacity-1 channel이 먼저 찹니다. Manager는 B에 보내지 못한 notification을 공용 buffer에서 제거할 수 없습니다. Buffer가 최대 크기에 도달하면 current capacity가 0이 되고 <code>send_async</code>는 manager가 다시 ready가 될 때까지 기다립니다.
        </p>
        <p>
          이 흐름이 backpressure입니다. 무한히 메모리를 늘리지 않고 느린 consumer의 속도를 생산자에게 전달합니다. 반면 처리량이 느리다는 사실을 자동으로 고치거나 extension의 파생 DB가 맞다는 것을 증명하지는 않습니다. Channel이 닫히면 manager는 이를 복구 가능한 skip으로 보지 않고 오류를 반환합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="느린 ExEx의 backpressure 전파 순서">
          {[
            ["B 처리 중단", "channel capacity 1"],
            ["B channel full", "다음 send reserve 대기"],
            ["Manager buffer full", "capacity 0"],
            ["Upstream wait", "새 notification 유입 제한"],
          ].map(([title, body], index) => (
            <div key={title} className="relative min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs">{title}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{body}</p>
              {index < 3 ? <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-0.5 text-primary sm:block">→</span> : null}
            </div>
          ))}
        </div>
      </section>

      <section id="restart" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">재시작은 저장한 ExExHead의 branch부터 다시 확인합니다</h2>
        <p>
          B가 head 102를 저장하고 재시작하면 <code>ExExNotificationsWithHead</code>가 먼저 그 hash가 현재 canonical chain에 있는지 확인합니다. 저장한 head가 비canonical이면 WAL에서 해당 block을 포함한 notification을 찾아 뒤집은 notification을 반환합니다. Head가 canonical이지만 node head보다 뒤라면 빠진 구간을 node DB에서 backfill합니다.
        </p>
        <p>
          Backfill 중에도 live channel을 그대로 막아 두지 않습니다. Stream은 channel을 비우면서 backfill 범위 뒤의 notification과 reorg·revert를 pending queue에 보관합니다. Backfill을 끝낸 뒤 pending notification을 먼저 전달하고 regular stream으로 돌아갑니다. 이것이 historical catch-up과 live 변화 사이의 공백을 줄이는 handoff입니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("restart-catchup", rethExExCodeRefs["restart-catchup"])} />
          <span className="text-xs text-muted-foreground">Canonicality 확인 → backfill → pending live notification → regular stream</span>
        </div>
      </section>

      <section id="failure-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Reth가 복구하는 notification과 extension이 복구할 상태를 구분합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Channel 전달 뒤 crash", "Extension", "로컬 transaction과 저장한 ExExHead로 재판정"],
            ["저장 head가 비canonical", "With-head stream", "WAL의 inverse notification으로 먼저 되돌림"],
            ["느린·닫힌 consumer", "ExEx manager", "backpressure 또는 manager 오류"],
          ].map(([failure, owner, outcome]) => (
            <div key={failure} className="min-w-0 bg-background p-4">
              <strong className="text-xs">{failure}</strong>
              <code className="mt-2 block break-all text-[11px] text-primary">{owner}</code>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{outcome}</span>
            </div>
          ))}
        </div>
        <p>
          저장한 비canonical head의 notification이 WAL에도 없고 node head보다 앞선 경우도 아니라면 with-head stream은 오류를 반환합니다. 복구 근거가 없는데 현재 canonical로 임의 점프하지 않는 fail-closed 동작입니다. 반대로 extension의 로컬 transaction이 부분 적용됐는지는 Reth가 알 수 없습니다. 그 무결성과 재시도 가능성은 파생 저장소가 증명해야 합니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Reth v2.8.1 구현에서 확인한 범위까지만 결론을 냅니다</h2>
        <CitationBlock source="Reth v2.8.1 · ExEx notification과 context" citeKey={1} href="https://github.com/paradigmxyz/reth/tree/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/exex">
          <p><Label>O</Label>Commit·reorg·revert variant, channel send를 delivered로 보는 context 계약, <code>FinishedHeight</code>가 뜻하는 완료·pruning 경계를 확인했습니다.</p>
          <p><strong>범위:</strong> Commit <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>에 고정한 구현입니다. 다른 release의 channel 크기나 manager 기본값까지 일반화하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Reth v2.8.1 · ExEx manager와 WAL" citeKey={2} href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/exex/exex/src/manager.rs">
          <p><Label>O</Label>기본 manager buffer 1,024개, ExEx별 channel 1개, 모든 ExEx fan-out 뒤 buffer 제거, 공통 완료 높이와 canonical hash·finalized header 기반 WAL 정리 경계를 확인했습니다.</p>
          <p><strong>범위:</strong> Buffer와 WAL lifecycle의 근거이며 대상 환경의 적정 용량이나 처리량 측정은 아닙니다.</p>
        </CitationBlock>
        <CitationBlock source="Reth v2.8.1 · With-head notification stream" citeKey={3} href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/exex/exex/src/notifications.rs">
          <p><Label>O</Label>Persisted ExEx head의 canonicality 검사, WAL inverse, DB backfill, backfill 중 live notification 보관과 재전달 순서를 확인했습니다.</p>
          <p><strong>범위:</strong> Reth가 제공하는 notification recovery 경로입니다. Extension 로컬 DB나 외부 효과의 exactly-once를 보장하지 않습니다.</p>
        </CitationBlock>
        <p><Label>M</Label>대상 환경에서 extension 처리량, manager buffer 점유, WAL 증가량, 재시작 시간과 파생 DB 지연은 측정하지 않았습니다.</p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>ChainReorged가 old와 new를 함께 보내는 이유는 무엇입니까? <strong>(답: 같은 높이의 다른 branch를 구분하고 old 파생 행을 되돌린 뒤 new 행을 적용하기 위해서입니다.)</strong></li>
          <li>Manager가 delivered로 본 뒤에도 extension이 FinishedHeight를 즉시 보내면 안 되는 이유는 무엇입니까? <strong>(답: Delivered는 channel send이고 파생 DB와 ExExHead의 durable commit은 아직 끝나지 않았을 수 있기 때문입니다.)</strong></li>
          <li>A=105′, B=102, finalized=104일 때 WAL 정리 경계는 어디입니까? <strong>(답: 각 hash가 canonical이라는 전제에서 최솟값인 102입니다.)</strong></li>
          <li>재시작한 ExEx가 저장한 head 뒤의 notification을 어떻게 다시 받습니까? <strong>(답: Head canonicality를 확인하고, 필요한 inverse를 먼저 전달한 뒤 빠진 canonical 구간을 backfill하고 pending live notification을 이어서 전달합니다.)</strong></li>
        </ol>
      </section>

      <RethExExMapReturn />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={rethExExCodeRefs}
        fileTrees={{ reth: rethExExV281Tree }}
        projectMetas={RETH_EXEX_PROJECT_META}
      />
    </article>
  );
}
