import SceneShell from "./SceneShell";

/**
 * 본문 대응: #low-rank (12절 끝) — Aₖ를 B(m×k)·C(k×n)로 저장할 때의 숫자 수 k(m+n).
 * 천×천, k=10(가정): 1,000,000 → 10×(1,000+1,000)=20,000, 50배.
 * 2×2, k=1: 4 → 1×(2+2)=4, 이득 없음.
 */
const SCENES = [
  {
    label: "원래 천×천 표",
    summary: "1,000,000개",
    note: "입력과 출력이 각각 천 칸이면 표 하나에 숫자 백만 개를 저장합니다. 정사각형 한 변이 1,000칸입니다.",
  },
  {
    label: "B와 C로 나눠 저장",
    summary: "10×(1,000+1,000) = 20,000개",
    note: "k=10(가정)이면 B=UₖΣₖ는 1,000×10, C=Vₖᵀ는 10×1,000입니다. 같은 축척으로 그리면 가는 띠 두 개이며 합쳐 2만 개, 원래의 1/50입니다.",
  },
  {
    label: "2×2에서 k=1",
    summary: "4개 → 2 + 2 = 4개",
    note: "이번 A에서 큰 방향 하나만 남겨도 B는 2×1, C는 1×2라 숫자 네 개를 저장합니다. 원래 표도 네 개이므로 저장 이득이 없습니다. k(m+n)<mn인지 따로 확인해야 합니다.",
  },
] as const;

const S = 0.15; // 칸 하나당 px (천×천 장면)
const BIG = 1000 * S;
const THIN = 10 * S; // 1.5px — 같은 축척을 지키려 키우지 않음
const CELL = 26; // 2×2 장면의 칸 크기

function Cells({ rows, cols, fill, stroke }: { rows: number; cols: number; fill: string; stroke: string }) {
  return (
    <svg width={cols * CELL + 2} height={rows * CELL + 2} aria-hidden>
      {Array.from({ length: rows * cols }, (_, i) => (
        <rect key={i} x={1 + (i % cols) * CELL} y={1 + Math.floor(i / cols) * CELL} width={CELL} height={CELL} fill={fill} stroke={stroke} strokeWidth={1} />
      ))}
    </svg>
  );
}

export default function FactorStorageViz() {
  return (
    <SceneShell
      eyebrow="근사를 저장하는 모양"
      title="천×천 표를 k=10인 띠 두 개로 바꾸면 저장량이 1/50이 됩니다"
      description="도형의 가로·세로는 표의 열·행 수에 비례합니다. 처음 두 장면은 같은 축척입니다."
      ariaLabel="원래 행렬과 두 인수 행렬의 저장 크기 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="flex h-[200px] min-w-0 items-center justify-center gap-6">
          {active === 0 && (
            <div className="flex flex-col items-center gap-2">
              <svg width={BIG + 2} height={BIG + 2} aria-hidden>
                <rect x={1} y={1} width={BIG} height={BIG} fill="#e2e8f0" stroke="#64748b" strokeWidth={1} />
              </svg>
              <span className="font-mono text-xs">A 1,000×1,000</span>
            </div>
          )}
          {active === 1 && (
            <>
              <div className="flex flex-col items-center gap-2">
                <svg width={THIN + 2} height={BIG + 2} aria-hidden>
                  <rect x={1} y={1} width={THIN} height={BIG} fill="#bfdbfe" stroke="#2563eb" strokeWidth={1} />
                </svg>
                <span className="font-mono text-xs">B 1,000×10</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <svg width={BIG + 2} height={THIN + 2} aria-hidden>
                  <rect x={1} y={1} width={BIG} height={THIN} fill="#fde68a" stroke="#d97706" strokeWidth={1} />
                </svg>
                <span className="font-mono text-xs">C 10×1,000</span>
              </div>
            </>
          )}
          {active === 2 && (
            <>
              <div className="flex flex-col items-center gap-2">
                <Cells rows={2} cols={2} fill="#e2e8f0" stroke="#64748b" />
                <span className="font-mono text-xs">A 2×2 · 4개</span>
              </div>
              <span className="text-sm text-muted-foreground">→</span>
              <div className="flex flex-col items-center gap-2">
                <Cells rows={2} cols={1} fill="#bfdbfe" stroke="#2563eb" />
                <span className="font-mono text-xs">B 2×1</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Cells rows={1} cols={2} fill="#fde68a" stroke="#d97706" />
                <span className="font-mono text-xs">C 1×2</span>
              </div>
            </>
          )}
        </div>
      )}
    />
  );
}
