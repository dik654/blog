import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["세 계약", "순위험", "총 명목", "장부 대사", "허용오차", "압축안", "승인·종료", "사후 대사"] as const;

const NOTES = [
  "같은 상대방·통화·만기·금리 조건에서 고정금리 수취 100과 지급 60·40의 스왑 세 건이 있다고 가정합니다.",
  "방향을 붙여 더하면 +100−60−40=0이라 단순 순 고정금리 노출은 상쇄됩니다.",
  "계약의 절대 명목을 더하면 100+60+40=200입니다. 순위험 0과 계약 규모 200은 서로 다른 숫자입니다.",
  "압축 전 양쪽 장부에서 거래 식별자, 상대방, 통화, 만기, 금리와 현금흐름이 같은지 먼저 맞춥니다.",
  "참여자가 현재가치·금리 민감도·현금흐름 차이의 허용 범위를 정합니다. 압축 서비스가 임의로 위험 한도를 정하지 않습니다.",
  "완전히 같은 조건인 이 사례에서는 세 계약을 모두 종료해 순위험 0을 유지하면서 총 명목을 200에서 0으로 줄이는 안을 냅니다.",
  "계산 결과만으로 계약은 사라지지 않습니다. 당사자 승인과 같은 효력 시점의 종료 기록이 법률상 계약 상태를 바꿉니다.",
  "거래·평가·담보·규제보고 장부를 다시 맞춰 세 계약이 모두 종료됐는지 확인합니다. 한 장부가 남으면 이중 계산이 생길 수 있습니다.",
] as const;

type Panel = "trades" | "net" | "gross" | "reconcile" | "tolerance" | "proposal" | "approve" | "post";

const SCENES = [
  { title: "같은 조건의 수취 100과 지급 60·40이 살아 있습니다", detail: "세 계약의 상대방·통화·만기·금리와 지급 일정이 모두 같다는 가장 단순한 압축 사례에서 시작합니다.", panel: "trades", formula: "+100 · −60 · −40", conclusion: "숫자가 반대 방향이라는 이유만으로 계약을 바로 삭제하지 않고 조건과 법률 상태를 먼저 확인합니다." },
  { title: "방향을 붙여 더하면 단순 순위험은 0입니다", detail: "고정금리 수취를 양수, 지급을 음수로 놓으면 세 계약의 방향성 명목이 서로 상쇄됩니다.", panel: "net", formula: "100−60−40=0", conclusion: "순액 0은 이 좁은 사례의 방향성 노출을 말하며 현재가치와 민감도까지 자동으로 같다는 뜻은 아닙니다." },
  { title: "절대값을 더하면 총 명목 200이 남습니다", detail: "세 계약이 모두 장부에 살아 있으므로 확인·평가·담보·보고와 운영 비용도 계속 따라옵니다.", panel: "gross", formula: "|100|+|−60|+|−40|=200", conclusion: "총 명목을 줄이는 운영 성과와 실제 시장·신용위험의 변화는 서로 다른 지표로 측정합니다." },
  { title: "양쪽 장부에서 같은 세 계약인지 먼저 대사합니다", detail: "거래 식별자만 맞추지 않고 상대방, 방향, 통화, 만기, 금리와 지급 일정까지 기준시점에 맞춥니다.", panel: "reconcile", formula: "양쪽 장부+계약 조건→압축 대상 집합", conclusion: "누락되거나 조건이 다른 거래를 넣으면 계산상 상쇄와 실제 계약 상태가 갈라집니다." },
  { title: "가치·민감도·현금흐름의 허용오차를 참여자가 정합니다", detail: "완전 일치가 아니라면 압축 전후 차이가 어느 범위까지 허용되는지 각 참여자가 먼저 승인 가능한 정책으로 냅니다.", panel: "tolerance", formula: "|ΔPV|≤한도 · |ΔDV01|≤한도 · 현금흐름 제약", conclusion: "압축 목표는 계약 수 최소화가 아니라 참여자가 허용한 위험 경계 안에서 불필요한 계약을 줄이는 것입니다." },
  { title: "서비스는 세 계약을 모두 종료하는 압축안을 미리 보여 줍니다", detail: "이 완전 일치 사례에서는 대체계약 없이 세 건을 종료해 순위험 0을 유지하고 총 명목을 0으로 줄일 수 있습니다.", panel: "proposal", formula: "계약 3→0 · 총 명목 200→0 · 순액 0→0", conclusion: "계산 결과는 제안일 뿐이며 당사자가 승인하기 전에는 기존 세 계약이 계속 유효합니다." },
  { title: "당사자 승인과 같은 효력 시점이 계약 상태를 바꿉니다", detail: "참여자가 결과를 승인하면 종료 확인과 필요한 대체거래를 같은 기준시점에 기록합니다.", panel: "approve", formula: "제안→당사자 승인→종료 효력", conclusion: "일부 시스템만 먼저 바꾸지 않도록 승인 실패와 중단 때 원래 계약을 유지하는 복구 경로가 필요합니다." },
  { title: "네 장부를 다시 맞춰 압축이 실제로 끝났는지 확인합니다", detail: "거래·평가·담보·규제보고가 모두 종료 상태인지 확인하고 남은 현재가치·민감도·현금 요구를 다시 계산합니다.", panel: "post", formula: "거래=0 · 평가=0 · 담보=갱신 · 보고=갱신", conclusion: "총 명목 200이 사라져도 상대방 위험과 유동성 위험이 같은 비율로 사라졌다고 결론 내리면 안 됩니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function TradesPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="압축 전 스왑 세 계약"><Tile label="계약 A" value="수취 +100" /><Tile label="계약 B" value="지급 −60" /><Tile label="계약 C" value="지급 −40" /></div>; }
function NetPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="스왑 세 계약의 순위험"><Tile label="수취" value="+100" /><Tile label="지급" value="−100" /><Tile label="순액" value="0" active /></div>; }
function GrossPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="스왑 세 계약의 총 명목"><Tile label="계약 수" value="3건" /><Tile label="순액" value="0" /><Tile label="총 명목" value="200" active /></div>; }
function ReconcilePanel() { const items=[["식별자","양쪽 일치"],["조건","통화·만기"],["지급","금리·일정"],["상태","모두 유효"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="압축 전 거래 대사">{items.map(([label,value],index)=><Tile key={label} label={label} value={value} active={index===3} />)}</div>; }
function TolerancePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="포트폴리오 압축 위험 허용오차"><Tile label="현재가치" value="ΔPV 한도" /><Tile label="금리 민감도" value="ΔDV01 한도" /><Tile label="현금흐름" value="시점 제약" active /></div>; }
function ProposalPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="압축 서비스의 종료 제안"><Tile label="계약 수" value="3→0" /><Tile label="총 명목" value="200→0" active /><Tile label="순액" value="0→0" /></div>; }
function ApprovePanel() { const items=[["1","제안"],["2","검토"],["3","승인"],["4","동시 종료"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="압축안 승인과 계약 종료">{items.map(([label,value],index)=><Tile key={label} label={`${label}단계`} value={value} active={index===3} />)}</div>; }
function PostPanel() { const items=[["거래","종료"],["평가","재계산"],["담보","호출 갱신"],["보고","상태 갱신"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="압축 뒤 네 장부 대사">{items.map(([label,value])=><Tile key={label} label={label} value={value} active />)}</div>; }

export default function PortfolioCompressionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="포트폴리오 압축 · 계산에서 계약 종료까지" title="순위험 0인 스왑 세 건의 총 명목 200을 안전하게 없애는 과정을 봅니다" description="세 계약의 순액과 총 명목을 따로 계산하고, 장부 대사·위험 허용오차·압축안·당사자 승인·사후 대사를 거쳐 실제 계약 상태가 바뀌는 흐름을 추적합니다." note="수취 100과 지급 60·40의 모든 조건이 같다는 교육용 사례입니다. 실제 압축은 현재가치·민감도·현금흐름, 계약과 규제 범위, 참여자 승인과 기록을 함께 검증해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-portfolio-compression data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "trades" && <TradesPanel />}{scene.panel === "net" && <NetPanel />}{scene.panel === "gross" && <GrossPanel />}{scene.panel === "reconcile" && <ReconcilePanel />}{scene.panel === "tolerance" && <TolerancePanel />}{scene.panel === "proposal" && <ProposalPanel />}{scene.panel === "approve" && <ApprovePanel />}{scene.panel === "post" && <PostPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="포트폴리오 압축 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
