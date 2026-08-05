import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CitationBlock } from '@/components/ui/citation';
import {
  BeginnerBridge,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { DetectionBranchLab, DetectionDecisionLab, DetectionReleaseGate } from './object-detection-systems/viz/DetectionSystemLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div data-formula-pair className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><M display className="my-0 text-[12px] sm:text-base">{latex}</M></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

function FlowRow({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return <div className="grid min-w-0 gap-2 py-4 sm:grid-cols-[4rem_10rem_minmax(0,1fr)]"><span className="font-mono text-xs font-black text-muted-foreground">{index}</span><p className="text-sm font-bold">{title}</p><div className="min-w-0 text-sm leading-relaxed text-muted-foreground">{children}</div></div>;
}

export default function ObjectDetectionSystemsArticle() {
  return (
    <>
      <section id="decision" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 vocabulary가 고정됐는지 묻는다</h2>
        <BeginnerBridge title="정해 둔 여섯 물건만 찾는 카메라와 사용자가 말한 새 물건을 찾는 카메라는 다르다">
          Object detector는 사진 속 물체의 위치를 상자로 표시하고 이름을 붙인다. Fixed vocabulary는 학습 때 정한 이름 목록 안에서만 고르고, open vocabulary는 사용자가 준 문장과 사진 영역을 비교해 처음 보는 이름도 찾으려 한다.
        </BeginnerBridge>
        <QuestionLead
          question="창고 A는 helmet·vest 등 6개 class를 60 FPS로 찾고, 창고 B는 사용자가 한국어로 입력한 낯선 물체를 찾아야 한다. 같은 detector를 쓰면 될까?"
          answer="반드시 같을 필요가 없다. A는 고정 class schema와 target-device latency가 핵심이고, B는 실행 시점의 text phrase와 region을 정렬하는 능력이 핵심이다. 둘 다 box를 내더라도 입력 계약, 학습 신호, 평가 fixture와 운영 비용이 다르다."
        />
        <DetectionBranchLab />
        <ConceptPrimer items={[
          { term: 'Fixed vocabulary', meaning: '학습과 배포에서 class ID 집합이 고정된 detector.', why: '적은 class를 반복해 빠르게 처리하고 class별 threshold를 안정적으로 검증할 수 있다.' },
          { term: 'Open vocabulary', meaning: '실행 중 category name이나 referring expression을 넣어 region을 찾는 detector.', why: '새 class마다 head를 다시 학습하지 않고 자연어 concept를 검색할 수 있다.' },
          { term: 'Phrase grounding', meaning: '문장 전체가 아니라 어떤 text span이 어느 box와 연결되는지 내는 작업.', why: '“파란 조끼를 입고 쓰러진 사람”처럼 속성과 관계가 있는 요청을 region과 연결한다.' },
          { term: 'DETR', meaning: 'DEtection TRansformer. 고정된 object query와 정답 객체를 일대일로 짝짓는 detector 계열이다.', why: '같은 객체를 맡으려는 여러 예측을 학습 단계의 bipartite matching, 즉 두 집합 사이의 일대일 최적 짝짓기로 줄인다.' },
          { term: 'NMS', meaning: 'Non-Maximum Suppression, 한국어로 비최대 억제다. 점수가 높은 box를 남기고 크게 겹치는 후보를 제거한다.', why: '일대일 matching과 달리 model forward 뒤의 중복 후보를 정리하는 postprocess 책임이다.' },
          { term: 'Real-time', meaning: '특정 device·precision·batch·입력 크기에서 deadline을 만족하는 상태.', why: '논문의 FPS 숫자만으로 내 pipeline의 camera-to-action latency를 보장할 수 없다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 글에서 D-FINE은 <strong>고정 vocabulary real-time DETR의 공개 사례</strong>, Grounding DINO는 <strong>공개된 open-set grounding의 canonical 사례</strong>로 쓴다. “2026년 모든 detector 중 절대 1등”이라는 순위를 만들려는 것이 아니다. 제품 계약이 다르면 benchmark의 분모도 달라지기 때문이다.</p>
          <p>Source 좌표, box schema, IoU와 release slice에서 막히면 이 경로의 공통 기반인 <InternalLink slug="vision-system-contracts">컴퓨터 비전 작업 계약</InternalLink>으로 내려간다. 현재 모델 선택을 먼저 훑고 필요한 계약만 보강해도 된다.</p>
        </div>
      </section>

      <section id="fixed-vocabulary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Fixed vocabulary: D-FINE은 box를 좌표 네 개보다 풍부하게 다룬다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          <FlowRow index="01" title="Input"><p>고정된 resize·normalize pipeline과 class ID schema로 image batch를 만든다.</p></FlowRow>
          <FlowRow index="02" title="Backbone"><p>여러 scale의 feature를 만들어 작은 객체의 위치와 큰 객체의 semantic context를 함께 남긴다.</p></FlowRow>
          <FlowRow index="03" title="Queries"><p>고정 개수 object query가 class와 box 후보를 맡고, decoder layer가 반복해서 위치를 다듬는다.</p></FlowRow>
          <FlowRow index="04" title="FDR · Fine-grained Distribution Refinement"><p>Box 변까지의 거리를 하나의 scalar로 바로 내기보다 여러 bin의 확률 분포로 표현하고 layer마다 residual하게 refine한다.</p></FlowRow>
          <FlowRow index="05" title="GO-LSD · Global Optimal Localization Self-Distillation"><p>마지막 layer의 더 정제된 localization distribution을 앞 layer에 self-distillation 신호로 전달한다. 저자들은 inference overhead 없이 training을 개선한다고 보고한다.</p></FlowRow>
          <FlowRow index="06" title="Restore"><p>Score threshold 뒤 box를 source pixel로 역변환하고 class별 정책과 downstream event로 전달한다.</p></FlowRow>
        </div>
        <Formula
          latex={String.raw`\underbrace{\hat d}_{\text{복원한 경계 거리}}=\sum_{b=0}^{B}\underbrace{p_b}_{\text{b번째 거리일 확률}}\,\underbrace{c_b}_{\text{거리 bin의 대표값}}`}
          meaning="경계 거리를 한 숫자로 바로 회귀하지 않고 거리 후보 bin의 확률 분포로 예측한 뒤 기대값으로 복원하는 직관이다. D-FINE의 실제 FDR은 decoder layer 사이에서 이 distribution을 더 세밀하게 refine한다."
          symbols={[[String.raw`\hat d`, 'query reference에서 box 한 변까지의 예측 거리'], ["p_b", 'b번째 거리 bin의 확률'], ["c_b", 'b번째 bin이 나타내는 거리'], ["B+1", '사용하는 거리 후보 개수']]}
        />
        <CitationBlock source="D-FINE · Peng et al." citeKey={1} href="https://arxiv.org/abs/2410.13842"><p>논문은 Fine-grained Distribution Refinement와 Global Optimal Localization Self-Distillation을 제안하고 COCO 및 T4 조건의 속도·정확도 결과를 보고한다. 수치는 저자 측 측정이며 내 장비의 camera-to-action latency로 옮겨 쓰지 않는다.</p></CitationBlock>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>D-FINE 공식 repository는 N/S/M/L/X configuration, checkpoint, custom dataset fine-tuning과 benchmark script를 공개한다. 재현할 때는 모델 이름만 기록하지 않고 config, checkpoint hash, input size, precision, TensorRT 여부, batch와 GPU를 함께 남긴다.</p>
        </div>
        <Misconception>Distribution regression은 box가 여러 개라는 뜻이 아니다. 한 box 경계의 불확실한 거리 표현을 여러 bin의 확률로 두고 최종 좌표로 복원한다.</Misconception>
      </section>

      <section id="open-vocabulary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Open vocabulary: Grounding DINO는 text를 detector 안으로 넣는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>CLIP 같은 global image-text alignment만으로는 문장이 이미지와 맞는지는 알 수 있어도 어느 box가 그 문장인지 바로 나오지 않는다. Grounding DINO는 text feature를 detector의 feature enhancement, query selection과 decoder에 연결해 phrase와 region을 함께 예측한다.</p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          <FlowRow index="01" title="Tokenize"><p>Category names 또는 referring expression을 token으로 만들고 punctuation·phrase split 규칙을 prompt manifest에 남긴다.</p></FlowRow>
          <FlowRow index="02" title="Enhance"><p>Image multi-scale feature와 text feature가 early fusion 단계에서 서로의 context를 읽는다.</p></FlowRow>
          <FlowRow index="03" title="Select"><p>Language-guided query selection이 입력 text와 관련된 visual candidate를 decoder query로 고른다.</p></FlowRow>
          <FlowRow index="04" title="Decode"><p>Cross-modality decoder가 query, image와 text를 반복 결합해 box와 text token score를 refine한다.</p></FlowRow>
          <FlowRow index="05" title="Ground"><p>Threshold를 통과한 box를 phrase span과 연결하고 source pixel 좌표로 복원한다.</p></FlowRow>
        </div>
        <Formula
          latex={String.raw`\underbrace{s_{q,t}}_{\text{query와 문장 token의 점수}}=\underbrace{\tau}_{\text{점수 scale}}\,\underbrace{\frac{z_q^\top e_t}{\lVert z_q\rVert_2\lVert e_t\rVert_2}}_{\text{region query와 text 방향 일치}}`}
          meaning="Region query 표현과 text token 표현이 같은 방향인지 비교하는 단순화한 alignment 식이다. 두 벡터의 L2 길이로 나누는 이유는 표현 크기가 큰 것만 높은 점수를 받는 편향을 제거하고 방향의 일치만 비교하기 위해서다. 실제 Grounding DINO 전체 구조는 feature enhancer, query selection과 cross-modality decoder를 포함하므로 이 식 하나가 모델 전부는 아니다."
          symbols={[[String.raw`z_q`, 'q번째 region query 표현'], [String.raw`e_t`, 't번째 text token 표현'], [String.raw`\tau`, 'score 분포를 조절하는 scale'], [String.raw`s_{q,t}`, 'query q가 token t와 연결될 상대 점수']]}
        />
        <CitationBlock source="Grounding DINO · Liu et al." citeKey={2} href="https://arxiv.org/abs/2303.05499"><p>원 논문은 closed-set detector를 feature enhancer, language-guided query selection, cross-modality decoder의 세 단계로 보고 category name과 referring expression을 받는 open-set detector를 구성한다.</p></CitationBlock>
        <div className="not-prose my-6 border-y border-border">
          <div className="grid gap-2 border-b border-border py-4 sm:grid-cols-[7rem_10rem_minmax(0,1fr)]">
            <p className="font-mono text-xs font-black text-amber-700 dark:text-amber-300">관찰 후보</p>
            <p className="text-sm font-bold">OV-DEIM</p>
            <p className="text-sm leading-relaxed text-muted-foreground">DETR-style open-vocabulary detector에 vision-language modeling과 GridSynthetic augmentation을 결합한다. 저자 보고상 실시간 효율과 rare-category 성능을 겨냥하지만, 공개 repository가 있다는 사실만으로 우리 장비의 재현·license 적합성이 끝난 것은 아니다.</p>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[7rem_10rem_minmax(0,1fr)]">
            <p className="font-mono text-xs font-black text-amber-700 dark:text-amber-300">관찰 후보</p>
            <p className="text-sm font-bold">WeDetect</p>
            <p className="text-sm leading-relaxed text-muted-foreground">Cross-modal fusion 대신 region과 text를 shared embedding에서 retrieval하는 dual-tower 계열이다. WeDetect-Uni의 proposal retrieval과 WeDetect-Ref의 referring-expression 경로까지 제안하지만, 논문 수치와 production artifact의 공개 범위를 분리해 읽는다.</p>
          </div>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Grounding DINO 1.5 논문은 Pro와 Edge 변형의 추가 결과를 보고하지만 공식 public repository는 API 사용 중심이다. 따라서 original Grounding DINO의 공개 checkpoint·inference와 1.5 hosted API를 같은 재현 가능성으로 표시하면 안 된다. DINO-X나 2026년의 후속 open-vocabulary 논문도 weight, training code, license와 target-language fixture가 확인되기 전에는 “관찰 후보”로 둔다.</p>
          <p><strong>승격 gate.</strong> OV-DEIM·WeDetect도 공개 code, 정확한 pretrained weight, 사용 license, preprocessing·postprocessing manifest와 target device 재현이 모두 확인되기 전에는 D-FINE·original Grounding DINO 기준선을 대체하지 않는다. 같은 dataset·input·precision에서 품질과 end-to-end p95를 다시 재고, 한국어 phrase와 hard negative slice까지 통과해야 비교 후보에서 기본값으로 승격한다.</p>
          <p>Image-text 표현 자체의 학습은 <InternalLink slug="clip-vision-language-model">CLIP 글</InternalLink>로 내려간다. Region query와 localization이 왜 추가로 필요한지 막힐 때만 연다.</p>
        </div>
      </section>

      <section id="postprocess" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Threshold·NMS·Set prediction은 서로 다른 질문에 답한다</h2>
        <DetectionDecisionLab />
        <Formula
          latex={String.raw`\begin{gathered}
\underbrace{s_1\ge s_2\ge\cdots\ge s_m}_{\text{높은 점수부터}}\\
\underbrace{K_i}_{\text{앞서 남긴 box}}=\{j<i\mid\operatorname{keep}(j)=1\}\\
\underbrace{I_i}_{\text{최대 겹침}}=\max_{j\in K_i}\operatorname{IoU}(b_i,b_j)\\
\operatorname{keep}(i)=\underbrace{[s_i\ge\tau_s]}_{\text{점수 통과}}\land\underbrace{[I_i<\tau_{iou}]}_{\text{겹침 통과}}
\end{gathered}`}
          meaning="전형적인 greedy NMS를 단순화한 식이다. 먼저 candidate를 score 내림차순으로 정렬한 뒤, i번째 box를 이미 keep된 선행 box 집합 K_i와 비교한다. Score threshold는 candidate 신뢰도를, IoU threshold는 기하 중복을 본다. DETR 계열은 matching으로 중복을 학습 단계에서 줄이지만 실제 pipeline의 top-k·threshold 정책은 여전히 명시해야 한다."
          symbols={[[String.raw`s_i`, '내림차순 정렬 뒤 i번째 candidate의 class 또는 phrase score'], [String.raw`\tau_s`, 'score threshold'], [String.raw`b_i`, '정렬 뒤 i번째 box'], [String.raw`K_i`, 'i보다 먼저 검사되어 keep된 box index 집합'], [String.raw`I_i`, 'i번째 box와 K_i 사이의 최대 IoU'], [String.raw`\tau_{iou}`, '중복으로 볼 overlap threshold']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Dense detector는 여러 anchor가 한 객체를 예측하므로 NMS가 핵심인 경우가 많다. DETR은 query와 ground truth를 bipartite matching해 한 정답을 한 query가 책임지게 한다. 그러나 배포 code에서 score filter, top-k, phrase span 병합이나 class별 policy가 사라지는 것은 아니다.</p>
          <p><InternalLink slug="deformable-detr">Deformable DETR</InternalLink>는 이 set prediction에 reference point와 sparse multi-scale sampling을 더한 최소 mechanism floor다. 그 아래 R-CNN과 모든 YOLO 세대를 필수로 읽지 않아도 현재 query-based detector의 실행 계약을 이해할 수 있다.</p>
        </div>
        <StopRule>Object detection 역사를 무한히 내려가지 않는다. DETR의 일대일 matching과 Deformable DETR의 multi-scale sparse sampling을 설명할 수 있으면 현재 D-FINE·Grounding DINO를 읽는 최소 논문 바닥에 도달했다.</StopRule>
      </section>

      <section id="runtime" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Runtime은 model forward 앞뒤까지 포함한다</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Capture', 'Decoder, network stream, frame queue와 timestamp. 오래된 frame을 처리하면 FPS가 높아도 action은 늦다.'],
            ['Preprocess', 'Color order, resize, padding, normalization과 device transfer. Training transform와 동일한지 검산한다.'],
            ['Forward', 'Model, precision, compile/TensorRT, batch, warmup과 CUDA synchronization 조건을 기록한다.'],
            ['Postprocess', 'Top-k, threshold, NMS 또는 phrase span, source-coordinate inversion과 mask handoff 비용을 포함한다.'],
            ['Decision', 'Tracking, business rule, event serialization과 downstream action까지 end-to-end p95를 잰다.'],
          ].map(([title, body], index) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[3rem_8rem_minmax(0,1fr)]"><span className="font-mono text-sm font-black text-muted-foreground">0{index + 1}</span><p className="text-sm font-bold">{title}</p><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>D-FINE repository가 보고하는 T4 TensorRT latency는 유용한 비교 근거지만 camera decode와 postprocess가 포함된 내 p95가 아니다. Grounding DINO의 text encoder는 prompt가 반복될 때 cache할 수 있지만 prompt가 바뀌는 workload와 수백 phrase를 한 번에 넣는 workload는 비용이 다르다.</p>
          <p>Detector 결과를 SAM 같은 segmenter에 넘길 때는 box 수가 segmenter 호출 수와 memory를 결정한다. Tracking을 붙이면 detector를 매 frame 실행할지, 일정 간격으로 re-detect할지도 latency·drift tradeoff가 된다.</p>
        </div>
      </section>

      <section id="evaluation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Branch마다 다른 실패를 같은 release 문서에 모은다</h2>
        <div className="not-prose grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
          {[
            ['Fixed vocabulary 품질', 'class별 AP/recall, confusion, small-object slice, background hard negative와 calibration.'],
            ['Open vocabulary 품질', 'seen/unseen category, 동의어, 속성·관계 phrase, 언어별 표현, false grounding과 no-object abstention.'],
            ['공통 geometry', 'source-coordinate IoU, crop/letterbox round-trip, border object와 annotation policy.'],
            ['공통 runtime', 'target device의 preprocess/forward/postprocess/end-to-end p50·p95, throughput와 peak memory.'],
          ].map(([title, body]) => <div key={title} className="min-w-0 bg-background p-5"><p className="text-sm font-bold">{title}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p></div>)}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Open vocabulary에서는 COCO zero-shot AP 하나가 한국어 referring expression 성능을 증명하지 않는다. “사람”, “작업자”, “파란 조끼를 입은 사람”, “쓰러지지 않은 사람”처럼 prompt 형태를 바꾸고, 찾지 말아야 할 hard negative를 포함한다. Fixed vocabulary에서는 class ID mapping이 바뀌면 같은 logit index가 다른 의미가 되므로 schema regression이 필요하다.</p>
          <p>새 모델 논문의 개선 수치는 같은 dataset, split, backbone, pretraining data, input size와 inference setting인지 확인한 뒤에만 비교한다. 조건이 다르면 순위를 만들지 않고 각 주장 옆에 측정 계약을 붙인다.</p>
        </div>
      </section>

      <section id="implementation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">구현·Release gate와 가장 어려운 전이 문제</h2>
        <QuestionLead
          question="A 카메라는 6개 class 60 FPS, B 카메라는 ‘파란 조끼를 입고 쓰러진 사람’을 offline으로 찾는다. 한 팀이 D-FINE의 T4 FPS와 Grounding DINO의 COCO zero-shot AP만 제시했다. 충분한가?"
          answer="부족하다. A는 실제 GPU의 camera-to-action p95와 6-class critical recall을, B는 한국어 phrase·속성·hard negative와 no-object abstention을 검증해야 한다. 둘 다 letterbox 좌표 복원, small-object slice, artifact·preprocess·postprocess manifest가 필요하다. 논문 수치는 후보 선택 근거이지 release evidence가 아니다."
        />
        <DetectionReleaseGate />
        <Formula
          latex={String.raw`\begin{aligned}\operatorname{release}&=\underbrace{G_{vocab}}_{\text{class·phrase 계약}}\land\underbrace{G_{box}}_{\text{위치·작은 객체 품질}}\\&\quad\land\underbrace{G_{run}}_{\text{목표 장비 p95}}\land\underbrace{G_{manifest}}_{\text{재현 가능한 artifact}}\end{aligned}`}
          meaning="Fixed/open branch에 맞는 vocabulary gate, box 품질, runtime과 재현 manifest를 모두 통과할 때만 배포한다. 한 benchmark 평균으로 다른 gate를 상쇄하지 않는다."
          symbols={[["G_{vocab}", 'fixed class mapping 또는 open phrase fixture gate'], ["G_{box}", 'IoU·AP·recall과 scale/condition slice gate'], ["G_{run}", 'target pipeline end-to-end latency gate'], ["G_{manifest}", 'weight·code·input·prompt·postprocess pin gate']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>두 창고 deployment를 닫는 순서</h3>
          <ol>
            <li>A는 D-FINE 같은 fixed branch 후보를 선택하고 6개 class ID, annotation rule과 class별 threshold를 pin한다.</li>
            <li>B는 Grounding DINO 공개 checkpoint로 시작하되 한국어 phrase tokenizer, punctuation, synonym과 negative prompt fixture를 별도 version으로 둔다.</li>
            <li>두 branch 모두 같은 source-coordinate annotation과 letterbox round-trip test를 공유한다.</li>
            <li>Small-object recall, glare·occlusion 조건과 device p95를 branch별 target으로 측정한다.</li>
            <li>Hosted API인 후속 모델을 비교할 때는 data boundary, version pin, availability와 rollback 가능성을 공개 checkpoint와 별도 열로 기록한다.</li>
          </ol>
        </div>
        <CapabilityCheck items={[
          'Fixed-vocabulary detection과 open-vocabulary grounding의 입력·출력·평가 차이를 설명한다.',
          'D-FINE의 multi-scale query, FDR distribution refinement와 self-distillation 역할을 구분한다.',
          'Grounding DINO의 feature enhancer, language-guided query selection과 cross-modal decoder 흐름을 설명한다.',
          'Global CLIP similarity와 region grounding이 같은 작업이 아님을 설명한다.',
          'Score threshold, NMS, bipartite matching과 source-coordinate inversion의 책임을 나눈다.',
          '논문 FPS와 실제 camera-to-action p95를 같은 숫자로 쓰지 않는다.',
          'Seen/unseen phrase, small object, hard negative, runtime과 manifest gate를 설계한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'D-FINE paper', href: 'https://arxiv.org/abs/2410.13842', note: 'FDR, GO-LSD와 저자 측 COCO·T4 결과의 1차 근거.' },
          { label: 'D-FINE official repository', href: 'https://github.com/Peterande/D-FINE', note: 'Model configs, checkpoints, custom data와 benchmark script의 공개 구현.' },
          { label: 'Grounding DINO paper', href: 'https://arxiv.org/abs/2303.05499', note: 'Open-set detection, referring expression과 세 단계 cross-modal fusion의 기준점.' },
          { label: 'Grounding DINO official repository', href: 'https://github.com/IDEA-Research/GroundingDINO', note: '공개 checkpoint와 inference code. 원 논문의 전체 training pipeline 공개 범위와는 구분한다.' },
          { label: 'Grounding DINO 1.5 paper', href: 'https://arxiv.org/abs/2405.10300', note: 'Pro·Edge 저자 결과. 공개 사용은 API repository 중심이므로 original과 재현 가능성을 같게 표시하지 않는다.' },
          { label: 'OV-DEIM paper', href: 'https://arxiv.org/abs/2603.07022', note: 'DETR-style real-time OVOD와 GridSynthetic의 저자 주장. Code·weight·license·target-device 재현 gate 전에는 관찰 후보로 둔다.' },
          { label: 'WeDetect paper', href: 'https://arxiv.org/abs/2512.12309', note: 'Dual-tower retrieval 기반 OVOD, proposal retrieval과 referring-expression 경로의 1차 설명. 공개 artifact 범위는 별도 검증한다.' },
          { label: 'DETR paper', href: 'https://arxiv.org/abs/2005.12872', note: 'Direct set prediction과 bipartite matching의 최소 논문 바닥.' },
          { label: 'Deformable DETR paper', href: 'https://arxiv.org/abs/2010.04159', note: 'Multi-scale sparse sampling과 reference point mechanism의 최소 구현 바닥.' },
        ]} />
      </section>
    </>
  );
}
