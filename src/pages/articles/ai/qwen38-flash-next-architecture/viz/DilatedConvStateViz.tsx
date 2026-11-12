import SceneShell from "./SceneShell";

/**
 * 본문 대응: PleNgram.tsx 마지막 문단 묶음 — 확장 depthwise convolution, 커널 4·확장 간격 3.
 * 출력 하나가 t, t−3, t−6, t−9 네 칸을 섞으므로 다음 스텝을 위해 직전 (4−1)×3 = 9 토큰을 들고 있어야 한다.
 * n-gram 조회용 직전 토큰 id 2개는 별도의 짧은 상태다.
 */
const KERNEL = 4;
const DILATION = 3;
const STATE = (KERNEL - 1) * DILATION; // 9

// 칸 0 = t−9, 칸 10 = t+1
const CELLS = Array.from({ length: STATE + 2 }, (_, index) => index - STATE);
const label = (offset: number) => (offset === 0 ? "t" : offset > 0 ? `t+${offset}` : `t${offset}`.replace("-", "−"));

const W = 380;
const LEFT = 8;
const CELL = (W - 2 * LEFT) / CELLS.length;
const TAP = "#2563eb";
const KEEP = "#d97706";
const IDS = "#7c3aed";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "토큰 t의 출력", summary: "t, t−3, t−6, t−9", now: 0, note: "커널 4는 출력 하나가 입력 네 칸을 섞는다는 뜻이고, 확장 간격 3은 그 네 칸을 세 칸마다 하나씩 건너뛰며 고른다는 뜻입니다. 그래서 토큰 t의 출력은 t부터 9칸 전까지 닿습니다." },
  { label: "다음 토큰 t+1", summary: "t+1, t−2, t−5, t−8", now: 1, note: "새 토큰이 오면 네 칸이 한 칸씩 밀립니다. t−9는 더 이상 쓰이지 않고, 가장 오래된 칸은 t−8이 됩니다." },
  { label: "요청마다 남길 상태", summary: "(4 − 1) × 3 = 9 토큰", now: 1, note: "t+1의 출력은 그중 t−2, t−5, t−8 세 칸만 읽지만, 이어지는 t+2·t+3의 출력이 나머지 칸을 차례로 읽습니다. 그래서 새 토큰 외에 직전 9개 입력을 모두 들고 있어야 합니다. 이 9 토큰과 n-gram 조회용 직전 토큰 id 2개가 2번 층이 요청마다 따로 보관하는 두 종류의 짧은 상태입니다." },
] as const;

export default function DilatedConvStateViz() {
  return (
    <SceneShell
      eyebrow="확장 convolution의 상태"
      title="네 칸을 세 칸 간격으로 읽으니 직전 9 토큰을 들고 있어야 합니다"
      description="칸 하나가 토큰 위치 하나입니다. 파란 칸은 이번 출력이 섞는 입력입니다. depthwise는 채널마다 따로 이 계산을 한다는 뜻이라, 그림의 칸 배치는 모든 채널에 같습니다."
      ariaLabel="커널 4, 확장 간격 3인 convolution이 섞는 위치와 요청마다 보관할 9 토큰 상태"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const taps = new Set(Array.from({ length: KERNEL }, (_, k) => scene.now - k * DILATION));
        const showState = active === 2;
        const kept = (offset: number) => showState && offset >= scene.now - STATE && offset < scene.now;
        const idKept = (offset: number) => showState && offset >= scene.now - 2 && offset < scene.now;
        const x = (offset: number) => LEFT + (offset + STATE) * CELL;
        const tapList = [...taps].sort((a, b) => a - b);
        return (
          <svg viewBox={`0 0 ${W} 180`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LEFT} y={14} fontSize={12} fill={TEXT}>입력 토큰 위치</text>
            {CELLS.map((offset) => {
              const isTap = taps.has(offset);
              const future = offset > scene.now;
              return (
                <g key={offset}>
                  <rect
                    x={x(offset) + 2}
                    y={22}
                    width={CELL - 4}
                    height={30}
                    rx={3}
                    fill={isTap ? TAP : kept(offset) ? KEEP : "#f1f5f9"}
                    fillOpacity={isTap ? 0.85 : kept(offset) ? 0.3 : 1}
                    stroke={future ? MUTED : kept(offset) ? KEEP : isTap ? TAP : MUTED}
                    strokeWidth={1}
                    strokeDasharray={future ? "3 2" : undefined}
                  />
                  <text x={x(offset) + CELL / 2} y={68} textAnchor="middle" fontSize={12} fill={offset === scene.now ? TAP : TEXT} fontWeight={offset === scene.now ? 700 : 400}>
                    {label(offset)}
                  </text>
                </g>
              );
            })}
            {tapList.map((offset) => (
              <line key={offset} x1={x(offset) + CELL / 2} y1={76} x2={x(scene.now) + CELL / 2} y2={96} stroke={TAP} strokeWidth={1} opacity={0.6} />
            ))}
            <rect x={x(scene.now) + 2} y={96} width={CELL - 4} height={18} rx={3} fill="none" stroke={TAP} strokeWidth={1.25} />
            <text x={x(scene.now) + CELL / 2} y={126} textAnchor="middle" fontSize={11} fontWeight={700} fill={TAP}>출력</text>
            {showState && (
              <g>
                {CELLS.filter(idKept).map((offset) => (
                  <rect key={offset} x={x(offset) + 4} y={136} width={CELL - 8} height={10} rx={2} fill={IDS} fillOpacity={0.25} stroke={IDS} strokeWidth={1} />
                ))}
                <text x={x(scene.now - 2) - 4} y={145} textAnchor="end" fontSize={12} fontWeight={700} fill={IDS}>n-gram id 2개</text>
                <line x1={x(scene.now - STATE) + 2} x2={x(scene.now) - 2} y1={156} y2={156} stroke={KEEP} strokeWidth={1.25} />
                <text x={x(scene.now - STATE) + 2} y={172} fontSize={12} fontWeight={700} fill={KEEP}>conv 상태 9 토큰</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
