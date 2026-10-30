import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["전체", "투표", "경계", "Bits", "확정", "Prune", "정지", "복귀"] as const;

const NOTES = [
  "현재 head는 attestation과 proposer boost에 따라 바뀔 수 있습니다. Finality 경로는 같은 BeaconState 안에서 epoch target 참여, justification bits, justified checkpoint와 finalized checkpoint를 따로 갱신합니다.",
  "Epoch 10 checkpoint가 이미 justified된 상태에서 validator들은 epoch 11의 target root를 지지합니다. 유효한 attestation에서 중복 validator index를 제거한 effective balance 합이 64이고 total active balance는 96이라고 둡니다.",
  "Prysm과 consensus spec은 부동소수점 2/3를 계산하지 않습니다. 3×64=192와 2×96=192를 비교하므로 정확히 경계를 통과합니다. 63이면 189<192라 통과하지 못합니다.",
  "기존 최근 history가 0001이라면 한 칸 옮긴 결과는 0010입니다. 현재 epoch target이 경계를 통과했으므로 bit 0을 켜 0011이 됩니다. 이 네 bit는 최근 justification history입니다.",
  "Current epoch는 11이고 갱신 전 current justified checkpoint는 epoch 10입니다. Bits 0과 1이 모두 1이며 10+1=11이므로 마지막 finalization pattern이 epoch 10 checkpoint를 finalized로 올립니다. 새 current justified checkpoint는 epoch 11입니다.",
  "Block post-state의 더 높은 finalized checkpoint가 fork-choice에 들어오면 Prysm은 그 root와 충돌하는 후보 node를 제거하고 finalized node를 tree root로 옮깁니다. 이는 fork-choice 후보 정리이며 block archive 전체 삭제가 아닙니다.",
  "참여가 63/96이면 새 target justification bit가 켜지지 않아 이 사례의 새 finality도 생기지 않습니다. Head 선택은 계속 움직일 수 있지만 finalized checkpoint는 그대로입니다. Safety를 깨뜨린 것이 아니라 새 finality의 liveness가 멈춘 상태입니다.",
  "오래 offline이던 node는 recent checkpoint를 별도 신뢰 경로로 받습니다. Prysm verifier는 local DB에 그 block이 있고 finalized이며 지정한 epoch 구간에 들어가는지 확인한 뒤에만 검증 완료 상태를 기록합니다.",
] as const;

const RECEIPTS = [
  "head ≠ justified checkpoint ≠ finalized checkpoint",
  "epoch 11 target · unique unslashed balance 64 / active 96",
  "3×64 = 192 · 2×96 = 192 · threshold 통과",
  "0001 → shift 0010 → current target 0011",
  "current justified epoch 11 · finalized epoch 10",
  "finalized root와 충돌하는 fork-choice 후보 제거",
  "63/96 → 새 justification 없음 · finalized epoch 10 유지",
  "block 존재 + finalized + epoch 일치 → weak-subjectivity 검증 완료",
] as const;

function StateCell({
  label,
  value,
  detail,
  active,
}: {
  label: string;
  value: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <div className={`min-w-0 bg-background p-2.5 sm:p-3 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
      <span className="block text-[8px] font-bold text-muted-foreground sm:text-[9px]">{label}</span>
      <strong className={`mt-1 block break-keep text-[10px] leading-4 sm:text-xs ${active ? "text-primary" : ""}`}>{value}</strong>
      <span className="mt-1 block break-keep text-[8px] leading-3 text-muted-foreground sm:text-[9px] sm:leading-4">{detail}</span>
    </div>
  );
}

function FinalityMap({ active }: { active: number }) {
  const thresholdPassed = active >= 2 && active <= 5;
  const stopped = active === 6;
  const finalized = active >= 4 && active !== 6;

  return (
    <div aria-label="epoch 11 참여가 epoch 10 checkpoint finality와 fork-choice prune로 이어지는 상태 지도">
      <div className="grid grid-cols-3 gap-px bg-border p-px">
        <StateCell label="이전 경계" value="epoch 9" detail="history에 남음" />
        <StateCell label="기존 justified" value="epoch 10" detail={finalized ? "finalized로 이동" : "갱신 전 current"} active={active === 4} />
        <StateCell label="현재 target" value="epoch 11" detail={thresholdPassed ? "새 current justified" : stopped ? "63/96 · 미달" : "64/96 votes"} active={active === 1 || active === 2} />
      </div>

      <div className="mt-px grid grid-cols-3 gap-px bg-border p-px">
        <StateCell
          label="Participation"
          value={stopped ? "63 / 96" : active >= 1 ? "64 / 96" : "target balance"}
          detail={active >= 2 ? (stopped ? "189 < 192" : "192 ≥ 192") : "unique validator balance"}
          active={active === 1 || active === 2 || active === 6}
        />
        <StateCell
          label="Justification bits"
          value={active >= 3 && !stopped ? "0011" : stopped ? "0010" : "0001"}
          detail={active >= 3 ? (stopped ? "current bit 꺼짐" : "shift 뒤 bit 0 켬") : "최근 epoch history"}
          active={active === 3}
        />
        <StateCell
          label="Checkpoint state"
          value={finalized ? "J=11 · F=10" : "J=10 · F≤9"}
          detail={active === 4 ? "old current를 finalize" : stopped ? "새 finality 없음" : "epoch transition 전"}
          active={active === 4 || active === 6}
        />
      </div>

      <div className="mt-px grid grid-cols-2 gap-px bg-border p-px">
        <StateCell
          label="Fork-choice store"
          value={active >= 5 && active !== 6 ? "epoch 10 root로 prune" : "여러 후보 유지"}
          detail={active >= 5 && active !== 6 ? "충돌 node 제거 · archive 별도" : "head는 계속 바뀔 수 있음"}
          active={active === 5}
        />
        <StateCell
          label="Offline node"
          value={active === 7 ? "checkpoint 검증 완료" : "recent anchor 필요"}
          detail={active === 7 ? "block · finalized · epoch 일치" : "chain data만으로 시작하지 않음"}
          active={active === 7}
        />
      </div>
    </div>
  );
}

export default function PrysmFinalityFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="개념 경로 · Fulu epoch transition"
      title="64/96 target participation이 epoch 11을 justify하고 epoch 10을 finalize합니다"
      description="Prysm v7.3.1이 participation, four-bit history, checkpoint와 fork-choice store를 바꾸는 순서를 한 상태 지도에서 추적합니다."
      note="Epoch 번호와 64/96 balance는 설명용입니다. 판정식, bit pattern, 함수 순서와 failure 조건은 고정한 consensus-specs·Prysm source에서 확인했습니다. 처리 지연은 측정하지 않았습니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-prysm-finality-scene={active}
        tabIndex={0}
        role="group"
        aria-label="epoch target vote가 justification과 finality를 만드는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="scroll-mt-20 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="overflow-x-auto" aria-label="Finality의 여덟 장면">
          <div className="grid min-w-[352px] grid-cols-8 gap-px bg-border p-px lg:min-w-0">
            {SCENES.map((scene, index) => (
              <button
                type="button"
                key={scene}
                aria-pressed={index === active}
                onClick={() => scenes.setActive(index)}
                className={`min-h-11 min-w-11 bg-background px-0.5 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:min-w-0 lg:py-2 ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}
              >
                <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 sm:mt-3">
          <FinalityMap active={active} />
        </div>

        <div className="mt-2 grid min-h-[6.75rem] grid-cols-[0.62fr_1.38fr] gap-px bg-border p-px sm:mt-3 sm:min-h-[7.5rem]">
          <div className="min-h-[6.25rem] min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">현재 장면</span>
            <strong className="mt-1 block break-keep text-xs leading-5 sm:text-sm">{SCENES[active]}</strong>
          </div>
          <div className="min-h-[6.25rem] min-w-0 bg-background p-3">
            <span className="text-[9px] font-bold text-muted-foreground sm:text-[10px]">상태 변화</span>
            <strong className="mt-1 block break-keep text-[10px] leading-4 text-primary sm:text-sm sm:leading-5">{RECEIPTS[active]}</strong>
          </div>
        </div>

        <p data-scene-note className="mt-1 min-h-[8.25rem] border-l-2 border-primary/50 pl-3 text-[11px] leading-[1.125rem] text-muted-foreground sm:mt-3 sm:min-h-[7.5rem] sm:pl-4 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
