import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["인구", "연령", "비율", "시간", "돌봄", "전망", "한계"] as const;

const NOTES = [
  "설명용 A마을은 연초 100명에서 출생 2명·사망 1명·전입 3명·전출 2명을 반영해 연말 102명이 됩니다. 자연 증가와 순이동이 각각 1명입니다.",
  "연초 구성은 0~14세 20명, 15~64세 60명, 65세 이상 20명입니다. 15~64세 60명 가운데 실제 유급 취업자는 45명이라는 별도 가정을 둡니다.",
  "연초 연령 구성의 총부양비는 (20+20)÷60×100=약 66.7입니다. 다른 연령 66.7명이 모두 경제적으로 의존하거나 15~64세가 모두 취업했다는 뜻은 아닙니다.",
  "한 가구 성인의 하루 8시간 가운데 가족 돌봄 4시간이 필요하고 두 활동을 동시에 할 수 없다는 가정에서는 밖에서 일할 수 있는 시간이 4시간입니다.",
  "돌봄 2시간을 시간당 1.5만 원에 맡기고 비워진 시간에 시간당 2만 원으로 일할 수 있다면 추가 수입 4만 원, 지출 3만 원, 차이는 1만 원입니다. 실제로 일을 늘릴 수 있어야 성립합니다.",
  "다음 해 학생·노동자 수를 구하려면 현재 연령별 집단을 생존·출생·이동과 함께 한 살씩 옮겨야 합니다. 전입자의 나이를 모르는 현재 사례로 연말 연령 구성을 지어내지 않습니다.",
  "같은 총부양비라도 취업률·임금·건강·권리·공공서비스가 다르면 생활과 제도의 결과가 달라집니다. 인구 구성은 조건이지 한 나라의 운명표가 아닙니다.",
] as const;

type Panel = "balance" | "ages" | "ratio" | "time" | "care" | "cohort" | "limits";

const SCENES = [
  { title: "100명에 출생·사망·전입·전출을 반영하면 102명이 됩니다", detail: "같은 거주지 기준과 같은 1년을 사용한 설명용 인구 출입 장부입니다.", panel: "balance", formula: "100 + 2 − 1 + 3 − 2 = 102명", conclusion: "증가 2명은 출생·사망 차이 1명과 전입·전출 차이 1명에서 왔습니다." },
  { title: "같은 100명을 연령과 실제 취업 상태로 다시 나눕니다", detail: "연초 15~64세는 60명이지만 실제 유급 취업자는 45명이라는 별도 가정입니다.", panel: "ages", formula: "20명 + 60명 + 20명 = 100명 · 취업자 45명", conclusion: "연령상 일할 수 있는 집단과 실제로 유급 일에 참여한 사람은 같은 수가 아닙니다." },
  { title: "다른 연령 40명을 15~64세 60명과 비교합니다", detail: "UN 표준 지표의 총부양비 계산을 연초 연령 구성에 적용합니다.", panel: "ratio", formula: "(20 + 20) ÷ 60 × 100 = 약 66.7", conclusion: "이 비율은 연령 구성을 나타내며 실제 취업·소득·의존 관계를 직접 세지 않습니다." },
  { title: "하루 8시간에서 돌봄 4시간을 빼면 유급 일에 쓸 수 있는 시간은 4시간입니다", detail: "돌봄과 유급 일을 동시에 할 수 없고 통근·휴식을 생략한다는 한 가구의 설명용 시간표입니다.", panel: "time", formula: "하루 8시간 − 가족 돌봄 4시간 = 밖에서 일할 수 있는 4시간", conclusion: "사람 수를 노동공급으로 바꾸려면 각자의 시간 제약을 확인해야 합니다." },
  { title: "돌봄 2시간을 외부에 맡겼을 때 돈과 시간이 함께 움직입니다", detail: "서비스가 실제로 이용 가능하고 고용주가 근무시간을 늘려준다는 조건이 붙은 설명용 계산입니다.", panel: "care", formula: "추가 수입 4만 원 − 돌봄 지출 3만 원 = 차이 1만 원", conclusion: "서비스 구매만으로 수입이 저절로 생기지 않으며 비워진 시간을 소득으로 바꿀 조건이 필요합니다." },
  { title: "다음 해 연령별 인구는 각 집단을 한 살씩 옮겨 계산합니다", detail: "생존·출생·이동을 나이별로 적용하는 코호트 요인법의 큰 흐름입니다. 현재 사례에는 이동자의 나이가 없습니다.", panel: "cohort", formula: "현재 연령 집단 → 생존·한 살 증가 + 새 출생 + 나이별 순이동", conclusion: "총수 102명만으로 다음 해 학생·노동자·고령자 수를 확정할 수 없습니다." },
  { title: "사람 수와 나이 밖의 취업·권리·돌봄 조건을 함께 봅니다", detail: "같은 연령 구성도 임금·건강·재산·공공서비스와 이주자의 권리에 따라 생활 결과가 달라집니다.", panel: "limits", formula: "인구·연령 + 취업·근무시간 + 권리·서비스 + 돌봄 품질", conclusion: "인구 구성은 수요와 제약을 묻는 출발점이며 정책 결과를 혼자 결정하지 않습니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function BalancePanel() {
  const items = [["연초", 100], ["출생", 2], ["사망", -1], ["전입", 3], ["전출", -2], ["연말", 102]] as const;
  return (
    <div className="grid grid-cols-6 gap-1" aria-label="A마을의 한 해 인구 출입 장부">
      {items.map(([label, value], index) => (
        <div key={label} className={`min-w-0 border-y py-2 text-center ${index === items.length - 1 ? "border-foreground/60" : "border-border"}`}><p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">{label}</p><p className={`mt-1 font-mono text-[9px] font-black sm:text-sm ${index === items.length - 1 ? "text-primary" : ""}`}>{index > 0 && index < 5 && value > 0 ? "+" : ""}{value}명</p></div>
      ))}
    </div>
  );
}

function AgesPanel() {
  const groups = [["0~14세", 20, "bg-muted-foreground"], ["15~64세", 60, "bg-foreground"], ["65세 이상", 20, "bg-primary"]] as const;
  return (
    <div className="space-y-3" aria-label="A마을의 연초 연령 구성과 취업자">
      <div className="flex h-8 overflow-hidden border border-border">{groups.map(([label, value, tone]) => <div key={label} className={`${tone} flex items-center justify-center text-[8px] font-black text-background`} style={{ width: `${value}%` }}>{label} {value}</div>)}</div>
      <div className="grid grid-cols-2 gap-2"><div className="border border-border p-2.5 text-center"><p className="text-[8px] font-bold text-muted-foreground">15~64세</p><p className="mt-1 font-mono text-sm font-black">60명</p></div><div className="border border-foreground/50 p-2.5 text-center"><p className="text-[8px] font-bold text-muted-foreground">실제 유급 취업</p><p className="mt-1 font-mono text-sm font-black text-primary">45명</p></div></div>
    </div>
  );
}

function RatioPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="총부양비 계산">
      <div className="border border-border p-3 text-center"><p className="text-[8px] font-bold text-muted-foreground">다른 연령</p><p className="mt-1 font-mono text-base font-black">20 + 20 = 40명</p></div><span className="font-black" aria-hidden="true">÷ 60 × 100 =</span><div className="border border-foreground/50 p-3 text-center"><p className="text-[8px] font-bold text-muted-foreground">총부양비</p><p className="mt-1 font-mono text-base font-black text-primary">약 66.7</p></div>
    </div>
  );
}

function TimePanel() {
  return (
    <div className="space-y-2" aria-label="하루 8시간의 유급 일과 돌봄 배분">
      <div className="flex h-10 overflow-hidden border border-border"><div className="flex w-1/2 items-center justify-center bg-foreground text-[10px] font-black text-background">가족 돌봄 4시간</div><div className="flex w-1/2 items-center justify-center bg-primary text-[10px] font-black text-primary-foreground">유급 일 가능 4시간</div></div>
      <p className="text-center text-[8px] font-bold text-muted-foreground sm:text-[10px]">통근·휴식과 동시 수행은 생략한 설명용 시간표</p>
    </div>
  );
}

function CarePanel() {
  const items = [["외부 돌봄", "2시간 × 1.5만", "−3만 원"], ["추가 유급 일", "2시간 × 2만", "+4만 원"], ["현금 차이", "조건 충족 때", "+1만 원"]] as const;
  return (
    <div className="grid grid-cols-3 gap-1.5" aria-label="외부 돌봄과 추가 유급 일의 현금 차이">
      {items.map(([title, calc, value], index) => <div key={title} className={`min-w-0 border p-2.5 text-center ${index === 2 ? "border-foreground/50" : "border-border"}`}><p className="text-[8px] font-bold text-muted-foreground">{title}</p><p className="mt-1 break-keep font-mono text-[8px] font-black sm:text-[10px]">{calc}</p><p className={`mt-1 font-mono text-[10px] font-black sm:text-sm ${index === 2 ? "text-primary" : ""}`}>{value}</p></div>)}
    </div>
  );
}

function CohortPanel() {
  const steps = [["현재 10세", "생존"], ["다음 해 11세", "한 살 이동"], ["새 출생", "0세에 추가"], ["순이동", "각 나이에 반영"]] as const;
  return (
    <div className="relative grid grid-cols-4 gap-1.5" aria-label="코호트 요인법의 연령 이동">
      <span className="absolute left-[11%] right-[11%] top-4 h-px bg-border" aria-hidden="true" />
      {steps.map(([title, detail], index) => <div key={title} className="relative min-w-0 text-center"><span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index + 1}</span><p className="mt-1 text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px]">{detail}</p></div>)}
    </div>
  );
}

function LimitsPanel() {
  const items = [["취업", "실제 참여·근무시간"], ["생활", "임금·건강·재산"], ["권리", "이주·고용 자격"], ["서비스", "학교·주택·돌봄"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5" aria-label="인구 구성과 함께 봐야 할 생활 조건">
      {items.map(([title, detail], index) => <div key={title} className="min-w-0 border border-border p-2 text-center sm:p-3"><span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[8px] font-black text-background">{index + 1}</span><p className="mt-1 text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p></div>)}
    </div>
  );
}

export default function PopulationMigrationCareViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="인구와 돌봄 · 설명용 마을" title="100명이 102명이 되는 장부와 한 사람의 8시간이 갈리는 과정을 함께 보기" description="사람 수·연령 구성·실제 취업·돌봄 시간을 같은 숫자로 합치지 않고 서로 연결합니다." note="인구·연령·취업자·시간·요금은 모두 설명용 가정입니다. 실제 인구 전망과 노동·돌봄 정책의 효과가 아닙니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-population-care-viz data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4"><div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "balance" && <BalancePanel />}{scene.panel === "ages" && <AgesPanel />}{scene.panel === "ratio" && <RatioPanel />}{scene.panel === "time" && <TimePanel />}{scene.panel === "care" && <CarePanel />}{scene.panel === "cohort" && <CohortPanel />}{scene.panel === "limits" && <LimitsPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div></div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="인구와 돌봄 시간 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
