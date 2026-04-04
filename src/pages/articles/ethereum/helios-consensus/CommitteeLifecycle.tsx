import type { CodeRef } from '@/components/code/types';
import CommitteeViz from './viz/CommitteeViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function CommitteeLifecycle({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="committee-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sync Committee는 영원하지 않다. 256 에폭(~27시간)마다 교체된다.<br />
          period = slot / 8192. 경계를 넘으면 current ← next, next ← None.
        </p>
      </div>

      {/* Viz: 타임라인, 핸드오프 과정, 실패 케이스 */}
      <div className="not-prose my-8">
        <CommitteeViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 왜 한 period 앞서 받는가</strong><br />
          경계에서 즉시 교체하려면 교체 전에 새 위원회를 알아야 한다.
          한 period 미리 받아서 Merkle 검증해둔다 → 경계에서 지연 없이 전환.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Reth 비교</strong><br />
          Reth는 BeaconState에서 직접 읽으므로 "미리 받기"가 불필요.
          Helios는 Update 메시지에 의존하므로 한 period 미리 받아야 한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 핸드오프 실패 시</strong><br />
          next_sync_committee 없이 period 경계를 넘으면 서명 검증 불가 → 재부트스트랩 필요.
          정상 환경에서는 매 12초 폴링하므로 실패는 드물다.
        </p>
      </div>
    </section>
  );
}
