import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 내일 상할 10단위(가정). 보관이 없으면 오늘 구매자를 거절하기 어렵고,
 * 보관하면 다음 구매자를 기다릴 수 있지만 부담이 생깁니다. 가로 간격은 순서만 뜻합니다.
 */
const SCENES = [
  { label: "보관할 수 없으면", summary: "안 팔면 내일 10단위가 상함", note: "내일 상할 물건 10단위를 가진 농가는 오늘 사겠다는 구매자를 쉽게 거절하기 어렵습니다(가정). 내일이면 상할 물건이라 미룰 시간이 없습니다." },
  { label: "보관할 수 있으면", summary: "다음 구매자를 기다릴 수 있음", note: "보관하면 다음 구매자를 기다릴 수 있습니다. 공짜는 아닙니다. 냉장 설비와 전기, 먼저 지급한 돈의 부담이 기다리는 동안 생깁니다." },
] as const;

const COLS = [80, 195, 310] as const;

function Lane({ y, on, title, children }: { y: number; on: boolean; title: string; children: ReactNode }) {
  return (
    <g opacity={on ? 1 : 0.3}>
      <text x={15} y={y} fontSize={13} fontWeight={700} fill="#64748b">{title}</text>
      {children}
    </g>
  );
}

function Stop({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={5} fill={color} />
      <text x={x} y={y + 21} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function HoldOrSellViz() {
  return (
    <SceneShell
      eyebrow="시간과 선택권"
      title="보관할 수 있으면 오늘의 제안을 미룰 여지가 생깁니다"
      description="위 줄은 보관할 수 없는 농가, 아래 줄은 보관할 수 있는 농가입니다. 가로 간격은 순서만 뜻합니다(가정)."
      ariaLabel="보관 여부에 따라 오늘의 구매자를 거절할 수 있는지 달라지는 두 경로"
      scenes={SCENES}
      render={(scene) => (
        <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
          {["오늘", "내일", "그 뒤"].map((name, index) => (
            <text key={name} x={COLS[index]} y={14} textAnchor="middle" fontSize={13} fill="#64748b">{name}</text>
          ))}
          <Lane y={38} on={scene === 0} title="보관 없음">
            <line x1={COLS[0] + 6} x2={COLS[1] - 6} y1={58} y2={58} stroke="#94a3b8" strokeWidth={1} />
            <Stop x={COLS[0]} y={58} color="#2563eb" label="오늘의 구매자" />
            <Stop x={COLS[1]} y={58} color="#dc2626" label="안 팔면 10단위 상함" />
          </Lane>
          <Lane y={118} on={scene === 1} title="보관 있음">
            <line x1={COLS[0] + 6} x2={COLS[2] - 6} y1={138} y2={138} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
            <Stop x={COLS[0]} y={138} color="#2563eb" label="거절할 수 있음" />
            <Stop x={COLS[2]} y={138} color="#16a34a" label="다음 구매자" />
            <text x={COLS[1] + 8} y={130} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">냉장·전기·먼저 낸 돈</text>
          </Lane>
        </svg>
      )}
    />
  );
}
