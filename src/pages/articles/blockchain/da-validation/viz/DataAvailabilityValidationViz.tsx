import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["고정", "기준선", "숨김", "잘못된 조각", "재시작", "Rollback", "결정"] as const;
const NOTES = [
  "프로토콜·fork, 인코딩 크기, commitment setup, custody·peer 선택, 응답 마감과 실행 환경을 한 manifest에 고정합니다.",
  "같은 D0~D3에서 만든 유효 조각 여덟 개를 base와 candidate에 넣습니다. 네 표본의 증거와 원본 복원이 모두 통과하는 receipt를 기준선으로 남깁니다.",
  "복원에 필요한 조각보다 많이 숨기거나 응답을 마감 뒤로 늦춥니다. Candidate가 proof 성공만 보고 AVAILABLE로 판정하면 기각합니다.",
  "값, 조각 번호, KZG·Merkle proof 또는 parity 중 하나씩만 바꿉니다. 진위 실패와 인코딩 실패가 같은 성공 결과로 합쳐지면 원인을 추적할 수 없습니다.",
  "Custody 저장 직후와 표본 요청 중간에 process를 중단합니다. 재시작 뒤 중복 receipt, 잃어버린 custody, 오래된 peer view 없이 같은 결과를 내야 합니다.",
  "Candidate를 격리하고 binary·config·setup·layout을 기준선 digest로 되돌립니다. 정상·숨김·잘못된 조각·재시작 fixture가 다시 같은 결과를 내야 복구가 끝납니다.",
  "정합성, 자원 경계, restart와 rollback이 모두 같을 때만 bandwidth·CPU·memory·p95를 비교합니다. 실측이 없으면 상태는 proposed로 남깁니다.",
] as const;

const GATES = [
  ["MANIFEST", "version·layout·deadline"],
  ["BASELINE", "proof·sample·reconstruct"],
  ["WITHHOLD", "missing·timeout"],
  ["CORRUPT", "value·index·proof"],
  ["RESTART", "custody·receipt"],
  ["ROLLBACK", "baseline replay"],
  ["ADR", "adopt·reject"],
] as const;

export default function DataAvailabilityValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10000, { loop: false });
  const active = scenes.active;
  const warning = active === 2 || active === 3;

  return (
    <VizFrame
      eyebrow="실무 경로 · 데이터 가용성 변경 검증"
      title="같은 조각을 재생해 판정·복원·되돌리기를 함께 비교합니다"
      description="성공 fixture보다 숨김, 잘못된 조각, 재시작과 rollback에서 base와 candidate가 같은 결과를 내는지가 먼저입니다."
      note="격리한 test node용 계획입니다. 대상 환경의 bandwidth·CPU·복구 시간은 아직 측정하지 않았습니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-da-validation-scene={active}
        tabIndex={0}
        role="group"
        aria-label="데이터 가용성 변경을 입력 고정부터 장애와 rollback까지 검증하는 일곱 단계"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-7 gap-px bg-border p-px">
          {GATES.map(([title], index) => (
            <div key={title} className={`min-w-0 bg-background py-2 text-center ${index === active ? warning ? "text-amber-700 dark:text-amber-300" : "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 hidden break-keep text-[8px] leading-3 sm:block lg:text-[9px]">{title}</strong>
            </div>
          ))}
        </div>

        <section className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2 border border-border bg-background p-3 sm:min-h-[11rem] sm:gap-3 sm:p-4">
          <div className="min-w-0 border border-border p-2 sm:p-3">
            <span className="font-mono text-[9px] font-black text-muted-foreground">BASE</span>
            <strong className="mt-2 block break-keep text-xs sm:text-sm">고정한 기준 구현</strong>
            <span className="mt-2 block break-keep text-[9px] leading-4 text-muted-foreground sm:text-[10px]">D0~D3 · encoded 8 · receipt</span>
            <span className="mt-2 block break-keep text-[10px] font-bold text-primary">expected outcome</span>
          </div>
          <div className="flex items-center text-center font-mono text-[10px] font-black text-primary">{active === 5 ? "복구" : "대조"}</div>
          <div className={`min-w-0 border p-2 sm:p-3 ${warning ? "border-amber-500/70" : "border-primary/45"}`}>
            <span className="font-mono text-[9px] font-black text-muted-foreground">CANDIDATE</span>
            <strong className="mt-2 block break-keep text-xs sm:text-sm">
              {active < 2 ? "같은 입력 독립 실행" : active < 4 ? "장애 판정 확인" : active === 4 ? "재시작·상태 복구" : active === 5 ? "기준선으로 rollback" : "채택 조건 판정"}
            </strong>
            <span className="mt-2 block break-keep text-[9px] leading-4 text-muted-foreground sm:text-[10px]">{GATES[active][1]}</span>
            <span className={`mt-2 block break-keep text-[10px] font-bold ${warning ? "text-amber-700 dark:text-amber-300" : "text-primary"}`}>{active < 2 ? "receipt 수집 중" : active < 4 ? "잘못된 AVAILABLE 금지" : active === 4 ? "중복·custody gap 금지" : active === 5 ? "전체 fixture 재통과" : "proposed 또는 rejected"}</span>
          </div>
        </section>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["고정", "정상", "숨김", "오염", "재시작", "복구", "결정"]}
          playLabel="검증 절차 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
