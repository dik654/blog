import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #source-groups 둘째 문단 — 한 사람 사례는 (source clip, identity)로 충분하지만,
 * source 얼굴과 target 얼굴이 다른 조작은 source·target identity 집합·capture session·원본 쌍까지 group에 넣어야 한다.
 * 식별자 clip-017/person-A, clip-042/person-C는 SourceGroupViz manifest를 이어 쓴 가정이다.
 */
type Side = "train" | "test";

const SCENES: readonly {
  label: string;
  summary: string;
  file: string;
  origins: readonly { clip: string; person: string; role: string; side: Side }[];
  key: readonly string[];
  overlap: number;
  verdict: string;
  note: string;
}[] = [
  {
    label: "한 사람 사례",
    summary: "key = (clip-042, person-C)",
    file: "clip-042/frame120-social.jpg",
    origins: [{ clip: "clip-042", person: "person-C", role: "원본 영상", side: "test" }],
    key: ["원본 영상 s: clip-042", "등장 인물 p: person-C"],
    overlap: 0,
    verdict: "통과",
    note: "파일이 원본 영상 하나와 사람 한 명에서만 왔습니다. 이 파일의 증거는 clip-042와 person-C뿐이므로 원본 영상 s와 등장 인물 p 두 칸짜리 key(source clip, identity)로 충분합니다.",
  },
  {
    label: "얼굴을 바꾼 파일",
    summary: "원본이 둘로 늘어남",
    file: "swap-A-to-C.mp4",
    origins: [
      { clip: "clip-017", person: "person-A", role: "source 얼굴", side: "train" },
      { clip: "clip-042", person: "person-C", role: "target 영상", side: "test" },
    ],
    key: ["원본 영상 s: clip-042", "등장 인물 p: person-C"],
    overlap: 0,
    verdict: "통과로 보임",
    note: "person-A의 얼굴을 person-C 영상에 옮긴 조작입니다. 같은 두 칸 key의 원본 영상 칸에는 target 영상 clip-042만 기록되고, train에 있는 person-A의 얼굴 증거는 key에서 빠집니다. 그래서 교집합 검사가 0으로 통과해 보입니다.",
  },
  {
    label: "key를 증거만큼 넓힘",
    summary: "공유 group이 드러남",
    file: "swap-A-to-C.mp4",
    origins: [
      { clip: "clip-017", person: "person-A", role: "source 얼굴", side: "train" },
      { clip: "clip-042", person: "person-C", role: "target 영상", side: "test" },
    ],
    key: ["identity 집합: {person-A, person-C}", "원본 쌍: (clip-017, clip-042)", "capture session: 두 원본의 촬영 기록"],
    overlap: 1,
    verdict: "누수 발견",
    note: "source·target identity 집합, 원본 쌍, capture session을 key에 넣으면 이 파일이 train의 clip-017·person-A와 증거를 공유한다는 사실이 보입니다. 공유 group이 1개이므로 이 split은 아직 통과하지 못합니다.",
  },
];

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);
const ORIGIN_SLOTS = [0, 1] as const;

function SceneBody({ scene }: { scene: (typeof SCENES)[number] }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-muted-foreground">TEST에 넣을 파일</p>
      <p className="mt-1 break-all border border-primary/40 bg-background px-3 py-2 font-mono text-xs">{scene.file}</p>

      <p className="mt-4 text-[11px] font-bold text-muted-foreground">이 파일이 증거를 가져온 원본</p>
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        {ORIGIN_SLOTS.map((slot) => {
          const origin = scene.origins[slot];
          if (!origin) {
            return (
              <div key={slot} className="min-w-0 border border-dashed border-border px-2 py-2 text-xs text-muted-foreground">
                두 번째 원본 없음
              </div>
            );
          }
          return (
            <div key={slot} className={`min-w-0 border px-2 py-2 text-xs ${origin.side === "train" ? "border-amber-600/70" : "border-border"} bg-background`}>
              <span className="block text-[11px] font-bold text-primary">{origin.role}</span>
              <strong className="mt-1 block break-keep font-mono leading-5">
                {origin.clip} · {origin.person}
              </strong>
              <span className={`mt-1 block text-[11px] font-bold ${origin.side === "train" ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>
                {origin.side === "train" ? "train에도 있음" : "test 쪽"}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] font-bold text-muted-foreground">group key에 기록한 것</p>
      <ul className="mt-1 grid gap-1">
        {[0, 1, 2].map((slot) => (
          <li key={slot} className={`min-h-7 break-keep border-l-2 px-2 py-1 font-mono text-xs ${scene.key[slot] ? "border-primary/60" : "border-transparent"}`}>
            {scene.key[slot] ?? ""}
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border pt-3 text-xs">
        <span className="break-keep text-muted-foreground">train과 공유한 group |O|</span>
        <strong className={`font-mono text-base ${scene.overlap === 1 ? "text-red-700 dark:text-red-400" : "text-foreground"}`}>
          {scene.overlap}
          <span className="ml-2 text-xs">{scene.verdict}</span>
        </strong>
      </div>
    </div>
  );
}

export default function SwapGroupViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });

  return (
    <VizFrame
      documentFlow
      eyebrow="group key의 넓이"
      title="얼굴을 바꾼 파일은 원본 두 개의 증거를 함께 가집니다"
      description="Source 얼굴은 옮겨 오는 쪽 얼굴, target은 그 얼굴을 덮어쓸 영상입니다. 같은 test 파일을 두 칸 key와 넓힌 key로 각각 기록해 train과의 교집합 |O|를 비교합니다."
      note="파일 이름·인물·train 배치는 앞 manifest를 이어 쓴 설명용 가정입니다."
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="얼굴 교체 파일의 group key를 두 칸과 넓힌 형태로 기록해 train과의 공유 group을 비교하는 세 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only>
          <StableSceneStack
            active={scenes.active}
            scenes={SCENES.map((scene) => (
              <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-base font-bold">{scene.label}</h4>
                <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
              </div>
            ))}
          />
          <StableSceneStack
            active={scenes.active}
            className="mt-4"
            scenes={SCENES.map((scene) => (
              <SceneBody key={scene.label} scene={scene} />
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
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} playLabel="group key 비교 재생" />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
