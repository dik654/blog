import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ParticipationViz from './viz/ParticipationViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ParticipationBits({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="participation-bits" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Sync Committee 512명 중 일부만 실제 서명에 참여한다.
          <br />
          <code>Bitvector&lt;512&gt;</code>의 각 비트가 참여 여부를 나타낸다.
        </p>
      </div>
      <div className="not-prose">
        <ParticipationViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-verify-filter', codeRefs['hl-verify-filter'])} />
          <span className="text-[10px] text-muted-foreground">verify.rs</span>
        </div>
      </div>
    </section>
  );
}
