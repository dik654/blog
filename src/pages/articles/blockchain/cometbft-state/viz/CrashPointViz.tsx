import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #durable-stores — B42 저장 → F42 저장 → application Commit → S42 저장 순서에서
 * 어느 지점에 종료돼도 g_s=H_b−H_s가 1을 넘지 않고, Commit 뒤 종료는 F42로 State만 복구한다.
 * 높이 조합별 replay 경로는 #replay 본문(B42·S41·A41, B42·S41·A42)과 RecoveryDecisionViz 표에서 가져왔다.
 */
const STEPS = ["B42·seen commit 저장 + WAL", "F42 저장", "application Commit", "S42 저장"] as const;

const SCENES: readonly {
  label: string;
  done: number;
  hb: number;
  hs: number;
  ha: number;
  path: string;
  result: string;
  note: string;
}[] = [
  {
    label: "B42 저장 전 종료",
    done: 0,
    hb: 41,
    hs: 41,
    ha: 41,
    path: "B=S · A=B",
    result: "AppHash를 대조해 같으면 재개",
    note: "B42는 아직 디스크에 없습니다. 세 기록이 모두 41이므로 replay할 block이 없고, AppHash가 같은지만 확인합니다.",
  },
  {
    label: "B42 저장 뒤 종료",
    done: 1,
    hb: 42,
    hs: 41,
    ha: 41,
    path: "B=S+1 · A=S",
    result: "B42를 실제 application에 실행 → A42·S42",
    note: "BlockStore만 한 칸 앞섭니다. Application도 41이므로 B42를 실제 application에 실행해 A42와 S42를 함께 만듭니다.",
  },
  {
    label: "F42 저장 뒤 종료",
    done: 2,
    hb: 42,
    hs: 41,
    ha: 41,
    path: "B=S+1 · A=S",
    result: "B42를 실제 application에 실행 → A42·S42",
    note: "F42는 남았지만 application은 아직 Commit하지 않아 41입니다. 높이 조합이 앞 장면과 같으므로 같은 실제 replay 경로를 탑니다.",
  },
  {
    label: "Commit 뒤 종료",
    done: 3,
    hb: 42,
    hs: 41,
    ha: 42,
    path: "B=S+1 · A=B",
    result: "저장한 F42로 mock replay → S42만",
    note: "Application은 이미 T1을 반영했습니다. 실제 application에 다시 실행하지 않고, Commit 전에 남긴 F42를 돌려주는 mock application으로 State만 42로 계산합니다.",
  },
  {
    label: "S42 저장 뒤 종료",
    done: 4,
    hb: 42,
    hs: 42,
    ha: 42,
    path: "B=S · A=B",
    result: "AppHash X42를 대조해 같으면 43으로",
    note: "네 저장이 모두 끝났습니다. 높이가 모두 42여도 숫자 일치만으로 끝내지 않고 State와 application의 AppHash를 대조합니다.",
  },
];

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);

function Height({ name, value, behind }: { name: string; value: number; behind: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-2 text-center ${behind ? "border-amber-600/70" : "border-border"} bg-background`}>
      <span className="block text-[11px] font-bold text-muted-foreground">{name}</span>
      <strong className="mt-1 block font-mono text-base">{value}</strong>
    </div>
  );
}

function SceneBody({ scene }: { scene: (typeof SCENES)[number] }) {
  const gs = scene.hb - scene.hs;
  const ga = scene.hb - scene.ha;
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-muted-foreground">저장 순서와 종료 지점</p>
      <ol className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {STEPS.map((step, index) => {
          const finished = index < scene.done;
          const crashHere = index === scene.done;
          return (
            <li
              key={step}
              className={`min-w-0 border px-2 py-2 ${
                finished ? "border-primary/60 bg-primary/10" : crashHere ? "border-dashed border-red-600" : "border-dashed border-border"
              }`}
            >
              <span className="block font-mono text-[11px] font-black text-primary">{index + 1}</span>
              <strong className="block break-keep text-xs leading-5">{step}</strong>
              <span
                className={`mt-1 block text-[11px] font-bold ${
                  finished ? "text-foreground" : crashHere ? "text-red-700 dark:text-red-400" : "text-muted-foreground"
                }`}
              >
                {finished ? "완료" : crashHere ? "✕ 여기 전에 종료" : "실행 안 됨"}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 min-h-5 text-[11px] font-bold text-muted-foreground">
        {scene.done === STEPS.length
          ? "✕ 네 저장이 모두 끝난 뒤 종료"
          : scene.done === 0
            ? "✕ 첫 저장을 시작하기 전에 종료"
            : `✕ ${scene.done}단계까지 저장한 뒤 종료`}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-1.5">
        <Height name="BlockStore H_b" value={scene.hb} behind={false} />
        <Height name="State H_s" value={scene.hs} behind={gs > 0} />
        <Height name="Application H_a" value={scene.ha} behind={ga > 0} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-xs">
        <span className="border border-border bg-background px-2 py-1.5">
          g_s = {scene.hb}−{scene.hs} = <strong>{gs}</strong> <span className="text-muted-foreground">(≤1)</span>
        </span>
        <span className="border border-border bg-background px-2 py-1.5">
          g_a = {scene.hb}−{scene.ha} = <strong>{ga}</strong>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-px bg-border p-px text-xs sm:grid-cols-[8rem_minmax(0,1fr)]">
        <span className="bg-background p-2 font-mono font-bold text-primary">{scene.path}</span>
        <strong className="break-keep bg-background p-2 leading-5">{scene.result}</strong>
      </div>
    </div>
  );
}

export default function CrashPointViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false, autoPlay: false });

  return (
    <VizFrame
      documentFlow
      eyebrow="종료 지점별 재시작"
      title="네 번의 저장 중 어디서 멈춰도 BlockStore는 State보다 한 칸까지만 앞섭니다"
      description="B42 처리의 네 저장 단계 가운데 종료 지점을 하나씩 옮깁니다. H_b·H_s·H_a는 BlockStore·State·application의 마지막 높이이고, g_s=H_b−H_s, g_a=H_b−H_a는 각각 BlockStore보다 뒤진 칸 수입니다. Mock replay는 실제 application 대신 저장된 F42를 돌려주는 가짜 application으로 State만 계산하는 경로입니다."
      note="네 단계 순서와 높이 조합별 경로는 본문과 다음 절 replay 분기에서 가져왔습니다. 첫 장면 뒤 B42를 어떻게 다시 받는지는 이 글의 범위 밖입니다."
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="B42 처리의 네 저장 단계 중 종료 지점에 따라 남는 높이와 복구 경로를 다섯 장면으로 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only>
          <StableSceneStack
            active={scenes.active}
            scenes={SCENES.map((scene, index) => (
              <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-base font-bold">{scene.label}</h4>
                <span className="font-mono text-sm font-bold text-primary">
                  장면 {index + 1}/{SCENES.length} · (H_b,H_s,H_a)=({scene.hb},{scene.hs},{scene.ha})
                </span>
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
        <AnimatedSceneControls {...scenes} labels={LABELS} playLabel="종료 지점 재생" />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
