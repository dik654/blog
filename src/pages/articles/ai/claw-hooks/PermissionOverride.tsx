import PermissionOverrideViz from "./viz/PermissionOverrideViz";

export default function PermissionOverride() {
  return (
    <section id="permission-override" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Hook 결과는 기본 permission을 더 엄격하게만 바꾼다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          hook의 permission override는 이 구현에서 쓰는 결과 형식이며, 임의
          script에 새 권한을 부여하는 기능으로 이해하면 안 됩니다. 기본 policy가
          만든 <code>Allow</code>, <code>Prompt</code>, <code>Deny</code> 중에서
          hook은 더 제한적인 결과만 선택할 수 있습니다.
        </p>
        <p className="leading-7">
          mode·rule·context override의 전체 설계는
          <a href="/ai/claw-permissions">권한 모델</a>이 소유합니다. 이 절은
          hook 결과를 기존 판정과 결합할 때 지켜야 할 monotonic restriction, 즉
          앞에서 제한한 권한을 뒤 단계가 다시 넓히지 못하는 성질만 다룹니다.
        </p>

        <div className="not-prose my-8">
          <PermissionOverrideViz />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          여러 결과는 Deny·Prompt·Allow 순으로 결합한다
        </h3>
        <p className="leading-7">
          base decision과 matching pre hook의 결과를 모두 모은 뒤
          <code>Deny &gt; Prompt &gt; Allow</code> 순으로 가장 제한적인 값을
          선택합니다. hook 순서에 따라 결과가 달라지지 않으며, 하나의 deny를 뒤
          hook이 취소할 수 없습니다.
        </p>
        <p className="leading-7">
          Deny에는 stable reason code와 사용자에게 보여줄 설명을 따로 둡니다.
          여러 hook이 deny했다면 대표 이유 하나만 버리지 말고 관련 hook ID를
          evidence에 남겨 운영자가 충돌을 확인할 수 있게 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Abort가 무엇을 중단하는지 구분한다
        </h3>
        <p className="leading-7">
          pre hook의 block은 아직 시작하지 않은 tool action을 막습니다. post
          hook의 abort는 이미 끝난 action을 취소할 수 없고, 다음 agent turn이나
          후속 tool 실행을 멈추는 control signal일 뿐입니다. 둘을 같은
          <code>Abort</code> boolean으로 표현하면 사용자가 rollback으로 오해할
          수 있습니다.
        </p>
        <p className="leading-7">
          진행 중 process를 실제로 취소하려면 cancellation token을 executor와
          process tree에 전달하고 cleanup 결과를 기다려야 합니다. hook
          response가 abort라고 썼다는 사실만으로 OS process가 종료되지는
          않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          action 수정은 기존 approval을 무효화한다
        </h3>
        <p className="leading-7">
          hook이 command나 path를 수정하도록 허용한다면 원래 action과 다른
          permission 대상입니다. 수정된 arguments를 canonicalize하고 schema,
          boundary, policy와 사용자 approval을 다시 거쳐야 하며, 예전 action
          digest에 묶인 allow를 재사용하지 않습니다.
        </p>
        <p className="leading-7">
          대부분의 hook은 action을 직접 수정하기보다 deny reason이나 추가
          context를 반환하게 하는 편이 단순합니다. 자동 수정이 필요하면 변경
          전후 diff와 modifier hook identity를 사용자와 audit log에 보여줍니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          권한을 넓히는 예외는 hook이 아니라 신뢰된 policy가 만든다
        </h3>
        <p className="leading-7">
          특정 조직 hook이 기본 deny를 allow로 바꿔야 한다면 일반 hook output이
          아니라 admin-signed policy, 좁은 capability와 명시적 scope를 가진 별도
          제어면으로 설계해야 합니다. 대상 tool·resource·actor·expiry와 approval
          owner가 모두 확인돼야 합니다.
        </p>
        <p className="leading-7">
          이 예외 역시 host sandbox와 OS permission을 넘을 수 없습니다. policy
          layer의 allow는 실행을 시도해도 된다는 뜻이지, filesystem·network
          boundary까지 해제한다는 뜻이 아닙니다.
        </p>
      </div>
    </section>
  );
}
