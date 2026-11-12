import SceneShell from "./SceneShell";

/**
 * 본문 대응: #form-domain — 같은 칸별 곱셈이 coefficient form과 evaluation form에서 다른 뜻을 갖는다.
 * f=1+2X(본문), h=3+X(가정). 정수로 단순화했고 평가점 0·1·2도 가정이다(실제 kernel은 ω-domain 점).
 * f·h = 3+7X+2X² → 0·1·2에서 3·12·25.
 * 계수끼리 곱: (1,2,0)×(3,1,0) = (3,2,0) = 3+2X ≠ f·h.
 * 같은 점 평가끼리 곱: (1,3,5)×(3,4,5) = (3,12,25) = f·h의 값.
 * 다른 점(h는 1·2·3): (1,3,5)×(4,5,6) = (4,15,30) ≠ (3,12,25).
 */
interface Row {
  name: string;
  tags: readonly string[];
  values: readonly number[];
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  f: Row;
  h: Row;
  target: Row;
  ok: boolean;
}

const COEFF_TAGS = ["X⁰", "X¹", "X²"] as const;
const POINTS_A = ["x=0", "x=1", "x=2"] as const;
const POINTS_B = ["x=1", "x=2", "x=3"] as const;

const SCENES: readonly Scene[] = [
  {
    label: "Coefficient form에서 칸끼리 곱",
    summary: "(3, 2, 0) = 3+2X ≠ f·h",
    note: "칸에 든 것이 계수이면 칸끼리 곱한 (3, 2, 0)은 3+2X일 뿐입니다. 실제 곱 f·h = 3+7X+2X²의 계수 (3, 7, 2)와 다릅니다. 계수 표현에서 곱을 얻으려면 계수를 서로 엇갈려 곱해 더하는 convolution이 필요합니다.",
    f: { name: "f 계수", tags: COEFF_TAGS, values: [1, 2, 0] },
    h: { name: "h 계수", tags: COEFF_TAGS, values: [3, 1, 0] },
    target: { name: "f·h 계수", tags: COEFF_TAGS, values: [3, 7, 2] },
    ok: false,
  },
  {
    label: "Evaluation form에서 칸끼리 곱",
    summary: "(3, 12, 25) = f·h의 값",
    note: "칸에 든 것이 같은 점에서의 값이면 f(x)·h(x)는 곧 (f·h)(x)입니다. 칸끼리 곱한 (3, 12, 25)는 f·h를 0·1·2에서 평가한 값과 같습니다. 이 값을 다시 계수로 돌리면 (3, 7, 2), 즉 계수 convolution 결과가 나옵니다. 곱이 2차라 점을 세 개 두었습니다.",
    f: { name: "f 값", tags: POINTS_A, values: [1, 3, 5] },
    h: { name: "h 값", tags: POINTS_A, values: [3, 4, 5] },
    target: { name: "f·h 값", tags: POINTS_A, values: [3, 12, 25] },
    ok: true,
  },
  {
    label: "점이 다른 evaluation끼리 곱",
    summary: "(4, 15, 30) ≠ (3, 12, 25)",
    note: "h를 1·2·3에서 평가한 배열이라고 해 봅시다(가정). 길이도 원소 타입도 같아 곱셈은 실행되지만 첫 칸은 f(0)·h(1) = 4로, f·h(0) = 3과 다릅니다. Domain이나 coset이 다른 evaluation끼리는 길이가 같아도 호환되지 않습니다.",
    f: { name: "f 값", tags: POINTS_A, values: [1, 3, 5] },
    h: { name: "h 값", tags: POINTS_B, values: [4, 5, 6] },
    target: { name: "f·h 값", tags: POINTS_A, values: [3, 12, 25] },
    ok: false,
  },
];

function Cells({ row, mismatchTags, emphasis }: { row: Row; mismatchTags?: boolean; emphasis?: "ok" | "bad" }) {
  const border = emphasis === "ok" ? "border-emerald-600" : emphasis === "bad" ? "border-red-600" : "border-border";
  return (
    <div className="grid grid-cols-[4.5rem_repeat(3,minmax(0,1fr))] items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground">{row.name}</span>
      {row.values.map((value, index) => (
        <span key={index} className={`rounded-md border bg-background px-1 py-1.5 text-center ${border}`}>
          <span className="block font-mono text-sm font-bold">{value}</span>
          <span className={`block text-[10px] ${mismatchTags ? "font-semibold text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>{row.tags[index]}</span>
        </span>
      ))}
    </div>
  );
}

export default function PointwiseMeaningViz() {
  return (
    <SceneShell
      eyebrow="같은 곱셈, 다른 뜻"
      title="칸끼리 곱하기는 칸에 무엇이 들었는지에 따라 뜻이 바뀝니다"
      description="f = 1+2X에 h = 3+X를 곱합니다. h, 정수 계산, 평가점 0·1·2는 설명을 위한 가정이며 실제 kernel은 field 위의 ω-domain 점을 씁니다. 각 칸 아래 작은 글씨가 그 칸의 뜻입니다."
      ariaLabel="계수 표현과 평가 표현에서 칸별 곱셈 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const product: Row = {
          name: "칸별 곱",
          tags: scene.f.tags.map((tag, index) => (tag === scene.h.tags[index] ? tag : "점 다름")),
          values: scene.f.values.map((value, index) => value * scene.h.values[index]),
        };
        return (
          <div className="min-w-0 space-y-2">
            <Cells row={scene.f} />
            <Cells row={scene.h} mismatchTags={active === 2} />
            <div className="border-t border-border pt-2">
              <Cells row={product} emphasis={scene.ok ? "ok" : "bad"} />
            </div>
            <Cells row={scene.target} />
            <p className={`pt-1 text-center text-sm font-bold ${scene.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
              {scene.ok ? "칸별 곱 = 실제 곱 f·h" : "칸별 곱 ≠ 실제 곱 f·h"}
            </p>
          </div>
        );
      }}
    />
  );
}
