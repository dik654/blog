import SceneShell from "./SceneShell";

/**
 * 본문 대응: #runtime-dispatch — 세 경로 대조와 release 판정.
 * 어느 backend가 실패하는지는 장면을 보이려는 가정입니다.
 */
type Out = "ok" | "fail" | "cut";

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  outs: readonly [Out, Out, Out];
  verdict: string;
  bad: boolean;
  sizes: boolean;
}[] = [
  { label: "모두 같은 값", summary: "이 비교는 통과", note: "세 경로에 같은 field와 point 입력을 넣고, 출력을 canonical form으로 되돌린 뒤 비교합니다. canonical form은 같은 값을 한 가지 표기로 통일한 형태입니다.", outs: ["ok", "ok", "ok"], verdict: "세 출력이 같습니다", bad: false, sizes: false },
  { label: "한 backend만 성공", summary: "release하지 않음", note: "다른 경로가 같은 입력에서 값을 내도, 한 경로가 실패하면 비교가 깨집니다. 어느 backend가 실패할지는 장면을 위한 가정입니다.", outs: ["ok", "ok", "fail"], verdict: "한 backend만 성공 → release하지 않음", bad: true, sizes: false },
  { label: "값을 조용히 잘라 냄", summary: "release하지 않음", note: "오류 없이 끝나도 값이 잘렸으면 canonical 비교에서 드러납니다. 어느 backend에서 잘리는지는 장면을 위한 가정입니다.", outs: ["ok", "cut", "ok"], verdict: "값이 다름 → release하지 않음", bad: true, sizes: false },
  { label: "Block·work-group 크기가 달라도", summary: "값·실패 종류는 같아야", note: "크기 설정이 달라도 값은 같아야 하고, 실패한다면 실패 종류도 같아야 합니다. 크기가 다르다는 이유로 결과 차이를 허용하지 않습니다.", outs: ["ok", "ok", "ok"], verdict: "크기만 달라짐 → 값은 그대로 비교", bad: false, sizes: true },
];

const ROWS = ["CPU", "CUDA", "OpenCL"] as const;
const OUT_TEXT: Record<Out, string> = { ok: "값 A", fail: "실패", cut: "A를 자른 값" };

export default function ParityCheckViz() {
  return (
    <SceneShell
      eyebrow="backend 대조"
      title="세 경로의 출력을 표기를 맞춘 뒤 나란히 비교합니다"
      description="‘값 A’는 어떤 입력의 출력을 가리키는 이름이며 실제 수치가 아닙니다. 장면마다의 성공·실패 조합은 판정 규칙을 보이려는 가정이며 측정 결과가 아닙니다."
      ariaLabel="CPU, CUDA, OpenCL 출력 비교와 release 여부 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-center text-sm font-semibold">같은 field·point 입력</div>
            <div className="space-y-2">
              {ROWS.map((row, index) => {
                const out = scene.outs[index];
                return (
                  <div key={row} className="grid grid-cols-[3.75rem_minmax(0,1fr)_1rem_minmax(0,1.2fr)] items-center gap-2 text-xs sm:text-sm">
                    <span className="font-semibold">{row}</span>
                    <span className={`rounded border px-1 py-1.5 text-center leading-5 ${index > 0 && scene.sizes ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                      {index === 0 ? "기준 실행" : scene.sizes ? (index === 1 ? "block 크기 변경" : "work-group 변경") : "kernel 실행"}
                    </span>
                    <span aria-hidden="true" className="text-center text-muted-foreground">→</span>
                    <span className={`rounded border px-1 py-1.5 text-center font-mono font-semibold leading-5 ${out === "ok" ? "border-border bg-background" : "border-dashed border-red-600 text-red-700 dark:text-red-400"}`}>{OUT_TEXT[out]}</span>
                  </div>
                );
              })}
            </div>
            <div className={`rounded-lg border px-3 py-2 text-center text-sm font-bold ${scene.bad ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : "border-primary text-primary"}`}>{scene.verdict}</div>
          </div>
        );
      }}
    />
  );
}
