const flow = [
  ["설정 로드", "서버 이름, transport, 실행 명령과 필요한 환경을 읽습니다."],
  [
    "연결·초기화",
    "분석 snapshot은 legacy handshake를 수행하지만 최신 revision은 stateless core를 사용합니다.",
  ],
  ["기능 발견", "tools·resources 등 서버가 제공하는 기능을 조회합니다."],
  ["런타임 브리지", "MCP tool을 에이전트의 공통 도구 레지스트리에 연결합니다."],
  ["종료·복구", "timeout, 프로세스 종료, 재연결과 리소스 정리를 처리합니다."],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        MCP 글은 프로토콜보다 런타임 연결에 초점을 둔다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MCP(Model Context Protocol)의 기본 개념과 tools·resources·prompts 구분은 별도의 MCP 입문 글에서 다룹니다. 이 글에서는 Claw
          Code가 MCP 서버를 시작하고 기능을 발견한 뒤 그 기능을 기존 tool call 루프에 연결하는 구현 경계를 살펴봅니다. 같은 설명을 반복하기보다 “외부 서버가 언제 내부
          도구처럼 보이기 시작하는가”에 집중합니다.
        </p>
        <p>
          분석한 저장소의 모듈 이름과 지원 transport는 버전에 따라 달라질 수
          있습니다. 특히 이 snapshot이 구현한 <code>initialize</code>·
          <code>initialized</code> handshake는 2025 계열 specification의
          lifecycle이며, 2026-07-28 revision에서는 stateless protocol core와
          선택적인 <code>server/discover</code>로 바뀌었습니다. 따라서 아래
          lifecycle은 현재 MCP의 필수 구조가 아니라 legacy client를 분석하고
          migration 경계를 찾는 사례로 읽어야 합니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 lg:grid-cols-5">
        {flow.map(([title, description], index) => (
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
          Transport와 tool bridge는 다른 책임이다
        </h3>
        <p>
          stdio transport는 자식 프로세스의 표준 입출력으로 JSON-RPC 메시지를 주고받는 방법이고 tool bridge는 MCP의 도구 설명과 호출 결과를 Claw Code
          내부 형식으로 바꾸는 계층입니다. 둘을 분리하면 같은 기능 발견 로직을 다른 transport에서도 재사용할 수 있고 프로세스 로그가 프로토콜 stdout을 오염시키는 문제도
          별도로 다룰 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          외부 도구도 내부 권한을 건너뛸 수 없다
        </h3>
        <p>
          MCP 서버가 제공한 tool schema는 기능 설명이지 권한 증명서가 아닙니다. 서버 출처를 신뢰하더라도 실제 호출은 로컬 정책과 사용자 승인 범위 안에서 이뤄져야 합니다.
          서버 이름과 도구 이름 충돌도 등록 시점에 처리합니다. 연결 실패나 잘못된 응답은 모델에게 구조화된 오류로 돌려주되 전체 세션을 불필요하게 종료하지 않는 복구 경로도 필요합니다.
        </p>
        <p>
          다음에는 <strong>lifecycle</strong>에서 legacy 초기화와 최신
          revision의 차이를,
          <strong>stdio</strong>에서 메시지 프레이밍과 프로세스 로그 분리를 본
          뒤,
          <strong>tool bridge</strong>에서 MCP schema와 내부 레지스트리의 매핑을
          확인하면 됩니다.
        </p>
      </div>
    </section>
  );
}
