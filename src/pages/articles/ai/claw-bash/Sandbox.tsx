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
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-cyan-50 dark:bg-cyan-950/30 px-4 py-2 border-b border-border">
              <p className="text-sm font-semibold">bwrap 명령 구성</p>
            </div>
            <div className="divide-y divide-border text-sm">
              <div className="px-4 py-2.5 flex items-start gap-3">
                <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 w-28 shrink-0">--ro-bind</span>
                <span className="text-muted-foreground">읽기 전용 마운트 — <code className="text-xs bg-muted px-1 py-0.5 rounded">/usr</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">/lib</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">/lib64</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">/bin</code></span>
              </div>
              <div className="px-4 py-2.5 flex items-start gap-3 bg-muted/30">
                <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 w-28 shrink-0">--bind</span>
                <span className="text-muted-foreground">읽기/쓰기 마운트 — 워크스페이스만 <code className="text-xs bg-muted px-1 py-0.5 rounded">/workspace</code>로 매핑</span>
              </div>
              <div className="px-4 py-2.5 flex items-start gap-3">
                <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 w-28 shrink-0">--unshare-net</span>
                <span className="text-muted-foreground">네트워크 네임스페이스 격리 — 외부 접근 차단</span>
              </div>
              <div className="px-4 py-2.5 flex items-start gap-3 bg-muted/30">
                <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 w-28 shrink-0">--unshare-pid</span>
                <span className="text-muted-foreground">PID 네임스페이스 격리 — 다른 프로세스 보이지 않음</span>
              </div>
              <div className="px-4 py-2.5 flex items-start gap-3">
                <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 w-28 shrink-0">--tmpfs</span>
                <span className="text-muted-foreground">임시 파일 시스템 <code className="text-xs bg-muted px-1 py-0.5 rounded">/tmp</code> — 프로세스 종료 시 사라짐</span>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>핵심 플래그</strong>:<br />
          - <code>--ro-bind</code>: 읽기 전용 마운트 (시스템 파일)<br />
          - <code>--bind</code>: 읽기/쓰기 마운트 (워크스페이스만)<br />
          - <code>--unshare-net</code>: 네트워크 차단<br />
          - <code>--tmpfs</code>: 임시 파일 시스템 (프로세스 종료 시 사라짐)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sandbox 가용성 체크</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 border-b border-border">
              <p className="text-sm font-semibold"><code className="text-xs">Sandbox::is_available()</code> — 4단계 가용성 체크</p>
            </div>
            <div className="divide-y divide-border text-sm">
              <div className="grid grid-cols-[32px_1fr] px-4 py-2.5 items-start">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">1</span>
                <div>
                  <p className="font-semibold">OS 확인</p>
                  <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">cfg!(target_os = "linux")</code> — Linux 아니면 즉시 false</p>
                </div>
              </div>
              <div className="grid grid-cols-[32px_1fr] px-4 py-2.5 items-start bg-muted/30">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">2</span>
                <div>
                  <p className="font-semibold">bwrap 바이너리 존재</p>
                  <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">/usr/bin/bwrap</code> 또는 <code className="text-xs bg-muted px-1 py-0.5 rounded">/usr/local/bin/bwrap</code> 확인</p>
                </div>
              </div>
              <div className="grid grid-cols-[32px_1fr] px-4 py-2.5 items-start">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">3</span>
                <div>
                  <p className="font-semibold">컨테이너 내부 확인</p>
                  <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">is_in_container()</code> — 이미 격리 환경이면 중첩 불필요 → false</p>
                </div>
              </div>
              <div className="grid grid-cols-[32px_1fr] px-4 py-2.5 items-start bg-muted/30">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">4</span>
                <div>
                  <p className="font-semibold">user namespace 활성화</p>
                  <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">/proc/sys/kernel/unprivileged_userns_clone</code> == "1" 확인</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>4단계 가용성 체크</strong>: OS → 바이너리 → 컨테이너 → 커널 설정<br />
          macOS·Windows: 즉시 false — 샌드박스 미지원<br />
          Docker/LXC 내부: false 반환 — 이미 격리된 환경, 이중 샌드박스 불필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">컨테이너 감지 — is_in_container()</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-violet-50 dark:bg-violet-950/30 px-4 py-2 border-b border-border">
              <p className="text-sm font-semibold"><code className="text-xs">is_in_container()</code> — 4가지 감지 방법</p>
            </div>
            <div className="divide-y divide-border text-sm">
              <div className="grid grid-cols-[80px_1fr] px-4 py-2.5 items-center">
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">Docker</span>
                <span className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">/.dockerenv</code> 파일 존재 확인</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] px-4 py-2.5 items-center bg-muted/30">
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">Podman</span>
                <span className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">/run/.containerenv</code> 파일 존재 확인</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] px-4 py-2.5 items-center">
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">cgroup</span>
                <span className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">/proc/1/cgroup</code>에 <code className="text-xs bg-muted px-1 py-0.5 rounded">docker</code> / <code className="text-xs bg-muted px-1 py-0.5 rounded">lxc</code> / <code className="text-xs bg-muted px-1 py-0.5 rounded">kubepods</code> 문자열</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] px-4 py-2.5 items-center bg-muted/30">
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">환경 변수</span>
                <span className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">$container</code> 환경 변수 존재 여부</span>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>4가지 컨테이너 감지 방법</strong>: dockerenv 파일, containerenv 파일, cgroup, 환경 변수<br />
          여러 방법 병행 — 런타임마다 다른 시그니처 사용<br />
          하나라도 매칭되면 true — 컨테이너 환경으로 판정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">wrap_command() — bwrap 명령 조립</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-teal-50 dark:bg-teal-950/30 px-4 py-2 border-b border-border">
              <p className="text-sm font-semibold"><code className="text-xs">wrap_command(program, args)</code> — bwrap 인자 조립</p>
            </div>
            <div className="divide-y divide-border text-sm">
              <div className="px-4 py-3">
                <p className="font-semibold text-teal-700 dark:text-teal-400 mb-1">읽기 전용 마운트</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">--ro-bind</code>: <code className="text-xs bg-muted px-1 py-0.5 rounded">/usr</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">/lib</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">/bin</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">/etc</code> — 시스템 파일 변경 불가</p>
              </div>
              <div className="px-4 py-3 bg-muted/30">
                <p className="font-semibold text-teal-700 dark:text-teal-400 mb-1">쓰기 가능 마운트</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">--bind</code>: <code className="text-xs bg-muted px-1 py-0.5 rounded">workspace_root()</code> → <code className="text-xs bg-muted px-1 py-0.5 rounded">/workspace</code> — 워크스페이스만 쓰기 허용</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-semibold text-teal-700 dark:text-teal-400 mb-1">필수 가상 파일시스템</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">--proc /proc</code> (일부 명령 필수), <code className="text-xs bg-muted px-1 py-0.5 rounded">--dev /dev</code> (/dev/null 등), <code className="text-xs bg-muted px-1 py-0.5 rounded">--tmpfs /tmp</code></p>
              </div>
              <div className="px-4 py-3 bg-muted/30">
                <p className="font-semibold text-teal-700 dark:text-teal-400 mb-1">격리 설정</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">--unshare-pid</code> (항상) + <code className="text-xs bg-muted px-1 py-0.5 rounded">--unshare-net</code> (<code className="text-xs bg-muted px-1 py-0.5 rounded">allow_network</code> 설정에 따라)</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-semibold text-teal-700 dark:text-teal-400 mb-1">반환</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">("/usr/bin/bwrap", bwrap_args)</code> — 실제 명령은 bwrap_args 끝에 추가</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>워크스페이스만 쓰기 가능</strong>: 나머지는 read-only — 시스템 파일 변경 불가<br />
          PID 네임스페이스 격리: bash 프로세스가 <code>ps aux</code>로 다른 프로세스 못 봄<br />
          네트워크 격리는 <strong>설정 기반</strong> — curl/wget 필요하면 활성화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">폴백 동작 — 샌드박스 불가 시</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-2 border-b border-border">
              <p className="text-sm font-semibold">샌드박스 분기 — <code className="text-xs">execute_bash()</code> 내부</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 text-sm">
              <div className="px-4 py-3 border-b sm:border-b-0 sm:border-r border-border">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">샌드박스 가용</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">Sandbox::wrap_command()</code>로 bwrap 래핑 후 실행</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">샌드박스 불가 (폴백)</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">/bin/bash -c</code> 직접 실행 + 로그 경고 출력</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>graceful degradation</strong>: 샌드박스 불가해도 실행은 계속<br />
          대신 로그 경고 — 사용자가 "샌드박스 없이 실행 중"임을 인지<br />
          macOS 사용자에게는 기본값으로 샌드박스 없이 작동 — 권한 모델로만 방어
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">macOS 대안 — Sandbox.app / seatbelt</h3>
        <div className="not-prose my-4">
          <div className="border border-dashed border-border rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-950/30 px-4 py-2 border-b border-dashed border-border">
              <p className="text-sm font-semibold text-muted-foreground">macOS 지원 계획 (현재 미구현)</p>
            </div>
            <div className="divide-y divide-dashed divide-border text-sm">
              <div className="px-4 py-2.5">
                <p className="font-semibold mb-1">seatbelt 프로파일 기반</p>
                <p className="text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">sandbox-exec</code> + SBPL 정책: 기본 deny → <code className="text-xs bg-muted px-1 py-0.5 rounded">file-read*</code> 허용 → 워크스페이스만 <code className="text-xs bg-muted px-1 py-0.5 rounded">file-write*</code></p>
              </div>
              <div className="px-4 py-2.5 bg-muted/30">
                <p className="font-semibold mb-1">Windows 고려</p>
                <p className="text-muted-foreground">AppContainer / Job Object 기반 접근 검토 중</p>
              </div>
            </div>
          </div>
        </div>
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
