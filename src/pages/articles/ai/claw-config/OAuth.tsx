import OAuthFlowViz from './viz/OAuthFlowViz';

export default function OAuth() {
  return (
    <section id="oauth" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OAuth 2.0 + PKCE 인증 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <OAuthFlowViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 OAuth인가</h3>
        <p>
          Claude Code·claw-code는 <strong>Claude.ai 계정 연동</strong> 지원<br />
          사용자는 API 키 없이 Claude.ai Pro/Team 구독으로 CLI 사용 가능<br />
          OAuth 2.0 Authorization Code Flow + PKCE 확장 — 보안 강화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PKCE란</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-1">PKCE (Proof Key for Code Exchange)</div>
          <div className="text-xs text-muted-foreground mb-3">OAuth 2.0 확장 — 클라이언트 시크릿 없이 인증</div>
          <div className="space-y-2">
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">1</span>
              <div className="text-sm">클라이언트가 <code className="text-xs bg-muted px-1 py-0.5 rounded">code_verifier</code> 생성 (랜덤 문자열)</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">2</span>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">code_challenge = SHA256(code_verifier)</code>를 인증 서버에 전송</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">3</span>
              <div className="text-sm">사용자 인증 후 <code className="text-xs bg-muted px-1 py-0.5 rounded">code</code> 수신</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">4</span>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">code_verifier</code> 원본을 서버에 전송하여 토큰 수신</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">5</span>
              <div className="text-sm">서버가 <code className="text-xs bg-muted px-1 py-0.5 rounded">SHA256(code_verifier) == code_challenge</code> 검증</div>
            </div>
          </div>
          <div className="mt-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-2.5">
            <div className="text-sm"><strong>장점</strong>: 중간 탈취된 code로 토큰 획득 불가 &mdash; 공격자는 <code className="text-xs bg-muted px-1 py-0.5 rounded">code_verifier</code>를 모름</div>
          </div>
        </div>
        <p>
          <strong>PKCE의 보안 가치</strong>: CLI 같은 <strong>public client</strong>에서 시크릿 관리 불필요<br />
          웹 브라우저로 인증 리다이렉트 후, code 탈취되더라도 공격자는 code_verifier 모름<br />
          모바일·데스크톱 앱 인증의 표준
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">OAuth 흐름 구현</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-1"><code className="text-xs bg-muted px-1 py-0.5 rounded">OAuthFlow</code> 구조체</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-background border border-border rounded p-2 text-xs">
              <code className="bg-muted px-1 py-0.5 rounded">client_id</code>
            </div>
            <div className="bg-background border border-border rounded p-2 text-xs">
              <code className="bg-muted px-1 py-0.5 rounded">redirect_uri</code> &mdash; <code>localhost:{'{port}'}/callback</code>
            </div>
            <div className="bg-background border border-border rounded p-2 text-xs">
              <code className="bg-muted px-1 py-0.5 rounded">auth_endpoint</code> &mdash; <code>claude.ai/oauth/authorize</code>
            </div>
            <div className="bg-background border border-border rounded p-2 text-xs">
              <code className="bg-muted px-1 py-0.5 rounded">token_endpoint</code> &mdash; <code>anthropic.com/oauth/token</code>
            </div>
          </div>
          <div className="font-semibold text-sm mb-2"><code className="text-xs bg-muted px-1 py-0.5 rounded">authenticate()</code> 6단계</div>
          <div className="space-y-2">
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">1</span>
              <div className="text-sm">PKCE 생성 &mdash; <code className="text-xs bg-muted px-1 py-0.5 rounded">generate_random_string(64)</code> &rarr; SHA256 &rarr; <code className="text-xs bg-muted px-1 py-0.5 rounded">code_challenge</code></div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">2</span>
              <div className="text-sm">로컬 콜백 서버 시작 &mdash; <code className="text-xs bg-muted px-1 py-0.5 rounded">start_callback_server()</code></div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">3</span>
              <div className="text-sm">인증 URL 조립 &mdash; <code className="text-xs bg-muted px-1 py-0.5 rounded">build_auth_url(endpoint, client_id, redirect, challenge)</code></div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">4</span>
              <div className="text-sm">OS 기본 브라우저 자동 오픈 &mdash; <code className="text-xs bg-muted px-1 py-0.5 rounded">open::that(auth_url)</code></div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">5</span>
              <div className="text-sm">콜백 대기 &mdash; 타임아웃 5분 (<code className="text-xs bg-muted px-1 py-0.5 rounded">Duration::from_secs(300)</code>)</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-start gap-2">
              <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">6</span>
              <div className="text-sm">토큰 교환 &mdash; <code className="text-xs bg-muted px-1 py-0.5 rounded">exchange_code(auth_code, code_verifier)</code></div>
            </div>
          </div>
        </div>
        <p>
          <strong>6단계 흐름</strong>: PKCE 생성 → 콜백 서버 → URL 조립 → 브라우저 → 콜백 수신 → 토큰 교환<br />
          콜백 서버는 <strong>임시 HTTP 서버</strong> — <code>localhost:임의포트/callback</code><br />
          OS 기본 브라우저 자동 오픈 (<code>open</code> crate)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">콜백 서버 구현</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">start_callback_server()</code> &mdash; 임시 HTTP 서버</div>
          <div className="space-y-2">
            <div className="bg-background border border-border rounded p-2.5">
              <div className="text-xs font-mono text-muted-foreground mb-1">바인딩</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">TcpListener::bind("127.0.0.1:0")</code> &mdash; 포트 0 = OS가 할당</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <div className="text-xs font-mono text-muted-foreground mb-1">채널 생성</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">oneshot::channel()</code> &mdash; code 전달용 일회성 채널</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <div className="text-xs font-mono text-muted-foreground mb-1">요청 처리</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">GET /callback?code=XXX&state=YYY</code> 파싱 &rarr; code 추출</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <div className="text-xs font-mono text-muted-foreground mb-1">응답</div>
              <div className="text-sm">HTML 응답으로 "인증 완료 &mdash; 탭을 닫으셔도 됩니다" 안내 &rarr; <code className="text-xs bg-muted px-1 py-0.5 rounded">tx.send(code)</code></div>
            </div>
          </div>
        </div>
        <p>
          <strong>임시 HTTP 서버</strong>: 포트 0으로 바인딩 → OS가 할당<br />
          단일 요청만 처리 — code 받으면 종료<br />
          응답 HTML로 사용자에게 "탭 닫아도 됨" 안내
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 교환</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">exchange_code(code, verifier)</code> &mdash; form-encoded POST</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-2.5">
              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">요청 파라미터</div>
              <ul className="text-xs space-y-1">
                <li><code className="bg-muted px-1 py-0.5 rounded">grant_type</code>: <code>"authorization_code"</code></li>
                <li><code className="bg-muted px-1 py-0.5 rounded">code</code>: 인증 코드</li>
                <li><code className="bg-muted px-1 py-0.5 rounded">client_id</code>: 클라이언트 ID</li>
                <li><code className="bg-muted px-1 py-0.5 rounded">redirect_uri</code>: 콜백 URL</li>
                <li><code className="bg-muted px-1 py-0.5 rounded">code_verifier</code>: PKCE 검증값</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-2.5">
              <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">응답 &rarr; TokenSet</div>
              <ul className="text-xs space-y-1">
                <li><code className="bg-muted px-1 py-0.5 rounded">access_token</code>: API 호출용</li>
                <li><code className="bg-muted px-1 py-0.5 rounded">refresh_token</code>: 갱신용</li>
                <li><code className="bg-muted px-1 py-0.5 rounded">expires_at</code>: <code>Utc::now() + expires_in</code></li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <strong>form-encoded POST</strong>: OAuth 2.0 표준<br />
          <code>grant_type: authorization_code</code>: 표준 플로우<br />
          <code>code_verifier</code>: PKCE 검증 값 — 서버가 SHA256 후 원본 challenge와 비교
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 저장 — TokenStore</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-1"><code className="text-xs bg-muted px-1 py-0.5 rounded">TokenStore</code></div>
          <div className="text-xs text-muted-foreground mb-3">경로: <code className="bg-muted px-1 py-0.5 rounded">~/.claw/tokens.json</code></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-semibold mb-1">save(tokens)</div>
              <ul className="text-sm space-y-1">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">serde_json::to_vec</code> &rarr; 파일 쓰기</li>
                <li>Unix: 권한 <code className="text-xs bg-muted px-1 py-0.5 rounded">0o600</code> (rw-------) 설정</li>
                <li className="text-xs text-muted-foreground">소유자만 읽기/쓰기 &mdash; 다른 사용자 접근 차단</li>
              </ul>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-semibold mb-1">load()</div>
              <ul className="text-sm space-y-1">
                <li>파일 없으면 <code className="text-xs bg-muted px-1 py-0.5 rounded">Ok(None)</code> 반환</li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">serde_json::from_str</code> &rarr; TokenSet</li>
                <li className="text-xs text-muted-foreground">keyring(OS 키체인) 통합은 로드맵</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <strong>저장 경로</strong>: <code>~/.claw/tokens.json</code><br />
          <strong>파일 권한 600</strong>: 소유자만 읽기/쓰기 — 다른 사용자 접근 차단<br />
          keyring(OS 키체인) 통합은 로드맵 — 더 강한 격리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 갱신 — refresh_token 사용</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-background border border-border rounded p-3">
              <div className="font-semibold text-sm mb-2"><code className="text-xs bg-muted px-1 py-0.5 rounded">refresh(refresh_token)</code></div>
              <ul className="text-sm space-y-1">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">grant_type: "refresh_token"</code></li>
                <li>토큰 엔드포인트에 POST 요청</li>
                <li>새 <code className="text-xs bg-muted px-1 py-0.5 rounded">TokenSet</code> 반환</li>
              </ul>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="font-semibold text-sm mb-2"><code className="text-xs bg-muted px-1 py-0.5 rounded">auto_refresh_loop(store)</code></div>
              <ul className="text-sm space-y-1">
                <li>60초마다 토큰 만료 시간 확인</li>
                <li>만료 5분 전 자동 갱신</li>
                <li>사용자 interrupt 없음</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-2.5 text-center">
              <div className="text-xs text-muted-foreground">access_token 수명</div>
              <div className="font-semibold text-sm">~1시간</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-2.5 text-center">
              <div className="text-xs text-muted-foreground">refresh_token 수명</div>
              <div className="font-semibold text-sm">~30일</div>
            </div>
          </div>
        </div>
        <p>
          <strong>access_token 수명</strong>: 보통 1시간<br />
          <strong>refresh_token 수명</strong>: 보통 30일 — 재로그인 불필요<br />
          <strong>자동 갱신</strong>: 만료 5분 전 백그라운드 갱신 — 사용자 interrupt 없음
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: API 키 vs OAuth 트레이드오프</p>
          <p>
            <strong>API 키</strong>:<br />
            ✓ 즉시 사용 가능 (브라우저 필요 없음)<br />
            ✓ CI/서버 환경 쉬움<br />
            ✗ 키 유출 시 전체 권한 노출<br />
            ✗ 권한 세분화 어려움
          </p>
          <p className="mt-2">
            <strong>OAuth</strong>:<br />
            ✓ 브라우저 기반 인증 — 2FA 활용 가능<br />
            ✓ 만료·갱신 메커니즘 내장<br />
            ✓ scope 지정 가능 (권한 제한)<br />
            ✗ CI 환경 어려움 (서비스 계정 필요)<br />
            ✗ 로컬 브라우저 필요
          </p>
          <p className="mt-2">
            claw-code는 <strong>둘 다 지원</strong>: 사용자가 환경 맞게 선택<br />
            - 개발자 로컬: OAuth (Claude.ai 계정 재사용)<br />
            - CI/서버: API 키 (환경 변수)
          </p>
        </div>

      </div>
    </section>
  );
}
