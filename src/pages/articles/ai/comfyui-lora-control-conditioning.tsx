import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { ConditionRouteViz } from './comfyui-runtime/viz/WorkflowRuntimeViz';

const ablation = [
  ['A · Base', 'Prompt만 남기고 LoRA·Control·reference branch를 bypass한다.', 'Base model과 sampling의 원래 실패를 확인한다.'],
  ['B · LoRA', '패치된 MODEL/CLIP이 실제 sampler·text encode consumer로 가는지 확인한다.', 'Weight adaptation의 순효과를 본다.'],
  ['C · Control', '전처리 image, strength, start/end와 conditioning output만 추가한다.', 'Pose·edge·depth가 맞는 좌표에서 구조를 제어하는지 본다.'],
  ['D · Reference', 'Identity·style·composition 중 한 역할만 부여한다.', 'Prompt·LoRA와 같은 속성을 두 번 강제하는 충돌을 줄인다.'],
  ['E · Combined', 'A~D trace가 통과한 뒤에만 함께 켠다.', '좋아진 속성과 망가진 속성의 owner를 유지한다.'],
] as const;

const symptoms = [
  ['LoRA가 전혀 안 보임', 'Sampler가 원 MODEL을 받거나 text encode가 원 CLIP을 받는다.', '최종 consumer input에서 patch node까지 역추적한다.'],
  ['Pose가 밀리거나 잘림', 'Preprocessor image와 generation canvas의 resize·crop·padding 좌표가 다르다.', 'Control image를 저장하고 width·height·crop transform을 비교한다.'],
  ['얼굴이 두 사람 사이로 섞임', 'Character LoRA와 reference adapter가 identity를 동시에 강제한다.', '한 branch씩 끄고 identity 역할을 하나에만 준다.'],
  ['그림이 딱딱해짐', 'Control strength가 너무 크거나 전 noise 구간에 적용된다.', 'Strength와 start/end를 분리해 작은 sweep을 한다.'],
  ['Negative prompt로 구조가 안 빠짐', 'Weight patch나 control condition이 더 직접적으로 구조를 강제한다.', 'Negative를 늘리기 전에 강한 condition branch를 ablation한다.'],
] as const;

export default function ComfyUILoraControlConditioningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <QuestionLead
          question="LoRA, ControlNet과 reference image는 모두 ‘조건’이니 같은 strength slider처럼 다루면 되는가?"
          answer="아니다. Prompt는 CONDITIONING을 만들고, LoRA는 MODEL·CLIP weight를 패치하며, ControlNet은 구조 신호를 가공한 CONDITIONING을 만들고, image adapter는 별도 visual embedding 경로에 개입한다. 먼저 최종 consumer까지 연결됐는지 증명한 뒤 strength를 조절해야 한다."
        />
        <h2 className="mb-6 text-2xl font-bold">조건을 신호가 들어가는 위치로 구분한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Canvas에서는 모두 선으로 보이지만 바꾸는 대상은 다르다. Text prompt는 encoder가 읽은 embedding이고, LoRA는 함수의 weight를 바꾸며, ControlNet은 pose·edge·depth 같은 spatial evidence를 denoising condition에 보탠다. Reference adapter는 image feature를 attention이나 model-specific condition 경로로 전달한다.</p>
          <p>이 차이는 디버깅 순서를 결정한다. LoRA가 약하다고 strength부터 올리면 안 된다. 패치된 output이 sampler까지 도달하지 않으면 0과 1의 차이가 없다. Control image 좌표가 틀리면 CFG를 바꿔도 pose가 맞지 않는다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Weight patch', meaning: 'Base layer의 계산 weight에 학습된 변화량을 합성한다.', why: 'Prompt가 아니라 model 함수 자체가 바뀌므로 patched MODEL을 consumer가 사용해야 한다.' },
          { term: 'Structural condition', meaning: 'Pose·edge·depth처럼 공간 배치를 설명하는 신호다.', why: '언어만으로 정확히 지정하기 어려운 위치·형태를 별도 evidence로 준다.' },
          { term: 'Reference embedding', meaning: 'Input image의 identity·style·composition 정보를 압축한 조건이다.', why: 'Text prompt와 다른 정보 경로이므로 어느 속성을 맡길지 제한해야 한다.' },
          { term: 'Ablation', meaning: '한 condition branch만 끄거나 켜 순효과를 비교하는 실험이다.', why: '여러 조건이 같은 속성을 당길 때 실패 owner를 찾는 가장 직접적인 방법이다.' },
        ]} />
        <ConditionRouteViz />
      </section>

      <section id="lora" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">LoRA는 작은 weight update다</h2>
        <M display>{String.raw`\underbrace{W'}_{\text{패치된 가중치}}=\underbrace{W_0}_{\text{고정 기반}}+\underbrace{\frac{\alpha}{r}}_{\text{변화량 크기}}\underbrace{BA}_{\text{저랭크 업데이트}}`}</M>
        <FormulaNote
          meaning={'큰 W 전체를 다시 학습하지 않고 작은 두 행렬 B와 A의 곱을 변화량으로 더한다. Rank r로 나누는 이유는 rank가 바뀌어도 update scale이 과도하게 달라지지 않게 정규화하기 위해서다. alpha는 adapter 변화량을 base에 얼마나 섞을지 정한다. ComfyUI strength는 구현에 따라 이 scale에 추가로 관여할 수 있다.'}
          symbols={[
            [String.raw`W_0`, '학습 중 고정한 base model layer weight'],
            [String.raw`A,B`, '학습한 low-rank adapter 행렬'],
            [String.raw`r`, 'Adapter bottleneck rank'],
            [String.raw`\alpha`, 'Low-rank update의 기준 scale'],
            [String.raw`W'`, '실제 forward에서 사용할 patched weight'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Load LoRA류 node가 MODEL과 CLIP을 받아 둘 다 새 output으로 내보내는 이유가 여기에 있다. Denoiser adapter만 있는지 text-encoder adapter도 있는지는 file과 loader 구현에 따라 다르다. KSampler는 patched MODEL을, prompt encoder는 patched CLIP을 받아야 각 update가 계산 경로에 들어간다.</p>
          <p>Adapter가 어느 base family와 target module에 학습됐는지도 contract다. 같은 이름의 attention layer가 없거나 <strong>quantized runtime</strong>, 즉 낮은 bit weight를 복원해 계산하는 loader·kernel 조합이 해당 patch를 지원하지 않으면 type 연결은 되더라도 효과가 틀릴 수 있다. Base hash, adapter hash, target과 strength를 run manifest에 남긴다.</p>
        </div>
      </section>

      <section id="control-reference" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Control image와 reference image는 다른 약속이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>ControlNet workflow에서는 원본 image 자체보다 preprocessor가 만든 pose·edge·depth map이 실제 evidence다. Official ComfyUI 흐름은 ControlNet model, processed image, positive·negative conditioning, VAE와 strength·start·end를 연결한다. Core가 모든 preprocessor를 제공하는 것은 아니므로 custom node로 만든 map의 의미와 resolution은 별도 기록한다.</p>
          <p>Reference adapter는 image 전체를 복사하는 장치가 아니다. 어떤 encoder와 adapter weight를 썼는지에 따라 identity, style 또는 composition 신호가 섞인다. 한 reference에 세 역할을 동시에 기대하지 말고 crop과 weight를 역할별로 분리한다. Character LoRA가 identity를 이미 맡는다면 reference에는 clothing detail이나 composition만 맡기는 식이다.</p>
        </div>
        <Misconception>Control strength가 1이면 원본 pose를 정확히 복제한다는 뜻이 아니다. Preprocessor 오차, resize·crop 좌표, model prior와 적용 noise 구간이 모두 결과에 관여한다. Strength는 잘못된 좌표를 고치는 값이 아니다.</Misconception>
      </section>

      <section id="ablation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">조건은 하나씩 증명한 뒤 합친다</h2>
        <div className="not-prose overflow-hidden border border-border">
          {ablation.map(([title, action, evidence]) => (
            <div key={title} className="grid min-w-0 border-b border-border last:border-b-0 lg:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)]">
              <strong className="border-b border-border bg-muted/20 px-3 py-3 text-sm lg:border-b-0 lg:border-r">{title}</strong>
              <p className="min-w-0 border-b border-border px-3 py-3 text-sm leading-relaxed lg:border-b-0 lg:border-r">{action}</p>
              <p className="min-w-0 px-3 py-3 text-sm leading-relaxed text-muted-foreground">증거: {evidence}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="conflicts" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">증상에서 condition owner로</h2>
        <div className="not-prose overflow-hidden border border-border">
          {symptoms.map(([symptom, cause, action]) => (
            <div key={symptom} className="grid min-w-0 border-b border-border last:border-b-0 md:grid-cols-[9rem_minmax(0,1fr)]">
              <strong className="border-b border-border bg-muted/20 px-3 py-3 text-sm md:border-b-0 md:border-r">{symptom}</strong>
              <div className="min-w-0 px-3 py-3"><p className="text-sm leading-relaxed">가능 원인: {cause}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">확인: {action}</p></div>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 글이 다음 단계에 넘기는 것은 <strong>각 condition branch의 독립 ablation trace</strong>다. <InternalLink slug="comfyui-edit-models-flux-qwen">instruction image editing</InternalLink>에서 무엇을 바꾸고 무엇을 보존할지 계약한 뒤 필요한 branch만 조합한다.</p>
        </div>
        <CapabilityCheck items={[
          'Prompt, LoRA, ControlNet과 image adapter가 어느 계산 경로를 바꾸는지 consumer에서 역추적할 수 있다.',
          '같은 seed·sampling baseline에서 condition branch를 하나씩 ablation해 충돌 owner를 찾을 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'LoRA', href: 'https://arxiv.org/abs/2106.09685', note: 'Frozen base와 low-rank update의 수학적 원리.' },
          { label: 'ComfyUI · ControlNet', href: 'https://docs.comfy.org/tutorials/controlnet/controlnet', note: 'Processed image, conditioning, strength와 적용 구간의 공식 workflow.' },
          { label: 'IP-Adapter', href: 'https://arxiv.org/abs/2308.06721', note: 'Decoupled image prompt adapter의 원 논문과 적용 범위.' },
        ]} />
      </section>
    </div>
  );
}
