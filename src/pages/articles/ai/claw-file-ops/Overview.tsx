import { CitationBlock } from "@/components/ui/citation";

const operations = [
  ["read_file", "읽기", "offset과 limit으로 필요한 구간만 가져옵니다."],
  ["glob_search", "탐색", "파일 이름 패턴으로 후보를 좁힙니다."],
  ["grep_search", "탐색", "파일 내용에서 문자열이나 정규식을 찾습니다."],
  ["write_file", "변경", "새 파일을 만들거나 전체 내용을 교체합니다."],
  ["edit_file", "변경", "기존 내용의 정확한 위치를 찾아 일부를 수정합니다."],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        파일 도구는 탐색과 변경을 분리한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          코딩 에이전트가 파일시스템 전체를 한 번에 읽는 것은 비용도 크고 안전하지도 않습니다. 먼저 파일 이름과 내용을 검색해 후보를 좁히고 필요한 구간만 읽은 뒤 정확한 대상을 확인하고
          수정하는 흐름이 필요합니다. Claw Code의 파일 도구는 이 과정을 작은 연산으로 나눕니다.
        </p>
        <p>
          이 글은 commit <code>b71afdd</code>를 기준으로 합니다. 현재 구현은
          10 MB read cap, NUL byte 기반 binary 차단, line offset·limit, hard-coded
          directory 제외, glob 최대 100개와 regex grep을 제공합니다. 쓰기와
          edit는 직접 file을 갱신하며 expected digest나 atomic rename을 요구하지
          않으므로, 현재 기능과 production hardening을 분리해서 읽어야 합니다.
        </p>

        <div id="paper-claw-file-ops-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code file operations @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/file_ops.rs"
            citeKey={1}
            type="code"
          >
            <p>
              <strong>문제:</strong> workspace 안에서 bounded read, write, edit,
              glob과 grep primitive를 제공합니다. <strong>기여:</strong> pinned
              source는 line range, size·binary guard, canonical containment,
              WalkDir glob과 regex scan을 구현합니다. <strong>전제:</strong> commit,
              canonical workspace root, file tree와 request를 고정합니다.
              <strong> 근거 범위:</strong> 이 source와 unit test의 실제 동작입니다.
              <strong> 일반화 금지:</strong> handle-bound open, expected digest,
              unique edit, atomic replacement, stable cursor·snapshot과 multi-file
              transaction까지 구현됐다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {operations.map(([name, kind, description]) => (
          <div key={name} className="min-w-0 rounded-lg border bg-card p-4">
            <span className="text-xs font-medium text-muted-foreground">
              {kind}
            </span>
            <code className="mt-1 block break-words text-sm font-semibold text-primary">
              {name}
            </code>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          상대 경로도 최종 대상은 절대 경로로 판정한다
        </h3>
        <p>
          사용자가 지정한 워크스페이스를 기준점으로 삼고, 입력 경로를 정규화한
          뒤 최종 대상이 그 경계 안에 있는지 확인해야 합니다. 단순 문자열
          <code>startsWith</code> 비교는 <code>..</code>, 비슷한 접두사
          디렉터리, 심볼릭 링크 때문에 우회될 수 있으므로 경로 컴포넌트와 실제
          파일시스템 대상을 기준으로 검사해야 합니다.
        </p>
        <p>
          새 파일은 아직 <code>canonicalize</code>할 수 없다는 점도 중요합니다.
          이 경우 가장 가까운 기존 부모 디렉터리를 canonicalize한 뒤 새 파일명을
          결합하고, 쓰기 직전에도 심볼릭 링크가 바뀌지 않았는지 확인해야 합니다.
          검사와 사용 사이에 대상이 바뀌는 TOCTOU 문제까지 완전히 막으려면 OS의
          디렉터리 핸들 기반 API나 샌드박스가 필요합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          블랙리스트는 보조 정책일 뿐이다
        </h3>
        <p>
          <code>.env</code>, 개인 키, 버전 관리 내부 파일처럼 자주 보호하는
          패턴을 차단하면 실수를 줄일 수 있습니다. 그러나 파일명만으로 민감도를
          모두 알 수 없고 새 패턴도 계속 생기므로, 블랙리스트만으로 안전을
          보장할 수는 없습니다. 워크스페이스 경계, 최소 권한, 사용자 승인, 읽기
          전용 마운트 같은 더 강한 경계 위에 보조 규칙으로 두는 편이 맞습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이 글의 읽기 순서</h3>
        <p>
          <strong>읽기와 쓰기</strong>에서 현재 부분 읽기·직접 쓰기와 원자적 교체
          hardening의 차이를 확인한
          뒤,
          <strong>검색</strong>에서 큰 저장소의 후보를 줄이는 흐름을 살펴보면
          됩니다. 마지막 <strong>경계 검사</strong>에서는 경로 정규화, 심볼릭
          링크, 보호 패턴이 각각 어떤 공격과 실수를 막는지 구분합니다.
        </p>
      </div>
    </section>
  );
}
