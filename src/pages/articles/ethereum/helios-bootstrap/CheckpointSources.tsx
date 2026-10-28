export default function CheckpointSources({ title }: { title: string }) {
  return (
    <section id="checkpoint-sources" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Checkpoint는 consensus RPC가 자기 응답과 함께 증명해 줄 수 없습니다. 같은 RPC가 “이 root를 믿으라”고 말한 뒤 그 root에
          맞춘 응답까지 제공하면 신뢰가 자기 자신을 증명하는 순환이 됩니다.
        </p>
        <p>
          Helios commit <code>43a8c9f3</code>은 명시한 checkpoint를 먼저 쓸 수 있습니다. 그 값이 없으면 로컬 DB의 checkpoint를 쓰고,
          두 값이 모두 없으면 network 기본값을 고릅니다. 외부 fallback은 초기 sync가 실패했을 때 별도 경로로 시도합니다.
        </p>
        <h3>고정 사례: 두 독립 경로가 같은 checkpoint를 가리킬 때</h3>
        <p>
          Mainnet이라는 network와 block root C를 신뢰 입력으로 골랐다고 합시다. Bootstrap attempt <code>b-17</code>은
          <code>network=mainnet</code>과 <code>checkpoint=C</code>를 request identity로 유지합니다. 이후 consensus endpoint가 다른 root C′의
          header를 주면 최신값처럼 보여도 C와 다르다는 이유로 거부합니다.
        </p>
        <h3>Fallback은 availability 기능이지 자동 신뢰 승격이 아닙니다</h3>
        <p>
          Helios의 external fallback은 checkpoint를 구하는 가용성 경로입니다. 그러나 그 출처의 정직성까지 bootstrap proof가 증명하지는 않습니다.
          이 글에서 protocol로 확인할 수 있는 범위는 “이미 고른 C와 응답 H가 같은가”부터입니다. C를 어떤 조직·채널에서 승인할지는
          <a href="/cs/blockchain/helios-config#persistence">설정·운영 글</a>의 책임입니다.
        </p>
      </div>
    </section>
  );
}
