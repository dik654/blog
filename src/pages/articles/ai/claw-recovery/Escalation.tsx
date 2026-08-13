import EscalationTemplateVarsViz from "./viz/EscalationTemplateVarsViz";
import EscalationViz from "./viz/EscalationViz";

const evidenceFields = [
  {
    title: "Incident",
    body: "failure class, fingerprint, severity와 first·last seen을 담습니다.",
  },
  {
    title: "State",
    body: "branch SHA, task attempt, diff와 active process를 연결합니다.",
  },
  {
    title: "Attempts",
    body: "실행한 recipe, 결과, budget과 중단 이유를 시간순으로 남깁니다.",
  },
  {
    title: "Decision",
    body: "사람이 선택해야 할 안전한 다음 행동과 영향 범위를 제시합니다.",
  },
] as const;

export default function Escalation() {
  return (
    <section id="escalation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Escalation은 자동화가 멈춘 이유와 선택지를 전달한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          escalation은 단순히 더 높은 권한자에게 알림을 보내는 기능이 아닙니다.
          자동화가 더 진행하면 위험하거나 같은 실패를 반복할 때 task를 안전한
          상태에 멈추고, 다음 주체가 판단할 evidence와 선택지를 넘기는
          handoff입니다.
        </p>
        <p className="leading-7">
          permission deny가 발생했다고 곧바로 on-call page를 보내는 식의 고정
          level은 실제 severity를 반영하지 못합니다. user action이 필요한 로컬
          승인, team queue가 맡을 결함, service incident를 구분하고 ownership과
          response SLA가 있는 target으로 route합니다.
        </p>

        <div className="not-prose my-8">
          <EscalationViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {evidenceFields.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          trigger는 횟수뿐 아니라 상태와 위험을 본다
        </h3>
        <p className="leading-7">
          retry budget exhaustion, 같은 failure fingerprint 반복, destructive
          recovery 필요, permission 확장과 verifier 불일치는 대표적인
          trigger입니다. 단순한 elapsed time도 process가 실제로 stalled인지,
          외부 job을 기다리는지 구분한 뒤 사용합니다.
        </p>
        <p className="leading-7">
          escalation 시점에는 새 recovery action을 중단하고 write lease와
          temporary credential을 회수합니다. 진행 중인 외부 job이 있다면 cancel
          가능 여부와 job ID를 evidence에 포함합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          incident key로 알림을 묶고 acknowledgement를 추적한다
        </h3>
        <p className="leading-7">
          같은 lane과 target만 기준으로 cooldown을 두면 failure가 바뀌었는데
          알림을 놓치거나, 같은 incident가 여러 lane에서 중복 전송될 수
          있습니다. service, failure fingerprint, affected resource와 time
          window로 incident key를 만들고 update는 기존 thread나 issue에 이어
          붙입니다.
        </p>
        <p className="leading-7">
          전송 성공은 사람이 인수했다는 뜻이 아닙니다. target message ID,
          acknowledgement, current owner와 deadline을 저장하고, 응답이 없을 때만
          다음 route로 escalation합니다. resolved 뒤에는 후속 알림과 자동
          retry를 함께 닫습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          메시지는 원문 dump보다 판단에 필요한 context를 준다
        </h3>

        <div className="not-prose my-8">
          <EscalationTemplateVarsViz />
        </div>

        <p className="leading-7">
          메시지에는 무엇이 실패했고 사용자에게 어떤 영향이 있는지, 자동화가
          무엇을 시도했으며 현재 state가 안전한지, 가능한 다음 action과 link를
          넣습니다. raw log와 diff는 별도 artifact로 연결하고 secret, user
          data와 prompt content는 redaction합니다.
        </p>
        <p className="leading-7">
          template variable은 typed field에서 가져오고, 외부 입력을 URL이나
          markup에 넣을 때 escaping합니다. notifier별 message rendering과
          delivery retry가 task recovery 자체를 다시 실행하지 않도록 두
          pipeline도 분리합니다.
        </p>
      </div>
    </section>
  );
}
