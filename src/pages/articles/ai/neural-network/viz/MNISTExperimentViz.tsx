import StepViz from "@/components/ui/step-viz";

const steps = [
  {
    label: "입력과 출력 모양",
    body: "이미지 B장을 B×784로 펴고, 숫자별 로짓 B×10을 만듭니다.",
  },
  {
    label: "학습 경로",
    body: "순전파→손실→역전파→최적화 순서로 가중치를 바꿉니다.",
  },
  {
    label: "검증 경로",
    body: "같은 전처리를 쓰되 가중치를 바꾸지 않고 새 자료의 결과를 잽니다.",
  },
  {
    label: "실패 원인 나누기",
    body: "학습·검증 결과의 조합과 오분류 사례를 함께 봅니다.",
  },
] as const;

export default function MNISTExperimentViz() {
  return (
    <StepViz steps={steps}>
      {(step) => (
        <div className="w-full max-w-4xl">
          {step === 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["이미지 묶음", "B×1×28×28"],
                ["펼친 입력", "B×784"],
                ["숫자별 로짓", "B×10"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className="relative rounded-xl border border-border/75 bg-background p-5"
                >
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-3 font-mono text-sm font-semibold">
                    {value}
                  </p>
                  {index < 2 && (
                    <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 bg-background px-1 text-muted-foreground sm:block">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : step === 1 ? (
            <Lane
              title="가중치를 바꾸는 학습 경로"
              items={[
                "학습 자료 묶음",
                "순전파와 손실 계산",
                "역전파로 기울기 계산",
                "최적화 단계로 가중치 수정",
              ]}
            />
          ) : step === 2 ? (
            <Lane
              title="가중치를 고정한 검증 경로"
              items={[
                "검증 자료 묶음",
                "평가 모드로 순전파",
                "손실·정확도·범주별 오류 기록",
                "오분류 이미지를 직접 확인",
              ]}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["학습·검증 모두 낮음", "입력, 정답, 학습률, 기울기 확인"],
                ["학습만 높음", "과적합, 자료 누출, 분포 차이 확인"],
                ["둘 다 높음", "새 자료 구간과 오분류 패턴으로 재검증"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border/75 bg-background p-4"
                >
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}

function Lane({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border/75 bg-background p-5">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <ol className="mt-4 grid gap-3 sm:grid-cols-4">
        {items.map((item, index) => (
          <li key={item} className="min-w-0 border-l border-border pl-3">
            <span className="text-xs font-semibold text-muted-foreground">
              {index + 1}
            </span>
            <p className="mt-1 text-xs leading-5">{item}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
