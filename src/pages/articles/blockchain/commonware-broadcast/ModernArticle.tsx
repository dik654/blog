import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import CommonwareBroadcastLocator, { CommonwareBroadcastMapReturn } from "./CommonwareBroadcastLocator";
import { codeRefs } from "./codeRefs";
import { commonwareBroadcastTree } from "./fileTrees";
import {
  BroadcastBoundaryViz,
  BroadcastCacheViz,
  BroadcastFlowViz,
} from "./viz/ModernCommonwareBroadcastViz";

export default function ModernCommonwareBroadcastArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <CommonwareBroadcastLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            로컬 broadcast 요청이 접수된 뒤 Bob이 같은 digest의 item을 얻기까지 무엇이 따로 바뀌는가
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            Alice가 한 descriptor를 Bob에게 보낸다고 가정하겠습니다. Descriptor bytes의 digest를 이 글에서만 <code>d7</code>이라고 부릅니다. Bob은 먼저 <code>d7</code>을 구독하고, Alice는 같은 descriptor를 broadcast합니다. 이 하나의 식별자를 로컬 접수, network 전송, decode, waiter 응답과 cache 잔류까지 추적합니다.
          </p>
        </div>
        <BroadcastFlowViz />
        <p className="text-lg leading-8">
          <strong>Broadcaster의 Feedback은 Alice 노드가 요청을 처리한다는 뜻이고, Bob의 <code>subscribe(d7)</code> 완료는 Bob process가 typed item을 얻었다는 뜻입니다.</strong> 둘 사이에는 Engine dequeue, network send·receive와 decode가 남아 있습니다.
        </p>
        <p>
          이 글은 Commonware <code>v2026.9.0</code>의 buffered broadcast 동작만 다룹니다. Total order와 finality는 Simplex 같은 consensus 계층의 책임이고, crash 뒤 복구 가능한 저장 상태는 Storage 계층의 책임입니다. <code>subscribe</code> 반환값에는 sender가 따로 들어 있지 않으므로 발신자 권한이 필요하면 message 자체의 서명이나 별도 application context가 필요합니다.
        </p>
        <ContentBoundary article="commonware-buffered-broadcast" />
      </section>

      <section id="broadcast-subscribe" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Feedback은 local endpoint의 접수 결과입니다</h2>
        <p>
          <code>Broadcaster::broadcast</code>는 recipients와 <code>Codec</code> message를 받고 즉시 <code>Feedback</code>을 반환합니다. Trait 문서도 이 값이 local broadcast request의 processing acceptance일 뿐 recipient receipt가 아니라고 명시합니다.
        </p>
        <p>
          <code>Feedback::Ok</code>는 설정된 용량 안에서 접수했다는 뜻입니다. <code>Backoff</code>는 용량을 넘었지만 overflow policy가 요청을 보관했다는 뜻이므로 <code>accepted()</code>는 둘 다 참입니다. <code>Closed</code>만 endpoint가 닫혀 더 처리할 수 없음을 뜻합니다. 따라서 Backoff는 원격 실패가 아니라 local pressure를 드러내는 별도 상태입니다.
        </p>
        <p>
          Bob의 <code>subscribe(d7)</code>은 cache에 d7이 있으면 즉시 응답하고, 없으면 oneshot responder를 waiter로 남깁니다. <code>get(d7)</code>은 현재 cache를 한 번 조회해 <code>Some(item)</code> 또는 <code>None</code>으로 끝납니다. 기다림이 필요 없으면 get, 미래 도착까지 기다리려면 subscribe라는 차이가 있습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Feedback·Broadcaster 코드" onClick={() => sidebar.open("broadcast-contract", codeRefs["broadcast-contract"])} />
          <CodeViewButton label="Mailbox subscribe·get 코드" onClick={() => sidebar.open("buffered-ingress", codeRefs["buffered-ingress"])} />
        </div>
      </section>

      <section id="engine-path" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Engine 하나가 세 입력을 같은 event loop에서 처리합니다</h2>
        <p>
          Engine은 최신 peer 집합 update, local Mailbox command, network receive를 한 <code>select_loop!</code>에서 받습니다. Alice의 Broadcast command를 꺼내면 먼저 자신의 message를 cache 경로에 넣고 <code>send_ref</code>로 network 전송을 시도합니다. 이 함수는 Bob의 application acknowledgement를 기다리지 않습니다.
        </p>
        <p>
          Bob 쪽 receiver는 peer와 frame을 받은 뒤 <code>Codec</code> decode를 수행합니다. Decode 오류는 해당 frame을 Invalid로 기록하고 다음 event로 넘어갑니다. 성공한 message에서는 digest를 다시 계산하고, 같은 digest의 waiter가 있으면 <code>Arc&lt;Message&gt;</code>를 응답합니다.
        </p>
        <p>
          이때 subscriber는 typed item을 받지만 sender public key를 함께 받지는 않습니다. Engine이 받은 peer 값은 cache eligibility에 사용됩니다. 그러므로 “d7을 받았다”와 “업무상 허용된 Alice가 보냈다”를 같은 사실로 저장하면 안 됩니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Engine event loop 코드" onClick={() => sidebar.open("buffered-engine", codeRefs["buffered-engine"])} />
        </div>
      </section>

      <section id="cache-eligibility" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Waiter 응답과 cache 잔류도 서로 다른 결정입니다</h2>
        <p>
          Network message가 들어오면 Engine은 같은 digest의 waiters를 먼저 꺼내 응답합니다. 그 다음 sender가 <code>latest.primary</code>에 있는지 검사합니다. 따라서 primary 밖의 sender도 이미 기다리던 subscriber에게 item을 전달할 수 있지만, resident cache entry는 만들 수 없습니다.
        </p>
        <p>
          Eligible peer마다 최신 digest를 <code>deque_size</code>까지 보관하는 deque가 있습니다. Global <code>items</code> map은 digest당 payload 하나만 두고, <code>counts</code>가 몇 개의 peer deque가 그 digest를 참조하는지 셉니다.
        </p>
        <BroadcastCacheViz />
        <ExplainedFormula
          question="Shared item d7은 언제 cache에서 제거됩니까?"
          idea={<>Eligible peer의 deque에 d7이 남아 있는지를 셉니다. 한 peer에서 오래된 항목으로 밀려나도 다른 peer reference가 남으면 payload를 유지하고, 마지막 reference가 사라질 때만 제거합니다.</>}
          formula={String.raw`c(d)=\sum_{p\in P_{primary}}\mathbf 1[d\in Q_p],\qquad d\in Items\iff c(d)>0`}
          annotatedFormula={String.raw`c(d)=\sum_{p\in P_{primary}}\underbrace{\mathbf 1[d\in Q_p]}_{\text{peer deque에 있으면 1}},\qquad \underbrace{d\in Items\iff c(d)>0}_{\text{참조가 남아야 보존}}`}
          operations={[
            { expression: String.raw`\sum_{p\in P_{primary}}`, annotation: ["latest primary가 cache 잔류를 허용한", "peer 전체를 셉니다."] },
            { expression: String.raw`\mathbf 1[d\in Q_p]`, annotation: ["A와 B deque에 d7이 있으면", "각각 1이므로 count는 2입니다."] },
            { expression: String.raw`d\in Items\iff c(d)>0`, annotation: ["A에서 빠져도 count=1이라 유지하고", "B에서도 빠져 0일 때 제거합니다."] },
          ]}
          terms={[
            { symbol: "P_{primary}", name: "cache-eligible peers", description: "Peer provider의 latest.primary에 포함된 peer 집합입니다." },
            { symbol: "Q_p", name: "peer digest deque", description: "Peer p가 보낸 최신 digest를 deque_size까지 보관합니다." },
            { symbol: "c(d)", name: "digest reference count", description: "Digest d를 참조하는 eligible peer deque 수입니다." },
            { symbol: "Items", name: "shared item map", description: "Digest당 Arc message 하나를 저장하는 node-local cache입니다." },
          ]}
          assumptions={[
            "한 peer deque에는 같은 digest가 한 번만 존재합니다.",
            "Duplicate는 digest를 deque 앞쪽으로 옮기되 reference count를 늘리지 않습니다.",
            "Latest-primary update와 deque eviction은 같은 Engine event loop에서 적용됩니다.",
            "Cache reference 수는 recipient quorum, durable copies 또는 consensus votes가 아닙니다.",
          ]}
          interpretation="A와 B가 d7을 참조하면 count는 2입니다. A에서 d7이 밀려나면 1이라 item이 남고, B에서도 빠져 0이 될 때 counts와 items에서 함께 제거됩니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Waiter·cache 코드" onClick={() => sidebar.open("buffered-cache", codeRefs["buffered-cache"])} />
        </div>
      </section>

      <section id="release" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">어디까지 진행됐는지 알아야 실패를 설명할 수 있습니다</h2>
        <BroadcastBoundaryViz />
        <p>
          <code>Closed</code>는 local endpoint 종료입니다. <code>Backoff</code>는 overflow policy가 처리한 local pressure입니다. Network receiver 자체의 오류는 Engine loop를 끝낼 수 있고, 한 frame의 decode 오류는 그 frame만 버리고 loop를 계속합니다. Subscriber가 receiver를 drop하면 waiter cleanup 대상이 됩니다.
        </p>
        <p>
          Item을 받았어도 cache에 남지 않을 수 있습니다. Sender가 latest.primary 밖이면 waiter는 응답받지만 cache insert 결과는 <code>Ineligible</code>입니다. 같은 peer의 duplicate digest는 deque 앞쪽으로 이동하고, peer가 primary 집합에서 빠지면 그 peer의 모든 reference를 줄입니다.
        </p>
        <p>
          이 crate에는 Bob의 원격 acknowledgement, total ordering, disk commit과 application side effect 성공이 없습니다. 재시도와 timeout 정책을 만든다면 local Feedback, subscribe completion과 application operation ID를 따로 기록해야 합니다. 이는 제품 채택이나 운영 Runbook이 아니라 현재 API가 드러내는 실패 경계입니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">근거와 버전 경계</h2>
        <div className="not-prose grid gap-px bg-border p-px lg:grid-cols-3">
          <div id="paper-commonware-broadcaster-v2026">
            <CitationBlock source="Commonware Broadcaster trait · v2026.9.0" citeKey={1} type="code" href="https://docs.rs/commonware-broadcast/2026.9.0/commonware_broadcast/trait.Broadcaster.html">
              <p><strong>확인한 것:</strong> Codec message, recipients와 local Feedback의 성공 경계입니다.</p>
              <p><strong>말하지 않는 것:</strong> Recipient receipt, total order, durability와 application acceptance를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-commonware-mailbox-v2026">
            <CitationBlock source="Commonware buffered module · v2026.9.0" citeKey={2} type="code" href="https://docs.rs/commonware-broadcast/2026.9.0/commonware_broadcast/buffered/index.html">
              <p><strong>확인한 것:</strong> Digest subscribe·get, peer별 bounded queue, latest-primary eligibility와 shared item cache입니다.</p>
              <p><strong>말하지 않는 것:</strong> Cache residence가 sender authorization, quorum 또는 영구 보관이라는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
          <div id="paper-commonware-engine-v2026">
            <CitationBlock source="Commonware broadcast source · v2026.9.0 · d476a236" citeKey={3} type="code" href="https://github.com/commonwarexyz/monorepo/tree/d476a2361ce6840d2b9d0aa6fb30a924429046d4/broadcast/src">
              <p><strong>확인한 것:</strong> Mailbox, Engine event loop, waiter notification, eligibility와 reference-count eviction 구현입니다.</p>
              <p><strong>범위:</strong> 2026-10-30에 고정한 exact tag와 commit의 공개 구현입니다.</p>
            </CitationBlock>
          </div>
        </div>
        <p>
          Descriptor와 <code>d7</code>, Alice·Bob은 이 경로를 한 번에 추적하기 위한 글 안의 가정입니다. 기존 글의 <code>Response=Vec&lt;Peer&gt;</code> 예시는 현재 Broadcaster API와 맞지 않아 제거했습니다. Ordered broadcast, DSMR와 ZODA도 현재 buffered broadcast의 한 pipeline처럼 다루지 않습니다.
        </p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">흐름을 다시 말해 보기</h2>
        <ol className="space-y-4 pl-5 text-sm leading-7">
          <li><code>Feedback::Ok</code> 뒤에도 Bob 수신을 확정할 수 없는 이유는 무엇입니까? <strong>(답: Ok는 Alice local mailbox가 용량 안에서 요청을 받았다는 뜻이고 Engine send, network receive, decode와 Bob waiter 응답이 남아 있기 때문입니다.)</strong></li>
          <li><code>subscribe(d7)</code>과 <code>get(d7)</code>의 차이는 무엇입니까? <strong>(답: subscribe는 cache hit 또는 미래 도착을 기다리고 get은 현재 cache를 한 번 조회해 즉시 끝나기 때문입니다.)</strong></li>
          <li>Primary 밖의 sender가 보낸 d7이 waiter는 깨우면서 cache에 남지 않을 수 있는 이유는 무엇입니까? <strong>(답: waiters를 먼저 응답한 뒤 latest.primary eligibility를 검사해 resident insert를 Ineligible로 끝내기 때문입니다.)</strong></li>
          <li>A와 B deque가 d7을 참조할 때 A에서 d7이 빠져도 payload를 유지해야 하는 이유는 무엇입니까? <strong>(답: count가 2에서 1로 줄었을 뿐 B의 유효한 reference가 남아 있기 때문입니다.)</strong></li>
        </ol>
        <p className="text-sm text-muted-foreground">
          다음 글에서는 <Link to="/cs/blockchain/commonware-storage#overview" className="font-bold text-primary hover:underline">Commonware Storage</Link>로 이동해 Application이 만든 update가 candidate root, visible state와 durable state를 거치는 경로를 확인합니다.
        </p>
      </section>

      <CommonwareBroadcastMapReturn />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ commonware: commonwareBroadcastTree }}
        projectMetas={{
          commonware: {
            id: "commonware",
            label: "Commonware v2026.9.0 · Rust",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
