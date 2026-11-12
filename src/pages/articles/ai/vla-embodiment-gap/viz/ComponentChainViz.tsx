import SceneShell from "./SceneShell";

/**
 * 본문 대응: #system-boundary — OK-Robot처럼 VLM·navigation·grasp primitive를 이어 붙이면
 * component success를 곱한 값이 end-to-end success가 된다.
 * 단계별 성공률 90%·80%와 시도 100번은 설명용 가정이며, 곱셈은 단계 실패가 서로 독립이라는 가정입니다.
 * 90%: 100 → 90 → 81 → 72.9(그림 73)   80%: 100 → 80 → 64 → 51.2(그림 51)
 */
const STAGES = ["VLM 인식", "navigation", "grasp"] as const;
const TRIALS = 100;
const STAGE_COLORS: readonly string[] = ["#dc2626", "#d97706", "#7c3aed"];
const SUCCESS = "#16a34a";
const IDLE = "#cbd5e1";

/** 단계 수만큼 성공률 p를 곱해 남는 시도 수(반올림 전)를 차례로 돌려줍니다. */
const survivors = (p: number, upto: number) =>
  Array.from({ length: upto + 1 }, (_, k) => TRIALS * p ** k);

/** 각 칸의 색: 몇 번째 단계에서 떨어졌는지, 아니면 끝까지 남았는지. 반올림한 수로 칸을 나눕니다. */
function cells(p: number, upto: number) {
  const alive = survivors(p, upto).map((v) => Math.round(v));
  return Array.from({ length: TRIALS }, (_, i) => {
    const failedAt = alive.findIndex((n, k) => k > 0 && i >= n);
    return failedAt === -1 ? -1 : failedAt - 1;
  });
}

const SCENES = [
  { p: 0.9, upto: 1, label: "VLM 인식만", summary: "100번 중 90번 (가정)" },
  { p: 0.9, upto: 2, label: "+ navigation", summary: "0.9 × 0.9 = 81%" },
  { p: 0.9, upto: 3, label: "+ grasp", summary: "0.9³ = 72.9%" },
  { p: 0.8, upto: 3, label: "단계마다 80%라면", summary: "0.8³ = 51.2%" },
].map((s) => {
  const raw = survivors(s.p, s.upto);
  const last = raw[raw.length - 1];
  const pct = Math.round(s.p * 100);
  const note =
    s.upto === 1
      ? `한 단계만 따로 시험하면 성공률이 ${pct}%라고 두겠습니다(가정). 칸 하나가 시도 한 번이고, 빨간 칸이 이 단계에서 실패한 시도입니다.`
      : s.p === 0.9
        ? `앞 단계를 통과한 시도만 다음 단계로 갑니다. ${STAGES.slice(0, s.upto).join(" → ")}까지 모두 통과하는 비율은 0.9를 ${s.upto}번 곱한 ${last.toFixed(1)}%이고, 그림은 반올림해 ${Math.round(last)}칸입니다.`
        : `단계마다 80%로 낮추면 세 단계 뒤에 ${last.toFixed(1)}%(그림 ${Math.round(last)}칸)만 남습니다. 단계마다 줄어든 몫이 곱해져 끝에서는 절반 남짓이 됩니다.`;
  return { ...s, cells: cells(s.p, s.upto), note };
});

export default function ComponentChainViz() {
  return (
    <SceneShell
      eyebrow="Component error composition"
      title="단계별 성공률은 곱해져 end-to-end 성공률이 됩니다"
      description="칸 하나가 같은 task의 시도 한 번입니다. 단계별 성공률은 설명용 가정이고, 곱셈은 단계 실패가 서로 독립이라고 둔 계산입니다."
      note="OK-Robot 인용의 비주장처럼 실제 실패가 독립이라는 뜻은 아닙니다. 실패가 서로 얽히면 곱셈 값과 달라집니다."
      ariaLabel="세 component의 성공률을 곱한 end-to-end 성공률"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ok = scene.cells.filter((c) => c === -1).length;
        return (
          <div className="mx-auto grid min-w-0 max-w-[560px] grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_13rem] sm:gap-4">
            <svg viewBox="0 0 200 200" className="mx-auto h-auto w-full max-w-[220px]" role="img" aria-label={`${scene.label}: 끝까지 성공 ${ok}칸`}>
              {scene.cells.map((c, i) => (
                <rect
                  key={i}
                  x={(i % 10) * 20 + 2}
                  y={Math.floor(i / 10) * 20 + 2}
                  width={16}
                  height={16}
                  rx={3}
                  fill={c === -1 ? SUCCESS : STAGE_COLORS[c] ?? IDLE}
                  opacity={c === -1 ? 0.85 : 0.75}
                />
              ))}
            </svg>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {STAGES.map((name, k) => {
                const used = k < scene.upto;
                const failed = scene.cells.filter((c) => c === k).length;
                return (
                  <li key={name} className={`flex items-center justify-between gap-2 ${used ? "" : "opacity-40"}`}>
                    <span className="flex items-center gap-2">
                      <span className="inline-block size-3 rounded-sm" style={{ backgroundColor: STAGE_COLORS[k] }} />
                      {name} 실패
                    </span>
                    <span className="font-mono">{used ? failed : "−"}</span>
                  </li>
                );
              })}
              <li className="flex items-center justify-between gap-2 border-t border-border/60 pt-1.5 font-bold">
                <span className="flex items-center gap-2">
                  <span className="inline-block size-3 rounded-sm" style={{ backgroundColor: SUCCESS }} />
                  끝까지 성공
                </span>
                <span className="font-mono">{ok}</span>
              </li>
              <li className="text-[11px] text-muted-foreground">단계 성공률 {Math.round(scene.p * 100)}% (가정)</li>
            </ul>
          </div>
        );
      }}
    />
  );
}
