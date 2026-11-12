import SceneShell from "./SceneShell";

/**
 * 본문 대응: #resize-crop — 축소할 때 계단 현상을 줄이는 처리(안티에일리어싱)를 끄면 가는 무늬가 엉뚱한 패턴이 된다.
 * 가정: 1차원 줄무늬 40픽셀, 5픽셀마다 앞 2픽셀이 어두움. 4배 축소해 10픽셀로.
 * 건너뛰기: 0·4·8…번째 픽셀만 고름 → 어두움 1,0,0,0,1,1,0,0,0,1 (원본에 없는 굵은 줄).
 * 평균: 4픽셀씩 평균 → 0.5,0.5,0.5,0.25,0.25,0.5,0.5,0.5,0.25,0.25 (명암 차 1 → 0.25).
 */
const SOURCE = Array.from({ length: 40 }, (_, i) => (i % 5 < 2 ? 1 : 0));
const FACTOR = 4;
const OUT = SOURCE.length / FACTOR;
const PICKED = Array.from({ length: OUT }, (_, j) => SOURCE[j * FACTOR]);
const AVERAGED = Array.from({ length: OUT }, (_, j) =>
  SOURCE.slice(j * FACTOR, (j + 1) * FACTOR).reduce<number>((sum, v) => sum + v, 0) / FACTOR,
);

const SCENES = [
  {
    label: "원본 줄무늬",
    summary: "40픽셀 · 가는 줄",
    note: "가는 줄무늬가 반복되는 원본입니다. 이것을 4배 줄여 10픽셀로 만들어야 합니다(가정).",
  },
  {
    label: "건너뛰어 고르기",
    summary: "4픽셀마다 하나 → 굵은 줄",
    note: "처리를 끄고 4픽셀마다 하나만 고르면 원본에 없던 굵은 줄이 나타납니다. 모델은 이 가짜 무늬를 실제 특징처럼 인코딩할 수 있습니다.",
  },
  {
    label: "이웃을 평균 내 줄이기",
    summary: "명암 차 1 → 0.25",
    note: "계단 현상을 줄이는 처리는 버릴 픽셀을 이웃과 섞어 줄이는 쪽입니다. 4픽셀씩 평균 내면 어두운 정도가 0.25와 0.5 사이에서만 오가, 건너뛰기의 검정·흰색(차이 1)보다 가짜 무늬가 훨씬 옅어집니다.",
  },
] as const;

const W = 360;
const H = 150;
const SRC_CELL = 8;
const OUT_CELL = SRC_CELL * FACTOR;
const X0 = (W - SOURCE.length * SRC_CELL) / 2;

function shade(dark: number) {
  const v = Math.round(241 - dark * (241 - 30));
  const hex = v.toString(16).padStart(2, "0");
  return `#${hex}${hex}${hex}`;
}

export default function AliasingViz() {
  return (
    <SceneShell
      eyebrow="축소와 계단 현상"
      title="픽셀을 건너뛰어 줄이면 없던 무늬가 생깁니다"
      description="한 줄짜리 줄무늬를 4배 줄여 보는 가정 예입니다. 위 줄이 원본, 아래 줄이 줄인 결과이며 아래 칸 하나가 위 칸 넷을 대신합니다."
      ariaLabel="가는 줄무늬를 건너뛰어 축소할 때와 평균 내 축소할 때의 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const out = active === 1 ? PICKED : active === 2 ? AVERAGED : null;
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[560px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            <text x={X0} y={18} fontSize={13} fill="#64748b">원본 40픽셀</text>
            {SOURCE.map((v, i) => (
              <rect
                key={i}
                x={X0 + i * SRC_CELL}
                y={26}
                width={SRC_CELL}
                height={28}
                fill={shade(v)}
                stroke={active === 1 && i % FACTOR === 0 ? "#dc2626" : "none"}
                strokeWidth={1}
              />
            ))}
            {active === 1 &&
              PICKED.map((_, j) => (
                <line
                  key={j}
                  x1={X0 + j * OUT_CELL + SRC_CELL / 2}
                  x2={X0 + j * OUT_CELL + OUT_CELL / 2}
                  y1={56}
                  y2={84}
                  stroke="#dc2626"
                  strokeWidth={1}
                />
              ))}
            {active === 2 &&
              AVERAGED.map((_, j) => (
                <path
                  key={j}
                  d={`M ${X0 + j * OUT_CELL + 1} 58 L ${X0 + j * OUT_CELL + OUT_CELL / 2} 82 L ${X0 + (j + 1) * OUT_CELL - 1} 58`}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={1}
                />
              ))}
            <text x={X0} y={102} fontSize={13} fill="#64748b">
              {out ? "줄인 결과 10픽셀" : "줄인 결과는 다음 장면에서"}
            </text>
            {Array.from({ length: OUT }, (_, j) => (
              <rect
                key={j}
                x={X0 + j * OUT_CELL}
                y={110}
                width={OUT_CELL}
                height={30}
                fill={out ? shade(out[j]) : "#ffffff"}
                fillOpacity={out ? 1 : 0}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray={out ? undefined : "3 3"}
              />
            ))}
          </svg>
        );
      }}
    />
  );
}
