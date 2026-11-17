import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #preprocess — compile은 C::default()로 합성해 같은 순서의 rows·public-input 위치·copy wiring만
 * 고정한다. prove 때 행이 하나 더 생기거나 순서가 바뀌면 InvalidCircuitSize.
 * 행 모양은 #circuit-composer의 세 행(곱셈·공개·같음). Composer::initialized의 상수·dummy 행은 생략.
 */
const ROWS = [
  { name: "곱셈", shape: "qM·ab + qO·c", value: "a=3 · b=4 · c=12" },
  { name: "공개", shape: "−a + PI", value: "a=12 · PI=12" },
  { name: "같음", shape: "a − b", value: "a=12 · b=12" },
] as const;

const SCENES = [
  {
    label: "Compile: C::default()",
    summary: "값이 아니라 행 모양을 고정",
    mode: "compile",
    note: "Compile은 기본값으로 circuit을 합성합니다. 이때 쓰이는 것은 실제 3과 4가 아니라 행의 순서, public-input 위치, copy wiring입니다. 이 모양에서 selector·sigma polynomials와 그 KZG commitments(verifier key)가 나옵니다.",
  },
  {
    label: "Prove: 실제 witness",
    summary: "같은 행 · 같은 순서 · 실제 값",
    mode: "prove",
    note: "Prove는 같은 synthesis 경로를 실제 witness로 다시 실행합니다. 행 모양이 compile 때와 같으므로 미리 고정한 selector·sigma와 맞물립니다.",
  },
  {
    label: "Prove에서 행이 하나 더",
    summary: "constraint 수 불일치 → InvalidCircuitSize",
    mode: "extra",
    note: "Prove 때 circuit이 행을 하나 더 만들거나 순서를 바꾸면 compile 때의 constraint 수와 맞지 않아 InvalidCircuitSize가 납니다. 같은 Rust struct 이름보다 같은 synthesis 경로가 중요한 이유입니다.",
  },
] as const;

const GRID = "grid grid-cols-[2.25rem_minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,1.1fr)] sm:grid-cols-[3rem_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)]";

function Ledger({ mode }: { mode: "compile" | "prove" | "extra" }) {
  const proveTone = mode === "compile" ? "text-muted-foreground/40" : "";
  const extra = mode === "extra";
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border text-[11px] leading-5 sm:text-xs">
      <div className={`${GRID} bg-background font-bold text-muted-foreground`}>
        <span className="px-1.5 py-1.5">행</span>
        <span className="px-1.5 py-1.5">행 모양</span>
        <span className="px-1.5 py-1.5">compile 값</span>
        <span className={`px-1.5 py-1.5 ${proveTone}`}>prove 값</span>
      </div>
      {ROWS.map((row, index) => (
        <div key={row.name} className={`${GRID} bg-background`}>
          <span className="px-1.5 py-1.5 font-mono text-primary">{index + 1}</span>
          <span className="min-w-0 break-keep px-1.5 py-1.5"><b>{row.name}</b> <span className="font-mono text-muted-foreground">{row.shape}</span></span>
          <span className="px-1.5 py-1.5 text-muted-foreground">기본값</span>
          <span className={`min-w-0 break-keep px-1.5 py-1.5 font-mono ${proveTone}`}>{row.value}</span>
        </div>
      ))}
      <div className={`${GRID} ${extra ? "bg-red-50 dark:bg-red-950/40" : "bg-background"}`}>
        <span className={`px-1.5 py-1.5 font-mono ${extra ? "text-red-700 dark:text-red-400" : "text-muted-foreground/40"}`}>4</span>
        <span className="px-1.5 py-1.5 text-muted-foreground/50">—</span>
        <span className="px-1.5 py-1.5 text-muted-foreground/50">없음</span>
        <span className={`min-w-0 break-keep px-1.5 py-1.5 ${extra ? "font-bold text-red-700 dark:text-red-400" : "text-muted-foreground/40"}`}>{extra ? "추가된 constraint" : "없음"}</span>
      </div>
    </div>
  );
}

export default function SynthesisShapeViz() {
  return (
    <SceneShell
      eyebrow="Compile과 prove의 행 모양"
      title="Compile이 고정하는 것은 값이 아니라 행의 순서와 개수입니다"
      description="한 줄이 Composer 행 하나입니다. compile 값 열은 C::default()로 합성할 때, prove 값 열은 실제 witness로 합성할 때의 값입니다. 상수·dummy 행은 생략했습니다."
      ariaLabel="compile과 prove가 같은 행 모양을 써야 하는 이유와 행이 늘었을 때의 오류"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="min-w-0">
              <Ledger mode={scene.mode} />
              <p className="mt-3 rounded-md border border-border px-3 py-2 text-xs leading-5">
                {scene.mode === "compile" && <><b>고정</b> <span className="text-muted-foreground">행 순서 · public-input 위치 · copy wiring → selector · σ → verifier key</span></>}
                {scene.mode === "prove" && <><b>일치</b> <span className="text-muted-foreground">compile과 같은 행 수 · 같은 순서</span></>}
                {scene.mode === "extra" && <><b className="text-red-700 dark:text-red-400">불일치</b> <span className="text-muted-foreground">prove 행 수 = compile 행 수 + 1 → InvalidCircuitSize</span></>}
              </p>
            </div>
          ))}
        />
      )}
    />
  );
}
