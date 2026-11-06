import SceneShell from "./SceneShell";

/**
 * 본문 대응: #yarn-method — m(s)=0.1 ln s+1. s=8이면 m≈1.21, logit 배율 m²≈1.46.
 * logit 2, 1, 0.5, 0, −0.5는 가정. softmax는 배율 1, 1.46, 2.13(이중 적용 가정)에서 직접 계산한다.
 */
const M = 0.1 * Math.log(8) + 1;
const LOGITS = [2, 1, 0.5, 0, -0.5];
const softmax = (scale: number) => {
  const weights = LOGITS.map((logit) => Math.exp(logit * scale));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return weights.map((weight) => weight / total);
};

const SCENES = [
  { label: "보정 전", summary: "가장 큰 key 55.3%", side: "×1", extra: "×1", scale: 1, logit: "×1", note: "한 query가 비교하는 key 다섯 개입니다. 각 key의 logit을 softmax에 넣으면 막대의 비율이 나옵니다. softmax는 점수를 합이 100%인 비율로 바꾸는 함수입니다." },
  { label: "q와 k에 각각 1.21배", summary: "가장 큰 key 70.2%", side: "×1.21", extra: "×1", scale: M * M, logit: "×1.46", note: "s=8이면 0.1·ln 8+1≈1.21입니다. q와 k 양쪽에 곱하므로 내적에서 logit은 1.21²≈1.46배가 되고, 큰 값이 더 크게 벌어져 분포가 뾰족해집니다." },
  { label: "같은 값을 다시 곱하면", summary: "가장 큰 key 84.8%", side: "×1.21", extra: "×1.46", scale: M ** 4, logit: "×2.13", note: "라이브러리가 이미 반영한 scale에 사용자가 1.46을 한 번 더 곱했다고 놓은 경우입니다(가정). logit은 1.46²≈2.13배가 되어 의도한 보정보다 커집니다." },
] as const;

export default function AttentionScaleViz() {
  return (
    <SceneShell
      eyebrow="양쪽에 곱하면 제곱"
      title="q와 k에 1.21배씩 곱하면 attention 분포가 이만큼 뾰족해집니다"
      description="4K→32K(s=8) 예시이고, 1.21은 LLaMA 계열 실험에 맞춘 논문 권장식의 값입니다. logit은 softmax에 넣기 전의 점수입니다. 다섯 key의 logit 2, 1, 0.5, 0, −0.5는 모양을 보려고 고른 값이고(가정), 실제 분포는 모델과 입력마다 다릅니다."
      ariaLabel="logit 배율에 따른 softmax 분포 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const shares = softmax(scene.scale);
        return (
          <div className="mx-auto min-w-0 max-w-[560px]">
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-2 text-center text-xs sm:text-sm">
              <span className="rounded-lg border border-border bg-background px-1 py-2"><span className="block text-muted-foreground">q</span><span className="font-mono font-bold">{scene.side}</span></span>
              <span aria-hidden="true">×</span>
              <span className="rounded-lg border border-border bg-background px-1 py-2"><span className="block text-muted-foreground">k</span><span className="font-mono font-bold">{scene.side}</span></span>
              <span aria-hidden="true">×</span>
              <span className="rounded-lg border border-border bg-background px-1 py-2"><span className="block text-muted-foreground">사용자</span><span className="font-mono font-bold">{scene.extra}</span></span>
              <span aria-hidden="true">→</span>
              <span className="rounded-lg border border-primary/60 bg-background px-1 py-2"><span className="block text-muted-foreground">logit</span><span className="font-mono font-bold text-primary">{scene.logit}</span></span>
            </div>
            <div className="mt-4 space-y-2">
              {LOGITS.map((logit, index) => (
                <div key={logit} className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">logit {logit < 0 ? `−${Math.abs(logit)}` : logit}</span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${shares[index] * 100}%`, backgroundColor: index === 0 ? "#2563eb" : "#64748b" }} />
                  </div>
                  <span className="text-right font-mono">{(shares[index] * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
