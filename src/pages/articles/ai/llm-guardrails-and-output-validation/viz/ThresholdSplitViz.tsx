import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fp-fn-tradeoff — 정상 요청 1,000건과 위험 요청 50건을 섞은 집합에서
 * threshold A 는 TP 40·FP 30·FN 10, threshold B 는 TP 30·FP 5·FN 20.
 * Precision = TP/(TP+FP): A 40/70 ≈ 0.57, B 30/35 ≈ 0.86.
 * Recall = TP/(TP+FN): A 40/50 = 0.80, B 30/50 = 0.60.
 * 칸 하나가 요청 한 건이고, 막힌 칸만 색을 채운다. 어느 칸이 막혔는지의 위치는 의미가 없다.
 */
const RISKY = 50;
const SAFE = 1000;

const SCENES = [
  { label: "섞인 요청 1,050건", summary: "위험 50 · 정상 1,000", tp: 0, fp: 0, note: "왼쪽 칸 50개가 실제 위험 요청, 오른쪽 칸 1,000개가 정상 요청입니다. Guardrail 은 이 정답을 모른 채 한 건씩 막을지 통과시킬지 정합니다. 아직 아무것도 막지 않았습니다." },
  { label: "Threshold A", summary: "70건 차단 · P 0.57 · R 0.80", tp: 40, fp: 30, note: "70건을 막습니다. 위험 50건 중 40건을 잡고(TP) 10건을 놓치며(FN), 정상 30건을 잘못 막습니다(FP). 막은 70건 중 진짜 위험은 40건이라 precision 은 0.57, 위험 50건 중 40건을 잡았으니 recall 은 0.80입니다." },
  { label: "Threshold B", summary: "35건 차단 · P 0.86 · R 0.60", tp: 30, fp: 5, note: "35건만 막습니다. 잘못 막는 정상 요청은 5건으로 줄었지만 놓치는 위험은 20건으로 늘었습니다. 막은 35건 중 30건이 진짜라 precision 은 0.86, recall 은 30/50 = 0.60입니다." },
  { label: "A → B", summary: "FP −25 · FN +10", tp: 30, fp: 5, note: "A 에서 B 로 옮기면 잘못 막기(FP)는 30 → 5건, 놓치기(FN)는 10 → 20건이 됩니다. 한 실패가 줄면 다른 실패가 늘어납니다. 어느 쪽이 옳은지는 이 숫자가 아니라 두 실패의 비용을 비교해 정합니다." },
] as const;

const R_COLS = 10;
const R_CELL = 15;
const R_X = 14;
const S_COLS = 40;
const S_CELL = 6.4;
const S_X = 190;
const TOP = 34;

function Swatch({ fill, stroke, dashed = false }: { fill: string; stroke: string; dashed?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
      <rect x="0.5" y="0.5" width="11" height="11" rx="2" fill={fill} stroke={stroke} strokeWidth={1} strokeDasharray={dashed ? "2 1.5" : undefined} />
    </svg>
  );
}

function Fraction({ name, rule, num, den, value }: { name: string; rule: string; num: number; den: number; value: string }) {
  return (
    <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 rounded-md border border-border px-2 py-1 text-xs sm:text-sm">
      <span>
        <span className="font-semibold">{name}</span> <span className="text-muted-foreground">{rule}</span>
      </span>
      <span className="font-mono">{den === 0 ? "—" : `${num}/${den} = ${value}`}</span>
    </div>
  );
}

export default function ThresholdSplitViz() {
  return (
    <SceneShell
      eyebrow="Threshold 두 개"
      title="덜 막으면 잘못 막기는 줄고 놓치기는 늘어납니다"
      description="칸 하나가 요청 한 건입니다. 빨간 칸은 실제 위험, 회색 칸은 실제 정상 요청이고, 색이 채워진 칸이 guardrail 이 막은 요청입니다. 아래 공식의 해석에 나오는 예시 숫자를 그대로 씁니다."
      note="막힌 칸이 어디에 있는지는 의미가 없습니다. 개수만 읽습니다. 이 숫자는 트레이드오프를 보이기 위한 본문 예시이며 특정 guardrail 의 측정값이 아닙니다."
      ariaLabel="위험 50건과 정상 1,000건에서 threshold A와 B가 막는 요청 수와 precision, recall"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const initial = active === 0;
        const fn = RISKY - scene.tp;
        const blocked = scene.tp + scene.fp;
        const compare = active === 3;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 470 198" className="mx-auto h-auto w-full max-w-[30rem]" role="img" aria-label={initial ? scene.label : `${scene.label}: TP ${scene.tp}, FP ${scene.fp}, FN ${fn}`}>
              <text x={R_X} y={20} fontSize={15} fontWeight={700} fill="#b91c1c">실제 위험 50</text>
              <text x={S_X} y={20} fontSize={15} fontWeight={700} fill="#475569">실제 정상 1,000</text>
              {Array.from({ length: RISKY }, (_, i) => {
                const caught = i < scene.tp;
                const lostByB = compare && i >= 30 && i < 40;
                return (
                  <rect
                    key={i}
                    x={R_X + (i % R_COLS) * R_CELL}
                    y={TOP + Math.floor(i / R_COLS) * R_CELL}
                    width={R_CELL - 3}
                    height={R_CELL - 3}
                    rx={2}
                    fill={caught ? "#dc2626" : initial ? "#fee2e2" : "#ffffff"}
                    stroke={lostByB ? "#d97706" : "#dc2626"}
                    strokeWidth={lostByB ? 1.25 : 1}
                    strokeDasharray={lostByB ? "2 1.5" : undefined}
                  />
                );
              })}
              {Array.from({ length: SAFE }, (_, i) => {
                const wrong = i < scene.fp;
                const freedByB = compare && i >= 5 && i < 30;
                return (
                  <rect
                    key={i}
                    x={S_X + (i % S_COLS) * S_CELL}
                    y={TOP + Math.floor(i / S_COLS) * S_CELL}
                    width={S_CELL - 1.4}
                    height={S_CELL - 1.4}
                    fill={wrong ? "#475569" : freedByB ? "#fde68a" : "#f1f5f9"}
                    stroke={freedByB ? "#d97706" : "none"}
                    strokeWidth={freedByB ? 0.6 : 0}
                  />
                );
              })}
            </svg>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5">
              <li className="flex items-center gap-1.5"><Swatch fill="#dc2626" stroke="#dc2626" />{initial ? "막음 TP" : `막음 TP ${scene.tp}`}</li>
              <li className="flex items-center gap-1.5"><Swatch fill="#ffffff" stroke="#dc2626" />{initial ? "놓침 FN" : `놓침 FN ${fn}`}</li>
              <li className="flex items-center gap-1.5"><Swatch fill="#475569" stroke="#475569" />{initial ? "잘못 막음 FP" : `잘못 막음 FP ${scene.fp}`}</li>
              {compare ? (
                <>
                  <li className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300"><Swatch fill="#ffffff" stroke="#d97706" dashed />A는 막고 B는 놓친 위험 10</li>
                  <li className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300"><Swatch fill="#fde68a" stroke="#d97706" />A는 막고 B는 통과시킨 정상 25</li>
                </>
              ) : null}
              <li className="font-bold">{initial ? "아직 판정 전" : `막은 요청 ${blocked}건`}</li>
            </ul>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <Fraction name="Precision" rule="TP ÷ 막은 수" num={scene.tp} den={blocked} value={blocked === 0 ? "" : (scene.tp / blocked).toFixed(2)} />
              <Fraction name="Recall" rule="TP ÷ 위험 50" num={scene.tp} den={blocked === 0 ? 0 : RISKY} value={(scene.tp / RISKY).toFixed(2)} />
            </div>
          </div>
        );
      }}
    />
  );
}
