import ExecutionViz from "./viz/ExecutionViz";

const contractRows = [
  [
    "stdin",
    "versioned request frame",
    "call_id·operation·validated arguments·deadline",
  ],
  ["stdout", "versioned response frame", "result 또는 structured error만 기록"],
  ["stderr", "진단 로그", "크기·redaction·retention 정책 적용"],
  [
    "exit status",
    "process outcome",
    "protocol 결과와 별도로 crash·signal을 표현",
  ],
];

export default function ToolExecution() {
  return (
    <section id="tool-execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Plugin subprocess를 protocol worker로 제한하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서브프로세스 plugin은 worker로 보는 편이 안전합니다. host가 넘긴 요청 하나를 처리하고 구조화된 결과를 돌려주는 쪽입니다. shell command 문자열을
          조립하거나 host 환경을 통째로 물려주면 manifest에서 검증한 경계가 사라집니다. executable과 argv를 분리하고 입력·출력 protocol은 versioned
          frame으로 고정해야 합니다.
        </p>

        <ExecutionViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          호출 envelope가 재현과 취소의 기준이 된다
        </h3>
        <p>
          요청에는 plugin·generation·call ID, operation, schema version,
          deadline과 검증된 arguments를 넣습니다. host가 이미 tool schema를
          검증했더라도 plugin은 protocol 경계에서 자신의 domain validation을
          수행해야 합니다. 공통 tool call의 effect와 permission contract는
          <a href="/ai/claw-tool-system"> tool system 글</a>에서 소유합니다.
        </p>
        <div className="not-prose my-6 overflow-x-auto rounded-2xl border border-border/70">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">채널</th>
                <th className="px-4 py-3 font-semibold">역할</th>
                <th className="px-4 py-3 font-semibold">내용</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {contractRows.map(([channel, role, content]) => (
                <tr key={channel}>
                  <td className="px-4 py-3">
                    <code className="text-xs text-primary">{channel}</code>
                  </td>
                  <td className="px-4 py-3 font-medium">{role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          stdout protocol과 로그를 섞지 않는다
        </h3>
        <p>
          plugin이 stdout에 디버그 문자열 한 줄을 쓰는 순간 JSON parser가 깨질 수 있습니다. stdout은 길이 prefix나 JSONL처럼 경계가 분명한
          protocol frame에만 씁니다. 진단은 stderr로 보냅니다. 두 채널 모두 byte 상한을 둬야 무한 출력으로 host memory가 소진되지 않습니다. UTF-8
          경계와 부분 frame을 다루는 incremental parser도 함께 필요합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          실행 환경은 allowlist로 만든다
        </h3>
        <p>
          현재 process environment를 복사한 뒤 몇 개만 지우는 방식은 새 secret이 추가될 때마다 자동으로 노출됩니다. 필요한 변수만 allowlist로 만드는 편이
          낫습니다. locale, PATH의 검증된 일부, call metadata 같은 것들입니다. canonical working directory와 read-only mount, 임시
          쓰기 디렉터리, network policy는 capability에 맞춰 구성합니다. 외부 API가 필요하면 host의 broad credential 대신 짧게 만료되는
          delegated credential이나 host-mediated request를 씁니다.
        </p>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
          {[
            ["Process", "shell 없이 argv 실행·process group·signal 전달"],
            ["Resource", "wall time·CPU·memory·open files·output bytes 상한"],
            ["Access", "filesystem mount·network egress·credential scope 제한"],
          ].map(([title, description]) => (
            <section key={title} className="rounded-2xl border bg-card p-4">
              <h4 className="text-sm font-bold">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </section>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          timeout은 process tree 정리까지 포함한다
        </h3>
        <p>
          future만 취소하면 plugin이 만든 child process가 남을 수 있습니다. deadline이 지나면 먼저 graceful cancellation frame이나
          signal을 보냅니다. 짧은 grace period 뒤에도 살아 있으면 process group이나 job object 전체를 종료합니다. pipe reader와 temp
          file도 같은 cancellation scope에 묶고 종료가 확인된 뒤에만 slot과 credential을 반환합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          장기 실행 worker에는 handshake와 multiplexing이 필요하다
        </h3>
        <p>
          호출마다 process를 띄우는 방식은 단순하지만 startup cost가 큰
          plugin에는 비효율적입니다. 장기 실행 worker를 사용한다면 시작 시
          protocol version과 capability를 handshake하고, 여러 호출을 call ID로
          multiplex하며, concurrency 상한과 per-call cancellation을 지원해야
          합니다. 이 정도의 transport가 필요하면 stdio 기반 MCP와 역할이 겹칠 수
          있으므로
          <a href="/ai/claw-mcp"> MCP lifecycle</a>을 재사용할지 먼저
          검토합니다.
        </p>
      </div>
    </section>
  );
}
