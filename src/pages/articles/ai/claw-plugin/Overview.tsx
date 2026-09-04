import PluginKindViz from "./viz/PluginKindViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Plugin은 외부 코드를 런타임 안으로 들이는 계약이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          조직 전용 도구와 검증 로직을 모두 코어 바이너리에 넣으면 작은 변경 하나도 전체 배포가 됩니다. Plugin은 기능을 별도 artifact와 manifest로 묶어 독립적으로
          설치하고 교체하게 해 주지만 그 순간 신뢰 경계가 하나 생깁니다. 외부 코드가 workspace와 session 데이터에 닿을 수 있는 경계입니다. 따라서 발견·승인·실행·종료를
          하나의 lifecycle로 설계해야 합니다.
        </p>
        <p>
          이 글의 <code>ToolProvider</code>, <code>HookProvider</code>,
          <code>ContextProvider</code>는 분석 대상 저장소가 사용한 내부 분류이며
          업계 표준 용어는 아닙니다. 이름 자체보다 언제 실행되고 어떤 부수
          효과를 낼 수 있는지에 초점을 맞춥니다.
        </p>

        <PluginKindViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          이 글이 소유하는 범위부터 분리한다
        </h3>
        <p>
          이 글은 plugin package의 발견, exact artifact에 대한 신뢰 결정,
          subprocess lifecycle과 update를 소유합니다. 등록된 tool의 공통 호출
          계약은 <a href="/ai/claw-tool-system">tool system 글</a>이, hook의
          제한 규칙은 <a href="/ai/claw-hooks">hook 글</a>이 소유합니다. MCP는
          독립 프로토콜과 transport를 가진 외부 서버 연결이므로
          <a href="/ai/claw-mcp"> MCP lifecycle 글</a>에서 별도로 다룹니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          manifest는 소개문이 아니라 검증 가능한 실행 계약이다
        </h3>
        <p>
          manifest에는 이름과 버전만 넣어서는 부족합니다. plugin API version과 entrypoint, 제공 capability, 입력·출력 schema는 물론 필요한
          파일·네트워크 범위와 resource limit, lifecycle mode까지 들어가야 합니다. loader는 이 선언을 실제 artifact digest와 묶습니다.
          entrypoint가 plugin root를 벗어나지 않는지도 canonical path 기준으로 검사합니다. 선언한 권한은 요청일 뿐이며 실제 실행 시 host가 다시
          강제합니다.
        </p>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
          {[
            ["Identity", "name·version·publisher·digest·signature"],
            ["Compatibility", "plugin API·protocol·platform·entrypoint"],
            ["Capability", "tool·hook·context와 필요한 effect·resource"],
          ].map(([title, description]) => (
            <section key={title} className="rounded-2xl border bg-card p-4">
              <h4 className="text-sm font-bold">{title}</h4>
              <code className="mt-2 block break-words text-xs leading-5 text-primary">
                {description}
              </code>
            </section>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          subprocess는 crash 경계이지 자동 sandbox가 아니다
        </h3>
        <p>
          별도 프로세스로 실행하면 plugin crash와 memory leak이 코어까지 번지지 않고 timeout 때 process tree를 종료하기도 쉽습니다. 그러나 같은 사용자
          권한과 mount, network namespace를 공유하면 plugin이 파일과 secret에 접근할 수 있습니다. 보안 격리는 그래서 따로 걸어야 합니다. 아래에서는 이
          경계를 registry, 실행 protocol, lifecycle 순서로 확장합니다.
        </p>
      </div>
    </section>
  );
}
