import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: WindingBug.tsx — 면 감김 순서가 뒤집혀 래스터라이저가 앞면을 버리고
 * 뒤통수 안쪽을 그렸다. 위에서 내려다본 두상 단면, 카메라는 아래쪽.
 * 각 면은 법선이 카메라 쪽을 향할 때만 그려진다(법선 · 카메라 방향 > 0).
 */
const SCENES = [
  {
    label: "면의 앞뒤를 정하는 순서",
    summary: "감김 순서 → 법선 방향",
    note: "삼각형 면은 꼭짓점을 어떤 순서로 적었는지(감김 순서)로 앞뒤가 정해지고, 법선은 앞면 쪽을 가리킵니다. 래스터라이저는 카메라에서 볼 때 뒷면인 면을 그리지 않고 버립니다. 어느 방향을 앞면으로 볼지는 렌더러 설정이며 그림의 반시계는 가정입니다.",
  },
  {
    label: "정상 메쉬",
    summary: "앞쪽 면을 그림",
    note: "위에서 내려다본 두상 단면입니다. 법선이 바깥을 향하면 카메라 쪽 절반(얼굴)이 그려지고 뒤통수 쪽은 버려집니다. 시선은 코와 눈 홈이 있는 앞면에 닿습니다.",
  },
  {
    label: "감김이 뒤집히면",
    summary: "카메라를 향한 앞쪽 면 0 / 5,986",
    note: "법선이 모두 안쪽을 향합니다. 앞쪽 면은 카메라 반대쪽을 가리켜 전부 버려지고, 뒤통수 쪽 면의 안쪽이 카메라를 향해 그려집니다. 시선은 앞면을 지나 특징 없는 뒤통수 안쪽에 닿습니다.",
  },
  {
    label: "진폭을 키워도",
    summary: "코는 있음 · 보이지 않음",
    note: "중심선 최대 깊이 1.181이 옆면 0.850보다 커서 코는 분명히 있었습니다. 하지만 코가 놓인 앞쪽 면은 통째로 버려지므로 진폭을 아무리 키워도 그려지는 것은 매끈한 뒤통수 안쪽뿐입니다.",
  },
] as const;

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);

const DRAWN = "#2563eb";
const CULLED = "#94a3b8";
const RAY = "#d97706";
const TEXT = "#64748b";

const CX = 180;
const CY = 96;
const RADIUS = 60;
const CAM = { x: 180, y: 204 };
const ANGLES = [20, 50, 90, 130, 160, 200, 235, 270, 305, 340] as const;
const ARC_STEPS = 18;

/** 각도 구간을 점선/실선으로 나눠 그리려고 원호를 잘게 나눕니다. */
function arcSegments(start: number, end: number) {
  return Array.from({ length: ARC_STEPS }, (_, i) => {
    const a0 = ((start + ((end - start) * i) / ARC_STEPS) * Math.PI) / 180;
    const a1 = ((start + ((end - start) * (i + 1)) / ARC_STEPS) * Math.PI) / 180;
    return {
      x1: CX + RADIUS * Math.cos(a0),
      y1: CY + RADIUS * Math.sin(a0),
      x2: CX + RADIUS * Math.cos(a1),
      y2: CY + RADIUS * Math.sin(a1),
    };
  });
}

const FRONT = arcSegments(0, 180);
const BACK = arcSegments(180, 360);

function Triangle({ x, clockwise, drawn }: { x: number; clockwise: boolean; drawn: boolean }) {
  const top = { x, y: 54 };
  const left = { x: x - 40, y: 128 };
  const right = { x: x + 40, y: 128 };
  const order = clockwise ? [top, right, left] : [top, left, right];
  const color = drawn ? DRAWN : CULLED;
  return (
    <g>
      <polygon
        points={`${top.x},${top.y} ${left.x},${left.y} ${right.x},${right.y}`}
        fill={color}
        fillOpacity={drawn ? 0.14 : 0.05}
        stroke={color}
        strokeWidth={1.25}
        strokeDasharray={drawn ? undefined : "4 3"}
      />
      {order.map((point, index) => (
        <g key={index}>
          <circle cx={point.x} cy={point.y} r={8} fill="#ffffff" stroke={color} strokeWidth={1} />
          <text x={point.x} y={point.y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
            {index + 1}
          </text>
        </g>
      ))}
      <text x={x} y={106} textAnchor="middle" fontSize={20} fill={color}>
        {clockwise ? "↻" : "↺"}
      </text>
      <text x={x} y={154} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
        {clockwise ? "반대 순서 → 뒷면" : "정한 순서 → 앞면"}
      </text>
      <text x={x} y={172} textAnchor="middle" fontSize={12} fill={color}>
        {drawn ? "그림" : "버림"}
      </text>
    </g>
  );
}

function HeadSlice({ flipped, bigNose }: { flipped: boolean; bigNose: boolean }) {
  const sign = flipped ? -1 : 1;
  const frontDrawn = !flipped;
  const noseTip = CY + RADIUS + (bigNose ? 26 : 12);
  const hitY = flipped ? CY - RADIUS : noseTip;
  const frontColor = frontDrawn ? DRAWN : CULLED;
  const backColor = frontDrawn ? CULLED : DRAWN;
  return (
    <g>
      {BACK.map((s, i) => (
        <line key={`b${i}`} {...s} stroke={backColor} strokeWidth={frontDrawn ? 1 : 1.25} strokeDasharray={frontDrawn ? "4 3" : undefined} />
      ))}
      {FRONT.map((s, i) => (
        <line key={`f${i}`} {...s} stroke={frontColor} strokeWidth={frontDrawn ? 1.25 : 1} strokeDasharray={frontDrawn ? undefined : "4 3"} />
      ))}
      <polyline
        points={`${CX - 14},${CY + RADIUS - 2} ${CX},${noseTip} ${CX + 14},${CY + RADIUS - 2}`}
        fill="none"
        stroke={frontColor}
        strokeWidth={frontDrawn ? 1.25 : 1}
        strokeDasharray={frontDrawn ? undefined : "4 3"}
      />
      <text x={CX + 18} y={noseTip + 4} fontSize={12} fill={frontColor}>
        코
      </text>
      {ANGLES.map((deg) => {
        const a = (deg * Math.PI) / 180;
        const px = CX + RADIUS * Math.cos(a);
        const py = CY + RADIUS * Math.sin(a);
        const nx = sign * Math.cos(a);
        const ny = sign * Math.sin(a);
        // 카메라는 단면 아래쪽 멀리 있다고 보고(정사영), 법선이 아래를 향하면 카메라 쪽입니다.
        const facing = ny > 0.01;
        const color = facing ? DRAWN : CULLED;
        const ex = px + nx * 16;
        const ey = py + ny * 16;
        return (
          <g key={deg}>
            <line x1={px} y1={py} x2={ex} y2={ey} stroke={color} strokeWidth={1} />
            <circle cx={ex} cy={ey} r={2} fill={color} />
          </g>
        );
      })}
      <line x1={CAM.x} y1={CAM.y - 8} x2={CAM.x} y2={hitY} stroke={RAY} strokeWidth={1.25} strokeDasharray="2 2" />
      <circle cx={CAM.x} cy={hitY} r={4} fill={RAY} />
      <rect x={CAM.x - 12} y={CAM.y - 8} width={24} height={14} rx={2} fill="#ffffff" stroke={RAY} strokeWidth={1.25} />
      <text x={CAM.x + 18} y={CAM.y + 4} fontSize={12} fill={RAY}>
        카메라
      </text>
      <text x={CX + RADIUS + 22} y={CY - RADIUS + 6} fontSize={12} fill={TEXT}>
        뒤통수
      </text>
      <text x={CX + RADIUS + 22} y={CY + RADIUS - 4} fontSize={12} fill={TEXT}>
        얼굴 쪽
      </text>
      <text x={flipped ? CX : CX - 18} y={flipped ? CY - RADIUS - 12 : noseTip + 4} textAnchor={flipped ? "middle" : "end"} fontSize={12} fontWeight={700} fill={RAY}>
        {flipped ? "보이는 곳: 뒤통수 안쪽" : "보이는 곳: 앞면"}
      </text>
    </g>
  );
}

export default function BackfaceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="위에서 내려다본 단면"
      title="감김 순서가 뒤집히면 카메라는 뒤통수 안쪽을 봅니다"
      description="두상을 위에서 자른 단면입니다. 카메라는 아래쪽에 있고, 원 위의 작은 막대는 각 면의 법선입니다."
      note="단면 모양과 법선 개수는 설명용 가정입니다. 실측값은 본문의 1.181, 0.850, 5,986개 중 0개뿐입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="면 감김 순서와 법선 방향에 따라 그려지는 면이 바뀌는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <div className="mt-2 min-w-0 sm:mt-4">
          <svg viewBox="50 6 260 212" className="mx-auto block w-full max-w-[14rem] sm:max-w-[20rem]" role="img" aria-label={SCENES[active].label}>
            {active === 0 ? (
              <g>
                <Triangle x={115} clockwise={false} drawn />
                <Triangle x={245} clockwise drawn={false} />
                <text x={180} y={204} textAnchor="middle" fontSize={11} fill={TEXT}>
                  카메라에서 본, 꼭짓점 순서만 다른 삼각형
                </text>
              </g>
            ) : (
              <HeadSlice flipped={active >= 2} bigNose={active === 3} />
            )}
          </svg>
          <p className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
            <span>
              <span className="mr-1 inline-block h-0.5 w-4 align-middle" style={{ backgroundColor: DRAWN }} />
              그리는 면
            </span>
            <span>
              <span className="mr-1 inline-block w-4 border-t border-dashed align-middle" style={{ borderColor: CULLED }} />
              버리는 면
            </span>
            <span>
              <span className="mr-1 inline-block w-4 border-t border-dashed align-middle" style={{ borderColor: RAY }} />
              카메라 시선
            </span>
          </p>
        </div>
        <StableSceneStack
          active={active}
          className="mt-3 sm:mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:pl-4 sm:text-sm sm:leading-7">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
