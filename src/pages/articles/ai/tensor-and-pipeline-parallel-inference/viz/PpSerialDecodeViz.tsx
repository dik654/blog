import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pipeline-parallel (decode) — 70B FP16 을 8 GPU 에 두면 GPU 당 17.5 GB, 3.35 TB/s 에서 5.2 ms.
 * TP 8: 여덟 GPU 가 동시에 5.2 ms + all-reduce 약 1 ms → 6 ms 남짓.
 * PP 8: 5.2 ms stage 여덟 개를 직렬로 → 약 42 ms. 빈 칸을 다른 요청이 채우는 장면은 가정이다.
 */
const GPUS = [0, 1, 2, 3, 4, 5, 6, 7] as const;
const STEP = 5.2;
const COMM = 1;
const T_MAX = 44;

const SCENES = [
  { label: "TP 8: 여덟 장이 동시에", summary: "5.2 + 약 1 = 6 ms 남짓", note: "여덟 GPU 가 각자 weight 의 8 분의 1(17.5 GB)을 동시에 읽어 5.2 ms 에 끝냅니다. layer 마다의 all-reduce 는 합쳐 약 1 ms 이며 한 덩어리로 모아 그렸습니다." },
  { label: "PP 8: 여덟 stage 를 차례로", summary: "5.2 ms × 8 ≈ 42 ms", note: "stage 마다 읽는 양도 17.5 GB 라 한 칸은 같은 5.2 ms 입니다. 다음 token 은 여덟 stage 를 차례로 지나야 나오므로 약 42 ms 가 걸립니다. hop 시간은 그리지 않았습니다." },
  { label: "PP 8: 빈 칸은 다른 요청이", summary: "한 요청은 그대로 약 42 ms", note: "동시 요청이 많으면 빈 칸에서 다른 요청(회색, 가정)을 처리해 throughput 을 지킵니다. 파란 요청 하나의 속도는 빨라지지 않습니다." },
] as const;

const LEFT = 46;
const W = 300;
const tx = (ms: number) => LEFT + (ms / T_MAX) * W;
const laneY = (gpu: number) => 24 + gpu * 15;
const LANE_H = 11;

export default function PpSerialDecodeViz() {
  return (
    <SceneShell
      eyebrow="decode 한 token"
      title="TP 8 은 여덟 GPU 가 같은 5.2 ms 를 함께 쓰고 PP 8 은 5.2 ms 를 여덟 번 이어 붙입니다"
      description="가로줄 하나가 GPU 하나이고 가로축은 시간(ms)입니다. 70B FP16 model 의 decode 에서 다음 token 하나가 나오기까지를 그렸습니다. 파란 칸은 weight 를 읽는 시간입니다."
      ariaLabel="TP 8 과 PP 8 에서 decode token 하나가 나오기까지의 GPU 별 시간표"
      scenes={SCENES}
      render={(active) => {
        const pp = active > 0;
        const endMs = pp ? STEP * GPUS.length : STEP + COMM;
        const others = active === 2 ? GPUS.flatMap((gpu) => GPUS.filter((slot) => slot !== gpu).map((slot) => ({ gpu, start: STEP * slot }))) : [];
        return (
          <svg viewBox="0 0 360 198" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {GPUS.map((gpu) => (
              <g key={gpu}>
                <text x={6} y={laneY(gpu) + 9} fontSize={10} fill="#64748b">GPU {gpu}</text>
                <line x1={LEFT} x2={LEFT + W} y1={laneY(gpu) + LANE_H / 2} y2={laneY(gpu) + LANE_H / 2} stroke="#f1f5f9" strokeWidth={1} />
                <rect x={tx(pp ? STEP * gpu : 0)} y={laneY(gpu)} width={tx(STEP) - LEFT} height={LANE_H} rx={2} fill="#2563eb" />
                {!pp && <rect x={tx(STEP)} y={laneY(gpu)} width={tx(COMM) - LEFT} height={LANE_H} rx={2} fill="#dc2626" />}
              </g>
            ))}
            {others.map(({ gpu, start }) => (
              <rect key={`${gpu}-${start}`} x={tx(start) + 0.5} y={laneY(gpu)} width={tx(STEP) - LEFT - 1} height={LANE_H} rx={2} fill="#cbd5e1" />
            ))}
            <line x1={tx(endMs)} x2={tx(endMs)} y1={18} y2={146} stroke="#475569" strokeWidth={1} strokeDasharray="3 2" />
            <text x={pp ? tx(endMs) - 4 : tx(endMs) + 4} y={14} textAnchor={pp ? "end" : "start"} fontSize={10} fontWeight={700} fill="#475569">
              token 나옴 · {pp ? "약 42 ms" : "6 ms 남짓"}
            </text>
            <line x1={LEFT} x2={LEFT + W} y1={148} y2={148} stroke="#94a3b8" strokeWidth={1} />
            {[0, 10, 20, 30, 40].map((ms) => (
              <text key={ms} x={tx(ms)} y={160} textAnchor="middle" fontSize={10} fill="#64748b">{ms}</text>
            ))}
            <text x={LEFT + W} y={160} textAnchor="end" fontSize={9} fill="#64748b">ms</text>
            <rect x={LEFT} y={172} width={10} height={8} fill="#2563eb" />
            <text x={LEFT + 14} y={180} fontSize={9.5} fill="#475569">weight 읽기 5.2 ms</text>
            <rect x={LEFT + 112} y={172} width={10} height={8} fill="#dc2626" opacity={pp ? 0.25 : 1} />
            <text x={LEFT + 126} y={180} fontSize={9.5} fill="#475569" opacity={pp ? 0.4 : 1}>all-reduce 약 1 ms</text>
            <rect x={LEFT + 222} y={172} width={10} height={8} fill="#cbd5e1" opacity={active === 2 ? 1 : 0.3} />
            <text x={LEFT + 236} y={180} fontSize={9.5} fill="#475569" opacity={active === 2 ? 1 : 0.4}>다른 요청(가정)</text>
          </svg>
        );
      }}
    />
  );
}
