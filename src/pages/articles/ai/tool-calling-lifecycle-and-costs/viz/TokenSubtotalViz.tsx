import SceneShell from "./SceneShell";

/**
 * 본문 대응: #context-cost — 354 + 10×(40+160) + 2×150 = 2,654. 부분합이며 최종 요금이 아니다.
 * 아래 막대는 한 축척으로 그린 길이다. 부분합 밖의 항목은 값이 없어 축척 위에 놓지 않는다.
 */
const NOTICE = 354;
const NAME = 40;
const FORMAT = 160;
const TOOLS = 10;
const RESULT = 150;
const RESULTS = 2;
const SCHEMA = TOOLS * (NAME + FORMAT);
const TOTAL = NOTICE + SCHEMA + RESULTS * RESULT;

const LEFT = 10;
const WIDTH = 340;
const scale = (value: number) => (value / TOTAL) * WIDTH;
const BAR_Y = 92;
const BAR_H = 26;

const SCENES = [
  { label: "기능 하나를 뜯어 봅니다", summary: "40 + 160 = 200", note: "기능 하나의 설명은 이름·설명 40 token과 입력 형식 160 token입니다(가정). 위 막대는 이 하나를 확대한 것이고, 아래 긴 막대에서는 진한 한 칸입니다." },
  { label: "기능이 10개면", summary: "10 × 200 = 2,000", note: "같은 길이의 기능 설명 10칸이면 2,000 token입니다(가정). 호출하지 않을 기능의 설명도 이번 요청에 실었다면 칸에 들어갑니다." },
  { label: "나머지를 더합니다", summary: `354 + 2,000 + 300 = ${TOTAL.toLocaleString("en-US")}`, note: "이전 결과 2개가 150씩 300(가정), 별도 안내가 354입니다. 354는 2026-10-04 확인한 Claude 문서 Sonnet 5 행에서 tool_choice가 auto·none일 때의 값이며 다른 모델로 일반화하지 않습니다." },
  { label: "이 막대 밖에 남은 것", summary: "2,654는 부분합", note: "점선 칸은 2,654에 들어 있지 않습니다. 값을 정하지 않은 항목이라 칸 크기는 양을 뜻하지 않습니다. 실제 비용은 제공자의 usage와 가격 규칙을 확인합니다." },
] as const;

const OUTSIDE = ["사용자 질문", "다른 대화 내용", "출력 token", "다시 넣는 호출 이력", "서버 도구 사용료", "캐시 입력 요금"] as const;

export default function TokenSubtotalViz() {
  return (
    <SceneShell
      eyebrow="입력 길이 부분합"
      title="2,654는 도구가 입력에 보탠 일부만 센 값입니다"
      description="token은 모델이 처리하는 입력 단위입니다. 긴 막대 전체가 2,654 token이고, 칸 길이는 한 축척입니다."
      ariaLabel="기능 설명, 이전 결과, 별도 안내를 더한 2,654 token 부분합과 그 밖의 항목"
      scenes={SCENES}
      render={(active) => {
        const schemaStart = LEFT + scale(NOTICE);
        const cellW = scale(NAME + FORMAT);
        const resultStart = schemaStart + scale(SCHEMA);
        const showRest = active >= 2;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {active < 2 ? (
                <g>
                  <text x={LEFT} y={14} fontSize={11} fill="#64748b">기능 하나 확대</text>
                  <rect x={LEFT} y={22} width={WIDTH * (NAME / (NAME + FORMAT))} height={26} fill="#2563eb" opacity={0.85} />
                  <rect x={LEFT + WIDTH * (NAME / (NAME + FORMAT))} y={22} width={WIDTH * (FORMAT / (NAME + FORMAT))} height={26} fill="#2563eb" opacity={0.35} />
                  <text x={LEFT + 34} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">이름·설명 40</text>
                  <text x={LEFT + 68 + 136} y={40} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">입력 형식 160</text>
                </g>
              ) : (
                <text x={180} y={42} textAnchor="middle" fontSize={20} fontWeight={700} fill="#2563eb">{active === 2 ? `${TOTAL.toLocaleString("en-US")} token` : "부분합 2,654 token"}</text>
              )}
              <text x={LEFT} y={BAR_Y - 8} fontSize={11} fill="#64748b">한 축척으로 그린 부분합</text>
              <rect x={LEFT} y={BAR_Y} width={WIDTH} height={BAR_H} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              {showRest && <rect x={LEFT} y={BAR_Y} width={scale(NOTICE)} height={BAR_H} fill="#d97706" opacity={0.75} />}
              {Array.from({ length: TOOLS }, (_, index) => (
                <rect
                  key={index}
                  x={schemaStart + index * cellW}
                  y={BAR_Y}
                  width={cellW}
                  height={BAR_H}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth={1}
                  opacity={active === 0 ? (index === 0 ? 0.85 : 0.1) : 0.55}
                />
              ))}
              {showRest &&
                Array.from({ length: RESULTS }, (_, index) => (
                  <rect key={index} x={resultStart + index * scale(RESULT)} y={BAR_Y} width={scale(RESULT)} height={BAR_H} fill="#16a34a" stroke="#ffffff" strokeWidth={1} opacity={0.7} />
                ))}
              <text x={active === 0 ? schemaStart : schemaStart + scale(SCHEMA) / 2} y={BAR_Y + BAR_H + 16} textAnchor={active === 0 ? "start" : "middle"} fontSize={11} fill="#2563eb">{active === 0 ? "기능 한 칸 200" : "기능 설명 2,000"}</text>
              {showRest && (
                <>
                  <text x={LEFT} y={BAR_Y + BAR_H + 16} fontSize={11} fill="#b45309">안내 354</text>
                  <text x={LEFT + WIDTH} y={BAR_Y + BAR_H + 16} textAnchor="end" fontSize={11} fill="#15803d">결과 300</text>
                </>
              )}
              {active === 3 && (
                <g>
                  <text x={LEFT} y={154} fontSize={11} fontWeight={700} fill="#64748b">막대 밖 · 값을 정하지 않음</text>
                  {OUTSIDE.map((item, index) => {
                    const x = LEFT + (index % 3) * 115;
                    const y = 162 + Math.floor(index / 3) * 34;
                    return (
                      <g key={item}>
                        <rect x={x} y={y} width={110} height={28} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
                        <text x={x + 55} y={y + 18} textAnchor="middle" fontSize={11} fill="#64748b">{item}</text>
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
