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
          “Checkpoint cache는 root 32 bytes”라는 저장 설명은 맞을 수 있지만 bootstrap response와 runtime store에는 header,
          committee의 public keys, aggregate public key, branch와 진행 상태가 더 필요합니다. 실제 byte 수는 fork schema와 구현
          snapshot에서 측정하고 checkpoint 파일 크기를 전체 memory footprint로 일반화하지는 않습니다.
        </p>
      </div>
    </section>
  );
}
