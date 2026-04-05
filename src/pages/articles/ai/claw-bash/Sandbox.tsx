import SandboxViz from './viz/SandboxViz';

export default function Sandbox() {
  return (
    <section id="sandbox" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Linux 샌드박스 — bubblewrap &amp; 컨테이너 감지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SandboxViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">bubblewrap이란</h3>
        <p>
          <code>bubblewrap</code>(bwrap)은 Linux의 경량 샌드박스 도구<br />
          네임스페이스(mount, network, PID) 격리로 프로세스를 커널 레벨에서 제한<br />
          원본 Claude Code는 seccomp 기반, claw-code는 bwrap 선택 — 구성 간단, Flatpak에서 검증됨
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// bwrap 예시 명령
bwrap \\
  --ro-bind /usr /usr \\
  --ro-bind /lib /lib \\
  --ro-bind /lib64 /lib64 \\
  --ro-bind /bin /bin \\
  --bind \${WORKSPACE} /workspace \\
  --chdir /workspace \\
  --unshare-net \\          # 네트워크 격리
  --unshare-pid \\          # PID 네임스페이스 격리
  --proc /proc \\
  --tmpfs /tmp \\
  /bin/bash -c "CMD"`}</pre>
        <p>
          <strong>핵심 플래그</strong>:<br />
          - <code>--ro-bind</code>: 읽기 전용 마운트 (시스템 파일)<br />
          - <code>--bind</code>: 읽기/쓰기 마운트 (워크스페이스만)<br />
          - <code>--unshare-net</code>: 네트워크 차단<br />
          - <code>--tmpfs</code>: 임시 파일 시스템 (프로세스 종료 시 사라짐)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sandbox 가용성 체크</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct Sandbox;

impl Sandbox {
    pub fn is_available() -> bool {
        // 1) Linux인지 확인
        if !cfg!(target_os = "linux") {
            return false;
        }

        // 2) bwrap 바이너리 존재 확인
        if !Path::new("/usr/bin/bwrap").exists()
            && !Path::new("/usr/local/bin/bwrap").exists() {
            return false;
        }

        // 3) 컨테이너 내부면 중첩 샌드박스 불필요
        if Self::is_in_container() {
            return false;
        }

        // 4) user namespace 활성화 확인
        let unshare_works = std::fs::read_to_string(
            "/proc/sys/kernel/unprivileged_userns_clone"
        ).map(|s| s.trim() == "1").unwrap_or(true);

        unshare_works
    }
}`}</pre>
        <p>
          <strong>4단계 가용성 체크</strong>: OS → 바이너리 → 컨테이너 → 커널 설정<br />
          macOS·Windows: 즉시 false — 샌드박스 미지원<br />
          Docker/LXC 내부: false 반환 — 이미 격리된 환경, 이중 샌드박스 불필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">컨테이너 감지 — is_in_container()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl Sandbox {
    fn is_in_container() -> bool {
        // 1) /.dockerenv 파일 (Docker)
        if Path::new("/.dockerenv").exists() { return true; }

        // 2) /run/.containerenv (Podman)
        if Path::new("/run/.containerenv").exists() { return true; }

        // 3) /proc/1/cgroup에 docker/lxc/kubepods 문자열
        if let Ok(cgroup) = std::fs::read_to_string("/proc/1/cgroup") {
            if cgroup.contains("docker") || cgroup.contains("lxc")
                || cgroup.contains("kubepods") {
                return true;
            }
        }

        // 4) 환경 변수 체크 (일부 컨테이너 런타임)
        if std::env::var("container").is_ok() { return true; }

        false
    }
}`}</pre>
        <p>
          <strong>4가지 컨테이너 감지 방법</strong>: dockerenv 파일, containerenv 파일, cgroup, 환경 변수<br />
          여러 방법 병행 — 런타임마다 다른 시그니처 사용<br />
          하나라도 매칭되면 true — 컨테이너 환경으로 판정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">wrap_command() — bwrap 명령 조립</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl Sandbox {
    pub fn wrap_command(program: &str, args: &[&str]) -> (String, Vec<String>) {
        let mut bwrap_args = vec![
            // 읽기 전용 시스템 디렉토리
            "--ro-bind".into(), "/usr".into(), "/usr".into(),
            "--ro-bind".into(), "/lib".into(), "/lib".into(),
            "--ro-bind".into(), "/bin".into(), "/bin".into(),
            "--ro-bind".into(), "/etc".into(), "/etc".into(),

            // 쓰기 가능: 워크스페이스만
            "--bind".into(), workspace_root().display().to_string(), "/workspace".into(),
            "--chdir".into(), "/workspace".into(),

            // /proc 필요 (일부 명령)
            "--proc".into(), "/proc".into(),
            // /dev 필요 (/dev/null 등)
            "--dev".into(), "/dev".into(),
            // 임시 파일
            "--tmpfs".into(), "/tmp".into(),

            // PID 격리 (다른 프로세스 보이지 않음)
            "--unshare-pid".into(),
        ];

        // 네트워크 격리 (설정에 따라)
        if !Self::config().allow_network {
            bwrap_args.push("--unshare-net".into());
        }

        // 실제 명령 추가
        bwrap_args.push(program.into());
        for a in args {
            bwrap_args.push((*a).into());
        }

        ("/usr/bin/bwrap".into(), bwrap_args)
    }
}`}</pre>
        <p>
          <strong>워크스페이스만 쓰기 가능</strong>: 나머지는 read-only — 시스템 파일 변경 불가<br />
          PID 네임스페이스 격리: bash 프로세스가 <code>ps aux</code>로 다른 프로세스 못 봄<br />
          네트워크 격리는 <strong>설정 기반</strong> — curl/wget 필요하면 활성화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">폴백 동작 — 샌드박스 불가 시</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// execute_bash() 내부
let (program, args) = if Sandbox::is_available() {
    Sandbox::wrap_command("/bin/bash", &["-c", &cmd.command])
} else {
    // 폴백: 샌드박스 없이 직접 실행
    log::warn!("sandbox unavailable, running without isolation");
    ("/bin/bash".into(), vec!["-c".into(), cmd.command.clone()])
};`}</pre>
        <p>
          <strong>graceful degradation</strong>: 샌드박스 불가해도 실행은 계속<br />
          대신 로그 경고 — 사용자가 "샌드박스 없이 실행 중"임을 인지<br />
          macOS 사용자에게는 기본값으로 샌드박스 없이 작동 — 권한 모델로만 방어
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">macOS 대안 — Sandbox.app / seatbelt</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 향후 macOS 지원 계획 (현재 미구현)
#[cfg(target_os = "macos")]
impl Sandbox {
    fn wrap_command_macos(program: &str, args: &[&str]) -> (String, Vec<String>) {
        // macOS sandbox-exec 사용
        let profile = r#"
            (version 1)
            (deny default)
            (allow file-read*)
            (allow file-write* (subpath "\${WORKSPACE}"))
            (deny network*)
        "#;
        // ... sandbox-exec 명령 조립
    }
}`}</pre>
        <p>
          macOS는 <code>sandbox-exec</code> + seatbelt 프로파일 사용 가능<br />
          현재 claw-code는 미구현 — 향후 로드맵<br />
          Windows는 AppContainer/Job Object 기반 접근 고려 중
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 샌드박스의 실효성과 한계</p>
          <p>
            <strong>bubblewrap의 보호 범위</strong>:<br />
            ✓ 워크스페이스 외부 파일 변경 차단<br />
            ✓ 시스템 파일(<code>/etc</code>, <code>/usr</code>) 보호<br />
            ✓ 다른 프로세스 정보 열람 차단 (PID 격리)<br />
            ✓ 네트워크 격리 (선택)
          </p>
          <p className="mt-2">
            <strong>보호하지 못하는 것</strong>:<br />
            ✗ 워크스페이스 내부 파일 파괴 (<code>rm -rf ./src</code>)<br />
            ✗ CPU/메모리 고갈 (rlimit 별도 필요)<br />
            ✗ 네트워크 허용 시 데이터 유출<br />
            ✗ 커널 0-day 공격
          </p>
          <p className="mt-2">
            결론: 샌드박스는 <strong>"시스템 보호" 레이어</strong>이지 "워크스페이스 보호" 아님<br />
            워크스페이스 내부는 git/백업으로 복구 — 정기 커밋이 가장 강력한 방어<br />
            이것이 claw-code가 "git 상태 체크" 훅을 기본 제공하는 이유
          </p>
        </div>

      </div>
    </section>
  );
}
