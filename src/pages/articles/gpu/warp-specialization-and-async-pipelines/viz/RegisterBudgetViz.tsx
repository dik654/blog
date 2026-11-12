import SceneShell from "./SceneShell";

/**
 * 본문 대응: #warp-specialization — SM register 65,536개를 384 thread 에 나누는 두 방법.
 * 균등: 65,536 ÷ 384 ≈ 170.7 → 약 170.
 * setmaxnreg: 40×128 = 5,120, 232×256 = 59,392 (warpgroup 하나당 29,696), 합 64,512, 남는 1,024.
 */
const TOTAL = 65536;
const X0 = 12;
const BAR_W = 336;
const sx = (n: number) => (n / TOTAL) * BAR_W;

const PRODUCER = 40 * 128;
const CONSUMER_ONE = 232 * 128;
const USED = PRODUCER + 2 * CONSUMER_ONE;
const LEFTOVER = TOTAL - USED;
const EVEN_ONE = TOTAL / 3;

const SCENES = [
  { label: "SM 의 register", summary: "65,536개", note: "SM 하나에 register 65,536개가 있고, 이 threadblock 의 384 thread(warpgroup 3개)가 이 예산을 나눠 씁니다." },
  { label: "똑같이 나누면", summary: "65,536 ÷ 384 ≈ 170", note: "모든 thread 가 같은 몫을 받으면 thread 당 약 170개입니다. 계산하지 않는 producer warpgroup 도 consumer 와 같은 몫을 붙잡고 있게 됩니다." },
  { label: "40 · 232 분배", summary: "5,120 + 59,392 = 64,512", note: "Producer 128 thread 는 40개씩 5,120개, consumer 256 thread 는 232개씩 59,392개를 씁니다. 합 64,512개라 65,536개 안에 들어가고 1,024개가 남습니다. 40·232는 현재 CUTLASS schedule 이 고르는 값이며 모든 kernel 의 상수가 아닙니다." },
] as const;

const C = { producer: "#0284c7", consumer: "#d97706", spare: "#94a3b8", line: "#64748b" } as const;

function Segment({ x, w, y, color, top, bottom }: { x: number; w: number; y: number; color: string; top: string; bottom: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={30} fill={`${color}26`} stroke={color} strokeWidth={1} />
      {w > 40 ? (
        <>
          <text x={x + w / 2} y={y + 13} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{top}</text>
          <text x={x + w / 2} y={y + 25} textAnchor="middle" fontSize={10.5} fill="currentColor">{bottom}</text>
        </>
      ) : null}
    </g>
  );
}

export default function RegisterBudgetViz() {
  return (
    <SceneShell
      eyebrow="Register 재분배"
      title="같은 65,536개를 producer 에게 적게, consumer 에게 많이 나눕니다"
      description="막대 전체가 SM 하나의 register 65,536개이고 길이는 개수에 비례합니다. setmaxnreg 은 warpgroup 이 쓸 thread 당 register 상한을 바꾸는 명령입니다. WG0 이 producer, WG1·2 가 consumer 입니다."
      ariaLabel="SM register 65,536개를 균등 분배와 setmaxnreg 분배로 나눈 비교"
      scenes={SCENES}
      render={(active) => {
        const yEven = 54;
        const ySet = 128;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={16} fontSize={10} fill="currentColor" opacity={0.7}>0</text>
            <text x={X0 + BAR_W} y={16} textAnchor="end" fontSize={10} fill="currentColor" opacity={0.7}>65,536</text>
            <line x1={X0} y1={22} x2={X0 + BAR_W} y2={22} stroke={C.line} strokeWidth={1} />

            <text x={X0} y={yEven - 8} fontSize={10} fontWeight={700} fill="currentColor">{active === 0 ? "register 65,536개" : "균등 분배: thread 당 약 170"}</text>
            {active === 0 ? (
              <rect x={X0} y={yEven} width={BAR_W} height={30} fill="#64748b1f" stroke={C.line} strokeWidth={1} />
            ) : (
              [0, 1, 2].map((wg) => (
                <Segment
                  key={wg}
                  x={X0 + wg * sx(EVEN_ONE)}
                  w={sx(EVEN_ONE)}
                  y={yEven}
                  color={wg === 0 ? C.producer : C.consumer}
                  top={`WG${wg}`}
                  bottom="128 × 약 170"
                />
              ))
            )}

            <g opacity={active === 2 ? 1 : 0.18}>
              <text x={X0} y={ySet - 8} fontSize={10} fontWeight={700} fill="currentColor">setmaxnreg 뒤: 40 · 232 · 232</text>
              <Segment x={X0} w={sx(PRODUCER)} y={ySet} color={C.producer} top="" bottom="" />
              <Segment x={X0 + sx(PRODUCER)} w={sx(CONSUMER_ONE)} y={ySet} color={C.consumer} top="WG1" bottom="128 × 232" />
              <Segment x={X0 + sx(PRODUCER + CONSUMER_ONE)} w={sx(CONSUMER_ONE)} y={ySet} color={C.consumer} top="WG2" bottom="128 × 232" />
              <rect x={X0 + sx(USED)} y={ySet} width={sx(LEFTOVER)} height={30} fill="none" stroke={C.spare} strokeWidth={1} strokeDasharray="2 2" />
              <line x1={X0 + sx(PRODUCER) / 2} y1={ySet + 30} x2={X0 + sx(PRODUCER) / 2} y2={ySet + 42} stroke={C.producer} strokeWidth={1} />
              <text x={X0} y={ySet + 54} fontSize={10.5} fontWeight={700} fill={C.producer}>WG0 128 × 40 = 5,120</text>
              <line x1={X0 + sx(USED) + sx(LEFTOVER) / 2} y1={ySet + 30} x2={X0 + sx(USED) + sx(LEFTOVER) / 2} y2={ySet + 42} stroke={C.spare} strokeWidth={1} />
              <text x={X0 + BAR_W} y={ySet + 54} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.75}>남는 1,024</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
