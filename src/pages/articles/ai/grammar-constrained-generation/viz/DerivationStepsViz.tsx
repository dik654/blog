import SceneShell from "./SceneShell";

/**
 * 본문 대응: #derivation — S ⇒ array ⇒ [ value ] ⇒ [ 0 ].
 * 점선 칸 = nonterminal(아직 바뀌어야 함), 실선 칸 = terminal(출력에 남음).
 * 매 장면에서 바뀐 칸 하나만 강조하고, 아래 사다리에 지금까지의 순서를 쌓습니다.
 */
type Chip = { text: string; terminal: boolean; fresh: boolean };

const LINES: readonly (readonly Chip[])[] = [
  [{ text: "S", terminal: false, fresh: true }],
  [{ text: "array", terminal: false, fresh: true }],
  [
    { text: "[", terminal: true, fresh: true },
    { text: "value", terminal: false, fresh: true },
    { text: "]", terminal: true, fresh: true },
  ],
  [
    { text: "[", terminal: true, fresh: false },
    { text: "0", terminal: true, fresh: true },
    { text: "]", terminal: true, fresh: false },
  ],
];

const SCENES = [
  {
    label: "Start symbol S 하나로 시작합니다",
    summary: "S",
    rule: "아직 적용한 rule 없음",
    note: "점선 칸은 nonterminal입니다. 출력에 남는 symbol이 아니라 다른 symbol 열로 더 바뀌어야 하는 이름입니다.",
  },
  {
    label: "S 자리를 array로 바꿉니다",
    summary: "S ⇒ array",
    rule: "S를 array로 전개",
    note: "첫 단계도 nonterminal을 다른 nonterminal로 바꿨을 뿐이라, 출력에 남을 terminal은 아직 하나도 없습니다.",
  },
  {
    label: "array 한 칸이 세 칸이 됩니다",
    summary: "array ⇒ [ value ]",
    rule: "production: array → [ value ]",
    note: "양끝 괄호는 실선 칸인 terminal이라 이대로 출력에 남습니다. 가운데 value만 점선이라 한 번 더 바꿔야 합니다.",
  },
  {
    label: "value를 0으로 바꾸면 terminal만 남습니다",
    summary: "[ value ] ⇒ [ 0 ]",
    rule: "production: value → 0",
    note: "점선 칸이 하나도 남지 않았으므로 전개가 끝납니다. 위에서부터 쌓인 네 줄의 적용 순서가 derivation입니다.",
  },
] as const;

function ChipBox({ chip, highlight }: { chip: Chip; highlight: boolean }) {
  return (
    <span
      className={`inline-flex min-w-[2.25rem] items-center justify-center rounded-md border px-2 py-1 font-mono text-sm font-bold ${
        chip.terminal ? "border-solid" : "border-dashed"
      } ${highlight ? "border-primary text-primary" : "border-border text-foreground"}`}
    >
      {chip.text}
    </span>
  );
}

export default function DerivationStepsViz() {
  return (
    <SceneShell
      eyebrow="Derivation 한 줄씩"
      title="Rule을 한 번 적용할 때마다 한 칸이 바뀝니다"
      description="본문의 S ⇒ array ⇒ [ value ] ⇒ [ 0 ]을 그대로 따라갑니다. 점선 칸은 nonterminal, 실선 칸은 terminal입니다."
      ariaLabel="start symbol S에서 string [0]까지 네 줄의 derivation"
      scenes={SCENES}
      render={(active) => {
        const current = LINES[active];
        return (
          <div className="min-w-0">
            <div className="flex min-h-[4.5rem] flex-wrap items-center justify-center gap-2 rounded-lg border border-border px-3 py-4">
              {current.map((chip, index) => (
                <ChipBox key={`${chip.text}-${index}`} chip={chip} highlight={chip.fresh} />
              ))}
            </div>
            <p className="mt-2 text-center font-mono text-xs text-muted-foreground">{SCENES[active].rule}</p>
            <ol className="mt-4 space-y-1.5 border-l border-border pl-4">
              {LINES.map((line, row) => (
                <li
                  key={row}
                  className={`flex flex-wrap items-center gap-1.5 text-xs ${row > active ? "opacity-0" : row === active ? "" : "opacity-60"}`}
                  aria-hidden={row > active}
                >
                  <span className="w-5 font-mono text-muted-foreground">{row === 0 ? "" : "⇒"}</span>
                  {line.map((chip, index) => (
                    <span
                      key={`${row}-${index}`}
                      className={`rounded border px-1.5 font-mono ${chip.terminal ? "border-solid" : "border-dashed"} border-border`}
                    >
                      {chip.text}
                    </span>
                  ))}
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span>
                <span className="mr-1 inline-block h-3 w-4 rounded-sm border border-dashed border-foreground/60 align-middle" />
                nonterminal · 더 바뀜
              </span>
              <span>
                <span className="mr-1 inline-block h-3 w-4 rounded-sm border border-solid border-foreground/60 align-middle" />
                terminal · 출력에 남음
              </span>
              <span className="text-primary">강조 칸 · 이번 단계에서 새로 생김</span>
            </div>
          </div>
        );
      }}
    />
  );
}
