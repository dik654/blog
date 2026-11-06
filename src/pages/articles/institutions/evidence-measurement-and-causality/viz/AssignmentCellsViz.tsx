import { useState } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #comparison — 표본 추출은 누가 20가구에 들어오는지, 배정은 그 안에서 A와 B를 나누는 절차다.
 * 칸 하나 = 가구 하나. 3번 장면의 개수는 저자가 적은 값이 아니라 화면에서 실제로 섞어 뽑은 결과입니다.
 */
const SCENES = [
  { label: "20가구 모으기", summary: "표본 추출", note: "전국에서 누가 이 20가구에 들어오는지를 정하는 일이 표본 추출입니다. 나중에 안쪽을 어떻게 나눠도 바깥 경계는 바뀌지 않습니다." },
  { label: "원하는 집이 고를 때", summary: "A에 원하는 집 10", note: "(가정) 장치를 원하는 집이 10가구이고 모두 A를 골랐습니다. 이 집들이 원래 절약에 적극적이라면 그 성향과 장치의 영향이 A에서 겹칩니다." },
  { label: "무작위로 나눌 때", summary: "선호가 배정을 정하지 않음", note: "같은 20가구를 사전에 정한 무작위 절차로 10가구씩 나눕니다. 다시 뽑으면 개수가 달라지고 늘 같은 집단이 되지도 않습니다. 바깥 경계도 그대로입니다." },
] as const;

/** 원하는 집 10, 원하지 않는 집 10을 섞어 앞 10칸을 A로 삼고, A에 들어간 원하는 집의 수를 돌려줍니다. */
function drawWantInA() {
  const homes = Array.from({ length: 20 }, (_, index) => index < 10);
  for (let index = homes.length - 1; index > 0; index -= 1) {
    const pick = Math.floor(Math.random() * (index + 1));
    [homes[index], homes[pick]] = [homes[pick], homes[index]];
  }
  return homes.slice(0, 10).filter(Boolean).length;
}

/** 채운 칸 = 장치를 원하는 집, 빈 칸 = 원하지 않는 집. 색이 아니라 채움으로 구분합니다. */
function Home({ want, plain = false }: { want: boolean; plain?: boolean }) {
  const look = plain ? "border-border bg-background" : want ? "border-primary bg-primary" : "border-muted-foreground/60 bg-background";
  return <span aria-hidden="true" className={`block aspect-square rounded-[3px] border ${look}`} />;
}

function Group({ name, want }: { name: string; want: number }) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 flex flex-wrap justify-between gap-x-2 text-xs font-bold">
        <span>{name} 10가구</span>
        <span className="font-mono text-primary">원함 {want}</span>
      </p>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 10 }, (_, index) => <Home key={index} want={index < want} />)}
      </div>
    </div>
  );
}

function Boundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-muted-foreground/60 p-3">
      <p className="mb-2 text-xs font-bold text-muted-foreground">전국의 가구: 대부분 이 실험 밖에 있습니다</p>
      <div className="rounded-lg border border-border bg-background/60 p-2.5 sm:p-3">{children}</div>
    </div>
  );
}

export default function AssignmentCellsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;
  const [wantInA, setWantInA] = useState(drawWantInA);

  const visuals = [
    <Boundary key="pool">
      <p className="mb-1.5 text-xs font-bold">모인 20가구</p>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 20 }, (_, index) => <Home key={index} want={false} plain />)}
      </div>
    </Boundary>,
    <Boundary key="choice">
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <Group name="A" want={10} />
        <Group name="B" want={0} />
      </div>
    </Boundary>,
    <Boundary key="random">
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <Group name="A" want={wantInA} />
        <Group name="B" want={10 - wantInA} />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setWantInA(drawWantInA())}
          className="min-h-11 rounded-lg border border-primary px-4 text-xs font-bold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          다시 뽑기
        </button>
      </div>
    </Boundary>,
  ];

  return (
    <VizFrame
      eyebrow="모으기와 나누기"
      title="누가 들어오는가와 어느 쪽으로 가는가는 다른 질문입니다"
      description="칸 하나가 가구 하나입니다. 둘째 장면부터 채운 칸은 장치를 원하는 집, 빈 칸은 원하지 않는 집입니다."
      note="가구 수 외의 값은 설명용 (가정)입니다. 3번 장면의 개수는 이 화면에서 실제로 섞어 뽑은 결과이며 연구 결과가 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="표본 추출과 무작위 배정이 각각 정하는 것을 가구 칸으로 나누어 보는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack active={active} className="mx-auto mt-4 w-full max-w-[560px]" scenes={visuals} />
        <StableSceneStack
          active={active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
