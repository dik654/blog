import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kubelet-watch — kubelet의 두 보고. Lease는 10초마다, Node status는 10초마다 계산하되 변화가 없으면 5분에 한 번만 씁니다.
 * 300 ÷ 10 = 30번은 t = 10…300을 세는 값이라 status 쓰기도 같은 구간(0 < t ≤ 300)으로 세고, t = 0의 쓰기는 빈 칸으로 구분합니다. t = 120의 변화는 쓰기 시점을 보이려는 (가정)이며 그 시각 자체에 의미는 없습니다.
 */
const W = 360;
const X0 = 14;
const X1 = 346;
const END = 300;
const x = (t: number) => X0 + (t / END) * (X1 - X0);
const TENS = Array.from({ length: 30 }, (_, i) => (i + 1) * 10);

const LEASE = "#2563eb";
const CALC = "#64748b";
const WRITE = "#b45309";

const SCENES = [
  { label: "Lease 갱신", summary: "10초마다, 5분에 30번", note: "kube-node-lease namespace의 자기 이름 Lease에 renewTime을 10초마다 갱신합니다. 이것이 가벼운 심장박동입니다.", writes: null },
  { label: "status 계산", summary: "역시 10초마다", note: "Node 객체의 status에 적을 조건(Ready, MemoryPressure, DiskPressure, PIDPressure)과 Allocatable 같은 값도 10초마다 계산합니다. 계산은 아직 쓰기가 아닙니다.", writes: null },
  { label: "status 쓰기", summary: "변화 없으면 5분에 한 번", note: "계산 결과가 바뀌지 않았다면 API server에 쓰는 것은 5분에 한 번입니다. t = 0의 빈 칸은 앞선 쓰기이고 이 5분 안의 쓰기는 t = 300의 한 번입니다. status는 무거운 보고서이고, 5분 동안 30번 갱신되는 가벼운 심장박동은 Lease입니다.", writes: [300] },
  { label: "값이 바뀌면", summary: "(가정) t = 120에 변화", note: "(가정) t = 120에 조건이 바뀌었다면 5분을 기다리지 않고 씁니다. 변화가 없는 구간에는 다시 5분 주기가 적용되어 그다음 쓰기는 이 축 밖에 있습니다.", writes: [120] },
] as const;

function Lane({ y, title, on, children }: { y: number; title: string; on: boolean; children: ReactNode }) {
  return (
    <g opacity={on ? 1 : 0.25}>
      <text x={X0} y={y - 16} fontSize={12} fontWeight={700} fill="#64748b">{title}</text>
      <line x1={X0} x2={X1} y1={y} y2={y} stroke="#94a3b8" strokeWidth={1} />
      {children}
    </g>
  );
}

export default function HeartbeatLanesViz() {
  return (
    <SceneShell
      eyebrow="kubelet의 두 보고"
      title="5분 동안 Lease는 30번, status 쓰기는 변화가 없으면 한 번입니다"
      description="가로축은 시간이고 눈금 하나가 한 번의 일입니다. 간격은 v1.37.1 기본값입니다."
      ariaLabel="5분 동안의 Lease 갱신, status 계산, status 쓰기 횟수 비교"
      scenes={SCENES}
      render={(active) => {
        const writes = SCENES[active].writes ?? [];
        return (
          <svg viewBox={`0 0 ${W} 190`} className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Lane y={44} title="Lease renewTime 갱신" on={active === 0 || active >= 2}>
              {TENS.map((t) => <rect key={t} x={x(t) - 1.5} y={34} width={3} height={20} fill={LEASE} />)}
            </Lane>
            <Lane y={96} title="status 계산" on={active === 1 || active >= 2}>
              {TENS.map((t) => <circle key={t} cx={x(t)} cy={96} r={2.4} fill={CALC} />)}
            </Lane>
            <Lane y={148} title="status 쓰기" on={active >= 2}>
              {active >= 2 && <rect x={x(0) - 3} y={134} width={6} height={28} fill="none" stroke={WRITE} strokeWidth={1} />}
              {active >= 2 && <text x={x(0) + 8} y={163} fontSize={11} fill={WRITE}>빈 칸 = 앞선 쓰기</text>}
              {writes.map((t) => <rect key={t} x={x(t) - 3} y={134} width={6} height={28} fill={WRITE} />)}
              {active === 3 && <text x={x(120) + 8} y={132} fontSize={11} fontWeight={700} fill={WRITE}>(가정) 변화 → 씀</text>}
            </Lane>
            {[0, 60, 120, 180, 240, 300].map((t) => (
              <text key={t} x={x(t)} y={182} textAnchor={t === 0 ? "start" : t === 300 ? "end" : "middle"} fontSize={11} fill="#64748b">{t === 300 ? "300 s" : t}</text>
            ))}
          </svg>
        );
      }}
    />
  );
}
