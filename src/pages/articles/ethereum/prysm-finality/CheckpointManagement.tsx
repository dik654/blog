import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function CheckpointManagement({ onCodeRef }: Props) {
  return (
    <section id="checkpoint-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인트 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('update-justified', codeRefs['update-justified'])} />
          <span className="text-[10px] text-muted-foreground self-center">UpdateJustifiedCheckpoint()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Checkpoint = Epoch + Root</strong> — 에폭 경계의 첫 슬롯 블록을 가리킴<br />
          전체 활성 밸런스의 2/3 이상이 같은 타겟에 투표하면 justified<br />
          같은 에폭에서 두 번 투표하면 슬래싱 대상 — 이중 투표 방지
        </p>
      </div>
    </section>
  );
}
