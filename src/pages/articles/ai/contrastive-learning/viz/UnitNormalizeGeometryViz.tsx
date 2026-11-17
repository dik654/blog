import SceneShell from "./ContrastSceneShell";
import { PROJECTION_FIXTURE, l2Norm2d, normalize2d } from "../calculations";

/**
 * 본문 대응: #projection — z̃=(3,4)를 L2 norm 5로 나눠 z=(0.6,0.8)을 만들고,
 * r=(1,0)과의 cosine 0.6을 구하는 계산을 평면 위 화살표로 그립니다.
 * 왼쪽 = 원래 크기(1칸 = 24px), 오른쪽 = 길이 1 원을 확대한 그림(1 = 130px).
 * (1.5,2)는 길이만 다른 vector를 보이려는 가정값입니다.
 */
const SHORT = [1.5, 2] as const;
const SHORT_NORM = l2Norm2d(SHORT);
const SHORT_UNIT = normalize2d(SHORT);
const { projection, reference, norm, unit, cosine } = PROJECTION_FIXTURE;

const SCENES = [
  { label: "z̃=(3,4)는 길이 5", summary: `√(3²+4²) = ${norm}`, note: "Projection head가 낸 z̃=(3,4)를 원점에서 그은 화살표입니다. 가로 3칸, 세로 4칸이므로 길이(L2 norm)는 5입니다." },
  { label: "길이로 나누면 z=(0.6,0.8)", summary: `(3/5, 4/5) = (${unit[0]}, ${unit[1]})`, note: "각 성분을 길이 5로 나누면 같은 방향을 유지한 채 길이 1인 원 위의 점 z에 닿습니다. 오른쪽은 그 원을 확대한 그림입니다." },
  { label: "길이만 다른 vector도 같은 z", summary: `(1.5,2) → 길이 ${SHORT_NORM} → (${SHORT_UNIT[0]}, ${SHORT_UNIT[1]})`, note: "같은 방향이고 길이만 2.5인 (1.5,2)(가정)도 정규화하면 같은 z가 됩니다. 정규화 뒤에는 길이 차이가 비교에서 사라집니다." },
  { label: "r=(1,0)과의 cosine은 0.6", summary: `${unit[0]}×1 + ${unit[1]}×0 = ${cosine}`, note: "비교 기준 r=(1,0)도 길이 1인 vector이므로 두 unit vector의 내적이 곧 cosine입니다. z를 r 방향으로 내린 그림자의 길이 0.6이 그 값이며, 1이면 같은 방향, 0이면 직각입니다." },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#475569";
const ALT = "#d97706";

const L0 = { x: 22, y: 196 };
const LS = 24;
const R0 = { x: 206, y: 196 };
const RS = 130;

function Arrow({ x1, y1, x2, y2, color, id, width = 1.25 }: { x1: number; y1: number; x2: number; y2: number; color: string; id: string; width?: number }) {
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0L7 3.5L0 7Z" fill={color} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} markerEnd={`url(#${id})`} />
    </g>
  );
}

export default function UnitNormalizeGeometryViz() {
  return (
    <SceneShell
      eyebrow="정규화의 기하"
      title="길이는 지우고 방향만 남겨 cosine을 잽니다"
      description="왼쪽은 원래 크기, 오른쪽은 길이 1인 원을 확대한 그림입니다. 숫자는 아래 계산 장부와 같은 설명용 fixture입니다."
      ariaLabel="z̃=(3,4)를 길이 5로 나눠 z=(0.6,0.8)을 만들고 r=(1,0)과 cosine 0.6을 구하는 과정"
      scenes={SCENES}
      render={(active) => {
        const lx = (v: number) => L0.x + v * LS;
        const ly = (v: number) => L0.y - v * LS;
        const rx = (v: number) => R0.x + v * RS;
        const ry = (v: number) => R0.y - v * RS;
        const showUnit = active >= 1;
        const showShort = active === 2;
        const showCos = active === 3;
        return (
          <svg viewBox="0 0 360 226" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 왼쪽: 원래 크기 */}
            <text x={L0.x} y={14} fontSize={10} fontWeight={700} fill={TEXT}>원래 크기 (1칸 = 1)</text>
            {[1, 2, 3, 4, 5].map((g) => (
              <g key={g}>
                <line x1={lx(g)} x2={lx(g)} y1={ly(0)} y2={ly(5.5)} stroke={MUTED} strokeWidth={1} opacity={0.25} />
                <line x1={lx(0)} x2={lx(5.5)} y1={ly(g)} y2={ly(g)} stroke={MUTED} strokeWidth={1} opacity={0.25} />
              </g>
            ))}
            <line x1={lx(0)} x2={lx(5.6)} y1={ly(0)} y2={ly(0)} stroke={MUTED} strokeWidth={1} />
            <line x1={lx(0)} x2={lx(0)} y1={ly(0)} y2={ly(5.6)} stroke={MUTED} strokeWidth={1} />
            <path d={`M${lx(1)} ${ly(0)} A${LS} ${LS} 0 0 0 ${lx(0)} ${ly(1)}`} fill="none" stroke={showUnit ? ACCENT : MUTED} strokeWidth={1} strokeDasharray="3 3" />
            <Arrow id="cl-geo-big" x1={lx(0)} y1={ly(0)} x2={lx(projection[0])} y2={ly(projection[1])} color={active === 0 ? ACCENT : MUTED} />
            <text x={lx(projection[0]) + 4} y={ly(projection[1]) - 4} fontSize={10} fontWeight={700} fill={active === 0 ? ACCENT : TEXT}>z̃=(3,4)</text>
            {active === 0 && (
              <g fontSize={9} fill={TEXT}>
                <text x={lx(1.5)} y={ly(0) + 14} textAnchor="middle">가로 3</text>
                <text x={lx(3) + 6} y={ly(2)} >세로 4</text>
                <text x={lx(1.6)} y={ly(2.5)} textAnchor="end">길이 5</text>
              </g>
            )}
            {showShort && (
              <g>
                <Arrow id="cl-geo-short" x1={lx(0)} y1={ly(0)} x2={lx(SHORT[0])} y2={ly(SHORT[1])} color={ALT} />
                <text x={lx(SHORT[0]) + 6} y={ly(SHORT[1]) + 10} fontSize={10} fontWeight={700} fill={ALT}>(1.5,2)</text>
              </g>
            )}
            {showUnit && <circle cx={lx(unit[0])} cy={ly(unit[1])} r={3.5} fill={ACCENT} />}
            {showUnit && <text x={lx(1.1)} y={ly(0.25)} fontSize={9} fill={ACCENT}>길이 1</text>}

            {/* 오른쪽: 길이 1 원 확대 */}
            <text x={R0.x} y={14} fontSize={10} fontWeight={700} fill={TEXT}>길이 1인 원 확대</text>
            <line x1={rx(0)} x2={rx(1.08)} y1={ry(0)} y2={ry(0)} stroke={MUTED} strokeWidth={1} />
            <line x1={rx(0)} x2={rx(0)} y1={ry(0)} y2={ry(1.08)} stroke={MUTED} strokeWidth={1} />
            <path d={`M${rx(1)} ${ry(0)} A${RS} ${RS} 0 0 0 ${rx(0)} ${ry(1)}`} fill="none" stroke={showUnit ? ACCENT : MUTED} strokeWidth={1} strokeDasharray="3 3" opacity={showUnit ? 1 : 0.5} />
            {showUnit && (
              <g>
                <Arrow id="cl-geo-unit" x1={rx(0)} y1={ry(0)} x2={rx(unit[0])} y2={ry(unit[1])} color={ACCENT} />
                <text x={rx(unit[0]) + 6} y={ry(unit[1]) - 4} fontSize={10} fontWeight={700} fill={ACCENT}>z=(0.6,0.8)</text>
              </g>
            )}
            {showShort && <text x={rx(unit[0]) + 6} y={ry(unit[1]) + 10} fontSize={9} fill={ALT}>(1.5,2)도 여기로</text>}
            {showCos && (
              <g>
                <Arrow id="cl-geo-ref" x1={rx(0)} y1={ry(0)} x2={rx(reference[0])} y2={ry(reference[1])} color={ALT} />
                <text x={rx(1)} y={ry(0) + 22} textAnchor="end" fontSize={10} fontWeight={700} fill={ALT}>r=(1,0)</text>
                <line x1={rx(unit[0])} y1={ry(unit[1])} x2={rx(unit[0])} y2={ry(0)} stroke={TEXT} strokeWidth={1} strokeDasharray="2 3" />
                <line x1={rx(0)} y1={ry(0) + 8} x2={rx(unit[0])} y2={ry(0) + 8} stroke={ACCENT} strokeWidth={1.25} />
                <text x={rx(unit[0] / 2)} y={ry(0) + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>{cosine}</text>
              </g>
            )}
            <text x={rx(1)} y={ry(0) - 4} textAnchor="end" fontSize={9} fill={TEXT}>1</text>
          </svg>
        );
      }}
    />
  );
}
