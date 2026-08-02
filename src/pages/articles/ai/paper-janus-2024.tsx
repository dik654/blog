import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { JanusEncodingDecisionLab, JanusTrainingStageLab } from './multimodal-foundation/viz/JanusPaperLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[13px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const ablationReceipts = [
  {
    id: 'A',
    setup: '단일 VQ tokenizer · 이해+생성',
    evidence: 'MMBench 35.0 · COCO-FID 8.72',
    reading: '복원 가능한 code 하나로 두 task를 맡기면 generation은 가능하지만 이해 성능이 크게 낮았다.',
  },
  {
    id: 'B',
    setup: '단일 semantic tokenizer · 이해+생성',
    evidence: 'MMBench 52.7 · COCO-FID 7.11',
    reading: 'Semantic supervision을 더한 tokenizer는 두 축을 개선했지만 이해 전용 학습보다 낮았다.',
  },
  {
    id: 'C',
    setup: '같은 semantic tokenizer · 이해만',
    evidence: 'MMBench 62.1 · generation 없음',
    reading: 'B와 encoder 계열은 같지만 generation task를 제거하자 이해가 올랐다. 논문은 이를 단일 표현의 trade-off 증거로 읽는다.',
  },
  {
    id: 'D',
    setup: 'SigLIP + VQ 분리 · 이해+생성',
    evidence: 'MMBench 69.4 · COCO-FID 8.53',
    reading: 'Janus의 분리 설계는 두 task를 함께 학습하면서 이해 격차를 줄이고 generation을 유지했다.',
  },
  {
    id: 'E',
    setup: 'SigLIP · 이해만',
    evidence: 'MMBench 70.6 · generation 없음',
    reading: '이해 전용 upper reference다. D와의 1.2점 차이는 분리 설계가 공동 학습의 이해 격차를 크게 줄였지만 완전히 없애지는 않았음을 보여 준다.',
  },
] as const;

export default function PaperJanus2024Article() {
  return (
    <>
      <section id="research-question" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">논문은 “하나의 모델”보다 “하나의 시각 표현”을 의심한다</h2>
        <QuestionLead
          question="이해와 생성을 한 transformer로 통합할 때 왜 visual encoder까지 하나여야 한다고 가정하면 안 될까?"
          answer="두 task가 image에서 보존하려는 정보의 해상도가 다르기 때문이다. 이해는 객체·속성과 관계 같은 high-level semantics가 중요하고, 생성은 local texture·색·공간 구조를 decoder가 되살릴 수 있어야 한다. Janus는 이 충돌을 visual encoding 두 경로로 분리하되 autoregressive transformer는 공유한다."
        />
        <ConceptPrimer items={[
          { term: 'Information granularity', meaning: '표현이 의미, 모양, texture와 pixel 위치 중 어느 수준까지 구분해 남기는가다.', why: '이해와 생성이 같은 image에서도 서로 다른 수준을 요구하는 문제를 설명한다.' },
          { term: 'Understanding adaptor', meaning: 'SigLIP feature를 LLM input width로 옮기는 2-layer MLP다.', why: 'Semantic encoder를 바꾸어도 shared transformer interface는 유지한다.' },
          { term: 'Generation adaptor', meaning: 'VQ code embedding을 LLM input width로 옮기는 별도 2-layer MLP다.', why: '복원 가능한 visual vocabulary를 text와 같은 sequence space에 넣는다.' },
          { term: 'Unified autoregression', meaning: '입력 종류는 다르지만 이미 본 sequence로 다음 text 또는 image code를 예측하는 계약이다.', why: 'Visual encoding을 분리해도 reasoning backbone과 next-token 실행 규칙을 공유한다.' },
          { term: 'MMBench · COCO-FID', meaning: 'MMBench는 높을수록 multimodal 이해가 좋고, COCO-FID는 낮을수록 생성 image 분포가 실제 COCO image에 가깝다.', why: 'Ablation의 69.4와 8.53을 같은 방향의 점수로 잘못 읽지 않게 한다.' },
        ]} />
        <JanusEncodingDecisionLab />
        <Misconception>Janus의 “decoupling”은 understanding model과 generation model을 완전히 따로 학습해 API로 이어 붙였다는 뜻이 아니다. 두 visual input path와 output head는 다르지만 같은 autoregressive transformer가 sequence를 처리한다.</Misconception>
      </section>

      <section id="architecture-objective" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Raw image에서 loss까지 두 경로를 끝까지 따라간다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>이해 경로</strong>는 384×384 image를 SigLIP-Large-Patch16-384의 high-dimensional semantic feature로 바꾼다. 2D grid를 1D sequence로 펴고 understanding adaptor로 LLM input space에 맞춘다. Transformer가 이 feature와 질문 text를 읽고 built-in text prediction head로 답을 낸다.</p>
          <p><strong>생성 경로</strong>는 factor 16으로 downsample하는 VQ tokenizer와 16,384개 codebook을 쓴다. Image code embedding을 generation adaptor로 옮겨 transformer에 넣고, 별도 image prediction head가 다음 code ID를 예측한다. 생성이 끝난 code sequence는 VQ decoder가 RGB image로 복원한다.</p>
          <p>두 경로가 같은 것은 raw image encoder가 아니라 transformer의 causal sequence processing이다. 논문은 특별한 양방향 mask를 추가하지 않고 표준 autoregressive framework를 유지한다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\mathcal L}_{\text{Janus의 AR 손실}}=-\sum_{i\in\mathcal M}\underbrace{\log P_\theta(x_i\mid x_{<i})}_{\text{앞 sequence에서 정답 ID를 예측한 log 확률}}`}
          meaning="원문은 multimodal understanding에서 text sequence에, visual generation에서 image sequence에 autoregressive loss를 준다고 명시한다. 각 target 위치는 앞의 sequence만 보고 정답 ID의 조건부 확률을 높인다. Stage III SFT에서는 system·user prompt를 mask하고 answer token만 감독한다고 Section 3.2가 명시한다. 다만 Stage I·II pretraining에도 같은 answer-only mask를 적용하는지는 원문만으로 확정하지 않는다. 논문은 task별 별도 loss weight를 두지 않았지만 data mixture는 단계마다 바꾼다."
          symbols={[
            [String.raw`x_i`, 'i번째 정답 text token 또는 visual code ID'],
            [String.raw`x_{<i}`, '현재 위치보다 앞에서 model이 조건으로 읽는 sequence'],
            [String.raw`\mathcal M`, 'Loss를 계산할 위치 집합. Stage III 이해 SFT는 answer token이고, Stage I·II의 같은 mask 적용 여부는 원문에서 확정하지 않는다.'],
            [String.raw`P_\theta`, 'Shared transformer와 해당 prediction head가 만든 다음 ID 분포'],
            ['조건부 확률', 'Autoregressive inference와 같은 앞→뒤 dependency를 학습하기 위해 사용'],
            ['Task별 loss 위치', '이해에서는 text sequence, 생성에서는 image sequence를 예측 대상으로 삼는 원문 경계를 표현'],
          ]}
        />
        <p className="prose prose-neutral max-w-none dark:prose-invert">Image generation inference에서는 text condition을 10% 확률로 pad로 바꿔 학습한 unconditional row와 conditional row를 함께 사용한다. CFG logit 계산과 실제 576-step loop는 <InternalLink slug="janus-pro-multimodal-runtime">Janus-Pro 공식 code 경로</InternalLink>에서 tensor 단위로 확인한다.</p>
      </section>

      <section id="training-curriculum" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">세 단계는 module update 경계와 data curriculum을 함께 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Stage I은 두 pretrained visual encoder와 LLM을 얼린다. Adaptors와 image head만 움직여 서로 다른 표현 공간을 연결한다. Stage II는 LLM을 풀고 pure text, multimodal understanding, visual generation을 한 batch mixture로 학습한다. Stage III는 generation encoder를 고정한 채 instruction following을 다듬는다.</p>
          <p>Stage III의 understanding SFT는 system·user prompt를 loss에서 가리고 answer token만 감독한다. 이 masking 범위를 Stage I·II pretraining까지 소급하지 않는다.</p>
          <p>논문 표의 data ratio는 understanding : pure text : generation의 표본 비율이다. Loss weight와 같은 숫자가 아니다. Janus는 task별 loss weight를 따로 두지 않았으므로 어느 task가 update를 얼마나 차지하는지는 sampling mixture와 실제 gradient scale이 함께 정한다.</p>
        </div>
        <JanusTrainingStageLab />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['MODEL', 'DeepSeek-LLM 1.3B · maximum sequence length 4096'],
            ['IMAGE', '모든 입력을 384×384로 맞추되 이해는 long side resize+padding, 생성은 short side resize+crop'],
            ['SYSTEM', '16 nodes × 8 NVIDIA A100 40GB · 논문 보고 training 7일'],
            ['BOUNDARY', '이 수치는 Janus 1.3B 연구 설정이다. Janus-Pro의 data·scaling과 production serving 비용으로 일반화하지 않는다.'],
          ].map(([label, body]) => (
            <div key={label} className="grid gap-2 py-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <strong className="font-mono text-[12px]">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ablation-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Ablation은 “분리”가 필요한 이유를 어떤 비교로 지지하는가</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {ablationReceipts.map((item) => (
            <article key={item.id} className="grid gap-3 py-5 sm:grid-cols-[3rem_12rem_minmax(0,1fr)]">
              <p className="font-mono text-lg font-bold">{item.id}</p>
              <div><p className="text-sm font-bold">{item.setup}</p><p className="mt-2 font-mono text-[12px] text-muted-foreground">{item.evidence}</p></div>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.reading}</p>
            </article>
          ))}
        </div>
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>첫 핵심 비교는 B와 C다. 같은 semantic-tokenizer 계열에서 generation task를 함께 학습한 B보다 understanding-only C의 이해 점수가 높다. 저자들은 이를 단일 visual representation이 두 task 사이에서 trade-off를 만든다는 증거로 해석한다. 다음 비교는 D와 E다. Encoding을 분리한 D는 두 task를 함께 학습하면서 MMBench 69.4까지 올라 이해 전용 E의 70.6에 가까워졌지만, 1.2점 차이까지 사라진 것은 아니다.</p>
          <p>그러나 이 ablation만으로 모든 future unified model이 반드시 두 encoder를 써야 한다고 결론낼 수는 없다. 1.3B backbone, 384px, 특정 tokenizer·data mixture·benchmark에서의 저자 실험이다. Transfusion처럼 continuous image span과 diffusion loss를 쓰거나, 더 강한 unified tokenizer를 쓰는 설계는 별도 비교가 필요하다.</p>
        </div>
        <StopRule>논문의 문제·설계·학습·ablation을 설명할 수 있으면 원문 단계는 끝이다. 실제 class, mask, code loop와 decoder shape를 검산할 때만 <InternalLink slug="janus-pro-multimodal-runtime">Janus-Pro Runtime</InternalLink>으로 이동한다.</StopRule>
        <CapabilityCheck items={[
          '이해와 생성이 visual representation에서 요구하는 정보 granularity 차이를 설명한다.',
          'SigLIP understanding path와 VQ generation path가 shared transformer 앞뒤에서 어디까지 분리되는지 그린다.',
          '세 training stage마다 update·freeze module과 data ratio가 왜 바뀌는지 설명한다.',
          'A·B·C·D·E ablation 중 B↔C와 D↔E가 각각 무엇을 비교하고 어디까지 일반화 가능한지 구분한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Janus paper · arXiv HTML', href: 'https://arxiv.org/html/2410.13848', note: 'Section 3 architecture·training·objective와 Section 4 implementation·ablation의 1차 근거.' },
          { label: 'Janus paper · stable abstract', href: 'https://arxiv.org/abs/2410.13848', note: '논문 version, authorship, 제출일과 핵심 claim을 고정한다.' },
          { label: 'Janus official repository', href: 'https://github.com/deepseek-ai/Janus', note: '논문의 두 encoding path가 공개 class와 inference example에 어떻게 내려왔는지 확인하는 구현 근거.' },
          { label: 'SigLIP', href: 'https://arxiv.org/abs/2303.15343', note: 'Janus가 understanding encoder로 선택한 semantic vision-language representation의 기반.' },
          { label: 'LlamaGen VQ tokenizer', href: 'https://arxiv.org/abs/2406.06525', note: 'Janus generation encoder가 채택한 discrete visual code path의 원 출처.' },
        ]} />
      </section>
    </>
  );
}
