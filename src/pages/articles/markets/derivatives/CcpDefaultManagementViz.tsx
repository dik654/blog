import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["부도 절차", "계정 분리", "위험 측정", "임시 헤지", "경매 묶음", "입찰", "이전", "손실·복구"] as const;

const NOTES = [
  "청산회원이 의무를 이행하지 못하면 CCP는 공개된 규칙과 권한에 따라 부도 절차를 열고 지급·포지션·접근 권한을 통제합니다.",
  "회원 고유 포트폴리오와 고객 포지션·관련 담보를 구분합니다. 고객계정은 받을 회원, 계정 구조와 법률·운영 조건을 충족할 때만 이전할 수 있습니다.",
  "교육용 사례에서 부도 회원 고유 포트폴리오의 금리 민감도는 1bp당 +80입니다. 실제 CCP는 통화·곡선·변동성·비선형 위험을 여러 축으로 봅니다.",
  "경매 전 임시 헤지 −60을 더하면 단순 잔여 민감도는 +20입니다. 5bp 불리한 움직임의 선형 손익은 20×5=100입니다.",
  "CCP는 유사한 위험과 유동성을 가진 포지션을 참가자가 이해하고 가격을 낼 수 있는 경매 묶음으로 나눕니다.",
  "같은 법률·운영 조건을 충족한다는 가정에서 비용 4·6·9의 입찰 중 4가 경제적으로 가장 유리합니다. 가격 하나만으로 낙찰을 확정한다는 뜻은 아닙니다.",
  "낙찰 포지션을 비부도 회원에게 이전하고 임시 헤지의 종료·유지를 조정한 뒤 CCP 장부가 다시 균형을 이루는지 확인합니다.",
  "실현 손실은 CCP 규칙이 정한 재원 순서로 처리하고 사용한 재원을 보충합니다. 참가자와 함께 절차를 적어도 매년 시험하고 중요한 변경 뒤 다시 검토합니다.",
] as const;

type Panel = "declare" | "accounts" | "measure" | "hedge" | "lots" | "bids" | "transfer" | "resources";

const SCENES = [
  { title: "회원 부도 선언이 정해진 권한과 통제 절차를 엽니다", detail: "CCP는 지급 실패와 규칙상 부도 사유를 확인하고, 누가 어떤 포지션·담보·지시를 바꿀 수 있는지 통제합니다.", panel: "declare", formula: "부도 사유 확인→절차 개시→권한·장부 통제", conclusion: "자동 경보 하나가 임의로 회원 포지션을 처분하는 것이 아니라 규칙과 지배구조가 행동 권한을 정합니다." },
  { title: "회원 고유 장부와 고객 장부를 먼저 분리합니다", detail: "고객 포지션·담보는 다른 회원에게 옮길 수 있는지 확인하고, 회원 고유 포트폴리오는 헤지와 경매 대상으로 준비합니다.", panel: "accounts", formula: "부도 회원 장부=고유 포트폴리오+고객계정", conclusion: "고객 포지션 이전과 회원 고유 포트폴리오 경매는 대상·법률 조건·수취 주체가 다른 절차입니다." },
  { title: "회원 고유 포트폴리오의 금리 민감도 +80을 확인합니다", detail: "교육용으로 금리가 1bp 움직일 때 손익이 80만큼 변하는 단일 민감도만 놓습니다. 실제 장부는 여러 위험축을 함께 봅니다.", panel: "measure", formula: "초기 금리 민감도=+80 / 1bp", conclusion: "포지션 명목만 합치지 않고 시장 움직임이 손실로 바뀌는 위험 단위를 경매 전 기준시점에 계산합니다." },
  { title: "임시 헤지 −60을 더해 잔여 민감도를 +20으로 낮춥니다", detail: "전부 없애려다 시장을 크게 움직이지 않도록 속도·시장 깊이·정보 노출과 경매 가능성을 함께 봅니다.", panel: "hedge", formula: "+80−60=+20 · 5bp 충격=20×5=100", conclusion: "헤지를 많이 할수록 항상 안전한 것은 아니며 새 베이시스·유동성 위험과 실행 비용도 기록해야 합니다." },
  { title: "남은 포지션을 이해하고 가격을 낼 수 있는 묶음으로 나눕니다", detail: "통화·상품·만기·민감도와 유동성을 기준으로 자료 범위와 경매 단위를 정하고 적격 참가자에게 제공합니다.", panel: "lots", formula: "부도 포트폴리오→금리 묶음·통화 묶음·기타 위험", conclusion: "너무 큰 묶음은 참여자를 줄이고 너무 잘게 나누면 잔여 위험과 실행 복잡성이 커질 수 있습니다." },
  { title: "같은 조건을 충족한 입찰 4·6·9를 비교합니다", detail: "법률상 인수 가능성, 신용·운영 한도와 제출 요건이 같다는 교육용 가정에서 CCP가 부담할 비용이 가장 낮은 4를 고릅니다.", panel: "bids", formula: "적격 입찰 {4,6,9}→최저 비용 4", conclusion: "최저 숫자가 제출됐다는 사실만으로 낙찰하지 않고 입찰 유효성·이해상충·결제 가능성과 승인 기록을 함께 확인합니다." },
  { title: "낙찰 포지션을 이전하고 CCP 장부의 균형을 다시 확인합니다", detail: "비부도 회원이 포지션을 인수하면 관련 장부를 갱신하고 임시 헤지를 유지·종료하며 남은 민감도와 현금흐름을 다시 계산합니다.", panel: "transfer", formula: "낙찰 확정→포지션 이전→헤지 조정→균형 장부", conclusion: "경매 결과 화면과 실제 계약·청산 장부의 이전 완료는 다른 상태이므로 사후 대사가 필요합니다." },
  { title: "실현 손실을 규칙 순서로 처리하고 사용한 재원을 보충합니다", detail: "부도 회원의 증거금과 재원부터 시작하되 정확한 순서는 CCP 규칙집을 따릅니다. 부족분과 유동성 압력, 재원 보충을 기록합니다.", panel: "resources", formula: "실현 손실→규칙상 재원→보충→절차 재시험", conclusion: "경매 성공은 끝이 아니라 손실·고객 이전·유동성·집중 위험을 대사하고 참가자와 복구 절차를 다시 시험하는 출발점입니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function DeclarePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="CCP 회원 부도 절차 개시"><Tile label="사건" value="회원 의무 불이행" /><Tile label="판단" value="규칙상 부도" active /><Tile label="즉시 통제" value="권한·지시·장부" /></div>; }
function AccountsPanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="부도 회원 고유 장부와 고객 장부"><Tile label="회원 고유 포트폴리오" value="헤지·경매 준비" active /><Tile label="고객 포지션·담보" value="이전 가능성 확인" /></div>; }
function MeasurePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="부도 포트폴리오 위험 측정"><Tile label="기준 움직임" value="금리 1bp" /><Tile label="방향" value="금리 상승 노출" /><Tile label="민감도" value="손익 +80" active /></div>; }
function HedgePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="CCP 임시 헤지 뒤 잔여 위험"><Tile label="초기" value="+80" /><Tile label="임시 헤지" value="−60" /><Tile label="잔여" value="+20" active /></div>; }
function LotsPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="부도 포트폴리오 경매 묶음"><Tile label="금리 묶음" value="통화·만기" active /><Tile label="외환 묶음" value="통화쌍" /><Tile label="기타 묶음" value="비선형 위험" /></div>; }
function BidsPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="CCP 부도 경매 입찰"><Tile label="입찰 A" value="비용 4" active /><Tile label="입찰 B" value="비용 6" /><Tile label="입찰 C" value="비용 9" /></div>; }
function TransferPanel() { const items=[["1","낙찰"],["2","포지션 이전"],["3","헤지 조정"],["4","장부 대사"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="부도 경매 뒤 장부 복구">{items.map(([number,value],index)=><Tile key={number} label={`${number}단계`} value={value} active={index===3} />)}</div>; }
function ResourcesPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="CCP 부도 손실 재원과 복구"><Tile label="손실 처리" value="규칙상 순서" /><Tile label="재원 상태" value="사용분 보충" active /><Tile label="복구 확인" value="대사·연습" /></div>; }

export default function CcpDefaultManagementViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="CCP 부도관리 · 선언에서 복구까지" title="+80 포트폴리오를 헤지·경매하고 고객계정과 손실재원을 따로 처리합니다" description="회원 부도 절차를 연 뒤 고유·고객 장부를 나누고, 위험 측정·임시 헤지·경매 묶음·입찰·포지션 이전·손실 처리와 재원 보충까지 추적합니다." note="+80·−60·+20과 입찰 비용 4·6·9는 순서를 보여 주는 교육용 가정입니다. 실제 권한, 헤지·경매 방식과 손실 재원 순서는 해당 CCP 규칙집과 적용 법률을 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-ccp-default-management data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "declare" && <DeclarePanel />}{scene.panel === "accounts" && <AccountsPanel />}{scene.panel === "measure" && <MeasurePanel />}{scene.panel === "hedge" && <HedgePanel />}{scene.panel === "lots" && <LotsPanel />}{scene.panel === "bids" && <BidsPanel />}{scene.panel === "transfer" && <TransferPanel />}{scene.panel === "resources" && <ResourcesPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="CCP 부도관리 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
