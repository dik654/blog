import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["체결 3.00%", "장부 3.05%", "차이 0.05", "거래 확인", "평가 전파", "결제 확인", "포트폴리오 대사", "완료 상태"] as const;

const NOTES = [
  "명목 100, 연 고정금리 3.00%로 거래가 체결되면 A 장부의 연 고정액은 3.00입니다.",
  "상대방 B 장부에 3.05%가 들어가면 같은 거래가 두 시스템에서 서로 다른 조건으로 살아가기 시작합니다.",
  "100×3.05%=3.05와 100×3.00%=3.00의 현금 차이는 매년 0.05입니다.",
  "체결 원본·전자 확인·통신 기록을 대조해 합의값을 찾고 양쪽이 같은 수정 버전을 승인합니다.",
  "5bp 오류를 고치지 않으면 현재가치·민감도·변동증거금·규제 보고의 숫자도 갈라질 수 있습니다.",
  "지급 지시를 보낸 상태와 지정 계좌에 현금이 실제 도착한 상태를 분리해 기록합니다.",
  "첫 확인이 끝난 뒤에도 수정·부분해지·시장자료가 한쪽에만 반영될 수 있어 살아 있는 거래 전체를 주기적으로 대사합니다.",
  "체결·확인·평가·담보·결제·보고는 각자 담당자와 완료 증거를 가진 별도 상태입니다.",
] as const;

type Panel = "execution" | "capture" | "difference" | "confirmation" | "valuation" | "settlement" | "reconciliation" | "states";

const SCENES = [
  { title: "명목 100, 고정금리 3.00%로 체결하면 연 고정액은 3.00입니다", detail: "체결 시각·거래 식별자·명목·금리·통화·날짜를 원본 사건으로 남겨 이후 모든 장부가 참조하게 합니다.", panel: "execution", formula: "100×3.00%=3.00", conclusion: "체결은 거래 의사를 묶지만 양쪽 시스템에 같은 조건이 정확히 기록됐다는 뜻은 아닙니다." },
  { title: "상대방 장부에 3.05%가 들어가면 한 거래가 두 조건으로 갈라집니다", detail: "입력 오류·메시지 변환·수정 버전 누락 중 어디에서 5bp가 생겼는지 원본 식별자와 버전으로 추적합니다.", panel: "capture", formula: "A 장부 3.00% · B 장부 3.05%", conclusion: "거래 식별자가 같아도 조건과 버전이 다르면 평가·담보·현금흐름은 서로 다른 결과를 냅니다." },
  { title: "5bp 차이는 명목 100에서 해마다 현금 0.05를 만듭니다", detail: "작은 금리 차이도 거래 수와 기간이 늘면 반복되는 현금·평가·증거금 차이가 됩니다.", panel: "difference", formula: "100×(3.05%−3.00%)=0.05", conclusion: "먼저 양쪽 계산을 숫자로 재현해야 어느 장부를 고치고 뒤의 금액을 다시 만들지 결정할 수 있습니다." },
  { title: "체결 원본과 확인 자료를 맞춰 양쪽이 3.00% 수정본에 동의합니다", detail: "거래 확인은 핵심 경제·법률조건을 같은 내용으로 확정하고 이전의 충돌하는 기록보다 우선할 버전을 남깁니다.", panel: "confirmation", formula: "원본·통신 대조 → 합의 3.00% → 양쪽 승인", conclusion: "한쪽이 값을 덮어쓴 것과 양쪽이 같은 확인서에 동의한 것은 다른 상태입니다." },
  { title: "수정된 3.00%를 평가·민감도·증거금·보고 장부에 전파합니다", detail: "조건만 고치고 파생된 금액을 다시 만들지 않으면 뒤의 시스템에는 이전 오류가 계속 남습니다.", panel: "valuation", formula: "확인된 거래 → 재평가 → 증거금 재계산 → 보고 갱신", conclusion: "수정 완료는 원본 레코드뿐 아니라 영향을 받은 파생 장부와 외부 보고까지 일치해야 확인할 수 있습니다." },
  { title: "지급 지시 3.00을 보낸 뒤 지정 계좌의 실제 도착까지 확인합니다", detail: "은행·수탁기관의 수신 상태, 실패 사유, 재시도와 최종 완료 시각을 같은 거래 식별자에 연결합니다.", panel: "settlement", formula: "지급 계산 3.00 → 지시 → 은행 처리 → 입금 확인", conclusion: "메시지를 성공적으로 보낸 상태는 돈이 들어온 결제 완료 상태가 아닙니다." },
  { title: "첫 확인 뒤에도 살아 있는 거래 전체를 주기적으로 다시 맞춥니다", detail: "수정·부분해지·양도·평가가 한쪽에만 반영됐는지 거래 목록과 주요 조건·가치를 포트폴리오 단위로 비교합니다.", panel: "reconciliation", formula: "A 거래 목록·조건·가치 ↔ B 거래 목록·조건·가치", conclusion: "포트폴리오 대사는 차이를 찾는 경보이며 원인을 고쳐 양쪽 장부가 다시 맞은 상태를 따로 기록합니다." },
  { title: "체결·확인·평가·담보·결제·보고의 완료를 한 표시로 합치지 않습니다", detail: "각 상태의 소유자·시각·원본 증거와 미결 사유를 남겨 어느 단계에서 고객·상대방 위험이 남았는지 봅니다.", panel: "states", formula: "체결됨≠확인됨≠결제됨≠대사 완료≠보고 완료", conclusion: "거래 생애주기는 체결 한 번이 아니라 계약·장부·현금과 보고가 만기까지 일치하도록 예외를 해결하는 과정입니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function ExecutionPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="스왑 체결 조건"><Tile label="명목" value="100" /><Tile label="고정금리" value="3.00%" /><Tile label="연 고정액" value="3.00" active /></div>; }
function CapturePanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="양쪽 장부의 금리 차이"><Tile label="A 장부" value="3.00%" /><Tile label="B 장부" value="3.05%" active /></div>; }
function DifferencePanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="5bp 현금 차이 계산"><Tile label="B 현금" value="3.05" /><span className="font-mono text-xs font-black">−</span><Tile label="A 현금" value="3.00" /><span className="font-mono text-xs font-black">=</span><Tile label="차이" value="0.05" active /></div>; }
function ConfirmationPanel() { const items=["원본","대조","합의","승인"]; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="거래 확인 절차">{items.map((item,index)=><Tile key={item} label={`${index+1}단계`} value={item} active={index===items.length-1} />)}</div>; }
function ValuationPanel() { const items=[["거래","3.00%"],["평가","재계산"],["담보","갱신"],["보고","정정"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="확인된 거래 조건의 전파">{items.map(([label,value],index)=><Tile key={label} label={label} value={value} active={index===items.length-1} />)}</div>; }
function SettlementPanel() { const items=["계산","지시","처리","도착"]; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="현금 결제 완료 과정">{items.map((item,index)=><Tile key={item} label={`${index+1}단계`} value={item} active={index===items.length-1} />)}</div>; }
function ReconciliationPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="포트폴리오 대사"><Tile label="A 장부" value="거래·조건·가치" /><Tile label="비교" value="차이 찾기" active /><Tile label="B 장부" value="거래·조건·가치" /></div>; }
function StatesPanel() { const items=["확인","평가","결제","보고"]; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="거래 생애주기의 별도 완료 상태">{items.map((item,index)=><Tile key={item} label={`${index+1}상태`} value={item} active={index===items.length-1} />)}</div>; }

export default function DerivativesTradeLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="거래 생애주기 · 확인·결제·대사" title="3.00%로 체결한 스왑이 한쪽 장부의 3.05% 오류를 지나 다시 맞춰지는 과정을 봅니다" description="5bp 차이가 확인·평가·증거금·결제로 퍼지는 경로와, 각 단계의 완료 증거를 한 거래 식별자로 연결합니다." note="명목 100과 금리 3.00%·3.05%는 운영 흐름을 설명하기 위한 가정입니다. 실제 확인·대사·결제 의무와 기한은 거래·당사자·관할 규칙을 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-derivatives-trade-lifecycle data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "execution" && <ExecutionPanel />}{scene.panel === "capture" && <CapturePanel />}{scene.panel === "difference" && <DifferencePanel />}{scene.panel === "confirmation" && <ConfirmationPanel />}{scene.panel === "valuation" && <ValuationPanel />}{scene.panel === "settlement" && <SettlementPanel />}{scene.panel === "reconciliation" && <ReconciliationPanel />}{scene.panel === "states" && <StatesPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="파생상품 거래 생애주기 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
