import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";

const SCENES = [
  "원본까지 연결된 입력을 고정",
  "같은 밝기를 주파수 좌표로 바꿈",
  "같은 원본에 손상을 적용",
  "두 분기의 공동 오류를 셈",
] as const;

const NOTES = [
  "clip-042의 00:04에서 만든 crop-04-a1을 출발점으로 고정합니다. 다른 얼굴을 가져와 비교하지 않습니다.",
  "같은 밝기 배열을 반복 횟수별 막대로 바꿉니다. 변환 결과는 관측값이며 진위 label이 아닙니다.",
  "원본·JPEG·크기 변경·흐림 파생본을 같은 source ID 아래에 묶고 주파수 막대가 얼마나 남는지 다시 잽니다.",
  "같은 열 개 샘플에서 RGB와 주파수 분기의 오류 ID를 맞춘 뒤 교집합을 셉니다. 이 결과로 단서의 보완 가능성과 한계를 구분합니다.",
] as const;

const STAGES = [
  { title: "입력", detail: "clip-042 · 00:04" },
  { title: "Spectrum", detail: "반복 횟수별 크기" },
  { title: "손상", detail: "원본 파생본 4종" },
  { title: "오류", detail: "같은 샘플 교집합" },
] as const;

export default function FrequencyMapViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-frequency-map"
      eyebrow="주파수 단서 지도"
      title="입력 하나가 조건부 단서인지 확인하는 네 단계"
      description="같은 얼굴 입력을 주파수 좌표로 바꾸고, 유통 손상 뒤에도 남는지 본 다음, RGB 분기와 함께 틀린 샘플을 셉니다."
      note="입력 식별자는 앞 글과 이어지며, 수치와 판정은 검증 순서를 설명하기 위한 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <ol className="grid grid-cols-4 gap-px bg-border p-px" aria-label="주파수 단서를 확인하는 네 단계">
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
                <span className="font-mono text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
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
