import type { CodeRef } from "@/components/code/types";

export default function HeadersStage({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="headers-stage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        HeadersStage는 parent linkage와 fork rule을 먼저 고정한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Header는 body보다 작아 긴 chain 후보를 비교하기 쉽지만 download 성공이 validity는 아닙니다. Number가 연속이고 parent hash가 직전
          header를 가리키는지, timestamp·gas limit·base fee·difficulty/PoS field가 활성 chain spec과 맞는지를 순서대로 검사합니다.
        </p>
        <p>
          Block 100 header를 parent로 검증한 101…163만 commit하고 checkpoint를
          163으로 옮깁니다. Missing parent나 fork-boundary field 오류가 있으면
          offending hash와 expected parent/fork를 receipt에 남기고 뒤 header를
          valid range로 표시하지 않습니다.
        </p>
      </div>
    </section>
  );
}
