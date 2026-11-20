import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #request-path — "Provider가 돌려준 숫자와 proof를 서로 다른 latest 시점에서 가져오지 않게 하는 경계".
 * 위 두 칸 = 호출 시점마다 latest가 가리키는 block. 아래 두 줄 = 두 번의 호출과 각 호출이 가리키는 block.
 * 두 호출 사이에 새 block H′가 생긴다는 설정은 설명용 가정입니다.
 */
type Tone = "idle" | "ok" | "bad";

interface Call {
  request: string;
  target: string;
  tone: Tone;
}

interface Scene {
  label: string;
  summary: string;
  call1: Call;
  call2: Call;
  verdict: string;
  verdictTone: Tone;
  note: string;
}

const WAIT: Call = { request: "—", target: "—", tone: "idle" };

const SCENES: readonly Scene[] = [
  {
    label: "latest는 움직이는 이름",
    summary: "첫 호출 H → 둘째 호출 H′",
    call1: WAIT,
    call2: WAIT,
    verdict: "같은 latest라도 호출 시점마다 다른 block일 수 있습니다",
    verdictTone: "idle",
    note: "latest는 고정된 block 이름이 아니라 호출하는 순간의 가장 최근 block을 뜻합니다. 여기서는 두 호출 사이에 새 block H′가 생겼다고 가정합니다.",
  },
  {
    label: "latest로 따로 물으면",
    summary: "숫자는 H, proof는 H′",
    call1: { request: "잔액 숫자 · latest", target: "H", tone: "bad" },
    call2: { request: "account proof · latest", target: "H′", tone: "bad" },
    verdict: "숫자와 proof가 서로 다른 latest 시점에서 옵니다",
    verdictTone: "bad",
    note: "두 호출이 각각 latest를 다시 해석하면 Provider가 돌려준 숫자와 proof가 서로 다른 block을 가리킬 수 있습니다. 본문이 막으려는 경계가 이것입니다.",
  },
  {
    label: "block부터 고정",
    summary: "age 확인 → header H",
    call1: { request: "age 확인 후 block 조회 · latest", target: "H · hash 기록", tone: "ok" },
    call2: WAIT,
    verdict: "이후 호출은 latest 대신 H의 header hash를 씁니다",
    verdictTone: "idle",
    note: "Helios Node는 latest block이 지나치게 오래되지 않았는지 먼저 확인합니다. 이어 Execution provider가 block을 얻어 그 header hash를 기억합니다.",
  },
  {
    label: "같은 hash로 proof",
    summary: "latest = H′여도 요청은 H",
    call1: { request: "age 확인 후 block 조회 · latest", target: "H · hash 기록", tone: "ok" },
    call2: { request: "eth_getProof · block ID = H", target: "H", tone: "ok" },
    verdict: "두 호출이 같은 block H를 가리킵니다",
    verdictTone: "ok",
    note: "둘째 호출 시점의 latest가 H′로 바뀌었어도 eth_getProof는 hash H를 block ID로 받으므로 H의 proof를 돌려받습니다.",
  },
  {
    label: "같은 header의 root에 대조",
    summary: "P ↔ R(H) 통과 → 7 ETH",
    call1: { request: "age 확인 후 block 조회 · latest", target: "H · root R", tone: "ok" },
    call2: { request: "eth_getProof · block ID = H", target: "P (H)", tone: "ok" },
    verdict: "호출 없이 로컬에서 P를 R에 대조해 통과하면 balance 7 ETH를 반환합니다",
    verdictTone: "ok",
    note: "Account proof는 그 header의 state root R에, storage proof는 그 account의 storage root에 대조하고, 모두 통과한 account에서 balance를 반환합니다. 7 ETH는 본문의 설명 사례 값입니다.",
  },
];

const TONE_CLASS: Record<Tone, string> = {
  idle: "border-border text-muted-foreground",
  ok: "border-primary text-foreground",
  bad: "border-red-600 text-red-700 dark:text-red-400",
};

function CallRow({ index, call }: { index: number; call: Call }) {
  return (
    <div className="grid grid-cols-[3.25rem_minmax(0,1fr)_5.5rem] sm:grid-cols-[3.25rem_minmax(0,1fr)_7.5rem] items-stretch gap-2 text-xs leading-5">
      <span className="self-center font-mono text-[11px] font-bold text-muted-foreground">호출 {index}</span>
      <span className={`min-w-0 break-keep rounded-md border px-2 py-1.5 ${TONE_CLASS[call.tone]}`}>{call.request}</span>
      <span className={`flex items-center justify-center break-keep rounded-md border px-2 py-1.5 text-center font-mono font-bold ${TONE_CLASS[call.tone]}`}>
        {call.target}
      </span>
    </div>
  );
}

export default function LatestPinViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      eyebrow="Request path · latest 고정"
      title="latest를 두 번 해석하지 않도록 block hash를 먼저 정합니다"
      description="위 두 칸은 호출하는 순간 latest가 가리키는 block, 아래 두 줄은 실제 호출과 그 호출이 가리키는 block입니다. 두 호출 사이에 새 block H′가 생긴다는 설정은 설명용 가정입니다."
      note="H는 Helios가 검증한 block, R은 그 block의 execution state root, P는 account proof입니다. 코드 순서는 본문 발췌의 1~6단계를 따릅니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="latest를 두 번 해석할 때와 block hash를 먼저 고정할 때 두 호출이 가리키는 block 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />

        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs leading-5">
          <div className="rounded-md border border-border px-2 py-2">
            <span className="block text-[11px] text-muted-foreground">첫 호출 시점</span>
            <span className="font-mono font-bold">latest = H</span>
          </div>
          <div className="rounded-md border border-dashed border-border px-2 py-2">
            <span className="block text-[11px] text-muted-foreground">둘째 호출 시점</span>
            <span className="font-mono font-bold">latest = H′ (가정)</span>
          </div>
        </div>

        <StableSceneStack
          active={scenes.active}
          className="mt-3"
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="space-y-2">
              <CallRow index={1} call={scene.call1} />
              <CallRow index={2} call={scene.call2} />
              <p className={`break-keep rounded-md border px-3 py-2 text-xs font-semibold leading-5 ${TONE_CLASS[scene.verdictTone]}`}>
                {scene.verdict}
              </p>
            </div>
          ))}
        />

        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
