import type { CodeRef } from '@/components/code/types';
import OverviewViz from './viz/OverviewViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 Update Loop가 필요한가</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          부트스트랩에서 LightClientStore를 초기화했지만, 이것은 한 시점의 스냅샷이다.
          블록체인은 12초마다 새 블록을 생성하므로, Helios가 최신 상태를 유지하려면
          헤더를 계속 갱신해야 한다.
        </p>
        <p>
          Update Loop는 매 슬롯(12초)마다 Beacon API에서 LightClientUpdate를 폴링하고,
          검증 후 Store에 반영한다. OptimisticUpdate(12초, 최신 추적)와
          FinalityUpdate(~12.8분, 상태 증명 기준)를 병행한다.
        </p>
      </div>

      <div className="not-prose my-8">
        <OverviewViz />
      </div>
    </section>
  );
}
