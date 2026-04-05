import RegistryViz from './viz/RegistryViz';

export default function Registry() {
  return (
    <section id="registry" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PluginRegistry — 발견·등록·활성화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RegistryViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">플러그인 발견 경로</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 기본 검색 경로 3가지
1. /etc/claw/plugins/              시스템 전역 (관리자 설치)
2. ~/.claw/plugins/                사용자 홈 (개인 설치)
3. <workspace>/.claw/plugins/      프로젝트 로컬 (팀 공유)

// settings.json으로 추가 경로 지정
{
  "plugin_paths": ["/opt/company/claw-plugins"]
}`}</pre>
        <p>
          <strong>우선순위</strong>: 프로젝트 로컬 &gt; 사용자 &gt; 시스템 전역<br />
          같은 이름의 플러그인이 여러 경로에 있으면 프로젝트 로컬이 우선<br />
          팀 협업 시: 프로젝트 로컬 경로에 커밋된 플러그인을 팀 전체가 공유
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PluginRegistry 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct PluginRegistry {
    plugins: HashMap<String, Plugin>,        // name → Plugin
    search_paths: Vec<PathBuf>,
    trusted_plugins: HashSet<String>,        // 이름 기반 신뢰 리스트
}

pub struct Plugin {
    manifest: PluginManifest,
    plugin_dir: PathBuf,      // 플러그인 루트 디렉토리
    enabled: bool,
    last_used: Option<DateTime<Utc>>,
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">discover() — 전체 경로 스캔</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PluginRegistry {
    pub async fn discover(&mut self) -> Result<()> {
        for search_path in &self.search_paths.clone() {
            if !search_path.is_dir() { continue; }

            // 각 서브디렉토리가 플러그인일 수 있음
            let mut entries = tokio::fs::read_dir(search_path).await?;
            while let Some(entry) = entries.next_entry().await? {
                let plugin_dir = entry.path();
                if !plugin_dir.is_dir() { continue; }

                // plugin-manifest.json 존재 확인
                if !plugin_dir.join("plugin-manifest.json").exists() {
                    continue;
                }

                // 매니페스트 로드 & 등록 시도
                match Self::load_from_dir(&plugin_dir) {
                    Ok(manifest) => self.try_register(plugin_dir, manifest)?,
                    Err(e) => log::warn!("skip plugin {:?}: {}", plugin_dir, e),
                }
            }
        }
        Ok(())
    }
}`}</pre>
        <p>
          <strong>디렉토리 스캔</strong>: 각 서브디렉토리에서 <code>plugin-manifest.json</code> 찾기<br />
          매니페스트 없는 디렉토리는 스킵 — 플러그인이 아닌 디렉토리 존중<br />
          로드 실패한 플러그인은 로그 + 스킵 — 전체 시스템 중단 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">try_register() — 등록 시도</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PluginRegistry {
    fn try_register(&mut self, plugin_dir: PathBuf, manifest: PluginManifest) -> Result<()> {
        let name = manifest.name.clone();

        // 1) 이름 충돌 확인
        if self.plugins.contains_key(&name) {
            let existing = &self.plugins[&name];
            // 버전 비교: 더 높은 버전 유지
            if Version::parse(&manifest.version)? > Version::parse(&existing.manifest.version)? {
                log::info!("replacing plugin {} (v{} → v{})",
                    name, existing.manifest.version, manifest.version);
            } else {
                return Ok(());  // 기존 것 유지
            }
        }

        // 2) 도구 이름 충돌 (빌트인 vs 다른 플러그인)
        if manifest.kind == PluginKind::ToolProvider {
            for tool in &manifest.tools {
                if self.has_tool_name_conflict(&tool.name) {
                    return Err(anyhow!(
                        "tool name conflict: {} (used by another plugin/builtin)",
                        tool.name
                    ));
                }
            }
        }

        // 3) 등록
        self.plugins.insert(name, Plugin {
            manifest,
            plugin_dir,
            enabled: self.is_trusted(&name),
            last_used: None,
        });
        Ok(())
    }
}`}</pre>
        <p>
          <strong>버전 우선 등록</strong>: 같은 이름 플러그인은 더 높은 버전이 이김<br />
          semver 비교: <code>0.2.1</code> vs <code>0.3.0</code> → 0.3.0 승리<br />
          도구 이름 충돌: 빌트인 40개 + 다른 플러그인 도구명과 중복 금지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">신뢰 기반 자동 활성화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// settings.json
{
  "trusted_plugins": [
    "company-linter",
    "project-context"
  ]
}

// PluginRegistry
impl PluginRegistry {
    fn is_trusted(&self, name: &str) -> bool {
        self.trusted_plugins.contains(name)
    }
}

// 신뢰 리스트에 있는 플러그인만 enabled=true로 자동 활성화
// 나머지는 사용자가 명시적으로 활성화 필요`}</pre>
        <p>
          <strong>opt-in 모델</strong>: 기본적으로 모든 플러그인 비활성<br />
          trusted_plugins 리스트 있는 것만 자동 활성화<br />
          신규 플러그인 설치 시: 발견됨 → 목록 표시 → 사용자 승인 → 리스트 추가 → 활성화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">활성화 흐름 — enable()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PluginRegistry {
    pub async fn enable(&mut self, name: &str) -> Result<()> {
        let plugin = self.plugins.get_mut(name)
            .ok_or(anyhow!("plugin not found: {}", name))?;

        // 1) 해시 검증 (매니페스트 + 실행파일)
        let hash = self.compute_plugin_hash(&plugin.plugin_dir).await?;
        if let Some(expected) = &plugin.manifest.sha256 {
            if &hash != expected {
                return Err(anyhow!("plugin hash mismatch"));
            }
        }

        // 2) 권한 확인
        if plugin.manifest.permissions.required_mode > current_mode() {
            return Err(anyhow!("insufficient permission"));
        }

        // 3) Kind별 등록
        match plugin.manifest.kind {
            PluginKind::ToolProvider => {
                for tool in &plugin.manifest.tools {
                    global_tool_registry().register_plugin_tool(name, tool.clone())?;
                }
            }
            PluginKind::HookProvider => {
                for hook in &plugin.manifest.hooks {
                    global_hook_runner().register_hook(hook.clone())?;
                }
            }
            PluginKind::ContextProvider => {
                // session_start에 context 주입 스케줄링
                global_context_provider().register(name, plugin.manifest.clone())?;
            }
        }

        plugin.enabled = true;
        Ok(())
    }
}`}</pre>
        <p>
          <strong>3단계 활성화</strong>: 해시 검증 → 권한 확인 → 레지스트리 등록<br />
          해시 검증: 매니페스트에 <code>sha256</code> 필드가 있으면 무결성 확인<br />
          Kind별 다른 레지스트리에 등록 — 도구는 tool_registry, 훅은 hook_runner
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">비활성화 &amp; 제거</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PluginRegistry {
    pub fn disable(&mut self, name: &str) -> Result<()> {
        let plugin = self.plugins.get_mut(name).ok_or(...)?;
        if !plugin.enabled { return Ok(()); }

        // Kind별 등록 해제
        match plugin.manifest.kind {
            PluginKind::ToolProvider => {
                for tool in &plugin.manifest.tools {
                    global_tool_registry().unregister_plugin_tool(&tool.name)?;
                }
            }
            // ...
        }

        plugin.enabled = false;
        Ok(())
    }

    pub fn remove(&mut self, name: &str) -> Result<()> {
        self.disable(name)?;
        self.plugins.remove(name);
        Ok(())
    }
}`}</pre>
        <p>
          <code>disable()</code>: 레지스트리에서 제거하되 플러그인 정보 유지<br />
          <code>remove()</code>: 완전 제거 — HashMap에서 삭제<br />
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
