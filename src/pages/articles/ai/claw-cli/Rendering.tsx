import MarkdownViz from "./viz/MarkdownViz";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

const eventRows = [
  ["TextDelta", "응답 본문 버퍼에 추가", "안정된 Markdown 경계까지 표시"],
  ["ToolStarted", "tool ID로 진행 항목 생성", "목적·대상·승인 상태 표시"],
  ["ToolProgress", "해당 항목만 갱신", "stdout·stderr는 출처를 구분"],
  ["ToolFinished", "exit 상태와 결과 확정", "성공·실패·취소를 구분"],
  [
    "PermissionRequested",
    "입력 포커스를 승인 UI로 이동",
    "대상과 효과를 다시 제시",
  ],
  ["Usage · Error", "누적 통계 또는 오류 상태 반영", "완료 신호와 함께 확정"],
];

export default function Rendering() {
  return (
    <section id="rendering" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        스트리밍 이벤트를 터미널 화면으로 바꾸기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모델이 보내는 것은 완성된 Markdown 문서가 아니라 작은 text delta와 tool 이벤트의 연속입니다. 이 조각을 받는 즉시 ANSI 문자열로 출력하면 아직 닫히지 않은
          코드 블록 때문에 스타일이 깨지고 여러 tool call이 겹칠 때 어느 줄을 고쳐야 하는지도 알기 어렵습니다. provider 이벤트를 공통 화면 상태로 먼저 줄인 뒤에
          렌더링해야 하는 이유가 여기 있습니다.
        </p>

        <MarkdownViz />

        <div id="paper-claw-render-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code terminal renderer @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/rusty-claude-cli/src/render.rs"
            citeKey={3}
            type="code"
          >
            <p>
              <strong>문제:</strong> 완성되지 않은 Markdown delta를 terminal에서
              깨지지 않게 표시합니다. <strong>기여:</strong> pinned source는 Markdown
              parser, terminal style, <code>StreamRenderBuffer</code>의 safe-boundary와
              final flush를 구현합니다. <strong>전제:</strong> commit·terminal width·
              color setting·input delta order를 고정합니다. <strong>근거 범위:</strong>
              renderer source와 unit test입니다. <strong>일반화 금지:</strong> 모든
              Unicode 폭·TTY·provider event reducer·screen reader 동작을 이미
              해결했다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Markdown parser 앞에 이벤트 reducer를 둔다
        </h3>
        <p>
          renderer가 provider별 SSE 형식을 직접 알게 하면 API 변경이 UI까지
          번집니다. API adapter가 text, tool lifecycle, permission, usage,
          error를 공통 이벤트로 바꾸고, reducer가 그 이벤트를 현재 화면 상태에
          적용하도록 나누는 편이 낫습니다. provider별 스트림을 정규화하는 책임은
          <a href="/ai/claw-api-client">API client 글</a>에서 다룹니다.
        </p>
        <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border/70">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">공통 이벤트</th>
                <th className="px-4 py-3 font-semibold">상태 변경</th>
                <th className="px-4 py-3 font-semibold">
                  사용자에게 보이는 것
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {eventRows.map(([event, state, view]) => (
                <tr key={event}>
                  <td className="px-4 py-3">
                    <code className="text-xs text-primary">{event}</code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{state}</td>
                  <td className="px-4 py-3 text-muted-foreground">{view}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ExplainedFormula
          question="Event가 재전송되거나 순서가 바뀔 수 있을 때 같은 화면 상태를 어떻게 재현할까?"
          idea={<>화면을 직접 덧그리지 않고, 이전 state와 다음 event를 입력으로 받는 결정적 reducer를 둡니다. Sequence가 이미 적용한 값 이하이면 duplicate로 무시하고, 다음 번호가 건너뛰면 gap을 복구한 뒤 적용합니다.</>}
          formula={String.raw`S_{k+1}=\delta(S_k,e_{k+1}),\qquad \operatorname{seq}(e_{k+1})=\operatorname{seq}(S_k)+1`}
          annotatedFormula={String.raw`S_{k+1}=\underbrace{\delta(S_k,e_{k+1}),\qquad \operatorname{seq}(e_{k+1})=\operatorname{seq}(S_k)+1}_{\text{next normalized event 계산}}`}
          operations={[
            { expression: String.raw`\delta(S_k,e_{k+1}),\qquad \operatorname{seq}(e_{k+1})=\operatorname{seq}(S_k)+1`, annotation: ["next normalized event이(가) 식의 결과에","기여하는 방식을 계산합니다.","화면을 직접 덧그리지 않고, 이전 state와 다음","event를 입력으로 받는 결정적 reducer를 둡니다."] },
          ]}
          terms={[
            { symbol: "S_k", name: "render state", description: "현재 text buffer, tool call별 상태, permission prompt, usage와 terminal outcome입니다." },
            { symbol: "e_{k+1}", name: "next normalized event", description: "Session·turn·call identity와 monotonic sequence를 가진 다음 event입니다." },
            { symbol: "δ", name: "deterministic reducer", description: "같은 state와 event에서 항상 같은 다음 state를 만드는 순수 transition입니다." },
          ]}
          assumptions={[
            "Provider adapter가 event identity와 terminal error를 보존해 공통 event로 변환합니다.",
            "Replay 범위 안의 event가 보존되며 gap을 임의의 빈 text로 메우지 않습니다.",
            "ANSI 출력과 JSONL serialization은 reducer 이후의 서로 다른 projection입니다.",
          ]}
          interpretation="이 식은 화면을 재현하고 duplicate 적용을 줄이는 계약입니다. 실제 network 전달이 exactly-once가 되거나 tool side effect가 rollback된다는 뜻은 아닙니다."
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          부분 Markdown은 안정된 경계까지만 확정한다
        </h3>
        <p>
          text delta는 backtick 하나나 링크의 여는 괄호에서 끊길 수 있습니다. 줄바꿈만 기다리는 방식도 코드 블록과 긴 단락에서는 지연이 커집니다. 실용적인 구현은 누적
          버퍼를 유지하면서 parser가 확정할 수 있는 block 경계까지만 화면에 반영하고 나머지는 임시 텍스트로 보여줍니다. 스트림이 끝나면 남은 버퍼를 한 번 더 parse해 최종
          화면을 확정합니다.
        </p>
        <p>
          Pinned <code>StreamRenderBuffer</code>도 누적 문자열에서 stream-safe
          boundary를 찾아 확정 부분을 renderer에 넘기고, 종료 시 남은 부분을
          flush합니다. 그러나 이 buffer가 tool·permission·usage를 모두 하나의
          replayable state machine으로 소유한다는 뜻은 아닙니다. Markdown 조각
          안정화와 runtime event reducer는 별도 검증 층으로 두어야 합니다.
        </p>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
          {[
            ["누적 버퍼", "원본 delta를 잃지 않고 순서대로 보존합니다."],
            ["확정 지점", "완전한 block까지만 스타일과 들여쓰기를 확정합니다."],
            [
              "최종 flush",
              "종료·취소·오류에서도 남은 텍스트를 일관되게 처리합니다.",
            ],
          ].map(([title, description]) => (
            <section
              key={title}
              className="rounded-lg border border-border/70 bg-card p-4"
            >
              <h4 className="text-sm font-bold">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </section>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          TTY 기능은 감지하되 보수적으로 폴백한다
        </h3>
        <p>
          TTY는 사람이 직접 조작하는 터미널 장치를 뜻합니다. stdout이 TTY일 때만
          ANSI 색상, cursor 이동, spinner 같은 대화형 표현을 사용하고, 파이프나
          파일로 리다이렉트되면 plain text 또는 JSONL로 전환해야 합니다.
          <code>NO_COLOR</code>가 설정된 경우에는 터미널이 색상을 지원해도
          사용자 선택을 우선합니다.
        </p>
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
          <section className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-4">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              대화형 TTY
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              너비에 맞춘 Markdown, 진행 중 tool 상태, 승인 prompt, 선택적
              syntax highlighting을 제공합니다.
            </p>
          </section>
          <section className="rounded-lg border border-blue-500/25 bg-blue-500/5 p-4">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
              파이프·CI·로그
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              커서 제어 없이 한 이벤트를 한 record로 기록하고 stderr와 종료 코드를 안정적인 계약으로 유지합니다.
            </p>
          </section>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          꾸미기보다 실행 상태를 설명하는 것이 우선이다
        </h3>
        <p>
          syntax highlighting과 색상은 가독성을 높이지만 사용자가 정말 알아야 하는 것은 지금 모델이 생성 중인지, tool이 실행 중인지, 자신의 승인을 기다리는지입니다.
          애니메이션이 멈춰도 실제 heartbeat와 마지막 이벤트 시각은 확인할 수 있어야 합니다. 취소 후에는 어느 작업이 중단됐고 어느 결과가 이미 반영됐는지를 분명히 남깁니다. 좋은
          CLI는 화려한 출력보다 런타임의 상태를 숨기지 않는 데서 시작합니다.
        </p>
      </div>
    </section>
  );
}
