import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaPair from './practical-data/FormulaPair';
import { DataContractLab, MissingnessShiftLab } from './practical-data/viz/DataEvidenceLabs';

export default function EdaWorkflowArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">EDA는 차트 모음이 아니라 데이터 감사다</h2>
        <BeginnerBridge title="같은 10분 영상을 1분씩 옮겨 자르면 서로 다른 장면처럼 보여도 대부분 겹친다">
          Window는 긴 시간 기록에서 잘라 낸 구간이다. 10분 window를 1분마다 만들면 이웃한 두 행은 9분을 공유한다. 표의 행 수가 많아져도 독립적으로 관찰한 현실의 수가 같은 만큼 늘어난 것은 아니다.
        </BeginnerBridge>
        <QuestionLead
          question="같은 설비에서 겹치는 10분 window를 1분마다 잘라 100만 행을 만들었다면, 100만 개의 독립 표본을 얻은 것일까?"
          answer="아니다. 행 수와 독립 정보량은 다르다. 한 행이 어떻게 생성됐는지, 같은 설비·원본·시간 구간이 어디서 반복되는지, target이 언제 확정되고 예측 시점에 무엇을 알 수 있었는지를 먼저 감사해야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            탐색적 데이터 분석(EDA, Exploratory Data Analysis)을 histogram, correlation heatmap,
            missing-value chart의 순서로 외우면 중요한 질문을 놓친다. 모델이 보게 될 표는 현실의
            사건을 잘라 만든 결과다. <strong>한 행의 의미, 시간 경계, 반복 단위와 수집 과정</strong>이
            틀리면 세련된 차트도 누출된 데이터를 더 확신 있게 보여 줄 뿐이다.
          </p>
          <p>
            이 글의 공개 예시는 설비 고장 예측이다. 한 행은 설비의 센서 window이고, 매일 자정에 다음
            24시간 고장을 예측한다. Label은 고장 보고가 승인된 뒤에야 확정된다. 먼저 “무슨 값이
            치우쳤는가”보다 “자정 시점에 이 값이 정말 존재했는가”를 묻는다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Row unit', meaning: '한 행이 나타내는 현실의 관측 단위', why: '거래, 고객, 설비 window를 혼동하면 duplicate와 split 의미가 달라진다.' },
          { term: 'Prediction cutoff', meaning: '예측 입력을 동결하는 기준 시각', why: '그 뒤에 생긴 feature와 label은 모델 입력이 될 수 없다.' },
          { term: 'Target availability', meaning: '정답을 신뢰할 수 있게 확정하는 시각', why: '고장·환불·재입원처럼 늦게 도착하는 label은 학습 cohort를 바꾼다.' },
          { term: 'Sentinel', meaning: '결측이나 오류를 대신 저장한 특별한 값', why: '-999, 0, 빈 문자열이 정상값과 충돌하는지 column별로 확인해야 한다.' },
          { term: 'Near duplicate', meaning: '문자열은 다르지만 같은 원본·사건을 거의 그대로 공유하는 표본', why: 'Train과 validation을 넘으면 현실보다 쉬운 재인식 문제가 된다.' },
          { term: 'Data lineage', meaning: 'Raw source에서 각 column과 label이 만들어진 경로', why: '누출을 column 이름이 아니라 생성 시점과 연산으로 추적하게 한다.' },
          { term: 'OOF prediction · out-of-fold 예측', meaning: '각 행을 학습에 쓰지 않은 fold model이 그 행에 만든 예측', why: '학습 데이터를 그대로 맞힌 낙관적 점수 대신, 보지 않은 행에서의 baseline과 slice 오류를 남긴다.' },
        ]} />
        <DataContractLab />
      </section>

      <section id="contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">첫 산출물은 prediction contract다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Contract에는 다섯 문장이 필요하다. “매일 자정에”, “가동 중인 설비 하나마다”, “이 시각
            이전의 센서·정비 기록만으로”, “다음 24시간 고장 확률을 예측해”, “하루 120건의 예방
            점검 순서를 정한다.” 이 문장만으로 row, population, cutoff, horizon, target과 action이
            드러난다.
          </p>
          <p>
            Target table도 별도 감사한다. 고장 시각과 보고 승인 시각이 다르면 어느 것을 label
            availability로 쓸지 정한다. 아직 결과가 도착하지 않은 최근 행은 관찰 시간이 부족해
            사건 여부를 모르는 right-censoring 상태다. 이 행을 음성으로 채우면 censoring을 무시하고
            확정 음성으로 취급해 거짓 음성을 만든다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Population', '어떤 설비가 어떤 시점에 예측 대상이 되는가?'],
            ['Unit', '한 행은 설비, 사건, 센서 측정, 시간 window 중 무엇인가?'],
            ['Cutoff', '입력 조회가 끝나는 정확한 timestamp는 언제인가?'],
            ['Target', '무슨 사건을 어느 horizon에서 양성으로 부르며 언제 확정되는가?'],
            ['Action', '점수가 경보, 순위, 비용, 점검 용량 중 무엇을 바꾸는가?'],
          ].map(([label, text]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <StopRule>Row unit, prediction cutoff와 target availability를 실제 timestamp column으로 표현하지 못하면 분포 분석으로 넘어가지 않는다.</StopRule>
      </section>

      <section id="schema" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Schema는 dtype가 아니라 의미 계약이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            `float64`라는 정보만으로 온도를 이해할 수 없다. 섭씨와 화씨가 섞였는지, 정상 음수가
            가능한지, `-999`가 결측인지 장치 오류인지, 값이 원시 측정인지 사후 집계인지 기록해야
            한다. ID처럼 보이는 숫자를 연속량으로 평균내거나, 우편번호를 ordinal 값으로 취급하는
            것도 dtype만 본 오류다.
          </p>
          <p>
            Raw snapshot은 수정하지 않고 digest와 추출 query를 고정한다. 정리된 table에는 원본
            column, 변환 규칙, 단위, 허용 범위, null/sentinel, timestamp, owner와 audit 결과를
            data dictionary로 남긴다. 중복은 exact key뿐 아니라 같은 원본 이미지, 겹치는 sensor
            window, 동일 고객·장치의 반복 사건까지 찾는다.
          </p>
          <ul>
            <li><strong>Schema test</strong>: type, unit, 범위, unique key, category vocabulary를 검사한다.</li>
            <li><strong>Population test</strong>: 제외·포함 조건과 날짜별 행 수 급변을 검사한다.</li>
            <li><strong>Identity test</strong>: group ID, source ID와 near-duplicate fingerprint를 검사한다.</li>
            <li><strong>Label test</strong>: 사건 시각, 확정 시각, horizon과 unresolved 행을 검사한다.</li>
          </ul>
        </div>
        <Misconception>“결측률 50% 이상이면 삭제” 같은 보편 규칙은 없다. 드문 검사 결과가 90% 비어 있어도 검사 시행 자체가 중요한 신호일 수 있고, 1% 결측이어도 특정 장치에서만 생기면 운영 장애일 수 있다.</Misconception>
      </section>

      <section id="missingness" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">결측은 비어 있는 값과 비게 만든 과정을 함께 본다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 결측 indicator를 만들고 전체 평균이 아니라 시간, 장치, cohort와 target 전후
            slice에서 관측률을 비교한다. 이때 결측 pattern은 가설을 만들 뿐 MCAR, MAR, MNAR를
            plot만으로 증명하지 않는다. MCAR는 결측이 관측·비관측 값과 무관한 경우, MAR는 관측된
            정보에 조건부로 설명되는 경우, MNAR는 비관측 값 자체와 관계가 남는 경우를 뜻한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}m_{ij}&=\mathbf{1}\!\left[x_{ij}\ \text{가 비어 있음}\right]\\[2pt]\widehat r_{g,j}&=\frac{\underbrace{\sum_{i\in g}m_{ij}}_{\text{집단 }g\text{의 결측 개수}}}{\underbrace{|g|}_{\text{집단의 전체 행 수}}}\end{aligned}`}
          meaning="Column j의 결측 여부를 0/1로 만들고 집단·시간 slice g별 결측률을 비교한다. 차이는 생성 과정에 대한 단서이지 결측 메커니즘의 자동 판정이 아니다."
          symbols={[
            [String.raw`m_{ij}`, '행 i, column j가 결측이면 1인 indicator'],
            [String.raw`g`, '설비 유형, 월, 사건 전후처럼 비교할 slice'],
            [String.raw`\widehat r_{g,j}`, '해당 slice에서 관측된 결측률'],
          ]}
        />
        <MissingnessShiftLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Imputer도 학습기다. 중앙값, category 최빈값, iterative imputation의 parameter는 fold
            train에서 fit하고 validation에는 transform만 한다. Missing indicator의 유용성도 OOF
            evidence로 확인한다. Test의 결측률을 보고 train 처리 규칙을 다시 고르면 test를 학습에
            사용한 셈이다.
          </p>
        </div>
      </section>

      <section id="leakage" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Leakage map은 column의 생성 시간을 복원한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            `last_service_date`가 cutoff 전에 기록됐더라도 사후 정정된 값이면 당시 시스템에서
            조회할 수 없었을 수 있다. 전체 기간의 설비 평균, validation month를 포함한 rolling
            feature, 모든 행으로 fit한 scaler·target encoder·feature selector도 미래 또는 validation
            정보를 요약한다. Leakage는 target 이름이 들어간 column만의 문제가 아니다.
          </p>
          <ol>
            <li>각 feature의 source event time, ingestion time, correction time을 적는다.</li>
            <li>예측 query를 과거 시점으로 replay해 실제 당시 값이 재현되는지 확인한다.</li>
            <li>Group/time 경계를 반영한 split manifest를 먼저 만든다.</li>
            <li>Imputation, encoding, aggregation, selection을 fold train 안으로 넣는다.</li>
            <li>OOF prediction과 slice metric으로 baseline을 만들고 untouched holdout은 마지막에 한 번만 연다.</li>
          </ol>
          <p>
            Split 선택과 OOF evidence는 <InternalLink slug="cross-validation">교차 검증</InternalLink>,
            metric bundle은 <InternalLink slug="evaluation-metrics">평가 지표</InternalLink>에서
            이어진다. EDA의 끝은 “상관이 높은 column 목록”이 아니라 model이 믿어도 되는 관측
            boundary다.
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">감사가 끝나면 필요한 개입만 연다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Audit 결과가 “원시 column이 메커니즘을 잘 표현하지 못한다”면
            <InternalLink slug="feature-engineering">피처 설계</InternalLink>로 간다. 수집 가능한
            변형이 부족한 image·audio라면 <InternalLink slug="data-augmentation">데이터 증강</InternalLink>,
            실제 사건이 희귀하고 행동 용량이 제한된다면
            <InternalLink slug="imbalanced-data">희귀 사건 의사결정</InternalLink>을 연다. 일반적인
            정적 표라면 피처 계약을 거쳐 <InternalLink slug="gradient-boosting">gradient boosting
            기준선</InternalLink>을 세우고, 시간 순서가 예측의 일부라면
            <InternalLink slug="time-features">시간 피처와 point-in-time 계약</InternalLink>으로 간다.
            이 다섯 경로는 일렬로 모두 읽는 목차가 아니다. 감사에서 확인한 데이터의 생성 방식에 따라
            필요한 경로만 고르는 분기다.
          </p>
        </div>
        <CapabilityCheck items={[
          '한 행, 예측 cutoff, target availability와 action을 한 문장으로 고정할 수 있다.',
          'Dtype와 의미·단위·sentinel·lineage를 구분해 data dictionary를 만들 수 있다.',
          'Missingness plot을 메커니즘의 증명이 아니라 추가 증거가 필요한 가설로 읽을 수 있다.',
          'Feature 생성과 모든 학습형 preprocessing의 fit boundary에서 leakage를 찾을 수 있다.',
          'Audit 결과에 따라 feature, augmentation, rare-event, 정적 표 baseline과 시간 데이터 분기를 선택할 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          Leakage와 imputation API 경계는 아래 공식 문서에 근거한다. Prediction contract, lineage
          ledger와 stop gate의 결합은 이 경로의 engineering synthesis다.
        </p>
        <SourceNotes sources={[
          { label: 'scikit-learn · Common pitfalls', href: 'https://scikit-learn.org/stable/common_pitfalls.html', note: 'Test 정보가 preprocessing과 feature selection에 들어가는 leakage, train-only fit 원칙.' },
          { label: 'scikit-learn · Imputation', href: 'https://scikit-learn.org/stable/modules/impute.html', note: 'Simple, iterative, nearest-neighbor imputation과 missing indicator의 공식 범위.' },
          { label: 'scikit-learn · Cross-validation', href: 'https://scikit-learn.org/stable/modules/cross_validation.html', note: 'Holdout과 교차 검증을 일반화 성능 추정에 사용하는 공식 기준.' },
        ]} />
      </section>
    </div>
  );
}
