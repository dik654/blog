import AnthropicSseViz from "./viz/AnthropicSseViz";

const streamState = [
  ["Message", "message ID·model·start/stop·usage"],
  ["Block", "index·content type·start/delta/stop"],
  ["Tool", "tool-use ID·name·partial JSON buffer"],
  ["Transport", "request ID·unknown event·error·completion"],
] as const;

export default function Anthropic() {
  return (
    <section id="anthropic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Anthropic adapter는 Messages API의 block stream을 내부 event로 바꾼다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Anthropic Messages API는 response를 message 안의 여러 content
          block으로 표현하고, streaming에서는 message와 각 block의
          시작·delta·종료가 분리돼 도착합니다. adapter는 이 lifecycle을
          보존하면서 conversation runtime이 사용하는 provider-neutral event로
          변환해야 합니다.
        </p>
        <p className="leading-7">
          credential을 API key로 가져올지 다른 provider-supported login에서
          가져올지는 auth subsystem의 책임입니다. client는 검증된 credential을
          정해진 header에 적용하고 token 값을 log나 error에 남기지 않습니다.
          OAuth/PKCE 자체의 구현은 <a href="/ai/claw-config">설정과 인증 글</a>
          에서 분리해 다룹니다.
        </p>

        <div className="not-prose my-8">
          <AnthropicSseViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {streamState.map(([title, body]) => (
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
          request mapping은 의미가 손실되면 실패한다
        </h3>
        <p className="leading-7">
          내부 request의 system instruction, ordered messages, content block,
          tool schema, tool choice와 output budget을 Messages API field로
          변환합니다. provider가 지원하지 않는 content type이나 option을 조용히
          버리지 말고 capability error로 반환해야 모델 동작이 설정과 다르게
          바뀌지 않습니다.
        </p>
        <p className="leading-7">
          model ID와 beta feature, API version은 provider profile에 명시하고
          response metadata에 실제 사용 값을 보존합니다. request log는 content와
          tool arguments를 기본 redaction하고 request ID와 schema version
          중심으로 남깁니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          SSE parser는 transport framing과 provider event를 분리한다
        </h3>
        <p className="leading-7">
          HTTP chunk 하나가 SSE event 하나라는 보장은 없습니다. byte stream을
          SSE framing 규칙에 따라 event로 만든 뒤, <code>event</code>와
          <code>data</code>를 provider schema로 parse합니다. 가능하면 official
          SDK의 streaming helper를 사용하고 직접 구현할 때는 CRLF, 여러 data
          line, comment, split UTF-8과 bounded buffer를 test합니다.
        </p>
        <p className="leading-7">
          공식 문서는 message start, content block start·delta·stop, message
          delta와 message stop 사이에 ping과 error가 올 수 있고 앞으로 새 event
          type이 추가될 수 있다고 설명합니다. 따라서 unknown event를 전체 stream
          corruption으로 처리하지 말고 telemetry에 남긴 뒤 안전하게 건너뜁니다.
          현재 event 구조는
          <a
            href="https://platform.claude.com/docs/en/build-with-claude/streaming"
            target="_blank"
            rel="noreferrer"
          >
            Anthropic 공식 streaming 문서
          </a>
          에서 확인할 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          tool input은 block 종료 전까지 JSON 문자열 조각이다
        </h3>
        <p className="leading-7">
          tool-use block의 <code>input_json_delta</code>는 완성된 object가
          아니라 partial JSON string입니다. block index와 tool-use ID별 buffer에
          순서대로 누적하고 <code>content_block_stop</code>에서 한 번 parse한 뒤
          schema를 검증합니다. delta마다 임시 JSON을 억지로 고치면 잘못된
          arguments가 실행될 수 있습니다.
        </p>
        <p className="leading-7">
          같은 response에 여러 block이 있을 수 있으므로 global buffer 하나를
          사용하지 않습니다. block stop 없이 connection이 끊기거나 message
          error가 오면 해당 tool call은 incomplete로 폐기하고 executor에 넘기지
          않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          usage와 stop reason은 terminal state에서 확정한다
        </h3>
        <p className="leading-7">
          usage field는 stream 중 여러 event에 나뉠 수 있으므로 provider 규칙에
          따라 누적하고 terminal event에서 final usage를 만듭니다. text가 일부
          도착했더라도 error나 network EOF로 정상 stop을 받지 못했다면 success로
          표시하지 않고 partial output과 failure를 함께 반환합니다.
        </p>
        <p className="leading-7">
          retry는 response byte를 받기 전의 transient failure와 rate limit처럼
          안전한 경우로 제한합니다. 일부 output을 받은 request를 자동 재시도하면
          duplicate text와 tool call이 생길 수 있으므로 새 attempt로 명확히
          시작하거나 사용자에게 상태를 보여줍니다.
        </p>
      </div>
    </section>
  );
}
