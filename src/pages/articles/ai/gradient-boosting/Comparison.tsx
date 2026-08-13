import GBMComparisonViz from "./viz/GBMComparisonViz";

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">세 구현은 같은 이름의 parameter가 아니라 같은 실험 예산으로 비교합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          “큰 데이터는 LightGBM”, “category가 많으면 CatBoost”, “먼저 XGBoost”는
          후보를 줄이는 heuristic일 뿐 결과가 아닙니다. Tree growth, binning,
          category 처리와 default regularization이 달라 depth 8이나 1,000 rounds를
          그대로 맞춰도 같은 model capacity가 되지 않습니다. 공통 constraint와
          search budget을 먼저 정하고 각 library parameter로 번역해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8"><GBMComparisonViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>최소 비교 계약</h3>
        <p>
          동일한 group·time split과 leakage-free feature artifact, 동일 metric과
          early-stopping patience, 같은 tuning trial 또는 wall-clock budget, 같은
          hardware와 thread 수를 고정합니다. Fold·seed 평균뿐 아니라 분산,
          worst-group 성능, calibration, peak memory, training time, batch와
          single-row latency를 기록합니다. 최종 test는 library 선택과 tuning이
          끝날 때까지 열지 않습니다.
        </p>
        <p>
          여러 GBM을 ensemble할 때도 out-of-fold prediction의 error correlation을
          먼저 봅니다. 같은 sample에서 같이 틀리는 model을 더하면 복잡성만 늘 수
          있습니다. Blend gain이 serving latency·artifact 수·monitoring 비용을
          정당화할 때만 production 후보로 승인합니다.
        </p>
      </div>
    </section>
  );
}
