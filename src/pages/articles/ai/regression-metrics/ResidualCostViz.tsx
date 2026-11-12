import SceneStage from "./SceneStage";

/**
 * 본문 대응: #residual-penalty — 실제 지연 [0,0,0,100]분에 예측 0분과 25분을 놓고
 * 잔차 → 절댓값·제곱 비용 → 평균·제곱근을 차례로 쌓는다.
 * 0분: |r| 합 100 → MAE 25, r² 합 10,000 → RMSE 50.
 * 25분: |r| 합 150 → MAE 37.5, r² 합 7,500 → MSE 1,875 → RMSE ≈ 43.30.
 */
const ACTUAL: readonly number[] = [0, 0, 0, 100];
const PREDICTIONS: readonly number[] = [0, 25];

const rows = PREDICTIONS.map((prediction) => {
  const residuals = ACTUAL.map((y) => y - prediction);
  const absolute = residuals.map((r) => Math.abs(r));
  const squared = residuals.map((r) => r * r);
  const absSum = absolute.reduce<number>((sum, value) => sum + value, 0);
  const sqSum = squared.reduce<number>((sum, value) => sum + value, 0);
  return {
    prediction,
    residuals,
    absolute,
    squared,
    absSum,
    sqSum,
    mae: absSum / ACTUAL.length,
    mse: sqSum / ACTUAL.length,
    rmse: Math.sqrt(sqSum / ACTUAL.length),
  };
});

const ABS_SCALE = Math.max(...rows.map((row) => row.absSum));
const SQ_SCALE = Math.max(...rows.map((row) => row.sqSum));
const SEGMENT_COLORS: readonly string[] = ["#64748b", "#64748b", "#64748b", "#d97706"];

const SCENES = [
  {
    label: "잔차를 만듭니다",
    summary: "잔차 = 실제값 − 예측값",
    note: "같은 네 배송(D1~D4)에 예측 0분과 25분을 놓습니다. 0분이면 앞의 세 건은 정확히 맞고 D4만 +100분 틀립니다. 25분이면 네 건 모두 틀리지만 가장 큰 잔차는 +75분으로 줄어듭니다.",
  },
  {
    label: "절댓값 비용을 쌓습니다",
    summary: "합 100 vs 150",
    note: "부호만 떼고 더합니다. 예측 0분의 합은 D4 한 건의 100뿐이고, 25분은 25+25+25+75=150입니다. 25분에서 D4가 차지하는 몫은 75÷150=50%입니다.",
  },
  {
    label: "제곱 비용을 쌓습니다",
    summary: "합 10,000 vs 7,500",
    note: "같은 잔차를 제곱하면 100분짜리 오차 한 건이 10,000이 됩니다. 25분은 625×3+5,625=7,500이라 이번에는 25분 쪽 막대가 더 짧습니다. 25분에서도 D4의 몫은 5,625÷7,500=75%로, 절댓값 비용의 50%보다 큽니다.",
  },
  {
    label: "평균 내고 단위를 되돌립니다",
    summary: "MAE → 0분 · RMSE → 25분",
    note: "절댓값 합을 네 건으로 나누면 MAE, 제곱 합을 네 건으로 나눈 뒤 제곱근을 취하면 RMSE입니다. MAE는 25 대 37.5로 0분을, RMSE는 50 대 약 43.30으로 25분을 더 좋게 봅니다.",
  },
] as const;

const fmt = (value: number) => value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
const signed = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : "0");

function StackedBar({ parts, scale }: { parts: readonly number[]; scale: number }) {
  return (
    <div className="flex h-5 min-w-0 overflow-hidden rounded-sm bg-muted/40">
      {parts.map((value, index) =>
        value === 0 ? null : (
          <div
            key={index}
            className="h-full border-r border-background last:border-r-0"
            style={{ width: `${(value / scale) * 100}%`, backgroundColor: SEGMENT_COLORS[index] }}
            title={`D${index + 1}: ${fmt(value)}`}
          />
        ),
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#64748b" }} />
        D1~D3 (실제 0분)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#d97706" }} />
        D4 (실제 100분)
      </span>
    </div>
  );
}

export default function ResidualCostViz() {
  return (
    <SceneStage
      eyebrow="계산을 한 단계씩"
      title="같은 잔차에 붙인 비용이 승자를 바꿉니다"
      description="실제 지연 0·0·0·100분(설명용 가정)에 예측 0분과 25분을 놓고, 잔차에서 MAE·RMSE까지 네 단계로 쌓습니다. 막대 칸 하나가 배송 한 건의 비용입니다."
      ariaLabel="예측 0분과 25분의 잔차, 절댓값 비용, 제곱 비용, MAE와 RMSE 계산"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          {rows.map((row, rowIndex) => (
            <div key={row.prediction} className="min-w-0 border-t border-border pt-3">
              <p className="text-sm font-bold">예측 {row.prediction}분</p>
              {active === 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {row.residuals.map((r, index) => (
                    <div
                      key={index}
                      className={`rounded-md border px-1 py-2 text-center ${index === 3 ? "border-amber-600" : "border-border"}`}
                    >
                      <span className="block font-mono text-[11px] font-bold text-muted-foreground">D{index + 1}</span>
                      <span className="block text-[11px] text-muted-foreground">실제 {ACTUAL[index]}</span>
                      <strong className="mt-1 block font-mono text-sm">{signed(r)}</strong>
                    </div>
                  ))}
                </div>
              )}
              {active === 1 && (
                <div className="mt-2 space-y-1.5">
                  <StackedBar parts={row.absolute} scale={ABS_SCALE} />
                  <p className="font-mono text-xs text-muted-foreground">
                    {row.absolute.join(" + ")} = <strong className="text-foreground">{fmt(row.absSum)}</strong>
                  </p>
                </div>
              )}
              {active === 2 && (
                <div className="mt-2 space-y-1.5">
                  <StackedBar parts={row.squared} scale={SQ_SCALE} />
                  <p className="font-mono text-xs text-muted-foreground">
                    {row.squared.map(fmt).join(" + ")} = <strong className="text-foreground">{fmt(row.sqSum)}</strong>
                  </p>
                </div>
              )}
              {active === 3 && (
                <div className="mt-2 grid gap-2 font-mono text-xs sm:grid-cols-2">
                  <p className={`rounded-md border px-3 py-2 ${rowIndex === 0 ? "border-primary" : "border-border"}`}>
                    MAE = {fmt(row.absSum)} ÷ 4 = <strong>{fmt(row.mae)}</strong>
                    {rowIndex === 0 && <span className="ml-2 font-sans font-bold text-primary">더 작음</span>}
                  </p>
                  <p className={`rounded-md border px-3 py-2 ${rowIndex === 1 ? "border-primary" : "border-border"}`}>
                    RMSE = √({fmt(row.sqSum)} ÷ 4) = √{fmt(row.mse)} {Number.isInteger(row.rmse) ? "=" : "≈"}{" "}
                    <strong>{Number.isInteger(row.rmse) ? fmt(row.rmse) : row.rmse.toFixed(2)}</strong>
                    {rowIndex === 1 && <span className="ml-2 font-sans font-bold text-primary">더 작음</span>}
                  </p>
                </div>
              )}
            </div>
          ))}
          {(active === 1 || active === 2) && <Legend />}
        </div>
      )}
    />
  );
}
