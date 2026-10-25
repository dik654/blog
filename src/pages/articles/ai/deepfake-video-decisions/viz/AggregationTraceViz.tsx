import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import {
  SORTED_VIDEO_FRAME_SCORES,
  VIDEO_DECISION_TRACE,
  VIDEO_FRAME_SCORES,
} from "../trace";

const SCENES = [
  "유효한 여섯 점수를 같은 장부에 놓음",
  "큰 점수부터 순서를 맞춤",
  "상위 두 개만 선택",
  "세 집계 결과를 나란히 계산",
] as const;

const NOTES = [
  "00:00·00:01·00:03·00:04·00:06·00:09에서 나온 여섯 점수입니다. 전처리에 실패한 네 시각에는 임의 점수를 채우지 않습니다.",
  "상위 k개 평균을 계산하려고 값만 큰 순서로 놓습니다. 원래 timestamp와 crop ID는 각 값에 계속 붙어 있습니다.",
  "0.82와 0.76을 선택합니다. 하나의 순간만 보는 최댓값과 전체를 희석하는 평균 사이의 규칙입니다.",
  "평균은 0.395, 최댓값은 0.82, 상위 두 개 평균은 0.79입니다. 같은 모델 출력에서 집계 규칙만 바꿔도 영상 점수가 달라집니다.",
] as const;

const STAGES = [
  { title: "점수", detail: "6개" },
  { title: "정렬", detail: "0.82 → 0.12" },
  { title: "선택", detail: "0.82 · 0.76" },
  { title: "계산", detail: "0.395 · 0.82 · 0.79" },
] as const;

function ScoreCells({ active }: { active: number }) {
  const rows = active >= 1 ? SORTED_VIDEO_FRAME_SCORES : VIDEO_FRAME_SCORES;

  return (
    <div className="grid grid-cols-6 gap-px bg-border p-px" aria-label="clip-042의 유효 프레임 점수">
      {rows.map((row, index) => {
        const selected = active >= 2 && index < 2;
        return (
          <div
            key={row.cropId}
            className={`min-w-0 border-t-2 px-2 py-3 ${
              selected ? "border-primary bg-primary/8" : "border-border bg-background"
            }`}
          >
            <span className="block truncate font-mono text-[9px] text-muted-foreground">{row.timestamp}</span>
            <strong className="mt-1 block font-mono text-sm">{row.score.toFixed(2)}</strong>
          </div>
        );
      })}
    </div>
  );
}

export default function AggregationTraceViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-video-aggregation"
      eyebrow="점수 집계"
      title="같은 여섯 점수가 세 영상 점수로 갈라집니다"
      description="점수 장부를 정렬하고 상위 두 개를 고른 뒤 평균·최댓값·상위 두 개 평균을 같은 입력에서 계산합니다."
      note="모든 수치는 clip-042의 판정 흐름을 설명하기 위한 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <div className="space-y-4">
          <ScoreCells active={active} />
          <div className={`grid grid-cols-3 gap-px bg-border p-px transition-opacity ${active >= 3 ? "opacity-100" : "opacity-20"}`}>
            <div className="bg-background px-3 py-3">
              <span className="block break-keep text-[10px] text-muted-foreground">전체 평균</span>
              <strong className="mt-1 block font-mono text-sm">{VIDEO_DECISION_TRACE.mean.toFixed(3)}</strong>
            </div>
            <div className="bg-background px-3 py-3">
              <span className="block break-keep text-[10px] text-muted-foreground">최댓값</span>
              <strong className="mt-1 block font-mono text-sm">{VIDEO_DECISION_TRACE.max.toFixed(2)}</strong>
            </div>
            <div className="bg-background px-3 py-3">
              <span className="block break-keep text-[10px] text-muted-foreground">상위 2개 평균</span>
              <strong className="mt-1 block font-mono text-sm text-primary">{VIDEO_DECISION_TRACE.top2.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      )}
    </DeepfakeStageViz>
  );
}
