import type { ReactNode } from 'react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes } from '@/components/learning/ArticleLearning';
import {
  ObjectMultiplexExplorer,
  PromptContractExplorer,
  TrackingMemoryExplorer,
  VisionLineageExplorer,
} from './vision-promptable-segmentation-tracking/viz/PromptableVisionExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-6 min-w-0"><div className="min-w-0 overflow-hidden rounded-md border border-border px-1.5 py-4 text-[11px] sm:px-3 sm:text-sm"><MathFormula display className="my-0">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

function ProcessRow({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return <div className="grid min-w-0 gap-2 border-t border-border py-4 first:border-t-0 sm:grid-cols-[2.5rem_10rem_minmax(0,1fr)] sm:gap-4"><span className="font-mono text-xs font-bold text-muted-foreground">{index}</span><strong className="text-sm leading-relaxed">{title}</strong><div className="min-w-0 text-sm leading-relaxed text-muted-foreground">{children}</div></div>;
}

const sessionSketch = `from sam3.model_builder import build_sam3_predictor

predictor = build_sam3_predictor(
    checkpoint_path=pinned_checkpoint,
    version="sam3.1",
    max_num_objects=128,  # session 전체 상한
    multiplex_count=16,  # bucket 하나의 slot 수
    compile=True,
)

started = predictor.handle_request({
    "type": "start_session",
    "resource_path": video_path,
})
session_id = started["session_id"]

try:
    predictor.handle_request({
        "type": "add_prompt",
        "session_id": session_id,
        "frame_index": 0,
        "text": "red safety cap",
    })

    request = {
        "type": "propagate_in_video",
        "session_id": session_id,
        "propagation_direction": "forward",
    }
    for response in predictor.handle_stream_request(request):
        frame_index = response["frame_index"]
        frame_outputs = response["outputs"]
        # 서비스 코드에서 ID·mask·latency·peak VRAM을 기록한다.
finally:
    predictor.handle_request({
        "type": "close_session",
        "session_id": session_id,
    })`;

export default function VisionPromptableSegmentationTrackingArticle() {
  return (
    <>
      <section id="task-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 “무엇을 몇 개 찾는가”를 고정한다</h2>
        <BeginnerBridge title="사진에서 손가락으로 가리킨 한 컵과 ‘모든 빨간 컵’은 정답의 개수가 다르다">
          Segmentation은 물체가 차지한 pixel 영역을 mask로 칠하는 일이다. 점이나 박스로 하나를 가리키면 그 instance 하나가 목표지만, 단어로 개념을 말하면 화면 안에서 그 개념에 맞는 모든 instance를 찾아야 할 수 있다.
        </BeginnerBridge>
        <QuestionLead question="‘빨간 안전 캡을 분할해’라는 문장은 한 물체를 고르라는 뜻일까, 화면의 모든 캡을 찾으라는 뜻일까?" answer="둘은 다른 문제다. 점이나 박스로 가리킨 한 물체를 분할하는 Promptable Visual Segmentation(PVS)과, 텍스트·예시 이미지가 정의한 개념에 맞는 모든 instance를 찾는 Promptable Concept Segmentation(PCS)을 먼저 구분해야 모델 출력과 평가가 정해진다." />
        <ConceptPrimer items={[
          { term: 'Mask', meaning: '각 pixel이 target에 속하는지를 나타내는 2차원 영역이다.', why: 'Bounding box보다 경계를 세밀하게 표현하고 편집·합성·검사에 바로 쓸 수 있다.' },
          { term: 'Instance', meaning: '같은 종류라도 서로 다른 실제 물체를 별도 ID로 센 단위다.', why: '겹친 두 cap을 하나의 붉은 영역으로 합치지 않고 각각 추적해야 한다.' },
          { term: 'Visual prompt', meaning: '점·박스·초기 mask로 특정 물체를 직접 가리키는 입력이다.', why: '사용자가 어느 instance를 뜻하는지 좌표로 고정한다.' },
          { term: 'Concept prompt', meaning: '짧은 명사구나 positive·negative exemplar로 찾을 개념을 정의하는 입력이다.', why: '고정 label set 밖에서도 같은 개념의 모든 instance를 찾게 한다.' },
          { term: 'Masklet', meaning: '한 object의 mask가 여러 video frame에 이어진 시공간 궤적이다.', why: 'Frame마다 좋은 mask를 내는 것과 같은 object ID를 유지하는 일을 분리한다.' },
          { term: 'Object identity', meaning: '시간이 지나 모양과 위치가 달라져도 같은 실제 물체라는 연결 표식이다.', why: 'Mask 모양이 맞아도 두 물체의 ID가 뒤바뀌는 tracking 실패를 따로 잡는다.' },
          { term: 'Embedding', meaning: 'Image, prompt 또는 object를 비교·전달할 수 있도록 바꾼 숫자 vector다.', why: 'Raw pixel과 문장을 attention과 decoder가 읽는 공통 계산 표현으로 옮긴다.' },
          { term: 'Attention', meaning: '현재 query가 memory의 어느 key를 얼마나 읽을지 정하고 value를 가중합하는 연산이다.', why: 'Current frame이 필요한 과거 spatial memory와 object pointer를 선택해 가져온다.' },
          { term: 'Spatial memory', meaning: '과거 frame의 위치별 visual feature와 예측 mask를 압축해 남긴 공간 기억이다.', why: '현재 frame에서 object가 가려지거나 움직여도 과거 위치·모양 단서를 다시 읽는다.' },
          { term: 'Object pointer', meaning: '한 object의 고수준 identity를 가리키는 작은 vector 표현이다.', why: '비슷한 두 물체의 mask 모양이 가까워도 어느 ID를 이어야 하는지 구분한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Semantic segmentation은 같은 class의 pixel을 하나로 합친다. Instance segmentation은 물체마다 mask를 나누지만 대개 학습 때 정한 label vocabulary를 전제로 한다. SAM 1·2의 PVS는 점·박스가 고른 개별 물체를 분할한다. SAM 3의 PCS는 “빨간 안전 캡” 같은 짧은 명사구나 예시 이미지를 받아 그 개념에 맞는 모든 instance를 반환한다.</p>
          <p>따라서 첫 release test는 mask decoder의 정확도가 아니다. 입력 prompt가 한 instance를 고르는지, concept 전체를 정의하는지와 출력 cardinality를 먼저 고정해야 한다. 이 계약이 없으면 모델이 정확히 그린 한 개의 mask도 “모든 캡을 찾아라”라는 업무에는 오답이다.</p>
        </div>
        <PromptContractExplorer />
        <Misconception>“Segment Anything”은 어떤 문장도 이해한다는 뜻이 아니다. SAM 3의 text prompt는 짧은 open-vocabulary 명사구를 대상으로 하며, “맨 위 선반 오른쪽에서 두 번째 책”처럼 관계 추론이 필요한 긴 표현은 별도 multimodal reasoning이 필요하다.</Misconception>
      </section>

      <section id="contract-lineage" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">SAM 계보는 이전 단계의 실패를 하나씩 닫는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>SAM 1은 image embedding과 prompt encoder, mask decoder를 분리해 점·박스에서 mask를 빠르게 만들었다. 하지만 다음 video frame에는 이전 object의 모습과 ID가 남지 않는다. SAM 2는 current frame이 과거 spatial memory와 object pointer를 읽는 streaming memory를 붙여 이 단절을 해결했다.</p>
          <p>SAM 2의 기억만으로는 새로 등장한 “같은 개념”의 object를 자동으로 찾기 어렵다. SAM 3는 Perception Encoder(PE)의 image·text 표현, DETR 계열 concept detector와 SAM 2 계열 tracker를 결합했다. SAM 3.1의 변화는 새 segmentation task가 아니라 multi-object runtime이다. Object마다 따로 지나던 memory path를 fixed-capacity bucket마다 한 번 실행한다.</p>
          <p>이 경로의 과거 탐색은 SAM 1에서 멈춘다. 그 아래의 모든 segmentation 논문을 필수로 만들지 않는다. Image patch와 attention에서 막힐 때 <InternalLink slug="vision-transformer">Vision Transformer</InternalLink>를, image-text alignment에서 막힐 때 <InternalLink slug="clip-vision-language-model">CLIP</InternalLink>을, object query와 matching에서 막힐 때 <InternalLink slug="deformable-detr">Deformable DETR</InternalLink>을 연다.</p>
        </div>
        <VisionLineageExplorer />
      </section>

      <section id="concept-detector" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Detector는 전역 개념 존재와 국소 위치를 분리한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>SAM 3의 image·text encoder는 contrastive vision-language training으로 정렬된 PE에서 온다. Text token과 exemplar token은 prompt token이 된다. Fusion encoder는 image embedding이 이 prompt를 참고하게 만들고, learned object query는 조건화된 image feature에서 box와 mask 후보를 찾는다.</p>
          <p>여기에는 서로 충돌하는 두 판단이 있다. “이 frame 어디엔가 해당 concept가 있는가?”는 전체 context를 봐야 한다. “Object query 17의 box가 바로 그 instance인가?”는 국소 경계와 위치에 집중해야 한다. 하나의 query에 두 책임을 모두 주면 global absence 판단이 local localization을 방해할 수 있다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{p(q_i\!\leftrightarrow\!P)}_{\text{최종 후보 점수}}=\underbrace{p(q_i\!\leftrightarrow\!P\mid P\text{ 존재})}_{\text{국소 위치 일치}}\;\underbrace{p(P\text{ 존재}\mid I)}_{\text{전역 개념 존재}}`}
          meaning="Presence token은 image 전체에서 concept가 존재하는지 판정하고, 각 object query는 concept가 있다고 가정한 뒤 자기 box·mask가 맞는지 판정한다. 두 확률을 곱하면 전역적으로 없는 concept의 국소 오검출을 함께 낮출 수 있다. 곱셈은 둘 중 하나가 낮으면 최종 후보도 낮아져야 한다는 AND 성격을 표현한다."
          symbols={[[String.raw`I`, '현재 image 또는 video frame'], [String.raw`P`, 'text 또는 exemplar concept prompt'], [String.raw`q_i`, 'i번째 local object query'], ['조건부 확률', 'concept가 존재한다고 가정했을 때 query가 올바른 위치인지'], ['두 확률의 곱', '전역 존재와 국소 위치 조건을 동시에 만족시키는 결합 점수']]}
        />
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ProcessRow index="01" title="Encode"><p>PE가 frame과 짧은 text를 token으로 바꾼다. Positive·negative exemplar가 있으면 ROI feature, 위치와 label을 별도 token으로 만든다.</p></ProcessRow>
          <ProcessRow index="02" title="Condition"><p>Fusion encoder가 image token을 prompt token에 cross-attend시켜 “무엇을 찾는 중인지”가 반영된 spatial feature를 만든다.</p></ProcessRow>
          <ProcessRow index="03" title="Propose"><p>Object query가 box, local match score와 instance mask를 예측한다. Presence token은 query 전체가 공유할 global score를 낸다.</p></ProcessRow>
          <ProcessRow index="04" title="Filter"><p>Hard negative, 중첩 instance와 모호한 표현을 presence·ambiguity·overlap 처리로 걸러 최종 object set을 만든다.</p></ProcessRow>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>“혈소판”처럼 domain 지식이 필요한 unseen concept는 zero-shot 성능이 약할 수 있다. 이때 threshold만 낮추면 false positive가 늘어난다. Domain-labeled sample로 fine-tune할지, prompt vocabulary를 제한할지, human review로 보낼지를 별도 계약으로 정한다.</p>
        </div>
      </section>

      <section id="video-memory" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Video는 검출, 전파, 연결과 교정을 반복한다</h2>
        <QuestionLead
          question="어느 frame을 기억에 넣고, 언제 새 detection으로 ID를 교정해야 할까?"
          answer="모든 frame을 기억하면 가림 때 만든 빈 mask와 distractor 오류까지 다음 입력이 된다. 먼저 memory bank, spatial memory, object pointer와 admission·reset 조건을 읽고, 아래 timeline 탭에서 정상·가림·distractor·교정 상태가 어떻게 달라지는지 확인한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Memory bank는 모든 과거 frame을 쌓는 video archive가 아니다. Current frame feature가 과거 spatial memory와 object pointer를 attention으로 읽도록 만든 선택된 state다. Memory encoder는 frame feature와 예측 mask를 합쳐 새 spatial memory를 만들고, object pointer는 고수준 identity 단서를 보존한다.</p>
          <p>가림 때문에 object가 보이지 않는 frame을 확신 높은 기억처럼 넣으면 자기 오류가 다음 frame의 입력이 된다. Occlusion score가 낮은 frame은 memory admission에서 제외하고, 최근 tracker prediction이 유사한 distractor로 drift하면 고신뢰 detector mask로 주기적으로 re-prompt한다. 새 detection과 기존 propagation이 맞지 않으면 새 masklet을 만들되 re-entry duplicate인지도 검사해야 한다.</p>
          <p>Camera cut은 작은 motion이 아니다. 이전 spatial memory가 갑자기 무효가 될 수 있다. Cut detector나 낮은 global match를 reset 후보로 쓰고, reset 전후에 같은 business object ID를 이어야 하는지 새 scene ID로 끊어야 하는지를 제품 정책으로 정한다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}\underbrace{\widehat M_t}_{\text{현재로 전파한 masklet}}&=\underbrace{\operatorname{propagate}(M_{t-1})}_{\text{과거 기억으로 위치 예측}}\\[0.35em]\underbrace{O_t}_{\text{현재 frame의 새 검출}}&=\underbrace{\operatorname{detect}(I_t,P)}_{\text{concept를 다시 확인}}\\[0.35em]\underbrace{M_t}_{\text{ID가 붙은 현재 masklet}}&=\underbrace{\operatorname{match\_and\_update}(\widehat M_t,O_t)}_{\text{전파와 검출을 연결·교정}}\end{aligned}`}
          meaning="Tracker propagation은 같은 object의 연속성과 낮은 frame별 비용을 제공하고, detector는 새 object와 drift 후 재등장을 다시 찾는다. Match/update는 두 출력을 IoU와 시간 신뢰도로 연결해 ID를 유지한다. 세 연산을 나누면 mask 모양 오류, concept 누락과 identity association 오류를 서로 다른 지점에서 진단할 수 있다."
          symbols={[[String.raw`I_t`, '시각 t의 frame'], [String.raw`P`, '찾을 concept prompt'], [String.raw`M_{t-1}`, '이전 시각까지 ID가 유지된 masklet 집합'], [String.raw`\widehat M_t`, 'memory로 현재 frame에 전파한 후보'], [String.raw`O_t`, '현재 frame detector가 새로 찾은 object masks'], ['match/update', '기존 masklet과 detection을 연결하고 새 object를 생성하거나 drift를 교정하는 단계']]}
        />
        <TrackingMemoryExplorer />
        <Misconception>Frame마다 IoU가 높아도 tracking이 성공한 것은 아니다. A와 B의 mask를 서로 바꿔 붙이면 pixel 모양은 맞아도 identity association은 실패한다.</Misconception>
      </section>

      <section id="object-multiplex" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">SAM 3.1은 16개까지만 추적하는 모델이 아니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>SAM 3은 frame embedding을 공유해도 tracker memory path는 object마다 독립적으로 실행했다. Object가 <MathFormula>N</MathFormula>개면 memory encode와 retrieval 비용도 대체로 <MathFormula>N</MathFormula>에 비례한다. SAM 3.1 Object Multiplex는 여러 object를 capacity <MathFormula>M</MathFormula>인 bucket에 넣고 spatial memory를 bucket마다 한 번 계산한다.</p>
        </div>
        <Misconception>공식 논문의 <MathFormula>M=16</MathFormula> 예시는 “최대 16개 object”라는 제한이 아니다. 37개는 16·16·5개가 든 세 bucket으로 처리된다. 비어 있는 slot은 padding이며 real object가 아니다.</Misconception>
        <ObjectMultiplexExplorer />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{B}_{\text{memory bucket 수}}
&=\left\lceil\frac{\underbrace{N}_{\text{추적 object 수}}}
{\underbrace{M}_{\text{bucket 수용량}}}\right\rceil\\
\underbrace{N\text{회}}_{\text{object별 memory path}}
&\longrightarrow
\underbrace{B\text{회}}_{\text{bucket별 shared path}}
\end{aligned}`}
          meaning="Ceiling을 쓰는 이유는 마지막 bucket이 가득 차지 않아도 한 번의 memory path가 필요하기 때문이다. M으로 나누면 object를 몇 묶음으로 공동 처리할지 계산할 수 있다. 줄어드는 것은 object별 memory-path 호출 수이며 detector와 postprocess까지 포함한 실제 속도 향상은 GPU와 workload에서 따로 측정해야 한다."
          symbols={[[String.raw`N`, '현재 추적 중인 object 수'], [String.raw`M`, 'bucket 한 개의 fixed slot 수, 공식 예시는 16'], [String.raw`B`, '필요한 bucket 수'], [String.raw`\lceil\cdot\rceil`, '남는 object가 하나라도 있으면 마지막 bucket을 추가하는 올림'], ['N → B', 'per-object memory computation을 per-bucket shared computation으로 바꾸는 비용 구조']]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>공유해도 되는 것은 같은 frame의 spatial memory 계산이다. 끝까지 분리해야 하는 것은 object-specific embedding과 bucket slot에서 원래 object index로 돌아가는 mapping이다. <MathFormula>{String.raw`\operatorname{demux}(\operatorname{mux}(x))[\text{유효 object}]=x`}</MathFormula>가 깨지면 cap 7의 mask가 cap 12의 ID로 돌아올 수 있다.</p>
          <p>공식 2026-03-27 release는 H100에서 128 objects를 추적할 때 이전 SAM 3 대비 약 7배 속도 향상을 보고했다. 이는 모든 GPU·해상도·video 길이에 대한 상수가 아니다. CPU-GPU synchronization 감소, <code>torch.compile</code> fusion, batched postprocessing과 encoder 활용 개선도 함께 들어갔으므로 bucket 수의 이론 비율을 그대로 end-to-end speedup으로 쓰면 안 된다.</p>
        </div>
      </section>

      <section id="evaluation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">평균 mask 점수 하나로 release하지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>실패 원인이 다르면 metric도 나뉘어야 한다. Region IoU인 <MathFormula>J</MathFormula>는 mask 면적이 얼마나 겹치는지 보고, boundary score <MathFormula>F</MathFormula>는 가장자리 모양을 본다. 하지만 둘 다 concept가 frame에 없을 때 “없다”고 말했는지와 object ID가 시간축에서 유지됐는지는 직접 측정하지 않는다.</p>
        </div>
        <Formula
          latex={String.raw`\underbrace{\operatorname{cgF1}}_{\text{개념과 mask의 결합 점수}}=100\;\underbrace{\operatorname{pmF1}}_{\text{instance 위치 품질}}\;\underbrace{\operatorname{IL\_MCC}}_{\text{image 수준 존재 판정}}`}
          meaning="공식 SA-Co image 평가는 mask가 잘 그려졌는지와 prompt concept의 존재·부재를 맞혔는지를 곱해 결합한다. 곱셈을 쓰면 존재하지 않는 concept에 그럴듯한 mask를 만든 경우 한 축의 실패가 최종 점수에 반영된다. 이 식은 공식 benchmark 정의이며 자체 dataset에서는 component 값도 함께 보존해야 원인을 진단할 수 있다."
          symbols={[[String.raw`\operatorname{pmF1}`, '양성 media-prompt 쌍에서 mask IoU로 instance를 최적 매칭한 뒤, IoU 0.50~0.95의 micro F1을 평균한 localization 성분'], [String.raw`\operatorname{IL\_MCC}`, 'image-level concept presence의 Matthews correlation 성분'], ['100', 'fraction 단위 곱을 읽기 쉬운 score scale로 바꾸는 계수'], ['곱셈', 'concept recognition과 mask localization이 모두 좋아야 높은 점수를 주는 결합']]}
        />
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ProcessRow index="Mask" title="J와 F"><p>Region overlap과 boundary를 object size·가림 정도·domain별로 나눈다.</p></ProcessRow>
          <ProcessRow index="Concept" title="cgF1 성분"><p>Positive뿐 아니라 hard negative prompt에서 concept presence false positive를 확인한다.</p></ProcessRow>
          <ProcessRow index="ID" title="pHOTA·association"><p>Phrase-conditioned detection과 temporal association을 나눠 ID swap, duplicate와 re-entry를 잡는다.</p></ProcessRow>
          <ProcessRow index="Recover" title="시나리오 slice"><p>긴 가림, camera cut, 유사 distractor, 새 object 등장과 correction prompt 뒤 회복 시간을 잰다.</p></ProcessRow>
          <ProcessRow index="Runtime" title="운영 비용"><p>Target object 수·해상도·video 길이에서 throughput, p50/p95 latency와 peak VRAM을 같이 기록한다.</p></ProcessRow>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>SAM 3.1 공식 release에서도 품질 결과는 dataset마다 섞여 있다. 여러 VOS benchmark는 개선됐지만 모든 video PCS public metric이 오른 것은 아니다. 따라서 “더 빠르고 정확하다”를 하나의 문장으로 고정하지 않고, 우리 scenario의 quality gate와 runtime gate를 독립적으로 통과시킨다.</p>
        </div>
      </section>

      <section id="implementation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Session state와 측정까지 재현해야 구현이 끝난다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>공개 predictor API는 video resource로 session을 만들고, 특정 frame에 prompt를 추가한 뒤, forward 또는 backward direction으로 masklet을 전파한다. 이후 correction prompt를 더하거나 object를 제거하고, reset 또는 close로 state lifecycle을 끝낸다. Checkpoint와 code commit이 다르면 builder와 state field가 맞지 않을 수 있으므로 둘을 함께 pin한다.</p>
        </div>
        <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-[11px] leading-6 sm:text-xs"><code>{sessionSketch}</code></pre>
        <div className="not-prose my-7 min-w-0 border-y border-border">
          <ProcessRow index="01" title="Pin"><p>Official checkpoint, repository commit, PyTorch·CUDA, GPU, resolution과 bucket capacity를 run manifest에 남긴다.</p></ProcessRow>
          <ProcessRow index="02" title="Start"><p>JPEG folder 또는 MP4 resource로 session을 시작한다. Video 전체를 한 번에 tensor로 올리는지 frame을 streaming하는지도 기록한다.</p></ProcessRow>
          <ProcessRow index="03" title="Prompt"><p>Prompt type, text/exemplar 값, frame index와 positive·negative correction 순서를 보존한다.</p></ProcessRow>
          <ProcessRow index="04" title="Propagate"><p>Frame마다 mask뿐 아니라 stable object ID, presence·occlusion, memory admission, latency와 peak allocation을 수집한다.</p></ProcessRow>
          <ProcessRow index="05" title="Correct"><p>ID swap·drift가 보이면 어느 frame에서 re-prompt, remove 또는 reset했는지 이벤트로 남기고 회복 시간을 잰다.</p></ProcessRow>
          <ProcessRow index="06" title="Close"><p>Session을 닫아 GPU·CPU state를 해제한다. 장시간 반복에서 allocated memory가 단조 증가하지 않는지 soak test한다.</p></ProcessRow>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Release candidate는 non-multiplex baseline과 같은 prompt·frame·object ordering으로 비교한다. <code>mux</code>와 <code>demux</code>의 valid object round trip, padding 무시, object 추가·제거 뒤 ID mapping을 deterministic fixture로 검사한다. 그 다음에만 실제 target GPU에서 품질과 runtime을 측정한다.</p>
          <p>Rollback은 모델 weight만 되돌리는 일이 아니다. Checkpoint, predictor builder, session schema와 postprocess를 한 묶음으로 이전 manifest에 되돌려야 한다. 그렇지 않으면 같은 mask가 나와도 object ID와 state lifecycle이 달라질 수 있다.</p>
        </div>
        <CapabilityCheck items={[
          'Semantic·instance segmentation, PVS와 PCS의 prompt·output 계약을 구분한다.',
          'SAM 1, 2, 3, 3.1이 직전 단계의 어떤 실패를 해결했는지 연결한다.',
          'Presence token과 local object query를 분리한 이유를 확률식으로 설명한다.',
          'Detector recall, tracker propagation, match/update와 periodic re-prompt의 책임을 나눈다.',
          'Spatial memory, object pointer와 occlusion-based memory admission을 구분한다.',
          'N objects와 capacity M에서 bucket 수 ceil(N/M)을 계산한다.',
          'Shared spatial memory와 object-specific identity를 동시에 보존해야 하는 이유를 설명한다.',
          'J/F, cgF1, pHOTA와 runtime metric이 잡는 실패를 각각 말한다.',
          'Camera cut, re-entry, distractor와 ID swap을 별도 scenario slice로 평가한다.',
          'Checkpoint·commit·session event를 pin하고 mux/demux round trip을 검증한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Meta AI · SAM 3.1 release', href: 'https://ai.meta.com/blog/segment-anything-model-3/', note: 'SAM 3의 concept prompting과 2026 SAM 3.1 Object Multiplex update의 공식 설명.' },
          { label: 'SAM 3 paper', href: 'https://arxiv.org/abs/2511.16719', note: 'PCS task, presence head, detector-tracker architecture, metric과 Appendix H Object Multiplex의 1차 근거.' },
          { label: 'SAM 3 official repository', href: 'https://github.com/facebookresearch/sam3/tree/46957e47805eaa273f4aa7bbbd25a88bca9108ce', note: '본문이 확인한 checkpoint usage, predictor API와 multiplex 구현의 pinned commit.' },
          { label: 'SAM 3.1 release notes', href: 'https://github.com/facebookresearch/sam3/blob/46957e47805eaa273f4aa7bbbd25a88bca9108ce/RELEASE_SAM3p1.md', note: 'Bucket 방식, H100 128-object speedup, 품질 benchmark와 실행 최적화 범위.' },
          { label: 'MultiplexState source', href: 'https://github.com/facebookresearch/sam3/blob/46957e47805eaa273f4aa7bbbd25a88bca9108ce/sam3/model/multiplex_utils.py', note: 'Fixed slot assignment, padding, mux/demux matrix와 bucket count 구현.' },
          { label: 'Video tracking multiplex source', href: 'https://github.com/facebookresearch/sam3/blob/46957e47805eaa273f4aa7bbbd25a88bca9108ce/sam3/model/video_tracking_multiplex.py', note: 'Bucket별 shared spatial memory를 encode하면서 object-specific embedding과 원래 object index mapping을 보존하는 직접 구현 근거.' },
          { label: 'Base predictor source', href: 'https://github.com/facebookresearch/sam3/blob/46957e47805eaa273f4aa7bbbd25a88bca9108ce/sam3/model/sam3_base_predictor.py', note: 'start_session, add_prompt, propagate, remove/reset/close request lifecycle.' },
          { label: 'SAM 2 paper', href: 'https://arxiv.org/abs/2408.00714', note: 'Streaming memory, memory encoder/bank, object pointer와 promptable video segmentation의 기반.' },
          { label: 'Segment Anything paper', href: 'https://arxiv.org/abs/2304.02643', note: 'Image encoder, prompt encoder와 mask decoder로 구성된 최소 canonical cutoff.' },
          { label: 'Perception Encoder', href: 'https://arxiv.org/abs/2504.13181', note: 'SAM 3 image/text backbone이 사용하는 contrastive vision-language representation의 직접 근거.' },
        ]} />
      </section>
    </>
  );
}
