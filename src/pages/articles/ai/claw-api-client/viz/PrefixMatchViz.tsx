import ApiSceneShell from "./ApiSceneShell";

/**
 * 본문 대응: #prompt-cache "변하지 않는 내용을 앞에, 매번 바뀌는 내용을 뒤에 둔다"와
 * "miss 원인을 prefix segment 단위로 관측한다".
 * Prefix는 앞에서부터 한 글자도 다르지 않아야 같은 prefix이므로, 앞 구간 하나가 바뀌면
 * 그 뒤 구간은 내용이 같아도 exact prefix match가 깨질 수 있다. digest 값은 설명용 가정.
 */
const SEGMENTS = ["tool schema", "system", "reference", "history", "user input"] as const;
const BASE = ["7a1c", "33e0", "b902", "5d4f", "e118"] as const;

type Cell = "same" | "changed" | "after" | "suffix";

const SCENES = [
  {
    label: "요청 1 · 기준",
    summary: "앞 네 구간 = 고정 prefix",
    digests: BASE,
    cells: ["same", "same", "same", "same", "suffix"],
    note: "Tool schema·system instruction·reference context·이전 history를 앞에, 이번 user input을 뒤에 둡니다. 구간마다 digest(내용 요약값)와 길이를 남겨 두면 다음 요청과 구간 단위로 비교할 수 있습니다.",
  },
  {
    label: "요청 2 · user input만 바뀜",
    summary: "prefix 그대로 → 재사용 가능",
    digests: ["7a1c", "33e0", "b902", "5d4f", "09ab"],
    cells: ["same", "same", "same", "same", "suffix"],
    note: "바뀐 것은 맨 뒤 suffix뿐이라 앞 네 구간이 정확히 같은 prefix입니다. Provider가 이 계산을 재사용할 수 있지만, 실제로 hit했는지는 response usage의 cache read로 확인합니다.",
  },
  {
    label: "요청 3 · system에 현재 시각",
    summary: "system부터 prefix 불일치",
    digests: ["7a1c", "c4f2", "b902", "5d4f", "e118"],
    cells: ["same", "changed", "after", "after", "suffix"],
    note: "System prompt에 timestamp를 넣으면 system digest가 바뀝니다. reference와 history의 내용과 digest는 요청 1과 같아도, 바뀐 구간 뒤에 있으므로 exact prefix match가 깨질 수 있습니다.",
  },
  {
    label: "요청 4 · tool 순서만 바꿈",
    summary: "첫 구간부터 불일치",
    digests: ["91be", "33e0", "b902", "5d4f", "e118"],
    cells: ["changed", "after", "after", "after", "suffix"],
    note: "Tool 내용은 같고 순서만 달라도 serialized tool schema가 달라져 맨 앞 구간부터 어긋납니다. 구간별 digest를 비교하면 cache read가 0인 원인이 ‘tool 재정렬’이었다는 것을 찾을 수 있습니다.",
  },
] as const;

const CELL_STYLE: Record<Cell, string> = {
  same: "border-[#16a34a] bg-green-500/5",
  changed: "border-[#dc2626] bg-red-500/5",
  after: "border-dashed border-[#d97706]",
  suffix: "border-dashed border-border",
};

/** 색만으로 상태를 구분하지 않도록 칸과 범례에 같은 기호를 함께 둔다. */
const CELL_MARK: Record<Cell, string> = {
  same: "=",
  changed: "≠",
  after: "↳",
  suffix: "~",
};

const CELL_LABEL: Record<Cell, string> = {
  same: "같은 prefix",
  changed: "여기서 달라짐",
  after: "내용 같음 · prefix 아님",
  suffix: "매번 바뀌는 suffix",
};

export default function PrefixMatchViz() {
  return (
    <ApiSceneShell
      eyebrow="exact prefix"
      title="앞 구간 하나가 바뀌면 뒤 구간은 내용이 같아도 같은 prefix가 아닙니다"
      description="칸 하나가 request의 한 구간이고 왼쪽부터 provider에 보내는 순서입니다. 칸 너비는 길이를 뜻하지 않고, 칸 안 4자리는 구간별 digest(가정한 값)입니다."
      ariaLabel="네 번의 요청에서 구간별 digest를 비교해 exact prefix가 어디서 깨지는지 보여 주는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            {[
              { name: "요청 1", digests: BASE as readonly string[], cells: null as readonly Cell[] | null },
              { name: scene.label.split(" · ")[0], digests: scene.digests as readonly string[], cells: scene.cells as readonly Cell[] },
            ].map((row, rowIndex) => (
              <div key={rowIndex} className="min-w-0">
                <p className="mb-1 text-[11px] font-bold text-muted-foreground">{rowIndex === 0 ? "기준 · 요청 1" : `비교 · ${row.name}`}</p>
                <div className="grid min-w-0 grid-cols-5 gap-1 sm:gap-1.5">
                  {SEGMENTS.map((segment, index) => {
                    const cell: Cell | null = row.cells ? row.cells[index] : null;
                    return (
                      <div
                        key={segment}
                        className={`min-w-0 rounded-md border px-1 py-1.5 text-center ${cell ? CELL_STYLE[cell] : "border-border bg-background"}`}
                      >
                        <p className="break-words text-[10px] leading-3 text-muted-foreground sm:text-[11px]">{segment}</p>
                        <p className="mt-1 whitespace-nowrap font-mono text-xs font-bold">{row.digests[index]}</p>
                        {cell && <p className="text-[11px] leading-4 text-muted-foreground">{CELL_MARK[cell]}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <ul className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-1 text-[11px] sm:grid-cols-4">
              {(Object.keys(CELL_LABEL) as Cell[]).map((cell) => (
                <li key={cell} className="flex min-w-0 items-center gap-1.5">
                  <span className={`inline-flex h-4 w-5 shrink-0 items-center justify-center rounded-sm border text-[10px] leading-none ${CELL_STYLE[cell]}`}>
                    {CELL_MARK[cell]}
                  </span>
                  <span className="min-w-0 break-words">{CELL_LABEL[cell]}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
