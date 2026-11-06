import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why — 묶음 세 개가 자리가 날 때마다 올라가고 완료 순서는 가정하지 않는다.
 * 묶음 0: 0–3, 묶음 1: 4–7, 묶음 2: 8–11(10·11은 건너뜀). 실행 구역 2곳과 순서는 그림의 가정.
 */
interface OrderScene {
  label: string;
  summary: string;
  note: string;
  waiting: readonly number[];
  slots: readonly (number | null)[];
  done: readonly number[];
}

const RANGE = ["0–3번", "4–7번", "8–9번"];

const SCENES: readonly OrderScene[] = [
  { label: "제출한 직후", summary: "대기 3 · 실행 0", waiting: [0, 1, 2], slots: [null, null], done: [], note: "묶음 세 개가 대기합니다. 묶음 2는 8–11번 후보를 만들지만 실제 칸은 8번과 9번뿐이어서 그림에는 두 칸만 적었습니다." },
  { label: "여유가 있는 만큼 실행", summary: "실행 2 · 대기 1", waiting: [2], slots: [0, 1], done: [], note: "묶음을 실행할 처리 구역(6절에서 SM이라 부릅니다)이 두 곳 비어 있다고 놓습니다(가정). 묶음 0과 1이 올라가고 묶음 2는 기다립니다." },
  { label: "여유가 생기면 다음 묶음", summary: "완료 1 · 실행 2", waiting: [], slots: [0, 2], done: [1], note: "묶음 1이 먼저 끝났다고 놓습니다(가정). 그 자리가 비면 다음 묶음 2를 실행할 수 있습니다. 묶음 번호가 앞선다고 먼저 끝나는 것은 아닙니다." },
  { label: "이번 실행이 끝남", summary: "완료 순서 1 → 0 → 2", waiting: [], slots: [null, null], done: [1, 0, 2], note: "결과 열 칸이 모두 찼습니다. 묶음 2의 내부 번호 2와 3이 만든 10번·11번 후보는 읽거나 쓰지 않습니다." },
  { label: "다른 순서로 실행해도", summary: "완료 순서 2 → 0 → 1", waiting: [], slots: [null, null], done: [2, 0, 1], note: "이번 덧셈은 각자 다른 결과 칸을 쓰므로 완료 순서를 기다릴 필요가 없고 결과 9번은 그대로 99입니다. 한 묶음 안에서 값을 주고받는 작업은 이 그림의 경우가 아니며 따로 동기화해야 합니다." },
];

function Chip({ block, tone }: { block: number; tone: "wait" | "run" | "done" }) {
  const style = tone === "run" ? "border-blue-600 text-blue-700 dark:text-blue-300" : tone === "done" ? "border-emerald-600 text-emerald-700 dark:text-emerald-300" : "border-border text-muted-foreground";
  return (
    <span className={`inline-flex min-w-0 flex-col rounded-lg border px-2 py-1 text-center text-xs leading-5 ${style}`}>
      <strong>묶음 {block}</strong>
      <span>{RANGE[block]}</span>
    </span>
  );
}

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      <div className="mt-1 flex min-h-[3.75rem] flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default function BlockOrderViz() {
  return (
    <SceneShell
      eyebrow="묶음이 올라가는 순서"
      title="여유가 생길 때마다 다음 묶음이 올라가고, 완료 순서는 정해 두지 않습니다"
      description="열 칸을 네 자리씩 나눈 세 묶음입니다. 아래쪽 결과 칸의 숫자는 배열 번호이고, 채워진 칸은 결과가 기록된 칸입니다."
      note="처리 구역 수와 실행·완료 순서는 그림을 위한 가정입니다. 실제 배치는 장치가 정합니다."
      ariaLabel="세 묶음이 처리 구역에 올라가고 다른 순서로 끝나도 결과 칸이 같아지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const filled = new Set(scene.done);
        return (
          <div className="space-y-3">
            <Row title="대기">
              {scene.waiting.length ? scene.waiting.map((block) => <Chip key={block} block={block} tone="wait" />) : <span className="text-xs text-muted-foreground">대기 중인 묶음 없음</span>}
            </Row>
            <div className="grid grid-cols-2 gap-2">
              {scene.slots.map((block, slot) => (
                <div key={slot} className="rounded-lg border border-dashed border-border p-2">
                  <p className="text-xs font-semibold text-muted-foreground">처리 구역 {slot === 0 ? "A" : "B"}</p>
                  <div className="mt-1 flex min-h-[3.25rem] items-center">
                    {block === null ? <span className="text-xs text-muted-foreground">비어 있음</span> : <Chip block={block} tone="run" />}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                결과 배열{scene.done.length ? ` · 끝난 순서: 묶음 ${scene.done.join(" → ")}` : ""}
              </p>
              <div className="mt-1 grid grid-cols-10 gap-1">
                {Array.from({ length: 10 }, (_, cell) => {
                  const written = filled.has(Math.floor(cell / 4));
                  return (
                    <span
                      key={cell}
                      className={`flex h-8 items-center justify-center rounded border font-mono text-xs ${written ? "border-emerald-600 bg-emerald-50 font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : "border-border text-muted-foreground"}`}
                    >
                      {cell}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
