import type { ReactNode } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #shape — 세로 [1,2,3]과 가로 [10,20,30]이 (3,3)으로 맞춰져 아홉 값이 된다.
 * 점선 칸은 비교상 늘린 모양이며 입력을 실제로 복사한다는 뜻이 아닙니다.
 */
const A = [1, 2, 3] as const;
const B = [10, 20, 30] as const;

type Tone = "solid" | "stretched" | "accent" | "plain";

function Cell({ children, tone = "solid" }: { children: ReactNode; tone?: Tone }) {
  const toneClass = {
    solid: "border-border text-foreground font-bold",
    stretched: "border-dashed border-border text-muted-foreground",
    accent: "border-primary text-primary font-bold",
    plain: "border-border text-muted-foreground",
  }[tone];
  return <span className={`flex h-[36px] w-[36px] items-center justify-center rounded border font-mono text-sm ${toneClass}`}>{children}</span>;
}

function Grid({ cols, children, label }: { cols: number; children: ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 36px)` }}>{children}</div>
      <span className="text-center font-mono text-xs font-bold text-muted-foreground">{label}</span>
    </div>
  );
}

/** 오른쪽 축부터 맞춘 shape 비교 한 줄 */
function ShapeRow({ name, axes }: { name: string; axes: readonly (string | null)[] }) {
  return (
    <div className="flex items-center gap-1">
      <span className="w-9 shrink-0 text-xs font-bold text-muted-foreground">{name}</span>
      {axes.map((axis, index) => (
        <span
          key={index}
          className={`flex h-[32px] w-[44px] items-center justify-center rounded border font-mono text-sm ${axis === null ? "border-transparent" : "border-border font-bold"}`}
        >
          {axis}
        </span>
      ))}
    </div>
  );
}

function Plus() {
  return <span className="font-mono text-lg font-bold text-muted-foreground">+</span>;
}

const SCENES = [
  {
    label: "의도한 짝",
    summary: "원하는 답 11 · 22 · 33",
    note: "둘 다 원소가 세 개라 같은 위치끼리 더해질 것처럼 보입니다. 축 크기 목록인 shape는 (3,1)과 (3,)로 다릅니다.",
    view: (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Grid cols={1} label="a (3,1)">{A.map((v) => <Cell key={v}>{v}</Cell>)}</Grid>
        <Plus />
        <Grid cols={3} label="b (3,)">{B.map((v) => <Cell key={v}>{v}</Cell>)}</Grid>
      </div>
    ),
  },
  {
    label: "축 맞추기",
    summary: "(3,1) + (1,3) → (3,3)",
    note: "오른쪽부터 맞추면 b는 비교상 (1,3)입니다. 두 축 모두 한쪽이 1이라 규칙을 통과하고, 1인 쪽이 상대 크기에 맞춰집니다.",
    view: (
      <div className="flex flex-col items-center gap-1">
        <ShapeRow name="a" axes={["3", "1"]} />
        <ShapeRow name="b" axes={[null, "3"]} />
        <ShapeRow name="비교" axes={["1", "3"]} />
        <div className="my-1 w-full max-w-[9rem] border-t border-border" />
        <ShapeRow name="결과" axes={["3", "3"]} />
      </div>
    ),
  },
  {
    label: "늘려서 맞춘 모양",
    summary: "두 입력이 모두 3×3",
    note: "a는 옆으로, b는 아래로 되풀이한 것처럼 짝을 짓습니다. 점선 칸은 짝짓기 표시이며 실제 복사를 뜻하지 않습니다.",
    view: (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Grid cols={3} label="a를 옆으로">
          {A.map((v) => [0, 1, 2].map((c) => <Cell key={`${v}-${c}`} tone={c === 0 ? "solid" : "stretched"}>{v}</Cell>))}
        </Grid>
        <Plus />
        <Grid cols={3} label="b를 아래로">
          {[0, 1, 2].map((r) => B.map((v) => <Cell key={`${r}-${v}`} tone={r === 0 ? "solid" : "stretched"}>{v}</Cell>))}
        </Grid>
      </div>
    ),
  },
  {
    label: "아홉 값",
    summary: "3개가 아니라 9개",
    note: "의도한 11, 22, 33은 대각선에 있을 뿐 여섯 조합이 더 생깁니다. 값은 FP16에도 정확히 들어가므로 정밀도를 올려도 아홉 개입니다.",
    view: (
      <div className="flex justify-center">
        <Grid cols={3} label="a + b 결과 (3,3)">
          {A.map((a, r) => B.map((b, c) => <Cell key={`${a}-${b}`} tone={r === c ? "accent" : "plain"}>{a + b}</Cell>))}
        </Grid>
      </div>
    ),
  },
  {
    label: "다른 shape",
    summary: "4≠5 거부 · 768=768 허용",
    note: "4와 5는 다르고 어느 쪽도 1이 아니라 합칠 수 없습니다. 끝 축이 같으면 합쳐지지만, 그 짝이 의도인지는 따로 확인합니다.",
    view: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col gap-1">
          <ShapeRow name="" axes={["3", "4"]} />
          <ShapeRow name="" axes={[null, "5"]} />
          <span className="text-center text-xs font-bold text-red-700 dark:text-red-400">끝 축 4 ≠ 5, 거부</span>
        </div>
        <div className="flex flex-col gap-1">
          <ShapeRow name="" axes={["32", "128", "768"]} />
          <ShapeRow name="" axes={[null, null, "768"]} />
          <span className="text-center text-xs font-bold text-primary">끝 축 768 = 768, 허용</span>
        </div>
      </div>
    ),
  },
] as const;

export default function BroadcastCellsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);

  return (
    <VizFrame
      eyebrow="칸의 짝짓기"
      title="세 칸과 세 칸을 더했는데 아홉 칸이 나옵니다"
      description="a [1,2,3]은 세로, b [10,20,30]은 가로입니다. 칸 하나가 원소 하나입니다."
      note="두 입력은 가정입니다. 축을 맞추는 규칙은 NumPy의 broadcasting입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="(3,1)과 (3,)가 (3,3)으로 맞춰져 아홉 값이 나오는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4 items-center"
          scenes={SCENES.map((item) => <div key={item.label}>{item.view}</div>)}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
