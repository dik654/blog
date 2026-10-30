import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const FLOW_SCENES = [
  "digest 구독",
  "broadcast 호출",
  "로컬 접수",
  "network 전송",
  "Bob decode",
  "waiter 응답",
  "cache 잔류",
  "업무 판단",
] as const;

const FLOW_SHORT_LABELS = ["구독", "호출", "접수", "전송", "decode", "응답", "cache", "업무"] as const;

const FLOW_NOTES = [
  "Bob의 Application이 descriptor의 digest를 계산하고 subscribe(d7)를 호출합니다. d7은 이 글에서 hash(descriptor bytes)를 짧게 부르는 설명용 이름입니다. Cache에 아직 없으므로 Bob Engine은 oneshot responder를 waiter로 보관합니다.",
  "Alice의 Application이 같은 descriptor를 recipients와 함께 broadcast합니다. 호출은 Mailbox에 Broadcast command를 넣으려는 시도이며 이 시점에 Bob 쪽 상태는 아직 바뀌지 않습니다.",
  "Alice Mailbox가 Feedback::Ok 또는 overflow policy가 처리한 Feedback::Backoff를 돌려줍니다. 둘 다 로컬 endpoint가 요청을 처리한다는 뜻일 뿐, Alice Engine의 send 완료나 Bob의 수신 확인이 아닙니다.",
  "Alice Engine이 command를 꺼내 digest d7의 item을 로컬 cache에 넣고 network sender의 send_ref를 호출합니다. 이 함수 경로에는 Bob의 application acknowledgement를 기다리는 단계가 없습니다.",
  "Bob Engine의 receiver가 peer와 frame을 받고 Codec으로 message를 decode합니다. Decode가 실패하면 해당 frame은 Invalid로 기록하고 waiter와 cache는 바꾸지 않습니다. Digest는 decoded message에서 다시 계산됩니다.",
  "Bob Engine이 d7의 waiters를 꺼내 Arc<Message>를 보냅니다. Bob Application이 typed item을 얻었다는 node-local receipt가 생기지만, total order·disk durability·업무 승인까지 생긴 것은 아닙니다.",
  "Sender Alice가 latest.primary에 있으면 d7을 Alice의 bounded deque에 넣고 global items map에 한 번만 저장합니다. Sender가 eligible하지 않아도 이미 기다리던 waiter는 응답받을 수 있지만 item은 resident cache에 남지 않습니다.",
  "Bob Application이 expected digest, sender identity, schema와 업무 규칙을 별도로 확인합니다. 이 판단은 broadcast crate 바깥의 책임입니다. 따라서 local admission, node-local item receipt, application acceptance는 서로 다른 증거로 기록해야 합니다.",
] as const;

const ACTORS = [
  ["BOB APP", "d7 subscriber"],
  ["ALICE APP", "broadcast caller"],
  ["ALICE MAILBOX", "bounded ingress"],
  ["ALICE ENGINE", "cache · send_ref"],
  ["P2P CHANNEL", "peer · encoded bytes"],
  ["BOB ENGINE", "decode · waiter · cache"],
] as const;

const ACTIVE: readonly (readonly number[])[] = [
  [0, 5],
  [1, 2],
  [1, 2],
  [3, 4],
  [4, 5],
  [0, 5],
  [5],
  [0],
];

const STATE = [
  ["Alice request", "없음", "Bob waiter", "d7 · pending", "d7 item", "없음"],
  ["Alice request", "enqueue 시도", "Bob waiter", "d7 · pending", "d7 item", "없음"],
  ["local feedback", "Ok 또는 Backoff", "Bob receipt", "없음", "network", "아직"],
  ["Alice cache", "d7", "network", "send_ref", "Bob waiter", "pending"],
  ["Bob decode", "성공", "computed digest", "d7", "Bob waiter", "pending"],
  ["Bob receipt", "Arc<Message>", "Bob waiter", "resolved", "durable", "아님"],
  ["Alice eligible", "yes", "peer deque", "d7", "items[d7]", "resident"],
  ["업무 검사", "별도", "broadcast 완료", "node-local", "application", "판단 필요"],
] as const;

function FlowMap({ active }: { active: number }) {
  return (
    <div aria-label="Bob의 digest 구독부터 Alice broadcast와 Bob의 typed item 수신까지 이어지는 경로">
      <div className="grid gap-px bg-border p-px sm:grid-cols-2 xl:grid-cols-3">
        {ACTORS.map(([name, role], index) => {
          const isActive = ACTIVE[active].includes(index);
          return (
            <div
              key={name}
              className={`min-w-0 bg-background px-2.5 py-3 transition-colors sm:min-h-24 sm:px-3 ${isActive ? "ring-2 ring-inset ring-primary" : "opacity-45"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`block break-keep font-mono text-[8px] font-black sm:text-[9px] ${isActive ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
                <span className="font-mono text-[8px] text-muted-foreground" aria-label={`${index + 1}번째 구성요소`}>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <strong className="mt-1 block break-keep text-[11px] leading-5 sm:text-xs">{role}</strong>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
        {[0, 1, 2].map((index) => (
          <div key={STATE[active][index * 2]} className="min-w-0 bg-background px-2 py-2.5 sm:py-3">
            <span className="block break-keep text-muted-foreground">{STATE[active][index * 2]}</span>
            <strong className="mt-1 block break-keep text-primary">{STATE[active][index * 2 + 1]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BroadcastFlowViz() {
  const scenes = useAnimatedScenes(FLOW_SCENES.length, 4300, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame
      eyebrow="한 digest 추적 · Commonware v2026.9.0"
      title="로컬 접수와 Bob의 typed item 수신은 다른 시점에 생깁니다"
      description="같은 descriptor digest d7을 Bob의 구독부터 Alice의 broadcast, decode, waiter 응답과 cache 잔류까지 추적합니다."
      note="d7은 설명용 별칭입니다. Broadcast crate는 application 승인, total order와 durable storage를 만들지 않습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-commonware-broadcast-scene={active}
        tabIndex={0}
        role="group"
        aria-label="하나의 digest가 구독과 broadcast를 거쳐 Bob의 typed item이 되는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div className="overflow-x-auto" aria-label="Commonware Broadcast 수명주기의 여덟 장면">
            <div className="grid min-w-[352px] grid-cols-8 gap-px bg-border p-px lg:min-w-0">
              {FLOW_SCENES.map((scene, index) => (
                <button
                  type="button"
                  key={scene}
                  aria-pressed={index === active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-11 bg-background px-0.5 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:min-w-0 lg:py-2 ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">{FLOW_SHORT_LABELS[index]}</strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 sm:mt-3"><FlowMap active={active} /></div>
          <p data-scene-note className="mt-2 min-h-[9.5rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[6rem] sm:pl-4 sm:text-sm sm:leading-6">{FLOW_NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={FLOW_SCENES} controlLabels={FLOW_SCENES} playLabel="Broadcast 수명주기 재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={FLOW_SCENES} notes={FLOW_NOTES} />
    </VizFrame>
  );
}

export function BroadcastCacheViz() {
  return (
    <VizFrame
      eyebrow="한 item · 여러 peer reference"
      title="Peer별 deque가 모두 d7을 놓을 때 shared item도 제거됩니다"
      description="A와 B가 같은 digest를 보냈어도 payload는 items map에 하나만 저장하고, 각 eligible peer의 deque가 reference 하나씩을 가집니다."
      note="이 count는 cache reference 수입니다. Recipient quorum, durable replica 수나 consensus vote 수가 아닙니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="grid gap-px bg-border p-px sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch" aria-label="A와 B의 digest deque가 shared d7 item을 참조하는 구조">
        <div className="min-w-0 bg-background p-3">
          <span className="font-mono text-[9px] font-black text-primary">PEER A DEQUE</span>
          <strong className="mt-2 block text-sm">d7 · d3</strong>
          <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">최신 digest를 앞에 둡니다.</p>
        </div>
        <div className="hidden items-center bg-background px-1 text-primary sm:flex" aria-hidden>→</div>
        <div className="min-w-0 bg-background p-3 ring-2 ring-inset ring-primary">
          <span className="font-mono text-[9px] font-black text-primary">GLOBAL ITEMS</span>
          <strong className="mt-2 block text-sm">items[d7] · Arc 하나</strong>
          <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">count(d7)=2</p>
        </div>
        <div className="hidden items-center bg-background px-1 text-primary sm:flex" aria-hidden>←</div>
        <div className="min-w-0 bg-background p-3">
          <span className="font-mono text-[9px] font-black text-primary">PEER B DEQUE</span>
          <strong className="mt-2 block text-sm">d7 · d5</strong>
          <p className="mt-1 text-[10px] leading-5 text-muted-foreground sm:text-xs">같은 payload를 다시 저장하지 않습니다.</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
        <p className="bg-background px-2 py-3"><strong className="block text-primary">A·B 참조</strong>count=2 · item 유지</p>
        <span className="flex items-center bg-background px-1 text-primary" aria-hidden>→</span>
        <p className="bg-background px-2 py-3"><strong className="block text-primary">A에서 eviction</strong>count=1 · item 유지</p>
        <span className="flex items-center bg-background px-1 text-primary" aria-hidden>→</span>
        <p className="bg-background px-2 py-3"><strong className="block text-primary">B에서도 eviction</strong>count=0 · item 제거</p>
      </div>
    </VizFrame>
  );
}

export function BroadcastBoundaryViz() {
  const boundaries = [
    ["LOCAL FEEDBACK", "Ok · Backoff · Closed", "Alice endpoint 상태"],
    ["NODE-LOCAL RECEIPT", "subscribe(d7) → item", "Bob process의 typed item"],
    ["CACHE RESIDENCE", "eligible peer · deque", "Bob memory에 남는 기간"],
    ["APPLICATION", "sender · schema · 업무 규칙", "crate 밖의 승인"],
  ] as const;
  return (
    <VizFrame
      eyebrow="완료 증거를 분리하기"
      title="한 번의 broadcast에는 서로 바꿔 쓸 수 없는 네 가지 상태가 있습니다"
      description="장애와 재시도는 어느 상태에서 멈췄는지에 따라 달라집니다."
      note="Network disconnect와 decode 오류는 Engine receive 경로의 실패이고, 업무 거절은 typed item을 얻은 뒤 Application이 내리는 결정입니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="grid gap-px bg-border p-px sm:grid-cols-2" aria-label="broadcast 과정에서 구분해야 하는 네 가지 완료 상태">
        {boundaries.map(([name, evidence, meaning]) => (
          <div key={name} className="min-w-0 bg-background p-3">
            <span className="font-mono text-[9px] font-black text-primary">{name}</span>
            <strong className="mt-1 block break-keep text-xs sm:text-sm">{evidence}</strong>
            <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground sm:text-xs">{meaning}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
