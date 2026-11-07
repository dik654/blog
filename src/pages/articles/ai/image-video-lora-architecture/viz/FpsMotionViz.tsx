import SceneShell from "./SceneShell";

/**
 * 본문 대응: #training-evaluation — 같은 영상을 다른 FPS로 읽으면 model이 보는 motion 속도가 달라집니다.
 * 원본 8컷, 읽는 frame 4장, 컷마다 한 칸 이동은 그림의 가정입니다.
 * 컷을 건너뛰지 않으면 frame당 1칸, 한 컷 건너 읽으면 frame당 2칸.
 */
const SCENES = [
  { label: "컷을 건너뛰지 않고 읽으면", summary: "frame당 1칸 이동", picks: [0, 1, 2, 3], note: "원본의 컷을 차례로 읽습니다(가정). 연속한 두 frame 사이에서 물체는 한 칸 움직입니다." },
  { label: "FPS를 절반으로 읽으면", summary: "frame당 2칸 이동", picks: [0, 2, 4, 6], note: "같은 영상인데 model이 보는 물체는 frame마다 두 칸씩 움직입니다. 그래서 FPS는 단순한 loader option이 아니라 무엇을 학습하는지를 정하는 값입니다." },
] as const;

const SOURCE = Array.from({ length: 8 }, (_, index) => index);
const BLUE = "#2563eb";
const SLATE = "#64748b";
const LINE = "#94a3b8";
const SRC_W = 42;
const SEEN_W = 84;
const SLOTS = 8;

function Frame({ x, y, w, h, cut, on }: { x: number; y: number; w: number; h: number; cut: number; on: boolean }) {
  const slot = (w - 8) / SLOTS;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill="none" stroke={on ? BLUE : LINE} strokeWidth={on ? 1.25 : 1} />
      <line x1={x + 4} x2={x + w - 4} y1={y + h / 2} y2={y + h / 2} stroke={LINE} strokeWidth={0.75} />
      <circle cx={x + 4 + slot * (cut + 0.5)} cy={y + h / 2} r={Math.min(4.5, slot * 0.55 + 1)} fill={on ? BLUE : LINE} />
    </g>
  );
}

export default function FpsMotionViz() {
  return (
    <SceneShell
      eyebrow="FPS"
      title="같은 영상도 읽는 FPS가 다르면 model이 보는 속도가 달라집니다"
      description="FPS는 초당 frame 수입니다. 위 줄은 원본의 컷, 아래 줄은 model이 받는 frame 4장이며 컷 수와 이동 칸 수는 그림의 가정입니다."
      ariaLabel="같은 영상을 다른 FPS로 읽을 때 frame 사이 이동량 비교"
      scenes={SCENES}
      render={(active) => {
        const picks: readonly number[] = SCENES[active].picks;
        return (
          <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={6} y={14} fontSize={12} fontWeight={700} fill={SLATE}>원본 영상의 컷</text>
            {SOURCE.map((cut) => (
              <Frame key={cut} x={6 + cut * 44} y={22} w={SRC_W} h={28} cut={cut} on={picks.includes(cut)} />
            ))}
            <text x={6} y={76} fontSize={12} fontWeight={700} fill={BLUE}>model이 받는 frame 4장</text>
            {picks.map((cut, index) => (
              <g key={index}>
                <Frame x={6 + index * 88} y={84} w={SEEN_W} h={36} cut={cut} on />
                <text x={6 + index * 88 + SEEN_W / 2} y={138} textAnchor="middle" fontSize={12} fill={SLATE}>{`frame ${index + 1}`}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
