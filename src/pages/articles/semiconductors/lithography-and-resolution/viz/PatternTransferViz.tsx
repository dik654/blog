import SceneShell from "./SceneShell";

/**
 * 본문 대응: #transfer — 감광막 도포 → 레티클을 거쳐 노광(무늬를 줄여 기록) → 굽고 현상 → 열린 곳 식각 → 감광막 제거.
 * 단면 그림. 빛 받은 자리가 씻겨 나가는 한 경우만 그렸다(가정). 감광막 종류에 따라 반대일 수 있다(본문 7절).
 * 층 두께·축소 비율은 그림용이며 실제 치수가 아니다.
 */
const SCENES = [
  { label: "감광막 바르기", summary: "웨이퍼 · 아래 막 · 감광막", note: "아래 막을 바로 깎지 않고 빛에 반응하는 감광막을 먼저 바릅니다. 무늬를 기록할 임시 자리입니다." },
  { label: "레티클을 거쳐 빛 비추기", summary: "노광: 무늬를 줄여 기록", note: "레티클을 지난 빛을 광학계가 줄여 감광막에 비춥니다. 빛 받은 자리의 성질이 바뀌고 아래 막은 그대로입니다." },
  { label: "굽고 현상하기", summary: "감광막에 120 nm 창", note: "현상하면 선택한 부분이 씻겨 나가 창이 생깁니다. 감광막 종류·조건에 따라 반대쪽이 남을 수도 있습니다. (가정)" },
  { label: "열린 곳만 식각", summary: "남은 감광막이 나머지를 가림", note: "감광막 창으로 드러난 아래 막만 깎입니다. 남은 감광막이 나머지 부분을 가립니다." },
  { label: "감광막 제거", summary: "아래 막에 창이 남음", note: "감광막을 제거하면 아래 막에 창이 남습니다. 앞 글의 ‘산화막 창’이 이렇게 옮겨진 결과입니다." },
] as const;

const W = 360;
const H = 236;
const LEFT = 30;
const RIGHT = 330;
const MID = (LEFT + RIGHT) / 2;
const WIN = 60; // 그림 속 창 폭(px). 120 nm라는 라벨만 본문 값이다.
const WAFER_Y = 196;
const FILM_Y = 168;
const RESIST_Y = 146;

export default function PatternTransferViz() {
  return (
    <SceneShell
      eyebrow="무늬 전달 순서 · 단면"
      title="감광막에 먼저 기록하고 그 창으로 아래 막을 엽니다"
      description="옆에서 자른 단면입니다. 회색은 웨이퍼, 파랑은 아래 막, 주황은 빛에 반응하는 감광막입니다. 레티클은 옮길 무늬가 담긴 판입니다."
      note="층 두께와 축소 비율은 그림용입니다. 빛 받은 자리가 씻겨 나가는 한 경우만 그렸습니다(가정)."
      ariaLabel="감광막 도포, 노광, 현상, 식각, 감광막 제거의 단면 순서"
      scenes={SCENES}
      render={(active) => {
        const resistOn = active <= 3;
        const resistOpen = active >= 2;
        const filmOpen = active >= 3;
        const exposed = active === 1;
        const winL = MID - WIN / 2;
        const winR = MID + WIN / 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 1 && (
              <g>
                <rect x={MID - 130} y={14} width={80} height={10} fill="#334155" />
                <rect x={MID + 50} y={14} width={80} height={10} fill="#334155" />
                <text x={MID + 136} y={23} fontSize={10} fill="#334155">레티클</text>
                <text x={MID} y={10} textAnchor="middle" fontSize={9} fill="#64748b">무늬(줄이기 전)</text>
                <ellipse cx={MID} cy={72} rx={70} ry={8} fill="none" stroke="#64748b" strokeWidth={1} />
                <text x={MID + 76} y={76} fontSize={10} fill="#64748b">광학계</text>
                <path d={`M ${MID - 50} 24 L ${MID - 50} 68 L ${winL} ${RESIST_Y}`} fill="none" stroke="#eab308" strokeWidth={1.25} />
                <path d={`M ${MID + 50} 24 L ${MID + 50} 68 L ${winR} ${RESIST_Y}`} fill="none" stroke="#eab308" strokeWidth={1.25} />
                <text x={MID} y={112} textAnchor="middle" fontSize={10} fill="#a16207">빛</text>
              </g>
            )}

            <rect x={LEFT} y={WAFER_Y} width={RIGHT - LEFT} height={22} fill="#94a3b8" />
            <text x={LEFT + 6} y={WAFER_Y + 15} fontSize={10} fill="#ffffff">웨이퍼</text>

            <rect x={LEFT} y={FILM_Y} width={(filmOpen ? winL : RIGHT) - LEFT} height={WAFER_Y - FILM_Y} fill="#2563eb" fillOpacity={0.7} />
            {filmOpen && <rect x={winR} y={FILM_Y} width={RIGHT - winR} height={WAFER_Y - FILM_Y} fill="#2563eb" fillOpacity={0.7} />}
            <text x={LEFT + 6} y={FILM_Y + 18} fontSize={10} fill="#ffffff">아래 막</text>

            {resistOn && (
              <g>
                <rect x={LEFT} y={RESIST_Y} width={(resistOpen ? winL : RIGHT) - LEFT} height={FILM_Y - RESIST_Y} fill="#f59e0b" fillOpacity={0.7} />
                {resistOpen && <rect x={winR} y={RESIST_Y} width={RIGHT - winR} height={FILM_Y - RESIST_Y} fill="#f59e0b" fillOpacity={0.7} />}
                {exposed && <rect x={winL} y={RESIST_Y} width={WIN} height={FILM_Y - RESIST_Y} fill="#fde68a" stroke="#a16207" strokeWidth={1} strokeDasharray="3 2" />}
                <text x={LEFT + 6} y={RESIST_Y + 15} fontSize={10} fill="#78350f">감광막</text>
              </g>
            )}

            {exposed && <text x={MID} y={RESIST_Y - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#a16207">성질이 바뀐 자리</text>}

            {(active === 2 || active === 4) && (
              <g>
                <line x1={winL} x2={winR} y1={(active === 2 ? RESIST_Y : FILM_Y) - 10} y2={(active === 2 ? RESIST_Y : FILM_Y) - 10} stroke="#334155" strokeWidth={1} />
                <text x={MID} y={(active === 2 ? RESIST_Y : FILM_Y) - 15} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">
                  {active === 2 ? "감광막 창 (가정 120 nm)" : "아래 막의 창 · 폭은 식각 뒤 다시 잼"}
                </text>
              </g>
            )}

            {active === 3 && (
              <g>
                {[-16, 0, 16].map((dx) => (
                  <path key={dx} d={`M ${MID + dx} ${RESIST_Y - 40} L ${MID + dx} ${RESIST_Y - 22}`} stroke="#dc2626" strokeWidth={1.25} />
                ))}
                {[-16, 0, 16].map((dx) => (
                  <path key={`h${dx}`} d={`M ${MID + dx - 3} ${RESIST_Y - 26} L ${MID + dx} ${RESIST_Y - 22} L ${MID + dx + 3} ${RESIST_Y - 26}`} fill="none" stroke="#dc2626" strokeWidth={1.25} />
                ))}
                <text x={MID + 26} y={RESIST_Y - 28} fontSize={10} fontWeight={700} fill="#dc2626">식각: 열린 곳만</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
