import SceneShell from "./SceneShell";

/**
 * 본문 대응: #publish-heartbeat — 최초 publish 대상과 heartbeat IHAVE 대상이 다른 peer 집합임을 보인다.
 * Alice와 연결·구독·threshold 통과 peer 38명(가정) = mesh 6 + mesh 밖 32.
 * flood_publish=true → 38명, false(구독 중) → mesh 6명.
 * IHAVE 대상 = max(6, 32 × 25% = 8) = 8명. Bob은 그중 한 명(가정), IWANT 뒤 기본 3초 안에 응답.
 */
const MESH = 6;
const OUTER = 32;
const IHAVE_MIN = 6;
const IHAVE_COUNT = Math.max(IHAVE_MIN, (OUTER * 25) / 100);
const CHOSEN: readonly number[] = Array.from({ length: IHAVE_COUNT }, (_, i) => i * (OUTER / IHAVE_COUNT));
const BOB = CHOSEN[0];

const CX = 200;
const CY = 158;
const R_IN = 52;
const R_OUT = 128;

const at = (r: number, i: number, n: number, offset = 0) => {
  const a = -Math.PI / 2 + ((i + offset) / n) * Math.PI * 2;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
};

const SCENES = [
  { label: "최초 publish · flood 기본", summary: "38명 모두 full message", note: "기본 flood_publish=true에서는 topic을 구독하고 publish score threshold를 통과한 연결 peer 38명(가정)이 모두 최초 publish 대상입니다. mesh 여섯 곳에만 보내는 것이 아닙니다." },
  { label: "최초 publish · flood 끔", summary: "mesh 6명", note: "옵션을 끄면 topic을 구독한 Alice는 mesh를 중심으로 대상을 채웁니다. 이 그림에서는 안쪽 mesh 6명입니다. 구독하지 않은 publisher라면 fanout을 씁니다." },
  { label: "heartbeat IHAVE", summary: "max(6, 32 × 25% = 8) = 8명에게 ID만", note: "heartbeat는 mesh 밖 eligible peer 32명 중 최소 6명과 25% 중 큰 쪽을 골라 message ID만 알립니다. 32 × 25% = 8이라 8명입니다. mesh 밖이 12명뿐이라면 25%는 3이라 최소 6명이 적용됩니다. 어느 8명인지는 설명용 배치입니다(가정)." },
  { label: "Bob의 IWANT", summary: "IWANT → full message · 기본 3초", note: "IHAVE를 받은 Bob이 그 ID를 모르면 IWANT로 요청하고 Alice는 cache에 남은 full message를 보냅니다. 기본 3초 안에 오지 않으면 broken promise가 local peer score penalty가 될 수 있습니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#94a3b8";

export default function PeerSetViz() {
  return (
    <SceneShell
      eyebrow="peer 집합 두 개"
      title="최초 publish는 full message를, heartbeat는 mesh 밖 일부에 ID만 보냅니다"
      description="가운데가 Alice, 안쪽 원 6개가 topic mesh, 바깥 원 32개가 mesh 밖 peer입니다(인원은 가정). 파란 칠은 full message를 받는 peer, 주황 테두리는 IHAVE로 ID만 받는 peer입니다."
      ariaLabel="flood publish, mesh publish, heartbeat IHAVE, IWANT 응답의 대상 peer 비교"
      scenes={SCENES}
      render={(active) => {
        const fullAll = active === 0;
        const fullMesh = active <= 1;
        const ihave = active >= 2;
        const bobPos = at(R_OUT, BOB, OUTER);
        return (
          <svg viewBox="0 0 400 316" className="mx-auto block h-auto w-full max-w-[26rem]" role="img" aria-label={SCENES[active].summary}>
            <circle cx={CX} cy={CY} r={R_IN} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={CX} cy={CY} r={R_OUT} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            {Array.from({ length: OUTER }, (_, i) => {
              const p = at(R_OUT, i, OUTER);
              const chosen = ihave && CHOSEN.includes(i);
              const full = fullAll || (active === 3 && i === BOB);
              return (
                <g key={`o${i}`}>
                  {(full || chosen) && <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={full ? BLUE : AMBER} strokeWidth={1} strokeOpacity={0.45} strokeDasharray={full ? undefined : "4 3"} />}
                  <circle cx={p.x} cy={p.y} r={7} fill={full ? BLUE : "#ffffff"} stroke={chosen ? AMBER : full ? BLUE : GRAY} strokeWidth={chosen ? 1.25 : 1} />
                </g>
              );
            })}
            {Array.from({ length: MESH }, (_, i) => {
              const p = at(R_IN, i, MESH, 0.5);
              return (
                <g key={`m${i}`}>
                  {fullMesh && <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={BLUE} strokeWidth={1} strokeOpacity={0.6} />}
                  <circle cx={p.x} cy={p.y} r={9} fill={fullMesh ? BLUE : "#ffffff"} stroke={fullMesh ? BLUE : "#64748b"} strokeWidth={1} />
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r={18} fill="#ffffff" stroke="#0f172a" strokeWidth={1.25} />
            <text x={CX} y={CY + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">Alice</text>
            {ihave && (
              <text x={bobPos.x + 12} y={bobPos.y + 4} fontSize={12} fontWeight={700} fill={active === 3 ? BLUE : AMBER}>Bob</text>
            )}
            <text x={CX} y={306} textAnchor="middle" fontSize={12} fill="#64748b">
              {active === 3 ? "Bob → IWANT(ID) → Alice → full message (cache에서)" : ihave ? `mesh 밖 ${OUTER}명 중 ID만 받는 peer ${IHAVE_COUNT}명` : `full message 대상 ${fullAll ? MESH + OUTER : MESH}명`}
            </text>
          </svg>
        );
      }}
    />
  );
}
