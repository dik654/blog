export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 관계 — 다른 layer 의 응용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          OpenClaw 는 <strong>claw-code 의 직접 비교 대상이 아니라 별도 응용 프로젝트</strong><br />
          핵심 엔진이 <strong>Pi Coding Agent SDK 임베드</strong> — claw 가 아닌 다른 SDK 를 사용한 다중 채널 어시스턴트<br />
          이 글은 "claw-code 자체" 가 아니라 "claw 생태계의 응용 사례" — Gateway 패턴 + 다중 채널 정규화 + 메모리 영속 + 보안
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">원본 Claude Code 의 가장 가까운 대응</h3>
        <p>
          원본 Claude Code 에 OpenClaw 같은 다중 채널 어시스턴트 entrypoint 는 없음 — CLI / IDE / SDK 위주<br />
          가장 가까운 임베딩 패턴들:<br />
          <strong><code>entrypoints/sdk/</code></strong> — Claude Code 를 SDK 로 사용. 다른 앱이 임베드 가능. <code>coreTypes.ts</code> 가 28 hook event 같은 공유 타입 정의<br />
          <strong><code>server/createDirectConnectSession.ts</code></strong> — WebSocket direct connect. OpenClaw Gateway 의 :18789 패턴과 유사<br />
          <strong><code>bridge/sessionRunner.ts</code> + <code>createSession.ts</code> + <code>codeSessionApi.ts</code></strong> — Claude 를 외부에서 호출하는 bridge — OpenClaw 의 channel 통합과 유사 의도<br />
          단 원본은 <strong>메시징 채널 (WhatsApp / Telegram / Slack / Discord) 통합 자체가 없음</strong> — 그 gap 을 OpenClaw 가 채우는 응용
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">OpenClaw 가 다루는 — 원본에도 없는 영역</h3>
        <div className="overflow-x-auto not-prose my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">영역</th>
                <th className="border border-border px-3 py-2 text-left">OpenClaw</th>
                <th className="border border-border px-3 py-2 text-left">claw-code</th>
                <th className="border border-border px-3 py-2 text-left">원본 Claude Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">다중 채널 정규화</td>
                <td className="border border-border px-3 py-2">WhatsApp / Telegram / Slack / Discord</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">없음</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">없음</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Gateway 패턴</td>
                <td className="border border-border px-3 py-2">단일 Node.js Gateway :18789</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">없음</td>
                <td className="border border-border px-3 py-2"><code>createDirectConnectSession</code> 유사 패턴</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">클라이언트 종류</td>
                <td className="border border-border px-3 py-2">Operator (CLI/TUI) / Node (macOS/iOS) / WebChat</td>
                <td className="border border-border px-3 py-2">REPL / sub-agent</td>
                <td className="border border-border px-3 py-2">CLI / IDE 확장 / Web</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">메모리 영속</td>
                <td className="border border-border px-3 py-2">사용자별 영속 store</td>
                <td className="border border-border px-3 py-2">in-memory</td>
                <td className="border border-border px-3 py-2">SessionMemory + jsonl transcript</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">보안</td>
                <td className="border border-border px-3 py-2">토큰 / JWT / 디바이스 페어링</td>
                <td className="border border-border px-3 py-2">workspace trust</td>
                <td className="border border-border px-3 py-2">OAuth + permission rules + MDM</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 이 글이 별도 카테고리인가</h3>
        <p>
          이 글의 다른 claw-* 글과의 차이:<br />
          다른 claw-* 글들은 모두 <strong>claw-code 자체의 모듈</strong> 분석. 원본 Claude Code 와 1:1 비교 가능<br />
          OpenClaw 는 <strong>Pi SDK 임베드 응용</strong> — 비교 축이 다름. 원본의 SDK / bridge entrypoint 와 같은 임베딩 시나리오 사례 중 하나<br />
          이 글의 가치는 "AI 에이전트를 다중 채널 어시스턴트로 응용" 패턴 — Pi SDK 든 claw-code 든 원본 Claude Code SDK 든 같은 문제 해결
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">3 system 의 layer 차이</p>
          <p>
            <strong>원본 Claude Code</strong> — 1st-party CLI / IDE / SDK. 일상 코딩 도구<br />
            <strong>claw-code</strong> — 원본의 Rust 포팅 + 자율 자동화 추가 (PolicyEngine / Recovery / TaskPacket). 자율 코딩 agent runtime<br />
            <strong>OpenClaw</strong> — Pi SDK 임베드한 다중 채널 어시스턴트. 다른 layer 의 응용 — agent runtime 위에서 채널 통합 / 메모리 / 보안 / Gateway 추상화
          </p>
          <p className="mt-2">
            세 system 이 같은 "AI agent" 도메인이지만 다른 책임 — 원본은 <strong>도구</strong>, claw 는 <strong>runtime</strong>, OpenClaw 는 <strong>delivery channel</strong>. 비교 대신 layer 구분으로 이해하는 게 정확
          </p>
        </div>

      </div>
    </section>
  );
}
