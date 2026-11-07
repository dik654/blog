import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #refresh — Discv4 target은 512-bit public key이고 table ID는 그 hash다.
 * 원하는 bucket에서 거꾸로 target을 만들기 어려워 random target을 쓴다고 source comment가 밝힌다.
 */
const ACCENT = "#4f46e5";
const WARN = "#dc2626";
const FOUND = "#059669";
const QUIET = "#94a3b8";
const TEXT = "#64748b";

const BOXES = [
  { x: 6, lines: ["target", "public key"], sub: "512-bit" },
  { x: 132, lines: ["table ID", "그 key의 hash"], sub: "" },
  { x: 258, lines: ["bucket", "ID로 정해지는 칸"], sub: "" },
];
const BOX_W = 96;
const ROW_Y = 22;
const BOX_H = 62;

const SCENES: readonly ShellScene[] = [
  {
    label: "원 논문은 bucket부터 고릅니다",
    summary: "bucket → target",
    note: "least-recently-used bucket은 가장 오랫동안 쓰지 않은 bucket입니다. 원 논문의 방식은 그런 bucket을 고르고 그 안에 들어갈 target을 찾는 순서입니다.",
  },
  {
    label: "Discv4에서는 방향이 정해져 있습니다",
    summary: "public key → hash → table ID",
    note: "Discv4 target은 512-bit public key이고 table ID는 그 hash입니다. key에서 ID로 가는 쪽은 hash 계산 한 번이면 됩니다.",
  },
  {
    label: "거꾸로 가려면 preimage가 필요합니다",
    summary: "bucket → ID → key ?",
    note: "원하는 bucket에 들어가는 target을 얻으려면 hash 결과에서 입력을 찾아야 합니다. 그 입력이 preimage인데 source comment는 이것을 만들기 어렵다고 적습니다.",
  },
  {
    label: "그래서 target을 무작위로 뽑습니다",
    summary: "bucket 지정 대신 random target",
    note: "어느 bucket을 고를지 정하지 않고 random target을 씁니다. 이 경계는 geth v1.17.8의 source comment가 밝힌 것이며 다른 Kademlia 구현의 공통 동작으로 넓히지 않습니다.",
  },
];

function Arrow({ x1, x2, y, on, color, label }: { x1: number; x2: number; y: number; on: boolean; color: string; label: string }) {
  const dir = x2 > x1 ? -1 : 1;
  return (
    <g opacity={on ? 1 : 0.2}>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={1} />
      <path d={`M${x2 + dir * 6} ${y - 4} L${x2} ${y} L${x2 + dir * 6} ${y + 4}`} fill="none" stroke={color} strokeWidth={1} />
      {label && <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={color}>{label}</text>}
    </g>
  );
}

export default function RandomTargetViz() {
  return (
    <SceneShell
      eyebrow="왜 random target인가"
      title="원하는 bucket에서 거꾸로 target을 만들기 어려울 때"
      description="bucket은 routing table에서 거리 구간별로 연락처를 담는 칸입니다. hash는 입력에서 결과로는 쉽게 가지만 결과에서 입력으로 돌아가기 어려운 계산입니다."
      ariaLabel="public key에서 table ID와 bucket으로 가는 방향과, 거꾸로 가기 어려워 random target을 쓰는 이유"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 158" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {BOXES.map((box, index) => {
            const on = active === 0 ? index !== 1 : active === 3 ? index === 0 : true;
            const color = active === 2 && index === 0 ? WARN : active === 3 ? FOUND : ACCENT;
            return (
              <g key={box.x} opacity={on ? 1 : 0.3} className="transition-opacity duration-300 motion-reduce:transition-none">
                <rect x={box.x} y={ROW_Y} width={BOX_W} height={BOX_H} rx={8} fill={on ? `${color}14` : "none"} stroke={on ? color : QUIET} strokeWidth={1} strokeDasharray={active === 2 && index === 0 ? "4 3" : undefined} />
                <text x={box.x + BOX_W / 2} y={ROW_Y + 21} textAnchor="middle" fontSize={12} fontWeight={800} fill={on ? color : TEXT}>{box.lines[0]}</text>
                <text x={box.x + BOX_W / 2} y={ROW_Y + 37} textAnchor="middle" fontSize={10} fill={TEXT}>{index === 0 && active === 0 ? "bucket에 맞춘 값" : index === 0 && active === 3 ? "무작위로 뽑은 값" : box.lines[1]}</text>
                {box.sub && active !== 0 && <text x={box.x + BOX_W / 2} y={ROW_Y + 52} textAnchor="middle" fontSize={10} fill={TEXT}>{box.sub}</text>}
              </g>
            );
          })}
          <Arrow x1={102} x2={132} y={ROW_Y + 22} on={active === 1 || active === 2} color={active === 1 ? FOUND : QUIET} label={active === 1 ? "hash" : ""} />
          <Arrow x1={228} x2={258} y={ROW_Y + 22} on={active === 1 || active === 2} color={active === 1 ? FOUND : QUIET} label="" />
          {active === 0 && (
            <>
              <path d={`M${258 + BOX_W / 2} ${ROW_Y + BOX_H} V${ROW_Y + BOX_H + 24} H${6 + BOX_W / 2} V${ROW_Y + BOX_H + 6}`} fill="none" stroke={ACCENT} strokeWidth={1} />
              <path d={`M${6 + BOX_W / 2 - 4} ${ROW_Y + BOX_H + 8} L${6 + BOX_W / 2} ${ROW_Y + BOX_H + 2} L${6 + BOX_W / 2 + 4} ${ROW_Y + BOX_H + 8}`} fill="none" stroke={ACCENT} strokeWidth={1} />
              <text x={180} y={ROW_Y + BOX_H + 40} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>먼저 고른 bucket에 맞춰 target을 찾습니다</text>
            </>
          )}
          {active === 2 && (
            <>
              <path d={`M${258 + BOX_W / 2} ${ROW_Y + BOX_H} V${ROW_Y + BOX_H + 24} H${6 + BOX_W / 2} V${ROW_Y + BOX_H + 6}`} fill="none" stroke={WARN} strokeWidth={1} strokeDasharray="4 3" />
              <path d={`M${6 + BOX_W / 2 - 4} ${ROW_Y + BOX_H + 8} L${6 + BOX_W / 2} ${ROW_Y + BOX_H + 2} L${6 + BOX_W / 2 + 4} ${ROW_Y + BOX_H + 8}`} fill="none" stroke={WARN} strokeWidth={1} />
              <text x={180} y={ROW_Y + BOX_H + 40} textAnchor="middle" fontSize={11} fontWeight={700} fill={WARN}>hash 결과에서 입력 찾기: 어렵습니다</text>
            </>
          )}
          {active === 3 && (
            <text x={180} y={ROW_Y + BOX_H + 40} textAnchor="middle" fontSize={11} fontWeight={700} fill={FOUND}>어느 bucket이 될지는 정하지 않습니다</text>
          )}
          {active === 1 && (
            <text x={180} y={ROW_Y + BOX_H + 40} textAnchor="middle" fontSize={11} fontWeight={700} fill={FOUND}>왼쪽에서 오른쪽으로는 계산이면 됩니다</text>
          )}
        </svg>
      )}
    />
  );
}
