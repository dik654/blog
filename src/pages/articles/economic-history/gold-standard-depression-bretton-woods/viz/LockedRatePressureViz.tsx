import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 금 1 : 통화 5를 잠그면 국외 지급 20을 줄이는 일이 다른 값으로 넘어간다.
 * 위 = 압력, 가운데 = 잠긴 값, 아래 = 움직일 수 있는 다섯 값. 마지막 장면은 위기 때의 순서입니다.
 */
const SCENES = [
  { label: "잠긴 값", summary: "금 1 : 통화 5", note: "교환 비율을 고정하면 그 가격은 움직일 수 없습니다. 국외 지급 20이 이 자리에서 멈춥니다." },
  { label: "대신 움직이는 값", summary: "20 → 다섯 값", note: "20을 줄이려면 아래 값들이 움직여야 합니다. 정책이 어느 값을 먼저 움직이게 하는지가 비용의 위치를 정합니다." },
  { label: "위기의 순서", summary: "동시 교환 → 긴축 → 고용", note: "평시에 장기 계약의 환율 불확실성을 줄이던 약속이, 동시 교환이 몰리면 위 순서로 생산과 고용을 더 낮출 수 있습니다." },
] as const;

const W = 320;
const H = 246;
const BLUE = "#2563eb";
const MUTED = "#64748b";
const IDLE = "#94a3b8";
const WARN = "#dc2626";
const LEVERS = ["수입 수요", "국내 신용", "임금과 물가", "자본 이동", "외국 차입"];
const ROW_Y = 112;
const ROW_H = 24;
const ROW_GAP = 3;
const CHAIN = ["동시에 금·기준 통화로 교환", "준비자산이 더 빨리 줄어듦", "약속을 지키려는 긴축", "생산과 고용이 더 낮아짐"];

function Pressure({ index }: { index: number }) {
  const on = index === 1;
  const lastCenter = ROW_Y + 4 * (ROW_H + ROW_GAP) + ROW_H / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
      <rect x={60} y={2} width={200} height={30} rx={8} fill="none" stroke={MUTED} strokeWidth={1} />
      <text x={160} y={22} textAnchor="middle" fontSize={13} fontWeight={700} fill={MUTED}>국외 지급 20</text>
      <line x1={160} x2={160} y1={32} y2={52} stroke={MUTED} strokeWidth={1} />
      <rect x={60} y={52} width={200} height={40} rx={8} fill="#d97706" fillOpacity={0.12} stroke="#d97706" strokeWidth={1.25} />
      <text x={160} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">금 1 : 통화 5</text>
      <text x={160} y={85} textAnchor="middle" fontSize={12} fill="#d97706">고정 · 움직일 수 없음</text>
      {on && (
        <>
          <path d={`M260 17 H298 V${lastCenter}`} fill="none" stroke={BLUE} strokeWidth={1.25} />
          {LEVERS.map((_, row) => {
            const y = ROW_Y + row * (ROW_H + ROW_GAP) + ROW_H / 2;
            return (
              <g key={row}>
                <line x1={298} x2={276} y1={y} y2={y} stroke={BLUE} strokeWidth={1.25} />
                <polygon points={`${276},${y - 4} ${276},${y + 4} ${269},${y}`} fill={BLUE} />
              </g>
            );
          })}
        </>
      )}
      {LEVERS.map((name, row) => {
        const y = ROW_Y + row * (ROW_H + ROW_GAP);
        return (
          <g key={name}>
            <rect x={60} y={y} width={208} height={ROW_H} rx={6} fill="none" stroke={on ? BLUE : IDLE} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
            <text x={164} y={y + 17} textAnchor="middle" fontSize={13} fontWeight={on ? 700 : 400} fill={on ? BLUE : MUTED}>{name}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Chain() {
  const boxH = 42;
  const gap = 20;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label="위기 때 동시 교환이 긴축과 고용 저하로 이어지는 순서">
      {CHAIN.map((text, row) => {
        const y = 2 + row * (boxH + gap);
        const last = row === CHAIN.length - 1;
        return (
          <g key={text}>
            <rect x={20} y={y} width={280} height={boxH} rx={8} fill="none" stroke={last ? WARN : MUTED} strokeWidth={last ? 1.25 : 1} />
            <text x={160} y={y + 26} textAnchor="middle" fontSize={13} fontWeight={700} fill={last ? WARN : MUTED}>{text}</text>
            {!last && (
              <>
                <line x1={160} x2={160} y1={y + boxH} y2={y + boxH + gap - 6} stroke={MUTED} strokeWidth={1} />
                <polygon points={`${156},${y + boxH + gap - 7} ${164},${y + boxH + gap - 7} ${160},${y + boxH + gap}`} fill={MUTED} />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function LockedRatePressureViz() {
  return (
    <SceneShell
      eyebrow="잠긴 값과 움직이는 값"
      title="비율을 잠그면 국외 지급 20은 다른 값이 받습니다"
      description="금 1과 통화 5의 비율을 못 바꾸면 20을 줄이는 일은 어디로 갈까요? 3절의 설명용 숫자를 그대로 씁니다."
      note="3절의 금 100, 통화 500, 약속 5:1, 국외 지급 20은 모두 조정 구조를 보여 주는 가정입니다."
      ariaLabel="고정 비율 때문에 국외 지급 20이 다섯 값으로 넘어가는 구조와 위기의 순서"
      scenes={SCENES}
      render={(index) => (index === 2 ? <Chain /> : <Pressure index={index} />)}
    />
  );
}
