export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Claude Code 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Claude Code(Anthropic)는 터미널에서 동작하는 <strong>에이전틱 코딩 도구</strong>입니다.
          코드베이스를 이해하고, 자연어 명령으로 코드 작성/수정, 테스트 실행,
          Git 워크플로우를 자율적으로 수행합니다.
          핵심은 <strong>LLM + Tool Use 루프</strong>로 동작하는 에이전트 아키텍처입니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">에이전트 루프</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Claude Code 에이전트 루프:

사용자 입력
    ↓
┌─→ Claude API 호출 (메시지 + 도구 정의)
│       ↓
│   Claude 응답 분석
│       ↓
│   텍스트 응답? ──→ 사용자에게 출력 ──→ 대기
│       │
│   도구 호출? ──→ 권한 확인 ──→ 도구 실행 ──→ 결과를 메시지에 추가
│       │                                         │
│       └─────────────────────────────────────────┘
│           (다시 Claude API 호출)

핵심 특성:
  1. 자율적 다단계 실행: 하나의 요청으로 여러 도구를 연쇄 호출
  2. 컨텍스트 유지: 대화 내 모든 도구 결과가 컨텍스트에 포함
  3. 병렬 도구 호출: 독립적인 도구는 동시에 실행 가능
  4. 서브에이전트: 복잡한 작업을 하위 에이전트에 위임`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">다른 코딩 AI와의 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">특성</th>
                <th className="border border-border px-4 py-2 text-left">Claude Code</th>
                <th className="border border-border px-4 py-2 text-left">GitHub Copilot</th>
                <th className="border border-border px-4 py-2 text-left">Cursor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">실행 환경</td>
                <td className="border border-border px-4 py-2">터미널 (CLI)</td>
                <td className="border border-border px-4 py-2">IDE 확장</td>
                <td className="border border-border px-4 py-2">전용 IDE</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">에이전트 모드</td>
                <td className="border border-border px-4 py-2">네이티브 (항상)</td>
                <td className="border border-border px-4 py-2">Copilot Agent</td>
                <td className="border border-border px-4 py-2">Composer Agent</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">셸 실행</td>
                <td className="border border-border px-4 py-2">네이티브 Bash</td>
                <td className="border border-border px-4 py-2">제한적</td>
                <td className="border border-border px-4 py-2">터미널 통합</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">서브에이전트</td>
                <td className="border border-border px-4 py-2">다중 병렬</td>
                <td className="border border-border px-4 py-2">없음</td>
                <td className="border border-border px-4 py-2">없음</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">MCP 지원</td>
                <td className="border border-border px-4 py-2">네이티브</td>
                <td className="border border-border px-4 py-2">제한적</td>
                <td className="border border-border px-4 py-2">제한적</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
