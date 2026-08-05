import { Link } from 'react-router-dom';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import { DataEngineExplorer, StopRule } from './current-flows/viz/CurrentFlowExplorers';
import { articlePath } from '@/lib/paths';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function LlmDataEngineArticle() {
  return (
    <>
      <section id="signal-not-volume" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">데이터가 많다는 말로는 무엇을 놓칠까?</h2>
        <BeginnerBridge title="같은 분량의 식재료 상자라도 중복·상태·비율에 따라 전혀 다른 식사가 됩니다.">
          <InternalLink slug="llm-pretraining-scaling">앞 글에서 정한 token 예산</InternalLink>은 모델이 읽을 수 있는 <strong className="text-foreground">분량</strong>이다. 그러나 같은 문서가 반복되거나,
          본문 대신 광고가 들어가거나, 한 분야만 지나치게 많으면 같은 분량에서도 배울 신호가 달라진다. 여기서 <strong className="text-foreground">corpus</strong>는
          학습에 모은 문서 전체를, <strong className="text-foreground">데이터 엔진</strong>은 그 문서를 수집·추출·정제·중복 제거·혼합해 실제 token 흐름으로 바꾸는 과정을 뜻한다.
        </BeginnerBridge>
        <QuestionLead
          question="같은 30B token을 학습해도 왜 어떤 corpus는 작은 모델을 더 강하게 만들고, 어떤 corpus는 중복만 더 외우게 할까?"
          answer="모델이 보는 것은 문서의 개수가 아니라 tokenizer를 통과한 token sequence의 분포다. 수집 source, 본문 추출, 중복 제거, 품질 선택, domain mixture와 합성·검증 규칙이 모두 그 분포를 바꾼다. 따라서 데이터는 파일 묶음이 아니라 versioned transformation pipeline이다."
        />
        <ConceptPrimer items={[
          { term: 'Source provenance', meaning: '문서가 어디서, 언제, 어떤 license와 처리 경로로 왔는지 나타내는 계보다.', why: '문제가 발견됐을 때 해당 source만 제거하고 재현하려면 text와 함께 보존해야 한다.' },
          { term: 'Quality signal', meaning: '문서가 학습 목적에 유용할 가능성을 나타내는 heuristic 또는 learned score다.', why: '객관적인 참/거짓 표가 아니라 어떤 분포를 남길지 정하는 정책임을 알아야 한다.' },
          { term: 'Mixture', meaning: 'web·code·math·대화·다국어 source가 학습 token에서 차지할 비율이다.', why: '원본 corpus 크기가 아니라 sampling rule이 모델이 실제로 경험할 빈도를 결정한다.' },
          { term: 'Contamination', meaning: '평가 문제나 거의 같은 풀이가 train data에 들어간 상태다.', why: '능력 향상과 정답 암기를 구분하지 못하면 data ablation 전체가 무효가 된다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>다음-token objective는 어떤 source가 좋은지 스스로 판단하지 않는다. 자주 샘플된 token에 더 많은 gradient를 줄 뿐이다. 같은 문서를 열 번 복제하면 새로운 사실은 늘지 않지만 그 문장의 update 비중은 열 배 가까이 커진다. 반대로 지나치게 강한 품질 필터는 문법이 불완전한 실제 대화, 저자원 언어, 희귀 전문 문서를 함께 지울 수 있다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\mathcal L(\theta)}_{\text{전체 학습 손실}}=\sum_{d\in\mathcal D}\underbrace{w(d)}_{\text{문서가 뽑히는 비중}}\sum_{t=1}^{|d|}\underbrace{-\log p_\theta(x_t\mid x_{<t})}_{\text{현재 문맥에서 다음 token을 맞히는 손실}}`}
          meaning="데이터 recipe가 모델에 들어가는 위치는 w(d)다. 문서를 남길지, 몇 번 뽑을지, 어느 domain을 upsample할지가 동일한 next-token loss 안에서 gradient의 비중을 바꾼다. 좋은 데이터라는 말은 w(d)를 어떤 목적과 증거로 설계했는지까지 포함해야 한다."
          symbols={[[String.raw`\mathcal D`, '정제와 혼합을 거친 학습 문서 집합'], [String.raw`w(d)`, '문서 d의 sampling weight'], [String.raw`x_t`, '문서 안 t번째 token'], [String.raw`p_\theta`, '현재 모델이 예측한 조건부 token 확률']]}
        />
        <Misconception>“교과서 데이터만 있으면 된다”와 “웹 데이터를 전부 넣으면 된다”는 둘 다 일반 법칙이 아니다. Phi 계열은 합성된 textbook-quality data의 가능성을 보였고, FineWeb은 대규모 web data에서 추출·필터·dedup recipe가 중요함을 보였다. 목표 능력과 평가 분포가 다르면 최적 mixture도 달라진다.</Misconception>
      </section>

      <section id="pipeline" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원문이 학습 token이 되기까지</h2>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">웹 문서 하나가 바로 학습 예제가 되는 것은 아니다. 다음 장면은 수집·추출과 정규화·정제·중복 제거·혼합과 합성·감사 책임을 구분하고, 품질 필터 강도와 합성 후보 비율을 바꿨을 때 보존 token, 잔여 중복, 희귀 영역 coverage와 검증된 합성 비율이 어떻게 함께 움직이는지 보여준다.</p>
        <DataEngineExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>수집</strong>은 WARC, repository snapshot, PDF 같은 원본과 metadata를 immutable layer로 남긴다. <strong>추출</strong>은 navigation, cookie banner와 광고를 제거하되 code block, 수식, 표, 문단 경계를 보존한다. 여기서 깨진 줄바꿈과 encoding 오류를 그대로 두면 이후 quality model은 내용이 아니라 parser 실패를 점수화한다.</p>
          <p><strong>정규화</strong>는 Unicode, whitespace와 identifier를 다루지만 의미 있는 차이까지 지우면 안 된다. Code의 indentation, 수식의 minus sign, 한국어 조사와 띄어쓰기는 단순한 장식이 아니다. <strong>중복 제거</strong>는 exact hash로 같은 byte를 찾는 단계와 n-gram fingerprint로 문장 일부가 겹치는 near duplicate를 찾는 단계를 나눈다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{J(A,B)}_{\text{두 문서의 n-gram 중복도}}=\frac{\underbrace{|S_A\cap S_B|}_{\text{공통 n-gram 수}}}{\underbrace{|S_A\cup S_B|}_{\text{전체 고유 n-gram 수}}}`}
          meaning="문서 A와 B를 같은 규칙의 n-gram 집합으로 바꾸면 Jaccard similarity로 near duplicate를 정의할 수 있다. 공백 단어, Unicode 문자, UTF-8 byte 중 무엇을 한 단위로 삼았는지가 먼저 고정돼야 한다. Threshold가 너무 낮으면 서로 다른 설명까지 삭제하고, 너무 높으면 template만 바꾼 복제 문서를 남긴다. MinHash는 이 값을 web scale에서 근사할 뿐 단위와 threshold를 대신 결정하지 않는다."
          symbols={[[String.raw`S_A,S_B`, '같은 언어별 분절·정규화 규칙으로 문서 A와 B에서 만든 n-gram 집합'], [String.raw`S_A\cap S_B`, '두 문서에 공통으로 등장한 구간'], [String.raw`S_A\cup S_B`, '두 문서 전체의 고유 구간'], [String.raw`J(A,B)`, '0에서 1 사이의 근사 중복도']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p data-dedup-unit-contract><strong>n-gram의 단위도 recipe다.</strong> 영어처럼 공백 분절이 비교적 안정적인 corpus는 word n-gram을 쓸 수 있지만, 중국어·일본어처럼 공백이 단어 경계를 주지 않거나 태국어처럼 별도 분절기가 필요한 언어에 같은 규칙을 그대로 옮기면 중복도가 조용히 달라진다. 이때는 Unicode 정규화 뒤 character 또는 byte n-gram을 쓰거나 언어별 분절기를 고르고, n과 threshold를 언어 slice별 사람이 확인한 duplicate pair로 다시 보정한다. Jaccard는 공통 n-gram을 전체 고유 n-gram으로 나눈 비율이므로, 서로 다른 단위에서 얻은 Jaccard 0.8은 같은 판정이 아니다.</p>
          <p>MinHash는 n-gram 집합의 Jaccard를 근사하는 경로이고, SimHash는 문서 feature를 bit fingerprint로 압축한 뒤 Hamming distance로 비교하는 다른 경로다. FineWeb의 MinHash와 C4Corpus의 SimHash는 모두 near-duplicate 후보를 좁히지만 같은 score나 threshold를 공유하지 않는다.</p>
        </div>
        <div data-data-audit-rail className="not-prose my-8 grid gap-2 lg:grid-cols-6">
          {[
            { number: '01', label: '수집', flow: 'URL·repo·PDF → raw object', audit: 'source · time · license · checksum', failure: '삭제 요청과 version을 되짚지 못한다.' },
            { number: '02', label: '추출·정규화', flow: 'raw object → structured text', audit: 'parser · Unicode rule · block warning', failure: '수식·code·표와 의미 있는 문자가 붕괴한다.' },
            { number: '03', label: '정제', flow: 'text → accepted / rejected', audit: 'rule · score · 탈락 이유', failure: '언어·방언·문체를 낮은 품질로 오판한다.' },
            { number: '04', label: '중복 제거', flow: 'docs → cluster 대표', audit: 'cluster · similarity · retained id', failure: '희귀하지만 비슷한 설명까지 삭제한다.' },
            { number: '05', label: '혼합·합성', flow: 'source shards → token stream', audit: 'weight · verifier · seed · parent id', failure: '큰 domain이나 복제된 합성 예제가 빈도를 독점한다.' },
            { number: '06', label: '감사', flow: 'token stream → release manifest', audit: 'PII · contamination · slice retention', failure: '평가 답이나 민감 정보와 조용한 coverage 손실을 놓친다.' },
          ].map((stage) => (
            <div key={stage.number} className="min-w-0 rounded-md border border-border p-4">
              <div className="flex items-center justify-between gap-2"><strong className="text-sm">{stage.label}</strong><span className="font-mono text-[10px] font-black text-muted-foreground">{stage.number}</span></div>
              <p className="mt-3 break-words font-mono text-[11px] leading-relaxed text-foreground">{stage.flow}</p>
              <p className="mt-3 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">남길 audit</p>
              <p className="mt-1 break-words text-[11px] leading-relaxed text-muted-foreground">{stage.audit}</p>
              <p className="mt-3 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground"><strong className="text-amber-700 dark:text-amber-300">실패 · </strong>{stage.failure}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="selection" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">필터와 혼합은 어떤 분포를 만드는가?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>필터는 쓰레기를 제거하는 청소기가 아니라 raw distribution에서 train distribution으로 가는 selection operator다. Language ID, repetition ratio, perplexity, 교육 가치 classifier를 통과할 확률이 문서마다 다르면 남은 corpus는 그 classifier의 선호를 반영한다. 그래서 filter precision만 볼 것이 아니라 어떤 집단의 recall이 떨어졌는지 stratified audit가 필요하다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
            \underbrace{\widetilde p(d)}_{\text{정규화 전 비중}}
            &=\underbrace{s(d)}_{\text{선택 점수}}
              \underbrace{m_{k(d)}}_{\text{영역별 비중}}\\
            &\quad\cdot\underbrace{p_{\mathrm{raw}}(d)}_{\text{원본 분포}}\\
            \underbrace{Z}_{\text{전체 비중의 합}}
            &=\sum_{d'\in\mathcal D}\widetilde p(d')\\
            \underbrace{p_{\mathrm{train}}(d)}_{\text{실제 학습 분포}}
            &=\frac{\widetilde p(d)}{Z}
          \end{aligned}`}
          meaning="먼저 원본 분포에 선택 점수와 영역별 혼합 비중을 곱해 문서별 상대 비중을 만든다. 그 상대 비중을 전체 합 Z로 나누면 모델이 실제로 볼 학습 분포가 된다. 특정 영역의 원본 데이터가 적어도 m을 높이면 자주 볼 수 있고, 선택 점수가 0이면 혼합 비중을 높여도 사라진다."
          symbols={[[String.raw`p_{\mathrm{raw}}(d)`, '수집 단계에서 문서 d가 나타나는 원본 분포'], [String.raw`s(d)`, '선택기가 문서를 남기는 정도'], [String.raw`m_{k(d)}`, '문서가 속한 영역의 추출 비율'], [String.raw`\widetilde p(d)`, '아직 합이 1이 아닌 문서별 상대 추출 비중'], [String.raw`Z`, '모든 문서의 상대 비중을 더한 정규화 상수'], [String.raw`p_{\mathrm{train}}(d)`, '정규화가 끝난 뒤 학습기가 문서 d를 실제로 뽑을 확률']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Mixture는 static percentage로 끝나지 않는다. 학습 초기에 일반 web을 넓게 보고 뒤에서 code·math·long-context를 늘리는 curriculum, loss가 빠르게 줄어드는 domain을 덜 뽑는 online reweighting도 가능하다. 다만 adaptive mixture는 모델 상태와 데이터 분포가 함께 바뀌므로 비교 실험이 더 어려워진다. 작은 모델에서는 먼저 고정 mixture를 만들고 domain별 held-out loss를 관찰하는 편이 원인 추적에 유리하다.</p>
        </div>
      </section>

      <section id="synthetic" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">합성 데이터는 언제 새 신호가 되는가?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>합성 데이터의 장점은 무에서 사실을 만드는 데 있지 않다. 이미 가진 seed를 난이도·형식·언어·오류 유형별로 변환하고, 자동 검증기를 붙여 필요한 training signal의 밀도를 높이는 데 있다. Code unit test, 수학 정답, schema validation처럼 결과를 검증할 수 있으면 생성량보다 <strong>통과한 다양성</strong>이 중요하다.</p>
          <p>안전한 loop는 generator와 verifier를 분리한다. 같은 모델이 문제와 답을 만들고 자기 점수로 모두 통과시키면 공통 blind spot이 증폭된다. Rule-based verifier, 실행 환경, 별도 judge, 인간 spot audit를 섞고 seed 및 parent id를 남겨 같은 예제의 수백 변형이 train·test 양쪽에 퍼지지 않게 해야 한다.</p>
          <p>2025~2026년 Nemotron 3 공개 data도 이 흐름을 구체적으로 보여 준다. 최근 Common Crawl snapshot을 정제한 web token, 수식과 code block을 보존한 code 추출, 합성 rephrasing·번역, STEM·과학 coding 같은 전문 합성 묶음을 서로 다른 이름과 version으로 배포한다. 중요한 점은 “합성 비율이 높을수록 좋다”가 아니라 <strong>원본·변환·검증 목적이 다른 data product를 분리해 ablation할 수 있게 만든다</strong>는 것이다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}(q,a)\in\underbrace{\mathcal D_{syn}^{*}}_{\text{채택할 합성 데이터}}\iff{}&\underbrace{V(q,a)=1}_{\text{정답·실행 검증 통과}}\\[-0.1em]&\land\underbrace{N(q,a)>\tau_n}_{\text{기존 데이터와 충분히 다름}}\\[-0.1em]&\land\underbrace{P(q,a)=1}_{\text{출처·정책 조건 충족}}\end{aligned}`}
          meaning="합성 sample은 생성됐다는 이유로 들어가지 않는다. 정답·실행 검증 V, 기존 corpus와의 novelty N, provenance와 정책 검사 P를 모두 통과한 교집합만 채택한다. Novelty가 낮으면 정확해도 사실상 중복이고, verifier만 통과해도 잘못된 shortcut을 학습할 수 있다."
          symbols={[[String.raw`q,a`, '합성된 문제와 답 또는 입력과 출력'], [String.raw`V`, '정답·unit test·schema verifier'], [String.raw`N`, '기존 데이터와의 novelty score'], [String.raw`P`, 'license, provenance, safety 정책 검사']]}
        />
        <Misconception>합성 데이터는 공짜 데이터가 아니다. Teacher inference, verifier 실행, dedup, rejection sampling과 audit에 compute가 든다. 실패한 sample을 버리는 비용까지 포함해 “검증된 token당 비용”을 계산해야 한다.</Misconception>
      </section>

      <section id="evaluation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">오염 없이 데이터 효과를 어떻게 검증할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Data ablation에서는 model architecture, tokenizer, token budget, optimizer와 evaluation harness를 고정해야 한다. <strong>DataComp-LM(DCLM)</strong>이 모델을 고정하고 데이터만 경쟁시키는 이유가 여기에 있다. 한 recipe가 더 좋다는 주장은 같은 compute에서 여러 downstream task와 domain held-out loss가 개선되고, contamination scan 뒤에도 차이가 남을 때 의미가 있다.</p>
          <p>Exact benchmark string 검색만으로는 부족하다. 문제 문장 paraphrase, answer rationale, code test와 source document의 near duplicate를 별도 index로 검사한다. 최신 자료를 넣을 때는 time split도 유용하다. Train cutoff 이후 출판된 문서로 평가하면 직접 암기의 가능성을 낮출 수 있다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{M_A}_{\text{기준 recipe의 점수}}&=M(\theta_A;\mathcal E_{clean})\\[0.45em]
\underbrace{M_B}_{\text{새 recipe의 점수}}&=M(\theta_B;\mathcal E_{clean})\\[0.45em]
\underbrace{\Delta_{data}}_{\text{데이터 recipe의 추정 효과}}&=M_B-M_A\\[0.45em]
\underbrace{C_A}_{\text{기준 학습 compute}}&=\underbrace{C_B}_{\text{새 학습 compute}}
\end{aligned}`}
          meaning="A와 B의 model·compute 조건을 고정하고 contamination을 제거한 평가 E_clean에서 metric 차이를 본다. 한 seed의 작은 차이는 noise일 수 있으므로 checkpoint curve, 여러 seed 또는 task bootstrap interval을 함께 본다."
          symbols={[[String.raw`\theta_A,\theta_B`, '서로 다른 data recipe로 학습한 모델'], [String.raw`M_A,M_B`, '같은 clean evaluation에서 측정한 두 recipe의 점수'], [String.raw`\Delta_{data}`, '다른 조건을 고정했을 때 새 data recipe가 만든 metric 차이의 추정값'], [String.raw`\mathcal E_{clean}`, '오염 검사를 통과한 평가 집합'], [String.raw`C_A=C_B`, '비교할 때 고정한 training compute']]}
        />
      </section>

      <section id="small-model" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4B·9B 모델에서는 무엇을 우선할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>작은 모델은 capacity가 제한되어 모순되고 낮은 신호의 데이터를 모두 흡수하기 어렵다. 먼저 target workload를 5~10개 capability slice로 나누고 각 slice에 clean held-out set을 만든다. 그 뒤 작은 proxy model로 extraction·filter·mixture ablation을 짧게 돌려 recipe를 좁힌다. 최종 4B·9B run은 선택된 recipe만 사용한다.</p>
          <p>추천 최소 실험은 ① 동일 tokenizer와 3개의 1B-token mixture, ② 300M~1B proxy의 동일 compute 학습, ③ domain loss·downstream score·memorization scan, ④ 상위 recipe를 4B로 확장, ⑤ 9B에서 scaling trend가 유지되는지 확인하는 순서다. Proxy 순위가 큰 모델에서도 항상 유지되지는 않으므로 마지막 transfer check를 생략하지 않는다.</p>
        </div>
        <StopRule>모든 공개 dataset을 모으는 데서 시작하지 않는다. 목표 평가, provenance schema, baseline recipe와 한 번에 하나만 바꾸는 ablation이 준비되면 학습으로 넘어간다.</StopRule>
        <CapabilityCheck items={[
          '문서 수·byte·token 수와 effective sampling weight를 구분해 계산한다.',
          '필터가 제거한 noise와 함께 잃은 언어·domain coverage를 stratified audit한다.',
          'Exact duplicate, near duplicate와 benchmark contamination을 서로 다른 검사로 설계한다.',
          '합성 generator, verifier, novelty와 provenance를 분리한 acceptance pipeline을 만든다.',
          '같은 model·compute 조건에서 data recipe만 바꾸는 ablation을 설계한다.',
          '작은 proxy 결과를 4B·9B로 옮길 때 필요한 transfer check를 설명한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'DataComp-LM', href: 'https://www.datacomp.ai/dclm/', note: '고정된 모델·학습 code와 53개 downstream 평가로 데이터 선택을 비교하는 benchmark.' },
          { label: 'Hugging Face · FineWeb', href: 'https://huggingface.co/datasets/HuggingFaceFW/fineweb', note: '추출, language·quality filter, MinHash dedup과 공개 ablation을 포함한 web-scale recipe.' },
          { label: 'LREC · C4Corpus', href: 'https://aclanthology.org/L16-1146/', note: '다국어 web corpus에서 character n-gram shingle과 SimHash를 사용한 near-duplicate pipeline의 원문.' },
          { label: 'Microsoft Research · Textbooks Are All You Need II', href: 'https://www.microsoft.com/en-us/research/publication/textbooks-are-all-you-need-ii-phi-1-5-technical-report/', note: '작은 모델을 위한 textbook-quality 및 NLP 합성 데이터의 대표 사례.' },
          { label: 'NVIDIA Research · Nemotron 3 data releases', href: 'https://research.nvidia.com/labs/nemotron/Nemotron-3/', note: '2025~2026 model family와 함께 web·code·specialized synthetic data를 목적·version별로 공개한 현재 사례.' },
        ]} />
        <div className="not-prose mt-8 border-y border-border">
          <Link to={articlePath('ai', 'llm-pretraining-run')} className="grid gap-1 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[10rem_1fr_auto] sm:items-start sm:px-2">
            <strong className="text-sm">다음 · 학습 실행</strong>
            <span className="text-sm leading-6 text-muted-foreground">이 data manifest를 update당 token, 분산 state, checkpoint·resume와 clean evaluation을 가진 실제 LLM run으로 닫는다.</span>
            <span className="hidden text-sm text-muted-foreground sm:block">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
