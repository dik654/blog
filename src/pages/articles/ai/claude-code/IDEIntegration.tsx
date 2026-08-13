const FAILURE_CASES = [
  {
    injection: "검색 결과가 비어 있음",
    expected: "다른 근거 경로를 찾거나 재현 정보가 부족하다고 보고하며 추측 편집을 하지 않음",
    evidence: "실행한 query와 0건 observation",
  },
  {
    injection: "Bash(npm test:*) allow와 Bash(*) deny가 동시에 match",
    expected: "구체적 allow와 무관하게 deny가 적용됨",
    evidence: "Permission decision trace, command 미실행",
  },
  {
    injection: "PreToolUse command hook이 blocking status 반환",
    expected: "Permission상 허용되어도 tool을 실행하지 않고 이유를 관찰값으로 남김",
    evidence: "Hook result와 side effect 부재",
  },
  {
    injection: "수정 뒤 auth regression test 실패",
    expected: "완료를 선언하지 않고 stderr를 바탕으로 수정 또는 rollback 판단",
    evidence: "Non-zero exit code와 실패 test 이름",
  },
  {
    injection: "Edit 뒤 Bash가 외부 fixture를 변경한 다음 rewind",
    expected: "Direct edit와 외부 효과를 구분하고 fixture는 별도 cleanup",
    evidence: "File diff, external state audit, cleanup result",
  },
  {
    injection: "긴 조사 뒤 compaction 발생",
    expected: "Root 지침과 완료 조건을 유지하고 nested 규칙은 관련 파일 재읽기로 복구",
    evidence: "Compaction 후 loaded instruction과 재실행한 test",
  },
] as const;

export default function IDEIntegration() {
  return (
    <>
      <h3 className="mt-10 text-xl font-semibold">
        Terminal과 IDE는 다른 agent가 아니라 같은 loop를 보는 surface다
      </h3>
      <p>
        Claude Code는 terminal과 VS Code 같은 surface에서 사용할 수 있지만 핵심
        분리는 동일합니다. 모델이 edit를 제안하고 호스트가 permission을 판정하며,
        실행된 결과가 observation으로 돌아옵니다. VS Code에서는 proposed diff를
        사람이 accept·reject하거나 직접 수정할 수 있고, 사람이 diff를 바꾸면 그
        변경도 이후 대화의 상태로 전달됩니다. 현재 동작은
        <a href="https://code.claude.com/docs/en/vs-code"> VS Code 공식 문서</a>와
        <a href="https://code.claude.com/docs/en/overview"> 제품 overview</a>에서
        설치 version에 맞춰 확인합니다.
      </p>
      <p>
        선택 기준은 기능 수보다 review surface입니다. 빠른 local 탐색과 명령 중심이면
        terminal이 단순하고, 여러 파일의 diff를 line 단위로 검토해야 하면 IDE가
        편합니다. CI나 issue event로 무인 실행한다면 대화형 승인에 기대지 말고
        최소 권한, 고정된 input, machine-readable output, timeout과 artifact 보존을
        별도로 설계해야 합니다. 어떤 surface를 쓰더라도 테스트를 실제로 실행했다는
        증거 없이 “수정 완료”라는 응답만 받아서는 안 됩니다.
      </p>

      <h3>정상 사례 하나보다 failure injection으로 harness 경계를 평가한다</h3>
      <p>
        로그인 실패가 한 번 고쳐졌다는 사실만으로 permission, hook, compaction과
        checkpoint 경계가 올바르다고 말할 수 없습니다. 같은 repository snapshot과
        model·settings에서 아래 실패를 하나씩 주입하고, 예상 state transition과
        실제 trace를 비교합니다. 모델의 문장 표현이 달라도 unauthorized effect가
        없고 동일한 deterministic gate를 통과해야 합니다.
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[980px] w-full border-collapse text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="border-b border-border px-4 py-3">주입할 실패</th>
              <th className="border-b border-border px-4 py-3">기대 동작</th>
              <th className="border-b border-border px-4 py-3">남겨야 할 증거</th>
            </tr>
          </thead>
          <tbody>
            {FAILURE_CASES.map((test) => (
              <tr key={test.injection} className="align-top even:bg-muted/20">
                <th className="border-b border-border px-4 py-3 font-semibold">
                  {test.injection}
                </th>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {test.expected}
                </td>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {test.evidence}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>최종 응답은 변경·검증·남은 위험을 분리한다</h3>
      <p>
        이 예시의 좋은 종료 보고에는 원인과 최소 수정 파일, 재현 test와 regression
        test의 명령·exit status, 실행하지 못한 검사, checkpoint로 되돌릴 수 없는
        side effect가 포함됩니다. “로그인 버그를 고쳤습니다”라는 한 문장보다
        “수정 전 재현 test는 실패했고, 두 줄 수정 후 같은 test와 auth suite가
        통과했으며, 외부 system은 호출하지 않았다”가 훨씬 검증 가능합니다.
      </p>
      <p>
        이제 독자는 한 요청의 loop trace를 그릴 수 있고, CLAUDE.md·auto memory·
        compaction을 구분하며, subagent의 input·output·ownership을 정의할 수 있어야
        합니다. 또한 tool registry·permission·hook의 책임과 permission precedence,
        checkpoint가 되돌리지 못하는 범위, built-in tool·Skill·MCP·subagent 선택
        기준을 설명하고 위 failure suite로 설정 변경을 비교할 수 있어야 합니다.
        이 중 하나라도 답할 수 없다면 제품 기능을 더 붙이기보다 해당 실행 경계와
        증거를 먼저 보완해야 합니다.
      </p>
    </>
  );
}
