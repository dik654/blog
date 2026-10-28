import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefsReal } from "./codeRefsReal";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function CoreTypes({ onCodeRef }: Props) {
  return (
    <section id="json-decode" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">먼저 HTTP JSON을 Rust 타입으로 읽습니다</h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>get_updates</code>는 Beacon API URL을 만들고 응답 body를 byte
          배열로 받습니다. 그러나 다음 호출은 SSZ decoder가 아니라
          <code>serde_json::from_slice</code>입니다. 성공하면 응답의
          <code>data</code>가 <code>Update&lt;S&gt;</code>로 들어옵니다.
        </p>
        <p>
          <code>Update</code>는 JSON에 별도 fork 이름을 요구하지 않는
          <code>untagged</code> enum입니다. Serde는 field와 배열 길이가 맞는
          variant를 찾습니다. Base는 next committee branch 5개와 finality
          branch 6개를 요구하고, Electra는 각각 6개와 7개를 요구합니다.
          따라서 U1422를 Base 모양으로 읽으려 하면 구조 단계에서 실패합니다.
        </p>
      </div>

      <div className="not-prose mt-5 flex flex-wrap gap-3">
        <CodeViewButton
          label="HTTP JSON decode 원문"
          onClick={() => onCodeRef("helios-json-decode", codeRefsReal["helios-json-decode"])}
        />
        <CodeViewButton
          label="Base·Electra 타입 원문"
          onClick={() => onCodeRef("helios-fork-types", codeRefsReal["helios-fork-types"])}
        />
      </div>

      <div className="mt-8 grid gap-px bg-border p-px text-sm sm:grid-cols-3">
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">전송 표현</p>
          <p className="mt-2 font-bold">HTTP response body</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">JSON bytes · status · error envelope</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">구조 선택</p>
          <p className="mt-2 font-bold">serde untagged variant</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Field 존재와 FixedVector 길이</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">아직 확인하지 않은 것</p>
          <p className="mt-2 font-bold">Merkle root · BLS signature</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Decode 성공과 proof 성공은 다른 판정</p>
        </div>
      </div>
    </section>
  );
}
