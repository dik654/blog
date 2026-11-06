import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ai-usage — f_s=16000, N=400(25 ms), H=160(10 ms). 구간 m의 왼쪽은 mH입니다.
 * 이웃 구간의 겹침은 25−10=15 ms, 표본 400−160=240개입니다.
 */
const SCENES: { label: string; summary: string; note: string; frames: number; overlap: boolean }[] = [
  { label: "첫 구간", summary: "400 표본 = 25 ms", frames: 1, overlap: false, note: "창의 길이 N은 한 번에 보는 범위입니다. 16000 Hz에서 400 표본은 25 ms이고, 이 구간에 창을 곱해 DFT 한 번을 계산합니다." },
  { label: "10 ms 옮기기", summary: "hop 160 표본 = 10 ms", frames: 2, overlap: false, note: "hop H는 다음 구간으로 옮기는 간격입니다. 창 길이보다 작으면 다음 구간이 앞 구간과 겹칩니다." },
  { label: "겹치는 부분", summary: "25−10 = 15 ms · 240 표본", frames: 2, overlap: true, note: "주황 부분의 표본 240개는 두 구간에 모두 들어갑니다. hop을 줄이면 시간 축의 칸이 촘촘해지지만, 그것이 실제 주파수 구별 능력을 높이는 것과 같지는 않습니다." },
  { label: "계속 옮기기", summary: "구간 m마다 DFT 한 번", frames: 4, overlap: false, note: "구간마다 얻은 값들을 시각 순서로 늘어놓은 것이 STFT입니다. 구간의 왼쪽을 mH에 둔 이 글의 식이며, 라이브러리의 중심 정렬과 가장자리 padding은 별도 규약입니다." },
];

const X0 = 34;
const SCALE = 5.6;
const ms = (value: number) => X0 + value * SCALE;
const ROW_H = 26;
const TOP = 16;
const AXIS_Y = TOP + 4 * (ROW_H + 8) + 6;

export default function StftFramesViz() {
  return (
    <SceneShell
      eyebrow="창과 hop"
      title="25 ms를 보고 10 ms씩 옮기면 구간이 서로 겹칩니다"
      description="가로축은 시간입니다. 막대 하나가 DFT 한 번이 보는 구간이며 아래 식의 16 kHz·N=400·H=160을 대입했습니다."
      ariaLabel="25 밀리초 구간을 10 밀리초 간격으로 옮기는 STFT 구간 배치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 360 ${AXIS_Y + 24}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.overlap && (
              <g>
                <rect x={ms(10)} y={TOP} width={15 * SCALE} height={2 * ROW_H + 8} fill="#d97706" fillOpacity={0.22} />
                <text x={ms(25) + 5} y={TOP + 15} fontSize={11} fontWeight={700} fill="#d97706">15 ms 겹침</text>
              </g>
            )}
            {[0, 1, 2, 3].map((m) => {
              const y = TOP + m * (ROW_H + 8);
              const shown = m < scene.frames;
              return (
                <g key={m} opacity={shown ? 1 : 0.15}>
                  <text x={X0 - 6} y={y + 17} textAnchor="end" fontSize={11} fill="#64748b">m={m}</text>
                  <rect x={ms(m * 10)} y={y} width={25 * SCALE} height={ROW_H} rx={4} fill="#2563eb" fillOpacity={0.14} stroke="#2563eb" strokeWidth={1} />
                  <text x={ms(m * 10) + (25 * SCALE) / 2} y={y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">{m * 10}–{m * 10 + 25} ms</text>
                </g>
              );
            })}
            <line x1={X0} x2={ms(55)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 10, 20, 30, 40, 50].map((tick) => (
              <g key={tick}>
                <line x1={ms(tick)} x2={ms(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={ms(tick)} y={AXIS_Y + 16} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
