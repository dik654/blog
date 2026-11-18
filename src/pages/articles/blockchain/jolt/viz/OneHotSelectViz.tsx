import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 축약 메모리 [0,3,4,0]과 선택 벡터를 자리별로 곱해 더한다.
 * 위치 1 [0,1,0,0] → 3, 위치 2 [0,0,1,0] → 4, 위치 3 [0,0,0,1]×변화량 7 → [0,3,4,7].
 * 두 칸 선택·분수 선택은 본문이 말한 잘못된 경우를 보이려는 가정 예시다:
 * [0,1,1,0] → 3+4=7 (합 2), [0,½,½,0] → 1.5+2=3.5 (0·1 아님).
 */
const MEMORY: readonly number[] = [0, 3, 4, 0];

type Mode = "read" | "write";

const SCENES = [
  {
    label: "위치 1 읽기",
    summary: "[0,1,0,0] → 3",
    mode: "read" as Mode,
    sel: ["0", "1", "0", "0"],
    weights: [0, 1, 0, 0],
    valid: true,
    check: "모두 0·1 ✓ · 합 1 ✓",
    note: "선택 벡터와 메모리를 같은 자리끼리 곱하면 위치 1의 3만 남고 나머지는 0이 됩니다. 이 곱들을 더한 3이 읽은 값입니다.",
  },
  {
    label: "위치 2 읽기",
    summary: "[0,0,1,0] → 4",
    mode: "read" as Mode,
    sel: ["0", "0", "1", "0"],
    weights: [0, 0, 1, 0],
    valid: true,
    check: "모두 0·1 ✓ · 합 1 ✓",
    note: "1의 자리를 위치 2로 옮기면 같은 곱셈과 덧셈이 4를 남깁니다. 주소가 바뀌어도 계산 방식은 그대로입니다.",
  },
  {
    label: "위치 3에 7 쓰기",
    summary: "[0,3,4,0] → [0,3,4,7]",
    mode: "write" as Mode,
    sel: ["0", "0", "0", "1"],
    weights: [0, 0, 0, 1],
    valid: true,
    check: "모두 0·1 ✓ · 합 1 ✓",
    note: "쓰기에서는 선택 벡터 [0,0,0,1]에 변화량 7을 곱해 [0,0,0,7]을 만들고 메모리에 더합니다. 위치 3만 0에서 7로 바뀝니다.",
  },
  {
    label: "두 칸을 고르면",
    summary: "[0,1,1,0] → 3+4 = 7",
    mode: "read" as Mode,
    sel: ["0", "1", "1", "0"],
    weights: [0, 1, 1, 0],
    valid: false,
    check: "모두 0·1 ✓ · 합 2 ✗",
    note: "값이 모두 0·1이어도 합이 2이면 두 위치를 한꺼번에 고른 것이라 주소 하나를 뜻하지 않습니다. 이 벡터는 잘못된 경우를 보이려는 가정 예시입니다.",
  },
  {
    label: "분수로 섞으면",
    summary: "[0,½,½,0] → 1.5+2 = 3.5",
    mode: "read" as Mode,
    sel: ["0", "½", "½", "0"],
    weights: [0, 0.5, 0.5, 0],
    valid: false,
    check: "0·1 아님 ✗ · 합 1 ✓",
    note: "합이 1이어도 칸 값이 ½이면 두 위치를 섞은 3.5가 나옵니다. 각 값이 0 또는 1이고 합이 1이라는 두 조건을 함께 검사해야 주소 하나가 됩니다. 이 벡터도 가정 예시입니다.",
  },
] as const;

const fmt = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

function Cell({ children, tone = "plain" }: { children: string; tone?: "plain" | "hit" | "bad" | "dim" }) {
  const cls =
    tone === "hit"
      ? "border-blue-600 bg-blue-600/10 font-bold text-blue-700 dark:text-blue-300"
      : tone === "bad"
        ? "border-red-600 bg-red-600/10 font-bold text-red-700 dark:text-red-300"
        : tone === "dim"
          ? "border-border text-muted-foreground/60"
          : "border-border";
  return <div className={`min-w-0 whitespace-nowrap rounded-md border px-0.5 py-1.5 text-center font-mono text-xs sm:text-sm ${cls}`}>{children}</div>;
}

export default function OneHotSelectViz() {
  return (
    <SceneShell
      eyebrow="선택 벡터"
      title="한 칸만 1인 벡터를 곱하면 그 위치의 값만 남습니다"
      description="칸 넷은 위치 0~3의 축약 메모리이며 실제 레지스터 수가 아닙니다. 본문의 [0,3,4,0]과 변화량 7을 쓰고, 마지막 두 장면의 벡터는 가정 예시입니다."
      ariaLabel="선택 벡터와 메모리를 자리별로 곱해 읽기와 쓰기를 표현하고, 두 칸 선택과 분수 선택이 주소 하나가 아닌 이유를 보이는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const write = scene.mode === "write";
        const third = (scene.weights as readonly number[]).map((w, i) => (write ? w * 7 : w * MEMORY[i]));
        const readSum = third.reduce<number>((sum, value) => sum + value, 0);
        const after = MEMORY.map((m, i) => m + (write ? third[i] : 0));
        const selTone = scene.valid ? "hit" : "bad";
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-[3.75rem_repeat(4,minmax(0,1fr))_4.5rem] items-center gap-1.5 text-xs sm:grid-cols-[6rem_repeat(4,minmax(0,1fr))_8rem] sm:gap-2">
              <span />
              {MEMORY.map((_, i) => (
                <span key={`h-${i}`} className="whitespace-nowrap text-center text-[10px] text-muted-foreground sm:text-[11px]">위치 {i}</span>
              ))}
              <span className="text-right text-[11px] text-muted-foreground">결과</span>

              <span className="font-semibold">메모리</span>
              {MEMORY.map((m, i) => (
                <Cell key={`m-${i}`}>{String(m)}</Cell>
              ))}
              <span />

              <span className="font-semibold">선택 벡터</span>
              {(scene.sel as readonly string[]).map((v, i) => (
                <Cell key={`s-${i}`} tone={v === "0" ? "dim" : selTone}>{v}</Cell>
              ))}
              <span className={`text-right text-[11px] leading-4 ${scene.valid ? "text-blue-700 dark:text-blue-300" : "text-red-700 dark:text-red-300"}`}>
                {scene.check}
              </span>

              <span className="font-semibold">{write ? "선택×7" : "자리별 곱"}</span>
              {third.map((v, i) => (
                <Cell key={`p-${i}`} tone={v === 0 ? "dim" : selTone}>{fmt(v)}</Cell>
              ))}
              <span className="text-right font-mono text-sm font-bold">{write ? "더함 ↓" : `합 ${fmt(readSum)}`}</span>

              <span className="font-semibold">쓴 뒤 메모리</span>
              {after.map((v, i) => (
                <Cell key={`a-${i}`} tone={write ? (v !== MEMORY[i] ? "hit" : "plain") : "dim"}>
                  {write ? String(v) : "−"}
                </Cell>
              ))}
              <span className="text-right font-mono text-sm font-bold">{write ? "[0,3,4,7]" : "읽기만"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
