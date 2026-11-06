import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-update — 표의 값 0.725517869, 학습률 0.1. g는 +0.027448213, −0.072551787.
 * 비교마다 neu1e에 옛 출력 줄×g를 더하고 그 출력 줄을 즉시 고친 뒤, 끝에 입력 saw에 neu1e를 더한다.
 */
const TABLE_VALUE = 0.725517869;
const G_POS = (1 - TABLE_VALUE) * 0.1;
const G_NEG = -TABLE_VALUE * 0.1;
const INPUT = [0, 1, 1];
const add = (a: number[], b: number[], scale: number) => a.map((value, index) => value + b[index] * scale);
const f = (values: number[]) => `[${values.map((value) => (Number.isInteger(value) ? String(value) : `${value < 0 ? "−" : ""}${Math.abs(value).toFixed(4)}`)).join(", ")}]`;
const STEPS = [
  { word: "cat", old: [2, 0, 1], g: G_POS },
  { word: "red", old: [1, 0, 1], g: G_NEG },
  { word: "dog", old: [1, 1, 0], g: G_NEG },
];
const BUFFERS = STEPS.reduce<number[][]>((list, step) => [...list, add(list[list.length - 1], step.old, step.g)], [[0, 0, 0]]);
const OUTPUTS = STEPS.map((step) => add(step.old, INPUT, step.g));
const FINAL = add(INPUT, BUFFERS[3], 1);

const SCENES = [
  { label: "시작", summary: "모아 둘 칸 = [0, 0, 0]", note: "입력 쪽 고칠 양을 모아 둘 칸을 비워 둡니다. 세 비교 모두 입력 saw의 값 [0,1,1]을 읽습니다." },
  { label: "cat 처리", summary: "g ≈ +0.0274", note: "g는 (1−표의 값)×0.1입니다. 옛 cat 줄 [2,0,1]에 g를 곱해 모아 둘 칸에 더한 뒤 cat 줄을 즉시 고칩니다." },
  { label: "red 처리", summary: "g ≈ −0.0726", note: "g는 (0−표의 값)×0.1입니다. 입력 saw는 아직 그대로라 red의 점수와 갱신도 [0,1,1]을 읽습니다." },
  { label: "dog 처리", summary: "g ≈ −0.0726", note: "dog도 같은 g를 받습니다. 세 대상 줄은 이미 바뀌었지만 입력 saw는 여전히 그대로입니다." },
  { label: "입력에 한 번 더함", summary: "saw ≈ [−0.0902, 0.9274, 0.9549]", note: "모아 둔 양을 입력 saw에 한 번 더합니다. 이상식을 쓴 8절의 값과 가깝지만 같지 않습니다. 선택하지 않은 출력 saw와 문장 끝 줄은 그대로입니다." },
] as const;

function Row({ name, value, changed }: { name: string; value: string; changed: boolean }) {
  return (
    <div className={`grid min-w-0 grid-cols-[5.25rem_minmax(0,1fr)] items-center gap-x-2 rounded border px-2 py-1.5 ${changed ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className={`text-xs ${changed ? "font-bold" : "text-muted-foreground"}`}>{changed ? "● " : ""}{name}</span>
      <span className={`break-words font-mono text-[11px] leading-5 ${changed ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

export default function UpdateOrderViz() {
  return (
    <SceneShell
      eyebrow="원본의 갱신 순서"
      title="대상 줄은 바로 고치고 입력 줄은 끝에 한 번 고칩니다"
      description="지정한 입력으로 원본의 한 쌍 처리를 따라간 값(소수 넷째 자리까지)입니다. 모아 둘 칸은 neu1e, 출력은 비교 대상 역할, ●는 이번에 바뀐 줄입니다."
      ariaLabel="cat, red, dog 비교마다 모아 둘 칸과 대상 줄이 바뀌고 마지막에 입력 saw가 바뀌는 순서"
      scenes={SCENES}
      render={(active) => {
        const done = Math.min(active, 3);
        return (
          <div className="min-w-0 space-y-1.5">
            <Row name="모아 둘 칸" value={f(BUFFERS[done])} changed={active >= 1 && active <= 3} />
            {STEPS.map((step, index) => (
              <Row key={step.word} name={`출력 ${step.word}`} value={f(index < done ? OUTPUTS[index] : step.old)} changed={active === index + 1} />
            ))}
            <Row name="입력 saw" value={f(active === 4 ? FINAL : INPUT)} changed={active === 4} />
          </div>
        );
      }}
    />
  );
}
