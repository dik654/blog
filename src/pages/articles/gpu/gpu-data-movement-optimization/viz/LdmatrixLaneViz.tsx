import SceneShell from "./SceneShell";

/**
 * 본문 대응: #shared-to-register — ldmatrix가 값을 lane에 나누는 모양과 명령 수.
 * 8×8 = 64값 ÷ 32 lane = lane당 2값. 64값 × 2 B = 128 B, .x4는 512 B.
 * 4 KiB: ld.shared.b32 4096/(32×4)=32번, ldmatrix.x4 4096/512=8번. Lane당 64 halves, register 32개로 같음.
 */
const SCENES = [
  { label: "행렬 하나", summary: "64값 ÷ 32 lane = lane당 2값", note: "Lane 32개가 8개 행의 주소를 나눠 주면 8×8 행렬 하나가 lane마다 2개씩 register에 담깁니다. 행 하나에 lane 4개가 붙는 칸 배치는 설명을 위한 그림입니다(가정)." },
  { label: ".x4는 네 개", summary: "4 × 128 B = 512 B", note: "행렬 하나는 64값 × 2 B = 128 B이고 .x4는 그런 행렬 4개를 한 명령에 올립니다. 진한 칸은 lane 0의 몫으로, 네 행렬에서 2값씩 8값입니다." },
  { label: "4 KiB의 명령 수", summary: "32번 → 8번", note: "Warp의 64×32 조각 4 KiB를 올립니다. ld.shared.b32는 lane마다 4 B, 명령 하나가 128 B라 32번이고 ldmatrix.x4는 512 B라 8번입니다. 칸 하나가 issue slot을 쓰는 명령 하나입니다." },
  { label: "결과는 같습니다", summary: "lane당 64 halves · register 32개", note: "한 칸이 lane 0의 register 하나이고 같은 색이 한 명령으로 채운 묶음입니다. Register 하나에 16비트 값(halves) 2개가 들어가므로 어느 쪽이든 64 halves, register 32개이며 줄어든 것은 명령 수뿐입니다." },
] as const;

const LANE_FILL = "#2563eb";
const ALT_A = "#2563eb";
const ALT_B = "#d97706";
const MUTED = "#94a3b8";

function FullMatrix() {
  const cellW = 26;
  const cellH = 17;
  const x0 = 62;
  return (
    <g>
      {Array.from({ length: 8 }, (_, row) => (
        <g key={row}>
          <text x={x0 - 8} y={row * cellH + 13} textAnchor="end" fontSize={11} fill="#64748b">{`행 ${row}`}</text>
          {[0, 1, 2, 3].map((pair) => {
            const lane = row * 4 + pair;
            const isFirst = lane === 0;
            return (
              <g key={pair}>
                <rect x={x0 + pair * 2 * cellW + 1} y={row * cellH + 1} width={cellW * 2 - 2} height={cellH - 2} rx={2} fill={isFirst ? LANE_FILL : MUTED} fillOpacity={isFirst ? 1 : 0.2} stroke={isFirst ? LANE_FILL : MUTED} strokeWidth={1} />
                <text x={x0 + pair * 2 * cellW + cellW} y={row * cellH + 13} textAnchor="middle" fontSize={10} fontWeight={isFirst ? 700 : 400} fill={isFirst ? "#ffffff" : "currentColor"}>{`L${lane} · 2값`}</text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

function MiniMatrix({ x, index }: { x: number; index: number }) {
  const cell = 9;
  return (
    <g>
      <text x={x + 36} y={12} textAnchor="middle" fontSize={11} fill="currentColor">{`행렬 ${index + 1}`}</text>
      {Array.from({ length: 64 }, (_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const mine = i < 2;
        return <rect key={i} x={x + col * cell} y={20 + row * cell} width={cell - 1} height={cell - 1} fill={mine ? LANE_FILL : MUTED} fillOpacity={mine ? 1 : 0.25} />;
      })}
    </g>
  );
}

function Strip({ y, title, count, unit, total, cellsPerGroup }: { y: number; title: string; count: string; unit: number; total: number; cellsPerGroup: number }) {
  return (
    <g>
      <text x={8} y={y} fontSize={11} fontWeight={700} fill="currentColor">{title}</text>
      <text x={332} y={y} textAnchor="end" fontSize={11} fontWeight={700} fill="currentColor">{count}</text>
      {Array.from({ length: total }, (_, i) => (
        <rect key={i} x={8 + i * unit} y={y + 7} width={unit - 1} height={24} rx={1} fill={Math.floor(i / cellsPerGroup) % 2 === 0 ? ALT_A : ALT_B} fillOpacity={0.75} />
      ))}
    </g>
  );
}

export default function LdmatrixLaneViz() {
  return (
    <SceneShell
      eyebrow="ldmatrix"
      title="ldmatrix 한 번이 값을 lane마다 둘씩 나눠 담습니다"
      description="Lane은 warp 안의 thread 하나입니다. Warp에는 lane이 32개 있고, fp16 값 하나는 2 B입니다. 진한 칸이 lane 0의 몫입니다."
      ariaLabel="ldmatrix가 8×8 행렬을 32 lane에 나누고 명령 수를 32번에서 8번으로 줄이는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 170" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <FullMatrix />}
          {active === 1 && (
            <g>
              {[0, 1, 2, 3].map((index) => <MiniMatrix key={index} x={8 + index * 83} index={index} />)}
              <text x={170} y={120} textAnchor="middle" fontSize={11} fill="currentColor">행렬 하나 = 64값 × 2 B = 128 B</text>
              <text x={170} y={138} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">한 명령 = 128 B × 4 = 512 B</text>
              <text x={170} y={156} textAnchor="middle" fontSize={11} fill="#64748b">lane 0 = 2값 × 4 = 8값</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <Strip y={24} title="ld.shared.b32 · 명령당 128 B" count="32번" unit={10} total={32} cellsPerGroup={1} />
              <Strip y={100} title="ldmatrix.x4 · 명령당 512 B" count="8번" unit={10} total={8} cellsPerGroup={1} />
            </g>
          )}
          {active === 3 && (
            <g>
              <Strip y={24} title="ld.shared.b32 · 명령 하나에 1칸" count="register 32개" unit={10} total={32} cellsPerGroup={1} />
              <Strip y={100} title="ldmatrix.x4 · 명령 하나에 4칸" count="register 32개" unit={10} total={32} cellsPerGroup={4} />
            </g>
          )}
        </svg>
      )}
    />
  );
}
