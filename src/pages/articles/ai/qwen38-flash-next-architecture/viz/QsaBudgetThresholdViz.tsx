import SceneShell from "./SceneShell";

/**
 * 본문 대응: QsaIndex.tsx #qsa-budget — 예산 2048 ÷ 압축비 4 = 블록 512개.
 * 완전한 블록 수 n = 문맥 ÷ 4, 선택 수 = min(512, n).
 * 2,000 → 500개 전부, 2,048 → 512개 전부(경계), 8,000 → 2,000개 중 512, 262,144 → 65,536개 중 512.
 * 네 길이 모두 4로 나누어떨어지므로 꼬리는 0개다.
 */
const BUDGET_BLOCKS = 512;
const RATIO = 4;

const SCENES = [
  { label: "2,000 토큰", context: 2000, summary: "블록 500개 → 전부 선택", note: "완전한 블록이 500개라 예산 512개에 못 미칩니다. 점수를 매겨도 버리는 블록이 없으므로 모든 위치를 읽습니다." },
  { label: "2,048 토큰", context: 2048, summary: "블록 512개 = 예산", note: "2,048 ÷ 4 = 512로 블록 수가 예산과 정확히 같습니다. 여기까지는 전부 선택됩니다. 완전한 블록이 513개가 되는 2,052 토큰부터 고르지 않는 블록이 생깁니다." },
  { label: "8,000 토큰", context: 8000, summary: "2,000개 중 512개 · 25.6%", note: "완전한 블록 2,000개 가운데 점수 상위 512개만 남습니다. 읽는 위치는 512 × 4 = 2,048개로, 문맥의 25.6%입니다." },
  { label: "262,144 토큰", context: 262144, summary: "65,536개 중 512개 · 약 0.78%", note: "문맥이 최대 길이까지 늘어도 고르는 블록은 512개 그대로입니다. 블록 65,536개 중 약 0.78%만 원본 K/V를 읽습니다." },
] as const;

const KEEP = "#10b981";
const DROP = "#94a3b8";
const CAP = "#d97706";

export default function QsaBudgetThresholdViz() {
  return (
    <SceneShell
      eyebrow="블록 예산의 문턱"
      title="블록이 512개를 넘는 순간부터 고르지 않는 블록이 생깁니다"
      description="위 막대는 문맥 전체의 완전한 블록(4토큰 묶음)을 폭 100%로 놓고 고른 몫을 초록으로 칠했습니다. 아래 막대는 고른 블록 수를 예산 512개 눈금 위에 놓았습니다."
      note="네 길이는 모두 4로 나누어떨어져 아직 블록을 이루지 못한 꼬리 토큰이 없습니다. 꼬리가 있으면 최대 3개가 점수와 무관하게 더해집니다."
      ariaLabel="문맥 길이 2,000, 2,048, 8,000, 262,144 토큰에서 완전한 블록 수와 선택되는 블록 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const blocks = scene.context / RATIO;
        const picked = Math.min(BUDGET_BLOCKS, blocks);
        const share = (picked / blocks) * 100;
        const capShare = (picked / BUDGET_BLOCKS) * 100;
        return (
          <div className="min-w-0 space-y-5 text-xs sm:text-sm">
            <div>
              <div className="mb-1.5 flex flex-wrap justify-between gap-x-3 font-semibold">
                <span>완전한 블록 {blocks.toLocaleString("en-US")}개 = 100%</span>
                <span className="font-mono" style={{ color: KEEP }}>고름 {share < 1 ? share.toFixed(2) : share.toFixed(1)}%</span>
              </div>
              <div className="relative h-6 overflow-hidden rounded-sm border" style={{ borderColor: DROP, backgroundColor: "#e2e8f0" }}>
                <div className="h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${Math.max(share, 0.6)}%`, backgroundColor: KEEP }} />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex flex-wrap justify-between gap-x-3 font-semibold">
                <span>고른 블록 수</span>
                <span className="font-mono">{picked.toLocaleString("en-US")} / 예산 {BUDGET_BLOCKS}</span>
              </div>
              <div className="relative h-6 rounded-sm border border-border">
                <div className="h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${capShare}%`, backgroundColor: KEEP, opacity: 0.7 }} />
                <div className="absolute inset-y-[-4px] right-0 border-r" style={{ borderColor: CAP }} />
              </div>
              <p className="mt-1.5 text-right font-mono" style={{ color: CAP }}>예산 512블록 = 2,048토큰</p>
            </div>
          </div>
        );
      }}
    />
  );
}
