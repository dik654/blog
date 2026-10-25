import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["mention 한 장", "21쌍 생성", "3쌍만 비교", "근거로 연결", "U-42로 병합"] as const;

const NOTES = [
  "Mention 하나에는 표면형·유형·source_id와 식별 근거가 함께 있습니다. 이름 문자열만 비교하지 않습니다.",
  "mention 7개를 아무 조건 없이 둘씩 짝지으면 7×6÷2=21쌍입니다. 이 숫자는 설명용 사례에서 직접 센 값입니다.",
  "같은 Person 유형인 m-01·m-03·m-06만 비교하면 후보가 3쌍으로 줄고, 다른 유형이 섞인 18쌍은 비교 전에 제외됩니다.",
  "m-01↔m-03은 같은 stable_key, m-03↔m-06은 문서의 coreference 근거로 연결됩니다. m-01↔m-06은 직접 근거가 없어도 같은 연결 성분에 들어갑니다.",
  "세 mention을 U-42 하나로 병합하되 alias·source_id·판정 근거는 버리지 않습니다. 이 단계가 node 후보 7개를 canonical node 5개로 줄입니다.",
] as const;

const MENTIONS = [
  { id: "m-01", value: "민준 김", type: "Person", source: "d-17" },
  { id: "m-02", value: "A-17", type: "Account", source: "d-17" },
  { id: "m-03", value: "M. Kim", type: "Person", source: "d-22" },
  { id: "m-04", value: "모바일 앱", type: "App", source: "d-22" },
  { id: "m-05", value: "E401", type: "Error", source: "d-22" },
  { id: "m-06", value: "그 사용자", type: "Person", source: "d-31" },
  { id: "m-07", value: "tenant-a", type: "Tenant", source: "d-31" },
] as const;

const PAIRS = MENTIONS.flatMap((left, leftIndex) =>
  MENTIONS.slice(leftIndex + 1).map((right) => `${left.id}↔${right.id}`),
);

function MentionScene() {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
      <div className="border-l-2 border-primary pl-3 sm:pl-4">
        <p className="text-sm font-bold text-foreground sm:text-base">후보에는 문자열뿐 아니라 판정 근거가 함께 들어갑니다.</p>
        <p className="mt-1.5 break-keep text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-6">
          m-01에는 “민준 김”이라는 표면형과 Person 유형, d-17이라는 출처,
          설명용 stable_key가 함께 있습니다. 뒤의 판정은 이 근거를 읽습니다.
        </p>
      </div>
      <dl className="divide-y divide-border border-y border-border text-sm">
        {[
          ["표면형", "민준 김"],
          ["유형", "Person"],
          ["출처", "d-17"],
          ["식별 근거 (가정)", "stable_key=user:u42"],
        ].map(([term, value]) => (
          <div key={term} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2 py-2 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-3 sm:py-3">
            <dt className="font-bold text-foreground">{term}</dt>
            <dd className="break-words font-mono text-xs text-muted-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function AllPairsScene() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l-2 border-primary pl-4">
        <strong className="font-mono text-lg text-foreground">7×6÷2 = 21쌍</strong>
        <span className="text-sm text-muted-foreground">순서를 바꾼 같은 쌍은 한 번만 셉니다.</span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-1.5 sm:grid-cols-5 sm:gap-2 lg:grid-cols-7" aria-label="mention 7개에서 만든 후보 21쌍">
        {PAIRS.map((pair) => (
          <span key={pair} className="border border-border px-1 py-2 text-center font-mono text-[9px] text-muted-foreground sm:px-2 sm:text-[10px]">
            {pair}
          </span>
        ))}
      </div>
    </div>
  );
}

function BlockingScene() {
  const personIds = new Set(["m-01", "m-03", "m-06"]);
  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-4 sm:gap-2 lg:grid-cols-7" aria-label="mention 유형별 묶음">
        {MENTIONS.map((mention) => {
          const isPerson = personIds.has(mention.id);
          return (
            <div key={mention.id} className={`min-w-0 border px-2 py-2 sm:py-3 ${isPerson ? "border-primary bg-primary/10" : "border-border opacity-55"}`}>
              <p className="font-mono text-[10px] font-bold text-primary">{mention.id}</p>
              <p className="mt-1 break-keep text-xs font-bold text-foreground">{mention.value}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{mention.type}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="grid grid-cols-3 gap-2">
          {["m-01↔m-03", "m-01↔m-06", "m-03↔m-06"].map((pair) => (
            <span key={pair} className="border border-primary px-1 py-2 text-center font-mono text-[10px] font-bold sm:px-2 sm:py-3">
              {pair}
            </span>
          ))}
        </div>
        <p className="border-l-2 border-border pl-3 text-xs leading-5 text-muted-foreground sm:pl-4 sm:text-sm sm:leading-6">
          21쌍 중 <strong className="text-foreground">18쌍 제외</strong><br />
          제거율 18÷21 ≈ 85.7%
        </p>
      </div>
    </div>
  );
}

function MatchingScene() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
      <ol className="divide-y divide-border border-y border-border text-sm">
        <li className="grid grid-cols-[minmax(0,1fr)_3rem] gap-x-2 gap-y-1 py-2 sm:grid-cols-[8rem_minmax(0,1fr)_4rem] sm:items-center sm:py-3">
          <strong className="font-mono text-xs">m-01↔m-03</strong>
          <span className="order-3 col-span-2 text-xs leading-5 text-muted-foreground sm:order-none sm:col-span-1 sm:text-sm">stable_key가 user:u42로 같음 (가정)</span>
          <span className="order-2 font-bold text-primary sm:order-none">연결</span>
        </li>
        <li className="grid grid-cols-[minmax(0,1fr)_3rem] gap-x-2 gap-y-1 py-2 sm:grid-cols-[8rem_minmax(0,1fr)_4rem] sm:items-center sm:py-3">
          <strong className="font-mono text-xs">m-03↔m-06</strong>
          <span className="order-3 col-span-2 text-xs leading-5 text-muted-foreground sm:order-none sm:col-span-1 sm:text-sm">d-31이 d-22의 사용자를 가리킴 (가정)</span>
          <span className="order-2 font-bold text-primary sm:order-none">연결</span>
        </li>
        <li className="grid grid-cols-[minmax(0,1fr)_3rem] gap-x-2 gap-y-1 py-2 sm:grid-cols-[8rem_minmax(0,1fr)_4rem] sm:items-center sm:py-3">
          <strong className="font-mono text-xs">m-01↔m-06</strong>
          <span className="order-3 col-span-2 text-xs leading-5 text-muted-foreground sm:order-none sm:col-span-1 sm:text-sm">직접 근거는 없지만 위 두 연결의 같은 성분</span>
          <span className="order-2 font-bold text-foreground sm:order-none">군집</span>
        </li>
      </ol>
      <div className="border-l-2 border-primary pl-3 sm:pl-4">
        <p className="text-sm font-bold text-foreground sm:text-base">임베딩은 가능한 matcher 하나일 뿐입니다.</p>
        <p className="mt-1.5 break-keep text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-6">
          이 사례는 안정 ID와 문서의 coreference를 사용합니다. 이름 유사도나 임베딩만으로
          같은 사람이라고 확정하지 않습니다.
        </p>
      </div>
    </div>
  );
}

function FusionScene() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,0.82fr)] items-center gap-2 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-5">
      <div className="grid grid-cols-3 gap-1 text-center sm:gap-2">
        {["m-01\n민준 김", "m-03\nM. Kim", "m-06\n그 사용자"].map((mention) => (
          <span key={mention} className="whitespace-pre-line border border-primary/50 px-1 py-2 text-[10px] font-bold leading-4 sm:px-2 sm:py-3 sm:text-[11px] sm:leading-5">
            {mention}
          </span>
        ))}
      </div>
      <span className="text-center text-lg text-primary sm:text-2xl" aria-hidden>→</span>
      <div className="border-2 border-primary bg-primary/10 px-2 py-3 sm:px-4 sm:py-4">
        <p className="font-mono text-xs font-bold text-foreground sm:text-base">U-42 · Person</p>
        <p className="mt-1.5 text-[10px] leading-4 text-muted-foreground sm:mt-2 sm:text-xs sm:leading-5">
          alias 3개 · source_id 3개<br />stable_key와 coreference 근거 보존
        </p>
      </div>
      <p className="col-span-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground sm:pt-4 sm:text-sm sm:leading-6">
        대표 node를 만들었다고 원래 mention을 지우지 않습니다. 나중에 잘못 합친 사실이 드러나면
        어떤 근거로 병합했는지 되짚고 cluster를 고쳐야 하기 때문입니다.
      </p>
    </div>
  );
}

const SCENES = [
  <MentionScene key="mention" />,
  <AllPairsScene key="all-pairs" />,
  <BlockingScene key="blocking" />,
  <MatchingScene key="matching" />,
  <FusionScene key="fusion" />,
] as const;

export default function EntityResolutionFunnelViz() {
  const scenes = useAnimatedScenes(LABELS.length, 6200, { loop: false });

  return (
    <VizFrame
      eyebrow="같은 대상 식별 · 설명용 사례"
      title="21쌍을 3쌍으로 줄이고, 근거가 이어진 세 표기를 U-42로 묶습니다"
      description="후보 생성, blocking, matching, clustering, fusion은 서로 다른 일입니다. 숫자는 d-17·d-22·d-31 사례에서 직접 센 값입니다."
      note="stable_key와 coreference 연결은 메커니즘을 설명하기 위한 가정입니다. 85.7%는 비교량 감소율이며 식별 정확도가 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="mention 후보 생성부터 entity fusion까지 다섯 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
          <h4 className="text-base font-bold text-foreground">{LABELS[scenes.active]}</h4>
          <span className="font-mono text-[10px] font-bold text-primary">
            {String(scenes.active + 1).padStart(2, "0")} / {String(LABELS.length).padStart(2, "0")}
          </span>
        </div>
        <div className="sm:hidden">{SCENES[scenes.active]}</div>
        <StableSceneStack active={scenes.active} scenes={SCENES} className="hidden sm:grid" />
        <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:leading-7">
          {NOTES[scenes.active]}
        </p>
        <StaticSceneList labels={LABELS} notes={NOTES} />
        <AnimatedSceneControls {...scenes} labels={LABELS} playLabel="과정 재생" />
      </div>
    </VizFrame>
  );
}
