import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PathAttackVectorsViz from './viz/PathAttackVectorsViz';
import SymlinkEscapeViz from './viz/SymlinkEscapeViz';

export default function Boundary({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="boundary" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Workspace 경계는 언제 확정되는가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>workspace/src/main.rs</code>가 workspace 안이라는 말에는 시간이 빠져 있다. 경로 문자열을
          받은 순간, 심링크를 해석한 순간, 실제 file descriptor를 얻은 순간의 대상은 서로 다를 수
          있다. 안전 설계는 이 세 순간을 한 단계로 압축하지 않는다.
        </p>
        <p>
          Rust의 <code>Path::starts_with</code>는 <code>/work</code>와 <code>/workspace</code>를
          raw string prefix로 혼동하지 않고 전체 path component를 비교한다. 그러나 path object가 어떤
          inode를 가리킬지는 파일 시스템 해석 결과이며, 그 결과도 다음 syscall 전에 바뀔 수 있다.
        </p>
      </div>

      <SymlinkEscapeViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>현재 Claw 소스의 helper: 아직 production 경계가 아니다</h3>
        <p>
          존재하는 경로는 <code>canonicalize()</code>하고, 새 파일은 부모를 canonicalize한 뒤 basename을
          다시 붙인다. workspace wrapper는 canonical root와 결과를 <code>starts_with</code>로 비교한다.
          이 코드는 이미 존재하는 ancestor symlink를 포함한 많은 이탈을 막을 수 있는 출발점이다.
          하지만 세 wrapper에는 <code>#[allow(dead_code)]</code>가 붙어 있고 production
          <code>read_file</code>, <code>write_file</code>, <code>edit_file</code> 호출 경로는 이들을
          부르지 않는다. 현재 보장과 후보 구현을 섞어 읽으면 안 된다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton onClick={() => onCodeRef('path-boundary', codeRefs['path-boundary'])} label="normalize/workspace wrapper 536-628줄 보기" />
        </div>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['존재하는 read/edit', 'candidate.canonicalize()', '현재의 중간 component와 최종 symlink를 해석한다.'],
            ['새 파일 write', 'parent.canonicalize() + basename', '아직 없는 leaf 대신 존재하는 부모의 실제 위치를 확인한다.'],
            ['workspace 비교', 'resolved.starts_with(canonical_root)', 'dead-code wrapper 안에서 현재 해석 결과의 소속을 확인한다.'],
            ['production I/O', '일반 read_file/write_file/edit_file', '현재 wrapper를 호출하지 않아 workspace boundary 자체가 강제되지 않는다.'],
            ['wrapper를 배선해도', 'check 후 일반 I/O 재호출', '검증한 descriptor를 이어 쓰지 않아 check-use 사이 race가 남는다.'],
          ].map(([when, operation, meaning]) => (
            <div key={when} className="grid gap-2 px-4 py-3 sm:grid-cols-[140px_210px_1fr]">
              <strong className="text-sm">{when}</strong>
              <code className="break-words whitespace-normal text-xs">{operation}</code>
              <span className="text-sm leading-relaxed text-muted-foreground">{meaning}</span>
            </div>
          ))}
        </div>
        <p>
          우선 production dispatcher가 반드시 workspace-aware entry point를 호출하도록 배선하고 그
          invariant를 테스트해야 한다. 그다음에도 부모 <code>canonicalize</code>는 TOCTOU를 제거하지
          않는다. 검사 직후 공격자가 부모를 심링크로 교체할 수 있다. 또 부모 canonicalize 실패 시 raw
          parent로 돌아가는 분기는 존재하지 않는 다중 디렉터리 생성에서 더 엄격한 정책이 필요하다.
        </p>

        <h3>경로 공격을 실패 지점별로 본다</h3>
        <p>
          <code>..</code>, 심링크, namespace path를 “나쁜 문자열” 목록으로만 보면 우회 변형을 끝없이
          쫓게 된다. 어느 단계가 관찰할 수 있고 어느 단계가 실제로 닫을 수 있는지 구분한다.
        </p>
      </div>

      <PathAttackVectorsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Linux에서 open 시점에 닫는 방식</h3>
        <p>
          강한 설계는 canonical workspace directory의 file descriptor를 기준점으로 보관하고, 사용자
          path를 그 descriptor에 상대적으로 연다. Linux <code>openat2</code>의
          <code>RESOLVE_BENEATH</code>는 모든 해석을 기준 디렉터리 아래로 제한하고,
          <code>RESOLVE_IN_ROOT</code>는 그 directory를 임시 root처럼 취급한다.
          정책에 따라 <code>RESOLVE_NO_SYMLINKS</code>도 더할 수 있다.
        </p>
        <div className="not-prose my-5 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {[
            ['dirfd', '신뢰한 workspace directory를 먼저 열고 handle을 유지한다.'],
            ['relative resolution', '사용자 path를 process CWD가 아닌 dirfd에 상대적으로 해석한다.'],
            ['kernel constraint', 'open을 수행하는 바로 그 syscall이 BENEATH/IN_ROOT/NO_SYMLINKS 조건을 확인한다.'],
          ].map(([title, text], index) => (
            <div key={title} className="bg-background p-4">
              <p className="text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</p>
              <p className="mt-2 text-sm font-semibold">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <p>
          구형 플랫폼에서는 component마다 <code>openat</code>와 <code>O_NOFOLLOW</code>를 사용해
          descriptor-relative walk를 구성할 수 있지만 구현과 검증이 더 어렵다. 핵심은 “안전하다고
          검사한 문자열”이 아니라 “제약을 걸어 얻은 handle”을 이후 read/write에 계속 사용하는 것이다.
        </p>

        <h3>Windows는 prefix 하나로 설명할 수 없다</h3>
        <p>
          Windows에는 drive-relative path, UNC share, device namespace, extended-length
          <code>\\?\</code> path, junction과 reparse point가 있다. <code>\\?\</code>는 단순히
          260자 제한을 우회하는 공격 문자열이 아니라 Win32 parsing을 줄이고 extended-length path를
          표현하는 namespace다. 따라서 문자열 prefix 일괄 차단만으로 정확한 정책을 만들 수 없다.
        </p>
        <p>
          production 구현은 Windows path parser로 namespace를 분류하고, canonical workspace volume과
          final handle이 가리키는 대상을 비교하며, reparse point 정책을 명시해야 한다. Unix와 동일한
          문자열 규칙을 공유하기보다 “workspace 밖 handle을 얻지 않는다”는 invariant를 플랫폼별 API로
          구현하는 편이 안전하다.
        </p>

        <h3>테스트는 최종 symlink 하나로 끝나지 않는다</h3>
        <div className="not-prose my-5 grid gap-3 sm:grid-cols-2">
          {[
            ['ancestor symlink', 'workspace/a/b에서 a가 외부를 가리키는 경우'],
            ['swap race', '검사와 open 사이 parent 또는 leaf를 반복 교체하는 경우'],
            ['missing ancestors', '아직 없는 a/b/file을 만들 때 raw parent fallback이 생기는 경우'],
            ['internal symlink policy', 'workspace 내부 alias를 허용할지 명시하고 일관되게 테스트'],
            ['cross-device rename', 'atomic replace temp가 다른 filesystem에 놓이는 경우'],
            ['Windows reparse/UNC', 'junction, device namespace와 network share를 각각 검증'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md border border-border p-4">
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <p>
          현재 Claw에는 canonicalize와 workspace check를 구현한 후보 helper가 있지만 production
          boundary로 연결돼 있지 않다. 먼저 모든 파일 도구를 그 경계에 배선한 뒤, 로컬 동시 공격자,
          고가치 secret, unattended automation을 가정한다면 descriptor-relative open과 OS sandbox를
          추가해야 한다. 지원하지 않는 플랫폼에서는 위험한 변경을 fail-closed로 거부한다.
        </p>
      </div>
    </section>
  );
}
