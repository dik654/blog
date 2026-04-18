import RegistryViz from './viz/RegistryViz';

export default function Registry() {
  return (
    <section id="registry" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PluginRegistry — 발견·등록·활성화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RegistryViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">플러그인 발견 경로</h3>
        <div className="not-prose my-4 space-y-2">
          <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-lg p-3">
            <span className="text-xs font-bold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">3순위</span>
            <div>
              <code className="text-sm">/etc/claw/plugins/</code>
              <span className="text-sm text-muted-foreground ml-2">시스템 전역 (관리자 설치)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-lg p-3">
            <span className="text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">2순위</span>
            <div>
              <code className="text-sm">~/.claw/plugins/</code>
              <span className="text-sm text-muted-foreground ml-2">사용자 홈 (개인 설치)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-lg p-3">
            <span className="text-xs font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">1순위</span>
            <div>
              <code className="text-sm">&lt;workspace&gt;/.claw/plugins/</code>
              <span className="text-sm text-muted-foreground ml-2">프로젝트 로컬 (팀 공유)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/30 border border-dashed border-border rounded-lg p-3">
            <span className="text-xs font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded">추가</span>
            <div>
              <span className="text-sm text-muted-foreground">settings.json의 <code className="text-xs bg-muted px-1 py-0.5 rounded">plugin_paths</code> 배열로 커스텀 경로 지정</span>
            </div>
          </div>
        </div>
        <p>
          같은 이름의 플러그인이 여러 경로에 있으면 프로젝트 로컬이 우선<br />
          팀 협업 시: 프로젝트 로컬 경로에 커밋된 플러그인을 팀 전체가 공유
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PluginRegistry 구조</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-950/30 px-4 py-2 border-b border-border text-sm font-semibold">PluginRegistry</div>
            <div className="p-4 space-y-2 text-sm">
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">plugins</code>: <code className="text-xs">HashMap&lt;String, Plugin&gt;</code> — name으로 조회</div>
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">search_paths</code>: <code className="text-xs">Vec&lt;PathBuf&gt;</code> — 검색 경로 목록</div>
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">trusted_plugins</code>: <code className="text-xs">HashSet&lt;String&gt;</code> — 이름 기반 신뢰 리스트</div>
            </div>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-green-50 dark:bg-green-950/30 px-4 py-2 border-b border-border text-sm font-semibold">Plugin</div>
            <div className="p-4 space-y-2 text-sm">
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">manifest</code>: <code className="text-xs">PluginManifest</code> — 파싱된 매니페스트</div>
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">plugin_dir</code>: <code className="text-xs">PathBuf</code> — 플러그인 루트 디렉토리</div>
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">enabled</code>: <code className="text-xs">bool</code> — 활성화 상태</div>
              <div><code className="text-xs bg-muted px-1 py-0.5 rounded">last_used</code>: <code className="text-xs">Option&lt;DateTime&lt;Utc&gt;&gt;</code> — 마지막 사용 시간</div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">discover() — 전체 경로 스캔</h3>
        <p>
          <code>discover()</code>는 <code>search_paths</code> 전체를 순회하며 플러그인을 발견.
        </p>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">discover() 스캔 절차</div>
          <div className="p-4 space-y-2">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">search_paths</code> 순회 — 디렉토리가 아니면 스킵</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">2</span>
              <p className="text-sm">각 <strong>서브디렉토리</strong>를 <code className="text-xs bg-muted px-1 py-0.5 rounded">read_dir</code>로 순회</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">3</span>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">plugin-manifest.json</code> 존재 확인 — 없으면 플러그인 아닌 디렉토리로 간주</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">4</span>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">load_from_dir</code> 성공 시 <code className="text-xs bg-muted px-1 py-0.5 rounded">try_register</code> 호출, 실패 시 로그 + 스킵</p>
            </div>
          </div>
        </div>
        <p>
          로드 실패한 플러그인은 로그 + 스킵 — 전체 시스템 중단 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">try_register() — 등록 시도</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">try_register() 3단계</div>
          <div className="p-4 space-y-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">1. 이름 충돌 확인</div>
              <p className="text-sm text-muted-foreground">
                같은 이름 플러그인 존재 시 <code className="text-xs bg-muted px-1 py-0.5 rounded">Version::parse</code>로 semver 비교 — 더 높은 버전이 교체. 낮으면 기존 유지.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">2. 도구 이름 충돌 (ToolProvider만)</div>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">has_tool_name_conflict</code>로 빌트인 40개 + 다른 플러그인 도구명과 중복 검사 — 충돌 시 에러
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">3. HashMap 등록</div>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">plugins.insert(name, Plugin {"{"} ... {"}"})</code> — trusted_plugins 리스트에 있으면 <code className="text-xs bg-muted px-1 py-0.5 rounded">enabled: true</code>
              </p>
            </div>
          </div>
        </div>
        <p>
          semver 비교: <code>0.2.1</code> vs <code>0.3.0</code> → 0.3.0 승리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">신뢰 기반 자동 활성화</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">settings.json — trusted_plugins</div>
          <div className="p-4">
            <p className="text-sm mb-3">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">is_trusted(name)</code>: <code className="text-xs">trusted_plugins.contains(name)</code>로 이름 기반 판별
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                company-linter
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                project-context
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                그 외 → 비활성
              </span>
            </div>
          </div>
        </div>
        <p>
          <strong>opt-in 모델</strong>: 기본적으로 모든 플러그인 비활성<br />
          신규 플러그인 설치 시: 발견됨 → 목록 표시 → 사용자 승인 → 리스트 추가 → 활성화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">활성화 흐름 — enable()</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">enable() 3단계 활성화</div>
          <div className="p-4 space-y-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">1. 해시 검증</div>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">compute_plugin_hash</code>로 SHA-256 산출 후 매니페스트의 <code className="text-xs bg-muted px-1 py-0.5 rounded">sha256</code> 필드와 비교 — 불일치 시 에러
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">2. 권한 확인</div>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">required_mode &gt; current_mode()</code>이면 권한 부족 에러 — 플러그인이 현재 모드보다 상위 권한을 요구하면 거부
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">3. Kind별 레지스트리 등록</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                <div className="text-xs bg-muted/50 rounded p-2">
                  <div className="font-semibold mb-0.5">ToolProvider</div>
                  <span className="text-muted-foreground"><code className="text-xs">global_tool_registry()</code>에 도구 등록</span>
                </div>
                <div className="text-xs bg-muted/50 rounded p-2">
                  <div className="font-semibold mb-0.5">HookProvider</div>
                  <span className="text-muted-foreground"><code className="text-xs">global_hook_runner()</code>에 훅 등록</span>
                </div>
                <div className="text-xs bg-muted/50 rounded p-2">
                  <div className="font-semibold mb-0.5">ContextProvider</div>
                  <span className="text-muted-foreground"><code className="text-xs">global_context_provider()</code>에 등록</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          해시 검증: 매니페스트에 <code>sha256</code> 필드가 있으면 무결성 확인<br />
          Kind별 다른 레지스트리에 등록 — 도구는 tool_registry, 훅은 hook_runner
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">비활성화 &amp; 제거</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-2 border-b border-border text-sm font-semibold">disable(name)</div>
            <div className="p-4 text-sm space-y-1">
              <p>Kind별 레지스트리에서 <strong>등록 해제</strong></p>
              <p className="text-muted-foreground">예: <code className="text-xs bg-muted px-1 py-0.5 rounded">unregister_plugin_tool</code></p>
              <p><code className="text-xs bg-muted px-1 py-0.5 rounded">enabled = false</code></p>
              <p className="text-xs text-muted-foreground mt-2">플러그인 정보는 HashMap에 유지 — 재활성화 가능</p>
            </div>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-red-50 dark:bg-red-950/30 px-4 py-2 border-b border-border text-sm font-semibold">remove(name)</div>
            <div className="p-4 text-sm space-y-1">
              <p>내부적으로 <code className="text-xs bg-muted px-1 py-0.5 rounded">disable()</code> 호출 후</p>
              <p><code className="text-xs bg-muted px-1 py-0.5 rounded">plugins.remove(name)</code>으로 완전 삭제</p>
              <p className="text-xs text-muted-foreground mt-2">HashMap에서 제거 — 다시 쓰려면 재발견 필요</p>
            </div>
          </div>
        </div>
        <p>
          런타임 비활성화 가능 — 세션 재시작 없이 플러그인 추가/제거
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 옵트인 모델의 보안 가치</p>
          <p>
            플러그인이 <strong>발견되어도 자동 실행되지 않음</strong> — 사용자 명시 승인 필수<br />
            이 보수적 설계가 주는 이점:
          </p>
          <p className="mt-2">
            1. <strong>공격 면적 축소</strong>: 악의적 플러그인이 경로에 설치되어도 실행 안 됨<br />
            2. <strong>사용자 통제권</strong>: "어떤 플러그인이 활성화됐는지" 명확<br />
            3. <strong>업그레이드 투명성</strong>: 새 버전 도입 시 명시 승인 필요
          </p>
          <p className="mt-2">
            반대 극(opt-out): "플러그인 설치 = 자동 활성화"<br />
            - 편리하지만 악의적 패키지 공격에 취약<br />
            - "어디서 이상한 동작이 오는지" 추적 어려움
          </p>
          <p className="mt-2">
            claw-code의 선택: 편의성보다 안전성 — "한 번 승인, 영구 사용" 패턴으로 균형
          </p>
        </div>

      </div>
    </section>
  );
}
