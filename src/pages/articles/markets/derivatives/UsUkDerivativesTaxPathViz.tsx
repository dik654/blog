import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["출발", "미국 분류", "연말 평가", "60·40", "헤지", "영국 장부", "세법 조정", "근거표"] as const;

const NOTES = [
  "경제적 이익이 모두 10이어도 미국 개인과 영국 법인은 납세자·계약·관할이 달라 같은 계산표를 쓰지 않습니다.",
  "미국 경로는 먼저 해당 계약이 Section 1256의 법적 범위에 드는지 확인하며, 상품 이름만으로 적격 계약이라고 정하지 않습니다.",
  "적격 Section 1256 계약을 연말까지 보유했다면 일반적으로 마지막 영업일의 공정가치로 처분한 것처럼 손익을 인식합니다.",
  "미국 사례의 순자본손익 10은 일반적으로 장기 6과 단기 4로 나뉘지만, 이 비율은 실제 세액이나 모든 파생계약의 처리법이 아닙니다.",
  "적시에 식별한 헤지와 스트래들·선택 규칙은 일반 경로를 바꿀 수 있으므로 거래 목적과 식별 시각을 별도 근거로 남깁니다.",
  "영국 법인 경로는 단일 회사 회계에서 인식한 파생계약 손익 10과 계약 식별자를 총계정원장에서 찾는 데서 시작합니다.",
  "영국 세금 계산은 회계 손익을 출발점으로 삼되 적용 범위, 거래·비거래 구분과 회계에서 벗어나는 세법 조정을 검토합니다.",
  "최종 근거표는 납세자·계약·연도·목적·평가값·선택 또는 조정을 신고 숫자에 연결하며 두 나라의 결론을 서로 복사하지 않습니다.",
] as const;

type Panel = "split" | "usClass" | "usMark" | "usCharacter" | "usHedge" | "ukBook" | "ukAdjust" | "evidence";

const SCENES = [
  { title: "같은 이익 10을 미국 개인과 영국 법인의 장부로 나눕니다", detail: "먼저 납세자·계약·거래 목적·과세연도를 고정합니다. 숫자가 같다는 이유로 한 나라의 계산법을 다른 나라에 옮기지 않습니다.", panel: "split", formula: "경제손익 10 → 미국 개인 경로 | 영국 법인 경로", conclusion: "이 비교는 세율 비교나 실제 신고액 계산이 아니라 두 계산의 출발점을 구분합니다." },
  { title: "미국은 계약이 Section 1256 범위인지 먼저 판정합니다", detail: "규제 선물·외화계약·비주식 옵션 등 법에서 정한 범위와 제외·선택 사항을 계약 원문과 과세연도 기준으로 확인합니다.", panel: "usClass", formula: "납세자+계약 원문+거래소·기초자산 → 적격 여부", conclusion: "‘선물’이나 ‘옵션’이라는 상품 이름만으로 60·40 분류를 적용하지 않습니다." },
  { title: "적격 계약의 연말 미결제분을 공정가치로 평가합니다", detail: "연말 마지막 영업일의 공정가치로 처분한 것처럼 보고, 종료한 계약과 연말 열린 계약의 손익을 해당 과세연도 장부에 모읍니다.", panel: "usMark", formula: "연말 공정가치 110−세금 장부가 100=손익 10", conclusion: "현금으로 계약을 닫지 않았어도 이 규칙에 따라 해당 연도 손익이 생길 수 있습니다." },
  { title: "미국 순자본이익 10을 장기 6과 단기 4로 나눕니다", detail: "일반적인 Section 1256 자본손익 경로에서는 보유기간과 무관하게 순손익의 60%와 40%를 서로 다른 성격으로 신고 양식에 보냅니다.", panel: "usCharacter", formula: "10×60%=장기 6 · 10×40%=단기 4", conclusion: "6과 4는 소득 성격의 분리이며 납부세액 10이나 유효세율을 뜻하지 않습니다." },
  { title: "헤지 식별과 스트래들 선택은 미국의 일반 경로를 바꿀 수 있습니다", detail: "막으려는 위험, 계약과 식별 시각을 남기고 Form 6781의 선택·예외가 적용되는지 확인합니다. 경제적으로 상쇄된다는 설명만으로 충분하지 않습니다.", panel: "usHedge", formula: "일반 경로 − 적시 식별 헤지·스트래들 선택 검토", conclusion: "먼저 60·40으로 계산한 뒤 사후 메모로 헤지 예외를 붙이는 순서는 안전하지 않습니다." },
  { title: "영국 법인은 단일 회사 회계의 파생계약 손익에서 시작합니다", detail: "계약 식별자를 총계정원장과 평가 파일에 연결해 회계상 이익 10이 어느 파생계약과 관련 거래에서 생겼는지 확인합니다.", panel: "ukBook", formula: "공정가치·지급액 → 회계상 credit 10", conclusion: "미국의 장기 6·단기 4 분류를 영국 법인의 회계 손익에 적용하지 않습니다." },
  { title: "영국은 회계이익 10에 적용 범위와 세법 조정을 대조합니다", detail: "회사와 계약이 파생계약 제도에 드는지, 거래·비거래 항목인지, 회계에서 벗어나는 조정·헤지 규칙이 있는지 차례로 검토합니다.", panel: "ukAdjust", formula: "세금 계산 출발값=회계이익 10±적용 조정", conclusion: "회계이익 10은 최종 납부세액도 아니고 모든 경우에 조정 없이 과세되는 숫자도 아닙니다." },
  { title: "두 경로를 계약별 근거표에서 다시 합칩니다", detail: "납세자·계약·연도·목적·공정가치·헤지 식별·회계 항목·세법 조정을 신고 줄과 연결하고 검토자와 사용 자료의 버전을 남깁니다.", panel: "evidence", formula: "계약 ID → 평가값 → 분류·조정 → 신고 줄 → 검토 승인", conclusion: "실제 신고는 최신 법령·양식과 개별 사실을 확인해야 하며 이 교육용 10을 답으로 사용하지 않습니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false, complete = false }: { label: string; value: string; active?: boolean; complete?: boolean }) {
  return <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/70 bg-primary/10" : complete ? "border-foreground/30 bg-muted/45" : "border-border"}`}><p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function Arrow() { return <span aria-hidden="true" className="self-center font-mono text-[10px] font-black text-muted-foreground sm:text-sm">→</span>; }

function SplitPanel() { return <div className="grid grid-cols-[0.8fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="같은 경제손익에서 미국과 영국의 별도 세금 경로로 분기"><Tile label="경제손익" value="10" complete /><Arrow /><Tile label="미국 개인" value="계약부터 분류" active /><Arrow /><Tile label="영국 법인" value="회계부터 추적" active /></div>; }
function UsClassPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="미국 Section 1256 계약 분류"><Tile label="납세자" value="미국 개인" complete /><Arrow /><Tile label="계약 원문" value="범위·제외 확인" active /><Arrow /><Tile label="판정" value="Section 1256?" /></div>; }
function UsMarkPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="미국 연말 시가평가 계산"><Tile label="세금 장부가" value="100" complete /><Arrow /><Tile label="연말 공정가치" value="110" active /><Arrow /><Tile label="당해 손익" value="+10" /></div>; }
function UsCharacterPanel() { return <div className="grid grid-cols-[0.8fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="미국 Section 1256 순자본이익의 60 대 40 분류"><Tile label="순이익" value="10" complete /><Arrow /><Tile label="장기 성격" value="6 · 60%" active /><Arrow /><Tile label="단기 성격" value="4 · 40%" /></div>; }
function UsHedgePanel() { return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="미국 헤지 식별과 예외 검토"><Tile label="막는 위험" value="재고·금리 등" complete /><Tile label="계약·시각" value="적시에 식별" active /><Tile label="별도 검토" value="헤지·스트래들" /></div>; }
function UkBookPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="영국 법인의 회계상 파생계약 손익 경로"><Tile label="계약 ID" value="총계정원장" complete /><Arrow /><Tile label="평가·지급" value="회계 기록" active /><Arrow /><Tile label="회계 credit" value="10" /></div>; }
function UkAdjustPanel() { return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="영국 법인의 회계 손익과 세법 조정"><Tile label="회계 손익" value="10" complete /><Tile label="제도 판정" value="범위·성격" active /><Tile label="세금 출발값" value="10±조정" /></div>; }
function EvidencePanel() { return <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="국가별 파생상품 세금 근거표"><Tile label="계약" value="ID·원문" complete /><Tile label="값" value="평가·회계" complete /><Tile label="규칙" value="분류·조정" complete /><Tile label="신고" value="줄·승인" active /></div>; }

export default function UsUkDerivativesTaxPathViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="파생상품 세금 · 두 장부" title="같은 이익 10이 미국에서는 6과 4로 갈리고 영국에서는 회계 손익에서 시작합니다" description="미국 개인의 적격 Section 1256 계약과 영국 법인의 파생계약을 별도 경로로 추적해 계약 분류·인식 시점·세법 조정이 어디서 달라지는지 확인합니다." note="교육용 가정이며 세무 자문이나 실제 신고액 계산이 아닙니다. 납세자·계약·거래 목적·과세연도와 최신 법령·양식을 개별적으로 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-us-uk-derivatives-tax data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "split" && <SplitPanel />}{scene.panel === "usClass" && <UsClassPanel />}{scene.panel === "usMark" && <UsMarkPanel />}{scene.panel === "usCharacter" && <UsCharacterPanel />}{scene.panel === "usHedge" && <UsHedgePanel />}{scene.panel === "ukBook" && <UkBookPanel />}{scene.panel === "ukAdjust" && <UkAdjustPanel />}{scene.panel === "evidence" && <EvidencePanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="미국과 영국의 파생상품 세금 장부 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
