import PolicyViz from './viz/PolicyViz';

export default function Policy() {
  return (
    <section id="policy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PermissionPolicy — 규칙 기반 판정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PolicyViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 규칙 기반 정책이 필요한가</h3>
        <p>
          3단계 모드만으로는 프로젝트별 요구사항 대응 불가<br />
          - "읽기는 허용하되 <code>.env</code> 파일은 제외"<br />
          - "bash는 허용하되 <code>rm</code>, <code>sudo</code>는 차단"<br />
          - "특정 디렉토리만 쓰기 허용"<br />
          이런 세밀 제어를 위해 <strong>PermissionPolicy</strong>가 규칙 리스트를 평가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PermissionPolicy 구조</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">PermissionPolicy</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <span><code className="text-xs bg-background px-1.5 py-0.5 rounded">rules: Vec&lt;Rule&gt;</code> — 순서대로 평가되는 규칙 리스트</span>
              <span><code className="text-xs bg-background px-1.5 py-0.5 rounded">default_action: Action</code> — 모든 규칙 불일치 시 기본값</span>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">Rule</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <span><code className="text-xs bg-background px-1.5 py-0.5 rounded">matcher: Matcher</code> — 이 규칙이 적용되는 조건</span>
              <span><code className="text-xs bg-background px-1.5 py-0.5 rounded">action: Action</code> — Allow | Deny | Prompt</span>
              <span><code className="text-xs bg-background px-1.5 py-0.5 rounded">reason: Option&lt;String&gt;</code> — 사용자에게 표시할 이유</span>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">Matcher 4종</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">Tool(String)</code>
                <p className="text-muted-foreground mt-1">도구 이름으로 매칭</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">ToolAndPath {'{'} tool, path_glob {'}'}</code>
                <p className="text-muted-foreground mt-1">도구 이름 + 경로 glob 동시 매칭</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">BashCommand(String)</code>
                <p className="text-muted-foreground mt-1">bash 명령 패턴 전용</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">Custom(Box&lt;dyn Fn&gt;)</code>
                <p className="text-muted-foreground mt-1">사용자 정의 클로저 조건</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>Matcher 4종</strong>: Tool(이름만), ToolAndPath(이름+경로), BashCommand(bash 전용), Custom(클로저)<br />
          각 Rule은 <code>matcher.is_match(ctx)</code>가 true일 때 <code>action</code> 반환<br />
          <code>default_action</code>: 어떤 규칙도 매칭 안 되면 이 값 — 기본값은 <code>Allow</code>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">규칙 평가 흐름</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2"><code className="text-xs bg-background px-1.5 py-0.5 rounded">evaluate()</code> — first-match 전략</div>
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <span className="bg-background rounded px-2 py-1 border border-border text-xs">규칙 리스트 순회</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-background rounded px-2 py-1 border border-border text-xs"><code>matcher.is_match(ctx)</code></span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-background rounded px-2 py-1 border border-border text-xs">첫 매칭 규칙의 action 반환</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-background rounded px-2 py-1 border border-border text-xs">불일치 시 default_action</span>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">Ctx 구조체 — 규칙 평가 컨텍스트</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded px-2 py-1.5 text-xs border border-border"><code>tool_name</code> — 도구 이름</div>
              <div className="bg-background rounded px-2 py-1.5 text-xs border border-border"><code>input</code> — 입력 JSON</div>
              <div className="bg-background rounded px-2 py-1.5 text-xs border border-border"><code>path</code> — 파일 경로</div>
              <div className="bg-background rounded px-2 py-1.5 text-xs border border-border"><code>command</code> — bash 명령</div>
              <div className="bg-background rounded px-2 py-1.5 text-xs border border-border"><code>session</code> — 세션 정보</div>
            </div>
          </div>
        </div>
        <p>
          <strong>first-match 전략</strong>: 첫 매칭 규칙이 최종 결정 — 순서 중요<br />
          규칙 순서: 위쪽이 우선, 아래쪽은 폴백 — "구체적 → 일반적" 순으로 배열<br />
          <code>Ctx</code> 구조체: 규칙 평가에 필요한 모든 정보 전달
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 규칙 예시 — settings.json</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-3">settings.json 규칙 배열 (위→아래 우선순위)</div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-red-600 font-semibold shrink-0">Deny</span>
              <div><code>write_file</code> + <code>.env*</code> — .env 파일은 수정 금지</div>
            </div>
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-red-600 font-semibold shrink-0">Deny</span>
              <div><code>read_file</code> + <code>**/*.pem</code> — 개인 키 파일 접근 금지</div>
            </div>
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-red-600 font-semibold shrink-0">Deny</span>
              <div><code>bash</code>: <code>rm -rf *</code> — 대량 삭제 금지</div>
            </div>
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-amber-600 font-semibold shrink-0">Prompt</span>
              <div><code>bash</code>: <code>sudo *</code> — sudo 확인 필요</div>
            </div>
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-amber-600 font-semibold shrink-0">Prompt</span>
              <div><code>bash</code> (전체) — 모든 bash는 확인</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3"><code className="bg-background px-1 py-0.5 rounded">"default": "allow"</code> — 어떤 규칙에도 매칭 안 되면 허용</p>
        </div>
        <p>
          <strong>규칙 배열 순서</strong>: 구체적 거부(.env, .pem) → 특정 패턴 거부(rm -rf) → 특정 패턴 확인(sudo) → 일반 확인(bash)<br />
          이 순서로 "특수 케이스는 먼저 차단, 일반 케이스는 나중에 확인"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Matcher 구현 — glob 매칭</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-background px-1.5 py-0.5 rounded">Matcher::is_match()</code> 구현</div>
          <div className="space-y-2">
            <div className="bg-background rounded px-3 py-2 border border-border text-xs">
              <div className="font-medium mb-1">Tool(name)</div>
              <p className="text-muted-foreground"><code>ctx.tool_name == name</code> — 도구 이름 단순 비교</p>
            </div>
            <div className="bg-background rounded px-3 py-2 border border-border text-xs">
              <div className="font-medium mb-1">ToolAndPath {'{'} tool, path_glob {'}'}</div>
              <p className="text-muted-foreground">도구 이름 일치 확인 후 <code>glob::Pattern::matches_path(path)</code>로 경로 glob 매칭</p>
            </div>
            <div className="bg-background rounded px-3 py-2 border border-border text-xs">
              <div className="font-medium mb-1">BashCommand(pattern)</div>
              <p className="text-muted-foreground">도구가 <code>bash</code>인지 확인 후 명령 문자열에 <code>glob::Pattern::matches()</code> 적용</p>
            </div>
            <div className="bg-background rounded px-3 py-2 border border-border text-xs">
              <div className="font-medium mb-1">Custom(f)</div>
              <p className="text-muted-foreground"><code>f(ctx)</code> — 사용자 정의 클로저 직접 호출</p>
            </div>
          </div>
        </div>
        <p>
          <strong>glob 라이브러리</strong>: <code>**/*.pem</code>, <code>.env*</code> 같은 쉘 스타일 패턴 지원<br />
          <code>matches_path()</code>: 경로 전체를 glob 패턴과 비교<br />
          BashCommand는 명령 문자열에 glob 적용 — <code>rm -rf *</code>는 <code>rm -rf</code>로 시작하는 모든 명령 매칭
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Policy 병합 — 전역 + 프로젝트 + 사용자</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-3">3단계 캐스케이드 (우선순위 오름차순)</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-muted-foreground font-mono shrink-0">1</span>
              <div>
                <code className="font-medium">/etc/claw/permissions.json</code>
                <span className="text-muted-foreground ml-2">시스템 전역 (가장 낮은 우선순위)</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-muted-foreground font-mono shrink-0">2</span>
              <div>
                <code className="font-medium">./.claw/permissions.json</code>
                <span className="text-muted-foreground ml-2">프로젝트 전용</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-muted-foreground font-mono shrink-0">3</span>
              <div>
                <code className="font-medium">~/.claw/permissions.json</code>
                <span className="text-muted-foreground ml-2">사용자 오버라이드 (가장 높은 우선순위)</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3"><code className="bg-background px-1 py-0.5 rounded">extend_from()</code>으로 새 규칙을 앞쪽에 추가 — 후행 계층이 먼저 평가</p>
        </div>
        <p>
          <strong>3단계 캐스케이드</strong>: global → project → user (우선순위 오름차순)<br />
          <code>extend_from()</code>: 새 규칙을 앞쪽에 추가 — 더 후행 계층이 앞서 평가<br />
          결과적으로 <strong>user &gt; project &gt; global</strong> 순으로 우선 적용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Policy 파싱 — TOML/JSON 지원</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">PolicyFile 직렬화 구조 (serde)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <div className="font-medium">PolicyFile</div>
                <p className="text-muted-foreground mt-1"><code>default: Action</code> + <code>rules: Vec&lt;RuleFile&gt;</code></p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <div className="font-medium">RuleFile</div>
                <p className="text-muted-foreground mt-1"><code>matcher</code> + <code>action</code> + <code>reason</code></p>
              </div>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2"><code className="text-xs bg-background px-1.5 py-0.5 rounded">load_policy()</code> — JSON/TOML 자동 감지</div>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="bg-background rounded px-2 py-1 border border-border">파일 읽기</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-background rounded px-2 py-1 border border-border">확장자가 <code>.toml</code>이면 <code>toml::from_str</code></span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-background rounded px-2 py-1 border border-border">나머지는 <code>serde_json::from_str</code></span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-background rounded px-2 py-1 border border-border"><code>into_policy()</code></span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">TOML은 주석 지원 — 팀 협업 시 규칙 이유 문서화 용이. <code>Custom</code> Matcher는 코드에서만 추가 가능</p>
          </div>
        </div>
        <p>
          <strong>파일 확장자로 포맷 감지</strong>: .toml은 toml crate, 나머지는 serde_json<br />
          TOML은 주석 지원 — 팀 협업 시 규칙 이유 문서화 용이<br />
          <code>Custom</code> Matcher는 JSON/TOML로 표현 불가 — 코드에서만 추가 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 선언적 정책 vs 명령형 훅</p>
          <p>
            <strong>정책(선언적)</strong>: JSON/TOML로 규칙만 기술<br />
            - 장점: 코드 불필요, 비개발자도 수정 가능, 감사(audit) 쉬움<br />
            - 단점: 표현력 한계 — 복잡한 조건(시간대별, 세션 이력 기반)은 불가
          </p>
          <p className="mt-2">
            <strong>훅(명령형)</strong>: 임의 스크립트 실행<br />
            - 장점: 표현력 무제한 — DB 조회, 네트워크 호출, 복합 판정<br />
            - 단점: 실행 시간 비용, 스크립트 유지보수 필요
          </p>
          <p className="mt-2">
            claw-code는 <strong>Policy는 99% 케이스 커버, Hook은 1% 고급 케이스</strong> 담당<br />
            대부분의 사용자는 JSON 몇 줄로 보안 요구사항 충족 — 훅까지 갈 필요 없음
          </p>
        </div>

      </div>
    </section>
  );
}
