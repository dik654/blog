import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-code — 본문 dW(행 입력, 열 선택지)와 코드 grad_weight(행 선택지, 열 입력).
 * dW = [[2/3,−2/3],[4/3,−4/3]], grad_weight = [[2/3,4/3],[−2/3,−4/3]].
 * 같은 "입력 i·선택지 j"가 전치 자리에 놓인다.
 */
const W: readonly (readonly string[])[] = [["ln2", "0"], ["0", "0"]];
const DW: readonly (readonly string[])[] = [["2/3", "−2/3"], ["4/3", "−4/3"]];
const GRAD: readonly (readonly string[])[] = [["2/3", "4/3"], ["−2/3", "−4/3"]];

/** focus는 [입력 번호, 선택지 번호]다. */
const STATES: readonly { values: "w" | "grad"; focus: readonly (readonly [number, number])[] }[] = [
  { values: "w", focus: [] },
  { values: "grad", focus: [[0, 1]] },
  { values: "grad", focus: [[1, 0]] },
  { values: "grad", focus: [[0, 0], [1, 1]] },
];

const SCENES = [
  { label: "weight = Wᵀ로 저장", summary: "숫자는 같아 보임", note: "168행 input.mm(weight.t())에 맞추려면 W 대신 전치를 저장합니다. 이번 W는 대각 형태라 숫자가 똑같아 보이지만, 코드의 행은 출력 폭, 열은 입력 폭입니다." },
  { label: "입력 1 · 둘째 선택지", summary: "−2/3 · 자리가 바뀜", note: "같은 가중치의 gradient입니다. 본문 표에서는 1행 2열, 코드 표에서는 2행 1열에 있습니다." },
  { label: "입력 2 · 첫 선택지", summary: "4/3 · 자리가 바뀜", note: "본문 표의 2행 1열이 코드 표의 1행 2열로 갑니다. 198행 grad_output.t().mm(input)의 결과가 8절 dW의 전치인 이유입니다." },
  { label: "대각 칸은 제자리", summary: "2/3 · −4/3", note: "번호가 같은 칸은 전치해도 움직이지 않습니다. 반환되는 세 배열은 input(196행), weight(198행), bias(200행) 순서이므로 숫자와 함께 이 순서와 shape, 저장 방향까지 맞춰 봅니다." },
];

function Table({ title, rowName, colName, values, isOn }: { title: string; rowName: string; colName: string; values: readonly (readonly string[])[]; isOn: (row: number, col: number) => boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold">{title}</p>
      <div className="mt-1.5 grid grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-1 text-[11px]">
        <span />
        <span className="text-center text-muted-foreground">{colName} 1</span>
        <span className="text-center text-muted-foreground">{colName} 2</span>
        {values.map((row, rowIndex) => (
          <div key={rowIndex} className="contents">
            <span className="self-center text-muted-foreground">{rowName} {rowIndex + 1}</span>
            {row.map((value, colIndex) => {
              const on = isOn(rowIndex, colIndex);
              return (
                <span key={colIndex} className={`flex h-8 min-w-0 sm:h-10 items-center justify-center rounded-sm border font-mono text-sm ${on ? "font-bold" : ""}`} style={{ borderColor: on ? "#dc2626" : "#94a3b8", backgroundColor: on ? "#dc262618" : "transparent" }}>
                  {value}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StorageDirectionViz() {
  return (
    <SceneShell
      eyebrow="저장 방향"
      title="같은 gradient가 본문 표와 코드 표에서 전치된 자리에 놓입니다"
      description="본문 표는 이 글의 표기(행이 입력, 열이 선택지), 코드 표는 공식 예제가 저장하는 방향(행이 선택지, 열이 입력)입니다. 칠한 칸은 같은 가중치입니다."
      ariaLabel="본문 dW와 코드 grad_weight의 칸 대응"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        const useW = state.values === "w";
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <Table
              title={useW ? "본문 W" : "본문 dW"}
              rowName="입력"
              colName="선택지"
              values={useW ? W : DW}
              isOn={(row, col) => state.focus.some(([input, choice]) => input === row && choice === col)}
            />
            <Table
              title={useW ? "코드 weight = Wᵀ" : "코드 grad_weight"}
              rowName="선택지"
              colName="입력"
              values={useW ? W : GRAD}
              isOn={(row, col) => state.focus.some(([input, choice]) => choice === row && input === col)}
            />
          </div>
        );
      }}
    />
  );
}
