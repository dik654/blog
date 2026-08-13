import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const INVARIANTS = [
  "인증과 allowlist가 binding·session lookup보다 먼저 실행된다.",
  "Telegram A와 Slack B는 per-channel-peer key에서 서로 다른 history를 읽는다.",
  "provider, model, runtime, channel은 독립적으로 관측할 수 있다.",
  "skill eligibility가 tool authorization을 대신하지 않는다.",
  "tool policy를 통과한 호출만 sandbox 실행 위치를 해석한다.",
  "elevated exec도 tool deny를 우회하지 않는다.",
  "runtime은 finished turn을 반환하지만 reply route를 선택하지 않는다.",
  "Gateway가 inbound metadata와 typed result를 결합해 원래 channel로 전달한다.",
] as const;

export default function CodeStructure({
  onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold">
        구현을 읽을 때는 파일명보다 invariant를 추적합니다
      </h3>
      <p>
        저장소의 directory와 함수 이름은 release마다 바뀔 수 있습니다. 특히
        <code>pi</code>, <code>embeddedPi</code>,
        <code>runEmbeddedPiAgent</code> 같은 이름은 compatibility alias로 남아 있을
        수 있어, 이름만 보고 현재 public architecture라고 결론 내리면 안 됩니다.
        공식 문서의 책임 계약을 기준으로 아래 invariant가 실제 call path에서
        유지되는지 확인하는 편이 안전합니다.
      </p>

      <ul className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-2">
        {INVARIANTS.map((item, index) => (
          <li
            key={item}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <span className="text-xs font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
              {item}
            </p>
          </li>
        ))}
      </ul>

      {onCodeRef && (
        <aside className="not-prose my-6 rounded-lg border border-border/70 bg-muted/20 p-4">
          <p className="text-sm font-semibold">번들 코드 보기의 근거 경계</p>
          <p className="mt-2 max-w-3xl break-words text-xs leading-5 text-muted-foreground">
            아래 세 파일은 이 블로그가 보관한 설명용 스냅샷으로, 처리 순서를
            따라가기 위한 보조 자료입니다. 현재 upstream의 경로·함수명·기본값을
            보장하지 않으며, 충돌할 때는 위 CitationBlock의 공식 문서와 실제 배포
            version의 source를 우선합니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <CodeViewButton
              onClick={() =>
                onCodeRef("oc-channel-router", codeRefs["oc-channel-router"])
              }
            />
            <CodeViewButton
              onClick={() =>
                onCodeRef("oc-skill-engine", codeRefs["oc-skill-engine"])
              }
            />
            <CodeViewButton
              onClick={() => onCodeRef("oc-sandbox", codeRefs["oc-sandbox"])}
            />
          </div>
        </aside>
      )}

      <h3 className="mt-8 text-xl font-semibold">두 요청의 끝을 다시 재생합니다</h3>
      <p>
        Telegram A의 typed result가 돌아오면 Gateway는 Telegram inbound route와
        결합해 A의 chat으로 답합니다. Slack B도 별도의 session state와 Slack
        thread route를 사용합니다. 어느 runtime을 썼든, skill을 몇 개 읽었든,
        sandbox 안팎 어디서 tool이 실행됐든 이 delivery ownership은 바뀌지
        않습니다. 운영 test는 model 문장 품질뿐 아니라 이 invariant와 audit
        모델 응답의 품질뿐 아니라 이 invariant와 audit evidence를 함께 검증해야
        합니다.
      </p>

      <h3 className="mt-8 text-xl font-semibold">
        retry와 update는 같은 fixture에서 실패를 주입해 검증합니다
      </h3>
      <p>
        Slack B의 답장을 전송한 직후 acknowledgment가 유실됐다고 해보겠습니다.
        연결이 끊긴 일반 request를 reconnect 뒤 자동 replay해서는 안 되며, 같은
        operation identity와 idempotency key로 결과를 조회하거나 안전한 재시도
        절차를 밟아야 합니다. Outbound delivery는 durable queue의
        <code>sent</code>·<code>failed</code>·<code>unknown</code> 상태와 ack,
        dead-letter, reconciliation 기록으로 확인하되, audit activity는 용량이
        제한된 best-effort 근거라는 점을 함께 남깁니다. 완료 여부가 끝내 모호하면
        bounded retry나 사람 검토로 보냅니다.
      </p>
      <p>
        이와 별개로 Gateway event stream은 durable replay queue가 아닙니다.
        sequence gap을 발견한 client는 누락 event를 추측하지 않고 현재 state를
        다시 조회합니다. Request 재시도, outbound delivery 복구, event state
        refresh는 서로 다른 절차이며 어느 것도 외부 tool side effect에 무한한
        exactly-once를 보장하지 않으므로 effect receipt를 별도로 기록합니다.
      </p>

      <div className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-2">
        <article className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
          <h4 className="text-sm font-semibold">Migration paired test</h4>
          <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
            설치 version과 config를 보관한 뒤 <code>pi → openclaw</code>,
            <code>runEmbeddedPiAgent → runEmbeddedAgent</code>만 바꿉니다. 같은
            provider/model, workspace, input, tools, resource manifest에서 runtime
            selection trace, explicit failure, typed result, reply route를 pair로
            비교합니다. canary에서 차이가 나면 config backup으로 rollback합니다.
          </p>
        </article>
        <article className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
          <h4 className="text-sm font-semibold">Release failure matrix</h4>
          <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
            2026-08-13 기준 OpenClaw·plugin·skill artifact와 config backup,
            immutable fixture를 기록하고 동일 provider/model, input, tool set으로
            제한된 canary traffic에서 binding
            collision, shared-DM leak, explicit runtime failure, denied/elevated tool,
            duplicate reply를 주입합니다. route winner, session isolation, resource
            inventory, policy trace, reply receipt, quality·latency·tool call을 paired
            비교합니다. Hard boundary가 회귀하거나 delivery 상태가 unknown으로
            남으면 배포를 중단하고 보관한 binary·plugin·skill·config 조합으로
            rollback합니다.
          </p>
        </article>
      </div>
    </>
  );
}
