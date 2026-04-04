import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BlockStateOps({ onCodeRef }: Props) {
  return (
    <section id="block-state-ops" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 & 상태 CRUD</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">SaveBlock</h3>
        <p>
          블록의 <code>HashTreeRoot()</code>를 키로, SSZ 바이트를 값으로 저장한다.<br />
          슬롯→루트 인덱스도 함께 기록해 슬롯 기반 조회를 지원한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('save-block', codeRefs['save-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">SaveBlock()</span>
          <CodeViewButton onClick={() => onCodeRef('get-block', codeRefs['get-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">Block()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">SaveState</h3>
        <p>
          상태는 블록보다 훨씬 크다 (수백 MB).<br />
          <strong>에폭 경계</strong>에서만 상태를 저장하고, 중간 슬롯은 StateSummary로 대체한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('save-state', codeRefs['save-state'])} />
          <span className="text-[10px] text-muted-foreground self-center">SaveState()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 에폭 경계 저장 전략</strong> — 매 슬롯 저장 대비 디스크 사용량 1/32<br />
          중간 슬롯 상태가 필요하면 가장 가까운 에폭 경계 상태에서 Replay<br />
          최대 31슬롯(~6.2분) 재생으로 트레이드오프
        </p>
      </div>
    </section>
  );
}
