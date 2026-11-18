import SparseSceneShell from "./SparseSceneShell";

/**
 * 본문 대응: #source, #reduction — mul_by_014가 A를 아래 묶음 A0(코드 칸 0–2)과 위 묶음 A1(칸 3–5)로 나눠
 * 세 번의 묶음 곱으로 여섯 칸을 채우는 순서.
 *   c4=0:  aa=A0(5+7v)=[5,22,21], bb=A1·0v=0, 합=(A0+A1)(5+7v)=[15,56,49], 위=합−aa−bb=[10,34,28], 아래=aa
 *   c4=11: bb=A1·11v=[0,22,44], 합=[3,7,0](5+18v)=[15,89,126], 위=[10,45,61],
 *          v·bb=[44ξ,0,22], 아래=aa+v·bb=[401+44u,22,43]  (ξ=9+u, 5+44·9=401)
 */
type Cell = number | string;
type RowKey = "A" | "B" | "aa" | "bb" | "sum" | "upper" | "vbb" | "lower";

interface Row {
  key: RowKey;
  label: string;
  short: string;
  values: readonly Cell[];
  high?: boolean;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  show: readonly RowKey[];
  focus: readonly RowKey[];
}

const NAMES6: readonly string[] = ["1", "v", "v²", "w", "vw", "v²w"];

const ROWS_ZERO: readonly Row[] = [
  { key: "A", label: "A (코드 순서)", short: "A", values: [1, 3, 0, 2, 4, 0] },
  { key: "B", label: "B = 014(5, 7, 0)", short: "B", values: [5, 7, 0, 0, 0, 0] },
  { key: "aa", label: "aa = A0 × (5+7v)", short: "aa", values: [5, 22, 21] },
  { key: "bb", label: "bb = A1 × 0v", short: "bb", values: [0, 0, 0] },
  { key: "sum", label: "합의 곱 [3,7,0] × (5+7v)", short: "합", values: [15, 56, 49] },
  { key: "upper", label: "위 묶음 = 합 − aa − bb", short: "위", values: [10, 34, 28], high: true },
  { key: "vbb", label: "v × bb (한 칸씩 오른쪽)", short: "v·bb", values: [0, 0, 0] },
  { key: "lower", label: "아래 묶음 = aa + v×bb", short: "아래", values: [5, 22, 21] },
];

const ROWS_ELEVEN: readonly Row[] = [
  { key: "A", label: "A (코드 순서)", short: "A", values: [1, 3, 0, 2, 4, 0] },
  { key: "B", label: "B = 014(5, 7, 11)", short: "B", values: [5, 7, 0, 0, 11, 0] },
  { key: "aa", label: "aa = A0 × (5+7v)", short: "aa", values: [5, 22, 21] },
  { key: "bb", label: "bb = A1 × 11v", short: "bb", values: [0, 22, 44] },
  { key: "sum", label: "합의 곱 [3,7,0] × (5+18v)", short: "합", values: [15, 89, 126] },
  { key: "upper", label: "위 묶음 = 합 − aa − bb", short: "위", values: [10, 45, 61], high: true },
  { key: "vbb", label: "v × bb (한 칸씩 오른쪽)", short: "v·bb", values: ["44ξ", 0, 22] },
  { key: "lower", label: "아래 묶음 = aa + v×bb", short: "아래", values: ["401+44u", 22, 43] },
];

const ALL: readonly RowKey[] = ["A", "B", "aa", "bb", "sum", "upper", "vbb", "lower"];

const SCENES_ZERO: readonly Scene[] = [
  { label: "두 묶음으로 나누기", summary: "A0=[1,3,0] · A1=[2,4,0]", show: ["A", "B"], focus: ["A", "B"], note: "코드 칸 0–2가 아래 묶음 A0, 칸 3–5가 위 묶음 A1입니다. 인자 5·7은 B의 아래 묶음 5+7v가 되고, 4번 칸 인자 0은 위 묶음의 v 자리에 놓입니다." },
  { label: "aa: 아래끼리", summary: "[1,3,0] × (5+7v) = [5,22,21]", show: ["A", "B", "aa"], focus: ["aa"], note: "아래 묶음끼리 곱합니다. 1·5=5, 1·7+3·5=22, 3·7=21입니다." },
  { label: "bb: 위끼리", summary: "[2,4,0] × 0v = 0", show: ["A", "B", "aa", "bb"], focus: ["bb"], note: "위 묶음끼리 곱합니다. 이번 인자는 0이라 bb는 모두 0입니다." },
  { label: "합의 곱", summary: "[3,7,0] × (5+7v) = [15,56,49]", show: ["A", "B", "aa", "bb", "sum"], focus: ["sum"], note: "두 묶음을 먼저 더하면 A0+A1=[3,7,0]입니다. B 쪽도 5+7v에 0v를 더해 그대로입니다. 이 둘을 한 번 곱합니다." },
  { label: "위 묶음 만들기", summary: "[15,56,49] − aa − bb = [10,34,28]", show: ["A", "B", "aa", "bb", "sum", "upper"], focus: ["upper"], note: "합의 곱에서 aa와 bb를 빼면 위 묶음이 남습니다. 15−5=10, 56−22=34, 49−21=28입니다." },
  { label: "아래 묶음과 결과", summary: "[5,22,21 | 10,34,28]", show: ALL, focus: ["vbb", "lower"], note: "bb가 0이라 v×bb도 0이고 아래 묶음은 aa 그대로입니다. 두 묶음을 이으면 [5,22,21,10,34,28]로 여덟 곱 손계산의 코드 순서 출력과 같습니다." },
];

const SCENES_ELEVEN: readonly Scene[] = [
  { label: "4번 칸에 11", summary: "014(5,7,11) · aa는 그대로", show: ["A", "B", "aa"], focus: ["B", "aa"], note: "B의 4번 칸(vw)에 11이 들어옵니다. 아래 묶음의 인자 5·7은 그대로라 aa=[5,22,21]도 그대로입니다." },
  { label: "bb", summary: "[2,4,0] × 11v = [0,22,44]", show: ["A", "B", "aa", "bb"], focus: ["bb"], note: "위 묶음끼리 곱합니다. 2·11은 v 자리로, 4·11은 v² 자리로 가서 [0,22,44]가 됩니다." },
  { label: "합의 곱", summary: "[3,7,0] × (5+18v) = [15,89,126]", show: ["A", "B", "aa", "bb", "sum"], focus: ["sum"], note: "B 쪽 합은 5+7v에 11v를 더한 5+18v입니다. 3·5=15, 3·18+7·5=89, 7·18=126입니다." },
  { label: "위 묶음", summary: "[15,89,126] − aa − bb = [10,45,61]", show: ["A", "B", "aa", "bb", "sum", "upper"], focus: ["upper"], note: "15−5−0=10, 89−22−22=45, 126−21−44=61입니다. 위 묶음의 34와 28이 45와 61로 바뀌었습니다." },
  { label: "v × bb: 한 칸 밀기", summary: "[0,22,44] → [44ξ,0,22]", show: ["A", "B", "aa", "bb", "sum", "upper", "vbb"], focus: ["bb", "vbb"], note: "v를 곱하면 [C0,C1,C2]가 [ξC2,C0,C1]이 됩니다. 각 값이 한 칸 오른쪽으로 가고, 끝에서 넘친 44는 버려지지 않고 ξ를 곱해 첫 칸으로 돌아옵니다. ξ는 v³을 되돌리는 값으로 이 구성에서 9+u입니다." },
  { label: "아래 묶음과 결과", summary: "[401+44u,22,43 | 10,45,61]", show: ALL, focus: ["vbb", "lower"], note: "aa에 v×bb를 더합니다. 44ξ=396+44u라서 첫 칸은 5+396+44u=401+44u, 셋째 칸은 21+22=43입니다." },
];

function RowView({ row, shown, focused }: { row: Row; shown: boolean; focused: boolean }) {
  return (
    <div className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-1.5 sm:grid-cols-[11.5rem_minmax(0,1fr)] sm:gap-3">
      <p className={`text-[11px] leading-4 sm:text-xs ${focused ? "font-bold text-foreground" : "text-muted-foreground"} ${shown ? "" : "opacity-40"}`}>
        <span className="sm:hidden">{row.short}</span>
        <span className="hidden sm:inline">{row.label}</span>
      </p>
      <div className="grid min-w-0 grid-cols-6 gap-1">
        {row.values.map((value, index) => (
          <div
            key={index}
            className={`${index === 0 && row.high ? "col-start-4" : ""} flex min-h-7 min-w-0 items-center justify-center rounded-md border px-0.5 text-center ${
              !shown ? "border-dashed border-border/50" : focused ? "border-[#2563eb] bg-[#2563eb]/10" : value === 0 ? "border-border bg-muted/40" : "border-border bg-background"
            }`}
          >
            <span className={`break-all font-mono text-[11px] font-bold leading-4 sm:text-xs ${shown ? "" : "text-transparent"}`}>{shown ? value : "·"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] gap-1.5 sm:grid-cols-[11.5rem_minmax(0,1fr)] sm:gap-3">
      <span />
      <div className="grid min-w-0 grid-cols-6 gap-1 text-center text-[11px] leading-4 text-muted-foreground">
        {NAMES6.map((name, index) => (
          <span key={name} className={index < 3 ? "border-b border-[#2563eb]/40 pb-0.5" : "border-b border-[#0f766e]/40 pb-0.5"}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function GroupProduct({ rows, scenes, title, eyebrow, description, ariaLabel }: { rows: readonly Row[]; scenes: readonly Scene[]; title: string; eyebrow: string; description: string; ariaLabel: string }) {
  return (
    <SparseSceneShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      ariaLabel={ariaLabel}
      scenes={scenes}
      render={(active) => {
        const scene = scenes[active];
        return (
          <div className="min-w-0 space-y-1.5">
            <HeaderRow />
            {rows.map((row) => (
              <RowView key={row.key} row={row} shown={scene.show.includes(row.key)} focused={scene.focus.includes(row.key)} />
            ))}
          </div>
        );
      }}
    />
  );
}

export function GroupProductZeroViz() {
  return (
    <GroupProduct
      rows={ROWS_ZERO}
      scenes={SCENES_ZERO}
      eyebrow="mul_by_014 · 인자 5·7·0"
      title="여섯 칸을 두 묶음으로 나눠 세 번 곱하고 빼기"
      description="열 이름은 코드 칸 순서 1·v·v²·w·vw·v²w입니다. 왼쪽 세 열이 아래 묶음, 오른쪽 세 열이 위 묶음입니다. aa·bb·합의 곱 같은 중간값은 세 칸짜리라 1·v·v² 열에 적습니다."
      ariaLabel="mul_by_014가 aa, bb, 합의 곱으로 위 묶음과 아래 묶음을 만드는 순서"
    />
  );
}

export function GroupProductElevenViz() {
  return (
    <GroupProduct
      rows={ROWS_ELEVEN}
      scenes={SCENES_ELEVEN}
      eyebrow="mul_by_014 · 인자 5·7·11"
      title="빈 칸에 11이 들어오면 bb가 생기고 한 칸 밀려 돌아옵니다"
      description="앞 그림과 같은 열 배치에 B의 4번 칸(vw)만 11로 바꿨습니다. 중간값은 1·v·v² 열에 적고, u는 u²=−1을 만족하는 Fq2의 단위입니다."
      ariaLabel="인자 11이 bb를 만들고 v를 곱해 첫 칸으로 되돌아오는 순서"
    />
  );
}
