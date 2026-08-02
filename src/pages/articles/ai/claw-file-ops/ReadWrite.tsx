import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ReadWriteViz from './viz/ReadWriteViz';

export default function ReadWrite({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="read-write" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">읽기·쓰기·편집의 보장은 서로 다르다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          세 함수는 모두 path와 text를 다루지만 실패의 의미가 다르다. 읽기는 “이 바이트를 text로
          해석해 context에 넣어도 되는가”를 묻는다. 쓰기는 “중간 실패에도 기존 파일을 보존하는가”를
          묻는다. 편집은 여기에 “내가 읽은 뒤 누군가 바꾸지 않았는가”라는 동시성 질문까지 더한다.
        </p>
      </div>

      <ReadWriteViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>1. read_file: 크기, binary, encoding은 세 개의 gate다</h3>
        <p>
          현재 구현은 <code>metadata.len()</code>으로 크기를 먼저 확인하고, NUL byte probe로 binary
          가능성을 거른 뒤, <code>fs::read_to_string</code>으로 전체 파일을 UTF-8 text로 읽는다.
          마지막에 <code>offset</code>과 <code>limit</code>을 줄 단위로 적용한다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton onClick={() => onCodeRef('read-contract', codeRefs['read-contract'])} label="read_file 175-220줄 보기" />
        </div>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['크기 초과', '읽기 전에 metadata로 거부한다.', '메모리와 LLM context 폭주를 막는다.'],
            ['binary 의심', '앞부분에서 NUL byte를 발견하면 거부한다.', 'text 출력에 제어 바이트가 섞이는 일을 줄인다.'],
            ['UTF-8 오류', 'binary probe는 통과했지만 read_to_string이 실패한다.', 'Latin-1, CP949, UTF-16 같은 text도 별도 decoding 정책 없이는 읽지 못한다.'],
            ['줄 창', '성공한 UTF-8 text에서 offset/limit을 적용한다.', '파일 전체를 이미 읽은 뒤라 I/O 절약보다 출력/context 제한의 의미가 크다.'],
          ].map(([failure, behavior, why]) => (
            <div key={failure} className="grid gap-2 px-4 py-3 sm:grid-cols-[110px_180px_1fr]">
              <strong className="text-sm">{failure}</strong>
              <span className="text-sm text-muted-foreground">{behavior}</span>
              <span className="text-sm leading-relaxed">{why}</span>
            </div>
          ))}
        </div>
        <p>
          따라서 “binary가 아니다”와 “읽을 수 있는 문자열이다”는 동의어가 아니다. production 도구는
          encoding을 자동 추측할지, UTF-8만 허용하고 명확한 오류를 낼지 정책을 선택해야 한다.
          자동 추측은 편리하지만 잘못 디코딩한 내용을 다시 저장해 파일을 손상시킬 수 있다.
        </p>

        <h3>2. write_file: 직접 쓰기와 atomic replace를 구분한다</h3>
        <p>
          현재 구현은 크기 상한을 확인하고, 새 경로를 정규화하며, 기존 내용을 읽어 patch용으로
          보관한다. 이후 부모 디렉터리를 만든 뒤 <code>fs::write</code>로 대상 파일에 직접 쓴다.
          여기서 <code>original_file</code>은 결과 설명용이지 rollback backup이 아니다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton onClick={() => onCodeRef('write-contract', codeRefs['write-contract'])} label="write_file 224-255줄 보기" />
        </div>
        <div className="not-prose my-5 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {[
            {
              title: '현재: direct write',
              text: '대상 파일을 바로 truncate/write한다. 프로세스 중단이나 I/O 오류 때 이전 내용과 새 내용 중 어느 것도 온전하지 않을 수 있다.',
            },
            {
              title: '개선: atomic replace',
              text: '같은 디렉터리에 temp를 완전히 쓰고 권한을 맞춘 뒤 rename으로 교체한다. 관찰자가 중간 내용을 보지 않게 한다.',
            },
            {
              title: '추가: durability',
              text: '성공 응답 뒤 전원 장애까지 견디려면 temp fsync, rename, 필요 시 parent directory fsync 순서를 검토한다.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-background p-4">
              <p className="m-0 text-sm font-bold">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
        <p>
          temp+rename도 모든 것을 해결하지 않는다. temp가 다른 filesystem에 있으면 rename이 원자적이지
          않을 수 있고, 기존 mode/owner를 보존해야 하며, rename 성공과 디스크 영속성은 별개다.
          “atomic”이라는 단어를 쓸 때 어떤 관찰자와 어떤 failure model을 가정했는지 적어야 한다.
        </p>

        <h3>3. edit_file: read → match → write 사이에 시간이 흐른다</h3>
        <p>
          현재 편집은 파일 전체를 읽고 <code>old_string</code>을 찾은 뒤 <code>replacen</code> 또는
          <code>replace</code>를 수행하고 전체 파일을 다시 쓴다. 매칭이 정확하더라도 읽기 직후 다른
          editor가 내용을 바꾸면 그 변경을 조용히 덮어쓸 수 있다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton onClick={() => onCodeRef('edit-contract', codeRefs['edit-contract'])} label="edit_file 258-295줄 보기" />
        </div>
        <div className="not-prose my-5 rounded-md border border-border">
          <div className="grid gap-2 border-b border-border bg-muted/20 px-4 py-3 sm:grid-cols-[120px_1fr]">
            <strong className="text-sm">위험한 순서</strong>
            <code className="break-words whitespace-normal text-xs">read A → user writes B → agent writes edit(A) → B 소실</code>
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold">version 확인</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">읽은 bytes의 hash 또는 inode+mtime을 쓰기 직전에 재검증한다.</p>
            </div>
            <div>
              <p className="text-sm font-semibold">충돌 시 중단</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">자동 merge보다 최신 내용을 다시 읽고 edit를 재계획하게 한다.</p>
            </div>
            <div>
              <p className="text-sm font-semibold">atomic replace</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">검증한 새 내용을 temp에 쓰고 원자적으로 교체한다.</p>
            </div>
          </div>
        </div>
        <p>
          안전한 편집의 핵심은 fuzzy matching보다 먼저 <strong>내가 바꾸려던 버전이 여전히 현재
          버전인가</strong>를 증명하는 것이다. fuzzy suggestion, dry-run과 diff UI는 LLM ergonomics와
          사용자 검토를 개선하지만 stale overwrite 자체를 막지는 않는다.
        </p>
      </div>
    </section>
  );
}
