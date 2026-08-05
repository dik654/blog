import { Link } from 'react-router-dom';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import StepViz from '@/components/ui/step-viz';
import { articlePath, categoryPath } from '@/lib/paths';
import {
  CapabilityCheck,
  BeginnerOpening,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  SystemDiagnosisLab,
  SystemsReadingSequence,
} from './systems-foundation-map/SystemsReadingViz';

const stepData = [
  {
    title: '1. 입력은 무엇인가?',
    body: '텍스트는 token, 카메라는 pixel, 문서는 block, GPU 학습은 tensor를 받는다. 이름이 아니라 한 작업 단위의 실제 shape·시간축·주소를 먼저 고정한다.',
  },
  {
    title: '2. 다음 실행까지 남는 상태는 무엇인가?',
    body: 'KV cache, model weight, robot pose, document claim처럼 다음 계산이 다시 읽는 값을 찾는다. 저장 위치·수명·무효화 조건이 달라지면 시스템 구조도 달라진다.',
  },
  {
    title: '3. 누가 어떤 계산을 수행하는가?',
    body: 'GPU kernel, parser, policy, planner처럼 입력을 실제 출력으로 바꾸는 owner를 찾는다. “AI가 처리한다”를 module·process·device 단위의 책임으로 바꾼다.',
  },
  {
    title: '4. 어느 경계를 어떤 계약으로 통과하는가?',
    body: 'GPU 사이 tensor, parser 사이 document block, ROS 2 node 사이 message가 이동한다. Shape·schema·ordering·freshness·latency 중 무엇을 지켜야 하는지 적는다.',
  },
  {
    title: '5. 성공과 실패를 무엇으로 검증하는가?',
    body: '처리량, provenance, tracking error, 정답 reward처럼 요구사항을 판정할 신호를 정한다. 검증 결과는 다음 입력과 상태 갱신 규칙으로 돌아간다.',
  },
];

export default function SystemsCommonLensArticle() {
  return (
    <>
      <BeginnerOpening
        title="어려운 이름을 외우기 전에, 한 번의 일이 시작해서 끝나는 길을 먼저 따라갑니다."
        description={<>이 글은 특정 model이나 논문을 설명하는 글이 아니다. 처음 보는 AI 기술 앞에서 길을 잃지 않도록, <strong className="text-foreground">무엇이 들어오고, 누가 일하고, 무엇이 남으며, 언제 성공했다고 말하는지</strong>를 찾는 첫 읽기 순서를 만든다. 처음부터 아는 AI 용어는 없어도 된다.</>}
        familiarScene={<>택배 하나를 보낸다고 생각해 보자. 상자를 접수하고, 여러 허브에서 분류하고, 다음 장소로 넘기고, 마지막에 제대로 도착했는지 확인한다. 우리는 이미 일상에서 이런 흐름을 자연스럽게 이해하고 있다. 이 흐름을 AI 시스템에도 차근차근 적용할 것이다.</>}
        steps={[
          { label: '익숙한 흐름을 본다', detail: '택배가 접수부터 배송 확인까지 이동하는 장면으로 다섯 역할을 익힌다.' },
          { label: '다섯 질문에 이름을 붙인다', detail: '입력, 남는 값, 일하는 주체, 넘겨줄 때의 약속, 성공 판정을 하나씩 배운다.' },
          { label: '내가 읽을 기술에 적용한다', detail: '막힌 지점이 계산인지 data 이동인지 평가인지 찾고 다음 글을 고른다.' },
        ]}
      />

      <section id="why-common-lens" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">택배에서 찾은 다섯 역할을 AI 기술에 옮겨 보자</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 택배에서 다섯 가지를 찾아보자. 상자와 주소표는 일이 시작될 때 <strong>들어오는 것</strong>이다.
            현재 위치와 배송 이력은 다음 허브에서도 다시 보는 <strong>남아 있는 값</strong>이다. 분류기와 배송원은 실제 일을 하는
            <strong> 주체</strong>다. 허브에서 다음 허브로 넘길 때는 주소를 잃지 않고, 정해진 순서와 시각을 지켜야 한다.
            이것이 <strong>넘겨줄 때의 약속</strong>이다. 마지막에는 올바른 수취인에게 제한 시간 안에 도착했는지 확인한다.
            이것이 <strong>성공 판정</strong>이다.
          </p>
          <p>
            AI 시스템도 더 많은 부품이 있을 뿐 같은 식으로 읽을 수 있다. 예를 들어 “답이 늦다”는 말만으로는 원인을 찾을 수 없다.
            글을 숫자로 바꾸는 단계가 늦는지, model 계산이 늦는지, 다른 computer로 data를 보내며 기다리는지, 마지막 검사에 시간이 오래 걸리는지
            나눠 보아야 한다. 아래 다섯 말은 이 구분을 짧게 부르기 위한 이름이다.
          </p>
        </div>
        <ConceptPrimer
          title="방금 택배 예에서 찾은 다섯 가지"
          items={[
            { term: '1. 들어오는 것 · Input', meaning: '일을 시작할 때 시스템이 받는 재료다. 글, image, sensor 값처럼 형태는 달라도 된다.', why: '무엇을 받았는지 모르면 결과가 어디서 잘못되었는지 거슬러 갈 수 없다.' },
            { term: '2. 남아 있는 값 · State', meaning: '한 단계가 끝난 뒤에도 보관되어 다음 단계가 다시 읽는 값이다.', why: '오래된 값이나 잘못 저장된 값이 다음 계산에 계속 영향을 줄 수 있다.' },
            { term: '3. 일하는 주체 · Compute owner', meaning: '입력을 실제로 바꾸거나 결정을 만드는 program, process 또는 device다.', why: '“AI가 했다”를 어느 부품이 무엇을 했는지로 바꿔야 고칠 곳이 보인다.' },
            { term: '4. 넘겨줄 때의 약속 · Boundary contract', meaning: '한 부품이 다른 부품에 data를 넘길 때 형태, 순서, 시각을 지키기로 한 약속이다.', why: '각 부품이 혼자 정상이어도 서로 기대한 형태가 다르면 전체는 실패한다.' },
            { term: '5. 성공 판정 · Verification signal', meaning: '결과가 요구를 만족했는지 확인하는 test, 점수 또는 반드시 지켜야 할 조건이다.', why: '판정 기준이 있어야 수정 전과 후를 같은 방법으로 비교할 수 있다.' },
          ]}
        />
        <StepViz steps={stepData.map((step) => ({ label: step.title, body: step.body }))}>
          {(step) => <SystemsReadingSequence step={step} />}
        </StepViz>
        <QuestionLead
          label="이제 확인할 질문"
          question="그렇다면 서로 다른 AI 기술을 이 다섯 칸에 적으면 모두 같은 분야가 될까?"
          answer="아니다. 이 다섯 질문은 기술들을 하나로 묶는 이론이 아니라, 처음 볼 때 구조를 놓치지 않게 돕는 읽기 순서다. 어느 칸에서 막혔는지 찾은 뒤에는 그 분야에 필요한 수학, 논문과 구현으로 따로 내려가야 한다."
        />
      </section>

      <section id="shared-foundations" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다섯 질문은 정확히 무엇을 분리할까?</h2>
        <ConceptPrimer
          items={[
            { term: 'Input representation · 입력 표현', meaning: '외부 요청을 token, tensor, document block, sensor sample처럼 계산 가능한 단위로 바꾼 결과다.', why: '단위, shape, batch, 순서와 source address를 모르면 누락과 변형 오류를 정의할 수 없다.' },
            { term: 'State · 남는 상태', meaning: '한 계산이 끝난 뒤에도 남아 다음 계산이 다시 읽는 값이다.', why: 'Weight, cache, pose, IR처럼 저장 위치·수명·무효화 조건이 다른 값을 구분해야 오래된 상태를 찾을 수 있다.' },
            { term: 'Compute owner · 계산 소유자', meaning: '입력을 실제로 변환하거나 결정을 만드는 module·process·device다.', why: '병목과 오류의 책임을 제품 이름이 아니라 실행 주체와 측정 가능한 구간에 연결한다.' },
            { term: 'Boundary contract · 경계 계약', meaning: 'Module이나 장치 사이를 통과하는 data의 shape, schema, ordering, freshness, latency 약속이다.', why: '각 부분이 혼자 정상이어도 양쪽의 약속이 다르면 통합된 시스템은 실패한다.' },
            { term: 'Verification signal · 검증 신호', meaning: '출력이 요구사항을 만족하는지 판단하는 test, metric, invariant 또는 reward다.', why: '관측 가능한 판정 기준이 있어야 실패를 재현하고 수정 전후를 비교할 수 있다.' },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>상태와 경계는 왜 따로 봐야 할까?</h3>
          <p>
            상태는 <strong>무엇이 얼마나 오래 남는가</strong>의 문제다. 경계는 <strong>남은 값이 다른 소유자에게 어떤 약속으로 이동하는가</strong>의 문제다.
            Robot pose가 메모리에 정확히 저장되어도 timestamp가 빠진 message로 전달되면 planner는 오래된 pose를 최신 값처럼 쓸 수 있다.
            반대로 schema가 완벽해도 cache invalidation이 늦으면 오래된 값을 정확한 형식으로 빠르게 전달할 뿐이다.
          </p>
          <p>
            이 구분은 “데이터 문제”라는 큰 상자를 두 개의 조사로 나눈다. 먼저 값의 생성 시각, owner, storage, lifetime과 invalidation을 적는다.
            그다음 경계를 건널 때 identity, shape, ordering, deadline과 acknowledgement가 보존되는지 본다.
          </p>
          <h3>응답 시간을 하나의 숫자로 보지 않는다</h3>
          <p>
            첫 진단에서는 전체 응답 시간을 다음 장부처럼 나눈다. 실제 시스템에서는 여러 구간이 동시에 실행될 수 있다.
            따라서 아래 항을 무조건 모두 더하는 물리 법칙이 아니라, critical path에서 시간을 소유한 구간을 빠뜨리지 않기 위한 분해다.
          </p>
        </div>
        <M display>{String.raw`\begin{aligned}
T_{\mathrm{response}}
&=\underbrace{T_{\mathrm{repr}}}_{\text{입력 표현}}\\
&+\underbrace{T_{\mathrm{compute}}}_{\text{계산}}\\
&+\underbrace{T_{\mathrm{transfer}}}_{\text{경계 전달}}\\
&+\underbrace{T_{\mathrm{wait}}}_{\text{대기·동기화}}\\
&+\underbrace{T_{\mathrm{verify}}}_{\text{검증}}
\end{aligned}`}</M>
        <FormulaNote
          meaning="왜 나눠 더하나: 전체 latency 하나만 보면 책임 소유자가 사라진다. 같은 clock으로 각 구간을 계측해 더하면 입력 변환, 실제 계산, data 이동, queue·barrier 대기, 검증 중 어느 구간이 critical path를 지배하는지 찾을 수 있다. 동시에 겹친 구간은 두 번 더하지 않고 겹치지 못한 시간만 센다."
          symbols={[
            ['T_response', '사용자가 요청한 시점부터 검증된 결과를 받을 때까지의 wall-clock 시간'],
            ['T_repr', '원문·sensor·request를 model이나 runtime 입력 단위로 바꾸는 시간'],
            ['T_compute', 'Kernel, parser, policy, planner가 실제 값을 계산하는 시간'],
            ['T_transfer', 'Memory tier, process, node와 network 경계를 넘어 data를 옮기는 시간'],
            ['T_wait', 'Queue, lock, barrier, backpressure 때문에 owner가 실행하지 못한 시간'],
            ['T_verify', 'Test, guard, provenance check, reward와 post-processing에 쓴 시간'],
          ]}
        />
        <Misconception>
          가장 오래 실행된 함수가 항상 근본 원인은 아니다. 오래된 sensor sample이 queue에서 기다린 뒤 빠른 controller를 통과하면,
          화면에는 controller failure처럼 보여도 첫 파손은 freshness 계약이다. 증상이 나타난 단계와 처음 약속이 깨진 단계를 분리한다.
        </Misconception>
      </section>

      <section id="failure-localization" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">증상에서 첫 파손 지점까지 어떻게 거슬러 갈까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            출력에서 실패가 보이면 다섯 단계를 거꾸로 걷는다. 먼저 verifier가 무엇을 실패로 판정했는지 확인한다.
            그 직전 경계에서 들어온 값의 identity, version, shape, timestamp와 순서를 본다. 그 값이 맞다면 compute owner의 입력과 출력을 비교한다.
            그다음 사용한 state가 유효했는지, 마지막으로 입력 표현이 원문이나 현실을 잃지 않았는지 확인한다.
          </p>
          <p>
            중요한 것은 모든 단계를 빨갛게 만드는 것이 아니다. <strong>처음 계약이 깨진 위치</strong>와 그 결과가 뒤쪽으로 번진 위치를 나눈다.
            그래야 upstream 한 곳을 고친 뒤 downstream symptom이 함께 사라지는지 검증할 수 있다.
          </p>
        </div>
        <SystemDiagnosisLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            예를 들어 multi-GPU 학습에서 kernel 시간은 그대로인데 GPU 수를 늘릴수록 step이 길어진다면 model architecture부터 다시 읽을 필요가 없다.
            먼저 collective byte, all-reduce 대기, topology와 link utilization을 본다. 반대로 RLVR에서 reward가 오르는데 held-out 정답률이 떨어지면
            optimizer는 주어진 목적을 잘 수행했을 수 있다. 실패한 것은 실제 성공 조건을 대신하지 못한 verifier 계약이다.
          </p>
        </div>
      </section>

      <section id="apply-lens" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 질문을 적용해도 다음 공부는 왜 달라질까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            GPU HPC에서 input은 학습 step의 tensor와 collective request다. State는 GPU 배치, HBM buffer와 진행 중인 collective다.
            Compute owner는 GPU kernel과 NCCL collective이고, boundary는 PCIe·NVLink·NIC·network fabric이다.
            여기서 병목이 boundary에 있다면 행렬 미분보다 topology, RDMA와 congestion control이 다음 공부다.
          </p>
          <p>
            Knowledge Compiler에서는 PDF page, video frame·subtitle, HTML과 repository가 input이다. Normalized Document, claim과 source anchor가 state다.
            Parser, OCR, extractor와 renderer가 compute owner이고, parser → IR → verifier 사이 schema와 provenance가 boundary contract다.
            유창한 답보다 “이 claim을 원문 좌표로 되돌릴 수 있는가”가 먼저인 이유다.
          </p>
          <p>
            Robot AI에서는 sensor sample이 input이고 pose, map, trajectory와 controller memory가 state다. Perception, planning, control은 서로 다른 compute owner다.
            ROS 2 topic과 actuator command는 단순한 pipe가 아니라 timestamp, frame, QoS와 deadline이 붙은 계약이다.
            같은 위치 추정값도 acquisition time을 잃으면 물리 세계에서는 다른 값이 된다.
          </p>
          <p>
            Reasoning RL에서는 prompt와 rollout이 input, policy·trajectory·optimizer가 state, actor·verifier·trainer가 compute owner다.
            Reward가 경계를 건너 update에 들어가므로 verifier가 틀린 성공 조건을 주면 학습은 그 틀림을 더 잘 최적화한다.
            MoE SSD streaming에서는 hidden vector가 input, resident expert와 cache가 state이며, HBM·RAM·SSD 사이 weight 이동이 boundary다.
            여기서는 total parameter보다 miss byte/token과 random-read latency가 먼저다.
          </p>
        </div>
        <StopRule title="공통 프레임은 여기까지만 쓴다.">
          다섯 칸을 채웠다고 해당 분야를 이해한 것은 아니다. 첫 파손 지점과 필요한 증거를 좁혔다면,
          그 분야의 수학·원문·구현 경로로 이동한다. 공통 용어를 더 늘려 서로 다른 이론을 하나로 뭉개지 않는다.
        </StopRule>
      </section>

      <section id="choose-next-path" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">어느 글로 내려가야 할까?</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            새 기술을 읽을 때 다섯 답을 한 줄씩 적는다. 모르는 칸이 곧 다음 읽기 후보지만, 모든 기반을 먼저 공부하지는 않는다.
            현재 목표를 막는 첫 칸만 내려간다. 답을 얻으면 다시 현재 시스템으로 올라와 같은 실행 trace를 끝까지 잇는다.
          </p>
          <p>
            Compute가 막혔으면 algorithm과 kernel을, state가 막혔으면 memory model과 lifecycle을, boundary가 막혔으면 schema·runtime·network를,
            verify가 막혔으면 evaluation·safety·provenance를 읽는다. 이렇게 해야 최신 글에서 시작해 필요한 최소 기반까지만 내려가고 다시 올라올 수 있다.
          </p>
        </div>
        <LearningHandoff
          title="첫 파손 지점에 맞는 목표 경로"
          description="아래 글은 같은 계보가 아니라, 다섯 질문을 실제 기술 계약으로 바꾸는 서로 다른 목적지다."
          items={[
            { label: '적용하기', slug: 'knowledge-compiler', title: 'Knowledge Compiler', reason: '원문 block이 claim과 source evidence가 되는 경계 계약을 추적한다.', learningPathId: 'ai-knowledge-system-core' },
            { label: '적용하기', slug: 'robot-ai-top-down', title: 'Robot AI 탑다운', reason: '명령이 perception·planning·control을 지나 물리 효과로 닫히는 책임을 추적한다.', learningPathId: 'ai-robot-system-overview' },
            { label: '적용하기', slug: 'moe-ssd-streaming', title: 'MoE SSD Streaming', reason: 'Model capacity와 resident working set, random I/O latency를 분리한다.', learningPathId: 'ai-llm-moe-ssd-streaming' },
            { label: '적용하기', slug: 'post-training-rlvr', title: 'Post-training · RLVR', reason: 'Reward ownership과 held-out 성공 조건이 학습 update에 어떻게 연결되는지 본다.', learningPathId: 'ai-llm-post-training-current-first' },
          ]}
        />
        <div className="not-prose my-6 flex min-w-0 items-start gap-3 border-y border-border px-1 py-4 text-sm leading-6 text-muted-foreground sm:px-2">
          <span className="shrink-0 font-bold text-foreground">GPU 경로</span>
          <span className="min-w-0">
            Multi-node compute·network 경계가 문제라면{' '}
            <Link
              to={articlePath('gpu', 'gpu-hpc-from-scratch')}
              className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              GPU HPC 바닥부터
            </Link>
            에서 NVLink, NCCL, RDMA, RoCEv2와 scheduler로 내려간다.
          </span>
        </div>
      </section>

      <section id="finish-line" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">이 글을 읽고 무엇을 할 수 있을까?</h2>
        <CapabilityCheck
          items={[
            '낯선 기술에서 input과 output의 실제 단위·shape·시간축을 먼저 찾는다.',
            '다음 요청까지 남는 state와 요청마다 사라지는 중간값을 구분한다.',
            '계산 병목과 module·device 사이 전달 병목을 따로 측정한다.',
            '경계에서 지켜야 할 identity, schema, ordering, freshness와 deadline을 적는다.',
            '증상이 나타난 단계와 처음 계약이 깨진 단계를 구분한다.',
            'System success를 판정할 test, invariant, metric 또는 reward owner를 정한다.',
            '현재 질문을 막는 최소 기반만 골라 내려갔다가 실행 trace로 돌아온다.',
            '이 프레임이 각 분야의 수학·원문·구현을 대신하지 않는다고 설명한다.',
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            NASA handbook은 interface responsibility와 verification·validation을 분리하고, 통합된 system 수준에서 다시 시험해야 한다고 설명한다.
            Google의 ML systems 연구는 model code 밖의 data dependency, glue code, configuration과 feedback loop가 production failure를 만든다고 지적한다.
            이 글은 그 원칙을 그대로 요약한 표준이 아니라, 낯선 AI 시스템의 첫 조사 순서로 재구성한 저자 프레임이다.
          </p>
        </div>
        <SourceNotes
          sources={[
            { label: 'NASA Systems Engineering Handbook', href: 'https://www.nasa.gov/reference/systems-engineering-handbook/', note: 'System boundary, interface responsibility, product verification·validation과 integrated test를 구분하는 1차 지침.' },
            { label: 'Hidden Technical Debt in Machine Learning Systems', href: 'https://research.google/pubs/hidden-technical-debt-in-machine-learning-systems/', note: 'Data dependency, glue code, configuration, feedback loop처럼 model 바깥의 system debt를 분리한 Google 연구.' },
            { label: 'What’s Your ML Test Score?', href: 'https://research.google/pubs/whats-your-ml-test-score-a-rubric-for-ml-production-systems/', note: 'Data, model, infrastructure test와 monitoring을 production readiness의 실행 가능한 점검으로 만든 Google 연구.' },
            { label: 'ROS 2 Quality of Service settings', href: 'https://docs.ros.org/en/humble/Concepts/Intermediate/About-Quality-of-Service-Settings.html', note: 'Reliability, deadline, lifespan과 liveliness가 message boundary의 구체적 계약임을 보여 주는 공식 문서.' },
          ]}
        />
        <Link
          to={`${categoryPath('ai')}#stage-target`}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background hover:opacity-90"
        >
          목표 분야에서 시작하기 <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
