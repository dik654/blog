import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  InternalLink,
  Misconception,
} from '@/components/learning/ArticleLearning';

function FormulaPair({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-6 min-w-0">
      <div className="min-w-0 overflow-hidden border-y border-border px-1 py-4 text-xs sm:px-3 sm:text-sm">
        <M display className="my-0">{latex}</M>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

export default function IdeogramArchitecture() {
  return (
    <>
      <section id="spatial-contract" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Box는 pixel 좌표가 아니라 해상도를 건너가는 상대 배치 계약이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공식 schema의 box는 0–1000 범위다. 예를 들어 <code>[100,650,360,960]</code>은 위에서 10%,
            왼쪽에서 65% 지점에 시작해 세로 36%, 가로 96% 지점에서 끝난다. 1024×1024든 1600×400 banner든
            같은 상대 위치 의도를 전달할 수 있다.
          </p>
        </div>
        <FormulaPair
          latex={String.raw`\underbrace{b}_{\text{해상도와 무관한 box}}
          =
          \frac{
            \underbrace{(y_{\min},x_{\min},y_{\max},x_{\max})}_{\text{공식 schema 순서}}
          }{
            \underbrace{1000}_{\text{상대 좌표 범위}}
          }`}
          meaning="네 좌표를 1000으로 나누면 output pixel 수와 무관한 0–1 상대 위치가 된다. y를 먼저 쓰는 공식 순서를 지켜야 row와 column이 뒤바뀌지 않는다."
          symbols={[
            [String.raw`y_{\min},y_{\max}`, '캔버스 위에서 아래로 측정한 시작·끝 위치'],
            [String.raw`x_{\min},x_{\max}`, '캔버스 왼쪽에서 오른쪽으로 측정한 시작·끝 위치'],
            [String.raw`1000`, '공식 structured caption이 사용하는 정규화 좌표 상한'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Box는 segmentation mask처럼 모든 pixel을 강제로 잠그는 제약이 아니다. 생성 모델이 element를 어느 영역에 놓을지 조건을 주는 방식이다.
            따라서 평가에서는 element 중심점만 보는 것으로 부족하다. Text glyph 전체가 box 안에 있는지, 줄바꿈이 의도와 맞는지,
            객체가 box를 채우느라 찌그러지지 않았는지 함께 본다.
          </p>
        </div>
      </section>

      <section id="text-encoder" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Qwen3-VL의 마지막 답 하나가 아니라 13개 깊이의 feature를 쓴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Ideogram 4는 frozen Qwen3-VL-8B-Instruct를 vision input 없이 text-only encoder로 사용한다. 즉 생성 중에
            Qwen3-VL을 함께 학습시키거나 reference image를 넣는 경로가 아니라, prompt에서 고정된 language feature를 뽑는 경로다.
            공개 pipeline 문서는 layer
            0, 3, 6부터 33, 35까지 13개 hidden state를 꺼내 이어 붙인다고 밝힌다. 마지막 layer만 쓰는 encoder와 달리
            token 표면 정보에서 깊은 compositional meaning까지 서로 다른 abstraction을 동시에 조건으로 제공하려는 설계다.
          </p>
          <p>
            “빨간 상자 위 작은 흰 글씨”를 생각해 보자. 글자 자체, 색, 크기, 상자와의 포함 관계, 전체 포스터의 의미는 같은 깊이에서
            잘 표현되지 않을 수 있다. 여러 layer feature를 모으면 denoiser가 어느 깊이의 신호가 필요한지 학습할 여지가 커진다.
            다만 feature가 많다는 사실이 exact typography를 보장하지는 않는다. Caption data에 visible text가 정확히 있었는지,
            tokenizer가 문자열을 보존했는지, image token과의 alignment가 학습됐는지까지 필요하다.
          </p>
        </div>
      </section>

      <section id="single-stream" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Single-stream은 text와 image가 매 block에서 같은 질문을 보게 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Text features와 image latent token은 하나의 sequence로 이어지고 같은 34개 transformer block을 지난다.
            공개 사양은 embedding dimension 4608, attention head 18개, MLP intermediate 12288, 최대 text token 2048을 제시한다.
            각 block의 QK-RMSNorm은 query와 key의 크기를 정규화해 attention score 폭주를 줄인다. SwiGLU는 두 projection 중
            하나를 gate로 써 통과시킬 feature를 고르는 MLP다. AdaLN은 현재 timestep에서 만든 scale·shift·gate로 block의 동작을
            noise 단계에 맞춘다.
          </p>
        </div>
        <FormulaPair
          latex={String.raw`\begin{aligned}
          X&=\underbrace{[T;I]}_{\text{text와 image token을 한 sequence로 연결}}\\
          A&=\operatorname{softmax}\!\left(
            \frac{
              \overbrace{QK^\top}^{\text{모든 token 쌍의 관련도}}
            }{
              \underbrace{\sqrt{d_h}}_{\text{head 차원에 따른 score 크기 보정}}
            }
          \right)
          \end{aligned}`}
          meaning="Sequence를 이어 붙이면 text와 image token이 같은 attention matrix 안에서 직접 정보를 주고받는다. 한 token의 query와 다른 token의 key를 곱한 QKᵀ는 두 feature 방향이 맞을수록 큰 값을 내므로 “이 token이 저 token을 얼마나 참고할지”의 관련도 점수가 된다. 이를 √dₕ로 나누면 head 차원이 커질수록 score가 커져 softmax가 한 위치에 과도하게 몰리는 현상을 줄인다."
          symbols={[
            [String.raw`T`, 'Qwen3-VL 여러 layer에서 모은 text condition token'],
            [String.raw`I`, '현재 noise 상태의 image latent token'],
            [String.raw`Q,K`, '각 token이 찾는 정보와 제공하는 정보를 표현한 query·key'],
            [String.raw`d_h`, 'attention head 하나의 feature 차원'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Multi-dimensional Rotary Position Embedding(MRoPE, 다축 회전 위치 임베딩)은 token의 위치를 회전 각도로 표현하는
            rotary position encoding을 여러 좌표 축으로 나눈다. Ideogram 4의 3D MRoPE는 이 방식으로 text와 2D image token이
            하나의 position space를 공유하게 한다.
            따라서 attention은 token 내용뿐 아니라 “문구가 어느 image 위치와 관계있는가”도 구분할 수 있다.
            Timestep modulation은 같은 noisy latent라도 지금이 초기 structure 단계인지 마지막 detail 단계인지 block에 알려 준다.
            이 구조를 더 일반적인 DiT·MMDiT와 비교하려면
            <InternalLink slug="dit-flow-matching-evaluation">DiT·Flow Matching 평가 글</InternalLink>에서 backbone,
            path·target과 solver를 분리해 읽으면 된다.
          </p>
        </div>
        <Misconception>
          Single-stream은 cross-modal interaction 위치를 넓히는 구조 선택이다. 글자가 항상 맞는다는 보증서가 아니다. Training caption, visible-text supervision, structured input, sampler와 pixel-level 평가가 함께 맞아야 한다.
        </Misconception>
      </section>

      <section id="flow-runtime" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Transformer는 velocity를 예측하고 Euler가 실제 다음 상태를 만든다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            34개 block의 출력은 완성 pixel이 아니라 latent가 flow path에서 움직일 velocity다. Sampler는 logit-normal schedule로
            고른 time point를 따라가며 asymmetric classifier-free guidance를 적용한다. 이때 unconditional pass는 text를 padding으로
            바꾸는 것이 아니라 text token 자체를 빼고 image token만 처리한다. Conditional·unconditional branch를 따로 다듬을 수 있어
            prompt adherence와 image quality schedule의 소유자를 분리한다. 마지막 latent를 VAE가 pixel image로 복원한다. Denoiser,
            guidance, solver와 decoder는 같은 “모델 품질” 안에 뭉칠 수 없는 서로 다른 실패 소유자다.
          </p>
        </div>
        <FormulaPair
          latex={String.raw`\begin{aligned}
          \underbrace{v_k}_{\text{이번 step의 guided velocity}}
          =
          \underbrace{w_kv_c+(1-w_k)v_u}_{\text{조건부·무조건부 방향 혼합}}\\[6pt]
          \underbrace{z_{k+1}}_{\text{다음 latent}}
          =
          \underbrace{z_k}_{\text{현재 latent}}
          +
          \underbrace{(t_{k+1}-t_k)}_{\text{시간 간격}}
          \underbrace{v_k}_{\text{이동 방향}}
          \end{aligned}`}
          meaning="공개 sampler는 조건부 velocity v_c와 text token을 제거한 무조건부 velocity v_u를 step별 weight w_k로 섞는다. 그래서 guidance가 한 숫자가 아니라 시간에 따른 schedule이다. 이어서 velocity에 시간 간격을 곱해 이번 step의 이동량으로 바꾸고 현재 latent에 더한다. Step 수를 줄이면 한 번의 이동이 커져 solver 오차와 denoiser의 few-step 적합성이 더 중요해진다."
          symbols={[
            [String.raw`z_k`, 'k번째 Euler step의 image latent'],
            [String.raw`t_k`, 'flow schedule 위의 현재 시간'],
            [String.raw`v_c`, 'Structured caption과 text token을 본 conditional transformer의 velocity'],
            [String.raw`v_u`, 'Text token을 제거한 unconditional transformer의 velocity'],
            [String.raw`w_k`, 'k번째 step에 적용하는 guidance weight'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공식 공개 inference preset은 48-step quality, 20-step default, 12-step turbo를 제공한다. Repository의
            <code>V4_QUALITY_48</code>은 45 step 동안 guidance weight 7을 쓰고
            마지막 3 polish step에서 3으로 낮춘다. 이것은 “CFG 7” 한 숫자보다 step별 schedule이 runtime contract라는 뜻이다.
            Fewer steps는 더 빠르지만 모든 prompt와 해상도에서 같은 품질을 보장하지 않는다.
          </p>
        </div>
      </section>
    </>
  );
}
