import TrustDecisionViz from './viz/TrustDecisionViz';
import RiskSignalsFlagsViz from './viz/RiskSignalsFlagsViz';

export default function TrustResolver() {
  return (
    <section id="trust-resolver" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TrustResolver — 경로 기반 신뢰 판정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TrustDecisionViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">신뢰 판정이 필요한 이유</h3>
        <p>
          Worker는 <strong>임의의 워크스페이스</strong>에서 실행 — 신뢰할 수 없는 코드·설정 포함 가능<br />
          해당 워크스페이스의 CLAUDE.md, .claw/, hooks 등이 claw-code 동작을 좌우<br />
          악의적 설정이 있으면 Worker가 엉뚱한 동작 — 따라서 <strong>실행 전 신뢰 판정</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TrustDecision 구조</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="font-semibold text-sm text-green-700 dark:text-green-400"><code>FullyTrusted</code></div>
            <div className="text-xs text-muted-foreground mt-1">완전 신뢰 — 모든 설정 적용</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="font-semibold text-sm text-amber-700 dark:text-amber-400"><code>Restricted(Vec&lt;TrustFlag&gt;)</code></div>
            <div className="text-xs text-muted-foreground mt-1">부분 신뢰 — 특정 기능만 제한</div>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="font-semibold text-sm text-red-700 dark:text-red-400"><code>Untrusted(String)</code></div>
            <div className="text-xs text-muted-foreground mt-1">불신 — 실행 차단</div>
          </div>
        </div>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>TrustFlag</code> — Restricted 시 적용 가능한 제한</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0">NoHooks</code>
              <span className="text-xs text-muted-foreground">훅 실행 금지</span>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0">NoSlashCmds</code>
              <span className="text-xs text-muted-foreground">커스텀 슬래시 명령 금지</span>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0">NoMcpServers</code>
              <span className="text-xs text-muted-foreground">MCP 서버 시작 금지</span>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0">NoAutoRun</code>
              <span className="text-xs text-muted-foreground">자동 실행 비활성</span>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0">ReadOnlyFs</code>
              <span className="text-xs text-muted-foreground">파일 시스템 읽기 전용</span>
            </div>
          </div>
        </div>
        <p>
          <strong>3단계 신뢰 수준</strong>: Fully → Restricted → Untrusted<br />
          Restricted는 가장 흔한 판정 — 완전 신뢰하기 어려운 외부 프로젝트<br />
          TrustFlag로 세밀 제한 — 훅만 금지, MCP만 금지 등
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">판정 기준 — 5개 검사</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>TrustResolver::resolve(workspace: &Path)</code></div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-950/30 border-l-2 border-green-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-green-600 dark:text-green-400 shrink-0">1</span>
              <div>
                <div className="font-medium">사용자 명시 신뢰 리스트 확인</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>is_user_trusted(workspace)</code> → 매치 시 <code>FullyTrusted</code> 조기 반환</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">2</span>
              <div>
                <div className="font-medium">글로벌 신뢰 패턴 매칭</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>match_global_trust_patterns(workspace)</code> — <code>~/.claw/trust.json</code> 기반 flag 수집</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">3</span>
              <div>
                <div className="font-medium">이전 실행 기록 확인</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>load_trust_history(workspace)</code> → 사용자 승인 이력 있으면 <code>Restricted(flags)</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border-l-2 border-red-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-red-600 dark:text-red-400 shrink-0">4</span>
              <div>
                <div className="font-medium">자동 위험 신호 탐지</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>detect_risk_signals(workspace)</code> → 크리티컬 시 <code>Untrusted(reason)</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border-l-2 border-amber-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-amber-600 dark:text-amber-400 shrink-0">5</span>
              <div>
                <div className="font-medium">사용자 Prompt (최종 폴백)</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>prompt_user_trust()</code> → Trust / Restrict / Reject 선택</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>5단계 판정</strong>: 사용자 리스트 → 글로벌 패턴 → 이력 → 위험 신호 → 사용자 Prompt<br />
          조기 반환 — 확실한 케이스는 Prompt 없이 즉시 결정<br />
          최종 폴백이 사용자 Prompt — 자동 판정 실패 시 사용자가 결정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">사용자 신뢰 리스트 — ~/.claw/trust.json</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>~/.claw/trust.json</code></div>
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">fully_trusted</div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div><code>/home/user/my-projects</code> — 디렉토리 (재귀)</div>
                <div><code>/home/user/work/*</code> — 글롭 패턴</div>
                <div><code>/home/user/oss/claude-code</code> — 특정 프로젝트</div>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">restricted</div>
              <div className="text-xs text-muted-foreground">
                <code>{`{"path": "/home/user/experiments", "flags": ["NoHooks"]}`}</code>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">untrusted</div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div><code>/tmp/*</code> — 임시 디렉토리 불신</div>
                <div><code>/mnt/external/*</code> — 외장 미디어 불신</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-3">우선순위: untrusted &gt; restricted &gt; fully_trusted (엄격 우선)</div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">위험 신호 탐지 → 제한 적용</h3>
        <RiskSignalsFlagsViz />
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>detect_risk_signals(workspace: &Path)</code> — settings.json 훅 분석</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border-l-2 border-red-400 rounded-r px-3 py-2">
              <span className="text-red-500 shrink-0 text-xs mt-0.5">!</span>
              <div>
                <div className="font-medium"><code>has_env_exfil</code></div>
                <div className="text-xs text-muted-foreground mt-0.5">훅 명령에 <code>curl</code> + <code>.env</code> 조합 감지 — 크리덴셜 유출 시도</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border-l-2 border-red-400 rounded-r px-3 py-2">
              <span className="text-red-500 shrink-0 text-xs mt-0.5">!</span>
              <div>
                <div className="font-medium"><code>has_suspicious_hooks</code></div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>rm -rf</code>, <code>&gt; /dev/</code> 등 파괴적 명령 포함</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-3">5가지 위험 신호: 의심 훅, 원격 MCP, env 유출, 권한 이상, 최근 변경</div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">신뢰 이력 — 학습형 판정</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>~/.claw/trust_history.json</code> — 워크스페이스별 이력</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">first_seen</code>
              <span className="text-xs text-muted-foreground">최초 실행 시각 (예: <code>2026-03-01T10:00:00Z</code>)</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">total_runs</code>
              <span className="text-xs text-muted-foreground">누적 실행 횟수 (예: 47)</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">user_decisions</code>
              <span className="text-xs text-muted-foreground">사용자 판정 이력 — <code>["trust", "trust", "restrict"]</code></span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">incidents</code>
              <span className="text-xs text-muted-foreground">과거 문제 기록 — 비어있지 않으면 신뢰도 하락</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">checksum</code>
              <span className="text-xs text-muted-foreground">워크스페이스 파일 해시 — 변경 탐지 시 재Prompt</span>
            </div>
          </div>
        </div>
        <p>
          <strong>과거 결정을 재사용</strong>: 같은 워크스페이스를 반복 실행 시 재Prompt 불필요<br />
          <code>checksum</code>: 워크스페이스 파일 해시 — 변경 탐지 시 재Prompt<br />
          <code>incidents</code> 비어있지 않으면 신뢰도 하락 — 과거 문제가 있었던 프로젝트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">사용자 Prompt UI</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3 text-amber-600 dark:text-amber-400">
            <span>&#9888;</span> 새 워크스페이스: <code>/home/user/unknown-repo</code>
          </div>
          <div className="text-xs text-muted-foreground mb-3">이 프로젝트는 처음 실행됩니다. 다음 잠재적 위험이 감지되었습니다:</div>
          <div className="space-y-1 text-xs text-muted-foreground mb-4 pl-3 border-l-2 border-amber-300 dark:border-amber-700">
            <div>settings.json에 원격 MCP 서버 정의됨</div>
            <div>CLAUDE.md가 최근 24시간 내 수정됨</div>
          </div>
          <div className="text-xs font-medium mb-2">신뢰 수준을 선택하세요:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded px-3 py-2 text-center">
              <div className="font-mono text-xs font-bold text-green-700 dark:text-green-400">[t]</div>
              <div className="text-xs text-muted-foreground">완전 신뢰</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 rounded px-3 py-2 text-center">
              <div className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">[r] 기본</div>
              <div className="text-xs text-muted-foreground">제한 신뢰</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded px-3 py-2 text-center">
              <div className="font-mono text-xs font-bold text-red-700 dark:text-red-400">[n]</div>
              <div className="text-xs text-muted-foreground">거부</div>
            </div>
            <div className="bg-background/60 border border-border rounded px-3 py-2 text-center">
              <div className="font-mono text-xs font-bold">[?]</div>
              <div className="text-xs text-muted-foreground">상세 보기</div>
            </div>
          </div>
        </div>
        <p>
          <strong>정보 제공 우선</strong>: 위험 신호를 명시하여 사용자가 판단 근거 확보<br />
          <code>[?]</code> 옵션으로 상세 분석 볼 수 있음 — 훅 내용, MCP 서버 URL 등<br />
          기본값은 <code>[r]</code> (제한 신뢰) — 안전 편향
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 1회 Prompt로 지속 신뢰 구축</p>
          <p>
            사용자는 <strong>매번 묻는 것을 싫어함</strong> — Prompt 피로도는 보안 무효화의 주범<br />
            claw-code는 3가지 메커니즘으로 Prompt 빈도 최소화:
          </p>
          <p className="mt-2">
            1. <strong>trust_history</strong>: 과거 결정 기억<br />
            2. <strong>명시 신뢰 리스트</strong>: <code>/home/user/my-projects/*</code> 같은 glob<br />
            3. <strong>체크섬 기반 재검증</strong>: 파일 변경 없으면 재Prompt 생략
          </p>
          <p className="mt-2">
            결과: 개인 프로젝트 개발자는 초기 1회만 Prompt, 이후 자동 신뢰<br />
            외부 프로젝트 실행 시만 경고 — 진짜 위험한 케이스에 집중<br />
            <strong>"안전과 편의의 균형"</strong> — 이것이 TrustResolver의 설계 목표
          </p>
        </div>

      </div>
    </section>
  );
}
