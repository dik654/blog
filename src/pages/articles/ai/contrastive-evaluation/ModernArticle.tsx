import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ContrastivePathLocator, {
  ContrastiveMapReturn,
} from "../contrastive-learning/ContrastivePathLocator";
import {
  EvaluationFailureViz,
  PairedDownstreamViz,
  ReleaseEvidenceFlowViz,
  StratifiedPairAuditViz,
} from "./ContrastiveEvaluationViz";
import { CONTRASTIVE_EVALUATION_FIXTURE as FIXTURE } from "./calculations";

const STATE_OWNERS = [
  {
    state: "Candidate receipt",
    writer: "Miner·index build pipeline",
    readers: "Pair audit·evaluation job",
    fields: "encoder·miner·corpus index·depth·filter revision",
  },
  {
    state: "Pair verdict",
    writer: "Reviewer·adjudicator",
    readers: "Audit report·pair policy owner",
    fields: "positive·negative·unknown·rubric·agreement",
  },
  {
    state: "Metric receipt",
    writer: "Versioned evaluation job",
    readers: "Release gate",
    fields: "split·seed·metric code·slice·baseline·candidate",
  },
  {
    state: "Release decision",
    writer: "Release owner",
    readers: "Deployment pipeline·audit log",
    fields: "release·revise·block·rollback revision",
  },
] as const;

export default function ContrastiveEvaluationArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="practice-entry"
        data-assumed-case="encoder-v8-release-audit"
        className="scroll-mt-20"
      >
        <ContrastivePathLocator current="evaluation" />
        <h2 className="mb-5 text-2xl font-bold">
          1. 새 encoder를 출시할지는 두 근거가 모인 뒤 결정합니다
        </h2>

        <ReleaseEvidenceFlowViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            운영 중인 <code>{FIXTURE.baselineRevision}</code>을 새 후보
            <code> {FIXTURE.candidateRevision}</code>로 바꿀지 판단한다고
            가정하겠습니다. 후보는 <code>{FIXTURE.minerRevision}</code>와
            <code> {FIXTURE.indexRevision}</code>에서 만들어졌습니다. 이 이름과
            뒤의 수치는 절차를 설명하기 위한 가정이며 실제 측정 결과가 아닙니다.
          </p>
          <p>
            먼저 후보 pair가 잘못된 negative를 얼마나 포함하는지 검사합니다.
            그다음 기존 모델과 후보 모델을 같은 데이터 split과 seed로 비교합니다.
            두 근거 중 하나라도 설명되지 않으면 출시를 멈춥니다. Training loss가
            낮아졌다는 사실만으로 이 절차를 건너뛰지 않습니다.
          </p>
          <p>
            이 글은 loss를 다시 유도하지 않습니다. Pair의 의미, miner가 후보를
            고르는 방식, 같은 label의 경계, test를 선택에 재사용하면 안 되는
            이유는 오른쪽의 정확한 개념 글에서 출발합니다.
          </p>
        </div>
        <ContentBoundary article="contrastive-evaluation" />
      </section>

      <section id="baseline" data-teach-level="practice-1" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          2. 평가 전에 후보와 비교 조건의 writer를 한 곳으로 고정합니다
        </h2>

        <div className="not-prose overflow-hidden border-y border-border">
          <div className="hidden grid-cols-[10rem_12rem_12rem_minmax(0,1fr)] gap-3 border-b border-border bg-muted/25 px-4 py-3 text-[10px] font-black text-muted-foreground sm:grid">
            <span>상태</span><span>유일한 writer</span><span>읽는 쪽</span><span>고정할 필드</span>
          </div>
          {STATE_OWNERS.map((row) => (
            <div key={row.state} className="grid gap-2 border-b border-border px-3 py-4 last:border-b-0 sm:grid-cols-[10rem_12rem_12rem_minmax(0,1fr)] sm:gap-3 sm:px-4">
              <strong className="text-sm">{row.state}</strong>
              <span className="text-xs leading-5"><span className="mr-2 text-[9px] font-bold text-muted-foreground sm:hidden">WRITER</span>{row.writer}</span>
              <span className="text-xs leading-5"><span className="mr-2 text-[9px] font-bold text-muted-foreground sm:hidden">READER</span>{row.readers}</span>
              <span className="break-keep text-xs leading-5 text-muted-foreground">{row.fields}</span>
            </div>
          ))}
        </div>

        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            평가 도중 miner나 index가 새로 빌드되더라도 현재 candidate receipt는
            바뀌지 않아야 합니다. Reviewer는 관계 판정만 쓰고 후보 목록을 직접
            고치지 않습니다. Evaluation job도 metric receipt만 쓰며 배포 상태를
            변경하지 않습니다. 최종 상태를 바꾸는 주체는 release owner 하나입니다.
          </p>
          <p>
            이 경계를 지키면 숫자가 나빠졌을 때 원인을 좁힐 수 있습니다. 반대로
            여러 프로세스가 같은 후보·판정·배포 상태를 덮어쓰면 어떤 입력으로
            결정했는지 복원하기 어렵습니다.
          </p>
        </div>

        <TermBreakdown
          title="가장 작은 평가 기준선"
          items={[
            {
              term: "Immutable candidate snapshot",
              description: "Encoder·miner·index·filter revision과 후보 행을 같은 receipt로 보존합니다.",
            },
            {
              term: "Versioned rubric",
              description: "Positive·negative·unknown의 업무상 의미와 재판정 규칙을 버전으로 남깁니다.",
            },
            {
              term: "Paired evaluation manifest",
              description: "Baseline과 candidate에 같은 split·seed·metric 구현을 배정합니다.",
            },
            {
              term: "Rollback target",
              description: `후보가 통과하지 못하면 ${FIXTURE.baselineRevision}을 계속 서비스합니다.`,
            },
          ]}
        />
      </section>

      <section id="pair-audit" data-teach-level="practice-2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          3. 구간마다 20개씩 본 결과를 전체 비율처럼 합치지 않습니다
        </h2>

        <StratifiedPairAuditViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            후보 1만 개를 유사도에 따라 높은 구간 100개, 중간 구간 900개,
            낮은 구간 9,000개로 나눴다고 가정합니다. 각 구간에서 무작위로
            20개씩 검토했더니 실제 positive인 후보가 각각 8개, 2개, 0개였습니다.
            표본 수를 같게 만든 것은 위험 구간을 비교하기 위해서이지, 세 구간의
            모집단 크기가 같다는 뜻이 아닙니다.
          </p>
          <p>
            따라서 <code>10/60=16.7%</code>는 검토한 60개 안의 단순 비율입니다.
            설명용 모집단 비중을 반영하면 <code>(100×0.40 + 900×0.10 +
            9,000×0)/10,000=1.3%</code>입니다. 두 숫자는 다른 질문에 답합니다.
            실제 운영에서는 sampling probability와 미응답까지 반영한 추정량을
            통계 담당자와 확정해야 합니다.
          </p>
        </div>

        <ExplainedFormula
          question="구간별 audit 결과를 전체 후보 모집단의 추정치로 어떻게 합칩니까?"
          idea={(
            <p>
              각 구간의 관측 hidden-positive 비율에 그 구간의 모집단 비중을
              곱한 뒤 모두 더합니다. 표본을 같은 수로 뽑았다는 이유로 표본 행을
              그대로 합치지 않습니다.
            </p>
          )}
          formula={String.raw`\widehat r_b=F_b/R_b,\qquad \widehat r_{pop}=\sum_b (N_b/N)\widehat r_b`}
          annotatedFormula={String.raw`\begin{aligned}\widehat r_b&=\underbrace{F_b/R_b}_{\text{구간 b의 관측 hidden-positive 비율}}\\w_b&=\underbrace{N_b/N}_{\text{전체 후보 중 구간 b의 모집단 비중}}\\\widehat r_{pop}&=\underbrace{\sum_b w_b\widehat r_b}_{\text{구간 비율을 모집단 비중으로 합산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`F_b/R_b`,
              annotation: ["구간에서 hidden positive로 판정한 수를", "그 구간에서 검토한 수로 나눕니다."],
            },
            {
              expression: String.raw`N_b/N`,
              annotation: ["해당 위험 구간의 후보 수를", "전체 후보 수로 나눠 비중을 구합니다."],
            },
            {
              expression: String.raw`\sum_b w_b\widehat r_b`,
              annotation: ["구간별 관측 비율에 모집단 비중을 곱하고", "모든 구간의 값을 더합니다."],
            },
          ]}
          terms={[
            { symbol: "b", name: "Audit stratum", description: "Similarity나 domain처럼 위험을 나눈 구간입니다." },
            { symbol: String.raw`F_b`, name: "Hidden positives", description: "Negative 후보였지만 검토 결과 positive로 판정된 수입니다." },
            { symbol: String.raw`R_b`, name: "Reviewed samples", description: "구간 b에서 실제로 관계를 판정한 표본 수입니다." },
            { symbol: String.raw`N_b`, name: "Stratum population", description: "후보 snapshot에서 구간 b에 속한 전체 수입니다." },
          ]}
          assumptions={[
            "각 구간 안에서 표본을 무작위로 뽑습니다.",
            "Positive·negative·unknown rubric과 reviewer agreement를 별도로 기록합니다.",
            "모집단 크기와 표본 추출 확률을 candidate receipt에서 재현할 수 있습니다.",
            "이 설명용 가중치는 복잡한 survey design이나 non-response를 포함하지 않습니다.",
          ]}
          interpretation="관측 구간 비율은 40%·10%·0%입니다. 같은 표본 수를 단순 합치면 16.7%지만 설명용 모집단 비중을 적용한 추정치는 1.3%입니다. 0/20도 불확실성이 남으므로 위험 0으로 읽지 않습니다."
        />

        <CalculationWalkthrough
          title="세 위험 구간의 모집단 가중 추정치"
          question="구간별 모집단 100·900·9,000개와 관측 비율 40%·10%·0%를 어떻게 합칩니까?"
          scope="모든 수치는 표본 설계를 설명하기 위한 가정입니다. 실제 서비스의 false-negative 측정값이 아닙니다."
          steps={[
            {
              label: "구간별 관측 비율",
              expression: "8/20, 2/20, 0/20",
              result: "40%, 10%, 0%",
              reason: "각 구간의 hidden positive 수를 그 구간 표본 수로 나눕니다.",
            },
            {
              label: "단순 표본 합계",
              expression: "(8+2+0) ÷ (20+20+20)",
              result: "16.7%",
              reason: "검토한 60개 안의 비율일 뿐 모집단 구성은 반영하지 않습니다.",
            },
            {
              label: "모집단 비중 적용",
              expression: "100×.40 + 900×.10 + 9,000×0",
              result: "추정 hidden positive 130개",
              reason: "각 구간 관측 비율을 해당 구간 전체 후보에 적용합니다.",
            },
            {
              label: "전체 추정치",
              expression: "130 ÷ 10,000",
              result: `${(FIXTURE.weightedPopulationRate * 100).toFixed(1)}%`,
              reason: "구간별 추정 수를 전체 후보 수로 나눕니다.",
            },
          ]}
          conclusion="표본을 같은 수로 뽑았더라도 모집단 비중이 크게 다르면 단순 표본 비율과 전체 모집단 추정치는 달라집니다."
          caveats={[
            "낮은 구간의 0/20은 참 비율이 정확히 0이라는 뜻이 아닙니다. Wilson 95% 구간의 상한은 약 16.1%입니다.",
            "실제 release threshold는 오류 비용, 표본 비용, 도메인별 손실을 반영해 별도로 정해야 합니다.",
          ]}
        />
      </section>

      <section id="downstream" data-teach-level="practice-3" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          4. 같은 split·seed에서 뺀 차이만 모델 변경 효과로 읽습니다
        </h2>

        <PairedDownstreamViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Baseline과 후보에 서로 다른 seed나 데이터 split을 주면 점수 차이에
            모델 변경과 평가 변동이 함께 섞입니다. 같은 seed 안에서 후보 점수에서
            baseline 점수를 빼고, 그 차이를 seed별로 모읍니다.
          </p>
          <p>
            설명용 gain은 <code>[+0.02, −0.01, 0, +0.01, −0.02]</code>입니다.
            합은 0이고 평균도 0입니다. 이 결과만 보면 새 encoder가 downstream
            task를 개선했다는 근거가 없습니다. 평균과 함께 seed 분산, worst-domain
            slice, 실패 query를 같은 receipt에 남깁니다.
          </p>
        </div>

        <ExplainedFormula
          question="다른 seed의 흔들림과 candidate revision의 차이를 어떻게 분리합니까?"
          idea={(
            <p>
              각 seed에서 같은 split과 metric code를 쓴 두 결과를 짝지어 뺍니다.
              그런 다음 seed별 차이의 평균을 계산합니다.
            </p>
          )}
          formula={String.raw`\Delta_s=M(\theta_{new},s)-M(\theta_{base},s),\qquad \overline\Delta=S^{-1}\sum_s\Delta_s`}
          annotatedFormula={String.raw`\begin{aligned}\Delta_s&=\underbrace{M(\theta_{new},s)-M(\theta_{base},s)}_{\text{같은 split·seed 안에서 짝지어 뺀 차이}}\\\overline\Delta&=\underbrace{\frac{1}{S}\sum_{s=1}^{S}\Delta_s}_{\text{seed별 paired gain의 평균}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`M(\theta_{new},s)-M(\theta_{base},s)`,
              annotation: ["같은 seed의 candidate 점수에서", "같은 seed의 baseline 점수를 뺍니다."],
            },
            {
              expression: String.raw`\sum_s\Delta_s`,
              annotation: ["양수·음수·0인 차이를", "부호를 유지한 채 모두 더합니다."],
            },
            {
              expression: String.raw`S^{-1}\sum_s\Delta_s`,
              annotation: ["차이 합을 seed 수로 나눠", "평균 paired gain을 계산합니다."],
            },
          ]}
          terms={[
            { symbol: String.raw`\theta_{new}`, name: "Candidate revision", description: `${FIXTURE.candidateRevision}의 고정된 model artifact입니다.` },
            { symbol: String.raw`\theta_{base}`, name: "Baseline revision", description: `${FIXTURE.baselineRevision}의 고정된 model artifact입니다.` },
            { symbol: "s", name: "Paired seed", description: "두 revision에 똑같이 적용하는 seed와 split 조합입니다." },
            { symbol: String.raw`\Delta_s`, name: "Paired gain", description: "같은 seed 안에서 candidate와 baseline의 metric 차이입니다." },
          ]}
          assumptions={[
            "Baseline과 candidate가 같은 데이터 split·seed·metric 구현을 사용합니다.",
            "Metric 방향은 값이 클수록 좋도록 맞춥니다.",
            "한 평균으로 숨지 않도록 seed 분산과 중요한 domain slice를 함께 봅니다.",
          ]}
          interpretation={`설명용 차이의 합은 0이고 seed 수는 ${FIXTURE.seedGains.length}이므로 평균 gain은 ${FIXTURE.meanSeedGain}입니다. 따라서 이 사례에서는 release를 지지하지 않습니다.`}
        />
      </section>

      <section id="failure-recovery" data-teach-level="practice-4" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          5. 평가 계약이 깨지면 결과를 격리하고 올바른 단계부터 다시 실행합니다
        </h2>

        <EvaluationFailureViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            평가 실패는 모델 실패와 다릅니다. Index revision이 바뀌거나 두 모델의
            split이 다르면 현재 숫자로 모델의 우열을 말할 수 없습니다. 이때 수치를
            보정해 살리지 않고 영향을 받은 receipt를 무효로 표시합니다.
          </p>
          <p>
            Unknown 판정을 negative로 강제한 경우에는 해당 rubric version의 pair
            rate를 다시 계산합니다. Test 결과를 pair 규칙 수정에 사용했다면 그
            test는 더 이상 독립 test가 아닙니다. Validation으로 강등하고 새로운
            holdout을 마련해야 합니다.
          </p>
        </div>

        <ol className="not-prose mt-6 grid gap-px bg-border p-px sm:grid-cols-5">
          {[
            ["1", "발견", "receipt·revision·설정 차이를 찾습니다."],
            ["2", "격리", "영향받은 audit·metric 결과를 출시 근거에서 뺍니다."],
            ["3", "복구", "고정된 snapshot과 manifest를 다시 만듭니다."],
            ["4", "재실행", "무효가 된 첫 단계부터 같은 절차를 반복합니다."],
            ["5", "재진입", "새 receipt가 gate를 통과할 때만 배포 후보로 돌립니다."],
          ].map(([number, title, description]) => (
            <li key={number} className="min-w-0 bg-background px-3 py-4">
              <span className="font-mono text-[10px] font-black text-primary">{number}</span>
              <strong className="mt-2 block text-sm">{title}</strong>
              <span className="mt-2 block break-keep text-[10px] leading-5 text-muted-foreground">{description}</span>
            </li>
          ))}
        </ol>
      </section>

      <section id="decision" data-teach-level="practice-5" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          6. 이 가정에서는 출시하지 않고 pair policy를 수정합니다
        </h2>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          <div className="min-w-0 bg-background px-4 py-5">
            <span className="text-[10px] font-black text-primary">PAIR AUDIT</span>
            <strong className="mt-2 block text-lg">위험 확인</strong>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">높은 유사도 구간에서 8/20이 hidden positive입니다. 실제 threshold는 아직 미확정입니다.</p>
          </div>
          <div className="min-w-0 bg-background px-4 py-5">
            <span className="text-[10px] font-black text-primary">DOWNSTREAM</span>
            <strong className="mt-2 block text-lg">평균 gain 0</strong>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">같은 split·seed의 paired difference에서 개선 근거가 생기지 않았습니다.</p>
          </div>
          <div className="min-w-0 bg-primary/[0.08] px-4 py-5">
            <span className="text-[10px] font-black text-primary">DECISION</span>
            <strong className="mt-2 block text-lg">REVISE</strong>
            <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{FIXTURE.baselineRevision}을 유지하고 duplicate·multi-positive filter와 rubric을 수정합니다.</p>
          </div>
        </div>

        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            이 결정은 새 encoder가 언제나 나쁘다는 결론이 아닙니다. 현재 고정한
            후보·표본·downstream 조건에서는 출시 근거가 부족하다는 뜻입니다.
            Pair policy를 수정해 새 revision을 만든 뒤 audit와 paired comparison을
            다시 실행합니다. 결론을 뒤집으려면 미리 합의한 pair-risk 한도와
            downstream gain, worst-slice 회귀 한도를 함께 통과해야 합니다.
          </p>
        </div>

        <div className="not-prose mt-8 grid gap-4 lg:grid-cols-2">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Chuang et al. — Debiased Contrastive Learning"
            href="https://proceedings.neurips.cc/paper/2020/hash/63c3ddcc7b23daa1e42dc41f9a44a873-Abstract.html"
          >
            Unlabeled negative에 같은 latent class의 positive가 섞이는 sampling bias를 분석합니다. 이 논문이 human audit·업무 rubric·release gate를 대신한다는 뜻은 아닙니다.
          </CitationBlock>
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Chen et al. — A Simple Framework for Contrastive Learning"
            href="https://proceedings.mlr.press/v119/chen20j.html"
          >
            Learned representation을 linear evaluation과 fine-tuning으로 평가한 연구 범위를 확인합니다. 본문의 운영 threshold를 제시한 근거는 아닙니다.
          </CitationBlock>
          <CitationBlock
            type="paper"
            citeKey={3}
            source="NIST — Confidence Limits for a Proportion"
            href="https://www.itl.nist.gov/div898/handbook/prc/section2/prc241.htm"
          >
            표본 비율에 불확실성이 남으며 Wilson·exact binomial 같은 confidence interval을 사용할 수 있다는 통계적 경계를 확인합니다.
          </CitationBlock>
          <CitationBlock
            type="paper"
            citeKey={4}
            source="NIST — Proportions and Sample Size"
            href="https://www.itl.nist.gov/div898/handbook/ppc/section3/ppc333.htm"
          >
            원하는 정밀도에 따라 표본 수가 달라지고 층화할 때 각 stratum의 표본 수를 설계해야 한다는 범위를 확인합니다.
          </CitationBlock>
        </div>
      </section>

      <section id="return-map" data-teach-level="practice-return" className="scroll-mt-20">
        <ContrastiveMapReturn current="evaluation" />
      </section>
    </div>
  );
}
