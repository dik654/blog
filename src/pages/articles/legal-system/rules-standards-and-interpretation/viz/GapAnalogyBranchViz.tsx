import type { ReactNode } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #gaps-and-analogy — 적용할 조문이 없을 때의 갈림길.
 * 빠뜨린 빈칸 → 유추 적용(두 조건), 일부러 비운 영역 → 메우면 법원이 새 규율을 만드는 결과,
 * 형벌·조세·침익적 행정처분 → 불리한 확장·유추가 금지되거나 제한됨(한국 헌법·헌재 결정 기준).
 */
const SCENES = [
  {
    label: "먼저 묻는 질문",
    summary: "빠뜨렸나, 일부러 비웠나",
    note: "단어의 경계가 아니라 적용할 조문 자체가 없는 경우입니다. 비슷한 조문을 찾기 전에 이 빈자리가 입법자가 빠뜨린 것인지, 일부러 규율하지 않은 것인지부터 가립니다.",
  },
  {
    label: "빠뜨린 빈칸",
    summary: "유추 적용을 검토",
    note: "유추 적용은 비슷한 사안을 다루는 다른 조문을 가져와 적용하는 일입니다. 두 사안이 그 조문이 겨냥한 성질에서 비슷하고, 법체계와 입법 목적에 비춰 같은 효과를 주는 것도 정당해야 합니다.",
  },
  {
    label: "일부러 비운 영역",
    summary: "메우면 새 규율이 됨",
    note: "입법자가 규율하지 않기로 한 곳을 빈칸이라고 부르고 다른 조문을 끌어오면, 있는 법을 적용하는 것이 아니라 법원이 새 규율을 만드는 결과가 됩니다.",
  },
  {
    label: "불이익이 큰 영역",
    summary: "불리한 유추는 막힘",
    note: "형벌에서는 행위 당시 문언의 가능한 범위를 넘어 피고인에게 불리하게 처벌 범위를 새로 만드는 유추가 허용되지 않습니다. 조세나 침익적 행정처분처럼 법률상 근거가 엄격히 필요한 영역에서도 불리한 확장·유추가 제한됩니다. 문언의 범위 안에서 목적을 보는 것까지 막히는 것은 아닙니다.",
  },
] as const;

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);

function Node({
  on,
  tone,
  title,
  children,
}: {
  on: boolean;
  tone: "base" | "go" | "stop";
  title: string;
  children?: ReactNode;
}) {
  const toneClass =
    tone === "go"
      ? "border-emerald-600/50 bg-emerald-500/[0.07]"
      : tone === "stop"
        ? "border-rose-600/50 bg-rose-500/[0.07]"
        : "border-border bg-muted/35";
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 ${toneClass} ${on ? "opacity-100 ring-1 ring-primary/40" : "opacity-40"}`}>
      <p className="text-sm font-bold text-foreground">{title}</p>
      {children ? (
        <div className={`mt-1 text-xs leading-5 text-muted-foreground ${on ? "" : "hidden sm:block"}`}>{children}</div>
      ) : null}
    </div>
  );
}

function Connector() {
  return <div className="mx-auto h-3 w-px bg-border" aria-hidden />;
}

/** 장면마다 그 장면의 갈래만 펼칩니다. 좁은 화면에서는 꺼진 갈래의 설명을 접어 높이를 줄입니다. */
function Tree({ step }: { step: number }) {
  return (
    <div className="min-w-0">
      <Node on={step === 0} tone="base" title="적용할 조문 자체가 없음">
        새 기술이나 예상하지 못한 거래처럼 단어의 경계가 아니라 조문이 비어 있는 경우입니다. 입법자가 빠뜨린 빈칸인지, 일부러 규율하지 않은 영역인지부터 묻습니다.
      </Node>
      <Connector />
      <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        <Node on={step === 1} tone="go" title="빠뜨린 빈칸 → 유추 적용 검토">
          비슷한 사안을 다루는 조문을 가져와 적용합니다.
          <br />① 그 조문이 겨냥한 성질에서 두 사안이 비슷한가
          <br />② 법체계·입법 목적에 비춰 같은 효과를 주는 것이 정당한가
        </Node>
        <Node on={step === 2} tone="stop" title="일부러 비운 영역 → 메우지 않음">
          빈칸이라고 부르고 메우면 법원이 새 규율을 만드는 결과가 됩니다.
        </Node>
      </div>
      <Connector />
      <Node on={step === 3} tone="stop" title="형벌 · 조세 · 침익적 행정처분이면 더 엄격">
        문언의 가능한 범위를 넘어 불리한 처벌·부과 근거를 새로 만드는 유추는 금지되거나 제한됩니다. 범위 안에서 목적·연혁을 보는 일은 가능합니다.
      </Node>
    </div>
  );
}

export default function GapAnalogyBranchViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);

  return (
    <VizFrame
      eyebrow="법의 빈칸"
      title="조문이 없을 때는 빈자리의 성격부터 가립니다"
      description="해석은 있는 문장의 뜻을 찾는 일이고, 이 그림은 문장 자체가 없을 때 어느 길로 가는지를 보여 줍니다."
      note="형벌·조세 영역의 한계는 이 글이 인용한 대한민국헌법 제12조·제13조와 헌법재판소 2009헌바123 등 결정을 기준으로 합니다. 다른 법체계의 허용 범위는 따로 확인해야 합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="적용할 조문이 없을 때 빠뜨린 빈칸과 일부러 비운 영역을 가르는 갈림길"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene, index) => (
            <Tree key={scene.label} step={index} />
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
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
