import { BeginnerBridge, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';
import { CompetitionContractLab } from './practical-strategy/viz/CompetitionEvidenceLabs';

export default function CompetitionWorkflowArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">대회는 모델 경주가 아니라 증거 설계다</h2>
        <BeginnerBridge title="모의고사 점수가 올라도 처음 보는 본시험에서 같은 점수가 나온다는 보장은 없다">
          Public leaderboard는 참가 중 일부 숨은 정답으로 자주 확인하는 점수판이고, private test는 마지막에만 드러나는 별도 시험이다. 점수판을 보며 방법을 계속 고르면 그 점수판 자체에 맞춰질 수 있으므로, 내부 검증이 미래 운영을 제대로 흉내 내는지가 먼저다.
        </BeginnerBridge>
        <QuestionLead
          question="Public leaderboard가 계속 오르는데 private test와 실제 운영에서 무너진다면, 무엇을 먼저 의심해야 할까?"
          answer="모델보다 먼저 target 시점, metric, split, fit boundary와 반복 제출 과정이 숨은 test를 제대로 흉내 냈는지 본다. 좋은 대회 workflow는 최고 점수를 찾는 순서가 아니라 틀린 증거를 조기에 버리는 순서다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            결제 사기를 예로 들자. 양성은 0.8%이고 같은 고객이 여러 달 등장하며, train은 1~5월,
            private test는 6월이다. 실제 운영팀은 하루 500건만 검토할 수 있다. 이때 random
            stratified 5-fold가 class ratio를 보존하더라도 같은 고객과 미래 통계가 fold 사이를
            건너면 0.982라는 AUC는 배포 성능의 증거가 아니다.
          </p>
          <p>
            그래서 시작점은 algorithm이 아니라 <strong>prediction contract</strong>다. 한 행이
            결제인지 고객인지, target이 언제 확정되는지, prediction 시점에 어떤 정보가 실제로
            존재하는지, 점수가 어떤 행동을 바꾸는지를 먼저 적는다. 이 계약이 split과 metric을
            결정하고, 그 뒤에야 baseline과 model iteration이 의미를 가진다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Prediction cutoff', meaning: '예측을 내리는 기준 시각', why: '그 이후에 생긴 feature와 label을 입력에서 제거하는 경계다.' },
          { term: 'Fold', meaning: 'Train data를 여러 묶음으로 나눠 일부는 학습, 일부는 검증에 맡기는 단위', why: '각 행을 보지 않은 model prediction을 만들고 우연한 한 번의 split을 줄인다.' },
          { term: 'OOF prediction', meaning: '각 행을 학습에 쓰지 않은 fold model이 만든 예측', why: 'Metric, threshold와 ensemble을 같은 validation evidence 위에서 비교할 수 있다.' },
          { term: 'Leaderboard', meaning: '숨은 test 일부 또는 전체에 대한 외부 점수', why: '내부 validation을 대체하는 학습 신호가 아니라 제한된 audit로 써야 한다.' },
          { term: 'Run manifest', meaning: 'Data, split, code, config, seed와 artifact의 식별 장부', why: '점수 차이를 다시 만들고 원인을 추적하는 최소 단위다.' },
        ]} />
      </section>

      <section id="contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Metric보다 먼저 업무 계약을 쓴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “AUC를 최대화한다”는 문제 정의가 아니다. Fraud score가 높은 500건을 사람이 검토하고,
            놓친 사기의 비용이 오탐보다 30배 크며, 확률이 이후 reserve 금액까지 바꾼다고 써야 한다.
            그러면 global ranking, top-500 recall, probability calibration이 서로 다른 책임이라는
            사실이 드러난다.
          </p>
          <p>
            Dataset 생성 구조도 같은 계약에 들어간다. 같은 고객, 기기, 병원, 상품, 영상 원본이 여러
            행으로 반복되는가? Test가 미래인가? Label이 늦게 도착하는가? 이 질문은 metric이 아니라
            <strong>어떤 split이 새로운 세계를 모사하는지</strong>를 결정한다.
          </p>
        </div>
        <CompetitionContractLab />
        <Misconception>Metric이 split을 결정하는 것이 아니다. Metric은 prediction을 어떻게 채점할지 정하고, split은 관측이 어떤 과정으로 생기며 배포에서 무엇이 새로 등장하는지를 모사한다.</Misconception>
        <StopRule>행 단위, target timestamp, prediction cutoff, group/time 경계와 업무 행동을 한 문장으로 말할 수 없다면 EDA나 model tuning으로 넘어가지 않는다.</StopRule>
      </section>

      <section id="first-day" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">첫날 산출물은 notebook이 아니라 네 개의 계약이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li><strong>Problem contract</strong>: row unit, target availability, prediction cutoff, action, cost와 capacity를 고정한다.</li>
            <li><strong>Schema·leakage ledger</strong>: column type, timestamp, group ID, duplicate와 near duplicate를 기록한다. Near duplicate는 같은 원본에서 잘린 이미지처럼 사실상 같은 사건을 다시 본 행이다.</li>
            <li><strong>Metric bundle</strong>: primary score, guardrail, slice, uncertainty와 threshold policy를 함께 고정한다.</li>
            <li><strong>Split manifest</strong>: 모든 행의 fold, 제외 이유와 holdout 역할을 immutable artifact로 만든다.</li>
          </ol>
          <p>
            EDA는 예쁜 histogram을 만드는 단계가 아니라 이 네 계약을 깨뜨릴 반례를 찾는 단계다.
            예를 들어 6월에만 결측이 늘었다면 단순 imputation 문제가 아니라 data collection shift일
            수 있다. Customer aggregate가 validation month까지 포함한다면 강한 feature가 아니라
            future leakage다.
          </p>
          <p>
            데이터 진단을 더 깊게 해야 할 때는 <InternalLink slug="eda-workflow">EDA 경로</InternalLink>를
            연다. 다만 해당 글의 개입을 적용하기 전에 이 글에서 정한 split과 cutoff를 유지한다.
          </p>
        </div>
      </section>

      <section id="baseline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Baseline은 낮은 점수가 아니라 첫 측정 장치다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            좋은 baseline은 빠르고 단순하며 전체 inference path를 통과한다. Raw feature 몇 개,
            leakage-safe preprocessing, 하나의 검증된 split, 하나의 model, OOF prediction과
            submission 생성까지 한 명령으로 재실행되어야 한다. 여기서 얻은 값은 이길 대상이 아니라
            이후 변화의 원인을 비교할 기준점이다.
          </p>
          <p>
            Baseline 전에 target encoding, SMOTE, feature selection이나 probability calibrator를 전체
            dataset에 fit하면 이미 측정 장치가 오염된다. 모든 학습형 변환은 fold train에서 fit하고
            fold validation에는 transform만 적용한다. 이 경계가 불편하다면 pipeline abstraction으로
            고정한다.
          </p>
          <ul>
            <li>Dummy/constant predictor로 metric 방향과 submission parser를 검산한다.</li>
            <li>한 fold를 작은 sample로 끝까지 실행해 schema와 leakage assertion을 확인한다.</li>
            <li>OOF 행 수와 원본 행 수가 일치하고 각 행이 정확히 한 번 validation이었는지 검사한다.</li>
            <li>Public submission 전 local score와 artifact digest를 run manifest에 묶는다.</li>
          </ul>
        </div>
      </section>

      <section id="iteration" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 번에 한 claim만 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “모델을 XGBoost로 바꾸고 feature 30개를 추가하고 seed도 바꿨더니 +0.004”는 원인을
            알 수 없는 사건이다. 한 iteration은 가설, 변경점, 예상되는 slice, 고정된 비교 대상,
            결과와 다음 결정을 가진다. Score가 올라도 예상한 slice에서 오르지 않으면 가설은
            지지되지 않은 것이다.
          </p>
          <p>
            Fold mean만 보고 채택하지 않는다. Fold별 score, worst fold, group/time slice,
            calibration, inference cost와 반복 seed 변동을 본다. 특히 수십·수백 trial 뒤의 작은
            개선은 search가 validation noise를 외운 결과일 수 있다. 여기서 noise margin은 fold·seed를
            반복했을 때 생기는 흔들림보다 관측 개선이 충분히 큰지 보는 여유이며,
            <InternalLink slug="hyperparameter-tuning">제한된 탐색</InternalLink> 글에서 계산과 중단
            기준을 이어서 다룬다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['가설', '최근 7일 velocity feature가 6월 fraud를 먼저 구분한다.'],
            ['변경', 'Cutoff 이전 거래만 사용한 rolling aggregate 하나를 추가한다.'],
            ['예상', '기존 고객·최근 고액 거래 slice의 Recall@500이 오른다.'],
            ['증거', '같은 split manifest의 OOF, fold spread, latency와 feature audit.'],
            ['결정', 'Noise margin을 넘으면 유지하고 아니면 제거한다.'],
          ].map(([label, value]) => <div key={label} className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]"><strong className="text-xs">{label}</strong><p className="text-sm leading-relaxed text-muted-foreground">{value}</p></div>)}
        </div>
      </section>

      <section id="final" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">마감은 점수 합성이 아니라 evidence freeze다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            마지막에는 새 아이디어를 무한히 넣지 않는다. Split, feature schema, model member,
            ensemble weight, code revision, environment, inference order와 제출 파일 checksum을
            freeze한다. Public leaderboard에서 우연히 높은 파일을 고르는 대신 사전에 정한 local
            evidence와 diversity gate로 후보 수를 제한한다.
          </p>
          <p>
            이 경로의 다음 글은 <InternalLink slug="evaluation-metrics">평가 지표</InternalLink>다.
            업무 행동을 primary metric, guardrail, top-k와 calibration으로 분해한 뒤
            <InternalLink slug="cross-validation">교차 검증</InternalLink>에서 그 숫자를 믿을 수
            있는 split을 만든다. 이어서 <InternalLink slug="experiment-tracking">실험 관리</InternalLink>가
            evidence를 보존하고, <InternalLink slug="hyperparameter-tuning">제한된 탐색</InternalLink>과
            <InternalLink slug="ensemble-methods">OOF 앙상블</InternalLink>이 같은 계약 안에서 개선을
            검증한다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Prediction cutoff와 target availability를 기준으로 leakage를 판정할 수 있다.',
          'Metric과 split의 책임을 구분할 수 있다.',
          'Baseline을 end-to-end 측정 장치로 만들 수 있다.',
          'Public leaderboard를 반복 최적화 target이 아닌 external audit로 제한할 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          Split-before-preprocessing과 metric 정의는 아래 공식 문서에 근거한다. 네 계약, noise margin,
          evidence freeze와 release 순서는 이 경로가 여러 실무 원칙을 연결해 제안하는 engineering synthesis다.
        </p>
        <SourceNotes sources={[
          { label: 'scikit-learn · Common pitfalls', href: 'https://scikit-learn.org/stable/common_pitfalls.html', note: 'Preprocessing을 train에서만 fit하고 Pipeline으로 leakage를 줄이는 공식 지침.' },
          { label: 'scikit-learn · Model evaluation', href: 'https://scikit-learn.org/stable/modules/model_evaluation.html', note: 'Metric과 scoring API의 공식 범위. 대회 운영 계약은 본문의 engineering synthesis다.' },
        ]} />
      </section>
    </div>
  );
}
