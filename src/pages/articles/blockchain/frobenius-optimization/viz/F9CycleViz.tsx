import FrobSceneShell from "./FrobSceneShell";

/**
 * 본문 대응: #cycle — F₉의 아홉 값 a+bu(a,b ∈ {0,1,2})에서 φ(a+bu)=a+2bu.
 * b=0 줄(F₃의 0·1·2)은 한 번에 고정되고, b=1 줄과 b=2 줄은 서로 자리를 바꾼다.
 * 두 번 적용하면 a+4bu=a+bu로 모두 돌아온다. 항등 함수도 두 번 뒤 돌아오지만 φ(1+u)=1+2u와 다르다.
 */
const DIGITS = [0, 1, 2] as const;

function name(a: number, b: number) {
  if (b === 0) return `${a}`;
  const uPart = b === 1 ? "u" : "2u";
  return a === 0 ? uPart : `${a}+${uPart}`;
}

const SCENES = [
  { label: "아홉 값", summary: "a+bu, a·b ∈ {0,1,2}", note: "가로는 첫째 계수 a, 세로는 u의 계수 b입니다. F₉의 원소는 이 아홉 칸이 전부이고, 아래 줄 b=0은 바탕 체 F₃의 0·1·2입니다." },
  { label: "φ 한 번", summary: "a+bu → a+2bu", note: "a는 그대로이고 b만 두 배가 됩니다. 1을 두 배 하면 2, 2를 두 배 하면 4=1이라 b=1 줄과 b=2 줄이 자리를 바꿉니다. b=0 줄은 이미 한 번에 고정됩니다." },
  { label: "φ 두 번", summary: "1+u → 1+2u → 1+u", note: "다시 적용하면 a+4bu=a+bu입니다. 아홉 칸 모두 두 번 뒤 처음 자리로 돌아옵니다. F₉는 F₃ 위 차수 2이므로 φ²가 모든 값을 되돌립니다." },
  { label: "항등 함수와 비교", summary: "두 번 원복은 항등도 통과", note: "모든 칸을 그대로 두는 항등 함수도 두 번 뒤 돌아옵니다. 그러나 1+u의 진짜 세제곱은 1+2u라서 항등의 출력 1+u와 다릅니다. 원복 검사와 별도로 직접 세제곱과 비교해야 합니다." },
] as const;

const CELL_W = 82;
const CELL_H = 46;
const X0 = 58;
const COL_GAP = 16;
const ROW_GAP = 22;
const Y0 = 12;
const cx = (a: number) => X0 + a * (CELL_W + COL_GAP);
const cy = (b: number) => Y0 + (2 - b) * (CELL_H + ROW_GAP);

function outcome(scene: number, a: number, b: number) {
  if (scene === 0) return "";
  if (scene === 1) return b === 0 ? "고정" : `→ ${name(a, (2 * b) % 3)}`;
  if (scene === 2) return `→ → ${name(a, b)}`;
  return `항등 → ${name(a, b)}`;
}

function Picture({ scene }: { scene: number }) {
  const swapRows = scene === 1 || scene === 2;
  return (
    <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
      {DIGITS.map((b) => (
        <text key={`b${b}`} x={X0 - 10} y={cy(b) + CELL_H / 2 + 4} textAnchor="end" fontSize={12} fill="#64748b">b={b}</text>
      ))}
      {DIGITS.map((a) => (
        <text key={`a${a}`} x={cx(a) + CELL_W / 2} y={cy(0) + CELL_H + 18} textAnchor="middle" fontSize={12} fill="#64748b">a={a}</text>
      ))}
      {swapRows &&
        DIGITS.map((a) => {
          const x = cx(a) + CELL_W / 2;
          const top = cy(2) + CELL_H + 3;
          const bottom = cy(1) - 3;
          return (
            <g key={`sw${a}`}>
              <line x1={x} x2={x} y1={top + 4} y2={bottom - 4} stroke="#2563eb" strokeWidth={1.25} />
              <polygon points={`${x - 4},${top + 5} ${x + 4},${top + 5} ${x},${top}`} fill="#2563eb" />
              <polygon points={`${x - 4},${bottom - 5} ${x + 4},${bottom - 5} ${x},${bottom}`} fill="#2563eb" />
            </g>
          );
        })}
      {DIGITS.flatMap((b) =>
        DIGITS.map((a) => {
          const focus = a === 1 && b === 1;
          const fixed = scene === 1 && b === 0;
          const wrong = scene === 3 && focus;
          const stroke = wrong ? "#d97706" : focus && scene > 0 ? "#2563eb" : "#94a3b8";
          const fill = fixed ? "#e2e8f0" : wrong ? "#fef3c7" : focus && scene > 0 ? "#dbeafe" : "#f8fafc";
          return (
            <g key={`${a}${b}`}>
              <rect x={cx(a)} y={cy(b)} width={CELL_W} height={CELL_H} rx={8} fill={fill} stroke={stroke} strokeWidth={focus ? 1.25 : 1} />
              <text x={cx(a) + CELL_W / 2} y={cy(b) + (scene === 0 ? 28 : 20)} textAnchor="middle" fontSize={15} fontWeight={700} fill="#0f172a">{name(a, b)}</text>
              {scene > 0 && (
                <text x={cx(a) + CELL_W / 2} y={cy(b) + 37} textAnchor="middle" fontSize={12} fill={wrong ? "#b45309" : "#475569"}>{outcome(scene, a, b)}</text>
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
}

export default function F9CycleViz() {
  return (
    <FrobSceneShell
      eyebrow="F₉의 아홉 값"
      title="φ는 u의 계수만 두 배로 바꿔 두 줄의 자리를 맞바꿉니다"
      description="칸 하나가 F₉의 원소 a+bu 하나입니다. 계수는 3의 나머지이고 u²=2입니다. φ(x)=x³은 3절에서 세제곱으로 계산한 사상이며, 파란 칸이 본문의 x=1+u입니다."
      ariaLabel="F₉의 아홉 원소에 φ를 한 번과 두 번 적용한 결과와 항등 함수 비교"
      scenes={SCENES}
      render={(index) => <Picture scene={index} />}
    />
  );
}
