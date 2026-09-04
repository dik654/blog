const recoveryFlow = [
  ["실패 분류", "빌드, 테스트, 충돌, timeout, 외부 의존성 문제를 구분합니다."],
  ["상태 확인", "현재 브랜치와 작업 결과, 이전 복구 시도 이력을 수집합니다."],
  [
    "레시피 선택",
    "해당 실패에 적용할 수 있고 부작용이 제한된 절차를 고릅니다.",
  ],
  ["제한된 실행", "재시도 횟수와 timeout 안에서 복구를 수행합니다."],
  [
    "검증 또는 에스컬레이션",
    "문제가 해결됐는지 확인하고 아니면 사람에게 넘깁니다.",
  ],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Recovery는 같은 명령을 다시 실행하는 기능이 아니다
      </h2>
      <ContentBoundary article="claw-recovery" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          빌드 실패와 merge conflict는 모두 “작업 실패”로 보입니다. 필요한 대응은 전혀 다릅니다. network timeout은 재시도로 풀릴 수 있지만 잘못된 코드나 오래된
          branch는 상태를 바꾸지 않고 재시도해 봐야 같은 실패만 반복합니다. Recovery engine은 실패를 분류하고 현재 상태에 맞는 복구 절차를 제한된 횟수로 실행합니다.
        </p>
        <p>
          이 글의 <strong>PINNED</strong> 설명은 Claw Code commit
          <code>b71afdd…</code>의 recipe·ledger·branch 판정에 한정됩니다.
          Checkpoint, durable lease, 외부 effect reconciliation과 사람의
          acknowledgement는 source에서 이미 완성된 기능이 아니라 안전한 운영을
          위해 추가로 검증할 <strong>HARDENING</strong> 계약입니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 lg:grid-cols-5">
        {recoveryFlow.map(([title, description], index) => (
          <div key={title} className="rounded-xl border bg-card p-4">
            <span className="text-xs font-bold text-primary">{index + 1}</span>
            <strong className="mt-2 block text-sm">{title}</strong>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          복구 레시피에는 전제와 성공 조건이 필요하다
        </h3>
        <p>
          recipe에는 실행할 명령 목록만 들어가지 않습니다. 어떤 실패에 적용할지, 실행 전에 보존할 상태가 무엇인지, 성공을 어떻게 확인할지까지 담아야 합니다. 파일이나 branch를
          바꾸는 절차는 재실행해도 결과가 같은지 확인하고 되돌릴 수 없다면 자동 복구 대상에서 뺍니다. 실행 결과가 “부분적으로 나아졌다”는 자연어 판단만 남지 않도록 test나 상태 비교
          같은 완료 조건도 필요합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Retry budget이 끝나면 다른 주체가 판단한다
        </h3>
        <p>
          같은 recipe를 무한히 반복하면 비용만 늘고 작업 상태가 더 복잡해질 수 있습니다. 실패 종류와 작업별로 retry budget을 두고 한계를 넘으면 로그와 변경 사항, 시도한
          recipe, 남은 선택지를 묶어 escalation해야 합니다. stale branch도 단순히 오래됐다는 이유로 삭제하지 않습니다. 기준 branch와의 차이, 미커밋 변경,
          소유자를 확인한 뒤에 처리합니다.
        </p>
        <p>
          다음에는 <strong>recipes</strong>에서 전제·동작·검증 구조를,
          <strong>stale branch</strong>에서 신선도와 충돌 판정을 확인합니다.
          마지막
          <strong>escalation</strong>은 자동화가 멈춰야 할 조건과 사람에게
          전달할 증거를 다룹니다.
        </p>
      </div>
    </section>
  );
}
import ContentBoundary from "@/components/articles/content-boundary";
