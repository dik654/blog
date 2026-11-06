import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-rows — 단어 행 3개(run 0, cat 1, 문장 끝 2) 뒤에 조각 행 8개.
 * 전체 행 번호 = 3 + bucket. run → [0, 5, 5, 7], runs → [5, 5, 6, 3].
 */
const WORD_ROWS = ["run", "cat", "문장 끝"];
const BUCKETS = [0, 1, 2, 3, 4, 5, 6, 7];
const OFFSET = WORD_ROWS.length;

const SCENES = [
  { label: "입력 행렬의 배치", summary: "단어 3행 + 조각 8행 = 11행", note: "전체 행 번호는 단어 행부터 매깁니다. 그래서 조각 행은 3번부터 시작합니다. 입력 행렬은 이 열한 줄을 한 표에 이어 붙인 것입니다.", list: [] as readonly number[], focus: [] as readonly number[] },
  { label: "bucket 번호를 행 번호로", summary: "3 + 2 = 5", note: "bucket은 조각용 줄 안의 번호이고, 전체 행 번호는 단어 행 수를 더한 값입니다. 원문 pushHash 함수의 nwords_+id가 이 덧셈입니다.", list: [] as readonly number[], focus: [5] as readonly number[] },
  { label: "run의 목록", summary: "[0, 5, 5, 7]", note: "맨 앞 0은 단어 run의 전용 행이고 뒤의 5, 5, 7이 조각입니다. 글자가 같아도 조각 run은 행 5에, 단어 run은 행 0에 있습니다.", list: [0, 5, 5, 7] as readonly number[], focus: [0, 5, 7] as readonly number[] },
  { label: "runs의 목록", summary: "사전 번호 −1, [5, 5, 6, 3]", note: "runs는 사전에 없어 −1을 돌려받지만 조각 목록은 만들어집니다. 전용 행 없이 조각 행만 읽습니다. 이 번호 계산은 행을 제거하지 않은 경우에 실행한 결과입니다.", list: [5, 5, 6, 3] as readonly number[], focus: [5, 6, 3] as readonly number[] },
] as const;

function Cell({ row, name, hits, focused }: { row: number; name: string; hits: number; focused: boolean }) {
  return (
    <div className={`rounded-md border px-1 py-1.5 text-center ${focused ? "border-blue-600 bg-blue-500/10" : "border-border/60 bg-background"}`}>
      <span className="block text-sm font-bold">
        행 {row}
        <span className={`ml-1 font-mono text-xs text-blue-700 dark:text-blue-400 ${hits > 0 ? "" : "invisible"}`}>×{hits}</span>
      </span>
      <span className="block text-[11px] text-muted-foreground">{name}</span>
    </div>
  );
}

export default function RowOffsetViz() {
  return (
    <SceneShell
      eyebrow="행 번호 지도"
      title="단어 행 뒤에 조각 행을 이어 붙여 번호를 매깁니다"
      description="칸 하나가 입력 행렬의 한 행입니다. ×숫자는 그 단어를 조회할 때 이 행을 읽는 횟수입니다."
      ariaLabel="단어 행과 조각 행의 배치, 그리고 run과 runs가 읽는 전체 행 번호"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const hits = (row: number) => scene.list.filter((value) => value === row).length;
        return (
          <div className="min-w-0 space-y-3">
            <div>
              <p className="mb-1 text-xs font-bold text-muted-foreground">단어 전용 행</p>
              <div className="grid grid-cols-3 gap-1.5">
                {WORD_ROWS.map((name, row) => (
                  <Cell key={name} row={row} name={name} hits={hits(row)} focused={scene.focus.includes(row)} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-muted-foreground">조각용 행 (bucket 0~7)</p>
              <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
                {BUCKETS.map((bucket) => (
                  <Cell key={bucket} row={OFFSET + bucket} name={`bucket ${bucket}`} hits={hits(OFFSET + bucket)} focused={scene.focus.includes(OFFSET + bucket)} />
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
