import SceneShell from "./SceneShell";

/**
 * 본문 대응: #video-scope — 어떤 학습 신호가 어떤 adapter로 들어가는가.
 * image adapter 재사용, 모든 projection 일괄 학습, 분리 adapter(MotionDirector)의 세 갈래.
 * 분리 구조는 coupling을 줄이는 선택지 중 하나이며 필수 구조가 아닙니다.
 */
const SCENES = [
  { label: "Image LoRA를 불러오면", summary: "모양 신호만 봄", note: "spatial layer와 호환되면 frame별 appearance prior로 재사용할 수는 있습니다. 하지만 연속 frame의 변화나 속도를 본 적이 없으므로 motion을 학습했다고 볼 수 없습니다." },
  { label: "모든 projection을 한꺼번에", summary: "두 신호가 한 adapter로", note: "video clip으로 모든 projection을 한꺼번에 학습하면 motion과 reference appearance가 하나의 adapter에 얽힐 수 있습니다." },
  { label: "두 adapter로 나누면", summary: "신호별로 따로", note: "spatial LoRA는 한 frame으로, temporal LoRA는 여러 frame으로 학습하는 MotionDirector의 구조입니다. 논문의 backbone·benchmark에서 coupling을 줄인 한 방법이며 모든 video LoRA에 필수는 아닙니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const SLATE = "#64748b";
const LINE = "#94a3b8";
const SHAPE_Y = 44;
const MOTION_Y = 122;

function Signal({ y, name, color }: { y: number; name: string; color: string }) {
  return (
    <g>
      <rect x={6} y={y - 22} width={116} height={44} rx={6} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1} />
      <text x={64} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{name}</text>
    </g>
  );
}

function Adapter({ y, h, name, result, dashed = false }: { y: number; h: number; name: string; result: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={186} y={y} width={168} height={h} rx={6} fill="none" stroke={dashed ? LINE : SLATE} strokeWidth={1} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={270} y={y + h / 2 - 3} textAnchor="middle" fontSize={12} fontWeight={700} fill={dashed ? SLATE : "currentColor"}>{name}</text>
      <text x={270} y={y + h / 2 + 14} textAnchor="middle" fontSize={12} fill={SLATE}>{result}</text>
    </g>
  );
}

function Arrow({ from, to, color }: { from: number; to: number; color: string }) {
  return <path d={`M122 ${from}L184 ${to}m-5 -4 5 4 -6 2`} fill="none" stroke={color} strokeWidth={1.25} />;
}

export default function SignalAdapterViz() {
  return (
    <SceneShell
      eyebrow="학습 신호"
      title="모양 신호와 움직임 신호가 어느 adapter로 가는지가 결과를 가릅니다"
      description="왼쪽은 학습 신호, 오른쪽은 그 신호로 update되는 adapter입니다. 어느 갈래가 나은지는 validation으로 구분합니다."
      ariaLabel="학습 신호와 adapter의 연결 세 가지"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 166" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Signal y={SHAPE_Y} name="한 frame의 모양" color={BLUE} />
          <Signal y={MOTION_Y} name="연속 frame의 변화" color={AMBER} />
          {active === 0 && (
            <>
              <Adapter y={22} h={44} name="image adapter" result="appearance 재사용" />
              <Adapter y={100} h={44} name="motion 쪽" result="학습한 적 없음" dashed />
              <Arrow from={SHAPE_Y} to={SHAPE_Y} color={BLUE} />
            </>
          )}
          {active === 1 && (
            <>
              <Adapter y={50} h={66} name="하나의 adapter" result="둘이 얽힐 수 있음" />
              <Arrow from={SHAPE_Y} to={70} color={BLUE} />
              <Arrow from={MOTION_Y} to={96} color={AMBER} />
            </>
          )}
          {active === 2 && (
            <>
              <Adapter y={22} h={44} name="spatial LoRA" result="appearance" />
              <Adapter y={100} h={44} name="temporal LoRA" result="motion" />
              <Arrow from={SHAPE_Y} to={SHAPE_Y} color={BLUE} />
              <Arrow from={MOTION_Y} to={MOTION_Y} color={AMBER} />
            </>
          )}
        </svg>
      )}
    />
  );
}
