import LifecycleViz from './viz/LifecycleViz';

export default function Lifecycle() {
  return (
    <section id="lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PluginLifecycle — 상태 &amp; 헬스체크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <LifecycleViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">PluginLifecycle 상태 머신</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum PluginLifecycle {
    Discovered,    // 매니페스트 발견
    Loaded,        // 매니페스트 파싱 완료
    Validated,     // 해시·권한 검증 완료
    Enabled,       // 활성화됨, 호출 대기
    Disabled,      // 비활성화
    Failed,        // 오류 상태
}

// 전이:
// Discovered → Loaded → Validated → Enabled ⇄ Disabled
//                              ↘ Failed
//                                      ↓
//                                   Disabled`}</pre>
        <p>
          <strong>6단계 상태</strong>: Discovered → Loaded → Validated → Enabled ⇄ Disabled<br />
          각 단계는 조건 충족 시에만 다음으로 전이 — 불완전한 플러그인은 Failed<br />
          Failed 상태는 재시도 시점까지 유지 — 자동 재시도 없음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">헬스체크 메커니즘</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl Plugin {
    pub async fn health_check(&self) -> HealthStatus {
        // 1) entrypoint 파일 존재 확인
        let entrypoint = self.plugin_dir.join(&self.manifest.entrypoint);
        if !entrypoint.is_file() {
            return HealthStatus::Unhealthy("entrypoint missing".into());
        }

        // 2) 실행 권한 확인
        #[cfg(unix)] {
            use std::os::unix::fs::PermissionsExt;
            let perm = std::fs::metadata(&entrypoint).ok()?.permissions();
            if perm.mode() & 0o111 == 0 {
                return HealthStatus::Unhealthy("not executable".into());
            }
        }

        // 3) --health-check 인자로 호출
        let output = tokio::process::Command::new(&entrypoint)
            .arg("--health-check")
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .and_then(|c| tokio::time::timeout(
                Duration::from_secs(5),
                c.wait_with_output(),
            )).await;

        match output {
            Ok(Ok(Ok(out))) if out.status.success() => HealthStatus::Healthy,
            _ => HealthStatus::Unhealthy("health check failed".into()),
        }
    }
}`}</pre>
        <p>
          <strong>3단계 헬스체크</strong>: 파일 존재 → 실행 권한 → <code>--health-check</code> 응답<br />
          플러그인은 <code>--health-check</code> 플래그 지원 권장 — exit 0이면 건강<br />
          5초 타임아웃 — 헬스체크가 오래 걸리면 실패 취급
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주기적 헬스체크</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// PluginRegistry 내부 백그라운드 태스크
async fn health_check_loop(&self) {
    loop {
        tokio::time::sleep(Duration::from_secs(300)).await;  // 5분 주기

        for (name, plugin) in self.plugins.iter() {
            if !plugin.enabled { continue; }

            let status = plugin.health_check().await;
            match status {
                HealthStatus::Unhealthy(reason) => {
                    log::warn!("plugin {} unhealthy: {}", name, reason);
                    // 자동 비활성화 (선택)
                    if self.config.auto_disable_unhealthy {
                        self.disable(name).ok();
                    }
                }
                HealthStatus::Healthy => {}
            }
        }
    }
}`}</pre>
        <p>
          <strong>5분 주기 체크</strong>: 너무 빈번하면 CPU 낭비, 너무 느리면 장애 감지 지연<br />
          Unhealthy 감지 시 자동 비활성화(<code>auto_disable_unhealthy</code> 옵션)<br />
          사용자 알림: UI 토스트 또는 다음 호출 시 에러 표시
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 복구 — retry_failed()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PluginRegistry {
    pub async fn retry_failed(&mut self) -> Vec<String> {
        let failed_names: Vec<_> = self.plugins.iter()
            .filter(|(_, p)| p.lifecycle == PluginLifecycle::Failed)
            .map(|(n, _)| n.clone())
            .collect();

        let mut recovered = Vec::new();
        for name in failed_names {
            // 매니페스트 재로드 시도
            let plugin = &self.plugins[&name];
            match Self::load_from_dir(&plugin.plugin_dir) {
                Ok(manifest) => {
                    // 검증 재시도
                    if let Ok(()) = self.enable(&name).await {
                        recovered.push(name);
                    }
                }
                Err(e) => log::warn!("retry failed for {}: {}", name, e),
            }
        }
        recovered
    }
}`}</pre>
        <p>
          <strong>수동 재시도</strong>: 사용자가 <code>/plugin retry</code> 명령 호출<br />
          실패 원인이 해결됐으면 성공 — 예: 누락됐던 실행 파일 복원 후<br />
          재시도 성공한 플러그인 이름을 사용자에게 알림
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">플러그인 업데이트 감지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 플러그인 디렉토리 파일 수정 감지
async fn watch_plugin_updates(&self) {
    use notify::{Watcher, RecursiveMode};

    let (tx, rx) = tokio::sync::mpsc::channel(100);
    let mut watcher = notify::recommended_watcher(move |res| {
        let _ = tx.blocking_send(res);
    })?;

    for path in &self.search_paths {
        watcher.watch(path, RecursiveMode::Recursive)?;
    }

    while let Some(event) = rx.recv().await {
        if let Ok(ev) = event {
            // 매니페스트 변경 감지 → 재로드
            for path in ev.paths {
                if path.file_name() == Some(OsStr::new("plugin-manifest.json")) {
                    log::info!("manifest changed: {:?}", path);
                    self.reload_plugin_at(&path).await.ok();
                }
            }
        }
    }
}`}</pre>
        <p>
          <code>notify</code> crate로 파일시스템 이벤트 감지<br />
          매니페스트 변경 시 자동 재로드 — 재시작 없이 플러그인 업데이트<br />
          활성 플러그인이 업데이트된 경우: 현재 호출 완료 후 새 버전 적용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">플러그인 통계 수집</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct PluginStats {
    pub total_calls: u64,
    pub success_count: u64,
    pub failure_count: u64,
    pub total_duration_ms: u64,
    pub last_error: Option<String>,
}

impl PluginStats {
    pub fn avg_duration_ms(&self) -> f64 {
        if self.total_calls == 0 { return 0.0; }
        self.total_duration_ms as f64 / self.total_calls as f64
    }

    pub fn success_rate(&self) -> f64 {
        if self.total_calls == 0 { return 1.0; }
        self.success_count as f64 / self.total_calls as f64
    }
}`}</pre>
        <p>
          <strong>통계 기반 관리</strong>: 사용 빈도·실패율·평균 응답 시간 추적<br />
          실패율 &gt; 10%인 플러그인: UI에 경고 표시<br />
          평균 응답 시간 &gt; 5초: 성능 저하 경고
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 플러그인 생명주기 관리의 철학</p>
          <p>
            claw-code는 플러그인을 <strong>"일등 시민"이 아닌 "확장 메커니즘"</strong>으로 취급<br />
            이 관점이 생명주기 설계에 반영됨:
          </p>
          <p className="mt-2">
            - <strong>자동 활성화 없음</strong>: 사용자 명시 승인 필수<br />
            - <strong>자동 복구 없음</strong>: Failed 상태는 수동 재시도<br />
            - <strong>모니터링 있음</strong>: 헬스체크로 문제 감지<br />
            - <strong>자동 비활성화</strong>: 문제 감지 시 안전하게 격리
          </p>
          <p className="mt-2">
            핵심 원칙: <strong>"문제 있는 플러그인은 빨리 감지하되, 자동 복구는 하지 않는다"</strong><br />
            자동 복구가 또 다른 장애를 유발할 수 있기 때문<br />
            사용자가 문제를 인지하고 직접 해결 — 예측 가능성 우선
          </p>
        </div>

      </div>
    </section>
  );
}
