import type { ReactNode } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #comparison — 한국 예금보호 한도를 어느 단위로 합산하는가.
 * 막대 축척: 1억300만 원 = 100%. 9900+400=1억300, 1억을 넘는 300만 원은 한도 밖입니다.
 */
const SCENES = [
  { label: "원금과 이자를 함께", summary: "1040만 원", note: "1000만 원 예금이 보호 대상이고 다른 합산 예금이 없다면 이자까지 1040만 원으로 셉니다." },
  { label: "1억 원을 넘는 경우", summary: "300만 원 초과", note: "원금만 보면 한도 안이지만 보호 대상 이자까지 더하면 300만 원은 기본 한도에 들어가지 않습니다." },
  { label: "합산은 회사 단위", summary: "계좌가 아니라 회사", note: "같은 회사의 계좌를 나눠도 한 칸에 합쳐 1억 원입니다. 여러 금융회사에 나누면 회사마다 따로 적용합니다." },
  { label: "같은 회사 안의 별도 칸", summary: "각각 1억 원", note: "퇴직연금, 연금저축, 사고보험금은 일반 예금과 별도로 각각 1억 원 한도입니다. 펀드는 같은 곳에서 사도 보호 대상이 아닙니다." },
] as const;

const FULL = 10300;
const pct = (value: number) => `${(value / FULL) * 100}%`;

function Segment({ width, tone, dashed = false }: { width: string; tone: string; dashed?: boolean }) {
  return <div className={`h-full shrink-0 ${tone} ${dashed ? "border border-dashed border-red-600" : ""}`} style={{ width }} />;
}

function LimitBar({ children, rows }: { children: ReactNode; rows: readonly (readonly [string, string])[] }) {
  return (
    <div>
      <div className="relative mt-7 h-10 rounded border border-border">
        <div className="flex h-full">{children}</div>
        <div className="absolute inset-y-[-8px] w-px bg-foreground" style={{ left: pct(10000) }} />
        <span className="absolute -top-7 whitespace-nowrap text-xs font-bold text-foreground" style={{ right: `calc(${pct(300)} - 4px)` }}>한도 1억 원</span>
      </div>
      <dl className="mt-3 space-y-1 text-sm">
        {rows.map(([name, value]) => (
          <div key={name} className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-0.5">
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              {name === "원금" && <span className="size-2.5 bg-blue-600/75" />}
              {name === "이자" && <span className="size-2.5 bg-amber-600" />}
              {name === "기본 한도 밖" && <span className="size-2.5 border border-dashed border-red-600" />}
              {name}
            </dt>
            <dd className="font-mono font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Bin({ name, limit, sub }: { name: string; limit: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-primary/60 px-1 py-1 text-center">
      <p className="text-sm font-bold leading-5">{name}</p>
      {sub && <p className="text-xs leading-4 text-muted-foreground">{sub}</p>}
      <p className="font-mono text-sm font-bold text-primary">{limit}</p>
    </div>
  );
}

function Company({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg border border-border p-2.5">
      <p className="mb-2 text-xs font-bold text-muted-foreground">{name}</p>
      {children}
    </div>
  );
}

const STAGES = [
  <LimitBar key="a" rows={[["원금", "1000만 원"], ["이자", "40만 원"], ["합계", "1040만 원, 한도 이내"]]}>
    <Segment width={pct(1000)} tone="bg-blue-600/75" />
    <Segment width={pct(40)} tone="bg-amber-600" />
  </LimitBar>,
  <LimitBar key="b" rows={[["원금", "9900만 원"], ["이자", "400만 원"], ["합계", "1억300만 원"], ["기본 한도 밖", "300만 원"]]}>
    <Segment width={pct(9900)} tone="bg-blue-600/75" />
    <Segment width={pct(100)} tone="bg-amber-600" />
    <Segment width={pct(300)} tone="bg-transparent" dashed />
  </LimitBar>,
  <div key="c" className="grid grid-cols-2 gap-3 pt-2">
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-bold">같은 회사에 계좌 둘</p>
      <Company name="한 금융회사">
        <div className="mb-2 grid grid-cols-2 gap-1.5 text-center text-xs">
          <span className="rounded border border-dashed border-border py-1">계좌 1</span>
          <span className="rounded border border-dashed border-border py-1">계좌 2</span>
        </div>
        <Bin name="합쳐서" limit="1억 원" />
      </Company>
    </div>
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-bold">두 회사에 하나씩</p>
      <div className="space-y-2">
        <Company name="A 회사"><p className="text-center font-mono text-sm font-bold text-primary">1억 원</p></Company>
        <Company name="B 회사"><p className="text-center font-mono text-sm font-bold text-primary">1억 원</p></Company>
      </div>
    </div>
  </div>,
  <div key="d" className="space-y-2">
    <Company name="한 금융회사">
      <div className="grid grid-cols-2 gap-1.5">
        <Bin name="일반 예금" limit="1억 원" />
        <Bin name="퇴직연금" sub="보호상품 운용분" limit="1억 원" />
        <Bin name="연금저축" limit="1억 원" />
        <Bin name="사고보험금" limit="1억 원" />
      </div>
    </Company>
    <p className="rounded-lg border border-dashed border-red-600/70 px-2 py-1.5 text-center text-sm font-bold leading-5">
      펀드 등 운용실적 연동 상품: <span className="text-red-700 dark:text-red-400">보호 대상 아님</span>
    </p>
  </div>,
];

export default function DepositLimitUnitsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="보호 한도의 단위"
      title="예금보호 한도를 어디까지 묶어 세는지 봅니다"
      description="보호 대상 예금은 예금자 보호 제도가 적용되는 예금입니다. 그림은 2025년 9월 1일부터의 한국 기본 한도 1억 원 기준입니다."
      note="금액은 설명용 가정입니다. 미국과 EU의 한도는 아래 본문에서 따로 봅니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="예금보호 한도의 합산 단위를 금액과 회사 구조로 보여 주는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack active={active} className="mx-auto mt-1 w-full max-w-[520px]" scenes={STAGES} />
        <StableSceneStack
          active={active}
          className="mt-2"
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
