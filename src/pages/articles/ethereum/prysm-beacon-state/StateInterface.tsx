import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import COWDetailViz from './viz/COWDetailViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateInterface({ onCodeRef }: Props) {
  return (
    <section id="state-interface" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 인터페이스 & Copy-on-Write</h2>
      <div className="not-prose mb-8"><COWDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('state-copy', codeRefs['state-copy'])} />
          <span className="text-[10px] text-muted-foreground self-center">NewBeaconState()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 참조 카운트 기반 COW</strong> — Setter 호출 시 참조 카운트가 1보다 크면 해당 필드만 깊은 복사<br />
          포크 선택 시 다수의 상태 분기를 메모리 효율적으로 관리<br />
          Go의 슬라이스 특성을 활용해 내부 배열 공유
        </p>
      </div>
    </section>
  );
}
