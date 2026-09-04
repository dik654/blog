import TotalOrderViz from "./viz/TotalOrderViz";

export default function TotalOrder() {
  return (
    <section id="total-order" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">도착 순서와 delivery 순서는 다르다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Network receive buffer에는 A가 먼저, B가 나중에 도착할 수 있고 다른
          replica에는 반대로 도착할 수 있습니다. Total-order broadcast는 raw
          arrival을 그대로 apply하지 않고 protocol evidence가 정한 delivery order를
          제공합니다. 한 correct process가 A 뒤 B로 deliver했다면 둘을 deliver한
          다른 correct process도 A 뒤 B로 봅니다.
        </p>
      </div>
      <TotalOrderViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>네 성질과 경계</h3>
        <p>
          Agreement와 total order가 replica 사이 prefix를 맞추고 integrity는 duplicate·fabricated delivery를 막습니다.
          Validity는 correct sender의 message가 명시한 fault·timing 조건에서 결국 deliver된다는 progress 성질입니다. “모든 message를
          즉시 전 세계에 전달”하는 SLA가 아닙니다.
        </p>
        <p>
          Atomic broadcast와 consensus는 적절한 model에서 서로 reduce할 수 있지만 구현에서 batching·leader
          election·reconfiguration·storage durability가 사라지는 것은 아닙니다. Log index는 결정 순서를 나타내고 wall-clock
          timestamp와 같지 않습니다.
        </p>
      </div>
    </section>
  );
}
