const TOOL_CONTRACT = [
  ["Schema", "tool 이름, 입력 shape, 필수 field를 machine-readable하게 제한"],
  ["Policy", "이 agent·channel·session에서 tool이 보이는지 먼저 판정"],
  ["Execution", "허용된 backend와 workspace/sandbox 위치에서 side effect 수행"],
  ["Observation", "성공·실패·구조화된 payload를 runtime loop에 반환"],
  ["Delivery", "Gateway가 final result를 원래 channel route로 변환·전달"],
] as const;

export default function CustomTools() {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold">
        skill은 지침이고 tool은 실행 계약입니다
      </h3>
      <p>
        <strong>skill</strong>은 “언제 무엇을 어떻게 하라”는 지침과 참고 자료를
        model context에 제공합니다. <strong>tool</strong>은 schema가 있는 호출
        표면이며 실제 파일, shell, message, browser 같은 side effect를 만들 수
        있습니다. skill을 로드했다고 tool 권한이 생기는 것이 아니고, tool
        schema가 prompt에 보인다고 호출이 자동 승인되는 것도 아닙니다.
      </p>

      <div className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOL_CONTRACT.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h4 className="break-words text-sm font-semibold">{title}</h4>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <p>
        예를 들어 model이 <code>write_report</code>를 호출하면 runtime은 schema에
        맞는 argument인지 확인하고, OpenClaw의 tool policy가 호출 가능성을
        판정한 뒤에만 실행기로 보냅니다. 실행기는
        <code>{`{ ok, artifactId, summary }`}</code> 같은 typed observation을
        돌려주고, model은 이를 바탕으로 final response를 작성합니다. 외부로
        보내는 reply route는 이 argument에서 받지 않고 Gateway의 inbound
        context를 사용해야 route injection을 피할 수 있습니다.
      </p>
    </>
  );
}
