import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import StoreInitViz from './viz/StoreInitViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StoreInit({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="store-init" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Merkle 검증을 통과하면 <code>LightClientStore</code>를 초기화한다.
          <br />
          이 Store가 이후 모든 Update의 기준점이 된다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth의 StateDB는 수백 GB의 상태 트라이다.
          <br />
          Helios의 Store는 헤더 2개 + 위원회 1개 — 수십 KB에 불과하다.
        </p>
      </div>
      <div className="not-prose">
        <StoreInitViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-init', codeRefs['hl-init'])} />
          <span className="text-[10px] text-muted-foreground">bootstrap.rs</span>
        </div>
      </div>
    </section>
  );
}
