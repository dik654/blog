import { Fragment } from "react";
import SceneShell, { type ShellScene } from "./SceneShell";
import { Cell } from "./TextCells";

/**
 * 본문 대응: #source-boundaries — 연속된 번호 쌍을 읽으며 경계를 정합니다.
 * 원문의 시작 경계 0, 1, 3, 4. 가족 그림은 내부 여섯 경계가 모두 붙어 자소군 하나.
 */
interface BoundaryScene extends ShellScene {
  line: 0 | 1;
  pair: number;
  state: string;
}

const SCENES: readonly BoundaryScene[] = [
  { label: "A | e", summary: "경계 있음", note: "상태값을 처음에 0으로 두고 연속된 쌍을 빠짐없이 읽습니다. A와 e 사이에는 경계가 있습니다.", line: 0, pair: 0, state: "처음 0에서 시작" },
  { label: "e · 악센트", summary: "경계 없음", note: "악센트의 Extend 속성 때문에 e와 U+0301 사이에는 경계를 만들지 않습니다.", line: 0, pair: 1, state: "같은 상태값을 이어서 전달" },
  { label: "악센트 | 가", summary: "경계 있음", note: "악센트 다음의 가는 새 묶음을 시작합니다.", line: 0, pair: 2, state: "같은 상태값을 이어서 전달" },
  { label: "가 | 😀", summary: "시작 경계 0, 1, 3, 4", note: "이 실행의 시작 경계는 코드 포인트 0, 1, 3, 4입니다. 번호 다섯 개가 네 묶음이 됩니다.", line: 0, pair: 3, state: "같은 상태값을 이어서 전달" },
  { label: "사람 · 연결 표시", summary: "경계 없음", note: "GB9는 연결 표시 앞의 분할을 막습니다. C 구현은 그림과 연결 표시를 보았다는 상태를 보존합니다.", line: 1, pair: 0, state: "그림과 연결 표시를 보았음" },
  { label: "연결 표시 · 사람", summary: "상태가 있어야 붙음", note: "GB11은 그림·이어지는 표시·연결 표시 뒤의 그림을 묶습니다. 상태를 매번 초기화하면 같은 처리를 보장하지 못합니다.", line: 1, pair: 1, state: "보존한 상태를 읽고 다음 그림을 붙임" },
  { label: "가족 그림 전체", summary: "내부 경계 6곳 모두 붙음 · 자소군 1", note: "이 입력의 실제 호출에서는 내부 여섯 경계가 모두 붙어 자소군 하나가 나왔습니다.", line: 1, pair: 5, state: "같은 처리를 끝까지 반복" },
];

const LINE_A = ["A", "e", "◌́", "가", "😀"];
const LINE_B = ["👨", "연결", "👩", "연결", "👧", "연결", "👦"];
const BREAKS_A = [true, false, true, true];

type Mark = "unknown" | "break" | "join";

function Gap({ mark, hot }: { mark: Mark; hot: boolean }) {
  return (
    <span className="flex w-3 shrink-0 items-center justify-center sm:w-6" aria-label={mark === "break" ? "경계" : mark === "join" ? "붙음" : "아직 읽지 않음"}>
      {mark === "break" && <span className={`h-full w-0.5 ${hot ? "bg-[#dc2626]" : "bg-[#94a3b8]"}`} />}
      {mark === "join" && <span className={`h-0.5 w-full ${hot ? "bg-[#2563eb]" : "bg-[#94a3b8]"}`} />}
    </span>
  );
}

export default function BoundaryStateViz() {
  return (
    <SceneShell
      eyebrow="경계 함수 따라가기"
      title="번호 쌍을 앞에서부터 읽으며 끊을 곳과 붙일 곳을 정합니다"
      description="칸 사이 세로줄은 경계, 가로줄은 붙음입니다. 가족 그림은 네 사람의 번호와 그 사이 연결 표시 세 개입니다."
      note="상태는 지금까지 읽은 내용을 다음 호출로 넘기는 값입니다. 점선 ◌는 보조 그림입니다."
      ariaLabel="원문과 가족 그림의 연속된 번호 쌍에서 경계를 판단하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const markA = (gap: number): Mark => (scene.line === 1 || gap <= scene.pair ? (BREAKS_A[gap] ? "break" : "join") : "unknown");
        const markB = (gap: number): Mark => (scene.line === 1 && gap <= scene.pair ? "join" : "unknown");
        const hotA = (gap: number) => scene.line === 0 && gap === scene.pair;
        const hotB = (gap: number) => scene.line === 1 && (scene.pair === 5 || gap === scene.pair);
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">원문 · 코드 포인트 5개</p>
              <div className="flex h-11">
                {LINE_A.map((glyph, index) => (
                  <Fragment key={index}>
                    <Cell top={glyph} bottom={index} dashed={index === 2} tone={scene.line === 0 && (index === scene.pair || index === scene.pair + 1) ? "accent" : "none"} className="w-8 sm:w-11" />
                    {index < LINE_A.length - 1 && <Gap mark={markA(index)} hot={hotA(index)} />}
                  </Fragment>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">가족 그림 · 코드 포인트 7개</p>
              <div className="flex h-11">
                {LINE_B.map((glyph, index) => (
                  <Fragment key={index}>
                    <Cell
                      top={glyph === "연결" ? <span className="text-[10px]">연결</span> : glyph}
                      bottom={index}
                      dashed={glyph === "연결"}
                      tone={scene.line === 1 && (scene.pair === 5 || index === scene.pair || index === scene.pair + 1) ? "accent" : "none"}
                      className="min-w-0 flex-1 sm:w-11 sm:flex-none"
                    />
                    {index < LINE_B.length - 1 && <Gap mark={markB(index)} hot={hotB(index)} />}
                  </Fragment>
                ))}
              </div>
            </div>
            <p className="rounded-sm border border-border px-3 py-2 text-xs leading-5">
              <span className="text-muted-foreground">상태 · </span>
              <strong>{scene.state}</strong>
            </p>
          </div>
        );
      }}
    />
  );
}
