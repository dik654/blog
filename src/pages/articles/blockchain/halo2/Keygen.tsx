import Halo2KeygenViz from '../components/Halo2KeygenViz';
import PLONKishCircuitViz from './viz/PLONKishCircuitViz';
import CodePanel from '@/components/ui/code-panel';
import { KEYGEN_VK_CODE, KEYGEN_PK_CODE } from './KeygenData';
import { vkAnnotations, pkAnnotations } from './KeygenAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Keygen({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="keygen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '키 생성 (keygen_vk / keygen_pk)'}</h2>
      <div className="not-prose mb-8"><Halo2KeygenViz /></div>
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">PLONKish 회로 구조</h3>
      <div className="not-prose mb-8"><PLONKishCircuitViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          키 생성 단계에서 회로의 고정 열, 퍼뮤테이션, 선택자를 다항식으로 컴파일합니다.
          <code>VerifyingKey</code>에는 고정 열 커밋이, <code>ProvingKey</code>에는
          도메인 다항식들(l0, l_blind, l_last)도 포함됩니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('keygen-vk', codeRefs['keygen-vk'])} />
            <span className="text-[10px] text-muted-foreground self-center">keygen_vk()</span>
            <CodeViewButton onClick={() => onCodeRef('keygen-pk', codeRefs['keygen-pk'])} />
            <span className="text-[10px] text-muted-foreground self-center">keygen_pk()</span>
          </div>
        )}
        <CodePanel title="keygen_vk (keygen.rs)" code={KEYGEN_VK_CODE} annotations={vkAnnotations} />
        <CodePanel title="keygen_pk — l0/l_blind/l_last 도메인 다항식" code={KEYGEN_PK_CODE} annotations={pkAnnotations} />
      </div>
    </section>
  );
}
