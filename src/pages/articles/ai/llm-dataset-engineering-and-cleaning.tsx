import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LlmDatasetEngineeringAndCleaningViz from "./llm-dataset-engineering-and-cleaning/viz/LlmDatasetEngineeringAndCleaningViz";

/**
 * 데이터셋 엔지니어링은 필터링·dedup·mixture로 학습 데이터 품질을 만듭니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function LlmDatasetEngineeringAndCleaningArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          LLM 데이터셋은 원본을 그대로 쓰지 않고 여러 단계를 거쳐 다시 만들어집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            웹 크롤 원본을 그대로 모델에 넣으면 저품질 텍스트와 중복 문서, 평가 benchmark와
            겹치는 문항까지 함께 섞여 들어가 학습도 평가도 신뢰할 수 없게 됩니다. 그래서
            pretraining용 corpus는 source 선택부터 여러 단계를 거치는 하나의 dataset
            engineering 파이프라인으로 다시 만들어집니다.
          </p>
          <p>
            이 글은 그 파이프라인을 따라갑니다. 원본 문서 하나가 각 단계를 지나며 무엇이 왜 걸러지는지 순서대로 봅니다. Source를 고르고 filtering·정규화로 품질을
            만듭니다. 이어서 dedup·contamination 검사로 겹치는 문서와 평가 유출을 걷어내고 annotation으로 label을 붙인 다음
            mixture·curriculum으로 학습 배치를 정합니다. 이렇게 다섯 단계입니다.
          </p>
          <p>
            <Link to="/ai/llm-training-stages#pretraining">Pretraining objective</Link> 글은
            다음 token 확률을 낮추는 loss 자체를 다루고, 그 loss가 보는 데이터 분포가 어떻게
            만들어지는지는 이 글에 넘겨 둡니다. 이 글은 그 분포, 즉 corpus 자체를 만드는 공학에만
            집중합니다.
          </p>
        </div>
        <ContentBoundary article="llm-dataset-engineering-and-cleaning" />
      </section>

      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Dataset engineering은 source부터 curriculum까지 잇는 파이프라인입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pretraining에 쓸 corpus를 만드는 전체 작업이 dataset engineering입니다. 그 작업이 순서대로 이어지는 단계 목록은 data generation
            pipeline이라 부릅니다. 한 문서가 이 pipeline에 들어오는 저장소가 data source입니다. 웹 크롤·코드 저장소·책·논문 같은 원본이 여기 해당합니다.
          </p>
          <p>
            Data curation은 여러 source를 목적에 맞게 고르고 비중을 다듬는 활동입니다. source를 통째로 넣거나 빼는 판단이므로 다음 절에서 다룰 문서 단위
            filtering보다 선택의 단위가 거칩니다.
          </p>
          <p>
            Gao et al.의 The Pile은 22개의 서로 다른 도메인 subset을 의도적으로 섞어 만든 825GiB 코퍼스입니다. 웹 크롤에는 적게 등장하는 학술 논문·코드·책
            같은 도메인을 일부러 더 많이 넣어야 그 도메인에서도 모델이 성능을 낸다는 것을 보여준 초기 사례입니다.
          </p>
          <p>
            AI2의 Dolma는 이 pipeline을 실제로 구현합니다. 웹, 학술논문, 코드, 책, SNS,
            백과사전을 source mixing으로 모은 뒤 quality filtering, dedup, PII 및 유해
            콘텐츠 필터링을 순서대로 적용해 3조 token 규모 공개 코퍼스를 만들었습니다.
          </p>
        </div>
        <LlmDatasetEngineeringAndCleaningViz />
        <AlgorithmBlock
          title="Raw corpus를 pretraining용 dataset으로 만드는 절차"
          input={[
            "raw_documents: source별 원본 문서 모음",
            "benchmark_texts: contamination 검사에 쓸 평가 문항",
            "domain_targets: 도메인별 목표 mixture 비율",
          ]}
          steps={[
            { code: "filtered = quality_filter(raw_documents)", note: "언어 식별·휴리스틱 규칙으로 저품질 문서를 통째로 제거합니다." },
            { code: "cleaned = normalize(filtered)", note: "인코딩·공백·기호를 표준 형식으로 통일해 이후 비교를 안정시킵니다." },
            { code: "deduped = deduplicate(cleaned)", note: "exact·near-duplicate·semantic 세 층위로 겹치는 문서를 제거합니다." },
            { code: "clean = remove_contaminated(deduped, benchmark_texts)", note: "benchmark 문항과 n-gram·substring이 겹치는 문서를 걸러냅니다." },
            { code: "labeled = annotate(clean)", note: "사람·모델·weak supervision·pseudo-label로 학습에 쓸 label을 붙입니다." },
            { code: "mixture = resample(labeled, domain_targets)", note: "도메인별 목표 비율에 맞춰 업·다운샘플링 가중치를 정합니다." },
            { code: "curriculum = order(mixture, difficulty_schedule)", note: "쉬운 데이터부터 어려운 데이터 순서로 학습 스텝에 배치합니다." },
          ]}
          output="dataset: pretraining loop가 그대로 소비하는 순서 있는 학습 corpus"
        />
      </section>

      <section id="quality" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Data filtering·cleaning은 quality 기준으로 문서를 고치고 통일합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Data quality는 문서 하나가 학습에 남을 가치가 있는지 판단하는 기준입니다. 그 기준에 미달하는 문서를 통째로 들어내는 작업이 data filtering입니다. 남은
            문서 안의 깨진 인코딩·boilerplate 같은 결함을 고치는 쪽은 data cleaning이라 부릅니다.
          </p>
          <p>
            Cleaning 결과를 대소문자·유니코드·공백 같은 표준 형식으로 통일하면 data normalization입니다. 같은 대상을 가리키는 여러 표기를 하나의 표준 형태로
            되돌리는 쪽은 data canonicalization입니다. URL의 http/https, 전각·반각 숫자 같은 표기가 여기 해당합니다.
          </p>
          <p>
            Penedo et al.의 RefinedWeb은 "제대로 필터링하고 dedup한 웹 데이터만으로도" The Pile처럼 사람이 큐레이션한 코퍼스를 능가하는 모델을 만들 수
            있음을 보였습니다. filtering·cleaning은 생략 가능한 전처리가 아닙니다. 최종 성능을 가르는 단계입니다.
          </p>
          <p>
            Zhou et al.의 LIMA는 반대 방향의 증거입니다. 65B 모델을 정교하게 고른 1,000개 prompt-response 쌍만으로 instruction tuning해도
            GPT-4 응답과 대등한 평가를 받았습니다. 저자들은 이를 데이터 양보다 quality와 다양성이 결과를 더 많이 좌우한다는 "superficial alignment
            hypothesis"로 설명합니다.
          </p>
        </div>
        <TermBreakdown
          title="Quality 파이프라인의 네 층위"
          description="같은 '정제'라는 말 아래 있지만 서로 다른 단위에서 동작합니다."
          items={[
            { term: "Data Quality", description: "문서 하나가 학습에 남을 가치가 있는지 판단하는 기준입니다.", example: "언어 판별 confidence, perplexity, 문장 반복 비율 같은 지표.", boundary: "기준 자체가 모호하면 filtering 결과도 도메인마다 들쭉날쭉해집니다." },
            { term: "Data Filtering", description: "기준 미달 문서를 통째로 코퍼스에서 제거합니다.", example: "언어 판별 실패, 스팸 키워드 과다 문서를 삭제.", boundary: "기준이 너무 엄격하면 소수 도메인 데이터까지 함께 사라집니다." },
            { term: "Data Cleaning", description: "남은 문서 안의 결함(깨진 인코딩·boilerplate)을 고칩니다.", example: "HTML 태그·네비게이션 문구 제거, mojibake 복구.", boundary: "규칙 기반 cleaning은 예상 못한 형식에서 오히려 텍스트를 훼손할 수 있습니다." },
            { term: "Data Normalization · Canonicalization", description: "형식을 표준화하고(normalization) 같은 대상의 여러 표기를 하나로 되돌립니다(canonicalization).", example: "전각 숫자 '１２３'을 '123'으로, http/https URL을 한 표준으로 통일.", boundary: "지나친 canonicalization은 원문이 의도한 표기 차이(코드 대소문자 등)까지 지울 수 있습니다." },
          ]}
        />
      </section>

      <section id="dedup-contamination" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Dedup은 내부 중복을, contamination 검사는 benchmark 겹침을 지웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            동일하거나 거의 동일한 문서를 코퍼스에서 제거하는 작업이 data deduplication입니다. 정확히 같은 문서(exact duplicate)뿐 아니라 광고 배너 한 줄만
            다른 문서까지 잡아내면 near-duplicate detection입니다. 표현은 달라도 뜻이 같은 문서를 embedding 유사도로 걸러내는 쪽이 semantic
            deduplication입니다.
          </p>
          <p>
            Near-duplicate detection의 표준 도구는 Broder가 제안한 MinHash입니다. 문서를 k개 단어의 연속 부분열(shingle) 집합으로 바꿉니다. 각
            shingle 집합에 여러 개의 해시 함수를 적용해 그중 최솟값만 남기면 sketch가 나옵니다. 두 문서 sketch가 같은 해시 함수에서 일치한 비율로 Jaccard
            유사도를 추정합니다.
          </p>
        </div>
        <ExplainedFormula
          question="해시 함수를 몇 개 써야 MinHash 추정치를 얼마나 믿을 수 있는가"
          idea="각 해시 함수의 일치 여부는 참값 J를 평균으로 갖는 독립 시행이라, 시행 횟수 K가 늘수록 평균의 분산이 K에 반비례해 줄어듭니다."
          formula={String.raw`\mathrm{Var}[\hat{J}] = \frac{J(1-J)}{K}`}
          annotatedFormula={String.raw`\mathrm{Var}[\hat{J}] = \underbrace{\frac{J(1-J)}{K}}_{\text{시행 K개 평균의 분산}}`}
          operations={[
            { expression: String.raw`J(1-J)`, annotation: ["참 Jaccard 유사도 J가 0.5에 가까울수록", "한 번의 해시 일치 시행이 갖는 분산이 커짐"] },
            { expression: String.raw`\frac{\cdot}{K}`, annotation: ["해시 함수(permutation) 개수 K로 나눠", "여러 시행 평균의 분산을 줄임"] },
          ]}
          terms={[
            { symbol: "J", name: "참 Jaccard 유사도", description: "두 문서의 shingle 집합 교집합 크기를 합집합 크기로 나눈 값." },
            { symbol: "K", name: "해시 함수 개수", description: "MinHash sketch를 만들 때 쓰는 독립 해시 함수(또는 permutation) 개수." },
            { symbol: String.raw`\hat{J}`, name: "MinHash 추정치", description: "K개 해시 함수 중 두 sketch가 일치한 비율로 만든 J의 unbiased estimator." },
          ]}
          assumptions={["K개 해시 함수가 서로 독립이라고 가정합니다.", "shingle 크기 k는 문서 언어·길이에 맞춰 고정값으로 미리 정합니다."]}
          interpretation="표준편차는 √(J(1-J)/K)로 K의 제곱근에 반비례합니다. J≈0.8인 near-duplicate 후보에서 K=128이면 표준편차가 약 0.035, K=512로 4배 늘리면 약 0.018로 절반 가까이 줄어듭니다. K를 늘려도 오차가 0이 되지는 않으므로 near-duplicate 판정에는 항상 threshold와 함께 오차 범위를 명시해야 합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Data contamination은 benchmark의 test 문항이 학습 데이터 안에 이미 들어 있는 상태를 말합니다. 그와 거의 같은 문구가 들어 있어도 마찬가지입니다.
            이러면 모델이 실제로는 암기한 답을 냈는데 평가하는 쪽은 그것을 일반화로 오인합니다. n-gram이나 substring 겹침으로 학습 데이터와 benchmark 사이 중복을
            찾는 절차는 contamination detection이라 부릅니다.
          </p>
          <p>
            이 절차의 임계값은 모델 세대마다 달라졌습니다. GPT-2는 evaluation set의 8-gram이 학습 데이터에 있는지를 봤고 GPT-3는 13-gram 겹침을 기준으로
            삼았습니다. GPT-4는 단어 단위 n-gram 대신 50글자 substring 일치로 바꿨고 Llama-2는 단어 대신 token 단위 10-gram(최대 4개 위치 skip
            허용)을 씁니다.
          </p>
          <p>
            임계값이 짧을수록(8-gram) 우연한 일치까지 contamination으로 잡아 false positive가 늘고 길수록(50자 substring) 놓치는 진짜 유출이 늘 수
            있습니다. 어느 임계값을 써도 문장을 바꿔 쓴 rephrasing 유출은 정확 일치 방식으로는 잡히지 않는다는 한계가 남습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Data contamination과 train/val/test selection feedback은 다른 문제입니다"
          preview="Benchmark가 학습 데이터에 새어 들어간 것과, 연구자가 test 점수를 보고 설계를 고친 것은 둘 다 '오염'이라 불리지만 발생 위치가 다릅니다."
        >
          <p>
            <Link to="/ai/train-validation-test#selection-feedback">Test-set reuse
            contamination</Link>은 연구자가 test 결과를 관찰한 뒤 model이나 threshold, prompt를
            바꿔 그 test가 독립적인 최종 평가 역할을 잃는 상황을 가리킵니다.
          </p>
          <p>
            이 글의 data contamination은 그보다 앞선 시점, corpus를 만드는 단계에서 benchmark 원문이 학습 데이터에 섞여 드는 문제입니다. 앞의 오염은 평가를
            반복 관찰하는 절차에서 생기고 이쪽은 corpus 구성 단계에서 생기므로 같은 이름의 오염이라도 고치는 지점이 다릅니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="annotation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Annotation은 label을 누가 붙이느냐로 human·model로 갈립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Data annotation은 원본 데이터에 label·rating·rationale 같은 부가 정보를 붙이는 작업 전체를 가리킵니다. 사람이 직접 붙이면 human
            annotation, 더 큰 모델이 대신 붙이면 model annotation입니다.
          </p>
          <p>
            Gilardi et al.은 트윗 2,382개에 관련성·입장·주제 같은 5개 annotation task를 수행시켜 비교했습니다. ChatGPT의 zero-shot 정확도가
            5개 중 4개 task에서 crowd-worker를 앞섰고 비용은 건당 0.003달러 미만으로 MTurk보다 약 20배 저렴했습니다. 다만 이 결과는 트윗 기반 5개 task에
            한정되며 모든 annotation 작업에 일반화되지는 않습니다.
          </p>
          <p>
            Weak supervision은 정답 label 없이 여러 개의 약한 규칙(labeling function)을 결합해 label을 추정하는 방법입니다. Ratner et
            al.의 Snorkel은 정확도가 제각각인 labeling function들의 출력을 노이즈 모델로 묶습니다. 전문가가 손으로 레이블링한 것보다 2.8배 빠르게 모델을
            만들면서도 대규모 수동 레이블 데이터셋 대비 평균 3.6%p 이내 성능을 냈습니다.
          </p>
          <p>
            Pseudo-labeling은 학습 중인 모델 자신의 confident 예측을 다시 label로 재사용합니다. Lee가 제안한 초기 형태에서는 unlabeled 샘플에서 모델이
            가장 높은 확률을 준 class를 그대로 정답처럼 써서 supervised loss에 섞어 학습합니다.
          </p>
        </div>
        <TermBreakdown
          title="누가, 어떤 전제로 label을 만드는가"
          items={[
            { term: "Human Annotation", description: "사람이 직접 판단해 label을 붙입니다.", example: "가이드라인을 읽은 crowd-worker가 텍스트에 감정 label 부여.", boundary: "가이드라인이 모호하면 annotator 간 일치도가 낮아집니다." },
            { term: "Model Annotation", description: "더 큰 모델이 label·rationale을 생성합니다.", example: "ChatGPT가 트윗의 입장(stance)을 zero-shot으로 분류.", boundary: "특정 task·도메인에서만 검증된 결과라 다른 task로 그대로 일반화할 수 없습니다." },
            { term: "Weak Supervision", description: "정답 없이 여러 약한 규칙을 결합해 label을 추정합니다.", example: "키워드 매칭·휴리스틱 여러 개를 Snorkel의 노이즈 모델로 결합.", boundary: "labeling function이 서로 상관돼 있으면 노이즈 모델의 가정이 깨집니다." },
            { term: "Pseudo-Labeling", description: "모델 자신의 confident 예측을 다시 학습 label로 씁니다.", example: "unlabeled 이미지에 모델이 매긴 최댓값 class를 pseudo-label로 채택.", boundary: "초기 모델의 오류가 pseudo-label로 그대로 강화되는 confirmation bias 위험이 있습니다." },
          ]}
        />
      </section>

      <section id="mixture" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Mixture 비율과 curriculum 순서는 diversity로 검증합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            여러 domain(web·code·academic 등) 데이터를 각각 얼마의 비율로 섞어 학습에 넣을지 정하는 것이 data mixture입니다. 그 데이터를 어떤 순서로
            모델에 보여줄지 정하면 data curriculum입니다.
          </p>
          <p>
            GPT-3의 학습 데이터 구성을 보면 mixture 비율과 원본 비중이 서로 다릅니다. 필터링한 Common Crawl은 토큰 수로 전체의 약 82%를 차지하지만 학습
            mixture에서는 60% weight만 받아 300B token 학습 동안 0.44 epoch만 돕니다. 반대로 Wikipedia는 전체의 1%도 안 되지만 3%
            weight를 받아 3.4 epoch을 돕니다. 같은 문서를 여러 번 오버샘플링 해서 보는 셈입니다.
          </p>
          <p>
            Xie et al.의 DoReMi는 이 mixture 비율을 사람이 손으로 정하는 대신 최적화합니다.
            280M 프록시 모델로 도메인별 가중치를 정해 30배 더 큰 모델에 적용한 결과, few-shot
            downstream accuracy가 6.5%p 올랐고 같은 성능에 도달하는 데 필요한 학습 step 수가
            2.6배 줄었습니다.
          </p>
          <p>
            Bengio et al.은 curriculum learning을 제안하면서 쉬운 예제부터 어려운 예제 순서로 학습을 배치하면 수렴 속도와 도달하는 local minimum의
            품질이 함께 좋아진다고 보고했습니다. 비볼록 목적함수를 최적화하는 continuation method의 한 사례로 설명되는 결과입니다.
          </p>
          <p>
            Mixture와 curriculum이 만든 코퍼스가 실제로 목표를 충족했는지는 세 기준으로 검증합니다. 서로 다른 주제와 문체, 난이도가 얼마나 다양한지를 보는 것이 data
            diversity입니다. 목표 domain·언어·task 분포를 빠짐없이 담았는지가 data coverage, 그 분포가 한쪽으로 쏠리지 않았는지가 data
            balance입니다.
          </p>
          <p>
            LIMA가 1,000개라는 적은 개수로도 성능을 낸 것은 curation이 이 세 기준을 좁은
            데이터셋 안에서도 지켰기 때문이라고 저자들은 설명합니다.
          </p>
        </div>
        <TermBreakdown
          title="구성 결정과 그 결정을 평가하는 기준"
          description="Mixture·curriculum은 코퍼스를 만드는 결정이고, diversity·coverage·balance는 그 결정을 사후에 재는 기준입니다."
          items={[
            { term: "Data Mixture", description: "domain별 데이터를 섞는 비율을 정하는 결정입니다.", example: "GPT-3의 Common Crawl 60%·WebText2 22%·Books 16%·Wikipedia 3% weight.", boundary: "원본 토큰 비중과 mixture weight는 다른 수이며 서로 바꿔 읽으면 안 됩니다." },
            { term: "Data Curriculum", description: "정해진 mixture를 어떤 순서로 보여줄지 정하는 결정입니다.", example: "쉬운 문장부터 긴 문서 순서로 학습 step에 배치.", boundary: "쉬움·어려움의 정의가 명시적이지 않으면 curriculum 효과를 재현하기 어렵습니다." },
            { term: "Data Diversity", description: "코퍼스 안에 존재하는 주제·문체·난이도의 폭입니다.", example: "같은 뜻이라도 격식체·구어체·코드 주석처럼 서로 다른 문체를 함께 포함.", boundary: "다양성이 높아도 목표 domain을 놓치면 coverage 문제는 따로 남습니다." },
            { term: "Data Coverage", description: "목표로 하는 domain·언어·task 분포를 얼마나 빠짐없이 담았는지입니다.", example: "저자원 언어·희귀 프로그래밍 언어가 최소 비율 이상 포함됐는지 확인.", boundary: "coverage를 채워도 각 영역 안의 balance가 깨지면 특정 하위 주제에 쏠릴 수 있습니다." },
            { term: "Data Balance", description: "확보한 분포가 한쪽으로 쏠리지 않고 비율이 맞는지입니다.", example: "영어 문서가 99%를 차지하지 않도록 언어별 상한·하한을 둠.", boundary: "balance만 맞추면 특정 영역 안의 품질 차이는 따로 점검해야 합니다." },
          ]}
        />
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">근거 논문이 무엇을 보였고 무엇은 아닌지</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글의 수치는 모두 아래 공식 논문의 저자 자기보고이며, 이 글이 새로 측정한 값이
            아닙니다. 각 논문의 실험 범위를 벗어난 일반화는 본문에서 승격하지 않았습니다.
          </p>
        </div>

        <div id="paper-the-pile" className="scroll-mt-20">
          <CitationBlock source="Gao et al. · The Pile: An 800GB Dataset of Diverse Text for Language Modeling (2020)" citeKey={1} href="https://arxiv.org/abs/2101.00027">
            언어모델이 학술·전문 도메인에서 약하다는 문제에서 출발해, 22개의 서로 다른 고품질
            subset을 의도적으로 섞은 825GiB 코퍼스를 공개했습니다. Common Crawl만으로 학습한
            모델보다 이 코퍼스로 학습한 모델이 여러 도메인에서 더 낫다는 것을 보였지만, 데이터의
            완전성이나 윤리적 중립성을 보장한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>

        <div id="paper-refinedweb" className="scroll-mt-20">
          <CitationBlock source="Penedo et al. · The RefinedWeb Dataset for Falcon LLM (2023)" citeKey={2} href="https://arxiv.org/abs/2306.01116">
            사람이 큐레이션한 코퍼스가 대규모 학습에 필수라는 통념에 의문을 제기하고, 제대로
            필터링·dedup한 웹 데이터만으로 The Pile 기반 모델을 능가하는 결과를 보였습니다.
            CommonCrawl에서 뽑은 5조 token 중 공개한 RefinedWeb은 6,000억 token으로, Figure 2
            기준 언어 식별 후 약 48%, 품질 필터 후 약 23%가 남습니다. 웹 데이터 단독이 모든
            상황에서 최적이라거나 curation이 완전히 불필요하다는 뜻은 아닙니다.
          </CitationBlock>
        </div>

        <div id="paper-dolma" className="scroll-mt-20">
          <CitationBlock source="Soldaini et al. · Dolma: an Open Corpus of Three Trillion Tokens for Language Model Pretraining Research (2024)" citeKey={3} href="https://arxiv.org/abs/2402.00159">
            상용 모델이 학습 데이터를 공개하지 않아 데이터가 성능에 미치는 영향을 과학적으로
            연구하기 어렵다는 문제의식에서, source mixing·quality filtering·dedup·PII/유해
            콘텐츠 필터링을 문서화한 3조 token 규모 영어 코퍼스를 공개했습니다. 특정 벤치마크
            성능이나 최종 모델 평가 결과를 직접 주장하지는 않습니다.
          </CitationBlock>
        </div>

        <div id="paper-broder-minhash" className="scroll-mt-20">
          <CitationBlock source="Broder · Identifying and Filtering Near-Duplicate Documents (CPM 1997/2000)" citeKey={4} href="https://cs.brown.edu/courses/cs253/papers/nearduplicate.pdf">
            웹 크롤링에서 미러 사이트·템플릿 페이지가 만드는 near-duplicate 문서가 검색 인덱싱을
            방해하는 문제에서, 문서를 shingle 집합으로 바꾸고 여러 해시 함수의 최솟값만 남기는
            MinHash sketch로 Jaccard 유사도를 선형 시간에 추정하는 방법을 제시했습니다. 텍스트
            기반 웹 문서를 전제하며 이미지·멀티미디어 near-duplicate는 범위 밖입니다.
          </CitationBlock>
        </div>

        <div id="paper-contamination-survey" className="scroll-mt-20">
          <CitationBlock source="Comprehensive Survey of Contamination Detection Methods in Large Language Models (2024)" citeKey={5} href="https://arxiv.org/abs/2404.00699">
            벤치마크 점수가 상업적 가치와 직결되면서 contamination detection의 필요가 커졌다는
            문제의식으로, 2025년 초까지 논문 100편 이상·기법 50개 이상을 open-data·closed-data
            접근으로 분류했습니다. GPT-2의 8-gram, GPT-3의 13-gram, GPT-4의 50글자 substring,
            Llama-2의 10-token n-gram(최대 4 skip)처럼 모델마다 다른 임계값을 정리했습니다.
            이 survey 자체가 새로운 contamination을 측정한 것은 아니며 인용된 원 보고를 모은
            것입니다.
          </CitationBlock>
        </div>

        <div id="paper-doremi" className="scroll-mt-20">
          <CitationBlock source="Xie et al. · DoReMi: Optimizing Data Mixtures Speeds Up Language Model Pretraining (2023)" citeKey={6} href="https://arxiv.org/abs/2305.10429">
            도메인 mixture 비율을 정할 표준 방법이 없다는 문제에서, group distributionally
            robust optimization으로 작은 프록시 모델(280M)의 도메인 가중치를 구해 30배 큰
            모델에 적용하는 DoReMi를 제안했습니다. Downstream task 정보 없이도 few-shot accuracy
            6.5%p 개선, 2.6배 적은 step으로 동일 성능 도달을 보고했지만, 이는 The Pile·GLaM
            데이터셋과 특정 파라미터 비율 조건에서의 결과입니다.
          </CitationBlock>
        </div>

        <div id="paper-lima" className="scroll-mt-20">
          <CitationBlock source="Zhou et al. · LIMA: Less Is More for Alignment (2023)" citeKey={7} href="https://arxiv.org/abs/2305.11206">
            사전학습과 instruction tuning 중 무엇이 성능을 더 좌우하는지 불명확하다는 문제에서,
            65B LLaMA에 1,000개의 엄선된 prompt-response 쌍만 supervised로 학습시켜 GPT-4·Bard
            대비 대등하거나 우월한 평가를 받았습니다. 강화학습 없이도 가능함을 보였지만, 다른
            모델 크기·아키텍처로의 일반화까지 보장하지는 않습니다.
          </CitationBlock>
        </div>

        <div id="paper-curriculum-learning" className="scroll-mt-20">
          <CitationBlock source="Bengio, Louradour, Collobert, Weston · Curriculum Learning (ICML 2009)" citeKey={8} href="https://dl.acm.org/doi/10.1145/1553374.1553380">
            사람과 동물이 쉬운 예제에서 어려운 예제 순서로 더 잘 배운다는 관찰을 딥러닝의 비볼록
            목적함수 학습에 formalize했습니다. 예제 순서를 이런 식으로 배치하면 수렴 속도와
            도달하는 local minimum의 일반화 품질이 함께 개선된다고 보고했지만, 이는 논문이
            실험한 모델·과제 범위 안에서의 결과입니다.
          </CitationBlock>
        </div>

        <div id="paper-snorkel" className="scroll-mt-20">
          <CitationBlock source="Ratner et al. · Snorkel: Rapid Training Data Creation with Weak Supervision (VLDB 2017)" citeKey={9} href="https://arxiv.org/abs/1711.10160">
            수동 레이블링이 머신러닝 배포의 최대 병목이라는 문제에서, 정확도가 서로 다른 여러
            labeling function의 출력을 노이즈 모델로 결합하는 data programming을 엔드투엔드로
            구현했습니다. 전문가 수기 레이블링 대비 2.8배 빠른 모델 구축, 공개 데이터셋에서
            평균 45.5% 성능 개선을 보고했지만, labeling function 설계 자체가 불필요하다는
            뜻은 아닙니다.
          </CitationBlock>
        </div>

        <div id="paper-pseudo-label" className="scroll-mt-20">
          <CitationBlock source="Lee · Pseudo-Label: The Simple and Efficient Semi-Supervised Learning Method for Deep Neural Networks (ICML Workshop 2013)" citeKey={10} href="http://deeplearning.net/wp-content/uploads/2013/03/pseudo_label_final.pdf">
            비지도 사전학습 없이도 딥러닝 semi-supervised 학습을 할 수 있는지를 물으며,
            unlabeled 샘플에 모델이 매긴 최댓값 class를 그대로 label처럼 써서 supervised
            loss에 섞는 방법을 제안했습니다. MNIST 규모 실험에서의 결과이며 대규모 텍스트
            코퍼스로의 확장은 이 논문 자체가 다루지 않습니다.
          </CitationBlock>
        </div>

        <div id="paper-chatgpt-annotator" className="scroll-mt-20">
          <CitationBlock source="Gilardi, Alizadeh, Kubli · ChatGPT Outperforms Crowd-Workers for Text-Annotation Tasks (PNAS 2023)" citeKey={11} href="https://arxiv.org/abs/2303.15056">
            수동 annotation의 시간·비용 문제에서, 트윗 2,382개에 5개 annotation task를 시켜
            ChatGPT와 crowd-worker를 비교했습니다. Zero-shot 정확도가 4개 task에서 crowd-worker를
            앞섰고 비용은 MTurk 대비 약 20배 저렴했지만, 트윗 기반 5개 task라는 범위에 한정된
            결과이며 모든 annotation 작업으로의 일반화를 주장하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
