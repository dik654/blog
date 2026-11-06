import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tensor-backward — B×D, D×C, B×C 모양으로 전치 위치를 확인한다.
 * 칸 수는 정방행렬이 아닌 예로 B=2, D=3, C=4를 고른 가정이다.
 */
const B = 2;
const D = 3;
const C = 4;

const SCENES = [
  { label: "세 배열의 모양", summary: "X 2×3 · W 3×4 · G 2×4", note: "B는 자료 수, D는 입력 폭, C는 출력 폭입니다. 숫자가 서로 달라서 어느 축이 어느 축인지 칸만 세어도 구별됩니다." },
  { label: "dW = XᵀG", summary: "3×2 · 2×4 → 3×4", note: "X를 전치해야 맞닿는 축이 자료 수 2로 같아져 곱할 수 있습니다. 결과 3×4는 W와 같은 모양입니다. 자료 축이 합쳐져 사라집니다." },
  { label: "db = G의 행 합", summary: "2×4 → 길이 4", note: "자료 축을 따라 더하면 길이 4가 남아 b와 같습니다." },
  { label: "dX = GWᵀ", summary: "2×4 · 4×3 → 2×3", note: "이번에는 W를 전치해야 맞닿는 축이 출력 폭 4로 같아집니다. 결과 2×3은 X와 같고, 자료 행이 그대로 남습니다." },
];

function Matrix({ rows, cols, name, color, shape }: { rows: number; cols: number; name: string; color: string; shape?: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${cols},0.75rem)` }}>
        {Array.from({ length: rows * cols }, (_, index) => (
          <span key={index} className="h-3 rounded-[1px]" style={{ backgroundColor: color }} />
        ))}
      </div>
      <span className="whitespace-nowrap font-mono text-xs font-bold">{name}</span>
      <span className="font-mono text-[11px] text-muted-foreground">{shape ?? `${rows}×${cols}`}</span>
    </div>
  );
}

function Sign({ text }: { text: string }) {
  return <span className="self-center font-mono text-sm font-bold text-muted-foreground">{text}</span>;
}

const IN = "#2563eb";
const OUT = "#7c3aed";
const ERR = "#dc2626";
const RESULT = "#16a34a";

export default function ShapeContractViz() {
  return (
    <SceneShell
      eyebrow="모양으로 확인"
      title="결과 모양이 원래 변수와 같아지는 자리에 전치가 들어갑니다"
      description="칸 하나가 배열의 숫자 하나입니다. 작은 정방행렬에서는 전치 위치가 눈에 띄지 않으므로 자료 2개, 입력 폭 3, 출력 폭 4로 골랐습니다(가정)."
      ariaLabel="X, W, G의 모양과 세 gradient의 모양 대조"
      scenes={SCENES}
      render={(active) => (
        <div className="flex min-h-[7rem] flex-wrap items-start justify-center gap-x-3 gap-y-3">
          {active === 0 ? (
            <>
              <Matrix rows={B} cols={D} name="X" color={IN} />
              <Matrix rows={D} cols={C} name="W" color={OUT} />
              <Matrix rows={B} cols={C} name="G" color={ERR} />
            </>
          ) : null}
          {active === 1 ? (
            <>
              <Matrix rows={D} cols={B} name="Xᵀ" color={IN} />
              <Sign text="·" />
              <Matrix rows={B} cols={C} name="G" color={ERR} />
              <Sign text="→" />
              <Matrix rows={D} cols={C} name="dW = W 모양" color={RESULT} />
            </>
          ) : null}
          {active === 2 ? (
            <>
              <Matrix rows={B} cols={C} name="G" color={ERR} />
              <Sign text="→" />
              <Matrix rows={1} cols={C} name="db = b 모양" color={RESULT} shape={`길이 ${C}`} />
            </>
          ) : null}
          {active === 3 ? (
            <>
              <Matrix rows={B} cols={C} name="G" color={ERR} />
              <Sign text="·" />
              <Matrix rows={C} cols={D} name="Wᵀ" color={OUT} />
              <Sign text="→" />
              <Matrix rows={B} cols={D} name="dX = X 모양" color={RESULT} />
            </>
          ) : null}
        </div>
      )}
    />
  );
}
