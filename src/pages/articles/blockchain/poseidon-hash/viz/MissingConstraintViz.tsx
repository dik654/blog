import SceneShell from "./SceneShell";

/**
 * 본문 대응: #constraint-failure — 첫 칸 a=4의 다섯제곱 u·v·y (mod 17).
 * 올바른 y=4 → (11,1). y=5를 넣으면 y=v×a에서 1×4=4≠5로 거부.
 * 마지막 식을 빼면 y=5가 통과해 (5+7, 5+2×7) = (12,2).
 */
type Status = "ok" | "fail" | "none";

const SCENES = [
  {
    label: "세 식이 모두 있을 때",
    summary: "y=4 → (11,1)",
    y: 4,
    checks: ["ok", "ok", "ok"] as Status[],
    output: "(4+7, 4+2×7) = (11, 18≡1)",
    verdict: "통과 · 올바른 결과",
    note: "u=4×4=16, v=16×16=256≡1, y=1×4=4입니다. 세 식이 각 중간값을 앞 값에 묶으므로 둘째 칸의 7과 섞은 결과 (11,1)만 남습니다.",
  },
  {
    label: "y=5를 제출하면",
    summary: "1×4=4 ≠ 5 → 거부",
    y: 5,
    checks: ["ok", "ok", "fail"] as Status[],
    output: "제출하려던 (5+7, 5+2×7) = (12, 19≡2)",
    verdict: "거부 · 마지막 식이 어긋남",
    note: "거짓 y=5를 쓰면 앞의 두 식은 맞아도 y=v×a 식에서 1×4=4가 5와 달라집니다. 중간값을 제출해도 거짓 계산은 해당 곱셈 식에서 어긋납니다.",
  },
  {
    label: "마지막 식을 뺀 회로",
    summary: "y=5 → (12,2) 통과",
    y: 5,
    checks: ["ok", "ok", "none"] as Status[],
    output: "(5+7, 5+2×7) = (12, 19≡2)",
    verdict: "통과 · 원래 (11,1)과 다른 결과",
    note: "y=v×a 조건이 없으면 y는 앞의 계산과 연결되지 않습니다. 같은 y=5가 이번에는 거부되지 않아 (12,2)가 통과합니다. Poseidon을 해독한 것이 아니라 구현한 증명 관계가 의도한 계산과 달라진 것입니다.",
  },
] as const;

const ROWS = [
  { expr: "u = a × a", calc: "4 × 4 = 16" },
  { expr: "v = u × u", calc: "16 × 16 = 256 ≡ 1" },
  { expr: "y = v × a", calc: "1 × 4 = 4" },
] as const;

const STATUS_TEXT: Record<Status, string> = { ok: "만족", fail: "불일치", none: "검사 없음" };
const STATUS_COLOR: Record<Status, string> = { ok: "#16a34a", fail: "#dc2626", none: "#94a3b8" };

export default function MissingConstraintViz() {
  return (
    <SceneShell
      eyebrow="곱셈 제약 하나의 빈자리"
      title="y = v × a 한 줄이 빠지면 y=5가 통과합니다"
      description="첫 칸 a=4의 다섯제곱을 곱셈 세 번으로 검사합니다. 모든 수는 17로 나눈 나머지이고 둘째 칸의 올바른 결과 7은 그대로 둡니다."
      ariaLabel="다섯제곱의 마지막 곱셈 제약 유무에 따른 y=5 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-2 text-xs text-muted-foreground">
              <span>제약 식 · 올바른 값</span>
              <span>제출 y = <b className="font-mono text-foreground">{scene.y}</b></span>
            </div>
            {ROWS.map((row, index) => {
              const status = scene.checks[index];
              return (
                <div key={row.expr} className={`grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-3 rounded-md border px-3 py-2 ${status === "none" ? "border-dashed border-border" : "border-border"}`}>
                  <div className="min-w-0">
                    <p className={`font-mono text-sm font-bold ${status === "none" ? "text-muted-foreground line-through" : ""}`}>{row.expr}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {row.calc}
                      {status === "fail" ? <b className="text-[#dc2626]"> ≠ 제출 y {scene.y}</b> : null}
                    </p>
                  </div>
                  <span className="text-right text-xs font-bold" style={{ color: STATUS_COLOR[status] }}>
                    {status === "ok" ? "✓ " : status === "fail" ? "✗ " : "– "}
                    {STATUS_TEXT[status]}
                  </span>
                </div>
              );
            })}
            <div className="grid gap-1 pt-2 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-3">
              <span className="font-mono">{scene.output}</span>
              <span className="font-bold" style={{ color: scene.checks.includes("fail") ? "#dc2626" : scene.y === 4 ? "#16a34a" : "#b45309" }}>{scene.verdict}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
