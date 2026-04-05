import GreenContractViz from './viz/GreenContractViz';

export default function GreenContract() {
  return (
    <section id="green-contract" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GreenContract — 빌드 품질 게이트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <GreenContractViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">GreenContract란</h3>
        <p>
          GreenContract: Lane 머지 전에 충족해야 할 <strong>품질 기준 정의</strong><br />
          "green"은 CI 파이프라인 전체 통과 상태 — 빌드·테스트·린트 모두 성공<br />
          머지 전 마지막 관문 — 잘못된 코드가 main에 들어가지 않게 방어
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GreenContract 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct GreenContract {
    pub build_required: bool,
    pub tests_required: bool,
    pub min_test_coverage: Option<f32>,
    pub lint_required: bool,
    pub max_lint_warnings: usize,
    pub custom_checks: Vec<CustomCheck>,
    pub consecutive_green_count: u32,  // 연속 green 요구
}

pub struct CustomCheck {
    pub name: String,
    pub command: String,
    pub timeout: Duration,
}`}</pre>
        <p>
          <strong>기본 검증 4가지</strong>: build, tests, coverage, lint<br />
          <code>custom_checks</code>: 팀별 추가 검증 (보안 스캔, 성능 벤치마크 등)<br />
          <code>consecutive_green_count</code>: flaky test 대응 — 연속 N회 green 요구
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">verify() — 계약 검증</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl GreenContract {
    pub async fn verify(&self, ctx: &LaneContext) -> VerifyResult {
        let mut failures = Vec::new();

        // 빌드 체크
        if self.build_required {
            match ctx.last_build_status {
                Some(BuildStatus::Green) => {},
                _ => failures.push("build not green".into()),
            }
        }

        // 테스트 체크
        if self.tests_required {
            match ctx.last_test_status {
                Some(TestStatus::Pass) => {},
                _ => failures.push("tests not passing".into()),
            }
        }

        // 커버리지 체크
        if let Some(min) = self.min_test_coverage {
            match ctx.test_coverage {
                Some(c) if c >= min => {},
                Some(c) => failures.push(format!("coverage {:.1}% < {:.1}%", c * 100.0, min * 100.0)),
                None    => failures.push("coverage unknown".into()),
            }
        }

        // 린트 체크
        if self.lint_required {
            match ctx.lint_warnings {
                Some(w) if w <= self.max_lint_warnings => {},
                Some(w) => failures.push(format!("{} lint warnings (max {})", w, self.max_lint_warnings)),
                None    => failures.push("lint result unknown".into()),
            }
        }

        // 커스텀 체크
        for check in &self.custom_checks {
            if let Err(e) = self.run_custom_check(check).await {
                failures.push(format!("custom check '{}': {}", check.name, e));
            }
        }

        if failures.is_empty() {
            VerifyResult::Pass
        } else {
            VerifyResult::Fail(failures)
        }
    }
}`}</pre>
        <p>
          <strong>누적 실패 리스트</strong>: 첫 실패에서 멈추지 않고 모든 실패 수집<br />
          사용자에게 "한 번에 모든 문제" 표시 — 여러 번 시도 불필요<br />
          LLM이 에러 목록 보고 한 번에 모두 수정 시도
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">consecutive green — flaky test 대응</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// consecutive_green_count: 2 요구 시
// 최근 2회 연속 green이어야 머지 가능

impl GreenContract {
    async fn verify_consecutive(&self, ctx: &LaneContext) -> bool {
        if self.consecutive_green_count <= 1 { return true; }

        let recent = ctx.recent_build_history.clone();
        if recent.len() < self.consecutive_green_count as usize {
            return false;
        }

        recent.iter()
            .take(self.consecutive_green_count as usize)
            .all(|b| b.status == BuildStatus::Green)
    }
}

// 시나리오: flaky test가 있는 프로젝트
// 1회 green → 재실행 시 실패 가능성 ↑
// 2회 연속 green → 신뢰도 높음
// 3회 연속 green → 거의 확실`}</pre>
        <p>
          <strong>flaky test 방어</strong>: 1회 통과로 판단 금지<br />
          2회 이상 연속 통과 요구 → 우연한 pass 배제<br />
          트레이드오프: 머지 속도 vs 안정성
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">커스텀 체크 실행</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl GreenContract {
    async fn run_custom_check(&self, check: &CustomCheck) -> Result<()> {
        let output = tokio::time::timeout(
            check.timeout,
            tokio::process::Command::new("/bin/sh")
                .arg("-c").arg(&check.command)
                .output(),
        ).await??;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(anyhow!("exit {:?}: {}", output.status.code(), stderr));
        }

        Ok(())
    }
}

// YAML 예시
custom_checks:
  - name: "security scan"
    command: "cargo audit --deny warnings"
    timeout: 60s
  - name: "no console.log"
    command: "! grep -rn 'console.log' src/"
    timeout: 5s`}</pre>
        <p>
          <strong>임의 셸 명령 지원</strong>: exit 0 = 통과, 비정상 exit = 실패<br />
          timeout 초과 시 실패 취급<br />
          단순 grep으로 "금지된 패턴 검출" 구현 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GreenContract 표시 UI</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Lane이 ReadyToMerge 상태일 때 terminal 출력
╭─ Lane #42: feat/add-auth ──╮
│ Status: ReadyToMerge        │
│                             │
│ GreenContract:              │
│ ✓ build:       green         │
│ ✓ tests:       pass (487/487)│
│ ✓ coverage:    84.2% ≥ 80%   │
│ ✓ lint:        0 warnings    │
│ ✓ security:    no issues     │
│ ✓ consecutive: 2/2 green     │
│                             │
│ Ready to merge!             │
╰─────────────────────────────╯`}</pre>
        <p>
          <strong>모든 체크 시각화</strong>: 통과 ✓ / 실패 ✗<br />
          사용자가 상태 한눈에 파악 — 무엇이 통과/실패했는지<br />
          실패 시 구체적 이유 표시 — "coverage 75% &lt; 80%"
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: "Green" 정의의 중요성</p>
          <p>
            팀마다 "green"의 의미가 다름:
          </p>
          <p className="mt-2">
            - <strong>작은 스타트업</strong>: build + tests만 — 빠른 iteration<br />
            - <strong>중간 규모</strong>: + lint + coverage — 품질 관리<br />
            - <strong>대기업</strong>: + security + performance + compliance — 규제 대응<br />
            - <strong>오픈소스</strong>: + multi-OS test + docs 검증 — 호환성
          </p>
          <p className="mt-2">
            GreenContract는 <strong>"우리 팀의 green 정의"</strong>를 명시<br />
            - 코드로 표현 → git 관리 가능<br />
            - 변경 이력 추적 가능<br />
            - 모든 팀원이 같은 기준 적용
          </p>
          <p className="mt-2">
            PolicyEngine과 결합 시 <strong>완전 자동화 파이프라인</strong>:<br />
            "green 조건 만족 시 자동 머지" → 사람이 버튼 누를 필요 없음<br />
            단, GreenContract가 너무 느슨하면 품질 저하 — 신중한 설계 필요
          </p>
        </div>

      </div>
    </section>
  );
}
