import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 첫 부품은 주가·시간 위치마다 흔들림을 정하고, 둘째는 흔들림 자체를 무작위 상태로 두고, 셋째는 드문 큰 이동을 따로 둔다.
 * 위 = 주가 경로, 아래 = 그 순간 쓰는 흔들림 크기. 눈금 없는 모양 그림이며 모든 곡선 모양은 설명용 가정이다.
 * 같은 난수 열을 네 장면에 똑같이 써서 부품 하나만 바꿨을 때의 차이만 보이게 한다.
 */
const W = 360;
const H = 220;
const N = 120;
const X0 = 20;
const X1 = 340;
const BASE_AMP = 0.011;
const T = Array.from({ length: N }, (_, index) => index / (N - 1));
const Z_RAW = T.map((_, index) => {
  const value = Math.sin((index + 1) * 12.9898) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
});
/** 난수 열의 평균을 0으로 맞춰, 장면 차이가 우연한 한쪽 쏠림이 아니라 부품 차이로만 보이게 한다. */
const Z_MEAN = Z_RAW.reduce<number>((sum, z) => sum + z, 0) / N;
const Z = Z_RAW.map((z) => z - Z_MEAN);
const TREND = T.map((t) => -0.3 * Math.sin(Math.PI * t));
const JUMP_AT = 78;
const JUMP_SIZE = -0.22;

type Mode = "flat" | "local" | "stochastic" | "jump";

const STOCHASTIC = T.map((t) => BASE_AMP * Math.max(0.35, 1.2 + 0.9 * Math.sin(9.3 * t + 0.6) + 0.5 * Math.sin(21.7 * t + 2.1)));
/** 지역변동성 장면의 규칙(가정): 주가가 낮은 자리일수록 흔들림이 크다. 같은 자리면 같은 크기. */
const localAmp = (level: number) => BASE_AMP * (0.7 + 1.6 * Math.min(1.7, Math.max(0, -level) / 0.3));

interface PathState {
  price: number[];
  amp: number[];
}

/** 한 칸씩 앞으로 가며 그 순간의 흔들림 크기를 정하고 주가를 움직인다. */
function buildPath(mode: Mode): PathState {
  return Z.reduce<PathState>(
    (acc, z, index) => {
      const prev = index === 0 ? 0 : acc.price[index - 1];
      const amp = mode === "local" ? localAmp(prev) : mode === "stochastic" ? STOCHASTIC[index] : BASE_AMP;
      const drift = index === 0 ? 0 : TREND[index] - TREND[index - 1];
      const jump = mode === "jump" && index === JUMP_AT ? JUMP_SIZE : 0;
      return { price: [...acc.price, prev + drift + amp * z * 1.6 + jump], amp: [...acc.amp, amp] };
    },
    { price: [], amp: [] },
  );
}

const xAt = (index: number) => X0 + (index / (N - 1)) * (X1 - X0);
const yPrice = (value: number) => 30 - value * 155;
const yVol = (amp: number) => 196 - (amp / (BASE_AMP * 3.4)) * 44;

const SCENES = [
  { label: "흔들림 하나", mode: "flat", summary: "크기가 늘 같음", note: "비교 기준입니다. 흔들림 숫자 하나(예: 20%)만 쓰면 주가가 어디에 있든, 언제든 아래 줄의 흔들림 크기가 같습니다." },
  { label: "첫 부품 · 자리", mode: "local", summary: "자리에 따라 정해진 크기", note: "첫 부품은 주가와 시간의 위치마다 흔들림을 정합니다. 이 그림에서는 주가가 낮은 자리일수록 크게 정했습니다(가정). 같은 자리로 오면 같은 크기입니다(6절의 지역변동성)." },
  { label: "둘째 부품 · 자기 경로", mode: "stochastic", summary: "흔들림이 스스로 움직임", note: "둘째 부품은 흔들림 자체를 별도 무작위 상태로 둡니다. 주가 위치와 별개로 아래 줄이 높아졌다 낮아지는 자기 경로를 가집니다(모양은 가정, 6절의 확률변동성)." },
  { label: "셋째 부품 · 점프", mode: "jump", summary: "연속 경로 밖의 큰 이동", note: "셋째 부품은 드물지만 큰 이동의 도착 횟수와 크기를 따로 둡니다. 흔들림 크기는 그대로인데 주가가 한순간에 끊겨 내려앉습니다(6절의 점프확산)." },
] as const satisfies readonly { label: string; mode: Mode; summary: string; note: string }[];

const PATH_DATA = SCENES.map((scene) => {
  const { price, amp } = buildPath(scene.mode);
  return {
    price: price.map((value, index) => `${xAt(index).toFixed(1)},${yPrice(value).toFixed(1)}`).join(" "),
    vol: amp.map((value, index) => `${xAt(index).toFixed(1)},${yVol(value).toFixed(1)}`).join(" "),
    jumpFrom: yPrice(price[JUMP_AT - 1]),
    jumpTo: yPrice(price[JUMP_AT]),
  };
});

const PRICE = "#2563eb";
const VOL = "#d97706";
const JUMP = "#dc2626";

export default function ThreePartsPathViz() {
  return (
    <SceneShell
      eyebrow="세 부품"
      title="흔들림을 자리·자기 경로·점프로 나누면 경로 모양이 달라집니다"
      description="위 줄은 주가 경로, 아래 줄은 그 순간 모형이 쓰는 흔들림 크기입니다. 눈금 없는 모양 그림이고 곡선은 모두 설명용 가정입니다. 네 장면은 같은 무작위 열을 쓰고 부품 하나만 바꿉니다."
      ariaLabel="같은 무작위 열에서 고정 흔들림, 자리별 흔들림, 흔들림의 자기 경로, 점프를 바꿨을 때 주가 경로와 흔들림 크기의 변화"
      scenes={SCENES}
      render={(active) => {
        const data = PATH_DATA[active];
        const isJump = SCENES[active].mode === "jump";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={14} fontSize={12} fontWeight={700} fill={PRICE}>주가 경로</text>
            <polyline points={data.price} fill="none" stroke={PRICE} strokeWidth={1.25} strokeLinejoin="round" />
            {isJump && (
              <g>
                <line x1={xAt(JUMP_AT)} x2={xAt(JUMP_AT)} y1={data.jumpFrom} y2={data.jumpTo} stroke={JUMP} strokeWidth={1.25} strokeDasharray="3 2" />
                <text x={xAt(JUMP_AT) + 6} y={(data.jumpFrom + data.jumpTo) / 2 + 4} fontSize={12} fontWeight={700} fill={JUMP}>점프</text>
              </g>
            )}
            <line x1={X0} x2={X1} y1={136} y2={136} stroke="#e2e8f0" strokeWidth={1} />
            <text x={X0} y={152} fontSize={12} fontWeight={700} fill={VOL}>흔들림 크기</text>
            <line x1={X0} x2={X1} y1={196} y2={196} stroke="#94a3b8" strokeWidth={1} />
            <polyline points={data.vol} fill="none" stroke={VOL} strokeWidth={1.25} strokeLinejoin="round" />
            <text x={X1} y={212} textAnchor="end" fontSize={12} fill="#64748b">시간 →</text>
          </svg>
        );
      }}
    />
  );
}
