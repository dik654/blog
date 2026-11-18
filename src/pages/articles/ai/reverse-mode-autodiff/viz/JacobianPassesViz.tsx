import SceneShell from "./SceneShell";

/**
 * 본문 대응: 9절 마지막 문단 — 조밀한 전체 Jacobian에는 입력 n개면 forward 방향 n개, 출력 m개면 reverse 방향 m개.
 * 일반 격자 m=2, n=5는 가정. 이 글의 사례는 출력 L 1개, 입력 w·x·b 3개 → reverse 1번에 (26,39,13), forward는 3번.
 */
const M = 2;
const N = 5;

const SCENES = [
  { label: "모든 편미분 표", summary: "출력 2 × 입력 5 = 10칸 (가정)", note: "Jacobian은 출력 하나를 입력 하나에 대해 미분한 값을 칸마다 담은 표입니다. 행은 출력, 열은 입력입니다. 크기 2×5는 그림을 위한 가정입니다." },
  { label: "Forward mode: 한 번에 한 열", summary: "입력 5개 → forward 방향 5번", note: "Forward mode는 입력 방향 하나를 정해 앞으로 따라가며 JVP를 구합니다. 한 번 통과하면 그 입력의 열 하나가 채워지므로 전체 표에는 입력 수만큼 5번이 필요합니다." },
  { label: "Reverse mode: 한 번에 한 행", summary: "출력 2개 → reverse 방향 2번", note: "Reverse mode는 출력 쪽 출발 기여 하나를 정해 거꾸로 돌아오며 VJP를 구합니다. 한 번 통과하면 그 출력의 행 하나가 채워지므로 출력 수만큼 2번이 필요합니다." },
  { label: "이 글의 사례: 출력이 L 하나", summary: "reverse 1번 → (26, 39, 13)", note: "출력은 L 하나, 입력은 w·x·b 셋이라 표가 한 행입니다. Reverse 방향 1번이면 세 칸이 모두 나오고, forward로는 입력마다 한 번씩 3번 따라가야 합니다. 희소성·벡터화·혼합 모드에 따라 실제 비용은 달라집니다." },
] as const;

// 통과 회차는 색이 아니라 칸 아래 "n회" 글자로 구분합니다(accent 한 가지 규칙).
const ACCENT = "#2563eb";

function Cell({ text, color, label }: { text: string; color: string | null; label?: string }) {
  return (
    <span
      className={`flex h-10 min-w-0 flex-col items-center justify-center rounded-md border font-mono text-[11px] leading-4 sm:text-xs ${color ? "font-bold" : "border-dashed border-border/60 text-muted-foreground/50"}`}
      style={color ? { borderColor: color, color } : undefined}
    >
      <span>{text}</span>
      {label && <span className="font-sans font-normal">{label}</span>}
    </span>
  );
}

export default function JacobianPassesViz() {
  return (
    <SceneShell
      eyebrow="Forward vs reverse"
      title="Forward는 열을 하나씩, reverse는 행을 하나씩 채웁니다"
      description="칸 하나가 편미분 하나입니다. 칸 아래 'n회'가 그 칸을 얻는 통과의 회차이고, 같은 회차 칸은 한 번의 통과로 함께 채워집니다."
      ariaLabel="Jacobian 표를 forward mode는 열 단위, reverse mode는 행 단위로 채우는 횟수 비교"
      scenes={SCENES}
      render={(active) => {
        if (active === 3) {
          const values = [["∂L/∂w", "26"], ["∂L/∂x", "39"], ["∂L/∂b", "13"]] as const;
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] gap-1.5 text-center text-xs sm:gap-2">
                <span />
                {["w", "x", "b"].map((name) => <span key={name} className="font-mono text-muted-foreground">{name}</span>)}
                <span className="self-center text-left font-mono font-semibold">L</span>
                {values.map(([name, value]) => <Cell key={name} text={value} label={`${name} · 1회`} color={ACCENT} />)}
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p className="rounded-md border border-[#2563eb] px-3 py-2"><strong>reverse</strong>: 출발 기여 1로 1번 → 세 칸</p>
                <p className="rounded-md border border-border px-3 py-2"><strong>forward</strong>: w·x·b 방향마다 1번씩 → 3번</p>
              </div>
            </div>
          );
        }
        const rows = Array.from({ length: M }, (_, r) => r);
        const cols = Array.from({ length: N }, (_, c) => c);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-[3.5rem_repeat(5,minmax(0,1fr))] gap-1.5 text-center text-xs sm:gap-2">
              <span />
              {cols.map((c) => <span key={c} className="font-mono text-muted-foreground">입력{c + 1}</span>)}
              {rows.map((r) => (
                <div key={r} className="contents">
                  <span className="self-center text-left font-mono font-semibold">출력{r + 1}</span>
                  {cols.map((c) => {
                    const pass = active === 1 ? c : active === 2 ? r : null;
                    return <Cell key={c} text={pass === null ? "?" : "●"} label={pass === null ? undefined : `${pass + 1}회`} color={pass === null ? null : ACCENT} />;
                  })}
                </div>
              ))}
            </div>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p className={`rounded-md border px-3 py-2 ${active === 1 ? "border-[#2563eb]" : "border-border text-muted-foreground"}`}><strong>forward</strong>: 입력 수 5 → 5번</p>
              <p className={`rounded-md border px-3 py-2 ${active === 2 ? "border-[#2563eb]" : "border-border text-muted-foreground"}`}><strong>reverse</strong>: 출력 수 2 → 2번</p>
            </div>
          </div>
        );
      }}
    />
  );
}
