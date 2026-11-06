import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #jit-specialization — autotune 장부(key별 best)와 JIT 장부(variant binary)는 다른 장부입니다.
 * Config 6개, shape 2개: 평가는 6개씩 두 차례. 속성이 같으면 두 번째 새 컴파일 0, 다르면 일부 또는 전부.
 * 같은 key가 다시 오면 평가 0, 컴파일 0.
 */
type Binary = "empty" | "new" | "reuse" | "kept" | "maybe";

interface LedgerScene extends ShellScene {
  bestA: "empty" | "busy" | "kept";
  bestB: "empty" | "busy" | "kept";
  first: Binary;
  second: Binary;
}

const SCENES: readonly LedgerScene[] = [
  { label: "처음 보는 shape", summary: "평가 6 · 새 컴파일 6", note: "Key가 처음이라 config 6개를 전부 실행하고 binary를 새로 컴파일합니다(가정: 시작할 때 JIT cache가 비어 있음).", bestA: "busy", bestB: "empty", first: "new", second: "empty" },
  { label: "둘째 shape · 속성 같음", summary: "평가 6 · 새 컴파일 0", note: "평가는 다시 6개지만 dtype·runtime 속성이 같으면 앞의 binary를 다시 실행할 수 있습니다. 평가 12번이 컴파일 12번은 아닙니다.", bestA: "kept", bestB: "busy", first: "reuse", second: "empty" },
  { label: "둘째 shape · 속성 다름", summary: "평가 6 · 새 컴파일 일부~전부", note: "속성이 다르면 일부 또는 전부가 새 variant입니다. Variant 수는 실제 cache key 종류로 셉니다.", bestA: "kept", bestB: "busy", first: "kept", second: "maybe" },
  { label: "같은 key 재요청", summary: "평가 0 · 새 컴파일 0", note: "기억한 best config를 바로 씁니다(오른쪽은 속성이 같았던 경우로 그렸습니다). 그래서 cold compile, cold autotune, warm launch를 따로 재야 합니다.", bestA: "kept", bestB: "kept", first: "kept", second: "empty" },
];

const BEST_TEXT = { empty: "비어 있음", busy: "6개 평가 중", kept: "best 기억" };
const BINARY: Record<Binary, { background: string; borderColor: string; text: string; dashed: boolean }> = {
  empty: { background: "transparent", borderColor: "#94a3b866", text: "", dashed: true },
  new: { background: "#d9770633", borderColor: "#d97706", text: "새로", dashed: false },
  reuse: { background: "#2563eb2e", borderColor: "#2563eb", text: "재사용", dashed: false },
  kept: { background: "#94a3b81f", borderColor: "#94a3b8", text: "보관", dashed: false },
  maybe: { background: "#d9770614", borderColor: "#d97706", text: "?", dashed: true },
};

function BestRow({ name, state }: { name: string; state: "empty" | "busy" | "kept" }) {
  return (
    <p className={`flex min-w-0 flex-col gap-0.5 rounded-sm border px-1.5 py-1 text-[11px] leading-4 sm:text-xs ${state === "busy" ? "border-[#d97706] font-bold" : state === "kept" ? "border-[#2563eb]" : "border-dashed border-border text-muted-foreground"}`}>
      <span className="font-mono">{name}</span>
      <span>{BEST_TEXT[state]}</span>
    </p>
  );
}

function BinaryRow({ name, state }: { name: string; state: Binary }) {
  const look = BINARY[state];
  return (
    <div className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] items-center gap-1.5 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
      <p className="text-[11px] leading-4 text-muted-foreground">{name}</p>
      <div className="grid min-w-0 grid-cols-6 gap-0.5 sm:gap-1">
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <span key={id} className="flex h-10 min-w-0 flex-col items-center justify-center rounded-sm border text-center font-mono text-[10px] leading-3" style={{ background: look.background, borderColor: look.borderColor, borderStyle: look.dashed ? "dashed" : "solid" }}>
            <span>c{id}</span>
            <span className="mt-0.5 block text-[9px] sm:text-[10px]">{look.text || "−"}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TwoLedgersViz() {
  return (
    <SceneShell
      eyebrow="두 장부"
      title="Autotune 장부와 JIT 장부는 따로 찹니다"
      description="왼쪽은 autotune key별 best config입니다. 오른쪽의 칸 c1~c6은 config 6개가 만든 cache key 6종의 binary이고, 줄은 dtype·runtime 속성 조합입니다."
      note="평가 1회도 warmup과 반복 측정을 거치므로 launch 횟수로 읽으면 안 됩니다."
      ariaLabel="shape 요청마다 autotune 장부와 JIT 장부가 어떻게 채워지는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 gap-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-4">
              <div className="min-w-0">
                <p className="mb-1 text-xs font-bold">Autotune 장부 · key는 (M, N, K)</p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-1">
                  <BestRow name="key ①" state={scene.bestA} />
                  <BestRow name="key ②" state={scene.bestB} />
                </div>
              </div>
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-bold">JIT 장부 · 칸 하나가 cache key 하나</p>
                <BinaryRow name="속성 ①" state={scene.first} />
                <BinaryRow name="속성 ②" state={scene.second} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
