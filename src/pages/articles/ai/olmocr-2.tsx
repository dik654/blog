import FormulaNote from '@/components/ui/formula-note';
import MathFormula from '@/components/ui/math';
import { CitationBlock } from '@/components/ui/citation';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  CorrectnessMetricLab,
  DevelopmentLadderLab,
  RewardLedgerLab,
} from './olmocr-2/viz/OlmOcrRewardLabs';

const learningPathId = 'ai-document-verifiable-parser-branch';

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
        <MathFormula display className="my-0 text-sm sm:text-base">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const sourcePipeline = [
  ['01', '어려운 실문서 선택', '수식·표·다단처럼 기존 OCR이 자주 틀리는 실제 PDF page를 다양성의 씨앗으로 삼는다.'],
  ['02', 'Layout 분석', '일반 VLM이 열 수, 이미지·표, 머리말·꼬리말 같은 page 구조를 먼저 기술한다.'],
  ['03', 'Semantic HTML 생성', '같은 크기의 깨끗한 HTML page를 만들고 원본 raster와 비교해 반복 수정한다.'],
  ['04', '한 source에서 두 산출물', 'HTML semantics에서 OCR target과 text·order·table·math unit tests를 함께 만든다.'],
  ['05', '출력 28개를 채점', '같은 synthetic page의 여러 completion을 검사하고 통과율을 RL reward로 돌려준다.'],
] as const;

const testFamilies = [
  ['Text Presence', '필수 구절이 정확히 나타나는지 확인한다.', '본문 누락을 잡는다.'],
  ['Text Absence', '머리말·꼬리말·쪽 번호처럼 제외할 text가 없는지 확인한다.', '반복 boilerplate를 막는다.'],
  ['Natural Reading Order', '선택한 문장들이 올바른 순서로 이어지는지 확인한다.', '다단·캡션이 본문을 끊는 오류를 잡는다.'],
  ['Table Accuracy', '특정 값을 가진 cell들의 상대 위치를 확인한다.', '표가 줄글로 평탄화되는 오류를 잡는다.'],
  ['Math Formula Accuracy', 'LaTeX를 KaTeX로 렌더링한 뒤 요소의 상대 위치를 비교한다.', '표기 문자열보다 화면의 수학 구조를 본다.'],
  ['Baseline Robustness', '긴 반복 n-gram이나 비대상 언어 문자가 생기지 않는지 확인한다.', '반복 loop와 비정상 출력을 막는다.'],
] as const;

export default function OlmOCR2Article() {
  return (
    <>
      <section id="correctness-metric" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문자열이 더 비슷한데 문서는 더 틀릴 수 있다</h2>
        <QuestionLead
          question="정답 LaTeX와 글자 모양이 더 비슷한 OCR 출력이 화면에는 틀린 수식으로 그려지고, 더 다른 문자열이 정확히 같은 수식으로 그려진다면 어느 쪽이 정답일까?"
          answer="문서 사용 목적에서는 정확히 렌더링되는 출력이 정답이다. olmOCR 2의 출발점은 문자 edit distance를 조금 더 정교하게 만드는 것이 아니라, reading order·표 관계·수식 렌더링처럼 실제 correctness를 직접 검사 가능한 질문으로 바꾸는 것이다."
        />
        <ConceptPrimer items={[
          {
            term: 'Linearization',
            meaning: '2차원 page의 본문·표·캡션·수식을 한 줄의 output sequence로 펴는 일이다.',
            why: '떠 있는 caption처럼 여러 직렬화가 모두 맞을 수 있고, 본문 사이에 끼면 틀릴 수도 있다.',
          },
          {
            term: 'Edit distance',
            meaning: '한 문자열을 다른 문자열로 바꾸는 삽입·삭제·치환 비용이다.',
            why: '철자 차이는 재지만 문서 관계와 렌더링 의미가 맞는지는 직접 알지 못한다.',
          },
          {
            term: 'Verifier',
            meaning: '모델 답을 읽고 특정 성질이 맞는지 pass 또는 fail로 결정하는 프로그램이다.',
            why: '“좋아 보인다”를 reading order, 표, 수식 같은 재현 가능한 검사로 바꾼다.',
          },
          {
            term: 'RLVR',
            meaning: '검증 가능한 reward로 정책을 개선하는 reinforcement learning이다.',
            why: '사람의 주관 점수 대신 대량으로 반복 실행할 수 있는 문서 unit test를 학습 신호로 쓴다.',
          },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            논문의 첫 반례는 떠 있는 caption이다. 기준 문자열이 caption을 본문 앞에 놓았더라도, 본문 A와 B를 끊지 않은 채
            caption을 뒤에 놓는 직렬화도 자연스럽다. 그러나 edit distance는 기준에서 멀어졌다는 이유로 두 정답을 다르게 평가할 수 있다.
            반대로 caption을 A와 B 사이에 끼운 출력은 문서 관계를 깨뜨렸는데도 상당수 문자가 가까워 부분 점수를 받을 수 있다.
          </p>
          <p>
            두 번째 반례는 수식이다. 같은 수학식을 만드는 LaTeX 문자열은 하나가 아니다. 논문의 Figure 2에서는 기준 문자열과 더 멀리
            떨어진 Model A가 KaTeX로 올바르게 렌더링되어 검사를 통과하고, 문자열은 더 가까운 Model B가 틀린 수식으로 렌더링되어
            실패한다. 즉 연속 점수가 낮아졌다는 사실과 실무 correctness가 좋아졌다는 사실은 같은 명제가 아니다.
          </p>
        </div>
        <CorrectnessMetricLab />
        <Misconception>
          Binary test가 edit distance보다 항상 완벽하다는 뜻은 아니다. Test가 묻지 않은 숫자 하나가 틀려도 통과할 수 있다.
          핵심은 하나의 근사 점수를 진실처럼 쓰지 않고, 실제로 보존해야 할 성질을 명시적인 검사 집합으로 바꾸는 데 있다.
        </Misconception>
        <CitationBlock source="olmOCR 2 paper · Section 2, Figures 1–2" citeKey={1} href="https://arxiv.org/abs/2510.19817">
          <p>
            원문은 unit test의 두 장점을 “동률 정답을 같은 점수로 다룸”과 “연속 edit score가 실제 correctness와 일치하지 않는 문제를 피함”으로
            설명한다. 이 글의 인터랙션은 그 인과를 재구성한 교육용 표현이며 논문 Figure의 정확한 edit-distance 수치를 복제한 표가 아니다.
          </p>
        </CitationBlock>
      </section>

      <section id="runtime-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">olmOCR 2는 page image를 읽어 검증 가능한 문서 문자열을 생성한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>논문 기준.</strong> olmOCR 2는 Qwen2.5-VL-7B-Instruct를 문서 OCR에 맞게 학습한 7B vision-language model이다.
            PDF의 한 page를 raster image로 보고 자연스러운 reading order의 text를 생성한다. 학습 mixture는 block math를
            <code>\[...\]</code>, inline math를 <code>\(...\)</code>로 일관되게 쓰고 표는 HTML로 표현하며, image에는 기본 alt text를 둔다.
            출력 상단에는 주 언어와 rotation correction factor 같은 document metadata도 요구한다.
          </p>
          <p>
            여기서 end-to-end란 page 안의 layout detector, text recognizer, table parser를 반드시 별도 모델로 직렬 연결하지 않고
            VLM generation 안에서 ordered text를 만든다는 뜻이다. PDF를 page image로 렌더링하고, page 번호와 metadata를 전달하고,
            긴 completion을 재시도하고, 결과를 검증하는 runtime까지 사라진다는 뜻은 아니다. 모델의 한 번 생성과 전체 ingestion pipeline을
            같은 “single pass”로 부르면 장애 위치를 찾을 수 없다.
          </p>
          <p>
            이 page parser의 출력은 문서 전체의 완성본도 아니다. 다음 page와 이어지는 문단, 여러 page에 걸친 표, caption과 figure의
            cross-page relation은 <InternalLink slug="document-structure-assembly" learningPathId={learningPathId}>Document Assembly</InternalLink>가
            맡는다. 원본 page·crop·bbox와 검증 결과를 release evidence로 묶는 일은
            <InternalLink slug="ocr-runtime-evaluation" learningPathId={learningPathId}>OCR 런타임과 평가</InternalLink>의 책임이다.
          </p>
        </div>
        <Misconception>
          “VLM 하나가 page를 생성한다”와 “운영 시스템에 component가 하나뿐이다”는 다르다. Renderer, scheduler, retry, metadata parser,
          verifier와 review queue는 여전히 독립된 failure boundary다.
        </Misconception>
      </section>

      <section id="verifier-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">하나의 OCR 점수를 여섯 종류의 관찰 가능한 질문으로 쪼갠다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>논문 기준.</strong> olmOCR-Bench와 RL training은 같은 unit-test 형식을 쓴다. 각 test는 output 전체를 채점하는
            만능 판사가 아니라 한 가지 invariant를 검사한다. 그래서 실패했을 때 “OCR이 나쁘다”가 아니라 본문 누락, 제거 대상 혼입,
            reading order, table relation, math rendering, repetition 중 어느 성질이 깨졌는지 말할 수 있다.
          </p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {testFamilies.map(([name, question, purpose], index) => (
            <article key={name} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[2.25rem_10.5rem_minmax(0,1fr)] sm:gap-4">
              <p className="font-mono text-sm font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</p>
              <p className="text-sm font-black">{name}</p>
              <div className="min-w-0 text-sm leading-relaxed">
                <p>{question}</p>
                <p className="mt-1 text-xs text-muted-foreground">잡는 오류 · {purpose}</p>
              </div>
            </article>
          ))}
        </div>
        <RewardLedgerLab />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{p_j(y)}_{\text{j번째 통과 값}}
&=
\underbrace{\mathbf 1\!\left[t_j(y)=\mathrm{pass}\right]}_{\text{통과 1 · 실패 0}}
\\[4pt]
\underbrace{R_{\mathrm{tests}}(y;T)}_{\text{page test reward}}
&=
\underbrace{\frac{1}{|T|}\sum_{j=1}^{|T|}p_j(y)}_{\text{모든 test 통과 값의 평균}}
\end{aligned}`}
          meaning="이 식은 한 page 출력 y에 연결된 test 집합 T에서 통과한 비율을 계산한다. 각 test가 같은 1/|T| 몫을 가지므로 어느 pass가 reward를 얼마나 올렸는지 역추적할 수 있다. 분모 |T| 덕분에 test 수가 다른 page도 0과 1 사이에서 비교된다. 네 개가 통과하면 4/6 = 0.666…이고 논문 Figure 4처럼 0.67로 표시할 수 있다. 다만 T에 포함되지 않은 성질은 reward가 관찰하지 못한다."
          symbols={[
            [String.raw`y`, 'Model이 한 document page에 대해 생성한 completion'],
            [String.raw`T`, '그 synthetic page에 연결된 binary unit-test 집합'],
            [String.raw`t_j`, 'j번째 verifier'],
            [String.raw`p_j(y)`, 'j번째 verifier의 0 또는 1 통과 값'],
            [String.raw`\mathbf 1[\cdot]`, '조건이 참이면 1, 거짓이면 0을 반환하는 지시함수'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            논문은 여섯 test의 통과율 외에 <strong>EOS token으로 끝났는지</strong>를 보는 binary reward와
            <strong>응답 상단 metadata 형식</strong>을 보는 0–1 reward를 별도로 추가했다. 공개된 본문에는 이 세 signal을 하나의
            weighted scalar로 결합하는 가중치가 적혀 있지 않다. 따라서 위 수식을 전체 reward 공식으로 확장해 임의의 계수를 붙이지 않는다.
          </p>
        </div>
      </section>

      <section id="synthetic-ground-truth" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">검증기를 손으로 3만 개 쓰지 않고 HTML에서 함께 컴파일한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            실제 PDF에는 정답 reading order와 table relation을 기계가 바로 읽을 수 있는 source가 없는 경우가 많다. 반대로 template 몇 개만
            무작위로 채우면 현실의 복잡한 layout 다양성을 놓친다. 논문의 절충은 <strong>어려운 실제 page를 모양의 씨앗</strong>으로 고르고,
            일반 VLM이 그 page와 비슷한 semantic HTML을 만들게 하는 것이다. HTML은 화면으로 다시 렌더링할 수 있고 동시에 구조적 정답으로도
            읽을 수 있다.
          </p>
        </div>
        <div data-olmocr-trace className="not-prose my-8 divide-y divide-border border-y border-border">
          {sourcePipeline.map(([number, title, body]) => (
            <article key={number} className="grid min-w-0 gap-2 py-5 sm:grid-cols-[3rem_11rem_minmax(0,1fr)] sm:gap-5">
              <p className="font-mono text-xl font-black text-muted-foreground">{number}</p>
              <p className="text-sm font-black">{title}</p>
              <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>논문 기준.</strong> 먼저 VLM이 열 수, image·table, header·footer를 분석한다. 다음 prompt가 같은 page 크기의
            clean semantic HTML을 만들고, 생성 HTML을 rasterize한 결과와 원본을 다시 비교해 HTML을 수정한다. 마지막으로
            <code>&lt;header&gt;</code>와 <code>&lt;footer&gt;</code>에서는 Text Absence test를, KaTeX math에서는 formula test를,
            table cell에서는 relative-position test를 뽑는다.
          </p>
          <p>
            이 파이프라인은 Claude Sonnet 4를 일반 VLM으로 사용했고 page당 약 0.12달러가 들었다고 논문은 보고한다.
            최종 synthetic mix는 <strong>2,186 pages, 30,381 test cases</strong>다. 별도의 supervised fine-tuning mix는
            <strong>267,962 pages</strong>이며 100,000개가 넘는 PDF에서 왔고, 그중 9,828 pages는 national archives 자료다.
          </p>
          <p>
            “Claude가 OCR text를 틀려도 HTML만으로 test를 만들기 때문에 robust하다”는 원문 설명은 좁게 읽어야 한다. Text target과 test가
            같은 HTML semantics에서 파생되므로 일반 VLM의 우연한 OCR 문자열 실수는 직접 전사되지 않을 수 있다. 그러나 HTML 자체의
            structure나 content가 원본과 다르면 잘못된 supervision이 생길 수 있다. Render-and-refine 단계와 test coverage가 중요한 이유다.
          </p>
        </div>
        <CitationBlock source="olmOCR 2 paper · Section 3.1" citeKey={2} href="https://arxiv.org/abs/2510.19817">
          <p>
            논문은 실제 page를 source로 삼아 layout analysis, semantic HTML generation, rendered-image comparison과 refinement를 수행한 뒤
            HTML semantics에서 benchmark-compatible tests를 만드는 절차를 공개한다.
          </p>
        </CitationBlock>
      </section>

      <section id="rlvr-training" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 page의 출력 28개를 비교해 검사를 더 많이 통과하는 방향으로 움직인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>논문 기준.</strong> 출발점은 olmOCR-mix-1025로 supervised fine-tuning한 Qwen2.5-VL-7B-Instruct다.
            저자들은 synthetic mix를 한 epoch 학습하며, 한 document마다 28 completions를 생성했다. 각 completion에는 앞의 page test
            pass fraction과 별도 EOS·metadata reward가 붙는다. 학습은 Hugging Face TRL을 사용했고 KL divergence coefficient는
            <MathFormula>{String.raw`\beta=0.01`}</MathFormula>이었다. 한 run은 8×H100 node에서 수행됐다.
          </p>
          <p>
            GRPO의 역할은 같은 prompt에서 나온 여러 completion의 reward를 상대적으로 비교해 policy를 갱신하는 것이다. 여기서 독자가
            가져갈 최소 핵심은 optimizer의 모든 식이 아니라 <strong>검증기가 모델 output과 reward 사이의 실행 가능한 계약</strong>이라는 점이다.
            GRPO objective와 relative advantage 계산 자체는
            <InternalLink slug="post-training-rlvr" learningPathId={learningPathId}>Post-training RLVR</InternalLink>에서 이어 읽는다.
          </p>
          <p>
            최종 best model은 서로 다른 random seed로 RL을 여섯 번 반복한 뒤 weight를 평균낸 checkpoint soup이다.
            세 run은 token-level, 세 run은 sequence-level importance sampling을 사용했다. 따라서 “한 번의 GRPO run이 82.4를 만들었다”가
            아니라 SFT checkpoint, synthetic tests, RL recipe, seed ensemble과 averaging이 묶인 결과다.
          </p>
        </div>
        <Misconception>
          여섯 unit-test family는 한 page를 채점하는 검사 종류이고, 여섯 random seed는 checkpoint soup을 만드는 training run 수다.
          서로 합치거나 나눌 수 있는 같은 축의 숫자가 아니다. 논문 본문은 첫 release를 “six months prior”라고 표현하지만 Table 1의
          release 표기는 2025년 2월과 2025년 10월이다. 이 글은 이를 계산된 “6개월”로 쓰지 않고 저자의 원문 표현과 공개 날짜가 어긋나는
          evidence boundary로 남긴다.
        </Misconception>
        <StopRule title="RLVR 수식은 여기서 멈춘다.">
          Page output이 test pass fraction으로 바뀌고, 같은 page의 여러 completion을 비교해 update하며, EOS·metadata는 별도 signal이라는
          세 경계를 설명할 수 있으면 이 문서 OCR 글의 RL 바닥은 충분하다.
        </StopRule>
      </section>

      <section id="development-ladder" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">+14.2점 전체를 RLVR의 효과라고 부르면 개발 과정을 잃는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            논문 Table 3은 첫 release의 68.2에서 olmOCR 2의 82.4까지를 순차적인 개발 이정표로 보여 준다. 이 표를 읽는 목적은
            leaderboard를 외우는 것이 아니라 <strong>모델 품질이 architecture·sampling·prompt parity·serialization·data loader·RL에서
            동시에 결정된다</strong>는 사실을 확인하는 것이다.
          </p>
        </div>
        <DevelopmentLadderLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Dynamic temperature는 0.1에서 시작해 EOS가 나오지 않고 반복할 때만 0.2, 0.3처럼 올려 최대 0.8까지 간다.
            Better prompting 단계는 학습과 inference에서 image와 text 순서가 달랐던 bug를 고쳤다. Text-first는 OCR 정확도뿐 아니라
            inference engine의 prompt caching에도 유리했다.
          </p>
          <p>
            새 VLM trainer는 bias와 layer-normalization weight에 weight decay를 적용하지 않는 등 hyperparameter를 다듬었지만,
            논문은 이 변경만으로 의미 있는 benchmark 차이는 없었다고 보고한다. Qwen2-VL에서 Qwen2.5-VL로 바꾼 효과도 “slight
            improvement”로만 서술한다. 둘을 78.5 행의 전체 상승분으로 각각 분해할 근거는 없다.
          </p>
          <p>
            JSON에서 YAML로 바꾼 것은 benchmark score를 움직이지 않았지만 quote closure와 repetition retry를 줄였다.
            1024px longest edge를 1288px로 키운 것은 작은 text의 signal과 compute 사이 절충이었다. Blank page를 loader가 건너뛰던
            bug를 고친 단계도 overall score는 78.5 그대로였지만, blank input에서 model이 내용을 꾸며 내는 production failure를 막았다.
            평균 score 변화가 0이라고 correctness 변화도 0인 것은 아니다.
          </p>
        </div>
        <Misconception>
          Table 3의 마지막 행은 synthetic data, RLVR, checkpoint souping을 한 묶음으로 추가한다. 따라서 78.5→82.4를 RLVR 하나의
          순수 causal effect라고 분해할 수 없고, 68.2→82.4 전체를 RLVR 개선으로 부르는 것은 더 큰 과장이다.
        </Misconception>
      </section>

      <section id="evidence-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">82.4는 무엇을 증명하고 무엇을 아직 증명하지 않는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>논문 결과.</strong> olmOCR-Bench overall은 82.4±1.1이며, category 중 old-scans math 82.3,
            tables 84.9, multi-column 83.7을 보고한다. 첫 release보다 overall +14.2라는 사실은 같은 최신 benchmark에서 비교한
            development result다. 모든 언어·모든 PDF·사용자의 사내 scan에서 같은 절대 성능을 보장하는 인증서가 아니다.
          </p>
          <p>
            Training과 evaluation이 같은 unit-test <em>framework</em>를 쓰는 것은 목표 정렬의 장점이 있다. 그러나 논문은 synthetic
            training pages와 test cases를 benchmark의 평가 documents와 별도로 만든다. 같은 검사 프로그램을 쓴다는 말과 같은 page나
            test instance를 재사용했다는 말은 다르다. 남는 위험은 framework가 표현하지 않은 오류가 train reward와 benchmark 양쪽에서
            동시에 보이지 않을 수 있다는 <strong>coverage alignment</strong>다.
          </p>
          <p>
            예를 들어 unit tests가 “A가 B보다 먼저 나온다”만 묻는다면 그 사이의 작은 footnote 누락, 숫자 한 자리 손상, source coordinate
            소실은 놓칠 수 있다. 실제 도입에서는 domain golden set, exact numeric relation, source crop과 bbox, 사람 review를 추가해야 한다.
            이것은 이 글의 <strong>편집·운영 권고</strong>이며 논문이 동일한 production gate를 구현했다는 주장이 아니다.
          </p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['논문이 직접 보인 것', '영어 중심 olmOCR-Bench에서 binary tests를 RL reward로 사용한 7B model의 결과와 공개된 training recipe.'],
            ['논문만으로 보장되지 않는 것', '새 domain의 calibrated confidence, 모든 숫자의 exact fidelity, cross-page relation, source-coordinate provenance.'],
            ['운영자가 추가할 것', '자기 문서 golden set, verifier coverage map, page artifact, review queue, model·prompt·render version별 regression.'],
          ].map(([label, body]) => (
            <div key={label} className="grid min-w-0 gap-2 py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-5">
              <p className="text-sm font-black">{label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="current-toolkit" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">논문 checkpoint와 현재 toolkit의 시간 경계를 분리한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>2025년 10월 release 기준.</strong> Ai2는 BF16·FP8 weights, dataset, code와 fine-tuning scripts를 함께 공개했다.
            Release 글은 약 270,000 PDF pages 외에 어려운 handwritten·typewritten document 20,000 pages를 추가했다고 설명한다.
            Single-H100 FP8 throughput과 10,000 pages 비용은 Ai2가 자체 환경에서 보고한 measurement다. Output token 수,
            PDF 복잡도, batching, GPU와 software version이 바뀌면 그대로 재현되는 보편 상수가 아니다.
          </p>
          <p>
            <strong>2026년 7월 29일 official repository 기준.</strong> 저장소 README는 local·remote inference, vLLM server 연동,
            S3 기반 multi-node work queue와 설치·batch command를 현재 toolkit으로 문서화한다. Local GPU inference 항목은 최근 NVIDIA
            GPU와 최소 12GB GPU RAM, 30GB free disk를 요구하고 RTX 4090·L40S·A100·H100에서 테스트했다고 적는다. 이 기능과 수치는
            release 뒤 계속 변할 수 있으므로 논문의 한 epoch RL recipe와 섞어 과거 실험 조건으로 쓰지 않는다. 실제 설치 전에는 official
            repository의 현재 release note와 hardware requirement를 다시 확인해야 한다.
          </p>
          <p>
            이 경로에서 olmOCR 2의 역할은 <strong>page output에 검증 가능한 training signal을 붙이는 현재 사례</strong>다.
            외부 OCR contract를 제거한 canonical 출발점은
            <InternalLink slug="paper-donut-2021" learningPathId={learningPathId}>Donut</InternalLink>에서 읽고,
            page parser·assembler·release가 어디서 갈라지는지는
            <InternalLink slug="ocr-document-ai-map" learningPathId={learningPathId}>Document AI 실행 지도</InternalLink>로 돌아간다.
            두 단계 parser와 더 작은 model의 현재 비교점이 필요하면
            <InternalLink slug="paddleocr-vl" learningPathId={learningPathId}>PaddleOCR-VL</InternalLink>을 읽는다.
          </p>
        </div>
        <CapabilityCheck items={[
          '문자 edit distance가 더 가까운 출력이 reading order나 rendered math에서는 더 틀릴 수 있는 반례를 설명한다.',
          '여섯 unit-test family와 별도 EOS·metadata reward를 정확히 분리한다.',
          '여섯 test 중 네 개가 통과할 때 page reward 0.67을 계산하고, test 밖 오류가 남는 이유를 말한다.',
          'Real page에서 semantic HTML, Markdown target과 tests, 28 completions, RL update로 이어지는 순서를 재구성한다.',
          '68.2→82.4를 sampling·prompt bug·runtime·data·RL의 공동 결과로 읽고 RLVR 단독 효과로 과장하지 않는다.',
          '같은 verifier framework와 같은 train/eval example을 구분하고 coverage alignment 위험을 찾는다.',
          'Page parsing, cross-page assembly, production release evidence의 책임을 나눠 다음 article을 선택한다.',
        ]} />
        <StopRule>
          Edit-distance 반례, 여섯 검사, page reward, synthetic HTML source, training recipe, development ladder와 evidence boundary를
          설명할 수 있으면 olmOCR 2의 최소 바닥은 끝이다. 1950년대 OCR 역사까지 내려가지 않고 document assembly와 runtime으로 올라간다.
        </StopRule>
        <SourceNotes sources={[
          {
            label: 'Allen Institute for AI · olmOCR 2 paper',
            href: 'https://arxiv.org/abs/2510.19817',
            note: 'Unit-test taxonomy, Figures 1–4, synthetic pipeline, training recipe, Table 3 development ladder와 benchmark evidence의 1차 원문.',
          },
          {
            label: 'Ai2 · olmOCR 2 release',
            href: 'https://allenai.org/blog/olmocr-2',
            note: '2025-10 release framing, artifacts, hard-page mixture와 vendor-reported inference throughput·cost.',
          },
          {
            label: 'AllenAI · official olmocr repository',
            href: 'https://github.com/allenai/olmocr',
            note: '현재 toolkit commands, local·remote inference, vLLM integration, release notes와 mutable hardware guidance.',
          },
          {
            label: 'Ai2 · original olmOCR',
            href: 'https://arxiv.org/abs/2502.18443',
            note: 'GPT-4o distillation 기반 첫 release와 68.2 starting point의 배경.',
          },
        ]} />
      </section>
    </>
  );
}
