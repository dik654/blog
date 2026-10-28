export default function BootstrapResponse({ title }: { title: string }) {
  return (
    <section id="bootstrap-response" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          응답의 세 부분은 각각 다른 질문에 답합니다. <code>header</code>는 checkpoint root와 state root를 제공하고,
          <code>current_sync_committee</code>는 이후 update의 public-key 집합이며, <code>current_sync_committee_branch</code>는 그 위원회가
          header의 state에 실제로 포함됐다는 경로입니다. 하나라도 빠지면 다음 서명을 검증할 신뢰 사슬이 이어지지 않습니다.
        </p>
        <p>
          Checkpoint cache에 root 32 bytes만 넣는 구현은 있을 수 있습니다. 그러나 bootstrap response와 runtime
          store는 다른 정보도 유지해야 합니다.
        </p>
        <p>
          Header와 committee public keys, aggregate public key, branch, 진행 상태가 그 정보입니다. 실제 byte 수는 fork
          schema와 고정한 구현 snapshot에서 측정해야 합니다. Checkpoint 파일 크기를 client의 전체 memory footprint로 볼 수는
          없습니다.
        </p>
      </div>
    </section>
  );
}
