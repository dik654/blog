import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "Anchor", "두 구간", "미리 받기", "순서", "처리", "전환", "실패"] as const;

const NOTES = [
  "동기화는 가장 높은 slot의 block을 내려받는 작업이 아닙니다. 신뢰할 시작점에서 현재 slot까지 부모가 이어지는 block을 검증하고, blockchain service가 head를 전진시킨 뒤 live gossip 처리 권한을 넘기는 과정입니다.",
  "Checkpoint sync endpoint는 finalized state와 그 state의 latest block을 내려줍니다. Prysm은 fork에 맞게 decode하고 state header body root와 block body root가 같은지 확인합니다. 이 검사는 두 파일의 내부 짝을 확인할 뿐, endpoint가 정직하다는 근거를 만들지는 않습니다.",
  "Prysm은 peer 상태에서 본 finalized epoch의 시작 slot까지 먼저 따라갑니다. 그런 다음 여러 peer가 공유하는 non-finalized view를 사용해 current slot까지 따라갑니다. Finalized 구간과 live head 구간은 처리 함수도 다릅니다.",
  "Blocks queue는 네 개의 lookahead state machine으로 range를 미리 요청합니다. 설명에서는 batch를 4 slot로 줄였습니다. 109–112 응답이 101–104보다 먼저 와도 뒤 state machine은 dataParsed에 머뭅니다.",
  "onReadyToSendEvent는 가장 이른 state machine이거나, 앞선 모든 state machine이 new·scheduled·dataParsed 상태를 벗어난 경우에만 fetchedData로 보냅니다. 네트워크 도착 순서가 chain 처리 순서가 되지 않습니다.",
  "Queue는 순서가 맞는 batch를 내보낼 뿐입니다. 실제 block 검증·state transition·DB 저장과 HeadSlot 변경은 ReceiveBlockBatch 또는 ReceiveBlock을 구현한 blockchain service가 소유합니다. Queue가 별도 durable cursor를 기록한다고 확대하지 않습니다.",
  "HeadSlot이 current slot에 도달하면 initial sync는 synced 값을 true로 바꿉니다. 그 전에는 live block validator가 gossip block을 ValidationIgnore로 돌려보냅니다. 완료 뒤에는 같은 validator가 정상 검증 경로로 들어가므로 두 writer가 동시에 head를 바꾸지 않습니다.",
  "앞 range가 invalid하면 해당 peer를 downscore하고 state machine을 다시 new로 돌립니다. 뒤 range를 이미 받았어도 앞 구간이 처리되지 않았으므로 내보내지 않습니다. Empty range는 skipped 상태가 되며, 반복해서 막히면 reset하거나 alternative fork를 찾습니다.",
] as const;

const RECEIPTS = [
  "anchor → finalized target → current head → live gossip",
  "state bytes + latest block bytes · 내부 짝 확인 · provider trust 별도",
  "phase 1: head 100→128 · phase 2: 128→140",
  "109–112 도착 · dataParsed · 앞 range 대기",
  "101–104 → 105–108 → 109–112 순서로 fetchedData 전달",
  "queue는 ordering · blockchain receiver는 검증·저장·HeadSlot",
  "HeadSlot 140 · synced=true · gossip Ignore 해제",
  "앞 range 실패 · 뒤 range 보류 · peer evidence 기록",
] as const;

type WindowState = "new" | "scheduled" | "dataParsed" | "sent" | "skipped";

function StateCell({
  label,
  value,
  detail,
  active,
}: {
  label: string;
  value: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <div className={`min-w-0 bg-background p-2.5 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="block text-[8px] font-bold text-muted-foreground sm:text-[9px]">{label}</span>
      <strong className={`mt-1 block break-keep text-[10px] leading-4 sm:text-xs ${active ? "text-primary" : ""}`}>{value}</strong>
      <span className="mt-1 block break-keep text-[8px] leading-3 text-muted-foreground sm:text-[9px] sm:leading-4">{detail}</span>
    </div>
  );
}

function windowState(active: number, index: number): WindowState {
  if (active < 3) return "new";
  if (active === 3) return index === 2 ? "dataParsed" : "scheduled";
  if (active === 4) {
    if (index === 0) return "sent";
    if (index === 1 || index === 2) return "dataParsed";
    return "scheduled";
  }
  if (active === 7) return index === 0 ? "new" : index === 2 ? "dataParsed" : "scheduled";
  return "sent";
}

function SyncMap({ active }: { active: number }) {
  const head = active === 6 ? 140 : active === 5 ? 112 : 100;
  const synced = active === 6;
  const failed = active === 7;
  const ranges = ["101–104", "105–108", "109–112", "113–116"];

  return (
    <div aria-label="Prysm가 checkpoint anchor에서 current slot까지 따라가는 상태 지도">
      <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
        <StateCell label="Origin" value="slot 96" detail="state · block pair" active={active === 1} />
        <StateCell label="Local chain" value={`HeadSlot ${head}`} detail="blockchain service 소유" active={active === 5 || active === 6} />
        <StateCell label="Finalized target" value="slot 128" detail="phase 1 · peer finalized view" active={active === 2} />
        <StateCell label="Current target" value="slot 140" detail="phase 2 · local clock" active={active === 2 || active === 6} />
      </div>

      <div className="mt-px grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
        {ranges.map((range, index) => {
          const state = windowState(active, index);
          const isActive =
            (active === 3 && index === 2) ||
            (active === 4 && index <= 2) ||
            (active === 7 && (index === 0 || index === 2));
          return <StateCell key={range} label={`Range ${range}`} value={state} detail={state === "dataParsed" ? "응답 보관 · 앞 구간 대기" : state === "sent" ? "ordered consumer로 전달" : state === "new" && failed ? "invalid 응답 뒤 재시도" : "lookahead FSM"} active={isActive} />;
        })}
      </div>

      <div className="mt-px grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-3">
        <StateCell
          label="Queue owner"
          value={active === 7 ? "range retry" : active >= 4 ? "ordered fetchedData" : "range state machines"}
          detail="fetch·wait·send 순서"
          active={active === 3 || active === 4 || active === 7}
        />
        <StateCell
          label="Blockchain owner"
          value={active === 5 || active === 6 ? "ReceiveBlock(batch)" : "HeadSlot 100 유지"}
          detail={active === 5 || active === 6 ? "검증 · transition · 저장" : "queue 응답은 아직 chain state 아님"}
          active={active === 5}
        />
        <StateCell
          label="Live block validator"
          value={synced ? "정상 검증" : "ValidationIgnore"}
          detail={synced ? "initial sync 완료" : "Syncing() = true"}
          active={active === 6}
        />
      </div>
    </div>
  );
}

export default function PrysmSyncFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Prysm v7.3.1"
      title="먼저 받은 range가 아니라 먼저 이어지는 range부터 chain에 넣습니다"
      description="Checkpoint origin, 두 sync phase, 네 lookahead state machine, blockchain receiver와 gossip gate의 상태 변화를 한 지도에서 추적합니다."
      note="Slot 96·100·128·140과 4-slot batch는 순서를 보기 위한 설명용 값입니다. 실제 queue는 설정된 batch limit을 사용하고 시작할 때 최대 32 slot을 되짚습니다. 함수와 state transition은 고정한 v7.3.1 source에서 확인했습니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-sync-scene={active}
        tabIndex={0}
        role="group"
        aria-label="checkpoint anchor에서 live gossip까지 이어지는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div
          data-viz-scene-stage
          className="max-h-[calc(100svh-12rem)] overflow-y-auto overscroll-contain pr-1 sm:max-h-none sm:overflow-visible sm:pr-0"
        >
          <div className="overflow-x-auto" aria-label="동기화의 여덟 장면">
            <div className="grid min-w-[352px] grid-cols-8 gap-px bg-border p-px lg:min-w-0">
              {SCENES.map((scene, index) => (
                <button
                  type="button"
                  key={scene}
                  aria-pressed={index === active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-11 bg-background px-0.5 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:min-w-0 lg:py-2 ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 sm:mt-3">
            <SyncMap active={active} />
          </div>

          <div className="mt-2 grid min-h-[6.75rem] grid-cols-[0.62fr_1.38fr] gap-px bg-border p-px sm:mt-3 sm:min-h-[7.5rem]">
            <div className="min-h-[6.25rem] min-w-0 bg-background p-3">
              <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">현재 장면</span>
              <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
            </div>
            <div className="min-h-[6.25rem] min-w-0 bg-background p-3">
              <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">상태 변화</span>
              <strong className="mt-1 block break-keep text-[10px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
            </div>
          </div>

          <p data-scene-note className="mt-1 min-h-[8.5rem] border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-[7.5rem] sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
