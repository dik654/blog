import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";

const SCENES = [
  "원본과 사용 범위를 연결",
  "파생본을 원본까지 연결",
  "조건별 독립 원본을 계산",
  "근거가 있는 주장만 공개",
] as const;

const NOTES = [
  "clip-042와 person-C를 permission-C-r3에 연결합니다. 접근할 수 있는 파일이라는 사실만으로 사용 범위를 추정하지 않습니다.",
  "조작 영상·재인코딩·frame·crop마다 parent ID와 생성 revision을 남겨 crop-04-a1에서 원본까지 돌아갈 수 있게 합니다.",
  "Generator·codec·resolution이 같은 파일에서 source group ID 중복을 없앱니다. 파일 60개가 아니라 독립 원본 10개가 근거량입니다.",
  "사용 범위와 독립 원본 수를 함께 통과한 조건만 dataset release의 수치 주장에 넣습니다. 빈칸과 미확인 조건은 그대로 공개합니다.",
] as const;

const STAGES = [
  { title: "원본", detail: "clip-042 · person-C · permission r3" },
  { title: "파생 관계", detail: "generator → codec → frame → crop" },
  { title: "Coverage", detail: "파일 60개 → 독립 group 10개" },
  { title: "주장 범위", detail: "확인한 조건만 release에 포함" },
] as const;

export default function DatasetGovernanceMapViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-dataset-governance-map"
      eyebrow="자료 범위 지도"
      title="원본 한 건이 자료 release의 주장으로 이어지는 네 단계"
      description="같은 clip-042를 따라가며 출처·사용 범위·파생 관계·독립 원본 수가 한 주장에 어떻게 함께 들어가는지 봅니다."
      note="식별자·permission revision·파일 수·최소 근거는 설명용 가정입니다."
      scenes={SCENES}
      controlLabels={STAGES.map((stage) => stage.title)}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <ol className="grid grid-cols-4 gap-px bg-border p-px" aria-label="원본에서 자료 주장까지의 네 단계">
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
