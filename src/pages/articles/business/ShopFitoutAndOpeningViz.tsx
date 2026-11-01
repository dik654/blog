import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["견적", "설비", "무매출", "분할 지급", "개업 판정", "지연", "인수"] as const;

const NOTES = [
  "기본 공사 4천만 원과 공사 기간 30일, 월세 200만 원을 설명용 가정으로 둡니다. 세금·이자·재료·보험·개업 뒤 운영자금은 아직 넣지 않습니다.",
  "벽과 바닥을 닫기 전에 전력·배기·급배수 경로를 확인합니다. 추가 작업 800만 원은 범위·금액·일정 영향·승인자를 기록한 뒤 시작합니다.",
  "공사비 4천800만 원에 손님을 받지 못한 30일의 월세 200만 원을 더하면 확인된 현금 필요액은 5천만 원입니다.",
  "공사비는 1천만·2천만·1천800만 원으로 나누되, 각 지급을 착수 합의·가려질 설비 검수·기능 시험과 인수 문서에 연결합니다. 비율은 설명용입니다.",
  "사업자등록, 업종별 시설기준, 필요한 신고·교육·건강진단·소방 조건은 서로 대신하지 않습니다. 해당 조건을 모두 확인해야 첫 주문을 받습니다.",
  "개업이 30일 더 늦고 다른 조건이 같다면 월세 200만 원이 한 번 더 나가 확인된 필요액은 5천200만 원이 됩니다. 이자와 보험 증가는 별도입니다.",
  "기능 시험, 도면·보증서, 하자 연락처, 영업 요건, 퇴거 때 남길 시설과 제거할 시설을 확인한 뒤 점포를 인수합니다.",
] as const;

type GateState = "waiting" | "checking" | "done";

const SCENES: ReadonlyArray<{
  title: string;
  detail: string;
  stage: number;
  base: number;
  extra: number;
  rent: number;
  formula: string;
  conclusion: string;
  consent: GateState;
  facility: GateState;
  opening: GateState;
}> = [
  {
    title: "4천만 원 견적과 30일 일정을 출발점으로 둡니다",
    detail: "도면과 견적은 출발점일 뿐입니다. 실제 장비가 요구하는 전력·배기·급배수와 영업 요건을 아직 확인하지 않았습니다.",
    stage: 0, base: 4_000, extra: 0, rent: 0,
    formula: "기본 공사 4,000만 원 · 예정 기간 30일",
    conclusion: "견적 금액만으로 개업 가능 상태와 필요한 현금을 확정하지 않습니다.",
    consent: "checking", facility: "waiting", opening: "waiting",
  },
  {
    title: "벽을 닫기 전에 전기·배기 800만 원을 확인합니다",
    detail: "추가 작업은 이미 끝난 마감을 뜯기 전에 찾습니다. 금액뿐 아니라 자재·승인·선행 공정이 30일 일정에 미치는 영향도 기록합니다.",
    stage: 1, base: 4_000, extra: 800, rent: 0,
    formula: "4,000 + 800 = 공사비 4,800만 원",
    conclusion: "변경 작업은 범위·금액·일정 영향·승인자가 적힌 뒤에 시작합니다.",
    consent: "done", facility: "checking", opening: "waiting",
  },
  {
    title: "손님이 없는 30일에도 월세 200만 원이 나갑니다",
    detail: "시설에 쓰는 돈과 매출 없이 지나가는 기간의 돈을 따로 적습니다. 개업 뒤 재료와 직원 급여를 낼 운영자금도 별도로 남겨야 합니다.",
    stage: 2, base: 4_000, extra: 800, rent: 200,
    formula: "4,800 + 200 = 확인된 현금 5,000만 원",
    conclusion: "공사비가 준비됐다는 말과 개업까지 버틸 현금이 있다는 말은 다릅니다.",
    consent: "done", facility: "checking", opening: "waiting",
  },
  {
    title: "지급일마다 다른 완료 증거를 받습니다",
    detail: "착수금은 허용 범위와 도면, 중도금은 가려질 배관·방수·배선, 잔금은 기능 시험과 도면·보증서 인수에 연결합니다.",
    stage: 3, base: 4_000, extra: 800, rent: 200,
    formula: "1,000 + 2,000 + 1,800 = 공사비 4,800만 원",
    conclusion: "완성 사진 한 장이 숨은 설비의 검수와 개업 허용을 대신하지 않습니다.",
    consent: "done", facility: "checking", opening: "waiting",
  },
  {
    title: "시설 완성과 문을 열 수 있는 상태를 따로 확인합니다",
    detail: "사업자등록은 세무 절차입니다. 업종별 시설기준과 신고, 교육·건강진단, 해당 점포의 소방 조건은 각각 적용 여부를 확인합니다.",
    stage: 4, base: 4_000, extra: 800, rent: 200,
    formula: "사업자등록 ≠ 시설 적합 ≠ 영업 신고·허가",
    conclusion: "필요한 행정·시설 조건이 남아 있으면 결제단말이 켜져도 첫 주문을 받지 않습니다.",
    consent: "done", facility: "done", opening: "checking",
  },
  {
    title: "한 달 지연되면 확인된 필요액은 5천200만 원입니다",
    detail: "시설은 완성돼도 신고·검사나 선행 작업이 늦으면 월세가 한 번 더 나갑니다. 지연 중 이자·보험·인건비는 이 합계 밖입니다.",
    stage: 4, base: 4_000, extra: 800, rent: 400,
    formula: "4,800 + 200 × 2개월 = 5,200만 원",
    conclusion: "개업일 변경은 공사 견적표가 아니라 현금 계획과 계약 일정에도 반영합니다.",
    consent: "done", facility: "done", opening: "checking",
  },
  {
    title: "기능·문서·영업 조건을 모두 확인한 뒤 인수합니다",
    detail: "작동 시험과 도면·보증서, 하자 접수 방법, 영업 요건, 퇴거 때의 철거 범위를 확인합니다. 그다음 시험 결제와 첫 주문 준비를 마칩니다.",
    stage: 5, base: 4_000, extra: 800, rent: 200,
    formula: "시설 인수 + 영업 조건 확인 + 운영 현금 = 개업 준비",
    conclusion: "공사 종료와 개업, 나중의 원상복구 책임은 서로 다른 완료 조건입니다.",
    consent: "done", facility: "done", opening: "done",
  },
];

const MILESTONES = ["사용 동의", "설비 확인", "벽 닫기 전", "기능 시험", "영업 확인", "첫 주문"] as const;

const GATE_LABEL: Record<GateState, string> = {
  waiting: "대기",
  checking: "확인 중",
  done: "확인",
};

function Gate({ label, state }: { label: string; state: GateState }) {
  const tone = state === "done"
    ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
    : state === "checking"
      ? "bg-amber-500/10 text-amber-800 dark:text-amber-200"
      : "bg-muted/40 text-muted-foreground";

  return (
    <div className={`flex min-w-0 items-center justify-between gap-2 px-2.5 py-2 sm:px-3 ${tone}`}>
      <span className="break-keep text-[10px] font-bold sm:text-xs">{label}</span>
      <span className="shrink-0 break-keep text-[9px] font-black sm:text-[11px]">{GATE_LABEL[state]}</span>
    </div>
  );
}

export default function ShopFitoutAndOpeningViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  const total = scene.base + scene.extra + scene.rent;

  return (
    <VizFrame
      eyebrow="공사·개업 · 설명용 가정"
      title="4천만 원 견적이 첫 주문까지 가는 과정"
      description="공사 선후관계, 지급 증거, 무매출 기간, 영업 조건을 하나의 상태 흐름에서 확인합니다."
      note="금액·기간·분할 비율은 설명용 가정입니다. 실제 비용과 인허가 조건은 계약·업종·건물·관할기관에 따라 달라집니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-shop-fitout-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>

          <div className="relative px-1" aria-label="점포 공사에서 첫 주문까지의 선후관계">
            <div className="absolute left-[8%] right-[8%] top-[9px] h-px bg-border sm:top-[11px]" aria-hidden="true" />
            <div
              className="absolute left-[8%] top-[9px] h-px bg-primary transition-[width] duration-700 motion-reduce:transition-none sm:top-[11px]"
              style={{ width: `${(scene.stage / (MILESTONES.length - 1)) * 84}%` }}
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-6 gap-1">
              {MILESTONES.map((label, index) => {
                const passed = index <= scene.stage;
                return (
                  <div key={label} className="min-w-0 text-center">
                    <span className={`mx-auto block h-[18px] w-[18px] border-2 bg-background sm:h-[22px] sm:w-[22px] ${passed ? "border-primary" : "border-border"}`} />
                    <p className={`mt-1 break-keep text-[7px] font-bold leading-3 sm:text-[10px] sm:leading-4 ${passed ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-[1.15fr_0.85fr]">
            <article className="min-w-0 border border-border bg-background p-2.5 sm:p-4">
              <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
                <p className="break-keep text-[11px] font-black sm:text-xs">확인한 필요 현금</p>
                <p className="shrink-0 font-mono text-base font-black text-primary sm:text-xl">{total.toLocaleString("ko-KR")}만 원</p>
              </div>
              <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
                {[
                  ["기본 공사", scene.base, "bg-foreground/75"],
                  ["추가 설비", scene.extra, "bg-primary/65"],
                  ["무매출 월세", scene.rent, "bg-amber-500/70"],
                ].map(([label, value, tone]) => (
                  <div key={String(label)} className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-1.5 text-[9px] sm:grid-cols-[5rem_minmax(0,1fr)_4rem] sm:gap-2 sm:text-xs">
                    <span className="break-keep font-bold">{label}</span>
                    <span className="h-3 bg-muted/50 sm:h-4">
                      <span className={`block h-full transition-[width] duration-700 motion-reduce:transition-none ${tone}`} style={{ width: `${(Number(value) / 5_200) * 100}%` }} />
                    </span>
                    <span className="break-keep text-right font-mono font-black">{Number(value).toLocaleString("ko-KR")}만</span>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 break-keep font-mono text-[9px] font-black leading-4 sm:mt-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            </article>

            <article className="min-w-0 border border-border bg-background p-2.5 sm:p-4">
              <p className="mb-2 break-keep text-[10px] font-black sm:mb-3 sm:text-xs">첫 주문 전 세 판정</p>
              <div className="divide-y divide-border border border-border">
                <Gate label="사용·공사 동의" state={scene.consent} />
                <Gate label="설비 기능·인수" state={scene.facility} />
                <Gate label="영업 요건" state={scene.opening} />
              </div>
            </article>
          </div>

          <p className="border-l border-primary pl-2.5 break-keep text-[10px] font-bold leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.conclusion}</p>
        </div>

        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="공사와 개업 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
