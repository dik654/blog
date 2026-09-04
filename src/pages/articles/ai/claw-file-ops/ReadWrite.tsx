import ReadWriteViz from "./viz/ReadWriteViz";
import ExplainedFormula from "@/components/ui/explained-formula";

const currentOperations = [
  ["read_file", "10 MB 이하 text를 line offset·limit으로 반환한다"],
  ["write_file", "10 MB 이하 content를 fs::write로 생성하거나 전체 교체한다"],
  ["edit_file", "old_string의 첫 occurrence 또는 replace_all 결과를 직접 쓴다"],
  ["workspace wrapper", "canonicalized path가 root prefix인지 먼저 확인한다"],
] as const;

export default function ReadWrite() {
  return (
    <section id="read-write" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        현재 read·write·edit 계약을 확인한 뒤 versioned update를 설계한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          파일 작업에서 <strong>snapshot</strong>은 특정 시점에 읽은 content를
          뜻합니다. Agent가 그 content를 바탕으로 edit를 만들었더라도, 적용 전에
          다른 process가 파일을 바꿀 수 있습니다. 그래서 “무엇을 읽었는가”와
          “그 version에만 변경을 적용하는가”를 따로 확인해야 합니다.
        </p>
        <p className="leading-7">
          pinned 구현의 read는 10 MB보다 큰 파일과 첫 8 KiB에 NUL byte가 있는
          파일을 거부하고, UTF-8 text를 line 단위로 자릅니다. 반면 write와 edit는
          expected version을 받지 않고 <code>fs::write</code>로 바로 갱신합니다.
          <code>replace_all=false</code>인 edit는 match가 여러 개여도 첫 occurrence를
          바꾸므로 unique-match 계약도 아닙니다.
        </p>

        <div className="not-prose my-8">
          <ReadWriteViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {currentOperations.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-lg border border-border/70 bg-card p-4"
          >
            <h4 className="break-words text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          read_file의 offset과 limit은 line 기준이다
        </h3>
        <p className="leading-7">
          구현은 전체 text를 읽고 <code>lines()</code>로 나눈 뒤 zero-based offset에서
          최대 limit개 line을 선택합니다. 결과의 <code>startLine</code>은 사람이
          읽는 one-based 번호이고, <code>numLines</code>와
          <code>totalLines</code>도 함께 반환합니다. Offset이 끝을 넘으면 오류가
          아니라 빈 range가 됩니다.
        </p>
        <p className="leading-7">
          이 계약은 UTF-8 text에는 단순하지만 binary, 매우 큰 text와 원본 newline
          보존에는 한계가 있습니다. 선택된 line을 <code>\n</code>으로 다시
          연결하므로 CRLF와 final newline을 byte-for-byte 보존하는 snapshot API로
          해석해서는 안 됩니다. Metadata 검사, binary probe와 실제 read가 서로
          다른 open이라는 점도 race 분석에 포함해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          현재 write와 edit는 overwrite 의도를 조건으로 받지 않는다
        </h3>
        <p className="leading-7">
          <code>write_file</code>은 missing parent를 만들고 기존 content를 읽을 수
          있으면 update, 아니면 create로 보고한 뒤 새 content를 씁니다. 대상이
          원래 없었어야 하는지, 읽은 version과 같은지, rename이 atomic했는지를
          요청으로 표현하지 않습니다. 반환 patch와 original content는 사후
          설명이며 적용 전 precondition이 아닙니다.
        </p>
        <p className="leading-7">
          <code>edit_file</code>은 old와 new가 같거나 old가 없을 때 실패합니다.
          그러나 기본 mode는 첫 match만 바꾸고, <code>replace_all</code>은 예상
          occurrence 수 없이 모두 바꿉니다. 따라서 동일 문구가 여러 함수에 있는
          adversarial fixture에서 원하지 않은 위치가 바뀌는지 반드시 확인해야
          합니다.
        </p>

        <ExplainedFormula
          question="Agent가 읽은 뒤 파일이 바뀌었을 때 stale edit를 어떻게 막을까?"
          idea={<>읽은 content의 digest를 expected version으로 요청에 넣고, 적용 직전 현재 content의 digest와 같을 때만 replacement를 만듭니다. 다르면 자동으로 덮어쓰지 않고 새 snapshot을 읽게 합니다.</>}
          formula={String.raw`\operatorname{apply}\iff H(C_{\mathrm{current}})=H(C_{\mathrm{expected}})`}
          annotatedFormula={String.raw`\operatorname{apply}\iff H(C_{\mathrm{current}})=\underbrace{H(C_{\mathrm{expected}})}_{\text{conditional mutation 계산}}`}
          operations={[
            { expression: String.raw`H(C_{\mathrm{expected}})`, annotation: ["conditional mutation이(가) 식의 결과에","기여하는 방식을 계산합니다.","읽은 content의 digest를 expected","version으로 요청에 넣고, 적용 직전 현재"] },
          ]}
          terms={[
            { symbol: "C_{current}", name: "current bytes", description: "변경을 적용하기 직전에 관찰한 현재 file bytes입니다." },
            { symbol: "C_{expected}", name: "expected snapshot", description: "Agent가 edit를 계산할 때 읽었던 file bytes입니다." },
            { symbol: "H", name: "version digest", description: "같은 bytes에 같은 version 값을 만드는 충돌 저항성 hash입니다." },
            { symbol: "apply", name: "conditional mutation", description: "조건이 참일 때만 temporary file과 rename 단계로 진행하는 결정입니다." },
          ]}
          assumptions={[
            "Digest 비교와 실제 replacement open 사이의 filesystem race를 handle-bound operation 또는 locking으로 막습니다.",
            "Encoding·newline normalization 전후 중 어느 bytes를 version으로 삼는지 고정합니다.",
            "한 file의 conditional replace를 여러 file transaction과 혼동하지 않습니다.",
          ]}
          interpretation="같으면 읽었던 snapshot이 아직 현재 version일 가능성을 확인한 것이고, 다르면 stale input으로 실패해야 합니다. Hash 비교만 추가해도 check-use 사이 symlink·rename race까지 자동으로 사라지는 것은 아닙니다."
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Versioned update는 아직 구현 사실이 아니라 hardening 목표다
        </h3>
        <p className="leading-7">
          개선된 API라면 create-only와 replace-existing을 나누고 edit에는 expected digest와 expected match count를 받습니다. 새
          content는 같은 directory의 temporary file에 쓴 뒤 permission·encoding을 확인하고 rename합니다. crash durability가
          필요하면 file과 parent directory의 fsync policy도 별도로 정해 둡니다.
        </p>
        <p className="leading-7">
          atomic rename은 한 file의 이름 교체를 한 순간처럼 보이게 할 뿐 여러 file 변경 전체를 transaction으로 만들지 않습니다. release test는
          concurrent writer, process crash, full disk, permission error와 symlink swap을 주입해 original 또는
          complete replacement 중 하나만 남는지 검증합니다.
        </p>
      </div>
    </section>
  );
}
