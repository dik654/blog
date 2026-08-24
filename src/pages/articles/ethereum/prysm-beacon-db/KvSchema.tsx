import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function KvSchema({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="kv-schema" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Primary key는 identity를, secondary index는 조회 경로를 소유한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>Primary mapping</strong>은 block/state root에서 canonical SSZ
          bytes로 가며 content identity를 소유합니다.{" "}
          <strong>Secondary index</strong>는 slot·parent·validator key 같은
          query key를 primary root 집합에 연결합니다. 같은 slot에 competing
          blocks가 있을 수 있으므로 slot→root를 단일 값으로 덮어쓰면 branch를
          잃을 수 있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="Block 하나를 저장할 때 logical write 수는 어떻게 셀까요?"
        idea={
          <>
            원본 primary record 하나와 그 object를 찾게 하는 k개 secondary
            mappings를 같은 transaction에 씁니다. 실제 page write·WAL/fsync
            byte는 storage engine 상태에 따라 더 큽니다.
          </>
        }
        formula={String.raw`W_{\rm logical}=1+k`}
        terms={[
          {
            symbol: "1",
            name: "Primary record",
            description:
              "Root에서 canonical encoded object로 가는 source record입니다.",
          },
          {
            symbol: "k",
            name: "Secondary mappings",
            description:
              "Slot·parent 등 이번 schema가 유지하는 index 개수입니다.",
          },
          {
            symbol: "W_{\\rm logical}",
            name: "Logical writes",
            description:
              "한 object 저장이 갱신하는 key/value mapping 수입니다.",
          },
        ]}
        assumptions={[
          "모든 mapping은 하나의 DB write transaction에서 commit합니다.",
          "Cache write와 storage-engine internal page write는 별도로 측정합니다.",
          "Index value가 single root인지 root set인지 schema에 명시합니다.",
        ]}
        interpretation="Primary 1개와 slot·parent·canonical index 3개면 logical writes는 4개입니다. 이 식은 disk write가 정확히 네 번이거나 fsync가 네 번이라는 뜻이 아닙니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Key encoding도 ordering 계약입니다</h3>
        <p>
          Slot range scan에는 fixed-width big-endian처럼 lexicographic order가
          numeric order와 같은 key encoding이 필요합니다. Variable decimal
          string이면 10이 2보다 먼저 올 수 있습니다. Reader는 index에서 root를
          얻고 같은 read transaction의 primary bucket을 확인하며 dangling
          index를 corruption으로 분류합니다.
        </p>
        <h3>Schema는 migration 가능한 versioned artifact입니다</h3>
        <p>
          Bucket 이름·key codec·value envelope·compression·fork decoder와
          migration checkpoint를 version에 묶습니다. Startup은 existing DB의
          network/genesis와 schema compatibility를 확인한 뒤 서비스를 열고,
          unknown/newer schema를 추측해 읽지 않습니다.
        </p>
      </div>
      <div className="not-prose my-4">
        <CodeViewButton
          onClick={() => onCodeRef("kv-store", codeRefs["kv-store"])}
        />
      </div>
    </section>
  );
}
