import CodePanel from '@/components/ui/code-panel';
import BlockstoreViz from './viz/BlockstoreViz';
import { GC_CODE, GC_ANNOTATIONS } from './PinningGCData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function PinningGC({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="pinning-gc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pinning & GC</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Pinning</strong>은 특정 블록이 GC(Garbage Collection)에 의해
          삭제되지 않도록 보호하는 메커니즘입니다.<br />
          Pin되지 않은 블록은 <strong>Mark-and-Sweep GC</strong>로 정리됩니다.
        </p>
        <h3>Pin 타입</h3>
        <ul>
          <li><strong>Recursive Pin</strong> -- 루트 CID와 모든 하위 블록을 보호</li>
          <li><strong>Direct Pin</strong> -- 단일 블록만 보호 (하위 불포함)</li>
          <li><strong>Indirect Pin</strong> -- 재귀 핀의 하위로 자동 보호</li>
        </ul>
        <h3>Blockstore 계층 구조</h3>
        <p>
          Kubo의 블록 저장소는 6계층으로 구성됩니다.<br />
          캐싱(Two-Queue), 검증(해시 무결성), GC(락 기반 동시성 제어)를 각각 담당합니다.<br />
          실제 저장은 Badger, LevelDB, Flatfs 중 선택 가능합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('kubo-gc-main', codeRefs['kubo-gc-main'])} />
            <span className="text-[10px] text-muted-foreground self-center">GC Mark-and-Sweep</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-colored-set', codeRefs['kubo-colored-set'])} />
            <span className="text-[10px] text-muted-foreground self-center">ColoredSet (마킹)</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-pin-add', codeRefs['kubo-pin-add'])} />
            <span className="text-[10px] text-muted-foreground self-center">Pin.Add API</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-storage-ctor', codeRefs['kubo-storage-ctor'])} />
            <span className="text-[10px] text-muted-foreground self-center">Blockstore 생성</span>
          </div>
        )}
        <CodePanel title="GC Mark-and-Sweep" code={GC_CODE} annotations={GC_ANNOTATIONS} />
      </div>
      <div className="mt-8"><BlockstoreViz /></div>
    </section>
  );
}
