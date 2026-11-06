import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-pipeline — g_out[idx] = g_in[idx] + 1을 inner_reps번 반복해도 입력은 그대로다.
 * 7 + 1 = 8을 다섯 번. 누적이었다면 8·9·10·11·12. 원문 기본값은 0 + 1 = 1.
 */
const ROUNDS = [1, 2, 3, 4, 5] as const;

const SCENES = [
  { label: "실제 반복", summary: "다섯 번 모두 7 + 1 = 8", input: [7, 7, 7, 7, 7], output: [8, 8, 8, 8, 8], wrong: false, note: "입력을 바꾸지 않고 출력만 다시 씁니다. inner_reps=5여도 다섯 번 모두 같은 8을 씁니다." },
  { label: "누적이라고 착각하면", summary: "8 → 12는 일어나지 않음", input: [7, 8, 9, 10, 11], output: [8, 9, 10, 11, 12], wrong: true, note: "앞 결과를 다음 입력으로 쓴다면 12가 되겠지만, 원문 kernel에는 출력을 입력으로 되돌리는 코드가 없습니다." },
  { label: "원문 기본값", summary: "0 + 1 = 1", input: [0, 0, 0, 0, 0], output: [1, 1, 1, 1, 1], wrong: false, note: "원문의 기본 초기값은 0이라 자체 검사가 출력 1을 기대합니다. 7은 동작을 읽으려고 대입한 입력이며 예제를 실행한 측정값이 아닙니다." },
] as const;

function Row({ name, values, wrong }: { name: string; values: readonly number[]; wrong: boolean }) {
  return (
    <div className="grid grid-cols-[5.25rem_repeat(5,minmax(0,1fr))] items-center gap-1.5">
      <span className="font-mono text-xs font-semibold leading-tight">{name}</span>
      {values.map((value, index) => (
        <span
          key={index}
          className={`rounded-sm border py-1.5 text-center font-mono text-sm font-bold ${wrong ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : "border-primary bg-primary/15"}`}
        >
          {value}
        </span>
      ))}
    </div>
  );
}

export default function InnerRepsViz() {
  return (
    <SceneShell
      eyebrow="다섯 번 반복"
      title="같은 계산을 다섯 번 해도 왜 12가 아닐까요"
      description="inner_reps는 kernel 안에서 같은 계산을 되풀이하는 횟수이고, 원문 값은 5입니다. 가로가 회차, 위 칸이 그 회차의 입력 g_in, 아래 칸이 출력 g_out입니다."
      ariaLabel="inner_reps 다섯 회차의 입력과 출력을 실제 동작과 누적 착각, 원문 기본값으로 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-[5.25rem_repeat(5,minmax(0,1fr))] gap-1.5 text-center text-xs text-muted-foreground">
              <span />
              {ROUNDS.map((round) => <span key={round}>{round}회</span>)}
            </div>
            <Row name="g_in[idx]" values={scene.input} wrong={scene.wrong} />
            <Row name="g_out[idx]" values={scene.output} wrong={scene.wrong} />
          </div>
        );
      }}
    />
  );
}
