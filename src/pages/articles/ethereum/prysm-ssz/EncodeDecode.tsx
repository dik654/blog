import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function EncodeDecode({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="encode-decode" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Offset은 길이를 적는 칸이 아니라 dynamic value가 시작되는 위치다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Basic integer는 정해진 byte 수의 little-endian으로, 고정 길이 vector와
          container는 field encoding을 순서대로 붙입니다. 가변 field가 있는
          container는 앞의 fixed part에 4-byte offset을 두고 실제 값은 뒤의
          variable part에 놓습니다. Decoder는 schema와 연속된 offset의 차이로 각
          field 범위를 알아냅니다.
        </p>
      </div>

      <ExplainedFormula
        question="{a:uint64, b:List[uint64,4], c:uint32}에서 b의 첫 byte는 어디에 놓일까요?"
        idea={
          <>
            Fixed part에는 a의 8 bytes, b의 offset 4 bytes, c의 4 bytes가
            놓입니다. 따라서 b는 fixed part가 끝나는 16에서 시작합니다.
          </>
        }
        formula={String.raw`o_b=8+4+4=16\ \mathrm{B}`}
        annotatedFormula={String.raw`o_b=\underbrace{8+4+4=16\ \mathrm{B}}_{\text{b offset 계산}}`}
        operations={[
          { expression: String.raw`8+4+4=16\ \mathrm{B}`, annotation: ["b offset이(가) 식의 결과에 기여하는 방식을","계산합니다.","Fixed part에는 a의 8 bytes, b의 offset","4 bytes, c의 4 bytes가 놓입니다."] },
        ]}
        terms={[
          {
            symbol: "o_b",
            name: "b offset",
            description:
              "Container 시작에서 b의 serialized data 첫 byte까지 거리입니다.",
          },
          {
            symbol: "8",
            name: "uint64 size",
            description: "a가 차지하는 고정 8 bytes입니다.",
          },
          {
            symbol: "4+4",
            name: "offset와 uint32",
            description: "b pointer와 c가 fixed part에 차지하는 크기입니다.",
          },
        ]}
        assumptions={[
          "Schema와 field order가 송신자·수신자에게 같습니다.",
          "Offset은 4-byte unsigned little-endian이며 container 시작 기준입니다.",
          "List 길이는 선언한 limit 4를 넘지 않습니다.",
        ]}
        interpretation="a=1, b=[10,20], c=3이면 fixed part 16 bytes 뒤에 b의 16 bytes가 이어져 총 32 bytes입니다. Offset 16만으로 b의 element count가 증명되지는 않으며 schema 크기와 다음 offset·payload end를 함께 검사합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Decoder는 allocation 전에 구조를 검증합니다</h3>
        <p>
          첫 dynamic offset은 fixed part보다 작을 수 없고, offset은 field
          순서대로 감소하지 않아야 하며 payload 끝을 넘으면 안 됩니다.{" "}
          <code>List[uint64,4]</code>의 byte 길이는 8의 배수이면서 최대 32
          bytes여야 합니다. 예를 들어 offset이 40인데 payload가 32 bytes면 즉시
          reject하고, 큰 길이를 믿고 먼저 allocation하지 않습니다. 이 순서가
          malformed message를 memory exhaustion으로 바꾸지 않는 fail-closed
          경계입니다.
        </p>
        <p>
          Fixed-size container는 offset table이 없으므로 원하는 field 위치를 schema에서 바로 계산할 수 있습니다. Dynamic container도
          offset만 읽어 field slice를 찾을 수 있지만 slice를 찾았다는 사실과 nested value가 canonical이라는 사실은 다릅니다. Nested
          offsets·bitlist termination bit·boolean 0/1과 trailing bytes까지 재귀적으로 검사해야 합니다.
        </p>
        <h3>구현을 읽을 때 남길 receipt</h3>
        <p>
          Type name·fork, input byte length, computed min/max bound, first/last
          offset, allocation limit, decode result와 reject reason을 남깁니다.
          같은 fixture를 공식 SSZ test vector와 base/candidate binary에 넣어
          decoded value와 re-encoded bytes가 일치하는지 검사한 뒤 성능을
          비교합니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        {codeRefs["ssz-encode"] && (
          <CodeViewButton
            onClick={() => onCodeRef("ssz-encode", codeRefs["ssz-encode"])}
          />
        )}
        {codeRefs["ssz-decode"] && (
          <CodeViewButton
            onClick={() => onCodeRef("ssz-decode", codeRefs["ssz-decode"])}
          />
        )}
      </div>
    </section>
  );
}
