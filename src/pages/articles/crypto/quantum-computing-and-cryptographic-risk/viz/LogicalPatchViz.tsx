import SceneShell from "./SceneShell";
import { Arrow } from "./SvgBits";

/**
 * 본문 대응: #comparison — 논리 큐비트는 잡음 있는 물리 큐비트 여러 개와 반복 검사로 지탱하고, 필요한 배수는 조건에 따라 달라진다.
 * 칩은 평면 격자이고 나머지 축은 시간이라, 공간 자체가 답인 3D 대신 판을 시간순으로 늘어놓았습니다.
 * 점과 판의 수는 어떤 논문의 값도 아닙니다.
 */
const W = 360;
const H = 210;
const GAP = 16;
const BLUE = "#2563eb";
const GRAY = "#64748b";
const FAINT = "#94a3b8";

const SCENES = [
  { label: "물리 큐비트 한 판", summary: "이웃끼리만 연결", note: "점 하나가 잡음 있는 물리 큐비트, 선이 연결입니다. 평면 격자에서는 바로 옆 큐비트끼리만 연결됩니다. 점의 수는 어떤 논문의 값도 아닙니다." },
  { label: "한 묶음이 논리 큐비트", summary: "1,200개 ≠ 50만 개", note: "알고리즘이 세는 논리 큐비트 하나는 이런 묶음 하나로 구현합니다. 그래서 논리 1,200개 미만과 물리 50만 개 미만은 같은 단위가 아닙니다." },
  { label: "검사를 되풀이", summary: "같은 판을 시간순으로", note: "묶음은 한 번 검사하고 끝나지 않습니다. 같은 판을 반복해서 검사하며, 그림의 판 하나가 검사 한 번입니다. Gidney 추정이 가정한 표면 부호(이런 격자 위에서 오류를 고치는 코드)의 주기는 1 µs입니다." },
  { label: "배수는 고정이 아님", summary: "오류율 · 코드 · 연결 · 정확도", note: "한 묶음에 물리 큐비트가 몇 개 필요한지는 오류율, 정정 코드, 연결, 요구 정확도에 따라 달라집니다. 그래서 고정 배수로 물리 개수를 환산하지 않습니다. 세 크기는 달라진다는 것만 보입니다." },
] as const;

function Patch({ x, y, n, gap = GAP, dot = 3, color = BLUE, opacity = 1 }: { x: number; y: number; n: number; gap?: number; dot?: number; color?: string; opacity?: number }) {
  const side = (n - 1) * gap;
  const lines = Array.from({ length: n }, (_, index) => index * gap);
  return (
    <g opacity={opacity}>
      {lines.map((offset) => (
        <g key={offset}>
          <line x1={x} x2={x + side} y1={y + offset} y2={y + offset} stroke={FAINT} strokeWidth={1} />
          <line x1={x + offset} x2={x + offset} y1={y} y2={y + side} stroke={FAINT} strokeWidth={1} />
        </g>
      ))}
      {lines.flatMap((row) => lines.map((col) => <circle key={`${row}-${col}`} cx={x + col} cy={y + row} r={dot} fill={color} />))}
    </g>
  );
}

function Stage({ active }: { active: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {active === 0 && (
        <g>
          <Patch x={124} y={36} n={6} gap={22} dot={4} />
          <text x={W / 2} y={H - 18} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>점 = 물리 큐비트 · 선 = 연결</text>
        </g>
      )}
      {active === 1 && (
        <g>
          {[0, 1, 2].map((index) => {
            const x = 16 + index * 118;
            return (
              <g key={index}>
                <rect x={x - 8} y={42} width={GAP * 5 + 16} height={GAP * 5 + 16} rx={8} fill={`${BLUE}0f`} stroke={BLUE} strokeWidth={1} />
                <Patch x={x} y={50} n={6} />
                <text x={x + (GAP * 5) / 2} y={30} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>논리 큐비트 {index + 1}</text>
              </g>
            );
          })}
          <text x={W / 2} y={170} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>알고리즘은 묶음을 세고, 칩은 점을 셉니다</text>
        </g>
      )}
      {active === 2 && (
        <g>
          {[0, 1, 2, 3].map((index) => {
            const x = 18 + index * 86;
            return (
              <g key={index}>
                <Patch x={x} y={46} n={5} gap={15} dot={2.5} />
                <text x={x + 30} y={30} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>검사 {index + 1}</text>
                {index < 3 && <Arrow x1={x + 64} y1={76} x2={x + 82} y2={76} color={GRAY} />}
              </g>
            );
          })}
          <Arrow x1={18} y1={136} x2={342} y2={136} color={GRAY} />
          <text x={W / 2} y={158} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>시간 → 계산하는 동안 되풀이</text>
        </g>
      )}
      {active === 3 && (
        <g>
          <Patch x={24} y={72} n={3} gap={18} dot={3} />
          <Patch x={106} y={54} n={5} gap={18} dot={3} />
          <Patch x={220} y={36} n={7} gap={18} dot={3} />
          <text x={42} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>작은 묶음</text>
          <text x={142} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>중간</text>
          <text x={274} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>큰 묶음</text>
        </g>
      )}
    </svg>
  );
}

export default function LogicalPatchViz() {
  return (
    <SceneShell
      eyebrow="논리 큐비트의 구성"
      title="논리 큐비트 하나는 물리 큐비트 판과 반복 검사로 버팁니다"
      description="점과 판의 수는 구조를 보이기 위한 개념도입니다. 실제 수는 논문의 가정에 따라 달라집니다."
      ariaLabel="물리 큐비트 격자를 묶어 논리 큐비트를 만들고 시간순으로 검사를 되풀이하는 구조"
      scenes={SCENES}
      render={(active) => <Stage active={active} />}
    />
  );
}
