import FormatConversionViz from "./viz/FormatConversionViz";
import ProviderCompatMatrixViz from "./viz/ProviderCompatMatrixViz";
import { CitationBlock } from "@/components/ui/citation";

const compatibilityAxes = [
  ["Request", "role·content block·tool schema·model option"],
  ["Stream", "event family·call identity·ordering·terminal state"],
  ["Error", "status·provider code·retryability·request ID"],
  ["Usage", "input·output·reasoning·cached token semantics"],
] as const;

export default function OpenAICompat() {
  return (
    <section id="openai-compat" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        OpenAI-compatible은 URL 모양이 아니라 contract test로 확인한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          많은 provider가 OpenAI와 비슷한 endpoint와 JSON을 제공하지만 같은 base URL을 쓴다고 role, tool call delta, structured
          output과 usage까지 같지는 않습니다. Chat Completions 계열과 Responses API 계열도 event model이 다르므로 하나의 느슨한 parser에
          모두 넣지 않는 편이 낫습니다.
        </p>
        <p className="leading-7">
          adapter는 provider-neutral semantic model에서 각 API family로
          변환합니다. Anthropic payload를 먼저 OpenAI JSON으로 바꿨다가 다시
          내부 형식으로 되돌리는 식의 pairwise conversion은 의미 손실과 분기
          수를 늘립니다.
        </p>

        <div className="not-prose my-8">
          <FormatConversionViz />
        </div>

        <div id="paper-claw-openai-compat-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code OpenAI-compatible adapter @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/api/src/providers/openai_compat.rs"
            citeKey={3}
            type="code"
          >
            <p>
              <strong>문제:</strong> OpenAI와 비슷한 Chat Completions wire
              format을 쓰는 여러 endpoint를 공통 event로 내립니다. <strong>기여:</strong>
              pinned source는 provider profile, request 변환, chunk state와 retry
              경로를 구현합니다. <strong>전제:</strong> commit·provider·model·base
              URL·fixture를 고정합니다. <strong>근거 범위:</strong> 이 source가
              명시적으로 parse하는 field와 test입니다. <strong>일반화 금지:</strong>
              OpenAI-compatible 표기가 Responses API·reasoning·tool delta·usage의
              완전한 의미 일치를 인증하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {compatibilityAxes.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-lg border border-border/70 bg-card p-4"
          >
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          provider-neutral model은 공통분모보다 넓어야 한다
        </h3>
        <p className="leading-7">
          text만 남긴 최소 공통분모는 thinking, refusal, citation, image와 tool result 같은 의미를 잃습니다. 내부 content item을
          tagged union으로 두고 source-specific metadata를 보존하면 지원 provider에서는 그대로 round-trip하고 미지원 provider에서는 명시적
          capability error나 configured fallback을 선택할 수 있습니다.
        </p>
        <p className="leading-7">
          system과 developer role, assistant tool call, tool result 연결 ID도
          API family마다 다릅니다. role을 단순 문자열 치환하지 말고 instruction
          hierarchy와 call correlation이라는 의미를 기준으로 변환합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Responses와 Chat Completions stream을 분리한다
        </h3>
        <p className="leading-7">
          Responses API는 typed event, output item identity와 sequence number를
          사용하고 function arguments의 delta와 done event를 구분합니다. 반면
          Chat Completions 호환 server는 choices 안의 delta와 finish reason을
          사용하는 경우가 많습니다. profile이 선택한 parser만 활성화하고 event
          family가 섞이면 protocol error로 처리합니다.
        </p>
        <p className="leading-7">
          tool arguments는 item 또는 call ID별로 조립해 done event에서 JSON과
          schema를 검증합니다. OpenAI Responses API의 현재 streaming event는
          <a
            href="https://platform.openai.com/docs/api-reference/responses-streaming"
            target="_blank"
            rel="noreferrer"
          >
            공식 API reference
          </a>
          에서 바로 확인할 수 있습니다.
        </p>

        <div className="not-prose my-8">
          <ProviderCompatMatrixViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          capability profile은 관측된 사실이어야 한다
        </h3>
        <p className="leading-7">
          provider 이름만 보고 지원 feature를 하드코딩하면 model·region·API version이 바뀔 때 틀립니다. profile에 API family, model,
          endpoint version, supported content·tool·stream feature와 확인 날짜를 저장하고 startup probe 또는 staging
          contract test로 검증합니다.
        </p>
        <p className="leading-7">
          provider가 무시하는 field도 성공 응답만 보면 발견하기 어렵습니다.
          strict structured output, parallel tool call, usage timing, unknown
          event와 mid-stream error를 fixture로 두고 expected internal event
          sequence를 비교합니다.
        </p>
        <p className="leading-7">
          최소 fixture에는 text-only, 두 개의 interleaved tool call,
          <code>tool_calls: null</code>, malformed argument JSON, 마지막 chunk에만
          usage가 있는 경우와 중간 EOF를 넣습니다. PASS는 HTTP 200이 아니라 공통
          event 순서·call identity·terminal outcome·usage source가 선언한 허용
          범위에서 일치한다는 뜻입니다. Provider나 model revision이 바뀌면 이
          판정도 만료되므로 profile에는 client SHA와 fixture version을 함께
          남깁니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          error normalization은 원인을 지우지 않는다
        </h3>
        <p className="leading-7">
          공통 error에는 authentication, rate limit, invalid request,
          unavailable, timeout과 protocol error를 구분하고 retryability를
          넣습니다. 동시에 provider request ID, redacted code와 original
          status를 cause로 보존해야 support와 incident 분석이 가능합니다.
        </p>
        <p className="leading-7">
          unknown error를 rate limit으로 추측해 재시도하지 않습니다. backoff는 provider hint와 local retry budget을 따르고 일부
          stream을 받은 attempt는 자동 재시도 대상에서 제외합니다.
        </p>
      </div>
    </section>
  );
}
