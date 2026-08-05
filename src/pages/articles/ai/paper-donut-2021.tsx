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
  DonutEvidenceLab,
  DonutPipelineLab,
  DonutSequenceLab,
} from './paper-donut-2021/viz/DonutSourceLabs';

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
        <MathFormula display className="my-0 text-[12px] sm:text-[15px]">{latex}</MathFormula>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function PaperDonut2021Article() {
  return (
    <>
      <section id="ocr-free-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">OCR-free는 글자를 건너뛴다는 뜻이 아니라 중간 계약을 없앤다는 뜻이다</h2>
        <QuestionLead
          question="영수증의 합계 글자를 OCR이 37,500이 아니라 37,SOO으로 읽었다면, 뒤의 문서 모델은 원본 이미지를 보고 고칠 수 있을까?"
          answer="전통적인 파이프라인에서 뒤 모델의 입력이 OCR 문자열과 좌표뿐이면 원본 획을 다시 볼 수 없다. Donut은 raw document image를 visual encoder로 읽고 원하는 구조 token을 바로 생성한다. 즉 글자 읽기 자체가 사라지는 것이 아니라, 별도 OCR 결과를 downstream model의 고정 입력으로 두던 경계가 사라진다."
        />
        <ConceptPrimer items={[
          { term: 'OCR', meaning: '이미지에서 문자 영역을 찾고 각 영역을 문자열로 바꾸는 optical character recognition 단계다.', why: '기존 VDU가 어떤 정보에 의존했는지 알아야 OCR-free의 뜻이 정확해진다.' },
          { term: 'VDU', meaning: 'Visual Document Understanding. 글자뿐 아니라 layout과 의미를 이용해 분류·정보 추출·질의응답을 수행한다.', why: '문자를 읽는 것과 문서의 field·관계를 이해하는 것은 같은 작업이 아니다.' },
          { term: 'Intermediate contract', meaning: '한 단계가 다음 단계에 넘기는 text, box, reading order 같은 고정 입력 형식이다.', why: '어느 오류가 다음 단계에서 되돌릴 수 없게 되는지 찾는다.' },
          { term: 'End-to-end', meaning: 'Image에서 task output까지 하나의 학습 가능한 경로로 연결한 구조다.', why: 'External OCR을 교체·관리하는 비용과 오류 전파를 줄일 수 있지만 검증 책임까지 사라지지는 않는다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            2021년 Donut 논문이 겨냥한 병목은 세 가지였다. 첫째, text detector와 recognizer를 돌리는 계산 비용이다.
            둘째, 언어·도메인이 달라질 때 OCR engine과 downstream serialization을 함께 조정해야 하는 경직성이다.
            셋째, OCR이 놓치거나 틀린 글자가 downstream model에 그대로 들어가는 오류 전파다. Layout-aware model이 아무리 좋아도
            입력 문자열이 잘못되면 원본 pixel에서 사라진 획을 복구할 방법이 없다.
          </p>
          <p>
            Donut의 선택은 더 좋은 OCR을 만드는 것이 아니었다. OCR text와 bounding box를 <em>필수 중간 표현</em>으로 두지 않고,
            image feature를 보면서 task-specific token sequence를 생성한다. 아래 비교에서 중요한 것은 box 개수가 줄었다는 사실보다
            <strong>어느 artifact가 다음 단계의 정보 상한을 정하는지</strong>다.
          </p>
        </div>
        <DonutPipelineLab />
        <Misconception>
          OCR-free는 text-free나 label-free가 아니다. Donut pretraining은 문서를 읽는 next-token task이고,
          real IIT-CDIP의 pseudo label은 상용 CLOVA OCR API로 만들었다. 추론 입력에서 외부 OCR을 제거한 것과
          학습 데이터 생성에 OCR이 전혀 관여하지 않은 것은 다른 주장이다.
        </Misconception>
      </section>

      <section id="image-to-sequence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실행은 image patch에서 시작해 한 token씩 구조를 쓴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            입력은 높이 H, 폭 W, channel C인 document image다. Visual encoder는 이미지를 겹치지 않는 patch로 나누고,
            작은 창 안에서 먼저 관계를 계산한 뒤 다음 block에서 창을 반 칸 옮겨 이웃 창의 정보까지 섞는 <strong>shifted-window attention</strong>과,
            인접 patch 네 개를 묶어 가로·세로 해상도는 줄이고 channel은 늘리는 <strong>patch merging</strong>을 거쳐 최종 feature sequence를 만든다. 원문 구현은
            Swin-B의 stage 깊이를 2·2·14·2, window size를 10으로 조정했다. 이 feature들은 OCR word가 아니라
            image region에서 얻은 latent vectors다.
          </p>
          <p>
            Textual decoder는 multilingual BART의 처음 네 layer로 초기화된다. Decoder는 task prompt와 지금까지 생성한 token을
            self-attention으로 읽고, cross-attention으로 Swin feature를 참고해 다음 token 분포를 만든다. Classification이면 class token,
            information extraction이면 field boundary와 value, DocVQA면 answer token을 낸다. Architecture가 task마다 바뀌는 대신
            prompt와 target sequence 형식이 바뀐다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{x}_{\text{문서 image}}
&\xrightarrow{\ \underbrace{E_\phi}_{\text{Swin visual encoder}}\ }
\underbrace{z_{1:n}}_{\text{image patch embeddings}}\\
\underbrace{q_t}_{\text{t번째 token 조건부확률}}
&=p_\theta(y_t\mid y_{<t},z_{1:n},p)\\
\underbrace{p_\theta(y\mid x,p)}_{\text{구조 token sequence의 확률}}
&=\prod_{t=1}^{m}q_t
\end{aligned}`}
          meaning="왜 image를 patch embedding으로 바꾸나: decoder가 모든 pixel을 직접 훑는 대신 layout과 글자 모양을 담은 시각 feature를 cross-attention으로 선택할 수 있다. 왜 확률을 token별 곱으로 쓰나: 구조 전체를 한 번에 분류하는 대신, 앞에서 만든 field boundary와 value를 조건으로 다음 token을 차례로 생성하기 때문이다."
          symbols={[
            [String.raw`x\in\mathbb R^{H\times W\times C}`, '높이·폭·색 channel을 가진 입력 문서 이미지'],
            [String.raw`E_\phi`, 'Swin Transformer 기반 visual encoder'],
            [String.raw`z_{1:n}`, '최종 feature map의 n개 image patch embedding'],
            [String.raw`p`, '문서 분류·정보 추출·질의응답을 알리는 task prompt'],
            [String.raw`y_{<t}`, 't번째 token 전에 이미 주어진 또는 생성된 token prefix'],
            [String.raw`q_t`, 'Image feature·이전 token·task prompt에서 계산한 다음-token probability'],
          ]}
        />
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['01', 'Encode', '문서 image를 patch로 나누고 Swin stage에서 local evidence와 더 넓은 layout context를 합친다.', '출력은 text box가 아니라 z₁…zₙ 시각 embedding이다.'],
            ['02', 'Prompt', 'Decoder 시작 위치에 downstream task를 구분하는 special token이나 질문을 넣는다.', '같은 backbone으로 서로 다른 output grammar를 선택한다.'],
            ['03', 'Attend', '이전 output token은 self-attention으로, image embeddings는 cross-attention으로 읽는다.', '어느 region을 읽는지와 어느 token을 쓸지가 한 decoder step에 결합된다.'],
            ['04', 'Generate', '다음 subword·field token을 선택하고 종료할 때까지 다시 decoder input으로 넣는다.', 'Inference는 autoregressive라 앞 token 오류가 뒤 구조에 이어질 수 있다.'],
            ['05', 'Parse', 'START/END field token 사이 값을 JSON으로 변환한다.', '문법이 깨지면 model failure를 숨기지 않고 field를 lost로 처리한다.'],
          ].map(([number, title, body, output]) => (
            <article key={number} className="grid gap-3 py-5 sm:grid-cols-[3rem_8rem_minmax(0,1fr)] sm:gap-5">
              <p className="font-mono text-xl font-black text-muted-foreground">{number}</p>
              <p className="text-sm font-black">{title}</p>
              <div className="min-w-0">
                <p className="text-sm leading-relaxed">{body}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Artifact · {output}</p>
              </div>
            </article>
          ))}
        </div>
        <Misconception>
          Decoder cross-attention heatmap이 field가 있는 위치를 가리켜도 그 좌표가 supervised detector와 같은 보장된 box output은 아니다.
          논문도 이를 text localization의 <em>auxiliary indicator</em>로 설명한다. Production provenance가 필요하면
          원본 crop과 좌표를 별도 contract로 검증해야 한다.
        </Misconception>
      </section>

      <section id="structured-token-grammar" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">JSON은 decoder가 직접 쓰는 문자가 아니라 field 경계 token에서 복원된다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Donut은 모든 downstream task를 “JSON으로 되돌릴 수 있는 token sequence 생성”으로 통일했다.
            예를 들어 class가 memo라면 <code>[START_class] memo [END_class]</code>를 생성한다.
            Receipt의 중첩 item처럼 schema가 복잡하면 field special token을 중첩해 group과 hierarchy를 표현한다.
            이 방식은 BIO tag마다 OCR word box가 있어야 한다는 가정을 없앤다.
          </p>
          <p>
            여기서 one-to-one invertible이라는 말은 <strong>정상 문법의 token sequence</strong>와 JSON 사이 변환 규칙이
            명확하다는 뜻이다. Model이 START token만 만들고 대응하는 END token을 빼먹으면 원문 parser는 주변 token으로
            경계를 추측하지 않는다. 해당 field를 추출 실패로 처리한다. 이 단순한 실패 규칙 덕분에 생성 오류와 parser의
            임의 복구를 구분할 수 있다.
          </p>
        </div>
        <DonutSequenceLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            학습과 추론의 prefix도 다르다. 학습에서는 <strong>teacher forcing</strong>으로 정답 prefix를 넣고 각 위치의
            next-token cross entropy를 동시에 계산한다. 추론에서는 방금 model이 예측한 token을 다음 step 입력으로 되돌린다.
            따라서 training loss가 낮아도 inference 중 한 field boundary 오류가 뒤 token 분포를 바꾸는 exposure gap이 남는다.
          </p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{\mathcal L_{\mathrm{NTP}}}_{\text{다음 token 학습 loss}}
=-\sum_{t=1}^{m}
\underbrace{\log p_\theta\!\left(
y_t^\star\mid y_{<t}^\star,z_{1:n},p
\right)}_{\text{정답 prefix를 보고 정답 token 확률을 높임}}
\end{aligned}`}
          meaning="왜 정답 prefix를 넣나: 잘못 생성한 앞 token 때문에 뒤 label까지 연쇄적으로 흔들리지 않게 각 위치의 conditional prediction을 학습한다. 왜 inference와 같지 않나: 실제 사용 시에는 정답 prefix가 없어서 model 자신의 예측을 다시 넣어야 한다. 그래서 sequence 문법과 malformed-output 검사가 별도로 필요하다."
          symbols={[
            [String.raw`\mathcal L_{\mathrm{NTP}}`, 'Next-token prediction cross-entropy loss'],
            [String.raw`y_t^\star`, 't번째 위치의 정답 target token'],
            [String.raw`y_{<t}^\star`, 'Teacher forcing에서 decoder에 넣는 정답 token prefix'],
            [String.raw`z_{1:n}`, '문서 image의 visual encoder features'],
            [String.raw`p`, 'Decoder가 수행할 문서 task를 지정하는 prompt token 또는 질문'],
            [String.raw`m`, 'Padding을 제외한 실제 target sequence token 길이'],
          ]}
        />
      </section>

      <section id="reading-pretraining" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이해를 가르치기 전에 문서를 읽는 순서를 먼저 가르쳤다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            처음부터 receipt schema만 fine-tuning하면 model은 제한된 field label에 맞춰 글자와 layout을 함께 배워야 한다.
            Donut pretraining은 더 넓은 <strong>pseudo-OCR task</strong>를 사용한다. 문서 image의 모든 text를 기본적으로
            좌상단에서 우하단 reading order로 생성하게 해 visual encoder와 textual decoder가 글자·배치·언어를 먼저 맞춘다.
            그 다음 classification, IE, DocVQA를 각각 prompt와 JSON target으로 fine-tuning한다.
          </p>
          <p>
            Real corpus는 11M IIT-CDIP scanned English pages이고, target text는 CLOVA OCR API로 만들었다.
            다른 언어에서 같은 규모의 scanned corpus와 label을 구하기 어렵기 때문에 SynthDoG를 함께 제안했다.
            중국어·일본어·한국어·영어마다 0.5M, 총 2M synthetic pages를 만들었다. Wikipedia의 words와 phrases,
            ImageNet background, 촬영한 종이 texture, rule-based grid layout, rendering augmentation을 조합한다.
          </p>
        </div>
        <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {[
            ['Synthetic 2M', '4개 언어 × 0.5M', '언어·layout을 확장하고 공개 재생성 경로를 만든다.', 'IE 분석에서는 synthetic-only도 충분한 결과를 보였다.'],
            ['Real 11M', 'IIT-CDIP + OCR pseudo labels', '실제 scan noise와 문서 분포를 보여 준다.', 'DocVQA에서는 real image를 본 pretraining이 중요했다.'],
            ['Downstream', 'Prompt + JSON targets', 'Reading representation을 class·field·answer로 바꾼다.', 'Task별 output schema와 evaluation을 새로 정의해야 한다.'],
          ].map(([title, source, purpose, boundary]) => (
            <article key={title} className="min-w-0 bg-background p-4 sm:p-5">
              <p className="text-sm font-black">{title}</p>
              <p className="mt-1 text-xs font-semibold text-blue-700 dark:text-blue-300">{source}</p>
              <p className="mt-3 text-sm leading-relaxed">{purpose}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">원문 경계 · {boundary}</p>
            </article>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Figure 7의 ablation은 일반 image captioning보다 text reading pretraining이 CORD와 DocVQA에 더 직접적이었다고 보고한다.
            그러나 “synthetic data면 언제나 real data가 필요 없다”는 결론은 아니다. 원문에서도 document IE와 DocVQA의 결과가 갈렸다.
            DocVQA는 IIT-CDIP와 image distribution이 비슷해 real images가 중요했을 가능성을 저자들이 제시한다.
          </p>
          <p>
            Main setup은 2560×1920 input, decoder max length 1536, 200K pretraining steps, batch 196,
            64 A100에서 약 2–3 GPU days였다. Appendix의 Donut Proto는 1.2M SynthDoG, 8 V100, 5 days,
            2048×1536으로 RVL-CDIP 94.5와 CORD 85.4를 보고한다. 이 작은-resource 결과는 재현 입구이지만
            main result와 같은 data·model·resolution receipt가 아니다.
          </p>
        </div>
        <StopRule>
          SynthDoG renderer의 모든 font와 augmentation option까지 내려가지 않는다. “Reading-order next-token pretraining →
          task prompt와 JSON fine-tuning”의 역할, synthetic/real data가 달라지는 지점을 설명할 수 있으면 evidence로 간다.
        </StopRule>
      </section>

      <section id="source-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Donut이 이겼다는 한 문장 대신 어디서 이기고 어디서 졌는지 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Table 1의 RVL-CDIP classification에서는 Donut 143M이 accuracy 95.30%, 752ms였고,
            LayoutLMv2 + OCR은 95.25%, 1,489ms였다. 논문의 “2× faster”는 이 P40 측정과 선택된 OCR API를 포함한
            end-to-end setup 안에서 읽어야 한다. OCR engine, network API latency, GPU와 batching이 바뀌면 배수도 바뀐다.
          </p>
          <p>
            Table 2의 information extraction에서는 CORD, Ticket, Business Card, Receipt 네 domain에서
            Donut이 비교 model 중 field F1과 TED-based accuracy 모두 가장 높았다. 다만 Business Card와 Receipt는
            실제 서비스의 private data여서 동일 split을 외부에서 완전히 재현할 수 없다. Ticket과 Business Card에는
            960×1280, main pretraining과 큰 task에는 2560×1920 등 task별 resolution도 다르다.
          </p>
          <p>
            반대로 Table 3의 DocVQA 전체 ANLS는 Donut 67.5로 LayoutLMv2 train-only 78.1보다 낮다.
            LayoutLMv2-Large-QG는 더 많은 train+dev+question-generation data로 86.7이었다. Donut이 강했던 것은
            handwritten slice 72.1이 해당 baseline의 67.3보다 높았다는 점이다. Figure 6은 동시에 tiny text를
            다른 숫자로 읽는 Donut 실패도 보여 준다. 이 음의 결과를 빼면 OCR-free의 실제 trade-off를 잃는다.
          </p>
        </div>
        <DonutEvidenceLab />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{d}_{\text{예측 tree의 수정 비용}}
&=\operatorname{TED}(pr,gt)\\
\underbrace{d_0}_{\text{빈 tree의 기준 비용}}
&=\operatorname{TED}(\varnothing,gt)\\
\underbrace{\operatorname{TEDAcc}(pr,gt)}_{\text{예측 구조 정확도}}
&=\max\!\left(0,1-\frac{d}{d_0}\right)
\end{aligned}`}
          meaning="왜 empty tree로 나누나: field 수와 hierarchy가 큰 문서는 raw edit distance도 커지므로, 아무것도 예측하지 않은 기준 비용으로 정규화한다. 왜 0에서 자르나: 예측이 빈 tree보다 더 나빠도 음수 accuracy로 만들지 않는다. 이 metric은 group과 nesting을 보지만 한 field 문자열의 부분 일치를 세밀하게 설명하지는 않으므로 exact field F1과 함께 읽는다."
          symbols={[
            [String.raw`pr`, 'Model이 생성하고 parser가 복원한 predicted JSON tree'],
            [String.raw`gt`, 'Ground-truth JSON tree'],
            [String.raw`\varnothing`, '아무 field도 없는 empty tree'],
            [String.raw`d,d_0`, '예측 수정 비용과 empty-tree 기준 비용'],
            [String.raw`\operatorname{TED}`, 'Node 삽입·삭제·치환으로 한 tree를 다른 tree로 바꾸는 edit distance'],
            ['Field F1', '정확히 일치한 field를 세는 별도 metric. 한 글자 miss도 해당 field 실패로 본다.'],
          ]}
        />
        <CitationBlock source="Kim et al. · Donut · Tables 1–3, Figures 6–9" citeKey={1} href="https://arxiv.org/abs/2111.15664">
          <p>
            원문 evidence는 “모든 문서에서 OCR-free가 우월하다”가 아니다. Classification과 네 IE dataset에서는
            speed·quality 우세를, DocVQA에서는 전체 ANLS 열세와 handwritten 강점, tiny-text 약점을 함께 보고한다.
            Figure 9는 OCR baseline의 결과도 선택한 OCR engine에 크게 달라진다는 점을 보여 준다.
          </p>
        </CitationBlock>
      </section>

      <section id="limits-handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Donut은 page를 구조로 읽는 기준점이지 production document 전체가 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Donut이 남긴 핵심 변화는 external OCR의 text·box를 유일한 관문으로 두지 않아도 된다는 것이다.
            그러나 end-to-end가 모든 책임을 한 모델에 맡기라는 뜻은 아니다. Input resolution을 키우면 tiny text와 low-resource
            robustness가 좋아질 수 있지만 attention compute와 memory가 급격히 늘어난다. Appendix는 2560×1920 fine-tuning이
            큰 dataset에서 64 A100 규모까지 필요했다고 기록한다.
          </p>
          <p>
            학습 provenance도 구분해야 한다. 11M real pages의 label은 OCR API에서 왔고, private industrial dataset 결과는
            외부에서 전부 재현할 수 없다. Cross-attention localization은 box supervision 없이 meaningful region을 찾았다는
            흥미로운 관찰이지만, calibrated coordinate나 인용 가능한 source span의 보장은 아니다. JSON grammar도 malformed field를
            감지할 수 있을 뿐 숫자가 원본과 같은지 스스로 증명하지 않는다.
          </p>
          <p>
            그래서 현재 시스템에서는 이 source mechanism 위에 책임을 다시 나눈다.
            <InternalLink slug="ocr-document-ai-map">Document AI 실행 지도</InternalLink>에서 page parser가 typed block과 source crop을 만들고,
            <InternalLink slug="document-structure-assembly">Document Assembly</InternalLink>가 페이지 사이 문단·표·제목·caption 관계를 잇는다.
            마지막으로 <InternalLink slug="ocr-runtime-evaluation">OCR 런타임과 평가</InternalLink>가 숫자·수식·표 verifier,
            review queue와 RAG provenance를 release gate로 묶는다.
          </p>
        </div>
        <div className="not-prose my-8 divide-y divide-border border-y border-border">
          {[
            ['Source가 증명한 것', '외부 OCR 없이 image에서 structured token을 생성하는 단순한 encoder-decoder 구조와 2021 benchmark 가능성.'],
            ['Source가 증명하지 않은 것', '모든 문서·언어에서 우월함, 완전한 tiny-text 인식, calibrated box provenance, cross-page 구조 정확성.'],
            ['현재 구현이 추가할 것', 'Typed block identity, source page·bbox·crop, deterministic parser, uncertainty·review state, cross-page relation과 release evidence.'],
          ].map(([label, body]) => (
            <div key={label} className="grid gap-2 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-5">
              <p className="text-sm font-black">{label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <CapabilityCheck items={[
          'OCR-free를 external OCR input contract 제거로 설명하고 text-free·label-free와 구분한다.',
          'Document image가 Swin embeddings, BART token sequence와 JSON parser를 거치는 순서를 추적한다.',
          'Teacher forcing 학습 prefix와 autoregressive inference prefix의 차이를 말한다.',
          'Field F1과 TED accuracy가 서로 놓치는 오류를 구분한다.',
          'RVL-CDIP·IE 우세와 DocVQA 전체 열세·handwritten 강점을 같은 근거로 보고한다.',
          'Donut page parsing과 production provenance·cross-page assembly의 책임을 분리한다.',
        ]} />
        <StopRule>
          OCR-free boundary, image-to-token 실행, field grammar, reading pretraining, task별 evidence와 resolution 한계를 설명할 수 있으면
          이 canonical source의 바닥은 끝이다. 더 오래된 OCR detector·recognizer 계보를 필수로 늘리지 않고 현재 typed-block runtime으로 올라간다.
        </StopRule>
        <SourceNotes sources={[
          { label: 'Kim et al. · Donut: OCR-free Document Understanding Transformer', href: 'https://arxiv.org/abs/2111.15664', note: 'Architecture, pseudo-OCR pretraining, JSON grammar, Tables 1–3, Figures 6–9와 appendix compute receipt의 1차 원문.' },
          { label: 'NAVER CLOVA · Donut official repository', href: 'https://github.com/clovaai/donut', note: 'Released code, SynthDoG, checkpoints와 implementation configuration.' },
          { label: 'ECCV 2022 peer-reviewed record', href: 'https://doi.org/10.1007/978-3-031-19815-1_29', note: 'Peer-reviewed publication record and publisher landing page.' },
        ]} />
      </section>
    </>
  );
}
