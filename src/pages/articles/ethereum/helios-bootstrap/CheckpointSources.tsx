export default function CheckpointSources({ title }: { title: string }) {
  return (
    <section id="checkpoint-sources" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Checkpoint는 consensus RPC가 자기 응답과 함께 증명해 줄 수 없습니다. 사용자가 CLI·config로 넣은 root, 이전 실행에서 검증하고
          저장한 finalized root, 별도 checkpoint service의 응답은 편의성은 달라도 모두 provenance를 확인해야 하는 외부 신뢰 입력입니다.
          같은 운영 주체의 URL 세 개가 같은 root를 준다고 독립적인 세 근거가 되는 것도 아닙니다.
        </p>
        <h3>고정 사례: 두 독립 경로가 같은 checkpoint를 가리킬 때</h3>
        <p>
          Mainnet이라는 network, finalized epoch 300,000, block root C를 release config와 별도 관측 채널에서 확인했다고 합시다. Receipt에는
          <code>network=mainnet</code>, genesis validators root, epoch·root, 각 source의 이름과 확인 시각을 남깁니다. 이후 consensus endpoint가
          다른 root C′의 bootstrap을 주면 다수결로 타협하지 않고 C와 다르다는 이유로 거부합니다.
        </p>
        <h3>Fallback은 availability 기능이지 자동 신뢰 승격이 아닙니다</h3>
        <p>
          Helios README의 external fallback은 여러 community endpoint에서 자주 나타난 checkpoint를 고를 수 있지만, 공식 문서 자체도
          보안 보장을 제공하지 않는 last resort라고 경고합니다. 따라서 production hardening에서는 source independence·서명된 release
          manifest·manual approval 같은 별도 정책을 두고, fallback 결과를 protocol이 보증한 값처럼 취급하지 않습니다.
        </p>
      </div>
    </section>
  );
}
