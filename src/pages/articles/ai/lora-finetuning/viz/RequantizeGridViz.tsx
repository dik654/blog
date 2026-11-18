import SceneShell from "./SceneShell";

/**
 * 본문 대응: #practice의 QLoRA merge 식 — Q(W̃) ≠ q_W + Q(sBA) (generally).
 * 설명용 격자(가정): code 0~7, 처음 scale 1 → 칸 값 0,1,…,7. 실제 4-bit 형식이 아니다.
 * ① base 3.0 + delta 0.4 = 3.4 → Q 3, q+Q(δ) = 3+0 = 3 → 같음(우연히 성립하는 경우).
 * ② base 7.0 + delta 0.6 = 7.6 → 끝 칸 7로 잘림, q+Q(δ) = 7+1 = 8 (격자에 없음).
 * ③ 두 weight가 scale 하나를 공유(가장 큰 절댓값이 끝 칸에 오도록, 가정): [7.0, 1.0] + [1.4, 0] = [8.4, 1.0]
 *    새 scale = 8.4/7 = 1.2 → code [7, round(0.833)=1] → 복원 [8.4, 1.2]. delta 0이던 둘째 값이 0.2 바뀜.
 */
type Mark = { v: number; kind: "base" | "merged" | "q" | "naive"; row: 0 | 1; label: string };

const SCENES = [
  {
    label: "우연히 같은 경우",
    summary: "Q(3.4) = 3 · 3 + Q(0.4) = 3",
    note: "Base code 3(값 3.0)에 delta 0.4를 더하면 3.4이고, 다시 quantize하면 가장 가까운 칸 3으로 돌아갑니다. Delta만 따로 quantize한 Q(0.4)=0을 원래 code에 더해도 3입니다. 이런 칸에서는 두 값이 우연히 같습니다.",
    scale: 1,
    marks: [
      { v: 3, kind: "base", row: 0, label: "q_W 3" },
      { v: 3.4, kind: "merged", row: 0, label: "W̃ 3.4" },
      { v: 3, kind: "q", row: 1, label: "Q(W̃) 3" },
      { v: 3, kind: "naive", row: 1, label: "3+0 = 3" },
    ] as readonly Mark[],
    verdict: "같음",
  },
  {
    label: "끝 칸에서 잘림 (clipping)",
    summary: "Q(7.6) = 7 · 7 + Q(0.6) = 8",
    note: "끝 칸 7에 있던 weight에 0.6을 더하면 7.6입니다. Scale을 1로 그대로 둔다면(가정) 격자에 8이 없으므로 다시 quantize하면 7로 잘립니다. 반면 원래 code에 Q(0.6)=1을 더하면 8이 되어 둘이 달라집니다.",
    scale: 1,
    marks: [
      { v: 7, kind: "base", row: 0, label: "q_W 7" },
      { v: 7.6, kind: "merged", row: 0, label: "W̃ 7.6" },
      { v: 7, kind: "q", row: 1, label: "Q(W̃) 7" },
      { v: 8, kind: "naive", row: 1, label: "7+1 = 8" },
    ] as readonly Mark[],
    verdict: "다름",
  },
  {
    label: "Scale을 다시 정하면",
    summary: "scale 1 → 1.2 · delta 0인 값도 1.0 → 1.2",
    note: "두 weight가 scale 하나를 함께 쓰고, 가장 큰 절댓값이 끝 칸에 오도록 scale을 정한다고 합시다(가정). 첫째 값이 7.0+1.4=8.4가 되면 새 scale은 8.4÷7=1.2이고 칸 간격이 1.2로 넓어집니다. Delta가 0이던 둘째 값 1.0은 가장 가까운 칸 1.2로 바뀌어 0.2의 새 오차가 생깁니다.",
    scale: 1.2,
    marks: [
      { v: 7, kind: "base", row: 0, label: "① 7.0" },
      { v: 8.4, kind: "merged", row: 0, label: "① 8.4" },
      { v: 1, kind: "base", row: 0, label: "② 1.0" },
      { v: 8.4, kind: "q", row: 1, label: "① 8.4" },
      { v: 1.2, kind: "q", row: 1, label: "② 1.2" },
    ] as readonly Mark[],
    verdict: "새 오차",
  },
] as const;

const X0 = 24;
const X1 = 320;
const VMAX = 9;
const vx = (v: number) => X0 + (v / VMAX) * (X1 - X0);
const ROW_Y: readonly number[] = [62, 150];
const CODES = Array.from({ length: 8 }, (_, i) => i);

const COLORS = { base: "#64748b", merged: "#2563eb", q: "#16a34a", naive: "#d97706" } as const;
const LINE = "#94a3b8";
const MUTED = "#64748b";

export default function RequantizeGridViz() {
  return (
    <SceneShell
      eyebrow="Requantization"
      title="Delta를 더한 뒤 다시 quantize하면 칸이 새로 정해집니다"
      description="Quantize(Q)는 실수를 가장 가까운 격자 칸(code)으로 반올림하고 끝 칸 밖의 값은 끝 칸으로 자르는(clipping) 연산이고, dequantize는 code에 scale을 곱해 값으로 되돌립니다. 그림의 격자는 칸 0~7, 처음 scale 1인 설명용 가정이며 실제 4-bit 형식이 아닙니다."
      ariaLabel="격자 위에서 delta를 더한 값을 다시 quantize할 때 원래 code에 delta만 더한 값과 비교"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {(
                [
                  ["base", "원래 base 값"],
                  ["merged", "delta를 더한 W̃"],
                  ["q", "다시 quantize한 Q(W̃)"],
                  ["naive", "q_W + Q(sBA)"],
                ] as const
              ).map(([kind, text]) => (
                <span key={kind} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[kind] }} />
                  {text}
                </span>
              ))}
            </div>
            <svg viewBox="0 0 340 188" className="mx-auto h-auto w-full max-w-[480px] text-foreground" role="img" aria-label={`${s.label}: ${s.summary}`}>
              {[0, 1].map((row) => {
                const scale = row === 0 ? 1 : s.scale;
                const y = ROW_Y[row];
                return (
                  <g key={row}>
                    <text x={X0} y={y - 34} fontSize={11} fontWeight={700} fill="currentColor">
                      {row === 0 ? "merge 전: 칸 0~7 · 간격 1" : `다시 quantize한 뒤: 칸 0~7 · 간격 ${scale}`}
                    </text>
                    <line x1={X0} x2={X1} y1={y} y2={y} stroke={LINE} strokeWidth={1} />
                    {CODES.map((code) => (
                      <g key={code}>
                        <line x1={vx(code * scale)} x2={vx(code * scale)} y1={y - 5} y2={y + 5} stroke={code === 7 ? "currentColor" : LINE} strokeWidth={code === 7 ? 1.25 : 1} />
                        <text x={vx(code * scale)} y={y + 17} fontSize={9} textAnchor="middle" fill={MUTED}>{Number((code * scale).toFixed(1))}</text>
                      </g>
                    ))}
                  </g>
                );
              })}
              {s.marks.map((m, i) => {
                const y = ROW_Y[m.row];
                const above = m.kind === "base" || m.kind === "q";
                const offGrid = m.kind === "naive" && m.v > 7;
                return (
                  <g key={`${m.label}-${i}`}>
                    <circle cx={vx(m.v)} cy={y} r={m.kind === "naive" ? 7 : 5} fill={m.kind === "naive" ? "none" : COLORS[m.kind]} stroke={COLORS[m.kind]} strokeWidth={1.25} strokeDasharray={offGrid ? "2 2" : undefined} />
                    {m.label && (
                      <text x={vx(m.v)} y={above ? y - 12 : y + 30} fontSize={10} fontWeight={700} textAnchor="middle" fill={COLORS[m.kind]}>
                        {m.label}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x={X1} y={ROW_Y[1] - 34} fontSize={11} fontWeight={700} textAnchor="end" fill={s.verdict === "같음" ? "#16a34a" : "#dc2626"}>
                {s.verdict}
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}
