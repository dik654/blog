import SceneShell from "./SceneShell";

/**
 * 본문 대응: #layout — 가상 4 MiB = 4096 KiB. 256+1536+1536+768=4096.
 * 비율: 256/4096=6.25%, 1536/4096=37.5%, 768/4096=18.75%, 두 슬롯 3072/4096=75%.
 * 슬롯 안쪽과 기타 영역 안쪽은 본문이 크기를 정하지 않았으므로 비례하지 않는 점선 칸으로 그린다.
 */
const SCENES = [
  { label: "네 구획의 합", summary: "256+1536+1536+768=4096 KiB", note: "막대 길이가 실제 비율입니다. 두 앱 슬롯이 전체의 75%를 차지합니다. 네 구획의 크기와 순서는 교육용 가정입니다." },
  { label: "슬롯 하나의 안쪽", summary: "앱 파일 < 1536 KiB", note: "머리말·서명·꼬리말과 플래시 지우기 단위도 자리에서 빠집니다. 그래서 실제 앱 파일의 최대 크기는 1536 KiB보다 작습니다." },
  { label: "기타 768 KiB의 안쪽", summary: "전부 자유 공간은 아님", note: "scratch 방식에서는 이 안에 교체용 임시 공간을 따로 할당합니다. 임시 공간은 교체할 가장 큰 지우기 구간을 담을 만큼 커야 합니다." },
] as const;

const TOTAL = 4096;
const LEFT = 10;
const WIDTH = 340;
const STRIP_Y = 30;
const STRIP_H = 44;
const ZOOM_Y = 118;
const ZOOM_H = 46;
const GRAY = "#64748b";
const BLUE = "#2563eb";
const GREEN = "#16a34a";
const AMBER = "#d97706";

const widthOf = (kib: number) => (kib / TOTAL) * WIDTH;
const PARTS = [
  { name: "부트·복구", kib: 256, color: GRAY },
  { name: "주 슬롯", kib: 1536, color: BLUE },
  { name: "보조 슬롯", kib: 1536, color: GREEN },
  { name: "기타", kib: 768, color: AMBER },
] as const;
const STARTS = PARTS.map((_, index) => PARTS.slice(0, index).reduce<number>((sum, part) => sum + widthOf(part.kib), LEFT));

const SLOT_CELLS = [
  { name: "머리말", width: 56, solid: false },
  { name: "앱 파일", width: 168, solid: true },
  { name: "서명", width: 48, solid: false },
  { name: "꼬리말", width: 68, solid: false },
] as const;
const OTHER_CELLS = [
  { name: "scratch 임시 공간", width: 170, solid: false },
  { name: "그 밖의 설정·보조", width: 170, solid: false },
] as const;

function Zoom({ part, cells, color }: { part: number; cells: readonly { name: string; width: number; solid: boolean }[]; color: string }) {
  const x1 = STARTS[part];
  const x2 = x1 + widthOf(PARTS[part].kib);
  const starts = cells.map((_, index) => cells.slice(0, index).reduce<number>((sum, cell) => sum + cell.width, LEFT));
  return (
    <g>
      <line x1={x1} x2={LEFT} y1={STRIP_Y + STRIP_H} y2={ZOOM_Y} stroke={color} strokeWidth={1} />
      <line x1={x2} x2={LEFT + WIDTH} y1={STRIP_Y + STRIP_H} y2={ZOOM_Y} stroke={color} strokeWidth={1} />
      {cells.map((cell, index) => (
        <g key={cell.name}>
          <rect x={starts[index] + 1} y={ZOOM_Y} width={cell.width - 2} height={ZOOM_H} rx={3} fill={cell.solid ? color : "none"} stroke={color} strokeWidth={1} strokeDasharray={cell.solid ? undefined : "3 3"} />
          <text x={starts[index] + cell.width / 2} y={ZOOM_Y + 27} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={cell.solid ? "#ffffff" : GRAY}>{cell.name}</text>
        </g>
      ))}
      <text x={LEFT} y={ZOOM_Y + ZOOM_H + 18} fontSize={11} fill={GRAY}>안쪽 칸의 크기는 정하지 않았습니다 · 칸 너비는 비례 아님</text>
    </g>
  );
}

export default function FlashMapViz() {
  return (
    <SceneShell
      eyebrow="가상 4 MiB 플래시 지도"
      title="4096 KiB를 실제 비율로 나눠 봅니다"
      description="위 막대 전체가 가상 외부 플래시입니다. 칸 크기와 순서는 교육용 가정이고, 아래 칸은 위 막대의 한 구획을 확대한 것입니다."
      ariaLabel="부트 복구 256, 주 슬롯 1536, 보조 슬롯 1536, 기타 768 KiB 비율 막대와 슬롯, 기타 영역의 안쪽"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={LEFT} y={22} fontSize={11} fontWeight={700} fill={GRAY}>부트·복구 256</text>
          {PARTS.map((part, index) => {
            const emphasized = active === 0 || (active === 1 && index === 1) || (active === 2 && index === 3);
            const width = widthOf(part.kib);
            return (
              <g key={part.name}>
                <rect x={STARTS[index] + 0.5} y={STRIP_Y} width={width - 1} height={STRIP_H} rx={2} fill={part.color} opacity={emphasized ? 0.95 : 0.35} />
                {index > 0 && (
                  <>
                    <text x={STARTS[index] + width / 2} y={STRIP_Y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">{part.name}</text>
                    <text x={STARTS[index] + width / 2} y={STRIP_Y + 34} textAnchor="middle" fontSize={11} fill="#ffffff">{part.kib}</text>
                  </>
                )}
              </g>
            );
          })}
          {active === 0 && (
            <g>
              <text x={LEFT} y={STRIP_Y + STRIP_H + 16} fontSize={10.5} fill={GRAY}>6.25%</text>
              {PARTS.slice(1).map((part, index) => (
                <text key={part.name} x={STARTS[index + 1] + widthOf(part.kib) / 2} y={STRIP_Y + STRIP_H + 16} textAnchor="middle" fontSize={10.5} fill={GRAY}>
                  {(part.kib / TOTAL) * 100}%
                </text>
              ))}
              <line x1={STARTS[1]} x2={STARTS[3]} y1={STRIP_Y + STRIP_H + 30} y2={STRIP_Y + STRIP_H + 30} stroke={GRAY} strokeWidth={1} />
              <text x={(STARTS[1] + STARTS[3]) / 2} y={STRIP_Y + STRIP_H + 48} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>두 슬롯 3072 KiB = 전체의 75%</text>
              <text x={LEFT + WIDTH / 2} y={STRIP_Y + STRIP_H + 72} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>남는 기타 768 KiB = 18.75%</text>
            </g>
          )}
          {active === 1 && <Zoom part={1} cells={SLOT_CELLS} color={BLUE} />}
          {active === 2 && <Zoom part={3} cells={OTHER_CELLS} color={AMBER} />}
        </svg>
      )}
    />
  );
}
