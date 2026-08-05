import { CitationBlock } from '@/components/ui/citation';
import { CapabilityCheck, ConceptPrimer, InternalLink, Misconception, QuestionLead, SourceNotes, SpecialistEntry, StopRule } from '@/components/learning/ArticleLearning';
import PaddlePageParserViz from './paddleocr-vl/PaddlePageParserViz';

export default function PaddleOCRVLArticle() {
  return (
    <div className="space-y-16">
      <SpecialistEntry
        title="PaddleOCR-VL의 한 페이지 처리 경계를 검산하는 글"
        description="모델 이름과 benchmark를 소개하는 데서 멈추지 않고, layout detector가 영역을 찾고 VLM이 crop을 읽은 뒤 document assembly로 넘기는 실제 책임 경계를 다룬다."
        prerequisites={[
          'OCR이 문자 인식만이 아니라 위치와 읽는 순서를 함께 복원할 수 있음을 안다.',
          'Bounding box와 region crop이 페이지 좌표를 보존한다는 뜻을 안다.',
          '한 페이지를 읽는 일과 여러 페이지의 표·문단을 잇는 일이 다름을 안다.',
        ]}
        links={[
          { slug: 'ocr-document-ai-map', title: 'OCR · Document AI 전체 경로', reason: 'Page parsing부터 문서 조립과 RAG까지 책임 흐름을 먼저 본다.' },
          { slug: 'document-structure-assembly', title: 'Document structure assembly', reason: 'Page parser 뒤에 표, 제목, caption과 provenance를 잇는 단계를 배운다.' },
        ]}
      />
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">PaddleOCR-VL-1.6의 위치</h2>
        <QuestionLead question="0.9B page parser의 benchmark가 높으면 180쪽 문서도 바로 RAG에 넣어도 될까?" answer="아니다. 1.6은 page 안의 text·formula·table·reading order를 읽는 현재 기준점이지만, 페이지 사이에서 끊긴 표·문단·제목·caption은 별도 document assembly가 책임진다." />
        <ConceptPrimer items={[
          { term: 'NaViT-style resolution', meaning: '문서 crop을 하나의 고정 정사각형으로 강제하지 않고 서로 다른 크기와 비율의 visual token으로 처리하는 방식.', why: '작은 글자와 큰 표가 함께 있는 page에서 무조건 축소하는 손실을 줄인다.' },
          { term: 'RT-DETR detector', meaning: 'Page에서 text·table·formula·chart 같은 region의 class와 bbox를 찾는 detection model.', why: '내용을 읽는 VLM보다 먼저 crop과 page 좌표의 owner를 만든다.' },
          { term: 'Pointer network', meaning: '검출된 region 중 다음에 읽을 index를 가리켜 reading order를 만드는 module.', why: '좌표가 가까운 순서와 사람이 읽는 순서가 다를 수 있기 때문이다.' },
          { term: 'ERNIE language model', meaning: 'Visual crop의 표현을 text·HTML·LaTeX 같은 token sequence로 바꾸는 language side.', why: 'Detector가 찾은 위치와 recognizer가 만든 내용을 서로 다른 책임으로 읽게 한다.' },
        ]} />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>PaddleOCR-VL은 Baidu/PaddlePaddle 생태계의 문서 파싱 시스템이다. 여기서 VLM은 Vision-Language Model, 즉 이미지 특징과 언어 출력을 함께 다루는 모델을 뜻한다. 목표는 범용 대형 VLM으로 페이지 전체를 한 번에 읽는 것이 아니라, layout 전용 모델과 0.9B급 경량 VLM을 결합해 텍스트, 표, 수식과 차트를 효율적으로 구조화하는 것이다.</p>
          <p>기존 PaddleOCR가 text detection/recognition과 structure pipeline을 제공해 왔다면, PaddleOCR-VL도 pipeline 경계를 없애지 않는다. PP-DocLayoutV2가 먼저 요소 좌표와 reading order를 만들고, 잘라낸 각 요소를 0.9B VLM이 인식한다. 좌표와 세밀한 cell-level layout이 필요할 때는 PP-StructureV3 같은 다른 pipeline과 출력 계약을 비교할 수 있다.</p>
          <CitationBlock source="PaddleOCR-VL arXiv" citeKey={1} href="https://arxiv.org/abs/2510.14528">
            <p>논문 2.1절은 PP-DocLayoutV2가 semantic region과 reading order를 먼저 만들고 PaddleOCR-VL-0.9B가 crop별 요소를 인식하는 두 단계를 명시한다. 마지막 경량 후처리가 두 출력을 Markdown과 JSON으로 합친다.</p>
          </CitationBlock>
          <Misconception>“0.9B”는 1.6이라는 버전 번호와 다른 개념이다. 1.6도 0.9B architecture를 유지하며, 버전 변화는 data와 post-training, task 성능 개선을 가리킨다.</Misconception>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">PP-DocLayoutV2 → crop → NaViT + ERNIE</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>문서 이미지는 일반 사진과 다르다. 한 페이지 안에 큰 제목, 작은 footnote, 빽빽한 표, 차트, 수식, 여러 언어가 섞인다. 고정 해상도로 줄이면 작은 글자가 깨지고, 전체를 고해상도로 처리하면 비용이 커진다. PaddleOCR-VL은 NaViT-style dynamic resolution visual encoder를 사용해 문서의 다양한 해상도 요구를 효율적으로 다루려 한다.</p>
          <p>하지만 이 encoder가 page 전체의 layout까지 혼자 찾는 것은 아니다. PP-DocLayoutV2는 RT-DETR 기반 detector로 요소의 좌표와 class를 찾고, 6-layer pointer network로 읽는 순서를 예측한다. 그 좌표로 자른 element crop이 0.9B VLM에 들어간다.</p>
          <p>VLM의 language side는 ERNIE-4.5-0.3B다. NaViT-style encoder가 잘린 문서 요소를 표현하면 language model이 text와 structure를 생성한다. 인식 모델이 0.9B급인 점이 중요하다. 대형 VLM보다 작지만 문서 요소 인식에 특화되어 있어 배포와 비용 면에서 실용적이다.</p>
          <CitationBlock source="PP-DocLayoutV2 official documentation" citeKey={4} href="https://www.paddleocr.ai/v3.3.1/en/version3.x/module_usage/layout_analysis.html">
            <p>공식 문서는 PP-DocLayoutV2가 RT-DETR-L 기반 detector와 6개 Transformer layer의 경량 pointer network를 연결하고, bbox·class를 이용해 reading order를 복원한다고 명시한다.</p>
          </CitationBlock>
          <p>이 구조는 “작은 모델이라 약하다”가 아니라 “문서 파싱 task에 맞춰 capacity를 배치했다”로 봐야 한다. OCR에서는 세계지식보다 페이지 구조, 문자, 표, 수식, 다국어 script 인식이 중요하다. 따라서 범용 reasoning model보다 특화된 경량 VLM이 운영에 더 적합할 수 있다.</p>
        </div>
      </section>

      <section id="runtime-trace" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">두 단계 page parser 런타임 trace</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>먼저 layout 모델이 page를 훑어 text·table·formula·chart의 위치와 읽는 순서를 정한다. 다음으로 그 좌표의 crop만 dynamic-resolution VLM에 넣는다. 두 단계 경계 자체는 원문이 공개한 사실이다. “Page 전체 생성보다 latency·memory와 layout hallucination을 줄인다”는 문장은 이 글의 운영 해석이며, 같은 hardware·input·backend에서 직접 재측정해야 하는 가설이다.</p>
          <p>아래 stage를 차례로 눌러 보면 좌표를 만드는 단계와 내용을 읽는 단계가 분리되어 있다. 출력도 Markdown만 남기지 않고 bbox·class·reading order가 포함된 typed JSON과 HTML table·LaTeX를 함께 보존해야 다음 검산이 가능하다.</p>
        </div>
        <p className="not-prose mb-4 mt-8 text-sm leading-6 text-muted-foreground" data-viz-context>
          다음 장면은 단순 architecture 그림이 아니다. 같은 page가 어느 단계에서 어떤 증거를 얻고,
          어느 지점 이후에는 잃어버린 정보를 복구할 수 없는지 추적한다.
        </p>
        <PaddlePageParserViz />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>이 trace가 중요한 이유는 실패 대응 때문이다. 요소 자체가 빠졌다면 layout detector와 threshold를, 순서가 꼬였다면 pointer network 결과를, crop 안의 작은 글자가 빠졌다면 render DPI와 VLM token budget을 먼저 본다. 모델 전체를 바꾸기 전에 어느 stage에서 정보가 손실됐는지 좁혀야 한다.</p>
        </div>
      </section>

      <section id="document-elements" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">텍스트·표·수식·차트 파싱</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>PaddleOCR-VL의 평가 포인트는 일반 텍스트 OCR만이 아니다. 문서 element recognition이 핵심이다. 텍스트 문단은 reading order와 paragraph boundary가 중요하고, 표는 row/column/cell relation이 중요하며, 수식은 LaTeX와 symbol fidelity가 중요하다. 차트는 axis, legend, value, caption을 어떻게 구조화하는지가 중요하다.</p>
          <p>문서 자동화에서는 출력 형식이 성능의 일부다. Markdown은 사람과 LLM이 읽기 쉽고, JSON은 downstream system이 처리하기 좋고, HTML table은 구조 보존에 좋다. 어떤 출력이 필요한지 먼저 정해야 모델 선택이 가능하다.</p>
          <ul>
            <li><strong>Text</strong>: 언어, script, reading order, paragraph grouping.</li>
            <li><strong>Table</strong>: header, merged cell, row/column alignment, numeric fidelity.</li>
            <li><strong>Formula</strong>: LaTeX syntax, superscript/subscript, symbol ambiguity.</li>
            <li><strong>Chart</strong>: axis labels, legend, series values, caption relation.</li>
            <li><strong>Layout</strong>: heading hierarchy, footnote, figure/table captions.</li>
          </ul>
        </div>
      </section>

      <section id="hybrid-pipeline" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">PaddleOCR pipeline과 조합</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>아래 조합은 PaddleOCR-VL 논문의 고정 architecture가 아니라, 각 module의 공개 입출력 계약을 이용해 이 글이 제안하는 deployment pattern이다.</p>
          <p>PaddleOCR-VL은 PaddleOCR 생태계 안에서 볼 때 가장 실용적이다. PP-OCRv5는 text detection/recognition에 강하고, PP-StructureV3는 layout/table/formula/chart 같은 모듈형 구조 파싱에 강하다. PaddleOCR-VL은 PP-DocLayoutV2와 문서 VLM을 결합한 요소 인식 pipeline이다. 따라서 “pipeline 대 end-to-end”로 나누기보다 문서 유형별로 어느 detector·recognizer·verifier를 쓸지 설계해야 한다.</p>
          <ul>
            <li><strong>일반 스캔 문서</strong>: PP-OCRv5로 빠르게 text layer를 만들고, low-confidence page만 PaddleOCR-VL로 보낸다.</li>
            <li><strong>표 많은 보고서</strong>: PP-StructureV3로 bbox와 table grid를 얻고, PaddleOCR-VL로 caption/semantic heading을 보강한다.</li>
            <li><strong>다국어 문서</strong>: PaddleOCR-VL을 기본 parser로 쓰되 script별 OCR confidence를 따로 기록한다.</li>
            <li><strong>검토 UI</strong>: pipeline output의 bbox를 anchor로 쓰고, VLM output은 reading order와 Markdown canonical view로 사용한다.</li>
            <li><strong>고위험 필드</strong>: 금액, 날짜, ID는 PP-OCR recognizer 결과와 VLM 결과를 cross-check한다.</li>
          </ul>
          <p>hybrid 설계의 핵심은 서로 다른 모델의 장점을 분리하는 것이다. pipeline은 좌표와 반복 가능한 추출에 강하고, VLM은 문맥과 구조 해석에 강하다. RAG ingestion에서는 VLM Markdown이 편하지만, audit와 review에서는 pipeline bbox가 필요하다.</p>
        </div>
      </section>

      <section id="versions" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">1.6은 무엇이 달라졌나</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>1.6은 1.5와 같은 0.9B architecture를 유지한다. 공식 문서는 1.5의 취약 영역을 data engine으로 찾아 targeted data optimization을 하고, continued pre-training → supervised fine-tuning → reinforcement learning의 progressive post-training을 적용했다고 설명한다. 즉 추론 graph를 키우지 않고 data와 training signal을 개선한 업그레이드다.</p>
          <p>OmniDocBench는 text·formula·table·reading order를 함께 재는 공개 문서 파싱 benchmark다. 공식 결과는 OmniDocBench v1.6 96.33%와 각 요소 개선을 주장한다. Real5-OmniDocBench에서는 scanning, warping, screen photography, illumination, skew의 다섯 왜곡 조건을 평가한다. 이 수치는 모델 제작 측의 benchmark 결과이며, 내 한국어 보고서·영수증·계약서에서 같은 품질을 보장하지 않는다.</p>
          <CitationBlock source="PaddleOCR-VL-1.6 official documentation" citeKey={2} href="https://www.paddleocr.ai/main/en/version3.x/algorithm/PaddleOCR-VL/PaddleOCR-VL-1.6.html">
            <p>공식 문서는 0.9B architecture 유지, data engine, 세 단계 progressive post-training, OmniDocBench v1.6과 Real5 결과를 함께 공개한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="deployment-matrix" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">배포 matrix</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>문서 OCR 배포에서는 모델 정확도보다 page당 비용과 failure routing이 먼저 병목이 된다. PaddleOCR-VL은 0.9B급이라 범용 VLM보다 작지만, 고해상도 문서와 batch workload에서는 여전히 memory, latency, queue 설계가 중요하다. deployment backend도 inference profile을 크게 바꾼다.</p>
          <div className="not-prose divide-y divide-border border-y border-border">
            {[
              ['대량 단순 OCR', 'PP-OCRv5 중심', '복잡한 표와 reading order는 별도 검증'],
              ['문서 구조 파싱', 'PP-StructureV3 + PaddleOCR-VL', 'bbox와 semantic output의 block identity를 맞춘다'],
              ['RAG ingestion', 'PaddleOCR-VL + document assembler', '페이지 사이 표·제목·caption 관계를 먼저 복원한다'],
              ['저지연 API', 'Target backend + fallback route', '문서 유형별 정확도와 tail latency를 함께 잰다'],
              ['검토·감사', 'Pipeline bbox + VLM content', 'Source crop, parser revision과 review reason을 보존한다'],
            ].map(([goal, choice, risk]) => <div key={goal} className="grid gap-2 py-4 sm:grid-cols-[8rem_12rem_minmax(0,1fr)]"><p className="text-sm font-black">{goal}</p><p className="text-sm">{choice}</p><p className="text-sm leading-relaxed text-muted-foreground">{risk}</p></div>)}
          </div>
          <p>backend를 고를 때는 평균 latency만 보지 말고 p95/p99, page image size, batch size, memory peak, retry rate를 같이 봐야 한다. 문서 처리 시스템은 긴 tail page가 전체 queue를 막기 쉽기 때문에 page-level timeout과 fallback parser를 준비하는 편이 안전하다.</p>
        </div>
      </section>

      <section id="deployment" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">PaddleOCR 생태계와 배포</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>PaddleOCR-VL은 단일 모델만 보지 말고 PaddleOCR toolkit 안에서 봐야 한다. PP-OCRv5는 빠른 text recognition과 다국어 OCR에 강하고, PP-StructureV3는 세분화된 구조 모듈에 강하며, PaddleOCR-VL은 layout analysis와 compact VLM recognition을 한 실행 pipeline으로 묶는다. 목적에 따라 detector와 recognizer, verifier를 조합한다.</p>
          <p>배포에서는 backend가 중요하다. Paddle Inference, ONNX Runtime, TensorRT, OpenVINO, Transformers backend, server deployment 중 어떤 경로를 쓰는지에 따라 latency와 memory가 달라진다. 문서 OCR은 대량 batch 처리와 API 안정성이 중요하므로, 모델 점수만 보고 선택하면 안 된다.</p>
          <CitationBlock source="PaddleOCR official documentation" citeKey={3} href="https://www.paddleocr.ai/main/en/index.html">
            <p>공식 문서는 PaddleOCR-VL, PP-StructureV3, PP-OCR 계열과 local·serving·cross-platform deployment 경로를 함께 제공한다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="failure-modes" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6">실패 모드와 검증</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ul>
            <li><strong>다국어 혼합 실패</strong>: 같은 페이지의 한국어/영어/중국어/숫자/수식이 서로 다른 script로 처리되는지 확인한다.</li>
            <li><strong>표 구조 손상</strong>: cell text는 맞아도 row/column alignment가 틀릴 수 있다.</li>
            <li><strong>좌표 부족</strong>: VLM output이 의미 구조는 좋지만 정확한 bbox가 필요한 시스템에는 부족할 수 있다.</li>
            <li><strong>스캔 왜곡</strong>: skew, warping, illumination, screen photo에서는 전처리와 robust model 선택이 중요하다.</li>
            <li><strong>Chart hallucination</strong>: 차트 값을 추정해버리면 위험하므로 axis/value 검증을 둔다.</li>
          </ul>
          <p>실무에서는 PaddleOCR-VL 결과와 PP-StructureV3/PaddleOCR pipeline 결과를 같은 문서에서 비교해본다. VLM이 구조를 잘 읽는 영역과 pipeline이 좌표를 잘 주는 영역을 조합하면 더 안정적인 document AI system을 만들 수 있다.</p>
          <p>Page packet을 검증한 뒤에는 <InternalLink slug="document-structure-assembly">Document Assembly</InternalLink>로 넘긴다. 이 단계에서 page 47과 48의 table fragment, page 90과 91의 heading-body 관계를 복원한다. Page parser가 이 관계까지 맞혔다고 간주하지 않는다.</p>
        </div>
        <CapabilityCheck items={[
          '0.9B architecture와 1.6 model revision의 의미를 구분할 수 있다.',
          'Input audit부터 typed page block handoff까지 여섯 stage를 설명할 수 있다.',
          'PaddleOCR-VL, PP-OCR와 PP-Structure의 책임을 문서 목표에 맞게 나눌 수 있다.',
          'Page benchmark와 cross-page document correctness를 구분할 수 있다.',
        ]} />
        <StopRule>PP-DocLayoutV2가 region·bbox·order를 만들고 crop recognizer가 typed content를 생성하는 경계를 설명하고, 내 문서에서 검증할 page packet schema를 쓸 수 있으면 멈춘다. Cross-page 관계는 이 글에서 추정하지 않고 Document Assembly로 넘긴다.</StopRule>
        <SourceNotes sources={[
          { label: 'PaddleOCR-VL-1.6 official', href: 'https://www.paddleocr.ai/main/en/version3.x/algorithm/PaddleOCR-VL/PaddleOCR-VL-1.6.html', note: '현재 0.9B model revision의 architecture, training과 benchmark 주장.' },
          { label: 'PaddleOCR-VL paper', href: 'https://arxiv.org/abs/2510.14528', note: 'NaViT-style encoder와 ERNIE-4.5-0.3B의 원 구조.' },
          { label: 'PP-DocLayoutV2 official', href: 'https://www.paddleocr.ai/v3.3.1/en/version3.x/module_usage/layout_analysis.html', note: 'RT-DETR-L 기반 layout detector, 6-layer pointer network와 reading-order 복원 구조.' },
          { label: 'PaddleOCR documentation', href: 'https://www.paddleocr.ai/main/en/index.html', note: 'OCR·structure·VL pipeline과 deployment의 공식 진입점.' },
        ]} />
      </section>
    </div>
  );
}
