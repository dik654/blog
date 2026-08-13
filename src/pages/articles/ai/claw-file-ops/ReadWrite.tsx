import ReadWriteViz from "./viz/ReadWriteViz";

const resultFields = [
  ["Identity", "canonical path·file type·before/after digest"],
  ["Range", "byte 또는 line 기준과 실제 반환 구간"],
  ["Volume", "bytes·lines·truncated·next cursor"],
  ["Mutation", "created·replaced·edited와 atomic 여부"],
] as const;

export default function ReadWrite() {
  return (
    <section id="read-write" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        읽기는 필요한 snapshot만, 쓰기는 예상한 version에 원자적으로 적용한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          file tool은 path를 문자열로 받아 내용을 반환하는 얇은 wrapper가
          아닙니다. workspace 안의 실제 대상을 판정하고, file type과 크기를
          확인하며, 모델 context에 들어갈 범위를 제한해야 합니다. 변경 작업은
          읽었을 때의 version이 그대로인지 확인한 뒤 적용해야 다른 process나
          사용자의 작업을 덮어쓰지 않습니다.
        </p>
        <p className="leading-7">
          분석 snapshot의 <code>read_file</code>, <code>write_file</code>,
          <code>edit_file</code>은 이 세 책임을 서로 다른 interface로 나눕니다.
          이름보다 중요한 차이는 전체 교체와 조건부 부분 수정이 요구하는
          precondition이 다르다는 점입니다.
        </p>

        <div className="not-prose my-8">
          <ReadWriteViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {resultFields.map(([title, body]) => (
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
          read_file은 range semantics를 명확히 한다
        </h3>
        <p className="leading-7">
          <code>offset</code>과 <code>limit</code>이 byte인지 line인지 명시하지
          않으면 UTF-8 중간을 자르거나 사용자가 예상한 줄과 다른 내용을 돌려줄
          수 있습니다. text read는 line range와 실제 line number를, binary
          read는 별도 byte API나 artifact reference를 사용하는 편이 안전합니다.
        </p>
        <p className="leading-7">
          open 전에는 canonical resource와 read permission을 확인하고 regular
          file인지 검사합니다. device, FIFO와 socket을 일반 file처럼 읽으면
          block 또는 예상하지 못한 side effect가 생길 수 있습니다. size limit를
          넘으면 앞부분을 조용히 잘라내지 말고 truncated와 다음 range를
          반환합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          edit_file은 unique match보다 version precondition이 먼저다
        </h3>
        <p className="leading-7">
          <code>old_string</code>이 정확히 한 번 나타날 때만 바꾸는 방식은
          모델의 대상을 명확히 하는 좋은 기본값입니다. 0회면 stale input, 여러
          번이면 ambiguous match로 실패하고 주변 context나 line range를 더
          요청하게 할 수 있습니다.
        </p>
        <p className="leading-7">
          그러나 unique match만으로 race를 막을 수는 없습니다. 모델이 file을
          읽은 뒤 다른 process가 내용을 바꿨을 수 있으므로{" "}
          <code>expected_digest</code>
          또는 version을 함께 요구하고 현재 값이 다르면 edit 전체를 중단합니다.
          여러 occurrence를 바꾸려면 예상 count를 명시하는 별도 operation으로
          의도를 드러냅니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          write_file은 overwrite 의도를 분리한다
        </h3>
        <p className="leading-7">
          새 file 생성과 기존 file 전체 교체를 같은 default로 처리하면 이름
          오타가 기존 내용을 지울 수 있습니다. <code>create_new</code>,
          <code>replace_existing(expected_digest)</code>처럼 mode를 분리하고,
          대상이 예상과 다르면 실패해야 합니다.
        </p>
        <p className="leading-7">
          content는 같은 directory의 temporary file에 쓰고 permission·encoding을
          확인한 뒤 atomic rename으로 교체합니다. durability가 필요하면 file과
          parent directory의 fsync 정책도 정합니다. atomic rename은 한 file의
          교체만 보장하며 여러 file 변경 전체를 transaction으로 만들지는
          않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          newline과 encoding 변환을 숨기지 않는다
        </h3>
        <p className="leading-7">
          부분 수정 과정에서 LF·CRLF나 final newline을 무조건 정규화하면
          의도하지 않은 대규모 diff가 생깁니다. 기존 encoding과 newline style을
          보존하고, 변환이 필요하면 formatter나 explicit option으로 분리합니다.
          decode할 수 없는 text는 replacement character로 조용히 손상시키지
          않습니다.
        </p>
        <p className="leading-7">
          결과에는 before/after digest, 실제 변경 byte와 line 범위를 남깁니다.
          content 전체를 tool result에 다시 넣기보다 작은 diff와 artifact
          reference를 반환해 context 비용과 secret 노출을 줄입니다.
        </p>
      </div>
    </section>
  );
}
