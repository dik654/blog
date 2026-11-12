import SceneShell from "./SceneShell";

/**
 * 본문 대응: #inside-submission, #why-log — 같은 이름의 파일이어도 행 ID와 예측값의 대응이 바뀔 수 있다.
 * 열 이름만 고치면 ID→예측 쌍이 같고, 잘못된 행 연결을 고치면 쌍이 달라진다.
 * 파일 이름·열 이름·ID·값은 모두 설명용 가정입니다.
 */
const IDS: readonly string[] = ["r1", "r2", "r3", "r4"];
const ORIGINAL: readonly number[] = [0.9, 0.2, 0.7, 0.4];
const SHIFTED: readonly number[] = [0.4, 0.9, 0.2, 0.7];

const SCENES = [
  { label: "처음 보낸 파일", summary: "열 이름이 규격과 다름", header: ["row", "score"], values: ORIGINAL, same: null, note: "외부 평가는 필수 열 이름을 찾지 못해 이 파일을 거절합니다. 각 행 ID 옆의 예측값은 이 쌍들입니다." },
  { label: "열 이름만 고침", summary: "ID→예측 쌍 4개 모두 같음", header: ["id", "prediction"], values: ORIGINAL, same: true, note: "머리글만 규격에 맞췄고 r1~r4의 예측값이 그대로입니다. 예측 후보를 바꾸지 않은 형식 수정일 수 있습니다." },
  { label: "행 연결을 고침", summary: "ID→예측 쌍 4개 모두 달라짐", header: ["id", "prediction"], values: SHIFTED, same: false, note: "파일 이름과 고친 열 이름은 앞 장면과 같아도 값이 한 칸씩 다른 ID에 붙었습니다. 외부 평가가 받는 대상과 값의 관계가 달라졌으니 이름만 보고 0으로 세지 않습니다. 무엇을 바꿨는지와 그 이유를 남긴 뒤 미리 정한 집계 규칙을 적용합니다." },
] as const;

export default function RowMappingViz() {
  return (
    <SceneShell
      eyebrow="형식 수정과 내용 변경"
      title="같은 파일 이름 안에서 ID와 예측값의 짝이 바뀔 수 있습니다"
      description="왼쪽이 처음 보낸 파일, 오른쪽이 고쳐 보낸 파일입니다. 표시 ✓는 같은 ID에 같은 예측값이 붙었다는 뜻입니다. 파일 이름·열 이름·값은 설명용 가정입니다."
      ariaLabel="열 이름만 고친 경우와 행 연결을 고친 경우의 행 ID와 예측값 대응 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const panels: { title: string; header: readonly string[]; values: readonly number[]; show: boolean }[] = [
          { title: "처음 파일", header: SCENES[0].header, values: ORIGINAL, show: true },
          { title: "고친 파일", header: scene.header, values: scene.values, show: scene.same !== null },
        ];
        return (
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-6">
            {panels.map((panel) => (
              <div key={panel.title} className={`min-w-0 ${panel.show ? "" : "opacity-30"}`}>
                <p className="mb-1 text-xs font-semibold">{panel.title}</p>
                <p className="mb-2 truncate font-mono text-[11px] text-muted-foreground">submission.csv (가정)</p>
                <div className="overflow-hidden rounded-lg border border-border bg-background font-mono text-xs">
                  <div className="grid grid-cols-[1.75rem_minmax(0,1fr)_1rem] gap-x-2 border-b border-border bg-muted/40 px-2 py-1 font-semibold">
                    {panel.header.map((cell) => (
                      <span key={cell} className={"whitespace-nowrap " + (cell === "row" || cell === "score" ? "text-red-700 dark:text-red-400" : "")}>{panel.show ? cell : "—"}</span>
                    ))}
                    <span />
                  </div>
                  {IDS.map((id, row) => {
                    const value = panel.values[row];
                    const matches = value === ORIGINAL[row];
                    const mark = panel.title === "고친 파일" && panel.show ? (matches ? "✓" : "≠") : "";
                    return (
                      <div key={id} className="grid grid-cols-[1.75rem_minmax(0,1fr)_1rem] gap-x-2 px-2 py-1">
                        <span>{id}</span>
                        <span className={mark === "≠" ? "font-bold text-amber-700 dark:text-amber-400" : ""}>{panel.show ? value.toFixed(1) : "—"}</span>
                        <span className={mark === "≠" ? "font-bold text-amber-700 dark:text-amber-400" : "text-primary"}>{mark}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
