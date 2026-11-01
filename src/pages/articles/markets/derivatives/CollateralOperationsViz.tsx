import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["노출 12", "호출액 5", "할인 가치", "응답·분쟁", "자산 배정", "실제 결제", "담보 교체", "별도 상태"] as const;

const NOTES = [
  "상계 묶음의 현재 노출이 12라고 계산됐습니다. 이 값이 곧바로 송금액이 되는 것은 아닙니다.",
  "계약상 문턱 2와 이미 받은 담보 5를 빼면 추가 호출액은 12−2−5=5입니다.",
  "시장가 6인 채권에 10% 할인율을 적용하면 담보 인정 가치는 5.4입니다. 적격성과 집중 한도는 따로 확인합니다.",
  "상대방이 3만 인정하면 합의분 3의 결제를 진행하고 미합의분 2는 거래·평가·계약 조건 자료로 조사합니다.",
  "합의액을 채울 현금이나 채권을 고른 뒤 통화·발행자·만기·집중 한도와 결제 계좌를 검증합니다.",
  "담보 지시를 보낸 상태와 수탁 계좌에 실제 자산이 도착한 상태를 나누고 실패·재지시를 기록합니다.",
  "담보 교체에서는 인정 가치가 충분한 새 자산의 결제를 먼저 확인한 뒤 기존 자산을 반환합니다.",
  "호출·응답·합의·배정·결제·대사는 각자 소유자와 완료 증거가 있는 별도 상태입니다.",
] as const;

type Panel = "exposure" | "call" | "haircut" | "dispute" | "allocation" | "settlement" | "substitution" | "states";

const SCENES = [
  { title: "상계 묶음의 현재 노출 12를 계산합니다", detail: "거래별 시장가치와 환율을 같은 기준 시각으로 맞추고 계약상 상계 범위에 들어가는 거래만 묶습니다.", panel: "exposure", formula: "평가상 노출=12", conclusion: "평가 결과 12는 담보 계산의 입력이며 실제 이전 요구액이나 도착한 보호액과 같지 않습니다." },
  { title: "문턱 2와 기존 담보 5를 빼면 추가 호출액은 5입니다", detail: "최소이체금액·반올림·기준통화 같은 계약 조건도 적용한 뒤 상대방에게 보낼 호출 메시지를 만듭니다.", panel: "call", formula: "12−2−5=5", conclusion: "호출액은 계약식의 결과입니다. 노출 12를 그대로 요구하면 계약보다 많은 금액을 부를 수 있습니다." },
  { title: "시장가 6인 채권에 10% 할인율을 적용하면 인정 가치는 5.4입니다", detail: "할인은 가격 변동과 현금화 위험을 반영하지만 발행자·통화·만기·집중 한도와 잘못된 방향의 위험은 별도로 확인합니다.", panel: "haircut", formula: "6×(1−0.10)=5.4", conclusion: "숫자 5.4가 호출액 5보다 커도 계약상 부적격 자산이면 담보로 받을 수 없습니다." },
  { title: "상대방이 3만 인정하면 합의분과 미합의분을 나눕니다", detail: "합의분 3의 결제를 멈추지 않으면서 남은 2는 거래 누락·평가 자료·계약 조건 중 어디서 생겼는지 조사합니다.", panel: "dispute", formula: "호출 5=합의 3+분쟁 2", conclusion: "기술 장애나 자료 요청만으로 전체 호출을 자동으로 분쟁 처리하지 않고 실제 오류 근거를 구분합니다." },
  { title: "합의액을 채울 자산과 결제 계좌를 확정합니다", detail: "현금 또는 채권을 고르고 적격성·할인·집중 한도를 다시 계산한 뒤 수탁기관이 실행할 지시를 만듭니다.", panel: "allocation", formula: "합의액→자산 선택→적격성·할인→결제 지시", conclusion: "상대방이 금액에 동의한 상태와 어떤 자산을 어느 계좌로 보낼지 확정한 상태는 다릅니다." },
  { title: "결제 지시 뒤 수탁 계좌에 실제로 도착했는지 확인합니다", detail: "보낸 시각·수신 상태·실패 사유·재지시와 최종 보유잔액을 호출 식별자에 연결해 다음 날 계산에 반영합니다.", panel: "settlement", formula: "지시 전송≠자산 도착≠잔액 대사 완료", conclusion: "계산상 담보 5.4가 있어도 결제가 실패하면 실제 신용보호는 생기지 않습니다." },
  { title: "교체 자산이 먼저 결제된 뒤 기존 자산을 반환합니다", detail: "제공자가 채권을 현금으로 바꾸려면 상대방이 새 담보의 적격성과 인정 가치를 승인하고 실제 수취를 확인해야 합니다.", panel: "substitution", formula: "새 담보 수취→가치 확인→기존 담보 반환", conclusion: "기존 담보를 먼저 내보내면 새 담보 결제 실패 때 무담보 구간이 생깁니다." },
  { title: "호출부터 대사까지의 완료 상태를 한 표시로 합치지 않습니다", detail: "각 단계의 담당자·기준 시각·원본 자료·완료 증거와 미결 사유를 남겨 위험이 어느 지점에 남았는지 확인합니다.", panel: "states", formula: "호출됨≠합의됨≠배정됨≠결제됨≠대사 완료", conclusion: "담보 운영은 계산 메시지를 실제 자산 보호로 바꾸고 예외를 다음 계산 전에 해소하는 상태 관리입니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function ExposurePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="담보 호출 전 현재 노출"><Tile label="거래 평가" value="같은 시각" /><Tile label="상계 범위" value="계약 확인" /><Tile label="현재 노출" value="12" active /></div>; }
function CallPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="담보 호출액 계산"><Tile label="현재 노출" value="12" /><span className="font-mono text-xs font-black">−</span><Tile label="문턱·기존 담보" value="2+5" /><span className="font-mono text-xs font-black">=</span><Tile label="호출액" value="5" active /></div>; }
function HaircutPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="비현금 담보 할인 가치"><Tile label="채권 시장가" value="6" /><Tile label="할인율" value="10%" /><Tile label="인정 가치" value="5.4" active /></div>; }
function DisputePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="담보 호출 합의분과 분쟁분"><Tile label="전체 호출" value="5" /><Tile label="먼저 결제" value="합의 3" active /><Tile label="원인 조사" value="분쟁 2" /></div>; }
function AllocationPanel() { const items=["합의액","자산","적격성","계좌"]; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="담보 자산 배정 절차">{items.map((item,index)=><Tile key={item} label={`${index+1}단계`} value={item} active={index===items.length-1} />)}</div>; }
function SettlementPanel() { const items=["지시","수신","도착","대사"]; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="담보 결제 완료 절차">{items.map((item,index)=><Tile key={item} label={`${index+1}단계`} value={item} active={index===items.length-1} />)}</div>; }
function SubstitutionPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="담보 교체 순서"><Tile label="새 담보" value="먼저 수취" /><Tile label="가치·결제" value="확인" active /><Tile label="기존 담보" value="나중 반환" /></div>; }
function StatesPanel() { const items=["호출","합의","결제","대사"]; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="담보 운영의 별도 완료 상태">{items.map((item,index)=><Tile key={item} label={`${index+1}상태`} value={item} active={index===items.length-1} />)}</div>; }

export default function CollateralOperationsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="담보 운영 · 호출·결제·교체" title="노출 12가 호출액 5를 거쳐 실제 담보 보호가 되는 과정을 봅니다" description="계약 계산, 비현금 담보의 할인 가치, 분쟁 합의분, 자산 배정, 실제 결제와 안전한 담보 교체를 하나의 상태 흐름으로 연결합니다." note="12·2·5·6·10%는 운영 흐름을 설명하기 위한 가정입니다. 실제 금액·기한·적격 담보와 교체 조건은 적용 계약과 관할 규칙을 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-collateral-operations data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "exposure" && <ExposurePanel />}{scene.panel === "call" && <CallPanel />}{scene.panel === "haircut" && <HaircutPanel />}{scene.panel === "dispute" && <DisputePanel />}{scene.panel === "allocation" && <AllocationPanel />}{scene.panel === "settlement" && <SettlementPanel />}{scene.panel === "substitution" && <SubstitutionPanel />}{scene.panel === "states" && <StatesPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="담보 운영 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
