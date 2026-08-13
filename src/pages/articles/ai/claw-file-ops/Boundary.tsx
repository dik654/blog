import PathAttackVectorsViz from "./viz/PathAttackVectorsViz";
import SymlinkEscapeViz from "./viz/SymlinkEscapeViz";

const platformRisks = [
  ["POSIX", "symlink·hard link·mount point·rename race"],
  ["Windows", "junction·reparse point·UNC·device path·case folding"],
  ["New path", "존재하지 않아 final target을 canonicalize할 수 없음"],
  ["Shared FS", "다른 process가 검사와 open 사이에 parent를 교체"],
] as const;

export default function Boundary() {
  return (
    <section id="boundary" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Workspace boundary는 문자열 검사가 아니라 실제 file open 경계다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <code>workspace/foo</code>처럼 보이는 path도 <code>..</code>, symlink,
          junction과 mount를 따라가면 전혀 다른 target을 가리킬 수 있습니다.
          입력 문자열을 깨끗하게 만드는 lexical normalization은 필요한 첫
          단계지만, 실제 filesystem target이 boundary 안이라는 보장은 아닙니다.
        </p>
        <p className="leading-7">
          따라서 path authorization은 canonical target 확인, component 기반
          containment, race-resistant open과 sandbox mount를 겹쳐 사용합니다. 각
          계층이 막는 문제가 다르므로 <code>startsWith</code> 한 번이나
          blacklist로 대체할 수 없습니다.
        </p>

        <div className="not-prose my-8">
          <SymlinkEscapeViz />
        </div>

        <div className="not-prose my-8">
          <PathAttackVectorsViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {platformRisks.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          containment는 path component로 비교한다
        </h3>
        <p className="leading-7">
          <code>/work/app</code>와 <code>/work/application</code>은 문자열
          prefix를 공유하지만 같은 directory tree가 아닙니다. platform 규칙에
          따라 separator, case와 volume을 정규화하고 canonical workspace와
          target의 component 관계를 비교해야 합니다. absolute path라고 무조건
          거부할 필요는 없지만 반드시 허용된 root 안인지 판정합니다.
        </p>
        <p className="leading-7">
          Windows에서는 UNC와 device namespace, drive-relative path, junction과
          reparse point를 별도로 처리해야 합니다. POSIX의 canonicalize 동작을
          그대로 이식했다고 가정하지 말고 platform별 test corpus를 둡니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          새 file은 가장 가까운 기존 parent에서 시작한다
        </h3>
        <p className="leading-7">
          아직 존재하지 않는 target은 final path를 canonicalize할 수 없습니다.
          가장 가까운 기존 parent를 canonicalize하고 boundary 안인지 확인한 뒤,
          남은 component에 <code>..</code>, separator와 platform special name이
          없는지 검사합니다. 생성 mode는 기존 target을 따라가지 않는 옵션을
          사용합니다.
        </p>
        <p className="leading-7">
          parent directory 생성이 포함된다면 각 component를 순서대로 만들고 열린
          directory handle을 기준으로 다음 component를 처리합니다. 전체 문자열을
          다시 resolve하는 방식은 중간 directory가 바뀌는 race에 취약합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          canonicalize와 open 사이의 race를 줄인다
        </h3>
        <p className="leading-7">
          공격자가 검사 뒤 symlink를 교체하면 canonicalize 결과가 안전해도 실제
          open은 boundary 밖으로 갈 수 있습니다. Linux에서는 threat model에 따라
          directory fd와 <code>openat2</code>의 <code>RESOLVE_BENEATH</code>,
          <code>RESOLVE_NO_SYMLINKS</code> 같은 기능을 검토하고, 다른
          platform에서는 handle 기반 API와 final object identity 재검증을
          사용합니다.
        </p>
        <p className="leading-7">
          이 문제를 TOCTOU라고 하며 portable string code만으로 완전히 없애기
          어렵습니다. writable mount 자체를 workspace로 제한한 sandbox를 마지막
          경계로 두면 application-level 검사가 실패해도 host 전체로 피해가
          번지는 것을 줄일 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          민감 file 정책과 workspace containment를 분리한다
        </h3>
        <p className="leading-7">
          <code>.env</code>, private key와 <code>.git</code> 내부 file은
          workspace 안에 있어도 읽기·수정을 제한할 수 있습니다. 이는 boundary
          check가 아니라 resource policy이므로 path containment를 통과한 뒤 별도
          rule로 판정하고 사용자에게 정확한 reason을 보여줍니다.
        </p>
        <p className="leading-7">
          blacklist에 없는 이름이 안전하다는 뜻은 아닙니다. secret scanner와
          repository metadata는 보조 evidence로 쓰고, 최소
          권한·approval·read-only mount를 기본 경계로 유지합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          audit에는 입력과 실제 target을 함께 남긴다
        </h3>
        <p className="leading-7">
          incident를 재현하려면 사용자가 준 relative path, canonical resource,
          operation, decision과 final object identity가 필요합니다. 다만
          username, secret path와 file content는 redaction하고 access-controlled
          detail로 분리합니다.
        </p>
      </div>
    </section>
  );
}
