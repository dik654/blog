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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`PKCE(Proof Key for Code Exchange):
  OAuth 2.0 확장, 클라이언트 시크릿 없이 인증

흐름:
  1. 클라이언트가 code_verifier 생성 (랜덤 문자열)
  2. code_challenge = SHA256(code_verifier)를 인증 서버에 전송
  3. 사용자 인증 후 code 받음
  4. code_verifier 원본을 인증 서버에 전송하여 토큰 받음
  5. 서버는 SHA256(code_verifier) == code_challenge 검증

장점: 중간 탈취된 code로 토큰 획득 불가 (code_verifier 모름)`}</pre>
        <p>
          <strong>PKCE의 보안 가치</strong>: CLI 같은 <strong>public client</strong>에서 시크릿 관리 불필요<br />
          웹 브라우저로 인증 리다이렉트 후, code 탈취되더라도 공격자는 code_verifier 모름<br />
          모바일·데스크톱 앱 인증의 표준
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">OAuth 흐름 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct OAuthFlow {
    client_id: String,
    redirect_uri: Url,  // http://localhost:{port}/callback
    auth_endpoint: Url, // https://claude.ai/oauth/authorize
    token_endpoint: Url,// https://console.anthropic.com/oauth/token
}

impl OAuthFlow {
    pub async fn authenticate(&self) -> Result<TokenSet> {
        // 1) PKCE 생성
        let code_verifier = generate_random_string(64);  // 64자 랜덤
        let code_challenge = base64_url_encode(
            sha256::digest(&code_verifier).as_bytes()
        );

        // 2) 로컬 콜백 서버 시작
        let (port, rx) = start_callback_server().await?;

        // 3) 인증 URL 조립
        let auth_url = build_auth_url(
            &self.auth_endpoint,
            &self.client_id,
            &format!("{}:{}/callback", "http://localhost", port),
            &code_challenge,
        );

        // 4) 브라우저 열기
        open::that(&auth_url)?;
        println!("브라우저에서 인증하세요: {}", auth_url);

        // 5) 콜백 대기 (타임아웃 5분)
        let auth_code = tokio::time::timeout(
            Duration::from_secs(300), rx,
        ).await??;

        // 6) 토큰 교환
        let tokens = self.exchange_code(&auth_code, &code_verifier).await?;

        Ok(tokens)
    }
}`}</pre>
        <p>
          <strong>6단계 흐름</strong>: PKCE 생성 → 콜백 서버 → URL 조립 → 브라우저 → 콜백 수신 → 토큰 교환<br />
          콜백 서버는 <strong>임시 HTTP 서버</strong> — <code>localhost:임의포트/callback</code><br />
          OS 기본 브라우저 자동 오픈 (<code>open</code> crate)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">콜백 서버 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn start_callback_server() -> Result<(u16, oneshot::Receiver<String>)> {
    let listener = TcpListener::bind("127.0.0.1:0").await?;  // 0: OS 선택 포트
    let port = listener.local_addr()?.port();

    let (tx, rx) = oneshot::channel();

    tokio::spawn(async move {
        let (mut stream, _) = listener.accept().await.unwrap();

        // HTTP 요청 읽기
        let mut buf = [0u8; 4096];
        let n = stream.read(&mut buf).await.unwrap();
        let req = String::from_utf8_lossy(&buf[..n]);

        // GET /callback?code=XXX&state=YYY 파싱
        let code = parse_query_param(&req, "code").unwrap_or_default();

        // HTTP 응답 (사용자에게 "탭 닫아도 됨" 안내)
        let html = "<html><body><h1>인증 완료</h1><p>탭을 닫으셔도 됩니다.</p></body></html>";
        let response = format!(
            "HTTP/1.1 200 OK\\r\\nContent-Type: text/html\\r\\nContent-Length: {}\\r\\n\\r\\n{}",
            html.len(), html
        );
        stream.write_all(response.as_bytes()).await.unwrap();

        // code 전달
        let _ = tx.send(code);
    });

    Ok((port, rx))
}`}</pre>
        <p>
          <strong>임시 HTTP 서버</strong>: 포트 0으로 바인딩 → OS가 할당<br />
          단일 요청만 처리 — code 받으면 종료<br />
          응답 HTML로 사용자에게 "탭 닫아도 됨" 안내
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 교환</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl OAuthFlow {
    async fn exchange_code(&self, code: &str, verifier: &str) -> Result<TokenSet> {
        let client = reqwest::Client::new();
        let resp = client.post(&self.token_endpoint)
            .form(&[
                ("grant_type", "authorization_code"),
                ("code", code),
                ("client_id", &self.client_id),
                ("redirect_uri", &self.redirect_uri.to_string()),
                ("code_verifier", verifier),  // PKCE 검증용
            ])
            .send()
            .await?;

        let token_resp: TokenResponse = resp.json().await?;
        Ok(TokenSet {
            access_token: token_resp.access_token,
            refresh_token: token_resp.refresh_token,
            expires_at: Utc::now() + Duration::seconds(token_resp.expires_in),
        })
    }
}`}</pre>
        <p>
          <strong>form-encoded POST</strong>: OAuth 2.0 표준<br />
          <code>grant_type: authorization_code</code>: 표준 플로우<br />
          <code>code_verifier</code>: PKCE 검증 값 — 서버가 SHA256 후 원본 challenge와 비교
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 저장 — TokenStore</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct TokenStore {
    path: PathBuf,  // ~/.claw/tokens.json
}

impl TokenStore {
    pub async fn save(&self, tokens: &TokenSet) -> Result<()> {
        let json = serde_json::to_vec(tokens)?;
        tokio::fs::write(&self.path, &json).await?;
        // 권한 600 (rw-------)
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let perm = std::fs::Permissions::from_mode(0o600);
            std::fs::set_permissions(&self.path, perm)?;
        }
        Ok(())
    }

    pub async fn load(&self) -> Result<Option<TokenSet>> {
        if !self.path.exists() { return Ok(None); }
        let text = tokio::fs::read_to_string(&self.path).await?;
        Ok(Some(serde_json::from_str(&text)?))
    }
}`}</pre>
        <p>
          <strong>저장 경로</strong>: <code>~/.claw/tokens.json</code><br />
          <strong>파일 권한 600</strong>: 소유자만 읽기/쓰기 — 다른 사용자 접근 차단<br />
          keyring(OS 키체인) 통합은 로드맵 — 더 강한 격리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 갱신 — refresh_token 사용</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl OAuthFlow {
    pub async fn refresh(&self, refresh_token: &str) -> Result<TokenSet> {
        let resp = reqwest::Client::new()
            .post(&self.token_endpoint)
            .form(&[
                ("grant_type", "refresh_token"),
                ("refresh_token", refresh_token),
                ("client_id", &self.client_id),
            ])
            .send()
            .await?;

        let token: TokenResponse = resp.json().await?;
        Ok(TokenSet::from(token))
    }
}

// 자동 갱신: access_token 만료 5분 전에 백그라운드 갱신
async fn auto_refresh_loop(store: Arc<TokenStore>) {
    loop {
        if let Ok(Some(tokens)) = store.load().await {
            let expires_in = tokens.expires_at - Utc::now();
            if expires_in < Duration::minutes(5) {
                // 갱신
                let new_tokens = flow.refresh(&tokens.refresh_token).await?;
                store.save(&new_tokens).await?;
            }
        }
        tokio::time::sleep(Duration::from_secs(60)).await;
    }
}`}</pre>
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
