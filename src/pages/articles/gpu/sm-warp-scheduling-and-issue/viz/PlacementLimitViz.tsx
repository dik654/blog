import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sm-structure — 256 thread ÷ 32 = warp 8개, scheduler 4개 × 1개/clock = SM당 최대 4개,
 * H100 SXM5 132 SM × 4 = 528개/clock(모형 상한). 어떤 warp가 어느 scheduler로 가는지는 그리지 않는다.
 */
const SCENES = [
  { label: "256-thread block", summary: "256 ÷ 32 = warp 8개", note: "칸 하나가 thread 하나입니다. Block의 thread는 32개씩 warp가 되므로 256-thread block은 여덟 warp를 만듭니다." },
  { label: "배정은 GPU가 합니다", summary: "순서는 약속되지 않음", note: "Block은 한 SM에서 실행되고 GPU가 warp를 scheduler에 배정합니다. 프로그램은 특정 subpartition의 순서나 동시 진전을 가정하면 안 되므로 화살표를 특정 칸에 잇지 않았습니다." },
  { label: "SM 하나의 상한", summary: "1 × 4 = SM당 최대 4개", note: "Scheduler당 clock마다 warp instruction 하나를 낸다는 발행 모형입니다. 사례의 A·B·C·D는 한 scheduler가 맡은 네 warp를 골라 본 모형이고 첫 칸에 둔 것은 그림의 선택입니다(가정). 네 구역 모두가 매 clock 하나씩 낼 때만 4에 닿습니다." },
  { label: "H100 SXM5 구성", summary: "132 × 4 = 528개/clock", note: "칸 하나가 SM, 그 안의 점 하나가 scheduler입니다. NVIDIA가 공개한 132 SM 구성에 적용한 모형 상한입니다. 모든 SM과 scheduler에 발행할 일이 있고 명령 종류와 실행 장치도 허용해야 합니다. 명령 하나의 활성 lane 수와 연산 개수가 다르므로 FP32 연산 처리량으로 곧바로 바꾸지 않습니다." },
] as const;

const INK = "#64748b";
const ACCENT = "#2563eb";
const WARP_CHIPS = Array.from({ length: 8 }, (_, index) => index);
const THREADS = Array.from({ length: 32 }, (_, index) => index);
const SM_CELLS = Array.from({ length: 132 }, (_, index) => index);
const SCHEDULER_X = [24, 106, 188, 270];

function Schedulers({ top, height, rate }: { top: number; height: number; rate: boolean }) {
  return (
    <>
      {SCHEDULER_X.map((x, index) => (
        <g key={x}>
          <rect x={x} y={top} width={66} height={height} rx={6} fill="none" stroke={rate && index === 0 ? ACCENT : INK} strokeWidth={1} />
          <text x={x + 33} y={top + 18} textAnchor="middle" fontSize={11} fill={INK}>scheduler</text>
          <text x={x + 33} y={top + 34} textAnchor="middle" fontSize={12} fontWeight={700} fill={rate ? ACCENT : INK}>{rate ? "1개/clock" : index + 1}</text>
        </g>
      ))}
    </>
  );
}

export default function PlacementLimitViz() {
  return (
    <SceneShell
      eyebrow="배치 단위와 발행 상한"
      title="Block은 warp로 나뉘고, 발행 상한은 scheduler 수를 곱해 나옵니다"
      description="Warp는 thread 32개의 묶음, SM은 그 묶음을 맡는 GPU 내부 구역입니다. 장면을 넘기며 thread에서 SM 전체까지 단위를 넓혀 봅니다."
      ariaLabel="256 thread block이 8 warp로 나뉘고 SM당 4, H100 SXM5에서 528개 per clock 상한이 계산되는 과정"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox="0 0 360 230" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          {index === 0 && (
            <>
              <text x={324} y={16} textAnchor="end" fontSize={12} fill={INK}>thread 32개 = warp 하나</text>
              {WARP_CHIPS.map((row) => (
                <g key={row}>
                  <text x={28} y={39 + row * 23} textAnchor="end" fontSize={12} fill={INK}>W{row + 1}</text>
                  {THREADS.map((column) => (
                    <rect key={column} x={36 + column * 9} y={28 + row * 23} width={8} height={15} rx={1} fill={ACCENT} opacity={0.7} />
                  ))}
                </g>
              ))}
              <text x={180} y={222} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT}>8 × 32 = 256</text>
            </>
          )}
          {index === 1 && (
            <>
              {WARP_CHIPS.map((chip) => (
                <g key={chip}>
                  <rect x={18 + chip * 41} y={8} width={36} height={24} rx={4} fill={ACCENT} opacity={0.15} stroke={ACCENT} strokeWidth={1} />
                  <text x={36 + chip * 41} y={25} textAnchor="middle" fontSize={12} fill={ACCENT}>W{chip + 1}</text>
                </g>
              ))}
              <line x1={180} x2={180} y1={36} y2={94} stroke={INK} strokeWidth={1} strokeDasharray="4 3" />
              <path d="M175 88 180 95 185 88" fill="none" stroke={INK} strokeWidth={1} />
              <text x={190} y={68} fontSize={12} fill={INK}>GPU가 배정 · 어느 칸인지 약속 없음</text>
              <rect x={10} y={98} width={340} height={120} rx={8} fill="none" stroke={INK} strokeWidth={1} />
              <text x={22} y={118} fontSize={12} fontWeight={700} fill={INK}>SM 하나 · block은 한 SM에서 실행</text>
              <Schedulers top={134} height={70} rate={false} />
            </>
          )}
          {index === 2 && (
            <>
              <rect x={10} y={8} width={340} height={172} rx={8} fill="none" stroke={INK} strokeWidth={1} />
              <text x={22} y={28} fontSize={12} fontWeight={700} fill={INK}>SM 하나 · scheduler 네 개</text>
              <Schedulers top={42} height={124} rate />
              {["A", "B", "C", "D"].map((name, chip) => (
                <g key={name}>
                  <rect x={28 + (chip % 2) * 30} y={92 + Math.floor(chip / 2) * 34} width={28} height={28} rx={4} fill={ACCENT} opacity={0.15} stroke={ACCENT} strokeWidth={1} />
                  <text x={42 + (chip % 2) * 30} y={111 + Math.floor(chip / 2) * 34} textAnchor="middle" fontSize={12} fill={ACCENT}>{name}</text>
                </g>
              ))}
              <text x={180} y={206} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>1 + 1 + 1 + 1 = SM당 최대 4개/clock</text>
            </>
          )}
          {index === 3 && (
            <>
              {SM_CELLS.map((cell) => {
                const x = 18 + (cell % 12) * 27;
                const y = 6 + Math.floor(cell / 12) * 17;
                return (
                  <g key={cell}>
                    <rect x={x} y={y} width={24} height={14} rx={2} fill="none" stroke={INK} strokeWidth={0.75} />
                    {[0, 1, 2, 3].map((dot) => (
                      <rect key={dot} x={x + 2.5 + dot * 5} y={y + 5} width={4} height={4} fill={ACCENT} />
                    ))}
                  </g>
                );
              })}
              <text x={180} y={212} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>SM 132개 × 네 scheduler = 528개/clock</text>
              <text x={180} y={227} textAnchor="middle" fontSize={11} fill={INK}>해당 구성의 모형 상한 · 실측 처리량 아님</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
