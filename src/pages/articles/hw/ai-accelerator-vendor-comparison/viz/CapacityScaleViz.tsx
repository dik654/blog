import SceneShell from "./SceneShell";

/**
 * 본문 대응: #snapshot-gate — 표의 per-accelerator HBM을 GiB로 통일하고
 * weight 130.4GiB, weight+KV 210.4GiB 선과 비교한다.
 * GB×10⁹÷2³⁰: 128→119.2, 144→134.1, 288→268.2, 432→402.3. 192GiB는 그대로.
 * 남는 폭: 268.2−210.4=57.8, 402.3−210.4=191.9. Runtime 여유는 크기를 정하지 않는다.
 */
const GIB = 2 ** 30;
const WEIGHT = (70e9 * 2) / GIB;
const KV = 80;
const NEED = WEIGHT + KV;

const ROWS = [
  { name: "Gaudi 3", stated: "128GB", gib: (128e9) / GIB },
  { name: "Trn3", stated: "144GB", gib: (144e9) / GIB },
  { name: "TPU7x", stated: "192GiB", gib: 192 },
  { name: "B300", stated: "288GB", gib: (288e9) / GIB },
  { name: "MI455X", stated: "432GB", gib: (432e9) / GIB },
] as const;

const C = { pass: "#0284c7", fail: "#dc2626", weight: "#4f46e5", kv: "#059669", muted: "#64748b", text: "#334155", line: "#cbd5e1" };
const X0 = 88;
const X1 = 284;
const LABEL_X = 292;
const MAX = 420;
const sx = (gib: number) => X0 + (gib / MAX) * (X1 - X0);
const fmt = (value: number) => value.toFixed(1);

const SCENES = [
  {
    label: "단위부터 GiB로 맞춥니다",
    summary: "GB × 10⁹ ÷ 2³⁰",
    note: "표에는 decimal GB와 이진 GiB가 섞여 있습니다. 앞 절의 210.4GiB와 비교하려면 GB 값에 10⁹를 곱하고 2³⁰으로 나눕니다. 288GB는 약 268.2GiB가 됩니다.",
  },
  {
    label: "Weight만 보면",
    summary: `${fmt(WEIGHT)}GiB 선 · 4개가 넘음`,
    note: `BF16 weight ${fmt(WEIGHT)}GiB만 놓으면 128GB 후보만 모자라고 나머지는 선을 넘습니다. 144GB도 weight만은 담습니다. 앞 절에서 weight만 보면 192GB급 가속기에도 들어갈 것 같다고 한 이유입니다.`,
  },
  {
    label: "KV cache까지 더하면",
    summary: `${fmt(NEED)}GiB 선 · 2개만 남음`,
    note: `32K·동시 8 요청의 KV cache ${KV}GiB를 더하면 최소선은 ${fmt(NEED)}GiB입니다. 128GB·144GB·192GiB 후보는 한 장 경로에서 탈락하고, 288GB와 432GB만 실행 시험으로 넘어갑니다.`,
  },
  {
    label: "남는 폭은 실행으로 확인합니다",
    summary: `${fmt(ROWS[3].gib - NEED)} · ${fmt(ROWS[4].gib - NEED)}GiB 남음`,
    note: `최소선 위에 남는 폭은 288GB 후보가 약 ${fmt(ROWS[3].gib - NEED)}GiB, 432GB 후보가 약 ${fmt(ROWS[4].gib - NEED)}GiB입니다. Allocator·workspace·fragmentation 여유가 이 폭에 실제로 들어가는지는 크기를 정하지 않고 실행으로 확인합니다.`,
  },
] as const;

export default function CapacityScaleViz() {
  return (
    <SceneShell
      eyebrow="같은 단위의 한 장 용량"
      title="표의 HBM을 GiB로 맞추면 210.4GiB 선을 넘는 후보는 둘입니다"
      description="막대 하나가 가속기 한 장의 nominal HBM이며, 가로축은 0부터 420GiB까지 같은 비율입니다. 아래 표(2026-11-02 기준)의 per-accelerator 값과 앞 절의 70B 계산을 그대로 씁니다."
      ariaLabel="다섯 후보의 per-accelerator HBM을 GiB로 바꿔 weight 선과 weight+KV 선에 비교"
      scenes={SCENES}
      render={(active) => {
        const line = active === 1 ? WEIGHT : active >= 2 ? NEED : null;
        return (
          <svg viewBox="0 0 360 228" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {ROWS.map((row, index) => {
              const y = 26 + index * 34;
              const ok = line === null ? null : row.gib >= line;
              const color = ok === null ? C.muted : ok ? C.pass : C.fail;
              const verdict = ok === null ? "" : ok ? "넘음" : "모자람";
              return (
                <g key={row.name}>
                  <text x={8} y={y + 9} fontSize={10.5} fontWeight={700} fill={C.text}>{row.name}</text>
                  <text x={8} y={y + 22} fontSize={9.5} fill={C.muted}>표기 {row.stated}</text>
                  <rect x={X0} y={y} width={sx(row.gib) - X0} height={18} rx={3} fill={color} fillOpacity={0.22} stroke={color} strokeWidth={1} />
                  {active === 3 && ok && (
                    <rect x={sx(NEED)} y={y} width={sx(row.gib) - sx(NEED)} height={18} fill="none" stroke={C.kv} strokeWidth={1.25} strokeDasharray="4 2" />
                  )}
                  <text x={LABEL_X} y={y + 9} fontSize={10} fontWeight={700} fill={color}>
                    {active === 3 && ok ? `+${fmt(row.gib - NEED)}` : fmt(row.gib)}
                  </text>
                  <text x={LABEL_X} y={y + 22} fontSize={9} fill={color}>
                    {active === 3 && ok ? "GiB 남음" : verdict || "GiB"}
                  </text>
                </g>
              );
            })}
            {line !== null && (
              <>
                <line x1={sx(line)} x2={sx(line)} y1={18} y2={196} stroke={active === 1 ? C.weight : C.fail} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={sx(line)} y={212} textAnchor="middle" fontSize={10} fontWeight={700} fill={active === 1 ? C.weight : C.fail}>
                  {active === 1 ? `weight ${fmt(WEIGHT)}` : `weight+KV ${fmt(NEED)}`}
                </text>
              </>
            )}
            <line x1={X0} x2={X1} y1={198} y2={198} stroke={C.line} strokeWidth={1} />
            <text x={X0} y={224} fontSize={9} fill={C.muted}>0</text>
            <text x={X1} y={224} textAnchor="end" fontSize={9} fill={C.muted}>420GiB</text>
          </svg>
        );
      }}
    />
  );
}
