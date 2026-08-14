import PromptCacheViz from "./viz/PromptCacheViz";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

const cacheMetrics = [
  ["Read", "cache에서 재사용한 input token"],
  ["Write", "새 prefix를 cache에 쓴 token과 비용"],
  ["Miss", "불일치 원인·model·breakpoint·prefix digest"],
  ["Latency", "TTFT와 전체 latency의 hit·miss 분포"],
] as const;

export default function PromptCache() {
  return (
    <section id="prompt-cache" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Prompt caching은 반복되는 정확한 prefix 계산을 재사용한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          먼저 이름이 비슷한 두 cache를 분리해야 합니다. Provider prompt cache는
          tools, system instruction와 이전 message로 이루어진 동일한 prefix의
          model 계산을 재사용하지만 suffix와 새 output은 계속 계산합니다. 반면
          response cache는 동일한 전체 request에 과거 response를 그대로 돌려주므로
          sampling·최신 데이터·side effect 의미가 달라집니다.
        </p>
        <p className="leading-7">
          Pinned Claw <code>PromptCache</code>는 둘을 함께 다룹니다. Provider가
          반환한 cache creation/read token을 추적하는 동시에, 전체
          <code>MessageRequest</code> fingerprint로 response를 로컬 파일에 약 30초
          저장하는 completion cache도 갖습니다. 따라서 이 구현을 설명할 때
          “prompt caching은 response cache가 아니다”로 끝내면 실제 source의
          민감한 response 저장과 stale-answer 위험을 놓칩니다.
        </p>

        <div className="not-prose my-8">
          <PromptCacheViz />
        </div>

        <div id="paper-claw-prompt-cache-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code PromptCache @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/api/src/prompt_cache.rs"
            citeKey={4}
            type="code"
          >
            <p>
              <strong>문제:</strong> 짧은 재요청의 response 재사용과 provider cache
              usage·break를 session별로 기록합니다. <strong>기여:</strong> pinned
              source는 30초 completion TTL, 5분 prompt continuity window, request
              fingerprint와 JSON persistence를 구현합니다. <strong>전제:</strong>
              commit·config home·session ID·request serializer를 고정합니다.
              <strong> 근거 범위:</strong> 로컬 cache와 계측의 실제 동작입니다.
              <strong> 일반화 금지:</strong> provider-side cache 생성, 암호학적
              confidentiality, atomic persistence나 side-effect-safe replay를
              보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cacheMetrics.map(([title, body]) => (
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
          변하지 않는 내용을 앞에, 매번 바뀌는 내용을 뒤에 둔다
        </h3>
        <p className="leading-7">
          일반적으로 stable tool schema, system instruction, 긴 reference
          context를 앞쪽에 두고 timestamp, request ID와 이번 user input을 뒤에
          둡니다. tool 순서가 바뀌거나 system prompt에 현재 시각을 삽입하면 뒤
          내용이 같아도 exact prefix match가 깨질 수 있습니다.
        </p>
        <p className="leading-7">
          prefix digest에는 provider, model, serialized content, tool schema
          order, relevant option과 policy version을 포함합니다. text만 hash하면
          다른 model 또는 tool contract의 cache usage를 같은 것으로 잘못 집계할
          수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          automatic caching과 explicit breakpoint를 구분한다
        </h3>
        <p className="leading-7">
          provider가 자동으로 eligible prefix를 cache할 수도 있고, client가
          breakpoint나 cache-control marker를 명시할 수도 있습니다. 자동 동작을
          추측해 자체 TTL timer를 만들기보다 response usage로 실제 read·write를
          확인하고 provider profile에 지원 방식과 model 조건을 기록합니다.
        </p>
        <p className="leading-7">
          Anthropic의 현재 문서는 automatic caching과 explicit cache breakpoint,
          기본 5분·선택적 1시간 TTL 및 provider-specific usage field를
          설명합니다. OpenAI 문서는 recent model의 automatic caching과 최신
          model family의 explicit breakpoint·cache write usage 차이를
          설명합니다. 세부 동작은
          <a
            href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
            target="_blank"
            rel="noreferrer"
          >
            Anthropic 공식 문서
          </a>
          와
          <a
            href="https://platform.openai.com/docs/guides/prompt-caching"
            target="_blank"
            rel="noreferrer"
          >
            OpenAI 공식 문서
          </a>
          에서 현재 값을 확인해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          hit rate보다 token-weighted 비용을 본다
        </h3>
        <p className="leading-7">
          짧은 prefix 열 번 hit와 매우 긴 prefix 한 번 miss를 단순 request hit
          rate로 비교하면 실제 비용을 놓칩니다. uncached input, cache read,
          cache write와 output token을 provider usage field에서 따로 수집하고
          당시 pricing table version으로 비용을 계산합니다.
        </p>
        <p className="leading-7">
          고정된 “몇 번 재사용하면 이득” 공식을 문서에 박아 두지 않습니다.
          write와 read 배율, TTL, prefix 길이와 요청 간격이 달라지므로 실제
          workload distribution에서 break-even과 latency percentile을
          계산합니다.
        </p>

        <ExplainedFormula
          question="Provider cache가 실제 input 비용을 얼마나 줄였는지 어떻게 계산할까?"
          idea={<>요청 수가 아니라 token 종류별 단가를 곱합니다. Cache가 없었다면 모든 prefix token이 일반 input이었을 비용과, 실제 creation·read·uncached input 비용의 차이를 같은 가격표 version에서 비교합니다.</>}
          formula={String.raw`\begin{aligned}C_{\mathrm{actual}}&=p_uU+p_wW+p_rR+p_oO\\S&=C_{\mathrm{baseline}}-C_{\mathrm{actual}}\end{aligned}`}
          terms={[
            { symbol: "U", name: "uncached input tokens", description: "Cache에 포함되지 않아 일반 input 단가가 적용된 token 수입니다." },
            { symbol: "W", name: "cache creation tokens", description: "새 prefix 계산을 cache에 쓰면서 provider가 보고한 token 수입니다." },
            { symbol: "R", name: "cache read tokens", description: "기존 prefix 계산을 재사용했다고 provider가 보고한 token 수입니다." },
            { symbol: "O", name: "output tokens", description: "Caching과 무관하게 새로 생성된 output token 수입니다." },
            { symbol: "p_u,p_w,p_r,p_o", name: "versioned unit prices", description: "요청 시점 provider·model·TTL tier의 token별 단가입니다." },
          ]}
          assumptions={[
            "Baseline과 actual은 같은 request content·model·output을 비교하고 가격표 version을 고정합니다.",
            "Provider usage field가 creation·read·uncached token을 구분해 보고한다는 전제가 필요합니다.",
            "Latency와 local completion-cache hit는 이 비용식과 별도 지표로 측정합니다.",
          ]}
          interpretation="S가 양수면 해당 workload와 가격표에서 비용이 줄었습니다. 단일 request hit rate만으로는 긴 miss를 숨길 수 있고, 이 식은 응답 품질·staleness·privacy나 provider cache 격리를 보장하지 않습니다."
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          miss 원인을 prefix segment 단위로 관측한다
        </h3>
        <p className="leading-7">
          usage에서 cache read가 0이라는 사실만으로는 어느 부분이 달라졌는지
          알기 어렵습니다. tool schema, system, reference context, history
          segment별 digest와 길이를 secret-safe telemetry로 남기면 timestamp
          삽입, tool 재정렬과 이전 message 수정 같은 원인을 찾을 수 있습니다.
        </p>
        <p className="leading-7">
          raw prompt를 observability backend에 보내는 것은 cache 진단보다 큰
          privacy 문제가 될 수 있습니다. keyed digest, byte·token count와
          redacted change category를 기본으로 사용하고 원문 접근은 제한합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          로컬 completion cache는 별도의 correctness·privacy 경계다
        </h3>
        <p className="leading-7">
          Pinned 구현은 직렬화한 전체 request를 FNV-1a 계열 fingerprint로 만들고,
          response JSON을 session cache directory에 기록합니다. 이 hash는 빠른 key일
          뿐 MAC이나 암호화가 아니므로 secret 보호·tenant isolation·tamper proof로
          해석할 수 없습니다. Directory permission, at-rest encryption, quota와
          삭제 정책을 별도로 검증해야 합니다.
        </p>
        <p className="leading-7">
          Tool 실행을 유도할 수 있는 response를 그대로 replay하면 같은 tool call이
          다시 제안될 수 있습니다. Runtime은 cache source를 event에 표시하고 새
          permission·idempotency·effect receipt를 거치게 해야 하며, time-sensitive
          prompt·nondeterministic sampling·external state read에는 completion cache를
          끄거나 key에 relevant state version을 포함해야 합니다. Pinned source에
          이 모든 보강이 구현됐다고 주장하지 않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          warm-up과 동시 요청의 race를 비용에 포함한다
        </h3>
        <p className="leading-7">
          첫 response가 시작되기 전에 같은 prefix의 요청을 여러 개 보내면 모두
          cache write 또는 miss가 될 수 있습니다. 긴 shared prefix를 사용하는
          burst workload는 single-flight warm-up이나 작은 stagger를 검토하되,
          latency 요구와 failure blast radius를 함께 봅니다.
        </p>
        <p className="leading-7">
          provider cache가 만료되거나 unavailable해도 요청 결과의 correctness가
          달라져서는 안 됩니다. caching은 optimization이므로 miss는 정상 경로로
          처리하고, cache marker error가 request 전체를 막을지 marker 없이
          fallback할지는 provider별 contract test로 정합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          data retention과 isolation도 provider 계약의 일부다
        </h3>
        <p className="leading-7">
          prompt caching이 memory representation만 저장하는지,
          workspace·organization 단위로 어떻게 격리되는지와 Zero Data Retention
          적용 여부는 provider와 platform에 따라 달라질 수 있습니다. 민감
          데이터를 cacheable prefix에 넣기 전에 현재 data policy와 enterprise
          계약을 확인합니다.
        </p>

        <div id="paper-provider-prompt-cache" className="scroll-mt-24">
          <CitationBlock
            source="Anthropic — Prompt caching"
            href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
            citeKey={5}
          >
            <p>
              <strong>문제:</strong> 반복되는 긴 prefix 계산을 provider에서 재사용해
              input latency와 비용을 줄입니다. <strong>기여:</strong> 공식 문서는
              cacheable prefix, automatic/explicit control, TTL과 usage field의 현재
              의미를 설명합니다. <strong>전제:</strong> 지원 model·platform·최소
              길이·가격표를 요청 시점 문서에서 확인합니다. <strong>근거 범위:</strong>
              Anthropic provider cache입니다. <strong>일반화 금지:</strong> OpenAI의
              cache 정책, Claw의 로컬 response cache 또는 항상 hit한다는 보장은
              아닙니다.
            </p>
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
