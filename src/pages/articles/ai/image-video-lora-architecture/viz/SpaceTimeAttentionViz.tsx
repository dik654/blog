import SceneShell from "./SceneShell";

/**
 * 본문 대응: #video-scope — 공간·시간·joint space-time·cross-modal attention이 읽는 범위.
 * frame 4장, 칸 3×3, 같은 자리끼리 잇는 시간 경로는 그림의 가정이자 단순화입니다.
 */
const SCENES = [
  { label: "공간 경로", summary: "한 frame 안 → 모양", note: "기준 token이 같은 frame 안의 token을 읽습니다. subject 모양·texture·배치를 처리하는 경로입니다. 단일 frame 품질이 좋아도 frame 사이 운동이 맞는지는 알 수 없습니다." },
  { label: "시간 경로", summary: "frame 사이 → 변화", note: "기준 token이 다른 frame의 token을 읽습니다. 순서와 변화량을 연결해 motion을 처리합니다. 같은 자리끼리 이은 모습은 그림의 단순화입니다." },
  { label: "joint space-time", summary: "공간 + 시간을 함께", note: "최신 video DiT는 두 범위를 한 attention으로 함께 읽을 수 있습니다. 이때는 공간과 시간의 구분이 module 이름에 그대로 드러나지 않을 수도 있습니다." },
  { label: "cross-modal 경로", summary: "audio → video", note: "audio query가 video key/value를 읽는 attention입니다. 같은 시점의 frame만 읽는 모습은 그림의 단순화입니다. 여기에 LoRA를 붙이면 lip-sync 조건화도 update 범위에 들어갑니다. video-only adaptation에서는 불필요한 capacity와 drift를 만들 수 있습니다." },
] as const;

const FRAMES = [0, 1, 2, 3];
const CELLS = Array.from({ length: 9 }, (_, index) => index);
const CENTER = 4;
const SOURCE_FRAME = 1;
const CELL = 22;
const GAP = 3;
const FRAME_W = 3 * CELL + 2 * GAP;
const STEP = 88;
const X0 = 8;
const Y0 = 28;
const AUDIO_Y = 128;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const SLATE = "#64748b";
const LINE = "#94a3b8";

function isRead(active: number, frame: number, cell: number) {
  if (active === 0) return frame === SOURCE_FRAME;
  if (active === 1) return cell === CENTER;
  if (active === 2) return true;
  return frame === SOURCE_FRAME;
}

export default function SpaceTimeAttentionViz() {
  return (
    <SceneShell
      eyebrow="Video token"
      title="같은 attention이라도 어느 칸을 읽느냐에 따라 배우는 정보가 다릅니다"
      description="칸 하나가 token입니다. attention은 한 token이 다른 token을 읽는 연산이며, 파란 칸이 읽는 범위입니다. frame 4장과 3×3 칸은 그림의 가정입니다."
      ariaLabel="공간, 시간, joint space-time, cross-modal attention이 읽는 token 범위"
      scenes={SCENES}
      render={(active) => {
        const crossModal = active === 3;
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={14} fontSize={12} fontWeight={700} fill={SLATE}>시간 → frame 1 ~ 4</text>
            {active === 1 && (
              <line
                x1={X0 + CELL + GAP + CELL / 2}
                x2={X0 + 3 * STEP + CELL + GAP + CELL / 2}
                y1={Y0 + CELL + GAP + CELL / 2}
                y2={Y0 + CELL + GAP + CELL / 2}
                stroke={BLUE}
                strokeWidth={1}
              />
            )}
            {FRAMES.map((frame) => (
              <g key={frame}>
                {CELLS.map((cell) => {
                  const x = X0 + frame * STEP + (cell % 3) * (CELL + GAP);
                  const y = Y0 + Math.floor(cell / 3) * (CELL + GAP);
                  const source = !crossModal && frame === SOURCE_FRAME && cell === CENTER;
                  const read = isRead(active, frame, cell);
                  return (
                    <g key={cell}>
                      <rect x={x} y={y} width={CELL} height={CELL} rx={2} fill={read ? BLUE : LINE} fillOpacity={source ? 1 : read ? 0.45 : 0.2} />
                      {source && <text x={x + CELL / 2} y={y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">Q</text>}
                    </g>
                  );
                })}
              </g>
            ))}
            {FRAMES.map((frame) => {
              const source = crossModal && frame === SOURCE_FRAME;
              return (
                <g key={`audio-${frame}`}>
                  <rect x={X0 + frame * STEP} y={AUDIO_Y} width={FRAME_W} height={24} rx={3} fill={source ? AMBER : LINE} fillOpacity={source ? 1 : crossModal ? 0.3 : 0.12} />
                  <text x={X0 + frame * STEP + FRAME_W / 2} y={AUDIO_Y + 16} textAnchor="middle" fontSize={12} fontWeight={source ? 700 : 400} fill={source ? "#ffffff" : SLATE}>{source ? "audio Q" : "audio"}</text>
                </g>
              );
            })}
            {crossModal && <path d={`M${X0 + STEP + FRAME_W / 2} ${AUDIO_Y - 1}V${Y0 + 3 * CELL + 2 * GAP + 2}m-3 4 3 -4 3 4`} fill="none" stroke={AMBER} strokeWidth={1.25} />}
            <text x={X0} y={166} fontSize={12} fill={SLATE}>Q = 읽는 쪽 · 파란 칸 = 읽히는 범위{crossModal ? "(K·V)" : ""}</text>
          </svg>
        );
      }}
    />
  );
}
