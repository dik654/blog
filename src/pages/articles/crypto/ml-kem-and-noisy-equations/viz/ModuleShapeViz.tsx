import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 성분이 수 하나가 아니라 계수 256개의 다항식이고, 모듈 차원 k는 2·3·4 중 하나다.
 * 큰 칸 안의 작은 사각형 하나가 계수 하나입니다. 16×16=256이라 실제 개수를 그대로 그렸습니다.
 * 3×3×256=2,304, 3×256=768, k×256=512·768·1024. 행·열·계수는 번호일 뿐 공간 위치가 아니므로 2D로 그립니다.
 */
const W = 360;
const H = 224;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

const SCENES = [
  { label: "축소판", summary: "칸 하나에 숫자 하나", note: "앞의 17 예제입니다. 칸 하나에 숫자 하나가 들어갑니다. 표 A는 2행 2열이고 비밀 s는 2칸입니다." },
  { label: "칸 하나가 다항식", summary: "한 칸 = 계수 256개", note: "ML-KEM에서는 한 칸이 수 하나가 아니라 다항식입니다. 다항식은 x의 거듭제곱마다 계수를 붙여 더한 식입니다. 작은 사각형 하나가 계수 하나이고, 각 계수는 3329로 나눈 나머지입니다." },
  { label: "ML-KEM-768", summary: "k = 3", note: "k는 표의 행과 열 수입니다(모듈 차원). k=3이면 표 A는 3×3칸이고 각 칸이 계수 256개이므로 3×3×256=2,304개입니다. 비밀 s는 3칸이라 3×256=768개입니다. 공개 표는 짧은 씨앗에서 재생성합니다." },
  { label: "k가 바뀌면", summary: "2·3·4 × 256 = 512·768·1024", note: "비밀 s의 계수 수는 k×256이고, 512·768·1024는 이 곱과 같은 수입니다. 이름의 숫자를 AES 키 길이나 양자 보안 비트 수로 읽지 않는 것은 9절에서 다시 다룹니다." },
] as const;

/** 계수 256개를 16줄 16칸으로 찍은 사각형입니다. 칸마다 rect를 만들지 않도록 path 하나로 그립니다. */
function Coefficients({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const pitch = size / 16;
  const dot = pitch * 0.68;
  let d = "";
  for (let row = 0; row < 16; row += 1) {
    for (let col = 0; col < 16; col += 1) {
      d += `M${(x + (col + 0.16) * pitch).toFixed(2)} ${(y + (row + 0.16) * pitch).toFixed(2)}h${dot.toFixed(2)}v${dot.toFixed(2)}h${(-dot).toFixed(2)}z`;
    }
  }
  return <path d={d} fill={color} opacity={0.8} />;
}

function Block({ x, y, size, color, live = true }: { x: number; y: number; size: number; color: string; live?: boolean }) {
  return (
    <g opacity={live ? 1 : 0.35}>
      <rect x={x - 1} y={y - 1} width={size + 2} height={size + 2} rx={3} fill="none" stroke={color} strokeWidth={1} />
      <Coefficients x={x} y={y} size={size} color={color} />
    </g>
  );
}

function NumberCell({ x, y, value, color, live = false }: { x: number; y: number; value: number; color: string; live?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={44} height={44} rx={6} fill={live ? `${color}26` : "none"} stroke={color} strokeWidth={1} />
      <text x={x + 22} y={y + 28} textAnchor="middle" fontSize={17} fontWeight={700} fill={color}>{value}</text>
    </g>
  );
}

function Stage({ active }: { active: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {active === 0 && (
        <g>
          <text x={118} y={36} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>A: 숫자 4개</text>
          <NumberCell x={70} y={50} value={2} color={BLUE} />
          <NumberCell x={120} y={50} value={3} color={BLUE} />
          <NumberCell x={70} y={100} value={4} color={BLUE} />
          <NumberCell x={120} y={100} value={1} color={BLUE} />
          <text x={254} y={36} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>s: 숫자 2개</text>
          <NumberCell x={232} y={50} value={1} color={AMBER} />
          <NumberCell x={232} y={100} value={2} color={AMBER} />
        </g>
      )}
      {active === 1 && (
        <g>
          <NumberCell x={16} y={64} value={2} color={BLUE} />
          <NumberCell x={66} y={64} value={3} color={BLUE} live />
          <NumberCell x={16} y={114} value={4} color={BLUE} />
          <NumberCell x={66} y={114} value={1} color={BLUE} />
          <line x1={110} y1={64} x2={166} y2={30} stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" />
          <line x1={110} y1={108} x2={166} y2={190} stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" />
          <Block x={166} y={30} size={160} color={BLUE} />
          <text x={246} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>16 × 16 = 계수 256개</text>
          <text x={246} y={210} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>각 계수는 0 ~ 3328</text>
        </g>
      )}
      {active === 2 && (
        <g>
          <text x={110} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>A: 3×3×256 = 2,304개</text>
          {[0, 1, 2].flatMap((row) => [0, 1, 2].map((col) => <Block key={`${row}-${col}`} x={24 + col * 62} y={28 + row * 62} size={56} color={BLUE} />))}
          <text x={290} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>s: 3×256 = 768개</text>
          {[0, 1, 2].map((row) => <Block key={row} x={262} y={28 + row * 62} size={56} color={AMBER} />)}
        </g>
      )}
      {active === 3 && (
        <g>
          {[2, 3, 4].map((k, index) => (
            <g key={k}>
              <text x={8} y={46 + index * 66} fontSize={13} fontWeight={700} fill={k === 3 ? AMBER : GRAY}>k={k}</text>
              {Array.from({ length: k }, (_, cell) => (
                <Block key={cell} x={44 + cell * 54} y={18 + index * 66} size={48} color={k === 3 ? AMBER : GRAY} />
              ))}
              <text x={352} y={46 + index * 66} textAnchor="end" fontSize={13} fontWeight={700} fill={k === 3 ? AMBER : GRAY}>= {k * 256}개</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

export default function ModuleShapeViz() {
  return (
    <SceneShell
      eyebrow="칸 안의 칸"
      title="ML-KEM의 표는 칸마다 계수 256개가 들어 있습니다"
      description="큰 칸이 표의 한 칸, 그 안의 작은 사각형 하나가 계수 하나입니다. 작은 사각형은 실제 개수대로 그렸습니다."
      ariaLabel="축소판의 숫자 칸이 계수 256개의 다항식 칸으로 바뀌고 k에 따라 칸 수가 달라지는 구조"
      scenes={SCENES}
      render={(active) => <Stage active={active} />}
    />
  );
}
