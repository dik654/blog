import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #prover-rounds quotient ExplainedFormula —
 * 모든 행이 만족되면 결합한 분자 N은 domain 각 점에서 0 → N = T·Z_H. v0.22.1은 T를 degree-n 네 조각으로 약정.
 * 실패 예는 #circuit-composer의 z=11 fixture: 세 번째 행이 12−11=1을 남기고, 재현 실행에서 prove가
 * PolynomialDegreeTooLarge를 반환했다(오류 이름의 원인 해석은 하지 않음).
 */
const ROWS = [
  { name: "곱셈 행", ok: "3·4 − 12 = 0", bad: "3·4 − 12 = 0" },
  { name: "공개 행", ok: "−12 + 12 = 0", bad: "−11 + 11 = 0" },
  { name: "같음 행", ok: "12 − 12 = 0", bad: "12 − 11 = 1" },
] as const;

const SCENES = [
  { label: "행마다 N = 0", summary: "모든 domain 점에서 0 → Z_H로 나누어떨어짐", mode: "ok", note: "Gate·permutation·public-input 관계를 challenge로 결합한 분자 N은, 모든 행이 만족되면 domain의 각 점에서 0입니다. Z_H는 바로 그 점들에서 0인 polynomial이므로 N = T·Z_H로 나누어떨어집니다." },
  { label: "공개 z = 11이면", summary: "같음 행이 1을 남김 → 나누어떨어지지 않음", mode: "bad", note: "같은 fixture에 공개 z=11을 넣으면 세 번째 행이 12−11=1을 남깁니다. Z_H는 그 점에서 0인데 N은 0이 아니므로 N을 Z_H로 나눈 몫은 polynomial이 되지 않습니다. v0.22.1 재현 실행에서 prove는 PolynomialDegreeTooLarge를 반환했습니다. 이 오류 이름을 일반적인 '회로 불만족' 오류로 읽지는 않습니다." },
  { label: "T를 네 조각으로", summary: "T = T₀ + XⁿT₁ + X²ⁿT₂ + X³ⁿT₃", mode: "split", note: "나누어떨어진 몫 T의 계수를 n개씩 끊어 네 조각 T₀~T₃로 만들고, 조각마다 하나씩 약정합니다. Xⁿ, X²ⁿ, X³ⁿ은 각 조각을 원래 자리로 밀어 놓는 자리 이동입니다." },
] as const;

const PIECES = ["T₀", "T₁", "T₂", "T₃"] as const;
const SHIFT = ["", "Xⁿ·", "X²ⁿ·", "X³ⁿ·"] as const;
const PIECE_COLOR = ["#2563eb", "#7c3aed", "#d97706", "#16a34a"] as const;

function RowsPanel({ bad }: { bad: boolean }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border text-xs leading-5">
      <div className="grid grid-cols-[4.25rem_minmax(0,1fr)_2.5rem_2.5rem] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_3.5rem_3.5rem] bg-background font-bold text-muted-foreground">
        <span className="px-2 py-1.5">행</span>
        <span className="px-2 py-1.5">gate 항</span>
        <span className="px-2 py-1.5 text-center">N</span>
        <span className="px-2 py-1.5 text-center">Z_H</span>
      </div>
      {ROWS.map((row) => {
        const text = bad ? row.bad : row.ok;
        const nonzero = text.endsWith("= 1");
        return (
          <div key={row.name} className={`grid grid-cols-[4.25rem_minmax(0,1fr)_2.5rem_2.5rem] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_3.5rem_3.5rem] ${nonzero ? "bg-red-50 dark:bg-red-950/40" : "bg-background"}`}>
            <span className="break-keep px-2 py-1.5">{row.name}</span>
            <span className="whitespace-nowrap px-2 py-1.5 font-mono text-[11px] sm:text-xs">{text}</span>
            <span className={`px-2 py-1.5 text-center font-mono font-bold ${nonzero ? "text-red-700 dark:text-red-400" : ""}`}>{nonzero ? "≠0" : "0"}</span>
            <span className="px-2 py-1.5 text-center font-mono">0</span>
          </div>
        );
      })}
      <div className="grid grid-cols-[4.25rem_minmax(0,1fr)_2.5rem_2.5rem] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_3.5rem_3.5rem] bg-background text-muted-foreground">
        <span className="px-2 py-1.5">나머지 행</span>
        <span className="px-2 py-1.5">상수·dummy 생략</span>
        <span className="px-2 py-1.5 text-center font-mono">0</span>
        <span className="px-2 py-1.5 text-center font-mono">0</span>
      </div>
    </div>
  );
}

function SplitPanel() {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-bold text-muted-foreground">T의 계수 (낮은 차수 → 높은 차수)</p>
      <div className="grid grid-cols-4 gap-1">
        {PIECES.map((piece, index) => (
          <div key={piece} className="min-w-0">
            <svg viewBox="0 0 80 18" className="h-auto w-full" aria-hidden>
              {Array.from({ length: 8 }, (_, k) => (
                <rect key={k} x={1 + k * 9.75} y={1} width={8.5} height={16} rx={1.5} fill={PIECE_COLOR[index]} fillOpacity={0.75} />
              ))}
            </svg>
            <p className="mt-1 text-center text-[10px] text-muted-foreground">n개</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1 text-center text-xs leading-5">
        {PIECES.map((piece, index) => (
          <div key={piece} className="min-w-0 rounded-md border border-border bg-background px-1 py-1.5">
            <span className="block font-mono font-bold" style={{ color: PIECE_COLOR[index] }}>{SHIFT[index]}{piece}</span>
            <span className="block font-mono text-[10px] text-muted-foreground">[{piece}]</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">칸 8개는 n을 그린 기호일 뿐 실제 n이 아닙니다(가정). 아래 [T₀]~[T₃]가 약정 네 개입니다.</p>
    </div>
  );
}

export default function QuotientSplitViz() {
  return (
    <SceneShell
      eyebrow="몫 다항식 T"
      title="모든 행에서 0이어야 Z_H로 나누어떨어지고, 그 몫을 네 조각으로 약정합니다"
      description="domain 점은 회로의 각 행에 대응하는 평가점이고, Z_H는 그 점들에서 모두 0인 vanishing polynomial입니다. 표의 한 줄이 한 행의 domain 점이고, N은 결합한 분자의 그 점에서의 값입니다."
      ariaLabel="결합 분자 N이 모든 행에서 0일 때 vanishing polynomial로 나누어떨어지고 몫이 네 조각으로 약정되는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="min-w-0">
              {scene.mode === "split" ? <SplitPanel /> : <RowsPanel bad={scene.mode === "bad"} />}
            </div>
          ))}
        />
      )}
    />
  );
}
