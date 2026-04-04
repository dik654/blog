import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ProviderTraitViz from './viz/ProviderTraitViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProviderTrait({ onCodeRef }: Props) {
  return (
    <section id="provider-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Provider trait 조합 패턴</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>Provider</code> trait은 3개 async 메서드로 추상화된다.
          <br />
          <code>get_balance</code>, <code>get_nonce</code>, <code>call</code> — 구현체만 교체하면 된다.
        </p>
        <p className="leading-7">
          <code>KohakuProvider</code>는 <code>HeliosClient</code> + <code>ORAMProxy</code> + <code>DandelionRouter</code>를 조합한다.
          <br />
          테스트 시 MockProvider를 주입하면 네트워크 없이 단위 테스트가 가능하다.
        </p>
      </div>
      <div className="not-prose">
        <ProviderTraitViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('kh-provider', codeRefs['kh-provider'])} />
          <span className="text-[10px] text-muted-foreground">provider.rs</span>
        </div>
      </div>
    </section>
  );
}
