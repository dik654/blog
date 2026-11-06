import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 포머랜츠 『대분기』 서론(12~13쪽): 1750년까지 비슷했던 두 지역과, 화석연료·신대륙 자원이라는 단절.
 * 위 = 공통 출발, 왼쪽 갈래 = 노동 집약 경로, 오른쪽 갈래 = 단절. 시간 눈금이 없는 갈래 그림입니다.
 */
const SCENES = [
  { label: "비슷한 출발", summary: "1750년까지", note: "실제로 산업화가 시작된 영국이 목재 공급과 토양 고갈 같은 생태 지표에서 양쯔강 하류 삼각주보다 나을 것이 없었다고 포머랜츠는 씁니다." },
  { label: "갈 수 있었던 길", summary: "유럽도 노동 집약 경로로", note: "그가 보기에 유럽도 동아시아처럼 노동 집약 경로로 갈 수 있었습니다. 영국의 길이 처음부터 정해져 있었다고 보지 않는 것입니다." },
  { label: "급격한 단절", summary: "화석연료 + 신대륙 자원", note: "두 조건이 합쳐져 토지를 집약적으로 관리할 필요를 없앴습니다. 앞 절의 싼 에너지가 영국 안의 가격 구조라면, 여기서 석탄은 지리적 행운과 해외 자원의 결합입니다." },
  { label: "질문의 방향", summary: "두 방향으로 묻기", note: "'왜 양쯔강 삼각주는 잉글랜드가 되지 못했나'만큼 '왜 잉글랜드는 양쯔강 삼각주가 되지 못했나'를 묻습니다." },
] as const;

const W = 320;
const H = 208;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const MUTED = "#64748b";
const IDLE = "#94a3b8";
const COL_W = 150;
const LEFT_X = 2;
const RIGHT_X = 168;
const FORK_Y = 56;
const BOX_Y = 80;
const BOX_H = 66;

function Box({ x, y, w, h, lines, color, on }: { x: number; y: number; w: number; h: number; lines: readonly string[]; color: string; on: boolean }) {
  const lineGap = 18;
  const start = y + h / 2 - ((lines.length - 1) * lineGap) / 2 + 4;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={on ? color : IDLE} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
      {lines.map((line, row) => (
        <text key={line} x={x + w / 2} y={start + row * lineGap} textAnchor="middle" fontSize={13} fontWeight={row === 0 ? 700 : 400} fill={on ? color : MUTED}>{line}</text>
      ))}
    </g>
  );
}

export default function DivergenceForkViz() {
  return (
    <SceneShell
      eyebrow="대분기"
      title="비슷했던 두 지역이 석탄과 신대륙 자원에서 갈라졌다는 읽기입니다"
      description="포머랜츠는 영국의 길을 왜 당연하게 보지 않을까요? 위 상자에서 두 갈래로 나뉘는 지점을 따라갑니다."
      note="포머랜츠의 주장을 이 글의 서술대로 옮긴 그림이며, 시간 눈금이나 크기를 담지 않았습니다."
      ariaLabel="1750년까지 비슷했던 영국과 양쯔강 삼각주가 노동 집약 경로와 화석연료·신대륙 자원 경로로 갈라지는 구조"
      scenes={SCENES}
      render={(index) => {
        const leftOn = index === 1;
        const rightOn = index === 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <Box x={40} y={2} w={240} h={44} lines={["영국 · 양쯔강 하류 삼각주", "1750년까지 놀랄 만큼 비슷"]} color={BLUE} on={index === 0} />
            <path d={`M160 46 V${FORK_Y} H${LEFT_X + COL_W / 2} V${BOX_Y - 6}`} fill="none" stroke={leftOn ? BLUE : IDLE} strokeWidth={leftOn ? 1.25 : 1} />
            <polygon points={`${LEFT_X + COL_W / 2 - 4},${BOX_Y - 7} ${LEFT_X + COL_W / 2 + 4},${BOX_Y - 7} ${LEFT_X + COL_W / 2},${BOX_Y}`} fill={leftOn ? BLUE : IDLE} />
            <path d={`M160 46 V${FORK_Y} H${RIGHT_X + COL_W / 2} V${BOX_Y - 6}`} fill="none" stroke={rightOn ? AMBER : IDLE} strokeWidth={rightOn ? 1.25 : 1} />
            <polygon points={`${RIGHT_X + COL_W / 2 - 4},${BOX_Y - 7} ${RIGHT_X + COL_W / 2 + 4},${BOX_Y - 7} ${RIGHT_X + COL_W / 2},${BOX_Y}`} fill={rightOn ? AMBER : IDLE} />
            <Box x={LEFT_X} y={BOX_Y} w={COL_W} h={BOX_H} lines={["노동 집약 경로", "토지를 집약적으로", "관리"]} color={BLUE} on={leftOn} />
            <Box x={RIGHT_X} y={BOX_Y} w={COL_W} h={BOX_H} lines={["화석연료 + 신대륙", "토지 관리 필요가", "사라짐"]} color={AMBER} on={rightOn} />
            <text x={LEFT_X + COL_W / 2} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill={index === 3 ? BLUE : MUTED}>양쯔강 삼각주</text>
            <text x={RIGHT_X + COL_W / 2} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill={index === 3 ? AMBER : MUTED}>잉글랜드</text>
            {index === 3 && (
              <g>
                <line x1={110} x2={205} y1={186} y2={186} stroke={BLUE} strokeWidth={1.25} />
                <polygon points="205,182 205,190 212,186" fill={BLUE} />
                <text x={100} y={190} textAnchor="end" fontSize={12} fontWeight={700} fill={BLUE}>왜 못 됐나</text>
                <line x1={115} x2={205} y1={201} y2={201} stroke={AMBER} strokeWidth={1.25} />
                <polygon points="115,197 115,205 108,201" fill={AMBER} />
                <text x={216} y={205} fontSize={12} fontWeight={700} fill={AMBER}>왜 못 됐나</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
