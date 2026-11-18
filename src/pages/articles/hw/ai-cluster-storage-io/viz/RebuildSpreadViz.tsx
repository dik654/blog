import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 4U106 상자에서 drive 하나가 빠졌을 때 다시 쓸 24TB를 누가 받는가.
 * 칸 106개 = drive 106개(배치는 설명용). 전통 8+2 RAID: 묶음 10개 중 하나 고장 → 남은 9개에서 읽어 예비 1대에 24TB.
 * (가정) 예비 drive 250MB/s → 24TB ÷ 250MB/s = 96,000초 ≈ 27시간. 분산 방식: 남은 105대가 함께 읽고 씀.
 * 마지막 장면은 Seagate 2018 ADAPT 문서의 modeled numbers(당시 drive 용량 기준)이다.
 */
const DRIVES = 106;
const COLS = 18;
const CELL = 16;
const GAP = 3;
const GROUP = 10;
const FAILED = 3;
const SPARE = 10;
const MORE_FAIL = [6, 8] as const;
const DRIVE_TB = 24;
const SPARE_MBS = 250;
const SECONDS = (DRIVE_TB * 1e12) / (SPARE_MBS * 1e6);
const HOURS = SECONDS / 3600;

const MODELED: readonly { label: string; hours: number }[] = [
  { label: "전통 RAID 8+2", hours: 55.5 },
  { label: "분산 · 24대", hours: 24 },
  { label: "분산 · 56대", hours: 10 },
  { label: "분산 · 106대", hours: 5.3 },
];

const SCENES = [
  {
    label: "전통 8+2: 예비 1대가 모두 받습니다",
    summary: "9개에서 읽어 1대에 24TB",
    note: "8+2는 data 8조각과 parity 2조각을 한 줄(stripe)로 묶어 두 개까지 잃어도 복구하는 방식입니다. 전통 RAID는 drive 10개가 한 묶음이라, 하나가 고장 나면 남은 9개에서 읽어 예비 drive 한 대에 24TB를 다시 씁니다.",
  },
  {
    label: "그 한 대가 쓰는 동안 위험이 이어집니다",
    summary: `${DRIVE_TB}TB ÷ ${SPARE_MBS}MB/s = ${SECONDS.toLocaleString("en-US")}초 ≈ ${HOURS.toFixed(0)}시간`,
    note: `(가정) 예비 drive가 초당 250MB를 쓰면 쓰기에만 약 ${HOURS.toFixed(0)}시간이 걸립니다. 그동안 같은 묶음에서 drive 두 개가 더 고장 나면 data를 잃습니다. 시간을 묶는 것은 parity 계산이 아니라 24TB를 한 대가 받는 구조입니다.`,
  },
  {
    label: "분산: 남은 105대가 나눠 받습니다",
    summary: "stripe와 예비 공간을 106대 전체에",
    note: "8+2 stripe를 106개 drive 전체에 흩고 예비 공간도 모든 drive에 조금씩 남깁니다. Drive 하나가 빠지면 그 drive에 조각이 있던 stripe만 손상되고, 복구를 남은 105대가 함께 읽고 씁니다. 각 칸 아래 띠가 그 drive에 남긴 예비 공간입니다.",
  },
  {
    label: "Seagate가 모델로 계산한 재구축 시간",
    summary: "55.5 → 24 → 10 → 5.3시간",
    note: "Seagate 2018년 ADAPT 문서의 drive 하나 재구축 시간입니다. 재구축 중 성능 저하는 41%에서 6%로 줄어든다고 적습니다. Seagate가 ‘modeled numbers’라고 밝힌 당시 drive 용량 기준이라 24TB drive에 그대로 옮기지 않습니다.",
  },
] as const;

const W = 360;
const H = 190;
const GX = (W - (COLS * (CELL + GAP) - GAP)) / 2;
const GY = 30;
const cx = (index: number) => GX + (index % COLS) * (CELL + GAP);
const cy = (index: number) => GY + Math.floor(index / COLS) * (CELL + GAP);

function DriveGrid({ active }: { active: number }) {
  const spread = active === 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {Array.from({ length: DRIVES }, (_, index) => {
        const x = cx(index);
        const y = cy(index);
        const inGroup = index < GROUP;
        const failed = index === FAILED;
        const isSpare = !spread && index === SPARE;
        const atRisk = active === 1 && (MORE_FAIL as readonly number[]).includes(index);
        const fill = failed ? "#ffffff" : isSpare ? "#d97706" : spread ? "#dbeafe" : inGroup ? "#bfdbfe" : "#f1f5f9";
        const stroke = failed || atRisk ? "#dc2626" : isSpare ? "#b45309" : spread || inGroup ? "#2563eb" : "#cbd5e1";
        return (
          <g key={index}>
            <rect x={x} y={y} width={CELL} height={CELL} rx={2} fill={fill} stroke={stroke} strokeWidth={1} strokeDasharray={atRisk ? "2 2" : undefined} />
            {spread && !failed && <rect x={x + 2} y={y + CELL - 4} width={CELL - 4} height={2} fill="#d97706" />}
            {failed && <path d={`M${x + 4} ${y + 4}L${x + CELL - 4} ${y + CELL - 4}M${x + CELL - 4} ${y + 4}L${x + 4} ${y + CELL - 4}`} stroke="#dc2626" strokeWidth={1.25} />}
          </g>
        );
      })}
      {!spread && (
        <g>
          {Array.from({ length: GROUP }, (_, index) => index)
            .filter((index) => index !== FAILED)
            .map((index) => (
              <path
                key={index}
                d={`M${cx(index) + CELL / 2} ${cy(index)} Q${(cx(index) + cx(SPARE)) / 2 + CELL / 2} ${cy(index) - 26} ${cx(SPARE) + CELL / 2} ${cy(SPARE)}`}
                fill="none"
                stroke="#b45309"
                strokeWidth={1}
                opacity={0.55}
              />
            ))}
          <text x={cx(SPARE) + CELL + 6} y={cy(SPARE) + 12} fontSize={9.5} fontWeight={700} fill="#b45309">예비 1대</text>
        </g>
      )}
      <g transform={`translate(0 ${GY + 6 * (CELL + GAP) + 10})`}>
        {active === 0 && <text x={W / 2} y={12} textAnchor="middle" fontSize={10.5} fill="#0f172a">파란 10칸 = 한 묶음 · ✕ = 고장 · 회색 = 다른 묶음(배치는 설명용)</text>}
        {active === 1 && (
          <g>
            <text x={W / 2} y={12} textAnchor="middle" fontSize={10.5} fill="#0f172a">{`예비 1대가 약 ${HOURS.toFixed(0)}시간 씀 · 그사이 점선 2칸이 더 고장 나면 손실`}</text>
          </g>
        )}
        {active === 2 && <text x={W / 2} y={12} textAnchor="middle" fontSize={10.5} fill="#0f172a">105칸이 함께 읽고 씀 · 칸 아래 주황 띠 = 나눠 둔 예비 공간</text>}
      </g>
    </svg>
  );
}

function ModeledBars() {
  const left = 112;
  const right = 300;
  const max = MODELED[0].hours;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label="Seagate 2018 modeled 재구축 시간 55.5, 24, 10, 5.3시간">
      {MODELED.map((row, index) => {
        const y = 16 + index * 32;
        const width = (row.hours / max) * (right - left);
        return (
          <g key={row.label}>
            <text x={left - 8} y={y + 13} textAnchor="end" fontSize={10.5} fill="#0f172a">{row.label}</text>
            <rect x={left} y={y} width={width} height={18} rx={2} fill={index === 0 ? "#d97706" : "#2563eb"} opacity={0.75} />
            <text x={left + width + 6} y={y + 13} fontSize={10.5} fontWeight={700} fill="#0f172a">{`${row.hours}h`}</text>
          </g>
        );
      })}
      <text x={W / 2} y={H - 22} textAnchor="middle" fontSize={10} fill="#334155">재구축 중 성능 저하: 41% → 6%</text>
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={9} fill="#64748b">Seagate 2018 · modeled numbers · 당시 drive 용량 기준</text>
    </svg>
  );
}

export default function RebuildSpreadViz() {
  return (
    <SceneShell
      eyebrow="재구축을 누가 받는가"
      title="다시 쓸 24TB를 한 대가 받느냐, 105대가 나눠 받느냐"
      description="(가정) 24TB HDD 106개를 담은 4U 상자입니다. 칸 하나가 drive 하나이며 칸의 위치는 설명용입니다."
      ariaLabel="전통 8+2 RAID의 예비 drive 한 대 재구축과 106대 분산 재구축, Seagate modeled 재구축 시간 비교"
      scenes={SCENES}
      render={(active) => (active === 3 ? <ModeledBars /> : <DriveGrid active={active} />)}
    />
  );
}
