import SymlinkEscapeViz from './viz/SymlinkEscapeViz';
import PathAttackVectorsViz from './viz/PathAttackVectorsViz';

export default function Boundary() {
  return (
    <section id="boundary" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">워크스페이스 경계 검증 &amp; 심링크 이스케이프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SymlinkEscapeViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">경계 위반 공격 시나리오 4가지</h3>
        <PathAttackVectorsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">정규화 파이프라인 5단계</h3>
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-purple-600 text-white text-xs font-semibold px-4 py-2">normalize_and_validate(input_path, workspace)</div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <div className="text-sm"><strong>PathBuf 변환</strong> — 입력 문자열을 <code className="text-xs bg-muted px-1 rounded">PathBuf::from(input_path)</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <div className="text-sm"><strong>clean</strong> — <code className="text-xs bg-muted px-1 rounded">path_clean::clean()</code>으로 <code className="text-xs bg-muted px-1 rounded">../..</code> 패턴 정리 (lexical normalization)</div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <div className="text-sm"><strong>절대화</strong> — 상대 경로면 <code className="text-xs bg-muted px-1 rounded">workspace.join(cleaned)</code></div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <div className="text-sm">
                  <strong>canonicalize</strong> — 심링크 해제
                  <div className="text-xs text-muted-foreground mt-1">파일 존재 시: 직접 canonicalize | 미존재(쓰기용): 부모 canonicalize + 파일명 결합</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-background border border-border rounded-md p-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <div className="text-sm"><strong>경계 검증</strong> — <code className="text-xs bg-muted px-1 rounded">canonical.starts_with(workspace)</code> 실패 시 <code className="text-xs bg-muted px-1 rounded">Err("escape detected")</code></div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>5단계 정규화</strong>: PathBuf 변환 → clean → 절대화 → canonicalize → 경계 검증<br />
          <code>path_clean</code> crate로 <code>../..</code> 패턴 정리 — lexical normalization<br />
          canonicalize는 <strong>파일 존재 전제</strong> — 쓰기는 부모 디렉토리로 검증
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">쓰기 시 부모 디렉토리 검증 — TOCTOU 회피</h3>
        <div className="not-prose mb-4 space-y-3">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-amber-600 text-white text-xs font-semibold px-4 py-2">새 파일 쓰기 — 파일이 아직 없는 경우</div>
            <div className="p-4 space-y-2">
              <div className="bg-background border border-border rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">문제</div>
                <div className="text-sm"><code className="text-xs bg-muted px-1 rounded">workspace.join("new_file.txt").canonicalize()</code> → <strong>Err</strong> (파일 없음)</div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">대안</div>
                <div className="text-sm">부모 디렉토리로 검증 — <code className="text-xs bg-muted px-1 rounded">parent.canonicalize()</code> 후 <code className="text-xs bg-muted px-1 rounded">starts_with(workspace)</code></div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">TOCTOU 주의 (Time-of-check to time-of-use)</div>
            <div className="text-sm text-muted-foreground">검증 후 쓰기 전에 공격자가 심링크로 바꾸면 우회 가능</div>
            <div className="text-sm mt-1"><strong>방어</strong>: workspace를 chroot-like 환경에서 실행 (샌드박스 병용)</div>
          </div>
        </div>
        <p>
          <strong>TOCTOU(Time-of-check to time-of-use)</strong>: 검증과 사용 사이 공격자 개입<br />
          파일 경로 검증은 근본적으로 TOCTOU 취약 — race condition 발생 가능<br />
          방어: <strong>샌드박스 병용</strong> (bwrap이 파일 시스템 자체를 제한)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Windows 특수 경로 처리</h3>
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-2">normalize_windows() — Windows 전용 경로 정규화</div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">UNC/device 경로 차단</div>
                  <div className="text-sm font-mono"><code className="text-xs bg-muted px-1 rounded">\\?\</code> <code className="text-xs bg-muted px-1 rounded">\\.\</code></div>
                  <div className="text-xs text-muted-foreground mt-1">260자 상한 우회 — 보안 검증 우회 시도</div>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">네트워크 경로 차단</div>
                  <div className="text-sm font-mono"><code className="text-xs bg-muted px-1 rounded">\\server\share</code></div>
                  <div className="text-xs text-muted-foreground mt-1">외부 SMB 서버 접근 가능성</div>
                </div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">드라이브 문자 정규화</div>
                <div className="text-sm"><code className="text-xs bg-muted px-1 rounded">C:</code> vs <code className="text-xs bg-muted px-1 rounded">c:</code> → 대문자로 통일 (<code className="text-xs bg-muted px-1 rounded">to_uppercase</code>)</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>Windows 공격 벡터</strong>: UNC 경로, device 경로, 네트워크 드라이브<br />
          <code>\\?\</code> 프리픽스는 Windows API 상한(260자) 우회 — 보안 검증 우회 시도<br />
          <code>\\</code> 네트워크 경로: 외부 SMB 서버 접근 가능성 — 차단 필수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">심링크 탐지 테스트 케이스</h3>
        <div className="not-prose mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">detect_symlink_escape — 외부 심링크 차단</div>
            <div className="space-y-2 text-sm">
              <div className="bg-background border border-border rounded-md p-2">
                <div className="text-xs text-muted-foreground">설정</div>
                <div className="font-mono text-xs mt-1"><code className="bg-muted px-1 rounded">symlink("/etc/passwd", "sub/link")</code></div>
              </div>
              <div className="bg-background border border-border rounded-md p-2">
                <div className="text-xs text-muted-foreground">호출</div>
                <div className="font-mono text-xs mt-1"><code className="bg-muted px-1 rounded">normalize_and_validate("sub/link", workspace)</code></div>
              </div>
              <div className="bg-background border border-border rounded-md p-2">
                <div className="text-xs text-muted-foreground">결과</div>
                <div className="text-sm font-semibold text-red-600 mt-1">Err("escape detected") — 차단 성공</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">allow_internal_symlink — 내부 심링크 허용</div>
            <div className="space-y-2 text-sm">
              <div className="bg-background border border-border rounded-md p-2">
                <div className="text-xs text-muted-foreground">설정</div>
                <div className="font-mono text-xs mt-1"><code className="bg-muted px-1 rounded">symlink("real.txt", "alias.txt")</code> (내부)</div>
              </div>
              <div className="bg-background border border-border rounded-md p-2">
                <div className="text-xs text-muted-foreground">호출</div>
                <div className="font-mono text-xs mt-1"><code className="bg-muted px-1 rounded">normalize_and_validate("alias.txt", workspace)</code></div>
              </div>
              <div className="bg-background border border-border rounded-md p-2">
                <div className="text-xs text-muted-foreground">결과</div>
                <div className="text-sm font-semibold text-green-600 mt-1">Ok — 정상 통과</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>테스트 2가지</strong>: 외부 심링크 차단 + 내부 심링크 허용<br />
          내부 심링크는 정상 — 사용자가 편의상 alias를 만들 수 있음<br />
          외부 심링크만 공격 벡터 — canonicalize 결과가 워크스페이스 밖
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 고려 — canonicalize 비용</h3>
        <p>
          <code>canonicalize()</code>는 파일 시스템 호출 — 각 경로 요소마다 stat 호출<br />
          깊은 경로(20단계 이상)는 수 ms 소요 — 대량 작업에서 병목 가능<br />
          <strong>최적화</strong>: 워크스페이스 루트를 1회만 canonicalize, 세션 내 캐시
        </p>
        <div className="not-prose mb-4">
          <div className="bg-muted/50 border border-border rounded-lg overflow-hidden">
            <div className="bg-teal-600 text-white text-xs font-semibold px-4 py-2">최적화 — 워크스페이스 루트 1회 canonicalize</div>
            <div className="p-4 space-y-3">
              <div className="bg-background border border-border rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">세션 시작 시 1회</div>
                <div className="text-sm"><code className="text-xs bg-muted px-1 rounded">CANONICAL_WS = workspace_root().canonicalize()</code></div>
              </div>
              <div className="bg-background border border-border rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">매 검증 시</div>
                <div className="text-sm space-y-1">
                  <div><code className="text-xs bg-muted px-1 rounded">CANONICAL_WS.join(rel).canonicalize()</code> — 상대 경로만 canonicalize</div>
                  <div><code className="text-xs bg-muted px-1 rounded">canonical.starts_with(&CANONICAL_WS)</code> — 상수 시간 prefix 비교</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 경계 검증은 단독으로 불완전</p>
          <p>
            문자열 기반 경계 검증의 <strong>근본 한계</strong>:<br />
            - TOCTOU race: 검증과 사용 사이 race condition<br />
            - 심링크 동적 교체: 프로세스 실행 중 link 재설정<br />
            - Windows junction/hardlink: 다른 우회 벡터
          </p>
          <p className="mt-2">
            완전한 방어를 위해 <strong>3중 방어</strong>:<br />
            1. <strong>문자열 검증</strong>: 빠른 사전 차단 (90% 케이스)<br />
            2. <strong>canonicalize 검증</strong>: 심링크 해제 후 재확인<br />
            3. <strong>샌드박스</strong>: 커널 레벨 bind mount로 물리적 격리
          </p>
          <p className="mt-2">
            <strong>claw-code는 1+2를 모든 파일 연산에 적용, 3은 bash 도구에만 적용</strong><br />
            파일 I/O는 워크스페이스만 조작 → 샌드박스 없어도 충분히 안전<br />
            bash는 임의 명령 실행 → 샌드박스 필수
          </p>
        </div>

      </div>
    </section>
  );
}
