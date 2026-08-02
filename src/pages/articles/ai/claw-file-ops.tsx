import Overview from './claw-file-ops/Overview';
import ReadWrite from './claw-file-ops/ReadWrite';
import Search from './claw-file-ops/Search';
import Boundary from './claw-file-ops/Boundary';
import OriginalDiff from './claw-file-ops/OriginalDiff';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { codeRefs } from './claw-file-ops/codeRefs';

export default function ClawFileOpsArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <QuestionLead
        question="에이전트가 workspace 안의 파일만 고치게 하려면 경로를 한 번 검사하는 것으로 충분할까?"
        answer={<>아니다. 정책은 <strong>무엇을 허용할지</strong> 정하고, 경로 해석은 <strong>지금 무엇을 가리키는지</strong> 확인하며, 실제 open/write 시점에는 그 대상이 바뀌지 않았음을 강제해야 한다. 이 글은 현재 Claw 구현과 더 강한 설계를 구분해 읽는다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'workspace', meaning: '에이전트가 읽고 쓸 수 있다고 약속한 프로젝트 루트.', why: '경계를 정의하지 않으면 상대 경로와 절대 경로의 허용 여부를 판정할 기준이 없다.' },
          { term: 'canonicalize', meaning: '경로의 중간 요소와 심링크를 해석해 현재 파일 시스템의 실제 절대 경로를 얻는 연산.', why: '문자열상 workspace 안인 link가 실제로는 /etc 같은 외부를 가리킬 수 있다.' },
          { term: 'TOCTOU', meaning: '검사한 때와 사용한 때 사이에 대상이 바뀌는 race condition.', why: 'canonicalize 결과가 옳아도 이후 open 전에 심링크나 부모 디렉터리가 교체될 수 있다.' },
          { term: 'atomicity와 durability', meaning: 'atomicity는 중간 상태를 보이지 않는 성질, durability는 성공 응답 뒤 전원 장애에도 남는 성질.', why: '직접 write, temp+rename, fsync는 서로 다른 보장을 제공하므로 같은 말로 묶으면 안 된다.' },
        ]}
      />
      <Misconception>
        <code>Path::starts_with</code>는 단순 문자열 prefix보다 안전한 component 비교지만, 그 사실만으로 실제 파일 대상을 고정하지는 않는다. 이 글에서 <strong>현재 코드</strong>와 <strong>권장 hardening</strong>을 같은 것으로 읽지 않는다.
      </Misconception>
      <Overview onCodeRef={sidebar.open} />
      <ReadWrite onCodeRef={sidebar.open} />
      <Search onCodeRef={sidebar.open} />
      <Boundary onCodeRef={sidebar.open} />
      <OriginalDiff />
      <CapabilityCheck
        title="이 글을 읽은 뒤 설계 리뷰에서 확인할 것"
        items={[
          'lexical 검사, resolved-target 검사, open-time 강제를 서로 다른 단계로 설명한다.',
          'binary probe 실패와 UTF-8 decoding 실패를 구분한다.',
          '직접 write의 부분 갱신·내구성 한계와 atomic replace의 조건을 설명한다.',
          'read-match-write 편집에서 concurrent modification을 탐지하는 방식을 제안한다.',
          '최종 심링크뿐 아니라 ancestor symlink와 검사 후 교체 race를 테스트한다.',
          '다음 글에서 shell의 문자열 검증과 OS sandbox가 맡는 책임을 연결한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-3 text-sm">
        <span>이전: <InternalLink slug="claw-permissions" learningPathId="ai-claw-security">Permission이 action을 허용하는 법</InternalLink></span>
        <span>다음: <InternalLink slug="claw-bash" learningPathId="ai-claw-security">Shell side effect를 격리하는 법</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw file_ops.rs · ab4498', href: 'https://github.com/ultraworkers/claw-code/blob/ab44985916cb0d53d2f7a55ea90e0d7be97d4626/rust/crates/runtime/src/file_ops.rs', note: 'read/write/edit/search와 아직 production에 배선되지 않은 workspace wrapper의 고정 원문. 본문 코드 패널과 byte-identical하다.' },
          { label: 'Claw tools dispatch · ab4498', href: 'https://github.com/ultraworkers/claw-code/blob/ab44985916cb0d53d2f7a55ea90e0d7be97d4626/rust/crates/tools/src/lib.rs', note: 'production tool entry가 일반 read/write/edit/search 함수를 호출한다는 wiring 근거.' },
          { label: 'Rust std::fs::canonicalize', href: 'https://doc.rust-lang.org/std/fs/fn.canonicalize.html', note: '심링크 해석, 존재 조건, Windows extended path 주의점의 기준.' },
          { label: 'Rust Path::starts_with', href: 'https://doc.rust-lang.org/std/path/struct.Path.html#method.starts_with', note: 'raw string이 아니라 전체 path component를 비교한다.' },
          { label: 'Linux openat2(2)', href: 'https://www.man7.org/linux/man-pages/man2/openat2.2.html', note: 'RESOLVE_BENEATH, RESOLVE_IN_ROOT, RESOLVE_NO_SYMLINKS로 open 시점 경계를 강제하는 방법.' },
          { label: 'Windows Naming Files, Paths, and Namespaces', href: 'https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file', note: 'UNC, device namespace와 extended-length path를 구분하는 공식 설명.' },
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
