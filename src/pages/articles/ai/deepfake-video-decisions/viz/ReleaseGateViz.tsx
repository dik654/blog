import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import { VIDEO_DECISION_TRACE } from "../trace";

const SCENES = [
  "유효 입력 수와 coverage를 읽음",
  "고정한 집계 규칙으로 원점수를 만듦",
  "검증 자료에서 맞춘 보정값을 적용",
  "증거량 문턱에서 최종 행동을 결정",
] as const;

const NOTES = [
  "후보 시각 열 개 중 유효 crop은 여섯 개여서 coverage는 0.60입니다. 실패한 네 시각을 0점으로 바꾸지 않습니다.",
  "상위 두 개 평균은 0.79입니다. 이 값은 여섯 프레임 점수를 합친 원점수이지 바로 확률이나 최종 판정이 아닙니다.",
  "같은 집계 규칙으로 만든 별도 검증 자료에서 보정한 결과를 0.72라고 가정합니다. 보정 뒤 임계값 0.70은 넘습니다.",
  "하지만 최소 coverage 0.70보다 실제 0.60이 작습니다. 높은 점수를 진위 판정으로 내보내지 않고 ‘증거 부족’ 상태를 반환합니다.",
] as const;

const STAGES = [
  { title: "증거량", detail: "6 / 10 = 0.60" },
  { title: "원점수", detail: "상위 2개 평균 0.79" },
  { title: "보정", detail: "0.72 · 임계값 0.70" },
  { title: "행동", detail: "증거 부족" },
] as const;

function GateRow({ label, value, active, failed }: { label: string; value: string; active: boolean; failed?: boolean }) {
  return (
    <div className={`grid grid-cols-[8rem_minmax(0,1fr)] gap-px bg-border p-px transition-opacity ${active ? "opacity-100" : "opacity-20"}`}>
      <strong className="bg-background px-3 py-3 text-[10px]">{label}</strong>
      <span className={`bg-background px-3 py-3 font-mono text-xs font-bold ${failed ? "text-destructive" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

export default function ReleaseGateViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-video-release"
      eyebrow="최종 판정"
      title="점수는 높지만 이 영상의 답은 ‘증거 부족’입니다"
      description="점수 경로와 증거량 경로를 따로 계산한 뒤 둘 다 계약을 만족할 때만 진위 판정을 내보냅니다."
      note="보정값 0.72와 두 임계값은 판정 순서를 설명하기 위한 가정이며 실제 배포 기준이 아닙니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <div className="space-y-2">
          <GateRow label="coverage" value={`${VIDEO_DECISION_TRACE.validCount} / ${VIDEO_DECISION_TRACE.candidateCount} = ${VIDEO_DECISION_TRACE.coverage.toFixed(2)}`} active={active >= 0} failed={active >= 3} />
          <GateRow label="집계 원점수" value={VIDEO_DECISION_TRACE.top2.toFixed(2)} active={active >= 1} />
          <GateRow label="보정값" value={`${VIDEO_DECISION_TRACE.calibratedTop2.toFixed(2)} ≥ ${VIDEO_DECISION_TRACE.scoreThreshold.toFixed(2)}`} active={active >= 2} />
          <GateRow label="증거량 문턱" value={`${VIDEO_DECISION_TRACE.coverage.toFixed(2)} < ${VIDEO_DECISION_TRACE.minimumCoverage.toFixed(2)} → 증거 부족`} active={active >= 3} failed={active >= 3} />
        </div>
      )}
    </DeepfakeStageViz>
  );
}
