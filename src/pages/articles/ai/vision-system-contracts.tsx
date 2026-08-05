import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CitationBlock } from '@/components/ui/citation';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { CoordinateTransformLab, TaskContractLab, VisionReleaseGate } from './vision-system-contracts/viz/VisionContractLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return (
    <div className="not-prose my-6 min-w-0">
      <div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><M display className="my-0 text-[12px] sm:text-base">{latex}</M></div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const taskRows = [
  ['Class', 'frame 또는 crop 하나', 'label + confidence', '전체 장면의 상태를 한 값으로 결정할 때'],
  ['Box', 'image + vocabulary', 'instance별 class·score·xyxy', '객체 수와 대략적인 위치가 필요할 때'],
  ['Mask', 'image + prompt 또는 vocabulary', 'instance별 pixel 집합', '경계·면적·접촉 여부를 계산할 때'],
  ['Identity', 'video + object state', 'frame별 stable ID + box/mask', '가림 전후 같은 객체를 이어야 할 때'],
] as const;

export default function VisionSystemContractsArticle() {
  return (
    <>
      <section id="product-question" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">모델보다 먼저 “무슨 답을 낼 것인가”를 고른다</h2>
        <BeginnerOpening
          title="컴퓨터 비전은 image나 video를 보고, 제품이 사용할 수 있는 구조화된 답을 만드는 분야입니다."
          description={<>사진 전체의 이름 하나를 고를 수도 있고, 물체마다 위치 상자를 그리거나, 정확한 pixel 경계를 칠하거나, video에서 같은 물체를 계속 같은 ID로 이어 갈 수도 있다. 이 답들은 서로 다른 <strong className="text-foreground">출력 계약</strong>이다.</>}
          familiarScene={<>공장 검사원이 “불량이 있다”고만 적는 것과, 모든 흠집의 위치·면적을 표시하고 컨베이어를 따라 같은 흠집을 계속 추적하는 것은 다른 일이다. 첫 보고에는 분류만 필요하지만 두 번째 보고에는 찾기, 경계 그리기와 시간축 identity가 모두 필요하다.</>}
          steps={[
            { label: '필요한 답의 모양을 고른다', detail: 'Class, box, mask와 stable ID 중 제품이 실제로 소비할 field를 적는다.' },
            { label: '좌표와 시간 기준을 붙인다', detail: '원본 image 기준 위치와 frame 사이 같은 객체를 구분하는 state를 보존한다.' },
            { label: '실패 조건으로 평가한다', detail: '작은 물체, 가림, 조명과 target device runtime처럼 평균이 숨기는 필수 slice를 정한다.' },
          ]}
        />
        <QuestionLead
          question="공장 카메라에서 ‘모든 scratch를 찾고 가림 뒤에도 같은 결함으로 세어 달라’고 했다. 이미지 분류 모델 하나면 충분할까?"
          answer="아니다. 이 문장에는 적어도 여러 instance를 찾는 detection, 실제 경계를 내는 instance mask, frame 사이에서 같은 객체를 유지하는 identity가 들어 있다. 먼저 이 출력을 독립적인 schema와 실패 조건으로 분해해야 모델과 metric을 올바르게 고를 수 있다."
        />
        <TaskContractLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>컴퓨터 비전의 task 이름은 논문 분류표가 아니라 <strong>모델이 외부에 약속하는 출력 계약</strong>이다. “고양이를 안다”는 class claim, “여기에 있다”는 geometry claim, “이 pixel이다”는 boundary claim, “아까 그 객체다”는 temporal identity claim은 서로 다르다.</p>
          <p>한 모델이 여러 출력을 낼 수는 있다. 그러나 box가 있다고 mask가 자동으로 참이 되지 않고, mask가 있다고 이름이나 ID가 자동으로 생기지 않는다. 제품 요구를 먼저 output field로 써 보면 필요 없는 모델 계보를 공부하는 시간을 줄일 수 있다.</p>
        </div>
        <Misconception>“Vision foundation model”이라는 이름은 분류·탐지·분할·추적을 모두 같은 품질로 보장한다는 뜻이 아니다. 각 head, prompt, state와 평가 fixture가 실제로 어떤 출력을 검증했는지 따로 확인한다.</Misconception>
      </section>

      <section id="task-contracts" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Class·Box·Mask·ID는 네 개의 다른 주장이다</h2>
        <ConceptPrimer items={[
          { term: 'Semantic segmentation', meaning: '각 pixel에 class를 붙이되 같은 class의 개별 객체를 나누지 않는다.', why: '도로·하늘처럼 영역 종류가 중요하고 개체 수가 필요 없을 때 적합하다.' },
          { term: 'Instance segmentation', meaning: '같은 class라도 객체마다 다른 mask와 instance ID를 낸다.', why: 'scratch 두 개의 면적과 경계를 각각 계산할 수 있다.' },
          { term: 'Promptable segmentation', meaning: '점·박스·text·예시처럼 사용자가 지정한 대상을 mask로 선택한다.', why: '고정 class head 밖의 대상이나 interactive correction을 처리한다.' },
          { term: 'Tracking', meaning: 'frame마다 관측한 객체를 시간축의 같은 identity로 연결한다.', why: '중복 집계, 이동 경로, 가림과 재등장 판단에는 공간 mask만으로 부족하다.' },
        ]} />
        <div className="not-prose divide-y divide-border border-y border-border">
          {taskRows.map(([output, input, schema, use]) => <div key={output} className="grid gap-2 py-4 sm:grid-cols-[5rem_9rem_minmax(0,1fr)]"><p className="font-mono text-xs font-black">{output}</p><p className="text-xs text-muted-foreground">{input}</p><p className="min-w-0 text-sm leading-relaxed"><code className="break-words">{schema}</code><span className="mt-1 block text-xs text-muted-foreground">{use}</span></p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>예를 들어 SAM 1은 점·박스 같은 prompt로 mask를 선택하는 기준점을 만들었다. SAM 2는 여기에 streaming video memory를 더했다. SAM 3 계열의 concept prompt와 detector-tracker 결합은 다시 “이름으로 모든 instance를 찾기”를 추가한다. 자세한 현재 경로는 <InternalLink slug="vision-promptable-segmentation-tracking">SAM 3.1 글</InternalLink>에서 이어진다.</p>
          <CitationBlock source="Segment Anything · Kirillov et al." citeKey={1} href="https://arxiv.org/abs/2304.02643"><p>원 논문은 image encoder, prompt encoder, mask decoder를 분리하고 promptable segmentation task와 data engine을 제시한다. 여기서는 prompt가 선택한 mask라는 최소 계약의 근거로 쓴다.</p></CitationBlock>
          <CitationBlock source="SAM 2 · Ravi et al." citeKey={2} href="https://arxiv.org/abs/2408.00714"><p>SAM 2는 streaming memory를 사용해 image와 video의 promptable segmentation을 연결한다. 그러나 이 구조가 모든 camera cut, 긴 가림과 재등장 뒤의 동일 ID 복구를 자동으로 보장한다는 근거로 쓰지 않는다.</p></CitationBlock>
        </div>
        <StopRule>Segmentation 역사를 U-Net 이전까지 필수로 내려가지 않는다. class, instance, prompt와 temporal ID의 출력 차이를 말할 수 있으면 현재 시스템을 읽는 데 필요한 task 바닥은 충분하다.</StopRule>
      </section>

      <section id="coordinate-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정답 box는 좌표계를 함께 가져야 한다</h2>
        <CoordinateTransformLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>모델은 보통 원본 1920×1080을 그대로 받지 않는다. Resize, letterbox padding, crop, flip과 normalization을 거쳐 640×640 tensor를 만든다. 모델이 낸 box가 원본 영상 위에 정확히 올라가려면 이 변환을 역순으로 되돌려야 한다.</p>
          <p><strong>좌표 네 개만 저장하면 부족하다.</strong> <code>xyxy</code>인지 <code>cxcywh</code>인지, 원본 pixel인지 0–1 normalized 좌표인지, padding 전인지 후인지, 경계가 inclusive인지 exclusive인지까지 schema에 포함한다.</p>
          <p>Batch·channel·height·width와 가변 object 축을 읽는 데 막히면 <InternalLink slug="linear-algebra-tensors">선형대수와 Tensor Shape</InternalLink>에서 detection output의 shape부터 검산한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}x_m&=\underbrace{s_x(x_s-c_x)}_{\text{crop 뒤 x resize}}+\underbrace{p_x}_{\text{x 여백}}\\y_m&=\underbrace{s_y(y_s-c_y)}_{\text{crop 뒤 y resize}}+\underbrace{p_y}_{\text{y 여백}}\\x_s&=\underbrace{\frac{x_m-p_x}{s_x}}_{\text{여백 제거·크기 복원}}+\underbrace{c_x}_{\text{crop 원점 복원}}\end{aligned}`}
          meaning="Source pixel을 model input 좌표로 보낼 때 crop origin을 빼고 축별 scale을 적용한 뒤 padding을 더한다. 예측을 원본으로 되돌릴 때는 정확히 역순으로 계산한다."
          symbols={[["x_s,y_s", '원본 source pixel 좌표'], ["x_m,y_m", '모델 입력 좌표'], ["s_x,s_y", 'x·y축 resize 비율'], ["c_x,c_y", '원본에서 잘라낸 crop 시작점'], ["p_x,p_y", 'letterbox로 더한 padding']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>학습 data augmentation도 같은 원칙을 따른다. Image, box, mask와 keypoint가 하나의 transform record를 공유해야 한다. Image만 flip하고 box를 그대로 두는 버그는 loss가 내려가도 모델을 잘못 가르친다. 배포에서는 transform record와 postprocess revision을 artifact manifest에 넣어야 한다.</p>
        </div>
      </section>

      <section id="score-geometry" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Confidence는 “어디가 겹치는가”를 말하지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Class 또는 phrase score는 이 candidate가 어떤 개념에 해당한다는 모델의 상대 점수다. <strong>IoU(Intersection over Union, 교집합/합집합 비율)</strong>는 두 영역의 기하학적 겹침이다. 높은 score의 box 두 개가 같은 객체를 중복 예측할 수도 있고, score가 낮은 box가 작은 실제 객체일 수도 있다.</p>
        </div>
        <Formula
          latex={String.raw`\operatorname{IoU}(A,B)=\frac{\underbrace{|A\cap B|}_{\text{두 영역이 함께 차지한 면적}}}{\underbrace{|A\cup B|}_{\text{둘 중 하나라도 차지한 전체 면적}}}`}
          meaning="IoU는 두 box 또는 mask가 얼마나 같은 위치를 설명하는지 측정한다. Class가 맞는지, confidence가 calibration됐는지는 별도 질문이다."
          symbols={[["A,B", '비교할 두 box 또는 mask 영역'], [String.raw`A\cap B`, '교집합'], [String.raw`A\cup B`, '합집합'], [String.raw`\operatorname{IoU}`, '0에서 1 사이의 겹침 비율']]}
        />
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            ['Threshold', '각 candidate를 낼지 말지 score로 고른다. Calibration과 비용이 바뀌면 threshold도 다시 검증한다.'],
            ['NMS · 비최대 억제', 'Non-Maximum Suppression. 겹침이 큰 여러 candidate 중 대표를 남겨 같은 객체의 중복을 후처리에서 줄인다.'],
            ['Set prediction', '학습 때 query와 정답을 일대일 matching해 중복 책임을 loss에 넣는다. NMS가 항상 0이라는 뜻은 아니다.'],
          ].map(([title, body]) => <div key={title} className="min-w-0 bg-background p-5"><p className="text-sm font-bold">{title}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">Set prediction과 sparse multi-scale sampling은 <InternalLink slug="deformable-detr">Deformable DETR 글</InternalLink>에서 숫자로 계산한다.</p>
        <CitationBlock source="DETR · Carion et al." citeKey={3} href="https://arxiv.org/abs/2005.12872"><p>DETR은 bipartite matching을 이용한 direct set prediction을 제시한다. 여기서 end-to-end는 별도 anchor 생성과 NMS를 없앤 model objective의 경계이며, 입력 전처리·좌표 역변환·제품 release 검증까지 사라진다는 뜻이 아니다.</p></CitationBlock>
      </section>

      <section id="evaluation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">AP 하나 대신 실패가 드러나는 축으로 평가한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Precision</strong>은 모델이 냈다고 한 것 중 맞은 비율이고, <strong>recall</strong>은 실제 정답 중 찾은 비율이다. Threshold를 낮추면 보통 recall은 오르지만 false positive가 늘어 precision이 내려간다. <strong>AP(Average Precision, 평균 정밀도)</strong>는 threshold를 움직여 얻은 precision-recall 관계를 요약한다.</p>
          <p>한 holdout 평균과 실제 배포 실패 확률을 분리하는 더 바닥은 <InternalLink slug="statistics-generalization">통계와 일반화</InternalLink>에서 이어서 본다. 여기서 split, sampling variation과 distribution shift를 구분한다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{P}_{\text{예측의 정확도}}=\frac{\underbrace{TP}_{\text{맞게 찾은 수}}}{\underbrace{TP+FP}_{\text{모델이 찾았다고 한 수}}}\qquad\underbrace{R}_{\text{정답 회수율}}=\frac{\underbrace{TP}_{\text{맞게 찾은 수}}}{\underbrace{TP+FN}_{\text{실제로 존재한 수}}}`}
          meaning="Precision과 recall은 분모가 다르다. 제품에서 놓침이 위험한지, 잘못된 알람이 비싼지에 따라 threshold와 우선 metric이 달라진다."
          symbols={[["TP", '예측과 정답이 matching된 true positive'], ["FP", '정답과 matching되지 않은 false positive'], ["FN", '모델이 놓친 false negative'], ["P,R", 'precision과 recall']]}
        />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Scale', '12–20px scratch, 중간, 큰 객체를 나눠 resize와 feature stride 손실을 찾는다.'],
            ['Condition', '역광, motion blur, 반사, 오염, camera별 색 분포를 분리한다.'],
            ['Vocabulary', '학습 class, unseen category, 동의어, 한국어 속성 조합과 hard negative를 나눈다.'],
            ['Temporal', '짧은 가림, 긴 가림, camera cut, re-entry와 유사 distractor에서 ID switch를 잰다.'],
            ['Runtime', 'target device·precision·batch·resolution에서 p50/p95, throughput, peak memory를 남긴다.'],
          ].map(([label, body], index) => <div key={label} className="grid gap-2 py-4 sm:grid-cols-[3rem_7rem_minmax(0,1fr)]"><span className="font-mono text-sm font-black text-muted-foreground">0{index + 1}</span><p className="text-sm font-bold">{label}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <CitationBlock source="COCO · Lin et al." citeKey={4} href="https://arxiv.org/abs/1405.0312"><p>COCO(Common Objects in Context)는 object detection, instance segmentation과 small/medium/large object를 포함한 대규모 평가 기준을 제공했다. 여기서는 metric 언어의 기준점으로 쓰며, COCO AP가 곧 특정 제품의 release threshold라고 가정하지 않는다.</p></CitationBlock>
      </section>

      <section id="handoff" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Detector·Segmenter·Tracker의 책임을 연결한다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['01 · Detect', '후보 class/phrase, score, source-coordinate box와 detector revision을 낸다. Recall이 낮으면 뒤 단계가 복구하지 못한다.'],
            ['02 · Segment', '선택된 box·point·text prompt와 mask, ambiguity score를 연결한다. Mask가 box 밖으로 나가도 좌표계는 source 기준으로 되돌린다.'],
            ['03 · Associate', 'appearance, geometry, motion과 memory를 이용해 새 관측을 기존 track ID와 연결하거나 new ID로 연다.'],
            ['04 · Correct', 'drift·ID swap·occlusion을 발견한 prompt와 correction event를 state log에 남긴다.'],
            ['05 · Consume', 'downstream rule은 어떤 model field와 threshold를 사용했는지 provenance와 함께 결과를 저장한다.'],
          ].map(([title, body]) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"><p className="font-mono text-xs font-black">{title}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Detection과 segmentation을 연결할 때 box가 어느 image revision에서 나왔는지 보존해야 한다. 원본 영상에 privacy blur나 crop을 한 뒤 이전 box를 재사용하면 좌표는 같아 보여도 다른 pixel을 가리킨다. Tracking은 <code>track_id</code>뿐 아니라 <code>visible</code>, <code>occluded</code>, <code>lost</code>, <code>terminated</code> 같은 상태 전이를 명시해야 한다.</p>
        </div>
      </section>

      <section id="release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Release gate와 가장 어려운 검산</h2>
        <QuestionLead
          question="전체 AP는 올랐지만 12–20px scratch recall이 0.61이고, 20-frame 가림 뒤 ID가 바뀐다. 평균이 좋아졌으니 배포해도 될까?"
          answer="안 된다. 이 제품의 필수 요구가 작은 scratch와 동일 ID 유지이므로 둘은 blocking slice다. 평균 AP는 다른 쉬운 객체의 개선으로 이 실패를 숨길 수 있다. 좌표 round-trip, critical task slice, identity와 target-device runtime이 모두 통과해야 한다."
        />
        <VisionReleaseGate />
        <Formula
          latex={String.raw`\operatorname{release}=\underbrace{G_{coord}}_{\text{원본 좌표 복원}}\land\underbrace{G_{task}}_{\text{필수 품질 slice}}\land\underbrace{G_{id}}_{\text{시간축 ID 유지}}\land\underbrace{G_{run}}_{\text{목표 장비 runtime}}`}
          meaning="Critical gate를 평균내지 않고 모두 참일 때만 release한다. 사용하지 않는 identity task라면 G_id를 억지로 측정하는 대신 계약에서 제거하고 그 사실을 명시한다."
          symbols={[["G_{coord}", 'box·mask transform round-trip gate'], ["G_{task}", 'precision·recall·AP와 critical scenario gate'], ["G_{id}", 'occlusion·cut·re-entry identity gate'], ["G_{run}", 'target device latency·throughput·memory gate']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>1920×1080 검사 영상에 적용한다</h3>
          <ol>
            <li>요구를 frame class가 아니라 instance mask와 stable track ID로 쓴다. Scratch 길이는 source pixel에서 계산한다.</li>
            <li>640×640 letterbox의 scale과 <code>pad_y</code>를 record하고 모든 box·mask를 source pixel로 역변환한다.</li>
            <li>인접 scratch의 box overlap은 duplicate인지 두 instance인지 mask와 annotation policy로 판정한다. Score만 보고 하나를 지우지 않는다.</li>
            <li>반사는 hard negative slice로, 12–20px scratch는 scale slice로, 20-frame 가림과 camera cut은 identity slice로 둔다.</li>
            <li>모델·input transform·postprocess·threshold·vocabulary와 target device를 한 release manifest로 pin한다.</li>
          </ol>
        </div>
        <CapabilityCheck items={[
          '분류, detection, semantic·instance·promptable segmentation과 tracking의 출력 차이를 설명한다.',
          'Source/model/feature 좌표와 xyxy·cxcywh·normalized 표현을 구분한다.',
          'Resize, padding과 crop을 기록해 box를 원본 pixel로 역변환한다.',
          'Confidence, IoU, threshold, NMS와 set prediction의 책임을 분리한다.',
          'Precision·recall·AP를 설명하고 작은 객체·조건·언어·시간·runtime slice를 설계한다.',
          'Detector→segmenter→tracker handoff에서 revision, coordinate와 state를 보존한다.',
          '평균 지표가 좋아도 blocking slice가 실패하면 배포를 멈춘다.',
        ]} />
        <SourceNotes sources={[
          { label: 'COCO paper', href: 'https://arxiv.org/abs/1405.0312', note: 'Detection·instance segmentation, object scale과 평가 언어의 기준점.' },
          { label: 'DETR paper', href: 'https://arxiv.org/abs/2005.12872', note: 'Bipartite matching을 이용한 direct set prediction의 기준점.' },
          { label: 'Segment Anything', href: 'https://arxiv.org/abs/2304.02643', note: 'Prompt encoder와 mask decoder로 정의한 promptable image segmentation의 최소 기준점.' },
          { label: 'SAM 2', href: 'https://arxiv.org/abs/2408.00714', note: 'Streaming memory를 이용한 promptable video segmentation과 data engine.' },
          { label: 'SAM 3.1 official release', href: 'https://ai.meta.com/blog/segment-anything-model-3/', note: 'Concept prompting과 multi-object video runtime의 현재 공개 경계. 세부 benchmark는 해당 글에서 source-scoped로 다룬다.' },
        ]} />
      </section>
    </>
  );
}
