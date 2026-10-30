import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "Route", "State ID", "Root", "State", "Metadata", "JSON", "Reorg 경계"] as const;

const NOTES = [
  "한 HTTP 요청은 Go ServeMux의 GET route, middleware, GetStateRoot handler, state lookup과 metadata 판정을 거쳐 JSON 응답이 됩니다. 이 REST 경로는 별도로 등록된 gRPC server를 통과하지 않습니다.",
  "Service가 GET /eth/v1/beacon/states/{state_id}/root를 GetStateRoot에 직접 연결합니다. 이 endpoint는 JSON Accept와 압축 인코딩 middleware, 요청 수·지연·오류 계측을 거칩니다.",
  "head는 node가 현재 canonical head라고 보는 symbolic identifier입니다. 같은 Stater가 head·genesis·finalized·justified·slot·state root를 서로 다른 lookup 경로로 해석합니다.",
  "StateRoot(head)는 HeadBlock을 읽고 block header의 state_root를 반환합니다. 이 값은 BeaconState의 SSZ HashTreeRoot이며 block root와 다릅니다.",
  "Handler는 metadata를 만들기 위해 State(head)를 다시 호출합니다. head 경로는 HeadState를 반환하며, 이 state의 latest block header가 finalized 판정에 필요한 block root의 재료가 됩니다.",
  "execution_optimistic은 head의 현재 optimistic mode를 다시 묻습니다. finalized는 BeaconState의 latest block header를 hash해 얻은 block root를 FinalizationFetcher에 넘겨 계산합니다.",
  "응답은 data.root, execution_optimistic, finalized 세 field를 JSON으로 보냅니다. 이 endpoint의 v4.0.0 OpenAPI와 Prysm route는 SSZ response가 아니라 application/json만 정의합니다.",
  "Source에서 StateRoot(head), State(head), IsOptimistic(head)는 한 snapshot token 없이 별도 호출됩니다. 사이에 reorg가 나면 A의 state root와 B의 state·metadata가 섞일 가능성을 테스트해야 합니다. 실제 재현 결과는 아닙니다.",
] as const;

const RECEIPTS = [
  "HTTP GET → ServeMux → handler → lookup → metadata → JSON",
  "GET route · JSON Accept · metrics wrapper",
  "head | genesis | finalized | justified | slot | state root",
  "HeadBlock(A).state_root = state root Sₐ",
  "HeadState(A) → latest block header",
  "optimistic(state ID) · finalized(block root)",
  "{data.root, execution_optimistic, finalized}",
  "A→B reorg 사이의 다중 head 해석 · 미측정 검증 대상",
] as const;

function Cell({ label, value, detail, active, muted }: { label: string; value: string; detail: string; active?: boolean; muted?: boolean }) {
  return (
    <div className={`min-w-0 bg-background p-1.5 sm:p-2 ${active ? "ring-2 ring-inset ring-primary" : ""} ${muted ? "opacity-35" : ""}`}>
      <span className="block break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[9px]">{label}</span>
      <strong className={`mt-0.5 block break-keep text-[9px] leading-[0.85rem] sm:mt-1 sm:text-xs sm:leading-4 ${active ? "text-primary" : ""}`}>{value}</strong>
      <span className="mt-1 hidden break-keep text-[9px] leading-4 text-muted-foreground sm:block">{detail}</span>
    </div>
  );
}

function Flow({ active }: { active: number }) {
  const reorg = active === 7;
  return (
    <div aria-label="Beacon API state root 요청이 route와 조회 함수를 거쳐 JSON이 되는 과정">
      <div className="grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="CLIENT" value="GET …/states/head/root" detail="Accept: application/json" active={active === 0 || active === 1} />
        <Cell label="GO SERVEMUX" value="GET route match" detail="REST route 직접 등록" active={active === 1} />
        <Cell label="MIDDLEWARE" value="Accept · Encoding · Metrics" detail="request count·latency·error" active={active === 1} />
      </div>

      <div className="mt-px grid grid-cols-[0.75fr_1.25fr] gap-px bg-border p-px">
        <Cell label="PATH VALUE" value="state_id = head" detail="symbolic current view" active={active === 2 || reorg} />
        <Cell label="GETSTATEROOT HANDLER" value="Root → State → metadata → JSON" detail="각 단계 오류에서 즉시 반환" active={active === 0 || active === 6} />
      </div>

      <div className="mt-px grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="STATE ROOT LOOKUP" value={reorg ? "HeadBlock A → Sₐ" : "HeadBlock A → Sₐ"} detail="block header의 state_root" active={active === 3 || reorg} />
        <Cell label="STATE LOOKUP" value={reorg ? "HeadState B" : "HeadState A"} detail="BeaconState object" active={active === 4 || reorg} />
        <Cell label="OPTIMISTIC LOOKUP" value={reorg ? "current head B" : "current head A"} detail="head mode 재확인" active={active === 5 || reorg} />
      </div>

      <div className="mt-px grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="STATE ROOT" value={reorg ? "Sₐ" : "Sₐ"} detail="BeaconState HashTreeRoot" active={active === 3 || active === 6 || reorg} />
        <Cell label="BLOCK ROOT" value={reorg ? "Bᵦ from state B" : "Bₐ from state A"} detail="latest header HashTreeRoot" active={active === 5 || reorg} />
        <Cell label="FINALITY" value={reorg ? "IsFinalized(Bᵦ)" : "IsFinalized(Bₐ)"} detail="state root가 아닌 block root 기준" active={active === 5 || reorg} />
      </div>

      <div className="mt-px grid grid-cols-3 gap-px bg-border p-px">
        <Cell label="data.root" value={reorg ? "Sₐ" : "Sₐ"} detail="0x-prefixed root" active={active === 6 || reorg} />
        <Cell label="execution_optimistic" value="false" detail="설명용 정상 응답" active={active === 6 || active === 5 || reorg} />
        <Cell label="finalized" value="false" detail={reorg ? "Bᵦ 기준" : "Bₐ 기준"} active={active === 6 || active === 5 || reorg} />
      </div>
    </div>
  );
}

export default function PrysmBeaconAPIFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 15000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Prysm v7.3.1"
      title="state-root 응답의 조회 경로"
      description="GET /eth/v1/beacon/states/head/root 요청을 JSON 응답까지 추적합니다."
      note="A·B와 축약 root는 설명용입니다. 호출 순서와 응답 field는 Prysm v7.3.1 commit 96d418cd와 Beacon APIs v4.0.0에서 확인했습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-beacon-api-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Beacon API state root 요청의 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div className="overflow-x-auto" aria-label="Beacon API 요청의 여덟 장면">
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

          <div className="mt-2 sm:mt-3"><Flow active={active} /></div>

          <div className="mt-2 grid min-h-[4.75rem] grid-cols-[0.5fr_1.5fr] gap-px bg-border p-px sm:mt-3 sm:min-h-[5rem] sm:grid-cols-[0.62fr_1.38fr]">
            <div className="min-w-0 bg-background p-2 sm:p-3">
              <span className="text-[9px] font-bold text-muted-foreground">현재 장면</span>
              <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
            </div>
            <div className="min-w-0 bg-background p-2 sm:p-3">
              <span className="text-[9px] font-bold text-muted-foreground">확인한 경계</span>
              <strong className="mt-1 block break-keep text-[9px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
            </div>
          </div>

          <p data-scene-note className="mt-2 min-h-[5.5rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[4.5rem] sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
