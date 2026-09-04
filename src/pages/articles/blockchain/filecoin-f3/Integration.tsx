import IntegrationDetailViz from "./viz/IntegrationDetailViz";
import type { CodeRef } from "@/components/code/types";

export default function Integration({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">
        EC chain을 certificate chain에 연결한다
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        EC와 F3는 역할이 다르지만 완전히 독립하지는 않는다. F3 input은 EC chain과 power table에서 온다. node의 fork choice와 외부 consumer는
        F3 certificate가 가리키는 finalized prefix를 기준으로 삼는다.
      </p>
      <div className="not-prose mb-8">
        <IntegrationDetailViz onOpenCode={onCodeRef} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Node lifecycle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>chain exchange가 새 EC tipset과 reorg를 전달</li>
              <li>F3 EC backend가 eligible chain proposal을 구성</li>
              <li>manifest가 instance timing과 committee/power 문맥을 제공</li>
              <li>GPBFT가 vote를 수집해 decision certificate 생성</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <ol
              className="text-sm space-y-1 text-muted-foreground list-decimal list-inside"
              start={5}
            >
              <li>certificate store가 instance와 base/decision chain을 저장</li>
              <li>
                node가 latest finalized tipset을 API와 내부 chain logic에 노출
              </li>
              <li>late joiner가 certificate chain으로 finality를 catch up</li>
              <li>bridge/indexer가 certificate와 power context를 독립 검증</li>
            </ol>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          운영에서 따로 관찰할 상태
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">EC head</h4>
            <p className="text-sm text-muted-foreground">
              가장 최신이지만 reorg될 수 있는 chain tip
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Latest certificate</h4>
            <p className="text-sm text-muted-foreground">
              가장 최근에 검증된 F3 instance와 finalized chain prefix
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Participation health</h4>
            <p className="text-sm text-muted-foreground">
              online power, round progression, manifest availability,
              certificate lag
            </p>
          </div>
        </div>

        <p className="leading-7">
          F3가 일시적으로 전진하지 않아도 EC block production은 계속될 수 있지만{" "}
          <strong>새 F3 finality가 생긴 것은 아니다</strong>. consumer는 이를
          “EC로 자동 finality fallback”으로 처리하지 말고 certificate lag를
          명시적으로 노출해야 한다.
        </p>
      </div>
    </section>
  );
}
