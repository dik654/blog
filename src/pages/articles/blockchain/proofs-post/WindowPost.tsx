import { codeRefs } from './codeRefs';
import WindowPostViz from './viz/WindowPostViz';
import type { CodeRef } from '@/components/code/types';

export default function WindowPost({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="window-post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WindowPoSt: 데드라인 & 파티션</h2>
      <div className="not-prose mb-8">
        <WindowPostViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 파티션 구조</strong> — GPU가 파티션 단위로 증명 병렬 생성
          <br />
          GPU 수에 비례해 처리량 증가
        </p>
      </div>
    </section>
  );
}
