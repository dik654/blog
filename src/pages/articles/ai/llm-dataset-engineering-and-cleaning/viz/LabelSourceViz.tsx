import SceneShell from "./SceneShell";

/**
 * 본문 대응: #annotation — label을 붙이는 주체 네 가지. 예문, 규칙 출력, 확률은 설명용 가정이다.
 * Weak supervision은 규칙 여럿의 결합, pseudo-labeling은 모델 자신에게 돌아오는 고리가 핵심이다.
 */
const SCENES = [
  { label: "사람", summary: "human annotation", note: "사람이 직접 판단해 붙입니다. 가이드라인이 모호하면 annotator끼리 일치도가 낮아집니다.", loop: false },
  { label: "더 큰 모델", summary: "model annotation", note: "더 큰 모델이 붙입니다. 트윗 5개 task 중 4개에서 crowd-worker를 앞섰지만 다른 작업으로 일반화할 수는 없습니다.", loop: false },
  { label: "약한 규칙 여럿", summary: "weak supervision", note: "정답 label 없이 정확도가 제각각인 규칙(labeling function)의 출력을 노이즈 모델로 묶어 label을 추정합니다.", loop: false },
  { label: "학습 중인 모델 자신", summary: "pseudo-labeling", note: "모델이 가장 높은 확률을 준 class를 정답처럼 써서 supervised loss에 섞습니다. 초기 오류가 그대로 강화될 위험이 있습니다.", loop: true },
] as const;

const RULES = [
  { rule: "키워드 규칙", vote: "긍정" },
  { rule: "휴리스틱 규칙", vote: "긍정" },
  { rule: "또 다른 규칙", vote: "부정" },
];

const PROBS = [
  { name: "긍정", value: 70 },
  { name: "부정", value: 20 },
  { name: "중립", value: 10 },
];

function Down() {
  return <p aria-hidden="true" className="text-center text-sm leading-5 text-muted-foreground">↓</p>;
}

export default function LabelSourceViz() {
  return (
    <SceneShell
      eyebrow="label을 만드는 쪽"
      title="같은 문장에 label을 붙이는 주체가 네 갈래로 갈립니다"
      description="위에서 아래로 읽습니다. 예문, 규칙의 답, 확률, 나온 label은 흐름을 보이려는 가정입니다."
      ariaLabel="사람, 더 큰 모델, 약한 규칙 결합, 모델 자신이 label을 만드는 경로 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <p className="rounded-md border border-border bg-background px-3 py-2 text-center text-sm">label 없는 문장: "배송이 빨라서 좋았어요"</p>
          <Down />
          <div className="min-h-[7.25rem] rounded-md border border-blue-600 bg-blue-500/5 p-2 text-sm">
            {active === 0 && <p className="py-6 text-center font-bold">가이드라인을 읽은 사람이 판단</p>}
            {active === 1 && <p className="py-6 text-center font-bold">더 큰 모델이 사람 대신 판단</p>}
            {active === 2 && (
              <div className="space-y-1">
                {RULES.map(({ rule, vote }) => (
                  <p key={rule} className="flex justify-between gap-2 rounded border border-border bg-background px-2 py-0.5 text-xs">
                    <span>{rule}</span>
                    <strong>{vote}</strong>
                  </p>
                ))}
                <p className="pt-0.5 text-center text-xs font-bold">노이즈 모델로 결합</p>
              </div>
            )}
            {active === 3 && (
              <div className="space-y-1">
                <p className="text-center text-xs font-bold">학습 중인 모델의 예측 확률</p>
                {PROBS.map(({ name, value }, index) => (
                  <div key={name} className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
                    <span className={index === 0 ? "font-bold" : ""}>{name}</span>
                    <div className="h-3 rounded-sm bg-muted/40">
                      <div className="h-full rounded-sm" style={{ width: `${value}%`, backgroundColor: index === 0 ? "#2563eb" : "#94a3b8" }} />
                    </div>
                    <span className="text-right font-mono">0.{value / 10}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Down />
          <p className="rounded-md border border-border bg-background px-3 py-2 text-center text-sm font-bold">
            {active === 3 ? "pseudo-label: 긍정" : active === 2 ? "추정 label: 긍정" : "label: 긍정"}
          </p>
          <p className={`mt-1 text-center text-xs font-bold text-amber-700 dark:text-amber-400 ${SCENES[active].loop ? "" : "invisible"}`}>↺ loss에 섞여 모델을 바꾸고, 다시 예측에 쓰임</p>
        </div>
      )}
    />
  );
}
