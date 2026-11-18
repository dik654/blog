import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — block 1개 × 64 threads가 warp 2개로 나뉘고, 37번은 두 번째 warp의 lane 5.
 * 37 × 4 = 148바이트. 시작 주소가 128바이트 경계에 맞는다는 전제에서 warp 하나의 입력 128B = 32B sector 4개.
 * 입력 A·B: 8 + 8 = 16 sectors, 출력 C: 8 sectors → 24 × 32B = 768B (주소 범위 계산, HBM 실측 아님).
 */
const THREADS = 64;
const WARP = 32;
const TARGET = 37;
const ELEM_BYTES = 4;
const SECTOR_BYTES = 32;
const ARRAY_BYTES = THREADS * ELEM_BYTES; // 256
const SECTORS_PER_ARRAY = ARRAY_BYTES / SECTOR_BYTES; // 8
const TARGET_BYTE = TARGET * ELEM_BYTES; // 148
const TARGET_SECTOR = Math.floor(TARGET_BYTE / SECTOR_BYTES); // 4 (다섯 번째)

const X0 = 40;
const SPAN = 300;
const CELL = SPAN / WARP; // thread 칸
const BYTE_PX = SPAN / ARRAY_BYTES; // 바이트당 px
const SECTOR_PX = SECTOR_BYTES * BYTE_PX;
const ROW_Y = [22, 56] as const;
const ROW_H = 16;
const STRIPS = [
  { name: "A", role: "입력", y: 106 },
  { name: "B", role: "입력", y: 140 },
  { name: "C", role: "출력", y: 174 },
] as const;
const STRIP_H = 18;

const BLUE = "#2563eb";
const TEAL = "#0f766e";
const AMBER = "#d97706";
const INK = "#334155";
const MUTED = "#64748b";
const LINE = "#cbd5e1";
const FAINT = "#f1f5f9";

const SCENES = [
  { label: "64 threads는 warp 2개입니다", summary: "37 = 두 번째 warp · lane 5", note: "Warp는 명령을 함께 진행하는 thread 32개 묶음이고, lane은 warp 안의 자리 번호(0–31)입니다. 37번은 32개를 넘겼으므로 두 번째 warp에 있고, 그 안의 lane 번호는 37 − 32 = 5입니다(0부터 세므로 여섯 번째 칸)." },
  { label: "37번은 세 배열의 같은 자리를 씁니다", summary: "A+148B · B+148B → C+148B", note: "원소 하나가 4바이트이므로 37 × 4 = 148바이트 떨어진 곳을 읽고 씁니다. 세 줄은 각 배열의 256바이트를 같은 축척으로 펼친 것입니다." },
  { label: "warp 하나의 입력은 sector 4개입니다", summary: "32 × 4B = 128B = 32B × 4", note: "Sector는 메모리 요청이 다루는 32바이트 단위입니다. 시작 주소가 128바이트 경계에 맞는다고 놓으면(compute capability 6.0 이상 규칙) 한 warp가 A에서 읽는 128바이트는 sector 4개에 걸칩니다. 37번이 속한 두 번째 warp는 128–255B의 sector 4개를 읽고, 37번의 148바이트는 그중 첫 칸(128–159B)에 있습니다. 첫 warp도 0–127B에서 같은 4개를 읽습니다." },
  { label: "64개 전체는 sector 24개입니다", summary: "16 + 8 = 24 × 32B = 768B", note: "두 warp가 두 입력에서 읽는 범위는 16 sectors, 출력 C는 8 sectors이고 합하면 유효 768바이트입니다. 요청이 걸치는 주소 범위를 센 값이며, cache 적중과 쓰기 정책 때문에 HBM에서 실제로 오간 바이트라고 부르지 않습니다." },
] as const;

export default function WarpSectorViz() {
  return (
    <SceneShell
      eyebrow="번호에서 sector까지"
      title="37번 thread의 자리와 64개 전체가 걸치는 sector"
      description="위 두 줄은 thread 64개를 32개씩 놓은 것이고, 아래 세 줄은 배열 A·B·C의 256바이트를 같은 축척으로 펼친 것입니다. 3절의 64개·4바이트 사례를 그대로 씁니다(가정)."
      ariaLabel="64개 thread가 warp 2개로 나뉘고 37번 thread가 148바이트 위치를 읽으며 전체가 32바이트 sector 24개에 걸치는 과정"
      scenes={SCENES}
      render={(active) => {
        const tx = X0 + (TARGET % WARP) * CELL + CELL / 2;
        const ex = X0 + TARGET_BYTE * BYTE_PX + (ELEM_BYTES * BYTE_PX) / 2;
        const showSectors = active >= 2;
        return (
          <svg viewBox="0 0 360 226" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {ROW_Y.map((y, warp) => (
              <g key={warp}>
                <text x={X0} y={y - 5} fontSize={10.5} fill={warp === 1 && active <= 2 ? BLUE : INK} fontWeight={700}>
                  {warp === 0 ? "첫 warp" : "두 번째 warp"} · thread {warp * WARP}–{warp * WARP + WARP - 1}
                </text>
                {Array.from({ length: WARP }, (_, lane) => {
                  const id = warp * WARP + lane;
                  const isTarget = id === TARGET;
                  return (
                    <rect
                      key={lane}
                      x={X0 + lane * CELL + 0.6}
                      y={y}
                      width={CELL - 1.2}
                      height={ROW_H}
                      rx={1.5}
                      fill={isTarget ? BLUE : warp === 0 ? "#e2e8f0" : "#dbeafe"}
                      stroke={isTarget ? BLUE : LINE}
                      strokeWidth={1}
                    />
                  );
                })}
                <text x={X0 - 6} y={y + 12} textAnchor="end" fontSize={9} fill={MUTED}>lane</text>
              </g>
            ))}
            <text x={X0 + 0.5 * CELL} y={ROW_Y[1] + ROW_H + 10} textAnchor="middle" fontSize={9} fill={MUTED}>0</text>
            <text x={tx} y={ROW_Y[1] + ROW_H + 10} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={BLUE}>5</text>
            <text x={X0 + 31.5 * CELL} y={ROW_Y[1] + ROW_H + 10} textAnchor="middle" fontSize={9} fill={MUTED}>31</text>

            {active === 1 && (
              <path d={`M${tx} ${ROW_Y[1] + ROW_H + 13} L${tx} 96 L${ex} 100`} fill="none" stroke={BLUE} strokeWidth={1} strokeDasharray="3 2" />
            )}

            {STRIPS.map((strip) => {
              const isOutput = strip.name === "C";
              const color = isOutput ? AMBER : TEAL;
              const stripActive = active === 3 || (active === 2 && strip.name === "A");
              return (
                <g key={strip.name}>
                  <text x={X0 - 6} y={strip.y + 9} textAnchor="end" fontSize={11} fontWeight={700} fill={INK}>{strip.name}</text>
                  <text x={X0 - 6} y={strip.y + 18} textAnchor="end" fontSize={9} fill={MUTED}>{strip.role}</text>
                  <rect x={X0} y={strip.y} width={SPAN} height={STRIP_H} fill={FAINT} stroke={LINE} strokeWidth={1} />
                  {showSectors && stripActive &&
                    Array.from({ length: SECTORS_PER_ARRAY }, (_, s) => {
                      const firstWarp = s < SECTORS_PER_ARRAY / 2;
                      // 장면 3: 37번이 속한 두 번째 warp의 sector 4개를 강조하고 첫 warp 쪽은 흐리게 둔다
                      const dim = active === 2 && firstWarp;
                      return (
                        <rect
                          key={s}
                          x={X0 + s * SECTOR_PX + 1}
                          y={strip.y + 1}
                          width={SECTOR_PX - 2}
                          height={STRIP_H - 2}
                          rx={2}
                          fill={dim ? FAINT : `${color}22`}
                          stroke={active === 2 && s === TARGET_SECTOR ? BLUE : dim ? LINE : color}
                          strokeWidth={1}
                        />
                      );
                    })}
                  {active >= 1 && (
                    <rect x={X0 + TARGET_BYTE * BYTE_PX} y={strip.y} width={ELEM_BYTES * BYTE_PX} height={STRIP_H} fill={BLUE} />
                  )}
                  {active === 3 && (
                    <text x={X0 + SPAN + 4} y={strip.y + 12} fontSize={9} fill={color} fontWeight={700} textAnchor="start">8</text>
                  )}
                </g>
              );
            })}
            {[0, 128, 256].map((b) => (
              <text key={b} x={X0 + b * BYTE_PX} y={STRIPS[2].y + STRIP_H + 11} textAnchor={b === 0 ? "start" : b === 256 ? "end" : "middle"} fontSize={9} fill={MUTED}>{b}B</text>
            ))}
            {active === 1 && (
              <text x={ex + 6} y={STRIPS[0].y - 3} fontSize={10} fontWeight={700} fill={BLUE}>+148B</text>
            )}
            {active === 2 && (
              <>
                <path d={`M${X0 + 4 * SECTOR_PX} ${STRIPS[0].y - 4} L${X0 + 4 * SECTOR_PX} ${STRIPS[0].y - 8} L${X0 + 8 * SECTOR_PX} ${STRIPS[0].y - 8} L${X0 + 8 * SECTOR_PX} ${STRIPS[0].y - 4}`} fill="none" stroke={TEAL} strokeWidth={1} />
                <text x={X0 + 6 * SECTOR_PX} y={STRIPS[0].y - 11} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={TEAL}>두 번째 warp 128B = sector 4개</text>
              </>
            )}
            <text x={180} y={220} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={active === 3 ? INK : MUTED}>
              {active === 0 && "thread 64개 = 32개 × warp 2개"}
              {active === 1 && "번호 37 × 원소 4바이트 = 148바이트"}
              {active === 2 && "칸 하나 = 32바이트 sector · 128B 경계 정렬 전제"}
              {active === 3 && "입력 8+8 + 출력 8 = sector 24개 · 주소 범위 계산"}
            </text>
          </svg>
        );
      }}
    />
  );
}
