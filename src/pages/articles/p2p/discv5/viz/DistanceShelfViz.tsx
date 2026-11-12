import SceneShell from "./SceneShell";

/**
 * 본문 대응: #findnode — FINDNODE는 target x가 아니라 Bob 기준 거리 d를 보냅니다.
 * 8-bit 장난감 ID(가정): Bob 1011 0010, x 1001 0111 → XOR 0010 0101 → d = 6.
 * log distance = XOR 값에서 가장 높은 1의 자리(맨 오른쪽 bit를 1번), 같은 ID면 0.
 * Bob 선반(가정): 8 {0110 0101, 0001 1010}, 7 {1101 0011}, 6 {1000 1100, 1001 0001, 1001 1110},
 * 5 {1010 0000}, 4 {1011 1001}. 각 ID와 Bob의 XOR로 다시 계산해 확인했습니다.
 */
const BOB = "10110010";
const TARGET = "10010111";
const xorBits = (a: string, b: string) => a.split("").map((bit, i) => (bit === b[i] ? "0" : "1")).join("");
const logDistance = (a: string, b: string) => {
  const first = xorBits(a, b).indexOf("1");
  return first === -1 ? 0 : 8 - first;
};
const XOR = xorBits(BOB, TARGET);
const D = logDistance(BOB, TARGET);

const KNOWN: readonly string[] = ["01100101", "00011010", "11010011", "10001100", "10010001", "10011110", "10100000", "10111001"];
const SHELVES = [8, 7, 6, 5, 4, 3, 2, 1, 0].map((d) => ({
  d,
  ids: d === 0 ? [BOB] : KNOWN.filter((id) => logDistance(BOB, id) === d),
}));
const RETURNED: readonly string[] = ["10001100", "10010001", "10011110", "10100000"];

const SCENES = [
  {
    label: "ID를 bit로 놓기",
    summary: "Bob · target x (8-bit 가정)",
    note: "실제 node ID는 훨씬 긴 bit열이지만, 여기서는 8 bit로 줄인 가상의 ID를 씁니다(가정). Alice가 찾고 싶은 것은 target x 근처의 node이고, 질문을 받는 쪽은 Bob입니다.",
  },
  {
    label: "XOR 거리 계산",
    summary: `x ⊕ Bob → d = ${D}`,
    note: "두 ID를 bit마다 비교해 다르면 1, 같으면 0을 적은 것이 XOR입니다. Log distance는 그 결과에서 가장 높은 1이 있는 자리 번호입니다(맨 오른쪽을 1번, 같은 ID면 0). 여기서는 6번 자리가 가장 높은 1이므로 d = 6입니다.",
  },
  {
    label: "Bob의 거리 선반",
    summary: `FINDNODE [${D}] · x는 보내지 않음`,
    note: "Bob은 자기 ID에서 거리가 같은 node끼리 한 칸(bucket)에 모아 둡니다. Alice는 x를 보내지 않고 [6] 또는 인접 거리 목록을 보냅니다. Bob은 “내 ID에서 거리 6인 칸의 ENR를 달라”는 요청만 받습니다. 칸에 든 node는 예시입니다(가정).",
  },
  {
    label: "받은 ENR 다시 재기",
    summary: "Bob 기준 거리 ≠ 6 → 받지 않음",
    note: "Alice는 받은 ENR마다 Bob ID와의 거리를 다시 계산합니다. 서명이 맞아도 요청한 거리와 다르면 이 FINDNODE의 결과로 받지 않습니다. 네 번째 record는 그런 경우를 보이려고 넣은 가정입니다.",
  },
  {
    label: "거리 0",
    summary: "FINDNODE [0] → Bob 자신의 ENR",
    note: "Distance 0만 특수값입니다. 같은 ID와의 거리만 0이므로, [0]은 Bob 자신의 현재 ENR를 달라는 요청이 됩니다.",
  },
] as const;

const INK = "#334155";
const MUTED = "#64748b";
const LINE = "#cbd5e1";
const BOB_C = "#0f766e";
const X_C = "#4f46e5";
const HIT = "#b45309";
const FAIL = "#dc2626";
const OK = "#16a34a";

const CELL = 26;
const GX = 116;

function BitRow({ y, label, bits, color, mark }: { y: number; label: string; bits: string; color: string; mark?: number }) {
  return (
    <g>
      <text x={GX - 10} y={y + 17} textAnchor="end" fontSize={10.5} fontWeight={700} fill={color}>{label}</text>
      {bits.split("").map((bit, i) => {
        const hot = mark !== undefined && i === 8 - mark;
        return (
          <g key={i}>
            <rect x={GX + i * CELL} y={y} width={CELL - 3} height={24} rx={3} fill={hot ? "#fef3c7" : "#ffffff"} stroke={hot ? HIT : LINE} strokeWidth={hot ? 1.25 : 1} />
            <text x={GX + i * CELL + (CELL - 3) / 2} y={y + 16} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={INK}>{bit}</text>
          </g>
        );
      })}
    </g>
  );
}

const pretty = (id: string) => `${id.slice(0, 4)} ${id.slice(4)}`;

export default function DistanceShelfViz() {
  return (
    <SceneShell
      eyebrow="FINDNODE 거리"
      title="Alice는 target을 보내지 않고, Bob에게서 잰 거리 번호만 보냅니다"
      description="ID는 8 bit로 줄인 가상의 값입니다(가정). Bob이 아는 node들은 Bob ID에서 잰 거리마다 한 칸씩 나뉘어 있습니다."
      ariaLabel="target과 Bob ID의 XOR 거리로 거리 번호를 고르고 Bob의 해당 칸을 요청하는 과정"
      scenes={SCENES}
      render={(active) => {
        const bitScene = active <= 1;
        return (
          <svg viewBox="0 0 360 210" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {bitScene ? (
              <g>
                {[8, 7, 6, 5, 4, 3, 2, 1].map((pos, i) => (
                  <text key={pos} x={GX + i * CELL + (CELL - 3) / 2} y={22} textAnchor="middle" fontSize={9} fill={MUTED}>{pos}</text>
                ))}
                <text x={GX - 10} y={22} textAnchor="end" fontSize={9} fill={MUTED}>자리</text>
                <BitRow y={32} label="Bob" bits={BOB} color={BOB_C} />
                <BitRow y={64} label="target x" bits={TARGET} color={X_C} />
                {active === 1 ? (
                  <g>
                    <line x1={GX} x2={GX + 8 * CELL - 3} y1={98} y2={98} stroke={INK} strokeWidth={1} />
                    <BitRow y={106} label="XOR" bits={XOR} color={INK} mark={D} />
                    <text x={GX + (8 - D) * CELL + (CELL - 3) / 2} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill={HIT}>가장 높은 1</text>
                    <text x={180} y={178} textAnchor="middle" fontSize={11} fontWeight={700} fill={HIT}>{`log distance d = ${D}`}</text>
                    <text x={180} y={198} textAnchor="middle" fontSize={9.5} fill={MUTED}>다르면 1 · 같으면 0 · 같은 ID면 거리 0</text>
                  </g>
                ) : (
                  <g>
                    <text x={180} y={130} textAnchor="middle" fontSize={10.5} fill={INK}>Alice가 찾고 싶은 곳: target x 근처</text>
                    <text x={180} y={152} textAnchor="middle" fontSize={10.5} fill={INK}>질문을 받는 곳: Bob</text>
                    <text x={180} y={190} textAnchor="middle" fontSize={9.5} fill={MUTED}>실제 node ID는 8 bit보다 훨씬 깁니다</text>
                  </g>
                )}
              </g>
            ) : (
              <g>
                <text x={10} y={14} fontSize={9.5} fontWeight={700} fill={MUTED}>Bob 기준 거리</text>
                {SHELVES.map((shelf, row) => {
                  const y = 22 + row * 20;
                  const want = active === 4 ? 0 : D;
                  const hot = shelf.d === want;
                  return (
                    <g key={shelf.d}>
                      <rect x={8} y={y} width={240} height={17} rx={3} fill={hot ? "#fef3c7" : "#ffffff"} stroke={hot ? HIT : LINE} strokeWidth={hot ? 1.25 : 1} />
                      <text x={24} y={y + 12} textAnchor="middle" fontSize={10} fontWeight={700} fill={hot ? HIT : INK}>{shelf.d}</text>
                      {shelf.ids.length === 0 ? (
                        <text x={46} y={y + 12} fontSize={9} fill={MUTED}>비어 있음</text>
                      ) : (
                        shelf.ids.map((id, k) => (
                          <text key={id} x={46 + k * 66} y={y + 12} fontSize={9.5} fontFamily="monospace" fill={shelf.d === 0 ? BOB_C : INK}>
                            {pretty(id)}
                          </text>
                        ))
                      )}
                    </g>
                  );
                })}
                <rect x={258} y={22} width={96} height={178} rx={8} fill="#ffffff" stroke={LINE} strokeWidth={1} />
                {active === 2 && (
                  <g>
                    <text x={306} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={X_C}>Alice → Bob</text>
                    <text x={306} y={64} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={700} fill={HIT}>{`FINDNODE [${D}]`}</text>
                    <text x={306} y={92} textAnchor="middle" fontSize={9.5} fill={INK}>x는 보내지 않음</text>
                    <text x={306} y={128} textAnchor="middle" fontSize={10} fontWeight={700} fill={BOB_C}>Bob → Alice</text>
                    <text x={306} y={148} textAnchor="middle" fontSize={9.5} fill={INK}>{`거리 ${D} 칸의 ENR`}</text>
                    <text x={306} y={168} textAnchor="middle" fontSize={9.5} fill={INK}>(NODES)</text>
                  </g>
                )}
                {active === 3 && (
                  <g>
                    <text x={306} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>받은 NODES</text>
                    {RETURNED.map((id, k) => {
                      const d = logDistance(BOB, id);
                      const good = d === D;
                      return (
                        <g key={id}>
                          <text x={266} y={64 + k * 30} fontSize={9.5} fontFamily="monospace" fill={good ? INK : FAIL}>{pretty(id)}</text>
                          <text x={266} y={77 + k * 30} fontSize={9} fontWeight={700} fill={good ? OK : FAIL}>{good ? `거리 ${d} · 받음` : `거리 ${d} · 버림`}</text>
                        </g>
                      );
                    })}
                    <text x={306} y={190} textAnchor="middle" fontSize={8.5} fill={MUTED}>넷째 줄은 가정</text>
                  </g>
                )}
                {active === 4 && (
                  <g>
                    <text x={306} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={X_C}>Alice → Bob</text>
                    <text x={306} y={64} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={700} fill={HIT}>FINDNODE [0]</text>
                    <text x={306} y={128} textAnchor="middle" fontSize={10} fontWeight={700} fill={BOB_C}>Bob → Alice</text>
                    <text x={306} y={148} textAnchor="middle" fontSize={9.5} fill={INK}>Bob 자신의</text>
                    <text x={306} y={166} textAnchor="middle" fontSize={9.5} fill={INK}>현재 ENR</text>
                  </g>
                )}
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
