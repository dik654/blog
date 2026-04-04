import GulfStreamViz from './viz/GulfStreamViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function GulfStream({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="gulf-stream" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Gulf Stream</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Gulf Stream — 멤풀 없는 TX 포워딩 프로토콜<br />
          다음 리더를 PoH 기반으로 예측 → 클라이언트가 직접 TX 전달
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sol-gulf-forward', codeRefs['sol-gulf-forward'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              forwarder.rs — forward_packets
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <GulfStreamViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
