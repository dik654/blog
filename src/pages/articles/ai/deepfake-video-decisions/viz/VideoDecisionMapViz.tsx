import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";

const SCENES = [
  "평가할 열 개 시각을 고정",
  "유효한 여섯 입력의 점수를 모음",
  "점수를 합치는 규칙을 고정",
  "점수와 증거량을 함께 판정",
] as const;

const NOTES = [
  "앞 글의 clip-042와 같은 00:00–00:09 평가 시각을 사용합니다. 모델마다 편한 프레임을 새로 고르지 않습니다.",
  "전처리를 통과한 crop 여섯 개만 점수를 냅니다. 실패한 네 시각은 사라지지 않고 coverage 분모에 남습니다.",
  "평균·최댓값·상위 두 개 평균 가운데 하나를 검증 전에 정합니다. 같은 프레임 점수도 규칙에 따라 영상 점수가 달라집니다.",
  "집계 점수를 보정한 뒤 임계값과 비교하되, 먼저 최소 coverage를 만족하는지 확인합니다. 증거가 부족하면 진위 대신 별도 상태를 냅니다.",
] as const;

const STAGES = [
  { title: "평가 시각", detail: "후보 10개" },
  { title: "프레임 점수", detail: "유효 입력 6개" },
  { title: "집계", detail: "평균·최댓값·상위 2개" },
  { title: "판정", detail: "보정·임계값·coverage" },
] as const;

export default function VideoDecisionMapViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-video-decision-map"
      eyebrow="영상 판정 지도"
      title="열 개 시각을 영상 행동 하나로 바꾸는 네 단계"
      description="같은 원본 시각과 전처리 영수증을 유지한 채 점수를 모으고, 집계 규칙과 증거량을 함께 확인합니다."
      note="clip-042의 점수·보정값·임계값은 판정 순서를 설명하기 위한 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <ol className="grid grid-cols-4 gap-px bg-border p-px" aria-label="영상 판정을 만드는 네 단계">
          {STAGES.map((stage, index) => {
            const current = active === index;
            const reached = active >= index;
            return (
              <li
                key={stage.title}
                aria-current={current ? "step" : undefined}
                className={`min-w-0 border-t-2 px-3 py-4 ${
                  current
                    ? "border-primary bg-primary/8 text-foreground"
                    : reached
                      ? "border-primary/40 bg-background text-foreground"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                <span className="font-mono text-[10px] font-black text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong className="mt-1 block break-keep text-xs leading-5">{stage.title}</strong>
                <span className="mt-3 block break-keep text-[11px] leading-5 text-muted-foreground">
                  {reached ? stage.detail : "아직 확인하지 않음"}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </DeepfakeStageViz>
  );
}
