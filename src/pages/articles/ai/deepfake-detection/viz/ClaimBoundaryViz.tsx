import DeepfakeStageViz from "./DeepfakeStageViz";

const SCENES = [
  "가린 축을 따로 기록",
  "조건과 표본 수를 붙임",
  "검증 문장을 완성",
  "미래 조건은 미확인으로 남김",
] as const;

const NOTES = [
  "Unseen identity·generator·distribution path는 서로 다른 질문입니다. 한 축을 가렸다는 사실로 나머지 축까지 처음 본 조건이었다고 쓰지 않습니다.",
  "이 사례는 person-C, generator-Z, social codec으로 구성한 독립 원본 10개에서 mean loss 0.80을 측정했습니다. support가 빠지면 값의 불확실성을 판단할 수 없습니다.",
  "검증 문장은 대상·가린 축·변환 경로·표본 수·metric을 함께 적습니다. ‘범용 딥페이크 탐지’처럼 실험보다 넓은 이름을 붙이지 않습니다.",
  "현재 평가표에 없는 미래 생성기는 unknown future domain입니다. 새 자료가 들어오면 새 domain row로 측정할 문제이지 기존 최댓값의 보장 범위가 아닙니다.",
] as const;

const STAGES = [
  { title: "가린 축", detail: "identity · generator · codec을 분리" },
  { title: "측정 근거", detail: "독립 원본 10개 · mean loss 0.80" },
  { title: "검증 문장", detail: "무엇을 어디까지 확인했는지 한 문장으로" },
  { title: "남은 범위", detail: "미래 생성기는 아직 미확인" },
] as const;

const AXES = [
  { name: "Identity", value: "person-C", state: "학습에서 제외" },
  { name: "Generator", value: "generator-Z", state: "학습에서 제외" },
  { name: "Distribution", value: "social codec", state: "시험에서 적용" },
  { name: "Future", value: "아직 없는 생성기", state: "미확인" },
] as const;

export default function ClaimBoundaryViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-claim-boundary"
      eyebrow="주장 범위"
      title="Unseen 뒤에 실제로 가린 조건을 붙입니다"
      description="가린 축과 측정 근거를 분리한 뒤, 검증한 문장과 아직 말할 수 없는 범위를 나란히 둡니다."
      note="조건과 측정값은 앞 장면의 설명용 사례를 이어갑니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <div>
          <div className="grid grid-cols-4 gap-px bg-border p-px">
            {AXES.map((axis, index) => {
              const unknown = index === 3;
              const highlighted = active === 0 || (active >= 3 && unknown);
              return (
                <div key={axis.name} className={`min-w-0 px-3 py-4 ${highlighted ? "bg-primary/8" : "bg-background"}`}>
                  <span className="text-[10px] font-black text-primary">{axis.name}</span>
                  <strong className="mt-2 block break-keep text-xs leading-5">{axis.value}</strong>
                  <span className={`mt-2 block break-keep text-[11px] leading-4 ${unknown ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground"}`}>
                    {axis.state}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 border-l-2 border-primary/50 pl-4">
            <p className="text-[11px] font-bold text-muted-foreground">검증한 문장</p>
            <p className={`mt-2 break-keep text-sm font-bold leading-6 ${active >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
              {active >= 2
                ? "학습에서 제외한 person-C·generator-Z와 social codec 조건의 독립 원본 10개에서 mean loss 0.80을 측정했습니다."
                : active >= 1
                  ? "독립 원본 10개 · mean loss 0.80 · 조건을 붙이는 중"
                  : "먼저 어떤 축을 가렸는지 확인합니다."}
            </p>
            {active >= 3 ? (
              <p className="mt-3 break-keep text-xs font-semibold leading-5 text-amber-700 dark:text-amber-300">
                아직 말할 수 없음 · 이후 등장할 모든 생성기의 오류 상한
              </p>
            ) : null}
          </div>
        </div>
      )}
    </DeepfakeStageViz>
  );
}
