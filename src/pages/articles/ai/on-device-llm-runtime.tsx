import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  BeginnerOpening,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  DelegationCoverageLab,
  DeviceReleaseLab,
  EdgeExportPipelineLab,
} from './on-device-llm-runtime/viz/OnDeviceRuntimeLabs';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return <div className="not-prose my-6 min-w-0"><div className="min-w-0 rounded-md border border-border p-3 sm:p-4"><MathFormula display className="my-0 text-[13px] sm:text-base">{latex}</MathFormula></div><FormulaNote meaning={meaning} symbols={symbols} /></div>;
}

export default function OnDeviceLlmRuntimeArticle() {
  return (
    <>
      <section id="release-not-demo" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 번 실행된 모델과 배포할 수 있는 휴대폰 앱은 다르다</h2>
        <BeginnerOpening
          title="학습된 모델 파일은 아직 휴대폰이 실행할 프로그램이 아니다"
          description={<>모델의 <strong>체크포인트</strong>는 학습으로 얻은 숫자와 설정을 저장한 재료다. <strong>4B</strong>는 약 40억 개 파라미터, <strong>INT4</strong>는 많은 값을 4비트로 저장한다는 뜻이다. 파일이 8GB 메모리 안에 들어가도 앱, 대화 기록과 실행 작업 공간이 함께 필요하다.</>}
          familiarScene={<>컴퓨터용 설계 도면과 재료가 상자 안에 들어간다고 해서 휴대폰에서 바로 조립되는 것은 아니다. 휴대폰이 이해할 작업 순서로 바꾸고, 지원하는 부품에 일을 나누고, 실제 기기에서 열과 배터리까지 견디는지 확인해야 한다.</>}
          steps={[
            { label: '실행할 계산을 고정한다', detail: '입력 크기, 대화 기록 상태와 반복 생성 단계를 실행 그래프로 바꾼다.' },
            { label: '휴대폰의 계산 장치에 나눈다', detail: 'CPU·GPU·NPU가 지원하는 계산과 되돌아오는 구간을 확인한다.' },
            { label: '실제 앱에서 오래 시험한다', detail: '로딩, 취소, 속도, 최대 메모리, 열과 전력 사용을 반복 측정한다.' },
          ]}
        />
        <QuestionLead
          question="약 40억 파라미터의 INT4 모델이 8GB 휴대폰에서 한 번 답했다면, 이제 앱에 배포해도 될까?"
          answer="아니다. Checkpoint는 아직 특정 phone이 실행할 프로그램이 아니다. 입력 shape와 KV state를 실행 graph로 고정하고, target backend가 맡을 subgraph를 내리고, 실제 앱에서 load·stream·cancel을 연결한 뒤, 5분과 15분의 memory·latency·energy·quality를 모두 통과해야 release가 된다."
        />
        <ConceptPrimer items={[
          { term: 'Checkpoint', meaning: '학습한 tensor와 model configuration을 저장한 재료다.', why: 'Weight가 작다는 사실만으로 target kernel, app API나 실행 가능 shape를 알 수 없다.' },
          { term: 'KV · Key-Value cache', meaning: 'Attention이 다음 token에서 다시 쓸 과거 token의 key·value 상태다.', why: 'Context가 길어질수록 실행 중 memory가 늘고 export graph가 유지해야 할 state가 된다.' },
          { term: 'Exported graph', meaning: 'Python 실행에서 필요한 tensor 연산과 입력 제약을 포착한 프로그램 표현이다.', why: '동적 Python을 edge runtime이 실행할 수 있는 제한된 계약으로 바꾼다.' },
          { term: 'Delegate', meaning: 'Graph 일부를 Core ML·QNN·XNNPACK 같은 backend가 실행하도록 넘긴 결과다.', why: '지원하지 않는 op는 portable runtime에 남아 성능과 memory 경계를 만든다.' },
          { term: 'Sustained trace', meaning: '실제 device에서 같은 workload를 여러 분 반복해 얻은 시간·memory·전력 기록이다.', why: 'Cold demo가 숨기는 thermal throttling과 배터리 비용을 드러낸다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>출발점은 model leaderboard가 아니라 제품 장면이다. 예를 들어 “비행기 모드에서 8K private document를 읽고 3초 안에 첫 답을 시작하며 15분 동안 10 tok/s를 유지한다”처럼 쓴다. 이 문장에는 offline, context, TTFT(Time To First Token, 요청 뒤 첫 token이 나올 때까지의 시간), sustained decode와 privacy라는 검증 가능한 조건이 있다. 반면 “NPU에서 4B가 돈다”에는 release 판단 기준이 없다.</p>
          <p>이 글은 checkpoint를 <strong>export contract → target precision → partition·delegate → target artifact → app runtime → physical-device release</strong>로 바꾸는 흐름을 다룬다. Weight·KV·bandwidth·양자화의 세부 예산은 다음 글인 <InternalLink slug="efficient-inference-on-device">효율 추론과 On-device AI</InternalLink>가 맡는다. 두 글을 분리해야 graph가 왜 느린지와 model이 왜 큰지를 같은 원인으로 오해하지 않는다.</p>
        </div>
        <EdgeExportPipelineLab />
        <Misconception><code>.pte</code>는 단순히 확장자를 바꾼 checkpoint가 아니다. Export한 graph, execution plan, constant와 target delegate 결과를 담은 실행 artifact다. XNNPACK용 artifact가 QNN이나 Core ML에서 같은 성능으로 자동 실행된다고 가정할 수 없다.</Misconception>
      </section>

      <section id="export-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Export는 무엇을 실행 계약으로 고정할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>학습 코드는 Python control flow, 임의 크기의 입력과 여러 자료형을 자유롭게 쓴다. Edge runtime은 그 자유를 그대로 가져가지 않는다. Export는 example input을 따라 실제 tensor 연산을 포착하고, 어떤 dimension이 변할 수 있으며 어디까지 커질 수 있는지 기록한다. 따라서 example input은 “형식만 맞추는 dummy”가 아니라 배포 가능한 shape 공간의 증거다.</p>
          <p>LLM에는 한 번의 forward만 있지 않다. Prompt를 여러 token씩 처리하는 prefill, KV cache를 읽고 한 token을 추가하는 decode, cache를 갱신하거나 재배치하는 mutation이 있다. Runner가 부를 method와 cache layout이 export 뒤에도 유지되어야 한다. 2K로만 export한 graph가 8K를 자동 수용하거나, cache update가 graph 밖 Python side effect로 남아도 보존될 것이라고 기대하면 안 된다.</p>
          <p>Dynamic upper bound는 성능에도 영향을 준다. Compiler와 memory planner는 가능한 tensor 크기를 알아야 arena를 계획한다. Bound를 너무 작게 잡으면 실제 요청이 실패하고, 무작정 크게 잡으면 사용하지 않는 memory를 예약하거나 backend가 정적 최적화를 놓칠 수 있다. 제품의 context cap과 export bound는 같은 manifest에서 관리해야 한다.</p>
        </div>
        <StopRule>Export 내부 구현을 더 내려가기 전에 checkpoint revision, tokenizer revision, prefill·decode method, context upper bound, KV dtype·layout을 한 장의 manifest로 고정한다. 이 계약을 적지 못하면 compiler 세부를 읽어도 배포 결과를 재현할 수 없다.</StopRule>
      </section>

      <section id="partition-delegate" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Partitioner는 graph를 어떻게 나눌까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Operator</strong>는 matmul·softmax처럼 graph에 적힌 의미이고, <strong>kernel</strong>은 특정 dtype·shape·layout에서 그 operator를 실행하는 코드다. <strong>Backend</strong>는 여러 kernel과 compiler 규칙을 가진 실행 체계다. <strong>Partitioner</strong>는 backend가 지원할 수 있는 연결된 subgraph를 찾고, <strong>delegate</strong>는 그 영역을 backend가 소비할 형태로 내린 결과다. 이 다섯 단어를 하나로 부르면 어디서 지원이 끊겼는지 찾을 수 없다.</p>
          <p>양자화 순서도 target-aware여야 한다. INT4 weight file을 먼저 만들었다고 NPU가 같은 packing과 group scale을 직접 계산하는 것은 아니다. Backend가 지원하는 quantized operator와 dtype 조합에 맞춰 graph를 변환하고, 그 결과를 reference logits·task quality와 비교한다. Unsupported region은 portable runtime에서 실행될 수 있지만 그것은 <em>정확성 보험</em>이지 성능 보증이 아니다.</p>
          <p>ExecuTorch의 custom LLM 흐름에서는 exported program을 edge dialect로 내리고 backend partitioner로 delegate한다. Verbose delegation report는 어떤 node가 위임됐는지 보여 준다. 그러나 node 개수만 세면 값싼 reshape 400개와 비싼 attention 1개를 같은 무게로 센다. 그래서 다음 단계에서 Inspector의 실제 실행 시간과 경계 복사를 붙인다.</p>
        </div>
        <Misconception>Portable fallback이 있으니 어떤 graph도 충분히 빨리 돈다는 뜻은 아니다. 기능은 성공하면서도 큰 attention이 CPU로 내려가거나 accelerator와 CPU 사이에 tensor가 왕복해 latency와 energy가 무너질 수 있다.</Misconception>
      </section>

      <section id="coverage-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">위임률 94%인데 왜 느릴 수 있을까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Node coverage는 compiler가 graph의 얼마나 많은 조각을 넘겼는지 말한다. Time coverage는 실제 실행 시간 중 delegate가 맡은 비율을 말한다. 둘은 질문이 다르다. 아래 교육용 trace에서 attention fallback은 832개 중 784개 node, 즉 94.2%를 위임한다. 하지만 fallback attention과 경계가 72ms를 써 delegate가 맡은 시간은 145ms 중 73ms, 즉 50.3%뿐이다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{C_{node}}_{\text{node 위임률}}
&=\frac{\underbrace{N_{delegate}}_{\text{위임 node}}}{\underbrace{N_{all}}_{\text{전체 node}}}\\[0.6em]
\underbrace{C_{time}}_{\text{시간 위임률}}
&=\frac{\underbrace{T_{delegate}}_{\text{위임 영역 시간}}}{\underbrace{T_{all}}_{\text{전체 실행 시간}}}
\end{aligned}`}
          meaning="Node 위임률은 graph coverage를, 시간 위임률은 실제 trace의 가속 대상 비중을 보여 준다. 두 수치를 함께 봐야 값싼 지원 op가 많아서 coverage만 높아지는 착시를 피한다. 이 식은 speedup 자체가 아니라 어디에 시간이 남았는지를 찾는 진단식이다."
          symbols={[[String.raw`N_{delegate}`, 'Backend delegate에 포함된 graph node 수'], [String.raw`N_{all}`, '전체 실행 graph node 수'], [String.raw`T_{delegate}`, '실제 trace에서 delegate 영역이 쓴 시간'], [String.raw`T_{all}`, 'Fallback과 경계를 포함한 end-to-end 실행 시간']]}
        />
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{T_{boundary}}_{\text{경계 비용}}
&\ge\underbrace{\frac{B_{boundary}}{BW_{effective}}}_{\text{tensor 이동}}+\underbrace{n_{sync}t_{sync}}_{\text{동기화}}\\[0.6em]
\underbrace{T_{total}}_{\text{전체 실행}}
&\approx\underbrace{T_{delegate}}_{\text{가속 영역}}+\underbrace{T_{fallback}}_{\text{portable 영역}}+T_{boundary}
\end{aligned}`}
          meaning="Subgraph 경계를 넘는 tensor byte는 유효 bandwidth만큼의 이동 시간을 만들고, 각 경계에는 완료 확인과 queue 동기화가 붙는다. Shared physical memory나 unified virtual/managed memory를 쓰더라도 주소 공간 공유 여부와 별개로 cache coherence, page migration, ownership 전환과 synchronization 비용이 남을 수 있다."
          symbols={[[String.raw`B_{boundary}`, 'Delegate와 portable runtime 사이를 오간 tensor byte'], [String.raw`BW_{effective}`, '해당 copy path에서 측정한 유효 bandwidth'], [String.raw`n_{sync}`, '경계를 건너며 기다린 동기화 횟수'], [String.raw`t_{sync}`, '동기화 한 번의 평균 시간']]}
        />
        <DelegationCoverageLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>분석 순서는 report의 빨간 unsupported op를 보는 데서 끝나지 않는다. ETRecord로 export graph와 debug handle을 남기고, ETDump 실행 event를 Inspector에 연결해 operator·delegate별 시간을 찾는다. 그다음 platform profiler에서 CPU·GPU·NPU queue와 copy를 확인한다. 같은 event가 두 도구에서 이어질 때 “어떤 graph 경계가 어느 device wait를 만들었는가”를 설명할 수 있다.</p>
        </div>
      </section>

      <section id="resident-state" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실행 중 memory는 어디에서 늘어날까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>다운로드 file과 resident memory는 다른 장부다. File에는 packed weight와 metadata가 있고, 실행 순간에는 KV cache, planned tensor arena, delegate workspace, runtime allocator, tokenizer, prompt buffer, UI와 OS가 함께 산다. Memory planner는 lifetime이 겹치지 않는 intermediate tensor가 같은 arena를 재사용하게 해 peak를 줄인다. 하지만 delegate 내부 allocation, tokenizer, app object와 OS reserve까지 전부 대신 계산하지는 않는다.</p>
          <p>그래서 “8GB phone”을 식의 왼쪽에 그대로 넣지 않는다. OS와 다른 process, 화면·카메라 같은 동시 기능을 위한 reserve를 먼저 뺀 <em>usable app budget</em>을 정한다. Model load 방식도 구분한다. Memory mapping은 필요한 page를 늦게 읽을 수 있지만 의미상 필요한 weight 총량을 없애지 않으며, page fault가 첫 token이나 thermal trace에 나타날 수 있다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{M_{usable}}_{\text{앱 사용 한도}}
&=\underbrace{M_{device}}_{\text{물리 memory}}-\underbrace{M_{reserve}}_{\text{OS·동시 기능 여유}}\\[0.6em]
\underbrace{M_{resident}}_{\text{실행 중 총량}}
&=\underbrace{M_W}_{\text{weight}}+\underbrace{N m_{KV}}_{\text{context KV}}+\underbrace{M_{arena}}_{\text{계획 tensor}}\\
&\quad+\underbrace{M_{delegate}}_{\text{backend 작업공간}}+\underbrace{M_{app}}_{\text{runtime·앱}}
\end{aligned}`}
          meaning="Release의 memory 조건은 resident 총량이 usable budget 이하인지를 본다. N이 context token 수이므로 같은 4B model도 2K와 8K에서 KV가 달라진다. Peak high-water mark를 physical device에서 재야 planner 밖 allocation과 app 기능을 포함할 수 있다."
          symbols={[[String.raw`M_{reserve}`, 'OS, foreground app와 동시 기능을 위해 사용하지 않을 memory'], [String.raw`M_W`, 'Packing과 scale을 포함한 resident weight'], [String.raw`m_{KV}`, '한 token이 모든 layer에 추가하는 KV byte'], [String.raw`M_{arena}`, 'Memory planner가 lifetime을 보고 재사용하는 tensor arena'], [String.raw`M_{delegate}`, 'Backend compiler·kernel이 별도로 요구하는 workspace']]}
        />
        <p className="prose prose-neutral max-w-none dark:prose-invert">정밀도별 weight 하한, token당 KV와 bandwidth roofline을 직접 계산하려면 <InternalLink slug="efficient-inference-on-device">다음 예산 글</InternalLink>로 내려간다. PTQ·QAT·native low-bit의 차이가 필요할 때만 <InternalLink slug="quantization">양자화 기초</InternalLink>를 연다. 이 지점이 기반을 무한히 확장하지 않는 첫 경계다.</p>
      </section>

      <section id="app-runtime" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">앱은 artifact를 어떤 순서로 실행할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>앱 통합은 “model path를 넘기고 generate를 부른다”보다 길다. 첫째, app 시작이나 기능 진입 시 artifact와 tokenizer를 <strong>명시적으로 load</strong>한다. 첫 generate가 load까지 몰래 수행하게 두면 cold load와 TTFT가 섞인다. 둘째, generation API가 synchronous라면 UI thread가 아닌 worker thread나 coroutine에서 실행한다. 셋째, streaming callback은 token text를 UI queue로 넘기되 매 token마다 무거운 layout을 다시 만들지 않는다.</p>
          <p>넷째, error callback에서 load failure, incompatible artifact, allocation failure와 generation error를 구분한다. 다섯째, 사용자가 화면을 닫거나 새 prompt를 보내면 stop을 전달하고 오래된 callback을 무시한다. 여섯째, 새 대화와 이어지는 대화를 구분해 context를 reset한다. 이 순서가 없으면 model은 빨라도 앱이 멈추거나 이전 대화가 섞인다.</p>
          <p>Android 공식 runner 예제의 callback, stats, error, stop과 resetContext는 이 lifecycle을 만들 출발점이다. 제품에서는 model revision, tokenizer hash, backend, quantization, export bounds와 최소 runtime version을 artifact manifest에 묶는다. Load 뒤에는 artifact가 기대한 target과 현재 device가 맞는지 확인하고, 맞지 않으면 검증된 CPU artifact나 remote path로 fail closed한다.</p>
        </div>
        <ConceptPrimer title="앱 trace에서 분리할 시간" items={[
          { term: 'Cold load', meaning: 'Process 시작 뒤 artifact와 tokenizer가 준비될 때까지의 시간이다.', why: '첫 generate에 숨기면 TTFT regression의 원인을 찾을 수 없다.' },
          { term: 'Warm TTFT', meaning: 'Load가 끝난 상태에서 prompt 입력부터 첫 token까지의 시간이다.', why: 'Prefill, graph placement와 queue 비용을 비교한다.' },
          { term: 'ITL · Inter-token latency', meaning: 'Streaming token 사이의 시간과 jitter다.', why: '평균 tok/s가 숨기는 끊김과 thermal 하락을 보여 준다.' },
          { term: 'Cancel latency', meaning: '사용자 stop 뒤 실제 compute와 callback이 멈출 때까지의 시간이다.', why: '화면을 떠난 뒤 배터리를 쓰거나 오래된 token이 섞이는 일을 막는다.' },
        ]} />
      </section>

      <section id="thermal-release" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">어떤 device trace가 있어야 배포할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Release build와 debug build를 섞지 않고, 실제 target device를 충전 상태·화면 밝기·network·주변 온도와 함께 기록한다. 같은 prompt·generation length·sampling seed를 cold, warm, 5분, 15분 구간에서 반복한다. 측정값은 cold load, warm TTFT, p50·p95 ITL, decode tok/s, memory high-water, crash, quality, energy/token과 thermal state다.</p>
          <p>Power rail은 device 전체를 본다. 화면, radio와 background process가 섞이므로 “LLM만의 정확한 mJ”로 바로 읽을 수 없다. Android Power Profiler와 Apple Instruments·MetricKit의 device trace를 사용하되 idle baseline, 반복 run과 workload marker로 모델 구간을 분리한다. Emulator나 desktop trace는 app logic 확인에는 쓸 수 있어도 release power evidence가 아니다.</p>
        </div>
        <Formula
          latex={String.raw`\begin{aligned}
\underbrace{R_{sustain}}_{\text{지속 속도 비율}}
&=\frac{\underbrace{\operatorname{median}(TPS_{10:15})}_{\text{10~15분 속도}}}{\underbrace{\operatorname{median}(TPS_{0:1})}_{\text{초기 1분 속도}}}\\[0.65em]
\underbrace{G_{release}}_{\text{최종 배포 gate}}
&=\underbrace{G_T}_{\text{TTFT·ITL}}\;\underbrace{G_M}_{\text{memory}}\;\underbrace{G_E}_{\text{energy}}\;\underbrace{G_Q}_{\text{quality}}
\end{aligned}`}
          meaning="지속 속도 비율은 초기 속도와 10~15분 구간 속도의 차이를 드러낸다. 최종 release gate는 네 조건의 곱으로 읽는다. 각 G는 통과하면 1, 실패하면 0이므로 memory 하나만 통과해도 다른 조건이 깨지면 전체는 0이다."
          symbols={[[String.raw`TPS_{0:1}`, '실행 초기 1분의 decode tokens/s 표본'], [String.raw`TPS_{10:15}`, '10~15분 thermal steady 구간의 decode tokens/s 표본'], [String.raw`G_T`, 'TTFT와 inter-token latency 조건'], [String.raw`G_M`, 'Resident memory와 OOM 조건'], [String.raw`G_E`, 'Energy와 thermal 조건'], [String.raw`G_Q`, '업무 품질과 안전 조건']]}
        />
        <DeviceReleaseLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>기본 fixture의 4B·8K·15분·attention fallback은 4.10GiB라 memory에는 들어간다. 그러나 TTFT 6.24초와 5.8 tok/s가 gate를 깨므로 거부한다. Cold full delegation으로 바꾸면 2.80초, 14.8 tok/s와 42mJ/token이 나오지만 이것은 원인 진단일 뿐이다. 같은 full-delegation 설정을 15분 재실행하기 전에는 배포 증거가 아니다.</p>
        </div>
        <CapabilityCheck items={[
          'Checkpoint, exported graph, edge program, delegate artifact와 app runtime을 서로 구분한다.',
          'Example input, dynamic bound와 KV mutation이 export 계약인 이유를 설명한다.',
          'Operator·kernel·backend·partition·delegate의 책임을 trace에서 찾는다.',
          'Node coverage, time coverage, boundary byte와 synchronization을 함께 계산한다.',
          'Weight·KV·arena·delegate·app·OS reserve에서 resident memory를 구성한다.',
          'Cold load, warm TTFT, ITL, cancel, 5분·15분 thermal trace로 fail-closed release를 결정한다.',
        ]} />
        <SourceNotes sources={[
          { label: 'ExecuTorch 1.3 · LLM Getting Started', href: 'https://docs.pytorch.org/executorch/stable/llm/getting-started.html', note: 'Checkpoint 준비, export, runner와 target 실행을 잇는 공식 출발점. API와 지원 model은 version-sensitive하다.' },
          { label: 'ExecuTorch · Exporting LLMs', href: 'https://docs.pytorch.org/executorch/stable/llm/export-llm.html', note: 'LLM-specific export, quantization, backend와 .pte artifact 생성의 공식 경계.' },
          { label: 'ExecuTorch · Custom LLM', href: 'https://docs.pytorch.org/executorch/stable/llm/export-custom-llm.html', note: 'ExportedProgram, edge lowering, backend partitioner와 delegation report를 연결하는 구현 기준.' },
          { label: 'ExecuTorch · Inspector', href: 'https://docs.pytorch.org/executorch/stable/model-inspector.html', note: 'ETRecord·ETDump와 debug handle을 이용해 delegate·operator execution을 분석하는 공식 도구.' },
          { label: 'ExecuTorch · Memory Planning', href: 'https://docs.pytorch.org/executorch/stable/compiler-memory-planning.html', note: 'Tensor lifetime과 planned arena를 설명하며 planner 밖 memory가 남는 경계를 보여 준다.' },
          { label: 'ExecuTorch · Android LLM Runner', href: 'https://docs.pytorch.org/executorch/stable/llm/run-on-android.html', note: '명시적 load, synchronous generate, callback·stats·error·stop·resetContext의 앱 lifecycle 기준.' },
          { label: 'Android Studio · Power Profiler', href: 'https://developer.android.com/studio/profile/power-profiler', note: '실제 Android device의 power rail과 system event를 함께 보는 공식 측정 경로.' },
          { label: 'Apple · MetricKit', href: 'https://developer.apple.com/documentation/MetricKit', note: '배포된 Apple 앱의 power·performance diagnostic payload를 수집하는 공식 경로.' },
          { label: 'Apple · Metal Performance Trace', href: 'https://developer.apple.com/documentation/xcode/analyzing-the-performance-of-your-metal-app/', note: 'GPU command와 CPU·GPU 관계를 Instruments에서 분석하는 공식 기준.' },
        ]} />
        <StopRule>역사 하향은 현재 runtime contract와 hardware memory hierarchy에서 멈춘다. 오래된 compiler IR·allocator·DVFS 논문은 Inspector나 physical-device trace에서 원인을 설명하지 못할 때만 연다. 새 backend는 demo 영상이 아니라 target artifact, delegation trace, memory high-water, sustained latency·energy와 quality를 모두 재현할 때만 경로 상단에 올린다.</StopRule>
      </section>
    </>
  );
}
