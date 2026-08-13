import type { CodeRef } from "@/components/code/types";

export default function StorageLifecycle({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="storage-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        운영에서 확인할 storage lifecycle
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          특정 상품명·가격·SLA를 architecture에 박아 두면 서비스 정책이 바뀔 때
          글 전체가 낡는다. 대신 애플리케이션이 실제로 관찰하고 복구해야 하는
          상태를 기준으로 integration을 설계한다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">성공 상태를 나눈다</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>권한 위임과 invocation 검증 완료</li>
              <li>각 shard upload receipt 확보</li>
              <li>root CID가 upload record에 연결됨</li>
              <li>gateway/IPFS retrieval로 bytes 재검증</li>
              <li>Filecoin aggregate inclusion이 별도로 확인됨</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">복구 경계를 만든다</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>retry 시 같은 content CID를 idempotency key로 활용</li>
              <li>upload와 장기 보존 상태를 같은 boolean으로 합치지 않음</li>
              <li>delegation expiry와 space quota를 별도 오류로 노출</li>
              <li>retrieval 후 CID mismatch는 즉시 무결성 실패로 처리</li>
              <li>가격·quota·endpoint는 runtime configuration으로 관리</li>
            </ul>
          </div>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          이 구조라면 provider, pricing, Filecoin aggregation 방식이 바뀌어도
          upload→receipt→retrieval→archive라는 상위 흐름은 유지된다.
        </p>
      </div>
    </section>
  );
}
