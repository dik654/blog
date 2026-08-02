import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import {
  ConceptPrimer,
  Misconception,
  QuestionLead,
} from '@/components/learning/ArticleLearning';
import RequestLifecycleViz from './viz/RequestLifecycleViz';
import ServingControlLab from './viz/ServingControlLab';
import V1Architecture from './V1Architecture';
import { sharedCodeRefs } from './sharedCodeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">빠른 엔진보다 먼저, 어떤 요청을 제시간에 끝낼지 정한다</h2>

      <QuestionLead
        question="총 token 처리량은 늘었는데 대화 사용자가 더 오래 기다린다면, 그 배포는 빨라진 것일까?"
        answer="배치 작업에는 total token throughput이 중요할 수 있지만, 대화형 서비스는 TTFT와 TPOT의 percentile SLO를 만족한 요청 수, 즉 goodput으로 판단해야 한다. vLLM의 PagedAttention과 scheduler는 그 목표를 위한 수단이지 목표 자체가 아니다."
      />

      <ConceptPrimer
        items={[
          {
            term: 'TTFT',
            meaning: '요청을 보낸 뒤 첫 token을 받을 때까지의 시간이다.',
            why: 'queueing, input processing, admission과 prompt prefill이 대화의 첫 반응을 함께 결정하기 때문이다.',
          },
          {
            term: 'TPOT / ITL',
            meaning: '첫 token 이후 다음 token 사이의 생성 간격이다.',
            why: 'decode iteration이 다른 요청과 어떻게 섞이는지, 사용자가 출력 흐름을 매끄럽게 느끼는지를 드러내기 때문이다.',
          },
          {
            term: 'Goodput',
            meaning: '정해 둔 latency SLO를 만족한 유효 처리량이다.',
            why: '실패한 요청까지 합친 total throughput 하나가 사용자 경험 악화를 숨길 수 있기 때문이다.',
          },
          {
            term: 'KV headroom',
            meaning: '새 prompt와 다음 decode token에 내줄 수 있는 KV block 여유다.',
            why: 'GPU 연산량이 남아도 free block이 없으면 request를 admission하지 못하거나 기존 request를 preempt해야 하기 때문이다.',
          },
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>vLLM</strong>은 LLM inference와 serving을 위한 runtime이다. 핵심은 “GPU를 빠르게 돌린다” 한 문장보다 넓다. 여러 request가 길이가 다른 prompt와 output을 만들 때, API 입구·token budget·KV memory·GPU worker를 계속 재조합해 <strong>현재 workload의 SLO 안에서 유효한 request를 최대한 많이 끝내는 시스템</strong>이다.
        </p>
        <p>
          따라서 tuning 전에 model, GPU, precision, vLLM version, input/output length 분포, request rate, burstiness와 max concurrency를 고정한다. 이 계약이 다르면 같은 throughput 숫자라도 같은 실험이 아니다. 아래 실험은 숫자의 절댓값이 아니라 <strong>설정 하나가 어느 장부와 지표를 바꾸는지</strong>를 읽기 위한 교육용 fixture다.
        </p>
      </div>

      <ServingControlLab />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 지표로는 서로 다른 병목을 구분할 수 없다</h3>
        <p>
          긴 prompt가 들어오면 첫 token 전에는 prompt 전체의 attention state를 만드는 <strong>prefill</strong>이 필요하다. 반면 이미 생성 중인 request는 이전 KV cache를 읽으며 보통 한 step에 다음 token을 진행하는 <strong>decode</strong>를 반복한다. 긴 prefill이 한 step의 token budget을 크게 차지하면 대화형 decode의 간격이 늘 수 있다. 반대로 decode만 지나치게 우선하면 긴 prompt의 TTFT가 굶을 수 있다.
        </p>
        <p>
          그래서 현재 V1 optimization 문서는 가능한 구성에서 chunked prefill을 사용해 decode를 먼저 배치하고, 남은 token budget으로 prefill 일부를 처리하는 정책을 설명한다. 이는 “prefill을 없앤다”는 기술이 아니다. 큰 일을 여러 step에 나눠 <strong>다른 request가 끼어들 수 있는 scheduling 경계</strong>를 만드는 것이다.
        </p>
        <p>
          실제 GPU에는 “대화형 queue”와 “배치 queue”가 늘 따로 오는 것이 아니다. 이미 생성 중인 대화 decode, 새로 도착한 긴 대화 prompt, 같은 prefix를 반복하는 batch prompt가 한 step에서 만날 수 있다. 이때 <strong>진행 중 decode가 먼저 budget을 받고, 남은 budget을 여러 prefill에 나눈다</strong>는 규칙을 workload 이름과 분리해 읽어야 한다. 운영의 대화 기준은 <strong>p95 TTFT ≤ 800 ms + p95 TPOT ≤ 50 ms를 만족한 goodput</strong>처럼 먼저 고정한다.
        </p>

        <Misconception>
          “PagedAttention을 켜면 언제나 2~4배 빨라진다”는 뜻이 아니다. 2~4배는 2023년 논문이 당시 FasterTransformer와 Orca를 상대로 같은 latency 조건에서 보고한 역사적 결과다. 현재 서비스는 현재 workload와 vLLM release에서 TTFT·TPOT·throughput·goodput을 다시 측정해야 한다.
        </Misconception>

        <CitationBlock
          source="Kwon et al., SOSP 2023 — PagedAttention"
          citeKey={1}
          type="paper"
          href="https://arxiv.org/abs/2309.06180"
        >
          <p>
            논문은 request의 KV cache를 고정 token 수의 block으로 나누고 block table을 통해 비연속 physical block에 매핑한다. 논문 abstract의 2–4× throughput은 당시 FasterTransformer와 Orca baseline을 같은 latency 수준에서 비교한 결과이며, 최신 vLLM 배포의 보장값이 아니다.
          </p>
        </CitationBlock>

        <h3 id="runtime-ownership" className="scroll-mt-20">한 request는 누구의 상태를 거치는가</h3>
        <p>
          성능 문제가 생겼을 때 “vLLM이 느리다”로 묶으면 고칠 위치를 찾을 수 없다. HTTP validation과 tokenization은 API process, scheduling과 KV admission은 EngineCore, model execution은 worker가 소유한다. 먼저 request가 멈춘 경계와 그 경계가 남긴 산출물을 찾는다.
        </p>
      </div>

      <RequestLifecycleViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <V1Architecture />

        <div className="not-prose my-6 flex flex-wrap gap-2">
          <CodeViewButton onClick={() => onCodeRef('engine-core', sharedCodeRefs['engine-core'])} label="EngineCore.__init__" />
          <CodeViewButton onClick={() => onCodeRef('engine-step', sharedCodeRefs['engine-step'])} label="EngineCore.step" />
        </div>
        <p className="text-sm text-muted-foreground">
          위 버튼의 로컬 코드는 현재 release 전체가 아니라 각 파일의 특정 commit에서 가져온 발췌다. 함수 내부의 제어 흐름을 확인하는 근거로만 사용하고, 파일 간 호환성과 현재 CLI 동작은 v0.26.0 공식 문서와 실제 설치본에서 다시 확인한다.
        </p>
      </div>
    </section>
  );
}
