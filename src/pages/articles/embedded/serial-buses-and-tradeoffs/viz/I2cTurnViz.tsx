import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 장치와 위치를 보낼 때는 센서가 응답하고, 결과를 받을 때는 읽는 쪽이 응답한다.
 * 위아래 두 띠가 같은 시간축입니다. 긴 칸이 그 묶음의 8비트를 내보내는 쪽, 짧은 칸이 아홉 번째 칸의 응답입니다.
 */
const GROUPS = ["장치·쓰기", "위치", "장치·읽기", "결과 1", "결과 2", "결과 3", "결과 4"] as const;

const SCENES = [
  { label: "장치 선택", summary: "읽는 쪽이 보냄 · 센서가 응답", from: 0, to: 0, note: "읽는 쪽이 센서 번호와 쓰기 방향을 8칸에 보냅니다. 아홉 번째 칸의 응답은 받은 쪽인 센서 몫입니다." },
  { label: "위치 지정", summary: "읽는 쪽이 보냄 · 센서가 응답", from: 1, to: 1, note: "시작 위치 0x10을 보내는 묶음도 같습니다. 보내는 쪽과 응답하는 쪽은 한 묶음 안에서도 서로 다릅니다." },
  { label: "방향 변경", summary: "읽는 쪽이 보냄 · 센서가 응답", from: 2, to: 2, note: "읽겠다고 알리는 묶음까지는 아직 읽는 쪽이 보냅니다. 결과가 오기 시작하는 곳은 점선 다음입니다." },
  { label: "결과 받기", summary: "센서가 보냄 · 읽는 쪽이 응답", from: 3, to: 5, note: "점선부터 8칸의 주인이 위아래로 바뀝니다. 이제 받는 쪽이 읽는 쪽이므로 응답 칸도 읽는 쪽으로 옮겨 갑니다." },
  { label: "마지막 바이트", summary: "응답 칸은 그대로 남음", from: 6, to: 6, note: "마지막 바이트 뒤에는 읽는 쪽이 더 받지 않겠다고 알립니다. 그 알림에도 응답을 위한 시간 한 칸이 듭니다." },
] as const;

const W = 360;
const H = 146;
const LEFT = 6;
const GAP = 4;
const GROUP_W = (W - 2 * LEFT - GAP * (GROUPS.length - 1)) / GROUPS.length;
const DATA_W = (GROUP_W * 8) / 9;
const REPLY_W = GROUP_W - DATA_W;
const TOP_Y = 26;
const BOTTOM_Y = 82;
const BAR_H = 22;
const gx = (index: number) => LEFT + index * (GROUP_W + GAP);

export default function I2cTurnViz() {
  return (
    <SceneShell
      eyebrow="보내는 쪽과 응답하는 쪽"
      title="보내는 쪽이 바뀌면 응답하는 쪽도 바뀝니다"
      description="위 띠는 결과를 읽으려는 우리 장치(읽는 쪽), 아래 띠는 센서입니다. 긴 칸이 8비트를 내는 쪽, 짧은 칸이 아홉 번째 칸의 응답입니다. 묶음 구성은 앞 절의 가정입니다."
      ariaLabel="일곱 묶음에서 8비트를 보내는 쪽과 응답하는 쪽이 어떻게 바뀌는지 보여 주는 두 줄 시간축"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LEFT} y={TOP_Y - 8} fontSize={12} fontWeight={700} fill="#64748b">읽는 쪽 (우리 장치)</text>
            <text x={LEFT} y={BOTTOM_Y - 8} fontSize={12} fontWeight={700} fill="#64748b">센서</text>
            <line x1={LEFT} x2={W - LEFT} y1={TOP_Y + BAR_H} y2={TOP_Y + BAR_H} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={W - LEFT} y1={BOTTOM_Y + BAR_H} y2={BOTTOM_Y + BAR_H} stroke="#94a3b8" strokeWidth={1} />
            {GROUPS.map((group, index) => {
              const on = index >= scene.from && index <= scene.to;
              const readerSends = index < 3;
              const x = gx(index);
              const opacity = on ? 1 : 0.28;
              return (
                <g key={group} opacity={opacity}>
                  <rect x={x} y={readerSends ? TOP_Y : BOTTOM_Y} width={DATA_W - 1} height={BAR_H} rx={2} fill="#2563eb" />
                  <rect x={x + DATA_W} y={readerSends ? BOTTOM_Y : TOP_Y} width={REPLY_W} height={BAR_H} fill="#d97706" />
                  <text x={x + GROUP_W / 2} y={BOTTOM_Y + BAR_H + 15} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill="#64748b">{index + 1}</text>
                </g>
              );
            })}
            <line x1={gx(3) - GAP / 2} x2={gx(3) - GAP / 2} y1={8} y2={BOTTOM_Y + BAR_H + 4} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <rect x={LEFT} y={H - 11} width={18} height={9} rx={2} fill="#2563eb" />
            <text x={LEFT + 23} y={H - 4} fontSize={12} fill="#64748b">8비트 보내기</text>
            <rect x={LEFT + 112} y={H - 11} width={5} height={9} fill="#d97706" />
            <text x={LEFT + 122} y={H - 4} fontSize={12} fill="#64748b">응답 1칸 · 숫자는 묶음 순서</text>
          </svg>
        );
      }}
    />
  );
}
