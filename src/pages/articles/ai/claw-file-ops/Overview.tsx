import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import FileBoundaryLab from './viz/FileBoundaryLab';
import FileOpsToolsViz from './viz/FileOpsToolsViz';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">파일 도구가 shell과 달라야 하는 이유</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          에이전트가 “설정 파일 한 줄을 바꿔 줘”라는 요청을 받았다고 하자. shell 하나만 주면
          <code>cat</code>, <code>sed</code>, redirection, 임시 파일 등 수많은 실행 경로가 생긴다.
          반면 <code>read_file</code>, <code>write_file</code>, <code>edit_file</code>처럼 의도가 좁은
          도구는 입력 스키마, 권한, 출력 크기와 감사 로그를 각각 고정할 수 있다.
        </p>
        <p>
          이것이 곧 안전을 보장한다는 뜻은 아니다. 전용 도구는 <strong>검사할 표면을 줄인다.</strong>
          그 위에 permission gate, workspace boundary, 파일 형식·크기 제한, 실제 I/O semantics를
          차례로 쌓아야 한다. 아래 그림은 기능 목록이 아니라 각 도구가 남기는 side effect의 크기를
          읽는 지도다.
        </p>
      </div>

      <p className="not-prose my-5 text-sm leading-relaxed">
        <strong>먼저 답할 질문.</strong> 경로가 workspace 안이라고 검사한 뒤 실제 파일을 열기 전에
        ancestor symlink가 외부 대상으로 바뀌면, 방금 검사한 안전 판정은 여전히 유효한가?
      </p>
      <FileBoundaryLab />
      <FileOpsToolsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>먼저 구분할 세 종류의 계약</h3>
        <div className="not-prose my-5 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {[
            {
              title: '정책 계약',
              text: '이 사용자·모드가 read 또는 write action을 요청할 수 있는가. 권한 글이 담당한다.',
              example: 'ReadOnly → write 거부',
            },
            {
              title: '경계 계약',
              text: '요청한 path가 workspace 내부의 대상을 가리키는가. 현재 helper가 계산하지만 production I/O 경로에는 아직 연결되지 않았다.',
              example: 'link → /etc/passwd 차단',
            },
            {
              title: '변경 계약',
              text: '쓰기 도중 실패하거나 다른 프로세스가 수정해도 어떤 결과를 보장하는가. atomicity·durability·version check가 담당한다.',
              example: 'temp + fsync + rename',
            },
          ].map((item) => (
            <div key={item.title} className="min-w-0 bg-background p-4">
              <p className="m-0 text-sm font-bold">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              <code className="mt-3 block break-words text-xs text-foreground">{item.example}</code>
            </div>
          ))}
        </div>
        <p>
          기존 설명에서 가장 놓치기 쉬운 부분은 첫 두 계약을 통과하면 세 번째도 해결됐다고 생각하는
          것이다. 현재 Claw의 production <code>read_file</code>은 파일 크기와 binary probe를 적용하고
          write는 직접 <code>fs::write</code>를 호출한다. 경로 정규화와 workspace prefix helper도
          같은 소스에 있지만 <strong>production read/write/edit에는 아직 배선되지 않은 dead-code
          wrapper</strong>다. 따라서 경계 강제, 원자적 교체, 저장장치 내구성을 모두 별도 hardening
          항목으로 봐야 한다.
        </p>

        <h3>현재 구현을 읽는 출발점</h3>
        <p>
          읽기·쓰기·편집 함수는 같은 파일에 있지만 보장은 서로 다르다. 먼저 실제 코드를 열어 함수가
          수행하는 순서만 확인하고, 뒤 섹션에서 각 단계의 실패 모드를 붙인다.
        </p>
        <div className="not-prose my-4 flex flex-wrap gap-2">
          <CodeViewButton onClick={() => onCodeRef('production-wiring', codeRefs['production-wiring'])} label="production file dispatch 보기" />
          <CodeViewButton onClick={() => onCodeRef('read-contract', codeRefs['read-contract'])} label="read_file 소스" />
          <CodeViewButton onClick={() => onCodeRef('write-contract', codeRefs['write-contract'])} label="write_file 소스" />
          <CodeViewButton onClick={() => onCodeRef('path-boundary', codeRefs['path-boundary'])} label="경로 경계 소스" />
        </div>

        <h3>왜 shell 대신 전용 도구인가</h3>
        <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
          {[
            ['권한을 작게 준다', 'read는 관찰만, edit와 write는 workspace 변경, shell은 프로세스·네트워크까지 확장될 수 있다.'],
            ['입력을 구조화한다', 'offset, limit, old_string처럼 허용된 동작을 schema로 제한한다.'],
            ['출력을 예측 가능하게 만든다', '줄 창과 structured patch로 LLM context와 사용자 검토 범위를 제한한다.'],
            ['감사를 쉽게 만든다', '“파일을 읽었다”와 “임의 명령을 실행했다”를 같은 로그 사건으로 취급하지 않는다.'],
            ['플랫폼 차이를 줄인다', 'Unix 명령의 존재 여부와 quoting 규칙에 의존하지 않는다.'],
          ].map(([title, text], index) => (
            <div key={title} className="grid gap-2 px-4 py-3 sm:grid-cols-[28px_150px_1fr]">
              <span className="text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <strong className="text-sm">{title}</strong>
              <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
        <p>
          결론은 “전용 도구라 샌드박스가 필요 없다”가 아니다. 전용 도구는 공격 표면을 줄이고 더
          구체적인 invariants를 만들 수 있게 한다. 로컬에서 경로를 동시에 바꿀 수 있는 공격자까지
          가정하면 open-time 강제나 OS sandbox가 여전히 필요하다.
        </p>
      </div>
    </section>
  );
}
