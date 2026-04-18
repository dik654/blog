import ExperimentChaosViz from './viz/ExperimentChaosViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실험 관리가 왜 필수인가</h2>
      <div className="not-prose mb-8"><ExperimentChaosViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ML 실험 관리</strong>(Experiment Tracking) — 모델 학습 과정에서 발생하는 모든 메타데이터를 체계적으로 기록하고 비교하는 체계<br />
          하이퍼파라미터, 메트릭, 코드 버전, 환경 정보를 자동으로 수집하여 "어떤 조건에서 최적 결과가 나왔는가"를 추적
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">기록 없는 실험의 문제</h3>
        <p>
          100번의 실험 후 "어제 결과가 더 좋았는데 뭘 바꿨더라?" — 기록 없이는 답할 수 없다<br />
          학습률을 0.001에서 0.0003으로 바꿨는지, 배치 크기를 32에서 64로 올렸는지, 드롭아웃을 추가했는지 기억에 의존하면 실험이 아니라 도박<br />
          노트북 셀 순서, 전역 변수 오염, 중간 결과 덮어쓰기 — Jupyter 환경의 비결정성이 문제를 악화
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">대회에서의 실험 관리</h3>
        <p>
          <strong>Kaggle/Dacon</strong> 대회에서 상위 팀은 예외 없이 실험 관리 도구를 사용한다<br />
          수백 번의 실험에서 리더보드 점수와 파라미터 조합의 관계를 파악하려면 체계적 기록이 전제<br />
          앙상블 구성 시 각 모델의 정확한 설정을 재현할 수 없으면 조합 최적화가 불가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">실험 관리의 4가지 축</h3>
        <ul>
          <li><strong>파라미터 추적</strong> &mdash; 하이퍼파라미터(lr, batch, optimizer)와 모델 구조(layers, units)를 key-value로 기록</li>
          <li><strong>메트릭 추적</strong> &mdash; loss, accuracy, F1 등 학습/검증 메트릭을 step/epoch 단위로 시계열 저장</li>
          <li><strong>아티팩트 관리</strong> &mdash; 모델 체크포인트, 전처리 파이프라인, 데이터 스냅샷을 버전별로 보관</li>
          <li><strong>재현성 확보</strong> &mdash; 시드, 환경, 코드 버전을 기록하여 동일 결과를 다시 만들 수 있게 보장</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">도구 선택 기준</h3>
        <p>
          <strong>Weights &amp; Biases</strong>(W&amp;B) — SaaS 기반, 풍부한 대시보드와 Sweep 기능, 팀 협업에 최적<br />
          <strong>MLflow</strong> — 오픈소스, 셀프 호스팅 가능, 데이터 주권이 중요한 기업 환경에 적합<br />
          두 도구 모두 핵심 기능(파라미터·메트릭·아티팩트 추적)은 동일하며, 운영 환경과 보안 요구사항에 따라 선택
        </p>
      </div>
    </section>
  );
}
