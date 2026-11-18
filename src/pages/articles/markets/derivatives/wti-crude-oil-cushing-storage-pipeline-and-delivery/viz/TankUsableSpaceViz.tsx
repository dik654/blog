import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 설계상 총용량에서 펌프 작동에 남겨 둘 바닥 물량과 운영 여유를 빼면
 * 새 원유를 받을 공간은 더 작다. 본문에 실제 비율이 없으므로 칸 높이는 구분용 가정이며 숫자를 적지 않는다.
 */
const SCENES = [
  { label: "설계상 총용량", summary: "겉으로 보이는 크기", step: 0, note: "탱크의 설계상 총용량입니다. 이 크기만 보면 원유를 많이 받을 수 있을 것처럼 보입니다." },
  { label: "바닥 물량을 뺍니다", summary: "펌프용으로 남겨 둘 원유", step: 1, note: "펌프와 배관이 작동하려면 탱크 바닥에 원유를 남겨 둬야 합니다. 이 바닥 물량은 비워서 새 원유를 받는 데 쓸 수 없습니다." },
  { label: "운영 여유를 뺍니다", summary: "받는 데 쓰지 않는 몫", step: 2, note: "운영 여유도 새 원유를 받는 데 쓰지 않습니다. 칸의 위치와 높이는 구분을 위한 가정입니다." },
  { label: "남는 공간", summary: "총용량 − 바닥 물량 − 운영 여유", step: 3, note: "새 원유를 받을 수 있는 공간은 총용량보다 작습니다. 명목상 빈 공간만 보고 인도 능력을 판단하면 안 되는 이유입니다." },
] as const;

const TOP = 18;
const BOTTOM = 178;
const BOTTOM_BAND = 36;
const MARGIN_BAND = 26;

export default function TankUsableSpaceViz() {
  return (
    <SceneShell
      eyebrow="탱크 한 개"
      title="총용량에서 두 몫을 빼야 받을 공간이 나옵니다"
      description="탱크 하나를 세로로 자른 그림입니다. 본문에 실제 비율이 없어 칸 높이와 위치는 구분을 위한 것(가정)이고 눈금을 두지 않았습니다."
      ariaLabel="탱크 총용량에서 바닥 물량과 운영 여유를 빼 새 원유를 받을 공간을 구하는 그림"
      scenes={SCENES}
      render={(index) => {
        const step = SCENES[index].step;
        const showBottom = step >= 1;
        const showMargin = step >= 2;
        const usableTop = TOP + (showMargin ? MARGIN_BAND : 0);
        const usableBottom = BOTTOM - (showBottom ? BOTTOM_BAND : 0);
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <rect x={40} y={TOP} width={130} height={BOTTOM - TOP} rx={8} fill="none" stroke="#64748b" strokeWidth={1.25} />
            {showMargin ? <rect x={41} y={TOP + 1} width={128} height={MARGIN_BAND - 1} fill="#d97706" opacity={0.25} /> : null}
            {showBottom ? <rect x={41} y={BOTTOM - BOTTOM_BAND} width={128} height={BOTTOM_BAND - 1} fill="#334155" opacity={0.7} /> : null}
            <rect
              x={41}
              y={usableTop}
              width={128}
              height={usableBottom - usableTop}
              fill={step === 3 ? "#2563eb" : "none"}
              opacity={step === 3 ? 0.18 : 1}
            />
            <line x1={182} x2={182} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <line x1={178} x2={186} y1={TOP} y2={TOP} stroke="#94a3b8" strokeWidth={1} />
            <line x1={178} x2={186} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <text x={192} y={TOP + 12} fontSize={11} fill="#64748b">설계상 총용량</text>
            {showMargin ? <text x={105} y={TOP + MARGIN_BAND / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">운영 여유</text> : null}
            {showBottom ? <text x={105} y={BOTTOM - BOTTOM_BAND / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">바닥 물량</text> : null}
            {step === 3 ? (
              <>
                <text x={105} y={(usableTop + usableBottom) / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">받을 수 있는 공간</text>
                <line x1={228} x2={228} y1={usableTop} y2={usableBottom} stroke="#2563eb" strokeWidth={1.25} />
                <text x={236} y={(usableTop + usableBottom) / 2 + 4} fontSize={11} fill="#2563eb">총용량보다 작음</text>
              </>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
