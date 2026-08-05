import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PluginLoadPathViz from './viz/PluginLoadPathViz';
import PluginRuntimePathViz from './viz/PluginRuntimePathViz';
import PluginTrustBoundaryViz from './viz/PluginTrustBoundaryViz';

function CodeEvidence({
  codeRefKey,
  label,
  onCodeRef,
}: {
  codeRefKey: string;
  label: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <div className="not-prose my-4">
      <CodeViewButton onClick={() => onCodeRef(codeRefKey, codeRefs[codeRefKey])} label={label} />
    </div>
  );
}

function Milestone({ number, children }: { number: string; children: string }) {
  return (
    <div className="not-prose mb-3 flex items-center gap-3">
      <span className="text-3xl font-black tabular-nums text-muted-foreground/35">{number}</span>
      <p className="text-xs font-semibold uppercase text-muted-foreground">{children}</p>
    </div>
  );
}

export default function Rebuilt({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <Milestone number="01">출처와 계약</Milestone>
        <h2 className="mb-6 text-2xl font-bold">PluginKind는 기능이 아니라 출처다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Claw의 plugin을 처음 읽을 때 가장 먼저 버려야 할 그림은 “tool plugin, hook plugin,
            context plugin이 따로 있다”는 분류다. 실제 <code>PluginKind</code>는
            <code>Builtin</code>, <code>Bundled</code>, <code>External</code> 세 가지다. 이 값은
            plugin이 <strong>무슨 기능을 하는지</strong>가 아니라 <strong>어디에서 왔고 누가 설치
            상태를 관리하는지</strong>를 나타낸다.
          </p>
          <p>
            기능은 다른 축이다. 하나의 manifest가 <code>hooks</code>, <code>lifecycle</code>,
            <code>tools</code>, <code>commands</code>를 동시에 가질 수 있다. 따라서 “이 plugin은
            ToolProvider인가?”보다 “어떤 출처의 plugin이 어떤 실행 entry를 선언했고, 그 entry가 어느
            runtime 경로에 연결되는가?”라고 묻는 편이 실제 코드와 맞다.
          </p>
          <CodeEvidence
            codeRefKey="manifest-contract"
            label="실제 PluginKind와 manifest 타입 18-205줄 보기"
            onCodeRef={onCodeRef}
          />

          <h3>파일 이름부터 실제 계약으로 맞춘다</h3>
          <p>
            loader가 찾는 파일은 root의 <code>plugin.json</code> 또는
            <code>.claude-plugin/plugin.json</code>이다. manifest 안에는 별도
            <code>kind</code>나 공통 <code>entrypoint</code>가 없다. 각 tool이
            <code>command</code>와 <code>args</code>를 갖고, lifecycle과 hook도 각자의 command
            목록을 갖는다.
          </p>
        </div>

        <div className="not-prose my-6 overflow-hidden rounded-md border border-border">
          <div className="border-b border-border bg-muted/35 px-4 py-3 text-sm font-semibold">
            실제 필드를 따라 만든 최소 <code className="text-xs">plugin.json</code>
          </div>
          <pre className="m-0 overflow-x-auto bg-background p-4 text-xs leading-relaxed"><code>{`{
  "name": "repo-inspector",
  "version": "0.1.0",
  "description": "Inspect a repository",
  "permissions": ["read", "execute"],
  "defaultEnabled": false,
  "hooks": { "PreToolUse": ["./hooks/pre.sh"] },
  "lifecycle": { "Init": ["./scripts/init.sh"], "Shutdown": [] },
  "tools": [{
    "name": "inspect_repo",
    "description": "Inspect repository metadata",
    "inputSchema": { "type": "object", "properties": {} },
    "command": "./bin/inspect",
    "args": [],
    "requiredPermission": "read-only"
  }],
  "commands": []
}`}</code></pre>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>검증된 manifest가 보장하는 것과 보장하지 않는 것</h3>
          <p>
            loader는 필수 문자열이 비어 있지 않은지, permission label이 알려진 값인지, tool name이
            manifest 안에서 중복되지 않는지, <code>inputSchema</code>가 object인지 확인한다. path로
            보이는 command는 존재하고 파일인지도 검사한다. 반면 version은 semver parser를 거치지 않고,
            signature나 hash를 확인하지 않으며, executable bit와 plugin root 밖 path를 금지하지 않는다.
            literal command는 path 존재 검사도 건너뛴다.
          </p>
          <CodeEvidence
            codeRefKey="manifest-loader"
            label="manifest 탐색과 검증 1543-1849줄 보기"
            onCodeRef={onCodeRef}
          />
          <CodeEvidence
            codeRefKey="command-validation-lifecycle"
            label="command path와 lifecycle 실행 1899-2127줄 보기"
            onCodeRef={onCodeRef}
          />

          <h3>두 permission 필드는 같은 일을 하지 않는다</h3>
          <p>
            최상위 <code>permissions: [&quot;read&quot;, &quot;execute&quot;]</code>는
            <code>PluginPermission</code>으로 parse되어 manifest에 남는다. 그러나
            <code>load_plugin_definition()</code>은 metadata, hooks, lifecycle, tools만 runtime
            definition으로 옮긴다. 최상위 permissions를 OS 권한이나 runtime policy에 연결하는 코드는 이
            경로에 없다. 현재로서는 <strong>검증되는 선언</strong>이지 <strong>강제되는 capability
            set</strong>이 아니다.
          </p>
          <p>
            반대로 tool의 <code>requiredPermission</code>은
            <code>ReadOnly</code>, <code>WorkspaceWrite</code>,
            <code>DangerFullAccess</code> 중 하나로 parse되고, 뒤에서 runtime
            <code>PermissionMode</code> 요구 사항으로 연결된다. 이 차이가 이 글의 핵심 질문으로 이어진다.
          </p>
        </div>
      </section>

      <section id="load-path" className="mb-16 scroll-mt-20">
        <Milestone number="02">발견과 병합</Milestone>
        <h2 className="mb-6 text-2xl font-bold">발견, 설치 기록, 활성화는 서로 다른 상태다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            runtime registry를 만들 때 manager는 먼저 bundled plugin을 install root에 동기화한다.
            그다음 코드에 포함된 builtin definition, install root와 <code>installed.json</code>에서
            찾은 installed plugin, 설정의 <code>externalDirectories</code>에서 찾은 plugin을 순서대로
            모은다. 고정된 system/user/workspace 세 경로를 스캔하거나 workspace가 항상 이기는 구조가
            아니다.
          </p>
          <p>
            각 directory는 manifest load에 성공하면 <code>PluginDefinition</code>이 되고, 실패하면
            <code>PluginLoadFailure</code>가 된다. report는 성공한 registry와 failure를 함께 볼 수
            있지만 일반 <code>plugin_registry()</code>는 failure가 하나라도 있으면
            <code>Err(LoadFailures)</code>로 닫힌다. 즉 “나쁜 plugin 하나만 건너뛰고 나머지로 runtime을
            계속 시작한다”는 보장도 아니다.
          </p>
        </div>

        <PluginLoadPathViz />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <CodeEvidence
            codeRefKey="discovery-enable"
            label="installed/external 발견과 enabled 규칙 1237-1521줄 보기"
            onCodeRef={onCodeRef}
          />

          <h3>enabled state는 trust list가 아니라 설정의 bool이다</h3>
          <p>
            discovered definition은 <code>RegisteredPlugin</code>이 될 때 enabled bool과 결합한다.
            <code>enabledPlugins</code> 설정에 id가 있으면 그 값을 사용한다. 명시 값이 없을 때 external은
            false, builtin과 bundled는 manifest의 <code>defaultEnabled</code>를 따른다. install은 새
            external plugin을 복사한 뒤 enabled state를 true로 쓴다. 별도의
            <code>trusted_plugins</code> hash set이나 enable 시 signature 검증은 없다.
          </p>
          <p>
            runtime <code>PluginRegistry</code>는 HashMap이 아니라 plugin id로 정렬된
            <code>Vec&lt;RegisteredPlugin&gt;</code>이다. 정렬은 hook merge와 init 순서도 결정한다.
            lookup은 id를 기준으로 선형 검색한다.
          </p>
          <CodeEvidence
            codeRefKey="registry-aggregation"
            label="registry report와 aggregation 699-855줄 보기"
            onCodeRef={onCodeRef}
          />

          <h3>충돌 검사는 두 층에서 일어난다</h3>
          <p>
            enabled plugin의 tool을 모을 때 plugin끼리 같은 tool name을 선언했는지 먼저 검사한다.
            hook에는 이름 충돌 개념이 없고, 정렬된 plugin 순서대로 command list를 이어 붙인다. 그다음
            CLI가 <code>GlobalToolRegistry</code>를 만들 때 plugin tool이 builtin tool name과
            충돌하는지, runtime/MCP tool까지 합친 뒤 전체 name이 중복되는지 다시 검사한다. 따라서
            “manifest가 valid하다”와 “runtime tool registry에 들어갈 수 있다”도 다른 판정이다.
          </p>
          <CodeEvidence
            codeRefKey="global-tool-registry"
            label="GlobalToolRegistry 충돌과 permission 변환 123-355줄 보기"
            onCodeRef={onCodeRef}
          />
          <CodeEvidence
            codeRefKey="runtime-build"
            label="CLI의 hooks/tools runtime 조립 7173-7194줄 보기"
            onCodeRef={onCodeRef}
          />
        </div>
      </section>

      <section id="execution-boundary" className="mb-16 scroll-mt-20">
        <Milestone number="03">승인과 실행</Milestone>
        <h2 className="mb-6 text-2xl font-bold">정상 CLI 경로에서 tool은 언제 실행되는가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            enabled plugin hooks는 runtime hook config에 합쳐지고, plugin tools는
            <code>GlobalToolRegistry</code>에 들어간다. registry는 각 plugin tool의
            <code>requiredPermission</code>을 runtime <code>PermissionMode</code>로 바꿔
            <code>PermissionPolicy</code>에 등록한다. 이 wiring 덕분에 정상 conversation 경로에서는
            permission 판정이 tool process 시작보다 먼저 온다.
          </p>
          <p>
            순서는 세부적으로 더 길다. PreToolUse hook이 입력을 바꾸거나 Allow, Ask, Deny guidance를
            만들 수 있다. cancel, failure, deny면 tool은 시작되지 않는다. 나머지는 policy가 deny/ask/allow
            rule, hook context, active mode, required mode로 authorize한다. 최종 Allow일 때만
            <code>CliToolExecutor</code>가 plugin tool을 찾고 <code>execute()</code>를 호출한다.
          </p>
        </div>

        <PluginRuntimePathViz />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <CodeEvidence
            codeRefKey="permission-wiring"
            label="plugin init과 PermissionPolicy wiring 7615-7648줄 보기"
            onCodeRef={onCodeRef}
          />
          <CodeEvidence
            codeRefKey="conversation-gate"
            label="Pre hook → authorize → execute → Post hook 400-480줄 보기"
            onCodeRef={onCodeRef}
          />

          <h3>그러면 read-only label이 command를 읽기 전용으로 만드는가</h3>
          <p>
            아니다. <code>requiredPermission=&quot;read-only&quot;</code>는 “이 tool 요청을
            ReadOnly mode에서도 승인할 수 있다”는 authorization metadata다. 승인 뒤
            <code>PluginTool::execute()</code>는 manifest의 command와 args로 일반
            <code>std::process::Command</code>를 만든다. filesystem namespace, network namespace,
            seccomp, capability, UID, cgroup, rlimit을 줄이는 코드는 없다.
          </p>
          <p>
            따라서 manifest가 valid하고 label이 read-only여도 command가 shell redirect로 파일을 쓰거나,
            별도 binary가 workspace 밖 파일을 변경하거나, network로 데이터를 보내는 것을 이 label만으로
            막을 수 없다. OS가 Claw process에 허용한 권한을 child도 사용할 수 있다. policy는
            <strong>호출 여부</strong>를 정하지만 child process의 <strong>가능한 효과 집합</strong>을
            축소하지 않는다.
          </p>
        </div>

        <PluginTrustBoundaryViz />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <CodeEvidence
            codeRefKey="tool-process"
            label="PluginTool::execute 260-348줄 보기"
            onCodeRef={onCodeRef}
          />

          <h3>subprocess가 주는 격리와 주지 않는 격리</h3>
          <p>
            별도 process이므로 plugin binary의 panic이나 segmentation fault가 같은 address space에서
            Claw stack을 직접 무너뜨리지는 않는다. 그러나 이것을 보안 sandbox라고 부를 수는 없다.
            child가 무한히 기다리거나 대량 stdout을 내거나 process tree를 만들 때 timeout, output cap,
            cancellation, descendant cleanup이 없다. 파일과 network 접근도 그대로다.
          </p>
          <p>
            성공하면 stdout을 JSON response로 parse하지 않고 UTF-8 lossy 변환 뒤 trim한 문자열을 그대로
            반환한다. 실패하면 stderr가 있으면 stderr, 없으면 exit status를
            <code>CommandFailed</code>에 넣는다. schema가 검증되는 것은 tool의 <em>input</em>이며,
            process output의 구조가 아니다.
          </p>

          <h3>PreToolUse hook은 permission gate보다 먼저 실행된다</h3>
          <p>
            더 중요한 경계가 하나 있다. plugin hook 자체도 shell command다. PreToolUse hook은 tool
            permission authorization보다 먼저 실행되며, hook command에도 timeout이나 sandbox가 없다.
            exit 0은 allow, 2는 deny, 나머지는 failure로 해석하지만 command가 이미 만든 side effect를
            되돌리지는 않는다. 그래서 신뢰하지 않는 plugin을 “tool requiredPermission이 낮으니
            안전하다”고 enable해서는 안 된다.
          </p>
          <CodeEvidence
            codeRefKey="hook-process"
            label="HookRunner shell process와 exit 계약 59-228줄 보기"
            onCodeRef={onCodeRef}
          />

          <h3>enforcement point를 한 문장으로 고정한다</h3>
          <p>
            현재 정상 CLI conversation의 authorization enforcement point는
            <code>ConversationRuntime</code>의 authorize-before-execute branch다.
            <code>PluginTool::execute()</code> 자체나 plugin branch의
            <code>GlobalToolRegistry::execute()</code>가 policy를 다시 검사하는 것은 아니다. 다른 caller가
            registry를 직접 호출하는 경로를 추가한다면 같은 policy gate를 거치는지 integration test로
            증명해야 한다.
          </p>
        </div>
      </section>

      <section id="operations-boundary" className="mb-16 scroll-mt-20">
        <Milestone number="04">수명주기와 실패 경계</Milestone>
        <h2 className="mb-6 text-2xl font-bold">상태 머신 대신 실제 init·shutdown·파일 교체를 본다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            이 snapshot의 <code>PluginLifecycle</code>은 Discovered, Healthy, Failed 같은 상태 enum이
            아니다. manifest의 <code>Init</code>과 <code>Shutdown</code> command 배열이다. runtime을
            만들기 전에 enabled plugin을 registry 정방향으로 validate하고 init한다. 하나가 실패하면 첫
            error에서 runtime build가 중단된다. shutdown은 registry 역방향으로 실행한다.
          </p>
          <p>
            <code>BuiltRuntime</code>은 명시적 교체 때 shutdown을 호출하고 Drop에서도 한 번 더 시도한다.
            active flag로 중복 호출을 피하지만 Drop 경로는 shutdown error를 버린다. periodic
            health-check, unhealthy 자동 disable, retry state, file watcher hot reload, PluginStats는 이
            plugin lifecycle에 없다.
          </p>
          <CodeEvidence
            codeRefKey="runtime-lifecycle"
            label="BuiltRuntime shutdown과 Drop 3925-4001줄 보기"
            onCodeRef={onCodeRef}
          />

          <h3>설치와 업데이트는 transactional하지 않다</h3>
          <p>
            install은 local path나 git URL을 materialize하고 manifest를 검증한 뒤 install directory에
            복사한다. 같은 path가 있으면 먼저 <code>remove_dir_all</code>로 지운다. update도 기존
            directory를 지운 뒤 새 source를 <code>copy_dir_all</code>하고 마지막에
            <code>installed.json</code> record를 갱신한다.
          </p>
          <p>
            temp source를 사용한다고 최종 교체가 atomic해지는 것은 아니다. 삭제 뒤 copy 중 I/O error나
            process crash가 나면 기존 version은 사라지고 부분 directory가 남을 수 있다. registry/settings
            write도 directory 교체와 하나의 transaction이 아니다. production hardening은 같은 filesystem의
            versioned staging directory에 완전 복사·검증하고 atomic rename으로 switch한 뒤, 실패 시
            이전 version을 유지하는 방향이어야 한다.
          </p>
          <CodeEvidence
            codeRefKey="install-update"
            label="install/enable/uninstall/update 1113-1234줄 보기"
            onCodeRef={onCodeRef}
          />

          <h3>현재 보장과 필요한 hardening을 분리한다</h3>
        </div>

        <div className="not-prose my-6 divide-y divide-border rounded-md border border-border">
          {[
            ['Manifest parsing', '필드·schema·일부 path를 검증한다.', 'signature, semver, root containment, executable policy를 추가한다.'],
            ['Authorization', '정상 conversation에서 requiredPermission을 policy가 평가한다.', '모든 alternate caller가 같은 gate를 통과함을 integration test로 고정한다.'],
            ['Process execution', '별도 process와 exit/stderr 경계가 있다.', 'OS sandbox, timeout, output cap, cancellation, process-tree cleanup을 추가한다.'],
            ['Hooks', 'Pre/Post/Failure chain과 exit-code 계약이 있다.', 'permission 전 hook side effect의 신뢰 모델과 sandbox를 명시한다.'],
            ['Install/update', 'local/git source를 복사하고 registry를 갱신한다.', 'staging 검증, atomic switch, rollback, crash recovery를 추가한다.'],
            ['Lifecycle', 'init 정방향, shutdown 역방향을 실행한다.', '필요하면 health state를 새로 설계하되 현재 기능처럼 문서화하지 않는다.'],
          ].map(([area, current, hardening]) => (
            <div key={area} className="grid gap-2 px-4 py-4 md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)]">
              <strong className="text-sm">{area}</strong>
              <p className="m-0 text-sm leading-relaxed"><span className="font-semibold text-emerald-700 dark:text-emerald-300">현재</span> · {current}</p>
              <p className="m-0 text-sm leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">다음 경계</span> · {hardening}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>처음 질문으로 돌아간다</h3>
          <p>
            “valid manifest + read-only requiredPermission”으로 증명되는 것은 제한적이다. loader가
            이해하는 형식이고, 정상 CLI policy가 그 tool을 read-only requirement로 분류한다는 것까지다.
            child process가 workspace 밖에 쓰지 못한다는 결론은 나오지 않는다. 그 결론에는 최소한
            filesystem sandbox나 제한된 OS identity, 모든 process entry point의 일관된 적용, escape
            regression test가 추가로 필요하다.
          </p>
          <p>
            plugin 시스템을 읽는 목적은 API 이름을 외우는 것이 아니다. declaration, discovery,
            authorization, containment, lifecycle, update를 서로 다른 증명 의무로 나누고, 각 단계가
            실제로 다음 단계에 무엇을 전달하는지 호출 그래프로 확인하는 것이 핵심이다.
          </p>
        </div>
      </section>
    </>
  );
}
