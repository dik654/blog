import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #refresh — geth v1.17.8 table refresh의 순서.
 * DB seed(최대 30개, 최근 5일) + configured bootnode → self lookup 1번 → random target lookup 3번.
 * seed가 하나도 없으면 lookup은 즉시 빈 결과로 끝난다.
 */
const ACCENT = "#4f46e5";
const WARN = "#dc2626";
const FOUND = "#059669";
const QUIET = "#94a3b8";
const TEXT = "#64748b";

const SCENES: readonly ShellScene[] = [
  {
    label: "연락처부터 모읍니다",
    summary: "DB seed + bootnode",
    note: "DB에서 최근 seed를 불러오고 설정된 bootnode를 더합니다. bootnode는 첫 연락처일 뿐 신뢰 기관이 아니어서, 그 응답도 같은 wire 검증과 중복 제거, quota, timeout 정책을 거칩니다.",
  },
  {
    label: "하나도 없으면 lookup은 바로 끝납니다",
    summary: "seed 0개 → lookup 빈 결과",
    note: "물어볼 상대가 없으니 lookup은 바로 빈 결과로 끝납니다. 그래서 결과 0개는 “target이 세상에 없다”는 증명이 아닙니다.",
  },
  {
    label: "먼저 self lookup을 실행합니다",
    summary: "lookup 1번째",
    note: "self lookup은 자기 ID를 target으로 삼는 lookup입니다. seed를 모은 뒤 이것을 가장 먼저 실행합니다.",
  },
  {
    label: "이어서 random target을 세 번 찾습니다",
    summary: "1 + 3 = lookup 네 번",
    note: "random target lookup을 세 번 수행해 다른 거리 구간의 연락처를 다시 표본화합니다. 이 순서는 이 release의 동작이며 Kademlia 표준이나 bootnode 신뢰 보장으로 읽지 않습니다.",
  },
];

function Box({ x, y, w, h, lines, color, on, dashed = false }: { x: number; y: number; w: number; h: number; lines: readonly string[]; color: string; on: boolean; dashed?: boolean }) {
  const top = y + h / 2 - ((lines.length - 1) * 15) / 2 + 4;
  return (
    <g opacity={on ? 1 : 0.32} className="transition-opacity duration-300 motion-reduce:transition-none">
      <rect x={x} y={y} width={w} height={h} rx={8} fill={on ? `${color}14` : "none"} stroke={on ? color : QUIET} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={top + index * 15} textAnchor="middle" fontSize={index === 0 ? 11.5 : 10.5} fontWeight={index === 0 ? 800 : 500} fill={index === 0 && on ? color : TEXT}>{line}</text>
      ))}
    </g>
  );
}

function Arrow({ d, tip, on, color }: { d: string; tip: string; on: boolean; color: string }) {
  return (
    <g opacity={on ? 1 : 0.28}>
      <path d={d} fill="none" stroke={on ? color : QUIET} strokeWidth={1} />
      <path d={tip} fill="none" stroke={on ? color : QUIET} strokeWidth={1} />
    </g>
  );
}

export default function RefreshOrderViz() {
  return (
    <SceneShell
      eyebrow="table refresh 순서"
      title="빈 주소록에서 lookup 네 번까지 어떤 순서로 가는가"
      description="geth v1.17.8의 table refresh 순서입니다. seed는 lookup이 처음 물어볼 연락처이고, bootnode는 미리 설정해 둔 첫 연락처입니다."
      ariaLabel="DB seed와 bootnode를 모아 self lookup과 random target lookup 세 번으로 이어지는 순서"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Box x={6} y={6} w={168} h={48} lines={["DB seed", "최대 30개 · 최근 5일"]} color={ACCENT} on />
          <Box x={186} y={6} w={168} h={48} lines={["configured bootnode", "설정된 첫 연락처"]} color={ACCENT} on />
          <Arrow d="M90 54 V70" tip="M86 65 L90 71 L94 65" on color={ACCENT} />
          <Arrow d="M270 54 V62 H110 V70" tip="M106 65 L110 71 L114 65" on color={ACCENT} />
          <Box x={6} y={72} w={168} h={38} lines={["seed 묶음"]} color={ACCENT} on />
          <Arrow d="M174 91 H184" tip="M179 87 L185 91 L179 95" on={active === 1} color={WARN} />
          <Box x={186} y={72} w={168} h={38} lines={["seed 0개면", "lookup 즉시 빈 결과"]} color={WARN} on={active === 1} dashed />
          <Arrow d="M90 110 V126" tip="M86 121 L90 127 L94 121" on={active >= 2} color={FOUND} />
          <Box x={6} y={128} w={126} h={50} lines={["self lookup", "1번"]} color={FOUND} on={active >= 2} />
          <Arrow d="M132 153 H144" tip="M139 149 L145 153 L139 157" on={active === 3} color={FOUND} />
          <g opacity={active === 3 ? 1 : 0.32} className="transition-opacity duration-300 motion-reduce:transition-none">
            <text x={250} y={142} textAnchor="middle" fontSize={11.5} fontWeight={800} fill={active === 3 ? FOUND : TEXT}>random target lookup</text>
            {[0, 1, 2].map((index) => (
              <g key={index}>
                <rect x={146 + index * 71} y={150} width={66} height={28} rx={7} fill={active === 3 ? `${FOUND}14` : "none"} stroke={active === 3 ? FOUND : QUIET} strokeWidth={1} />
                <text x={146 + index * 71 + 33} y={168} textAnchor="middle" fontSize={11} fontWeight={700} fill={active === 3 ? FOUND : TEXT}>{index + 1}번째</text>
              </g>
            ))}
          </g>
        </svg>
      )}
    />
  );
}
