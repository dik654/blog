import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CitationBlock } from '@/components/ui/citation';
import { CapabilityCheck, LearningHandoff, Misconception, SourceNotes } from '@/components/learning/ArticleLearning';
import DetrCanonicalSource from './deformable-detr/DetrCanonicalSource';
import DeformableDetectionExplorer from './deformable-detr/viz/DeformableDetectionExplorer';

export default function DeformableDetrArticle() {
  return (
    <div className="space-y-16">
      <DetrCanonicalSource />

      <section id="detr-bottleneck" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원래 DETR은 왜 느리게 수렴하고 작은 객체에 약했나</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>초기 query는 객체 위치를 모른다. 원래 DETR은 backbone 마지막 stage의 single-scale feature를 dense cross-attention으로 읽는다. Query는 그 map의 모든 위치를 훑으며 어떤 위치를 책임질지 학습해야 한다. 해상도를 높이면 작은 객체는 보존되지만 token 수가 늘어 attention 비용이 커지고, 낮추면 작은 객체의 신호가 한두 cell에 뭉개진다.</p>
          <M display>{String.raw`\underbrace{\text{dense reads}}_{\text{query마다 보는 위치}}\propto\underbrace{Q}_{\text{object queries}}\times\underbrace{\sum_{\ell=1}^{L}H_\ell W_\ell}_{\text{모든 scale의 모든 pixel}}`}</M>
          <FormulaNote meaning="이 식은 원래 DETR의 실제 single-scale 구현식이 아니라, 여러 scale을 모두 dense하게 읽는다고 가정한 비교 기준이다. 작은 객체를 위해 고해상도 map을 추가할수록 각 query가 읽는 위치 수가 그대로 더해지는 비용을 보여 준다." symbols={[["Q", 'object query 수'], ["L", '비교 기준에 넣은 feature level 수'], ["H_\\ell W_\\ell", 'level ℓ의 spatial 위치 수']]} />
        </div>
        <Misconception>Deformable DETR의 핵심은 box가 휘어진다는 뜻이 아니다. 각 query가 읽을 feature 위치의 offset을 학습해 sparse하게 sampling한다는 뜻이다.</Misconception>
      </section>

      <section id="deformable-attention" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Reference point 주변의 K개 위치만 읽기</h2>
        <DeformableDetectionExplorer />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>각 query는 기준점 <M>p_q</M>를 갖고, attention head마다 feature level <M>\ell</M>과 sampling point <M>k</M>에 대한 offset과 weight를 예측한다. 좌표가 정수 pixel과 맞지 않으면 주변 네 grid 값의 거리 가중 평균인 <strong>bilinear interpolation</strong>으로 feature를 읽는다.</p>
          <div data-formula-pair>
            <M display>{String.raw`\underbrace{y_q}_{\text{query }q\text{의 새 표현}}=\sum_{h=1}^{H}\underbrace{W_h y_q^{(h)}}_{\text{head }h\text{의 정보를 합침}}`}</M>
            <M display>{String.raw`\begin{aligned}
\underbrace{r_{hq\ell k}}_{\text{실제로 읽을 좌표}}
&=\underbrace{\phi_\ell(p_q)}_{\text{level별 기준점}}
+\underbrace{\Delta p_{hq\ell k}}_{\text{학습한 offset}}\\
\underbrace{v_{hq\ell k}}_{\text{sampled value}}
&=W'_h x^{(\ell)}(r_{hq\ell k})\\
y_q^{(h)}
&=\sum_{\ell=1}^{L}\sum_{k=1}^{K}
\underbrace{A_{hq\ell k}}_{\text{sample 중요도}}v_{hq\ell k}\\
\underbrace{\sum_{\ell=1}^{L}\sum_{k=1}^{K}A_{hq\ell k}}_{\text{level·point 전체 weight}}&=1
\end{aligned}`}</M>
            <FormulaNote meaning="왜 head 합과 spatial sampling 합을 나누나: 각 head가 W'_h로 자기 value 공간을 만든 뒤 reference point 주변에서 서로 다른 위치와 feature level을 읽고, 바깥 W_h가 그 결과를 한 query 표현으로 모은다는 두 역할을 구분하기 위해서다. A는 각 head·query에서 모든 level·point에 대해 softmax로 정규화되어 합이 1이 된다. Reference point는 현재 예상 위치를 고정하고 offset은 모서리·내부 texture·인접 context를 상대 이동으로 찾는다." symbols={[["H", 'attention head 수'], ["p_q", 'query q의 normalized reference point'], ["\\phi_\\ell", 'normalized 좌표를 level ℓ 좌표로 변환'], ["\\Delta p_{hq\\ell k}", 'head별로 학습된 sampling offset'], ["v_{hq\\ell k}", 'projection을 거친 sampled value'], ["A_{hq\\ell k}", 'level·point 축으로 합이 1인 attention weight'], ["W'_h", 'head h가 sampled feature에 적용하는 value projection']]} />
          </div>
          <div data-formula-pair>
            <M display>{String.raw`\begin{aligned}
x_0&=\lfloor r_x\rfloor,\; y_0=\lfloor r_y\rfloor\\
\underbrace{\alpha_a}_{\text{가로 weight}}&=1-|r_x-(x_0+a)|\\
\underbrace{\beta_b}_{\text{세로 weight}}&=1-|r_y-(y_0+b)|\\
\underbrace{\hat x^{(\ell)}(r)}_{\text{보간한 feature}}
&=\sum_{a=0}^{1}\sum_{b=0}^{1}\alpha_a\beta_b
x^{(\ell)}_{y_0+b,\,x_0+a}
\end{aligned}`}</M>
            <FormulaNote meaning="실수 sampling 좌표가 grid 정수 위치 사이에 있으면 왼쪽·오른쪽과 위·아래 네 feature를 거리의 반대 비율로 섞는다. 이 생성 weight 네 개의 합은 1이며, border 밖으로 나간 좌표는 구현의 padding·clamp 규칙을 따로 확인해야 한다." symbols={[["r_x,r_y", '현재 feature level에서의 실수 sampling 좌표'], ["x_0,y_0", '좌상단 정수 grid 좌표'], ["a,b", '왼쪽·오른쪽과 위·아래를 고르는 0 또는 1'], ["\\alpha_a,\\beta_b", '가로·세로 거리로 만든 보간 weight'], ["x^{(\\ell)}[y,x]", 'level ℓ의 정수 grid feature']]} />
          </div>
          <div className="not-prose my-7 overflow-hidden rounded-md border border-border" data-bilinear-fixture>
            <div className="border-b border-border bg-muted/20 px-4 py-4 sm:px-5">
              <p className="text-xs font-black uppercase text-muted-foreground">교육용 수치 fixture · 실제 checkpoint 출력 아님</p>
              <p className="mt-2 text-sm font-bold">r=(1.25, 2.50)에서 네 이웃을 섞으면 sampled value는 7.0이다</p>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-4">
              {[
                ['x[2,1] = 2', '0.75×0.50 = 0.375', '0.75'],
                ['x[2,2] = 6', '0.25×0.50 = 0.125', '0.75'],
                ['x[3,1] = 10', '0.75×0.50 = 0.375', '3.75'],
                ['x[3,2] = 14', '0.25×0.50 = 0.125', '1.75'],
              ].map(([value, weight, contribution]) => <div key={value} className="min-w-0 bg-background p-4"><p className="font-mono text-sm font-black">{value}</p><p className="mt-2 text-xs text-muted-foreground">weight · {weight}</p><p className="mt-2 text-xs font-bold">기여값 · {contribution}</p></div>)}
            </div>
            <p className="border-t border-border px-4 py-4 font-mono text-sm font-black sm:px-5">0.75 + 0.75 + 3.75 + 1.75 = 7.00</p>
          </div>
          <p>예를 들어 query 300개, head 8개, level 4개, level당 point 4개면 한 layer가 읽는 sample은 <M>{String.raw`300\times8\times4\times4=38{,}400`}</M>개다. 이는 모든 multi-scale pixel을 query마다 읽는 것과 다른 비용 구조다.</p>
          <CitationBlock source="Zhu et al. · Deformable DETR" citeKey={2} href="https://arxiv.org/abs/2010.04159"><p>원 논문은 reference point 주변의 소수 sampling location에 attention을 적용하고 이를 multi-scale feature aggregation으로 확장한다.</p></CitationBlock>
        </div>
      </section>

      <section id="multi-scale" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Multi-scale이 작은 객체를 살리는 방식</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['고해상도 level', '작은 객체가 여러 feature cell에 남아 localization 근거를 제공한다.'],
            ['저해상도 level', '큰 receptive field와 semantic context를 싸게 제공한다.'],
            ['learned offset', '각 query가 level마다 어디를 읽을지 객체 크기와 모양에 맞게 이동한다.'],
            ['attention weight', '모든 level을 똑같이 평균하지 않고 현재 객체에 유용한 sample을 선택한다.'],
          ].map(([label, body]) => <div key={label} className="grid gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)]"><p className="text-sm font-bold">{label}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p><strong>AP_small</strong>은 작은 객체 subset에서 계산한 Average Precision이다. 이 값이 낮을 때 무조건 query 수부터 늘리면 안 된다. 고해상도 feature가 입력되는지, small-object query의 reference point가 맞는지, offset이 고해상도 level의 객체 주변으로 퍼지는지, matching에서 작은 box 비용이 묻히는지를 차례로 본다.</p></div>
      </section>

      <section id="diagnose" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">mAP는 정상인데 AP_small만 낮을 때</h2>
        <p className="prose prose-neutral max-w-none dark:prose-invert"><strong>mAP(mean Average Precision)</strong>는 class 또는 IoU 조건별 AP를 평균한 전체 요약값이다. 평균이 정상이어도 작은 객체 slice의 실패는 가려질 수 있다.</p>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['01 · 입력 해상도', '작은 객체가 backbone feature에서 사라졌다면 attention head는 복구할 수 없다.'],
            ['02 · level 사용량', '작은 객체 query가 고해상도 level에 충분한 weight를 주는지 본다.'],
            ['03 · offset 분포', 'sample이 객체 내부·경계가 아니라 background에 고정되는지 시각화한다.'],
            ['04 · matching/loss', '작은 box의 L1·GIoU와 class 비용이 큰 객체에 묻히는지 분리한다.'],
            ['05 · query recall', 'query가 부족한지 판단하되, 먼저 assignment collision과 no-object 비율을 본다.'],
          ].map(([label, body]) => <div key={label} className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"><p className="font-mono text-xs font-black">{label}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <CapabilityCheck items={[
          '분류와 set prediction detection의 출력 계약 차이를 설명할 수 있다.',
          'Hungarian matching이 중복 예측을 어떻게 학습 신호로 바꾸는지 설명할 수 있다.',
          'Q×heads×levels×points로 sparse sample 수를 계산할 수 있다.',
          'Level·point attention weight의 합이 1이 되는 축을 말할 수 있다.',
          '실수 좌표에서 주변 네 grid feature의 bilinear weight와 sampled value를 계산할 수 있다.',
          'AP_small 저하를 feature level, offset, matching, query 문제로 나눠 진단할 수 있다.',
        ]} />
        <LearningHandoff
          description="Deformable DETR의 산출물은 multi-scale feature에서 query별 sparse sample을 읽어 중복 없는 box set을 만드는 detection 계약이다. Attention 일반론, detection system, mask·tracking은 서로 다른 막힘에만 연다."
          items={[
            { label: '막히면', slug: 'attention-theory', title: 'Attention 이론', reason: 'Query·key·value, normalized weight와 dense attention의 역할이 흐려질 때 score와 weighted sum부터 복습한다.' },
            { label: '막히면', slug: 'object-detection-systems', title: 'Object Detection Systems', reason: 'Box coordinate, IoU, matching, AP와 deployment threshold가 어떻게 하나의 detector 계약을 이루는지 확인한다.' },
            { label: '적용하기', slug: 'vision-promptable-segmentation-tracking', title: 'Promptable Segmentation · Tracking', reason: 'Box만으로 부족해 pixel mask와 시간축 identity가 필요할 때 output contract를 확장한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'DETR', href: 'https://arxiv.org/abs/2005.12872', note: 'end-to-end set prediction과 bipartite matching의 기준점.' },
          { label: 'Deformable DETR', href: 'https://arxiv.org/abs/2010.04159', note: 'sparse multi-scale deformable attention과 convergence 개선.' },
          { label: 'Official implementation', href: 'https://github.com/fundamentalvision/Deformable-DETR', note: 'multi-scale attention module과 training configuration.' },
        ]} />
      </section>
    </div>
  );
}
