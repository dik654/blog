import { CodeSidebar, useCodeSidebar } from '@/components/code';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import Rebuilt from './claw-plugin/Rebuilt';
import { codeRefs } from './claw-plugin/codeRefs';

export default function ClawPluginArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <QuestionLead
        question="매니페스트가 valid하고 requiredPermission이 read-only면, spawned process가 workspace 밖에 쓰지 못한다고 증명할 수 있을까?"
        answer={<>아니다. manifest validation은 <strong>입력 계약</strong>, requiredPermission은 <strong>실행 승인 조건</strong>이다. child process의 filesystem·network·resource 권한을 줄이는 <strong>OS containment</strong>는 별도 계층이며 현재 plugin 실행 경로에는 없다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'origin과 capability', meaning: 'origin은 plugin이 builtin·bundled·external 중 어디서 왔는지, capability는 hooks·tools·lifecycle처럼 무엇을 제공하는지다.', why: '실제 PluginKind는 capability 분류가 아니므로 두 축을 섞으면 manifest와 registry를 처음부터 잘못 읽게 된다.' },
          { term: 'declaration과 enforcement', meaning: 'manifest에 값을 적는 것과 runtime 또는 OS가 그 값을 실제로 강제하는 것은 다르다.', why: 'top-level permissions는 parse되지만 runtime definition으로 이어지지 않고, tool requiredPermission도 process sandbox는 아니다.' },
          { term: 'authorization과 containment', meaning: 'authorization은 요청을 시작해도 되는지, containment는 시작된 code가 만들 수 있는 효과를 어디까지 제한할지 결정한다.', why: 'read-only label을 filesystem read-only sandbox로 오해하는 보안 결함을 막는다.' },
          { term: 'transactional update', meaning: '새 version 준비·검증·전환이 하나의 복구 가능한 상태 변화처럼 보이는 성질.', why: '기존 directory를 먼저 지우고 복사하면 중간 실패 때 정상 version이 하나도 남지 않을 수 있다.' },
        ]}
      />
      <Misconception>
        subprocess는 별도 address space를 주지만 자동으로 sandbox가 되지는 않는다. 같은 OS 사용자로 실행되고 namespace·rlimit·timeout을 바꾸지 않으면 파일, network, CPU와 memory 권한은 그대로다.
      </Misconception>
      <Rebuilt onCodeRef={sidebar.open} />
      <CapabilityCheck
        title="이 글을 읽은 뒤 코드 리뷰에서 답할 것"
        items={[
          'PluginKind의 세 variant를 기능이 아니라 출처와 설치 관리 의미로 설명한다.',
          'plugin.json 검증이 보장하는 것과 signature·semver·root containment처럼 보장하지 않는 것을 구분한다.',
          'discovery report가 valid plugin과 load failure를 함께 보관하면서 strict registry에서는 실패하는 지점을 찾는다.',
          'plugin-plugin, plugin-builtin/runtime tool name 충돌이 각각 어느 registry에서 검출되는지 설명한다.',
          'PreToolUse → PermissionPolicy → CliToolExecutor → PluginTool::execute 순서를 실제 호출 경로로 재구성한다.',
          'read-only requiredPermission이 child process의 filesystem write를 막지 못하는 반례를 든다.',
          '동기 wait, 무제한 output, sandbox 부재와 init/shutdown 첫 실패의 운영 영향을 설명한다.',
          'remove-then-copy update를 staging·atomic switch·rollback 구조로 바꾸는 설계를 제안한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-3 text-sm">
        <span>선행 권장: <InternalLink slug="claw-hooks" learningPathId="ai-claw-lifecycle">Hook이 tool 실행 전후에 개입하는 법</InternalLink></span>
        <span>함께 읽기: <InternalLink slug="claw-permissions" learningPathId="ai-claw-security">Authorization과 containment 분리</InternalLink></span>
        <span>다음: <InternalLink slug="claw-mcp" learningPathId="ai-claw-infra">장기 실행 process와 MCP lifecycle</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw plugins crate', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/plugins/src/lib.rs', note: 'PluginKind, manifest, install/discovery, registry, tool process와 lifecycle의 원문. 본문 패널은 2026-07-26 commit snapshot을 사용한다.' },
          { label: 'Claw plugin hooks', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/plugins/src/hooks.rs', note: 'Pre/Post/Failure hook shell process와 exit-code 계약.' },
          { label: 'Claw global tool registry', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/tools/src/lib.rs', note: 'builtin·plugin·runtime tool 충돌과 requiredPermission 변환 경로.' },
          { label: 'Rust std::process::Command', href: 'https://doc.rust-lang.org/std/process/struct.Command.html', note: 'child process 생성, stdio, current_dir의 표준 동작. Command 자체는 sandbox API가 아니다.' },
          { label: 'Linux namespaces', href: 'https://man7.org/linux/man-pages/man7/namespaces.7.html', note: 'mount·network·PID 등 process가 볼 자원을 격리하는 OS mechanism의 기준.' },
          { label: 'Linux resource limits', href: 'https://man7.org/linux/man-pages/man2/getrlimit.2.html', note: 'CPU, address space, file size 같은 resource limit은 명시적으로 설정해야 한다.' },
        ]}
      />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{}}
        projectMetas={{
          'claw-code': {
            id: 'claw-code',
            label: 'Claw Code · Rust',
            badgeClass: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
          },
        }}
      />
    </>
  );
}
