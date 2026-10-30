import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "조립", "블록 생성", "저장 확인", "합의 전달", "내용 검증", "최종 확정", "확정 기록"] as const;

const NOTES = [
  "Commonware bridge 예제는 블록 원문, 그 블록의 digest, Simplex certificate를 한 저장 상태로 합치지 않습니다. Application이 indexer와 Simplex 사이에서 서로 다른 확인을 연결합니다.",
  "Runtime Context가 indexer stream, 인증 P2P, Application mailbox와 Simplex Engine을 만듭니다. Vote·certificate·resolver 메시지는 P2P channel 0·1·2로 분리됩니다.",
  "Application이 Random 블록 하나를 만들고 encode한 byte 배열을 hash합니다. 화면의 숫자 42는 설명용 가정이며 실제 코드는 runtime 난수 값을 사용합니다.",
  "Application은 블록 원문을 PutBlock으로 indexer에 보냅니다. Success(true)를 받지 못하면 digest를 Simplex에 넘기지 않고 현재 proposal을 끝냅니다.",
  "저장 확인을 받은 뒤에만 Application이 response.send(digest)를 호출합니다. Simplex가 합의하는 payload는 블록 원문이 아니라 이 digest입니다.",
  "다른 proposal을 검증할 때 Application은 GetBlock(digest)로 원문을 되찾습니다. 블록이 없으면 false이고, Bridge 블록이면 포함된 외부 certificate까지 검증합니다.",
  "Simplex가 finalization을 만들면 reporter로 연결된 같은 Application mailbox에 Activity::Finalization이 도착합니다. Certificate 생성은 indexer 기록과 아직 다른 상태입니다.",
  "Application은 PutFinalization으로 certificate를 indexer에 보냅니다. Success 응답이 finalization 기록 요청의 마지막 관찰값이며, 이 예제는 별도 Application state root를 만들지 않습니다.",
] as const;

const RECEIPTS = [
  "블록 원문 · digest · finalization certificate가 서로 다른 경계에 있음",
  "Runtime child context · P2P channel 0·1·2 · Application mailbox",
  "Random(42) 블록 원문 · hash(encode(block))",
  "PutBlock(block) → Success(true)",
  "response.send(digest) → Simplex proposal payload",
  "GetBlock(digest) → Block · verify=true/false",
  "Activity::Finalization(certificate) → Application reporter",
  "PutFinalization(certificate) → Success(true)",
] as const;

const ACTORS = [
  ["RUNTIME CONTEXT", "작업·자원 생애", "하위 context와 실행 자원을 만듭니다."],
  ["APPLICATION", "블록 원문·검증", "블록 원문과 digest 사이의 경계를 소유합니다."],
  ["INDEXER", "블록·certificate 보관", "Put/Get 요청에 별도 성공 응답을 돌려줍니다."],
  ["SIMPLEX", "Digest 순서·finalization", "블록 내용을 직접 저장하지 않고 payload digest를 합의합니다."],
  ["AUTHENTICATED P2P", "Vote·certificate·resolver 전달", "Simplex 메시지를 인증된 peer 사이에 전달합니다."],
] as const;

const ACTIVE_ACTORS: readonly (readonly number[])[] = [
  [0, 1, 2, 3, 4],
  [0, 1, 2, 3, 4],
  [1],
  [1, 2],
  [1, 3, 4],
  [1, 2],
  [1, 3, 4],
  [1, 2],
];

const TOKEN_LEFT = [50, 10, 30, 50, 70, 30, 30, 50] as const;

function ActorCell({ index, active }: { index: number; active: boolean }) {
  const [name, role, detail] = ACTORS[index];
  return (
    <div className={`min-w-0 bg-background p-2.5 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : "opacity-45"}`}>
      <span className={`block break-keep text-[8px] font-black leading-3 ${active ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-4 sm:text-xs sm:leading-5">{role}</strong>
      <span className="mt-1 block break-keep text-[9px] leading-4 text-muted-foreground sm:text-[10px]">{detail}</span>
    </div>
  );
}

function SystemMap({ active, reducedMotion }: { active: number; reducedMotion: boolean }) {
  const activeActors = ACTIVE_ACTORS[active];
  return (
    <div aria-label="Commonware bridge 예제의 Runtime, Application, Indexer, Simplex와 P2P 경계">
      <div className="hidden grid-cols-5 gap-px bg-border p-px sm:grid">
        {ACTORS.map((actor, index) => <ActorCell key={actor[0]} index={index} active={activeActors.includes(index)} />)}
      </div>

      <div className="grid gap-px bg-border p-px sm:hidden">
        {ACTORS.map((actor, index) => <ActorCell key={actor[0]} index={index} active={activeActors.includes(index)} />)}
      </div>

      <div className="relative mt-3 hidden h-12 border-y border-border bg-background sm:block" aria-hidden="true">
        <div className="absolute inset-x-[10%] top-1/2 h-px bg-border" />
        {[10, 30, 50, 70, 90].map((left) => <span key={left} className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background" style={{ left: `${left}%` }} />)}
        <span
          className={`absolute top-1/2 flex h-6 min-w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary bg-background px-1 font-mono text-[8px] font-black text-primary ${reducedMotion ? "transition-none" : "transition-[left] duration-1000 ease-in-out"}`}
          style={{ left: `${TOKEN_LEFT[active]}%` }}
        >
          {active + 1}
        </span>
      </div>

      <div className="mt-2 grid min-h-[5.5rem] grid-cols-[0.62fr_1.38fr] gap-px bg-border p-px sm:mt-3 sm:min-h-[5rem]">
        <div className="min-w-0 bg-background p-2.5 sm:p-3">
          <span className="text-[9px] font-bold text-muted-foreground">현재 장면</span>
          <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
        </div>
        <div className="min-w-0 bg-background p-2.5 sm:p-3">
          <span className="text-[9px] font-bold text-muted-foreground">확인된 상태</span>
          <strong className="mt-1 block break-keep text-[10px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
        </div>
      </div>
    </div>
  );
}

export default function CommonwareOverviewFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3500, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Commonware v2026.9.0"
      title="블록 바이트가 digest와 finalization 기록으로 이어지는 경로"
      description="같은 Random block 하나를 따라 Application·Indexer·Simplex의 완료 상태를 구분합니다."
      note="화면의 Random(42)는 설명용 가정입니다. 메시지 순서와 실패 분기는 Commonware v2026.9.0 commit d476a236의 bridge example source에서 확인했습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-commonware-overview-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Commonware bridge 예제에서 block과 digest와 finalization이 이동하는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div className="overflow-x-auto" aria-label="Commonware bridge 전체 흐름의 여덟 장면">
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

          <div className="mt-2 sm:mt-3"><SystemMap active={active} reducedMotion={scenes.reducedMotion} /></div>
          <p data-scene-note className="mt-2 min-h-[7.5rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[5rem] sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
