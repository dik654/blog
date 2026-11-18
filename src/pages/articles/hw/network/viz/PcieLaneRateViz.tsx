import SceneShell from "./NetworkSceneShell";

/**
 * 본문 대응: #pcie-transaction-bandwidth-latency — PCIe 5.0 x16:
 * 32 GT/s × 16 = 512 GT/s → × 128/130 ≈ 504.1 Gb/s → ÷ 8 ≈ 63.0 GB/s (한 방향 raw 상한).
 * 양방향 합 2 × 63.0 = 126.0은 한 방향 copy 상한이 아님. Header·flow control은 이 다음 단계의 손실.
 */
const RATE = 32;
const LANES = 16;
const LANE_SUM = RATE * LANES;
const BITS_RAW = (LANE_SUM * 128) / 130;
const BITS = BITS_RAW.toFixed(1);
const BYTES = (BITS_RAW / 8).toFixed(1);
const BOTH = ((BITS_RAW / 8) * 2).toFixed(1);

const CHAIN = [
  { op: "lane 1개", value: `${RATE} GT/s` },
  { op: `× ${LANES}`, value: `${LANE_SUM} GT/s` },
  { op: "× 128/130", value: `${BITS} Gb/s` },
  { op: "÷ 8", value: `${BYTES} GB/s` },
] as const;

const SCENES = [
  { label: "Lane 하나의 속도", summary: `${RATE} GT/s`, step: 0, note: "GT/s는 lane 하나의 초당 giga-transfer 수입니다. 아직 byte/s가 아니므로 이대로 복사 속도와 비교하지 않습니다." },
  { label: "Lane 16개로 넓힙니다", summary: `${RATE} × ${LANES} = ${LANE_SUM} GT/s`, step: 1, note: "x16은 실제로 협상된 lane이 16개라는 뜻입니다. 16개가 나란히 보내므로 link 전체는 lane 하나의 16배입니다." },
  { label: "Encoding 칸을 뺍니다", summary: `${LANE_SUM} × 128/130 ≈ ${BITS} Gb/s`, step: 2, note: "Lane의 transfer 하나가 1 bit를 실어 나르므로 512 GT/s는 512 Gb/s의 선로 bit입니다. 128b/130b encoding은 그 130 bit마다 128 bit만 data로 씁니다. 칸 하나가 1 bit이고, 회색 2칸은 data가 아닙니다." },
  { label: "8 bit를 1 byte로 묶습니다", summary: `${BITS} ÷ 8 ≈ ${BYTES} GB/s`, step: 3, note: "복사 bandwidth는 byte/s로 재므로 8로 나눕니다. 이것이 PCIe 5.0 x16의 한 방향 raw 상한 약 63 GB/s입니다." },
  { label: "한 방향 상한입니다", summary: `두 방향 합 ${BOTH} ≠ 한 방향 copy`, step: 3, note: `두 방향이 따로 ${BYTES} GB/s씩이라 더하면 ${BOTH}이지만, 한쪽으로 가는 copy는 ${BYTES}을 넘지 못합니다. Header·flow control을 빼기 전 값이라 실제 payload는 더 낮습니다.` },
] as const;

const W = 360;
const H = 130;
const ON = "#2563eb";
const OFF = "#cbd5e1";
const GRAY = "#94a3b8";
const MUTED = "#64748b";

function Picture({ active }: { active: number }) {
  if (active <= 1) {
    return (
      <>
        {Array.from({ length: LANES }, (_, i) => {
          const y = 8 + i * 7;
          const on = active === 1 || i === 0;
          return <rect key={i} x={44} y={y} width={290} height={3.5} rx={1} fill={on ? ON : OFF} />;
        })}
        <text x={36} y={13} textAnchor="end" fontSize={10} fill={MUTED}>1</text>
        <text x={36} y={119} textAnchor="end" fontSize={10} fill={MUTED}>16</text>
        <text x={338} y={13} fontSize={10} fill={MUTED}>→</text>
      </>
    );
  }
  if (active === 2) {
    const cols = 26;
    const size = 9;
    const gap = 2;
    const left = (W - cols * (size + gap) + gap) / 2;
    return (
      <>
        {Array.from({ length: 130 }, (_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return <rect key={i} x={left + col * (size + gap)} y={12 + row * (size + gap)} width={size} height={size} rx={1} fill={i < 2 ? GRAY : ON} />;
        })}
        <text x={W / 2} y={92} textAnchor="middle" fontSize={11} fill={MUTED}>130칸 중 2칸은 encoding, 128칸만 data</text>
        <text x={W / 2} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill={ON}>{`${LANE_SUM} × 128/130 ≈ ${BITS}`}</text>
      </>
    );
  }
  if (active === 3) {
    const groups = 3;
    const cell = 11;
    const groupW = 8 * cell + 7;
    const gap = 18;
    const left = (W - groups * groupW - (groups - 1) * gap) / 2;
    return (
      <>
        {Array.from({ length: groups }, (_, g) => {
          const gx = left + g * (groupW + gap);
          return (
            <g key={g}>
              {Array.from({ length: 8 }, (_, b) => (
                <rect key={b} x={gx + b * (cell + 1)} y={20} width={cell} height={cell} rx={1} fill={ON} />
              ))}
              <path d={`M ${gx} 38 L ${gx} 44 L ${gx + groupW} 44 L ${gx + groupW} 38`} fill="none" stroke={MUTED} strokeWidth={1} />
              <rect x={gx + groupW / 2 - 22} y={54} width={44} height={22} rx={4} fill="none" stroke={ON} strokeWidth={1} />
              <text x={gx + groupW / 2} y={69} textAnchor="middle" fontSize={11} fontWeight={700} fill={ON}>1 byte</text>
            </g>
          );
        })}
        <text x={W / 2} y={104} textAnchor="middle" fontSize={11} fill={MUTED}>8 bit = 1 byte</text>
      </>
    );
  }
  return (
    <>
      <line x1={60} x2={300} y1={34} y2={34} stroke={ON} strokeWidth={1.25} />
      <path d="M 300 29 L 308 34 L 300 39 Z" fill={ON} />
      <text x={180} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={ON}>{`한 방향 ≤ ${BYTES} GB/s`}</text>
      <line x1={60} x2={300} y1={74} y2={74} stroke={GRAY} strokeWidth={1} />
      <path d="M 60 69 L 52 74 L 60 79 Z" fill={GRAY} />
      <text x={180} y={92} textAnchor="middle" fontSize={11} fill={MUTED}>{`반대 방향 ≤ ${BYTES} GB/s`}</text>
      <text x={180} y={118} textAnchor="middle" fontSize={11} fill={MUTED}>{`더한 ${BOTH}은 한 방향 copy 상한이 아님`}</text>
    </>
  );
}

export default function PcieLaneRateViz() {
  return (
    <SceneShell
      eyebrow="GT/s에서 GB/s로"
      title="PCIe 5.0 x16의 63 GB/s는 세 번의 계산을 거쳐 나옵니다"
      description="위 칸은 계산 순서이고 아래 그림은 그 단계가 실제로 무엇을 세는지 보여 줍니다. 결과는 한 방향 raw 상한이며 application payload 실측값이 아닙니다."
      ariaLabel="32 GT/s lane 16개, 128b/130b encoding, 8 bit를 1 byte로 바꿔 약 63 GB/s를 얻는 과정"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {CHAIN.map((item, i) => (
                <div key={item.op} className={`min-w-0 rounded-lg border px-1.5 py-2 text-center sm:px-2 ${i <= step ? "border-[#2563eb] bg-[#2563eb]/10" : "border-border bg-background"}`}>
                  <span className={`block text-[10px] font-semibold sm:text-xs ${i === step ? "text-[#2563eb]" : "text-muted-foreground"}`}>{item.op}</span>
                  <span className={`mt-0.5 block font-mono text-[11px] font-bold sm:text-sm ${i <= step ? "" : "text-muted-foreground/60"}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-4 h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <Picture active={active} />
            </svg>
          </div>
        );
      }}
    />
  );
}
