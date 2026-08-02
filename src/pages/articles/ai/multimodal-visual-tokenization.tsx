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
import {
  CodebookAssignmentLab,
  RepresentationBudgetLab,
  SemanticReconstructionLab,
  StraightThroughLab,
} from './multimodal-foundation/viz/TokenizationLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div data-formula-pair className="not-prose my-7 min-w-0"><div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4"><Math display className="my-0 text-[13px] sm:text-base">{latex}</Math></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function MultimodalVisualTokenizationArticle() {
  return (
    <>
      <section id="two-representations" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">“Image token”은 하나의 물건이 아니다</h2>
        <QuestionLead
          question="CLIP image feature를 LLM이 잘 이해한다면 그 feature를 decoder에 넣어 원본 image를 만들 수 있을까?"
          answer="보장할 수 없다. Contrastive understanding feature는 object와 text 의미가 가까워지도록 학습되고, exact color·texture·pixel 위치를 버려도 손실이 작을 수 있다. 생성용 token은 decoder가 image를 복원하도록 별도 학습되어야 한다."
        />
        <ConceptPrimer items={[
          { term: 'Semantic feature', meaning: 'Object, relation과 text 의미에 유용하도록 압축된 연속 vector다.', why: '질문 답변과 retrieval에는 좋지만 pixel 복원 정보까지 보장하지 않는다.' },
          { term: 'Continuous latent', meaning: 'VAE처럼 image를 더 작은 연속 tensor로 압축한 표현이다.', why: 'Diffusion·flow가 부드러운 vector space에서 생성하도록 한다.' },
          { term: 'Discrete code', meaning: 'Codebook에서 고른 정수 ID의 sequence다.', why: 'Text token처럼 autoregressive next-token prediction을 적용할 수 있다.' },
          { term: 'Codebook', meaning: '자주 쓰는 latent pattern을 나타내는 learned vector 사전이다.', why: '연속 feature를 유한한 vocabulary ID로 바꾼다.' },
        ]} />
        <SemanticReconstructionLab />
        <Misconception>Discrete visual token이 text token과 같은 정수 ID라는 사실은 의미 단위도 같다는 뜻이 아니다. Text ID는 subword를 가리키지만 visual ID는 작은 texture·edge·color pattern을 가리킬 수 있다.</Misconception>
      </section>

      <section id="representation-budget" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">목표를 고른 뒤 token 수와 bit 상한을 계산한다</h2>
        <Formula
          latex={String.raw`\begin{aligned}
            \underbrace{N_z}_{\text{latent 위치 수}}
            &=\left\lceil\frac{H}{s_h}\right\rceil\left\lceil\frac{W}{s_w}\right\rceil\\
            \underbrace{B_{\mathrm{disc}}}_{\text{discrete index bit 상한}}
            &=N_z\left\lceil\log_2 K\right\rceil\\
            \underbrace{B_{\mathrm{cont}}}_{\text{continuous tensor bit 상한}}
            &=N_zCb
          \end{aligned}`}
          meaning="첫 줄은 encoder가 image를 세로 s_h배, 가로 s_w배 줄였을 때 남는 latent 위치를 계산한다. 둘째 줄은 codebook K개 중 하나를 가리키는 데 필요한 최소 고정 길이 bit 수를 각 위치에 곱한다. 셋째 줄은 각 위치에 C개 channel과 channel당 b bit 실수를 저장하는 continuous latent의 원시 상한을 계산한다. 두 값은 파일 크기나 모델 전체 VRAM이 아니라 representation 자체를 비교하는 장부다."
          symbols={[
            [String.raw`H,W`, '입력 image의 pixel 높이와 너비'],
            [String.raw`s_h,s_w`, 'Encoder가 세로와 가로를 줄이는 downsample 배수'],
            [String.raw`K`, 'Discrete visual codebook의 vocabulary 크기'],
            [String.raw`\lceil\log_2 K\rceil`, 'K개 ID를 구분하는 고정 길이 binary index의 최소 bit 수'],
            [String.raw`C`, 'Continuous latent 한 위치의 channel 개수'],
            [String.raw`b`, '각 channel 값을 표현하는 precision bit 수'],
            ['곱셈', '모든 latent 위치마다 ID 하나 또는 C개의 실수 값을 저장해야 하기 때문에 사용'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>작은 bit 장부가 항상 더 좋은 표현이라는 뜻은 아니다. Semantic feature는 복원을 포기해도 이해가 좋을 수 있다. Discrete code는 AR interface가 단순하지만 quantization error와 긴 token sequence를 만든다. Continuous latent는 부드러운 회귀가 가능하지만 channel과 precision만큼 memory bandwidth를 쓴다.</p>
          <p>따라서 먼저 output objective를 고른다. 질문 답변이면 semantic feature, visual next-token이면 discrete code, diffusion·flow면 continuous latent가 자연스러운 출발점이다. 그다음 reconstruction 품질, downstream 성능과 runtime 비용으로 실제 선택을 검증한다.</p>
        </div>
        <RepresentationBudgetLab />
      </section>

      <section id="nearest-code" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">연속 feature를 가장 가까운 code ID로 바꾼다</h2>
        <Formula
          latex={String.raw`\underbrace{k^*}_{\text{선택 code ID}}=\underset{k}{\arg\min}\ \underbrace{\left\|z_e-e_k\right\|_2^2}_{\text{encoder feature와 code의 거리}}`}
          meaning="Encoder feature와 모든 code vector의 거리를 계산하고 가장 작은 code의 index를 고른다. argmin은 최소 거리값 자체가 아니라 그 값을 만든 ID를 돌려주므로 다음-token vocabulary로 사용할 수 있다. 제곱 L2 거리는 방향과 크기 차이를 함께 하나의 음이 아닌 오차로 만든다."
          symbols={[
            [String.raw`z_e`, 'Image patch를 encoder가 만든 연속 latent vector'],
            [String.raw`e_k`, 'Codebook의 k번째 learned vector'],
            [String.raw`\|\cdot\|_2^2`, '각 차이를 제곱해 더한 거리. 큰 차이를 더 강하게 벌준다.'],
            [String.raw`\arg\min`, '가장 작은 거리를 만든 code의 index를 선택'],
          ]}
        />
        <CodebookAssignmentLab />
      </section>

      <section id="straight-through-loss" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">딱딱한 ID 선택을 지나 encoder도 학습시킨다</h2>
        <Formula
          latex={String.raw`\underbrace{z_q}_{\text{forward의 quantized vector}}=\underbrace{z_e}_{\text{gradient 통로}}+\operatorname{sg}\!\left(\underbrace{e_{k^*}-z_e}_{\text{forward에서 code로 교체}}\right)`}
          meaning="Forward 값은 z_e에 code와의 차이를 더하므로 정확히 e_k*가 된다. Stop-gradient sg는 괄호 안을 backward에서 상수로 취급한다. 그래서 non-differentiable nearest-ID 선택을 그대로 미분하지 않고 decoder gradient를 encoder z_e로 복사하는 straight-through estimator가 된다."
          symbols={[
            [String.raw`z_q`, 'Decoder와 transformer가 실제로 받는 quantized vector'],
            [String.raw`\operatorname{sg}`, 'Forward 값은 유지하지만 안쪽 gradient는 차단하는 stop-gradient'],
            ['더하기', 'Forward에서는 z_e를 code vector로 정확히 바꾸면서 backward 통로는 z_e 쪽에 남기기 위해 사용'],
            ['한계', '진짜 argmin gradient가 아니라 유용한 근사이므로 codebook update와 안정성 검사가 필요'],
          ]}
        />
        <StraightThroughLab />
        <Formula
          latex={String.raw`\begin{aligned}
            \mathcal L_{\mathrm{VQ}}
            &=\underbrace{\left\|x-D(z_q)\right\|_2^2}_{\text{image 복원}}\\
            &\quad+\underbrace{\left\|\operatorname{sg}[z_e]-e_{k^*}\right\|_2^2}_{\text{codebook 이동}}\\
            &\quad+\underbrace{\beta\left\|z_e-\operatorname{sg}[e_{k^*}]\right\|_2^2}_{\text{encoder commitment}}
          \end{aligned}`}
          meaning="첫 항은 decoder가 원 image를 복원하게 한다. 둘째 항은 선택된 code를 encoder feature 쪽으로 이동시킨다. 셋째 항은 encoder가 codebook과 멀리 도망가지 않게 한다. Stop-gradient 위치를 반대로 두어 codebook과 encoder가 각자 맡은 항에서만 움직이게 한다."
          symbols={[
            [String.raw`x`, '원본 image 또는 image patch'],
            [String.raw`D`, 'Quantized latent를 pixel로 복원하는 decoder'],
            [String.raw`\beta`, 'Encoder가 선택 code에 머무르는 압력을 조절하는 commitment weight'],
            ['세 항의 합', '복원 품질, 사전 학습과 encoder 안정성 중 하나만 좋아지는 해를 막기 위해 사용'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Codebook을 gradient 대신 exponential moving average로 갱신하는 구현도 있다. 각 code에 배정된 feature의 count와 sum을 누적해 중심을 천천히 옮긴다. 이때 오랫동안 선택되지 않는 code는 dead code가 된다.</p>
          <p><strong>Codebook perplexity</strong>는 “배치에서 code를 사실상 몇 종류나 고르게 썼는가?”를 한 숫자로 바꾼 관찰값이다. 모든 latent가 한 code만 고르면 1이다. 네 code를 똑같이 25%씩 고르면 4다. Codebook이 K개일 때 값이 K에 가까울수록 여러 code를 고르게 썼고, 1에 가까울수록 선택이 일부 code에 무너졌다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
            \underbrace{p_k}_{\text{code }k\text{의 선택 비율}}
            &=\frac{\underbrace{n_k}_{\text{code }k\text{를 고른 횟수}}}
            {\underbrace{\sum_j n_j}_{\text{전체 latent 수}}}\\[0.4em]
            \underbrace{\operatorname{PPL}_{\mathrm{code}}}_{\text{사실상 고르게 쓴 code 수}}
            &=\exp\!\left(
              \underbrace{-\sum_{k=1}^{K}p_k\log p_k}_{\text{선택 분포의 퍼짐 정도}}
            \right)
          \end{aligned}`}
          meaning="먼저 각 code가 선택된 비율을 만든다. -Σp log p는 한 code에 몰리면 0이고 여러 code에 고르게 퍼질수록 커진다. 지수 exp를 적용하면 이 퍼짐 정도를 다시 '균등하게 썼다고 볼 수 있는 code 개수' 단위로 읽을 수 있다. 그래서 단순히 한 번이라도 등장한 code 수보다 쏠림을 더 잘 드러낸다."
          symbols={[
            [String.raw`n_k`, '현재 집계 구간에서 k번째 code가 선택된 횟수'],
            [String.raw`p_k`, '전체 latent 가운데 k번째 code가 차지한 비율'],
            [String.raw`K`, 'Codebook에 들어 있는 전체 code 수'],
            [String.raw`\operatorname{PPL}_{\mathrm{code}}`, '선택 분포를 같은 정도로 고르게 쓰는 code 개수로 환산한 값'],
            [String.raw`\log`, '자연로그. 자주 선택된 code와 드물게 선택된 code의 비율 차이를 퍼짐 점수로 합치는 연산'],
            [String.raw`\exp`, '퍼짐 점수를 다시 직관적인 유효 code 개수 단위로 되돌리는 연산'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Perplexity 하나만 높이는 것이 목표는 아니다. 무작위로 code만 고르게 쓰면서 image를 못 복원할 수도 있다. 따라서 사용률 histogram, reconstruction error와 downstream generation 품질을 같은 checkpoint에서 함께 본다.</p>
          <p>Vocabulary를 키우면 quantization error가 자동으로 사라지지 않는다. Data와 update가 일부 code에 몰리면 큰 사전 대부분이 비어 있을 수 있다. 반대로 code 수가 너무 적으면 서로 다른 texture가 같은 ID로 충돌한다.</p>
        </div>
      </section>

      <section id="janus-decision" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Janus가 두 visual path를 둔 이유를 다시 읽는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>하나의 visual representation에 이해와 생성을 모두 맡기면 목표가 충돌할 수 있다. 이해 encoder는 조명과 texture가 바뀌어도 같은 object를 비슷한 feature로 만들고 싶다. 생성 tokenizer는 바로 그 조명과 texture를 decoder가 되살릴 수 있도록 남겨야 한다.</p>
          <p>Janus는 이해 입력을 CLIP 계열 semantic path로, image 생성 출력을 VQ code path로 나눈다. 두 path는 language hidden width에 맞춰 shared autoregressive transformer에 들어간다. 분리 지점은 visual encoding이고, 공유 지점은 sequence reasoning과 next-token backbone이다.</p>
          <p>Transfusion은 다른 답을 택한다. Image를 discrete code로 만들지 않고 continuous patch에 diffusion loss를 적용한다. 따라서 “VQ를 쓸까?”는 압축 기술만의 질문이 아니라 <strong>어떤 생성 objective와 schedule을 쓸까</strong>라는 질문이다.</p>
        </div>
        <StopRule>이해용 feature와 복원용 code를 구분하고 VQ loss의 세 책임을 설명할 수 있으면 여기서 멈춘다. AR과 diffusion·flow를 비교할 때만 <InternalLink slug="multimodal-unified-generation-objectives">통합 생성 objective</InternalLink>를 연다.</StopRule>
        <CapabilityCheck items={[
          'Semantic feature가 정확한 image 복원을 보장하지 않는 이유를 설명한다.',
          'Nearest code의 argmin, straight-through와 commitment loss를 계산 순서로 읽는다.',
          'Codebook collapse를 사용률·perplexity·복원 오차로 진단한다.',
          'Discrete code와 continuous latent를 생성 objective 요구에 맞춰 고른다.',
        ]} />
        <SourceNotes sources={[
          { label: 'VQ-VAE', href: 'https://arxiv.org/abs/1711.00937', note: 'Discrete latent, straight-through estimator, codebook과 commitment 학습의 최소 기준점.' },
          { label: 'CLIP', href: 'https://arxiv.org/abs/2103.00020', note: 'Image·text semantic alignment의 기준. Pixel reconstruction objective는 아니다.' },
          { label: 'Janus', href: 'https://arxiv.org/abs/2410.13848', note: 'Multimodal understanding과 generation의 visual encoding을 분리한 저자 의도와 실험.' },
          { label: 'Janus official code', href: 'https://github.com/deepseek-ai/Janus', note: 'vision_model·aligner와 gen_vision_model·gen_embed가 분리된 실제 class 근거.' },
        ]} />
      </section>
    </>
  );
}
