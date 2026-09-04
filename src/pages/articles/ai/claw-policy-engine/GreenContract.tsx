import GreenContractViz from "./viz/GreenContractViz";

const checkStates = [
  ["Pass", "대상 revision에서 requirement를 충족했다"],
  ["Fail", "실행됐지만 requirement를 충족하지 못했다"],
  ["Pending", "아직 실행 중이거나 결과를 받지 못했다"],
  ["Stale", "다른 revision·config에서 나온 결과라 재사용할 수 없다"],
] as const;

export default function GreenContract() {
  return (
    <section id="green-contract" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        GreenContract는 완료 판정에 필요한 evidence를 묶는 내부 품질 게이트다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <code>GreenContract</code>는 이 저장소가 붙인 내부 이름이며 업계 표준
          용어는 아닙니다. 일반적으로는 quality gate 또는 merge gate에 가까운
          개념으로, 에이전트가 “완료했다”고 보고한 상태와 실제 build·test·review
          evidence를 분리합니다.
        </p>
        <p className="leading-7">
          contract에는 체크 목록 말고도 담을 것이 있습니다. 어떤 revision과 policy version을 대상으로 어떤 evidence가 필요한지, 언제 stale해지고 누가
          예외를 승인할 수 있는지까지 들어가야 재현 가능한 완료 판정이 나옵니다.
        </p>

        <div className="not-prose my-8">
          <GreenContractViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {checkStates.map(([title, body]) => (
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
          required check는 변경 영향과 release policy에서 정한다
        </h3>
        <p className="leading-7">
          작은 팀은 build만, 큰 회사는 security까지 본다는 식의 고정 분류는 잘 맞지 않습니다. 변경된 경로와 배포 대상, 위험 수준으로 requirement를 고르는 편이
          정확합니다. 문서만 바뀐 변경과 인증 코드를 바꾼 변경에 같은 suite를 요구할 이유는 없습니다. 다만 영향 분석이 실패했다면 좁게 추측하지 말고 더 보수적인 기본 suite를
          선택합니다.
        </p>
        <p className="leading-7">
          coverage 80%, lint warning 0 같은 threshold도 보편적 정답이 아니라 versioned policy입니다. contract에 check ID와
          runner, timeout, threshold를 적고 required인지 optional인지까지 명시해 둬야 결과를 해석하는 기준이 실행 사이에 흔들리지 않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          결과는 정확한 revision과 환경에 묶는다
        </h3>
        <p className="leading-7">
          test pass는 commit SHA 또는 tree digest, check definition version,
          runner image와 relevant environment를 가리켜야 합니다. 새 commit이
          올라오면 이전 pass는 <code>Stale</code>로 바뀌며, 같은 branch
          이름이라는 이유로 재사용하지 않습니다.
        </p>
        <p className="leading-7">
          외부 CI의 status만 복사하지 말고 run ID와 artifact provenance까지 보존합니다. callback이 늦게 도착했을 때도 expected revision과
          contract generation이 다르면 현재 gate를 덮어쓰지 않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          flaky test는 pass로 숨기지 않는다
        </h3>
        <p className="leading-7">
          retry 뒤 통과한 test는 최초 pass와 다른 정보입니다. retry count와 failure fingerprint를 남기고 policy가 허용한 bounded
          retry를 넘으면 fail이나 quarantine-required로 처리합니다. quarantine은 담당 owner와 만료일이 붙은 명시적 예외여야 합니다.
        </p>
        <p className="leading-7">
          custom check도 일반 Bash permission과 sandbox, network policy, deadline을 그대로 거치고 output schema까지 검증받습니다.
          contract engine이 특별 권한으로 임의 command를 실행하면 품질 게이트가 오히려 우회 통로가 됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          waiver는 evidence를 지우지 않는다
        </h3>
        <p className="leading-7">
          긴급 배포처럼 failed check를 우회해야 할 때가 있습니다. 그렇다고 결과를 pass로 바꾸면 사후 감사가 불가능해집니다. waiver는 check result와 별도
          record로 두고 여기에 actor와 reason, scope, target revision, expiry를 기록합니다. 허용되지 않은 check라면 waiver 자체를 만들 수
          없어야 합니다.
        </p>
        <p className="leading-7">
          사용자 화면에서는 required check의 pass·fail·pending·stale와 waiver를 한눈에 보여주고 각 항목에서 run과 artifact로 바로 들어갈 수
          있게 합니다. “green”이라는 요약만 남으면 무엇을 확인했는지 알 수 없습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          merge 직전에 gate와 head를 함께 재검증한다
        </h3>
        <p className="leading-7">
          contract가 통과한 뒤에도 다른 commit이 추가될 수 있습니다. merge executor는 expected head SHA와 branch protection,
          approval, contract generation을 원자적으로 다시 확인합니다. 하나라도 달라졌다면 merge하지 않고 새 evidence 수집으로 돌아갑니다.
        </p>
        <p className="leading-7">
          최종 decision에는 사용한 check result ID와 policy version을 남깁니다. 자동화가 잘못된 merge를 만들었을 때 당시 기준과 증거를 그대로 재현하려면
          이 기록이 필요합니다.
        </p>
      </div>
    </section>
  );
}
