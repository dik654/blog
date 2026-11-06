import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #latent-representation의 접은 설명 — 원을 연속적인 한 칸으로 옮기면 어딘가 겹치거나 끊긴다.
 * 위 = 평면의 원, 아래 = 한 칸 눈금. 함수 예시는 본문의 가로 좌표입니다.
 */
const W = 340;
const H = 256;
const CX = 170;
const CY = 92;
const R = 70;
const LINE_Y = 202;

const cx = (x: number) => CX + x * R;
const cy = (y: number) => CY - y * R;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const DROP = "#94a3b8";

const SCENES = [
  { label: "가로 좌표만", summary: "(0,1)과 (0,−1) → 0", note: "가로 좌표만 남기면 맨 위 (0,1)과 맨 아래 (0,−1)이 모두 0입니다. 서로 다른 두 점이 눈금의 한 곳에 겹칩니다." },
  { label: "두 호", summary: "최솟값에서 최댓값까지 두 길", note: "연속 함수는 가까운 점을 가까운 값으로 보냅니다. 닫히고 유한한 원에는 최솟값과 최댓값의 점이 있고, 그 사이에 호가 두 개 놓입니다." },
  { label: "사이의 한 값", summary: "두 호가 같은 값을 지남", note: "값이 건너뛰지 않으므로 두 호 모두 사이의 모든 값을 지납니다. 한 값을 고르면 서로 다른 두 점이 같은 출력이 됩니다." },
  { label: "각도로 적기", summary: "겹치지 않지만 끊김", note: "각도로 적으면 겹침은 피해도 어딘가에 경계를 둡니다. 경계 양쪽의 바로 옆 두 점이 눈금의 양 끝으로 갈라져 연속이 아닙니다." },
] as const;

const C_VALUE = 0.5;
const C_Y = Math.sqrt(1 - C_VALUE * C_VALUE);
const UNROLL_LEFT = 40;
const UNROLL_RIGHT = 300;
const CUT_OFFSET = 0.3;

export default function CircleOneCoordinateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;

  const upperArc = `M ${cx(-1)} ${cy(0)} A ${R} ${R} 0 0 1 ${cx(1)} ${cy(0)}`;
  const lowerArc = `M ${cx(-1)} ${cy(0)} A ${R} ${R} 0 0 0 ${cx(1)} ${cy(0)}`;
  const cutA = [Math.cos(CUT_OFFSET), Math.sin(CUT_OFFSET)] as const;
  const cutB = [Math.cos(CUT_OFFSET), -Math.sin(CUT_OFFSET)] as const;
  const aOnLine = UNROLL_LEFT + (CUT_OFFSET / (2 * Math.PI)) * (UNROLL_RIGHT - UNROLL_LEFT);
  const bOnLine = UNROLL_RIGHT - (CUT_OFFSET / (2 * Math.PI)) * (UNROLL_RIGHT - UNROLL_LEFT);

  return (
    <VizFrame
      eyebrow="내재 차원 1인 원"
      title="원을 한 칸에 옮기면 어딘가 겹치거나 끊깁니다"
      description="위는 평면의 원, 아래는 숫자 하나만 적는 눈금입니다. 점선이 옮겨 가는 자리를 잇습니다."
      note="앞 세 장면의 함수는 예로 고른 가로 좌표입니다. 아래 접은 설명의 증명은 모든 연속 함수에 적용됩니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="원을 한 칸 눈금으로 옮길 때 겹침과 끊김이 생기는 과정"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 || active === 3 ? (
            <circle cx={CX} cy={CY} r={R} fill="none" stroke={GRAY} strokeWidth={1.25} />
          ) : (
            <g>
              <path d={upperArc} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <path d={lowerArc} fill="none" stroke={AMBER} strokeWidth={1.25} />
            </g>
          )}

          {active !== 3 && (
            <g>
              <line x1={cx(-1.25)} x2={cx(1.25)} y1={LINE_Y} y2={LINE_Y} stroke={GRAY} strokeWidth={1} />
              {[-1, 0, 1].map((tick) => (
                <g key={tick}>
                  <line x1={cx(tick)} x2={cx(tick)} y1={LINE_Y - 4} y2={LINE_Y + 4} stroke={GRAY} strokeWidth={1} />
                  <text x={cx(tick)} y={LINE_Y + 20} textAnchor="middle" fontSize={12} fill={GRAY}>{tick < 0 ? "−1" : tick}</text>
                </g>
              ))}
              <text x={CX} y={LINE_Y + 40} textAnchor="middle" fontSize={12} fill={GRAY}>가로 좌표 한 칸</text>
            </g>
          )}

          {active === 0 && (
            <g>
              <line x1={cx(0)} x2={cx(0)} y1={cy(1)} y2={LINE_Y} stroke={DROP} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={cx(0)} cy={cy(1)} r={5} fill={BLUE} />
              <circle cx={cx(0)} cy={cy(-1)} r={5} fill={AMBER} />
              <circle cx={cx(0)} cy={LINE_Y} r={6} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <text x={cx(0) + 9} y={cy(1) - 6} fontSize={12} fontWeight={700} fill={BLUE}>(0,1)</text>
              <text x={cx(0) + 10} y={cy(-1) + 14} fontSize={12} fontWeight={700} fill={AMBER}>(0,−1)</text>
            </g>
          )}

          {(active === 1 || active === 2) && (
            <g>
              {[-1, 1].map((end) => (
                <g key={end}>
                  <line x1={cx(end)} x2={cx(end)} y1={cy(0)} y2={LINE_Y} stroke={DROP} strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx={cx(end)} cy={cy(0)} r={5} fill={GRAY} />
                  <text x={cx(end) + (end < 0 ? -9 : 9)} y={cy(0) + 4} textAnchor={end < 0 ? "end" : "start"} fontSize={12} fontWeight={700} fill={GRAY}>{end < 0 ? "최솟값" : "최댓값"}</text>
                </g>
              ))}
              {active === 1 && <text x={CX} y={cy(1) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>위쪽 호</text>}
              {active === 1 && <text x={CX} y={cy(-1) + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>아래쪽 호</text>}
            </g>
          )}

          {active === 2 && (
            <g>
              <line x1={cx(C_VALUE)} x2={cx(C_VALUE)} y1={cy(C_Y)} y2={LINE_Y} stroke={DROP} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={cx(C_VALUE)} cy={cy(C_Y)} r={5} fill={BLUE} />
              <circle cx={cx(C_VALUE)} cy={cy(-C_Y)} r={5} fill={AMBER} />
              <circle cx={cx(C_VALUE)} cy={LINE_Y} r={6} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <text x={cx(C_VALUE)} y={LINE_Y - 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>같은 값</text>
            </g>
          )}

          {active === 3 && (
            <g>
              <line x1={cx(0.8)} x2={cx(1.2)} y1={cy(0)} y2={cy(0)} stroke="#dc2626" strokeWidth={1.25} />
              <text x={cx(0.7)} y={cy(0) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">시작 경계</text>
              <circle cx={cx(cutA[0])} cy={cy(cutA[1])} r={5} fill={BLUE} />
              <circle cx={cx(cutB[0])} cy={cy(cutB[1])} r={5} fill={AMBER} />
              <line x1={UNROLL_LEFT} x2={UNROLL_RIGHT} y1={LINE_Y} y2={LINE_Y} stroke={GRAY} strokeWidth={1} />
              {[UNROLL_LEFT, UNROLL_RIGHT].map((x) => (
                <line key={x} x1={x} x2={x} y1={LINE_Y - 5} y2={LINE_Y + 5} stroke="#dc2626" strokeWidth={1.25} />
              ))}
              <path d={`M ${cx(cutA[0])} ${cy(cutA[1])} L ${aOnLine} ${LINE_Y}`} fill="none" stroke={DROP} strokeWidth={1} strokeDasharray="3 3" />
              <path d={`M ${cx(cutB[0])} ${cy(cutB[1])} L ${bOnLine} ${LINE_Y}`} fill="none" stroke={DROP} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={aOnLine} cy={LINE_Y} r={5} fill={BLUE} />
              <circle cx={bOnLine} cy={LINE_Y} r={5} fill={AMBER} />
              <text x={UNROLL_LEFT} y={LINE_Y + 20} fontSize={12} fill={GRAY}>각도의 시작</text>
              <text x={UNROLL_RIGHT} y={LINE_Y + 20} textAnchor="end" fontSize={12} fill={GRAY}>한 바퀴 직전</text>
              <text x={CX} y={LINE_Y + 40} textAnchor="middle" fontSize={12} fill={GRAY}>각도 한 칸</text>
            </g>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
