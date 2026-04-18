import MLflowArchViz from './viz/MLflowArchViz';

export default function MLflow() {
  return (
    <section id="mlflow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MLflow: 셀프 호스팅 추적</h2>
      <div className="not-prose mb-8"><MLflowArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">MLflow Tracking — 기본 API</h3>
        <p>
          <code>mlflow.start_run()</code>으로 실험 세션을 시작하면 run_id가 자동 생성된다<br />
          <code>mlflow.log_param("lr", 0.001)</code> — 하이퍼파라미터를 key-value로 기록<br />
          <code>mlflow.log_metric("val_loss", 0.23, step=10)</code> — 메트릭을 step과 함께 저장<br />
          <code>mlflow.log_artifact("model.pt")</code> — 파일을 Artifact Store에 보관<br />
          with문과 함께 사용하면 <code>mlflow.end_run()</code> 자동 호출로 세션이 깔끔하게 종료
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Autolog — 자동 기록</h3>
        <p>
          <code>mlflow.pytorch.autolog()</code> — PyTorch 학습 루프의 파라미터, 메트릭, 모델을 자동 기록<br />
          scikit-learn, XGBoost, LightGBM, TensorFlow 등 주요 프레임워크 지원<br />
          수동 <code>log_param/log_metric</code> 없이도 기본 추적이 가능하여 기존 코드 수정을 최소화
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Model Registry — 모델 생명주기</h3>
        <p>
          학습된 모델을 <strong>Model Registry</strong>에 등록하면 버전 관리와 배포 단계 관리가 가능<br />
          <strong>None → Staging → Production → Archived</strong> — 4단계로 모델 상태를 추적<br />
          <code>mlflow.register_model()</code>로 등록, UI 또는 API로 단계 전환<br />
          같은 모델 이름으로 여러 버전을 등록하면 v1, v2, v3...으로 자동 관리<br />
          Production 태그가 붙은 모델을 서빙 시스템이 자동으로 로드하는 CI/CD 파이프라인 구축 가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Artifact 관리</h3>
        <p>
          <strong>Artifact Store</strong> — 모델 체크포인트, 전처리 파이프라인, 데이터 스냅샷을 저장하는 계층<br />
          로컬 파일시스템, S3, GCS, Azure Blob 중 선택 가능<br />
          각 run에 연결된 artifact는 UI에서 탐색/다운로드 가능<br />
          <code>mlflow.log_artifact("./outputs/confusion_matrix.png")</code> — 평가 시각화도 보관
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">셀프 호스팅 구축</h3>
        <p>
          <strong>Docker Compose</strong>로 3개 컨테이너(MLflow Server + PostgreSQL + MinIO)를 한 번에 배포<br />
          <strong>Backend Store</strong>(PostgreSQL) — 파라미터, 메트릭, run 메타데이터 저장<br />
          <strong>Artifact Store</strong>(MinIO/S3) — 모델 파일, 이미지 등 대용량 바이너리 저장<br />
          사내 VPN 안에서 운영하면 데이터가 외부로 나가지 않아 보안 요구사항 충족
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">W&B vs MLflow — 판단 기준</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기준</th>
                <th className="border border-border px-3 py-2 text-left">W&B</th>
                <th className="border border-border px-3 py-2 text-left">MLflow</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">호스팅</td>
                <td className="border border-border px-3 py-2">SaaS (관리 불필요)</td>
                <td className="border border-border px-3 py-2">셀프 호스팅 (직접 운영)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">비용</td>
                <td className="border border-border px-3 py-2">무료(개인) / 유료(팀)</td>
                <td className="border border-border px-3 py-2">무료 OSS + 서버 비용</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">대시보드</td>
                <td className="border border-border px-3 py-2">풍부한 시각화, Report</td>
                <td className="border border-border px-3 py-2">기본 UI (커스텀 확장)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">튜닝</td>
                <td className="border border-border px-3 py-2">내장 Sweep</td>
                <td className="border border-border px-3 py-2">Optuna/Ray Tune 연동</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">데이터 보안</td>
                <td className="border border-border px-3 py-2">클라우드 저장</td>
                <td className="border border-border px-3 py-2">사내 서버 보관 가능</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">추천 환경</td>
                <td className="border border-border px-3 py-2">대회, 스타트업, 연구</td>
                <td className="border border-border px-3 py-2">기업 MLOps, 규제 산업</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
