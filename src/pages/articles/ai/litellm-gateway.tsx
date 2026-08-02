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
import { GatewayAttemptLab } from './llm-serving-control/viz/ServingControlLabs';

export default function LiteLLMGatewayArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <QuestionLead
          question="Primary endpoint가 느리면 같은 model alias의 다른 endpoint로 바로 보내도 될까?"
          answer={<>먼저 request 권한, context·tool·output capability, health, quota와 budget을 확인해야 한다. <strong>같은 alias는 같은 행동 계약을 보장하지 않으며</strong>, retry·fallback·cooldown도 서로 다른 결정이다.</>}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Gateway는 URL을 바꾸는 proxy가 아니라 request policy enforcement point다. Client가 보낸 logical model name을 실제 deployment 후보로 펼치기 전에 tenant key, allowed model, rate limit, spend budget와 content policy를 적용한다. 이 gate에서 거부되면 upstream attempt는 0건이어야 한다.</p>
          <p>그 뒤에야 capability와 fresh fleet snapshot이 맞는 후보를 고른다. Route 결과에는 선택한 deployment만 아니라 왜 다른 후보를 제외했는지, retry인지 fallback인지, 예상 비용과 trace identity가 남아야 한다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Retry', meaning: '같은 논리 작업을 일시 실패 뒤 다시 시도한다.', why: '부하를 늘리므로 횟수, backoff와 idempotency 경계가 필요하다.' },
          { term: 'Fallback', meaning: '요구 capability를 만족하는 다른 deployment나 model group으로 우회한다.', why: '성공률을 높일 수 있지만 cost와 behavior drift를 만든다.' },
          { term: 'Cooldown', meaning: '반복 실패한 후보를 일정 시간 candidate set에서 제외한다.', why: '계속 실패하는 endpoint로 retry가 몰리는 것을 막는다.' },
          { term: 'Virtual key', meaning: 'Tenant 또는 project별 LLM access와 budget을 표현하는 gateway credential이다.', why: 'Provider secret을 client에 노출하지 않고 quota와 audit을 적용한다.' },
        ]} />
        <GatewayAttemptLab />
      </section>

      <section id="request-attempt-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Logical request 하나가 여러 upstream attempt를 만들 수 있다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Client가 한 번 보낸 작업은 <strong>logical request</strong>다. Gateway가 primary를 호출하고 timeout 뒤 다시 부르거나 다른 group으로 fallback하면 각 wire send가 별도 <strong>attempt</strong>다. Availability, latency와 cost는 두 단위를 섞지 않고 센다.</p>
          <ol>
            <li><strong>Admission:</strong> auth, allowed model, budget, RPM(Requests Per Minute, 분당 요청 수), TPM(Tokens Per Minute, 분당 token 수), concurrency(동시에 처리 중인 요청 수) 제한을 통과한다. 거부 시 attempt 0.</li>
            <li><strong>Eligibility:</strong> context, modality, tool·JSON, region와 data policy로 후보를 거른다.</li>
            <li><strong>Fleet snapshot:</strong> deployment id, release id, Ready endpoint, drain state, 관찰 시각과 TTL을 확인한다.</li>
            <li><strong>Attempt:</strong> 선택한 deployment에 보내고 provider request id, TTFT, tokens, cost와 error type을 기록한다.</li>
            <li><strong>Recovery:</strong> 오류 종류와 output commit 위치에 따라 terminal, bounded retry, cooldown 또는 fallback을 고른다.</li>
          </ol>
          <p>LiteLLM Router는 설정된 model list에서 deployment를 고른다. Kubernetes device claim과 queue를 자동 이해한다는 보장은 없다. Fleet adapter가 <code>release_id ↔ gateway deployment id ↔ Service endpoint</code>를 연결하고 stale snapshot을 후보에서 제외해야 한다.</p>
        </div>
      </section>

      <section id="cost-ledger" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">비용은 route 이름이 아니라 실제 attempt를 모두 더한다</h2>
        <M display>{String.raw`\begin{aligned}
\underbrace{C(r)}_{\text{논리 요청 하나의 총비용}}&=\underbrace{\sum_{a\in A(r)}C_a}_{\text{실제로 실행한 모든 시도의 비용}}\\
\underbrace{\mathbb{E}[C_{\mathrm{direct}}]}_{\text{검사 뒤 직접 우회한 평균비용}}&=\underbrace{(1-p_f)C_p}_{\text{기본 경로 요청}}\\
&\quad+\underbrace{p_fC_f}_{\text{대체 경로 요청}}\\
\underbrace{\mathbb{E}[C_{\mathrm{postfail}}]}_{\text{기본 경로 실패 뒤 평균비용}}&=\underbrace{C_p}_{\text{모든 기본 경로 시도}}\\
&\quad+\underbrace{p_fC_f}_{\text{실패 요청의 추가 우회}}
\end{aligned}`}</M>
        <FormulaNote
          meaning="첫 줄이 일반 원칙이다. 둘째 줄의 $0.0026은 capability 검사에서 primary를 호출하지 않고 10%를 직접 fallback으로 보낸 특수 fixture다. 셋째 줄처럼 primary 실패 뒤 fallback했다면 실패 시도도 비용 장부에 남는다. Primary가 전액 과금된다는 설명용 가정에서는 $0.0028, 즉 baseline 대비 40%다. 실제 비용은 provider usage와 invoice 정책을 확인해 estimated 또는 confirmed로 표시한다."
          symbols={[[String.raw`A(r)`, 'logical request r에서 실제로 실행한 attempt 집합'], [String.raw`p_f=0.10`, '직접 우회 또는 실패 뒤 우회한 request 비율'], [String.raw`C_p=\$0.002`, 'primary attempt의 설명용 비용'], [String.raw`C_f=\$0.008`, 'fallback attempt의 설명용 비용']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Fallback success rate만 보면 장애가 해결된 것처럼 보일 수 있다. 하지만 직접 capability fallback이면 평균 request 비용은 30% 늘고, primary 실패 뒤 추가 fallback이면 설명용 가정에서 40% 늘어난다. Provider별 structured output이나 tool behavior가 다르면 silent quality drift도 생긴다. 따라서 각 attempt의 release id와 route reason을 관측해야 한다.</p>
        </div>

        <M display>{String.raw`\underbrace{\lambda_{\mathrm{attempt}}}_{\text{실제 시도 부하}}=\underbrace{\lambda}_{\text{원 요청률}}\left(\underbrace{1+p_r}_{\text{한 번 retry하는 실패 비율}}\right)`}</M>
        <FormulaNote
          meaning="실패한 request 일부를 한 번만 retry하는 단순 상한이다. 10%가 한 번 retry되면 800 req/min의 원 traffic이 880 attempt/min으로 늘어난다. 다단계 retry와 fallback을 겹치면 더 커진다."
          symbols={[[String.raw`\lambda=800`, '분당 원 request'], [String.raw`p_r=0.10`, '한 번 retry되는 비율'], [String.raw`\lambda_{\mathrm{attempt}}=880`, 'backend가 받는 분당 attempt']]} />
        <Misconception>Retry는 공짜 reliability가 아니다. 이미 queue가 증가한 endpoint에 즉시 retry를 더하면 overload를 증폭할 수 있고, fallback까지 겹치면 원인과 비용을 숨긴다.</Misconception>
      </section>

      <section id="success-ledger" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">98% 성공이 첫 시도 98% 성공을 뜻하지 않는다</h2>
        <M display>{String.raw`\begin{aligned}
\underbrace{S_{\mathrm{first}}}_{\text{첫 시도 성공률}}&=\underbrace{900/1000}_{\text{첫 시도 성공 요청}}=90\%\\
\underbrace{S_{\mathrm{logical}}}_{\text{최종 요청 성공률}}&=\underbrace{980/1000}_{\text{재시도로 회복한 요청 포함}}=98\%\\
\underbrace{S_{\mathrm{attempt}}}_{\text{시도 단위 성공률}}&=\underbrace{980/1100}_{\text{모든 후단 시도 기준}}\approx89.1\%
\end{aligned}`}</M>
        <FormulaNote
          meaning="1,000개 요청 중 900개가 첫 시도에 성공하고, 실패한 100개를 한 번씩 재시도해 80개가 회복된 fixture다. Logical success만 보면 98%지만 backend는 1,100번 일했고 첫 시도 품질은 90%다. 세 비율을 함께 보아야 retry가 숨긴 불안정성과 부하를 볼 수 있다."
          symbols={[[String.raw`S_{\mathrm{first}}`, '첫 upstream attempt가 성공한 logical request 비율'], [String.raw`S_{\mathrm{logical}}`, '모든 recovery 뒤 최종 성공한 client request 비율'], [String.raw`S_{\mathrm{attempt}}`, '성공 attempt를 실제 attempt 총수로 나눈 비율']]} />
      </section>

      <section id="error-stream-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">오류 종류와 첫 token 전후가 recovery 경계를 정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>잘못된 key, 허용되지 않은 model과 exhausted tenant budget은 gateway rejection이며 upstream attempt를 만들지 않는다. 408·429·일부 5xx는 deadline과 <code>Retry-After</code> 안에서 bounded retry 후보가 될 수 있다. Context-window와 content-policy 오류는 전용 fallback policy가 있을 때만 다른 candidate로 보낸다. 400·401·403을 무조건 retry하면 같은 실패와 부하만 반복한다.</p>
          <p>Streaming은 더 엄격하다. 첫 token 전에 실패하면 아직 client-visible output이 없어 다른 endpoint로 재시도할 여지가 있다. Token이 하나라도 전달된 뒤에는 새 응답을 처음부터 붙이면 prefix 중복·문맥 단절이 생긴다. 이때 안전한 자동 재개를 보장하는 별도 protocol이 없다면 in-band stream error와 committed offset을 기록하고 client가 새 요청을 결정하게 한다.</p>
          <p>이 부분은 중요한 <strong>설계 추론</strong>이다. LiteLLM의 retry·fallback 기능이 모든 provider와 client에서 exactly-once stream continuation을 보장한다는 공식 사실이 아니다. Batch job이나 tool side effect가 있는 operation도 idempotency key와 reconciliation evidence 없이 ambiguous timeout을 자동 재전송하지 않는다.</p>
        </div>
      </section>

      <section id="decision-evidence" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">한 route decision에 남겨야 할 것</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ul>
            <li><strong>Logical identity:</strong> request, tenant, virtual key, logical model, operation kind와 policy/config hash.</li>
            <li><strong>Eligibility:</strong> context length, modality, tool/JSON support, region·data policy와 모든 제외 이유.</li>
            <li><strong>Fleet snapshot:</strong> deployment·Service·release id, Ready·drain state, observation timestamp와 freshness TTL.</li>
            <li><strong>Attempt lineage:</strong> attempt id, parent attempt, provider request id, error type, backoff, start·TTFT·end, tokens와 stream commit offset.</li>
            <li><strong>Accounting:</strong> selected deployment, retry·fallback·cooldown reason, cost source와 logical·attempt outcome.</li>
          </ul>
          <p>이 출력은 <InternalLink slug="observability-aiops">관측성과 복구</InternalLink>가 engine queue, GPU와 Kubernetes Pending evidence에 연결할 request-level route record다. Gateway는 fleet capacity를 만들어 내지 않으며, fallback으로 capacity failure를 영구히 가려서는 안 된다.</p>
        </div>
        <CapabilityCheck items={[
          'Retry, fallback과 cooldown의 입력·출력·위험을 구분할 수 있다.',
          'Logical request와 attempt를 구분해 backend 부하, first-attempt·logical success와 총비용을 계산할 수 있다.',
          'Direct capability fallback과 primary 실패 뒤 fallback의 비용식을 구분할 수 있다.',
          'Model alias가 capability compatibility를 자동 보장하지 않는 이유를 설명할 수 있다.',
          '첫 token 전과 부분 output 뒤 실패에서 retry 가능 경계가 왜 달라지는지 설명할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'LiteLLM Router', href: 'https://docs.litellm.ai/docs/routing', note: '현재 load balancing, retries, fallbacks, cooldowns, timeouts와 routing strategy의 제품 경계.' },
          { label: 'LiteLLM reliability', href: 'https://docs.litellm.ai/docs/proxy/reliability', note: 'Retry 뒤 fallback, context-window·content-policy·general fallback group의 현재 동작 경계.' },
          { label: 'LiteLLM exception mapping', href: 'https://docs.litellm.ai/docs/exception_mapping', note: 'HTTP/provider 오류를 auth, rate limit, timeout, context와 server error로 나누는 현재 taxonomy.' },
          { label: 'LiteLLM Virtual Keys', href: 'https://docs.litellm.ai/docs/proxy/virtual_keys', note: 'Project/user access, spend와 rate-limit 정책의 현재 API.' },
          { label: 'LiteLLM Gateway', href: 'https://docs.litellm.ai/docs/simple_proxy', note: 'Proxy server의 auth, cost tracking, rate limiting과 OpenAI-compatible entrypoint.' },
          { label: 'RFC 9110 · retries', href: 'https://www.rfc-editor.org/rfc/rfc9110.html', note: 'Non-idempotent request의 자동 retry를 제한하는 HTTP semantics.' },
          { label: 'OpenTelemetry HTTP spans', href: 'https://opentelemetry.io/docs/specs/semconv/http/http-spans/', note: '각 outbound HTTP request를 client span으로 기록하는 attempt-level telemetry 경계.' },
          { label: 'LiteLLM OpenTelemetry', href: 'https://docs.litellm.ai/docs/observability/opentelemetry_integration', note: 'Proxy, router와 provider call trace를 연결하는 현재 integration과 설정 경계.' },
        ]} />
      </section>
    </>
  );
}
