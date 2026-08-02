import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  SpecialistEntry,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  ChinchillaApproachLab,
  ChinchillaEvidenceLab,
  ComputeAllocationLab,
} from './paper-chinchilla-2022/viz/ChinchillaPaperLabs';

function Formula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[12px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function PaperChinchilla2022() {
  return (
    <>
      <SpecialistEntry
        eyebrow="기반 논문 읽기"
        title="Chinchilla의 compute 배분 실험을 재구성하는 글"
        description="Pre-training을 처음 설명하는 글이 아니라, 고정된 계산 예산을 parameter와 training token 사이에 어떻게 나눌지 논문의 세 추정법과 full run 증거로 검산한다."
        prerequisites={[
          'Pre-training이 많은 text에서 next-token prediction을 반복하는 단계임을 안다.',
          'Parameter 수, training token 수와 FLOPs가 서로 다른 양임을 안다.',
          '같은 compute라는 조건에서 두 실험을 비교해야 한다는 뜻을 안다.',
          '로그-로그 graph에서 직선의 기울기가 power-law exponent를 나타낸다는 뜻을 안다.',
        ]}
        links={[
          { slug: 'llm-pretraining-scaling', title: 'LLM pre-training과 scaling', reason: 'Pre-training, token, parameter와 compute budget을 처음부터 배운다.' },
          { slug: 'probability-information-theory', title: '확률과 loss의 기초', reason: '예측 확률과 cross-entropy loss가 낮아진다는 뜻을 보강한다.' },
        ]}
      />
      <section id="research-question" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 GPU 예산이면 큰 모델과 더 많은 token 중 어디에 써야 할까?</h2>
        <QuestionLead
          question="Training FLOPs가 같다면 parameter 수가 가장 큰 모델이 언제나 가장 좋은가?"
          answer="아니다. Parameter를 키우면 한 token을 처리하는 비용이 커져 같은 compute에서 볼 수 있는 token 수가 줄어든다. 반대로 model을 너무 작게 하면 많은 data를 봐도 표현 용량이 병목이 된다. Chinchilla 논문은 model N과 token D를 함께 움직이며 loss가 가장 낮아지는 균형점을 세 가지 방법으로 추정하고, Gopher와 같은 compute의 70B full run으로 그 예측을 시험했다."
        />
        <ConceptPrimer items={[
          {
            term: 'Training compute C',
            meaning: '한 번의 pre-training에 사용한 전체 floating-point operation 예산이다.',
            why: 'Parameter와 token이라는 두 선택을 같은 비용 제약 안에서 비교한다.',
          },
          {
            term: 'Model size N',
            meaning: 'Training에서 update되는 non-embedding parameter 수다.',
            why: 'Model capacity뿐 아니라 token 하나를 처리하는 계산량과 inference memory도 바꾼다.',
          },
          {
            term: 'Training tokens D',
            meaning: 'Optimization 중 모델이 실제로 읽은 token의 총수다.',
            why: '문서 수가 아니라 model이 받은 학습 signal의 길이를 비용식에 넣는다.',
          },
          {
            term: 'Compute-optimal frontier',
            meaning: '각 compute budget에서 관측 loss가 가장 낮은 N·D 조합을 이은 경계다.',
            why: '“가장 큰 model”이 아니라 “주어진 비용에서 가장 낮은 loss”를 목표로 바꾼다.',
          },
        ]} />
        <Formula
          latex={String.raw`\underbrace{C}_{\text{training FLOPs}}\approx\underbrace{6}_{\text{Transformer 근사 계수}}\underbrace{N}_{\text{parameter 수}}\underbrace{D}_{\text{학습 token 수}}`}
          meaning="Dense Transformer training 비용을 parameter와 token의 곱으로 근사한다. C를 고정하면 N을 두 배로 늘릴 때 D를 절반으로 줄여야 하므로 가능한 조합이 무수히 많다. 이 식만으로 최적점은 나오지 않고, 각 조합의 loss를 관측하거나 모델링해야 한다."
          symbols={[
            [String.raw`C`, '한 training run에 허용된 전체 compute budget'],
            [String.raw`N`, 'Non-embedding model parameters'],
            [String.raw`D`, 'Training에서 처리한 token 수'],
            [String.raw`6`, 'Forward와 backward 연산을 합친 paper의 dense Transformer 근사'],
            ['곱 제약', '같은 compute에서 model capacity와 data exposure가 서로 trade-off하게 만듦'],
          ]}
        />
        <Misconception>
          “Chinchilla ratio=parameter당 20 tokens”는 결과 한 점을 편리하게 요약한 말이다. 논문의 실제 주장은
          compute가 늘 때 N과 D를 대략 비슷한 비율로 함께 늘리라는 scaling exponent다. Dataset, optimizer,
          architecture, 반복 epoch와 inference 수요가 바뀌어도 20이 고정된다는 법칙이 아니다.
        </Misconception>
      </section>

      <section id="three-approaches" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">세 방법은 같은 run에서 서로 다른 단면을 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            연구팀은 <strong>70M부터 16B</strong>까지 다양한 model과 <strong>5B부터 500B</strong> token
            길이를 포함한 400개 이상의 run을 사용했다. 첫 방법은 training 중간 curve 전체에서 compute별
            최소 loss envelope를 뽑는다. 두 번째는 compute를 아홉 값으로 고정하고 model size별 final loss
            valley를 찾는다. 세 번째는 앞의 관측을 하나의 loss 함수에 fit한다.
          </p>
          <p>
            독립적인 세 추정이 모두 parameter와 token을 compute의 약 제곱근에 비례해 늘리라는 결론에
            가까워졌다는 점이 중요하다. 한 fitting trick의 산물이 아니라 data를 자르는 방법을 바꿔도
            비슷한 frontier가 나왔다는 robustness check다.
          </p>
        </div>
        <ChinchillaApproachLab />
      </section>

      <section id="loss-fit" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Loss를 “남는 한계 + 작은 model + 부족한 data”로 분해한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Approach 3은 완벽한 predictor도 남기는 자연어 entropy E, parameter가 유한해서 생기는 항, training
            data와 optimization step이 유한해서 생기는 항을 더한다. 연구팀은 observed log loss와 predicted
            log loss의 Huber residual을 L-BFGS로 최소화했고 여러 initialization에서 가장 좋은 fit을 골랐다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\hat L(N,D)}_{\text{예측 loss}}=\underbrace{1.69}_{\text{줄일 수 없는 한계}}+\underbrace{\frac{406.4}{N^{0.34}}}_{\text{작은 model의 손실}}+\underbrace{\frac{410.7}{D^{0.28}}}_{\text{부족한 data의 손실}}`}
          meaning="N과 D가 커질수록 뒤의 두 항은 작아지지만 0이 되지는 않는다. 이 수치는 논문 실험의 tokenization, data와 architecture에 맞춘 empirical fit이며 자연 법칙 상수가 아니다. N과 D의 단위와 fit convention을 원문과 동일하게 유지해야 숫자를 재사용할 수 있다."
          symbols={[
            [String.raw`1.69`, '원문 fit의 irreducible loss E'],
            [String.raw`406.4/N^{0.34}`, 'Finite parameter capacity 때문에 남는 approximation 항'],
            [String.raw`410.7/D^{0.28}`, 'Finite training tokens와 optimization 때문에 남는 항'],
            [String.raw`0.34,0.28`, '관측 run에서 fit한 model/data loss exponent α와 β'],
            ['세 항의 합', 'Model과 data 중 한 축만 키웠을 때 다른 축의 병목이 남는 구조를 표현'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            C≈6ND 제약 아래 이 loss를 최소화하면 parameter exponent a는 data-loss exponent β가, token
            exponent b는 model-loss exponent α가 결정한다. 화면에 반올림해 쓴 α=.34, β=.28을 그대로 넣으면
            a≈.45, b≈.55다. 논문은 내부 fit의 반올림 전 값을 사용해 Approach 3을 a≈.46, b≈.54로 보고했다.
            Approach 1과 2의 직접 관측 fit은 각각 .50/.50과 .49/.51이었다.
          </p>
        </div>
        <Formula
          latex={String.raw`\underbrace{a}_{N\text{의 compute 지수}}=\frac{\underbrace{\beta}_{\text{data-loss 지수}}}{\alpha+\beta},\qquad\underbrace{b}_{D\text{의 compute 지수}}=\frac{\underbrace{\alpha}_{\text{model-loss 지수}}}{\alpha+\beta}`}
          meaning="Compute를 늘릴 때 Nopt∝Cᵃ, Dopt∝Cᵇ로 배분한다. a+b=1이므로 두 축의 증가를 곱하면 전체 compute 증가와 맞는다. 화면의 반올림된 α=.34, β=.28로는 a=.28/.62≈.45, b=.34/.62≈.55가 나온다. 논문의 .46/.54는 반올림 전 fitted exponent로 계산한 보고값이다."
          symbols={[
            [String.raw`\alpha`, 'Parameter를 늘릴 때 finite-model loss가 줄어드는 exponent'],
            [String.raw`\beta`, 'Token을 늘릴 때 finite-data loss가 줄어드는 exponent'],
            [String.raw`a+b=1`, 'C≈6ND 아래 두 scaling exponent 합이 1인 비용 일관성'],
            ['교차 배치', 'Model 쪽 allocation a가 반대편 data-loss exponent β에 의해 결정되는 최적화 결과'],
          ]}
        />
        <ComputeAllocationLab />
      </section>

      <section id="matched-compute" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">예측이 끝난 뒤 같은 compute의 70B model을 실제로 학습했다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Gopher는 280B parameters를 약 300B tokens로 학습했다. 논문의 분석은 같은
            <strong> 5.76×10²³ FLOPs</strong>에서 훨씬 작은 model을 더 오래 학습해야 한다고 예측했다. 연구팀은
            dataset과 계산 효율을 고려해 범위 안의 <strong>70B parameters, 1.4T tokens</strong>를 골라
            Chinchilla를 학습했다.
          </p>
          <p>
            이 비교가 중요한 이유는 benchmark가 하나 더 늘었기 때문이 아니다. Training compute를 맞춘 채
            N을 4분의 1로, D를 약 네 배 이상으로 바꿔 scaling prediction의 방향을 full run에서 검사했다.
            더 작은 Chinchilla는 MMLU, BIG-bench, reading comprehension과 closed-book QA 대부분에서 Gopher를
            앞섰고 inference memory도 작았다.
          </p>
        </div>
        <ChinchillaEvidenceLab />
      </section>

      <section id="limits" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">어디까지 일반화하면 논문 밖으로 나가는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            논문도 큰 scale에서 직접 비교한 run이 Chinchilla와 Gopher 두 개뿐이라고 적는다. Frontier를
            power law로 외삽했지만 high-compute에서 약간의 concavity가 관측되어 오히려 최적 model size를
            여전히 크게 예측했을 가능성도 인정한다. 분석 run은 모두 한 epoch 미만이므로 같은 data를 여러 번
            반복하는 regime은 검증하지 않았다.
          </p>
          <p>
            Chinchilla는 training compute를 고정한 질문에 답한다. 실제 제품에서는 model이 배포 후 몇 token을
            생성하는지, test-time sampling을 몇 번 하는지, memory와 latency가 어떤지까지 포함해야 한다.
            그 확장은 <InternalLink slug="llm-pretraining-scaling">Pre-training Scaling 의사결정</InternalLink>에서
            Sardana 이후 inference-aware 연구와 최신 test-time scaling을 함께 읽는다.
          </p>
        </div>
        <Misconception>
          Chinchilla가 모든 downstream task에서 Gopher를 이긴 것은 아니다. MMLU 57개 중 4개에서는 낮고
          2개는 같았다. 더 많은 web data는 contamination, privacy, toxicity와 bias 위험도 늘린다. Loss
          frontier와 배포 가능성, data 품질과 안전은 서로 다른 검증 축이다.
        </Misconception>
      </section>

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원문에서 현재 pre-training 설계로 올라간다</h2>
        <StopRule>
          C≈6ND, 세 approach의 서로 다른 관측 단면, fitted loss의 세 항, .50/.50에 가까운 allocation과
          70B·1.4T matched-compute 검증, 논문의 four limitation을 설명할 수 있으면 Chinchilla 아래의
          scaling 논문을 더 파지 않는다. 이제 계산으로 정한 token을 실제 학습 신호로 만드는{' '}
          <InternalLink slug="llm-data-engine">데이터 엔진</InternalLink>으로 올라간다.
        </StopRule>
        <CapabilityCheck items={[
          'Compute를 고정해도 N과 D 조합이 하나로 정해지지 않는 이유를 설명한다.',
          'Training-curve envelope, IsoFLOP valley와 parametric fit이 각각 어떤 data를 쓰는지 구분한다.',
          'α=.34와 β=.28에서 a≈.46, b≈.54가 나오는 관계를 설명한다.',
          '16× compute에서 Chinchilla와 Kaplan exponent가 N·D를 어떻게 다르게 늘리는지 계산한다.',
          '70B·1.4T와 280B·300B가 matched-compute 검증인 이유를 말한다.',
          '20 tokens/parameter를 고정 법칙으로 사용하지 않는다.',
          'Training-optimal과 inference-aware·test-time-optimal 질문을 구분한다.',
        ]} />
        <SourceNotes sources={[
          {
            label: 'Training Compute-Optimal Large Language Models · arXiv',
            href: 'https://arxiv.org/abs/2203.15556',
            note: '세 approach, fitted constants, Tables 2~10, appendices와 limitations의 1차 근거.',
          },
          {
            label: 'DeepMind publication',
            href: 'https://deepmind.google/research/publications/87125/',
            note: '공식 연구 출판 기록과 저자·venue 정보.',
          },
          {
            label: 'Scaling Laws for Neural Language Models',
            href: 'https://arxiv.org/abs/2001.08361',
            note: 'Table 2가 직접 비교한 Kaplan et al. 2020의 이전 compute-allocation 기준.',
          },
          {
            label: 'Gopher',
            href: 'https://arxiv.org/abs/2112.11446',
            note: 'Matched-compute 비교 대상의 architecture, data와 evaluation 설정을 대조하는 원문.',
          },
        ]} />
      </section>
    </>
  );
}
