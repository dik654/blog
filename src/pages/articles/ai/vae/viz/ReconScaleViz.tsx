import SceneShell from "./SceneShell";

/**
 * 본문 대응: #vae-loss — likelihood·reduction·variance 설정이 KL과의 상대 scale을 바꾼다.
 * 첫 Viz의 x=[1,0], decoder 값 [0.8,0.3], KL≈0.94를 재사용.
 * Bernoulli: −log 0.8 − log 0.7 ≈ 0.58. Gaussian: (0.2²+0.3²)/(2s²) = 0.13/(2s²), 상수 C 제외.
 * mean reduction은 복원 항만 관측 차원 2로 나누고 KL은 그대로 둔 경우(가정).
 */
const X: readonly number[] = [1, 0];
const OUT: readonly number[] = [0.8, 0.3];
const KL = 0.94;
const DIMS = X.length;
const BCE = -X.reduce<number>((sum, x, i) => sum + x * Math.log(OUT[i]) + (1 - x) * Math.log(1 - OUT[i]), 0);
const SQUARED = X.reduce<number>((sum, x, i) => sum + (x - OUT[i]) ** 2, 0);
const gauss = (s2: number) => SQUARED / (2 * s2);

const round2 = (value: number) => (Math.round(value * 1000) / 1000).toString();

const SCENES = [
  { label: "Bernoulli · 합", summary: "0.58 + 0.94 = 1.52", kind: "Bernoulli", reduction: "sum", variance: "−", recon: BCE, expr: "−log 0.8 − log 0.7", note: "복원 비용 −log p(x|z)를 이진 관측의 likelihood로 계산해 두 위치를 더했습니다. 글 첫 Viz의 숫자 그대로입니다." },
  { label: "Bernoulli · 평균", summary: "0.29 + 0.94 = 1.23", kind: "Bernoulli", reduction: "mean", variance: "−", recon: BCE / DIMS, expr: "(−log 0.8 − log 0.7) ÷ 2", note: "합을 평균으로 바꾸면 복원 항이 관측 차원 수 2로 나뉩니다. KL은 그대로 둔 구현을 가정했으므로 KL의 비중이 커집니다." },
  { label: "Gaussian · s²=1", summary: "0.065 + 0.94 = 1.005", kind: "Gaussian", reduction: "sum", variance: "s²=1", recon: gauss(1), expr: "0.13 ÷ (2×1)", note: "연속값으로 보고 분산 s²를 고정하면 복원 항은 제곱 오차에 1/(2s²)를 곱한 scaled MSE 형태입니다. 제곱 오차 합은 0.2²+0.3²=0.13이고 상수항 C는 뺐습니다." },
  { label: "Gaussian · s²=0.1", summary: "0.65 + 0.94 = 1.59", kind: "Gaussian", reduction: "sum", variance: "s²=0.1", recon: gauss(0.1), expr: "0.13 ÷ (2×0.1)", note: "제곱 오차는 0.13 그대로인데 s²를 줄이니 계수 1/(2s²)가 커져 복원 항이 10배가 됩니다. 상수 C는 s²마다 값이 달라지지만 여기서는 계속 뺐습니다." },
  { label: "Gaussian · s²=0.01", summary: "6.5 + 0.94 = 7.44", kind: "Gaussian", reduction: "sum", variance: "s²=0.01", recon: gauss(0.01), expr: "0.13 ÷ (2×0.01)", note: "복원 항이 KL을 크게 앞섭니다. 같은 관측·예측·KL인데 C를 뺀 합계가 1.005에서 7.44까지 움직이므로 구현이 다르면 숫자를 그대로 비교할 수 없습니다." },
] as const;

const RECON = "#2563eb";
const KLCOLOR = "#d97706";

function Setting({ name, value }: { name: string; value: string }) {
  return (
    <div className="min-w-0 border-l border-border pl-2">
      <span className="block text-[11px] leading-4 text-muted-foreground">{name}</span>
      <strong className="block break-keep font-mono text-xs leading-5 sm:text-sm">{value}</strong>
    </div>
  );
}

export default function ReconScaleViz() {
  return (
    <SceneShell
      eyebrow="복원 비용과 KL의 비중"
      title="같은 예측도 설정에 따라 KL과의 비중이 달라집니다"
      description="글 첫 Viz의 x=[1,0], decoder 값 [0.8, 0.3], KL 약 0.94는 그대로 두고 복원 항의 계산 설정만 바꿉니다(가정). 띠는 합계에서 두 항이 차지하는 비율입니다."
      ariaLabel="likelihood, reduction, variance 설정에 따라 복원 비용과 KL의 비율이 달라지는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const total = scene.recon + KL;
        const share = (scene.recon / total) * 100;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-2">
              <Setting name="likelihood" value={scene.kind} />
              <Setting name="reduction" value={scene.reduction} />
              <Setting name="고정 분산" value={scene.variance} />
            </div>
            <p className="mt-4 break-keep font-mono text-xs leading-5 text-muted-foreground sm:text-sm">
              복원 = {scene.expr} ≈ <strong className="text-foreground">{round2(scene.recon)}</strong>{scene.kind === "Gaussian" && " (C 제외)"}
            </p>
            <div className="mt-3 flex h-8 w-full overflow-hidden rounded-md border border-border" role="img" aria-label={`복원 항 ${Math.round(share)}퍼센트, KL ${100 - Math.round(share)}퍼센트`}>
              <div className="h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${share}%`, backgroundColor: RECON }} />
              <div className="h-full flex-1" style={{ backgroundColor: KLCOLOR }} />
            </div>
            <div className="mt-2 flex justify-between gap-3 text-xs leading-5 sm:text-sm">
              <span><span className="mr-1 inline-block h-2 w-2 rounded-sm align-middle" style={{ backgroundColor: RECON }} />복원 <strong className="font-mono">{Math.round(share)}%</strong></span>
              <span><span className="mr-1 inline-block h-2 w-2 rounded-sm align-middle" style={{ backgroundColor: KLCOLOR }} />KL <strong className="font-mono">{100 - Math.round(share)}%</strong></span>
            </div>
          </div>
        );
      }}
    />
  );
}
