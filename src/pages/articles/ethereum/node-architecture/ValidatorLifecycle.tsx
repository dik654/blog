import ValidatorLifecycleViz from './viz/ValidatorLifecycleViz';

export default function ValidatorLifecycle({ title }: { title?: string }) {
  return (
    <section id="validator-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '검증자 생명주기'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          PoS 참여는 32 ETH를 예치해 "담보"를 거는 것에서 시작합니다.<br />
          이더리움이 이 담보를 기반으로 정직성을 강제하는 방식, 그리고 예치부터 탈퇴까지
          각 단계에 제약이 생긴 이유를 살펴봅니다.
        </p>
      </div>
      <ValidatorLifecycleViz />
    </section>
  );
}
