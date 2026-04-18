import WandBFlowViz from './viz/WandBFlowViz';

export default function WandB() {
  return (
    <section id="wandb" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Weights & Biases 실전</h2>
      <div className="not-prose mb-8"><WandBFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">wandb.init — 실험 세션 시작</h3>
        <p>
          <code>wandb.init(project="my-project", config=config)</code> 호출 시 고유 <strong>run</strong>이 생성된다<br />
          <code>project</code> — 실험을 묶는 단위(프로젝트명), 같은 프로젝트 안의 run끼리 비교 가능<br />
          <code>config</code> — 딕셔너리로 전달한 하이퍼파라미터가 자동 저장, 이후 대시보드에서 필터/정렬 기준이 된다<br />
          <code>name</code> — run 이름을 명시하지 않으면 자동 생성(예: "bumpy-sunset-42"), 명시적 네이밍 권장
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">wandb.log — 실시간 메트릭 전송</h3>
        <p>
          <code>{'wandb.log({"loss": loss, "accuracy": acc})'}</code> — 매 step/epoch마다 호출<br />
          서버로 실시간 전송되어 대시보드 차트가 자동 갱신 — 학습 중에도 추세 확인 가능<br />
          <code>step</code> 파라미터를 생략하면 자동 증가, 커스텀 x축도 지정 가능<br />
          이미지, 히스토그램, 테이블 등 다양한 미디어도 <code>wandb.log</code>로 기록
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">wandb.config — 하이퍼파라미터 관리</h3>
        <p>
          <code>wandb.config.learning_rate = 0.001</code> — 개별 설정도 dot notation으로 추가 가능<br />
          config는 run 생성 시 고정되며, 이후 대시보드에서 "lr별 성능 비교" 같은 분석의 기반<br />
          argparse와 자동 연동 — <code>wandb.init(config=args)</code>로 CLI 인자를 한 번에 기록
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Sweep — 자동 하이퍼파라미터 탐색</h3>
        <p>
          <strong>Sweep</strong> — W&B가 제공하는 자동 하이퍼파라미터 튜닝 기능<br />
          YAML 설정에 탐색 범위(lr: 0.0001~0.01, batch: [16, 32, 64])를 정의하면 자동으로 조합을 생성<br />
          <strong>Bayesian</strong> 전략이 기본 권장 — 이전 결과를 바탕으로 유망한 영역을 집중 탐색<br />
          <strong>Random</strong> — 균등 샘플링, 탐색 공간이 넓을 때 초기 탐색용<br />
          <strong>Grid</strong> — 모든 조합 시도, 작은 탐색 공간에서 완전 탐색<br />
          병렬 에이전트를 여러 GPU/머신에 띄워 동시 탐색 가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">대시보드 협업</h3>
        <p>
          팀원 모두가 하나의 프로젝트에 실험을 기록하면 대시보드에서 전체 실험을 한 눈에 비교<br />
          <strong>태그</strong>로 실험 분류(baseline, ablation, final), <strong>그룹</strong>으로 관련 run 묶기<br />
          <strong>Report</strong> 기능으로 실험 결과를 문서화 — 차트와 분석을 팀/외부와 공유<br />
          무료 플랜으로 개인 프로젝트에 충분, 팀 플랜은 프라이빗 프로젝트와 협업 기능 제공
        </p>
      </div>
    </section>
  );
}
