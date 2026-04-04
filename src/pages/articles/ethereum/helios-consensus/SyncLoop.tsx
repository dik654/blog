import type { CodeRef } from '@/components/code/types';
import SyncLoopViz from './viz/SyncLoopViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function SyncLoop({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="sync-loop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          부트스트랩이 Store를 초기화하면 sync loop가 시작된다.
          이 루프가 Helios의 심장 — 12초마다 새 Update를 받아 검증하고 적용한다.
        </p>
      </div>

      <div className="not-prose my-8">
        <SyncLoopViz />
      </div>
    </section>
  );
}
