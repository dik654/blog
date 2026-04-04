import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function WeakSubjectivity({ onCodeRef }: Props) {
  return (
    <section id="weak-subjectivity" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Weak Subjectivity</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('weak-subjectivity', codeRefs['weak-subjectivity'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessJustificationAndFinalization()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 체크포인트 싱크</strong> — --checkpoint-sync-url로 신뢰할 수 있는 체크포인트 지정<br />
          genesis부터 전부 검증할 필요 없이 최근 finalized부터 시작<br />
          약 58만 검증자 기준 Weak Subjectivity Period ≈ 2주
        </p>
      </div>
    </section>
  );
}
