const EXTENSIONS = [
  {
    choice: "Built-in tool",
    useWhen: "현재 workspace의 파일·검색·terminal만 필요할 때",
    loginExample: "Grep으로 로그인 오류를 찾고 Edit로 최소 수정",
    boundary: "기본 tool registry와 permission을 그대로 사용",
  },
  {
    choice: "Skill",
    useWhen: "새 권한보다 팀의 반복 가능한 절차와 설명이 필요할 때",
    loginExample: "이 저장소의 auth regression 점검 순서를 불러옴",
    boundary: "지침을 더하지만 그 자체로 새 시스템 권한을 만들지는 않음",
  },
  {
    choice: "MCP server",
    useWhen: "Issue tracker·database 같은 외부 resource나 tool이 필요할 때",
    loginExample: "승인된 staging log 조회 tool을 명시적으로 연결",
    boundary: "외부 capability와 credential scope를 추가하므로 별도 검토",
  },
  {
    choice: "Subagent",
    useWhen: "독립된 context·role·tool set으로 조사 범위를 분리할 때",
    loginExample: "UI와 server 원인 경로를 읽기 전용으로 각각 조사",
    boundary: "새 capability보다 delegation과 handoff가 목적",
  },
] as const;

export default function MCPIntegration() {
  return (
    <>
      <h3 className="mt-10 text-xl font-semibold">
        확장은 필요한 capability의 종류부터 고른다
      </h3>
      <p>
        Claude Code의 <code>.claude</code> 디렉터리와 설정에는 memory, skills,
        agents, hooks, MCP 연결처럼 성격이 다른 확장이 함께 보입니다. 이름만 보고
        모두 추가하면 model context, credential과 실패 지점만 늘어납니다. 로그인
        버그가 local repository와 unit test만으로 재현된다면 built-in Read·Grep·
        Edit·Bash가 가장 작은 선택입니다. 현재 디렉터리 구조와 각 항목의 scope는
        <a href="https://code.claude.com/docs/en/claude-directory"> .claude directory
        공식 문서</a>에서 확인할 수 있습니다.
      </p>

      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[920px] w-full border-collapse text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="border-b border-border px-4 py-3">선택지</th>
              <th className="border-b border-border px-4 py-3">필요한 경우</th>
              <th className="border-b border-border px-4 py-3">고정 예시</th>
              <th className="border-b border-border px-4 py-3">추가되는 경계</th>
            </tr>
          </thead>
          <tbody>
            {EXTENSIONS.map((item) => (
              <tr key={item.choice} className="align-top even:bg-muted/20">
                <th className="border-b border-border px-4 py-3 font-semibold">
                  {item.choice}
                </th>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {item.useWhen}
                </td>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {item.loginExample}
                </td>
                <td className="border-b border-border px-4 py-3 leading-6 text-muted-foreground">
                  {item.boundary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4>MCP tool도 permission과 hook 바깥에 있지 않다</h4>
      <p>
        MCP(Model Context Protocol)는 외부 서버가 tool·resource 등을 노출하는
        protocol입니다. MCP server를 연결하면 그 capability가 Claude Code의 tool
        registry에 나타날 수 있지만, “목록에 보인다”와 “호출이 허용된다”는 같은
        말이 아닙니다. 예를 들어 staging log MCP tool을 등록해도 credential은
        read-only scope로 제한하고, permission rule과 hook에서 호출 인자를
        판정하며, 반환 데이터는 untrusted input으로 다뤄야 합니다.
      </p>
      <p>
        MCP의 transport, capability negotiation과 trust boundary는
        <a href="/ai/mcp-protocol"> MCP 정본</a>, Skill의 파일 구조와 progressive
        disclosure는 <a href="/ai/skills-anatomy">Skills anatomy</a>에서 자세히
        다룹니다. 여기서는 “local tool로 충분한가, 반복 절차만 필요한가, 외부
        capability가 필요한가, 독립 context가 필요한가”의 순서로 가장 작은
        extension을 고르면 충분합니다.
      </p>
    </>
  );
}
