import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaPair from './practical-tabular/FormulaPair';
import {
  FeatureTokenLab,
  PriorDatasetLab,
  TabularEscalationLab,
} from './practical-tabular/viz/TabularEvidenceLabs';

export default function TabularDeepLearningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">질문은 “딥러닝이 이기나”가 아니라 “어떤 추가 능력이 필요한가”다</h2>
        <QuestionLead
          question="2026년 TabPFN-3가 강한 표 모델이라면, 이제 모든 XGBoost·CatBoost pipeline을 없애도 될까?"
          answer="아니다. 최신 benchmark는 tabular foundation model이 매우 강한 후보가 되었음을 보여 주지만, 데이터 schema·규모·license·GPU memory·latency·calibration·배포 방식은 서로 다르다. 강한 tree baseline과 같은 split·metric·예산으로 비교해 추가 능력이 비용을 정당화할 때만 승격한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글은 <InternalLink slug="gradient-boosting">gradient boosting 기준선</InternalLink>의
            OOF prediction과 release cost가 준비됐다고 가정한다. Neural model을 쓰는 이유는
            “표에도 Transformer를 적용할 수 있어서”가 아니라, tree가 재사용하지 못한 표현을 공유하거나,
            텍스트·이미지를 결합하거나, 여러 task에서 배운 prior를 새 표에 가져오는 능력이 필요해서다.
          </p>
          <p>
            TabNet과 FT-Transformer는 한 task의 표에서 weight를 학습하는 대표적 설계다. TabPFN
            계열은 한 단계 더 올라가 여러 합성 dataset에서 <strong>표를 보고 예측하는 학습
            알고리즘 자체</strong>를 사전학습한다. 세 계열은 같은 이름의 “tabular DL”로 묶여도
            adaptation 방식과 운영 비용이 다르다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Feature token', meaning: '숫자·범주 셀 하나를 같은 d차원 vector로 바꾼 표현', why: 'Self-attention이 서로 다른 열 사이의 관계를 같은 vector 연산으로 비교하게 한다.' },
          { term: 'Task-trained model', meaning: '현재 dataset의 train rows로 weight를 처음부터 또는 fine-tuning으로 맞추는 model', why: 'FT-Transformer·TabNet의 성능과 비용을 foundation model adaptation과 구분한다.' },
          { term: 'Prior-data fitted network', meaning: '여러 synthetic dataset에서 학습 알고리즘을 미리 학습한 network', why: '새 표에서 긴 task-specific training 없이 context를 보고 예측하는 이유를 설명한다.' },
          { term: 'In-context prediction', meaning: '새 표의 labeled rows와 query rows를 입력 context로 함께 읽어 query label을 추론', why: '일반적인 per-task optimizer training과 다른 실행 경로를 만든다.' },
          { term: 'Benchmark contract', meaning: '동일 split·metric·tuning budget·hardware·latency 조건으로 후보를 비교하는 규칙', why: '논문별 서로 다른 실험 설정에서 나온 순위를 내 문제의 승자로 오해하지 않게 한다.' },
        ]} />
        <TabularEscalationLab />
      </section>

      <section id="tokenization" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 이질적인 셀을 비교 가능한 feature token으로 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            표의 열은 서로 단위와 vocabulary가 다르다. FT-Transformer의 feature tokenizer는
            수치값을 열마다 다른 방향 vector에 곱하고, 범주값은 열별 embedding table에서 찾는다.
            두 결과는 같은 d차원이지만 같은 의미는 아니다. 열 정체성과 missing·unknown policy가
            token 생성 계약에 포함된다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}t_j^{\mathrm{num}}&=\underbrace{b_j^{\mathrm{num}}}_{\text{수치 열 }j\text{의 정체성}}+\underbrace{x_j w_j}_{\text{값 크기가 만든 방향 이동}}\\[2pt]t_j^{\mathrm{cat}}&=\underbrace{b_j^{\mathrm{cat}}}_{\text{범주 열 }j\text{의 정체성}}+\underbrace{E_j[x_j]}_{\text{열별 vocabulary에서 조회}}\\[2pt]T_0&=\left[\underbrace{t_{\mathrm{CLS}}}_{\text{전체 예측을 모을 token}}\,\middle|\,\underbrace{t_1,\ldots,t_k}_{\text{열마다 만든 feature token}}\right]\end{aligned}`}
          meaning="숫자와 범주를 각각 열별 규칙으로 d차원 token으로 바꾼 뒤, CLS token과 함께 하나의 token 행렬로 만든다. 열마다 parameter를 따로 두므로 값 1의 의미가 온도와 금액에서 같다고 가정하지 않는다."
          symbols={[
            [String.raw`x_j`, '한 표본의 j번째 원시 수치값 또는 category ID'],
            [String.raw`w_j`, '수치 열 j에서 값의 크기가 움직일 방향 vector'],
            [String.raw`b_j^{\mathrm{num}},b_j^{\mathrm{cat}}`, '수치·범주 열 j의 정체성을 더하는 feature bias'],
            [String.raw`E_j`, '범주 열 j만의 embedding table'],
            [String.raw`T_0`, 'Transformer 첫 layer에 들어가는 (k+1)개 token'],
          ]}
        />
        <FeatureTokenLab />
        <Misconception>Token 차원이 같다는 것은 온도와 장치 ID가 같은 종류의 값이라는 뜻이 아니다. 같은 계산 interface로 옮겼다는 뜻이다. Unit 오류, future leakage와 unknown category는 tokenizer가 자동 해결하지 않는다.</Misconception>
      </section>

      <section id="ft-transformer" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">FT-Transformer는 한 행 안에서 열 사이의 조건부 관계를 섞는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            각 attention head는 같은 행의 feature token에서 query, key, value를 만든다. 특정 표본에서
            “장치 유형” token이 “온도”와 “진동” token을 얼마나 참고할지 weight가 달라질 수 있다.
            이는 tree의 명시적 split과 다른 부드러운 interaction 표현이다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}Q_h&=\underbrace{T W_h^Q}_{\text{찾을 관계}}\\[2pt]K_h&=\underbrace{T W_h^K}_{\text{비교 표지}}\\[2pt]V_h&=\underbrace{T W_h^V}_{\text{전달 정보}}\\[2pt]S_h&=\underbrace{\frac{Q_hK_h^\top}{\sqrt{d_h}}}_{\text{feature pair score}}\\[2pt]A_h&=\underbrace{\operatorname{softmax}(S_h)}_{\text{정규화한 참고 비율}}\\[2pt]Z_h&=\underbrace{A_hV_h}_{\text{섞은 feature token}}\end{aligned}`}
          meaning="Query와 key의 방향이 맞는 feature pair에 큰 attention weight를 주고, 그 비율로 value를 섞는다. √dₕ는 head 차원이 커질 때 dot product가 지나치게 커져 softmax가 포화되는 것을 줄인다."
          symbols={[
            [String.raw`T`, '현재 layer의 feature token 행렬'],
            [String.raw`d_h`, 'Attention head 하나의 vector 차원'],
            [String.raw`A_h`, '행 안의 feature-to-feature 참고 비율 행렬'],
            [String.raw`Z_h`, 'Head h가 섞어 만든 feature 표현'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Attention map은 model 내부의 참고 pattern이지 곧바로 causal importance가 아니다.
            Feature ablation, permutation과 slice error를 함께 봐야 한다. 또한 feature 수가 매우
            크면 행마다 feature attention의 비용과 memory가 늘어나므로 실제 schema에서 측정한다.
          </p>
        </div>
      </section>

      <section id="tabnet" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TabNet은 여러 decision step에서 사용할 열을 순차적으로 고른다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            TabNet은 한 번에 모든 feature를 같은 방식으로 처리하기보다, step마다 attentive mask를
            만들어 일부 feature에 계산을 집중한다. 이전 step에서 많이 쓴 feature에는 prior를 통해
            다시 선택할 비용을 줄 수 있고, step별 decision output을 합쳐 최종 예측을 만든다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}M^{(s)}&=\underbrace{\operatorname{sparsemax}\!\left(P^{(s-1)}\odot a^{(s-1)}\right)}_{\text{step }s\text{에서 사용할 희소 feature mask}}\\[2pt]\widetilde x^{(s)}&=\underbrace{M^{(s)}\odot x}_{\text{선택 비율만 남긴 입력}}\\[2pt]\widehat y&=g\!\left(\underbrace{\sum_s d^{(s)}}_{\text{여러 decision step의 정보 합}}\right)\end{aligned}`}
          meaning="각 step은 sparsemax로 많은 좌표를 정확히 0으로 만들 수 있는 mask를 얻고, 선택된 feature만 변환한다. 여러 step의 decision 표현을 더해 예측하지만 mask가 곧 인과 설명이라는 뜻은 아니다."
          symbols={[
            [String.raw`M^{(s)}`, 'Decision step s의 feature 선택 mask'],
            [String.raw`P^{(s-1)}`, '이전 step 사용량을 반영한 feature prior'],
            [String.raw`a^{(s-1)}`, 'Attentive transformer가 만든 원시 선택 score'],
            [String.raw`d^{(s)}`, 'Step s가 예측에 보태는 decision 표현'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            TabNet은 중요한 역사적 설계지만 “해석 가능”이라는 label만으로 채택하지 않는다. Mask
            stability, baseline 대비 OOF delta, batch latency와 data 규모를 본다. 단순 MLP와
            well-tuned GBDT를 빼고 새 architecture끼리만 비교하면 승격 근거가 약하다.
          </p>
        </div>
      </section>

      <section id="tabpfn" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TabPFN은 여러 표에서 학습 알고리즘 자체를 사전학습한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prior-data fitted network는 다양한 synthetic data-generating process에서 dataset을
            반복 생성한다. 각 task의 context rows를 보고 query label distribution을 맞추도록 하나의
            network를 학습한다. 새 표에서는 labeled train rows와 query rows가 context가 되고,
            pretrained network가 prediction을 낸다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}\tau&\sim \underbrace{p(\tau)}_{\text{표 생성 prior}}\\[2pt]D_\tau&=\underbrace{\{(x_i,y_i)\}_{i=1}^{n}}_{\text{관측 context}}\\[2pt]Q_\tau&=\underbrace{\{(x_q,y_q)\}}_{\text{맞혀 볼 query}}\\[2pt]\mathcal L_\tau(\phi)&=\sum_{(x_q,y_q)\in Q_\tau}-\log p_\phi(y_q\mid x_q,D_\tau)\\[2pt]\phi^\star&=\arg\min_\phi\underbrace{\mathbb E_{\tau}[\mathcal L_\tau(\phi)]}_{\text{여러 task의 평균 손실}}\end{aligned}`}
          meaning="여러 synthetic task τ를 뽑아 labeled context를 보고 query label을 맞히게 한다. 이 반복을 통해 parameter φ는 특정 표의 rule이 아니라 표에서 rule을 추론하는 절차를 학습한다."
          symbols={[
            [String.raw`p(\tau)`, '사전학습 때 사용할 data-generating task의 prior'],
            [String.raw`D_\tau`, '한 task에서 model이 보는 labeled context rows'],
            [String.raw`Q_\tau`, 'Context를 근거로 label을 예측할 query rows'],
            [String.raw`\phi`, 'Dataset 간에 공유되는 pretrained network parameter'],
          ]}
        />
        <PriorDatasetLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            2025년 Nature의 TabPFN v2는 작은 표에서 강한 성능을 보고했고, 2026년 TabPFN-3 기술
            보고서는 최대 100만 training rows, relational·text-tabular·time-series 확장과 더 빠른
            실행을 주장한다. 이 수치는 <strong>저자 보고서의 실험 경계</strong>이지 모든 schema와
            hardware에서의 보장은 아니다. Model version, license, remote API 여부, GPU memory,
            context construction과 calibration을 실제 release 후보에 고정한다.
          </p>
        </div>
      </section>

      <section id="decision" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">승격은 평균 점수 하나가 아니라 능력과 비용의 묶음으로 결정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            TabArena 같은 living benchmark는 model version, validation과 ensemble budget이 순위를
            바꾼다는 사실을 강조한다. 내 dataset에서도 같은 split과 OOF metric, equal tuning
            budget으로 GBDT, 단순 MLP, task-trained architecture와 pretrained model을 비교한다.
            Foundation model의 zero/few-shot 편의성도 latency·memory·license 비용과 함께 센다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['능력 가설', 'Multimodal 결합, 여러 task 재사용, 작은 표 prior, 불확실성 중 무엇이 tree baseline에 없는가?'],
            ['동일 증거', '같은 row, split, metric, seed policy와 tuning wall-clock에서 OOF를 만든다.'],
            ['실패 slice', 'Category cardinality, missingness, tail, group/time drift와 calibration을 따로 본다.'],
            ['운영 비용', 'Model·cache memory, p50/p95 latency, batch size, license, fallback과 rollback을 기록한다.'],
            ['승격 기준', 'Primary 개선이 반복 noise보다 크고 guardrail·운영 budget을 모두 통과할 때만 교체한다.'],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
        <StopRule>새 model의 평균 score가 올라도 calibration, rare slice, p95 latency, memory 또는 재현성 guardrail이 깨지면 baseline을 대체하지 않는다. 필요하면 두 model을 서로 다른 traffic에 routing하거나 OOF ensemble 후보로만 남긴다.</StopRule>
        <CapabilityCheck items={[
          '수치·범주 feature token이 어떻게 같은 d차원으로 변환되는지 설명할 수 있다.',
          'FT-Transformer의 attention을 feature interaction 표현으로 읽되 causal explanation과 구분할 수 있다.',
          'TabNet의 sequential mask와 task-trained model의 한계를 설명할 수 있다.',
          'TabPFN의 prior-task pretraining과 새 표의 in-context prediction을 구분할 수 있다.',
          'GBDT·task-trained neural·foundation model을 같은 OOF·비용 release gate에서 비교할 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          아래 논문은 architecture와 benchmark claim의 근거다. 특정 model을 자동 승자로 고르는
          규칙은 원문 주장이 아니라 이 경로가 피하려는 오류다.
        </p>
        <SourceNotes sources={[
          { label: 'Arik & Pfister · TabNet', href: 'https://ojs.aaai.org/index.php/AAAI/article/view/16826', note: 'Sequential attention과 self-supervised tabular learning의 원 설계.' },
          { label: 'Gorishniy et al. · FT-Transformer', href: 'https://proceedings.neurips.cc/paper_files/paper/2021/hash/9d86d83f925f2149e9edb0ac3b49229c-Abstract.html', note: '강한 MLP baseline과 feature-token Transformer의 공정 비교.' },
          { label: 'Grinsztajn et al. · Tree vs Deep', href: 'https://proceedings.neurips.cc/paper_files/paper/2022/hash/0378c7692da36807bdec87ab043cdadc-Abstract-Datasets_and_Benchmarks.html', note: '전형적 중간 규모 표에서 tree inductive bias가 강한 이유를 분석한 benchmark.' },
          { label: 'Erickson et al. · TabArena', href: 'https://proceedings.neurips.cc/paper_files/paper/2025/hash/1697e3fb412da11dc9488249f9e7bbc9-Abstract-Datasets_and_Benchmarks_Track.html', note: 'Model version과 validation·ensemble budget을 갱신하는 living benchmark.' },
          { label: 'Hollmann et al. · TabPFN v2', href: 'https://www.nature.com/articles/s41586-024-08328-6', note: 'Synthetic prior에서 학습한 tabular foundation model과 작은 표 실험.' },
          { label: 'Grinsztajn et al. · TabPFN-3', href: 'https://arxiv.org/abs/2605.13986', note: '2026년 scaling, test-time compute와 확장 task를 보고한 기술 보고서.' },
        ]} />
      </section>
    </div>
  );
}
