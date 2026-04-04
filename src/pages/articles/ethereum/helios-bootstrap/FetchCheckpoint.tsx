import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import FetchViz from './viz/FetchViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function FetchCheckpoint({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="fetch-checkpoint" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          체크포인트 블록 루트를 기반으로 Beacon API에 부트스트랩 데이터를 요청한다.
          응답의 committee_branch를 Merkle 검증하고,
          성공하면 LightClientStore를 초기화한다.
        </p>
      </div>

      <div className="not-prose">
        <FetchViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-fetch', codeRefs['hl-fetch'])} />
          <span className="text-[10px] text-muted-foreground">bootstrap.rs — fetch_bootstrap()</span>
        </div>
        <div className="flex items-center gap-2 mt-1 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-init', codeRefs['hl-init'])} />
          <span className="text-[10px] text-muted-foreground">bootstrap.rs — init_store()</span>
        </div>
      </div>
    </section>
  );
}
