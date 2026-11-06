import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 같은 물 100이 두 선택에서 어디에 닿는지 칸으로 셉니다.
 * 한 번에 개방: 60 도달 + 25 넘침 + 15 고임 = 100. 나눠 조정: 85 도달 + 15 손실 = 100.
 * 글은 15가 40·30·30 중 어느 번에서 빠졌는지 나누지 않으므로 나눔 구분선은 도달을 세기 전 두 장면에만 둡니다.
 * 차이 25와 넘침 25는 숫자만 같습니다. 글은 둘째 선택의 손실 15를 넘침과 고임으로 나누지 않습니다.
 */
type Kind = "neutral" | "reached" | "extra" | "overflow" | "pooled" | "lost";

const CELL = 13;
const STEP = 15;
const BATCH_ROWS = [
  { value: 40, startRow: 0, rows: 4 },
  { value: 30, startRow: 4, rows: 3 },
  { value: 30, startRow: 7, rows: 3 },
] as const;

const SCENES = [
  { label: "같은 물 100", summary: "두 선택 모두 100단위", note: "두 선택 모두 저수지의 물 100단위에서 출발합니다. 왼쪽은 수문을 한 번에 끝까지 열고, 오른쪽은 40·30·30으로 나눠 보냅니다." },
  { label: "한 번에 끝까지", summary: "60 + 25 + 15 = 100", note: "25는 둑 밖으로 넘고 15는 앞 논에 고입니다. 작물 뿌리에 닿는 것은 60이고, 넘침과 고임을 합친 손실은 40입니다." },
  { label: "나눠 보내며 조정", summary: "85 + 15 = 100", note: "매번 수문을 조정해 85가 닿고 15를 잃습니다. 글은 15가 세 번 중 어디에서 빠졌는지 나누지 않으므로, 칸의 위치에는 뜻이 없습니다." },
  { label: "같은 100의 다른 도달", summary: "85 − 60 = 25", note: "같은 100에서 25만큼 더 닿는다는 가정입니다. 넘침 25가 그대로 도달로 바뀌었다는 뜻은 아닙니다. 글은 둘째 선택의 손실 15를 넘침과 고임으로 나누지 않습니다. 이 숫자만으로 무위가 증명되지도 않습니다." },
] as const;

function kindsFor(parts: readonly (readonly [Kind, number])[]): Kind[] {
  return parts.flatMap(([kind, count]) => Array.from({ length: count }, () => kind));
}

function Mark({ kind, x, y, size }: { kind: Kind; x: number; y: number; size: number }) {
  if (kind === "reached") return <rect x={x} y={y} width={size} height={size} rx={2} fill="#2563eb" />;
  if (kind === "extra") {
    return (
      <>
        <rect x={x} y={y} width={size} height={size} rx={2} fill="#2563eb" />
        <path d={`M${x + size / 2} ${y + size * 0.25}V${y + size * 0.75}M${x + size * 0.25} ${y + size / 2}H${x + size * 0.75}`} stroke="#ffffff" strokeWidth={1.25} fill="none" />
      </>
    );
  }
  if (kind === "overflow") return <rect x={x + 0.5} y={y + 0.5} width={size - 1} height={size - 1} rx={2} fill="#dc2626" fillOpacity={0.18} stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />;
  if (kind === "lost") return <rect x={x + 0.5} y={y + 0.5} width={size - 1} height={size - 1} rx={2} fill="none" stroke="#64748b" strokeWidth={1} />;
  if (kind === "pooled") {
    return (
      <>
        <rect x={x} y={y} width={size} height={size} rx={2} fill="#d97706" />
        <circle cx={x + size / 2} cy={y + size / 2} r={size / 7} fill="#ffffff" />
      </>
    );
  }
  return <rect x={x} y={y} width={size} height={size} rx={2} fill="#94a3b8" opacity={0.3} />;
}

function Waffle({ kinds, showBatches, label }: { kinds: readonly Kind[]; showBatches: boolean; label: string }) {
  return (
    <svg viewBox="0 0 176 150" className="h-auto w-full" role="img" aria-label={label}>
      {kinds.map((kind, index) => (
        <Mark key={index} kind={kind} x={(index % 10) * STEP} y={Math.floor(index / 10) * STEP} size={CELL} />
      ))}
      {showBatches && BATCH_ROWS.map((batch, index) => {
        const top = batch.startRow * STEP;
        const bottom = (batch.startRow + batch.rows) * STEP - 2;
        return (
          <g key={index}>
            <path d={`M152 ${top + 1}H156V${bottom - 1}H152`} fill="none" stroke="#64748b" strokeWidth={1} />
            <text x={160} y={(top + bottom) / 2 + 4} fontSize={12} fontWeight={700} fill="#64748b">{batch.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Legend({ rows, visible }: { rows: readonly { kind: Kind; label: string; value: number }[]; visible: boolean }) {
  return (
    <ul className={`mt-2 space-y-1 text-xs leading-5 ${visible ? "" : "invisible"}`}>
      {[0, 1, 2].map((slot) => {
        const row = rows[slot];
        return (
          <li key={slot} className="flex min-h-5 items-center gap-1.5">
            {row && (
              <>
                <svg viewBox="0 0 12 12" width={12} height={12} className="shrink-0" aria-hidden="true"><Mark kind={row.kind} x={0} y={0} size={12} /></svg>
                <span className="min-w-0 flex-1 text-muted-foreground">{row.label}</span>
                <span className="font-mono font-bold">{row.value}</span>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function WaterSplitViz() {
  return (
    <SceneShell
      eyebrow="물 100의 행방"
      title="같은 물 100이 어디에 닿는지 칸으로 셉니다"
      description="칸 하나가 물 1단위입니다. 숫자는 실제 수리 공학의 측정값이 아니라 글이 세운 가정입니다."
      ariaLabel="물 100단위가 두 선택에서 도달과 손실로 나뉘는 모습"
      scenes={SCENES}
      render={(active) => {
        const left = active >= 1 ? kindsFor([["reached", 60], ["overflow", 25], ["pooled", 15]]) : kindsFor([["neutral", 100]]);
        const right = active >= 3
          ? kindsFor([["reached", 60], ["extra", 25], ["lost", 15]])
          : active === 2
            ? kindsFor([["reached", 85], ["lost", 15]])
            : kindsFor([["neutral", 100]]);
        return (
          <div className="mx-auto grid max-w-[560px] grid-cols-2 gap-4">
            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold">한 번에 끝까지</p>
              <Waffle kinds={left} showBatches={false} label={active >= 1 ? "도달 60, 넘침 25, 고임 15" : "물 100단위"} />
              <Legend visible={active >= 1} rows={[{ kind: "reached", label: "작물에 닿음", value: 60 }, { kind: "overflow", label: "둑 밖 넘침", value: 25 }, { kind: "pooled", label: "앞 논 고임", value: 15 }]} />
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold">40·30·30으로 나눠</p>
              <Waffle kinds={right} showBatches={active < 2} label={active >= 3 ? "도달 85 가운데 왼쪽보다 더 닿은 25, 손실 15" : active === 2 ? "도달 85, 손실 15" : "물 100단위를 40, 30, 30으로 나눔"} />
              <Legend visible={active >= 2} rows={active >= 3 ? [{ kind: "reached", label: "왼쪽과 같은 도달", value: 60 }, { kind: "extra", label: "더 닿음", value: 25 }, { kind: "lost", label: "손실", value: 15 }] : [{ kind: "reached", label: "작물에 닿음", value: 85 }, { kind: "lost", label: "손실", value: 15 }]} />
            </div>
          </div>
        );
      }}
    />
  );
}
