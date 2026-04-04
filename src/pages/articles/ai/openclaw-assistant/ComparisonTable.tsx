export default function ComparisonTable() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Claude Code와의 비교</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-border">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-4 py-2 text-left">특성</th>
              <th className="border border-border px-4 py-2 text-left">OpenClaw</th>
              <th className="border border-border px-4 py-2 text-left">Claude Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border px-4 py-2 font-medium">주 목적</td>
              <td className="border border-border px-4 py-2">개인 AI 어시스턴트 (범용)</td>
              <td className="border border-border px-4 py-2">코딩 에이전트 (전문)</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-2 font-medium">인터페이스</td>
              <td className="border border-border px-4 py-2">20+ 메시징 채널</td>
              <td className="border border-border px-4 py-2">터미널 CLI</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-2 font-medium">AI 엔진</td>
              <td className="border border-border px-4 py-2">Pi SDK (멀티 프로바이더)</td>
              <td className="border border-border px-4 py-2">Claude API (Anthropic 전용)</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-2 font-medium">호스팅</td>
              <td className="border border-border px-4 py-2">셀프 호스팅 (로컬)</td>
              <td className="border border-border px-4 py-2">로컬 CLI</td>
            </tr>
            <tr>
              <td className="border border-border px-4 py-2 font-medium">확장성</td>
              <td className="border border-border px-4 py-2">Skills (플러그인)</td>
              <td className="border border-border px-4 py-2">MCP 서버</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
