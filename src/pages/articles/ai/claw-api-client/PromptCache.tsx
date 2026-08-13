import PromptCacheViz from "./viz/PromptCacheViz";

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
          prompt cache는 같은 질문의 답을 저장하는 response cache가 아닙니다.
          provider가 tools, system instruction와 이전 message로 이루어진 동일한
          prompt prefix의 model 계산을 재사용해 input 처리 비용과 time to first
          token을 줄이는 기능입니다. 이후 suffix와 새 output은 여전히
          처리합니다.
        </p>
        <p className="leading-7">
          cache key, breakpoint, 최소 길이, TTL, usage field와 가격은
          provider·model 세대·platform에 따라 달라집니다. 그래서 내부{" "}
          <code>PromptCache</code>는 provider cache의 복사본이 아니라 stable
          prefix를 설계하고 usage를 해석하는 policy layer여야 합니다.
        </p>

        <div className="not-prose my-8">
          <PromptCacheViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cacheMetrics.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
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
      </div>
    </section>
  );
}
