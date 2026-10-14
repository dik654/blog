import StepViz from "@/components/ui/step-viz";

const steps = [
  { label: "입력 묶기", body: "XOR 네 상태를 4×2 행렬 X로 쌓습니다." },
  { label: "은닉 점수", body: "X(4×2)와 W₁(2×2)을 곱해 Z₁(4×2)을 만듭니다." },
  { label: "은닉값", body: "계단 함수를 적용해 OR·NAND 두 값을 남깁니다." },
  { label: "출력 점수", body: "A₁(4×2)과 W₂(2×1)을 곱해 Z₂(4×1)를 만듭니다." },
  {
    label: "XOR 예측",
    body: "0보다 큰 두 행만 1이 되어 [0,1,1,0]을 얻습니다.",
  },
] as const;

const states = [
  {
    name: "입력 X",
    shape: "4×2",
    value: "[(0,0),(1,0),(0,1),(1,1)]",
  },
  {
    name: "은닉 점수 Z₁",
    shape: "4×2",
    value: "[(-.5,1.5),(.5,.5),(.5,.5),(1.5,-.5)]",
  },
  {
    name: "은닉값 A₁",
    shape: "4×2",
    value: "[(0,1),(1,1),(1,1),(1,0)]",
  },
  {
    name: "출력 점수 Z₂",
    shape: "4×1",
    value: "[-.5,.5,.5,-.5]",
  },
  {
    name: "예측 ŷ",
    shape: "4×1",
    value: "[0,1,1,0]",
  },
] as const;

export default function TensorShapeTraceViz() {
  return (
    <StepViz steps={steps}>
      {(step) => {
        const current = states[step];
        return (
          <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-xl border border-primary/30 bg-background p-5">
              <p className="text-xs font-semibold text-primary">현재 값</p>
              <h4 className="mt-2 text-lg font-semibold">{current.name}</h4>
              <p className="mt-4 font-mono text-sm font-semibold">
                모양 {current.shape}
              </p>
            </div>
            <div className="min-w-0 rounded-xl border border-border/75 bg-background p-5">
              <p className="text-xs font-semibold text-muted-foreground">
                행 순서를 유지한 실제 숫자
              </p>
              <p className="mt-3 break-words font-mono text-sm leading-7">
                {current.value}
              </p>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                첫 축의 네 행은 끝까지 같은 입력 순서를 가리킵니다. 마지막 축만
                각 층이 만드는 값의 개수에 맞춰 바뀝니다.
              </p>
            </div>
          </div>
        );
      }}
    </StepViz>
  );
}
