import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #small-case, #why-delegation, #manager-handoff — 제출물 A1·B1을 합치는 장부.
 * 왼쪽 = 도착한 제출물, 가운데 = 의사코드의 판본·식별자·근거 검사, 오른쪽 = 합친 결과.
 * A1 {x,y,z} + B1 {z,w} → z 중복 1건 → 3+2−1 = 4. A1 재도착을 다시 더하면 4+3 = 7.
 */
type Tone = "idle" | "ok" | "skip" | "bad";

interface Check {
  label: string;
  result: string;
  tone: Tone;
}

interface Scene {
  label: string;
  summary: string;
  incoming: string;
  source: string;
  issues: string;
  checks: readonly [Check, Check, Check];
  applied: string;
  merged: readonly string[];
  extra: string;
  extraTone: Tone;
  note: string;
}

const ALL_ISSUES = ["x", "y", "z", "w"] as const;

const SCENES: readonly Scene[] = [
  {
    label: "A1 도착",
    summary: "고유 문제 3건",
    incoming: "A1",
    source: "doc1:r1",
    issues: "{x, y, z}",
    checks: [
      { label: "① 판본", result: "고정한 doc1:r1과 같음", tone: "ok" },
      { label: "② 제출 식별자", result: "A1 처음 도착", tone: "ok" },
      { label: "③ 근거 위치", result: "x·y·z 원문 확인", tone: "ok" },
    ],
    applied: "A1",
    merged: ["x", "y", "z"],
    extra: "적용한 제출 목록에 A1을 기록합니다",
    extraTone: "idle",
    note: "A는 고정한 판본 doc1:r1에서 문제 x·y·z를 찾아 제출 식별자 A1과 함께 제출합니다. Merge owner는 판본·식별자·근거를 확인한 뒤 3건을 결과에 넣습니다. (가정)",
  },
  {
    label: "B1 도착 · z가 겹침",
    summary: "3 + 2 − 1 = 4건",
    incoming: "B1",
    source: "doc2:r1",
    issues: "{z, w}",
    checks: [
      { label: "① 판본", result: "고정한 doc2:r1과 같음", tone: "ok" },
      { label: "② 제출 식별자", result: "B1 처음 도착", tone: "ok" },
      { label: "③ 근거 위치", result: "z는 A1의 z와 같은 문제", tone: "ok" },
    ],
    applied: "A1 · B1",
    merged: ["x", "y", "z", "w"],
    extra: "원문 위치 없이 3건과 2건만 받았다면 z가 중복인지 판정할 수 없습니다",
    extraTone: "idle",
    note: "B1의 z는 원문 위치를 확인해 A1의 z와 같은 문제로 판정됩니다. 그래서 하나로 합치고 고유 문제는 3+2−1=4건입니다.",
  },
  {
    label: "A1이 다시 도착",
    summary: "그대로 4건",
    incoming: "A1",
    source: "doc1:r1",
    issues: "{x, y, z}",
    checks: [
      { label: "① 판본", result: "doc1:r1과 같음", tone: "ok" },
      { label: "② 제출 식별자", result: "A1 이미 적용 · 내용 같음", tone: "skip" },
      { label: "③ 근거 위치", result: "건너뜀", tone: "idle" },
    ],
    applied: "A1 · B1",
    merged: ["x", "y", "z", "w"],
    extra: "식별자를 보지 않고 다시 더하면 4 + 3 = 7건이 됩니다",
    extraTone: "bad",
    note: "응답이 늦어 재요청한 A의 제출물이 두 번 돌아온 경우입니다. 식별자 A1이 이미 적용 목록에 있고 내용도 같으므로 결과를 그대로 둡니다.",
  },
  {
    label: "같은 식별자, 다른 내용",
    summary: "충돌 보고 · 4건 유지",
    incoming: "A1",
    source: "doc1:r1",
    issues: "{x, y, v} (가정)",
    checks: [
      { label: "① 판본", result: "doc1:r1과 같음", tone: "ok" },
      { label: "② 제출 식별자", result: "A1 이미 적용 · 내용 다름", tone: "bad" },
      { label: "③ 근거 위치", result: "합치기 전에 멈춤", tone: "idle" },
    ],
    applied: "A1 · B1",
    merged: ["x", "y", "z", "w"],
    extra: "덮어쓰지 않고 충돌로 보고합니다",
    extraTone: "bad",
    note: "식별자는 A1인데 내용이 다르면 먼저 받은 A1을 덮어쓰지 않고 충돌로 보고합니다. 다른 내용 {x, y, v}는 경우를 보이려는 가정입니다.",
  },
  {
    label: "도착 순서를 바꾸면",
    summary: "B1 → A1도 4건",
    incoming: "B1 → A1",
    source: "doc2:r1 · doc1:r1",
    issues: "{z, w} 다음 {x, y, z}",
    checks: [
      { label: "① 판본", result: "둘 다 고정한 판본", tone: "ok" },
      { label: "② 제출 식별자", result: "B1·A1 각각 처음", tone: "ok" },
      { label: "③ 근거 위치", result: "z는 같은 문제", tone: "ok" },
    ],
    applied: "B1 · A1",
    merged: ["x", "y", "z", "w"],
    extra: "같은 문제를 한 번만 남기므로 이 사례의 결과는 순서와 무관합니다",
    extraTone: "ok",
    note: "앞 장면과 이어지지 않고 빈 결과에서 다시 시작해 B1이 먼저 온 갈래입니다. {z, w}에 {x, y, z}를 더하며 같은 z를 하나로 합치면 {x, y, z, w}, 4건입니다. 도착 순서가 바뀌어도 같은 최종 결과가 나오는 성질이 commutative merge입니다.",
  },
  {
    label: "다른 경우: B가 doc2:r2를 읽음",
    summary: "합치지 않음 · 3건",
    incoming: "B의 제출물 (가정)",
    source: "doc2:r2",
    issues: "—",
    checks: [
      { label: "① 판본", result: "고정한 doc2:r1과 다름", tone: "bad" },
      { label: "② 제출 식별자", result: "확인 전에 멈춤", tone: "idle" },
      { label: "③ 근거 위치", result: "확인 전에 멈춤", tone: "idle" },
    ],
    applied: "A1",
    merged: ["x", "y", "z"],
    extra: "비교 기준이 달라졌으므로 그대로 합치지 않습니다",
    extraTone: "bad",
    note: "두 번째 장면 대신 B가 최신 문서 doc2:r2를 임의로 읽었다고 가정한 갈래입니다. 판본 검사에서 멈추므로 결과에는 A1의 3건만 남습니다.",
  },
];

const TONE_CLASS: Record<Tone, string> = {
  idle: "border-border text-muted-foreground",
  ok: "border-primary text-foreground",
  skip: "border-amber-600 text-amber-700 dark:text-amber-400",
  bad: "border-red-600 text-red-700 dark:text-red-400",
};

function SceneBody({ scene }: { scene: Scene }) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="min-w-0 rounded-md border border-border px-3 py-2 text-xs leading-5">
        <span className="block text-[11px] font-bold text-muted-foreground">도착한 제출물</span>
        <span className="mt-1 block break-keep font-mono font-bold">receipt = {scene.incoming}</span>
        <span className="block break-keep font-mono">sources = {scene.source}</span>
        <span className="block break-keep font-mono">issues = {scene.issues}</span>
      </div>

      <div className="min-w-0 space-y-1.5">
        <span className="block text-[11px] font-bold text-muted-foreground">Merge owner의 검사</span>
        {scene.checks.map((check) => (
          <div key={check.label} className={`grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2 rounded-md border px-2 py-1 text-xs leading-5 ${TONE_CLASS[check.tone]}`}>
            <span className="font-semibold">{check.label}</span>
            <span className="min-w-0 break-keep">{check.result}</span>
          </div>
        ))}
      </div>

      <div className="min-w-0 rounded-md border border-border px-3 py-2 text-xs leading-5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[11px] font-bold text-muted-foreground">합친 결과</span>
          <span className="font-mono text-sm font-bold text-primary">{scene.merged.length}건</span>
        </div>
        <div className="mt-1.5 grid grid-cols-4 gap-1">
          {ALL_ISSUES.map((issue) => {
            const present = scene.merged.includes(issue);
            return (
              <span
                key={issue}
                className={`rounded border py-1 text-center font-mono font-bold ${present ? "border-primary text-foreground" : "border-dashed border-border text-muted-foreground/40"}`}
              >
                {issue}
              </span>
            );
          })}
        </div>
        <span className="mt-1.5 block break-keep text-muted-foreground">적용한 제출: {scene.applied}</span>
      </div>

      <p className={`break-keep rounded-md border px-3 py-2 text-xs font-semibold leading-5 sm:col-span-3 ${TONE_CLASS[scene.extraTone]}`}>{scene.extra}</p>
    </div>
  );
}

export default function MergeLedgerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      eyebrow="제출물 합치기"
      title="제출 식별자와 판본을 보고 A1·B1을 네 문제로 합칩니다"
      description="receipt는 제출 식별자, sources는 읽은 문서와 판본(r1), issues는 찾은 문제입니다. 가운데 세 검사는 8절 의사코드의 순서를 따르고, 문제 x·y·z·w와 겹침 1건은 본문이 세운 가정입니다(가정)."
      note="다섯째 장면은 빈 결과에서 다시 시작한 갈래, 마지막 장면은 두 번째 장면 대신 일어날 수 있는 다른 갈래입니다. 위임 자체가 이 검사를 자동으로 보장하지 않으며 애플리케이션이 설계해야 합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="제출물 A1과 B1을 판본, 제출 식별자, 근거 위치 순서로 검사해 고유 문제 4건으로 합치는 여섯 장면"
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
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => <SceneBody key={scene.label} scene={scene} />)}
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
