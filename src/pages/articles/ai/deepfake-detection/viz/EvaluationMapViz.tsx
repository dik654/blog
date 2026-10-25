import DeepfakeStageViz from "./DeepfakeStageViz";

const SCENES = [
  "원본 영상 한 건",
  "여러 파일로 파생",
  "하나의 평가 묶음",
  "묶음 단위 시험 분리",
  "조건별 오차 계산",
  "측정한 범위만 주장",
] as const;

const NOTES = [
  "설명용 원본 clip-042에는 person-C가 등장합니다. 아직 frame이나 crop 수를 독립 표본 수로 세지 않습니다.",
  "frame 추출·얼굴 crop·JPEG 재인코딩으로 파일은 늘지만 사람·배경·촬영 장비라는 원본 증거는 그대로 공유합니다.",
  "파생본을 group=(clip-042, person-C)로 되돌립니다. 실제 영상에 여러 인물이 있으면 identity 집합과 capture session까지 기록합니다.",
  "clip-042의 모든 파생본을 test에 함께 둡니다. 학습에서 가린 generator-Z와 social codec 조건도 manifest에 별도 축으로 남깁니다.",
  "Detector의 sample loss를 같은 조건끼리 평균합니다. 이 묶음은 unseen-generator·social-codec domain의 loss 0.80에 포함됩니다.",
  "말할 수 있는 결론은 선언한 test domain에서 측정한 값까지입니다. 아직 만들지 않은 미래 생성기에 대한 오류 상한은 아닙니다.",
] as const;

const STAGES = [
  { title: "원본", detail: "clip-042 · person-C" },
  { title: "파생본", detail: "frame · face crop · JPEG" },
  { title: "평가 묶음", detail: "group=(clip-042, person-C)" },
  { title: "분리", detail: "모든 파생본을 test로 함께 이동" },
  { title: "도메인", detail: "generator-Z · social codec · loss 0.80" },
  { title: "주장", detail: "측정한 조건과 아직 모르는 범위를 분리" },
] as const;

const DESKTOP_VALUES = [
  ["clip-042", "person-C"],
  ["frame-120", "face-crop", "social.jpg"],
  ["source 042", "identity C"],
  ["test", "train과 교집합 0"],
  ["generator-Z", "social codec", "loss 0.80"],
  ["관측한 domain", "미래 생성기 미확인"],
] as const;

export default function EvaluationMapViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-evaluation-map"
      eyebrow="딥페이크 평가 지도"
      title="원본 하나가 평가 주장으로 바뀌는 경로를 먼저 봅니다"
      description="재생하거나 장면을 골라 clip-042가 파생본·자료 분리·조건별 위험·주장 범위를 거치는 과정을 따라갑니다."
      note="식별자와 loss는 계산 구조를 보여 주기 위한 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <ol className="grid grid-cols-6 gap-px bg-border p-px" aria-label="원본에서 평가 주장까지의 여섯 단계">
          {STAGES.map((stage, index) => {
            const current = index === active;
            const completed = index < active;
            return (
              <li
                key={stage.title}
                aria-current={current ? "step" : undefined}
                className={`min-w-0 border-t-2 px-3 py-4 transition-colors duration-300 ${
                  current
                    ? "border-primary bg-primary/8 text-foreground"
                    : completed
                      ? "border-primary/45 bg-background text-foreground"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                <span className="font-mono text-[10px] font-black text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong className="mt-1 block break-keep text-xs leading-5">{stage.title}</strong>
                <span className="mt-3 block space-y-1 text-[11px] leading-4">
                  {DESKTOP_VALUES[index].map((value) => (
                    <span key={value} className="block break-keep">
                      {value}
                    </span>
                  ))}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </DeepfakeStageViz>
  );
}
