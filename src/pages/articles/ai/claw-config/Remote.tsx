import RemoteViz from './viz/RemoteViz';
import WsProtocolViz from './viz/WsProtocolViz';

export default function Remote() {
  return (
    <section id="remote" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 세션 &amp; 업스트림 프록시</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RemoteViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">원격 세션이란</h3>
        <p>
          claw-code를 <strong>원격 서버에서 실행</strong>하되 로컬 CLI로 제어하는 모드<br />
          사용 사례:<br />
          - 회사 서버에서 claw-code 실행, 로컬 터미널로 접근<br />
          - GPU 서버에서 에이전트 실행<br />
          - 팀원과 세션 공유 (한 세션을 여러 명이 관찰)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">아키텍처</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="space-y-1">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-3 text-center">
              <div className="font-semibold text-sm">로컬 CLI</div>
              <div className="text-xs text-muted-foreground"><code className="bg-muted px-1 py-0.5 rounded">claw --remote server.example.com</code></div>
            </div>
            <div className="text-center text-xs text-muted-foreground py-0.5">&darr; WebSocket</div>
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded p-3 text-center">
              <div className="font-semibold text-sm">원격 프록시</div>
              <div className="text-xs text-muted-foreground"><code className="bg-muted px-1 py-0.5 rounded">wss://server.example.com:8443</code></div>
            </div>
            <div className="text-center text-xs text-muted-foreground py-0.5">&darr; IPC</div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-3 text-center">
              <div className="font-semibold text-sm">원격 claw-code 프로세스</div>
            </div>
            <div className="text-center text-xs text-muted-foreground py-0.5">&darr; stdio</div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-3 text-center">
              <div className="font-semibold text-sm">MCP 서버 / 플러그인 / 파일 시스템</div>
              <div className="text-xs text-muted-foreground">(원격)</div>
            </div>
          </div>
        </div>
        <p>
          <strong>3계층 구조</strong>: 로컬 CLI → 원격 프록시 → 원격 claw-code<br />
          WebSocket으로 양방향 통신 — 메시지, 스트리밍, 도구 호출 모두 투과<br />
          원격 claw-code는 자체 워크스페이스 보유 — 로컬과 독립
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">설정</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">remote</code> 설정 객체</div>
          <div className="space-y-2">
            <div className="bg-background border border-border rounded p-2.5 flex items-center gap-3">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-semibold shrink-0">enabled</code>
              <span className="text-sm"><code className="text-xs">true</code></span>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-center gap-3">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-semibold shrink-0">url</code>
              <span className="text-sm">WebSocket Secure 필수 &mdash; <code className="text-xs">wss://server.example.com:8443</code></span>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-center gap-3">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-semibold shrink-0">auth_token</code>
              <span className="text-sm">Bearer 토큰 &mdash; 서버 인증</span>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-center gap-3">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-semibold shrink-0">reconnect_on_disconnect</code>
              <span className="text-sm"><code className="text-xs">true</code> &mdash; 끊김 시 자동 재연결</span>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-center gap-3">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-semibold shrink-0">heartbeat_interval_ms</code>
              <span className="text-sm"><code className="text-xs">30000</code> &mdash; 30초마다 ping</span>
            </div>
          </div>
        </div>
        <p>
          <strong>주요 필드</strong>:<br />
          - <code>url</code>: WebSocket Secure 필수 (암호화)<br />
          - <code>auth_token</code>: Bearer 토큰 — 서버 인증<br />
          - <code>heartbeat_interval_ms</code>: 30초마다 ping
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RemoteProxy 구현</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">RemoteProxy</code> 구조체</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">ws</code>
              <div className="text-xs text-muted-foreground mt-0.5">WebSocket 스트림</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">pending_requests</code>
              <div className="text-xs text-muted-foreground mt-0.5">요청 ID &rarr; 응답 채널</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">next_req_id</code>
              <div className="text-xs text-muted-foreground mt-0.5">원자적 요청 ID 생성기</div>
            </div>
          </div>
          <div className="font-semibold text-sm mb-2"><code className="text-xs bg-muted px-1 py-0.5 rounded">connect(config)</code> 흐름</div>
          <div className="space-y-2">
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">1</span>
              <div className="text-sm">WebSocket 연결 &mdash; <code className="text-xs bg-muted px-1 py-0.5 rounded">connect_async("{'{url}'}/session")</code></div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">2</span>
              <div className="text-sm">인증 메시지 전송 &mdash; <code className="text-xs bg-muted px-1 py-0.5 rounded">{`{"type":"auth","token":"..."}`}</code></div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">3</span>
              <div className="text-sm">인증 응답 확인 &mdash; 실패 시 에러 반환</div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">메시지 프로토콜</h3>
        <WsProtocolViz />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 not-prose">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">assistant_delta 예시</div>
            <div className="text-xs space-y-1">
              <div><code className="bg-muted px-1 py-0.5 rounded">type</code>: <code>"assistant_delta"</code></div>
              <div><code className="bg-muted px-1 py-0.5 rounded">id</code>: 요청 ID</div>
              <div><code className="bg-muted px-1 py-0.5 rounded">payload.delta.text</code>: 텍스트 청크</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">tool_event 예시</div>
            <div className="text-xs space-y-1">
              <div><code className="bg-muted px-1 py-0.5 rounded">type</code>: <code>"tool_event"</code></div>
              <div><code className="bg-muted px-1 py-0.5 rounded">payload.name</code>: 도구명 (e.g. <code>"bash"</code>)</div>
              <div><code className="bg-muted px-1 py-0.5 rounded">payload.status</code>: <code>"started"</code> | <code>"completed"</code></div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">스트리밍 투과</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">forward_stream_to_remote(proxy, stream)</code></div>
          <div className="space-y-2">
            <div className="bg-background border border-border rounded p-2.5">
              <div className="text-xs font-mono text-muted-foreground mb-1">요청 ID 생성</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">next_req_id.fetch_add(1, SeqCst)</code> &mdash; 원자적 증가</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <div className="text-xs font-mono text-muted-foreground mb-1">청크 전달 루프</div>
              <div className="text-sm">LLM 스트림에서 각 chunk 수신 즉시 <code className="text-xs bg-muted px-1 py-0.5 rounded">assistant_delta</code> 메시지로 WebSocket 전송</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <div className="text-xs font-mono text-muted-foreground mb-1">종료 시그널</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">assistant_complete</code> 메시지 전송 &mdash; 스트림 끝 알림</div>
            </div>
          </div>
        </div>
        <p>
          <strong>청크 단위 전달</strong>: LLM 응답 수신 즉시 로컬로 전송<br />
          로컬 CLI는 동일한 렌더링 경험 — 원격/로컬 차이 없음<br />
          WebSocket 지연(~20-100ms) 추가되지만 사용자 체감 거의 없음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">권한 Prompt 원격 처리</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3">권한 Prompt 왕복 흐름</div>
          <div className="space-y-2">
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded p-3">
              <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">원격 &rarr; 로컬: permission_prompt</div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                <div><code className="bg-muted px-1 py-0.5 rounded">type</code>: <code>"permission_prompt"</code></div>
                <div><code className="bg-muted px-1 py-0.5 rounded">id</code>: 요청 ID</div>
                <div><code className="bg-muted px-1 py-0.5 rounded">payload.message</code>: 실행할 명령</div>
                <div><code className="bg-muted px-1 py-0.5 rounded">payload.tool</code>: 도구명</div>
              </div>
            </div>
            <div className="text-center text-xs text-muted-foreground">로컬 CLI가 사용자에게 Y/N 물음</div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-3">
              <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">로컬 &rarr; 원격: permission_response</div>
              <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                <div><code className="bg-muted px-1 py-0.5 rounded">type</code>: <code>"permission_response"</code></div>
                <div><code className="bg-muted px-1 py-0.5 rounded">payload.answer</code>: <code>"yes"</code> | <code>"no"</code></div>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">타임아웃 60초 &mdash; 초과 시 "no" 응답 취급 (안전 편향)</div>
        </div>
        <p>
          <strong>Prompt는 로컬 사용자에게 위임</strong>: 원격 서버가 직접 물을 수 없음<br />
          WebSocket 양방향 통신으로 왕복 — 타임아웃 60초<br />
          타임아웃 초과 시 "no" 응답 취급 — 안전 편향
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">재연결 로직</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">run_with_reconnect()</code> &mdash; 지수 백오프</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-3">
              <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">정상 종료</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">Ok(())</code> &rarr; 루프 탈출</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-3">
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">끊김 + 자동 재연결</div>
              <div className="text-sm">백오프 대기 후 재연결 시도<br/>성공 시 백오프 리셋 (1s)<br/>실패 시 2배 증가 (max 60s)</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded p-3">
              <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">끊김 + 재연결 비활성</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">return Err(e)</code> &mdash; 즉시 종료</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">세션 상태는 원격에 보존 &mdash; 재연결해도 이전 대화 이어감</div>
        </div>
        <p>
          <strong>지수 백오프</strong>: 1s → 2s → 4s → ... → 60s<br />
          재연결 성공 시 백오프 리셋 — 다음 끊김에 빠르게 대응<br />
          <strong>세션 상태는 원격에 보존</strong> — 재연결해도 이전 대화 이어감
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 원격 세션의 활용 시나리오</p>
          <p>
            1. <strong>리소스 격리</strong>: 대규모 프로젝트를 서버에서 실행 (로컬 노트북은 가벼움 유지)<br />
            2. <strong>지속 실행</strong>: 로컬 꺼도 서버는 계속 작동 — 오래 걸리는 작업<br />
            3. <strong>팀 공유</strong>: 한 서버 세션을 여러 팀원이 관찰 (read-only 모드)<br />
            4. <strong>보안</strong>: 민감 코드는 서버에만 두고 로컬에 다운로드 안 함
          </p>
          <p className="mt-2">
            <strong>주의사항</strong>:<br />
            - 원격 서버는 <strong>trusted environment</strong>여야 함<br />
            - 네트워크 끊김 = 권한 Prompt 응답 불가 → 도구 실행 대기<br />
            - WebSocket 대역폭 제한 시 LLM 스트리밍 지연
          </p>
          <p className="mt-2">
            claw-code 원격 세션은 <strong>"로컬 경험 + 서버 파워"</strong> 조합<br />
            기존 tmux/ssh 방식 대비: 권한 관리, 로그 표시 등 UI 품질 우수
          </p>
        </div>

      </div>
    </section>
  );
}
