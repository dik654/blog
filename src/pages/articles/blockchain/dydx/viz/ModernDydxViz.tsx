import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "주문 서명",
  "로컬 접수",
  "매칭 후보",
  "블록 제안",
  "제안 검사",
  "상태 실행",
  "블록 확정",
  "조회 화면",
] as const;

const SHORT = ["서명", "접수", "후보", "제안", "검사", "실행", "확정", "조회"] as const;

const NOTES = [
  "Alice는 10계약 매수 주문을, Bob은 6계약 매도 주문을 서명합니다. 이 시점에는 상대방·체결 수량·최종 잔액이 아직 정해지지 않았습니다.",
  "Short-term 주문은 CheckTx를 통과한 노드의 MemClob에 들어가 gossip됩니다. 한 노드의 접수 응답과 모든 검증자가 공유하는 committed state는 다른 사실입니다.",
  "Alice는 이미 2계약, Bob은 1계약 체결됐다고 가정합니다. 남은 8과 5 중 작은 5가 가격 조건을 통과한 candidate이며 담보 검사는 아직 남았습니다.",
  "이번 proposer는 local operations queue에서 주문 배치·5계약 match·제거를 뽑아 MsgProposedOperations를 block candidate의 정해진 위치에 넣습니다.",
  "다른 validator의 ProcessProposal은 transaction을 해석하고 순서·필수 injected message·ValidateBasic을 검사합니다. 여기서 ACCEPT해도 fill state가 아직 commit된 것은 아닙니다.",
  "FinalizeBlock 실행에서 ProposedOperations handler가 operation queue를 순서대로 처리합니다. 잔량·중복·담보·position 규칙을 통과한 5계약만 balance·position·fill·fee·event 변화가 됩니다.",
  "CometBFT가 block을 결정하고 application commit이 끝난 뒤 chain state가 authoritative settlement가 됩니다. 제안자가 봤던 모든 local 주문을 포함했다는 공정성까지 뜻하지는 않습니다.",
  "Indexer는 versioned block events를 PostgreSQL query view로 바꿉니다. API가 느리거나 projection이 틀려도 chain settlement owner가 바뀌지는 않으며 retained source로 대조·재생해야 합니다.",
] as const;

const NODES = [
  ["CLIENT", "bid 10 · ask 6"],
  ["MEMCLOB", "node-local view"],
  ["MATCH", "candidate 5"],
  ["PREPARE", "operations tx"],
  ["PROCESS", "ACCEPT / REJECT"],
  ["FINALIZE", "risk · balances"],
  ["COMMIT", "chain state"],
  ["INDEXER", "query projection"],
] as const;

const STATE = [
  ["소유 상태", "서명한 intent", "권위", "사용자", "아직 없음", "체결"],
  ["소유 상태", "open order view", "권위", "각 노드", "차이 가능", "도착 순서"],
  ["소유 상태", "operations queue", "권위", "proposer local", "상한", "5계약"],
  ["소유 상태", "candidate block", "권위", "proposer", "포함", "MsgProposedOperations"],
  ["소유 상태", "proposal verdict", "권위", "validator", "결과", "ACCEPT"],
  ["소유 상태", "working state", "권위", "application", "변경", "positions · balances"],
  ["소유 상태", "committed state", "권위", "consensus", "확정", "fill 5"],
  ["소유 상태", "read model", "권위", "indexer", "파생", "API response"],
] as const;

function Trace({ active }: { active: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = ref.current;
    const target = scroller?.querySelector<HTMLElement>(`[data-dydx-node="${active}"]`);
    if (!scroller || !target) return;
    const left = target.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - target.offsetWidth) / 2, behavior: "auto" });
  }, [active]);

  return (
    <div aria-label="Alice와 Bob의 주문이 로컬 MemClob에서 committed settlement와 indexer view까지 이동하는 경로">
      <div ref={ref} className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-px bg-border p-px" style={{ width: "max(100%, 900px)" }}>
          {NODES.map(([name, value], index) => (
            <div
              key={name}
              data-dydx-node={index}
              className={`relative min-w-0 bg-background px-2 py-3 sm:min-h-24 ${index === active ? "ring-2 ring-inset ring-primary" : index < active ? "opacity-75" : "opacity-35"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[8px] font-black text-primary">{name}</span>
                <span className="font-mono text-[8px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <strong className="mt-3 block break-keep text-center font-mono text-[10px] leading-5 sm:text-xs">{value}</strong>
              {index < NODES.length - 1 ? <span aria-hidden className="absolute -right-1 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-primary bg-background" /> : null}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
        {[0, 1, 2].map((index) => (
          <div key={STATE[active][index * 2]} className="min-w-0 bg-background px-2 py-3">
            <span className="block break-keep text-muted-foreground">{STATE[active][index * 2]}</span>
            <strong className="mt-1 block break-keep text-primary">{STATE[active][index * 2 + 1]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DydxOrderLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = tabsRef.current;
    const target = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !target) return;
    const left = target.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - target.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="한 주문의 전체 경로 · Alice bid 10 · Bob ask 6"
      title="접수된 주문은 proposer의 후보를 거쳐 block에 실행·확정된 뒤에만 settlement가 됩니다"
      description="로컬 주문장, 제안 판정, 애플리케이션 상태와 조회용 장부는 서로 다른 주체가 소유합니다."
      note="그림은 dYdX Chain protocol/v9.7.1의 short-term order 경로를 축약합니다. TWAP·conditional·liquidation은 별도 operation을 추가합니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-dydx-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="dYdX 주문의 접수부터 indexer 조회까지 여덟 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-px bg-border p-px" style={{ width: "max(100%, 620px)" }}>
              {SCENES.map((scene, index) => (
                <button
                  type="button"
                  key={scene}
                  aria-pressed={index === scenes.active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:py-2 ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">{SHORT[index]}</strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 sm:mt-3"><Trace active={scenes.active} /></div>
          <p data-scene-note className="mt-2 min-h-[10rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[6.5rem] sm:pl-4 sm:text-sm sm:leading-6">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="dYdX 주문 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

export function OrderPathViz() {
  const rows = [
    ["short-term", "flag 0", "CheckTx · MemClob", "block height 만료"],
    ["long-term", "flag 64", "KV state · MemClob", "block time 만료"],
    ["conditional", "flag 32", "KV state · trigger queue", "oracle trigger"],
    ["TWAP", "flag 128", "KV state · suborders", "시간별 실행"],
  ] as const;
  return (
    <VizFrame
      eyebrow="OrderId가 고르는 보존 경로"
      title="모든 주문이 같은 orderbook 상태에 저장되지는 않습니다"
      description="flag는 단순 UI 분류가 아니라 gossip·KV state·expiry·trigger 경로를 바꿉니다."
      note="v9.7.1은 TWAP suborder flag 256도 stateful order로 다룹니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="grid gap-px bg-border p-px md:grid-cols-4">
        {rows.map(([kind, flag, store, expiry]) => (
          <div className="min-w-0 bg-background p-4" key={kind}>
            <div className="flex items-center justify-between gap-2"><strong className="text-sm">{kind}</strong><span className="font-mono text-[9px] text-primary">{flag}</span></div>
            <p className="mt-3 break-keep text-xs font-bold">{store}</p>
            <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{expiry}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

export function AuthorityViz() {
  const rows = [
    ["로컬", "MemClob · operations queue", "각 validator", "다를 수 있음"],
    ["후보", "MsgProposedOperations", "이번 proposer", "검사 전"],
    ["합의", "committed balances · positions · fills", "CometBFT + app", "권위 있음"],
    ["파생", "PostgreSQL query projection", "Indexer", "재구성 가능"],
  ] as const;
  return (
    <VizFrame
      eyebrow="상태 소유권"
      title="주문 화면에 보인 상태와 합의로 확정된 상태를 같은 장부로 읽으면 안 됩니다"
      description="각 층은 서로 다른 목적·수명·복구 경로를 가집니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(([level, state, owner, property], index) => (
          <div key={level} className={`min-w-0 bg-background p-4 ${index === 2 ? "ring-2 ring-inset ring-primary" : ""}`}>
            <span className="font-mono text-[9px] font-black text-primary">0{index + 1} · {level}</span>
            <strong className="mt-3 block break-keep text-xs leading-5">{state}</strong>
            <p className="mt-2 text-[10px] leading-5 text-muted-foreground">Owner · {owner}</p>
            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">성질 · {property}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
