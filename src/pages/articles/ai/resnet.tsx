import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
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
import { BottleneckCostLab, ResidualPathLab, ResidualStageLab } from './vision-foundations/viz/FoundationLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div data-formula-pair className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><M display className="my-0 text-[12px] sm:text-base">{latex}</M></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function ResNetArticle() {
  return <>
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ResNet의 출발점은 “깊으면 표현력이 크다”와 “깊으면 잘 학습된다”의 차이다</h2>
      <QuestionLead
        question="20층 network 뒤에 몇 층을 더 붙였는데 training error까지 커졌다. 새 층이 쓸모없으면 identity로 지나가면 될 텐데 왜 더 나빠질까?"
        answer="표현력만 보면 깊은 network가 얕은 network의 identity 해를 포함해야 한다. 그러나 optimizer가 여러 nonlinear layer를 identity로 맞추는 일은 쉽지 않다. ResNet은 identity path를 구조에 직접 넣고 main branch가 변화량 F(x)만 학습하게 만든다."
      />
      <ConceptPrimer items={[
        { term: 'Degradation problem', meaning: '더 깊은 model의 training error 자체가 더 커지는 최적화 실패.', why: '단순 overfitting과 구분해야 residual design의 동기를 이해한다.' },
        { term: 'Residual', meaning: '원하는 mapping H(x) 전체가 아니라 input에서 바뀔 양 F(x)=H(x)-x.', why: '변화가 필요 없으면 F(x)를 0 근처로 두기 쉽다.' },
        { term: 'Identity shortcut', meaning: 'Parameter 없이 x를 addition 지점으로 보내는 길.', why: '정보와 gradient가 main branch를 우회할 수 있다.' },
        { term: 'Projection shortcut', meaning: '1×1 convolution 등으로 x의 shape을 맞추는 길.', why: '해상도나 channel이 바뀌는 stage 경계에서 addition을 가능하게 한다.' },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <CitationBlock source="Deep Residual Learning · He et al." citeKey={1} href="https://arxiv.org/abs/1512.03385"><p>원 논문은 더 깊은 plain network에서 관찰되는 degradation을 제시하고, layer가 unreferenced mapping 대신 input을 기준으로 residual function을 학습하도록 재정식화한다.</p></CitationBlock>
      </div>
      <Misconception>ResNet을 “기울기 소실을 완전히 해결한 기술”로만 외우면 부정확하다. 핵심 관찰은 더 깊은 plain network의 optimization degradation이고, identity shortcut은 forward 정보와 backward gradient에 직접 경로를 추가한다. Normalization·initialization·activation 순서도 여전히 중요하다.</Misconception>
      <QuestionLead
        question="얕은 model의 train/test error가 5%/7%이고 더 깊은 plain model이 8%/10%라면, test error 증가를 overfitting이라고 불러도 될까?"
        answer="아니다. 더 깊은 model은 training set조차 덜 맞췄으므로 먼저 optimization degradation으로 진단한다. 반대로 train error가 1%인데 test error만 12%라면 capacity·regularization·data mismatch를 포함한 generalization 문제를 본다. ResNet의 출발점은 이 둘을 train error로 구분하는 데 있다."
      />
    </section>

    <section id="vanishing-gradient" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Plain chain에는 곱만 있고 residual chain에는 더하기 경로가 있다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Plain layer가 <M>{'x_{l+1}=F_l(x_l)'}</M>이면 gradient는 여러 Jacobian의 곱을 지나간다. 각 곱의 크기가 1보다 작으면 줄고, 크면 폭발할 수 있다. Residual addition은 <M>x_l</M>이 main branch를 우회하게 해 미분에 shortcut 항을 더한다.</p>
        <p>다만 아래의 깨끗한 <M>I+J_F</M> 식은 addition 뒤에 별도 activation이 없는 구간, 특히 full pre-activation unit을 읽는 기준식이다. 원 ResNet v1처럼 addition 뒤 ReLU가 있으면 ReLU gate가 전체 항 앞에 다시 곱해진다.</p>
      </div>
      <Formula
        latex={String.raw`\underbrace{x_{l+1}}_{\text{block 출력}}=\underbrace{x_l}_{\text{보존 경로}}+\underbrace{F_l(x_l;W_l)}_{\text{학습할 변화량}}`}
        meaning="이 식은 addition 뒤 activation이 없는 clean residual path의 기준식이다. Input x를 그대로 전달하면서 main branch F가 필요한 변화만 더한다. Shape이 같을 때 identity path에는 추가 parameter가 없다."
        symbols={[["x_l", 'l번째 block 입력'], ["F_l", 'convolution·normalization·activation으로 만든 residual branch'], ["W_l", 'residual branch의 학습 parameter']]}
      />
      <Formula
        latex={String.raw`\begin{aligned}\underbrace{g_l}_{\text{아래로 보낼 gradient}}&=\underbrace{g_{l+1}}_{\text{위에서 온 gradient}}\\&\quad\cdot\left(\underbrace{I}_{\text{identity 항}}+\underbrace{J_{F_l}}_{\text{residual 변화}}\right)\end{aligned}`}
        meaning="Clean identity block의 backward에서는 main branch Jacobian J_F만 곱하지 않고 identity I가 더해진다. 그러나 J_F가 -I에 가까우면 두 항이 상쇄될 수 있으므로 shortcut이 nonzero gradient를 보장한다는 뜻은 아니다."
        symbols={[["g_l,g_{l+1}", '아래·위 block의 loss gradient'], ["I", 'input을 그대로 보내는 identity Jacobian'], ["J_{F_l}", 'residual branch의 local Jacobian']]}
      />
      <ResidualPathLab />
      <Formula
        latex={String.raw`\begin{aligned}\underbrace{x_{l+1}^{\mathrm{v1}}}_{\text{post-activation 출력}}&=\operatorname{ReLU}\!\left(x_l+F_l(x_l)\right)\\\underbrace{g_l^{\mathrm{v1}}}_{\text{ReLU 뒤 gradient}}&=g_{l+1}\,\underbrace{D_{\mathrm{ReLU}}}_{\text{음수면 0인 gate}}\left(I+J_{F_l}\right)\end{aligned}`}
        meaning="원 ResNet v1은 addition 뒤 ReLU를 적용하므로 clean identity gradient 앞에 ReLU 미분 gate가 붙는다. Addition 결과가 음수인 좌표에서는 gate가 0이 될 수 있다. 후속 full pre-activation v2는 BN·ReLU를 residual branch 안으로 옮겨 addition 뒤의 직접 경로를 깨끗하게 유지한다."
        symbols={[[String.raw`D_{\mathrm{ReLU}}`, 'Addition 결과가 양수인 좌표만 1인 diagonal gate'], [String.raw`J_{F_l}`, 'Residual branch Jacobian'], ['v1', '원 논문의 post-activation block']]}
      />
    </section>

    <section id="skip-connection" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Skip은 무조건 identity가 아니라 addition shape 계약이다</h2>
      <ResidualStageLab />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Tensor addition은 두 branch의 <M>H\times W\times C</M>가 같아야 한다. 같은 stage에서는 identity shortcut을 쓰고, 첫 block에서 stride 2로 downsample하며 channel을 늘리면 shortcut에도 projection을 둔다.</p>
      </div>
      <Formula
        latex={String.raw`\begin{aligned}\underbrace{y}_{\text{더할 수 있는 출력}}&=\underbrace{F(x;W)}_{\text{main branch}}+\underbrace{W_sx}_{\text{shape을 맞춘 shortcut}}\\\underbrace{\operatorname{shape}(F(x))}_{\text{main 출력 shape}}&=\underbrace{\operatorname{shape}(W_sx)}_{\text{shortcut 출력 shape}}\end{aligned}`}
        meaning="이 식은 stage 경계에서 shortcut도 stride와 channel projection을 적용해 main branch와 같은 shape을 만들어야 한다는 계약이다. 같은 shape이면 W_s를 identity로 둘 수 있다."
        symbols={[["W_s", 'shortcut projection, 흔히 1×1 convolution'], ["F(x;W)", 'main residual branch 출력'], ["y", '두 branch를 element-wise addition한 결과']]}
      />
      <Formula
        latex={String.raw`\underbrace{\frac{\partial y}{\partial x}}_{\text{stage 경계의 local Jacobian}}=\underbrace{J_F}_{\text{main branch}}+\underbrace{W_s}_{\text{projection shortcut}}`}
        meaning="Stage 경계에서는 shortcut도 학습 projection이므로 backward의 직접 항이 identity I가 아니라 W_s다. 따라서 같은-stage identity block의 gradient 식을 downsample block에 그대로 적용하면 안 된다."
        symbols={[[String.raw`J_F`, 'Main residual branch의 input Jacobian'], [String.raw`W_s`, '1×1 stride projection의 linear Jacobian'], ['더하기', '두 forward branch가 addition에서 만나므로 backward 기여도 합쳐짐']]}
      />
      <QuestionLead
        question="Main branch는 56×56×64에서 28×28×128을 만들었다. Shortcut에 x를 그대로 더하면 왜 실행되지 않으며 최소 수정은 무엇일까?"
        answer="공간 크기와 channel 수가 모두 달라 element-wise addition을 할 수 없다. Shortcut에 stride 2의 1×1 projection을 적용해 28×28×128로 맞춘 뒤 더한다. 단순 zero padding과 projection은 계산·정보 보존 계약이 다르므로 checkpoint 구현을 확인한다."
      />
    </section>

    <section id="residual-computation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">여러 block을 펼치면 feature가 누적되는 구조가 보인다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Identity shortcut 구간을 펼치면 먼 block의 output은 과거 feature와 그 사이 residual들의 합으로 쓸 수 있다. 그래서 signal이 모든 변환을 반드시 통과해야 하는 plain chain과 구조가 다르다.</p>
      </div>
      <Formula
        latex={String.raw`\underbrace{x_L}_{\text{먼 block의 표현}}=\underbrace{x_l}_{\text{직접 보존된 이전 표현}}+\underbrace{\sum_{i=l}^{L-1}F_i(x_i)}_{\text{block마다 누적한 수정량}}`}
        meaning="이 식은 identity shortcut이 이어진 구간에서 representation이 이전 값과 residual update의 합으로 축적됨을 보인다. 모든 stage 경계를 단순 identity로 가정한 식은 아니며 projection 구간은 따로 추적해야 한다."
        symbols={[["x_l,x_L", '앞·뒤 block의 representation'], ["F_i", 'i번째 block이 더한 residual update'], ["L-l", '펼쳐 본 residual block 수']]}
      />
      <div className="not-prose divide-y divide-border border-y border-border">
        {[
          ['Forward check', 'F(x)가 0에 가까울 때 block이 input을 얼마나 보존하는지 activation으로 확인한다.'],
          ['Gradient check', 'Block별 gradient norm을 보고 shortcut 유무보다 실제 optimization 상태를 확인한다.'],
          ['Shape check', 'Stage boundary의 stride·channel·projection 구현을 tensor trace로 고정한다.'],
        ].map(([title, body], index) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[3rem_9rem_minmax(0,1fr)]"><span className="font-mono text-xs font-black text-primary">0{index + 1}</span><p className="text-sm font-bold">{title}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
      </div>
    </section>

    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ResNet-50이라는 이름보다 stage와 block type을 읽는다</h2>
      <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
        {[
          ['Stem', '입력 해상도를 줄이고 초기 feature를 만든다.'],
          ['Stage 1', '같은 해상도에서 residual update를 반복한다.'],
          ['Stage 2–4', '첫 block이 downsample·projection하고 뒤 block은 identity를 쓴다.'],
          ['Head', 'Global pooling 뒤 task-specific output을 만든다.'],
        ].map(([title, body], index) => <div key={title} className="min-w-0 bg-background p-5"><p className="font-mono text-[10px] font-black text-primary">0{index + 1}</p><p className="mt-2 text-sm font-black">{title}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p></div>)}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p><strong>Basic block</strong>은 주로 3×3 두 개를 쓰고, <strong>bottleneck block</strong>은 1×1로 channel을 줄인 뒤 3×3을 계산하고 다시 1×1로 늘린다. 핵심은 비싼 3×3이 좁은 <M>d</M> channel만 보게 하는 것이다. 겉보기 output width가 <M>4d</M>여도 basic block과 비슷한 계산량을 유지할 수 있다.</p>
        <p>예를 들어 <M>H=W=56,d=64</M>에서 basic 두 3×3은 약 2.31억 MAC, <M>4d\to d\to d\to4d</M> bottleneck은 약 2.18억 MAC이다. 1×1 축소 없이 넓은 channel에서 3×3을 쓰면 이 장점이 사라진다.</p>
      </div>
      <Formula
        latex={String.raw`\begin{aligned}\underbrace{C_{\mathrm{basic}}}_{\text{공간 kernel 두 번}}&=\underbrace{18HWd^2}_{2\cdot9\cdot HWd^2}\\\underbrace{C_{\mathrm{bneck}}}_{\text{축소·공간·복원}}&=\underbrace{(4+9+4)HWd^2}_{17HWd^2}\end{aligned}`}
        meaning="Convolution MAC은 output 위치 수 HW, input channel, output channel과 kernel 면적을 곱해 센다. Bottleneck은 4d 폭의 입출력을 1×1로 d까지 줄여 비싼 3×3을 d×d에서 수행하고 다시 4d로 복원한다."
        symbols={[["H,W", 'Feature map 높이와 너비'], ["d", 'Bottleneck 안쪽 channel 폭'], ["18", 'Basic block의 3×3 두 개에서 2×9'], ["4+9+4", '축소 1×1, 3×3, 복원 1×1의 channel 곱 계수']]}
      />
      <BottleneckCostLab />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>숫자 18·34·50·101을 외우기보다 checkpoint가 어떤 block과 stride placement, normalization variant를 쓰는지 확인한다. 원 ResNet-50과 TorchVision의 흔한 v1.5 구현은 bottleneck의 stride를 두는 위치가 다르다. BatchNorm running statistics, resize·crop·normalization과 weight recipe도 architecture 이름 밖의 필수 manifest다.</p>
        <CitationBlock source="Identity Mappings in Deep Residual Networks · He et al." citeKey={2} href="https://arxiv.org/abs/1603.05027"><p>후속 논문은 identity shortcut과 activation 배치를 분석하고 pre-activation residual unit을 제안한다. “ResNet”이라는 이름만으로 post-activation과 pre-activation 구현을 같다고 가정하면 안 된다.</p></CitationBlock>
      </div>
    </section>

    <section id="impact" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Residual path는 backbone을 넘어 학습 가능한 깊이의 기본 문법이 됐다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Residual connection은 CNN뿐 아니라 Transformer block에도 남아 있다. 다만 operator가 같다는 뜻은 아니다. <InternalLink slug="vision-transformer">ViT</InternalLink>에서는 <M>[B,N,D]</M> token에 LayerNorm·attention·MLP update를 더하고, CNN ResNet은 <M>[B,C,H,W]</M> feature map에 convolution update를 더한다. 다음 글에서는 보존되는 residual 문법과 바뀌는 locality·position·readout 계약을 함께 추적한다.</p>
      </div>
      <StopRule>ResNet 이전의 모든 image classification 논문을 필수로 읽지 않는다. Degradation과 overfitting을 구분하고, identity·projection shortcut의 forward 식과 gradient 식, stage shape을 설명할 수 있으면 현재 backbone을 읽는 최소 논문 바닥에 도달했다.</StopRule>
      <CapabilityCheck items={[
        'Training error가 증가하는 degradation과 test overfitting을 구분한다.',
        'H(x) 전체 대신 F(x)=H(x)-x를 학습한다는 의미를 설명한다.',
        'Identity term이 forward와 backward 식에 어떻게 등장하는지 계산한다.',
        'Post-activation v1의 ReLU gate와 full pre-activation의 clean path를 구분한다.',
        'Shape이 같은 block과 downsample stage의 shortcut을 구분한다.',
        'Projection shortcut의 backward 항이 I가 아니라 W_s임을 설명한다.',
        'Basic block과 bottleneck의 MAC을 channel path에서 계산한다.',
        'Basic block·bottleneck·pre-activation variant를 checkpoint manifest에서 확인한다.',
        'Backbone 교체 시 normalization state·preprocess·feature stage를 함께 version한다.',
      ]} />
      <SourceNotes sources={[
        { label: 'Deep Residual Learning for Image Recognition', href: 'https://openaccess.thecvf.com/content_cvpr_2016/html/He_Deep_Residual_Learning_CVPR_2016_paper.html', note: 'Degradation observation, option A·B shortcut, bottleneck 계산과 original post-activation architecture의 1차 근거.' },
        { label: 'Identity Mappings in Deep Residual Networks', href: 'https://arxiv.org/abs/1603.05027', note: 'Identity signal propagation과 pre-activation unit 분석의 1차 근거.' },
        { label: 'A ConvNet for the 2020s', href: 'https://arxiv.org/abs/2201.03545', note: 'ResNet에서 modern ConvNet 설계로 이어지는 비교 실험.' },
      ]} />
    </section>
  </>;
}
