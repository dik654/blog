import MoveSuiViz from './viz/MoveSuiViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function MoveSui({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="move-sui" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Move on Sui</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Aptos Move와 같은 언어, 객체 중심(object-centric) 모델로 확장<br />
          계정 주소 대신 고유 UID를 가진 독립 엔티티로 존재
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sui-move-object', codeRefs['sui-move-object'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              transfer.move — 객체 전송
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <MoveSuiViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
