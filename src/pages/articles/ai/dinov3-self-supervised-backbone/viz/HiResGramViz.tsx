import SceneShell from "./SceneShell";

/**
 * 본문 대응: GramAnchoring.tsx #gram-teacher 셋째 문단 — Gram teacher에 두 배 해상도 입력,
 * 나온 특징 맵을 bicubic 보간으로 절반 크기로 줄여 student와 같은 패치 격자의 기준을 만든다.
 * 격자 크기 4×4·8×8은 줄여 그린 가정값이다.
 */
const BASE = 4;

const SCENES = [
  {
    label: "student는 원래 해상도",
    summary: "패치 격자 4×4 (줄여 그림)",
    note: "student가 보는 이미지에서 패치 격자가 나옵니다. 그림은 한 변 4칸으로 줄였습니다(가정). Gram 행렬은 이 격자의 패치 쌍마다 한 칸씩 생깁니다.",
  },
  {
    label: "Gram teacher에는 두 배 해상도",
    summary: "같은 장면 · 격자 8×8",
    note: "같은 장면을 두 배 해상도로 넣으면 같은 크기의 패치로 자를 때 한 변의 패치 수가 두 배가 됩니다. 같은 영역을 더 촘촘히 본 특징 맵입니다.",
  },
  {
    label: "bicubic으로 절반 크기",
    summary: "8×8 → 4×4 · student와 같은 격자",
    note: "특징 맵을 bicubic 보간으로 절반 크기로 줄이면 student 격자와 칸이 하나씩 맞습니다. 촘촘히 본 결과를 부드럽게 줄인 값이 기준이 되어, 붙잡는 관계 구조 자체가 더 정밀해집니다.",
  },
] as const;

const STUDENT = "#2563eb";
const TEACHER = "#7c3aed";

// 칸 농도(가정값). teacher 8×8은 고정 패턴, 줄인 기준은 그 2×2 묶음의 평균(부드럽게 줄인 값의 근사),
// student는 별도 패턴 — 줄인 기준이 student 값을 그대로 복사한 것처럼 보이지 않게 한다.
const shade8 = (r: number, c: number) => 0.08 + (((r * 8 + c) * 7) % 5) * 0.05;
const SHADES: Record<string, (r: number, c: number) => number> = {
  student: (r, c) => 0.08 + (((r * 4 + c) * 3 + 1) % 5) * 0.05,
  teacher: shade8,
  reduced: (r, c) => (shade8(2 * r, 2 * c) + shade8(2 * r, 2 * c + 1) + shade8(2 * r + 1, 2 * c) + shade8(2 * r + 1, 2 * c + 1)) / 4,
};

function Grid({ x, n, size, color, on, shade }: { x: number; n: number; size: number; color: string; on: boolean; shade: (r: number, c: number) => number }) {
  return (
    <g opacity={on ? 1 : 0.25}>
      {Array.from({ length: n * n }, (_, k) => (
        <rect
          key={k}
          x={x + (k % n) * size}
          y={2 + Math.floor(k / n) * size}
          width={size}
          height={size}
          fill={color}
          fillOpacity={shade(Math.floor(k / n), k % n)}
          stroke={color}
          strokeWidth={0.75}
        />
      ))}
    </g>
  );
}

export default function HiResGramViz() {
  return (
    <SceneShell
      eyebrow="고해상도 Gram teacher"
      title="두 배로 촘촘히 보고 절반으로 줄여 격자를 맞춥니다"
      description="왼쪽은 student, 가운데는 두 배 해상도로 본 Gram teacher의 특징 맵, 오른쪽은 줄인 기준입니다. 칸 하나가 패치 하나이며 격자 크기와 칸의 농도는 설명을 위한 가정입니다. 오른쪽 농도는 가운데 2×2 칸을 평균한 근사로 그렸습니다."
      ariaLabel="두 배 해상도 특징 맵을 절반으로 줄여 student 격자에 맞추는 과정"
      scenes={SCENES}
      render={(active) => {
        const panels = [
          { title: "student 4×4", caption: "원래 해상도", n: BASE, color: STUDENT, on: true, shade: SHADES.student },
          { title: "teacher 8×8", caption: "같은 장면, 두 배 해상도", n: BASE * 2, color: TEACHER, on: active >= 1, shade: SHADES.teacher },
          { title: "줄인 기준 4×4", caption: "bicubic으로 절반", n: BASE, color: TEACHER, on: active >= 2, shade: SHADES.reduced },
        ];
        return (
          <div className="grid grid-cols-3 gap-3 sm:gap-6" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {panels.map((panel) => (
              <div key={panel.title} className="min-w-0 text-center">
                <p className={`text-xs font-bold sm:text-sm ${panel.on ? "" : "text-muted-foreground/60"}`} style={panel.on ? { color: panel.color } : undefined}>
                  {panel.title}
                </p>
                <svg viewBox="0 0 116 116" className="mx-auto mt-2 block h-auto w-full max-w-[150px]">
                  <Grid x={2} n={panel.n} size={112 / panel.n} color={panel.color} on={panel.on} shade={panel.shade} />
                </svg>
                <p className={`mt-2 text-xs leading-5 ${panel.on ? "text-muted-foreground" : "text-muted-foreground/50"}`}>{panel.caption}</p>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
