import SceneShell from "./SceneShell";

/**
 * 본문 대응: #artifact-repair — 결과가 31개일 때 실패한 개수 조건만 고치고 네 조건을 다시 확인한다.
 * 검사 네 가지: 32개 · PING 일치 · 공백 31개 · 추가 설명 없음. passes는 모두 통과할 때까지 false.
 * 31개면 공백은 31 − 1 = 30개라 공백 조건도 함께 어긋난다(산술).
 */
type Mark = "wait" | "ok" | "bad";

interface Scene {
  label: string;
  summary: string;
  items: number;
  marks: readonly [Mark, Mark, Mark, Mark];
  passes: boolean;
  note: string;
}

const CHECKS = ["PING 32개", "각 항목이 PING", "공백 31개", "추가 설명 없음"] as const;

const SCENES: readonly Scene[] = [
  {
    label: "검사 전",
    summary: "passes: false",
    items: 31,
    marks: ["wait", "wait", "wait", "wait"],
    passes: false,
    note: "(가정) 생성된 결과에 PING이 31개 들어 있습니다. 검사를 통과하기 전이므로 passes는 처음부터 false입니다. 모델이 끝났다고 말해도 이 값은 바뀌지 않습니다.",
  },
  {
    label: "독립 검사",
    summary: "두 조건 실패",
    items: 31,
    marks: ["bad", "ok", "bad", "ok"],
    passes: false,
    note: "개수는 31이라 실패입니다. 공백은 31 − 1 = 30개라 같은 원인으로 어긋납니다. 각 항목이 PING인지와 추가 설명이 없는지는 통과합니다.",
  },
  {
    label: "실패한 부분만 수정",
    summary: "PING 1개 추가",
    items: 32,
    marks: ["wait", "wait", "wait", "wait"],
    passes: false,
    note: "(가정) 전체를 다시 생성하지 않고 끝에 공백 하나와 PING 하나를 더합니다. 앞의 31개는 그대로 둡니다. 고친 직후에도 다시 검사하기 전이라 passes는 false입니다.",
  },
  {
    label: "네 조건 다시 검사",
    summary: "passes: true",
    items: 32,
    marks: ["ok", "ok", "ok", "ok"],
    passes: true,
    note: "고친 개수 조건뿐 아니라 이미 통과했던 문자열·추가 설명 조건도 다시 확인합니다. 네 조건이 모두 맞아야 passes가 true가 됩니다.",
  },
];

const COLOR: Record<Mark, string> = { wait: "#94a3b8", ok: "#16a34a", bad: "#dc2626" };
const TEXT: Record<Mark, string> = { wait: "미확인", ok: "통과", bad: "실패" };

const TILE = 11;
const GAP = 3.6;
const tileX = (i: number) => 8 + i * (TILE + GAP);

export default function RepairCheckViz() {
  return (
    <SceneShell
      eyebrow="검사와 부분 수정"
      title="31개짜리 결과는 한 칸만 고치고 네 조건을 다시 봅니다"
      description="위 줄은 출력의 PING 칸(파란 칸은 이번에 더한 칸)이고, 아래 네 줄이 독립 검사 결과입니다. passes는 검사 상태를 남기는 값입니다."
      ariaLabel="PING 31개 결과가 개수와 공백 검사에서 실패하고 한 칸을 더한 뒤 네 조건을 다시 통과하는 과정"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 480 40" role="img" aria-label={`PING ${s.items}개`} className="block h-auto w-full">
              {Array.from({ length: 32 }, (_, i) => {
                const present = i < s.items;
                const added = present && i === 31;
                return (
                  <rect
                    key={i}
                    x={tileX(i)}
                    y={9}
                    width={TILE}
                    height={22}
                    rx={2}
                    fill={added ? "#dbeafe" : present ? "#e2e8f0" : "none"}
                    stroke={added ? "#2563eb" : present ? "#64748b" : "#cbd5e1"}
                    strokeDasharray={present ? undefined : "2 2"}
                    strokeWidth={1}
                  />
                );
              })}
            </svg>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {CHECKS.map((c, i) => {
                const m = s.marks[i];
                return (
                  <li key={c} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: COLOR[m] }}>
                    <span>{c}</span>
                    <span className="text-xs font-bold" style={{ color: COLOR[m] }}>{TEXT[m]}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 font-mono text-sm">
              &quot;passes&quot;: <span className="font-bold" style={{ color: s.passes ? "#16a34a" : "#dc2626" }}>{s.passes ? "true" : "false"}</span>
            </p>
          </div>
        );
      }}
    />
  );
}
