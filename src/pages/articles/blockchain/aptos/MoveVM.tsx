import MoveVMViz from './viz/MoveVMViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function MoveVM({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="move-vm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Move VM</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Move — 리소스 안전성을 타입 시스템에서 보장하는 스마트 컨트랙트 언어<br />
          이중 지출, 자산 소멸 같은 버그를 컴파일 타임에 원천 차단
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('apt-move-abilities', codeRefs['apt-move-abilities'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              coin.move — Coin 구조체
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <MoveVMViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
