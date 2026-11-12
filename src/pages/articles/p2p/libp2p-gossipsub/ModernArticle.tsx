import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { GossipPathViz, ScoreViz } from "./viz/ModernGossipsubViz";
import MeshBandViz from "./viz/MeshBandViz";
import PeerSetViz from "./viz/PeerSetViz";
import McacheViz from "./viz/McacheViz";
import ValidationBranchViz from "./viz/ValidationBranchViz";

export default function ModernGossipsubArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            rust-libp2p v0.57.1 · libp2p-gossipsub 0.50.0
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            GossipSub은 모두에게 보내지 않고도 소식이 퍼질 길을 유지합니다
          </h2>
        </header>
        <p className="text-lg leading-8">
          한 문장으로 답하면, GossipSub은 topic마다 자주 full message를 주고받을 mesh를
          유지하고, mesh 밖 peer에는 “내가 이 message ID를 갖고 있다”는 IHAVE를 알려
          빠진 message만 IWANT로 가져오게 합니다. 하지만 local publish 성공은 모든
          subscriber가 받았다는 영수증이 아닙니다.
        </p>
        <p>
          Alice가 <code>payroll-report-v1</code>의 CID, version, timestamp와 서명을 작은
          announcement로 publish한다고 하겠습니다. Bob은 announcement를 검증한 뒤 실제
          payroll block은 Bitswap이나 별도 stream으로 받고 CID를 다시 계산합니다. GossipSub은
          이 파일 자체보다 “어떤 CID가 준비됐다”는 소식을 퍼뜨리는 데 씁니다.
        </p>
        <p>
          이 글은 Alice의 publish 한 번을 message ID→local cache→publish recipients→heartbeat
          IHAVE→Bob의 IWANT→application validation→별도 content fetch까지 추적합니다. 일반
          GossipSub 구조는 <a className="text-primary hover:underline" href="/cs/p2p/gossip-fundamentals#gossipsub">전파 정본</a>,
          CID 검증은 <a className="text-primary hover:underline" href="/cs/p2p/content-addressing#overview">content addressing 정본</a>을 재사용합니다.
        </p>
        <GossipPathViz />
      </section>

      <section id="publish-heartbeat" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · publish가 실제로 끝나는 곳</p>
          <h2 className="mt-2 text-2xl font-bold">
            성공한 publish는 local admission과 queue 삽입까지를 증명합니다
          </h2>
        </header>
        <p>
          현재 구현은 outbound transform 뒤 topic의 최대 전송 크기를 검사합니다. 기본 RPC
          상한은 65,536 bytes입니다. 그다음 원래 data로 message ID를 계산합니다. 기본 ID는
          source PeerId와 sequence number 조합이지 payload의 content hash가 아닙니다. 따라서
          duplicate cache hit는 “같은 ID를 이미 봤다”는 뜻일 뿐 CID 무결성 검사가 아닙니다.
        </p>
        <p>
          현재 기본 <code>flood_publish=true</code>에서는 topic을 구독하고 publish score
          threshold를 통과한 연결 peer 모두가 최초 publish 후보입니다. 이 옵션을 끄면
          subscribed node는 mesh, unsubscribed publisher는 fanout을 중심으로 target 수를
          채웁니다. “GossipSub은 언제나 최초 메시지를 mesh 여섯 곳에만 보낸다”는 설명이
          현재 기본 설정에는 맞지 않는 이유입니다.
        </p>
        <AlgorithmBlock
          title="Alice가 announcement를 publish하는 실제 admission 순서"
          input={[
            "topic = payroll/announcements",
            "data = CID + version + timestamp + signature",
            "connected peers + score thresholds + publish queues",
          ]}
          steps={[
            {
              code: "transformed = outbound_transform(topic, data)",
              note: "전송 표현을 만들되 message ID는 아래에서 원래 data를 기준으로 계산합니다.",
            },
            {
              code: "require transformed.len ≤ max_transmit_size(topic)",
              note: "현재 global 기본값은 65,536 bytes이며 topic별 override가 가능합니다.",
            },
            {
              code: "raw = build_raw_message(...); id = message_id(original data)",
              note: "기본 ID는 source+sequence입니다. Content hash나 application signature 검증이 아닙니다.",
            },
            {
              code: "reject if duplicate_cache contains id",
              note: "같은 local ID를 다시 publish하지 않습니다.",
            },
            {
              code: "recipients = subscribed peers above publish threshold",
              note: "기본 flood publish는 전부, 옵션을 끄면 mesh·fanout·explicit policy로 줄입니다.",
            },
            {
              code: "cache id+message; enqueue Publish to recipients",
              note: "모든 queue가 가득 차면 오류입니다. 하나 이상 enqueue돼야 MessageId를 반환합니다.",
            },
          ]}
          output="local MessageId 또는 TooLarge·Duplicate·NoPeers·AllQueuesFull 오류"
        />
        <p>
          MessageId가 반환되어도 remote socket write, Bob의 receive, application validation,
          payroll block fetch는 아직 남았습니다. Queue에서 publish message가 기다릴 수 있는
          기본 시간도 5초로 제한됩니다. Durable delivery가 필요하면 application이 별도
          outbox, subscriber receipt와 retry 정책을 가져야 합니다.
        </p>

        <header className="pt-4">
          <p className="text-sm font-semibold text-primary">02 · heartbeat가 유지하는 전파 길</p>
          <h2 className="mt-2 text-2xl font-bold">
            1초마다 mesh를 고치고 최근 message ID만 mesh 밖에 알립니다
          </h2>
        </header>
        <MeshBandViz />
        <p>
          기본 heartbeat는 첫 5초 뒤 시작해 1초 간격으로 실행됩니다. Topic별 mesh 목표는
          6, 부족 기준은 5, 과잉 기준은 12입니다. Peer가 5명보다 적으면 목표 6까지 GRAFT하고,
          12명 이상이면 점수·outbound 제약을 보면서 목표 6까지 PRUNE합니다.
        </p>
        <CalculationWalkthrough
          title="한 heartbeat의 mesh 수선 장부"
          question="현재 peer 수가 3명일 때와 14명일 때 몇 명을 더하거나 뺄까요?"
          scope="현재 libp2p-gossipsub 0.50.0의 기본 target=6, low=5, high=12를 사용합니다. 실제 후보 부족과 outbound 보존은 별도입니다."
          steps={[
            {
              label: "3명 mesh가 부족한지 봅니다",
              expression: "3 < low 5",
              result: "부족",
              reason: "Low 아래에서만 보충 branch로 들어갑니다.",
            },
            {
              label: "목표까지 필요한 peer를 셉니다",
              expression: "target 6 - current 3",
              result: "GRAFT 후보 3명",
              reason: "연결·topic·score·backoff 조건을 통과한 후보 중에서 고릅니다.",
            },
            {
              label: "14명 mesh가 과한지 봅니다",
              expression: "14 ≥ high 12",
              result: "과잉",
              reason: "High 이상이면 목표 크기로 줄이는 branch로 들어갑니다.",
            },
            {
              label: "목표보다 많은 수를 셉니다",
              expression: "current 14 - target 6",
              result: "PRUNE 후보 8명",
              reason: "좋은 score 일부와 최소 outbound peer를 보존하면서 제거합니다.",
            },
          ]}
          conclusion="기본값에서 3명 mesh는 최대 3명을 보충하고, 14명 mesh는 최대 8명을 줄여 목표 6으로 향합니다."
          caveats={[
            "조건을 통과한 후보가 부족하면 한 heartbeat만으로 목표에 도달하지 못합니다.",
            "Topic별 override와 peer score 설정이 있으면 숫자와 선택 대상이 달라집니다.",
          ]}
        />
        <PeerSetViz />
        <p>
          Heartbeat는 mesh 밖 eligible peer에도 IHAVE를 보냅니다. 기본으로 최소 6명 또는
          non-mesh peer의 25% 중 큰 쪽을 고릅니다. Bob이 모르는 ID를 IWANT로 요청하면 Alice는
          cache에 남은 full message를 보냅니다. IWANT 뒤 기본 3초 안에 message가 오지 않으면
          broken promise가 local peer score penalty가 될 수 있습니다.
        </p>
        <McacheViz />
        <p>
          Message cache는 기본 5 heartbeat bucket을 보관하고 최근 3 bucket의 ID를 gossip합니다.
          Duplicate cache는 기본 60초입니다. 두 cache는 목적과 수명이 다릅니다. Message cache가
          이미 shift돼 원문이 사라지면 IHAVE를 기억해도 full message를 되살릴 수 없습니다.
        </p>
        <div id="paper-rust-gossipsub-behaviour-0571">
          <CitationBlock
            source="rust-libp2p v0.57.1 — GossipSub behaviour.rs · commit 2fed78f"
            citeKey={1}
            type="code"
            href="https://github.com/libp2p/rust-libp2p/blob/2fed78f/protocols/gossipsub/src/behaviour.rs"
          >
            <p><strong>문제:</strong> Bounded local state로 publish admission, mesh repair와 lazy gossip을 수행합니다.</p>
            <p><strong>기여:</strong> Transform·ID·duplicate/memcache, recipient filtering, heartbeat GRAFT/PRUNE·IHAVE와 promise penalty를 구현합니다.</p>
            <p><strong>전제:</strong> v0.57.1 Behaviour와 같은 release의 validated config를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 한 node의 publish·receive·heartbeat state transition입니다.</p>
            <p><strong>말하지 않는 것:</strong> 모든 subscriber 수신, durable delivery, file availability를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-rust-gossipsub-config-0571">
          <CitationBlock
            source="libp2p-gossipsub 0.50.0 — config.rs · commit 2fed78f"
            citeKey={2}
            type="code"
            href="https://github.com/libp2p/rust-libp2p/blob/2fed78f/protocols/gossipsub/src/config.rs"
          >
            <p><strong>문제:</strong> Mesh·heartbeat·cache·queue·validation의 시간과 용량 경계를 구성합니다.</p>
            <p><strong>기여:</strong> Default mesh 6/5/12, 1초 heartbeat, cache histories, 3초 IWANT follow-up와 65,536-byte RPC limit를 제공합니다.</p>
            <p><strong>전제:</strong> Defaults를 그대로 쓰는지 topic별 override가 있는지 운영 receipt에 남깁니다.</p>
            <p><strong>근거 범위:</strong> Versioned local configuration surface와 build-time constraint입니다.</p>
            <p><strong>말하지 않는 것:</strong> 이 기본값이 모든 topology·threat model에 안전하거나 최적이라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="peer-scoring" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · local peer score</p>
          <h2 className="mt-2 text-2xl font-bold">
            Score는 관측을 행동으로 바꾸는 local 장부이지 세계 공통 평판이 아닙니다
          </h2>
        </header>
        <p>
          각 node는 topic별 mesh time, first delivery, delivery deficit, mesh failure와 invalid
          delivery를 계산합니다. Topic 기여에는 cap을 적용한 뒤 application score, IP
          colocation, behavior와 slow-peer penalty를 더합니다. Weight와 threshold가 다르면
          같은 Bob도 Alice와 Carol에게 다른 점수를 받습니다.
        </p>
        <ScoreViz />
        <ExplainedFormula
          question="여러 관측을 한 peer score로 어떻게 합칠까요?"
          idea={<>Topic별 기여를 먼저 합쳐 cap을 적용하고, application 항과 IP·behavior·slow-peer 항을 더합니다. 마지막 숫자는 publish·gossip·graylist threshold와 비교할 때만 행동 의미가 생깁니다.</>}
          formula={String.raw`S=\min(\sum_t w_tP_t,C)+w_aP_a+w_iP_i+w_bP_b+w_sP_s`}
          annotatedFormula={String.raw`S=\underbrace{\min(\sum_t w_tP_t,C)}_{\text{topic 합과 cap}}+\underbrace{w_aP_a}_{\text{application}}+\underbrace{w_iP_i+w_bP_b+w_sP_s}_{\text{IP·behavior·slow 감점}}`}
          operations={[
            {
              expression: String.raw`\min(12,10)=10`,
              annotation: ["topic 기여 12를 cap 10으로 제한"],
            },
            {
              expression: String.raw`10+2-3-1-1=7`,
              annotation: ["application +2와 세 감점 합산", "설명용 숫자이며 default가 아님"],
            },
            {
              expression: String.raw`7\ \text{vs configured thresholds}`,
              annotation: ["숫자만으로 good/bad를 정하지 않고", "publish·gossip·graylist action을 각각 결정"],
            },
          ]}
          terms={[
            { symbol: "P_t", name: "topic evidence", description: "P1~P4의 time·delivery·failure·invalid 관측을 topic weight와 합친 값입니다." },
            { symbol: "C", name: "topic score cap", description: "양수 topic contribution 전체가 score를 독점하지 못하게 하는 상한입니다." },
            { symbol: "P_a", name: "application score", description: "Application이 별도 정책으로 공급하는 local 값입니다." },
            { symbol: "P_i,P_b,P_s", name: "penalties", description: "IP colocation, behavior와 slow consumer에 대한 local 항입니다." },
          ]}
          assumptions={[
            "모든 weight, cap, decay와 thresholds는 같은 deployment config에서 가져옵니다.",
            "12·10·+2·−3·−1·−1은 계산 설명용이며 library default가 아닙니다.",
            "Score는 identity proof나 Byzantine consensus가 아닙니다.",
          ]}
          interpretation="예시 score는 7입니다. 그러나 publish threshold가 0인지 10인지에 따라 같은 7의 행동이 달라집니다. 숫자와 함께 threshold·config revision을 기록해야 합니다."
        />
        <p>
          Heartbeat는 negative score peer를 mesh에서 PRUNE하고, mesh가 너무 클 때 일부
          high-score peer와 outbound 최소 수를 보존합니다. 낮은 점수를 곧 악성 identity로
          확정하면 안 됩니다. 느린 network, 잘못 튜닝한 delivery threshold와 같은 benign
          원인도 score를 낮출 수 있으므로 partition·false-positive를 함께 측정해야 합니다.
        </p>
        <div id="paper-rust-gossipsub-score-0571">
          <CitationBlock
            source="libp2p-gossipsub 0.50.0 — peer_score.rs · commit 2fed78f"
            citeKey={3}
            type="code"
            href="https://github.com/libp2p/rust-libp2p/blob/2fed78f/protocols/gossipsub/src/peer_score.rs"
          >
            <p><strong>문제:</strong> Spam·under-delivery·slow peer 영향을 줄이면서 useful mesh를 유지합니다.</p>
            <p><strong>기여:</strong> P1~P7, application·IP·behavior·slow-peer 항, cap·decay와 threshold report를 구현합니다.</p>
            <p><strong>전제:</strong> 운영자가 topology와 threat model에 맞는 params·thresholds를 검증합니다.</p>
            <p><strong>근거 범위:</strong> Node-local observations를 score report로 바꾸는 state transition입니다.</p>
            <p><strong>말하지 않는 것:</strong> 보편적인 안전 weight, peer의 실제 신원, global reputation을 제공하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · validation과 release</p>
          <h2 className="mt-2 text-2xl font-bold">
            Strict wire validation과 application validation은 서로 다른 문입니다
          </h2>
        </header>
        <p>
          기본 <code>ValidationMode::Strict</code>는 author, sequence number와 signature 같은
          GossipSub wire 조건을 검사합니다. 반면 <code>validate_messages</code>의 기본값은
          false입니다. 즉 별도로 켜지 않으면 protocol 검사를 통과한 received message는 local
          event로 전달되고 mesh로 자동 forward됩니다.
        </p>
        <ValidationBranchViz />
        <p>
          Manual application validation을 켜면 message는 memcache에서 기다립니다. Payroll
          schema, publisher authorization, timestamp, application signature와 CID 형식을 검사한
          뒤 <code>Accept</code>하면 forward합니다. <code>Reject</code>는 cache에서 지우고 invalid
          delivery penalty를 적용하며, <code>Ignore</code>는 지우되 그 penalty는 적용하지 않습니다.
        </p>
        <p>
          Validation 결과를 너무 늦게 보고해 message가 cache에 없으면 함수는 false를 반환하고
          forward하지 못합니다. 반대로 이미 auto-forward된 message는 뒤에서 전 세계적으로
          회수할 수 없습니다. 그래서 업무 state는 application validation과 CID fetch 검증을
          모두 통과한 뒤 갱신해야 합니다.
        </p>
        <p>
          Release test는 duplicate ID, oversized message, no peer, all queues full, delayed
          validation, invalid signature, cache shift, missing IWANT reply, score decay와 mesh
          churn을 각각 재현합니다. Receipt에는 config revision, message ID와 CID, selected·queued
          peer 수, validation result, cache age, score report와 threshold action을 남깁니다.
        </p>
        <h3 className="text-xl font-semibold">읽고 나면 답해야 할 질문</h3>
        <p>
          “왜 publish 성공이 subscriber receipt가 아닌가?”, “왜 message ID가 CID 검증을
          대신하지 못하는가?”, “최초 local publish와 heartbeat gossip은 어떤 peer 집합을
          쓰는가?”, “Strict와 manual validation은 무엇이 다른가?”, “score 7만 보고 Bob을
          차단할 수 없는 이유는 무엇인가?”를 같은 announcement 사례로 설명할 수 있어야 합니다.
        </p>
      </section>
    </article>
  );
}
