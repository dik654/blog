import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #comparison — 업종이 요구하는 건축물 용도와 후보 점포의 건축물대장 용도를 대조하는 분기.
 * 휴게음식점·제과점: 같은 건물 그 용도 바닥면적 합계 300㎡ 미만 → 제1종, 이상 → 제2종. 일반음식점 → 제2종.
 * 후보 점포: 제1종 근린생활시설, 120㎡(가정).
 */
type Path = "none" | "cafe" | "restaurant" | "after";
type Mark = "idle" | "on" | "ok" | "no";

const LABELS = ["업종별 용도", "휴게음식점", "일반음식점", "남은 확인"] as const;

const SCENES: ReadonlyArray<{ title: string; summary: string; path: Path; note: string }> = [
  {
    title: "업종이 먼저 필요한 건축물 용도를 정합니다",
    summary: "300㎡ 기준 · 제1종 / 제2종",
    path: "none",
    note: "법제처 생활법령(2026-11-01 확인)에 따르면 휴게음식점·제과점은 같은 건물에서 그 용도로 쓰는 바닥면적 합계가 300㎡ 미만이면 제1종, 300㎡ 이상이면 제2종 근린생활시설이어야 합니다. 일반음식점은 제2종 근린생활시설에 해당합니다(「건축법 시행령」 별표 1).",
  },
  {
    title: "커피와 빵을 파는 휴게음식점이라면",
    summary: "필요 제1종 = 대장 제1종",
    path: "cafe",
    note: "후보 점포는 건축물대장에 제1종 근린생활시설, 바닥면적 120㎡(가정)입니다. 같은 건물의 휴게음식점·제과점 면적을 합쳐도 300㎡ 미만이라면 휴게음식점은 들어갈 수 있습니다. 기준은 이 점포 하나가 아니라 합계이므로, 같은 건물에서 이미 그 용도로 쓰는 면적과 더해 300㎡ 이상이 되면 제2종이 필요합니다.",
  },
  {
    title: "술과 식사를 파는 일반음식점이라면",
    summary: "필요 제2종 ≠ 대장 제1종",
    path: "restaurant",
    note: "같은 점포에 일반음식점은 그대로 들어갈 수 없습니다. 「건축법」 제19조에 따라 허가를 받거나 신고하는 용도변경을 먼저 거쳐야 하므로 그 기간과 비용을 계약 전에 확인합니다.",
  },
  {
    title: "용도가 맞아도 계약 전에 남은 확인",
    summary: "용도 일치 → 다음 확인 → 약속",
    path: "after",
    note: "건물이 선 땅에 정해진 용도지역은 건축물 용도와 따로 확인합니다. 식품위생법 시행규칙 별표 14의 시설기준을 도면과 대조하고, 임대차의 업종 허용과 간판·배기·전기 증설 가능성까지 확인한 뒤에 보증금과 공사비를 약속합니다. 임대인이 허용해도 관청의 신고가 자동으로 되지는 않습니다.",
  },
];

function tone(mark: Mark) {
  if (mark === "ok") return "border-blue-600 text-foreground";
  if (mark === "no") return "border-red-600 text-foreground";
  if (mark === "on") return "border-primary text-foreground";
  return "border-border text-muted-foreground";
}

function Box({ mark, title, sub, tag }: { mark: Mark; title: string; sub?: string; tag?: string }) {
  return (
    <div className={`min-w-0 rounded-sm border px-2 py-1.5 text-xs leading-5 sm:px-3 sm:text-sm ${tone(mark)} ${mark === "idle" ? "" : "font-semibold"}`}>
      <p className="break-keep">{title}</p>
      {sub ? <p className="break-keep text-[11px] font-normal text-muted-foreground sm:text-xs">{sub}</p> : null}
      {tag ? (
        <p className={`text-[11px] font-bold sm:text-xs ${mark === "ok" ? "text-blue-700 dark:text-blue-400" : mark === "no" ? "text-red-700 dark:text-red-400" : "text-primary"}`}>{tag}</p>
      ) : null}
    </div>
  );
}

function Diagram({ path }: { path: Path }) {
  const cafe = path === "cafe";
  const rest = path === "restaurant";
  const after = path === "after";
  return (
    <div className="min-w-0 space-y-3">
      <div className="grid grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)] items-start gap-1 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1.1fr)]">
        <p className="text-[11px] font-bold text-muted-foreground sm:text-xs">업종</p>
        <span />
        <p className="text-[11px] font-bold text-muted-foreground sm:text-xs">필요한 건축물 용도</p>

        <Box mark={cafe ? "on" : "idle"} title="휴게음식점·제과점" sub="같은 건물 그 용도 합계" />
        <span className="pt-2 text-center text-xs text-muted-foreground" aria-hidden="true">→</span>
        <div className="grid min-w-0 gap-1 lg:grid-cols-2">
          <Box mark={cafe ? "on" : "idle"} title="300㎡ 미만: 제1종 근린생활시설" />
          <Box mark="idle" title="300㎡ 이상: 제2종 근린생활시설" />
        </div>

        <Box mark={rest ? "on" : "idle"} title="일반음식점" />
        <span className="pt-2 text-center text-xs text-muted-foreground" aria-hidden="true">→</span>
        <Box mark={rest ? "on" : "idle"} title="제2종 근린생활시설" />
      </div>

      <div className="border-t border-border pt-3">
        <p className="mb-1 text-[11px] font-bold text-muted-foreground sm:text-xs">후보 점포 건축물대장과 대조</p>
        <Box
          mark={cafe || after ? "ok" : rest ? "no" : "idle"}
          title="제1종 근린생활시설 · 바닥면적 120㎡(가정)"
          tag={cafe ? "일치: 건물 합계 300㎡ 미만이면 휴게음식점 가능" : rest ? "불일치: 용도변경(허가 또는 신고) 먼저" : after ? "용도 일치 뒤에도 아래를 확인" : "업종을 고르면 대조합니다"}
        />
      </div>

      <ol className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        {["용도지역", "별표 14 시설기준", "임대차 업종 허용", "간판·배기·전기 증설"].map((item, k) => (
          <li key={item} className={`rounded-sm border px-2 py-1 text-[11px] leading-4 sm:text-xs ${after ? "border-primary font-semibold text-foreground" : "border-dashed border-border text-muted-foreground"}`}>
            {k + 1}. {item}
          </li>
        ))}
      </ol>
      <p className={`text-[11px] sm:text-xs ${after ? "font-bold text-primary" : "text-muted-foreground"}`}>모두 확인한 뒤 → 보증금·공사비 약속</p>
    </div>
  );
}

export default function UseClassViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6500);
  return (
    <VizFrame
      eyebrow="건축물 용도 대조 · 한국 음식점"
      title="업종이 요구하는 용도와 건축물대장 용도를 맞춰 보기"
      description="근린생활시설은 「건축법 시행령」 별표 1이 정한 건축물 용도 분류의 이름입니다. 왼쪽 업종이 요구하는 용도를 찾고, 후보 점포의 건축물대장에 적힌 용도와 대조합니다."
      note="2026-11-01 확인한 법제처 생활법령 안내를 옮긴 분기이며 개별 점포의 허가 가능성을 판정하지 않습니다. 점포 면적은 설명용 가정입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="음식점 업종별 필요 건축물 용도와 후보 점포 대조"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((s) => (
            <div key={s.title} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{s.title}</h4>
              <span className="font-mono text-sm font-bold text-primary">{s.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack active={scenes.active} className="mt-4" scenes={SCENES.map((s) => <Diagram key={s.path} path={s.path} />)} />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((s) => (
            <p key={s.title} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{s.note}</p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={SCENES.map((s) => s.note)} />
      </div>
    </VizFrame>
  );
}
