import type { CodeRef } from "@/components/code/types";

export default function BodiesStage({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="bodies-stage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        BodiesStage는 payload 목록을 header commitment에 다시 연결한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Body의 transaction·ommer·withdrawal/request 목록은 block hash만 보고
          신뢰하지 않습니다. 활성 fork에 해당 field가 존재하는지와 list bounds를
          확인하고, transaction root 등 header가 약속한 commitment를 다시
          계산합니다. Header checkpoint보다 높은 body는 검증할 header가 없으므로
          진행할 수 없습니다.
        </p>
        <p>
          같은 block number에 competing bodies가 있을 수 있어 number만
          identity로 쓰지 않고 header hash와 body root를 함께 기록합니다. Root
          mismatch, missing body와 unsupported future field는 서로 다른
          failure로 분류하며 부분 목록을 complete body로 저장하지 않습니다.
        </p>
      </div>
    </section>
  );
}
